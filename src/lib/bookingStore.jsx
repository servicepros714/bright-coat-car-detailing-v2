import { createContext, useContext, useEffect, useState } from 'react';

const KEY = 'brightcoat-booking';
const empty = {
  pkg: '',
  addon: false,
  date: '',
  time: '',
  name: '',
  phone: '',
  email: '',
  vehicle: '',
  address: '',
};

const Ctx = createContext(null);

function load() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

export function BookingProvider({ children }) {
  const [booking, setBooking] = useState(load);

  useEffect(() => {
    try { sessionStorage.setItem(KEY, JSON.stringify(booking)); } catch { /* storage unavailable */ }
  }, [booking]);

  const update = (patch) => setBooking((b) => ({ ...b, ...patch }));
  const reset = () => setBooking(empty);

  return <Ctx.Provider value={{ booking, update, reset }}>{children}</Ctx.Provider>;
}

export const useBooking = () => useContext(Ctx);
