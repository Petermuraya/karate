import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const BELT_RANKS = [
  'white', 'yellow', 'orange', 'purple', 'green', 'brown', 'black'
];

const PROGRAMS = ['kids', 'teens', 'adults'];

const LOCATIONS = ['Mwiki', 'Kasarani', 'Sunton Mwiki'];

export default function StudentOnboarding(): JSX.Element {
  const { user, profile, refreshProfile, loading } = useAuth();
  const navigate = useNavigate();

  const [beltRank, setBeltRank] = useState('white');
  const [program, setProgram] = useState('adults');
  const [location, setLocation] = useState('Mwiki');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Auto-fill fields from profile when available
  useEffect(() => {
    if (!profile) return;
    if (profile.phone) setPhone(profile.phone);
    if (profile.belt_rank) setBeltRank(profile.belt_rank);
    if (profile.program && PROGRAMS.includes(profile.program)) {
      setProgram(profile.program);
    }
    if (profile.location) setLocation(profile.location);
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) return;
    setSaving(true);

    try {
      // Update profiles table only - no students table exists
      const { error: pErr } = await supabase.from('profiles').update({
        phone,
        belt_rank: beltRank,
        program,
        location
      }).eq('user_id', user.id);

      if (pErr) throw pErr;

      await refreshProfile();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-xl tracking-wide">Complete Your Profile</h1>
              <p className="text-sm text-muted-foreground">Set up your training preferences</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Student Onboarding
              </CardTitle>
              <CardDescription>
                Complete your profile so instructors can place you in the right class.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input readOnly value={profile?.full_name ?? ''} className="bg-muted" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone"
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="0713..." 
                  />
                  <p className="text-xs text-muted-foreground">Used for WhatsApp notifications</p>
                </div>

                <div className="space-y-2">
                  <Label>Program</Label>
                  <Select value={program} onValueChange={setProgram}>
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

                <div className="space-y-2">
                  <Label>Training Location</Label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LOCATIONS.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Current Belt Rank</Label>
                  <Select value={beltRank} onValueChange={setBeltRank}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BELT_RANKS.map(belt => (
                        <SelectItem key={belt} value={belt} className="capitalize">{belt} belt</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Belt assignment will be confirmed by your instructor.</p>
                </div>

                {error && <div className="text-sm text-destructive">{error}</div>}

                <div className="flex gap-3 pt-4">
                  <Button type="submit" disabled={saving} className="flex-1">
                    {saving ? 'Saving...' : 'Complete Onboarding'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                    Skip for Now
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
