import React, { useRef, useState, FormEvent } from 'react';

const PROGRAM_OPTIONS = [
  'All Programs',
  'Competition Training',
  'Kids & Teens',
  'Adults Only',
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

export default function InstructorVideoUpload(): JSX.Element {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [program, setProgram] = useState(PROGRAM_OPTIONS[0]);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
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

  async function simulateUpload(fileToUpload: File) {
    setUploading(true);
    setProgress(0);
    // Simulate upload progress
    await new Promise<void>((resolve) => {
      let p = 0;
      const id = setInterval(() => {
        p += Math.random() * 15 + 5; // random step
        if (p >= 100) {
          p = 100;
          setProgress(100);
          clearInterval(id);
          setTimeout(() => resolve(), 400);
        } else {
          setProgress(Math.floor(p));
        }
      }, 300);
    });
    setUploading(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError('Please select a video file to upload.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title for the video.');
      return;
    }

    // In a real app, create FormData and POST to an API endpoint.
    const payload = {
      title,
      description,
      program,
      filename: file.name,
      size: file.size,
      type: file.type,
    };
    // eslint-disable-next-line no-console
    console.log('Preparing upload payload', payload);

    try {
      await simulateUpload(file);
      // eslint-disable-next-line no-console
      console.log('Upload complete (simulated) —', payload);
      setError(null);
      setTitle('');
      setDescription('');
      setProgram(PROGRAM_OPTIONS[0]);
      setFile(null);
      if (previewURL) {
        URL.revokeObjectURL(previewURL);
        setPreviewURL(null);
      }
      alert('Video uploaded (simulated).');
    } catch (err) {
      setError('Upload failed. Try again.');
      setUploading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold mb-4">Instructor — Add Training Video</h1>
        <p className="text-sm text-gray-400 mb-6">Upload a new training video for the library. Accepted: video/*, max 500MB.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g. Advanced Kicks — Session 3"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Short summary of the video"
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Program</label>
            <select
              value={program}
              onChange={(e) => setProgram(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
            >
              {PROGRAM_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="text-black">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Video File</label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
              >
                Choose File
              </button>
              <input ref={fileRef} type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
              <div className="text-sm text-gray-400">
                {file ? `${file.name} • ${readableFileSize(file.size)}` : 'No file selected'}
              </div>
            </div>
            {error && <div className="mt-2 text-sm text-red-400">{error}</div>}
          </div>

          {previewURL && (
            <div>
              <label className="block text-sm text-gray-300 mb-2">Preview</label>
              <video src={previewURL} controls className="w-full rounded bg-black" />
            </div>
          )}

          {uploading && (
            <div className="w-full bg-gray-800 rounded overflow-hidden">
              <div className="h-2 bg-yellow-600" style={{ width: `${progress}%` }} />
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={uploading}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-black font-semibold rounded"
            >
              {uploading ? `Uploading ${progress}%` : 'Upload Video'}
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
              }}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded text-gray-200"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
