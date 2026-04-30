// ═══════════════════════════════════════════════════════════════
// MARKETPLACE DASHBOARD — DATA SEED (mirrors erep B2C admin)
// ═══════════════════════════════════════════════════════════════

export const MP_BROKERAGES = [
  { id: 'BR-001', name: "Sotheby's International Realty Egypt", mlsId: '25429-001', properties: 49, leads: 39, avgPrice: 10400000 },
  { id: 'BR-002', name: 'RE/MAX Egypt', mlsId: '25429-002', properties: 38, leads: 26, avgPrice: 8900000 },
  { id: 'BR-003', name: 'Century 21 Egypt', mlsId: '25429-003', properties: 24, leads: 17, avgPrice: 7200000 },
  { id: 'BR-004', name: 'Coldwell Banker Egypt', mlsId: '25429-004', properties: 19, leads: 14, avgPrice: 6500000 },
];

// Photo helper — Unsplash CDN.
const _devImg = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;
const _slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const _projects = (devName, list) => list.map((p, i) => ({
  id: `${_slug(devName)}-p${i+1}`, slug: `${_slug(devName)}-${_slug(p.name)}`,
  ...p, developer: devName,
}));

// Field shape mirrors EREP's `DeveloperBroker` + `ApiProject` types
// (logo, mlsId, type, slug, units, projects[], cover, governorates, etc.)
// even though EREP never rendered these in the consumer app.
export const MP_DEVELOPERS = [
  { id: 'DV-001', name: 'Sodic', slug: 'sodic', mlsId: 'EG-DEV-25429-001', type: 'developer',
    projects: 34, units: 25, priceMin: 4400000, priceMax: 36000000,
    governorates: ['Giza','Cairo','Matrouh'],
    initials: 'SO', color1: '#7c2d12', color2: '#ea580c',
    tagline: 'Master-planned communities & lifestyle compounds',
    cover: _devImg('1600585154526-990dced4db0d', 1200), logo: _devImg('1600585154526-990dced4db0d', 200),
    description: 'SODIC is one of Egypt\'s leading developers, with a track record of master-planned communities across Cairo, Sheikh Zayed, and the North Coast. Known for design-led architecture and integrated lifestyle amenities.',
    contact: { phone: '+20 16001', email: 'info@sodic.com', website: 'sodic.com' },
    projectsList: _projects('Sodic', [
      { name: 'Sodic East',  city: 'New Cairo',     image: _devImg('1600585154340-be6161a56a0c', 600), startPrice: 5200000, propertiesCount: 12 },
      { name: 'Sodic West',  city: '6th of October',image: _devImg('1600596542815-ffad4c1539a9', 600), startPrice: 4400000, propertiesCount: 9 },
      { name: 'Villette',    city: 'New Cairo',     image: _devImg('1600585154526-990dced4db0d', 600), startPrice: 6800000, propertiesCount: 7 },
    ]),
  },
  { id: 'DV-002', name: 'Palm Hills', slug: 'palm-hills', mlsId: 'EG-DEV-25429-002', type: 'developer',
    projects: 31, units: 22, priceMin: 5500000, priceMax: 32000000,
    governorates: ['Cairo','Matrouh'],
    initials: 'PH', color1: '#0f172a', color2: '#334155',
    tagline: 'Premium gated communities · West & East Cairo, North Coast',
    cover: _devImg('1600566753190-17f0baa2a6c3', 1200), logo: _devImg('1600566753190-17f0baa2a6c3', 200),
    description: 'Palm Hills is a leading Egyptian real estate developer, known for premium master-planned communities, signature villa neighborhoods, and the Hacienda chain on the North Coast.',
    contact: { phone: '+20 16744', email: 'info@palmhillsdevelopments.com', website: 'palmhillsdevelopments.com' },
    projectsList: _projects('Palm Hills', [
      { name: 'Palm Hills New Cairo', city: 'New Cairo',   image: _devImg('1613490493576-7fde63acd811', 600), startPrice: 11500000, propertiesCount: 14 },
      { name: 'Hacienda Bay',         city: 'North Coast', image: _devImg('1572120360610-d971b9d7767c', 600), startPrice: 14000000, propertiesCount: 8 },
      { name: 'Palm Hills Katameya',  city: 'New Cairo',   image: _devImg('1600566753190-17f0baa2a6c3', 600), startPrice: 8900000, propertiesCount: 6 },
    ]),
  },
  { id: 'DV-003', name: 'Talaat Moustafa Group', slug: 'talaat-moustafa', mlsId: 'EG-DEV-25429-003', type: 'developer',
    projects: 28, units: 18, priceMin: 3800000, priceMax: 22000000,
    governorates: ['Cairo','Giza'],
    initials: 'TM', color1: '#7f1d1d', color2: '#dc2626',
    tagline: 'Madinaty, Al Rehab, Celia — large-scale townships',
    cover: _devImg('1599809275671-b5942cabc7a2', 1200), logo: _devImg('1599809275671-b5942cabc7a2', 200),
    description: 'Talaat Moustafa Group is the largest real estate developer in Egypt. Its flagship townships — Madinaty and Al Rehab — house hundreds of thousands of residents.',
    contact: { phone: '+20 16650', email: 'info@talaatmoustafa.com', website: 'talaatmoustafa.com' },
    projectsList: _projects('Talaat Moustafa Group', [
      { name: 'Madinaty', city: 'New Cairo', image: _devImg('1599809275671-b5942cabc7a2', 600), startPrice: 4200000, propertiesCount: 22 },
      { name: 'Al Rehab', city: 'New Cairo', image: _devImg('1605114946229-65d533fb14ef', 600), startPrice: 3800000, propertiesCount: 11 },
      { name: 'Celia',    city: 'New Capital', image: _devImg('1605276374104-dee2a0ed3cd6', 600), startPrice: 6500000, propertiesCount: 6 },
    ]),
  },
  { id: 'DV-004', name: 'Mountain View', slug: 'mountain-view', mlsId: 'EG-DEV-25429-004', type: 'developer',
    projects: 22, units: 14, priceMin: 4200000, priceMax: 24000000,
    governorates: ['Cairo','Matrouh'],
    initials: 'MV', color1: '#064e3b', color2: '#10b981',
    tagline: 'Smart living iCities & resort destinations',
    cover: _devImg('1564013799919-ab600027ffc6', 1200), logo: _devImg('1564013799919-ab600027ffc6', 200),
    description: 'Mountain View pioneered the iCity concept in Egypt — fully integrated smart cities with green corridors, central parks, and connected lifestyle amenities.',
    contact: { phone: '+20 19888', email: 'info@mountainviewegypt.com', website: 'mountainviewegypt.com' },
    projectsList: _projects('Mountain View', [
      { name: 'Mountain View iCity', city: 'New Cairo', image: _devImg('1564013799919-ab600027ffc6', 600), startPrice: 7800000, propertiesCount: 13 },
      { name: 'Aliva',               city: 'New Cairo', image: _devImg('1600573472550-8090b5e0745e', 600), startPrice: 5500000, propertiesCount: 5 },
    ]),
  },
  { id: 'DV-005', name: 'Hyde Park', slug: 'hyde-park', mlsId: 'EG-DEV-25429-005', type: 'developer',
    projects: 17, units: 10, priceMin: 7500000, priceMax: 28000000,
    governorates: ['Cairo'],
    initials: 'HP', color1: '#581c87', color2: '#a855f7',
    tagline: 'Iconic central park communities — New Cairo & North Coast',
    cover: _devImg('1572120360610-d971b9d7767c', 1200), logo: _devImg('1572120360610-d971b9d7767c', 200),
    description: 'Hyde Park is celebrated for its 6 km central park, sea-mile gardens, and resale-strong New Cairo address.',
    contact: { phone: '+20 16660', email: 'info@hydeparkdevelopments.com', website: 'hydeparkdevelopments.com' },
    projectsList: _projects('Hyde Park', [
      { name: 'Hyde Park New Cairo', city: 'New Cairo', image: _devImg('1572120360610-d971b9d7767c', 600), startPrice: 11200000, propertiesCount: 9 },
      { name: 'Tawny',               city: 'New Cairo', image: _devImg('1600566753190-17f0baa2a6c3', 600), startPrice: 7500000, propertiesCount: 4 },
    ]),
  },
  { id: 'DV-006', name: 'Ora Developers', slug: 'ora', mlsId: 'EG-DEV-25429-006', type: 'developer',
    projects: 16, units: 11, priceMin: 8200000, priceMax: 35000000,
    governorates: ['Cairo'],
    initials: 'OR', color1: '#1e3a8a', color2: '#3b82f6',
    tagline: 'Mixed-use icons — ZED East, ZED West, ZED Strip',
    cover: _devImg('1564013799919-ab600027ffc6', 1200), logo: _devImg('1564013799919-ab600027ffc6', 200),
    description: 'Ora Developers, founded by Naguib Sawiris, is best known for the ZED brand — design-forward mixed-use developments anchoring Cairo\'s most prestigious zip codes.',
    contact: { phone: '+20 26100', email: 'info@oradevelopers.com', website: 'oradevelopers.com' },
    projectsList: _projects('Ora', [
      { name: 'ZED East', city: 'New Cairo',     image: _devImg('1564013799919-ab600027ffc6', 600), startPrice: 8200000,  propertiesCount: 7 },
      { name: 'ZED West', city: 'Sheikh Zayed',  image: _devImg('1600596542815-ffad4c1539a9', 600), startPrice: 9500000,  propertiesCount: 4 },
    ]),
  },
  { id: 'DV-007', name: 'City Edge', slug: 'city-edge', mlsId: 'EG-DEV-25429-007', type: 'developer',
    projects: 12, units: 8, priceMin: 2900000, priceMax: 12000000,
    governorates: ['Cairo','Suez'],
    initials: 'CE', color1: '#1e3a8a', color2: '#0ea5e9',
    tagline: 'Public-sector developer — North Edge, Etapa, Zahya',
    cover: _devImg('1605276374104-dee2a0ed3cd6', 1200), logo: _devImg('1605276374104-dee2a0ed3cd6', 200),
    description: 'City Edge is the public-sector master developer behind Egypt\'s North Edge towers, Zahya in New Mansoura, and Etapa in Sheikh Zayed.',
    contact: { phone: '+20 16880', email: 'info@cityedge-developments.com', website: 'cityedge-developments.com' },
    projectsList: _projects('City Edge', [
      { name: 'North Edge Towers', city: 'New Alamein', image: _devImg('1605276374104-dee2a0ed3cd6', 600), startPrice: 4900000, propertiesCount: 5 },
      { name: 'Zahya',             city: 'New Mansoura', image: _devImg('1600573472550-8090b5e0745e', 600), startPrice: 2900000, propertiesCount: 3 },
    ]),
  },
  { id: 'DV-008', name: 'Better Home', slug: 'better-home', mlsId: 'EG-DEV-25429-008', type: 'developer',
    projects: 11, units: 7, priceMin: 4500000, priceMax: 15000000,
    governorates: ['Cairo'],
    initials: 'BH', color1: '#831843', color2: '#ec4899',
    tagline: 'Boutique residential & administrative projects',
    cover: _devImg('1568605114967-8130f3a36994', 1200), logo: _devImg('1568605114967-8130f3a36994', 200),
    description: 'Better Home delivers boutique residential and administrative projects with strong attention to facades, finishes, and after-sales service.',
    contact: { phone: '+20 19990', email: 'info@bhd-egypt.com', website: 'bhd-egypt.com' },
    projectsList: _projects('Better Home', [
      { name: 'Midtown',          city: 'New Capital', image: _devImg('1568605114967-8130f3a36994', 600), startPrice: 4500000, propertiesCount: 4 },
      { name: 'Midtown Sky',      city: 'New Capital', image: _devImg('1605276374104-dee2a0ed3cd6', 600), startPrice: 5200000, propertiesCount: 3 },
    ]),
  },
];

// Per-developer top-10 unit counts (for the Top 10 chart)
export const TOP_10_DEVELOPERS = [
  { name: 'Mountain View iCity', count: 6.4 },
  { name: 'Marassi',             count: 0.2 },
  { name: 'Il Bosco',             count: 5.4 },
  { name: 'Villette',             count: 0.5 },
  { name: 'Hacienda Bay',         count: 0.7 },
  { name: 'Midtown',              count: 0.4 },
  { name: 'The Waterway',         count: 1.9 },
  { name: 'Palm Hills Katameya',  count: 6.1 },
  { name: 'Sodic East',           count: 1.9 },
  { name: 'Lake View',            count: 2.3 },
];

export const MP_LISTINGS = (() => {
  const sub = ['Apartment','Villa','Townhouse','Twinhouse','Duplex','Penthouse','Chalet'];
  const govs = ['Cairo','Giza','Alexandria','Matrouh','Suez','Red Sea'];
  const cities = ['New Cairo','New Capital','6th of October','Sheikh Zayed','North Coast','Heliopolis','Maadi','Ain Sokhna'];
  const compounds = ['Palm Hills Katameya','The Waterway, New Cairo','ZED East','Hacienda Bay','Mountain View iCity','Sodic East','Madinaty','Hyde Park New Cairo','Marassi','Il Bosco'];
  const out = [];
  for (let i = 0; i < 56; i++) {
    out.push({
      id: 'E' + (2000200 + i),
      type: i % 4 === 0 ? 'Commercial' : 'Residential',
      subType: sub[i % sub.length],
      compound: compounds[i % compounds.length],
      governorate: govs[i % govs.length],
      city: cities[i % cities.length],
      price: (4 + (i % 10)) * 1000000 + 700000,
      office: MP_BROKERAGES[i % MP_BROKERAGES.length].name,
      developer: MP_DEVELOPERS[i % MP_DEVELOPERS.length].name,
      bedrooms: 2 + (i % 4),
      bathrooms: 2 + (i % 3),
      area: 120 + (i % 12) * 18,
      status: 'Published',
    });
  }
  return out;
})();

// Sub-type donut data (matches erep)
export const SUB_TYPE_DONUT = [
  { label: 'Apartment', pct: 30, color: '#1f2937' },
  { label: 'Villa', pct: 25, color: '#5fb6c0' },
  { label: 'Penthouse', pct: 10, color: '#f4978e' },
  { label: 'Chalet', pct: 10, color: '#80c8a8' },
  { label: 'Duplex', pct: 10, color: '#b9d8a4' },
  { label: 'Townhouse', pct: 10, color: '#5b9cd8' },
  { label: 'Twinhouse', pct: 5, color: '#e1b0e0' },
];

// Listings By Years bar chart (12-month seed)
export const LISTINGS_BY_MONTH = [970, 12, 905, 50, 750, 50, 245, 940, 250, 290, 940, 350];

// Lead Type Trend (stacked) — inquiries / viewings / mortgages / sell per month
export const LEAD_TYPE_TREND = [
  { m: 'Jan', inquiries: 970, viewings: 0,   mortgages: 0,   sell: 30 },
  { m: 'Feb', inquiries: 18,  viewings: 0,   mortgages: 0,   sell: 0  },
  { m: 'Mar', inquiries: 880, viewings: 0,   mortgages: 0,   sell: 110 },
  { m: 'Apr', inquiries: 75,  viewings: 0,   mortgages: 0,   sell: 800 },
  { m: 'May', inquiries: 750, viewings: 0,   mortgages: 0,   sell: 130 },
  { m: 'Jun', inquiries: 60,  viewings: 250, mortgages: 530, sell: 50 },
  { m: 'Jul', inquiries: 250, viewings: 60,  mortgages: 470, sell: 100 },
  { m: 'Aug', inquiries: 940, viewings: 0,   mortgages: 0,   sell: 50  },
  { m: 'Sep', inquiries: 250, viewings: 60,  mortgages: 510, sell: 100 },
  { m: 'Oct', inquiries: 290, viewings: 60,  mortgages: 470, sell: 70  },
  { m: 'Nov', inquiries: 940, viewings: 0,   mortgages: 50,  sell: 0   },
  { m: 'Dec', inquiries: 360, viewings: 60,  mortgages: 480, sell: 70  },
];

// Lead Flow By Office (table on Leads & Requests page)
export const LEAD_FLOW_BY_OFFICE = MP_BROKERAGES.map(b => ({ office: b.name, total: 39, inq: 14, view: 16, mtg: 9 }));

// B2C Leads & Requests — 4 lead types with type-specific extra fields.
const B2C_USERS = ['Dina Sabry','Ahmed Helmy','Mona Gamal','Omar Khalifa','Yasmine Adel','Karim Fouad','Nour Ibrahim','Tarek Mansour','Sara Ali','Mohamed Hassan'];

export const MP_LEADS = (() => {
  const arr = [];
  const types = ['inquiry','viewing','mortgage','sell'];
  const compounds = ['The Waterway, New Cairo','Palm Hills Katameya','Mountain View iCity','Hacienda Bay','Marassi','ZED East','Madinaty','Sodic East'];
  const occupations = ['Architect','Marketing Manager','Software Engineer','Consultant','Doctor','Business Owner','Banker','Designer'];
  for (let i = 0; i < 60; i++) {
    const type = types[i % types.length];
    const user = B2C_USERS[i % B2C_USERS.length];
    const office = MP_BROKERAGES[i % MP_BROKERAGES.length].name;
    const id = `${type === 'sell' ? 'SELL' : type === 'viewing' ? 'VW' : type === 'mortgage' ? 'MTG' : 'INQ'}-2024${String(900 + i).padStart(4,'0')}-${String(40 + i).padStart(3,'0')}`;
    const base = {
      id, type, user,
      contact: '+20 1024' + String(100000 + i),
      details: ['Townhouse','Apartment','Villa','Chalet','Penthouse'][i % 5] + ' · ' + ['New Capital','New Cairo','Sheikh Zayed','North Coast','6th of October'][i % 5],
      date: `2024-${String(((i % 12) + 1)).padStart(2,'0')}-${String((i % 28) + 1).padStart(2,'0')}`,
      mlsId: 'E' + (2000200 + i),
      compound: compounds[i % compounds.length],
      office,
    };
    if (type === 'viewing') {
      base.preferredSlots = [
        `Wednesday · ${(i % 28) + 1} Oct 2024 · 12:00 PM`,
        `Thursday · ${((i + 5) % 28) + 1} Jan 2024 · 12:00 PM`,
        `Tuesday · ${((i + 10) % 28) + 1} Jun 2024 · 1:00 PM`,
      ];
    }
    if (type === 'mortgage') {
      base.occupation = occupations[i % occupations.length];
      base.monthlyIncome = 'EGP ' + (50 + (i % 200)) + 'K';
      base.loanAmount = 'EGP ' + (1.5 + ((i % 30) / 10)).toFixed(1) + 'M';
    }
    arr.push(base);
  }
  return arr;
})();

// Geography — by governorate / by area
export const MP_GEO_GOV = [
  { gov: 'Cairo',      areas: 49, compound: 49, listings: 49, avgPrice: 11900000, share: 38.0 },
  { gov: 'Giza',       areas: 27, compound: 27, listings: 32, avgPrice: 9800000,  share: 22.0 },
  { gov: 'Matrouh',    areas: 18, compound: 18, listings: 24, avgPrice: 14500000, share: 18.0 },
  { gov: 'Suez',       areas: 12, compound: 12, listings: 14, avgPrice: 5800000,  share: 11.0 },
  { gov: 'Alexandria', areas: 8,  compound: 8,  listings: 11, avgPrice: 7100000,  share: 7.0 },
  { gov: 'Red Sea',    areas: 6,  compound: 6,  listings: 8,  avgPrice: 8400000,  share: 4.0 },
];

export const MP_GEO_AREAS = [
  { area: 'New Cairo',         gov: 'Cairo', compound: 10, listings: 49, avgPrice: 11900000, dominant: 'Apartment', share: 31.0 },
  { area: 'New Capital',       gov: 'Cairo', compound: 7,  listings: 35, avgPrice: 10300000, dominant: 'Apartment', share: 22.0 },
  { area: 'Sheikh Zayed',      gov: 'Giza',  compound: 9,  listings: 28, avgPrice: 9700000,  dominant: 'Villa',     share: 18.0 },
  { area: '6th of October',    gov: 'Giza',  compound: 8,  listings: 22, avgPrice: 7400000,  dominant: 'Apartment', share: 14.0 },
  { area: 'North Coast',       gov: 'Matrouh', compound: 11, listings: 24, avgPrice: 14500000, dominant: 'Chalet',  share: 15.0 },
  { area: 'Ain Sokhna',        gov: 'Suez',  compound: 4,  listings: 11, avgPrice: 6900000,  dominant: 'Chalet',     share: 7.0 },
  { area: 'Heliopolis',        gov: 'Cairo', compound: 3,  listings: 9,  avgPrice: 8100000,  dominant: 'Apartment', share: 6.0 },
  { area: 'Maadi',             gov: 'Cairo', compound: 2,  listings: 7,  avgPrice: 7600000,  dominant: 'Apartment', share: 4.0 },
];

// Governorate density (bar chart) and area density
export const GOV_DENSITY = [
  { name: 'Cairo', count: 49 },
  { name: 'Giza', count: 240 },
  { name: 'Matrouh', count: 285 },
  { name: 'Suez', count: 210 },
  { name: 'Alexandria', count: 65 },
];

export const AREA_DENSITY = [
  { name: 'New Cairo', count: 49 },
  { name: 'New Administrative Capital', count: 240 },
  { name: 'North Coast', count: 285 },
  { name: 'Sheikh Zayed', count: 210 },
  { name: '6th of October', count: 210 },
  { name: 'Ain Sokhna', count: 210 },
  { name: 'Heliopolis', count: 210 },
  { name: 'Stanley', count: 65 },
];

// Traffic page
export const TRAFFIC_KPIS = {
  totalVisitors: 145200, totalPageViews: 423800, uniqueSessions: 87400, avgSessionDuration: '3m 18s',
  bounceRate: '38%', pagesPerSession: 4.6,
};
export const TRAFFIC_BY_SOURCE = [
  { name: 'Direct',         pct: 34, color: '#1f2937' },
  { name: 'Organic Search', pct: 30, color: '#f4978e' },
  { name: 'Social Media',   pct: 27, color: '#5fb6c0' },
  { name: 'Referral',       pct: 8,  color: '#80c8a8' },
  { name: 'Paid Ads',       pct: 13, color: '#5b9cd8' },
];
export const DEVICE_BREAKDOWN = [
  { name: 'Mobile',  pct: 63, color: '#f4978e' },
  { name: 'Desktop', pct: 32, color: '#5fb6c0' },
  { name: 'Tablet',  pct: 13, color: '#1f2937' },
];
export const PEAK_HOURS = [40,38,35,32,30,40,55,180,260,290,275,285,295,290,310,295,305,295,290,260,180,80,60,55];
export const VISITOR_TREND_12M = [50,60,55,68,75,82,88,92,99,105,118,130];
export const CONVERSION_FUNNEL = [
  { stage: 'Visits', pct: 100 },
  { stage: 'Property Views', pct: 65 },
  { stage: 'Leads', pct: 10 },
  { stage: 'Completed', pct: 5 },
];
export const TOP_PAGES = [
  { page: '/property/:id',      views: 9894, unique: 5463, avgTime: '2m 11s', bounce: '32%' },
  { page: '/search',            views: 7220, unique: 4880, avgTime: '1m 48s', bounce: '38%' },
  { page: '/',                  views: 6450, unique: 4400, avgTime: '0m 52s', bounce: '52%' },
  { page: '/developer/:slug',   views: 4120, unique: 2960, avgTime: '1m 24s', bounce: '41%' },
  { page: '/compound/:slug',    views: 3680, unique: 2520, avgTime: '1m 32s', bounce: '40%' },
];
export const REFERRAL_SOURCES = [
  { source: 'instagram.com',  sessions: 1101, leads: 47, convRate: '2.3%' },
  { source: 'facebook.com',   sessions: 980,  leads: 38, convRate: '2.1%' },
  { source: 'google.com',     sessions: 720,  leads: 28, convRate: '1.9%' },
  { source: 'linkedin.com',   sessions: 380,  leads: 18, convRate: '1.6%' },
  { source: 'tiktok.com',     sessions: 290,  leads: 11, convRate: '1.4%' },
];
export const GEO_TRAFFIC = [
  { country: 'Egypt',   sessions: 55686, pct: 82 },
  { country: 'Saudi Arabia', sessions: 4820, pct: 7 },
  { country: 'United Arab Emirates', sessions: 3210, pct: 5 },
  { country: 'United Kingdom', sessions: 1840, pct: 3 },
  { country: 'United States',  sessions: 1280, pct: 2 },
];

// B2C Users (consumer registrations)
const FIRST_NAMES = ['Ahmed','Mona','Omar','Yasmine','Karim','Sara','Mohamed','Nour','Tarek','Dina','Hassan','Layla','Youssef','Rania','Tamer','Marwa'];
const LAST_NAMES  = ['Helmy','Gamal','Khalifa','Adel','Fouad','Ali','Hassan','Ibrahim','Mansour','Sabry','Nabil','Said','Tarek','Youssef','Mostafa','Fawzy'];
export const B2C_USER_LIST = (() => {
  const arr = [];
  for (let i = 0; i < 30; i++) {
    const f = FIRST_NAMES[i % FIRST_NAMES.length];
    const l = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    arr.push({
      id: 'U' + String(1000 + i),
      name: `${f} ${l}`,
      email: `${f.toLowerCase()}.${l.toLowerCase()}@gmail.com`,
      phone: '+20 1076 ' + String(780000 + i).slice(-6),
      registered: `2024-${String((i % 12) + 1).padStart(2,'0')}-${String((i % 28) + 1).padStart(2,'0')}`,
      lastActive: `2025-${String((i % 9) + 1).padStart(2,'0')}-${String((i % 28) + 1).padStart(2,'0')}`,
      visits: 5 + (i * 7) % 60,
      actions: 3 + (i * 5) % 40,
      interest: ['Hot','Warm','Cold'][i % 3],
    });
  }
  return arr;
})();

export const REGISTRATION_TREND = [970, 12, 905, 50, 750, 50, 245, 940, 250, 290, 940, 350];

// Reports catalog
export const MP_REPORTS = [
  { id: 'leads', icon: '🧲', title: 'Leads & Requests', desc: 'All leads by type, office, date range with totals and conversion breakdown' },
  { id: 'users', icon: '👥', title: 'User Activity',    desc: 'Registered users, activity levels, buyer profile summaries' },
  { id: 'inv',   icon: '🏢', title: 'Listings Inventory', desc: 'Full inventory snapshot by sub-type, governorate, price bands' },
  { id: 'traf',  icon: '📈', title: 'Traffic Summary',   desc: 'Visitor trends, top pages, device split, conversion funnel' },
  { id: 'geo',   icon: '📍', title: 'Geographic Distribution', desc: 'Listings and leads by governorate and area/city' },
];

// Roles & Access (Marketplace Dashboard scope)
export const MP_ROLES = [
  { id: 'MR-001', name: 'Marketplace Admin',     scope: 'Full marketplace control',         users: 2, perms: 38, status: 'Active', desc: 'All inventory, leads, analytics, users, roles' },
  { id: 'MR-002', name: 'Marketplace Operator',  scope: 'Inventory + lead intake review',   users: 5, perms: 22, status: 'Active', desc: 'Listing publish/unpublish, lead handoff to CRM' },
  { id: 'MR-003', name: 'Analyst',                scope: 'Read-only analytics + reports',    users: 4, perms: 12, status: 'Active', desc: 'Read-only across all data + report generation' },
  { id: 'MR-004', name: 'Support Agent',         scope: 'B2C user assistance',              users: 3, perms: 8,  status: 'Active', desc: 'View users, contact info, basic interest editing' },
  { id: 'MR-005', name: 'Executive (Read-Only)', scope: 'Leadership KPI access',            users: 2, perms: 9,  status: 'Active', desc: 'Overview + Reports + Geography + Traffic' },
];
