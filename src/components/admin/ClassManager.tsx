import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useAllClasses, useCreateClass, useUpdateClass, useDeleteClass } from '@/hooks/useAdminData';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const PROGRAMS = ['kids', 'teens', 'adults', 'family'];
const LEVELS = ['beginner', 'intermediate', 'advanced', 'all'];
const LOCATIONS = ['Main Dojo', 'Training Room A', 'Training Room B', 'Outdoor Area'];

interface ClassFormData {
  title: string;
  description: string;
  program: string;
  level: string;
  location: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  capacity: number;
}

const defaultFormData: ClassFormData = {
  title: '',
  description: '',
  program: 'adults',
  level: 'all',
  location: 'Main Dojo',
  day_of_week: 'Monday',
  start_time: '09:00',
  end_time: '10:00',
  capacity: 20
};

export function ClassManager() {
  const { data: classes, isLoading } = useAllClasses();
  const createClass = useCreateClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();
  const { toast } = useToast();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<string | null>(null);
  const [formData, setFormData] = useState<ClassFormData>(defaultFormData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingClass) {
        await updateClass.mutateAsync({ id: editingClass, ...formData });
        toast({ title: 'Class updated successfully!' });
      } else {
        await createClass.mutateAsync(formData);
        toast({ title: 'Class created successfully!' });
      }
      setIsDialogOpen(false);
      setEditingClass(null);
      setFormData(defaultFormData);
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to save class',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (cls: any) => {
    setEditingClass(cls.id);
    setFormData({
      title: cls.title,
      description: cls.description || '',
      program: cls.program,
      level: cls.level || 'all',
      location: cls.location,
      day_of_week: cls.day_of_week,
      start_time: cls.start_time,
      end_time: cls.end_time,
      capacity: cls.capacity || 20
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this class?')) return;
    
    try {
      await deleteClass.mutateAsync(id);
      toast({ title: 'Class deleted successfully!' });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to delete class',
        variant: 'destructive'
      });
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await updateClass.mutateAsync({ id, is_active: !currentStatus });
      toast({ title: `Class ${!currentStatus ? 'activated' : 'deactivated'}` });
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to update class status',
        variant: 'destructive'
      });
    }
  };

  const groupedClasses = (classes || []).reduce((acc, cls) => {
    if (!acc[cls.day_of_week]) acc[cls.day_of_week] = [];
    acc[cls.day_of_week].push(cls);
    return acc;
  }, {} as Record<string, typeof classes>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground tracking-wide">CLASS SCHEDULE</h2>
          <p className="text-muted-foreground">Manage your dojo class schedule</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingClass(null);
            setFormData(defaultFormData);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Add Class
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display tracking-wide">
                {editingClass ? 'EDIT CLASS' : 'NEW CLASS'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Class Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Morning Karate"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Class description..."
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Program</Label>
                  <Select value={formData.program} onValueChange={(v) => setFormData({ ...formData, program: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROGRAMS.map(p => (
                        <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Level</Label>
                  <Select value={formData.level} onValueChange={(v) => setFormData({ ...formData, level: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map(l => (
                        <SelectItem key={l} value={l} className="capitalize">{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label>Day</Label>
                <Select value={formData.day_of_week} onValueChange={(v) => setFormData({ ...formData, day_of_week: v })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map(d => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start_time">Start Time</Label>
                  <Input
                    id="start_time"
                    type="time"
                    value={formData.start_time}
                    onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="end_time">End Time</Label>
                  <Input
                    id="end_time"
                    type="time"
                    value={formData.end_time}
                    onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <Select value={formData.location} onValueChange={(v) => setFormData({ ...formData, location: v })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map(l => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    min={1}
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 20 })}
                  />
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={createClass.isPending || updateClass.isPending}>
                {editingClass ? 'Update Class' : 'Create Class'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-6">
          {DAYS.map(day => {
            const dayClasses = groupedClasses[day] || [];
            if (dayClasses.length === 0) return null;
            
            return (
              <motion.div
                key={day}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card border border-border rounded-xl overflow-hidden"
              >
                <div className="bg-muted px-4 py-3 border-b border-border">
                  <h3 className="font-display text-lg text-foreground tracking-wide flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    {day.toUpperCase()}
                  </h3>
                </div>
                <div className="divide-y divide-border">
                  {dayClasses.map((cls: any) => (
                    <div key={cls.id} className={`p-4 flex items-center justify-between ${!cls.is_active ? 'opacity-50' : ''}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{cls.title}</h4>
                          <Badge variant="outline" className="capitalize">{cls.program}</Badge>
                          {cls.level && cls.level !== 'all' && (
                            <Badge variant="secondary" className="capitalize">{cls.level}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {cls.start_time.slice(0, 5)} - {cls.end_time.slice(0, 5)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {cls.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {cls.capacity} max
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 mr-4">
                          <Switch
                            checked={cls.is_active}
                            onCheckedChange={() => handleToggleActive(cls.id, cls.is_active)}
                          />
                          <span className="text-xs text-muted-foreground">
                            {cls.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(cls)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cls.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
          
          {Object.keys(groupedClasses).length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No classes scheduled yet.</p>
              <p className="text-sm">Click "Add Class" to create your first class.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
