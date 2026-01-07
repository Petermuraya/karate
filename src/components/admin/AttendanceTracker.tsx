import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserCheck, Calendar, Clock, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAttendanceRecords, useRecordAttendance, useAllStudents, useAllClasses } from '@/hooks/useAdminData';

export function AttendanceTracker() {
  const { data: attendance, isLoading: attendanceLoading } = useAttendanceRecords();
  const { data: students } = useAllStudents();
  const { data: classes } = useAllClasses();
  const recordAttendance = useRecordAttendance();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState<string>('all');

  const handleRecordAttendance = async () => {
    if (!selectedClass || !selectedStudent) {
      toast({ title: 'Please select both class and student', variant: 'destructive' });
      return;
    }
    
    try {
      await recordAttendance.mutateAsync({
        class_id: selectedClass,
        user_id: selectedStudent
      });
      toast({ title: 'Attendance recorded successfully!' });
      setIsDialogOpen(false);
      setSelectedClass('');
      setSelectedStudent('');
    } catch (error: any) {
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to record attendance',
        variant: 'destructive'
      });
    }
  };

  // Create a map of student names by user_id
  const studentMap = (students || []).reduce((acc, student) => {
    acc[student.user_id] = student;
    return acc;
  }, {} as Record<string, any>);

  const filteredAttendance = (attendance || []).filter((record: any) => {
    const student = studentMap[record.user_id];
    const matchesSearch = !searchTerm || 
      (student?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (record.classes?.title?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterClass === 'all' || record.class_id === filterClass;
    return matchesSearch && matchesFilter;
  });

  // Group attendance by date
  const groupedByDate = filteredAttendance.reduce((acc: Record<string, any[]>, record: any) => {
    const date = record.attended_at;
    if (!acc[date]) acc[date] = [];
    acc[date].push(record);
    return acc;
  }, {});

  const activeClasses = (classes || []).filter((c: any) => c.is_active);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground tracking-wide">ATTENDANCE</h2>
          <p className="text-muted-foreground">Track student class attendance</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <UserCheck className="w-4 h-4" />
              Record Attendance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display tracking-wide">RECORD ATTENDANCE</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Select Class</Label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a class..." />
                  </SelectTrigger>
                  <SelectContent>
                    {activeClasses.map((cls: any) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.title} ({cls.day_of_week} {cls.start_time.slice(0, 5)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Select Student</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a student..." />
                  </SelectTrigger>
                  <SelectContent>
                    {(students || []).map((student: any) => (
                      <SelectItem key={student.user_id} value={student.user_id}>
                        {student.full_name} 
                        <span className="text-muted-foreground ml-2">
                          ({student.belt_rank} belt)
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={handleRecordAttendance} 
                className="w-full"
                disabled={recordAttendance.isPending}
              >
                Record Attendance
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by student or class..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filterClass} onValueChange={setFilterClass}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {activeClasses.map((cls: any) => (
                <SelectItem key={cls.id} value={cls.id}>{cls.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {attendanceLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate).map(([date, records]) => (
            <motion.div
              key={date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="bg-muted px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-display text-lg text-foreground tracking-wide flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                </h3>
                <Badge variant="secondary">{(records as any[]).length} attended</Badge>
              </div>
              <div className="divide-y divide-border">
                {(records as any[]).map((record) => {
                  const student = studentMap[record.user_id];
                  return (
                    <div key={record.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {student?.full_name || 'Unknown Student'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {record.classes?.title || 'Unknown Class'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="capitalize">
                          {student?.belt_rank || 'white'} belt
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {record.classes?.program}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
          
          {Object.keys(groupedByDate).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <UserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No attendance records found.</p>
              <p className="text-sm">Record attendance when students attend classes.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
