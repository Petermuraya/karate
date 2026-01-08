export type CalendarEvent = {
  title: string;
  description?: string;
  location?: string;
  startsAt: Date;
  endsAt: Date;
  uid?: string;
};

function pad(n: number) {
  return n.toString().padStart(2, '0');
}

function toUTCString(date: Date) {
  const y = date.getUTCFullYear();
  const m = pad(date.getUTCMonth() + 1);
  const d = pad(date.getUTCDate());
  const hh = pad(date.getUTCHours());
  const mm = pad(date.getUTCMinutes());
  const ss = pad(date.getUTCSeconds());
  return `${y}${m}${d}T${hh}${mm}${ss}Z`;
}

export function buildICS(event: CalendarEvent) {
  const uid = event.uid || `${Date.now()}@iron-fist-dojo`;
  const dtstamp = toUTCString(new Date());
  const dtstart = toUTCString(event.startsAt);
  const dtend = toUTCString(event.endsAt);

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Iron Fist Dojo//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `DTEND:${dtend}`,
    `SUMMARY:${escapeICSText(event.title)}`,
  ];

  if (event.description) lines.push(`DESCRIPTION:${escapeICSText(event.description)}`);
  if (event.location) lines.push(`LOCATION:${escapeICSText(event.location)}`);

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.join('\r\n');
}

function escapeICSText(s: string) {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\,');
}

export function googleCalendarUrl(event: CalendarEvent) {
  const start = event.startsAt.toISOString().replace(/-|:|\.\d{3}Z/g, '');
  const end = event.endsAt.toISOString().replace(/-|:|\.\d{3}Z/g, '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    details: event.description || '',
    location: event.location || '',
    dates: `${start}/${end}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
