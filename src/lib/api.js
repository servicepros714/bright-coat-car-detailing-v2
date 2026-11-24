const API = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');

async function request(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  let data = {};
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return data;
}

export const apiConfigured = () => /^https?:\/\//.test(API) && !API.includes('REPLACE');

// The Worker (worker/worker.js) prices everything from the service ids and checks card
// payments with Stripe; these helpers translate the booking state into its API.
const serviceIds = (p) => [p.pkg, ...(p.addon ? ['exterior'] : [])];

export function getBookedTimes(date) {
  const d = encodeURIComponent(date);
  return request(`/api/availability?start=${d}&end=${d}`).then((r) => (r.booked && r.booked[date]) || []);
}

// payload: { pkg, addon, coupon, email, name, date, time } -> { clientSecret, paymentIntentId, amount }
export function createPaymentIntent(p) {
  return request('/api/create-payment-intent', {
    method: 'POST',
    body: JSON.stringify({ services: serviceIds(p), coupon: p.coupon || '', date: p.date, time: p.time, name: p.name, email: p.email }),
  });
}

// payload: booking fields + { payment_status: 'Paid' | 'Pay Later', payment_intent_id }
// -> { id, payment_status, total }. A Paid booking is only saved after the Worker verifies
// the PaymentIntent with Stripe (status, site, amount, services, date and time).
export function createBooking(p) {
  const paid = p.payment_status === 'Paid';
  return request('/api/bookings', {
    method: 'POST',
    body: JSON.stringify({
      services: serviceIds(p),
      date: p.date, time: p.time,
      name: p.name, phone: p.phone, email: p.email, vehicle: p.vehicle, address: p.address,
      payLater: !paid,
      paymentIntentId: paid ? p.payment_intent_id : undefined,
    }),
  });
}
