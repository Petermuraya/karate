import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { useAllStudents, useUpdateUserRole } from '@/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function AdminUsers() {
  const navigate = useNavigate();
  const { data: users, isLoading } = useAllStudents();
  const updateRole = useUpdateUserRole();
  const [updatingRoles, setUpdatingRoles] = useState<Record<string, boolean>>({});
  const [optimisticRoles, setOptimisticRoles] = useState<Record<string, string>>({});

  const handleRoleChange = async (u: any, role: 'admin' | 'instructor' | 'student') => {
    const user_id = u.user_id || u.id;
    setOptimisticRoles(prev => ({ ...prev, [user_id]: role }));
    setUpdatingRoles(prev => ({ ...prev, [user_id]: true }));
    try {
      await updateRole.mutateAsync({ user_id, role });
    } catch (err) {
      console.error('Failed to update role', err);
      // revert optimistic
      setOptimisticRoles(prev => {
        const copy = { ...prev };
        delete copy[user_id];
        return copy;
      });
    } finally {
      setUpdatingRoles(prev => ({ ...prev, [user_id]: false }));
    }
  };

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
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded-md border px-2 py-1 text-sm"
                        value={optimisticRoles[u.user_id || u.id] || u.role || 'student'}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        disabled={!!updatingRoles[u.user_id || u.id]}
                      >
                      <option value="student">student</option>
                      <option value="instructor">instructor</option>
                      <option value="admin">admin</option>
                      </select>
                      {updatingRoles[u.user_id || u.id] && (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </TableCell>
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
                  <div className="mt-2 text-xs text-muted-foreground">
                    Role: <span className="font-medium text-foreground">{u.role || 'student'}</span>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center gap-2">
                      <select
                        className="rounded-md border px-2 py-1 text-sm mt-2"
                        value={optimisticRoles[u.user_id || u.id] || u.role || 'student'}
                        onChange={(e) => handleRoleChange(u, e.target.value)}
                        disabled={!!updatingRoles[u.user_id || u.id]}
                      >
                      <option value="student">student</option>
                      <option value="instructor">instructor</option>
                      <option value="admin">admin</option>
                      </select>
                      {updatingRoles[u.user_id || u.id] && (
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>
                  </div>
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
