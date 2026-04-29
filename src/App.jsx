import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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

// Federated system placeholders (CRM, Marketplace Dashboard) launched via SSO from the Employee Board.
import { CRMLeads, DealsPipeline, TasksCalendar, MarketplaceDashboard } from './pages/ExternalSystem';

// Employee Board (universal landing)
import { EmployeeBoardDashboard } from './pages/EmployeeBoardDashboard';
import { AgentLearning } from './pages/AgentLearning';
import { AgentPerformance, AgentProfile, AgentDocuments, AgentNotifications } from './pages/AgentPages';

const AppRoutes = () => {
  const { authenticated, personaKey } = useApp();

  // Not signed in → only the login page.
  if (!authenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Backoffice access matrix (controls whether direct /backoffice/* URLs render under
  // the Backoffice layout). Without access, redirect to Employee Board.
  const BACKOFFICE_ROLES = ['backofficeAdmin','salesDirector','hrRecruiter','financeOfficer','marketingAdmin','executive','systemAdmin'];

  return (
    <Routes>
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

      {/* ─── Federated systems (placeholders) — also rendered inside Employee Board chrome ─── */}
      <Route path="/system/*" element={
        <AgentLayout>
          <Routes>
            <Route path="/crm" element={<CRMLeads />} />
            <Route path="/crm/leads" element={<CRMLeads />} />
            <Route path="/crm/deals" element={<DealsPipeline />} />
            <Route path="/crm/tasks" element={<TasksCalendar />} />
            <Route path="/marketplace-dashboard" element={<MarketplaceDashboard />} />
            <Route path="*" element={<Navigate to="/board/dashboard" />} />
          </Routes>
        </AgentLayout>
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
