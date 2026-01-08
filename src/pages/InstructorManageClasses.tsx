import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

function isoLocal(d: Date) {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00Z`;
}

function makeICS(event: { title: string; description?: string; location?: string; start: Date; end: Date; uid?: string }) {
  const start = event.start.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const end = event.end.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const uid = event.uid || `${Date.now()}@karate.local`;
  return `BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//karate-app//EN\nBEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g,'').split('.')[0]}Z\nDTSTART:${start}\nDTEND:${end}\nSUMMARY:${event.title}\nDESCRIPTION:${(event.description||'').replace(/\n/g,'\\n')}\nLOCATION:${event.location||''}\nEND:VEVENT\nEND:VCALENDAR`;
}

export default function InstructorManageClasses() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [form, setForm] = useState({ title: '', program: 'adults', location: '', weekday: 1, start_time: '18:00', duration_minutes: 60, capacity: 20, is_recurring: true });

  useEffect(() => {
    if (!user) return;
    loadTemplates();
    loadClasses();
  }, [user]);

  async function loadTemplates() {
    const { data } = await supabase.from('class_templates').select('*').eq('instructor_id', user?.id).order('created_at', { ascending: false });
    setTemplates((data as any[]) || []);
  }

  async function loadClasses() {
    const { data } = await supabase.from('classes').select('*').eq('instructor_id', user?.id).order('date_time', { ascending: true });
    setClasses((data as any[]) || []);
  }

  function nextDatesForWeekday(weekday: number, timeH: number, timeM: number, occurrences = 12) {
    const out: Date[] = [];
    const now = new Date();
    let cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), timeH, timeM, 0, 0);
    // move cursor to the next weekday
    while (cursor.getDay() !== weekday) cursor.setDate(cursor.getDate() + 1);
    // if in the past today, move to next week
    if (cursor.getTime() < now.getTime()) cursor.setDate(cursor.getDate() + 7);
    for (let i=0;i<occurrences;i++) {
      out.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 7);
    }
    return out;
  }

  async function createTemplate() {
    if (!user) return alert('Not signed in');
    try {
      const t = { ...form, instructor_id: user.id };
      const { data: created } = await supabase.from('class_templates').insert(t).select().single();
      if (!created) throw new Error('create failed');
      // generate upcoming occurrences (next 12 weeks)
      const [h, m] = form.start_time.split(':').map(Number);
      const dates = nextDatesForWeekday(Number(form.weekday), h, m, 12);
      const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
      const insertClasses = dates.map(d => {
        const start = d;
        const end = new Date(start.getTime() + (form.duration_minutes||60)*60000);
        return ({
          instructor_id: user.id,
          title: form.title,
          program: form.program,
          location: form.location,
          date_time: start.toISOString(),
          day_of_week: dayNames[start.getDay()],
          start_time: `${String(start.getHours()).padStart(2,'0')}:${String(start.getMinutes()).padStart(2,'0')}`,
          end_time: `${String(end.getHours()).padStart(2,'0')}:${String(end.getMinutes()).padStart(2,'0')}`,
          capacity: form.capacity,
          duration_minutes: form.duration_minutes,
          is_published: true,
          is_active: true
        })
      });
      await supabase.from('classes').insert(insertClasses);
      setForm({ title: '', program: 'adults', location: '', weekday: 1, start_time: '18:00', duration_minutes: 60, capacity: 20, is_recurring: true });
      await loadTemplates();
      await loadClasses();
      alert('Template created and upcoming classes generated');
    } catch (err) {
      console.error(err);
      alert('Failed to create template');
    }
  }

  async function deleteTemplate(id: string) {
    if (!confirm('Delete template and all generated upcoming classes?')) return;
    try {
      // remove template
      await supabase.from('class_templates').delete().eq('id', id);
      // remove future classes created for this template: we don't have a template_id on classes, so as a simple heuristic delete classes with same title and instructor in future
      const now = new Date().toISOString();
      await supabase.from('classes').delete().eq('instructor_id', user?.id).eq('title', templates.find(t=>t.id===id)?.title).gt('date_time', now);
      await loadTemplates();
      await loadClasses();
    } catch (err) {
      console.error(err);
      alert('Failed to delete template');
    }
  }

  async function publishClass(c: any) {
    try {
      await supabase.from('classes').update({ is_published: !c.is_published }).eq('id', c.id);
      await loadClasses();
    } catch (err) {
      console.error(err);
    }
  }

  function googleCalendarLink(c: any) {
    const start = new Date(c.date_time);
    const end = new Date(start.getTime() + (c.duration_minutes || 60)*60000);
    const startISO = start.toISOString().replace(/-|:|\.\d{3}Z/g,'');
    const endISO = end.toISOString().replace(/-|:|\.\d{3}Z/g,'');
    const params = new URLSearchParams({ action: 'TEMPLATE', text: c.title, details: `Class: ${c.title}`, location: c.location || '', dates: `${startISO}/${endISO}` });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  function downloadICS(c: any) {
    const start = new Date(c.date_time);
    const end = new Date(start.getTime() + (c.duration_minutes || 60)*60000);
    const ics = makeICS({ title: c.title, location: c.location, start, end, description: `Class: ${c.title}` });
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${c.title.replace(/\s+/g,'_')}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4">
      <div className="max-w-6xl mx-auto bg-card rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">Manage Classes & Timetable</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded">
            <h3 className="font-semibold mb-2">Create Recurring Template</h3>
            <input placeholder="Title" value={form.title} onChange={(e)=>setForm(f=>({...f,title:e.target.value}))} className="w-full mb-2 p-2 bg-input rounded" />
            <input placeholder="Location" value={form.location} onChange={(e)=>setForm(f=>({...f,location:e.target.value}))} className="w-full mb-2 p-2 bg-input rounded" />
            <div className="flex gap-2 mb-2">
              <select value={String(form.weekday)} onChange={(e)=>setForm(f=>({...f,weekday:Number(e.target.value)}))} className="p-2 bg-input rounded">
                <option value={0}>Sunday</option>
                <option value={1}>Monday</option>
                <option value={2}>Tuesday</option>
                <option value={3}>Wednesday</option>
                <option value={4}>Thursday</option>
                <option value={5}>Friday</option>
                <option value={6}>Saturday</option>
              </select>
              <input type="time" value={form.start_time} onChange={(e)=>setForm(f=>({...f,start_time:e.target.value}))} className="p-2 bg-input rounded" />
              <input type="number" value={form.duration_minutes} onChange={(e)=>setForm(f=>({...f,duration_minutes:Number(e.target.value)}))} className="w-24 p-2 bg-input rounded" />
            </div>
            <div className="flex gap-2 items-center">
              <input type="number" value={form.capacity} onChange={(e)=>setForm(f=>({...f,capacity:Number(e.target.value)}))} className="w-24 p-2 bg-input rounded" />
              <label className="text-sm">Recurring</label>
              <input type="checkbox" checked={form.is_recurring} onChange={(e)=>setForm(f=>({...f,is_recurring:e.target.checked}))} />
              <button onClick={createTemplate} className="ml-auto px-3 py-2 bg-primary rounded text-black">Create</button>
            </div>
          </div>

          <div className="bg-secondary p-4 rounded">
            <h3 className="font-semibold mb-2">Upcoming Classes (generated)</h3>
            <div className="space-y-2 max-h-72 overflow-auto">
              {classes.map(c=> (
                <div key={c.id} className="p-2 bg-card rounded flex justify-between items-center">
                  <div>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-sm text-muted">{new Date(c.date_time).toLocaleString()} — {c.location}</div>
                  </div>
                  <div className="flex gap-2">
                    <a target="_blank" rel="noreferrer" href={googleCalendarLink(c)} className="px-2 py-1 bg-blue-600 rounded text-sm">Google</a>
                    <button onClick={()=>downloadICS(c)} className="px-2 py-1 bg-gray-700 rounded text-sm">.ics</button>
                    <button onClick={()=>publishClass(c)} className="px-2 py-1 bg-yellow-600 rounded text-sm">{c.is_published? 'Unpublish':'Publish'}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Templates</h3>
          <div className="space-y-2">
            {templates.map(t => (
              <div key={t.id} className="p-3 bg-card rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-sm text-muted">{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][t.weekday]} @ {t.start_time} — {t.location}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={()=>deleteTemplate(t.id)} className="px-2 py-1 bg-red-700 rounded text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
