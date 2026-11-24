import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { ArrowLeft, Lock, Tag, Loader2, Check, BadgePercent, CalendarDays, MapPin } from 'lucide-react';
import { useBooking } from '../lib/bookingStore.jsx';
import { serviceLabel, serviceTotal, PREPAY_CODE, PREPAY_DISCOUNT } from '../lib/business.js';
import { createPaymentIntent, createBooking, getBookedTimes, apiConfigured } from '../lib/api.js';
import { fromISO } from '../lib/schedule.js';

const PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
const stripeReady = /^pk_(live|test)_[A-Za-z0-9]+$/.test(PK) && !PK.includes('REPLACE');
const stripePromise = stripeReady ? loadStripe(PK) : null;

export const PENDING_KEY = 'brightcoat-pending';
export const CONFIRMED_KEY = 'brightcoat-confirmed';

export function bookingPayload(b, extra = {}) {
  return {
    pkg: b.pkg,
    addon: !!b.addon,
    date: b.date,
    time: b.time,
    name: b.name.trim(),
    phone: b.phone.trim(),
    email: b.email.trim(),
    vehicle: b.vehicle.trim(),
    address: b.address.trim(),
    ...extra,
  };
}

const appearance = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#3E4B2C',
    colorText: '#1C2618',
    colorBackground: '#FBFAF6',
    colorDanger: '#A3412F',
    fontFamily: 'Manrope, system-ui, sans-serif',
    borderRadius: '10px',
  },
  rules: { '.Input': { border: '1px solid #CFCDC2', boxShadow: 'none' } },
};

function PayForm({ amount, onPaid, onBefore, precheck, busy, setBusy, email }) {
  const stripe = useStripe();
  const elements = useElements();
  const [ready, setReady] = useState(false);

  async function pay(e) {
    e.preventDefault();
    if (!stripe || !elements || busy) return;
    setBusy(true);
    if (!(await precheck())) { setBusy(false); return; }
    onBefore();
    let result;
    try {
      result = await stripe.confirmPayment({
        elements,
        confirmParams: { return_url: `${window.location.origin}/confirmation`, receipt_email: email },
        redirect: 'if_required',
      });
    } catch (err) {
      // Never fail silently: show whatever Stripe.js threw.
      console.error(err);
      toast.error(err?.message || 'Payment could not start. Please try again or choose "Pay later".');
      setBusy(false);
      return;
    }
    const { error, paymentIntent } = result;
    if (error) {
      toast.error(error.message || 'Payment could not be completed.');
      setBusy(false);
      return;
    }
    if (paymentIntent && (paymentIntent.status === 'succeeded' || paymentIntent.status === 'processing')) {
      await onPaid(paymentIntent.id);
    } else {
      toast.error('Payment was not completed. Please try again.');
      setBusy(false);
    }
  }

  return (
    <form onSubmit={pay} className="pay-form">
      <PaymentElement onReady={() => setReady(true)} options={{ layout: 'tabs' }} />
      <button type="submit" className="btn btn-primary btn-lg btn-block" disabled={!stripe || !ready || busy}>
        {busy ? <><Loader2 className="spin" size={18} /> Processing…</> : <><Lock size={16} /> Pay ${amount}</>}
      </button>
    </form>
  );
}

export default function Checkout() {
  const { booking } = useBooking();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [piError, setPiError] = useState('');
  const [busy, setBusy] = useState(false);

  const complete = booking.pkg && booking.date && booking.time && booking.name && booking.phone && booking.email && booking.vehicle && booking.address;

  useEffect(() => {
    if (!complete) navigate('/book', { replace: true });
  }, [complete, navigate]);

  const subtotal = serviceTotal(booking.pkg, booking.addon);
  const total = subtotal - (applied ? PREPAY_DISCOUNT : 0);

  useEffect(() => {
    if (!complete || !stripeReady || !apiConfigured()) return undefined;
    let alive = true;
    setClientSecret('');
    setPiError('');
    createPaymentIntent({
      pkg: booking.pkg,
      addon: !!booking.addon,
      coupon: applied ? PREPAY_CODE : '',
      email: booking.email,
      name: booking.name,
      date: booking.date,
      time: booking.time,
    })
      .then((d) => { if (alive) setClientSecret(d.clientSecret); })
      .catch((e) => { if (alive) setPiError(e.message || 'Online payment is unavailable right now.'); });
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applied, complete]);

  const options = useMemo(() => (clientSecret ? { clientSecret, appearance } : null), [clientSecret]);

  function applyCode(e) {
    e.preventDefault();
    if (code.trim().toUpperCase() === PREPAY_CODE) {
      setApplied(true);
      toast.success(`Code applied — $${PREPAY_DISCOUNT} off`);
    } else {
      toast.error('That code is not valid.');
    }
  }

  async function finish(extra) {
    const payload = bookingPayload(booking, extra);
    try {
      sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload));
    } catch { /* ignore */ }
    try {
      const res = await createBooking(payload);
      try {
        sessionStorage.setItem(CONFIRMED_KEY, JSON.stringify({ ...payload, id: res.id, payment_status: res.payment_status, total: res.total ?? (extra.payment_status === 'Paid' ? total : subtotal) }));
        sessionStorage.removeItem(PENDING_KEY);
      } catch { /* ignore */ }
      navigate('/confirmation', { replace: true });
    } catch (err) {
      setBusy(false);
      if (err.status === 409) {
        // The Worker's message says whether a card payment was refunded.
        toast.error(err.message || 'That time was just taken. Please choose another slot.', { duration: 8000 });
        navigate('/book');
      } else {
        toast.error(err.message || 'We could not save your booking. Please call us.');
      }
    }
  }

  async function payLater() {
    if (busy) return;
    if (!apiConfigured()) return toast.error('Booking is not connected yet. Please call us to book.');
    setBusy(true);
    await finish({ payment_status: 'Pay Later' });
    return undefined;
  }

  if (!complete) return null;

  return (
    <section className="flow checkout">
      <div className="container checkout-col">
        <div className="co-top">
          <Link to="/book" className="rail-back"><ArrowLeft size={15} /> Edit booking</Link>
          <span className="mono-label"><Lock size={13} /> Secure checkout</span>
        </div>

        {!applied && (
          <div className="prepay-banner">
            <BadgePercent size={22} />
            <div>
              <strong>${PREPAY_DISCOUNT} OFF when you pay online</strong>
              <span>Enter code <b>{PREPAY_CODE}</b> below before paying.</span>
            </div>
          </div>
        )}

        <div className="summary">
          <div className="summary-row">
            <div>
              <span className="mono-label">Your detail</span>
              <h1>{serviceLabel(booking.pkg, booking.addon)}</h1>
              <p className="summary-meta">
                <span><CalendarDays size={14} /> {format(fromISO(booking.date), 'EEE, MMM d')} · {booking.time}</span>
                <span><MapPin size={14} /> {booking.address}</span>
              </p>
            </div>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <strong>
              {applied && <s>${subtotal}</s>} ${total}
            </strong>
          </div>
        </div>

        <form className="coupon" onSubmit={applyCode}>
          <Tag size={16} />
          <input
            placeholder="Coupon code"
            value={applied ? PREPAY_CODE : code}
            onChange={(e) => setCode(e.target.value)}
            disabled={applied}
            aria-label="Coupon code"
          />
          <button type="submit" className="btn btn-outline btn-sm" disabled={applied || !code.trim()}>
            {applied ? <><Check size={15} /> Applied</> : 'Apply'}
          </button>
        </form>

        <div className="pay-card">
          {!stripeReady || !apiConfigured() ? (
            <p className="pay-note">Online payment is being set up. Choose “pay later” below and we will collect payment after your detail.</p>
          ) : piError ? (
            <p className="pay-note">{piError} You can still book and pay after your detail.</p>
          ) : !options ? (
            <div className="times-loading"><Loader2 className="spin" size={20} /> Loading secure payment…</div>
          ) : (
            <Elements stripe={stripePromise} options={options} key={clientSecret}>
              <PayForm
                amount={total}
                email={booking.email}
                busy={busy}
                setBusy={setBusy}
                precheck={async () => {
                  try {
                    const taken = await getBookedTimes(booking.date);
                    if (taken.includes(booking.time)) {
                      toast.error('That time was just taken. Please choose another slot.');
                      navigate('/book');
                      return false;
                    }
                  } catch { /* availability check is best-effort */ }
                  return true;
                }}
                onBefore={() => {
                  try {
                    sessionStorage.setItem(PENDING_KEY, JSON.stringify({
                      ...bookingPayload(booking, { payment_status: 'Paid', coupon: applied ? PREPAY_CODE : '' }),
                      total,
                    }));
                  } catch { /* ignore */ }
                }}
                onPaid={(pi) => finish({ payment_status: 'Paid', payment_intent_id: pi, coupon: applied ? PREPAY_CODE : '' })}
              />
            </Elements>
          )}
        </div>

        <button type="button" className="paylater" onClick={payLater} disabled={busy}>
          I’ll pay later, after the service
        </button>
      </div>
    </section>
  );
}
