// Bright Coat Car Detailing Stanton — business facts, prices, FAQ and reviews.
//
// Confirmed facts (owner, Nov 2026): mobile only, we bring our own water and power,
// every day with start times 8 AM - 5 PM, Basic Detail usually 2-3 hours and Premium
// Detail 4-6 hours, satisfaction guarantee, same price for every vehicle size,
// eco-friendly products, prepay online with code PREPAY for $15 off. Same prices and
// hours in the nearby cities.
// NOT confirmed, so never claimed: ratings, certifications, years of experience,
// motorcycles, insurance, product brands, ceramic coating or paint correction.
// (The old Horizons site said Mon-Fri 8-6 / Sat 9-5 and "certified professionals": wrong.)

// Canonical domain (no www; www redirects to it).
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://brightcoatcardetailingstanton.site').replace(/\/$/, '');

// Google Business Profile, used in the schema (sameAs). Leave '' until known.
export const GOOGLE_PROFILE_URL = 'https://www.google.com/search?kgmid=/g/11ysymftyc&q=Bright+Coat+Car+Detailing';

// Shown above the reviews (not in the schema). Update together with the profile.
export const GOOGLE_RATING = { value: '5.0', count: 14, asOf: 'Nov 2026' };

export const BUSINESS = {
  name: 'Bright Coat Car Detailing Stanton',
  short: 'Bright Coat',
  phone: '(714) 408-4156',
  phoneHref: 'tel:+17144084156',
  phoneSchema: '+1-714-408-4156',
  city: 'Stanton, CA',
  // Same address as the Google Business Profile (as for Blacktop). Mobile only: customers
  // are not invited to visit; we go to them.
  street: '8101 Catherine Ave',
  zip: '90680',
  hours: 'Every day, 8 AM – 5 PM',
  mapQuery: 'Stanton, CA',
};

// Stanton landmarks named on the home page. Nearby cities with their own pages are in
// src/lib/pages.js (CITY_PAGES); the owner confirmed those cities.
export const HOME_AREAS = ['Stanton Central Park', 'Hollenbeck Park', 'Beach Boulevard', 'Katella Avenue', 'Dale Avenue', 'Western Avenue'];

export const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Detail',
    price: 150,
    duration: '2–3 hours',
    tagline: 'The weekly reset for a daily driver.',
    items: [
      'Triple-Stage Vacuuming for Deep Debris Removal',
      'Complete Interior Surface Wipe-Down',
      'Floor Mat Cleaning & Restoration',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Detail',
    price: 200,
    duration: '4–6 hours',
    featured: true,
    tagline: 'A full interior restoration, top to carpet.',
    items: [
      'Triple-Stage Vacuuming',
      'Cabin Application',
      'Dust Elimination',
      'Interior Window Cleaning',
      'Deep Carpet Cleaning',
      'Cloth & Carpet Extraction',
      'Full Interior Shampooing',
      'UV-Protectant Coating',
    ],
  },
];

export const ADDON = {
  id: 'exterior',
  name: 'Exterior Wash',
  price: 50,
  tagline: 'Add a hand wash to any interior package.',
  items: [
    'Hand-Washed Exterior',
    'Detailed Rim Cleaning',
    'Tire Scrub and Degrease',
    'Door Jamb & Panel Wipe-Down',
    'Premium Tire Shine Application',
    'Spot-Free Hand Drying',
  ],
};

export const PREPAY_CODE = 'PREPAY';
export const PREPAY_DISCOUNT = 15;

export function serviceLabel(pkgId, addon) {
  const p = PACKAGES.find((x) => x.id === pkgId);
  if (!p) return '';
  return addon ? `${p.name} + ${ADDON.name}` : p.name;
}

export function serviceTotal(pkgId, addon) {
  const p = PACKAGES.find((x) => x.id === pkgId);
  if (!p) return 0;
  return p.price + (addon ? ADDON.price : 0);
}

// Real Google reviews only, as { name: 'First L.', text: '...' } (first name + last initial,
// typos fixed; leave out reviews that read like a shop visit). The section and its menu
// link stay hidden while this is empty.
// From the Google profile, Nov 2026 (all 5 stars). Left out because they describe visiting
// a shop: Lunar W. ("my parents took me here"), Hung P. ("would visit again"), Mai L. ("I came
// here"). Bhawani B.'s review is cut where Google truncates it.
export const REVIEWS = [
  { name: 'Alma D.', text: 'I had a great experience with Bright Coat Car Detailing. Marcus was friendly, easy to work with, and clearly took pride in the job. My car needed some serious attention, and the difference afterward was impressive. Everything felt fresh and carefully finished, from the interior to the exterior. Thanks, Marcus, for the excellent work!' },
  { name: 'Corrie M.', text: "I had a friend tell me about these guys and I'm so glad I took their advice. They were fast and made my SUV look great. Will be coming back soon for sure." },
  { name: 'Bhawani B.', text: 'I went with these guys because they were reasonable on price and timing, even though they were new, and I made a good decision. The exterior shine is impressive and the finish looks clean and polished.' },
  { name: 'Lieu T.', text: 'My Elantra needed some interior cleaning. Very satisfied with the work and the fair pricing.' },
  { name: 'Amy M.', text: 'The service was great and welcoming. I was able to get all the info I needed and understood what the process was.' },
  { name: 'Judy M.', text: 'My car smells so good now.' },
  { name: 'Karla L.', text: 'Quality service deserves 10 stars.' },
];

// Home page FAQ. Shown on the page and used for the FAQPage schema, so keep both in sync.
export const FAQS = [
  { q: 'Do you come to me?', a: 'Yes. Bright Coat is mobile only. We detail your car at your home, office or apartment lot in Stanton and the nearby cities.' },
  { q: 'Do you need my water or power?', a: 'No. We bring our own water and power, so there is nothing for you to set up.' },
  { q: 'What is the difference between Basic and Premium?', a: 'The Basic Detail ($150, usually 2 to 3 hours) is a triple-stage vacuum, a full surface wipe-down and floor mat restoration. The Premium Detail ($200, usually 4 to 6 hours) adds dust elimination, interior glass, deep carpet cleaning, cloth and carpet extraction, full shampooing and a UV-protectant coating.' },
  { q: 'Does an SUV or truck cost more?', a: 'No. Cars, SUVs, trucks and minivans all pay the same price.' },
  { q: 'Can I book only the exterior wash?', a: 'No. The Exterior Wash is a $50 add-on to the Basic or Premium Detail: hand wash, rims, tire scrub and shine, door jambs and a spot-free hand dry.' },
  { q: 'What products do you use?', a: 'Eco-friendly detailing products.' },
  { q: 'When can I book?', a: 'Every day, with start times every 30 minutes from 8 AM to 5 PM, up to 90 days ahead. Same-day bookings need at least 4 hours notice.' },
  { q: 'Do I have to pay online?', a: 'No. Pay securely online when you book and save $15 with code PREPAY, or choose to pay later after the service.' },
  { q: 'What if I am not happy with the result?', a: 'Tell us. Every detail is backed by our satisfaction guarantee, and we will make it right.' },
];
