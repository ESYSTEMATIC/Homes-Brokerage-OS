// Marketplace CTA helpers (WhatsApp + phone) — matches EREP's wa.me pattern
// and adds listing-context attribution per audit gap #9.

import { trackCta } from './marketplaceStore';

export const HOMES_PHONE = '+201225444440';
const HOMES_WA_NUMBER   = '201225444440';

const currentUrl = () => (typeof window !== 'undefined' ? window.location.href : '');

const utm = '?utm_source=marketplace&utm_medium=cta';

export const buildWhatsAppUrl = ({ message, listing }) => {
  const lines = [];
  if (message) lines.push(message);
  if (listing) lines.push(`Listing: ${listing.compound || listing.project} (MLS ${listing.id})`);
  if (typeof window !== 'undefined') lines.push(currentUrl());
  const text = encodeURIComponent(lines.filter(Boolean).join('\n'));
  return `https://wa.me/${HOMES_WA_NUMBER}?text=${text}`;
};

export const phoneLink = HOMES_PHONE.replace(/\s/g, '');

export const onWhatsApp = (ctx = {}) => {
  trackCta({ kind: 'whatsapp', ...ctx, url: currentUrl() });
};

export const onPhoneCall = (ctx = {}) => {
  trackCta({ kind: 'phone', ...ctx, url: currentUrl() });
};

export const buildShareUrl = (path) => {
  const base = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  return `${base}#${path}${utm}`;
};
