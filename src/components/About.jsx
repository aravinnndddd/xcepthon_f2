import React from "react";
import { motion } from "framer-motion";
import { Code, Zap, Users } from "lucide-react";

const About = () => {
  const cards = [
    {
      icon: <Code size={32} className="text-goku-orange" />,
      title: "Limitless Building",
      desc: "Transform your craziest ideas into reality. Here, we break the boundaries of conventional software.",
      delay: 0.2,
    },
    {
      icon: <Zap size={32} className="text-goku-yellow" />,
      title: "Intense Energy",
      desc: "24 hours of non-stop adrenaline, fueled by caffeine and pure passion. Channel your inner Super Saiyan.",
      delay: 0.4,
    },
    {
      icon: <Users size={32} className="text-goku-yellow" />,
      title: "Elite Network",
      desc: "Join forces with the best developers, designers, and innovators. Your team is your strongest weapon.",
      delay: 0.6,
    },
  ];

  return (
    <section id="about" className="relative py-16 md:py-24 bg-goku-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-heading text-4xl md:text-6xl text-white mb-6 uppercase tracking-wide"
          >
            Power <span className="text-goku-indigo">Awakened</span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-1 w-20 md:w-24 bg-goku-yellow mx-auto mb-8 origin-left"
          />
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 font-sans text-base md:text-xl leading-relaxed px-2"
          >
            XCEPTHON is not just a hackathon. It's an arena where ordinary
            coders transform into legendary builders. Whether you're forging a
            new protocol or crafting a beautiful user experience, this is the
            battlefield to prove your worth.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-12">
          {cards.map((card, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: card.delay }}
              className="group relative bg-goku-indigo rounded-2xl p-6 md:p-8 border border-white/5 hover:border-goku-yellow/50 transition-colors duration-300 overflow-hidden"
            >
              {/* Hover glow effect */}
              <div className="absolute -inset-2 bg-gradient-to-r from-goku-orange to-goku-yellow opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-[2rem]"></div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-white/10 flex items-center justify-center mb-6 shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                  <div className="scale-75 md:scale-100">
                    {card.icon}
                  </div>
                </div>
                <h3 className="font-heading text-xl md:text-2xl text-white mb-4 tracking-wide">
                  {card.title}
                </h3>
                <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed flex-grow">
                  {card.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
