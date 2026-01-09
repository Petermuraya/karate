import { useEffect, useState, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Notification {
  id: string;
  user_id: string;
  type: string | null;
  title: string;
  message: string;
  is_read?: boolean | null;
  created_at?: string | null;
}

export default function useNotifications(type?: string) {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const channelRef = useRef<any>(null);

  const { isLoading, error, data } = useQuery<Notification[], Error>({
    queryKey: ['notifications', userId, type],
    queryFn: async () => {
      if (!userId) return [];
      let q = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (type) q = q.eq('type', type);

      const { data, error } = await q;
      if (error) throw error;
      const result = (data || []) as Notification[];
      setNotifications(result);
      return result;
    },
    enabled: !!userId,
  });

  useEffect(() => {
    if (!userId) return;

    // Realtime subscription: prefer new channel API if available (supabase-js v2), fallback to from(...).subscribe()
    const setup = async () => {
      try {
        const filter = `user_id=eq.${userId}`;

        if ((supabase as any).channel) {
          const ch = (supabase as any).channel(`public:notifications:${userId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter }, (payload: any) => {
              const newRow = payload.new as Notification;
              setNotifications((prev) => [newRow, ...prev]);
              queryClient.setQueryData(['notifications', userId, type], (old: any) => [newRow, ...(old || [])]);
            })
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications', filter }, (payload: any) => {
              const updated = payload.new as Notification;
              setNotifications((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
              queryClient.setQueryData(['notifications', userId, type], (old: any) => (old || []).map((n: any) => (n.id === updated.id ? updated : n)));
            });

          await ch.subscribe();
          channelRef.current = ch;
        } else if ((supabase as any).from) {
          // fallback (older API)
          const sub = (supabase as any)
            .from(`notifications:user_id=eq.${userId}`)
            .on('INSERT', (payload: any) => {
              const newRow = payload.new as Notification;
              setNotifications((prev) => [newRow, ...prev]);
              queryClient.setQueryData(['notifications', userId, type], (old: any) => [newRow, ...(old || [])]);
            })
            .on('UPDATE', (payload: any) => {
              const updated = payload.new as Notification;
              setNotifications((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
              queryClient.setQueryData(['notifications', userId, type], (old: any) => (old || []).map((n: any) => (n.id === updated.id ? updated : n)));
            })
            .subscribe();
          channelRef.current = sub;
        }
      } catch (err) {
        console.error('Realtime subscription error', err);
      }
    };

    setup();

    return () => {
      try {
        const ch = channelRef.current;
        if (!ch) return;
        if (ch.unsubscribe) ch.unsubscribe();
        if ((supabase as any).removeChannel) (supabase as any).removeChannel(ch);
      } catch (e) {
        // ignore
      }
    };
  }, [userId, type, queryClient]);

  async function markAsRead(notificationId: string) {
    if (!notificationId) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
    if (error) throw error;

    // Optimistically update local state
    setNotifications((prev) => prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)));
    queryClient.setQueryData(['notifications', userId, type], (old: any) => (old || []).map((n: any) => (n.id === notificationId ? { ...n, is_read: true } : n)));
  }

  async function markAllAsRead() {
    if (!userId) return;
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
    if (error) throw error;

    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    queryClient.setQueryData(['notifications', userId, type], (old: any) => (old || []).map((n: any) => ({ ...n, is_read: true })));
  }

  return {
    notifications: data ?? notifications,
    isLoading,
    error: error ?? undefined,
    markAsRead,
    markAllAsRead,
  };
}
