import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function InstructorProfileEdit(): JSX.Element {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (profile) {
      setPhone(profile.phone || '');
      setFullName(profile.full_name || '');
      setAvatarPreview(profile.avatar_url || null);
    }
  }, [user, profile, navigate]);

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);

    try {
      let avatarUrl = profile?.avatar_url ?? null;

      // Upload avatar if changed
      if (avatarFile) {
        const path = `avatars/${user.id}/${Date.now()}_${avatarFile.name}`;
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(path, avatarFile, { upsert: true });

        if (uploadError) {
          console.error('Avatar upload error:', uploadError);
          toast({ title: 'Avatar upload failed', description: 'Check if storage bucket exists', variant: 'destructive' });
        } else {
          const { data } = supabase.storage.from('avatars').getPublicUrl(path);
          avatarUrl = data.publicUrl;
        }
      }

      // Update profile
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          phone: phone.replace(/\D/g, ''),
          avatar_url: avatarUrl
        })
        .eq('user_id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({ title: 'Profile updated successfully!' });
    } catch (err) {
      console.error('Save error:', err);
      toast({ title: 'Failed to save profile', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/instructor">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display text-xl text-foreground flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                EDIT PROFILE
              </h1>
              <p className="text-sm text-muted-foreground">Update your instructor profile</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="text-center">
              <div className="w-40 h-40 mx-auto bg-secondary rounded-full overflow-hidden mb-4 border-4 border-primary/20">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => avatarRef.current?.click()}
                >
                  Upload Photo
                </Button>
                <input
                  ref={avatarRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
                {avatarPreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}
                  >
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Form Section */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <input
                  value={profile?.email || ''}
                  disabled
                  className="w-full mt-1 p-3 bg-secondary/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Phone Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 p-3 bg-secondary border border-border rounded-lg"
                  placeholder="Your phone number"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="hero"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/instructor')}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
