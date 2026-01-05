import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const belts = [
  { name: "White Belt", level: "Beginner", japanese: "白帯", color: "bg-gray-100 text-gray-900", description: "The beginning of the journey. Learn basic stances, blocks, and strikes." },
  { name: "Yellow Belt", level: "10th-9th Kyu", japanese: "黄帯", color: "bg-yellow-400 text-gray-900", description: "Foundation building. Master basic kata and improve coordination." },
  { name: "Orange Belt", level: "8th-7th Kyu", japanese: "橙帯", color: "bg-orange-500 text-white", description: "Developing technique. Introduction to sparring and advanced kata." },
  { name: "Green Belt", level: "6th-5th Kyu", japanese: "緑帯", color: "bg-green-600 text-white", description: "Growth phase. Refine techniques and develop fighting strategy." },
  { name: "Blue Belt", level: "4th-3rd Kyu", japanese: "青帯", color: "bg-blue-600 text-white", description: "Intermediate mastery. Complex kata and competitive sparring." },
  { name: "Brown Belt", level: "2nd-1st Kyu", japanese: "茶帯", color: "bg-amber-800 text-white", description: "Advanced preparation. Ready for black belt examination." },
  { name: "Black Belt", level: "1st Dan+", japanese: "黒帯", color: "bg-black text-white border border-white/20", description: "The true beginning. A lifelong journey of mastery and teaching." },
];

export const BeltProgressionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="section-padding bg-secondary/20" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Karate Progression
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
            THE PATH TO <span className="text-primary">MASTERY</span>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-2">
          {belts.map((belt, index) => (
            <motion.div
              key={belt.name}
              initial={{ opacity: 0, x: -40 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`
                relative overflow-hidden transition-all duration-500 cursor-pointer
                ${belt.color}
                ${hoveredIndex === index ? "h-32 md:h-28" : "h-14"}
              `}
            >
              <div className="absolute inset-0 flex items-center px-6 md:px-12">
                <div className="flex items-center gap-4 md:gap-8 w-full">
                  <span className="font-display text-lg md:text-xl tracking-wider min-w-[120px] md:min-w-[160px]">
                    {belt.name}
                  </span>
                  <span className="hidden md:block text-sm opacity-70">
                    {belt.level}
                  </span>
                  <span className="hidden lg:block text-lg ml-auto">
                    {belt.japanese}
                  </span>
                </div>
              </div>
              
              {/* Expanded content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: hoveredIndex === index ? 1 : 0, y: hoveredIndex === index ? 0 : 20 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-4"
              >
                <p className="text-sm opacity-90 max-w-2xl">
                  {belt.description}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};