import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  LogOut,
  Save,
  ArrowLeft,
  Trophy,
  Medal,
  Award,
} from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AdminContext } from "../context/AdminContext";

const defaultFormData = {
  enabled: false,
  winner1: { team: "", members: "" },
  winner2: { team: "", members: "" },
  winner3: { team: "", members: "" },
};

const AdminWinners = () => {
  const navigate = useNavigate();
  const { isAdmin, logoutAdmin, adminLoading } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      navigate("/admin");
    }
  }, [isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchWinners();
    }
  }, [isAdmin]);

  const fetchWinners = async () => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "winners", "results");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const saved = docSnap.data() || {};
        setFormData({
          enabled: typeof saved?.enabled === "boolean" ? saved.enabled : false,
          winner1: {
            team: saved?.winner1?.team || "",
            members: saved?.winner1?.members || "",
          },
          winner2: {
            team: saved?.winner2?.team || "",
            members: saved?.winner2?.members || "",
          },
          winner3: {
            team: saved?.winner3?.team || "",
            members: saved?.winner3?.members || "",
          },
        });
      }
    } catch (err) {
      console.error("Error fetching winners:", err);
      setError("Failed to load current winners.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (rank, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [rank]: {
        ...prev[rank],
        [field]: value,
      },
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      await setDoc(doc(db, "winners", "results"), {
        enabled: !!formData.enabled,
        winner1: {
          team: formData?.winner1?.team || "",
          members: formData?.winner1?.members || "",
        },
        winner2: {
          team: formData?.winner2?.team || "",
          members: formData?.winner2?.members || "",
        },
        winner3: {
          team: formData?.winner3?.team || "",
          members: formData?.winner3?.members || "",
        },
      });
      setSuccess("Winners updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving winners:", err);
      setError("Failed to save winners. Check permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logoutAdmin();
    navigate("/");
  };

  const handleTogglePublicView = () => {
    setFormData((prev) => ({
      ...prev,
      enabled: !prev.enabled,
    }));
  };

  if (adminLoading || isLoading) {
    return (
      <div className="min-h-screen bg-goku-dark text-white flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-goku-orange" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const ranks = [
    {
      id: "winner1",
      title: "1st Place",
      subtitle: "Champion",
      icon: Trophy,
      iconClass: "text-yellow-300",
      cardClass:
        "from-yellow-500/20 to-yellow-300/5 border-yellow-300/30 shadow-[0_20px_40px_rgba(0,0,0,0.25)]",
    },
    {
      id: "winner2",
      title: "2nd Place",
      subtitle: "Runner Up",
      icon: Medal,
      iconClass: "text-slate-200",
      cardClass:
        "from-slate-400/20 to-slate-200/5 border-slate-200/25 shadow-[0_20px_40px_rgba(0,0,0,0.22)]",
    },
    {
      id: "winner3",
      title: "3rd Place",
      subtitle: "Second Runner Up",
      icon: Award,
      iconClass: "text-orange-200",
      cardClass:
        "from-orange-400/20 to-orange-200/5 border-orange-200/25 shadow-[0_20px_40px_rgba(0,0,0,0.22)]",
    },
  ];

  return (
    <div className="min-h-screen bg-goku-dark text-white pt-28 pb-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -left-10 w-80 h-80 rounded-full bg-goku-orange/25 blur-3xl" />
        <div className="absolute top-1/3 -right-10 w-72 h-72 rounded-full bg-goku-yellow/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-8 rounded-3xl border border-white/20 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Link
                  to="/admin/submissions"
                  className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition text-white/70 hover:text-white border border-white/10"
                >
                  <ArrowLeft size={18} />
                </Link>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Winners Control Room
                </h1>
              </div>
              <p className="text-white/70 text-sm sm:text-base">
                Edit podium winners shown on the public site and save instantly.
              </p>

              <div className="mt-4 inline-flex items-center gap-3 rounded-xl border border-white/15 bg-black/25 px-3 py-2">
                <span className="text-xs uppercase tracking-wider text-white/70 font-semibold">
                  Public View
                </span>
                <button
                  type="button"
                  onClick={handleTogglePublicView}
                  className={`relative h-7 w-14 rounded-full border transition-colors ${
                    formData.enabled
                      ? "bg-emerald-500/30 border-emerald-300/50"
                      : "bg-white/10 border-white/25"
                  }`}
                  aria-label="Toggle winners public visibility"
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                      formData.enabled ? "left-8" : "left-1"
                    }`}
                  />
                </button>
                <span className="text-xs font-semibold text-white/85">
                  {formData.enabled ? "ON" : "OFF"}
                </span>
              </div>
            </motion.div>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 flex items-center gap-2 transition text-sm"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {ranks.map((rank, index) => {
              const winnerSlot = formData[rank.id] || defaultFormData[rank.id];

              return (
                <motion.div
                  key={rank.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.07 }}
                  whileHover={{ y: -4 }}
                  className={`p-5 rounded-2xl border bg-gradient-to-b backdrop-blur-sm ${rank.cardClass}`}
                >
                  <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-white/15">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-black/20 border border-white/10">
                        <rank.icon size={24} className={rank.iconClass} />
                      </div>
                      <div>
                        <h2 className="text-xl font-extrabold text-white tracking-wide">
                          {rank.title}
                        </h2>
                        <p className="text-xs uppercase tracking-[0.18em] text-white/60">
                          {rank.subtitle}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full px-2.5 py-1 text-[10px] font-semibold border border-white/20 bg-black/20 text-white/75 uppercase tracking-wider">
                      Slot {index + 1}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-bold ml-1">
                        Team Name
                      </label>
                      <input
                        type="text"
                        value={winnerSlot.team || ""}
                        onChange={(e) =>
                          handleChange(rank.id, "team", e.target.value)
                        }
                        placeholder="Enter winner team"
                        className="w-full bg-black/25 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-goku-orange/50 focus:border-goku-orange/60 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-bold ml-1">
                        Members
                      </label>
                      <textarea
                        rows={4}
                        value={winnerSlot.members || ""}
                        onChange={(e) =>
                          handleChange(rank.id, "members", e.target.value)
                        }
                        placeholder="Member names separated by commas"
                        className="w-full resize-none bg-black/25 border border-white/15 rounded-xl px-4 py-3 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-goku-orange/50 focus:border-goku-orange/60 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="sticky bottom-5 z-20">
            <div className="mx-auto max-w-5xl rounded-2xl border border-white/20 bg-black/35 backdrop-blur-xl px-4 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-h-8">
                {error && (
                  <p className="text-red-300 text-sm font-medium bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20 inline-flex">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-emerald-300 text-sm font-medium bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20 inline-flex">
                    {success}
                  </p>
                )}
                {!error && !success && (
                  <p className="text-white/60 text-sm">
                    Save to push winner updates and public view status.
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSaving}
                className="w-full sm:w-auto group relative flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-goku-orange to-goku-navy text-white font-accent tracking-wider uppercase text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] rounded-xl shadow-xl disabled:opacity-50 disabled:hover:scale-100"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                <span>{isSaving ? "Saving..." : "Save Winners"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminWinners;
