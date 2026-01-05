import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const words = ["Discipline", "Respect", "Honor", "Strength"];

export const PhilosophySection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="philosophy" className="section-padding bg-background relative overflow-hidden" ref={ref}>
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-30"
        style={{ background: "var(--gradient-glow)" }}
      />
      
      <div className="container-custom text-center relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-primary font-medium text-sm uppercase tracking-widest mb-8 block"
        >
          Our Philosophy
        </motion.span>

        {/* Animated Words */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 md:gap-x-8 gap-y-4 mb-12">
          {words.map((word, index) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="relative"
            >
              <span className="font-display text-4xl md:text-6xl lg:text-7xl tracking-wider">
                {word}
              </span>
              {/* Expanding underline */}
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: "100%" } : {}}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.1 }}
                className="absolute -bottom-2 left-0 h-1 bg-primary"
              />
              {index < words.length - 1 && (
                <span className="hidden md:inline font-display text-4xl md:text-6xl lg:text-7xl text-primary ml-4 md:ml-8">
                  •
                </span>
              )}
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light italic"
        >
          "Karate is not about fighting — it is about mastering self."
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-8 text-sm text-muted-foreground uppercase tracking-widest"
        >
          — Gichin Funakoshi
        </motion.div>
      </div>
    </section>
  );
};