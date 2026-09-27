import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  addMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  format, isSameMonth,
} from 'date-fns';
import { ArrowLeft, ArrowRight, Check, ChevronLeft, ChevronRight, Droplets, Plus, Loader2, Sun, Sunset, Moon } from 'lucide-react';
import { PACKAGES, ADDON, serviceTotal } from '../lib/business.js';
import { useBooking } from '../lib/bookingStore.jsx';
import { getBookedTimes, apiConfigured } from '../lib/api.js';
import { allSlots, isSlotOpen, dateHasOpenSlots, toISO, fromISO, firstBookableDate, caNow } from '../lib/schedule.js';
import { formatPhone, isValidUSPhone, isValidEmail } from '../lib/format.js';

const STEPS = ['Package', 'Add-on', 'Date', 'Time', 'Your info'];

function StepPackage({ booking, update }) {
  return (
    <div className="pick-list">
      {PACKAGES.map((p) => {
        const on = booking.pkg === p.id;
        return (
          <button
            key={p.id}
            type="button"
            className={`pick ${on ? 'pick--on' : ''}`}
            onClick={() => update({ pkg: p.id })}
            aria-pressed={on}
          >
            <span className={`tick ${on ? 'tick--on' : ''}`}>{on && <Check size={14} />}</span>
            <span className="pick-body">
              <span className="pick-top">
                <strong>{p.name}</strong>
                <span className="pick-price">${p.price}</span>
              </span>
              <span className="pick-sub">{p.tagline}</span>
              <span className="pick-items">
                {p.items.map((i) => <span key={i}>{i}</span>)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function StepAddon({ booking, update }) {
  const on = booking.addon;
  return (
    <div className="pick-list">
      <button
        type="button"
        className={`pick pick--addon ${on ? 'pick--on' : ''}`}
        onClick={() => update({ addon: !on })}
        aria-pressed={on}
      >
        <span className={`tick ${on ? 'tick--on' : ''}`}>{on && <Check size={14} />}</span>
        <span className="pick-body">
          <span className="pick-top">
            <strong><Droplets size={17} /> {ADDON.name}</strong>
            <span className="pick-price">+${ADDON.price}</span>
          </span>
          <span className="pick-sub">{on ? 'Added to your booking — tap again to remove.' : 'Tap to add a full hand wash to your detail.'}</span>
          <span className="pick-items">
            {ADDON.items.map((i) => <span key={i}>{i}</span>)}
          </span>
        </span>
        {!on && <span className="pick-add"><Plus size={15} /> Add</span>}
      </button>
      <p className="step-note">Optional — skip it and continue if you only need the interior.</p>
    </div>
  );
}

function StepDate({ booking, update }) {
  const first = firstBookableDate();
  const [month, setMonth] = useState(() => startOfMonth(booking.date ? fromISO(booking.date) : first));
  const minMonth = startOfMonth(first);
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(month)),
    end: endOfWeek(endOfMonth(month)),
  });
  const todayISO = caNow().date;

  return (
    <div className="cal">
      <div className="cal-head">
        <button type="button" onClick={() => setMonth(addMonths(month, -1))} disabled={month <= minMonth} aria-label="Previous month">
          <ChevronLeft size={20} />
        </button>
        <strong>{format(month, 'MMMM yyyy')}</strong>
        <button type="button" onClick={() => setMonth(addMonths(month, 1))} aria-label="Next month">
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="cal-grid cal-dow">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}
      </div>
      <div className="cal-grid">
        {days.map((d) => {
          const iso = toISO(d);
          const inMonth = isSameMonth(d, month);
          const disabled = !inMonth || !dateHasOpenSlots(iso);
          const selected = booking.date === iso;
          return (
            <button
              key={iso}
              type="button"
              className={`cal-day ${selected ? 'cal-day--on' : ''} ${iso === todayISO ? 'cal-day--today' : ''} ${!inMonth ? 'cal-day--out' : ''}`}
              disabled={disabled}
              onClick={() => update({ date: iso, time: '' })}
            >
              {format(d, 'd')}
            </button>
          );
        })}
      </div>
      <p className="step-note">Open Mon–Sun by appointment. Same-day slots start 4 hours from now (California time).</p>
    </div>
  );
}

function StepTime({ booking, update }) {
  const [booked, setBooked] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    if (!booking.date || !apiConfigured()) { setBooked([]); return undefined; }
    setLoading(true);
    getBookedTimes(booking.date)
      .then((b) => { if (alive) setBooked(b); })
      .catch(() => { if (alive) setBooked([]); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, [booking.date]);

  const slots = allSlots();
  const groups = [
    { label: 'Morning', icon: Sun, list: slots.filter((s) => s.endsWith('AM')) },
    { label: 'Afternoon', icon: Sunset, list: slots.filter((s) => s.endsWith('PM') && (s.startsWith('12') || Number(s.split(':')[0]) < 5)) },
    { label: 'Evening', icon: Moon, list: slots.filter((s) => s.endsWith('PM') && !s.startsWith('12') && Number(s.split(':')[0]) >= 5) },
  ];

  return (
    <div className="times">
      <p className="times-date">{format(fromISO(booking.date), 'EEEE, MMMM d')}</p>
      {loading ? (
        <div className="times-loading"><Loader2 className="spin" size={20} /> Checking availability…</div>
      ) : (
        groups.map((g) => (
          <div key={g.label} className="times-group">
            <span className="mono-label"><g.icon size={14} /> {g.label}</span>
            <div className="times-grid">
              {g.list.map((t) => {
                const disabled = booked.includes(t) || !isSlotOpen(booking.date, t);
                const on = booking.time === t;
                return (
                  <button
                    key={t}
                    type="button"
                    className={`slot ${on ? 'slot--on' : ''}`}
                    disabled={disabled}
                    onClick={() => update({ time: t })}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

const FIELDS = [
  { key: 'name', label: 'Full name', type: 'text', auto: 'name', ph: 'Jane Smith' },
  { key: 'phone', label: 'Phone', type: 'tel', auto: 'tel-national', ph: '(714) 555-1234' },
  { key: 'email', label: 'Email', type: 'email', auto: 'email', ph: 'you@example.com' },
  { key: 'vehicle', label: 'Vehicle', type: 'text', auto: 'off', ph: 'Year Make Model — e.g. 2021 Toyota Camry' },
  { key: 'address', label: 'Service address', type: 'text', auto: 'street-address', ph: 'Street, city, ZIP' },
];

function StepInfo({ booking, update, refs, errors, clearError }) {
  return (
    <div className="form-grid">
      {FIELDS.map((f) => (
        <label key={f.key} className={`field ${f.key === 'address' || f.key === 'vehicle' ? 'field--wide' : ''} ${errors[f.key] ? 'field--err' : ''}`}>
          <span>{f.label}</span>
          <input
            ref={(el) => { refs.current[f.key] = el; }}
            type={f.type}
            inputMode={f.key === 'phone' ? 'numeric' : undefined}
            autoComplete={f.auto}
            placeholder={f.ph}
            value={booking[f.key]}
            maxLength={f.key === 'phone' ? 14 : 160}
            onChange={(e) => {
              update({ [f.key]: f.key === 'phone' ? formatPhone(e.target.value) : e.target.value });
              if (errors[f.key]) clearError(f.key);
            }}
          />
          {errors[f.key] && <small>{errors[f.key]}</small>}
        </label>
      ))}
    </div>
  );
}

export default function Book() {
  const { booking, update } = useBooking();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const refs = useRef({});

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [step]);

  // If the chosen date no longer has open slots (e.g. page left open), clear it.
  useEffect(() => {
    if (booking.date && !dateHasOpenSlots(booking.date)) update({ date: '', time: '' });
    if (booking.date && booking.time && !isSlotOpen(booking.date, booking.time)) update({ time: '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const total = serviceTotal(booking.pkg, booking.addon);

  function validateInfo() {
    const e = {};
    if (!booking.name.trim()) e.name = 'Please enter your full name.';
    if (!booking.phone.trim()) e.phone = 'Please enter your phone number.';
    else if (!isValidUSPhone(booking.phone)) e.phone = 'Enter a valid 10-digit US phone number.';
    if (!booking.email.trim()) e.email = 'Please enter your email.';
    else if (!isValidEmail(booking.email)) e.email = 'Enter a valid email address.';
    if (!booking.vehicle.trim()) e.vehicle = 'Please enter your vehicle (Year Make Model).';
    if (!booking.address.trim()) e.address = 'Please enter the service address.';
    setErrors(e);
    const firstKey = FIELDS.map((f) => f.key).find((k) => e[k]);
    if (firstKey) {
      toast.error(e[firstKey]);
      refs.current[firstKey]?.focus();
      return false;
    }
    return true;
  }

  function next() {
    if (step === 0 && !booking.pkg) return toast.error('Please choose a package to continue.');
    if (step === 2 && !booking.date) return toast.error('Please pick a date to continue.');
    if (step === 3 && !booking.time) return toast.error('Please pick a time to continue.');
    if (step === 4) {
      if (!validateInfo()) return undefined;
      return navigate('/checkout');
    }
    setStep((s) => s + 1);
    return undefined;
  }

  function back() {
    if (step === 0) navigate('/');
    else setStep((s) => s - 1);
  }

  const titles = [
    ['Choose your package', 'Both packages are full interior details. Pick the depth that fits.'],
    ['Add an exterior wash?', 'Make it a whole-car visit with a hand wash for +$50.'],
    ['Pick a date', 'We work every day of the week, by appointment.'],
    ['Pick a time', 'Choose a start time. We will confirm by phone or text.'],
    ['Your details', 'So we know who you are, what you drive and where to meet you.'],
  ];

  return (
    <section className="flow">
      <div className="container flow-grid">
        <aside className="rail" aria-label="Booking steps">
          <Link to="/" className="rail-back"><ArrowLeft size={15} /> Back to site</Link>
          <p className="mono-label">Book a detail</p>
          <ol>
            {STEPS.map((s, i) => {
              const reachable = i < step;
              return (
                <li key={s} className={`${i === step ? 'rail--on' : ''} ${i < step ? 'rail--done' : ''}`}>
                  <button type="button" disabled={!reachable} onClick={() => setStep(i)}>
                    <span className="rail-n">{i < step ? <Check size={13} /> : i + 1}</span>
                    {s}
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <div className="panel">
          <div className="progress" aria-hidden="true">
            {STEPS.map((s, i) => <span key={s} className={i <= step ? 'on' : ''} />)}
          </div>
          <p className="mono-label panel-step">Step {step + 1} of {STEPS.length} · {STEPS[step]}</p>
          <h1 className="panel-title">{titles[step][0]}</h1>
          <p className="panel-sub">{titles[step][1]}</p>

          <div className="panel-body" key={step}>
            {step === 0 && <StepPackage booking={booking} update={update} />}
            {step === 1 && <StepAddon booking={booking} update={update} />}
            {step === 2 && <StepDate booking={booking} update={update} />}
            {step === 3 && <StepTime booking={booking} update={update} />}
            {step === 4 && <StepInfo booking={booking} update={update} refs={refs} errors={errors} clearError={(k) => setErrors((e) => ({ ...e, [k]: undefined }))} />}
          </div>

          <div className="flow-bar">
            <button type="button" className="btn btn-outline" onClick={back}>
              <ArrowLeft size={17} /> Back
            </button>
            {total > 0 && <span className="flow-total"><small>Total</small>${total}</span>}
            <button type="button" className="btn btn-primary" onClick={next}>
              {step === 4 ? 'Review & pay' : 'Continue'} <ArrowRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
