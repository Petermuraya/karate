import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Clock } from "lucide-react";

const schedule = [
  { day: "Monday", classes: [{ time: "4:00 PM", name: "Kids Karate" }, { time: "6:00 PM", name: "Adult Beginners" }] },
  { day: "Tuesday", classes: [{ time: "5:00 PM", name: "Teen Training" }, { time: "7:00 PM", name: "Adult Advanced" }] },
  { day: "Wednesday", classes: [{ time: "4:00 PM", name: "Kids Karate" }, { time: "6:00 PM", name: "Self Defense" }] },
  { day: "Thursday", classes: [{ time: "5:00 PM", name: "Kata Focus" }, { time: "7:00 PM", name: "Sparring" }] },
  { day: "Friday", classes: [{ time: "4:00 PM", name: "Kids Karate" }, { time: "6:00 PM", name: "Open Training" }] },
  { day: "Saturday", classes: [{ time: "10:00 AM", name: "Competition Team" }, { time: "12:00 PM", name: "Family Class" }] },
];

const locations = [
  {
    name: "Main Dojo",
    address: "1234 Warrior Way, Suite 100",
    city: "Los Angeles, CA 90001",
    phone: "(555) 123-4567",
  },
  {
    name: "Westside Branch",
    address: "5678 Champions Blvd",
    city: "Santa Monica, CA 90401",
    phone: "(555) 987-6543",
  },
];

export const ScheduleSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="schedule" className="section-padding bg-secondary/30" ref={ref}>
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-widest mb-4 block">
            Locations & Schedule
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">
            FIND YOUR <span className="text-primary">CLASS</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Locations */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl mb-6 flex items-center gap-3">
              <MapPin className="w-6 h-6 text-primary" />
              Locations
            </h3>
            {locations.map((location, index) => (
              <motion.div
                key={location.name}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 8 }}
                className="bg-card border border-border p-6 hover:border-primary/50 transition-all cursor-pointer group"
              >
                <h4 className="font-display text-lg text-primary mb-2">{location.name}</h4>
                <p className="text-sm text-muted-foreground">{location.address}</p>
                <p className="text-sm text-muted-foreground">{location.city}</p>
                <p className="text-sm text-foreground mt-2">{location.phone}</p>
                
                {/* Pulse on hover */}
                <motion.div
                  className="w-3 h-3 bg-primary rounded-full mt-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </div>

          {/* Schedule Grid */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-primary" />
              Weekly Schedule
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {schedule.map((day, index) => (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-card border border-border p-5 hover:border-primary/50 transition-all"
                >
                  <h4 className="font-display text-xl text-primary mb-4">{day.day}</h4>
                  <div className="space-y-3">
                    {day.classes.map((cls) => (
                      <div key={cls.time} className="flex items-start gap-3">
                        <span className="text-xs text-muted-foreground w-16 flex-shrink-0 pt-0.5">
                          {cls.time}
                        </span>
                        <span className="text-sm">{cls.name}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};