import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, Home } from 'lucide-react';

export default function DashboardSwitcher() {
  const navigate = useNavigate();

  return (
    <Button size="sm" variant="ghost" onClick={() => navigate('/instructor')} className="flex items-center gap-2">
      <Home className="w-4 h-4" />
      <span className="text-sm">Instructor</span>
    </Button>
  );
}
