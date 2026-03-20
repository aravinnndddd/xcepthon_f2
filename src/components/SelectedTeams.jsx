import React from "react";
import { motion } from "framer-motion";
import { Users, Shield, Zap } from "lucide-react";

const teams = [
  "Hyphen", "CodeCrafters", "T-Rex", "K Factory", "Delta Automations", "Algorix", 
  "SPADEZZZ", "Tea Spillers", "Cypher", "X-CEPtionals", "Coding Ninjas", 
  "Null Byte", "Caffeine fueled Coderss", "Paapen", "NORTH WIND", "3BITS", 
  "Hive Minds"
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {teams.map((team, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.05, 
              }}
              className="bg-orange-600 p-6 flex items-center gap-4 group transition-all duration-300 rounded-2xl shadow-lg border border-orange-500/50"
            >
              <div className="w-12 h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-heading text-xl text-white tracking-wide">{team}</h3>
              </div>
              <div className="ml-auto opacity-40">
                <Users size={16} className="text-white" />
              </div>
            </motion.div>
          ))}

          {/* Special slot for the 18th if needed, or keeping it empty for 17 */}
          {/* Since 17 is requested, we just map 17. The grid will handle the layout. */}
        </motion.div>
      </div>
    </section>
  );
};

export default SelectedTeams;
