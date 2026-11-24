import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import MobileActionBar from './components/MobileActionBar.jsx';
import { BookingProvider } from './lib/bookingStore.jsx';
import Home from './pages/Home.jsx';
import Book from './pages/Book.jsx';
import Checkout from './pages/Checkout.jsx';
import Confirmation from './pages/Confirmation.jsx';
import NotFound from './pages/NotFound.jsx';
import Landing from './pages/Landing.jsx';
import Seo from './components/Seo.jsx';
import { LANDING_PAGES } from './lib/pages.js';

function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const flow = ['/book', '/checkout', '/confirmation'].includes(pathname);

  return (
    <BookingProvider>
      <ScrollManager />
      <Seo />
      <Header compact={flow} />
      <main className={flow ? 'main main--flow' : 'main'}>
        <Routes>
          <Route path="/" element={<Home />} />
          {LANDING_PAGES.map((page) => (
            <Route key={page.path} path={page.path} element={<Landing page={page} />} />
          ))}
          <Route path="/book" element={<Book />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/confirmation" element={<Confirmation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!flow && <Footer />}
      {!flow && <MobileActionBar />}
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#1C2618', color: '#ECEBE4', fontFamily: 'Manrope, sans-serif', fontSize: 14, borderRadius: 12 },
        }}
      />
    </BookingProvider>
  );
}
