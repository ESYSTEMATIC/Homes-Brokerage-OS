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
import { AuditLogs } from './pages/AuditLogs';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { RolesPermissions } from './pages/RolesPermissions';
import { Departments } from './pages/Departments';
import { FinanceOverview, DealsRevenue, CommissionEngine, AgentDues } from './pages/FinancePages';
import { EmployeeProfiles } from './pages/HRPages';
import { Developers, MasterProjects, Compounds, UnitTypes, Cities, AreasDistricts, Branches, Teams, EmploymentCategories, MasterCommPolicies, PayoutCycles, ExpenseCategories, LeadSources } from './pages/MasterDataPages';
import { ExceptionsIssues, Settings } from './pages/SystemPages';

// Federated system placeholders (CRM) launched via SSO from the Employee Board.
import { CRMLeads, DealsPipeline, TasksCalendar } from './pages/ExternalSystem';

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

// Public Marketplace (consumer-facing, no auth required)
import { MarketplaceSiteLayout } from './components/MarketplaceSiteLayout';
import { Home as PMHome, Buy as PMBuy, Sell as PMSell, Find as PMFind, Mortgage as PMMortgage } from './pages/MarketplaceSite/index.jsx';

// Public marketplace routes — accessible without auth (homes.com.eg consumer surface).
const PublicMarketplaceRoutes = () => (
  <MarketplaceSiteLayout>
    <Routes>
      <Route path="/" element={<PMHome />} />
      <Route path="/buy" element={<PMBuy />} />
      <Route path="/sell" element={<PMSell />} />
      <Route path="/find" element={<PMFind />} />
      <Route path="/mortgage" element={<PMMortgage />} />
      <Route path="*" element={<Navigate to="/marketplace" replace />} />
    </Routes>
  </MarketplaceSiteLayout>
);

// Toggle a body class for app surfaces that own the full viewport (so the
// public marketplace and login keep page-level scrolling).
const useBodyLock = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // Public marketplace and login keep page-level scrolling. The Buy page
    // owns its own internal layout: in Map view it locks the viewport so the
    // map can stay fixed, in List view it scrolls the page normally — that
    // toggle is handled inside the page by adding/removing `app-locked`.
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

  // Backoffice access matrix (controls whether direct /backoffice/* URLs render under
  // the Backoffice layout). Without access, redirect to Employee Board.
  const BACKOFFICE_ROLES = ['backofficeAdmin','salesDirector','hrRecruiter','financeOfficer','executive','systemAdmin'];
  const MARKETPLACE_ROLES = ['marketplaceAdmin']; // exclusive — only this role enters Marketplace Dashboard

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
            <Route path="/learning" element={<AgentLearning />} />
            <Route path="/performance" element={<AgentPerformance />} />
            <Route path="/profile" element={<AgentProfile />} />
            <Route path="/documents" element={<AgentDocuments />} />
            <Route path="/notifications" element={<AgentNotifications />} />
            <Route path="*" element={<Navigate to="/board/dashboard" />} />
          </Routes>
        </AgentLayout>
      } />

      {/* ─── CRM federated placeholders — rendered inside Employee Board chrome ─── */}
      <Route path="/system/crm/*" element={
        <AgentLayout>
          <Routes>
            <Route path="/" element={<CRMLeads />} />
            <Route path="/leads" element={<CRMLeads />} />
            <Route path="/deals" element={<DealsPipeline />} />
            <Route path="/tasks" element={<TasksCalendar />} />
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
              <Route path="/training" element={<TrainingCompliance />} />
              <Route path="/finance" element={<FinancialManagement />} />
              <Route path="/finance/overview" element={<FinanceOverview />} />
              <Route path="/finance/deals-revenue" element={<DealsRevenue />} />
              <Route path="/finance/commission" element={<CommissionEngine />} />
              <Route path="/finance/agent-dues" element={<AgentDues />} />
              <Route path="/hr" element={<HRPayroll />} />
              <Route path="/hr/profiles" element={<EmployeeProfiles />} />
              <Route path="/recruitment" element={<RecruitmentPipeline />} />
              <Route path="/jobs" element={<JobVacancies />} />
              <Route path="/master/developers" element={<Developers />} />
              <Route path="/master/projects" element={<MasterProjects />} />
              <Route path="/master/compounds" element={<Compounds />} />
              <Route path="/master/unit-types" element={<UnitTypes />} />
              <Route path="/master/cities" element={<Cities />} />
              <Route path="/master/areas" element={<AreasDistricts />} />
              <Route path="/master/branches" element={<Branches />} />
              <Route path="/master/teams" element={<Teams />} />
              <Route path="/master/emp-categories" element={<EmploymentCategories />} />
              <Route path="/master/comm-policies" element={<MasterCommPolicies />} />
              <Route path="/master/payout-cycles" element={<PayoutCycles />} />
              <Route path="/master/expense-categories" element={<ExpenseCategories />} />
              <Route path="/master/lead-sources" element={<LeadSources />} />
              <Route path="/exceptions" element={<ExceptionsIssues />} />
              <Route path="/audit" element={<AuditLogs />} />
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
