import { motion } from 'framer-motion';
import { useMyEnrollments, useUnenrollFromClass } from '@/hooks/useEnrollments';
import { Calendar, Clock, MapPin, UserMinus, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function MyEnrollments() {
  const { data: enrollments, isLoading } = useMyEnrollments();
  const unenrollMutation = useUnenrollFromClass();
  const { toast } = useToast();

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleUnenroll = async (classId: string, classTitle: string) => {
    try {
      await unenrollMutation.mutateAsync(classId);
      toast({ title: 'Unenrolled', description: `You've been removed from ${classTitle}` });
    } catch (error) {
      toast({ title: 'Error', description: 'Could not unenroll', variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-secondary rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-16 bg-secondary rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!enrollments || enrollments.length === 0) {
    return null; // Don't show section if no enrollments
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-card border border-border rounded-xl p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <h2 className="font-display text-lg sm:text-xl text-foreground tracking-wide">MY ENROLLED CLASSES</h2>
        </div>
        <span className="text-sm text-muted-foreground mt-2 sm:mt-0">
          {enrollments.length} class{enrollments.length !== 1 ? 'es' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {enrollments.map((enrollment, index) => (
          <motion.div
            key={enrollment.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            className="bg-green-500/5 border border-green-500/20 rounded-lg p-3 sm:p-4"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{enrollment.classes.title}</h3>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {enrollment.classes.day_of_week}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatTime(enrollment.classes.start_time)} - {formatTime(enrollment.classes.end_time)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {enrollment.classes.location}
                  </span>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUnenroll(enrollment.class_id, enrollment.classes.title)}
                disabled={unenrollMutation.isPending}
                className="text-destructive hover:text-destructive border-destructive/30"
              >
                <UserMinus className="w-4 h-4 mr-1" />
                Unenroll
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
