import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Home } from 'lucide-react';

export default function DashboardSwitcher({ current }: { current: 'admin' | 'instructor' }) {
  const navigate = useNavigate();

  const go = () => {
    if (current === 'admin') navigate('/instructor');
    else navigate('/admin');
  };

  return (
    <Button size="sm" variant="ghost" onClick={go} className="flex items-center gap-2">
      {current === 'admin' ? <Users className="w-4 h-4" /> : <Home className="w-4 h-4" />}
      <span className="text-sm">{current === 'admin' ? 'Instructor' : 'Admin'}</span>
    </Button>
  );
}
