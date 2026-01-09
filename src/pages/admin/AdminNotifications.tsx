import React from 'react';
import useNotifications from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function AdminNotifications() {
  const navigate = useNavigate();
  const { notifications, isLoading, markAsRead, markAllAsRead } = useNotifications();
  const notificationsList = notifications || [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-muted bg-card border border-border">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-display text-2xl">Notifications</h1>
              <p className="text-muted-foreground">View and manage notifications</p>
              <div className="mt-1 text-sm text-muted-foreground">
                <Link to="/admin" className="text-primary">Admin</Link>
                <span className="mx-2">/</span>
                <span>Notifications</span>
              </div>
            </div>
          </div>
          <div>
            <Button variant="outline" onClick={() => markAllAsRead && markAllAsRead()}>Mark all read</Button>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-4 space-y-3">
          {notificationsList.map((n) => (
            <div key={n.id} className={`p-3 rounded ${n.is_read ? 'opacity-60' : 'bg-secondary/40'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{n.title}</div>
                  {n.message && <div className="text-sm text-muted-foreground">{n.message}</div>}
                </div>
                <div className="flex items-center gap-2">
                  {!n.is_read && <Button size="sm" onClick={() => markAsRead && markAsRead(n.id)}>Mark read</Button>}
                </div>
              </div>
            </div>
          ))}

          {notificationsList.length === 0 && (
            <div className="text-center text-muted-foreground py-8">No notifications</div>
          )}
        </div>
      </div>
    </div>
  );
}
