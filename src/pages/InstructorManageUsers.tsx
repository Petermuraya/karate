import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type UserRow = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  role: string;
  created_at?: string;
};

type StudentRow = {
  id: string;
  user_id: string;
  belt_level?: string | null;
  program?: string | null;
  location?: string | null;
  enrollment_date?: string | null;
};

export default function InstructorManageUsers(): JSX.Element {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [studentsMap, setStudentsMap] = useState<Record<string, StudentRow>>({});
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', email: '', phone: '', program: 'adults', location: '', belt_level: 'White belt' });
  const belts = ['White belt','Yellow belt','Orange belt','Purple belt','Green belt','Brown belt','Black belt'];

  useEffect(() => {
    if (!user) return;
    loadUsers();
  }, [user]);

  async function loadUsers() {
    try {
      const { data: allUsers } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (!allUsers) return;

      const studentIds = allUsers.filter(u => u.role === 'student').map(u => u.id);
      let students: StudentRow[] = [];
      if (studentIds.length) {
        const { data } = await supabase.from('students').select('*').in('user_id', studentIds);
        students = (data as StudentRow[]) || [];
      }

      const map: Record<string, StudentRow> = {};
      students.forEach(s => { map[s.user_id] = s; });

      setUsers(allUsers as UserRow[]);
      setStudentsMap(map);
    } catch (err) {
      console.error('load users error', err);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => (u.name||'').toLowerCase().includes(q) || (u.email||'').toLowerCase().includes(q) || (u.phone||'').includes(q));
  }, [query, users]);

  async function toggleActive(u: UserRow) {
    try {
      await supabase.from('users').update({ /* no active column; simulate via role change? */ }).eq('id', u.id);
      // reload list
      await loadUsers();
    } catch (err) {
      console.error(err);
    }
  }

  async function removeUser(u: UserRow) {
    if (!confirm('Remove this user? This will delete application data.')) return;
    try {
      await supabase.from('users').delete().eq('id', u.id);
      await loadUsers();
    } catch (err) {
      console.error(err);
    }
  }

  async function invite() {
    if (!inviteEmail.includes('@')) return alert('Enter a valid email');
    // create application user row and profile; do NOT create auth user here
    try {
      const { data: newUser } = await supabase.from('users').insert({ email: inviteEmail, role: 'student', name: inviteEmail.split('@')[0] }).select().single();
      if (!newUser) throw new Error('Could not create user');
      await supabase.from('profiles').insert({ user_id: newUser.id, full_name: newUser.name, email: newUser.email });
      setInviteEmail('');
      await loadUsers();
      alert(`Invitation recorded for ${newUser.email} — send welcome email from your mail tool.`);
    } catch (err) {
      console.error(err);
      alert('Failed to invite user');
    }
  }

  async function addStudent() {
    if (!newStudent.email.includes('@')) return alert('Enter a valid email');
    try {
      const { data: created } = await supabase.from('users').insert({ email: newStudent.email, role: 'student', name: newStudent.name, phone: newStudent.phone }).select().single();
      if (!created) throw new Error('create failed');
      await supabase.from('students').insert({ user_id: created.id, belt_level: newStudent.belt_level, program: newStudent.program, location: newStudent.location });
      await supabase.from('profiles').insert({ user_id: created.id, full_name: newStudent.name, email: newStudent.email, phone: newStudent.phone, belt_rank: newStudent.belt_level, program: newStudent.program, location: newStudent.location });
      setNewStudent({ name: '', email: '', phone: '', program: 'adults', location: '', belt_level: 'White belt' });
      await loadUsers();
      alert('Student added');
    } catch (err) {
      console.error(err);
      alert('Failed to add student');
    }
  }

  async function saveUser(updated: UserRow, belt?: string) {
    try {
      await supabase.from('users').update({ name: updated.name, email: updated.email, phone: updated.phone }).eq('id', updated.id);
      if (belt) {
        // update students and profiles
        await supabase.from('students').update({ belt_level: belt }).eq('user_id', updated.id);
        await supabase.from('profiles').update({ belt_rank: belt }).eq('user_id', updated.id);
      }
      setEditing(null);
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    }
  }

  async function assistOnboarding(u: UserRow) {
    try {
      // ensure student record exists
      const existing = await supabase.from('students').select('*').eq('user_id', u.id).single();
      if (!existing.data) {
        await supabase.from('students').insert({ user_id: u.id, enrollment_date: new Date().toISOString().slice(0,10) });
      }
      // ensure profile exists
      const p = await supabase.from('profiles').select('*').eq('user_id', u.id).single();
      if (!p.data) {
        await supabase.from('profiles').insert({ user_id: u.id, full_name: u.name, email: u.email });
      }
      alert('Onboarding assisted — student record created/updated.');
      await loadUsers();
    } catch (err) {
      console.error(err);
      alert('Failed to assist onboarding');
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-6xl mx-auto bg-gray-900 rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Manage Users</h1>
          <div className="flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email or phone"
              className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white w-64"
            />
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex gap-3">
            <input value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="Invite by email" className="bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white w-64" />
            <button onClick={invite} className="px-4 py-2 bg-yellow-600 text-black rounded">Record Invite</button>
          </div>

          <div className="bg-gray-800 p-3 rounded">
            <h3 className="font-semibold mb-2">Add Student</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              <input placeholder="Full name" value={newStudent.name} onChange={(e) => setNewStudent(s => ({ ...s, name: e.target.value }))} className="bg-gray-700 px-2 py-2 rounded" />
              <input placeholder="Email" value={newStudent.email} onChange={(e) => setNewStudent(s => ({ ...s, email: e.target.value }))} className="bg-gray-700 px-2 py-2 rounded" />
              <input placeholder="Phone" value={newStudent.phone} onChange={(e) => setNewStudent(s => ({ ...s, phone: e.target.value }))} className="bg-gray-700 px-2 py-2 rounded" />
            </div>
            <div className="flex gap-2 items-center">
              <select value={newStudent.belt_level} onChange={(e) => setNewStudent(s => ({ ...s, belt_level: e.target.value }))} className="bg-gray-700 px-2 py-2 rounded">
                {belts.map(b => <option key={b}>{b}</option>)}
              </select>
              <select value={newStudent.program} onChange={(e) => setNewStudent(s => ({ ...s, program: e.target.value }))} className="bg-gray-700 px-2 py-2 rounded">
                <option value="kids">kids</option>
                <option value="teens">teens</option>
                <option value="adults">adults</option>
              </select>
              <input placeholder="Location" value={newStudent.location} onChange={(e) => setNewStudent(s => ({ ...s, location: e.target.value }))} className="bg-gray-700 px-2 py-2 rounded" />
              <button onClick={addStudent} className="px-3 py-2 bg-primary text-black rounded">Add</button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-sm text-gray-300 border-b border-gray-800">
                <th className="py-2">Name</th>
                <th className="py-2">Email</th>
                <th className="py-2">Phone</th>
                <th className="py-2">Role</th>
                <th className="py-2">Belt</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800">
                  <td className="py-3">{u.name}</td>
                  <td className="py-3 text-gray-300">{u.email}</td>
                  <td className="py-3 text-gray-300">{u.phone}</td>
                  <td className="py-3 capitalize">{u.role}</td>
                  <td className="py-3">{studentsMap[u.id]?.belt_level || '-'}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(u)} className="px-2 py-1 bg-gray-800 rounded text-sm">Edit</button>
                      <button onClick={() => assistOnboarding(u)} className="px-2 py-1 bg-green-700 rounded text-sm">Assist Onboarding</button>
                      <button onClick={() => removeUser(u)} className="px-2 py-1 bg-red-700 rounded text-sm">Remove</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editing && (
          <div className="mt-6 bg-gray-800 p-4 rounded">
            <h2 className="font-semibold mb-2">Edit User</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="col-span-1 bg-gray-700 px-2 py-2 rounded" />
              <input value={editing.email || ''} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="col-span-1 bg-gray-700 px-2 py-2 rounded" />
              <input value={editing.phone || ''} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="col-span-1 bg-gray-700 px-2 py-2 rounded" />
            </div>
            <div className="mt-3 flex gap-2 items-center">
              <label className="text-sm text-gray-300">Belt:</label>
              <select defaultValue={studentsMap[editing.id]?.belt_level || 'White belt'} className="bg-gray-700 px-2 py-2 rounded" id="belt-select">
                {belts.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={async () => {
                const select = document.getElementById('belt-select') as HTMLSelectElement | null;
                const belt = select?.value;
                editing && await saveUser(editing, belt);
              }} className="px-3 py-2 bg-yellow-600 text-black rounded">Save</button>
              <button onClick={() => setEditing(null)} className="px-3 py-2 bg-gray-700 rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
