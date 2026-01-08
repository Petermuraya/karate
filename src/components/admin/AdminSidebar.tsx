import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, Bell, Settings, FileText, Video } from 'lucide-react';
import DashboardSwitcher from './DashboardSwitcher';

const items = [
  { to: '/admin', label: 'Overview', icon: Home },
  { to: '/admin/classes', label: 'Classes', icon: Calendar },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/gallery', label: 'Gallery', icon: FileText },
  { to: '/admin/reports', label: 'Reports', icon: FileText },
  { to: '/instructor/upload', label: 'Upload Video', icon: Video },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminSidebar({ compact }: { compact?: boolean }) {
  const loc = useLocation();

  return (
    <aside className={`bg-card border border-border rounded-xl p-3 sm:p-4 ${compact ? 'w-20' : 'w-full sm:w-64'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
          <span className="text-primary-foreground font-bold">IF</span>
        </div>
        {!compact && (
          <div className="hidden sm:block">
            <div className="font-display text-sm text-foreground">Admin</div>
            <div className="text-xs text-muted-foreground">Control Panel</div>
          </div>
        )}
      </div>

      {/* Quick switcher */}
      {!compact && (
        <div className="mb-3 hidden sm:block">
          <DashboardSwitcher current="admin" />
        </div>
      )}

      <nav className="flex flex-col gap-1">
        {items.map((it) => {
          const Icon = it.icon;
          const active = loc.pathname === it.to || (!compact && loc.pathname.startsWith(it.to));
          return (
            <Link
              key={it.to}
              to={it.to}
              className={`flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors ${active ? 'bg-primary/10' : ''}`}
            >
              <Icon className="w-5 h-5 text-primary" />
              {!compact && <span className="text-sm text-foreground hidden sm:inline">{it.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-6 text-xs text-muted-foreground hidden sm:block">
        <div>Version: 1.0</div>
        <div className="mt-2">Last sync: --</div>
      </div>
    </aside>
  );
}
