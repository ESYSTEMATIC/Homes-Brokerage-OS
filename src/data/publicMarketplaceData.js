// Public marketplace (homes.com.eg-style consumer site) data seed.

export const PM_AREAS = [
  'New Cairo', 'New Capital City', 'Ras El Hekma', '6th of October City',
  'October Gardens', 'Mostakbal City', 'El Sheikh Zayed', 'Ain Sokhna',
  'New Zayed', 'Northern Expansion',
];

// Property listings — each card carries a real Unsplash photo URL so the
// gallery looks like the EREP reference instead of solid gradients.
const UNSPLASH = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

export const PM_LISTINGS = [
  { id: 'E2000217', price: '5.2M',  beds: 4, baths: 2, sqft: 1473, compound: 'Azure, Fifth Settlement',     developer: 'Sodic',                  city: 'New Cairo',         img: UNSPLASH('1568605114967-8130f3a36994'),         lat: 30.0244, lng: 31.4956 },
  { id: 'E2000218', price: '7.8M',  beds: 3, baths: 3, sqft: 1820, compound: 'Mountain View, New Cairo',    developer: 'Mountain View',          city: 'New Cairo',         img: UNSPLASH('1564013799919-ab600027ffc6'),         lat: 30.0211, lng: 31.4869 },
  { id: 'E2000219', price: '4.4M',  beds: 2, baths: 2, sqft: 1180, compound: 'ZED East, New Cairo',         developer: 'Ora Developers',         city: 'New Cairo',         img: UNSPLASH('1600585154340-be6161a56a0c'),         lat: 30.0331, lng: 31.4710 },
  { id: 'E2000220', price: '12.5M', beds: 5, baths: 4, sqft: 2850, compound: 'Hacienda Bay, North Coast',   developer: 'Palm Hills',             city: 'North Coast',       img: UNSPLASH('1613490493576-7fde63acd811'),         lat: 31.0780, lng: 28.4570 },
  { id: 'E2000221', price: '6.1M',  beds: 3, baths: 2, sqft: 1640, compound: 'Sodic East, New Cairo',       developer: 'Sodic',                  city: 'New Cairo',         img: UNSPLASH('1600596542815-ffad4c1539a9'),         lat: 30.0510, lng: 31.4912 },
  { id: 'E2000222', price: '8.9M',  beds: 4, baths: 3, sqft: 2050, compound: 'Hyde Park, New Cairo',        developer: 'Hyde Park',              city: 'New Cairo',         img: UNSPLASH('1600607687939-ce8a6c25118c'),         lat: 30.0214, lng: 31.4665 },
  { id: 'E2000223', price: '3.6M',  beds: 2, baths: 1, sqft: 980,  compound: 'Madinaty, New Cairo',         developer: 'Talaat Moustafa Group',  city: 'New Cairo',         img: UNSPLASH('1599809275671-b5942cabc7a2'),         lat: 30.1045, lng: 31.6420 },
  { id: 'E2000224', price: '10.4M', beds: 4, baths: 3, sqft: 2240, compound: 'Marassi, North Coast',        developer: 'Palm Hills',             city: 'North Coast',       img: UNSPLASH('1572120360610-d971b9d7767c'),         lat: 30.9810, lng: 28.7920 },
  { id: 'E2000225', price: '5.7M',  beds: 3, baths: 2, sqft: 1380, compound: 'Il Bosco, New Capital',       developer: 'Better Home',            city: 'New Capital City',  img: UNSPLASH('1605276374104-dee2a0ed3cd6'),         lat: 30.0190, lng: 31.7430 },
  { id: 'E2000226', price: '9.2M',  beds: 4, baths: 3, sqft: 2100, compound: 'Palm Hills Katameya',         developer: 'Palm Hills',             city: 'New Cairo',         img: UNSPLASH('1600566753190-17f0baa2a6c3'),         lat: 30.0080, lng: 31.4730 },
  { id: 'E2000227', price: '4.8M',  beds: 3, baths: 2, sqft: 1290, compound: 'The Waterway, New Cairo',     developer: 'Sodic',                  city: 'New Cairo',         img: UNSPLASH('1600585154526-990dced4db0d'),         lat: 30.0250, lng: 31.5060 },
  { id: 'E2000228', price: '6.9M',  beds: 4, baths: 3, sqft: 1680, compound: 'Lake View, New Cairo',        developer: 'Mountain View',          city: 'New Cairo',         img: UNSPLASH('1600573472550-8090b5e0745e'),         lat: 30.0490, lng: 31.4710 },
  { id: 'E2000229', price: '15.8M', beds: 5, baths: 4, sqft: 3200, compound: 'Cairo Festival City Residences', developer: 'Al-Futtaim',          city: 'New Cairo',         img: UNSPLASH('1600585154526-990dced4db0d'),         lat: 30.0260, lng: 31.4080 },
  { id: 'E2000230', price: '7.2M',  beds: 3, baths: 2, sqft: 1700, compound: 'Stone Park, New Cairo',       developer: 'Roya Developments',      city: 'New Cairo',         img: UNSPLASH('1600573472556-04d96f33d3df'),         lat: 30.0140, lng: 31.4810 },
  { id: 'E2000231', price: '4.1M',  beds: 2, baths: 2, sqft: 1080, compound: 'Tag Sultan, New Cairo',       developer: 'Madaar',                 city: 'New Cairo',         img: UNSPLASH('1605114946229-65d533fb14ef'),         lat: 30.0420, lng: 31.4890 },
  { id: 'E2000232', price: '11.2M', beds: 4, baths: 4, sqft: 2400, compound: 'O West, 6th of October',      developer: 'Orascom Development',    city: '6th of October City', img: UNSPLASH('1572120360610-d971b9d7767c'),         lat: 29.9714, lng: 30.9314 },
  { id: 'E2000233', price: '5.0M',  beds: 3, baths: 2, sqft: 1320, compound: 'Sky Condos, Sheikh Zayed',    developer: 'Sodic',                  city: 'El Sheikh Zayed',   img: UNSPLASH('1600585154340-be6161a56a0c'),         lat: 30.0700, lng: 30.9710 },
  { id: 'E2000234', price: '8.4M',  beds: 4, baths: 3, sqft: 1980, compound: 'Vinci, New Capital',          developer: 'Misr Italia',            city: 'New Capital City',  img: UNSPLASH('1600596542815-ffad4c1539a9'),         lat: 30.0080, lng: 31.7560 },
  { id: 'E2000235', price: '3.9M',  beds: 2, baths: 2, sqft: 1100, compound: 'Mivida, New Cairo',           developer: 'Emaar Misr',             city: 'New Cairo',         img: UNSPLASH('1568605114967-8130f3a36994'),         lat: 30.0210, lng: 31.4710 },
  { id: 'E2000236', price: '9.8M',  beds: 4, baths: 3, sqft: 2150, compound: 'Almaza Bay, North Coast',     developer: 'Travco Properties',      city: 'North Coast',       img: UNSPLASH('1613490493576-7fde63acd811'),         lat: 31.2920, lng: 28.0950 },
  { id: 'E2000237', price: '6.4M',  beds: 3, baths: 3, sqft: 1530, compound: 'Eastown Residences',          developer: 'Sodic',                  city: 'New Cairo',         img: UNSPLASH('1564013799919-ab600027ffc6'),         lat: 30.0188, lng: 31.4977 },
  { id: 'E2000238', price: '13.5M', beds: 5, baths: 4, sqft: 2680, compound: 'Telal Sokhna',                developer: 'Roya Developments',      city: 'Ain Sokhna',        img: UNSPLASH('1600607687939-ce8a6c25118c'),         lat: 29.5980, lng: 32.3080 },
  { id: 'E2000239', price: '4.7M',  beds: 2, baths: 2, sqft: 1190, compound: 'Galleria Moon Valley',        developer: 'SODIC',                  city: 'New Cairo',         img: UNSPLASH('1599809275671-b5942cabc7a2'),         lat: 30.0290, lng: 31.4520 },
];

// Featured (carousel) — top 6 listings flagged as featured for the homepage.
export const PM_FEATURED = PM_LISTINGS.slice(0, 6);

// Filter dropdowns wired to working pop-overs on Home + Buy.
export const PM_PROPERTY_TYPES   = ['All', 'Residential', 'Commercial', 'Administrative', 'Land'];
export const PM_PROPERTY_SUBS    = ['Apartment', 'Villa', 'Townhouse', 'Twin House', 'Penthouse', 'Duplex', 'Studio', 'Chalet'];
export const PM_PRICE_BANDS      = ['Any', 'Under 3M EGP', '3M – 6M EGP', '6M – 10M EGP', '10M – 20M EGP', '20M+ EGP'];
export const PM_BEDS_OPTIONS     = ['1+', '2+', '3+', '4+', '5+', '6+'];
export const PM_BATHS_OPTIONS    = ['1+', '2+', '3+', '4+'];

// Popular Reads — inspired by https://blog.homes.com.eg (Elementor blog).
export const PM_POPULAR_READS = [
  {
    id: 1,
    title: 'Palm Hills New Cairo: A Modern Residential Destination Redefining Luxury Living',
    excerpt: 'Inside one of New Cairo\'s most sought-after developments — amenities, master plan, and what life looks like once you move in.',
    category: 'Compounds',
    date: 'Apr 22, 2026',
    author: 'Homes Editorial',
    img: UNSPLASH('1600585154340-be6161a56a0c', 600),
  },
  {
    id: 2,
    title: 'Hyde Park New Cairo: The Most Prestigious Communities in New Cairo',
    excerpt: 'Why Hyde Park keeps topping resale charts — connectivity, the Central Park, and the next phases worth watching.',
    category: 'Compounds',
    date: 'Apr 18, 2026',
    author: 'Homes Editorial',
    img: UNSPLASH('1600566753190-17f0baa2a6c3', 600),
  },
  {
    id: 3,
    title: 'Mountain View iCity New Cairo: A Smart Living Destination',
    excerpt: 'Smart-home tech, green corridors, and the financial logic behind iCity\'s pricing curve.',
    category: 'Smart Homes',
    date: 'Apr 14, 2026',
    author: 'Homes Editorial',
    img: UNSPLASH('1564013799919-ab600027ffc6', 600),
  },
  {
    id: 4,
    title: 'Al Alamein, the North Coast\'s New Capital — A Travel & Lifestyle Guide',
    excerpt: 'Year-round living on the Med — top compounds, new infrastructure, and rental yield outlook for 2026.',
    category: 'Lifestyle',
    date: 'Apr 09, 2026',
    author: 'Homes Editorial',
    img: UNSPLASH('1572120360610-d971b9d7767c', 600),
  },
];

export const PM_BLOG_CATEGORIES = ['All', 'Blog', 'News', 'Compounds', 'Lifestyle', 'Smart Homes', 'Mortgage Tips'];

export const PM_FAQ_SELL = [
  { q: 'What documents do I need to sell my property?', a: 'Title deed, national ID copy, recent utility bills, and any payment-plan documents from the developer (if applicable).' },
  { q: 'How long does it take to sell a property in Egypt?', a: 'On average 2–4 months from listing to closing, depending on price band, location, and how the unit is presented.' },
  { q: 'What are the costs of selling?', a: 'Brokerage fee (typically 2.5%–3% of sale price), official transfer fees at the Real Estate Registry, and minor administrative costs.' },
  { q: 'How is my property valued?', a: 'A licensed agent compares your unit to recent transactions in the same compound or area, factoring in floor, view, finishing, and delivery state.' },
  { q: 'Can foreigners sell property in Egypt?', a: 'Yes, foreign owners can sell directly. The transfer process requires a passport copy, the original purchase contract, and may require notarization at the Real Estate Registry.' },
  { q: 'What happens after I submit the form?', a: 'A specialist will reach out within 24 hours with a free valuation and tour scheduling.' },
];

export const PM_FAQ_MORTGAGE = [
  { q: 'What is a mortgage?', a: 'A mortgage is a long-term loan from a bank to finance a home purchase, repaid in monthly installments over 5–25 years.' },
  { q: 'How does a mortgage work in Egypt?', a: 'Egyptian banks typically finance up to 80% of property value with terms up to 25 years, secured against the property itself.' },
  { q: 'What is a down payment?', a: 'The down payment is the upfront cash you pay; banks usually require 15%–20% of the property value before approving the loan.' },
  { q: 'What happens after I submit my details?', a: 'Our team contacts you within 24 hours to confirm details and connect you to partner banks for pre-approval.' },
  { q: 'Can foreigners get a mortgage in Egypt?', a: 'Yes, several banks offer mortgages to foreign nationals with proof of income, residency status, and a larger down payment.' },
  { q: 'Is there any cost to get in touch?', a: 'No — initial consultation, repayment calculations, and bank pre-approval connections are completely free.' },
];

export const PM_HOW_IT_WORKS = [
  { n: 1, title: 'Submit Your Details', desc: 'Fill out the form with your property information.' },
  { n: 2, title: 'Free Valuation', desc: 'Our team contacts you for a property assessment.' },
  { n: 3, title: 'List Your Property', desc: 'We create a professional listing with photos and details.' },
  { n: 4, title: 'Close the Deal', desc: 'We connect you with qualified buyers and handle negotiations.' },
];

export const PM_MORTGAGE_FEATURES = [
  { icon: '🧮', title: 'Understand Your Budget', desc: 'Know what you can comfortably afford.' },
  { icon: '📅', title: 'See Monthly Payments', desc: 'Calculate your exact monthly repayments.' },
  { icon: '✅', title: 'Check Borrowing Power', desc: 'Find out how much banks will lend you.' },
  { icon: '🔍', title: 'Find Matching Properties', desc: 'Match listings to your borrowing power.' },
];

// Service cards on the homepage (per EREP reference).
export const PM_SERVICES = [
  {
    title: 'Find a Home',
    desc:  'Browse thousands of verified properties across Egypt — buy, rent, or invest with confidence.',
    icon:  'home',
    cta:   'Start Searching',
    to:    '/marketplace/buy',
  },
  {
    title: 'List Your Property',
    desc:  'Sell or rent through Homes — professional photography, vetted leads, and a 24-hour valuation promise.',
    icon:  'tag',
    cta:   'Get Started',
    to:    '/marketplace/sell',
  },
  {
    title: 'Calculate Mortgage',
    desc:  'Estimate monthly repayments, check affordability, and connect to partner banks across Egypt.',
    icon:  'calc',
    cta:   'Calculate Now',
    to:    '/marketplace/mortgage',
  },
];

export const PM_FOOTER = {
  quickLinks: [
    ['Buy Property', '/marketplace/buy'],
    ['Sell Property', '/marketplace/sell'],
    ['Mortgage Calculator', '/marketplace/mortgage'],
    ['Find Developers', '/marketplace/developers'],
    ['Terms & Conditions', '#'],
    ['Privacy Policy', '#'],
  ],
  toolsAccount: [
    ['Favorites', '#'],
    ['Compare Properties', '#'],
    ['News', '#'],
    ['Blog', '#'],
    ['FAQ', '#'],
  ],
};
