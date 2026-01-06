import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Class {
  id: string;
  title: string;
  description: string | null;
  program: string;
  level: string | null;
  location: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  capacity: number | null;
  instructor_id: string | null;
  is_active: boolean;
}

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week');
      
      if (error) throw error;
      return data as Class[];
    }
  });
}

export function useUpcomingClasses(program?: string) {
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const today = new Date();
  const currentDay = dayOrder[today.getDay() === 0 ? 6 : today.getDay() - 1];
  
  return useQuery({
    queryKey: ['upcoming-classes', program],
    queryFn: async () => {
      let query = supabase
        .from('classes')
        .select('*')
        .eq('is_active', true);
      
      if (program && program !== 'all') {
        query = query.eq('program', program);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Sort by upcoming day
      const currentDayIndex = dayOrder.indexOf(currentDay);
      const sorted = (data as Class[]).sort((a, b) => {
        const aIndex = dayOrder.indexOf(a.day_of_week);
        const bIndex = dayOrder.indexOf(b.day_of_week);
        
        // Adjust indices relative to current day
        const aAdjusted = aIndex >= currentDayIndex ? aIndex - currentDayIndex : aIndex + 7 - currentDayIndex;
        const bAdjusted = bIndex >= currentDayIndex ? bIndex - currentDayIndex : bIndex + 7 - currentDayIndex;
        
        if (aAdjusted !== bAdjusted) return aAdjusted - bAdjusted;
        return a.start_time.localeCompare(b.start_time);
      });
      
      return sorted;
    }
  });
}
