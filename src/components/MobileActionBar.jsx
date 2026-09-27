import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, CalendarCheck } from 'lucide-react';
import { BUSINESS } from '../lib/business.js';

// Mobile-only bottom bar. On the home page it slides in once the hero is scrolled past.
export default function MobileActionBar() {
  const [show, setShow] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero');
      const limit = hero ? hero.offsetTop + hero.offsetHeight - 120 : 220;
      setShow(window.scrollY > limit);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  return (
    <div className={`mab ${show ? 'mab--show' : ''}`} role="region" aria-label="Quick actions">
      <a href={BUSINESS.phoneHref} className="mab-btn mab-call">
        <Phone size={18} /> Call Now
      </a>
      <Link to="/book" className="mab-btn mab-book">
        <CalendarCheck size={18} /> Book Online
      </Link>
    </div>
  );
}
