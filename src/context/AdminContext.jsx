import React, { createContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const AdminContext = createContext();

const normalizeEmail = (email) => email.trim().toLowerCase();

const getAdminLoginErrorMessage = (error) => {
  const code = error?.code || "";

  if (code === "auth/invalid-email") {
    return "Invalid email format.";
  }

  if (
    code === "auth/invalid-credential" ||
    code === "auth/user-not-found" ||
    code === "auth/wrong-password"
  ) {
    return "Invalid email or password.";
  }

  if (code === "auth/too-many-requests") {
    return "Too many attempts. Try again later.";
  }

  if (code === "permission-denied") {
    return "Firestore denied access to admins list. Update Firestore rules for admins collection.";
  }

  return error?.message || "Admin login failed. Check Firebase configuration.";
};

const isEmailAuthorizedForAdmin = async (email) => {
  const adminEmail = normalizeEmail(email);

  // Expected structure:
  // collection: admins
  // document id: admin email in lowercase
  // fields (optional): { enabled: true }
  const adminDocRef = doc(db, "admins", adminEmail);
  const adminDocSnapshot = await getDoc(adminDocRef);

  if (!adminDocSnapshot.exists()) {
    return false;
  }

  const adminData = adminDocSnapshot.data();
  return adminData?.enabled !== false;
};

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user?.email) {
        setIsAdmin(false);
        setAdminLoading(false);
        return;
      }

      try {
        const allowed = await isEmailAuthorizedForAdmin(user.email);
        if (!allowed) {
          await signOut(auth);
          setIsAdmin(false);
          setAdminLoading(false);
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error("Admin authorization check failed:", error);
        setIsAdmin(false);
      } finally {
        setAdminLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginAdmin = async (email, password) => {
    if (!email?.trim() || !password?.trim()) {
      return {
        success: false,
        message: "Email and password are required.",
      };
    }

    const normalizedEmail = normalizeEmail(email);

    let userCredential;

    try {
      userCredential = await signInWithEmailAndPassword(
        auth,
        normalizedEmail,
        password,
      );
    } catch (error) {
      console.error("Admin Firebase auth failed:", error);
      return {
        success: false,
        message: getAdminLoginErrorMessage(error),
      };
    }

    try {
      const allowed = await isEmailAuthorizedForAdmin(
        userCredential.user.email || normalizedEmail,
      );

      if (!allowed) {
        await signOut(auth);
        setIsAdmin(false);
        return {
          success: false,
          message: "This email is not allowed to access admin dashboard.",
        };
      }

      setIsAdmin(true);
      return { success: true };
    } catch (error) {
      console.error("Admin authorization check failed:", error);
      await signOut(auth);
      setIsAdmin(false);
      return {
        success: false,
        message: getAdminLoginErrorMessage(error),
      };
    }
  };

  const logoutAdmin = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
    } catch (error) {
      console.error("Admin logout failed:", error);
    }
  };

  return (
    <AdminContext.Provider
      value={{ isAdmin, adminLoading, loginAdmin, logoutAdmin }}
    >
      {children}
    </AdminContext.Provider>
  );
};
