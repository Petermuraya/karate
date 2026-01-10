import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import useNextClass from '@/hooks/useNextClass';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import { buildICS, googleCalendarUrl } from '@/lib/calendar';
import { UpcomingClasses } from '@/components/dashboard/UpcomingClasses';
import { MyEnrollments } from '@/components/dashboard/MyEnrollments';
import { AnnouncementsCard } from '@/components/dashboard/AnnouncementsCard';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const { nextClass, startsAt, isLoading: nextLoading } = useNextClass(profile?.program);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl md:text-4xl text-foreground tracking-wide">
            Welcome back, {profile?.full_name?.split(' ')[0] || 'Student'}!
          </h1>
          <p className="text-muted-foreground mt-2">
            Your martial arts journey continues. Here's what's happening at the dojo.
          </p>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Classes & Announcements */}
          <div className="md:col-span-2 space-y-6">
            {/* Next Class card (student-facing) */}
            <NextClassCard
              nextClass={nextClass}
              startsAt={startsAt}
              isLoading={nextLoading}
            />
            {/* My Enrolled Classes */}
            <MyEnrollments />
            <UpcomingClasses />
            <AnnouncementsCard />
          </div>

          {/* Right Column - Progress & Actions */}
          <div className="space-y-6 md:col-span-1">
            <ProgressCard />
            <QuickActions />
          </div>
        </div>

        {/* Instructor Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gradient-to-r from-primary/10 to-gold/10 border border-primary/20 rounded-xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
              <span className="font-display text-primary-foreground text-lg">道</span>
            </div>
            <div>
              <h3 className="font-display text-lg text-foreground tracking-wide">MESSAGE FROM SENSEI</h3>
              <p className="text-muted-foreground mt-2">
                "The journey of a thousand miles begins with a single step. Every training session, 
                every kata, every moment of discipline brings you closer to mastery. Train hard, 
                stay humble, and remember — the true battle is always within."
              </p>
              <p className="text-primary mt-2 font-medium">— Sensei Kevin Kiarie</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

function formatTime(time: string) {
  const [hoursStr, minutesStr] = time.split(':');
  const hours = parseInt(hoursStr || '0', 10);
  const minutes = minutesStr ? parseInt(minutesStr, 10) : 0;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${ampm}`;
}

function getDayLabel(startsAt: Date | null) {
  if (!startsAt) return '';
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const diff = Math.floor((startsAt.setHours(0,0,0,0) - today.setHours(0,0,0,0)) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return days[startsAt.getDay()] || '';
}

function NextClassCard({ nextClass, startsAt, isLoading }: { nextClass: any; startsAt: Date | null; isLoading: boolean; }) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-6 w-1/3 bg-secondary rounded mb-4" />
          <div className="h-12 bg-secondary rounded" />
        </div>
      </div>
    );
  }

  if (!nextClass) {
    return (
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg text-foreground tracking-wide">NEXT CLASS</h2>
        </div>
        <p className="text-muted-foreground">No upcoming classes scheduled</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
            <h3 className="font-display text-xl text-foreground tracking-wide mr-2">{nextClass.title}</h3>
            <span className="inline-block px-2 py-0.5 text-xs bg-primary text-primary-foreground rounded mt-2 sm:mt-0">Next Class</span>
          </div>

          <p className="text-sm text-muted-foreground mt-2">
            {nextClass.program}{nextClass.level ? ` • ${nextClass.level}` : ''}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2 sm:mr-4">{nextClass.location}</span>
            {startsAt && (
              <span>{getDayLabel(new Date(startsAt))} • {formatTime(nextClass.start_time)} - {formatTime(nextClass.end_time)}</span>
            )}
          </div>
        </div>

        {startsAt && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => {
                const starts = new Date(startsAt);
                const ends = new Date(starts.getTime() + ( (parseTime(nextClass.end_time) - parseTime(nextClass.start_time)) || 60 ) * 60000);
                const ev = {
                  title: nextClass.title,
                  description: nextClass.description || nextClass.body || '',
                  location: nextClass.location || '',
                  startsAt: starts,
                  endsAt: ends,
                };
                const url = googleCalendarUrl(ev as any);
                window.open(url, '_blank');
              }}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Add to Google
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto"
              onClick={() => {
                const starts = new Date(startsAt);
                const ends = new Date(starts.getTime() + ( (parseTime(nextClass.end_time) - parseTime(nextClass.start_time)) || 60 ) * 60000);
                const ev = {
                  title: nextClass.title,
                  description: nextClass.description || nextClass.body || '',
                  location: nextClass.location || '',
                  startsAt: starts,
                  endsAt: ends,
                };
                const ics = buildICS(ev as any);
                const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
                const href = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = href;
                a.download = `${(nextClass.title || 'event').replace(/[^a-z0-9]/gi, '_')}.ics`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(href), 10000);
              }}
            >
              Download .ics
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function parseTime(t: string | undefined) {
  if (!t) return 60;
  const [h, m] = (t || '').split(':').map((s) => parseInt(s || '0', 10));
  return (h * 60) + (m || 0);
}
