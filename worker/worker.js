/**
 * Bright Coat Car Detailing Stanton — booking API (Cloudflare Worker)
 *
 * Worker name:  brightcoat-detailing-worker
 * Bindings:     DB                 -> D1 database (shared detailing-bookings table)
 * Secrets:      STRIPE_SECRET_KEY  -> sk_live_... (Settings > Variables > Secret)
 * Optional:     ALLOWED_ORIGIN     -> e.g. https://bright-coat-car-detailing-stanton.pages.dev (comma-separate several)
 *               ADMIN_TOKEN        -> if set, admin routes require "Authorization: Bearer <token>"
 *
 * Routes
 *   GET    /api/health
 *   GET    /api/availability?date=YYYY-MM-DD
 *   POST   /api/create-payment-intent      (never touches D1)
 *   POST   /api/bookings
 *   GET    /api/bookings                   (admin, source-scoped)
 *   GET    /api/bookings/:id
 *   PATCH  /api/bookings/:id               (admin)
 *   DELETE /api/bookings/:id               (admin)
 */

const SOURCE = 'brightcoat';
const ID_PREFIX = 'BRCT-';
const TZ = 'America/Los_Angeles';
const LEAD_HOURS = 4;
const OPEN_MIN = 7 * 60;
const CLOSE_MIN = 19 * 60;
const STEP_MIN = 30;

const PACKAGES = {
  basic: { name: 'Basic Detail', price: 150 },
  premium: { name: 'Premium Detail', price: 200 },
};
const ADDON = { name: 'Exterior Wash', price: 50 };
const COUPONS = { PREPAY: 15 };

const COLUMNS = [
  'id', 'date', 'time', 'service', 'name', 'phone', 'email', 'vehicle', 'address', 'notes',
  'source', 'created_at', 'status', 'reschedule_date', 'reschedule_time', 'notes2',
  'original_date', 'original_time', 'payment_status',
];
const PATCHABLE = [
  'reschedule_date', 'reschedule_time', 'original_date', 'original_time', 'notes2',
  'status', 'payment_status', 'notes', 'date', 'time', 'name', 'phone', 'email', 'vehicle', 'address', 'service',
];
const CANCELLED = ['cancelled', 'canceled'];

/* ---------------- helpers ---------------- */

function corsHeaders(request, env) {
  const origin = request.headers.get('Origin') || '';
  const allowed = (env.ALLOWED_ORIGIN || '').split(',').map((s) => s.trim()).filter(Boolean);
  const allow = !allowed.length ? '*' : allowed.includes(origin) ? origin : allowed[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', ...cors },
  });
}

const clean = (v, max = 200) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);

function isUSPhone(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(d);
}

function formatPhone(v) {
  let d = String(v || '').replace(/\D/g, '');
  if (d.length === 11 && d.startsWith('1')) d = d.slice(1);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 10)}`;
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim());

function slotLabel(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

const SLOTS = (() => {
  const out = [];
  for (let m = OPEN_MIN; m <= CLOSE_MIN; m += STEP_MIN) out.push(slotLabel(m));
  return out;
})();

function slotMinutes(lbl) {
  const [t, ap] = lbl.split(' ');
  let [h, m] = t.split(':').map(Number);
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function caNow() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date());
  const g = (t) => parts.find((p) => p.type === t).value;
  return { date: `${g('year')}-${g('month')}-${g('day')}`, minutes: Number(g('hour')) * 60 + Number(g('minute')) };
}

function slotIsBookable(date, time) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !SLOTS.includes(time)) return false;
  const now = caNow();
  if (date < now.date) return false;
  const dayDiff = Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${now.date}T00:00:00Z`)) / 86400000);
  return slotMinutes(time) + dayDiff * 1440 >= now.minutes + LEAD_HOURS * 60;
}

function priceFor(pkg, addon, coupon) {
  const p = PACKAGES[pkg];
  if (!p) return null;
  const subtotal = p.price + (addon ? ADDON.price : 0);
  const discount = COUPONS[String(coupon || '').toUpperCase()] || 0;
  return {
    service: addon ? `${p.name} + ${ADDON.name}` : p.name,
    subtotal,
    total: subtotal - discount,
    discount,
  };
}

function newId() {
  const t = Date.now().toString(36).toUpperCase().slice(-5);
  const r = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${ID_PREFIX}${t}${r}`;
}

function isAdmin(request, env) {
  if (!env.ADMIN_TOKEN) return true;
  return request.headers.get('Authorization') === `Bearer ${env.ADMIN_TOKEN}`;
}

async function stripe(env, method, path, params) {
  const body = params ? new URLSearchParams(params).toString() : undefined;
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data.error && data.error.message) || 'Stripe request failed');
  return data;
}

/* ---------------- schema ---------------- */

let schemaReady = false;

async function ensureSchema(db) {
  if (schemaReady) return;
  const create = `
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      date TEXT, time TEXT, service TEXT, name TEXT, phone TEXT, email TEXT,
      vehicle TEXT, address TEXT, notes TEXT, source TEXT, created_at TEXT,
      status TEXT, reschedule_date TEXT, reschedule_time TEXT, notes2 TEXT,
      original_date TEXT, original_time TEXT, payment_status TEXT
    )`.replace(/\s+/g, ' ').trim();
  await db.prepare(create).run();

  // Older shared tables may be missing newer columns — add them one at a time.
  const info = await db.prepare('PRAGMA table_info(bookings)').all();
  const have = new Set((info.results || []).map((c) => c.name));
  for (const col of COLUMNS) {
    if (!have.has(col)) {
      try { await db.prepare(`ALTER TABLE bookings ADD COLUMN ${col} TEXT`).run(); } catch (e) { /* already added */ }
    }
  }
  try {
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_bookings_source_date ON bookings (source, date)').run();
  } catch (e) { /* index is optional */ }
  schemaReady = true;
}

async function takenTimes(db, date) {
  const rows = await db.prepare(
    `SELECT COALESCE(NULLIF(reschedule_time, ''), time) AS t, LOWER(COALESCE(status, '')) AS s
       FROM bookings
      WHERE source = ?
        AND ((date = ? AND COALESCE(reschedule_date, '') = '') OR reschedule_date = ?)`.replace(/\s+/g, ' ')
  ).bind(SOURCE, date, date).all();
  return (rows.results || []).filter((r) => !CANCELLED.includes(r.s)).map((r) => r.t);
}

/* ---------------- routes ---------------- */

async function createPaymentIntent(request, env, cors) {
  if (!env.STRIPE_SECRET_KEY) return json({ error: 'Online payment is not configured.' }, 503, cors);
  const b = await request.json().catch(() => ({}));
  const price = priceFor(b.pkg, !!b.addon, b.coupon);
  if (!price) return json({ error: 'Please choose a valid package.' }, 400, cors);

  const params = {
    amount: String(price.total * 100),
    currency: 'usd',
    'automatic_payment_methods[enabled]': 'true',
    description: `${price.service} — Bright Coat Car Detailing Stanton`,
    'metadata[source]': SOURCE,
    'metadata[service]': price.service,
    'metadata[date]': clean(b.date, 10),
    'metadata[time]': clean(b.time, 10),
    'metadata[name]': clean(b.name, 80),
    'metadata[coupon]': price.discount ? 'PREPAY' : '',
  };
  if (isEmail(b.email)) params.receipt_email = clean(b.email, 160);

  const pi = await stripe(env, 'POST', '/payment_intents', params);
  return json({ clientSecret: pi.client_secret, amount: price.total }, 200, cors);
}

async function createBooking(request, env, cors) {
  const b = await request.json().catch(() => ({}));
  const fields = {
    name: clean(b.name, 100),
    phone: clean(b.phone, 30),
    email: clean(b.email, 160),
    vehicle: clean(b.vehicle, 120),
    address: clean(b.address, 240),
    date: clean(b.date, 10),
    time: clean(b.time, 10),
  };
  const missing = Object.entries(fields).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) return json({ error: `Missing: ${missing.join(', ')}` }, 400, cors);
  if (!isUSPhone(fields.phone)) return json({ error: 'Please enter a valid US phone number.' }, 400, cors);
  if (!isEmail(fields.email)) return json({ error: 'Please enter a valid email address.' }, 400, cors);

  const paid = b.payment_status === 'Paid';
  const price = priceFor(b.pkg, !!b.addon, paid ? b.coupon : '');
  if (!price) return json({ error: 'Please choose a valid package.' }, 400, cors);

  const db = env.DB;
  let piId = '';

  if (paid) {
    piId = clean(b.payment_intent_id, 80);
    if (!/^pi_[A-Za-z0-9]+$/.test(piId)) return json({ error: 'Missing payment reference.' }, 400, cors);

    // Idempotency: a retried/redirected confirmation must not create a second row.
    const existing = await db.prepare('SELECT id FROM bookings WHERE source = ? AND notes LIKE ? LIMIT 1')
      .bind(SOURCE, `%${piId}%`).first();
    if (existing) return json({ id: existing.id, duplicate: true }, 200, cors);

    const pi = await stripe(env, 'GET', `/payment_intents/${piId}`);
    if (!['succeeded', 'processing'].includes(pi.status)) {
      return json({ error: 'Payment has not completed.' }, 402, cors);
    }
    const expected = priceFor(b.pkg, !!b.addon, pi.metadata && pi.metadata.coupon);
    if (pi.amount !== expected.total * 100) return json({ error: 'Payment amount mismatch.' }, 400, cors);
    price.total = expected.total;
    price.discount = expected.discount;
  } else if (!slotIsBookable(fields.date, fields.time)) {
    return json({ error: 'That time is no longer available.' }, 409, cors);
  }

  const taken = await takenTimes(db, fields.date);
  const conflict = taken.includes(fields.time);
  // Unpaid bookings are rejected on conflict; paid ones are kept (money is already taken) and flagged.
  if (conflict && !paid) return json({ error: 'That time was just booked.' }, 409, cors);

  const notes = [
    `Total: $${price.total}${price.discount ? ` (PREPAY -$${price.discount})` : ''}`,
    b.addon ? 'Add-on: Exterior Wash' : '',
    piId ? `Stripe PI: ${piId}` : '',
  ].filter(Boolean).join(' | ');

  const row = {
    id: newId(),
    date: fields.date,
    time: fields.time,
    service: price.service,
    name: fields.name,
    phone: formatPhone(fields.phone),
    email: fields.email,
    vehicle: fields.vehicle,
    address: fields.address,
    notes,
    source: SOURCE,
    created_at: new Date().toISOString(),
    status: 'Pending',
    reschedule_date: null,
    reschedule_time: null,
    notes2: conflict ? 'Slot conflict at booking time — please reschedule with customer' : null,
    original_date: fields.date,
    original_time: fields.time,
    payment_status: paid ? 'Paid' : 'Pay Later',
  };

  const cols = Object.keys(row);
  await db.prepare(`INSERT INTO bookings (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
    .bind(...cols.map((c) => row[c])).run();

  return json({ id: row.id, payment_status: row.payment_status }, 201, cors);
}

async function patchBooking(request, env, cors, id) {
  const b = await request.json().catch(() => ({}));
  const keys = Object.keys(b).filter((k) => PATCHABLE.includes(k));
  if (!keys.length) return json({ error: 'Nothing to update.' }, 400, cors);
  if (b.payment_status && !['Paid', 'Pay Later'].includes(b.payment_status)) {
    return json({ error: "payment_status must be 'Paid' or 'Pay Later'." }, 400, cors);
  }
  const res = await env.DB.prepare(`UPDATE bookings SET ${keys.map((k) => `${k} = ?`).join(', ')} WHERE id = ? AND source = ?`)
    .bind(...keys.map((k) => (b[k] == null ? null : clean(b[k], 500))), id, SOURCE).run();
  if (!res.meta || !res.meta.changes) return json({ error: 'Booking not found.' }, 404, cors);
  const row = await env.DB.prepare('SELECT * FROM bookings WHERE id = ? AND source = ?').bind(id, SOURCE).first();
  return json({ booking: row }, 200, cors);
}

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const m = request.method;

    try {
      if (path === '/api/health') return json({ ok: true, source: SOURCE }, 200, cors);

      // Payment route runs before (and without) any D1 work, so a slow/locked DB never blocks checkout.
      if (path === '/api/create-payment-intent' && m === 'POST') return await createPaymentIntent(request, env, cors);

      if (!env.DB) return json({ error: 'Database binding DB is missing.' }, 500, cors);
      await ensureSchema(env.DB);

      if (path === '/api/availability' && m === 'GET') {
        const date = url.searchParams.get('date') || '';
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return json({ error: 'Invalid date.' }, 400, cors);
        const booked = await takenTimes(env.DB, date);
        return json({ date, booked: [...new Set(booked)] }, 200, cors);
      }

      if (path === '/api/bookings' && m === 'POST') return await createBooking(request, env, cors);

      if (path === '/api/bookings' && m === 'GET') {
        if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401, cors);
        const rows = await env.DB.prepare('SELECT * FROM bookings WHERE source = ? ORDER BY date DESC, created_at DESC LIMIT 1000')
          .bind(SOURCE).all();
        return json({ bookings: rows.results || [] }, 200, cors);
      }

      const one = path.match(/^\/api\/bookings\/([A-Za-z0-9_-]+)$/);
      if (one) {
        const id = one[1];
        if (m === 'GET') {
          const row = await env.DB.prepare(
            'SELECT id, date, time, service, name, status, payment_status, reschedule_date, reschedule_time FROM bookings WHERE id = ? AND source = ?'
          ).bind(id, SOURCE).first();
          return row ? json({ booking: row }, 200, cors) : json({ error: 'Not found' }, 404, cors);
        }
        if (!isAdmin(request, env)) return json({ error: 'Unauthorized' }, 401, cors);
        if (m === 'PATCH') return await patchBooking(request, env, cors, id);
        if (m === 'DELETE') {
          const res = await env.DB.prepare('DELETE FROM bookings WHERE id = ? AND source = ?').bind(id, SOURCE).run();
          return json({ deleted: !!(res.meta && res.meta.changes) }, 200, cors);
        }
      }

      return json({ error: 'Not found' }, 404, cors);
    } catch (err) {
      return json({ error: err.message || 'Server error' }, 500, cors);
    }
  },
};
