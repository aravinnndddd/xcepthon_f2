import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Bot, Leaf, ShieldCheck } from "lucide-react";

const Tracks = () => {
  const [expanded, setExpanded] = useState({});

  const toggleRead = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getPreview = (text) => {
    const sentences = text.split(".");
    return sentences[0] + ".";
  };

  const tracks = [
    {
      icon: <Zap size={40} className="text-white" />,
      title: "Energy Consumption & Optimization",
      desc: "Many homes and workplaces lack clear insights into how electricity is consumed by individual devices, leading to energy waste and higher costs. Most systems only show total usage, making it difficult to identify inefficient patterns. Build a solution that monitors energy consumption, analyzes behavior, and provides insights or recommendations to optimize electricity usage and reduce unnecessary power consumption.",
      color: "from-[#4facfe] to-[#00f2fe]",
      delay: 0.1,
    },
    {
      icon: <Bot size={40} className="text-white" />,
      title: "Automation in Daily Life",
      desc: "Daily digital activities often involve repetitive tasks such as managing emails, organizing files, and scheduling reminders. Performing these tasks manually consumes time and reduces productivity. Create intelligent automation systems that can handle routine tasks automatically, improving efficiency and simplifying everyday digital workflows.",
      color: "from-[#f12711] to-[#f5af19]",
      delay: 0.2,
    },
    {
      icon: <Leaf size={40} className="text-white" />,
      title: "Sustainability: Green-Route API",
      desc: "Most GPS systems focus on the fastest or shortest routes, but these are not always the most fuel-efficient. Urban traffic with frequent stops consumes more energy than slightly longer routes with steady speeds. Design a routing system or API that suggests environmentally efficient routes to reduce fuel consumption and emissions.",
      color: "from-[#11998e] to-[#38ef7d]",
      delay: 0.3,
    },
    {
      icon: <ShieldCheck size={40} className="text-white" />,
      title: "NLP: Fact-Shield Filter",
      desc: 'Large Language Models (LLMs) sometimes generate confident but incorrect information, commonly called "hallucinations." This creates risks when used for critical applications like customer support or policy guidance. Build a system that detects, filters, or verifies AI-generated information to ensure factual accuracy and reliability.',
      color: "from-[#b224ef] to-[#7579ff]",
      delay: 0.4,
    },
  ];

  return (
    <section id="tracks" className="py-16 md:py-24 bg-goku-dark relative">
      {/* Heading */}
      <div className="text-center mb-10 md:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-4xl md:text-6xl text-white mb-4 uppercase"
        >
          Choose Your <span className="text-goku-indigo">Domain</span>
        </motion.h2>

        <div className="h-1 w-20 md:w-24 bg-goku-yellow mx-auto mb-6"></div>

        <p className="text-gray-400 font-sans max-w-2xl mx-auto text-base md:text-lg px-2">
          Pick a track, assemble your squad, and build a project that challenges
          the status quo.
        </p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tracks.map((track, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: track.delay }}
              className="relative group h-full cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${track.color} rounded-2xl opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-300`}
              />

              <div className="relative h-full bg-goku-indigo rounded-2xl p-6 md:p-8 border border-white/20 flex flex-col">
                <div
                  className={`w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br ${track.color} p-0.5 mb-5 md:mb-6`}
                >
                  <div className="w-full h-full bg-goku-indigo rounded-[14px] flex items-center justify-center">
                    <div className="scale-75 md:scale-100">
                      {track.icon}
                    </div>
                  </div>
                </div>

                <h3 className="font-heading text-xl md:text-2xl text-white mb-3">
                  {track.title}
                </h3>

                <motion.div
                  layout
                  className="text-gray-400 text-xs md:text-sm leading-relaxed"
                >
                  <AnimatePresence mode="wait">
                    {expanded[index] ? (
                      <motion.p
                        key="full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {track.desc}
                      </motion.p>
                    ) : (
                      <motion.p
                        key="preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        {getPreview(track.desc)}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <button
                  onClick={() => toggleRead(index)}
                  className="text-goku-yellow text-sm mt-3 font-semibold hover:underline"
                >
                  {expanded[index] ? "Read less" : "Read more"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tracks;
