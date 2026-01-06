import { motion } from 'framer-motion';
import { useUpcomingClasses } from '@/hooks/useClasses';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';

export function UpcomingClasses() {
  const { profile } = useAuth();
  const { data: classes, isLoading } = useUpcomingClasses(profile?.program);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getDaysUntil = (dayOfWeek: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = new Date().getDay();
    const targetDay = days.indexOf(dayOfWeek);
    let diff = targetDay - today;
    if (diff < 0) diff += 7;
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return dayOfWeek;
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-secondary rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-secondary rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const upcomingClasses = classes?.slice(0, 4) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl text-foreground tracking-wide">UPCOMING CLASSES</h2>
        <Calendar className="w-5 h-5 text-primary" />
      </div>

      {upcomingClasses.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No upcoming classes found</p>
      ) : (
        <div className="space-y-3">
          {upcomingClasses.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="bg-secondary/50 rounded-lg p-4 hover:bg-secondary transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{cls.title}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {cls.location}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    getDaysUntil(cls.day_of_week) === 'Today' 
                      ? 'bg-primary text-primary-foreground' 
                      : getDaysUntil(cls.day_of_week) === 'Tomorrow'
                      ? 'bg-gold/20 text-gold'
                      : 'bg-secondary text-foreground'
                  }`}>
                    {getDaysUntil(cls.day_of_week)}
                  </span>
                  {cls.level && (
                    <p className="text-xs text-muted-foreground mt-1 capitalize">{cls.level}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <a 
        href="#schedule" 
        className="block mt-4 text-center text-primary hover:text-primary/80 text-sm font-medium"
      >
        View Full Schedule →
      </a>
    </motion.div>
  );
}
