function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesInTimeZone(date, timeZone) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get('hour') * 60 + get('minute');
}

/**
 * Whether the restaurant is open at `date` in its own time zone.
 * Supports closing after midnight (close <= open).
 */
export function getOpenStatus({ open, close }, timeZone, date = new Date()) {
  const now = minutesInTimeZone(date, timeZone);
  const openAt = toMinutes(open);
  const closeAt = toMinutes(close);
  const overnight = closeAt <= openAt;
  const isOpen = overnight ? now >= openAt || now < closeAt : now >= openAt && now < closeAt;
  return isOpen ? { isOpen, until: close } : { isOpen, opensAt: open };
}
