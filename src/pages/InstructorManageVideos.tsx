import React, { useState } from 'react';
import { useVideos, Video } from '@/hooks/useVideos';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const InstructorManageVideos = () => {
  const { data: videos, isLoading } = useVideos('all');
  const [editing, setEditing] = useState<Video | null>(null);
  const [form, setForm] = useState<Partial<Video>>({});
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async (payload: { id: string; changes: Partial<Video> }) => {
      const { data, error } = await supabase
        .from('videos')
        .update(payload.changes)
        .eq('id', payload.id)
        .select()
        .maybeSingle();
      if (error) throw error;
      return data as Video;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['videos']);
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // fetch video row to determine if video_url points to storage
      const { data: row, error: fetchErr } = await supabase.from('videos').select('video_url').eq('id', id).maybeSingle();
      if (fetchErr) throw fetchErr;
      if (row && row.video_url && typeof row.video_url === 'string') {
        try {
          // supabase public storage URL pattern: /storage/v1/object/public/<bucket>/<path>
          const url = row.video_url as string;
          const m = url.match(/\/storage\/v1\/object\/public\/([^\/]+)\/(.+)$/);
          if (m) {
            const bucket = m[1];
            const path = decodeURIComponent(m[2]);
            await supabase.storage.from(bucket).remove([path]);
          }
        } catch (e) {
          // ignore storage removal errors but log
          // eslint-disable-next-line no-console
          console.warn('Failed to remove storage object', e);
        }
      }

      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries(['videos']),
  });

  const startEdit = (v: Video) => {
    setEditing(v);
    setForm({
      title: v.title,
      description: v.description,
      category: v.category,
      minimum_belt_rank: v.minimum_belt_rank,
      is_public: v.is_public,
    });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await updateMutation.mutateAsync({ id: editing.id, changes: form });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Instructor — Manage Videos</h1>
      {isLoading ? (
        <div>Loading videos…</div>
      ) : videos && videos.length > 0 ? (
        <div className="space-y-3">
          {videos.map((v) => (
            <div key={v.id} className="flex items-center justify-between bg-white/5 p-3 rounded">
              <div>
                <div className="font-semibold">{v.title}</div>
                <div className="text-sm text-muted-foreground">{v.category} • {v.instructor_name || '—'}</div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => startEdit(v)}
                  className="px-3 py-1 bg-yellow-600 rounded text-black text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this video? This cannot be undone.')) deleteMutation.mutate(v.id);
                  }}
                  className="px-3 py-1 bg-red-600 rounded text-white text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>No videos found.</div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4">
          <form onSubmit={submitEdit} className="bg-white dark:bg-gray-900 rounded max-w-lg w-full p-6">
            <h2 className="text-lg font-semibold mb-3">Edit Video</h2>
            <label className="block text-sm">Title</label>
            <input
              className="w-full mb-3 p-2 border rounded"
              value={form.title ?? ''}
              onChange={(e) => setForm((s) => ({ ...s, title: e.target.value }))}
            />
            <label className="block text-sm">Description</label>
            <textarea
              className="w-full mb-3 p-2 border rounded"
              value={form.description ?? ''}
              onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))}
            />
            <label className="block text-sm">Category</label>
            <input
              className="w-full mb-3 p-2 border rounded"
              value={form.category ?? ''}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
            />
            <label className="block text-sm">Minimum Belt Rank</label>
            <input
              className="w-full mb-3 p-2 border rounded"
              value={form.minimum_belt_rank ?? ''}
              onChange={(e) => setForm((s) => ({ ...s, minimum_belt_rank: e.target.value }))}
            />
            <label className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                checked={!!form.is_public}
                onChange={(e) => setForm((s) => ({ ...s, is_public: e.target.checked }))}
              />
              <span className="text-sm">Public</span>
            </label>

            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setEditing(null)} className="px-3 py-1 border rounded">
                Cancel
              </button>
              <button type="submit" disabled={updateMutation.isLoading} className="px-3 py-1 bg-green-600 rounded text-white">
                {updateMutation.isLoading ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default InstructorManageVideos;
