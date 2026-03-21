import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TARGET = new Date("2026-03-22T10:30:00");

function getTimeLeft() {
  const diff = TARGET - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, done: true };
  return {
    hours: Math.floor(diff / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    done: false,
  };
}

const Pad = ({ value, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="flex flex-col items-center"
  >
    <div className="min-w-[100px] sm:min-w-[150px] md:min-w-[200px] px-4 py-5 md:py-7 flex items-center justify-center">
      <span className="font-accent text-7xl sm:text-8xl md:text-[10rem] text-paper tracking-[0.05em] sm:tracking-[0.2em] font-bold leading-none tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
    </div>
    <span className="mt-3 font-accent text-sm sm:text-base tracking-[0.25em] uppercase text-goku-yellow opacity-80">
      {label}
    </span>
  </motion.div>
);

const Countdown = ({ sectionClassName = "bg-goku-dark" }) => {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    if (time.done) return;
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, [time.done]);

  return (
    <section className={`relative w-full ${sectionClassName} py-20 md:py-28 overflow-hidden`}>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-goku-indigo/10 backdrop-blur-md mb-6"
        >
          <span className="text-sm font-sans text-white tracking-widest uppercase font-bold">
            Hacking Ends In
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-3xl sm:text-4xl md:text-5xl text-white tracking-tight mb-12"
        >
          {time.done && (
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-goku-yellow to-[#B8A58D]">
              XCEPTHON IS LIVE!
            </span>
          )}
        </motion.h2>

        {!time.done ? (
          <div className="flex items-start gap-4 sm:gap-6 md:gap-8">
            <Pad value={time.hours} label="Hours" />
            <Separator />
            <Pad value={time.minutes} label="Minutes" />
            <Separator />
            <Pad value={time.seconds} label="Seconds" />
          </div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-accent text-xl md:text-2xl text-goku-yellow tracking-widest uppercase"
          >
            The hackathon has begun. Build something exceptional.
          </motion.p>
        )}
      </div>
    </section>
  );
};

const Separator = () => (
  <div className="flex flex-col items-center justify-center mt-[2.875rem] sm:mt-[3.625rem] md:mt-[6.125rem] gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-goku-yellow opacity-70" />
    <span className="w-1.5 h-1.5 rounded-full bg-goku-yellow opacity-70" />
  </div>
);

export default Countdown;
