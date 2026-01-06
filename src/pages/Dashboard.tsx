import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { UpcomingClasses } from '@/components/dashboard/UpcomingClasses';
import { AnnouncementsCard } from '@/components/dashboard/AnnouncementsCard';
import { ProgressCard } from '@/components/dashboard/ProgressCard';
import { QuickActions } from '@/components/dashboard/QuickActions';

export default function Dashboard() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

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
      
      <main className="max-w-7xl mx-auto px-6 py-8">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Classes & Announcements */}
          <div className="lg:col-span-2 space-y-6">
            <UpcomingClasses />
            <AnnouncementsCard />
          </div>

          {/* Right Column - Progress & Actions */}
          <div className="space-y-6">
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
