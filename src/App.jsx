import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { BackofficeLayout } from './components/BackofficeLayout';
import { AgentLayout } from './components/AgentLayout';
import { Modal, Drawer, ConfirmDialog, Toaster } from './components/UI';

// Login (no layout)
import { LoginPage } from './pages/Login';

// Backoffice Pages
import { BackofficeDashboard } from './pages/BackofficeDashboard';
import { AgentsList } from './pages/AgentsList';
import { Onboarding } from './pages/Onboarding';
import { DocumentsReview } from './pages/DocumentsReview';
import { StaffManagement } from './pages/StaffManagement';
import { TrainingCompliance } from './pages/TrainingCompliance';
import { FinancialManagement } from './pages/FinancialManagement';
import { HRPayroll } from './pages/HRPayroll';
import { RecruitmentPipeline } from './pages/RecruitmentPipeline';
import { JobVacancies } from './pages/JobVacancies';
import { VacancyDetail } from './pages/VacancyDetail';
import { AuditLogs } from './pages/AuditLogs';
import { DirectorInbox } from './pages/DirectorInbox';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { RolesPermissions } from './pages/RolesPermissions';
import { Departments } from './pages/Departments';
import { FinanceOverview, DealsRevenue, CommissionEngine } from './pages/FinancePages';
// EmployeeProfiles was merged into Staff Management on 17-May.
// /backoffice/hr/profiles redirects to /backoffice/staff.
// Listings/unit types/cities/areas come from EGMLS — only alternatives for
// developers, compounds and projects are maintained in Master Data.
import { Developers, MasterProjects, Compounds, Branches, Teams, EmploymentCategories, MasterCommPolicies, LeadSources } from './pages/MasterDataPages';
import { Settings } from './pages/SystemPages';

// Federated system intro placeholders launched via SSO from the Employee Board.
import { CRMIntro, MarketplaceDashboard as MarketplaceDashboardIntro } from './pages/ExternalSystem';

// Real CRM Module V2 (embedded, own sidebar/layout via CrmLayout — see main).
import { CrmLayout } from './components/CrmLayout';
import { CrmDashboard } from './pages/crm/CrmDashboard';
import { CrmLeads } from './pages/crm/CrmLeads';
import { CrmLeadDetail } from './pages/crm/CrmLeadDetail';
import { CrmListings } from './pages/crm/CrmListings';
import { CrmDeals } from './pages/crm/CrmDeals';
// Contracts module retired — contract lifecycle tracked through Deals.
import { CrmTasks } from './pages/crm/CrmTasks';
import { CrmListingShare } from './pages/crm/CrmListingShare';
import { CrmMiniSite } from './pages/crm/CrmMiniSite';
import { CrmReports } from './pages/crm/CrmReports';
import { CrmCampaigns } from './pages/crm/CrmCampaigns';
import { CrmColdCalls } from './pages/crm/CrmColdCalls';
import { CrmTeam } from './pages/crm/CrmTeam';

// Marketplace Dashboard — full federated system with its own layout + nested routes.
import { MarketplaceLayout } from './components/MarketplaceLayout';
import {
  Overview as MPOverview, Listings as MPListings, LeadsRequests as MPLeads,
  Brokerages as MPBrokerages, Developers as MPDevelopers, Geography as MPGeography,
  Traffic as MPTraffic, Reports as MPReports, ReportDetail as MPReportDetail,
  Users as MPUsers, RolesAccess as MPRoles,
} from './pages/MarketplaceDashboard/index.jsx';

// Employee Board (universal landing)
import { EmployeeBoardDashboard } from './pages/EmployeeBoardDashboard';
import { AgentLearning } from './pages/AgentLearning';
import { AgentPerformance, AgentProfile, AgentDocuments, AgentNotifications } from './pages/AgentPages';
import { AgentServices } from './pages/AgentServices';

// Public Marketplace (consumer-facing, no auth required)
import { MarketplaceSiteLayout } from './components/MarketplaceSiteLayout';
import {
  Home as PMHome, Buy as PMBuy, Sell as PMSell, Find as PMFind, Mortgage as PMMortgage,
  ListingDetail as PMListingDetail,
  MpLogin, MpSignup, MpProfile, MpForgotPassword, MpVerifyOtp, MpResetPassword,
  Compare as PMCompare, Favorites as PMFavorites,
  Developers as PMDevelopers, DeveloperDetail as PMDeveloperDetail,
  Careers as PMCareers, CareerDetail as PMCareerDetail,
} from './pages/MarketplaceSite/index.jsx';

// Public marketplace routes — accessible without auth (homes.com.eg consumer surface).
const PublicMarketplaceRoutes = () => (
  <MarketplaceSiteLayout>
    <Routes>
      <Route path="/" element={<PMHome />} />
      <Route path="/buy" element={<PMBuy />} />
      <Route path="/listings/:id" element={<PMListingDetail />} />
      <Route path="/sell" element={<PMSell />} />
      <Route path="/find" element={<Navigate to="/marketplace/developers" replace />} />
      <Route path="/developers" element={<PMDevelopers />} />
      <Route path="/developers/:slug" element={<PMDeveloperDetail />} />
      <Route path="/mortgage" element={<PMMortgage />} />
      <Route path="/careers" element={<PMCareers />} />
      <Route path="/careers/:jobId" element={<PMCareerDetail />} />
      <Route path="/compare" element={<PMCompare />} />
      <Route path="/favorites" element={<PMFavorites />} />
      <Route path="/login" element={<MpLogin />} />
      <Route path="/signup" element={<MpSignup />} />
      <Route path="/forgot-password" element={<MpForgotPassword />} />
      <Route path="/verify-otp" element={<MpVerifyOtp />} />
      <Route path="/reset-password" element={<MpResetPassword />} />
      <Route path="/profile" element={<MpProfile />} />
      <Route path="*" element={<Navigate to="/marketplace" replace />} />
    </Routes>
  </MarketplaceSiteLayout>
);

// Toggle a body class for app surfaces that own the full viewport (so the
// public marketplace and login keep page-level scrolling).
const useBodyLock = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // The Buy page owns its body lock state itself (because it depends on
    // map vs list view). Don't fight it from the parent.
    if (pathname.startsWith('/marketplace/buy')) return;
    // Public marketplace + login keep page-level scrolling.
    const isPublic = pathname === '/' || pathname.startsWith('/marketplace') || pathname.startsWith('/login');
    document.body.classList.toggle('app-locked', !isPublic);
    return () => document.body.classList.remove('app-locked');
  }, [pathname]);
};

const AppRoutes = () => {
  const { authenticated, personaKey } = useApp();
  useBodyLock();

  // Not signed in → only the login page or the public marketplace.
  if (!authenticated) {
    return (
      <Routes>
        <Route path="/marketplace/*" element={<PublicMarketplaceRoutes />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Access matrices (canonical — mirrors crmAccess.HIERARCHY).
  //
  //   ┌───────────────────┬───────────────┬────────────────────┬─────────────────────┐
  //   │ Persona           │ Backoffice    │ CRM (Sales/Mktg)   │ Marketplace Dash    │
  //   ├───────────────────┼───────────────┼────────────────────┼─────────────────────┤
  //   │ Super Admin       │ ✓             │ ✓ (audit, all)     │ —                   │
  //   │ Sales Director    │ ✓             │ ✓ (all hierarchy)  │ —                   │
  //   │ Sales Manager     │ —             │ ✓ (cross-team)     │ —                   │
  //   │ Team Leader       │ —             │ ✓ (team)           │ —                   │
  //   │ Sales Agent       │ —             │ ✓ (own only)       │ —                   │
  //   │ Marketing         │ —             │ ✓ (campaigns only) │ —                   │
  //   │ HR Recruiter      │ ✓             │ —  (BOUNCE)        │ —                   │
  //   │ Finance Officer   │ ✓             │ ✓ (audit, deals)   │ —                   │
  //   │ Executive / CEO   │ ✓             │ ✓ (audit, sales)   │ —                   │
  //   │ System Admin      │ ✓             │ ✓ (audit, all)     │ —                   │
  //   │ Marketplace Admin │ —             │ —  (BOUNCE)        │ ✓ (exclusive)        │
  //   └───────────────────┴───────────────┴────────────────────┴─────────────────────┘
  const BACKOFFICE_ROLES   = ['backofficeAdmin','salesDirector','hrRecruiter','financeOfficer','executive','systemAdmin'];
  const MARKETPLACE_ROLES  = ['marketplaceAdmin']; // exclusive — only this role enters Marketplace Dashboard
  const CRM_BLOCKED_ROLES  = ['hrRecruiter','marketplaceAdmin']; // BRD §11 — no CRM data access
  // Training + agent scoring are sales-track features. Homes Academy
  // (/board/learning), Performance (/board/performance) and Training
  // Compliance (/backoffice/training) are hidden + bounced for everyone
  // outside the sales track.
  const isSalesTrack = personaKey === 'agent' || personaKey === 'agentActive'
                    || personaKey === 'teamLeader' || personaKey === 'salesManager'
                    || personaKey === 'salesDirector';
  const TRAINING_AUDIT_ROLES = ['salesDirector','backofficeAdmin']; // can see /backoffice/training

  return (
    <Routes>
      {/* ─── Public Marketplace — consumer surface, available even when signed in ─── */}
      <Route path="/marketplace/*" element={<PublicMarketplaceRoutes />} />

      {/* ─── Employee Board (universal hub for every signed-in user) ─── */}
      <Route path="/board/*" element={
        <AgentLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/board/dashboard" />} />
            <Route path="/dashboard" element={<EmployeeBoardDashboard />} />
            <Route path="/services" element={<AgentServices />} />
            {/* Homes Academy + Performance are sales-track only — training
                gates CRM access and scoring rolls into team allocation. HR,
                Finance, Marketing, Marketplace Admin, Executive and System
                Admin have no use for them and are bounced to the dashboard. */}
            <Route path="/learning"    element={isSalesTrack ? <AgentLearning />    : <Navigate to="/board/dashboard" replace />} />
            <Route path="/performance" element={isSalesTrack ? <AgentPerformance /> : <Navigate to="/board/dashboard" replace />} />
            <Route path="/profile" element={<AgentProfile />} />
            <Route path="/documents" element={<AgentDocuments />} />
            <Route path="/notifications" element={<AgentNotifications />} />
            <Route path="*" element={<Navigate to="/board/dashboard" />} />
          </Routes>
        </AgentLayout>
      } />

      {/* ─── Real CRM Module V2 (embedded via SSO, own sidebar/layout) ─── */}
      {/* Marketing persona is scoped to Campaigns only — every CRM URL except
          /campaigns redirects them, mirroring the sidebar.
          HR Recruiter + Marketplace Admin have no CRM access at all — they're
          bounced back to the Employee Board. */}
      <Route path="/system/crm/*" element={
        CRM_BLOCKED_ROLES.includes(personaKey) ? (
          <Navigate to="/board/dashboard" replace />
        ) : (
        <CrmLayout>
          <Routes>
            {/* Marketing's allowed CRM surfaces are /campaigns and
                /cold-calls; everything else bounces. Default landing for
                marketing is /campaigns. */}
            <Route path="/" element={personaKey === 'marketing' ? <Navigate to="/system/crm/campaigns" replace /> : <CrmDashboard />} />
            <Route path="/leads" element={personaKey === 'marketing' ? <Navigate to="/system/crm/campaigns" replace /> : <CrmLeads />} />
            <Route path="/leads/:id" element={personaKey === 'marketing' ? <Navigate to="/system/crm/campaigns" replace /> : <CrmLeadDetail />} />
            <Route path="/listings" element={personaKey === 'marketing' ? <Navigate to="/system/crm/campaigns" replace /> : <CrmListings />} />
            {/* Tours module merged into Leads on 08-May. Direct URL bounces
                to the Leads list — tour scheduling now lives in the lead
                detail drawer. */}
            <Route path="/tours" element={<Navigate to="/system/crm/leads" replace />} />
            <Route path="/deals" element={personaKey === 'marketing' ? <Navigate to="/system/crm/campaigns" replace /> : <CrmDeals />} />
            {/* Contracts module retired — every visitor goes to Deals where
                contract lifecycle is now tracked. */}
            <Route path="/contracts" element={<Navigate to="/system/crm/deals" replace />} />
            <Route path="/tasks" element={personaKey === 'marketing' ? <Navigate to="/system/crm/campaigns" replace /> : <CrmTasks />} />
            {/* Listing Shares rewired 08-May — direct URL bounces to Listings
                where the per-card Share button lives now. */}
            <Route path="/shares" element={<Navigate to="/system/crm/listings" replace />} />
            <Route path="/minisite" element={personaKey === 'marketing' ? <Navigate to="/system/crm/campaigns" replace /> : <CrmMiniSite />} />
            {/* Reports is manager-only — TL/Agent/audit bounce to dashboard. */}
            <Route path="/reports" element={
              personaKey === 'marketing' ? <Navigate to="/system/crm/campaigns" replace />
              : (personaKey === 'salesManager' || personaKey === 'salesDirector') ? <CrmReports />
              : <Navigate to="/system/crm" replace />
            } />
            <Route path="/campaigns" element={<CrmCampaigns />} />
            {/* Cold Calls — visible to managers (full), agents (their
                assignments) and marketing (import-only). Page renders the
                role-appropriate variant internally. */}
            <Route path="/cold-calls" element={<CrmColdCalls />} />
            {/* Team — Director/Manager/TL only. The page itself does the
                role check and bounces if the persona doesn't qualify. */}
            <Route path="/team" element={<CrmTeam />} />
            <Route path="*" element={<Navigate to="/system/crm" />} />
          </Routes>
        </CrmLayout>
        )
      } />

      {/* ─── Other Federated System intros (placeholders, in Employee Board chrome) ─── */}
      <Route path="/system/*" element={
        <AgentLayout>
          <Routes>
            <Route path="/crm-intro" element={<CRMIntro />} />
            <Route path="/marketplace-dashboard-intro" element={<MarketplaceDashboardIntro />} />
            <Route path="*" element={<Navigate to="/board/dashboard" />} />
          </Routes>
        </AgentLayout>
      } />

      {/* ─── Marketplace Dashboard — exclusive to Marketplace Dashboard Admin role ─── */}
      <Route path="/system/marketplace-dashboard/*" element={
        MARKETPLACE_ROLES.includes(personaKey) ? (
          <MarketplaceLayout>
            <Routes>
              <Route path="/" element={<MPOverview />} />
              <Route path="/listings" element={<MPListings />} />
              <Route path="/leads" element={<MPLeads />} />
              <Route path="/brokerages" element={<MPBrokerages />} />
              <Route path="/developers" element={<MPDevelopers />} />
              <Route path="/geography" element={<MPGeography />} />
              <Route path="/traffic" element={<MPTraffic />} />
              <Route path="/reports" element={<MPReports />} />
              <Route path="/reports/:reportId" element={<MPReportDetail />} />
              <Route path="/users" element={<MPUsers />} />
              <Route path="/roles" element={<MPRoles />} />
              <Route path="*" element={<Navigate to="/system/marketplace-dashboard" />} />
            </Routes>
          </MarketplaceLayout>
        ) : (
          // Any persona without the Marketplace Dashboard Admin role (agents
          // included) is bounced back to the Employee Board.
          <Navigate to="/board/dashboard" replace />
        )
      } />

      {/* ─── Backoffice Admin Portal (separate system, role-gated) ─── */}
      <Route path="/backoffice/*" element={
        BACKOFFICE_ROLES.includes(personaKey) ? (
          <BackofficeLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/backoffice/dashboard" />} />
              <Route path="/dashboard" element={<BackofficeDashboard />} />
              <Route path="/agents" element={<AgentsList />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/documents" element={<DocumentsReview />} />
              <Route path="/staff" element={<StaffManagement />} />
              {/* Training Compliance — sales management + Super Admin only.
                  Training + scoring are sales-track concerns; HR, Finance,
                  Executive and System Admin are bounced. */}
              <Route path="/training" element={TRAINING_AUDIT_ROLES.includes(personaKey) ? <TrainingCompliance /> : <Navigate to="/backoffice/dashboard" replace />} />
              <Route path="/finance" element={<FinancialManagement />} />
              <Route path="/finance/overview" element={<FinanceOverview />} />
              <Route path="/finance/deals-revenue" element={<DealsRevenue />} />
              <Route path="/finance/commission" element={<CommissionEngine />} />
              <Route path="/finance/agent-dues" element={<Navigate to="/backoffice/dashboard" replace />} />
              <Route path="/hr" element={<HRPayroll />} />
              {/* Employee Profiles merged into Staff Management — keep this
                  URL as a redirect so old links / bookmarks still work. */}
              <Route path="/hr/profiles" element={<Navigate to="/backoffice/staff" replace />} />
              <Route path="/recruitment" element={<RecruitmentPipeline />} />
              <Route path="/jobs" element={<JobVacancies />} />
              <Route path="/jobs/:id" element={<VacancyDetail />} />
              {/* Listings, unit types, cities and area lookups are sourced from
                  EGMLS — the brokerage only maintains alternatives to
                  developers / compounds / projects locally. */}
              <Route path="/master/developers" element={<Developers />} />
              <Route path="/master/projects" element={<MasterProjects />} />
              <Route path="/master/compounds" element={<Compounds />} />
              <Route path="/master/unit-types" element={<Navigate to="/backoffice/dashboard" replace />} />
              <Route path="/master/cities" element={<Navigate to="/backoffice/dashboard" replace />} />
              <Route path="/master/areas" element={<Navigate to="/backoffice/dashboard" replace />} />
              <Route path="/master/branches" element={<Branches />} />
              <Route path="/master/teams" element={<Teams />} />
              <Route path="/master/emp-categories" element={<EmploymentCategories />} />
              <Route path="/master/comm-policies" element={<MasterCommPolicies />} />
              <Route path="/master/payout-cycles" element={<Navigate to="/backoffice/dashboard" replace />} />
              <Route path="/master/expense-categories" element={<Navigate to="/backoffice/dashboard" replace />} />
              <Route path="/master/lead-sources" element={<LeadSources />} />
              <Route path="/exceptions" element={<Navigate to="/backoffice/dashboard" replace />} />
              <Route path="/audit" element={<AuditLogs />} />
              <Route path="/inbox" element={<DirectorInbox />} />
              <Route path="/executive" element={<ExecutiveDashboard />} />
              <Route path="/roles" element={<RolesPermissions />} />
              <Route path="/departments" element={<Departments />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/backoffice/dashboard" />} />
            </Routes>
          </BackofficeLayout>
        ) : (
          <Navigate to="/board/dashboard" replace />
        )
      } />

      {/* Default landing for any signed-in user */}
      <Route path="/" element={<Navigate to="/board/dashboard" replace />} />
      <Route path="/login" element={<Navigate to="/board/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/board/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AppProvider>
      <HashRouter>
        <AppRoutes />
        <Modal />
        <Drawer />
        <ConfirmDialog />
        <Toaster />
      </HashRouter>
    </AppProvider>
  );
}

export default App;
