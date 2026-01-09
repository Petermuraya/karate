import React, { useState, useRef, FormEvent, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Save, RotateCcw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const AVAILABLE_PROGRAMS = [
  'All Programs',
  'Competition Training',
  'Kids & Teens',
  'Adults Only',
  'Beginner',
];

export default function StudentProfileEdit(): JSX.Element {
  const { user, profile, refreshProfile, loading } = useAuth();
  const navigate = useNavigate();

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [phone, setPhone] = useState('');
  const [programs, setPrograms] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

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
    return digits.length >= 9 && digits.length <= 13;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validatePhone(phone)) {
      toast.error('Please enter a valid phone number.');
      return;
    }

    setSaving(true);
    try {
      let publicUrl: string | null = profile?.avatar_url ?? null;
      
      // Upload avatar if provided
      if (photoFile && user) {
        const path = `avatars/${user.id}/${Date.now()}_${photoFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, photoFile, { upsert: true });
        if (uploadError) throw uploadError;
        const { data } = supabase.storage.from('avatars').getPublicUrl(path);
        publicUrl = data.publicUrl;
      }

      // Update profiles table only
      if (user) {
        const { error } = await supabase.from('profiles').update({
          phone: phone.replace(/\D/g, ''),
          program: programs.join(', '),
          avatar_url: publicUrl,
        }).eq('user_id', user.id);

        if (error) throw error;
      }

      await refreshProfile();
      toast.success('Profile saved successfully!');
    } catch (err) {
      console.error('Failed saving profile', err);
      toast.error('Failed to save profile');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

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
              <h1 className="font-display text-xl tracking-wide">Edit Profile</h1>
              <p className="text-sm text-muted-foreground">Update your student information</p>
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
              <CardTitle>Student Profile</CardTitle>
              <CardDescription>
                Manage your profile photo, contact info, and program preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-border">
                      <AvatarImage src={photoPreview || undefined} />
                      <AvatarFallback className="text-2xl bg-primary/10">{initials}</AvatarFallback>
                    </Avatar>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 flex items-center justify-center bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                    >
                      <Camera className="w-8 h-8 text-primary" />
                    </button>
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-medium">{profile?.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{profile?.email}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {photoFile && (
                      <span className="block text-sm text-muted-foreground mt-1">{photoFile.name}</span>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +254713178790 or 0713178790"
                  />
                  <p className="text-xs text-muted-foreground">We'll use this number for WhatsApp contact.</p>
                </div>

                {/* Program Preferences */}
                <div className="space-y-3">
                  <Label>Program Preferences</Label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {AVAILABLE_PROGRAMS.map((p) => (
                      <label
                        key={p}
                        className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={programs.includes(p)}
                          onCheckedChange={() => toggleProgram(p)}
                        />
                        <span className="text-sm">{p}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <Button type="submit" disabled={saving} className="gap-2">
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setPhotoFile(null);
                      setPhotoPreview(profile?.avatar_url || null);
                      setPhone(profile?.phone || '');
                      setPrograms(profile?.program ? profile.program.split(',').map((s) => s.trim()) : []);
                    }}
                    className="gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
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
