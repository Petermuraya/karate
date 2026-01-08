import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { session, loading: authLoading } = useAuth();
  const { data: role, isLoading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) return null;

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const allowed = role === 'admin' || role === 'instructor';
  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
