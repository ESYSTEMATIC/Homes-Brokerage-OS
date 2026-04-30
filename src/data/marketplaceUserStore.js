// ═══════════════════════════════════════════════════════════════
// Marketplace Consumer Auth — localStorage-backed (demo only)
// ═══════════════════════════════════════════════════════════════
//
// This is the public marketplace's own auth surface — the buyer/visitor
// account that signs in to /marketplace/*. It is intentionally separate
// from the employee SSO that signs in to /login (Microsoft Entra) and
// /board/* (Employee Board).
//
// In production this would be email + OTP or social login backed by a
// real identity provider. For the demo we persist to localStorage so the
// flow is end-to-end clickable.
//
// Public API:
//   useMarketplaceUser()    → React hook returning { user | null, allUsers }
//   register({ name, email, phone, password })
//   login(email, password)  → { ok, error?, user? }
//   logout()
//   updateProfile(patch)
//   isSignedIn()

import { useSyncExternalStore } from 'react';

const USERS_KEY = 'homes.marketplace.users.v1';
const SESSION_KEY = 'homes.marketplace.session.v1';

const empty = () => ({ users: [], session: null });

const read = () => {
  if (typeof window === 'undefined') return empty();
  try {
    return {
      users: JSON.parse(window.localStorage.getItem(USERS_KEY) || '[]'),
      session: JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null'),
    };
  } catch { return empty(); }
};

let state = read();
const listeners = new Set();
const notify = () => listeners.forEach(l => l());
const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const getSnapshot = () => state;

const persist = () => {
  try {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(state.users));
    if (state.session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(state.session));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch { /* ignore */ }
  notify();
};

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === USERS_KEY || e.key === SESSION_KEY) { state = read(); notify(); }
  });
}

// ─── Auth API ───────────────────────────────────────────────────
const normaliseEmail = (e) => (e || '').trim().toLowerCase();

export const register = ({ name, email, phone, password }) => {
  const e = normaliseEmail(email);
  if (!e || !password) return { ok: false, error: 'Email and password are required.' };
  if (state.users.some(u => u.email === e)) {
    return { ok: false, error: 'An account with that email already exists. Sign in instead?' };
  }
  const user = {
    id: `U-${Date.now()}`,
    name: (name || '').trim() || e.split('@')[0],
    email: e,
    phone: phone || '',
    createdAt: new Date().toISOString(),
    avatar: null,
  };
  // Note: storing the password in localStorage is **not** secure — this is a
  // demo flow only. A real backend would hash + salt this server-side.
  state = {
    ...state,
    users: [...state.users, { ...user, _password: password }],
    session: { userId: user.id, signedInAt: new Date().toISOString() },
  };
  persist();
  return { ok: true, user };
};

export const login = (email, password) => {
  const e = normaliseEmail(email);
  const found = state.users.find(u => u.email === e);
  if (!found) return { ok: false, error: 'No account found with that email.' };
  if (found._password !== password) return { ok: false, error: 'Wrong password.' };
  state = { ...state, session: { userId: found.id, signedInAt: new Date().toISOString() } };
  persist();
  const { _password, ...user } = found;
  return { ok: true, user };
};

export const logout = () => {
  state = { ...state, session: null };
  persist();
};

export const updateProfile = (patch) => {
  if (!state.session) return null;
  state = {
    ...state,
    users: state.users.map(u => u.id === state.session.userId ? { ...u, ...patch } : u),
  };
  persist();
};

const currentUser = () => {
  if (!state.session) return null;
  const u = state.users.find(x => x.id === state.session.userId);
  if (!u) return null;
  const { _password, ...safe } = u;
  return safe;
};

export const useMarketplaceUser = () => {
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return { user: currentUser(), session: state.session };
};

export const isSignedIn = () => !!state.session;

// ─── Demo seed ──────────────────────────────────────────────────
// Provide one starter account so the demo is clickable without a separate
// signup step. Will only insert on first load (when users array is empty).
if (typeof window !== 'undefined' && state.users.length === 0) {
  state = {
    users: [{
      id: 'U-DEMO',
      name: 'Demo Buyer',
      email: 'buyer@homes.demo',
      phone: '+20 100 000 0000',
      createdAt: new Date().toISOString(),
      avatar: null,
      _password: 'homes2026',
    }],
    session: null,
  };
  persist();
}
