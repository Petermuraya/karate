import { Users, Swords, Baby, Trophy } from "lucide-react";

const programs = [
  {
    icon: Baby,
    title: "KIDS KARATE",
    age: "Ages 5-12",
    description: "Build confidence, discipline, and coordination through fun, engaging martial arts training designed for young warriors.",
    schedule: "Mon, Wed, Fri • 4:00 PM",
  },
  {
    icon: Users,
    title: "ADULT CLASSES",
    age: "Ages 13+",
    description: "Master traditional Shotokan karate techniques while improving fitness, reducing stress, and developing self-defense skills.",
    schedule: "Tue, Thu • 7:00 PM",
  },
  {
    icon: Swords,
    title: "ADVANCED COMBAT",
    age: "Brown Belt+",
    description: "Intensive sparring and kata training for experienced practitioners preparing for competition or black belt testing.",
    schedule: "Sat • 10:00 AM",
  },
  {
    icon: Trophy,
    title: "COMPETITION TEAM",
    age: "By Invitation",
    description: "Elite training program for tournament competitors. Specialized coaching in kata and kumite for regional and national events.",
    schedule: "Sun • 9:00 AM",
  },
];

export const ProgramsSection = () => {
  return (
    <section id="programs" className="relative px-6 py-32 overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      
      <div className="container max-w-6xl relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div>
            <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
              Our Programs
            </span>
            <h2 className="font-display text-5xl md:text-6xl">
              TRAIN WITH <span className="text-primary">PURPOSE</span>
            </h2>
          </div>
          <p className="text-muted-foreground max-w-md">
            From beginners to black belts, we offer programs tailored to every skill level and age group.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          {programs.map((program, index) => (
            <div
              key={program.title}
              className="group relative bg-card border border-border rounded-xl p-8 transition-all duration-300 hover:border-primary/50 hover:bg-card/80 cursor-pointer overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center transition-all duration-300 group-hover:bg-primary group-hover:border-primary">
                    <program.icon className="w-7 h-7 text-primary transition-colors group-hover:text-primary-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                    {program.age}
                  </span>
                </div>
                
                <h3 className="font-display text-2xl mb-3 group-hover:text-primary transition-colors">
                  {program.title}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {program.description}
                </p>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-foreground">{program.schedule}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
