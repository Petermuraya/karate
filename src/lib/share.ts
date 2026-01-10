export const buildShareText = (title: string, description?: string) => {
  const desc = description ? ` — ${description}` : '';
  return `${title}${desc}`;
};

export const buildSiteVideoLink = (videoId: string) => {
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-site.example';
    const base = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL ? import.meta.env.BASE_URL : '/';
    return `${origin}${base}videos?videoId=${encodeURIComponent(videoId)}`;
  } catch (e) {
    return `https://your-site.example/videos?videoId=${encodeURIComponent(videoId)}`;
  }
};

export const openShareWindow = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer');
};
