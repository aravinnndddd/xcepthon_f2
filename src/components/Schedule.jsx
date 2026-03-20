import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { sagaTimelineDefault } from "../data/sagaTimeline";

const Schedule = () => {
  const [timelineOverrides, setTimelineOverrides] = useState({});

  useEffect(() => {
    const fetchOverrides = async () => {
      try {
        const snapshot = await getDocs(collection(db, "sagaTimeline"));
        const overrides = snapshot.docs.reduce((acc, currentDoc) => {
          acc[currentDoc.id] = currentDoc.data();
          return acc;
        }, {});
        setTimelineOverrides(overrides);
      } catch (error) {
        console.error("Failed to fetch saga timeline overrides:", error);
      }
    };

    fetchOverrides();
  }, []);

  const scheduleData = useMemo(() => {
    return sagaTimelineDefault.map((item) => {
      const override = timelineOverrides[item.id] || {};
      return {
        ...item,
        isOver:
          typeof override.isOver === "boolean" ? override.isOver : item.isOver,
      };
    });
  }, [timelineOverrides]);

  return (
    <section
      id="schedule"
      className="py-24 bg-goku-dark relative overflow-hidden"
    >
      {/* Decorative aura */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-goku-yellow/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="font-heading text-5xl md:text-6xl text-white mb-4 uppercase"
          >
            The <span className="text-goku-yellow text-glow-yellow">Saga</span>
          </motion.h2>
          <p className="text-gray-400 font-sans tracking-widest uppercase text-sm">
            Follow the timeline of battle
          </p>
        </div>

        <div className="space-y-8">
          {scheduleData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex items-center p-6 rounded-xl border ${item.colorClass} backdrop-blur-sm ${item.isOver ? "opacity-70" : ""}`}
            >
              <div className="hidden sm:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-goku-indigo rounded-r-md"></div>

              <div className="flex-1 sm:pl-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3
                    className={`font-heading text-2xl ${item.highlight ? "text-goku-indigo" : "text-goku-dark"} tracking-wide`}
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1 text-sm font-sans font-bold">
                    <span className="text-goku-indigo">{item.time}</span>
                    <span className="text-goku-dark/50">•</span>
                    <span className="text-goku-dark/80">{item.day}</span>
                  </div>
                </div>

                {(item.highlight || item.isOver) && (
                  <div className="shrink-0">
                    {item.isOver ? (
                      <span className="inline-block px-3 py-1 bg-green-700 text-white text-xs font-bold uppercase rounded-full border border-white/20">
                        Over
                      </span>
                    ) : item.highlight ? (
                      <span className="inline-block px-3 py-1 bg-goku-indigo text-white text-xs font-bold uppercase rounded-full">
                        Major Event
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Schedule;
