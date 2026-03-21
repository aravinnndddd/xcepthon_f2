import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, LogOut, RefreshCw, ArrowLeft, ExternalLink, FileText } from "lucide-react";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { AdminContext } from "../context/AdminContext";
import { PROBLEM_STATEMENTS } from "../data/problemStatements";

const AdminSubmissions = () => {
  const navigate = useNavigate();
  const { isAdmin, logoutAdmin, adminLoading } = useContext(AdminContext);
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchSubmissions();
    }
  }, [isAdmin]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    setError("");

    try {
      const snapshot = await getDocs(collection(db, "teamAbstracts"));
      const nextSubmissions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Sort by team name
      nextSubmissions.sort((a, b) =>
        (a.teamName || "").localeCompare(b.teamName || "")
      );

      setSubmissions(nextSubmissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setError("Failed to load submissions. Check Firestore rules.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/");
  };

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-goku-dark text-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-goku-orange" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-goku-dark text-white relative overflow-hidden pt-28 pb-20">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-8 w-80 h-80 rounded-full bg-goku-orange/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-goku-indigo/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-2">
              <Link
                to="/admin/gallery"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition text-white/60 hover:text-white"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                Team Submissions
              </h1>
            </div>
            <p className="text-white/60 ml-12">Review abstracts and drive links</p>
          </motion.div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchSubmissions}
              disabled={isLoading}
              className="p-3 rounded-lg bg-white/10 hover:bg-white/20 transition border border-white/20"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-3 rounded-lg bg-goku-orange/20 hover:bg-goku-orange/30 border border-goku-orange/50 flex items-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
          >
            ✗ {error}
          </motion.div>
        )}

        <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/10 uppercase text-[10px] tracking-widest text-white/60">
                  <th className="px-6 py-4 font-semibold">Team Name</th>
                  <th className="px-6 py-4 font-semibold">Problem Statement</th>

                  <th className="px-6 py-4 font-semibold">Drive Link</th>
                  <th className="px-6 py-4 font-semibold">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-goku-orange" />
                    </td>
                  </tr>
                ) : submissions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-20 text-center text-white/40 font-medium">
                      No submissions found yet.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => {
                    const problem = PROBLEM_STATEMENTS[sub.problemId] || { title: "Unknown" };
                    return (
                      <motion.tr
                        key={sub.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-white/5 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="font-bold text-white group-hover:text-goku-yellow transition-colors">
                            {sub.teamName}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-medium">{problem.title}</span>
                            <span className="text-[10px] text-white/40 uppercase">{problem.stream}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {sub.driveLink ? (
                            <a
                              href={sub.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-goku-orange text-xs font-bold transition-all"
                            >
                              View Drive
                              <ExternalLink size={12} />
                            </a>
                          ) : (
                            <span className="text-xs text-white/30 italic">Not added</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-xs text-white/40 font-mono">
                            {sub.updatedAt?.toDate ? sub.updatedAt.toDate().toLocaleString() : "Recently"}
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSubmissions;
