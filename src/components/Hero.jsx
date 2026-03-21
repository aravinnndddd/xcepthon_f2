import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { ArrowRight, Terminal } from "lucide-react";
import FloatingCloud from "./FloatingClouds";
import FloatingRocket from "./FloatingRocket";
import FloatingSatellite from "./FloatingSatellite";
import FloatingPlane from "./FloatingPlane";
import Countdown from "./countdown";

const Hero = () => {
  const ref = useRef(null);

  // Sequential animation state: 'plane' → 'rocket' → 'satellite' → loop
  const [activeVehicle, setActiveVehicle] = useState("plane");

  const handleRocketComplete = useCallback(() => {
    setActiveVehicle("satellite");
  }, []);

  const handlePlaneComplete = useCallback(() => {
    setActiveVehicle("rocket");
  }, []);

  const handleSatelliteComplete = useCallback(() => {
    setActiveVehicle("plane");
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const yBg = useTransform(scrollYProgress, [0, 1], ["0px", "100px"]);

  const yMountainsBg = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ["0px", "0px", "500px"],
  );
  const yMountainsMt2 = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ["0px", "0px", "550px"],
  );
  const yMountainsMt1 = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    ["0px", "0px", "450px"],
  );

  const xSun = useTransform(scrollYProgress, [0, 0.4], ["-250px", "0px"]);
  const ySun = useTransform(scrollYProgress, [0, 0.4], ["0px", "1120px"]);

  const yText = useTransform(
    scrollYProgress,
    [0, 0.3, 0.55],
    ["100vh", "100vh", "0vh"],
  );

  const xCloudLeft = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const xCloudRight = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityCloudsBottom = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const scaleMountains = useTransform(
    scrollYProgress,
    [0, 0.7, 1],
    [1.18, 1.18, 1],
  );

  const opacityHeroContent = useTransform(scrollYProgress, [0.65, 0.8], [1, 0]);
  const opacityCountdown = useTransform(scrollYProgress, [0.78, 0.97], [0, 1]);
  const yCountdown = useTransform(scrollYProgress, [0.78, 0.97], ["40px", "0px"]);

  return (
    <section ref={ref} className="relative min-h-[250vh] md:min-h-[500vh] w-full bg-goku-dark">
      <div className="sticky top-0 h-screen w-full">
        {/* BACKGROUND & PARALLAX LAYER - CLIPPED TO VIEWPORT */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Centered Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-goku-orange/20 rounded-full blur-[100px] md:blur-[120px] animate-pulse-glow" />

          {/* Gradient overlay at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-[20vh] bg-gradient-to-t from-goku-dark/50 to-transparent z-10" />

          {/* Stars */}
          <motion.img
            src={`${import.meta.env.BASE_URL}parallax/stars.svg`}
            alt=""
            style={{ y: yBg }}
            className="absolute top-[-550px] w-full min-w-[1000px] left-1/2 -translate-x-1/2 opacity-50 mix-blend-screen"
          />

          {/* Floating Clouds */}
          <FloatingCloud
            size="large"
            duration={95}
            delay={0}
            top="15%"
            opacity={0.5}
            startX="calc(-50vw)"
            endX="calc(150vw)"
          />
          <FloatingCloud
            size="xlarge"
            duration={80}
            delay={0}
            top="30%"
            opacity={0.4}
            startX="calc(-20vw)"
            endX="calc(160vw)"
          />
          <FloatingCloud
            size="medium"
            duration={40}
            delay={-10}
            top="50%"
            opacity={0.6}
            startX="-45vw"
            endX="calc(180vw)"
          />

          {/* Sun */}
          <motion.img
            src={`${import.meta.env.BASE_URL}parallax/sun.svg`}
            alt=""
            style={{ x: xSun, y: ySun }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="absolute top-[22%] sm:top-[20%] md:top-[18%] lg:top-[16%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[400px] md:w-[500px] mix-blend-screen"
          />

          {/* Rocket - flies behind mountains */}
          <FloatingRocket
            duration={14}
            opacity={0.9}
            isActive={activeVehicle === "rocket"}
            onComplete={handleRocketComplete}
          />

          {/* Satellite - curved arc path */}
          <FloatingSatellite
            duration={18}
            opacity={1}
            direction="left-to-right"
            startX="-10%"
            endX="110%"
            startY="5%"
            peakY="5%"
            isActive={activeVehicle === "satellite"}
            onComplete={handleSatelliteComplete}
          />

          {/* Mountain 1 (Back) */}
          <motion.img
            src={`${import.meta.env.BASE_URL}parallax/mountain-1.svg`}
            alt=""
            style={{
              x: "-50%",
              y: yMountainsBg,
              transformOrigin: "bottom center",
              scale: scaleMountains,
            }}
            className="absolute bottom-[28px] md:bottom-[28px] lg:bottom-[-90px] w-[200%] sm:w-[150%] md:w-full min-w-[1000px] left-1/2"
          />

          {/* Aeroplane flying across - between mountain 1 and mountain 3 */}
          <FloatingPlane
            duration={18}
            opacity={1}
            top="70%"
            direction="left-to-right"
            width="140px"
            isActive={activeVehicle === "plane"}
            onComplete={handlePlaneComplete}
          />

          {/* Mountain 3 (Middle) */}
          <motion.img
            src={`${import.meta.env.BASE_URL}parallax/mountain-3.svg`}
            alt=""
            style={{
              x: "-50%",
              y: yMountainsMt2,
              transformOrigin: "bottom center",
              scale: scaleMountains,
            }}
            className="absolute bottom-[80px] md:bottom-[26px] lg:bottom-[-8px] w-[200%] sm:w-[150%] md:w-full min-w-[1000px] left-1/2"
          />

          {/* Mountain 2 (Front) */}
          <motion.img
            src={`${import.meta.env.BASE_URL}parallax/mountain-2.svg`}
            alt=""
            style={{
              x: "-50%",
              y: yMountainsMt1,
              transformOrigin: "bottom center",
              scale: scaleMountains,
            }}
            className="absolute bottom-[-40px] md:bottom-[-72px] lg:bottom-[-176px] w-[200%] sm:w-[150%] md:w-full min-w-[1000px] left-1/2 drop-shadow-2xl z-20"
          />

          {/* Cloud Bottom */}
          <motion.img
            src={`${import.meta.env.BASE_URL}parallax/cloud-bottom.svg`}
            alt=""
            style={{ opacity: opacityCloudsBottom }}
            className="absolute bottom-[-130px] w-[200%] sm:w-[150%] md:w-full min-w-[1000px] left-1/2 -translate-x-1/2 mix-blend-screen z-20"
          />

          {/* Parallax Clouds Left/Right */}
          <motion.img
            src={`${import.meta.env.BASE_URL}parallax/clouds-left.svg`}
            alt=""
            style={{ x: xCloudLeft }}
            className="absolute top-[40%] left-0 w-[40%] md:w-[20%] mix-blend-screen z-20"
          />
          <motion.img
            src={`${import.meta.env.BASE_URL}parallax/clouds-right.svg`}
            alt=""
            style={{ x: xCloudRight }}
            className="absolute top-[40%] right-0 w-[40%] md:w-[20%] mix-blend-screen z-20"
          />
        </div>

        {/* FOREGROUND TEXT LAYER - INTERACTIVE */}
        <motion.div
          style={{ y: yText, opacity: opacityHeroContent }}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 text-center pointer-events-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-goku-indigo/30 bg-goku-indigo/10 backdrop-blur-md mb-8"
          >
            <Terminal size={14} className="text-white" />
            <span className="text-sm font-sans text-white tracking-widest uppercase font-bold">
              March 21-22, 2026
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-5xl sm:text-7xl md:text-9xl lg:text-[12rem] leading-none tracking-tight text-white mb-2 relative w-full"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-goku-yellow font-[shredded] to-[#B8A58D] drop-shadow-2xl">
              XCEPTHON
            </span>
            <div className="absolute -inset-x-2 sm:-inset-x-10 top-1/2 -translate-y-1/2 h-[4px] bg-goku-yellow opacity-80 mix-blend-screen shadow-[0_0_15px_rgba(216,197,173,0.8)] z-20 pointer-events-none scale-x-0 animate-[strike_1s_ease-out_0.8s_forwards]" />
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-accent text-lg sm:text-2xl md:text-4xl text-paper tracking-[0.05em] sm:tracking-[0.2em] uppercase mt-2 mb-8 md:mb-10 font-bold"
          >
            Where Exceptions Become Innovation
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-xl mx-auto text-gray-300 font-sans text-sm sm:text-base md:text-xl mb-10 md:mb-12"
          >
            Unleash your potential, push beyond the breaking point, and forge
            solutions that redefine the limits. 24 hours of intense coding,
            collaboration, and creation.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
          >
            <button className="relative px-6 py-3 md:px-8 md:py-4 bg-gray-500/50 text-gray-300 font-heading text-lg md:text-xl tracking-widest skew-x-[-10deg] transition-all duration-300 cursor-not-allowed">
              <span className="block skew-x-[10deg]">
                REGISTRATION CLOSED
              </span>
            </button>
            <a
              href="#tracks"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#tracks")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <button className="px-6 py-3 md:px-8 md:py-4 text-white font-accent text-base md:text-lg tracking-widest border-b-2 border-transparent hover:border-goku-yellow transition-all flex items-center gap-2 hover:text-goku-yellow">
                VIEW TRACKS
              </button>
            </a>
          </motion.div>
        </motion.div>

        {/* Countdown overlay — appears after mountains scroll down */}
        <motion.div
          style={{ opacity: opacityCountdown, y: yCountdown }}
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"        >
          <Countdown sectionClassName="bg-transparent" />
        </motion.div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes strike {
              0% { transform: scaleX(0); opacity: 0; }
              50% { opacity: 1; }
              100% { transform: scaleX(0.8); opacity: 0; }
            }

          `,
        }}
      />
    </section>
  );
};

export default Hero;
