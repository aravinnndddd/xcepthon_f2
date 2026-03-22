import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Loader2, Star, Trophy } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const fallbackWinners = {
  winner1: { team: "Champion Team", members: "To be announced" },
  winner2: { team: "Runner Up", members: "To be announced" },
  winner3: { team: "Second Runner Up", members: "To be announced" },
};

const podiumConfig = [
  {
    id: "winner2",
    label: "2nd Place",
    rank: 2,
    heightClass: "h-40",
    cupColorClass: "text-slate-300",
    glowClass: "bg-slate-300/20",
  },
  {
    id: "winner1",
    label: "1st Place",
    rank: 1,
    heightClass: "h-56",
    cupColorClass: "text-yellow-300",
    glowClass: "bg-yellow-300/25",
  },
  {
    id: "winner3",
    label: "3rd Place",
    rank: 3,
    heightClass: "h-32",
    cupColorClass: "text-orange-300",
    glowClass: "bg-orange-300/20",
  },
];

const Winners = () => {
  const [winners, setWinners] = useState(fallbackWinners);
  const [loading, setLoading] = useState(true);
  const [isPublicEnabled, setIsPublicEnabled] = useState(false);
  const [hasWinnersData, setHasWinnersData] = useState(false);
  const [revealStep, setRevealStep] = useState(0);

  const revealRankByStep = [3, 2, 1];
  const ordinalByRank = { 1: "1st", 2: "2nd", 3: "3rd" };

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const winnerSnap = await getDoc(doc(db, "winners", "results"));
        if (winnerSnap.exists()) {
          const saved = winnerSnap.data() || {};
          setIsPublicEnabled(
            typeof saved?.enabled === "boolean" ? saved.enabled : false,
          );

          const hasAnyWinnerName = [
            saved?.winner1?.team,
            saved?.winner2?.team,
            saved?.winner3?.team,
          ].some((teamName) => typeof teamName === "string" && teamName.trim());
          setHasWinnersData(hasAnyWinnerName);

          setWinners((prev) => ({
            ...prev,
            winner1: {
              ...prev.winner1,
              ...(saved.winner1 || {}),
            },
            winner2: {
              ...prev.winner2,
              ...(saved.winner2 || {}),
            },
            winner3: {
              ...prev.winner3,
              ...(saved.winner3 || {}),
            },
          }));
        } else {
          setHasWinnersData(false);
        }
      } catch (error) {
        console.error("Failed to fetch winners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWinners();
  }, []);

  const handleRevealClick = () => {
    setRevealStep((prev) => Math.min(prev + 1, revealRankByStep.length));
  };

  const getIsRankRevealed = (rank) => {
    if (revealStep <= 0) {
      return false;
    }

    const unlockedRanks = revealRankByStep.slice(0, revealStep);
    return unlockedRanks.includes(rank);
  };

  return (
    <section
      id="winners"
      className="py-16 md:py-24 bg-goku-dark relative overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-1/4 w-80 h-80 rounded-full bg-goku-indigo/20 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-goku-orange/20 blur-3xl" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-14">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-3"
          >
            XCEPTHON <span className="text-yellow-300">WINNERS</span>
          </motion.h2>
          <p className="text-white/70 text-sm sm:text-base max-w-2xl mx-auto">
            Celebrating the top three teams on the final podium.
          </p>

          {!loading && isPublicEnabled && hasWinnersData && (
            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleRevealClick}
                disabled={revealStep >= revealRankByStep.length}
                className="rounded-xl border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {revealStep >= revealRankByStep.length
                  ? "All Winners Revealed"
                  : `Reveal ${ordinalByRank[revealRankByStep[revealStep]]} Champion`}
              </button>
              <span className="text-xs text-white/55">
                Click sequence: 3rd then 2nd then 1st
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-white/70" />
          </div>
        ) : (
          <>
            {!isPublicEnabled || !hasWinnersData ? (
              <div className="max-w-2xl mx-auto rounded-2xl border border-white/20 bg-white/5 backdrop-blur-sm px-6 py-8 text-center">
                <p className="text-white text-lg sm:text-xl font-heading tracking-wide">
                  Winners will be announced soon
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-4 items-end">
                {podiumConfig.map((slot, index) => {
                  const winner = winners[slot.id] || fallbackWinners[slot.id];
                  const isFirst = slot.rank === 1;
                  const isRevealed = getIsRankRevealed(slot.rank);

                  return (
                    <motion.article
                      key={slot.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-30px" }}
                      transition={{ duration: 0.35, delay: index * 0.08 }}
                      className="relative"
                    >
                      <motion.div
                        className="relative mb-3 text-center"
                        animate={
                          isRevealed
                            ? { scale: [0.92, 1.05, 1], opacity: [0.7, 1, 1] }
                            : { scale: 1, opacity: 0.85 }
                        }
                        transition={{ duration: 0.5, ease: "easeOut" }}
                      >
                        {isFirst && isRevealed && (
                          <div className="inline-flex mb-2 items-center gap-1 rounded-full bg-yellow-300/20 border border-yellow-300/40 px-3 py-1">
                            <Crown size={14} className="text-yellow-200" />
                            <span className="text-[11px] uppercase tracking-wider text-yellow-100 font-semibold">
                              Champion
                            </span>
                          </div>
                        )}

                        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
                          {isRevealed && (
                            <motion.span
                              initial={{ opacity: 0, scale: 0.7 }}
                              animate={{
                                opacity: [0, 0.7, 0],
                                scale: [0.7, 1.35, 1.7],
                              }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className="absolute inset-0 rounded-full border border-white/40"
                            />
                          )}
                          <span
                            className={`absolute inset-0 rounded-full blur-xl ${slot.glowClass}`}
                          />
                          <motion.div
                            animate={
                              isRevealed
                                ? { y: [6, -2, 0], rotate: [0, -3, 2, 0] }
                                : { y: 0, rotate: 0 }
                            }
                            transition={{ duration: 0.55, ease: "easeOut" }}
                          >
                            <Trophy
                              size={58}
                              className={`${isRevealed ? slot.cupColorClass : "text-white/30"} drop-shadow-[0_6px_12px_rgba(0,0,0,0.35)]`}
                            />
                          </motion.div>
                        </div>

                        <motion.h3
                          animate={
                            isRevealed
                              ? { y: [10, 0], opacity: [0.5, 1] }
                              : { y: 0, opacity: 0.95 }
                          }
                          transition={{ duration: 0.35, ease: "easeOut" }}
                          className={`mt-2 text-white font-heading tracking-wide truncate ${
                            isRevealed ? "text-2xl sm:text-3xl" : "text-xl"
                          }`}
                        >
                          {isRevealed ? winner.team || "TBA" : "Hidden"}
                        </motion.h3>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/65 mt-1">
                          {isRevealed ? slot.label : "Locked"}
                        </p>
                      </motion.div>

                      <div
                        className={`relative ${slot.heightClass} rounded-t-md bg-gradient-to-b from-red-700 to-red-800 border-t-4 border-red-500 shadow-[0_15px_35px_rgba(0,0,0,0.35)]`}
                      >
                        <div className="absolute inset-0 bg-red-900/20" />
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center">
                          <div className="relative w-14 h-14 mx-auto">
                            <Star
                              size={56}
                              className="absolute inset-0 text-yellow-300 fill-yellow-300/80"
                            />
                            <span className="absolute inset-0 flex items-center justify-center text-2xl font-extrabold text-red-700">
                              {slot.rank}
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-center text-xs text-white/65 mt-3 px-2 line-clamp-2">
                        {isRevealed
                          ? winner.members || "Members will be announced soon"
                          : "Click reveal to unlock"}
                      </p>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Winners;
