import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Trash2, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ClassItem {
  id: string;
  title: string;
  program: string;
  location: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  capacity: number | null;
  is_active: boolean | null;
}

export default function InstructorManageClasses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: '',
    program: 'adults',
    location: '',
    day_of_week: 'Monday',
    start_time: '18:00',
    end_time: '19:00',
    capacity: 20
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadClasses();
  }, [user, navigate]);

  async function loadClasses() {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('instructor_id', user?.id)
        .order('day_of_week');
      
      if (error) throw error;
      setClasses(data || []);
    } catch (err) {
      console.error('Error loading classes:', err);
    } finally {
      setLoading(false);
    }
  }

  async function createClass() {
    if (!user) return;
    if (!form.title || !form.location) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      return;
    }

    try {
      const { error } = await supabase.from('classes').insert({
        ...form,
        instructor_id: user.id,
        is_active: true
      });

      if (error) throw error;

      toast({ title: 'Class created successfully!' });
      setForm({
        title: '',
        program: 'adults',
        location: '',
        day_of_week: 'Monday',
        start_time: '18:00',
        end_time: '19:00',
        capacity: 20
      });
      await loadClasses();
    } catch (err) {
      console.error('Error creating class:', err);
      toast({ title: 'Failed to create class', variant: 'destructive' });
    }
  }

  async function toggleActive(classItem: ClassItem) {
    try {
      const { error } = await supabase
        .from('classes')
        .update({ is_active: !classItem.is_active })
        .eq('id', classItem.id);

      if (error) throw error;
      await loadClasses();
    } catch (err) {
      console.error('Error toggling class:', err);
    }
  }

  async function deleteClass(id: string) {
    if (!confirm('Are you sure you want to delete this class?')) return;

    try {
      const { error } = await supabase.from('classes').delete().eq('id', id);
      if (error) throw error;
      toast({ title: 'Class deleted' });
      await loadClasses();
    } catch (err) {
      console.error('Error deleting class:', err);
      toast({ title: 'Failed to delete class', variant: 'destructive' });
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/instructor">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-xl text-foreground flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                MANAGE CLASSES
              </h1>
              <p className="text-sm text-muted-foreground">Create and manage your class schedule</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Class Form */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-lg mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              CREATE NEW CLASS
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Title</label>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  placeholder="e.g. Kids Karate"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Location</label>
                <input
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  placeholder="e.g. Main Dojo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Program</label>
                  <select
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                    className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  >
                    <option value="kids">Kids</option>
                    <option value="teens">Teens</option>
                    <option value="adults">Adults</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Day</label>
                  <select
                    value={form.day_of_week}
                    onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                    className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  >
                    {days.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Start Time</label>
                  <input
                    type="time"
                    value={form.start_time}
                    onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                    className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">End Time</label>
                  <input
                    type="time"
                    value={form.end_time}
                    onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                    className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Capacity</label>
                  <input
                    type="number"
                    value={form.capacity}
                    onChange={(e) => setForm({ ...form, capacity: parseInt(e.target.value) })}
                    className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  />
                </div>
              </div>

              <Button variant="hero" onClick={createClass} className="w-full">
                Create Class
              </Button>
            </div>
          </div>

          {/* Classes List */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="font-display text-lg mb-4">YOUR CLASSES</h2>

            {classes.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No classes created yet. Create your first class!
              </p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {classes.map((cls) => (
                  <div
                    key={cls.id}
                    className={`p-4 bg-secondary rounded-lg border ${
                      cls.is_active ? 'border-primary/30' : 'border-border opacity-60'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{cls.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {cls.day_of_week} • {cls.start_time} - {cls.end_time}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {cls.location} • {cls.program} • Capacity: {cls.capacity}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(cls)}
                        >
                          {cls.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteClass(cls.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
