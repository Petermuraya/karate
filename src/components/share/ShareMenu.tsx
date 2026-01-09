import React, { useState } from 'react';
import { Share2, Link } from 'lucide-react';
import { buildShareText, buildSiteVideoLink, openShareWindow } from '@/lib/share';

interface ShareMenuProps {
  title: string;
  description?: string | null;
  url?: string; // explicit URL to share (falls back to site link)
  videoId?: string; // used to build site link fallback
}

const ShareMenu = ({ title, description, url, videoId }: ShareMenuProps) => {
  const [open, setOpen] = useState(false);
  const shareText = buildShareText(title, description || undefined);
  const shareUrl = url ?? (videoId ? buildSiteVideoLink(videoId) : (typeof window !== 'undefined' ? window.location.href : 'https://your-site.example'));

  const handleNativeShare = async () => {
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({ title, text: description || title, url: shareUrl });
      } catch (e) {
        // user cancelled or not supported
      }
    } else {
      // fallback to copy
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
      alert('Link copied to clipboard');
    }
    setOpen(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl);
    alert('Link copied to clipboard');
    setOpen(false);
  };

  const openWhatsApp = () => {
    const msg = `${shareText} ${shareUrl}`;
    openShareWindow(`https://wa.me/?text=${encodeURIComponent(msg)}`);
    setOpen(false);
  };

  const openFacebook = () => {
    openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
    setOpen(false);
  };

  const openTwitter = () => {
    openShareWindow(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`);
    setOpen(false);
  };

  const openLinkedIn = () => {
    openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`);
    setOpen(false);
  };

  const openTelegram = () => {
    openShareWindow(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
    setOpen(false);
  };

  const openOriginal = () => {
    if (url) openShareWindow(url);
    else if (videoId) openShareWindow(buildSiteVideoLink(videoId));
    else openShareWindow(shareUrl);
    setOpen(false);
  };

  return (
    <div className="relative inline-block">
      <button
        aria-label="Share"
        onClick={() => setOpen((v) => !v)}
        className="p-1 rounded hover:bg-white/5 flex items-center gap-2 text-sm"
      >
        <Share2 className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-card/95 backdrop-blur rounded shadow-lg z-50 p-2">
          <div className="flex flex-col gap-1">
            <button onClick={handleNativeShare} className="text-left px-2 py-2 hover:bg-white/5 rounded">Share...</button>
            <button onClick={copyLink} className="text-left px-2 py-2 hover:bg-white/5 rounded">Copy link</button>
            <button onClick={openWhatsApp} className="text-left px-2 py-2 hover:bg-white/5 rounded">WhatsApp</button>
            <button onClick={openTwitter} className="text-left px-2 py-2 hover:bg-white/5 rounded">X / Twitter</button>
            <button onClick={openFacebook} className="text-left px-2 py-2 hover:bg-white/5 rounded">Facebook</button>
            <button onClick={openLinkedIn} className="text-left px-2 py-2 hover:bg-white/5 rounded">LinkedIn</button>
            <button onClick={openTelegram} className="text-left px-2 py-2 hover:bg-white/5 rounded">Telegram</button>
            <button onClick={openOriginal} className="text-left px-2 py-2 hover:bg-white/5 rounded">Open original</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareMenu;
