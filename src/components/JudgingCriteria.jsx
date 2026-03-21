import React from "react";
import { motion } from "framer-motion";
import {
  Code,
  Lightbulb,
  Wrench,
  BarChart3,
  Presentation,
  Palette,
} from "lucide-react";

const JudgingCriteria = () => {
  const criteria = [
    {
      icon: <Code size={32} className="text-white" />,
      title: "Execution & Implementation",
      description: "Working prototype, technical depth, stability, features completed.",
      color: "from-[#4facfe] to-[#00f2fe]",
      delay: 0.1,
    },
    {
      icon: <Lightbulb size={32} className="text-white" />,
      title: "Creativity & Innovation",
      description: "Originality, uniqueness of idea, creative approach.",
      color: "from-[#f12711] to-[#f5af19]",
      delay: 0.2,
    },
    {
      icon: <Wrench size={32} className="text-white" />,
      title: "Feasibility",
      description: "Practicality, realistic implementation, resource fit, real-world possibility.",
      color: "from-[#11998e] to-[#38ef7d]",
      delay: 0.3,
    },
    {
      icon: <BarChart3 size={32} className="text-white" />,
      title: "Impact, Scalability & Usefulness",
      description: "Real-world impact, usefulness, potential to grow, long-term viability.",
      color: "from-[#b224ef] to-[#7579ff]",
      delay: 0.4,
    },
    {
      icon: <Presentation size={32} className="text-white" />,
      title: "Presentation & Communication",
      description: "Pitch clarity, explanation quality, Q&A handling, storytelling.",
      color: "from-[#ff9a9e] to-[#fecfef]",
      delay: 0.5,
    },
    {
      icon: <Palette size={32} className="text-white" />,
      title: "UI/UX & Design Quality",
      description: "User-friendliness, design quality, navigation, visual appeal.",
      color: "from-[#a18cd1] to-[#fbc2eb]",
      delay: 0.6,
    },
  ];

  return (
    <section id="judging" className="py-24 bg-goku-dark relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-goku-indigo/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-goku-orange/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-5xl md:text-6xl text-white mb-4 uppercase"
          >
            Judging <span className="text-goku-indigo">Criteria</span>
          </motion.h2>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 w-24 bg-goku-yellow mx-auto mb-6 origin-left"
          />

          <p className="text-gray-400 font-sans max-w-2xl mx-auto text-lg">
            Our judges evaluate projects based on these six pillars of excellence
            to identify the most impactful and innovative solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {criteria.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: item.delay }}
              whileHover={{ y: -10 }}
              className="relative group"
            >
              {/* Card Glow Effect */}
              <div
                className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl opacity-10 group-hover:opacity-40 blur transition duration-500`}
              />

              <div className="relative bg-[#251b4d] bg-opacity-60 backdrop-blur-xl border border-white/10 p-8 rounded-2xl h-full flex flex-col justify-between transition-all duration-300 group-hover:border-white/20">
                <div>
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} p-0.5 mb-6 shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <div className="w-full h-full bg-[#1a1435] rounded-[10px] flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl text-white mb-4 group-hover:text-goku-yellow transition-colors duration-300 tracking-wide uppercase">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 font-sans leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div
                  className={`mt-6 h-0.5 w-0 group-hover:w-full bg-gradient-to-r ${item.color} transition-all duration-500 rounded-full`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JudgingCriteria;
