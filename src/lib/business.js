export const BUSINESS = {
  name: 'Bright Coat Car Detailing Stanton',
  short: 'Bright Coat',
  phone: '(714) 408-4156',
  phoneHref: 'tel:+17144084156',
  city: 'Stanton, CA',
  hours: 'Mon–Sun by appointment',
  mapQuery: 'Stanton, CA',
};

export const SERVICE_AREA = [
  'Stanton', 'Garden Grove', 'Anaheim', 'Cypress', 'Westminster',
  'Buena Park', 'Los Alamitos', 'Fountain Valley', 'Cerritos', 'La Palma',
];

export const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Detail',
    price: 150,
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
