// ═══════════════════════════════════════════════════════════════
// CRM Role-Based Access — BRD V1.4 §6 / §11 entitlements
// ═══════════════════════════════════════════════════════════════
//
// Hierarchy (top → bottom):
//   Sales Director → Sales Manager → Team Leader → Sales Agent
//
// Lead visibility:
//   Sales Agent      → only leads they own (or self-created)
//   Team Leader      → all leads in their team
//   Sales Manager    → all leads across the teams they manage (Alpha + Beta in demo)
//   Sales Director   → full hierarchy (every team)
//   Backoffice Admin → audit-only (read everything but cannot mutate)
//   HR / Finance / Marketplace Admin → no access
//
// Assignability:
//   Sales Agent      → cannot reassign anyone
//   Team Leader      → can assign within their own team
//   Sales Manager    → can reassign across teams they manage
//   Sales Director   → can reassign across all teams
//
// Manual-lead 6-month protection (BRD §6.1.4):
//   A lead created manually by an agent is locked to that agent for 6 months.
//   Only Sales Director or Backoffice Admin can override via audit-logged action.
//
// SLA aging (BRD §6.1.5):
//   New ≤ 24h, Contacted ≤ 72h, Qualified ≤ 7d before escalation to Team Leader.

export const HIERARCHY = {
  // demo persona → role title, team scope, can-see-team(s)
  agent:           { role: 'Sales Agent',     scope: 'self',  team: 'Alpha', leader: 'Omar Sherif',     manager: 'Sales Manager' },
  agentActive:     { role: 'Sales Agent',     scope: 'self',  team: 'Alpha', leader: 'Omar Sherif',     manager: 'Sales Manager' },
  teamLeader:      { role: 'Team Leader',     scope: 'team',  team: 'Alpha', leader: null,              manager: 'Sales Manager' },
  salesManager:    { role: 'Sales Manager',   scope: 'cross', teams: ['Alpha', 'Beta'],                  manager: null },
  salesDirector:   { role: 'Sales Director',  scope: 'all' },
  backofficeAdmin: { role: 'Backoffice Admin',scope: 'audit' },
  systemAdmin:     { role: 'System Admin',    scope: 'audit' },
  executive:       { role: 'Executive / CEO', scope: 'audit' },
  hrRecruiter:     { role: 'HR Recruiter',    scope: 'none' },
  financeOfficer:  { role: 'Finance Officer', scope: 'audit' },
  marketplaceAdmin:{ role: 'Marketplace Admin', scope: 'none' },
  // Marketing — CRM-only persona scoped to the Campaigns module.
  // Cannot see leads, deals, contracts, tours, listings — only social campaigns.
  marketing:       { role: 'Marketing',         scope: 'campaigns' },
};

// Map persona → identifier used in `lead.owner` / `deal.owner`
const PERSONA_OWNER = {
  agent:        'Sarah El-Masry',
  agentActive:  'Fatma Ibrahim',
  teamLeader:   'Omar Sherif',
  salesManager: 'Sales Manager',
};

export const personaOwnerName = (personaKey) => PERSONA_OWNER[personaKey] || null;

export const crmHasAccess = (personaKey) => {
  const h = HIERARCHY[personaKey];
  return !!h && h.scope !== 'none';
};

export const isReadOnly = (personaKey) => {
  const h = HIERARCHY[personaKey];
  return !!h && h.scope === 'audit';
};

// Returns true if the user can SEE a lead (or deal — same shape: { owner, team }).
export const canSeeLead = (personaKey, lead) => {
  const h = HIERARCHY[personaKey];
  if (!h || h.scope === 'none' || h.scope === 'campaigns') return false;
  if (h.scope === 'all' || h.scope === 'audit') return true;
  if (h.scope === 'self') return lead.owner === personaOwnerName(personaKey);
  if (h.scope === 'team') return lead.team === h.team;
  if (h.scope === 'cross') return (h.teams || []).includes(lead.team);
  return false;
};

// Returns true if the user can SEE the Campaigns module.
// Only the marketing persona reaches this surface in V1.5 (BRD §8.23).
export const canSeeCampaigns = (personaKey) => {
  const h = HIERARCHY[personaKey];
  return h?.scope === 'campaigns';
};

// Returns true if the user can ASSIGN / REASSIGN a lead's owner.
// Honors the 6-month manual-lead protection (BRD §6.1.4).
export const canAssign = (personaKey, lead) => {
  const h = HIERARCHY[personaKey];
  if (!h || h.scope === 'none' || h.scope === 'audit' || h.scope === 'self') return false;
  // Manual-lead 6-month protection: only Sales Director can override.
  if (lead.protected) return h.scope === 'all';
  if (h.scope === 'all') return true;
  if (h.scope === 'cross') return (h.teams || []).includes(lead.team);
  if (h.scope === 'team')  return lead.team === h.team;
  return false;
};

// Returns the list of staff members the current user can assign TO.
// staff = state.staff (array of { name, department, team, role })
export const assignableStaff = (personaKey, staff = []) => {
  const h = HIERARCHY[personaKey];
  if (!h) return [];
  const sales = staff.filter(s => s.department === 'Sales');
  if (h.scope === 'all' || h.scope === 'audit') return sales;
  if (h.scope === 'cross') return sales.filter(s => (h.teams || []).includes(s.team));
  if (h.scope === 'team')  return sales.filter(s => s.team === h.team);
  return sales.filter(s => s.name === personaOwnerName(personaKey)); // self-only fallback
};

// Lead age in days from `created` ISO string.
export const leadAgeDays = (createdISO) => {
  if (!createdISO) return 0;
  const ms = Date.now() - new Date(createdISO).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
};

// SLA evaluator per stage — returns { level, message } where level is
// 'ok' | 'warn' | 'breach'. Mirrors BRD §6.1.5.
export const slaForStage = (stage, ageDays) => {
  const limits = {
    'New':            1,    // 24h
    'Contacted':      3,    // 72h
    'Qualified':      7,
    'Tour Scheduled': 14,
    'Negotiation':    21,
    'Reservation':    30,
    'Contracting':    45,
  };
  const limit = limits[stage];
  if (limit === undefined) return { level: 'ok', message: '—' };
  if (ageDays <= limit * 0.7) return { level: 'ok',     message: `Within SLA (${limit}d)` };
  if (ageDays <= limit)        return { level: 'warn',   message: `Approaching SLA (${ageDays}/${limit}d)` };
  return { level: 'breach', message: `SLA breach — escalate to TL (${ageDays}/${limit}d)` };
};

// 6-month protection helper — `lead.createdManually` must be true and the lead
// must be < 180 days old. Adds the locked-by string for audit display.
export const isManualLockActive = (lead) => {
  if (!lead?.createdManually) return false;
  return leadAgeDays(lead.created) < 180;
};

// CRM module access matrix — for the "Access" panel in CrmDashboard.
export const MODULE_ACCESS = {
  agent: {
    leads: 'Full (own only)', listings: 'Full', tours: 'Full (own only)',
    deals: 'Full (own only)', contracts: 'Read-only', tasks: 'Full',
    shares: 'Full', minisite: 'Full (own)', reports: 'Personal scope',
  },
  teamLeader: {
    leads: 'Full (team)', listings: 'Full', tours: 'Full (team)',
    deals: 'Full (team)', contracts: 'Read-only', tasks: 'Full',
    shares: 'Full', minisite: 'Full (own)', reports: 'Team scope',
  },
  salesManager: {
    leads: 'Full + reassign', listings: 'Full', tours: 'Full',
    deals: 'Approval', contracts: 'Approval', tasks: 'Full',
    shares: 'Read', minisite: 'Read', reports: 'Multi-team',
  },
  salesDirector: {
    leads: 'Full hierarchy', listings: 'Full', tours: 'Full',
    deals: 'Approval (final)', contracts: 'Approval (final)', tasks: 'Full',
    shares: 'Audit', minisite: 'Audit', reports: 'Full',
  },
  backofficeAdmin: {
    leads: 'Audit-only', listings: 'Audit-only', tours: 'Audit-only',
    deals: 'Audit-only', contracts: 'Audit-only', tasks: 'Audit-only',
    shares: 'Audit-only', minisite: 'Audit-only', reports: 'Compliance',
  },
};
