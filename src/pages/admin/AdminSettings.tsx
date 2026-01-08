import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function AdminSettings(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [siteTitle, setSiteTitle] = useState(() => localStorage.getItem('siteTitle') || 'Iron Fist Dojo');
  const [registrationsOpen, setRegistrationsOpen] = useState(() => {
    const v = localStorage.getItem('registrationsOpen');
    return v === null ? true : v === 'true';
  });
  const [maintenanceMode, setMaintenanceMode] = useState(() => {
    const v = localStorage.getItem('maintenanceMode');
    return v === 'true';
  });

  useEffect(() => {
    // quick guard: redirect or show nothing if no user (admin route should protect already)
    // left intentionally light — AdminRoute in router handles auth/roles
  }, [user]);

  const handleSave = () => {
    localStorage.setItem('siteTitle', siteTitle);
    localStorage.setItem('registrationsOpen', String(registrationsOpen));
    localStorage.setItem('maintenanceMode', String(maintenanceMode));
    toast({ title: 'Settings saved' });
  };

  const handleReset = () => {
    setSiteTitle('Iron Fist Dojo');
    setRegistrationsOpen(true);
    setMaintenanceMode(false);
    toast({ title: 'Settings reset to defaults' });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-muted bg-card border border-border">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display text-2xl">Settings</h1>
            <p className="text-muted-foreground mt-1">Application and operational settings for the dojo</p>
            <div className="mt-1 text-sm text-muted-foreground">
              <Link to="/admin" className="text-primary">Admin</Link>
              <span className="mx-2">/</span>
              <span>Settings</span>
            </div>
          </div>
        </div>

        <section className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div>
            <Label>Site Title</Label>
            <Input value={siteTitle} onChange={(e) => setSiteTitle(e.target.value)} className="mt-2" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Registrations</div>
              <div className="text-sm text-muted-foreground">Allow new users to sign up</div>
            </div>
            <Switch checked={registrationsOpen} onCheckedChange={(v) => setRegistrationsOpen(Boolean(v))} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Maintenance Mode</div>
              <div className="text-sm text-muted-foreground">Prevent site access for regular users</div>
            </div>
            <Switch checked={maintenanceMode} onCheckedChange={(v) => setMaintenanceMode(Boolean(v))} />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <Button onClick={handleSave}>Save Settings</Button>
            <Button variant="outline" onClick={handleReset}>Reset</Button>
          </div>
        </section>
      </div>
    </div>
  );
}
