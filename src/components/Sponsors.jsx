import React from "react";
import { motion } from "framer-motion";

const Sponsors = () => {
  // Mock sponsor data
  const tiers = [
    {
      name: "Ticketing Partner",
      sponsors: ["/makemypass.svg"],
      size: "h-20 md:h-24",
    },
    // {
    //     name: "Kaioken Tier",
    //     sponsors: ["https://placehold.co/150x60/1a1040/ff5e00?text=DevTools", "https://placehold.co/150x60/1a1040/ff5e00?text=CloudSys", "https://placehold.co/150x60/1a1040/ff5e00?text=DataInc"],
    //     size: "h-16 md:h-16"
    // },
    // {
    //     name: "Base Tier",
    //     sponsors: ["https://placehold.co/120x50/1a1040/00f0ff?text=StartupA", "https://placehold.co/120x50/1a1040/00f0ff?text=StartupB", "https://placehold.co/120x50/1a1040/00f0ff?text=StartupC", "https://placehold.co/120x50/1a1040/00f0ff?text=StartupD"],
    //     size: "h-12 md:h-12"
    // }
  ];

  return (
    <section
      id="sponsors"
      className="py-24 bg-goku-dark relative border-t border-white/5"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h2 className="font-heading text-5xl md:text-6xl text-white mb-4 uppercase">
            Ticketing <span className="text-goku-indigo">Partner</span>
          </h2>
          <div className="h-1 w-24 bg-goku-indigo mx-auto"></div>
        </motion.div>

        <div className="space-y-16">
          {tiers.map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              {/* <h3 className="font-sans text-xl text-goku-indigo mb-8 uppercase tracking-[0.2em] font-bold">
                {tier.name}
              </h3> */}
              <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
                {tier.sponsors.map((src, i) => (
                  <div
                    key={i}
                    className={` transition-all duration-300 hover:scale-110 cursor-pointer ${tier.size}`}
                  >
                    <img
                      src={src}
                      alt={`Sponsor ${i}`}
                      className="h-full w-auto object-contain rounded-lg opacity-90 hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
