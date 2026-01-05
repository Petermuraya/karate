import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import instructorImage from "@/assets/instructor.jpg";

const stats = [
  { value: 8, label: "Medals" },
  { value: 4, label: "Trophies" },
  { value: 2, label: "Dan" },
  { value: 15, label: "Years", suffix: "+" },
];

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count}{suffix}</span>;
};

export const InstructorSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="instructor" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-transparent blur-2xl" />
              <img
                src={instructorImage}
                alt="Sensei Kevin Kiarie Nyambura - Head Instructor"
                className="relative w-72 md:w-80 lg:w-96 border-4 border-gold shadow-2xl"
              />
              {/* Belt badge */}
              <motion.div
                animate={{ boxShadow: ["0 0 15px hsl(45 100% 51% / 0.3)", "0 0 30px hsl(45 100% 51% / 0.6)", "0 0 15px hsl(45 100% 51% / 0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-4 -right-4 bg-gold text-gold-foreground px-4 py-2"
              >
                <span className="font-display text-lg tracking-wider">2ND DAN</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
              Meet Your Sensei
            </span>
            
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-2">
              KEVIN KIARIE
            </h2>
            <h3 className="font-display text-2xl md:text-3xl text-primary mb-6">
              NYAMBURA
            </h3>

            <div className="inline-block bg-primary text-primary-foreground px-4 py-2 mb-6">
              <span className="font-display text-sm tracking-wider">2nd Degree Black Belt • Head Instructor</span>
            </div>

            <p className="text-muted-foreground leading-relaxed mb-6">
              Born in 1986 and driven by an unwavering passion for martial arts, Sensei Kevin began his karate journey at the age of 12. With over 15 years of dedicated training and competition experience, he has earned numerous national and international accolades.
            </p>

            <p className="text-muted-foreground leading-relaxed mb-8">
              His teaching philosophy combines traditional Shotokan discipline with modern training methodologies, creating champions both on and off the mat.
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="text-center p-4 bg-card border border-border"
                >
                  <div className="font-display text-3xl md:text-4xl text-primary">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};