import { Shield, Heart, Brain, Flame } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Discipline",
    japanese: "規律",
    description: "The foundation of all martial arts mastery",
  },
  {
    icon: Heart,
    title: "Respect",
    japanese: "尊敬",
    description: "Honor for self, instructors, and fellow students",
  },
  {
    icon: Brain,
    title: "Focus",
    japanese: "集中",
    description: "Mental clarity through physical training",
  },
  {
    icon: Flame,
    title: "Spirit",
    japanese: "精神",
    description: "Unwavering determination and perseverance",
  },
];

export const AboutSection = () => {
  return (
    <section id="about" className="relative px-6 py-32 bg-secondary/30">
      <div className="container max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
              Our Philosophy
            </span>
            <h2 className="font-display text-5xl md:text-6xl mb-6">
              THE WAY OF THE <span className="text-primary">EMPTY HAND</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-6">
              Iron Fist Dojo was founded in 1999 by Sensei Takeshi Yamamoto, a 7th-dan black belt with over 40 years of experience in traditional Shotokan karate.
            </p>
            
            <p className="text-muted-foreground mb-8">
              We believe that true martial arts training goes beyond physical techniques. Our curriculum emphasizes character development, mental fortitude, and the ancient principles that have guided karate practitioners for centuries.
            </p>
            
            <div className="flex items-center gap-6 p-6 bg-card rounded-xl border border-border">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <span className="font-display text-2xl text-primary">7段</span>
                </div>
              </div>
              <div>
                <div className="font-display text-xl">SENSEI TAKESHI YAMAMOTO</div>
                <div className="text-sm text-muted-foreground">Founder & Chief Instructor</div>
              </div>
            </div>
          </div>
          
          {/* Right - Values Grid */}
          <div className="grid grid-cols-2 gap-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                  <value.icon className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                
                <div className="flex items-baseline gap-3 mb-2">
                  <h3 className="font-display text-xl">{value.title}</h3>
                  <span className="text-primary text-sm">{value.japanese}</span>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
