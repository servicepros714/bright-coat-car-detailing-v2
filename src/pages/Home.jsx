import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Check, Plus, Minus, Sparkles, Droplets, CalendarCheck, Car, MapPin, Star } from 'lucide-react';
import { BUSINESS, PACKAGES, ADDON, SERVICE_AREA } from '../lib/business.js';
import useReveal from '../lib/useReveal.js';

const RIBBON = ['Triple-stage vacuuming', 'Carpet extraction', 'Full interior shampoo', 'UV-protectant coating', 'Hand-washed exterior', 'Spot-free hand drying', 'Tire shine'];

const STEPS = [
  { icon: Sparkles, title: 'Pick a package', text: 'Basic or Premium interior, with the Exterior Wash as an optional add-on.' },
  { icon: CalendarCheck, title: 'Choose a time', text: 'Any day of the week, 7 AM to 7 PM. Pick a slot that fits your plans.' },
  { icon: Car, title: 'We come to you', text: 'Home, office or apartment lot in Stanton and nearby — no drop-off needed.' },
  { icon: Droplets, title: 'Drive off bright', text: 'Walk back out to a cabin that looks, feels and smells cared for.' },
];

const GALLERY = [
  { src: '/images/foam-orange.webp', cap: 'Foam pre-soak', cls: 'g-a' },
  { src: '/images/rinse-rear.webp', cap: 'Pressure rinse', cls: 'g-b' },
  { src: '/images/foam-night.webp', cap: 'Evening appointments', cls: 'g-c' },
  { src: '/images/wheel-sponge.webp', cap: 'Rim & tire scrub', cls: 'g-d' },
  { src: '/images/interior-spray.webp', cap: 'Door jamb & sill clean-up', cls: 'g-e' },
];

const STANDARDS = [
  { t: 'Booked in minutes', d: 'Choose your package, date and time online, then pay now or pay after the job.' },
  { t: 'Clear, flat pricing', d: 'Basic $150, Premium $200, Exterior Wash +$50. No surprise line items.' },
  { t: 'Seven days a week', d: 'Mon–Sun by appointment, with slots from 7 AM through 7 PM.' },
  { t: 'Local to Stanton', d: 'We work Stanton and the surrounding cities, so we show up on time.' },
];

const FAQS = [
  { q: 'Do I need to be home during the detail?', a: 'Not necessarily. As long as we can access the vehicle and it is unlocked or the keys are left for us, you can go about your day. We will call when we arrive.' },
  { q: 'What is the difference between Basic and Premium?', a: 'Basic is a thorough interior refresh: triple-stage vacuum, full surface wipe-down and floor mat restoration. Premium goes deeper with carpet and cloth extraction, full shampooing, interior glass and a UV-protectant coating.' },
  { q: 'Can I add an exterior wash?', a: 'Yes. The Exterior Wash is a +$50 add-on to either interior package: hand wash, rims, tire scrub and shine, door jambs and a spot-free hand dry.' },
  { q: 'Do I have to pay online?', a: 'No. You can pay securely online when you book — and save $15 with code PREPAY — or choose to pay later after the service.' },
  { q: 'How far ahead can I book?', a: 'Same-day slots open up to four hours from now, and you can book as far out as you like.' },
  { q: 'Which areas do you serve?', a: `Stanton and nearby cities including ${SERVICE_AREA.slice(1, 7).join(', ')}. Call us if you are unsure.` },
];

function StampRing() {
  return (
    <svg className="stamp" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id="ring" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
      </defs>
      <circle cx="100" cy="100" r="96" className="stamp-bg" />
      <text className="stamp-text">
        <textPath href="#ring">BRIGHT COAT · CAR DETAILING · STANTON CA · </textPath>
      </text>
      <circle cx="100" cy="100" r="30" className="stamp-dot" />
      <text x="100" y="108" textAnchor="middle" className="stamp-b">B</text>
    </svg>
  );
}

function Faq({ item, open, onToggle }) {
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

export default function Home() {
  useReveal();
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <>
      {/* HERO — editorial split with arch photo */}
      <section id="hero" className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="mono-label hero-kicker" data-reveal>No. 01 — Mobile car detailing in {BUSINESS.city}</p>
            <h1 data-reveal>
              A brighter coat,
              <em> brought to your driveway.</em>
            </h1>
            <p className="hero-lede" data-reveal>
              Interior detailing and hand washes done on-site, seven days a week. Pick a package, choose a time,
              and we take care of the rest.
            </p>
            <div className="hero-cta" data-reveal>
              <Link to="/book" className="btn btn-primary btn-lg">Book online <ArrowRight size={18} /></Link>
              <a href={BUSINESS.phoneHref} className="btn btn-outline btn-lg"><Phone size={17} /> {BUSINESS.phone}</a>
            </div>
            <dl className="hero-ledger" data-reveal>
              <div><dt>From</dt><dd>$150</dd></div>
              <div><dt>Open</dt><dd>Mon–Sun</dd></div>
              <div><dt>Slots</dt><dd>7<small>AM</small>–7<small>PM</small></dd></div>
            </dl>
          </div>

          <div className="hero-art" data-reveal>
            <div className="arch">
              <img src="/images/mitt-green.webp" alt="Hand wash mitt with thick foam on a green car" width="1000" height="1477" />
            </div>
            <div className="hero-round">
              <img src="/images/wheel-sponge.webp" alt="Scrubbing a wheel with a foam sponge" width="447" height="626" />
            </div>
            <StampRing />
          </div>
        </div>
      </section>

      {/* RIBBON */}
      <div className="ribbon" aria-hidden="true">
        <div className="ribbon-track">
          {[...RIBBON, ...RIBBON].map((r, i) => (
            <span key={i}>{r}<i>✦</i></span>
          ))}
        </div>
      </div>

      {/* PACKAGES — menu / ticket layout */}
      <section id="packages" className="section packages">
        <div className="container">
          <div className="split-head">
            <div data-reveal>
              <p className="mono-label">The menu</p>
              <h2>Two interior packages.<br /><em>One easy add-on.</em></h2>
            </div>
            <p className="split-head-p" data-reveal>
              Every visit starts inside the car. Choose the depth of clean you need, then add a full hand wash
              for the outside if you want the whole car done.
            </p>
          </div>

          <div className="tickets">
            {PACKAGES.map((p) => (
              <article key={p.id} className={`ticket ${p.featured ? 'ticket--dark' : ''}`} data-reveal>
                <header className="ticket-head">
                  <div>
                    <span className="mono-label">{p.featured ? 'Most complete' : 'Essential'}</span>
                    <h3>{p.name}</h3>
                    <p>{p.tagline}</p>
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

          <div className="center-cta" data-reveal>
            <Link to="/book" className="btn btn-primary btn-lg">Book now <ArrowRight size={18} /></Link>
            <p className="muted-sm">Save $15 when you prepay online with code <strong>PREPAY</strong>.</p>
          </div>
        </div>
      </section>

      {/* PROCESS — numbered timeline */}
      <section id="process" className="section process">
        <div className="container">
          <div className="center-head" data-reveal>
            <p className="mono-label">How it works</p>
            <h2>From booking to <em>brilliant</em>, in four steps.</h2>
          </div>
          <ol className="timeline">
            {STEPS.map((s, i) => (
              <li key={s.title} data-reveal style={{ '--d': `${i * 90}ms` }}>
                <span className="tl-num">{String(i + 1).padStart(2, '0')}</span>
                <span className="tl-icon"><s.icon size={20} /></span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* GALLERY — photo essay grid */}
      <section id="gallery" className="section gallery">
        <div className="container">
          <div className="split-head">
            <div data-reveal>
              <p className="mono-label">Our work</p>
              <h2>Foam, focus <em>and finish.</em></h2>
            </div>
            <p className="split-head-p" data-reveal>
              A look at the details we sweat on every visit — from the pre-soak to the door jambs most washes skip.
            </p>
          </div>
          <div className="essay">
            {GALLERY.map((g, i) => (
              <figure key={g.src} className={`essay-item ${g.cls}`} data-reveal>
                <div className="wipe"><img src={g.src} alt={g.cap} loading="lazy" /></div>
                <figcaption><span>Fig. {String(i + 1).padStart(2, '0')}</span>{g.cap}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* STANDARD — sticky split */}
      <section id="why" className="section standard">
        <div className="container standard-grid">
          <div className="standard-side">
            <p className="mono-label" data-reveal>The Bright Coat standard</p>
            <h2 data-reveal>Detailing that fits <em>your</em> schedule, not ours.</h2>
            <div className="standard-img" data-reveal>
              <img src="/images/interior-spray.webp" alt="Detailer cleaning a door sill" loading="lazy" />
            </div>
          </div>
          <ol className="standard-list">
            {STANDARDS.map((s, i) => (
              <li key={s.t} data-reveal>
                <span className="std-n">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
            <li className="std-review" data-reveal>
              <div className="stars" aria-hidden="true">{[0, 1, 2, 3, 4].map((i) => <Star key={i} size={16} />)}</div>
              <p>Had a Bright Coat detail? We would love to hear how it went.</p>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(BUSINESS.name)}`}
                target="_blank"
                rel="noreferrer"
                className="link-arrow"
              >
                Find us on Google <ArrowRight size={15} />
              </a>
            </li>
          </ol>
        </div>
      </section>

      {/* AREA + MAP */}
      <section id="area" className="section area">
        <div className="container area-grid">
          <div data-reveal>
            <p className="mono-label">Service area</p>
            <h2>Based in Stanton. <em>Out in the neighborhood.</em></h2>
            <ul className="pills">
              {SERVICE_AREA.map((c) => <li key={c}><MapPin size={13} /> {c}</li>)}
            </ul>
            <p className="muted-sm">Not on the list? Call {BUSINESS.phone} and ask — we can often fit you in.</p>
          </div>
          <div className="map" data-reveal>
            <iframe
              title="Map of Stanton, CA"
              src={`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section faqs">
        <div className="container faq-grid">
          <div data-reveal>
            <p className="mono-label">Questions</p>
            <h2>Good to <em>know.</em></h2>
            <p className="muted">Anything else? Call <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.</p>
          </div>
          <div className="faq-list" data-reveal>
            {FAQS.map((f, i) => (
              <Faq key={f.q} item={f} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="closer">
        <div className="container closer-in" data-reveal>
          <h2>Your car, <em>brighter by this weekend.</em></h2>
          <div className="closer-cta">
            <Link to="/book" className="btn btn-light btn-lg">Book online <ArrowRight size={18} /></Link>
            <a href={BUSINESS.phoneHref} className="btn btn-ghost-light btn-lg"><Phone size={17} /> Call now</a>
          </div>
        </div>
      </section>
    </>
  );
}
