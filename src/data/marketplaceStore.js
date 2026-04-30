// ═══════════════════════════════════════════════════════════════
// Marketplace Store — localStorage-backed pub/sub
// ═══════════════════════════════════════════════════════════════
//
// Why this exists (per scripts/MARKETPLACE-AUDIT.md gap #4):
//   Favorites / compare / saved-searches / leads were living in component
//   state, so they vanished on navigation and the header counters never
//   updated. This module persists them to localStorage and exposes a tiny
//   subscribe API so any component can stay in sync.
//
// Public API:
//   useMarketplaceStore()                     // React hook returning live snapshot
//   getSnapshot()                             // imperative read
//   toggleFavorite(id)
//   toggleCompare(id)                         // capped at 3 (matches EREP behavior)
//   addSavedSearch({ label, params })
//   removeSavedSearch(id)
//   addLead({ kind, payload })                // kind: 'sell' | 'mortgage' | 'tour' | 'inquiry'
//   getLeads()
//
// Compare is local-only (matches EREP), no auth required.
// Favorites/saved-searches/leads stay local in this demo, but the schema
// is shaped so the same payloads can later POST to a real API.

import { useEffect, useSyncExternalStore } from 'react';

const KEY = 'homes.marketplace.v1';

const empty = () => ({
  favorites:   [],   // listing ids
  compare:     [],   // listing ids (max 3)
  savedSearches: [], // [{ id, label, params, savedAt }]
  leads:       [],   // [{ id, kind, payload, submittedAt }]
});

const read = () => {
  if (typeof window === 'undefined') return empty();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty();
    return { ...empty(), ...JSON.parse(raw) };
  } catch { return empty(); }
};

let state = read();
const listeners = new Set();

const persist = () => {
  try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore quota */ }
  listeners.forEach(l => l());
};

const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const getSnapshot = () => state;

// Cross-tab sync — when storage changes in another tab, refresh and notify.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === KEY) { state = read(); listeners.forEach(l => l()); }
  });
}

// ─── Favorites ──────────────────────────────────────────────────
export const toggleFavorite = (id) => {
  const has = state.favorites.includes(id);
  state = { ...state, favorites: has ? state.favorites.filter(x => x !== id) : [...state.favorites, id] };
  persist();
  return !has;
};

// ─── Compare (max 3) ────────────────────────────────────────────
export const COMPARE_MAX = 3;
export const toggleCompare = (id) => {
  const has = state.compare.includes(id);
  if (!has && state.compare.length >= COMPARE_MAX) {
    return { added: false, reason: `Compare is full (max ${COMPARE_MAX}). Remove one first.` };
  }
  state = { ...state, compare: has ? state.compare.filter(x => x !== id) : [...state.compare, id] };
  persist();
  return { added: !has, reason: null };
};
export const clearCompare = () => { state = { ...state, compare: [] }; persist(); };

// ─── Saved searches ─────────────────────────────────────────────
export const addSavedSearch = ({ label, params }) => {
  const id = `SS-${Date.now()}`;
  state = {
    ...state,
    savedSearches: [
      { id, label: label || 'Untitled search', params, savedAt: new Date().toISOString() },
      ...state.savedSearches,
    ],
  };
  persist();
  return id;
};
export const removeSavedSearch = (id) => {
  state = { ...state, savedSearches: state.savedSearches.filter(s => s.id !== id) };
  persist();
};

// ─── Leads (sell / mortgage / tour / inquiry) ───────────────────
export const addLead = ({ kind, payload }) => {
  const id = `LEAD-${Date.now()}`;
  state = {
    ...state,
    leads: [
      { id, kind, payload, submittedAt: new Date().toISOString(), status: 'New' },
      ...state.leads,
    ],
  };
  persist();
  return id;
};
export const getLeads = () => state.leads;

// ─── React hook (live snapshot) ─────────────────────────────────
export const useMarketplaceStore = () => useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

// Lightweight selector hook — re-renders only when the chosen slice changes.
export const useMarketplaceSlice = (selector) => {
  const snap = useMarketplaceStore();
  return selector(snap);
};

// Helpful UI signals.
export const isFavorite = (snap, id) => snap.favorites.includes(id);
export const isCompared = (snap, id) => snap.compare.includes(id);

// One-off helper for analytics-friendly CTA tracking (writes to a small
// in-memory buffer + persists last 50 events, used by the audit drawer).
const CTA_KEY = 'homes.marketplace.cta.v1';
export const trackCta = (event) => {
  if (typeof window === 'undefined') return;
  try {
    const prev = JSON.parse(window.localStorage.getItem(CTA_KEY) || '[]');
    const next = [{ ...event, ts: new Date().toISOString() }, ...prev].slice(0, 50);
    window.localStorage.setItem(CTA_KEY, JSON.stringify(next));
  } catch { /* ignore */ }
};
export const getCtaLog = () => {
  if (typeof window === 'undefined') return [];
  try { return JSON.parse(window.localStorage.getItem(CTA_KEY) || '[]'); }
  catch { return []; }
};
