import React from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useNotifications from '@/hooks/useNotifications';
import { useNavigate } from 'react-router-dom';

function timeAgo(dateString?: string | null) {
  if (!dateString) return '';
  const then = new Date(dateString).getTime();
  const now = Date.now();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return `${diff}s ago`;
  const mins = Math.floor(diff / 60);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsDropdown() {
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const navigate = useNavigate();

  const notificationsList = notifications || [];
  const unreadCount = notificationsList.filter((n) => !n.is_read).length;

  const handleClick = async (n: any) => {
    try {
      await markAsRead(n.id);
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 size-4 rounded-full bg-destructive text-destructive-foreground text-[10px]">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" side="bottom" className="w-80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium">Notifications</h3>
          <Button size="sm" variant="ghost" onClick={() => markAllAsRead()}>
            Mark all as read
          </Button>
        </div>

        <div className="max-h-64 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="space-y-2">
              <div className="h-4 bg-secondary rounded w-1/2 animate-pulse" />
              <div className="h-10 bg-secondary rounded animate-pulse" />
            </div>
          ) : notificationsList.slice(0, 10).map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`w-full text-left p-3 rounded hover:bg-accent flex items-start gap-3 ${n.is_read ? 'opacity-80' : 'bg-popover'}`}
            >
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="font-medium text-sm">{n.title}</div>
                  <div className="text-xs text-muted-foreground">{timeAgo(n.created_at)}</div>
                </div>
                {n.message && <div className="text-sm text-muted-foreground mt-1">{n.message}</div>}
              </div>
              {!n.is_read && <Badge variant="secondary" className="shrink-0">New</Badge>}
            </button>
          ))}

          {(!isLoading && notificationsList.length === 0) && (
            <div className="text-center text-sm text-muted-foreground py-6">No notifications</div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
