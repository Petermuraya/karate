import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export default function StudentOnboarding(): JSX.Element {
  const { user, profile, refreshProfile, loading } = useAuth();
  const navigate = useNavigate();

  const [beltLevel, setBeltLevel] = useState('White');
  const [program, setProgram] = useState<'kids'|'teens'|'adults'>('kids');
  const [location, setLocation] = useState('Mwiki');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
    // If profile exists and user already has a student row, redirect
    const checkExisting = async () => {
      if (!user) return;
      const { data: existing } = await supabase.from('students').select('id').eq('user_id', user.id).maybeSingle();
      if (existing) {
        navigate('/dashboard');
      }
    };
    checkExisting();
  }, [user, loading, navigate]);

  // Auto-fill fields from profile when available
  useEffect(() => {
    if (!profile) return;
    if (profile.phone) setPhone(profile.phone);
    if (profile.belt_rank) setBeltLevel(profile.belt_rank);
    if (profile.program && (profile.program === 'kids' || profile.program === 'teens' || profile.program === 'adults')) {
      setProgram(profile.program as 'kids'|'teens'|'adults');
    }
    if (profile.location) setLocation(profile.location);
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) return;
    setSaving(true);

    try {
      // Upsert students row
      const { error: sErr } = await supabase.from('students').upsert({
        user_id: user.id,
        belt_level: beltLevel,
        program,
        location,
        enrollment_date: new Date().toISOString().slice(0,10)
      }, { onConflict: 'user_id' });

      if (sErr) throw sErr;

      // Update profiles with phone, belt_rank, program, location
      const { error: pErr } = await supabase.from('profiles').upsert({
        user_id: user.id,
        full_name: profile?.full_name ?? undefined,
        email: profile?.email ?? undefined,
        phone,
        belt_rank: beltLevel,
        program,
        location
      }, { onConflict: 'user_id' });

      if (pErr) throw pErr;

      await refreshProfile();
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-2xl mx-auto bg-gray-900 rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-4">Complete Your Onboarding</h1>
        <p className="text-sm text-gray-400 mb-6">Finish your student profile so instructors can place you in the right class.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Full name</label>
            <input readOnly value={profile?.full_name ?? ''} className="w-full bg-gray-800 px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="0713..." className="w-full bg-gray-800 px-3 py-2 rounded" />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Program</label>
            <select value={program} onChange={(e) => setProgram(e.target.value as any)} className="w-full bg-gray-800 px-3 py-2 rounded">
              <option value="kids">Kids</option>
              <option value="teens">Teens</option>
              <option value="adults">Adults</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Location</label>
            <select value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-gray-800 px-3 py-2 rounded">
              <option>Mwiki</option>
              <option>Kasarani</option>
              <option>Sunton Mwiki</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Current belt level</label>
            <select value={beltLevel} onChange={(e) => setBeltLevel(e.target.value)} className="w-full bg-gray-800 px-3 py-2 rounded">
              <option>White belt</option>
              <option>Yellow belt</option>
              <option>Orange belt</option>
              <option>Purple belt</option>
              <option>Green belt</option>
              <option>Brown belt</option>
              <option>Black belt</option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Belt assignment will be confirmed by your instructor.</p>
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="px-6 py-2 bg-yellow-600 text-black rounded">{saving ? 'Saving...' : 'Complete Onboarding'}</button>
            <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 bg-gray-800 rounded">Skip</button>
          </div>
        </form>
      </div>
    </div>
  );
}
