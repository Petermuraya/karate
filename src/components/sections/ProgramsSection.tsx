import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, Swords, Baby, Trophy } from "lucide-react";

const programs = [
  {
    icon: Baby,
    title: "Kids Karate",
    age: "Ages 5-12",
    description: "Focus, discipline, and fun. Building character through martial arts.",
    features: ["Character Development", "Coordination Skills", "Self-Confidence"],
  },
  {
    icon: Users,
    title: "Teen Training",
    age: "Ages 13-17",
    description: "Channel energy positively. Develop focus and self-defense skills.",
    features: ["Anti-Bullying Skills", "Physical Fitness", "Leadership"],
  },
  {
    icon: Swords,
    title: "Adult Classes",
    age: "Ages 18+",
    description: "Stress relief, fitness, and mastery. Traditional training for modern life.",
    features: ["Stress Management", "Full-Body Workout", "Self-Defense"],
  },
  {
    icon: Trophy,
    title: "Competition Team",
    age: "By Selection",
    description: "Elite training for tournament champions. Compete nationally and internationally.",
    features: ["Tournament Prep", "Advanced Kata", "Strategic Sparring"],
  },
];

export const ProgramsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="programs" className="section-padding bg-background" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Training Programs
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-4">
            TRAIN WITH <span className="text-primary">PURPOSE</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Structured programs for every age and skill level. Find your path to mastery.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((program, index) => (
            <motion.div
              key={program.title}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-card border border-border p-8 transition-all duration-300 hover:border-primary/50 cursor-pointer"
            >
              {/* Red underline on hover */}
              <motion.div
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                className="absolute bottom-0 left-0 h-1 bg-primary"
              />

              <div className="w-14 h-14 bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
                <program.icon className="w-7 h-7 text-primary transition-colors group-hover:text-primary-foreground" />
              </div>

              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-display text-xl tracking-wider">
                  {program.title}
                </h3>
              </div>

              <span className="inline-block text-xs text-primary bg-primary/10 px-2 py-1 mb-4">
                {program.age}
              </span>

              <p className="text-muted-foreground text-sm mb-6">
                {program.description}
              </p>

              <ul className="space-y-2">
                {program.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};