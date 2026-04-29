import { createContext, useContext, useReducer, useState, useCallback, useMemo } from 'react';
import {
  PERSONAS, DEPARTMENTS, STAFF, LEADS, DEALS, TASKS, ONBOARDING, DOCUMENTS,
  JOBS, CANDIDATES, TRAINING, COMMISSION_POLICIES, AUDIT_LOGS, ROLES, PROJECTS,
  EXCEPTIONS, DEALS_REV, COMM_ENGINE, AGENT_DUES, PAYROLL,
  DEVELOPERS, COMPOUNDS, UNIT_TYPES, CITIES, AREAS, BRANCHES, TEAMS,
  EMPLOYMENT_CATEGORIES, PAYOUT_CYCLES, EXPENSE_CATEGORIES, LEAD_SOURCES,
  AGENT_NOTIFICATIONS, AGENT_DOCS, SUPPORT_TICKETS,
  TOURS, CONTRACTS, LISTING_SHARES, BUYER_PREFERENCES, SOURCE_HISTORY, DUPLICATE_CANDIDATES, ASSIGNMENT_LOG, LISTINGS
} from '../data/staticData';

// ───────────────── STATE ─────────────────
const initialState = {
  leads: LEADS,
  deals: DEALS,
  tasks: TASKS,
  onboarding: ONBOARDING,
  documents: DOCUMENTS,
  staff: STAFF,
  candidates: CANDIDATES,
  jobs: JOBS,
  training: TRAINING,
  commissionPolicies: COMMISSION_POLICIES,
  audit: AUDIT_LOGS,
  roles: ROLES,
  departments: DEPARTMENTS,
  projects: PROJECTS,
  exceptions: EXCEPTIONS,
  dealsRev: DEALS_REV,
  commEngine: COMM_ENGINE,
  agentDues: AGENT_DUES,
  payroll: PAYROLL,
  developers: DEVELOPERS,
  compounds: COMPOUNDS,
  unitTypes: UNIT_TYPES,
  cities: CITIES,
  areas: AREAS,
  branches: BRANCHES,
  teams: TEAMS,
  employmentCategories: EMPLOYMENT_CATEGORIES,
  payoutCycles: PAYOUT_CYCLES,
  expenseCategories: EXPENSE_CATEGORIES,
  leadSources: LEAD_SOURCES,
  agentNotifications: AGENT_NOTIFICATIONS,
  agentDocs: AGENT_DOCS,
  supportTickets: SUPPORT_TICKETS,
  tours: TOURS,
  contracts: CONTRACTS,
  listingShares: LISTING_SHARES,
  buyerPreferences: BUYER_PREFERENCES,
  sourceHistory: SOURCE_HISTORY,
  duplicateCandidates: DUPLICATE_CANDIDATES,
  assignmentLog: ASSIGNMENT_LOG,
  activities: [],
  listings: LISTINGS,
  settings: {
    company: 'Homes Brokerage', timezone: 'Africa/Cairo (UTC+2)', language: 'English', currency: 'EGP',
    sso: 'Microsoft Entra ID', ssoMode: 'Enforced', sessionTimeout: '8 hours', mfa: 'Required for admin',
    notifLead: 'Instant', notifTask: '1 hour before', notifTraining: 'Daily digest', notifCommission: 'On change',
    integMatrix: 'Connected', integViva: 'Connected', integWhatsapp: 'Configured', integSmtp: 'Active',
    auditRetention: '7 years', backup: 'Daily automated', gdpr: 'Enabled', exportRule: 'Role-based',
    primaryColor: '#E8672A', tagline: 'Swipe to Your Next Home', favicon: 'Configured',
  },
};

// ───────────────── HELPERS ─────────────────
export const nextId = (list, prefix) => {
  const max = (list || []).reduce((m, r) => {
    const n = parseInt(String(r.id || '').replace(/\D/g, ''), 10);
    return isNaN(n) ? m : Math.max(m, n);
  }, 0);
  return `${prefix}-${String(max + 1).padStart(3, '0')}`;
};

const ts = () => {
  const d = new Date();
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
};

// ───────────────── REDUCER ─────────────────
function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case 'ADD':
      return { ...state, [payload.slice]: [payload.item, ...(state[payload.slice] || [])] };
    case 'UPDATE':
      return {
        ...state,
        [payload.slice]: (state[payload.slice] || []).map(r =>
          r.id === payload.id ? { ...r, ...payload.patch } : r),
      };
    case 'REMOVE':
      return {
        ...state,
        [payload.slice]: (state[payload.slice] || []).filter(r => r.id !== payload.id),
      };
    case 'BULK_UPDATE':
      return {
        ...state,
        [payload.slice]: (state[payload.slice] || []).map(r =>
          payload.ids.includes(r.id) ? { ...r, ...payload.patch } : r),
      };
    case 'AUDIT_LOG':
      return { ...state, audit: [payload.entry, ...state.audit] };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...payload } };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

// ───────────────── CONTEXT ─────────────────
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ── Auth + persona (single login at the Employee Board) ──
  const [authenticated, setAuthenticated] = useState(false);
  const [personaKey, setPersonaKey] = useState('agent');
  const persona = PERSONAS[personaKey] || PERSONAS.agent;

  const signIn = useCallback((personaKeyToUse) => {
    setPersonaKey(personaKeyToUse);
    setAuthenticated(true);
    window.location.hash = '#/board/dashboard';
  }, []);
  const signOut = useCallback(() => {
    setAuthenticated(false);
    window.location.hash = '#/login';
  }, []);

  // global data
  const [state, dispatch] = useReducer(reducer, initialState);

  // ── audit helper ──
  const writeAudit = useCallback((action, target, module, detail) => {
    const entry = {
      id: nextId(state.audit, 'AUD'),
      action, actor: persona.label, target, module, detail,
      timestamp: ts(),
    };
    dispatch({ type: 'AUDIT_LOG', payload: { entry } });
  }, [persona.label, state.audit]);

  // ── CRUD helpers ──
  const addItem = useCallback((slice, item, prefix, audit) => {
    const id = item.id || nextId(state[slice] || [], prefix);
    const full = { ...item, id };
    dispatch({ type: 'ADD', payload: { slice, item: full } });
    if (audit) writeAudit(audit.action, audit.target || id, audit.module, audit.detail || `Created ${id}`);
    return full;
  }, [state, writeAudit]);

  const updateItem = useCallback((slice, id, patch, audit) => {
    dispatch({ type: 'UPDATE', payload: { slice, id, patch } });
    if (audit) writeAudit(audit.action, audit.target || id, audit.module, audit.detail || '');
  }, [writeAudit]);

  const removeItem = useCallback((slice, id, audit) => {
    dispatch({ type: 'REMOVE', payload: { slice, id } });
    if (audit) writeAudit(audit.action, audit.target || id, audit.module, audit.detail || `Removed ${id}`);
  }, [writeAudit]);

  const updateSettings = useCallback((patch) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: patch });
    writeAudit('Settings Updated', 'Platform Settings', 'System', Object.keys(patch).join(', '));
  }, [writeAudit]);

  // ───────────────── MODAL / DRAWER / TOAST / SSO ─────────────────
  const [modal, setModal] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [ssoSplash, setSsoSplash] = useState(null);

  const openModal = useCallback((cfg) => setModal(cfg), []);
  const closeModal = useCallback(() => setModal(null), []);
  const openDrawer = useCallback((cfg) => setDrawer(cfg), []);
  const closeDrawer = useCallback(() => setDrawer(null), []);
  const openConfirm = useCallback((cfg) => setConfirm(cfg), []);
  const closeConfirm = useCallback(() => setConfirm(null), []);

  const toast = useCallback((message, kind = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(t => [...t, { id, message, kind }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const triggerSsoLaunch = useCallback((system, target) => {
    writeAudit('SSO Launch', `${system} (federated)`, 'Security', 'Token issued via Employee Board');
    if (target) {
      setSsoSplash({ system, target });
      setTimeout(() => {
        setSsoSplash(null);
        window.location.hash = target;
      }, 2500);
    } else {
      toast(`${system} — external system (no embedded UI)`, 'info');
    }
  }, [writeAudit, toast]);

  const value = useMemo(() => ({
    authenticated, signIn, signOut,
    personaKey, setPersonaKey, persona, PERSONAS,
    state, dispatch, addItem, updateItem, removeItem, writeAudit, updateSettings,
    openModal, closeModal, modal,
    openDrawer, closeDrawer, drawer,
    openConfirm, closeConfirm, confirm,
    toast, toasts,
    ssoSplash, triggerSsoLaunch,
  }), [authenticated, signIn, signOut, personaKey, persona, state, modal, drawer, confirm, toasts, ssoSplash, addItem, updateItem, removeItem, writeAudit, updateSettings, openModal, closeModal, openDrawer, closeDrawer, openConfirm, closeConfirm, toast, triggerSsoLaunch]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
