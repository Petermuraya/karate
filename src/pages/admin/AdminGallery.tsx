import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getGalleryItems, addGalleryItem, removeGalleryItem, GalleryItem, saveGalleryItems } from '@/lib/gallery';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';

export default function AdminGallery() {
  const navigate = useNavigate();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    setItems(getGalleryItems());
  }, []);

  function handleAdd() {
    if (!url) return;
    const next = addGalleryItem({ image_url: url, alt });
    setItems(next);
    setUrl('');
    setAlt('');
  }

  function handleRemove(id: string) {
    const next = removeGalleryItem(id);
    setItems(next);
  }

  function handleReorder(up: boolean, idx: number) {
    const copy = [...items];
    const i = idx;
    const j = up ? idx - 1 : idx + 1;
    if (j < 0 || j >= copy.length) return;
    const tmp = copy[i];
    copy[i] = copy[j];
    copy[j] = tmp;
    saveGalleryItems(copy);
    setItems(copy);
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-muted bg-card border border-border">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="font-display text-2xl">Gallery</h1>
            <p className="text-muted-foreground">Manage public gallery images</p>
          </div>
        </div>

        <section className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex gap-2">
            <Input placeholder="Image URL" value={url} onChange={(e) => setUrl(e.target.value)} />
            <Input placeholder="Alt text" value={alt} onChange={(e) => setAlt(e.target.value)} />
            <Button onClick={handleAdd}>Add</Button>
          </div>
        </section>

        <section className="bg-card border border-border rounded-lg p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Preview</TableHead>
                <TableHead>Alt</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it, idx) => (
                <TableRow key={it.id}>
                  <TableCell>
                    <img src={it.image_url} alt={it.alt} className="w-24 h-16 object-cover rounded" />
                  </TableCell>
                  <TableCell>{it.alt}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleReorder(true, idx)}>↑</Button>
                    <Button size="sm" variant="ghost" onClick={() => handleReorder(false, idx)}>↓</Button>
                    <Button size="sm" variant="destructive" onClick={() => handleRemove(it.id)}>Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
      </div>
    </div>
  );
}
