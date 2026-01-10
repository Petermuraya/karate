import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Users, Video, User, BarChart3, Settings } from 'lucide-react';
import { useIsInstructor } from '@/hooks/useUserRole';

export default function InstructorSidebar({ compact }: { compact?: boolean }) {
  const loc = useLocation();
  const { isInstructor, isAdmin } = useIsInstructor();

  // Instructor-focused items
  const instructorItems = [
    { to: '/instructor', label: 'Overview', icon: Home },
    { to: '/instructor/classes', label: 'Classes', icon: Calendar },
    { to: '/instructor/videos', label: 'Videos', icon: Video },
    { to: '/instructor/users', label: 'Students', icon: Users },
    { to: '/instructor/profile', label: 'Profile', icon: User },
  ];

  // Admin-only items
  const adminItems = isAdmin ? [
    { to: '/instructor', label: 'Reports', icon: BarChart3 },
    { to: '/instructor', label: 'Settings', icon: Settings },
  ] : [];

  const items = [...instructorItems, ...adminItems];

  return (
    <aside className={`bg-card border border-border rounded-xl p-3 sm:p-4 ${compact ? 'w-20' : 'w-full sm:w-64'}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary rounded flex items-center justify-center shadow-inner">
          <span className="text-primary-foreground font-bold">IF</span>
        </div>
        {!compact && (
          <div className="hidden sm:block">
            <div className="font-display text-sm text-foreground">Iron Fist Dojo</div>
            <div className="text-xs text-muted-foreground">Instructor Panel</div>
          </div>
        )}
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((it, idx) => {
          const Icon = it.icon;
          const active = loc.pathname === it.to || (loc.pathname.startsWith(it.to) && it.to !== '/instructor');
          return (
            <Link
              key={`${it.to}-${idx}`}
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
        <div>Iron Fist Dojo v1.0</div>
      </div>
    </aside>
  );
}
