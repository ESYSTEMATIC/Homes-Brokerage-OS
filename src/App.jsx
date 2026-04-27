import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { BackofficeLayout } from './components/BackofficeLayout';
import { AgentLayout } from './components/AgentLayout';
// Backoffice Pages
import { BackofficeDashboard } from './pages/BackofficeDashboard';
import { AgentsList } from './pages/AgentsList';
import { Onboarding } from './pages/Onboarding';
import { DocumentsReview } from './pages/DocumentsReview';
import { StaffManagement } from './pages/StaffManagement';
import { CRMLeads } from './pages/CRMLeads';
import { DealsPipeline } from './pages/DealsPipeline';
import { TasksCalendar } from './pages/TasksCalendar';
import { TrainingCompliance } from './pages/TrainingCompliance';
import { FinancialManagement } from './pages/FinancialManagement';
import { HRPayroll } from './pages/HRPayroll';
import { RecruitmentPipeline } from './pages/RecruitmentPipeline';
import { JobVacancies } from './pages/JobVacancies';
import { MarketplaceDashboard } from './pages/MarketplaceDashboard';
import { AuditLogs } from './pages/AuditLogs';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { RolesPermissions } from './pages/RolesPermissions';
import { Departments } from './pages/Departments';
// Finance sub-pages
import { FinanceOverview, DealsRevenue, CommissionEngine, AgentDues } from './pages/FinancePages';
// HR sub-pages
import { EmployeeProfiles, Payroll } from './pages/HRPages';
// Master Data
import { Developers, MasterProjects, Compounds, UnitTypes, Cities, AreasDistricts, Branches, Teams, EmploymentCategories, MasterCommPolicies, PayoutCycles, ExpenseCategories, LeadSources } from './pages/MasterDataPages';
// System
import { ExceptionsIssues, Settings } from './pages/SystemPages';
// Agent Pages
import { AgentPortalDashboard } from './pages/AgentPortalDashboard';
import { AgentLearning } from './pages/AgentLearning';
import { AgentProducts, AgentPerformance, AgentProfile, AgentDocuments, AgentNotifications } from './pages/AgentPages';

const AppRoutes = () => {
  const { persona } = useApp();

  if (persona.hub === 'agent') {
    return (
      <AgentLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/agent/dashboard" />} />
          <Route path="/agent/dashboard" element={<AgentPortalDashboard />} />
          <Route path="/agent/products" element={<AgentProducts />} />
          <Route path="/agent/learning" element={<AgentLearning />} />
          <Route path="/agent/performance" element={<AgentPerformance />} />
          <Route path="/agent/profile" element={<AgentProfile />} />
          <Route path="/agent/documents" element={<AgentDocuments />} />
          <Route path="/agent/notifications" element={<AgentNotifications />} />
          <Route path="/agent/help" element={<div className="page-header"><h1 className="page-title">Help & Support</h1><p className="page-subtitle">FAQs, onboarding guides, and ticket management</p></div>} />
          <Route path="*" element={<Navigate to="/agent/dashboard" />} />
        </Routes>
      </AgentLayout>
    );
  }

  return (
    <BackofficeLayout>
      <Routes>
        <Route path="/" element={<Navigate to="/backoffice/dashboard" />} />
        <Route path="/backoffice/dashboard" element={<BackofficeDashboard />} />
        <Route path="/backoffice/agents" element={<AgentsList />} />
        <Route path="/backoffice/onboarding" element={<Onboarding />} />
        <Route path="/backoffice/documents" element={<DocumentsReview />} />
        <Route path="/backoffice/staff" element={<StaffManagement />} />
        <Route path="/backoffice/crm" element={<CRMLeads />} />
        <Route path="/backoffice/deals" element={<DealsPipeline />} />
        <Route path="/backoffice/tasks" element={<TasksCalendar />} />
        <Route path="/backoffice/training" element={<TrainingCompliance />} />
        {/* Finance sub-pages */}
        <Route path="/backoffice/finance" element={<FinancialManagement />} />
        <Route path="/backoffice/finance/overview" element={<FinanceOverview />} />
        <Route path="/backoffice/finance/deals-revenue" element={<DealsRevenue />} />
        <Route path="/backoffice/finance/commission" element={<CommissionEngine />} />
        <Route path="/backoffice/finance/agent-dues" element={<AgentDues />} />
        {/* HR sub-pages */}
        <Route path="/backoffice/hr" element={<HRPayroll />} />
        <Route path="/backoffice/hr/profiles" element={<EmployeeProfiles />} />
        <Route path="/backoffice/hr/payroll" element={<Payroll />} />
        <Route path="/backoffice/recruitment" element={<RecruitmentPipeline />} />
        <Route path="/backoffice/jobs" element={<JobVacancies />} />
        {/* Master Data */}
        <Route path="/backoffice/master/developers" element={<Developers />} />
        <Route path="/backoffice/master/projects" element={<MasterProjects />} />
        <Route path="/backoffice/master/compounds" element={<Compounds />} />
        <Route path="/backoffice/master/unit-types" element={<UnitTypes />} />
        <Route path="/backoffice/master/cities" element={<Cities />} />
        <Route path="/backoffice/master/areas" element={<AreasDistricts />} />
        <Route path="/backoffice/master/branches" element={<Branches />} />
        <Route path="/backoffice/master/teams" element={<Teams />} />
        <Route path="/backoffice/master/emp-categories" element={<EmploymentCategories />} />
        <Route path="/backoffice/master/comm-policies" element={<MasterCommPolicies />} />
        <Route path="/backoffice/master/payout-cycles" element={<PayoutCycles />} />
        <Route path="/backoffice/master/expense-categories" element={<ExpenseCategories />} />
        <Route path="/backoffice/master/lead-sources" element={<LeadSources />} />
        {/* Data & Reporting */}
        <Route path="/backoffice/exceptions" element={<ExceptionsIssues />} />
        <Route path="/backoffice/marketplace" element={<MarketplaceDashboard />} />
        <Route path="/backoffice/audit" element={<AuditLogs />} />
        <Route path="/backoffice/executive" element={<ExecutiveDashboard />} />
        {/* System */}
        <Route path="/backoffice/roles" element={<RolesPermissions />} />
        <Route path="/backoffice/departments" element={<Departments />} />
        <Route path="/backoffice/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/backoffice/dashboard" />} />
      </Routes>
    </BackofficeLayout>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
