import { motion } from 'framer-motion';
import { useUpcomingClasses } from '@/hooks/useClasses';
import { useAuth } from '@/hooks/useAuth';
import { useMyEnrollments, useEnrollInClass, useUnenrollFromClass } from '@/hooks/useEnrollments';
import { Calendar, Clock, MapPin, UserPlus, UserMinus, CheckCircle, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { buildICS, googleCalendarUrl } from '@/lib/calendar';
import { useToast } from '@/hooks/use-toast';

export function UpcomingClasses() {
  const { profile, user } = useAuth();
  const { data: classes, isLoading } = useUpcomingClasses(profile?.program);
  const { data: myEnrollments } = useMyEnrollments();
  const enrollMutation = useEnrollInClass();
  const unenrollMutation = useUnenrollFromClass();
  const { toast } = useToast();

  const enrolledClassIds = new Set((myEnrollments || []).map(e => e.class_id));

  const handleEnroll = async (classId: string, classTitle: string) => {
    try {
      await enrollMutation.mutateAsync(classId);
      toast({ title: 'Enrolled!', description: `You're now enrolled in ${classTitle}` });
    } catch (error: any) {
      toast({ 
        title: 'Enrollment failed', 
        description: error.message?.includes('duplicate') ? 'Already enrolled in this class' : 'Could not enroll',
        variant: 'destructive' 
      });
    }
  };

  const handleUnenroll = async (classId: string, classTitle: string) => {
    try {
      await unenrollMutation.mutateAsync(classId);
      toast({ title: 'Unenrolled', description: `You've been removed from ${classTitle}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not unenroll', variant: 'destructive' });
    }
  };

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

  function parseTime(t: string | undefined) {
    if (!t) return 60;
    const [h, m] = (t || '').split(':').map((s) => parseInt(s || '0', 10));
    return (h * 60) + (m || 0);
  }

  function getNextDateForDay(dayOfWeek: string, time: string | undefined) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const target = days.indexOf(dayOfWeek);
    const today = new Date();
    const todayIdx = today.getDay();
    let diff = target - todayIdx;
    if (diff < 0) diff += 7;
    const result = new Date();
    result.setDate(today.getDate() + diff);
    const [h = '0', m = '0'] = (time || '00:00').split(':');
    result.setHours(parseInt(h, 10));
    result.setMinutes(parseInt(m, 10));
    result.setSeconds(0);
    result.setMilliseconds(0);
    return result;
  }

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
      className="bg-card border border-border rounded-xl p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <h2 className="font-display text-lg sm:text-xl text-foreground tracking-wide">UPCOMING CLASSES</h2>
        <Calendar className="w-5 h-5 text-primary mt-3 sm:mt-0" />
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
              className="bg-secondary/50 rounded-lg p-3 sm:p-4 hover:bg-secondary transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{cls.title}</h3>
                    {enrolledClassIds.has(cls.id) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/20 text-green-600 text-xs font-medium">
                        <CheckCircle className="w-3 h-3" />
                        Enrolled
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {formatTime(cls.start_time)} - {formatTime(cls.end_time)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {cls.location}
                    </span>
                    {cls.capacity && (
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {cls.capacity} spots
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-center justify-end gap-2">
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
                      <p className="text-xs text-muted-foreground capitalize">{cls.level}</p>
                    )}
                  </div>

                  {/* Enrollment Button */}
                  {user && (
                    <div className="mt-2">
                      {enrolledClassIds.has(cls.id) ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUnenroll(cls.id, cls.title)}
                          disabled={unenrollMutation.isPending}
                          className="text-destructive hover:text-destructive"
                        >
                          <UserMinus className="w-4 h-4 mr-1" />
                          Unenroll
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleEnroll(cls.id, cls.title)}
                          disabled={enrollMutation.isPending}
                        >
                          <UserPlus className="w-4 h-4 mr-1" />
                          Enroll
                        </Button>
                      )}
                    </div>
                  )}

                  <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const starts = getNextDateForDay(cls.day_of_week, cls.start_time);
                        const ends = new Date(starts.getTime() + ((parseTime(cls.end_time) - parseTime(cls.start_time)) || 60) * 60000);
                        const ev = {
                          title: cls.title,
                          description: cls.description || '',
                          location: cls.location || '',
                          startsAt: starts,
                          endsAt: ends,
                        };
                        const url = googleCalendarUrl(ev as any);
                        window.open(url, '_blank');
                      }}
                      className="w-full sm:w-auto"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Google
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        const starts = getNextDateForDay(cls.day_of_week, cls.start_time);
                        const ends = new Date(starts.getTime() + ((parseTime(cls.end_time) - parseTime(cls.start_time)) || 60) * 60000);
                        const ev = {
                          title: cls.title,
                          description: cls.description || '',
                          location: cls.location || '',
                          startsAt: starts,
                          endsAt: ends,
                        };
                        const ics = buildICS(ev as any);
                        const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
                        const href = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = href;
                        a.download = `${(cls.title || 'event').replace(/[^a-z0-9]/gi, '_')}.ics`;
                        document.body.appendChild(a);
                        a.click();
                        a.remove();
                        setTimeout(() => URL.revokeObjectURL(href), 10000);
                      }}
                    >
                      Download
                    </Button>
                  </div>
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
