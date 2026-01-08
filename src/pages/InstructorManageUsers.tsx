import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProfileWithRole {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  belt_rank: string | null;
  program: string | null;
  location: string | null;
  role?: string;
}

export default function InstructorManageUsers(): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProfileWithRole[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProfileWithRole | null>(null);

  const belts = ['white', 'yellow', 'orange', 'green', 'blue', 'purple', 'brown', 'black'];

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    loadUsers();
  }, [user, navigate]);

  async function loadUsers() {
    try {
      // Get all profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get all roles
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role');

      const rolesMap = new Map((rolesData || []).map(r => [r.user_id, r.role]));

      const profilesWithRoles = (profilesData || []).map(p => ({
        ...p,
        role: rolesMap.get(p.user_id) || 'student'
      }));

      setProfiles(profilesWithRoles);
    } catch (err) {
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return profiles;
    return profiles.filter(p =>
      (p.full_name || '').toLowerCase().includes(q) ||
      (p.email || '').toLowerCase().includes(q) ||
      (p.phone || '').includes(q)
    );
  }, [query, profiles]);

  async function updateBeltRank(profileId: string, userId: string, beltRank: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ belt_rank: beltRank })
        .eq('id', profileId);

      if (error) throw error;
      toast({ title: 'Belt rank updated!' });
      await loadUsers();
      setEditing(null);
    } catch (err) {
      console.error('Error updating belt:', err);
      toast({ title: 'Failed to update belt rank', variant: 'destructive' });
    }
  }

  async function updateProgram(profileId: string, program: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ program })
        .eq('id', profileId);

      if (error) throw error;
      toast({ title: 'Program updated!' });
      await loadUsers();
    } catch (err) {
      console.error('Error updating program:', err);
      toast({ title: 'Failed to update program', variant: 'destructive' });
    }
  }

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/instructor">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="font-display text-xl text-foreground flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  MANAGE STUDENTS
                </h1>
                <p className="text-sm text-muted-foreground">View and manage student profiles</p>
              </div>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students..."
                className="pl-10 pr-4 py-2 bg-secondary border border-border rounded-lg w-64"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Phone</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Belt</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Program</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-muted-foreground">
                      No students found
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} className="border-t border-border hover:bg-secondary/50">
                      <td className="p-4">{p.full_name}</td>
                      <td className="p-4 text-muted-foreground">{p.email}</td>
                      <td className="p-4 text-muted-foreground">{p.phone || '-'}</td>
                      <td className="p-4 capitalize">{p.role}</td>
                      <td className="p-4">
                        <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          p.belt_rank === 'black' ? 'bg-foreground text-background' :
                          p.belt_rank === 'brown' ? 'bg-amber-800 text-white' :
                          p.belt_rank === 'purple' ? 'bg-purple-600 text-white' :
                          p.belt_rank === 'blue' ? 'bg-blue-600 text-white' :
                          p.belt_rank === 'green' ? 'bg-green-600 text-white' :
                          p.belt_rank === 'orange' ? 'bg-orange-500 text-white' :
                          p.belt_rank === 'yellow' ? 'bg-yellow-400 text-black' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {p.belt_rank || 'white'}
                        </span>
                      </td>
                      <td className="p-4 capitalize">{p.program || '-'}</td>
                      <td className="p-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(p)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Modal */}
        {editing && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
              <h2 className="font-display text-lg mb-4">Edit Student</h2>
              <p className="text-muted-foreground mb-4">{editing.full_name}</p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Belt Rank</label>
                  <select
                    defaultValue={editing.belt_rank || 'white'}
                    id="belt-select"
                    className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  >
                    {belts.map(b => <option key={b} value={b} className="capitalize">{b}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Program</label>
                  <select
                    defaultValue={editing.program || 'adults'}
                    id="program-select"
                    className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  >
                    <option value="kids">Kids</option>
                    <option value="teens">Teens</option>
                    <option value="adults">Adults</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="hero"
                  onClick={() => {
                    const beltSelect = document.getElementById('belt-select') as HTMLSelectElement;
                    const programSelect = document.getElementById('program-select') as HTMLSelectElement;
                    if (beltSelect && programSelect) {
                      updateBeltRank(editing.id, editing.user_id, beltSelect.value);
                      updateProgram(editing.id, programSelect.value);
                    }
                  }}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
