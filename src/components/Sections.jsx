import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Check, Plus, Minus, Droplets, MapPin, Star } from 'lucide-react';
import { BUSINESS, PACKAGES, ADDON, FAQS, REVIEWS, GOOGLE_RATING, GOOGLE_PROFILE_URL } from '../lib/business.js';
import { SERVICE_PAGES, CITY_PAGES, HOME_CITY } from '../lib/pages.js';

// Sections shared by the home page and the SEO landing pages.

/* ─── Link chips to the landing pages ─── */
export function ServiceChips({ exclude, home = false }) {
  return (
    <ul className="pills link-pills">
      {home && (
        <li className="pill-home">
          <Link to="/">Mobile car detailing in {HOME_CITY}</Link>
        </li>
      )}
      {SERVICE_PAGES.filter((p) => p.path !== exclude).map((p) => (
        <li key={p.path}>
          <Link to={p.path}>{p.nav}</Link>
        </li>
      ))}
    </ul>
  );
}

export function AreaChips({ exclude, home = false }) {
  return (
    <ul className="pills link-pills">
      {home && (
        <li className="pill-home">
          <Link to="/#area">
            <MapPin size={13} /> {HOME_CITY}
          </Link>
        </li>
      )}
      {CITY_PAGES.filter((p) => p.path !== exclude).map((p) => (
        <li key={p.path}>
          <Link to={p.path}>
            <MapPin size={13} /> {p.city}
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* ─── Packages (menu / ticket layout) ─── */
export function Packages({ title, showLinks = true }) {
  return (
    <section id="packages" className="section packages">
      <div className="container">
        <div className="split-head">
          <div data-reveal>
            <p className="mono-label">The menu</p>
            <h2>
              {title || (
                <>
                  Two interior packages.<br /><em>One easy add-on.</em>
                </>
              )}
            </h2>
          </div>
          <p className="split-head-p" data-reveal>
            Every visit starts inside the car. Choose the depth of clean you need, then add a full hand wash for the
            outside if you want the whole car done. Same price for any car, SUV, truck or minivan.
          </p>
        </div>

        <div className="tickets">
          {PACKAGES.map((p) => (
            <article key={p.id} className={`ticket ${p.featured ? 'ticket--dark' : ''}`} data-reveal>
              <header className="ticket-head">
                <div>
                  <span className="mono-label">{p.featured ? 'Most complete' : 'Essential'}</span>
                  <h3>{p.name}</h3>
                  <p>
                    {p.tagline} Usually {p.duration}.
                  </p>
                </div>
                <div className="ticket-price"><sup>$</sup>{p.price}</div>
              </header>
              <div className="ticket-perf" aria-hidden="true" />
              <ul className="ticket-list">
                {p.items.map((it) => (
                  <li key={it}><Check size={16} /> {it}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <article className="stub" data-reveal>
          <div className="stub-head">
            <span className="stub-plus">+${ADDON.price}</span>
            <div>
              <span className="mono-label">Add-on · any package</span>
              <h3>{ADDON.name}</h3>
              <p>{ADDON.tagline}</p>
            </div>
          </div>
          <ul className="stub-list">
            {ADDON.items.map((it) => (
              <li key={it}><Droplets size={15} /> {it}</li>
            ))}
          </ul>
        </article>

        {showLinks && (
          <div className="pkg-links" data-reveal>
            <p className="mono-label">Compare in detail</p>
            <ServiceChips />
          </div>
        )}

        <div className="center-cta" data-reveal>
          <Link to="/book" className="btn btn-primary btn-lg">Book now <ArrowRight size={18} /></Link>
          <p className="muted-sm">Save $15 when you prepay online with code <strong>PREPAY</strong>.</p>
        </div>
      </div>
    </section>
  );
}

/* ─── Reviews (hidden while REVIEWS is empty) ─── */
export function Reviews() {
  if (!REVIEWS.length) return null;
  return (
    <section id="reviews" className="section reviews">
      <div className="container">
        <div className="center-head" data-reveal>
          <p className="mono-label">Reviews</p>
          <h2>What customers <em>say.</em></h2>
          {GOOGLE_RATING && (
            <p className="muted rev-rating">
              Rated {GOOGLE_RATING.value} out of 5 from {GOOGLE_RATING.count} reviews on{' '}
              <a href={GOOGLE_PROFILE_URL} target="_blank" rel="noopener noreferrer">Google</a>.
            </p>
          )}
        </div>
        <div className="rev-grid">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="rev" data-reveal>
              <div className="stars" aria-label="5 stars">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={15} />)}</div>
              <blockquote>{r.text}</blockquote>
              <figcaption>{r.name}, Google review</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─── */
function FaqItem({ item, open, onToggle }) {
  return (
    <div className={`faq ${open ? 'faq--open' : ''}`}>
      <button className="faq-q" onClick={onToggle} aria-expanded={open}>
        <span>{item.q}</span>
        {open ? <Minus size={18} /> : <Plus size={18} />}
      </button>
      <div className="faq-a"><div><p>{item.a}</p></div></div>
    </div>
  );
}

export function Faq({ faqs = FAQS, title }) {
  const [openFaq, setOpenFaq] = useState(0);
  return (
    <section id="faq" className="section faqs">
      <div className="container faq-grid">
        <div data-reveal>
          <p className="mono-label">Questions</p>
          <h2>{title || <>Good to <em>know.</em></>}</h2>
          <p className="muted">Anything else? Call <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.</p>
        </div>
        <div className="faq-list" data-reveal>
          {faqs.map((f, i) => (
            <FaqItem key={f.q} item={f} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Closing CTA ─── */
export function Closer({ city }) {
  return (
    <section className="closer">
      <div className="container closer-in" data-reveal>
        <h2>Your car, <em>brighter{city ? ` in ${city}` : ''}.</em></h2>
        <div className="closer-cta">
          <Link to="/book" className="btn btn-light btn-lg">Book online <ArrowRight size={18} /></Link>
          <a href={BUSINESS.phoneHref} className="btn btn-ghost-light btn-lg"><Phone size={17} /> Call now</a>
        </div>
      </div>
    </section>
  );
}
