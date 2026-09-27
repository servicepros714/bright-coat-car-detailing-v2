// All scheduling runs on California time, whatever timezone the visitor's device is in.
const TZ = 'America/Los_Angeles';
export const LEAD_HOURS = 4;
export const OPEN_MIN = 7 * 60;   // 7:00 AM
export const CLOSE_MIN = 19 * 60; // 7:00 PM (last slot)
export const STEP_MIN = 30;

export function caNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const get = (t) => parts.find((p) => p.type === t).value;
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: Number(get('hour')) * 60 + Number(get('minute')),
  };
}

export function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function fromISO(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function label(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ap = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ap}`;
}

export function allSlots() {
  const out = [];
  for (let m = OPEN_MIN; m <= CLOSE_MIN; m += STEP_MIN) out.push(label(m));
  return out;
}

function slotMinutes(lbl) {
  const [t, ap] = lbl.split(' ');
  let [h, m] = t.split(':').map(Number);
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

// Minutes-from-midnight (CA) before which slots are unavailable on a given date.
function cutoffFor(iso) {
  const now = caNow();
  if (iso < now.date) return Infinity;
  const nowDate = fromISO(now.date);
  const target = fromISO(iso);
  const dayDiff = Math.round((target - nowDate) / 86400000);
  const cutoff = now.minutes + LEAD_HOURS * 60 - dayDiff * 1440;
  return cutoff;
}

export function isSlotOpen(iso, lbl) {
  return slotMinutes(lbl) >= cutoffFor(iso);
}

export function dateHasOpenSlots(iso) {
  return cutoffFor(iso) <= CLOSE_MIN;
}

export function firstBookableDate() {
  const now = caNow();
  const d = fromISO(now.date);
  if (!dateHasOpenSlots(now.date)) d.setDate(d.getDate() + 1);
  return d;
}
