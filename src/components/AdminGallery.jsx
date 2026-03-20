import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Trash2, Loader2, LogOut, RefreshCw, Clock3 } from "lucide-react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AdminContext } from "../context/AdminContext";
import { sagaTimelineDefault } from "../data/sagaTimeline";

const formatUploadedDate = (createdAt) => {
  if (!createdAt?.toDate) {
    return "Just now";
  }
  return createdAt.toDate().toLocaleString();
};

const AdminGallery = () => {
  const navigate = useNavigate();
  const { isAdmin, logoutAdmin, adminLoading } = useContext(AdminContext);
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [timelineItems, setTimelineItems] = useState(sagaTimelineDefault);
  const [timelineLoading, setTimelineLoading] = useState(false);
  const [timelineSavingId, setTimelineSavingId] = useState("");
  const [timelineError, setTimelineError] = useState("");
  const [timelineSuccess, setTimelineSuccess] = useState("");

  // Redirect if not admin
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchImages();
      fetchSagaTimeline();
    }
  }, [isAdmin]);

  const fetchSagaTimeline = async () => {
    setTimelineLoading(true);
    setTimelineError("");

    try {
      const snapshot = await getDocs(collection(db, "sagaTimeline"));
      const overrides = snapshot.docs.reduce((acc, currentDoc) => {
        acc[currentDoc.id] = currentDoc.data();
        return acc;
      }, {});

      const merged = sagaTimelineDefault.map((item) => ({
        ...item,
        isOver:
          typeof overrides[item.id]?.isOver === "boolean"
            ? overrides[item.id].isOver
            : item.isOver,
      }));

      setTimelineItems(merged);
    } catch (error) {
      console.error("Error fetching saga timeline:", error);
      setTimelineError(
        "Could not load timeline controls. Check Firestore rules for sagaTimeline.",
      );
    } finally {
      setTimelineLoading(false);
    }
  };

  const fetchImages = async () => {
    setIsLoading(true);
    setDeleteError("");

    try {
      const imagesRef = collection(db, "images");
      const imagesQuery = query(imagesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(imagesQuery);

      const nextImages = snapshot.docs.map((doc) => ({
        id: doc.id,
        imageUrl: doc.data().imageUrl,
        fileName: doc.data().fileName,
        userName: doc.data().userName,
        createdAt: doc.data().createdAt,
      }));

      setImages(nextImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setDeleteError("Failed to load gallery");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteImage = async (imageId) => {
    setDeleting(imageId);
    setDeleteError("");
    setDeleteSuccess("");

    try {
      await deleteDoc(doc(db, "images", imageId));
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      setDeleteSuccess("Image deleted successfully");
      setTimeout(() => setDeleteSuccess(""), 3000);
    } catch (error) {
      console.error("Error deleting image:", error);
      setDeleteError("Failed to delete image. Check permissions in Firestore.");
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/");
  };

  const saveTimelineUpdate = async (milestoneId, data) => {
    setTimelineSavingId(milestoneId);
    setTimelineError("");
    setTimelineSuccess("");

    try {
      await setDoc(doc(db, "sagaTimeline", milestoneId), data, { merge: true });
      setTimelineItems((prev) =>
        prev.map((item) =>
          item.id === milestoneId ? { ...item, ...data } : item,
        ),
      );
      setTimelineSuccess("Timeline updated.");
      setTimeout(() => setTimelineSuccess(""), 1500);
    } catch (error) {
      console.error("Error saving timeline update:", error);
      setTimelineError(
        "Could not save timeline change. Check Firestore write rules for sagaTimeline.",
      );
    } finally {
      setTimelineSavingId("");
    }
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
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-8 w-80 h-80 rounded-full bg-goku-orange/25 blur-3xl" />
        <div className="absolute top-1/3 -right-8 w-72 h-72 rounded-full bg-goku-yellow/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl sm:text-5xl font-extrabold  from-white via-goku-orange to-goku-yellow ">
              Admin Dashboard
            </h1>
            <p className="text-white/60 mt-2">Manage gallery images</p>
          </motion.div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                fetchImages();
                fetchSagaTimeline();
              }}
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

        {deleteSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-xl bg-green-500/20 border border-green-500/50 text-green-200 text-sm"
          >
            ✓ {deleteSuccess}
          </motion.div>
        )}

        {deleteError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm"
          >
            ✗ {deleteError}
          </motion.div>
        )}

        <div className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Gallery Images</h2>
            <span className="text-sm text-white/60">
              {images.length} images
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center min-h-[300px]">
              <Loader2 className="w-10 h-10 animate-spin text-goku-orange" />
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-white/60">No images in gallery</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.05 } },
              }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {images.map((image) => (
                <motion.div
                  key={image.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="group relative overflow-hidden rounded-xl border border-white/15 bg-white/5 hover:border-goku-orange/50 transition"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.fileName}
                    className="w-full h-40 object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />

                  <div className="absolute inset-0 flex flex-col justify-between p-3 opacity-0 group-hover:opacity-100 transition">
                    <div>
                      <p className="text-xs font-medium text-goku-yellow truncate">
                        {image.userName || "Anonymous"}
                      </p>
                      <p className="text-xs text-white/70 truncate">
                        {image.fileName}
                      </p>
                    </div>

                    <button
                      onClick={() => deleteImage(image.id)}
                      disabled={deleting === image.id}
                      className="self-end px-3 py-1.5 rounded-lg bg-red-500/80 hover:bg-red-600 disabled:opacity-60 flex items-center gap-1.5 text-xs font-medium transition"
                    >
                      {deleting === image.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Delete
                    </button>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-xs text-white/60 text-center group-hover:hidden">
                    <div className="inline-flex items-center gap-1">
                      <Clock3 className="w-3 h-3" />
                      {formatUploadedDate(image.createdAt)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">The Saga Timeline Controls</h2>
            <span className="text-sm text-white/60">
              {timelineItems.length} events
            </span>
          </div>

          {timelineSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-green-500/20 border border-green-500/50 text-green-200 text-sm">
              {timelineSuccess}
            </div>
          )}

          {timelineError && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
              {timelineError}
            </div>
          )}

          {timelineLoading ? (
            <div className="min-h-[140px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-goku-orange" />
            </div>
          ) : (
            <div className="space-y-4">
              {timelineItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/15 bg-goku-dark/50 p-4"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <p className="text-xs text-white/60">
                          {item.day} • {item.time}
                        </p>
                        <p className="text-base font-semibold text-white">
                          {item.title}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          saveTimelineUpdate(item.id, { isOver: !item.isOver })
                        }
                        disabled={timelineSavingId === item.id}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold border transition ${
                          item.isOver
                            ? "bg-green-500/20 border-green-500/60 text-green-200"
                            : "bg-white/5 border-white/20 text-white/80"
                        } disabled:opacity-60`}
                      >
                        {timelineSavingId === item.id
                          ? "Saving..."
                          : item.isOver
                            ? "Mark Upcoming"
                            : "Mark Over"}
                      </button>
                    </div>

                    <p className="text-xs text-white/60">
                      Toggle event status between Over and Upcoming.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 text-sm text-white/60">
          <p>
            Hover over images to see delete option. All deletions are permanent.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminGallery;
