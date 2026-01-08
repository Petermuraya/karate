import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAdminData';
import { ClassManager } from '@/components/admin/ClassManager';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { AnnouncementsCard } from '@/components/dashboard/AnnouncementsCard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import InstructorManageUsers from '@/pages/InstructorManageUsers';
import { DollarSign, Users, Calendar } from 'lucide-react';
import DashboardSwitcher from '@/components/admin/DashboardSwitcher';
import { useAllStudents } from '@/hooks/useAdminData';

function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon?: any }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 sm:p-5 flex items-center justify-between">
      <div>
        <div className="text-xs sm:text-sm text-muted-foreground">{title}</div>
        <div className="text-xl sm:text-3xl font-medium text-foreground mt-1">{value}</div>
      </div>
      {Icon && <Icon className="w-6 sm:w-10 h-6 sm:h-10 text-primary" />}
    </div>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const drawerRef = useRef<HTMLElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: students } = useAllStudents();

  useEffect(() => {
    if (!sidebarOpen) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const drawer = drawerRef.current as HTMLElement | null;
    if (!drawer) return;

    const focusableSel = 'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])';
    const focusable = Array.from(drawer.querySelectorAll<HTMLElement>(focusableSel));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // focus the first element (close button) or drawer
    (first || drawer).focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setSidebarOpen(false);
      }
      if (e.key === 'Tab') {
        if (!focusable.length) {
          e.preventDefault();
          return;
        }
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (previouslyFocused.current) previouslyFocused.current.focus();
    };
  }, [sidebarOpen]);
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar for large screens */}
        <div className="hidden lg:block lg:col-span-3">
          <AdminSidebar />
        </div>

        {/* Mobile animated drawer */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              className="lg:hidden fixed inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <motion.aside
                ref={(el) => (drawerRef.current = el)}
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                className="absolute left-0 top-0 bottom-0 w-72 p-4"
                aria-modal="true"
                role="dialog"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Admin</h3>
                  <button
                    aria-label="Close menu"
                    className="p-2 rounded-md hover:bg-muted"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 6l12 12M6 18L18 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                <AdminSidebar compact={false} />
              </motion.aside>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="lg:col-span-9 space-y-6">
          <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="sm:hidden">
                <button
                  aria-label="Open menu"
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md bg-card border border-border"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl text-foreground">Admin Dashboard</h1>
                <p className="text-muted-foreground mt-1 text-sm">Manage classes, users, notifications, and reports</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:block">
                <DashboardSwitcher current="admin" />
              </div>
              <Button variant="ghost" size="sm">Import</Button>
              <Button size="sm">New</Button>
            </div>
          </header>

          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <StatCard title="Active Students" value={analyticsLoading ? '—' : analytics?.studentCount ?? 0} icon={Users} />
            <StatCard title="Upcoming Classes" value={analyticsLoading ? '—' : analytics?.classCount ?? 0} icon={Calendar} />
            <StatCard title="Monthly Attendance" value={analyticsLoading ? '—' : analytics?.monthlyAttendance ?? 0} icon={DollarSign} />
          </section>

          <Dialog open={manageOpen} onOpenChange={setManageOpen}>
            <DialogContent className="max-w-4xl w-full">
              <DialogHeader>
                <DialogTitle>Manage Students</DialogTitle>
              </DialogHeader>
              <div className="py-2">
                <InstructorManageUsers />
              </div>
            </DialogContent>
          </Dialog>

          {/* Users preview */}
          <section className="mt-4 bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Manage Students</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setManageOpen(true)}>Manage</Button>
                <Link to="/instructor/users" className="text-sm text-primary">Open User Manager →</Link>
              </div>
            </div>
            <div className="space-y-2">
              {(students || []).slice(0,5).map((s: any) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-foreground">{s.full_name}</div>
                    <div className="text-xs text-muted-foreground">{s.email}</div>
                  </div>
                  <div className="text-xs text-muted-foreground">{s.program || '—'}</div>
                </div>
              ))}
              {(students || []).length === 0 && (
                <div className="text-sm text-muted-foreground">No students yet.</div>
              )}
            </div>
          </section>
          
          {/* Upload video quick action */}
          <section className="mt-4">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">Upload Training Video</div>
                <div className="text-xs text-muted-foreground">Add a new training video to the library</div>
              </div>
              <div>
                <Link to="/instructor/upload">
                  <Button>Upload</Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ProgressCard />
              <AnnouncementsCard />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-lg text-foreground">Manage Classes</h2>
                <Link to="/admin/classes" className="text-sm text-primary">Open Class Manager →</Link>
              </div>
              <div className="overflow-auto max-h-[60vh]">
                <ClassManager />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
