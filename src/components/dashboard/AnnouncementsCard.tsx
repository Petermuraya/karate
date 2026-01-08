import { motion } from 'framer-motion';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Megaphone, AlertCircle, Info } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export function AnnouncementsCard() {
  const { data: announcements, isLoading } = useAnnouncements();

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="w-4 h-4 text-primary" />;
      default:
        return <Info className="w-4 h-4 text-muted-foreground" />;
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

  const recentAnnouncements = announcements?.slice(0, 3) || [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-card border border-border rounded-xl p-4 sm:p-6"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6">
        <h2 className="font-display text-lg sm:text-xl text-foreground tracking-wide">ANNOUNCEMENTS</h2>
        <Megaphone className="w-5 h-5 text-primary mt-3 sm:mt-0" />
      </div>

      {recentAnnouncements.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No announcements</p>
      ) : (
        <div className="space-y-3">
          {recentAnnouncements.map((announcement, index) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className={`rounded-lg p-3 sm:p-4 ${
                announcement.priority === 'high' 
                  ? 'bg-primary/10 border border-primary/20' 
                  : 'bg-secondary/50'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-shrink-0">{getPriorityIcon(announcement.priority)}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm sm:text-base">{announcement.title}</h3>
                  <p className="text-muted-foreground text-sm mt-1 line-clamp-3">
                    {announcement.content}
                  </p>
                  <p className="text-muted-foreground text-xs mt-2">
                    {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
