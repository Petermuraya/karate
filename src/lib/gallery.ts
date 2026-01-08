import heroImage from '@/assets/hero-karate.jpg';
import instructorImage from '@/assets/instructor.png';

export type GalleryItem = {
  id: string;
  image_url: string;
  alt?: string;
  span?: string;
};

const DEFAULT_GALLERY: GalleryItem[] = [
  { id: '1', image_url: heroImage, alt: 'Karate training session', span: 'col-span-2 row-span-2' },
  { id: '2', image_url: instructorImage, alt: 'Sensei demonstration', span: 'col-span-1 row-span-1' },
  { id: '3', image_url: heroImage, alt: 'Competition moment', span: 'col-span-1 row-span-1' },
  { id: '4', image_url: instructorImage, alt: 'Belt ceremony', span: 'col-span-1 row-span-2' },
  { id: '5', image_url: heroImage, alt: 'Kids class', span: 'col-span-1 row-span-1' },
  { id: '6', image_url: instructorImage, alt: 'Team training', span: 'col-span-1 row-span-1' },
];

const KEY = 'site.gallery.items';

export function getGalleryItems(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_GALLERY;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return DEFAULT_GALLERY;
    return parsed;
  } catch (e) {
    return DEFAULT_GALLERY;
  }
}

export function saveGalleryItems(items: GalleryItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function addGalleryItem(item: Omit<GalleryItem, 'id'>) {
  const items = getGalleryItems();
  const id = String(Date.now());
  const next = [...items, { id, ...item }];
  saveGalleryItems(next);
  return next;
}

export function removeGalleryItem(id: string) {
  const items = getGalleryItems();
  const next = items.filter((i) => i.id !== id);
  saveGalleryItems(next);
  return next;
}
