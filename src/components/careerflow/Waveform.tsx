import { motion } from "framer-motion";

export const Waveform = () => {
  return (
    <div className="flex items-center justify-center gap-1 h-12">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 bg-primary-glow rounded-full"
          animate={{
            height: [
              "20%",
              Math.random() * 80 + 20 + "%",
              Math.random() * 80 + 20 + "%",
              "20%",
            ],
          }}
          transition={{
            duration: 0.5 + Math.random() * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
