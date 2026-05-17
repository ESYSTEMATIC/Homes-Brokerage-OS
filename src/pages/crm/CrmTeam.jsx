// ═══════════════════════════════════════════════════════════════
// CRM → Team — management-only page
// ───────────────────────────────────────────────────────────────
// Surfaces the same TeamPanel used on the Employee Board, but inside
// the CRM where managers actually work. Visible only to:
//   • Sales Director — sees all sales staff under them
//   • Sales Manager  — sees TLs + agents under them
//   • Team Leader    — sees agents in their team
// Everyone else is bounced back to the CRM dashboard.
// ═══════════════════════════════════════════════════════════════
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { TeamPanel, TeamMemberSummary, getReports } from '../../components/RoleDashboard';

const MGMT_ROLES = ['salesDirector', 'salesManager', 'teamLeader'];

export const CrmTeam = () => {
  const { state, personaKey, persona, openDrawer } = useApp();

  if (!MGMT_ROLES.includes(personaKey)) {
    return <Navigate to="/system/crm" replace />;
  }

  // Resolve the signed-in user's name in the staff roster.
  // For salesDirector / salesManager / teamLeader the persona.label is set to
  // a real staff name in the seed (Tarek Amin / Nour El-Din / Omar Sherif).
  const directorName = (state.staff || []).find(s => s.type === 'Sales Director')?.name || 'Tarek Amin';
  const managerName  = persona.label === 'Sales Manager'
    ? ((state.staff || []).find(s => s.type === 'Sales Manager' && s.team === 'Alpha')?.name || 'Nour El-Din')
    : persona.label;
  const tlName       = persona.label;

  const myName =
    personaKey === 'salesDirector' ? directorName
    : personaKey === 'salesManager' ? managerName
    : tlName;

  const myReports = getReports(myName, state.staff || []);
  // Root of the org chart — the signed-in manager's own staff record.
  const rootMember = (state.staff || []).find(s => s.name === myName);

  const subtitleByRole = {
    salesDirector: `Org chart of all sales staff under you · click any node for their full picture`,
    salesManager:  `Org chart for ${myName} · Team Leaders + Sales Agents`,
    teamLeader:    `Your team · ${myReports.length} agent${myReports.length === 1 ? '' : 's'} reporting to you`,
  };
  const titleByRole = {
    salesDirector: 'My Organization',
    salesManager:  'My Team',
    teamLeader:    'My Team',
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{titleByRole[personaKey]}</h1>
        <p className="page-subtitle">{subtitleByRole[personaKey]}</p>
      </div>

      <TeamPanel
        title={titleByRole[personaKey]}
        subtitle="Live org chart · KPIs derived from current CRM data"
        root={rootMember}
        members={myReports}
        leads={state.leads || []}
        deals={state.deals || []}
        tasks={state.tasks || []}
        targets={state.targets || {}}
        onMemberClick={(m) => openDrawer({
          title: m.name, subtitle: `${m.id} · ${m.title} · ${m.branch}`,
          content: <TeamMemberSummary member={m} leads={state.leads || []} deals={state.deals || []} tasks={state.tasks || []}/>,
        })}
      />
    </div>
  );
};
