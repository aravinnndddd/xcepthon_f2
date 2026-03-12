import React from "react";
import { motion } from "framer-motion";

const Schedule = () => {
  const scheduleData = [
    { time: "8:30 AM", title: "Check-in", day: "Day 1" },

    { time: "09:30 AM", title: "Opening Ceremony", day: "Day 1" },

    {
      time: "10:00 AM",
      title: "Hacking Begins + Problem Statement Out",
      day: "Day 1",
      highlight: true,
    },

    { time: "12:00 PM", title: "Evaluation Round 1", day: "Day 1" },

    { time: "1:00 PM - 2:00 PM", title: "Food", day: "Day 1" },

    { time: "05:00 PM", title: "Tea Break", day: "Day 1" },

    { time: "07:00 PM", title: "Evaluation Round 2", day: "Day 1" },

    { time: "09:00 PM", title: "Dinner", day: "Day 1" },

    { time: "12:00 AM", title: "Midnight Snack & Games", day: "Day 1" },

    { time: "08:00 AM", title: "Breakfast", day: "Day 2" },

    { time: "10:00 AM", title: "Hacking Ends", day: "Day 2", highlight: true },

    { time: "10:00 AM", title: "Judging Commences", day: "Day 2" },

    {
      time: "01:00 PM",
      title: "Closing Ceremony & Prizes",
      day: "Day 2",
      highlight: true,
    },
  ];

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
              className={`relative flex items-center p-6 rounded-xl border ${item.highlight ? "bg-goku-yellow border-goku-yellow shadow-[0_0_20px_rgba(216,197,173,0.4)]" : "bg-goku-yellow/90 border-black/10"} backdrop-blur-sm`}
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

                {item.highlight && (
                  <div className="shrink-0">
                    <span className="inline-block px-3 py-1 bg-goku-indigo text-white text-xs font-bold uppercase rounded-full">
                      Major Event
                    </span>
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
