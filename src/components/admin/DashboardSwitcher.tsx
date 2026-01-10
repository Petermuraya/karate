import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ShieldCheck } from 'lucide-react';
import { useIsInstructor } from '@/hooks/useUserRole';

export default function DashboardSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isInstructor } = useIsInstructor();
  
  const isOnInstructor = location.pathname.startsWith('/instructor');
  const isOnDashboard = location.pathname === '/dashboard';

  if (!isInstructor) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {isOnInstructor ? (
        <Button 
          size="sm" 
          variant="outline" 
          onClick={() => navigate('/dashboard')} 
          className="flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Student View</span>
        </Button>
      ) : (
        <Button 
          size="sm" 
          variant="default" 
          onClick={() => navigate('/instructor')} 
          className="flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-sm hidden sm:inline">Instructor Panel</span>
        </Button>
      )}
    </div>
  );
}