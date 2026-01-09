import React, { useRef, useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const PROGRAM_OPTIONS = [
  'all',
  'competition',
  'kids',
  'adults',
];

function readableFileSize(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let v = bytes;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(1)} ${units[i]}`;
}

function extractYouTubeId(url: string) {
  const m = url.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

export default function InstructorVideoUpload(): JSX.Element {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [mode, setMode] = useState<'upload' | 'youtube'>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [program, setProgram] = useState(PROGRAM_OPTIONS[0]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const MAX_SIZE_BYTES = 500 * 1024 * 1024; // 500MB

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith('video/')) {
      setError('Please select a valid video file.');
      return;
    }
    if (f.size > MAX_SIZE_BYTES) {
      setError(`File too large — max ${readableFileSize(MAX_SIZE_BYTES)}.`);
      return;
    }
    setFile(f);
    setPreviewURL(URL.createObjectURL(f));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError('You must be signed in to upload.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title for the video.');
      return;
    }

    setUploading(true);

    try {
      let videoUrl = '';
      let thumbnailUrl: string | null = null;

      if (mode === 'youtube') {
        const id = extractYouTubeId(youtubeUrl.trim());
        if (!id) {
          setError('Invalid YouTube URL');
          setUploading(false);
          return;
        }
        // store embed url for iframe
        videoUrl = `https://www.youtube.com/embed/${id}`;
        thumbnailUrl = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
      } else {
        if (!file) {
          setError('Please select a video file to upload.');
          setUploading(false);
          return;
        }

        const path = `videos/${user.id}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9_.-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('videos').upload(path, file, { upsert: false });
        if (uploadError) {
          console.error('Upload error', uploadError);
          toast({ title: 'Upload failed', description: uploadError.message || 'Check storage bucket and permissions', variant: 'destructive' });
          setUploading(false);
          return;
        }

        const { data } = supabase.storage.from('videos').getPublicUrl(path);
        videoUrl = data.publicUrl;
      }

      // Insert into videos table
      const insertObj: any = {
        title: title.trim(),
        description: description.trim() || null,
        category: program,
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl,
        is_public: false,
        minimum_belt_rank: 'white',
        instructor_name: profile?.full_name || user.email || null,
      };

      const { data: inserted, error: insertErr } = await supabase.from('videos').insert(insertObj).select().maybeSingle();
      if (insertErr) {
        console.error('Insert error', insertErr);
        toast({ title: 'Failed to save video', description: insertErr.message || undefined, variant: 'destructive' });
        setUploading(false);
        return;
      }

      toast({ title: 'Video added', description: 'Your video is saved to the library' });

      // cleanup
      setTitle('');
      setDescription('');
      setFile(null);
      setPreviewURL((p) => { if (p) URL.revokeObjectURL(p); return null; });
      setYoutubeUrl('');

      // redirect to instructor videos list
      navigate('/instructor/videos');
    } catch (err) {
      console.error('Upload flow error', err);
      toast({ title: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-8 px-4">
      <div className="max-w-4xl mx-auto bg-card border border-border rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-4">Instructor — Add Training Video</h1>

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setMode('upload')}
            className={`px-3 py-2 rounded ${mode === 'upload' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            Upload File
          </button>
          <button
            onClick={() => setMode('youtube')}
            className={`px-3 py-2 rounded ${mode === 'youtube' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            YouTube Link
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-muted-foreground mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Advanced Kicks — Session 3"
              className="w-full bg-input border border-border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Short summary of the video"
              className="w-full bg-input border border-border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-muted-foreground mb-2">Program</label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full bg-input border border-border rounded px-3 py-2"
            >
              {PROGRAM_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {mode === 'upload' && (
            <div>
              <label className="block text-sm text-muted-foreground mb-2">Video File</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded"
                >
                  Choose File
                </button>
                <input ref={fileRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                <div className="text-sm text-muted-foreground">
                  {file ? `${file.name} • ${readableFileSize(file.size)}` : 'No file selected'}
                </div>
              </div>
              {previewURL && (
                <div className="mt-4">
                  <label className="block text-sm text-muted-foreground mb-2">Preview</label>
                  <video src={previewURL} controls className="w-full rounded bg-black" />
                </div>
              )}
            </div>
          )}

          {mode === 'youtube' && (
            <div>
              <label className="block text-sm text-muted-foreground mb-2">YouTube URL</label>
              <input
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-input border border-border rounded px-3 py-2"
              />
            </div>
          )}

          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-primary text-primary-foreground font-semibold rounded"
            >
              {uploading ? 'Saving…' : 'Save Video'}
            </button>
            <button
              type="button"
              onClick={() => {
                setFile(null);
                if (previewURL) {
                  URL.revokeObjectURL(previewURL);
                  setPreviewURL(null);
                }
                setError(null);
                setYoutubeUrl('');
              }}
              className="px-4 py-2 bg-muted rounded"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
