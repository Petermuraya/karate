import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { ClassManager } from '@/components/admin/ClassManager';

export default function AdminClasses() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-muted bg-card border border-border">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display text-2xl">Classes</h1>
            <p className="text-muted-foreground">Manage class schedules and templates</p>
            <div className="mt-1 text-sm text-muted-foreground">
              <Link to="/admin" className="text-primary">Admin</Link>
              <span className="mx-2">/</span>
              <span>Classes</span>
            </div>
          </div>
        </div>

        <ClassManager />
      </div>
    </div>
  );
}
