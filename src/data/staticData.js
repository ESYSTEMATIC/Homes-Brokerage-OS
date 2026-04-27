// ═══════════════════════════════════════════════════════════════
// HOMES BROKERAGE OS — COMPREHENSIVE STATIC DATA (BRD-ALIGNED)
// ═══════════════════════════════════════════════════════════════

// ── PERSONAS (BRD Section 5) ──
export const PERSONAS = {
  backofficeAdmin: { label: "Super Admin", scope: "Full platform access", hub: "backoffice", email: "admin@homesbrokerage.eg" },
  salesManager: { label: "Sales Manager", scope: "Managed teams Alpha + Beta", hub: "backoffice", email: "nour@homesbrokerage.eg" },
  salesDirector: { label: "Sales Director", scope: "All sales hierarchy", hub: "backoffice", email: "tarek@homesbrokerage.eg" },
  hrRecruiter: { label: "HR Recruiter", scope: "Recruitment and onboarding", hub: "backoffice", email: "hr@homesbrokerage.eg" },
  financeOfficer: { label: "Finance Officer", scope: "Finance + commission data", hub: "backoffice", email: "finance@homesbrokerage.eg" },
  marketingAdmin: { label: "Marketing Admin", scope: "Marketplace and campaigns", hub: "backoffice", email: "marketing@homesbrokerage.eg" },
  executive: { label: "Executive / CEO", scope: "Corporate visibility", hub: "backoffice", email: "ceo@homesbrokerage.eg" },
  systemAdmin: { label: "System Admin", scope: "Platform configuration", hub: "backoffice", email: "sysadmin@homesbrokerage.eg" },
  agent: { label: "Sarah El-Masry", scope: "Licensed Agent · New Cairo Branch", hub: "agent", email: "sarah@homesbrokerage.eg", mls: "EGMLS-287451", role: "Licensed Agent" },
  teamLeader: { label: "Omar Sherif", scope: "Team Leader · Alpha Team", hub: "agent", email: "omar@homesbrokerage.eg", role: "Team Leader" },
};

// ── DEPARTMENTS (BRD Section 6.2) ──
export const DEPARTMENTS = [
  { id: "DEP-001", name: "Sales", head: "Nour El-Din", teams: 3, employees: 12, status: "Active" },
  { id: "DEP-002", name: "HR / Recruitment", head: "Dina Samir", teams: 1, employees: 4, status: "Active" },
  { id: "DEP-003", name: "Finance", head: "Amr Khaled", teams: 1, employees: 3, status: "Active" },
  { id: "DEP-004", name: "Backoffice", head: "Laila Hassan", teams: 1, employees: 5, status: "Active" },
  { id: "DEP-005", name: "Marketing", head: "Tamer Said", teams: 1, employees: 3, status: "Active" },
  { id: "DEP-006", name: "Marketplace Operations", head: "Rania Youssef", teams: 1, employees: 2, status: "Active" },
  { id: "DEP-007", name: "Executive", head: "CEO", teams: 0, employees: 2, status: "Active" },
];

// ── STAFF / EMPLOYEES (BRD Sections 6, 8.9) ──
export const STAFF = [
  { id: "A001", name: "Ahmed Hassan", department: "Sales", title: "Senior Sales Executive", branch: "New Cairo", manager: "Karim Mostafa", status: "Active", type: "Employee" },
  { id: "A002", name: "Fatma Ibrahim", department: "Sales", title: "Sales Agent", branch: "6th October", manager: "Omar Sherif", status: "Active", type: "Employee" },
  { id: "A003", name: "Mohamed Ali", department: "Sales", title: "Team Leader", branch: "Sheikh Zayed", manager: "Tarek Amin", status: "Active", type: "Team Leader" },
  { id: "A004", name: "Nour El-Din", department: "Sales", title: "Sales Manager", branch: "New Cairo", manager: "CEO", status: "Active", type: "Sales Manager" },
  { id: "A005", name: "Yasmin Adel", department: "Sales", title: "Sales Agent", branch: "Heliopolis", manager: "Karim Mostafa", status: "Suspended", type: "Employee" },
  { id: "A006", name: "Karim Mostafa", department: "Sales", title: "Sales Manager", branch: "New Cairo", manager: "CEO", status: "Active", type: "Sales Manager" },
  { id: "A007", name: "Hana Mahmoud", department: "Sales", title: "Junior Sales", branch: "6th October", manager: "Omar Sherif", status: "Pending", type: "Employee" },
  { id: "A008", name: "Omar Sherif", department: "Sales", title: "Team Leader", branch: "6th October", manager: "Nour El-Din", status: "Active", type: "Team Leader" },
];

// ── LEADS (BRD Section 8.2) ──
export const LEADS = [
  { id: "L-1001", name: "Mohamed Hassan", phone: "+20 100 111 2244", email: "m.hassan@mail.com", source: "Marketplace", campaign: "New Cairo Launch", project: "Palm Hills New Cairo", developer: "Palm Hills", budget: 8500000, stage: "Qualified", owner: "Ahmed Hassan", team: "Alpha", duplicate: "Clear", priority: "Hot", created: "2024-01-15" },
  { id: "L-1002", name: "Sara Ali", phone: "+20 111 888 3000", email: "sara.ali@mail.com", source: "Referral", campaign: "Broker Referral", project: "ZED East", developer: "Ora", budget: 12200000, stage: "Negotiation", owner: "Fatma Ibrahim", team: "Alpha", duplicate: "Clear", priority: "Hot", created: "2024-01-14" },
  { id: "L-1003", name: "Karim Fouad", phone: "+20 122 443 0101", email: "karim@mail.com", source: "Walk-in", campaign: "Branch Visit", project: "Madinaty", developer: "Talaat Moustafa", budget: 5200000, stage: "New", owner: null, team: "Unassigned", duplicate: "Review", priority: "Warm", created: "2024-01-16" },
  { id: "L-1004", name: "Nour Ibrahim", phone: "+20 100 222 5566", email: "nour.ib@mail.com", source: "Marketplace", campaign: "North Coast Summer", project: "Hacienda Bay", developer: "Palm Hills", budget: 16000000, stage: "Tour Scheduled", owner: "Hana Mahmoud", team: "Beta", duplicate: "Clear", priority: "Hot", created: "2024-01-12" },
  { id: "L-1005", name: "Layla Ahmed", phone: "+20 100 333 7788", email: "layla@mail.com", source: "Campaign", campaign: "Sheikh Zayed Promo", project: "Sodic West", developer: "Sodic", budget: 9800000, stage: "New", owner: null, team: "Unassigned", duplicate: "Clear", priority: "Warm", created: "2024-01-17" },
  { id: "L-1006", name: "Tarek Mansour", phone: "+20 112 444 9900", email: "tarek.m@mail.com", source: "Marketplace", campaign: "New Capital Launch", project: "Midtown", developer: "Better Home", budget: 4500000, stage: "Contacted", owner: "Ahmed Hassan", team: "Alpha", duplicate: "Clear", priority: "Cold", created: "2024-01-10" },
  { id: "L-1007", name: "Youssef Tarek", phone: "+20 100 555 1122", email: "youssef@mail.com", source: "Referral", campaign: "Agent Referral", project: "Hyde Park", developer: "Hyde Park", budget: 11200000, stage: "Reservation", owner: "Fatma Ibrahim", team: "Alpha", duplicate: "Clear", priority: "Hot", created: "2024-01-08" },
  { id: "L-1008", name: "Mona Fawzy", phone: "+20 100 666 3344", email: "mona@mail.com", source: "Walk-in", campaign: "Branch Walk-in", project: "Mountain View", developer: "Mountain View", budget: 7000000, stage: "Contacted", owner: "Omar Sherif", team: "Beta", duplicate: "Review", priority: "Warm", created: "2024-01-18" },
];

// ── DEALS (BRD Section 8.6) ──
export const DEALS = [
  { id: "D-501", lead: "Sara Ali", owner: "Fatma Ibrahim", team: "Alpha", project: "ZED East", developer: "Ora", stage: "Negotiation", value: 12200000, commission: 2.0, status: "Active", created: "2024-01-14" },
  { id: "D-502", lead: "Youssef Tarek", owner: "Fatma Ibrahim", team: "Alpha", project: "Hyde Park", developer: "Hyde Park", stage: "Reservation", value: 11200000, commission: 1.8, status: "Active", created: "2024-01-10" },
  { id: "D-503", lead: "Nour Ibrahim", owner: "Hana Mahmoud", team: "Beta", project: "Hacienda Bay", developer: "Palm Hills", stage: "Contracting", value: 16000000, commission: 2.2, status: "Active", created: "2024-01-12" },
  { id: "D-504", lead: "Mohamed Hassan", owner: "Ahmed Hassan", team: "Alpha", project: "Palm Hills New Cairo", developer: "Palm Hills", stage: "Qualified", value: 8500000, commission: 2.0, status: "Active", created: "2024-01-15" },
  { id: "D-505", lead: "Tarek Mansour", owner: "Ahmed Hassan", team: "Alpha", project: "Midtown", developer: "Better Home", stage: "Closed Lost", value: 4500000, commission: 1.5, lostReason: "Budget exceeded", status: "Closed", created: "2024-01-10" },
];

// ── TASKS (BRD Section 8.7) ──
export const TASKS = [
  { id: "T-001", title: "Follow up with Mohamed Hassan", type: "Call", owner: "Ahmed Hassan", lead: "L-1001", due: "2024-01-18", priority: "High", status: "Pending" },
  { id: "T-002", title: "Schedule tour - ZED East", type: "Tour", owner: "Fatma Ibrahim", lead: "L-1002", due: "2024-01-19", priority: "High", status: "Completed" },
  { id: "T-003", title: "Send payment plan details", type: "WhatsApp", owner: "Hana Mahmoud", lead: "L-1004", due: "2024-01-17", priority: "Medium", status: "Overdue" },
  { id: "T-004", title: "Qualification call - Layla Ahmed", type: "Call", owner: null, lead: "L-1005", due: "2024-01-20", priority: "Medium", status: "Pending" },
  { id: "T-005", title: "Contract review - Hyde Park", type: "Contract", owner: "Fatma Ibrahim", lead: "L-1007", due: "2024-01-21", priority: "High", status: "Pending" },
  { id: "T-006", title: "Finance follow-up on Hacienda deal", type: "Finance", owner: "Hana Mahmoud", lead: "L-1004", due: "2024-01-22", priority: "High", status: "Pending" },
];

// ── ONBOARDING APPLICATIONS (BRD Section 8.9) ──
export const ONBOARDING = [
  { id: "APP001", applicant: "Mona Fawzy", type: "Agent", date: "2024-01-15", status: "Submitted", department: "Sales", branch: "New Cairo" },
  { id: "APP002", applicant: "Khaled Magdy", type: "Employee", date: "2024-01-10", status: "Under Review", department: "Sales", branch: "6th October" },
  { id: "APP003", applicant: "Rania Youssef", type: "Agent", date: "2024-01-08", status: "Missing Documents", department: "Sales", branch: "Sheikh Zayed" },
  { id: "APP004", applicant: "Tamer Said", type: "Employee", date: "2023-12-20", status: "Approved", department: "Marketing", branch: "New Cairo" },
  { id: "APP005", applicant: "Laila Hassan", type: "Agent", date: "2023-12-15", status: "Training Pending", department: "Sales", branch: "Maadi" },
  { id: "APP006", applicant: "Youssef Nader", type: "Agent", date: "2024-01-12", status: "Interview Pending", department: "Sales", branch: "Heliopolis" },
  { id: "APP007", applicant: "Nadia Gamal", type: "Employee", date: "2023-12-01", status: "Rejected", department: "HR", branch: "New Cairo" },
];

// ── DOCUMENTS (BRD Section 8.12) ──
export const DOCUMENTS = [
  { id: "DOC001", doc: "National ID", type: "Identity", agent: "Fatma Ibrahim", date: "2024-01-14", status: "Pending Review" },
  { id: "DOC002", doc: "Tax Card", type: "Financial", agent: "Fatma Ibrahim", date: "2024-01-14", status: "Pending Review" },
  { id: "DOC003", doc: "Commercial Register", type: "Legal", agent: "Ahmed Hassan", date: "2024-01-10", status: "Approved" },
  { id: "DOC004", doc: "National ID", type: "Identity", agent: "Ahmed Hassan", date: "2023-12-20", status: "Approved" },
  { id: "DOC005", doc: "Brokerage Agreement", type: "Legal", agent: "Yasmin Adel", date: "—", status: "Missing" },
  { id: "DOC006", doc: "National ID", type: "Identity", agent: "Hana Mahmoud", date: "2024-01-08", status: "Rejected" },
  { id: "DOC007", doc: "RERA License", type: "Regulatory", agent: "Mohamed Ali", date: "2024-01-12", status: "Approved" },
  { id: "DOC008", doc: "Contract Agreement", type: "Legal", agent: "Omar Sherif", date: "2024-01-05", status: "Approved" },
];

// ── RECRUITMENT / JOB VACANCIES (BRD Section 8.10) ──
export const JOBS = [
  { id: "JOB-001", title: "Senior Sales Agent", department: "Sales", location: "New Cairo", type: "Full-time", mode: "On-site", headcount: 3, hiringManager: "Karim Mostafa", status: "Published", applicants: 12, created: "2024-01-05" },
  { id: "JOB-002", title: "Junior Sales Agent", department: "Sales", location: "6th October", type: "Full-time", mode: "On-site", headcount: 5, hiringManager: "Omar Sherif", status: "Published", applicants: 28, created: "2024-01-08" },
  { id: "JOB-003", title: "HR Coordinator", department: "HR / Recruitment", location: "New Cairo", type: "Full-time", mode: "Hybrid", headcount: 1, hiringManager: "Dina Samir", status: "Draft", applicants: 0, created: "2024-01-15" },
  { id: "JOB-004", title: "Finance Analyst", department: "Finance", location: "New Cairo", type: "Full-time", mode: "On-site", headcount: 1, hiringManager: "Amr Khaled", status: "Closed", applicants: 8, created: "2023-12-01" },
];

export const CANDIDATES = [
  { id: "CAN-001", name: "Amira El-Sayed", job: "Senior Sales Agent", stage: "Interview", score: 85, source: "Careers Page", applied: "2024-01-10", interviewer: "Karim Mostafa" },
  { id: "CAN-002", name: "Hassan Nabil", job: "Senior Sales Agent", stage: "Screening", score: null, source: "Referral", applied: "2024-01-12", interviewer: null },
  { id: "CAN-003", name: "Fatma Youssef", job: "Junior Sales Agent", stage: "Offer", score: 92, source: "Careers Page", applied: "2024-01-06", interviewer: "Omar Sherif" },
  { id: "CAN-004", name: "Ali Mostafa", job: "Junior Sales Agent", stage: "Rejected", score: 45, source: "LinkedIn", applied: "2024-01-09", interviewer: "Karim Mostafa" },
  { id: "CAN-005", name: "Nora Adel", job: "Senior Sales Agent", stage: "Applied", score: null, source: "Careers Page", applied: "2024-01-16", interviewer: null },
  { id: "CAN-006", name: "Khaled Samir", job: "HR Coordinator", stage: "Applied", score: null, source: "LinkedIn", applied: "2024-01-17", interviewer: null },
];

// ── TRAINING COURSES (BRD Section 8.11) ──
export const TRAINING = [
  { id: "CRS-001", title: "Real Estate Fundamentals", progress: 100, score: 92, due: "2024-11-30", status: "Completed", required: true },
  { id: "CRS-002", title: "Anti-Money Laundering Compliance", progress: 65, score: null, due: "2024-12-15", status: "In Progress", required: true },
  { id: "CRS-003", title: "Egyptian Real Estate Regulations & Ethics", progress: 40, score: null, due: "2024-12-20", status: "In Progress", required: true },
  { id: "CRS-004", title: "CRM Platform Essentials", progress: 100, score: 88, due: "2024-11-25", status: "Completed", required: true },
  { id: "CRS-005", title: "Matrix EGMLS Navigation", progress: 0, score: null, due: "2025-01-10", status: "Locked", required: true },
  { id: "CRS-006", title: "Advanced Negotiation Skills", progress: 20, score: null, due: "2025-02-15", status: "In Progress", required: false },
  { id: "CRS-007", title: "Customer Communication Excellence", progress: 0, score: null, due: "2025-03-01", status: "Not Started", required: false },
];

// ── COMMISSION POLICIES (BRD Section 8.13) ──
export const COMMISSION_POLICIES = [
  { id: "COM-001", developer: "Palm Hills", project: "Palm Hills New Cairo", rate: 2.0, override: false, status: "Active" },
  { id: "COM-002", developer: "Ora", project: "ZED East", rate: 2.0, override: false, status: "Active" },
  { id: "COM-003", developer: "Hyde Park", project: "Hyde Park New Cairo", rate: 1.8, override: false, status: "Active" },
  { id: "COM-004", developer: "Palm Hills", project: "Hacienda Bay", rate: 2.2, override: true, overrideReason: "Premium launch incentive", approver: "Nour El-Din", status: "Active" },
  { id: "COM-005", developer: "Talaat Moustafa", project: "Madinaty", rate: 1.5, override: false, status: "Active" },
  { id: "COM-006", developer: "Sodic", project: "Sodic West", rate: 1.8, override: false, status: "Active" },
];

// ── AUDIT LOGS (BRD Section 10.3) ──
export const AUDIT_LOGS = [
  { id: "AUD-001", action: "Lead Assigned", actor: "Nour El-Din", target: "L-1001 → Ahmed Hassan", module: "CRM", timestamp: "2024-01-15 09:23:44", detail: "Lead assigned from manager queue" },
  { id: "AUD-002", action: "Role Created", actor: "System Admin", target: "Senior Agent Role", module: "Backoffice", timestamp: "2024-01-14 14:11:02", detail: "New role with 12 permissions created" },
  { id: "AUD-003", action: "Commission Override", actor: "Karim Mostafa", target: "D-503 Hacienda Bay", module: "Finance", timestamp: "2024-01-13 16:45:00", detail: "Rate changed from 2.0% to 2.2% — Premium launch" },
  { id: "AUD-004", action: "Document Rejected", actor: "Backoffice Admin", target: "DOC006 National ID", module: "Backoffice", timestamp: "2024-01-12 11:30:00", detail: "Image quality insufficient" },
  { id: "AUD-005", action: "Employee Suspended", actor: "HR Manager", target: "A005 Yasmin Adel", module: "HR", timestamp: "2024-01-11 10:00:00", detail: "Training compliance overdue" },
  { id: "AUD-006", action: "Job Published", actor: "Dina Samir", target: "JOB-001 Senior Sales Agent", module: "Recruitment", timestamp: "2024-01-05 08:30:00", detail: "Published to careers page" },
  { id: "AUD-007", action: "Deal Stage Changed", actor: "Fatma Ibrahim", target: "D-502 → Reservation", module: "CRM", timestamp: "2024-01-10 15:20:00", detail: "Stage moved from Negotiation to Reservation" },
  { id: "AUD-008", action: "SSO Login", actor: "Ahmed Hassan", target: "Agent Session", module: "Security", timestamp: "2024-01-18 08:00:00", detail: "SSO authenticated via Microsoft Entra" },
];

// ── ROLES & PERMISSIONS (BRD Section 6.3) ──
export const ROLES = [
  { id: "ROLE-001", name: "Sales Agent", department: "Sales", permissions: 8, users: 4, status: "Active", desc: "Standard CRM access for lead management, tasks, and deals" },
  { id: "ROLE-002", name: "Team Leader", department: "Sales", permissions: 14, users: 2, status: "Active", desc: "Team oversight, lead distribution, and reporting" },
  { id: "ROLE-003", name: "Sales Manager", department: "Sales", permissions: 22, users: 2, status: "Active", desc: "Manager queue, hierarchy assignment, approvals" },
  { id: "ROLE-004", name: "HR Recruiter", department: "HR / Recruitment", permissions: 12, users: 2, status: "Active", desc: "Job publishing, candidate pipeline, onboarding" },
  { id: "ROLE-005", name: "Finance Officer", department: "Finance", permissions: 10, users: 2, status: "Active", desc: "Commission policies, finance validation, reports" },
  { id: "ROLE-006", name: "Backoffice Admin", department: "Backoffice", permissions: 28, users: 3, status: "Active", desc: "Full governance, roles, departments, audit" },
  { id: "ROLE-007", name: "Super Admin", department: "System", permissions: 45, users: 1, status: "Active", desc: "Full platform access and configuration" },
];

// ── MARKETPLACE / PROJECTS (BRD Section 8.1, 8.5) ──
export const PROJECTS = [
  { id: "PRJ-001", name: "Palm Hills New Cairo", developer: "Palm Hills", location: "New Cairo", units: 450, available: 120, type: "Compound", status: "Published", delivery: "2026-Q2", priceFrom: 5500000 },
  { id: "PRJ-002", name: "ZED East", developer: "Ora", location: "New Cairo", units: 680, available: 210, type: "Mixed-Use", status: "Published", delivery: "2025-Q4", priceFrom: 8200000 },
  { id: "PRJ-003", name: "Hacienda Bay", developer: "Palm Hills", location: "North Coast", units: 320, available: 85, type: "Resort", status: "Published", delivery: "2025-Q3", priceFrom: 12000000 },
  { id: "PRJ-004", name: "Madinaty", developer: "Talaat Moustafa", location: "New Cairo", units: 1200, available: 340, type: "Township", status: "Published", delivery: "Ready", priceFrom: 3800000 },
  { id: "PRJ-005", name: "Hyde Park", developer: "Hyde Park", location: "New Cairo", units: 580, available: 165, type: "Compound", status: "Published", delivery: "2026-Q1", priceFrom: 7500000 },
  { id: "PRJ-006", name: "Sodic West", developer: "Sodic", location: "Sheikh Zayed", units: 290, available: 78, type: "Compound", status: "Draft", delivery: "2026-Q3", priceFrom: 6800000 },
];

// ── MARKETPLACE ANALYTICS ──
export const MARKETPLACE_STATS = {
  totalVisitors: 145200, inquiries: 3840, tourRequests: 1250, conversionRate: 2.64,
  topSources: [
    { name: "Organic Search", leads: 1420, pct: 37 },
    { name: "Paid Ads", leads: 980, pct: 25.5 },
    { name: "Social Media", leads: 720, pct: 18.7 },
    { name: "Referral", leads: 450, pct: 11.7 },
    { name: "Direct", leads: 270, pct: 7.1 },
  ],
  topProjects: [
    { name: "Palm Hills New Cairo", inquiries: 820, tours: 245, deals: 12 },
    { name: "ZED East", inquiries: 640, tours: 180, deals: 8 },
    { name: "Hacienda Bay", inquiries: 580, tours: 160, deals: 6 },
    { name: "Hyde Park", inquiries: 420, tours: 110, deals: 5 },
    { name: "Madinaty", inquiries: 380, tours: 95, deals: 4 },
  ],
};
