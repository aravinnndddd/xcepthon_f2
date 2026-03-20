import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Clock3,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Sparkles,
  UploadCloud,
  User,
  X,
} from "lucide-react";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const acceptedMime = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/jpg",
];

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const uploadToCloudinary = (file, onProgress) => {
  return new Promise((resolve, reject) => {
    if (!cloudName || !uploadPreset) {
      reject(
        new Error(
          "Missing Cloudinary config. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in .env",
        ),
      );
      return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "images");

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = (event.loaded / event.total) * 100;
        onProgress(Math.round(progress));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const response = JSON.parse(xhr.responseText);
        resolve(response);
      } else {
        reject(new Error(`Cloudinary upload failed: ${xhr.responseText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Cloudinary network error"));
    };

    xhr.send(formData);
  });
};

const formatUploadedDate = (createdAt) => {
  if (!createdAt?.toDate) {
    return "Just now";
  }
  return createdAt.toDate().toLocaleString();
};

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [userName, setUserName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const canUpload = useMemo(() => {
    return !!selectedFile && !!userName.trim() && !isUploading;
  }, [selectedFile, userName, isUploading]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoadingGallery(true);
    setErrorMessage("");

    try {
      const imagesRef = collection(db, "images");
      const imagesQuery = query(imagesRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(imagesQuery);

      const nextImages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          imageUrl: data.imageUrl,
          fileName: data.fileName,
          userName: data.userName,
          createdAt: data.createdAt,
        };
      });

      setImages(nextImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setErrorMessage(
        "Unable to load gallery. Check Firestore rules for collection: images",
      );
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const validateAndSetFile = (file) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/") || !acceptedMime.includes(file.type)) {
      setErrorMessage("Only image files are allowed (jpg, png, webp, gif).");
      return;
    }

    setErrorMessage("");
    setSelectedFile(file);
  };

  const uploadImage = async () => {
    if (!selectedFile || !userName.trim()) {
      setErrorMessage("Please choose an image and enter your name.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage("");

    try {
      const cloudinaryResult = await uploadToCloudinary(
        selectedFile,
        (progress) => {
          setUploadProgress(progress);
        },
      );
      const imageUrl = cloudinaryResult.secure_url;

      await addDoc(collection(db, "images"), {
        imageUrl,
        fileName: selectedFile.name,
        userName: userName.trim(),
        cloudinaryPublicId: cloudinaryResult.public_id,
        source: "cloudinary",
        createdAt: serverTimestamp(),
      });

      setSelectedFile(null);
      setUserName("");
      setUploadProgress(0);
      await fetchImages();
      setShowUploadDialog(false);
    } catch (error) {
      console.error("Error uploading image:", error);
      setErrorMessage(
        "Upload failed. Check Cloudinary env config and Firestore rules.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-goku-dark text-white relative overflow-hidden pt-28 pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-8 w-80 h-80 rounded-full bg-goku-orange/25 blur-3xl" />
        <div className="absolute top-1/3 -right-8 w-72 h-72 rounded-full bg-goku-yellow/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-6"
        >
          <button
            onClick={() => setShowUploadDialog(true)}
            className="rounded-2xl bg-gradient-to-br from-goku-orange via-goku-navy to-goku-orange p-1 hover:shadow-[0_0_30px_rgba(209,66,6,0.6)] transition-all duration-300"
          >
            <div className="rounded-[15px] bg-goku-dark/90 px-6 py-3 flex items-center justify-center gap-3 group">
              <UploadCloud className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Upload Image</span>
            </div>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-goku-yellow/40 bg-white/5 text-goku-yellow text-xs uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Community Wall
          </div> */}
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight bg-gradient-to-r from-white via-goku-yellow to-goku-orange bg-clip-text text-transparent">
            Capture The Xcepthon Energy
          </h1>
          <p className="text-white/75 mt-3 max-w-2xl text-base sm:text-lg">
            Drop your best event moments. Every upload appears instantly in the
            live gallery.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr] gap-6 xl:gap-8 items-start">
          <section>
            {isLoadingGallery ? (
              <div className="flex justify-center items-center min-h-[420px] bg-white/5 border border-white/15 rounded-2xl">
                <Loader2 className="w-10 h-10 animate-spin text-goku-orange" />
              </div>
            ) : images.length === 0 ? (
              <div className="rounded-2xl border border-white/20 bg-white/5 py-20 text-center">
                <ImageIcon className="mx-auto mb-3 text-goku-yellow/70 w-10 h-10" />
                <p className="text-white/75 text-lg">No images uploaded yet.</p>
                <p className="text-white/50 text-sm mt-1">
                  Be the first one to post.
                </p>
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="show"
                variants={{
                  hidden: { opacity: 0 },
                  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-5"
              >
                {images.map((image) => (
                  <motion.article
                    key={image.id}
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      show: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -6 }}
                    className="group rounded-2xl overflow-hidden border border-white/15 bg-white/5 backdrop-blur-md cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={image.fileName || "Uploaded image"}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-80" />
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-goku-yellow truncate">
                        {image.userName || "Anonymous"}
                      </p>
                      <p className="text-xs text-white/65 truncate">
                        {image.fileName}
                      </p>
                      <p className="text-xs text-white/45 mt-1 inline-flex items-center gap-1.5">
                        <Clock3 className="w-3 h-3" />
                        {formatUploadedDate(image.createdAt)}
                      </p>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </section>
        </div>
      </div>

      <AnimatePresence>
        {showUploadDialog && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowUploadDialog(false)}
          >
            <motion.div
              className="relative w-full max-w-lg rounded-2xl overflow-hidden border border-white/20 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Upload Your Moment</h2>
                  <button
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                    onClick={() => setShowUploadDialog(false)}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-xs uppercase tracking-wider text-white/60">
                      Name
                    </span>
                    <div className="relative mt-1.5">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
                      <input
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        placeholder="Your name"
                        className="w-full pl-10 pr-3 py-3 rounded-xl bg-goku-dark/60 border border-white/25 focus:outline-none focus:ring-2 focus:ring-goku-orange"
                      />
                    </div>
                  </label>

                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        validateAndSetFile(e.target.files?.[0] ?? null)
                      }
                      disabled={isUploading}
                    />
                    <span className="text-xs uppercase tracking-wider text-white/60">
                      File
                    </span>
                    <span className="mt-1.5 flex h-12 items-center justify-center px-4 rounded-xl border border-dashed border-goku-yellow/50 hover:border-goku-orange cursor-pointer bg-white/5">
                      {selectedFile ? selectedFile.name : "Select image file"}
                    </span>
                  </label>

                  <div
                    onDragEnter={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDragging(false);
                      validateAndSetFile(e.dataTransfer.files?.[0] ?? null);
                    }}
                    className={`rounded-xl border-2 border-dashed px-4 py-8 text-center transition ${
                      isDragging
                        ? "border-goku-orange bg-goku-orange/15"
                        : "border-white/30 bg-white/5"
                    }`}
                  >
                    <UploadCloud className="w-9 h-9 mx-auto mb-2 text-goku-yellow" />
                    <p className="text-white/90 text-sm">
                      Drag and drop image here
                    </p>
                    <p className="text-xs text-white/55 mt-1">
                      jpg, png, webp, gif
                    </p>
                  </div>

                  {(isUploading || uploadProgress > 0) && (
                    <div className="mt-4">
                      <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-goku-orange via-goku-yellow to-white transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-goku-yellow">
                        Uploading {uploadProgress}%
                      </p>
                    </div>
                  )}

                  {errorMessage && (
                    <p className="text-sm text-red-200">{errorMessage}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => void uploadImage()}
                      disabled={!canUpload}
                      className="px-4 py-3 rounded-xl bg-gradient-to-r from-goku-orange to-goku-navy disabled:opacity-60 font-medium"
                    >
                      {isUploading ? "Uploading..." : "Upload"}
                    </button>
                    <button
                      onClick={() => setShowUploadDialog(false)}
                      disabled={isUploading}
                      className="px-4 py-3 rounded-xl border border-white/20 bg-white/10 disabled:opacity-60 font-medium"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full rounded-2xl overflow-hidden border border-white/20 bg-black"
              initial={{ scale: 0.96, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute right-3 top-3 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2"
                onClick={() => setSelectedImage(null)}
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.fileName}
                className="w-full max-h-[80vh] object-contain"
              />
              <div className="px-4 py-3 bg-black/75 border-t border-white/10">
                <p className="text-sm text-goku-yellow">
                  {selectedImage.userName || "Anonymous"}
                </p>
                <p className="text-xs text-white/60 truncate">
                  {selectedImage.fileName}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
