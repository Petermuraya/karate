import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics, useAllStudents, useAttendanceRecords } from '@/hooks/useAdminData';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

function downloadCSV(filename: string, rows: Record<string, any>[]) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')]
    .concat(rows.map(r => headers.map(h => {
      const val = r[h] ?? '';
      const s = String(val).replace(/"/g, '""');
      return `"${s}"`;
    }).join(','))).join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminReports() {
  const navigate = useNavigate();
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: students } = useAllStudents();
  const { data: attendance } = useAttendanceRecords();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-muted bg-card border border-border">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display text-2xl">Reports</h1>
            <p className="text-muted-foreground mt-1">Operational reports and exports</p>
            <div className="mt-1 text-sm text-muted-foreground">
              <Link to="/admin" className="text-primary">Admin</Link>
              <span className="mx-2">/</span>
              <span>Reports</span>
            </div>
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Students</div>
            <div className="text-2xl font-medium mt-1">{analyticsLoading ? '—' : analytics?.studentCount ?? 0}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Active classes</div>
            <div className="text-2xl font-medium mt-1">{analyticsLoading ? '—' : analytics?.classCount ?? 0}</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground">Attendance (30d)</div>
            <div className="text-2xl font-medium mt-1">{analyticsLoading ? '—' : analytics?.monthlyAttendance ?? 0}</div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Belt Distribution</h2>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="ghost" onClick={() => downloadCSV('belt-distribution.csv', Object.entries(analytics?.beltDistribution || {}).map(([k, v]) => ({ belt: k, count: v })) )}>Export CSV</Button>
              </div>
            </div>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Belt</TableHead>
                    <TableHead>Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(analytics?.beltDistribution || {}).map(([b, c]) => (
                    <TableRow key={b}>
                      <TableCell>{b}</TableCell>
                      <TableCell>{c}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-medium">Program Distribution</h2>
              <Button size="sm" variant="ghost" onClick={() => downloadCSV('program-distribution.csv', Object.entries(analytics?.programDistribution || {}).map(([k, v]) => ({ program: k, count: v })) )}>Export CSV</Button>
            </div>
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Count</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(analytics?.programDistribution || {}).map(([p, c]) => (
                    <TableRow key={p}>
                      <TableCell>{p}</TableCell>
                      <TableCell>{c}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        <section className="mt-6 bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium">Recent Attendance</h2>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" onClick={() => downloadCSV('attendance.csv', (attendance || []).map(a => ({ id: a.id, user_id: a.user_id, class_id: a.class_id, attended_at: a.attended_at })))}>Export CSV</Button>
              <Button size="sm" onClick={() => downloadCSV('students.csv', (students || []).map(s => ({ id: s.id, full_name: s.full_name, email: s.email, belt_rank: s.belt_rank, program: s.program })))}>Export Students</Button>
            </div>
          </div>

          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(attendance || []).map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell>{new Date(a.attended_at).toLocaleString()}</TableCell>
                    <TableCell>{a.profiles?.full_name || a.user_id}</TableCell>
                    <TableCell>{a.classes?.title || a.class_id}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
