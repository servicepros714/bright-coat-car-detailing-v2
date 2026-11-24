import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Check, MapPin } from 'lucide-react';
import useReveal from '../lib/useReveal.js';
import { BUSINESS, PACKAGES, ADDON } from '../lib/business.js';
import { Packages, Faq, Closer, ServiceChips, AreaChips } from '../components/Sections.jsx';

// One template for every SEO landing page in src/lib/pages.js.

const basic = PACKAGES.find((p) => p.id === 'basic');
const premium = PACKAGES.find((p) => p.id === 'premium');

// Hero price card: the Premium Detail, or 'combo' = Premium + Exterior Wash.
// The Exterior Wash is never shown as a product on its own.
function PriceCard({ page }) {
  const combo = page.card === 'combo';
  const name = combo ? `${premium.name} + ${ADDON.name}` : premium.name;
  const price = combo ? premium.price + ADDON.price : premium.price;
  const items = combo
    ? ['Everything in the Premium Detail', 'Full Interior Shampooing', 'Cloth & Carpet Extraction', 'Hand-Washed Exterior', 'Detailed Rim Cleaning', 'Spot-Free Hand Drying']
    : premium.items;
  return (
    <aside className="ticket ticket--dark lp-card" aria-label={name}>
      <header className="ticket-head">
        <div>
          <span className="mono-label">{combo ? 'Inside & out' : 'Most complete'}</span>
          <h2 className="lp-card-name">{name}</h2>
          <p>Same price for any vehicle.</p>
        </div>
        <div className="ticket-price"><sup>$</sup>{price}</div>
      </header>
      <div className="ticket-perf" aria-hidden="true" />
      <ul className="ticket-list lp-card-list">
        {items.map((f) => (
          <li key={f}><Check size={16} /> {f}</li>
        ))}
      </ul>
      <Link className="btn btn-light btn-lg lp-card-btn" to="/book?service=premium">
        Book this detail <ArrowRight size={18} />
      </Link>
      <p className="lp-card-note">
        {combo
          ? `Or the ${basic.name} + wash for $${basic.price + ADDON.price}, or a detail alone from $${basic.price}.`
          : `Or the ${basic.name} for $${basic.price}. Prepay with code PREPAY to save $15.`}
      </p>
    </aside>
  );
}

// City pages: neighborhoods + map.
function Local({ page }) {
  return (
    <section className="section area">
      <div className="container area-grid">
        <div data-reveal>
          <p className="mono-label">Service area</p>
          <h2>Where we work in <em>{page.city}.</em></h2>
          <p className="area-p">
            We come to homes and workplaces across {page.city}. Not sure about your address? Call{' '}
            <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
          </p>
          <ul className="pills">
            {page.areas.map((a) => (
              <li key={a}><MapPin size={13} /> {a.replace(/^the /, '')}</li>
            ))}
          </ul>
        </div>
        <div className="map" data-reveal>
          <iframe
            title={`Map of ${page.city}, CA`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${page.city}, CA`)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}

export default function Landing({ page }) {
  useReveal([page.path]);
  const { intro } = page;
  return (
    <>
      <section className="hero lp-hero">
        <div className="container lp-grid">
          <div className="hero-copy">
            <nav className="lp-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.nav}</span>
            </nav>
            <p className="mono-label hero-kicker">{page.eyebrow}</p>
            <h1 className="lp-title">
              {page.h1[0]} <em>{page.h1[1]}</em>
            </h1>
            <p className="hero-lede">{page.lede}</p>
            <div className="hero-cta">
              <Link to={`/book?service=${page.pkg}`} className="btn btn-primary btn-lg">Book online <ArrowRight size={18} /></Link>
              <a href={BUSINESS.phoneHref} className="btn btn-outline btn-lg"><Phone size={17} /> {BUSINESS.phone}</a>
            </div>
            <ul className="lp-facts">
              {page.facts.map((f) => (
                <li key={f}><Check size={15} /> {f}</li>
              ))}
            </ul>
          </div>
          <PriceCard page={page} />
        </div>
      </section>

      <section className="section lp-intro">
        <div className="container lp-intro-grid">
          <div data-reveal>
            <h2>{intro.h2}</h2>
            {intro.paras.map((p) => (
              <p key={p} className="lp-p">{p}</p>
            ))}
          </div>
          <figure className="lp-photo" data-reveal>
            <img src={page.photo.src} alt={page.photo.alt} loading="lazy" />
          </figure>
        </div>
      </section>

      <section className="section lp-points">
        <div className="container">
          <div className="center-head" data-reveal>
            <h2>{page.pointsTitle}</h2>
          </div>
          <ol className="standard-list lp-points-list">
            {page.points.map((pt, i) => (
              <li key={pt.title} data-reveal>
                <span className="std-n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{pt.title}</h3>
                  <p>{pt.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Packages title={<>Prices for <em>every visit.</em></>} showLinks={false} />

      {page.isCity && <Local page={page} />}

      <Faq faqs={page.faqs} title={page.isCity ? `${page.city} detailing questions` : `${page.nav} questions`} />

      <section className="section lp-related" aria-label="More from Bright Coat Car Detailing">
        <div className="container">
          <h2 className="lp-related-title">More detailing services</h2>
          <ServiceChips exclude={page.path} home />
          <h2 className="lp-related-title">Areas we serve</h2>
          <AreaChips exclude={page.path} home />
        </div>
      </section>

      <Closer city={page.city} />
    </>
  );
}
