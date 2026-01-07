import { motion } from 'framer-motion';
import { Users, Calendar, TrendingUp, Award, PieChart, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAdminData';

const BELT_COLORS: Record<string, string> = {
  white: '#E5E7EB',
  yellow: '#FDE047',
  orange: '#FB923C',
  green: '#4ADE80',
  blue: '#60A5FA',
  purple: '#A78BFA',
  brown: '#A16207',
  black: '#1F2937'
};

const BELT_ORDER = ['white', 'yellow', 'orange', 'green', 'blue', 'purple', 'brown', 'black'];

export function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useAnalytics();

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  const { 
    studentCount = 0, 
    classCount = 0, 
    monthlyAttendance = 0,
    beltDistribution = {},
    programDistribution = {},
    attendanceByDay = {}
  } = analytics || {};

  // Calculate average attendance per day
  const avgDailyAttendance = Object.keys(attendanceByDay).length > 0
    ? Math.round(Object.values(attendanceByDay).reduce((a: number, b: number) => a + b, 0) / Object.keys(attendanceByDay).length)
    : 0;

  // Get sorted belt data
  const sortedBelts = BELT_ORDER.filter(belt => beltDistribution[belt] > 0);
  const maxBeltCount = Math.max(...Object.values(beltDistribution).map(v => v as number), 1);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl text-foreground tracking-wide">ANALYTICS</h2>
        <p className="text-muted-foreground">Insights into your dojo performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="w-4 h-4" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display text-foreground">{studentCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Registered members</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Active Classes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display text-foreground">{classCount}</p>
              <p className="text-xs text-muted-foreground mt-1">Weekly sessions</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Monthly Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display text-foreground">{monthlyAttendance}</p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Avg. Daily Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-display text-foreground">{avgDailyAttendance}</p>
              <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Belt Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-display tracking-wide flex items-center gap-2">
                <Award className="w-5 h-5 text-primary" />
                BELT DISTRIBUTION
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sortedBelts.map((belt) => {
                  const count = beltDistribution[belt] || 0;
                  const percentage = Math.round((count / maxBeltCount) * 100);
                  return (
                    <div key={belt} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="capitalize text-foreground">{belt} Belt</span>
                        <span className="text-muted-foreground">{count} students</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: BELT_COLORS[belt] }}
                        />
                      </div>
                    </div>
                  );
                })}
                {sortedBelts.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No student data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Program Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="font-display tracking-wide flex items-center gap-2">
                <PieChart className="w-5 h-5 text-primary" />
                PROGRAM ENROLLMENT
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(programDistribution).map(([program, count], index) => {
                  const colors = ['bg-primary', 'bg-gold', 'bg-green-500', 'bg-purple-500'];
                  const total = Object.values(programDistribution).reduce((a: number, b: number) => a + b, 0);
                  const percentage = total > 0 ? Math.round(((count as number) / total) * 100) : 0;
                  
                  return (
                    <motion.div
                      key={program}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className="bg-muted/50 rounded-xl p-4 text-center"
                    >
                      <div className={`w-12 h-12 ${colors[index % colors.length]} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                        <span className="text-white font-bold text-lg">{percentage}%</span>
                      </div>
                      <p className="font-medium capitalize text-foreground">{program}</p>
                      <p className="text-sm text-muted-foreground">{count as number} students</p>
                    </motion.div>
                  );
                })}
                {Object.keys(programDistribution).length === 0 && (
                  <p className="text-muted-foreground text-center py-4 col-span-2">No program data available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Attendance Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="font-display tracking-wide flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              7-DAY ATTENDANCE TREND
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(attendanceByDay).length > 0 ? (
              <div className="flex items-end justify-between h-32 gap-2">
                {Object.entries(attendanceByDay)
                  .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                  .map(([date, count]) => {
                    const maxCount = Math.max(...Object.values(attendanceByDay).map(v => v as number));
                    const height = maxCount > 0 ? ((count as number) / maxCount) * 100 : 0;
                    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
                    
                    return (
                      <div key={date} className="flex-1 flex flex-col items-center">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.5, delay: 0.7 }}
                          className="w-full bg-gradient-to-t from-primary to-primary/50 rounded-t-md min-h-[4px]"
                        />
                        <p className="text-xs text-muted-foreground mt-2">{dayName}</p>
                        <p className="text-xs font-medium text-foreground">{count as number}</p>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No attendance data for the past 7 days</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
