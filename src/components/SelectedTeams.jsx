import React from "react";
import { motion } from "framer-motion";
import { Users, Shield, Zap } from "lucide-react";

const PROBLEM_STATEMENTS = {
  1: {
    title: "Automation to make Browsing better",
    stream: "Productivity & Web Automation",
    description: "Build agentic systems to automate everyday browsing tasks like searches, actions, and bookmark management."
  },
  2: {
    title: "Multiplayer games for differently abled people",
    stream: "Inclusive Gaming / Accessibility",
    description: "Create multiplayer games tailored for differently abled users that ensure equal participation and fun."
  },
  3: {
    title: "Build a system to detect fake reviews",
    stream: "AI & Data Analytics",
    description: "Develop intelligent systems to analyze and filter fake, AI-generated, or repeated reviews."
  },
  4: {
    title: "Help creators better monetize and grow their audience",
    stream: "Creator Economy / Digital Platforms",
    description: "Design platforms that enable seamless content creation, management, and performance insights."
  }
};

const teams = [
  { name: "Tea Spillers", problemId: 1 },
  { name: "Delta Automations", problemId: 2 },
  { name: "Null Byte", problemId: 4 },
  { name: "Algorix", problemId: 1 },
  { name: "T-Rex", problemId: 4 },
  { name: "Cypher", problemId: 3 },
  { name: "3BITS", problemId: 1 },
  { name: "Hyphen", problemId: 1 },
  { name: "Hive Minds", problemId: 3 },
  { name: "NORTH WIND", problemId: 2 },
  { name: "CodeCrafters", problemId: 1 },
  { name: "K Factory", problemId: 3 },
  { name: "X-CEPtionals", problemId: 2 },
  { name: "SPADEZZZ", problemId: 3 },
  { name: "Coding Ninjas", problemId: 4 },
  { name: "Caffeine fueled Coderss", problemId: 3 }
];

const SelectedTeams = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <section id="selected-teams" className="py-24 bg-goku-dark relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-goku-orange/5 blur-[100px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-goku-indigo/10 blur-[80px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-5xl md:text-6xl text-white mb-4"
          >
            SELECTED <span className="text-yellow-400">TEAMS</span>
          </motion.h2>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 100 }}
            viewport={{ once: true }}
            className="h-1 bg-gradient-to-r from-goku-orange to-transparent mx-auto"
          />
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {teams.map((team, index) => {
            const problem = PROBLEM_STATEMENTS[team.problemId];
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  y: -5
                }}
                className="bg-orange-600/90 backdrop-blur-sm p-6 flex flex-col gap-4 group transition-all duration-300 rounded-2xl shadow-lg border border-orange-400/30 hover:bg-orange-600 hover:border-orange-400/60"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
                    <Shield size={22} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-xl text-white tracking-wide truncate group-hover:text-yellow-200 transition-colors">{team.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Users size={12} className="text-white/60" />
                      <span className="text-white/60 text-[10px] uppercase tracking-wider font-medium">Qualified Fighter</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 pt-4 border-t border-white/10">
                  <p className="text-white/50 text-[10px] uppercase tracking-widest mb-2 font-semibold">Problem Statement</p>
                  <h4 className="text-white font-heading text-sm sm:text-base leading-snug group-hover:text-yellow-100 transition-colors">
                    {problem.title}
                  </h4>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default SelectedTeams;