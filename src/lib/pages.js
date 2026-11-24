// ---------------------------------------------------------------------------
// SEO landing pages. One template renders all of them (src/pages/Landing.jsx);
// head tags and schema come from src/lib/seo.js.
//
// Home targets "Mobile Car Detailing Stanton". Bonnie (same owner) has
// /mobile-car-cleaning-stanton, and the nearby cities already have pages on sister sites
// as /mobile-car-detailing-, /auto-detailing-, /mobile-car-cleaning- and
// /car-detailing-<city>-ca. Bright Coat uses /car-detailing-service-<city> and its own
// service wording, with unique copy. The owner is fine with city overlap.
//
// Facts: prices, package contents and the confirmed list are in src/lib/business.js.
// Same prices and hours in every city. The Exterior Wash is never sold on its own.
// ---------------------------------------------------------------------------

const BRANDS = ['Bright Coat Car Detailing', 'Bright Coat Detailing', 'Bright Coat'];

// Longest title that fits in 60 chars (counting '&' as the escaped '&amp;').
// Keep ", CA" before the long brand name, then drop ", CA" if nothing fits.
export function fitTitle(keyword, city) {
  const options = [
    ...BRANDS.map((b) => `${keyword} ${city}, CA | ${b}`),
    ...BRANDS.map((b) => `${keyword} ${city} | ${b}`),
  ];
  const len = (t) => t.replace(/&/g, '&amp;').length;
  return options.find((t) => len(t) <= 60) || options[options.length - 1];
}

export const HOME_CITY = 'Stanton';

// Schema offers: only what a customer can book. The wash never appears alone.
const DETAIL_OFFERS = [
  ['Basic Detail', 150],
  ['Premium Detail', 200],
  ['Basic Detail + Exterior Wash', 200],
  ['Premium Detail + Exterior Wash', 250],
];
const PREMIUM_OFFERS = [
  ['Premium Detail', 200],
  ['Premium Detail + Exterior Wash', 250],
];
const WASH_OFFERS = [
  ['Basic Detail + Exterior Wash', 200],
  ['Premium Detail + Exterior Wash', 250],
];

const PHOTO = {
  mitt: { src: '/images/mitt-green.webp', alt: 'Hand wash mitt with thick foam on a green car' },
  wheel: { src: '/images/wheel-sponge.webp', alt: 'Scrubbing a wheel with a foam sponge' },
  spray: { src: '/images/interior-spray.webp', alt: 'Detailer cleaning a door sill with a spray bottle' },
  orange: { src: '/images/foam-orange.webp', alt: 'Orange car covered in foam pre-soak' },
  rinse: { src: '/images/rinse-rear.webp', alt: 'Rinsing foam off the rear of a sedan' },
  foam: { src: '/images/foam-night.webp', alt: 'Car covered in foam during a hand wash' },
};

const FAQ_SIZE = { q: 'Does an SUV or truck cost more?', a: 'No. Cars, SUVs, trucks and minivans all pay the same price.' };
const FAQ_WATER = { q: 'Do you need my water or an outlet?', a: 'No. We bring our own water and power.' };
const FAQ_WASH = { q: 'Can I book only the exterior wash?', a: 'No. The Exterior Wash is a $50 add-on to the Basic or Premium Detail.' };
const FAQ_GUARANTEE = { q: 'What if something is not right?', a: 'Tell us. Every detail is backed by our satisfaction guarantee, and we will make it right.' };
const FAQ_PAY = { q: 'Do I pay when I book?', a: 'No. Pay after the service, or pay online at checkout with code PREPAY for $15 off.' };
const FAQ_TIME = { q: 'How long does a detail take?', a: 'A Basic Detail usually takes 2 to 3 hours and a Premium Detail 4 to 6 hours, depending on the car.' };
const FAQ_ECO = { q: 'What products do you use?', a: 'Eco-friendly detailing products.' };

export const SERVICE_PAGES = [
  {
    path: '/interior-detailing-stanton',
    nav: 'Interior detailing',
    city: HOME_CITY,
    title: fitTitle('Interior Detailing', HOME_CITY),
    description: 'Interior detailing in Stanton, CA: Basic Detail $150 or Premium Detail $200 with shampoo and extraction. Mobile, own water and power, every day 8 to 5.',
    eyebrow: 'Interior detailing · Stanton, CA',
    h1: ['Interior detailing', 'in Stanton.'],
    lede: 'Dust on the dash, crumbs in the seat tracks and mats that never look clean. We detail the cabin in your driveway with our own water and power.',
    facts: ['From $150', 'Own water & power', 'Every day 8–5'],
    card: 'premium',
    pkg: 'basic',
    photo: PHOTO.spray,
    intro: {
      h2: 'Two depths of interior clean.',
      paras: [
        'Both packages begin with triple-stage vacuuming: three passes that lift the grit hiding under the seats, along the tracks and deep in the carpet.',
        'The $150 Basic Detail follows with a complete wipe-down of every interior surface and floor mats cleaned and restored. It usually takes 2 to 3 hours.',
        'The $200 Premium Detail usually takes 4 to 6 hours and adds dust elimination, interior windows, deep carpet cleaning, cloth and carpet extraction, full interior shampooing and a UV-protectant coating.',
      ],
    },
    pointsTitle: 'Why Stanton drivers book a Bright Coat interior',
    points: [
      { title: 'At your address', text: 'Home, office or apartment lot, with nothing to set up.' },
      { title: 'Eco-friendly products', text: 'We clean with eco-friendly detailing products.' },
      { title: 'Satisfaction guarantee', text: 'If something is not right, tell us and we will make it right.' },
    ],
    faqs: [
      { q: 'Basic or Premium: which one?', a: 'The Basic Detail for a lived-in car without stains. The Premium Detail when seats or carpets need shampoo and extraction.' },
      FAQ_TIME,
      FAQ_SIZE,
      FAQ_ECO,
      FAQ_PAY,
    ],
    service: { type: 'Interior car detailing', offers: DETAIL_OFFERS },
  },
  {
    path: '/car-carpet-cleaning-stanton',
    nav: 'Carpet & upholstery cleaning',
    city: HOME_CITY,
    title: fitTitle('Car Carpet Cleaning', HOME_CITY),
    description: 'Car carpet and upholstery cleaning in Stanton, CA: shampoo and extraction with the $200 Premium Detail. We come to you. Same price for any vehicle.',
    eyebrow: 'Carpet & upholstery · Stanton, CA',
    h1: ['Car carpet cleaning', 'in Stanton.'],
    lede: 'Coffee drips, pet hair and muddy floor mats work into carpet and cloth seats. Shampoo with extraction pulls the dirt out of the fibers instead of spreading it.',
    facts: ['$200 Premium Detail', 'Any vehicle size', 'Every day 8–5'],
    card: 'premium',
    pkg: 'premium',
    photo: PHOTO.spray,
    intro: {
      h2: 'Vacuum, shampoo, extract.',
      paras: [
        'Carpet and upholstery shampoo is part of the Premium Detail. Three vacuum passes come first so the loose dirt is gone before the fabric gets wet.',
        'Carpets and cloth seats are then shampooed and extracted, which rinses the fibers and pulls the dirty water back out. Deep carpet cleaning, interior windows, dust elimination and a UV-protectant coating finish the cabin.',
        'Most everyday spills and dirt come out. Old set-in stains, ink or dye transfer may lighten rather than disappear.',
      ],
    },
    pointsTitle: 'Before you book carpet cleaning',
    points: [
      { title: 'One price', text: '$200 for a compact or a full-size SUV.' },
      { title: '4 to 6 hours', text: 'The usual time for a Premium Detail.' },
      { title: 'Add the outside', text: 'The $50 Exterior Wash makes it $250 inside and out.' },
    ],
    faqs: [
      { q: 'Is carpet shampoo in the Basic Detail?', a: 'No. Shampoo and extraction come with the Premium Detail ($200). The Basic Detail is vacuuming, a full wipe-down and floor mats.' },
      { q: 'Will every stain come out?', a: 'Most everyday stains do. Old set-in stains, ink or dye transfer may only lighten.' },
      FAQ_SIZE,
      FAQ_WATER,
      FAQ_GUARANTEE,
    ],
    service: { type: 'Car carpet and upholstery cleaning', offers: PREMIUM_OFFERS },
  },
  {
    path: '/inside-and-out-detail-stanton',
    nav: 'Inside & out detail',
    city: HOME_CITY,
    title: fitTitle('Inside & Out Car Detail', HOME_CITY),
    description: 'Inside and out car detail in Stanton, CA: interior detail plus the $50 exterior hand wash, $200 or $250. Mobile, with our own water and power.',
    eyebrow: 'Inside & out · Stanton, CA',
    h1: ['Inside & out car detail', 'in Stanton.'],
    lede: 'Get the whole car done in one visit: an interior detail first, then a hand wash, rim cleaning and spot-free dry for the outside.',
    facts: ['From $200', 'Hand wash & dry', 'Own water & power'],
    card: 'combo',
    pkg: 'premium',
    photo: PHOTO.mitt,
    intro: {
      h2: 'Interior first, then the wash.',
      paras: [
        'The Exterior Wash is an add-on, so every visit starts with the Basic Detail ($150) or the Premium Detail ($200) inside the car.',
        'For $50 more we hand wash the outside, clean the rims in detail, scrub and degrease the tires, wipe the door jambs and panels, add tire shine and hand dry the paint so it dries without spots.',
        'That is $200 with the Basic Detail or $250 with the Premium Detail. We bring our own water and power.',
      ],
    },
    pointsTitle: 'One visit, the whole car',
    points: [
      { title: 'Hand washed', text: 'Mitt wash, detailed rims and a spot-free hand dry.' },
      { title: 'Self-contained', text: 'Our own water and power, at your Stanton address.' },
      { title: '$15 off online', text: 'Use code PREPAY at checkout, or pay after the service.' },
    ],
    faqs: [
      { q: 'How much is inside and out?', a: '$200 for the Basic Detail with the Exterior Wash, or $250 for the Premium Detail with the Exterior Wash.' },
      FAQ_WASH,
      FAQ_WATER,
      FAQ_ECO,
      FAQ_PAY,
    ],
    service: { type: 'Interior detail and exterior hand wash', offers: WASH_OFFERS },
  },
  {
    path: '/detailing-rates-stanton',
    nav: 'Rates',
    city: HOME_CITY,
    title: fitTitle('Car Detailing Rates', HOME_CITY),
    description: 'Car detailing rates in Stanton, CA: Basic Detail $150, Premium Detail $200, Exterior Wash add-on $50. Same price for any car, SUV or truck.',
    eyebrow: 'Rates · Stanton, CA',
    h1: ['Car detailing rates', 'in Stanton.'],
    lede: 'Flat rates that stay the same whatever you drive. Here is what each package costs, covers and how long it usually takes.',
    facts: ['Basic $150', 'Premium $200', 'Wash add-on $50'],
    card: 'premium',
    pkg: 'premium',
    photo: PHOTO.wheel,
    intro: {
      h2: 'The full rate card.',
      paras: [
        'Basic Detail, $150, about 2 to 3 hours: triple-stage vacuuming for deep debris, a complete interior surface wipe-down, and floor mats cleaned and restored.',
        'Premium Detail, $200, about 4 to 6 hours: triple-stage vacuuming plus cabin application, dust elimination, interior windows, deep carpet cleaning, cloth and carpet extraction, full interior shampooing and a UV-protectant coating.',
        'Exterior Wash, +$50 on either detail: hand wash, detailed rims, tire scrub and degrease, door jambs and panels, tire shine and a spot-free hand dry. Code PREPAY takes $15 off online.',
      ],
    },
    pointsTitle: 'Simple rates',
    points: [
      { title: 'Any vehicle, one price', text: 'A coupe and a pickup pay the same.' },
      { title: 'Visit included', text: 'The rate includes coming to your address.' },
      { title: 'Pay now or later', text: 'Prepay online for $15 off, or pay after the service.' },
    ],
    faqs: [
      { q: 'What does the most complete visit cost?', a: '$250 for the Premium Detail with the Exterior Wash, or $235 if you prepay online with code PREPAY.' },
      FAQ_SIZE,
      FAQ_TIME,
      FAQ_WASH,
      FAQ_GUARANTEE,
    ],
    service: { type: 'Auto detailing', offers: DETAIL_OFFERS },
  },
];

// City pages: same packages, prices and hours; local wording.
function cityPage({ slug, city, areas, lede, paras, photo, faq }) {
  return {
    path: `/car-detailing-service-${slug}`,
    nav: city,
    city,
    isCity: true,
    title: fitTitle('Car Detailing Service', city),
    description: `Mobile car detailing service in ${city}, CA by Bright Coat. Details $150 and $200, $50 hand wash add-on, same price any car. Every day 8 AM to 5 PM.`,
    eyebrow: `Mobile detailing · ${city}, CA`,
    h1: ['Car detailing service', `in ${city}.`],
    lede,
    facts: ['From $150', 'Own water & power', 'Every day 8–5'],
    card: 'combo',
    pkg: 'premium',
    photo,
    areas,
    intro: { h2: `We come to you in ${city}.`, paras },
    pointsTitle: `Why ${city} drivers book Bright Coat`,
    points: [
      { title: 'Stanton prices', text: 'The same $150 and $200 details and $50 wash add-on, for any vehicle.' },
      { title: 'Self-contained', text: 'We bring our own water and power, so there is nothing to hook up.' },
      { title: 'Satisfaction guarantee', text: 'If something is not right, tell us and we will make it right.' },
    ],
    faqs: [
      { q: `Do you come to ${city}?`, a: `Yes. We detail cars at homes and workplaces across ${city}, including ${areas.slice(0, 3).join(', ')}.` },
      faq,
      FAQ_SIZE,
      FAQ_WATER,
      FAQ_WASH,
    ],
    service: { type: 'Mobile car detailing', offers: DETAIL_OFFERS },
  };
}

export const CITY_PAGES = [
  cityPage({
    slug: 'garden-grove',
    city: 'Garden Grove',
    areas: ['West Garden Grove', 'the Civic Center area', 'Garden Grove Boulevard', 'Brookhurst Street', 'Westminster Avenue'],
    lede: 'Garden Grove wraps around Stanton to the south and east. Book online and we detail the car right where it is parked.',
    paras: [
      'We work across Garden Grove, from West Garden Grove and the Civic Center area to the homes along Garden Grove Boulevard, Brookhurst Street and Westminster Avenue.',
      'Pick the $150 Basic Detail for three vacuum passes, a full wipe-down and clean floor mats, or the $200 Premium Detail when the seats and carpets need shampoo and extraction.',
      'Add the $50 Exterior Wash for a hand wash and spot-free dry. Start times run every day from 8 AM to 5 PM.',
    ],
    photo: PHOTO.mitt,
    faq: { q: 'Is Garden Grove the same price as Stanton?', a: 'Yes. Same packages, same prices and the same hours.' },
  }),
  cityPage({
    slug: 'westminster',
    city: 'Westminster',
    areas: ['Westminster Mall area', 'Bolsa Avenue', 'Goldenwest Street', 'Beach Boulevard', 'Edinger Avenue'],
    lede: 'Westminster is a short drive south of Stanton down Beach Boulevard. We bring the full detail to your driveway there.',
    paras: [
      'We detail cars throughout Westminster, from the neighborhoods near the Westminster Mall to the streets off Bolsa Avenue, Goldenwest Street, Beach Boulevard and Edinger Avenue.',
      'The Basic Detail ($150, usually 2 to 3 hours) covers vacuuming, a full wipe-down and floor mats. The Premium Detail ($200, usually 4 to 6 hours) adds deep carpet cleaning, extraction, shampoo and UV protection.',
      'There is no extra charge for an SUV, truck or minivan, and code PREPAY takes $15 off online.',
    ],
    photo: PHOTO.wheel,
    faq: { q: 'Can you detail my car at work in Westminster?', a: 'Yes. Enter the work address when you book; we only need room around the car to open the doors.' },
  }),
  cityPage({
    slug: 'anaheim',
    city: 'Anaheim',
    areas: ['West Anaheim', 'Anaheim Resort area', 'Downtown Anaheim', 'Ball Road', 'Magnolia Avenue'],
    lede: 'West Anaheim sits right on Stanton’s northern border. We bring the same interior details, and the hand wash if you want it, across Anaheim.',
    paras: [
      'We come to homes and workplaces in Anaheim, from West Anaheim and the streets off Ball Road and Magnolia Avenue to downtown and the Anaheim Resort area.',
      'Book the $150 Basic Detail or the $200 Premium Detail, which adds full shampoo and cloth and carpet extraction to the interior.',
      'Want the outside done too? The $50 Exterior Wash adds a hand wash, detailed rims, tire shine and a spot-free hand dry.',
    ],
    photo: PHOTO.foam,
    faq: { q: 'How much is inside and out in Anaheim?', a: '$250 for the Premium Detail with the Exterior Wash, or $200 for the Basic Detail with the Exterior Wash.' },
  }),
  cityPage({
    slug: 'cypress',
    city: 'Cypress',
    areas: ['Lincoln Avenue', 'Cypress College area', 'Valley View Street', 'Ball Road', 'Katella Avenue'],
    lede: 'Cypress is just west of Stanton along Katella Avenue. Book a detail and we set up at your home or office there.',
    paras: [
      'We detail cars across Cypress, from the homes off Lincoln Avenue and Ball Road to the neighborhoods near Cypress College, Valley View Street and Katella Avenue.',
      'Choose the $150 Basic Detail or the $200 Premium Detail with deep carpet cleaning, extraction, full shampoo and a UV-protectant coating.',
      'Add the $50 Exterior Wash for the outside. Pay online with code PREPAY for $15 off, or pay after the service.',
    ],
    photo: PHOTO.spray,
    faq: { q: 'Can I book a weekend in Cypress?', a: 'Yes. We work every day of the week, with start times from 8 AM to 5 PM.' },
  }),
  cityPage({
    slug: 'los-alamitos',
    city: 'Los Alamitos',
    areas: ['Rossmoor', 'Katella Avenue', 'Los Alamitos Boulevard', 'Old Town West', 'Cerritos Avenue'],
    lede: 'Los Alamitos is a quick drive west of Stanton. We bring the same mobile detailing and prices to your street there.',
    paras: [
      'We work across Los Alamitos and neighboring Rossmoor, from Old Town West to the homes along Katella Avenue, Los Alamitos Boulevard and Cerritos Avenue.',
      'The $150 Basic Detail gives the cabin three vacuum passes, a full wipe-down and clean floor mats. The $200 Premium Detail adds shampoo, extraction and a UV-protectant coating.',
      'Same price for any vehicle size, and start times every day from 8 AM to 5 PM.',
    ],
    photo: PHOTO.orange,
    faq: { q: 'Do you also cover Rossmoor?', a: 'Yes. Rossmoor sits next to Los Alamitos and gets the same prices and hours.' },
  }),
  cityPage({
    slug: 'fountain-valley',
    city: 'Fountain Valley',
    areas: ['Mile Square Park', 'Brookhurst Street', 'Warner Avenue', 'Slater Avenue', 'Magnolia Street'],
    lede: 'Fountain Valley is south of Stanton past Garden Grove. Book online and we detail the car at your home or office.',
    paras: [
      'We detail cars throughout Fountain Valley, from the homes around Mile Square Park to the neighborhoods off Brookhurst Street, Warner Avenue, Slater Avenue and Magnolia Street.',
      'Pick the $150 Basic Detail or the $200 Premium Detail when the seats and carpets need shampoo and extraction.',
      'The $50 Exterior Wash adds a hand wash, rims, tire shine and a spot-free dry. We bring our own water and power.',
    ],
    photo: PHOTO.rinse,
    faq: { q: 'Do you charge more to come to Fountain Valley?', a: 'No. Fountain Valley pays the same prices as Stanton.' },
  }),
  cityPage({
    slug: 'buena-park',
    city: 'Buena Park',
    areas: ['Knott’s Berry Farm area', 'Beach Boulevard', 'Orangethorpe Avenue', 'Malvern Avenue', 'Stanton Avenue'],
    lede: 'Buena Park is just north of Stanton up Beach Boulevard. We come to your driveway there with everything we need.',
    paras: [
      'We work across Buena Park, from the neighborhoods near Knott’s Berry Farm and Beach Boulevard to the streets off Orangethorpe Avenue, Malvern Avenue and Stanton Avenue.',
      'Book the $150 Basic Detail or the $200 Premium Detail, which adds full shampoo and cloth and carpet extraction.',
      'Same price for any car, SUV, truck or minivan, and code PREPAY takes $15 off online.',
    ],
    photo: PHOTO.mitt,
    faq: { q: 'Is Buena Park the same price as Stanton?', a: 'Yes. Same packages, same prices and the same hours.' },
  }),
  cityPage({
    slug: 'la-palma',
    city: 'La Palma',
    areas: ['Central Park', 'La Palma Avenue', 'Walker Street', 'Moody Street', 'Valley View Street'],
    lede: 'La Palma sits northwest of Stanton. Book a detail and we bring the full interior clean, and the wash if you want it, to your home.',
    paras: [
      'We detail cars all over La Palma, from the streets around Central Park to the neighborhoods off La Palma Avenue, Walker Street, Moody Street and Valley View Street.',
      'The Basic Detail ($150) covers vacuuming, a full wipe-down and floor mats. The Premium Detail ($200) adds deep carpet cleaning, extraction, shampoo and UV protection.',
      'Add the $50 Exterior Wash for the outside. Start times run every day from 8 AM to 5 PM.',
    ],
    photo: PHOTO.wheel,
    faq: { q: 'Do you need a driveway in La Palma?', a: 'No. Street parking or a parking lot works too, as long as we can reach all sides of the car.' },
  }),
];

export const LANDING_PAGES = [...SERVICE_PAGES, ...CITY_PAGES];

export function findLanding(path) {
  return LANDING_PAGES.find((p) => p.path === path);
}
