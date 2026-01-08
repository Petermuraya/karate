import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAllStudents } from '@/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function AdminUsers() {
  const navigate = useNavigate();
  const { data: users, isLoading } = useAllStudents();

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-4 sm:mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display text-2xl">User Management</h1>
                <p className="text-muted-foreground">Search, view and manage users</p>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Button className="flex-1 sm:flex-none">Invite</Button>
                <Button variant="outline">Export</Button>
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              <Link to="/admin" className="text-primary">Admin</Link>
              <span className="mx-2">/</span>
              <span>User Management</span>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block bg-card border border-border rounded-lg overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(users || []).map((u: any) => (
                <TableRow key={u.id}>
                  <TableCell>{u.full_name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role || 'student'}</TableCell>
                  <TableCell>{new Date(u.inserted_at || u.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost">View</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden space-y-3">
          {(users || []).map((u: any) => (
            <div key={u.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-foreground">{u.full_name}</div>
                  <div className="text-xs text-muted-foreground">{u.email}</div>
                  <div className="mt-2 text-xs text-muted-foreground">Role: <span className="font-medium text-foreground">{u.role || 'student'}</span></div>
                </div>
                <div className="flex-shrink-0">
                  <Button size="sm" variant="ghost">View</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
