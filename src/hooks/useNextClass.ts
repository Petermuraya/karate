import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Class } from '@/hooks/useClasses';

function parseTimeToHoursMinutes(time: string) {
  // Accept formats like HH:MM or HH:MM:SS
  const parts = time.split(':').map((p) => parseInt(p, 10));
  const hours = Number.isNaN(parts[0]) ? 0 : parts[0];
  const minutes = Number.isNaN(parts[1]) ? 0 : parts[1];
  return { hours, minutes };
}

export function useNextClass(program?: string) {
  return (() => {
    const q = useQuery<{ nextClass: Class | null; startsAt: Date | null }, Error>({
      queryKey: ['next-class', program],
      queryFn: async () => {
        let query = supabase.from('classes').select('*').eq('is_active', true);
        if (program && program !== 'all') query = query.eq('program', program);

        const { data, error } = await query;
        if (error) throw error;

        const classes = (data || []) as Class[];

        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const now = new Date();

        let best: { cls: Class; startsAt: Date } | null = null;

        for (const cls of classes) {
          if (!cls.day_of_week || !cls.start_time) continue;

          const targetDay = days.indexOf(cls.day_of_week);
          if (targetDay === -1) continue;

          const { hours, minutes } = parseTimeToHoursMinutes(cls.start_time);

          // Build occurrence for this week's target day
          const todayIndex = now.getDay(); // 0..6 Sun..Sat
          let daysDiff = targetDay - todayIndex;
          if (daysDiff < 0) daysDiff += 7;

          const occurrence = new Date(now);
          occurrence.setHours(0, 0, 0, 0);
          occurrence.setDate(occurrence.getDate() + daysDiff);
          occurrence.setHours(hours, minutes, 0, 0);

          // If occurrence is today but time already passed, skip to next week's occurrence
          if (occurrence <= now) {
            // if same-day and already passed, or occurrence equals now, move forward 7 days
            occurrence.setDate(occurrence.getDate() + 7);
          }

          if (occurrence > now) {
            if (!best || occurrence < best.startsAt) {
              best = { cls, startsAt: occurrence };
            }
          }
        }

        return {
          nextClass: best ? best.cls : null,
          startsAt: best ? best.startsAt : null,
        };
      },
    });

    return {
      nextClass: q.data?.nextClass ?? null,
      startsAt: q.data?.startsAt ?? null,
      isLoading: q.isLoading,
      error: q.error ?? undefined,
    };
  })();
}

export default useNextClass;
