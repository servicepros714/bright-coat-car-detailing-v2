import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { CheckCircle2, CalendarPlus, Phone, Loader2, AlertTriangle } from 'lucide-react';
import { useBooking } from '../lib/bookingStore.jsx';
import { createBooking } from '../lib/api.js';
import { serviceLabel, BUSINESS } from '../lib/business.js';
import { fromISO } from '../lib/schedule.js';
import { PENDING_KEY, CONFIRMED_KEY } from './Checkout.jsx';

function readJSON(key) {
  try { return JSON.parse(sessionStorage.getItem(key) || 'null'); } catch { return null; }
}

function toMinutes(lbl) {
  const [t, ap] = lbl.split(' ');
  let [h, m] = t.split(':').map(Number);
  if (ap === 'PM' && h !== 12) h += 12;
  if (ap === 'AM' && h === 12) h = 0;
  return h * 60 + m;
}

function icsFor(b) {
  const d = b.date.replace(/-/g, '');
  const start = toMinutes(b.time);
  const end = start + 120;
  const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}${String(m % 60).padStart(2, '0')}00`;
  const body = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Bright Coat//Booking//EN', 'BEGIN:VEVENT',
    `UID:${b.id}@brightcoat`,
    `DTSTART;TZID=America/Los_Angeles:${d}T${hhmm(start)}`,
    `DTEND;TZID=America/Los_Angeles:${d}T${hhmm(Math.min(end, 23 * 60 + 59))}`,
    `SUMMARY:${serviceLabel(b.pkg, b.addon)} — Bright Coat`,
    `LOCATION:${b.address.replace(/,/g, '\\,')}`,
    `DESCRIPTION:Booking ${b.id}. Questions? Call ${BUSINESS.phone}.`,
    'END:VEVENT', 'END:VCALENDAR',
  ].join('\r\n');
  return URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
}

export default function Confirmation() {
  const { reset } = useBooking();
  const [data, setData] = useState(() => readJSON(CONFIRMED_KEY));
  const [state, setState] = useState(data ? 'done' : 'working');
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;
    const params = new URLSearchParams(window.location.search);
    const pi = params.get('payment_intent');
    const status = params.get('redirect_status');
    const pending = readJSON(PENDING_KEY);

    if (pi && pending) {
      if (status !== 'succeeded' && status !== 'processing') { setState('failed'); return; }
      createBooking({ ...pending, payment_status: 'Paid', payment_intent_id: pi })
        .then((res) => {
          const saved = { ...pending, id: res.id };
          sessionStorage.setItem(CONFIRMED_KEY, JSON.stringify(saved));
          sessionStorage.removeItem(PENDING_KEY);
          setData(saved);
          setState('done');
          reset();
          window.history.replaceState({}, '', '/confirmation');
        })
        .catch(() => setState('failed'));
      return;
    }
    if (data) reset();
    else setState('empty');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === 'working') {
    return (
      <section className="flow"><div className="container confirm">
        <div className="times-loading"><Loader2 className="spin" size={22} /> Finalizing your booking…</div>
      </div></section>
    );
  }

  if (state === 'failed' || state === 'empty') {
    return (
      <section className="flow"><div className="container confirm">
        <div className="confirm-card">
          <AlertTriangle size={40} className="confirm-warn" />
          <h1>{state === 'failed' ? 'We could not confirm that booking' : 'No booking to show'}</h1>
          <p>{state === 'failed' ? `If you were charged, please call us at ${BUSINESS.phone} and we will sort it out right away.` : 'Start a new booking whenever you are ready.'}</p>
          <div className="confirm-actions">
            <Link to="/book" className="btn btn-primary">Book a detail</Link>
            <a href={BUSINESS.phoneHref} className="btn btn-outline"><Phone size={16} /> Call us</a>
          </div>
        </div>
      </div></section>
    );
  }

  return (
    <section className="flow">
      <div className="container confirm">
        <div className="confirm-card">
          <CheckCircle2 size={48} className="confirm-ok" />
          <p className="mono-label">Booking {data.id}</p>
          <h1>You are booked, {data.name.split(' ')[0]}.</h1>
          <p>We will reach out at {data.phone} to confirm the details before we arrive.</p>

          <dl className="confirm-list">
            <div><dt>Service</dt><dd>{serviceLabel(data.pkg, data.addon)}</dd></div>
            <div><dt>When</dt><dd>{format(fromISO(data.date), 'EEEE, MMMM d')} · {data.time}</dd></div>
            <div><dt>Where</dt><dd>{data.address}</dd></div>
            <div><dt>Vehicle</dt><dd>{data.vehicle}</dd></div>
            <div><dt>Payment</dt><dd>{data.payment_status === 'Paid' ? `Paid${data.total ? ` · $${data.total}` : ''}` : 'Pay after service'}</dd></div>
          </dl>

          <div className="confirm-actions">
            <a className="btn btn-outline" href={icsFor(data)} download={`bright-coat-${data.id}.ics`}>
              <CalendarPlus size={16} /> Add to calendar
            </a>
            <Link to="/" className="btn btn-primary">Back to home</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
