import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, CalendarCheck, MapPin, Clock } from 'lucide-react';
import { BUSINESS, REVIEWS } from '../lib/business.js';

const LINKS = [
  { href: '/#packages', label: 'Packages' },
  { href: '/#process', label: 'How it works' },
  { href: '/#gallery', label: 'Our work' },
  { href: '/#why', label: 'Why us' },
  ...(REVIEWS.length ? [{ href: '/#reviews', label: 'Reviews' }] : []),
  { href: '/#faq', label: 'FAQ' },
];

export default function Header({ compact }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();

  useEffect(() => setOpen(false), [pathname, hash]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <header className={`hdr ${scrolled ? 'hdr--scrolled' : ''} ${compact ? 'hdr--compact' : ''}`}>
      {!compact && (
        <div className="hdr-strip">
          <div className="container hdr-strip-in">
            <span><MapPin size={13} /> Mobile detailing · {BUSINESS.city}</span>
            <span className="hdr-strip-mid"><Clock size={13} /> {BUSINESS.hours}</span>
            <a href={BUSINESS.phoneHref}><Phone size={13} /> {BUSINESS.phone}</a>
          </div>
        </div>
      )}

      <div className="hdr-bar">
        <div className="container hdr-bar-in">
          <Link to="/" className="brand" aria-label={`${BUSINESS.name} home`}>
            <img src="/images/logo-sm.webp" alt="" width="52" height="51" />
            <span className="brand-text">
              <strong>Bright Coat</strong>
              <em>Car Detailing · Stanton</em>
            </span>
          </Link>

          {compact ? (
            <a className="hdr-call" href={BUSINESS.phoneHref}>
              <Phone size={16} /> <span>{BUSINESS.phone}</span>
            </a>
          ) : (
            <>
              <nav className="hdr-links" aria-label="Main">
                {LINKS.map((l) => (
                  <Link key={l.href} to={l.href}>{l.label}</Link>
                ))}
                <NavLink to="/book" className="btn btn-primary btn-sm">Book online</NavLink>
              </nav>
              <button
                className="hdr-burger"
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((o) => !o)}
              >
                {open ? <X size={22} /> : <Menu size={22} />}
              </button>
            </>
          )}
        </div>
      </div>

      {!compact && (
        <div className={`drawer ${open ? 'drawer--open' : ''}`} aria-hidden={!open}>
          <nav className="drawer-links" aria-label="Mobile">
            {LINKS.map((l, i) => (
              <Link key={l.href} to={l.href} tabIndex={open ? 0 : -1}>
                <span>{String(i + 1).padStart(2, '0')}</span>{l.label}
              </Link>
            ))}
          </nav>
          <div className="drawer-meta">
            <p><Clock size={14} /> {BUSINESS.hours}</p>
            <p><MapPin size={14} /> Serving {BUSINESS.city} &amp; nearby</p>
          </div>
          <div className="drawer-actions">
            <a href={BUSINESS.phoneHref} className="btn btn-outline" tabIndex={open ? 0 : -1}>
              <Phone size={17} /> Call Now
            </a>
            <Link to="/book" className="btn btn-primary" tabIndex={open ? 0 : -1}>
              <CalendarCheck size={17} /> Book Online
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
