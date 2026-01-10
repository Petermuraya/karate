import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, Bell, Settings, FileText, Video, User } from 'lucide-react';
import DashboardSwitcher from './DashboardSwitcher';
import { useIsInstructor } from '@/hooks/useUserRole';

export default function InstructorSidebar({ compact }: { compact?: boolean }) {
  const loc = useLocation();
  const { isInstructor } = useIsInstructor();

  // Instructor-focused items; admin-only items can be appended if needed
  const instructorItems = [
    { to: '/instructor', label: 'Overview', icon: Home },
    { to: '/instructor/classes', label: 'Classes', icon: Calendar },
    { to: '/instructor/videos', label: 'Videos', icon: Video },
    { to: '/instructor/users', label: 'Students', icon: Users },
    { to: '/instructor/profile', label: 'Profile', icon: User },
  ];

  // Admin-only items (kept available but shown after instructor items)
  const adminOnly = [
    { to: '/admin/reports', label: 'Reports', icon: FileText },
    { to: '/admin/gallery', label: 'Gallery', icon: FileText },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  const items = isInstructor ? [...instructorItems, ...adminOnly] : instructorItems;

  return (
    <aside className={`bg-card border border-border rounded-xl p-3 sm:p-4 ${compact ? 'w-20' : 'w-full sm:w-64'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded flex items-center justify-center shadow-inner">
          <span className="text-primary-foreground font-bold">IF</span>
        </div>
        {!compact && (
          <div className="hidden sm:block">
            <div className="font-display text-sm text-foreground">Instructor</div>
            <div className="text-xs text-muted-foreground">Instructor Tools</div>
          </div>
        )}
      </div>

      {/* Quick switcher */}
      {!compact && (
        <div className="mb-3 hidden sm:block">
          <DashboardSwitcher />
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
              <Icon className={`w-5 h-5 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
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
