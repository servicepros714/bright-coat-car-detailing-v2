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

export function getBookedTimes(date) {
  return request(`/api/availability?date=${encodeURIComponent(date)}`).then((d) => d.booked || []);
}

export function createPaymentIntent(payload) {
  return request('/api/create-payment-intent', { method: 'POST', body: JSON.stringify(payload) });
}

export function createBooking(payload) {
  return request('/api/bookings', { method: 'POST', body: JSON.stringify(payload) });
}
