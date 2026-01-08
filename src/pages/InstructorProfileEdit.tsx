import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

export default function InstructorProfileEdit(): JSX.Element {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [level, setLevel] = useState('');
  const [bio, setBio] = useState('');
  const [historyFiles, setHistoryFiles] = useState<File[]>([]);
  const [historyPreviews, setHistoryPreviews] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);
  const historyRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user) return navigate('/auth');
    if (profile) {
      setPhone(profile.phone || '');
      setAvatarPreview(profile.avatar_url || null);
    }
    // load instructor row if exists
    (async () => {
      if (!user) return;
      const { data } = await supabase.from('instructors').select('*').eq('user_id', user.id).maybeSingle();
      if (data) {
        setBio(data.bio || '');
        // use certifications to store history image urls (if present)
        if (Array.isArray(data.certifications)) {
          setHistoryPreviews(data.certifications as string[]);
        }
      }
    })();
  }, [user, profile, navigate]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setAvatarFile(f);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result));
    reader.readAsDataURL(f);
  }

  function handleHistoryFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;
    setHistoryFiles((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const r = new FileReader();
      r.onload = () => setHistoryPreviews((p) => [...p, String(r.result)]);
      r.readAsDataURL(f);
    });
  }

  function removeHistoryPreview(index: number) {
    setHistoryPreviews((p) => p.filter((_, i) => i !== index));
    setHistoryFiles((f) => f.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setStatus(null);
    try {
      // Upload avatar
      let avatarUrl = profile?.avatar_url ?? null;
      if (avatarFile) {
        const path = `instructors/${user.id}/avatar_${Date.now()}_${avatarFile.name}`;
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, avatarFile, { upsert: true });
        if (upErr) throw upErr;
        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        avatarUrl = data.publicUrl;
      }

      // Upload history images to 'instructor-history' bucket
      const uploadedHistoryUrls: string[] = [];
      for (const f of historyFiles) {
        const path = `instructors/${user.id}/history/${Date.now()}_${f.name}`;
        const { error } = await supabase.storage.from('instructor-history').upload(path, f, { upsert: true });
        if (error) {
          console.warn('history upload error', error);
          continue;
        }
        const { data } = supabase.storage.from('instructor-history').getPublicUrl(path);
        uploadedHistoryUrls.push(data.publicUrl);
      }

      // Upsert profile avatar and phone
      await supabase.from('profiles').upsert({ user_id: user.id, phone: phone.replace(/\D/g, ''), avatar_url: avatarUrl }, { onConflict: 'user_id' });

      // Upsert instructors row (store bio on instructors table)
      const { data: instr } = await supabase.from('instructors').select('*').eq('user_id', user.id).maybeSingle();
      let instructorId: string;
      if (instr) {
        instructorId = instr.id;
        await supabase.from('instructors').update({ bio, verified: instr.verified ?? false }).eq('user_id', user.id);
      } else {
        const { data: created } = await supabase.from('instructors').insert({ user_id: user.id, bio }).select().single();
        instructorId = created.id;
      }

      // Record history images in instructor_history table instead of instructors.certifications
      const previewUrls = historyPreviews.filter(u => u.startsWith('http'));
      const allUrls = [...uploadedHistoryUrls, ...previewUrls];
      if (allUrls.length) {
        // Find existing entries to avoid duplicates
        const { data: existing } = await supabase.from('instructor_history').select('image_url').eq('instructor_id', instructorId).in('image_url', allUrls as string[]);
        const existingSet = new Set((existing || []).map((r: any) => r.image_url));
        const toInsert = allUrls.filter((u) => !existingSet.has(u)).map((url) => ({ instructor_id: instructorId, image_url: url, uploaded_by: user.id }));
        if (toInsert.length) {
          await supabase.from('instructor_history').insert(toInsert);
        }
      }

      await refreshProfile();
      setStatus('Profile saved');
      setHistoryFiles([]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('save instructor profile', err);
      setStatus('Failed to save profile (check storage buckets exist)');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-4xl mx-auto bg-card rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Instructor Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="w-40 h-40 bg-gray-800 rounded-full overflow-hidden mb-4">
              {avatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-muted">No photo</div>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => avatarRef.current?.click()} className="px-3 py-2 bg-primary rounded">Upload Avatar</button>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              <button onClick={() => { setAvatarFile(null); setAvatarPreview(null); }} className="px-3 py-2 bg-gray-700 rounded">Remove</button>
            </div>
            <div className="mt-6">
              <label className="text-sm text-muted">Phone</label>
              <input className="w-full mt-1 p-2 bg-input rounded" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div className="col-span-2">
            <label className="text-sm text-muted">Level (e.g. 2nd Dan)</label>
            <input className="w-full mt-1 p-2 bg-input rounded mb-4" value={level} onChange={(e) => setLevel(e.target.value)} placeholder="e.g. 2nd Dan" />

            <label className="text-sm text-muted">Bio</label>
            <textarea className="w-full mt-1 p-2 bg-input rounded h-32" value={bio} onChange={(e) => setBio(e.target.value)} />

            <div className="mt-4">
              <label className="text-sm text-muted">History Images (add multiple)</label>
              <div className="flex gap-2 mt-2">
                <button onClick={() => historyRef.current?.click()} className="px-3 py-2 bg-primary rounded">Add Images</button>
                <input ref={historyRef} type="file" accept="image/*" multiple className="hidden" onChange={handleHistoryFiles} />
                <div className="text-sm text-muted">You can add multiple photos of achievements, history, etc.</div>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2">
                {historyPreviews.map((src, idx) => (
                  <div key={idx} className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt={`history-${idx}`} className="w-full h-24 object-cover rounded" />
                    <button onClick={() => removeHistoryPreview(idx)} className="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 rounded text-xs">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-yellow-600 text-black rounded">{saving ? 'Saving...' : 'Save Changes'}</button>
          <button onClick={() => navigate('/instructor')} className="px-3 py-2 bg-gray-700 rounded">Cancel</button>
          {status && <div className="text-sm text-muted ml-2">{status}</div>}
        </div>
      </div>
    </div>
  );
}
