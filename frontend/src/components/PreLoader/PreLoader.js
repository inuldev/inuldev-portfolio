import { motion } from "framer-motion";

import "./PreLoader.css";

const PreLoader = () => {
  // Variasi animasi untuk logo
  const logoVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1.2,
      },
    },
  };

  // Variasi animasi untuk dots
  const dotVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: [0.3, 1, 0.3],
      scale: [0.8, 1.2, 0.8],
      y: 0,
      transition: {
        delay: i * 0.1,
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut",
      },
    }),
  };

  // Variasi animasi untuk teks
  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.5,
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  // Variasi animasi untuk container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <motion.div
      className="pre-loader"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div className="logo-container" variants={logoVariants}>
        <motion.img
          src="/favicon/favicon.png"
          className="logo-image"
          animate={{
            boxShadow: [
              "0 0 10px rgba(0, 255, 195, 0.3)",
              "0 0 20px rgba(0, 255, 195, 0.5)",
              "0 0 30px rgba(0, 255, 195, 0.7)",
              "0 0 20px rgba(0, 255, 195, 0.5)",
              "0 0 10px rgba(0, 255, 195, 0.3)",
            ],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>

      <motion.div className="dots-container">
        {[0, 1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            className="loading-dot"
            variants={dotVariants}
            custom={index}
          />
        ))}
      </motion.div>

      <motion.div className="loading-text-container" variants={textVariants}>
        <h2>INUL DEV</h2>
        <p>Portfolio Loading...</p>
      </motion.div>
    </motion.div>
  );
};

export default PreLoader;
