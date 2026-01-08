import React, { useState, useRef, FormEvent, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

const AVAILABLE_PROGRAMS = [
  'All Programs',
  'Competition Training',
  'Kids & Teens',
  'Adults Only',
  'Beginner',
];

export default function StudentProfileEdit(): JSX.Element {
  const { user, profile, refreshProfile } = useAuth();

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [programs, setPrograms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setPhotoFile(f);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(String(reader.result));
    reader.readAsDataURL(f);
  }

  function toggleProgram(name: string) {
    setPrograms((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  }

  function validatePhone(value: string) {
    const digits = value.replace(/\D/g, '');
    // basic length check (accept local +254 or 0-prefixed numbers)
    return digits.length >= 9 && digits.length <= 13;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus(null);
    if (!validatePhone(phone)) {
      setStatus('Please enter a valid phone number.');
      return;
    }

    setSaving(true);
    try {
      // Upload avatar if provided
      let publicUrl: string | null = profile?.avatar_url ?? null;
      if (photoFile && user) {
        const path = `avatars/${user.id}/${Date.now()}_${photoFile.name}`;
        const { error: uploadError } = await supabase.storage.from('avatars').upload(path, photoFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        publicUrl = data.publicUrl;
      }

      // Update profiles table
      if (user) {
        await supabase.from('profiles').upsert({
          user_id: user.id,
          phone: phone.replace(/\D/g, ''),
          program: programs.join(', '),
          avatar_url: publicUrl,
        }, { onConflict: 'user_id' });

        // Ensure students row matches program
        const { data: existing } = await supabase.from('students').select('*').eq('user_id', user.id).single();
        if (existing) {
          await supabase.from('students').update({ program: programs[0] || null }).eq('user_id', user.id);
        } else {
          await supabase.from('students').insert({ user_id: user.id, program: programs[0] || null });
        }
      }

      await refreshProfile();
      setStatus('Profile saved successfully.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed saving profile', err);
      setStatus('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || '');
      setPrograms(profile.program ? profile.program.split(',').map((s) => s.trim()) : []);
      if (profile.avatar_url) setPhotoPreview(profile.avatar_url);
    }
  }, [profile]);

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">Edit Student Profile</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-40 h-40 bg-gray-800 rounded-full overflow-hidden flex items-center justify-center">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-gray-400 px-3">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-14 h-14 mx-auto">
                    <path fill="currentColor" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 5v1h18v-1c0-2.5-4-5-9-5z" />
                  </svg>
                  <div className="text-sm mt-1 text-gray-400">No photo</div>
                </div>
              )}
            </div>

            <div className="flex-1">
              <label className="block text-sm text-gray-300 mb-2">Profile Photo</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
                >
                  Upload Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {photoFile && <span className="text-sm text-gray-400">{photoFile.name}</span>}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +254713178790 or 0713178790"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
            <p className="text-xs text-gray-500 mt-1">We'll use this number for WhatsApp contact.</p>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Program Preferences</label>
            <div className="grid sm:grid-cols-2 gap-3">
              {AVAILABLE_PROGRAMS.map((p) => (
                <label key={p} className="flex items-center gap-3 bg-gray-800 p-3 rounded">
                  <input
                    type="checkbox"
                    checked={programs.includes(p)}
                    onChange={() => toggleProgram(p)}
                    className="w-4 h-4"
                  />
                  <span className="text-gray-200">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold rounded"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => {
                // Reset form (simple reset)
                setPhotoFile(null);
                setPhotoPreview(null);
                setPhone('');
                setPrograms([]);
                setStatus(null);
              }}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            >
              Reset
            </button>
            {status && <div className="text-sm text-green-400">{status}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}
