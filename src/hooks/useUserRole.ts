import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type AppRole = 'admin' | 'instructor' | 'student';

export function useUserRole() {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data?.role as AppRole | null;
    },
    enabled: !!user
  });
}

export function useIsInstructor() {
  const { data: role, isLoading } = useUserRole();
  return {
    isInstructor: role === 'instructor' || role === 'admin',
    isAdmin: role === 'admin',
    isLoading
  };
}
