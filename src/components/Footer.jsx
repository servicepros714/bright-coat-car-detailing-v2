import { Link } from 'react-router-dom';
import { Phone, MapPin, Clock, ArrowUpRight } from 'lucide-react';
import { BUSINESS, REVIEWS } from '../lib/business.js';
import { SERVICE_PAGES, CITY_PAGES, HOME_CITY } from '../lib/pages.js';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="ftr">
      <svg className="ftr-wave" viewBox="0 0 1440 90" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0,50 C240,95 420,5 720,40 C1000,72 1200,18 1440,46 L1440,0 L0,0 Z" className="ftr-wave-a" />
        <path d="M0,30 C260,70 460,0 760,26 C1040,50 1220,8 1440,28 L1440,0 L0,0 Z" className="ftr-wave-b" />
      </svg>
      <div className="container ftr-top">
        <img src="/images/logo.webp" alt={BUSINESS.name} className="ftr-logo" width="200" height="198" />
        <p className="ftr-lede">
          Mobile interior detailing and hand washes, brought to your driveway in Stanton and the neighboring cities, with our own water and power.
        </p>
        <div className="ftr-cta">
          <a href={BUSINESS.phoneHref} className="btn btn-light"><Phone size={16} /> {BUSINESS.phone}</a>
          <Link to="/book" className="btn btn-sage">Book online <ArrowUpRight size={16} /></Link>
        </div>
      </div>

      <div className="container ftr-rows">
        <div className="ftr-row">
          <span className="mono-label">Visit</span>
          <p><MapPin size={15} /> {BUSINESS.city} — we come to you</p>
        </div>
        <div className="ftr-row">
          <span className="mono-label">Hours</span>
          <p><Clock size={15} /> {BUSINESS.hours}</p>
        </div>
        <div className="ftr-row">
          <span className="mono-label">Menu</span>
          <p className="ftr-links">
            <Link to="/#packages">Packages</Link>
            <Link to="/#process">How it works</Link>
            <Link to="/#gallery">Our work</Link>
            {REVIEWS.length > 0 && <Link to="/#reviews">Reviews</Link>}
            <Link to="/#faq">FAQ</Link>
            <Link to="/book">Book</Link>
          </p>
        </div>
        <div className="ftr-row">
          <span className="mono-label">Services</span>
          <p className="ftr-links">
            {SERVICE_PAGES.map((p) => (
              <Link key={p.path} to={p.path}>{p.nav}</Link>
            ))}
          </p>
        </div>
        <div className="ftr-row">
          <span className="mono-label">Areas</span>
          <p className="ftr-links">
            <Link to="/">{HOME_CITY}</Link>
            {CITY_PAGES.map((p) => (
              <Link key={p.path} to={p.path}>{p.city}</Link>
            ))}
          </p>
        </div>
      </div>

      <div className="container ftr-base">
        <span>© {year} {BUSINESS.name}</span>
        <span>Stanton, California</span>
      </div>
    </footer>
  );
}
