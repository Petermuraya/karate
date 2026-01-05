const schedule = [
  { day: "Monday", classes: [{ time: "4:00 PM", name: "Kids Karate", level: "All Levels" }, { time: "6:00 PM", name: "Adult Beginners", level: "White-Yellow" }] },
  { day: "Tuesday", classes: [{ time: "5:00 PM", name: "Teens Training", level: "All Levels" }, { time: "7:00 PM", name: "Adult Advanced", level: "Green+" }] },
  { day: "Wednesday", classes: [{ time: "4:00 PM", name: "Kids Karate", level: "All Levels" }, { time: "6:00 PM", name: "Self Defense", level: "All Levels" }] },
  { day: "Thursday", classes: [{ time: "5:00 PM", name: "Kata Focus", level: "Orange+" }, { time: "7:00 PM", name: "Sparring", level: "Green+" }] },
  { day: "Friday", classes: [{ time: "4:00 PM", name: "Kids Karate", level: "All Levels" }, { time: "6:00 PM", name: "Open Training", level: "All Levels" }] },
  { day: "Saturday", classes: [{ time: "10:00 AM", name: "Advanced Combat", level: "Brown+" }, { time: "12:00 PM", name: "Family Class", level: "All Ages" }] },
];

export const ScheduleSection = () => {
  return (
    <section id="schedule" className="relative px-6 py-32">
      <div className="container max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Weekly Schedule
          </span>
          <h2 className="font-display text-5xl md:text-6xl mb-4">
            FIND YOUR <span className="text-primary">CLASS</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Train up to 6 days a week with classes designed for every skill level and schedule.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.map((day) => (
            <div
              key={day.day}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
            >
              <h3 className="font-display text-2xl text-primary mb-4">{day.day}</h3>
              
              <div className="space-y-4">
                {day.classes.map((cls) => (
                  <div key={cls.time} className="flex items-start gap-4">
                    <div className="text-sm text-muted-foreground w-20 flex-shrink-0">
                      {cls.time}
                    </div>
                    <div>
                      <div className="font-medium">{cls.name}</div>
                      <div className="text-xs text-muted-foreground">{cls.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            * Sunday: Competition Team Training (By Invitation Only) • Dojo Closed for Open Mat
          </p>
        </div>
      </div>
    </section>
  );
};
