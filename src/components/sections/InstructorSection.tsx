import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Award, Trophy, Star, Calendar } from "lucide-react";
import instructorImage from "@/assets/instructor.png";

const stats = [
  { value: 8, label: "Medals", icon: Award, color: "text-yellow-500" },
  { value: 4, label: "Trophies", icon: Trophy, color: "text-amber-500" },
  { value: 2, label: "Dan Grade", icon: Star, color: "text-primary" },
  { value: 15, label: "Years Exp", icon: Calendar, color: "text-emerald-500" },
];

const AnimatedCounter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const duration = 1500;
      const steps = 30;
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
    <section id="instructor" className="section-padding bg-gradient-to-b from-background to-secondary/20" ref={ref}>
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 md:mb-16"
          >
            <span className="inline-block text-primary font-medium text-sm uppercase tracking-widest mb-3">
              Meet Your Guide
            </span>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-3">
              MEET YOUR SENSEI
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6" />
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn from a seasoned master with decades of experience in traditional and competitive karate
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Image Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="order-2 lg:order-1"
            >
              <div className="relative group">
                {/* Main Image Container */}
                <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl shadow-2xl">
                  <img
                    src={instructorImage}
                    alt="Sensei Kevin Kiarie Nyambura demonstrating technique"
                    className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                </div>

                {/* Floating Stats Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="absolute -bottom-6 -right-6 bg-background border-2 border-primary/20 shadow-xl rounded-xl p-4 w-32"
                >
                  <div className="text-center">
                    <div className="font-display text-3xl text-primary mb-1">
                      <AnimatedCounter value={2} />nd
                    </div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">
                      Dan Black Belt
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -left-4 w-24 h-24 border-t-2 border-l-2 border-primary/30 rounded-tl-2xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-2 border-l-2 border-primary/30 rounded-bl-2xl" />
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="order-1 lg:order-2"
            >
              {/* Name & Title */}
              <div className="mb-8">
                <div className="flex flex-col sm:flex-row sm:items-end gap-2 sm:gap-4 mb-4">
                  <h3 className="font-display text-3xl md:text-4xl lg:text-5xl">
                    KEVIN KIARIE
                  </h3>
                  <h4 className="font-display text-2xl md:text-3xl text-primary">
                    NYAMBURA
                  </h4>
                </div>
                
                <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="font-medium text-primary text-sm uppercase tracking-wider">
                    2nd Degree Black Belt • Head Instructor
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-6 mb-10">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Born in 1986 and driven by an unwavering passion for martial arts, Sensei Kevin began his karate journey at the age of 12. With over 15 years of dedicated training and competition experience, he has earned numerous national and international accolades.
                </p>
                
                <p className="text-lg text-muted-foreground leading-relaxed">
                  His teaching philosophy combines traditional Shotokan discipline with modern training methodologies, creating champions both on and off the mat.
                </p>
              </div>

              {/* Stats Grid - Improved Layout */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                      className="relative group"
                    >
                      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-5 text-center hover:border-primary/30 transition-all duration-300 hover:shadow-lg">
                        {/* Icon */}
                        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${stat.color}/10 mb-3`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        
                        {/* Counter */}
                        <div className="font-display text-3xl md:text-4xl text-foreground mb-1">
                          <AnimatedCounter value={stat.value} suffix={stat.label === "Years Exp" ? "+" : ""} />
                        </div>
                        
                        {/* Label */}
                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                          {stat.label}
                        </div>
                        
                        {/* Hover Effect Line */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-primary group-hover:w-16 transition-all duration-300" />
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Teaching Philosophy */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-10 pt-8 border-t border-border/50"
              >
                <h4 className="font-display text-xl mb-4 text-foreground">Teaching Philosophy</h4>
                <div className="flex flex-wrap gap-3">
                  {["Discipline First", "Modern Techniques", "Personal Growth", "Champion Mindset"].map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
                    >
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                      {item}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};