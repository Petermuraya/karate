import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Classes Management
export function useAllClasses() {
  return useQuery({
    queryKey: ['admin-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .order('day_of_week');
      
      if (error) throw error;
      return data;
    }
  });
}

export function useCreateClass() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (classData: {
      title: string;
      description?: string;
      program: string;
      level?: string;
      location: string;
      day_of_week: string;
      start_time: string;
      end_time: string;
      capacity?: number;
    }) => {
      const { data, error } = await supabase
        .from('classes')
        .insert(classData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    }
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<{
      title: string;
      description: string;
      program: string;
      level: string;
      location: string;
      day_of_week: string;
      start_time: string;
      end_time: string;
      capacity: number;
      is_active: boolean;
    }>) => {
      const { data, error } = await supabase
        .from('classes')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    }
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-classes'] });
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    }
  });
}

// Announcements Management
export function useAllAnnouncements() {
  return useQuery({
    queryKey: ['admin-announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });
}

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (announcement: {
      title: string;
      content: string;
      priority?: string;
      expires_at?: string;
      is_published?: boolean;
    }) => {
      const { data, error } = await supabase
        .from('announcements')
        .insert(announcement)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    }
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<{
      title: string;
      content: string;
      priority: string;
      expires_at: string;
      is_published: boolean;
    }>) => {
      const { data, error } = await supabase
        .from('announcements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    }
  });
}

export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-announcements'] });
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
    }
  });
}

// Attendance Tracking
export function useAttendanceRecords(classId?: string) {
  return useQuery({
    queryKey: ['attendance', classId],
    queryFn: async () => {
      let query = supabase
        .from('attendance')
        .select(`
          *,
          classes(title, program)
        `)
        .order('attended_at', { ascending: false });
      
      if (classId) {
        query = query.eq('class_id', classId);
      }
      
      const { data, error } = await query.limit(100);
      
      if (error) throw error;
      return data;
    }
  });
}

export function useRecordAttendance() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ class_id, user_id }: { class_id: string; user_id: string }) => {
      const { data, error } = await supabase
        .from('attendance')
        .insert({ class_id, user_id })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    }
  });
}

// Students List
export function useAllStudents() {
  return useQuery({
    queryKey: ['all-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name');
      
      if (error) throw error;
      return data;
    }
  });
}

// Analytics
export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      // Get student count
      const { count: studentCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      
      // Get active classes count
      const { count: classCount } = await supabase
        .from('classes')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);
      
      // Get attendance this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const { count: monthlyAttendance } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .gte('attended_at', startOfMonth.toISOString().split('T')[0]);
      
      // Get belt distribution
      const { data: beltData } = await supabase
        .from('profiles')
        .select('belt_rank');
      
      const beltDistribution = (beltData || []).reduce((acc, { belt_rank }) => {
        const belt = belt_rank || 'white';
        acc[belt] = (acc[belt] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Get program distribution
      const { data: programData } = await supabase
        .from('profiles')
        .select('program');
      
      const programDistribution = (programData || []).reduce((acc, { program }) => {
        const prog = program || 'adults';
        acc[prog] = (acc[prog] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Get recent attendance by day
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: recentAttendance } = await supabase
        .from('attendance')
        .select('attended_at')
        .gte('attended_at', sevenDaysAgo.toISOString().split('T')[0]);
      
      const attendanceByDay = (recentAttendance || []).reduce((acc, { attended_at }) => {
        acc[attended_at] = (acc[attended_at] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      return {
        studentCount: studentCount || 0,
        classCount: classCount || 0,
        monthlyAttendance: monthlyAttendance || 0,
        beltDistribution,
        programDistribution,
        attendanceByDay
      };
    }
  });
}
