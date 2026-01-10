import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Enrollment {
  id: string;
  user_id: string;
  class_id: string;
  enrolled_at: string;
  status: 'enrolled' | 'waitlisted' | 'cancelled';
}

export interface EnrollmentWithClass extends Enrollment {
  classes: {
    id: string;
    title: string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    location: string;
    program: string;
    level: string | null;
  };
}

export interface ClassEnrollmentCount {
  class_id: string;
  count: number;
}

// Get current user's enrollments
export function useMyEnrollments() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['my-enrollments', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          classes (
            id, title, day_of_week, start_time, end_time, location, program, level
          )
        `)
        .eq('user_id', user.id)
        .eq('status', 'enrolled');
      
      if (error) throw error;
      return data as EnrollmentWithClass[];
    },
    enabled: !!user
  });
}

// Check if user is enrolled in a specific class
export function useIsEnrolled(classId: string) {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['enrollment-check', user?.id, classId],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('enrollments')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('class_id', classId)
        .eq('status', 'enrolled')
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!user && !!classId
  });
}

// Get enrollment counts for all classes (for instructors)
export function useEnrollmentCounts() {
  return useQuery({
    queryKey: ['enrollment-counts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select('class_id')
        .eq('status', 'enrolled');
      
      if (error) throw error;
      
      // Count enrollments per class
      const counts: Record<string, number> = {};
      (data || []).forEach(enrollment => {
        counts[enrollment.class_id] = (counts[enrollment.class_id] || 0) + 1;
      });
      
      return counts;
    }
  });
}

// Get detailed enrollments for a specific class
export function useClassEnrollments(classId: string) {
  return useQuery({
    queryKey: ['class-enrollments', classId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          *,
          profiles:user_id (
            full_name, email, belt_rank
          )
        `)
        .eq('class_id', classId)
        .eq('status', 'enrolled');
      
      if (error) throw error;
      return data;
    },
    enabled: !!classId
  });
}

// Enroll in a class
export function useEnrollInClass() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (classId: string) => {
      if (!user) throw new Error('Must be logged in to enroll');
      
      const { data, error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          class_id: classId,
          status: 'enrolled'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (_, classId) => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-check', user?.id, classId] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-counts'] });
      queryClient.invalidateQueries({ queryKey: ['class-enrollments', classId] });
    }
  });
}

// Unenroll from a class
export function useUnenrollFromClass() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  return useMutation({
    mutationFn: async (classId: string) => {
      if (!user) throw new Error('Must be logged in to unenroll');
      
      const { error } = await supabase
        .from('enrollments')
        .delete()
        .eq('user_id', user.id)
        .eq('class_id', classId);
      
      if (error) throw error;
    },
    onSuccess: (_, classId) => {
      queryClient.invalidateQueries({ queryKey: ['my-enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-check', user?.id, classId] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-counts'] });
      queryClient.invalidateQueries({ queryKey: ['class-enrollments', classId] });
    }
  });
}
