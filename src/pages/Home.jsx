import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Sparkles, Droplets, CalendarCheck, Car, Star } from 'lucide-react';
import { BUSINESS, HOME_AREAS, GOOGLE_PROFILE_URL } from '../lib/business.js';
import { Packages, Reviews, Faq, Closer, AreaChips } from '../components/Sections.jsx';
import useReveal from '../lib/useReveal.js';

const RIBBON = ['Triple-stage vacuuming', 'Carpet extraction', 'Full interior shampoo', 'UV-protectant coating', 'Hand-washed exterior', 'Spot-free hand drying', 'Tire shine'];

const STEPS = [
  { icon: Sparkles, title: 'Pick a package', text: 'Basic or Premium interior, with the Exterior Wash as an optional add-on.' },
  { icon: CalendarCheck, title: 'Choose a time', text: 'Any day of the week, with start times from 8 AM to 5 PM.' },
  { icon: Car, title: 'We come to you', text: 'Home, office or apartment lot in Stanton and nearby. We bring our own water and power.' },
  { icon: Droplets, title: 'Drive off bright', text: 'Walk back out to a cabin that looks, feels and smells cared for.' },
];

const GALLERY = [
  { src: '/images/foam-orange.webp', cap: 'Foam pre-soak', cls: 'g-a' },
  { src: '/images/rinse-rear.webp', cap: 'Rinse', cls: 'g-b' },
  { src: '/images/foam-night.webp', cap: 'Full foam coverage', cls: 'g-c' },
  { src: '/images/wheel-sponge.webp', cap: 'Rim & tire scrub', cls: 'g-d' },
  { src: '/images/interior-spray.webp', cap: 'Door jamb & sill clean-up', cls: 'g-e' },
];

const STANDARDS = [
  { t: 'Booked in minutes', d: 'Choose your package, date and time online, then pay now or pay after the job.' },
  { t: 'One price, any vehicle', d: 'Basic $150, Premium $200, Exterior Wash +$50, whether you drive a coupe or a three-row SUV.' },
  { t: 'Every day, 8 AM – 5 PM', d: 'Start times every 30 minutes, seven days a week. We bring our own water and power.' },
  { t: 'Eco-friendly, guaranteed', d: 'We use eco-friendly detailing products, and every detail is backed by our satisfaction guarantee.' },
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

export default function Home() {
  useReveal();
  const googleHref = GOOGLE_PROFILE_URL || `https://www.google.com/search?q=${encodeURIComponent(BUSINESS.name)}`;

  return (
    <>
      {/* HERO — editorial split with arch photo */}
      <section id="hero" className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <h1 className="mono-label hero-kicker" data-reveal>No. 01 — Mobile car detailing in {BUSINESS.city}</h1>
            <p className="hero-title" data-reveal>
              A brighter coat,
              <em> brought to your driveway.</em>
            </p>
            <p className="hero-lede" data-reveal>
              Interior detailing and an optional hand wash, done at your home or office with our own water and
              power, seven days a week. Pick a package, choose a time, and we take care of the rest.
            </p>
            <div className="hero-cta" data-reveal>
              <Link to="/book" className="btn btn-primary btn-lg">Book online <ArrowRight size={18} /></Link>
              <a href={BUSINESS.phoneHref} className="btn btn-outline btn-lg"><Phone size={17} /> {BUSINESS.phone}</a>
            </div>
            <dl className="hero-ledger" data-reveal>
              <div><dt>From</dt><dd>$150</dd></div>
              <div><dt>Open</dt><dd>Mon–Sun</dd></div>
              <div><dt>Start times</dt><dd>8<small>AM</small>–5<small>PM</small></dd></div>
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

      <Packages />

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
              <a href={googleHref} target="_blank" rel="noreferrer" className="link-arrow">
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
            <p className="area-p">
              We detail cars all over Stanton, from {HOME_AREAS.slice(0, 2).join(' and ')} to the homes along{' '}
              {HOME_AREAS.slice(2, 5).join(', ')} and {HOME_AREAS[5]}, and in these nearby cities at the same prices:
            </p>
            <AreaChips />
            <p className="muted-sm">Not on the list? Call {BUSINESS.phone} and ask.</p>
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

      <Reviews />
      <Faq />
      <Closer />
    </>
  );
}
