import React from "react";
import { motion } from "framer-motion";
import { ClipboardList, FileText, Users, Rocket } from "lucide-react";

const milestones = [
  {
    icon: <ClipboardList size={22} className="text-white" />,
    date: "March 11, 2026",
    title: "Registration Opens",
    desc: "Doors are open! Sign up your team and secure your spot at Xcepthon. Early birds get an edge.",
    color: "from-[#4facfe] to-[#00f2fe]",
    done: true,
  },
  {
    icon: <FileText size={22} className="text-white" />,
    date: "March 16, 2026",
    title: "Registration & Abstract Submission Closes",
    desc: "Last day to register and submit your project abstract. Make sure your idea is crisp and compelling.",
    color: "from-[#f12711] to-[#f5af19]",
    done: true,
  },
  {
    icon: <Users size={22} className="text-white" />,
    date: "March 17, 2026",
    title: "Teams Shortlisted",
    desc: "Selected teams will be announced. Check your email — if you're in, it's time to go all out.",
    color: "from-[#11998e] to-[#38ef7d]",
    done: true,
  },
  {
    icon: <Rocket size={22} className="text-white" />,
    date: "March 21, 2026",
    title: "Hackathon Kicks Off",
    desc: "The clock starts. 24 hours of building, breaking, and innovating. Let's make exceptions count.",
    color: "from-[#b224ef] to-[#7579ff]",
    done: false,
  },
];

const LINE =
  "w-[3px] bg-gradient-to-b from-[#4facfe]/80 via-white/50 to-[#b224ef]/80 rounded-full";

const Registration = () => {
  return (
    <section id="registration" className="py-24 bg-goku-dark relative">
      {/* Heading */}
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-4xl md:text-6xl sm:text-5xl text-white mb-4 uppercase"
        >
          Registration Timeline
        </motion.h2>
        <div className="h-1 w-24 bg-goku-yellow mx-auto mb-6" />
        <p className="text-gray-400 font-sans max-w-2xl mx-auto">
          Mark your calendar. Every milestone matters — don't miss your window
          to be part of something exceptional.
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Desktop layout ── */}
        <div className="hidden md:block relative">
          {/* Desktop center line — starts & ends at icon centers */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${LINE}`}
            style={{ top: "1.375rem", bottom: "1.375rem" }}
          />

          <div className="flex flex-col gap-10">
            {milestones.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex items-center ${isLeft ? "flex-row" : "flex-row-reverse"
                    }`}
                >
                  {/* Card */}
                  <div
                    className={`group relative w-[calc(50%-2.5rem)] ${isLeft ? "mr-auto" : "ml-auto"
                      }`}
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300`}
                    />
                    <div className="relative bg-goku-indigo rounded-2xl border border-white/10 p-6 flex flex-col gap-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span
                          className={`text-xs font-semibold px-3 py-1 rounded-full border ${item.done
                            ? "border-green-400 text-green-400 bg-green-400/10"
                            : "border-white/20 text-gray-400 bg-white/5"
                            }`}
                        >
                          {item.done ? "✓ Completed" : "Upcoming"}
                        </span>
                        <span className="text-xs text-goku-yellow font-medium">
                          {item.date}
                        </span>
                      </div>
                      <h3 className="font-heading text-xl text-white">
                        {item.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Center icon */}
                  <div className="absolute left-1/2 -translate-x-1/2 z-10">
                    <div
                      className={`w-11 h-11 rounded-full bg-gradient-to-br ${item.color} p-px shadow-lg`}
                    >
                      <div className="w-full h-full bg-goku-dark rounded-full flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile layout ── */}
        <div className="flex md:hidden flex-col">
          {milestones.map((item, index) => {
            const isLast = index === milestones.length - 1;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-row gap-4"
              >
                {/* Left column: icon + line segment */}
                <div className="flex flex-col items-center shrink-0">
                  {/* Icon */}
                  <div
                    className={`shrink-0 z-10 w-11 h-11 rounded-full bg-gradient-to-br ${item.color} p-px shadow-lg`}
                  >
                    <div className="w-full h-full bg-goku-dark rounded-full flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>

                  {/* Line below icon — hidden on last item */}
                  {!isLast && (
                    <div className={`flex-1 mt-1 mb-1 ${LINE}`} style={{ minHeight: "1rem" }} />
                  )}
                </div>

                {/* Card */}
                <div className={`group relative w-full ${!isLast ? "mb-6" : ""}`}>
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl opacity-30 blur-sm group-hover:opacity-60 transition-opacity duration-300`}
                  />
                  <div className="relative bg-goku-indigo rounded-2xl border border-white/10 p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${item.done
                          ? "border-green-400 text-green-400 bg-green-400/10"
                          : "border-white/20 text-gray-400 bg-white/5"
                          }`}
                      >
                        {item.done ? "✓ Completed" : "Upcoming"}
                      </span>
                      <span className="text-xs text-goku-yellow font-medium">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="font-heading text-xl text-white">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Registration;
