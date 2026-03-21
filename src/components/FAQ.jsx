import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: "Who can participate?",
      a: "XCEPTHON is open to all college students, recent graduates, and self-taught developers. Whether you're a seasoned veteran or a curious beginner, if you have the drive to build, you belong here.",
    },
    {
      q: "How much does it cost?",
      a: "Zero. Zilch. Nada. Participation is entirely free. We've got your food, swag, and caffeine covered for the entire 24 hours.",
    },
    {
      q: "Do I need a team?",
      a: "You can hack solo, but we highly recommend teams of 2-4 members.",
    },

    {
      q: "What should I bring?",
      a: "Bring your laptop, charger, student ID, comfortable clothes, toiletries, and an unstoppable mindset. We'll handle the rest.",
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24 bg-goku-dark relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-6xl text-white mb-4 uppercase"
          >
            Intel & <span className="text-gray-400">Queries</span>
          </motion.h2>
          <div className="h-1 w-20 md:w-24 bg-goku-yellow mx-auto"></div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="border border-white/20 bg-goku-indigo/80 rounded-xl overflow-hidden backdrop-blur-sm shadow-md"
            >
              <button
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-heading text-xl text-white tracking-wide">
                  {faq.q}
                </span>
                <motion.div
                  animate={{ rotate: activeIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="text-white" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-400 font-sans border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
