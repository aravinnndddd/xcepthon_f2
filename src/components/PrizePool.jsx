import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Trophy, Medal, Award, Zap } from "lucide-react";
import gokuImg from "../assets/goku.png";

const PrizePool = () => {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"],
  });

  // Background glow paralax movements
  const bg1Y = useTransform(scrollYProgress, [0, 1], [-200, 200]);
  const bg2Y = useTransform(scrollYProgress, [0, 1], [200, -200]);
  const bg2Rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

  // Main Card Parallax
  const leftCardY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);

  // Right Stacked Cards Parallax
  const rightCard1Y = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const rightCard2Y = useTransform(scrollYProgress, [0, 0.6], [60, 0]);

  return (
    <section
      id="prizes"
      ref={sectionRef}
      className="py-24 bg-goku-dark relative overflow-hidden"
    >
      {/* Background ambient scroll-linked glows */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          style={{ y: bg1Y }}
          className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-goku-orange/10 blur-[120px]"
        />
        <motion.div
          style={{ y: bg2Y, rotate: bg2Rotate }}
          className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[120px]"
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── LAYOUT: mirrors the reference — tall left card | center heading | right grid ── */}
        <div className="flex flex-col lg:flex-row gap-6 items-stretch min-h-[520px]">
          {/* ── LEFT: Total Prize Pool Card (Now with Goku Push) ─────────────────────────── */}
          <motion.div
            style={{ y: leftCardY }}
            className="relative lg:w-[260px] flex-shrink-0 z-20"
            initial={{ x: -300, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 1.2,
              delay: 0.1,
            }}
          >
            {/* Goku Image pushing the card */}
            <img
              src={gokuImg}
              alt="Goku"
              className="max-[1018px]:hidden block absolute z-30 object-contain drop-shadow-[0_0_20px_rgba(255,94,0,0.6)]"
              style={{
                height: "500px",
                left: "-240px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />

            {/* Your EXACT original left card, now inside the animated wrapper */}
            <div className="relative rounded-3xl overflow-hidden flex flex-col justify-between p-8 min-h-[480px] w-full h-full">
              {/* dynamic inline style merged with fixed tailwind background */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(160deg, #1a0a00 0%, #ff5e00 60%, #ff9a00 100%)",
                  boxShadow:
                    "0 0 60px rgba(255,94,0,0.4), 0 0 120px rgba(255,94,0,0.15)",
                  zIndex: -1,
                }}
              ></div>

              {/* Grid pattern overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "32px 32px",
                  zIndex: -1,
                }}
              />

              {/* Top label */}
              <div className="relative z-10">
                <p className="font-sans text-xs text-white/70 tracking-[0.2em] uppercase border border-white/20 rounded-full px-3 py-1 inline-block mb-2">
                  Total Prize Pool
                </p>
              </div>

              {/* Big number */}
              <div className="relative z-10 my-auto py-8">
                <motion.p
                  style={{
                    scale: useTransform(scrollYProgress, [0.3, 0.7], [0.8, 1]),
                  }}
                  className="font-heading text-7xl text-white leading-none"
                  initial={{ textShadow: "0 0 0px rgba(255,255,255,0)" }}
                  animate={{ textShadow: "0 0 40px rgba(255,255,255,0.4)" }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  ₹30K
                </motion.p>
                <p className="font-sans text-sm text-white/60 mt-2 tracking-widest">
                  prizes in total
                </p>
              </div>

              {/* Branding bottom */}
              <div className="relative z-10 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                  <Zap size={14} className="text-white" />
                </div>
                <span className="font-heading text-white text-lg tracking-widest">
                  XCEPTHON <span className="text-white/60">'26</span>
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── CENTER: Heading ──────────────────────────────────────── */}
          <div className="flex-1 flex flex-col justify-center lg:px-8 text-center lg:text-left">
            <motion.div
              style={{
                opacity: useTransform(scrollYProgress, [0.1, 0.5], [0, 1]),
                y: useTransform(scrollYProgress, [0.1, 0.5], [50, 0]),
              }}
            >
              <p className="font-accent text-goku-orange tracking-[0.3em] uppercase text-sm mb-3">
                Battle Rewards
              </p>
              <h2
                className="font-heading leading-tight text-white"
                style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
              >
                Meet Our
                <br />
                <span className=" text-yellow-400 ">Prize Pool</span>
              </h2>
              <div className="mt-4 h-1 w-20 bg-gradient-to-r from-goku-orange to-transparent lg:mx-0 mx-auto" />
              <p className="mt-5 text-gray-400 font-sans text-base max-w-sm lg:mx-0 mx-auto">
                Push beyond your limits. The top fighters walk away with serious
                rewards.
              </p>
            </motion.div>
          </div>

          {/* ── RIGHT: Prize breakdown + Sponsor ────────────────────── */}
          <div className="flex flex-col gap-5 lg:w-[320px] flex-shrink-0">
            {/* Prize Breakdown Card */}
            <motion.div
              style={{ y: rightCard1Y }}
              className="relative rounded-2xl overflow-hidden p-6 flex-shrink-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(140deg, #111130 0%, #1a1a45 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 0 30px rgba(34,211,238,0.08)",
                  zIndex: -1,
                }}
              ></div>
              {/* Zigzag / chevron pattern overlay */}
              <div
                className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 0, transparent 50%)",
                  backgroundSize: "18px 18px",
                  zIndex: -1,
                }}
              />

              {/* 1st Prize */}
              <div className="relative z-10 flex items-center justify-between mb-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_15px_rgba(250,204,21,0.4)]">
                    <Trophy size={18} className="text-white" />
                  </div>
                  <span className="font-sans text-sm text-gray-400 tracking-widest uppercase">
                    First Prize
                  </span>
                </div>
                <span
                  className="font-heading text-4xl text-white"
                  style={{ textShadow: "0 0 20px rgba(250,204,21,0.5)" }}
                >
                  ₹15k
                </span>
              </div>

              {/* 2nd & 3rd row */}
              <div className="relative z-10 grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center">
                      <Medal size={13} className="text-white" />
                    </div>
                    <span className="font-sans text-xs text-gray-500 uppercase tracking-wider">
                      Second
                    </span>
                  </div>
                  <span className="font-heading text-3xl text-white">₹10k</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-700 to-orange-900 flex items-center justify-center">
                      <Award size={13} className="text-white" />
                    </div>
                    <span className="font-sans text-xs text-gray-500 uppercase tracking-wider">
                      Third
                    </span>
                  </div>
                  <span className="font-heading text-3xl text-white">₹5k</span>
                </div>
              </div>
            </motion.div>

            {/* Sponsor Card */}
            <motion.div
              style={{ y: rightCard2Y }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="relative rounded-2xl overflow-hidden p-6 flex-1 flex flex-col justify-between"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1200 0%, #332800 50%, #1a1200 100%)",
                  border: "1px solid rgba(255,180,0,0.15)",
                  boxShadow: "0 0 30px rgba(255,160,0,0.1)",
                  zIndex: -1,
                }}
              ></div>
              <p className="font-accent text-xs tracking-[0.3em] uppercase text-yellow-500/70 mb-3 relative z-10">
                Our Sponsor
              </p>
              <div className="flex items-center gap-3 relative z-10">
                {/* Orange triangle logo placeholder */}
                <div
                  className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-lg"
                  style={{
                    background: "rgba(255,140,0,0.15)",
                    border: "1px solid rgba(255,140,0,0.3)",
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <polygon
                      points="14,2 26,24 2,24"
                      stroke="#ff9500"
                      strokeWidth="2"
                      fill="rgba(255,149,0,0.15)"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-heading text-xl text-yellow-400 tracking-widest leading-tight">
                    LEOBISS
                  </p>
                  <p className="font-sans text-xs text-yellow-600 tracking-[0.15em] uppercase">
                    International Pvt Ltd
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrizePool;
