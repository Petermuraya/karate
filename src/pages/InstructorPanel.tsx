import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Megaphone, UserCheck, BarChart3, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useIsInstructor } from '@/hooks/useUserRole';
import { ClassManager } from '@/components/admin/ClassManager';
import { AnnouncementManager } from '@/components/admin/AnnouncementManager';
import { AttendanceTracker } from '@/components/admin/AttendanceTracker';
import { AnalyticsDashboard } from '@/components/admin/AnalyticsDashboard';

export default function InstructorPanel() {
  const { user, loading: authLoading } = useAuth();
  const { isInstructor, isLoading: roleLoading } = useIsInstructor();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!authLoading && !roleLoading && user && !isInstructor) {
      navigate('/dashboard');
    }
  }, [user, authLoading, roleLoading, isInstructor, navigate]);

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading instructor panel...</p>
        </div>
      </div>
    );
  }

  if (!user || !isInstructor) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-display text-xl md:text-2xl text-foreground tracking-wide flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-primary" />
                  INSTRUCTOR PANEL
                </h1>
                <p className="text-sm text-muted-foreground">Manage your dojo</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/instructor/profile">
                <Button variant="ghost" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </Link>
              <Link to="/instructor/classes">
                <Button variant="ghost" size="sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Manage Timetable
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Tabs defaultValue="classes" className="space-y-6">
            <TabsList className="grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="classes" className="gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Classes</span>
              </TabsTrigger>
              <TabsTrigger value="announcements" className="gap-2">
                <Megaphone className="w-4 h-4" />
                <span className="hidden sm:inline">Announcements</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="gap-2">
                <UserCheck className="w-4 h-4" />
                <span className="hidden sm:inline">Attendance</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classes">
              <ClassManager />
            </TabsContent>

            <TabsContent value="announcements">
              <AnnouncementManager />
            </TabsContent>

            <TabsContent value="attendance">
              <AttendanceTracker />
            </TabsContent>

            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}
