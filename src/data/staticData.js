// ═══════════════════════════════════════════════════════════════
// HOMES BROKERAGE OS — COMPREHENSIVE STATIC DATA (V1.3 ALIGNED)
// ═══════════════════════════════════════════════════════════════

// ── PERSONAS ──
export const PERSONAS = {
  backofficeAdmin: { label: "Super Admin", scope: "Full platform access", hub: "backoffice", email: "admin@homesbrokerage.eg" },
  salesManager: { label: "Sales Manager", scope: "Managed teams Alpha + Beta", hub: "backoffice", email: "nour@homesbrokerage.eg" },
  salesDirector: { label: "Sales Director", scope: "All sales hierarchy", hub: "backoffice", email: "tarek@homesbrokerage.eg" },
  hrRecruiter: { label: "HR Recruiter", scope: "Recruitment and onboarding", hub: "backoffice", email: "hr@homesbrokerage.eg" },
  financeOfficer: { label: "Finance Officer", scope: "Finance + commission data", hub: "backoffice", email: "finance@homesbrokerage.eg" },
  marketplaceAdmin: { label: "Marketplace Dashboard Admin", scope: "Marketplace Dashboard system — exclusive access", hub: "backoffice", email: "marketplace@homesbrokerage.eg" },
  executive: { label: "Executive / CEO", scope: "Corporate visibility", hub: "backoffice", email: "ceo@homesbrokerage.eg" },
  systemAdmin: { label: "System Admin", scope: "Platform configuration", hub: "backoffice", email: "sysadmin@homesbrokerage.eg" },
  agent: { label: "Sarah El-Masry", scope: "Licensed Agent · New Cairo Branch", hub: "agent", email: "sarah@homesbrokerage.eg", mls: "Pending", role: "Licensed Agent (Onboarding)", onboardingComplete: false, salesTrack: true },
  agentActive: { label: "Fatma Ibrahim", scope: "Licensed Agent · Team Alpha · New Cairo", hub: "agent", email: "fatma@homesbrokerage.eg", mls: "EGMLS-291004", role: "Licensed Agent (Active)", onboardingComplete: true, salesTrack: true },
  teamLeader: { label: "Omar Sherif", scope: "Team Leader · Alpha Team", hub: "agent", email: "omar@homesbrokerage.eg", mls: "EGMLS-287451", role: "Team Leader", onboardingComplete: true, salesTrack: true },
  // Marketing — runs social media + ad campaigns. SSO-only into CRM Campaigns
  // (BRD §8.23). Not on the sales track: no onboarding journey, no training
  // compliance, no MLS, no team assignment, no agent score, no Viva Learning,
  // no Performance metrics, no Matrix EGMLS launcher.
  marketing: { label: "Ahmed Hassan", scope: "Marketing · Social & ad campaigns", hub: "agent", email: "marketing@homesbrokerage.eg", role: "Marketing", onboardingComplete: true, salesTrack: false },
};

// ── DEPARTMENTS ──
export const DEPARTMENTS = [
  { id: "DEP-001", name: "Sales", head: "Nour El-Din", teams: 3, employees: 12, status: "Active" },
  { id: "DEP-002", name: "HR / Recruitment", head: "Dina Samir", teams: 1, employees: 4, status: "Active" },
  { id: "DEP-003", name: "Finance", head: "Amr Khaled", teams: 1, employees: 3, status: "Active" },
  { id: "DEP-004", name: "Backoffice", head: "Laila Hassan", teams: 1, employees: 5, status: "Active" },
  { id: "DEP-005", name: "Marketing", head: "Tamer Said", teams: 1, employees: 3, status: "Active" },
  { id: "DEP-006", name: "Marketplace Operations", head: "Rania Youssef", teams: 1, employees: 2, status: "Active" },
  { id: "DEP-007", name: "Executive", head: "CEO", teams: 0, employees: 2, status: "Active" },
];

// ── STAFF / EMPLOYEES ──
export const STAFF = [
  { id: "A001", name: "Ahmed Hassan", department: "Sales", title: "Senior Sales Executive", branch: "New Cairo", manager: "Sales Manager", status: "Active", type: "Employee", email: "ahmed@homesbrokerage.eg", phone: "+20 100 111 0001", joinDate: "2023-06-01" },
  { id: "A002", name: "Fatma Ibrahim", department: "Sales", title: "Sales Agent", branch: "6th October", manager: "Omar Sherif", status: "Active", type: "Employee", email: "fatma@homesbrokerage.eg", phone: "+20 100 111 0002", joinDate: "2023-07-15" },
  { id: "A003", name: "Mohamed Ali", department: "Sales", title: "Team Leader", branch: "Sheikh Zayed", manager: "Tarek Amin", status: "Active", type: "Team Leader", email: "mali@homesbrokerage.eg", phone: "+20 100 111 0003", joinDate: "2022-03-10" },
  { id: "A004", name: "Nour El-Din", department: "Sales", title: "Sales Manager", branch: "New Cairo", manager: "CEO", status: "Active", type: "Sales Manager", email: "nour@homesbrokerage.eg", phone: "+20 100 111 0004", joinDate: "2021-09-01" },
  { id: "A005", name: "Yasmin Adel", department: "Sales", title: "Sales Agent", branch: "Heliopolis", manager: "Sales Manager", status: "Suspended", type: "Employee", email: "yasmin@homesbrokerage.eg", phone: "+20 100 111 0005", joinDate: "2023-11-20" },
  { id: "A006", name: "Sales Manager", department: "Sales", title: "Sales Manager", branch: "New Cairo", manager: "CEO", status: "Active", type: "Sales Manager", email: "karim@homesbrokerage.eg", phone: "+20 100 111 0006", joinDate: "2021-05-01" },
  { id: "A007", name: "Hana Mahmoud", department: "Sales", title: "Junior Sales", branch: "6th October", manager: "Omar Sherif", status: "Pending", type: "Employee", email: "hana@homesbrokerage.eg", phone: "+20 100 111 0007", joinDate: "2024-01-10" },
  { id: "A008", name: "Omar Sherif", department: "Sales", title: "Team Leader", branch: "6th October", manager: "Nour El-Din", status: "Active", type: "Team Leader", email: "omar@homesbrokerage.eg", phone: "+20 100 111 0008", joinDate: "2022-08-15" },
];

// ── LEADS ──
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

// ── DEALS ──
export const DEALS = [
  { id: "D-501", lead: "Sara Ali", owner: "Fatma Ibrahim", team: "Alpha", project: "ZED East", developer: "Ora", stage: "Negotiation", value: 12200000, commission: 2.0, status: "Active", created: "2024-01-14" },
  { id: "D-502", lead: "Youssef Tarek", owner: "Fatma Ibrahim", team: "Alpha", project: "Hyde Park", developer: "Hyde Park", stage: "Reservation", value: 11200000, commission: 1.8, status: "Active", created: "2024-01-10" },
  { id: "D-503", lead: "Nour Ibrahim", owner: "Hana Mahmoud", team: "Beta", project: "Hacienda Bay", developer: "Palm Hills", stage: "Contracting", value: 16000000, commission: 2.2, status: "Active", created: "2024-01-12" },
  { id: "D-504", lead: "Mohamed Hassan", owner: "Ahmed Hassan", team: "Alpha", project: "Palm Hills New Cairo", developer: "Palm Hills", stage: "Qualified", value: 8500000, commission: 2.0, status: "Active", created: "2024-01-15" },
  { id: "D-505", lead: "Tarek Mansour", owner: "Ahmed Hassan", team: "Alpha", project: "Midtown", developer: "Better Home", stage: "Closed Lost", value: 4500000, commission: 1.5, lostReason: "Budget exceeded", status: "Closed", created: "2024-01-10" },
];

// ── TASKS ──
export const TASKS = [
  { id: "T-001", title: "Follow up with Mohamed Hassan", type: "Call", owner: "Ahmed Hassan", lead: "L-1001", due: "2024-01-18", priority: "High", status: "Pending" },
  { id: "T-002", title: "Schedule tour - ZED East", type: "Tour", owner: "Fatma Ibrahim", lead: "L-1002", due: "2024-01-19", priority: "High", status: "Completed" },
  { id: "T-003", title: "Send payment plan details", type: "WhatsApp", owner: "Hana Mahmoud", lead: "L-1004", due: "2024-01-17", priority: "Medium", status: "Overdue" },
  { id: "T-004", title: "Qualification call - Layla Ahmed", type: "Call", owner: null, lead: "L-1005", due: "2024-01-20", priority: "Medium", status: "Pending" },
  { id: "T-005", title: "Contract review - Hyde Park", type: "Contract", owner: "Fatma Ibrahim", lead: "L-1007", due: "2024-01-21", priority: "High", status: "Pending" },
  { id: "T-006", title: "Finance follow-up on Hacienda deal", type: "Finance", owner: "Hana Mahmoud", lead: "L-1004", due: "2024-01-22", priority: "High", status: "Pending" },
];

// ── ONBOARDING APPLICATIONS ──
export const ONBOARDING = [
  { id: "APP001", applicant: "Mona Fawzy", type: "Agent", date: "2024-01-15", status: "Submitted", department: "Sales", branch: "New Cairo" },
  { id: "APP002", applicant: "Khaled Magdy", type: "Employee", date: "2024-01-10", status: "Under Review", department: "Sales", branch: "6th October" },
  { id: "APP003", applicant: "Rania Youssef", type: "Agent", date: "2024-01-08", status: "Missing Documents", department: "Sales", branch: "Sheikh Zayed" },
  { id: "APP004", applicant: "Tamer Said", type: "Employee", date: "2023-12-20", status: "Approved", department: "Marketing", branch: "New Cairo" },
  { id: "APP005", applicant: "Laila Hassan", type: "Agent", date: "2023-12-15", status: "Training Pending", department: "Sales", branch: "Maadi" },
  { id: "APP006", applicant: "Youssef Nader", type: "Agent", date: "2024-01-12", status: "Interview Pending", department: "Sales", branch: "Heliopolis" },
  { id: "APP007", applicant: "Nadia Gamal", type: "Employee", date: "2023-12-01", status: "Rejected", department: "HR", branch: "New Cairo" },
];

// ── DOCUMENTS ──
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

// ── RECRUITMENT / JOB VACANCIES ──
export const JOBS = [
  { id: "JOB-001", title: "Senior Sales Agent", department: "Sales", location: "New Cairo", type: "Full-time", mode: "On-site", headcount: 3, hiringManager: "Sales Manager", status: "Published", applicants: 12, created: "2024-01-05" },
  { id: "JOB-002", title: "Junior Sales Agent", department: "Sales", location: "6th October", type: "Full-time", mode: "On-site", headcount: 5, hiringManager: "Omar Sherif", status: "Published", applicants: 28, created: "2024-01-08" },
  { id: "JOB-003", title: "HR Coordinator", department: "HR / Recruitment", location: "New Cairo", type: "Full-time", mode: "Hybrid", headcount: 1, hiringManager: "Dina Samir", status: "Draft", applicants: 0, created: "2024-01-15" },
  { id: "JOB-004", title: "Finance Analyst", department: "Finance", location: "New Cairo", type: "Full-time", mode: "On-site", headcount: 1, hiringManager: "Amr Khaled", status: "Closed", applicants: 8, created: "2023-12-01" },
];

export const CANDIDATES = [
  { id: "CAN-001", name: "Amira El-Sayed", job: "Senior Sales Agent", stage: "Interview", score: 85, source: "Careers Page", applied: "2024-01-10", interviewer: "Sales Manager" },
  { id: "CAN-002", name: "Hassan Nabil", job: "Senior Sales Agent", stage: "Screening", score: null, source: "Referral", applied: "2024-01-12", interviewer: null },
  { id: "CAN-003", name: "Fatma Youssef", job: "Junior Sales Agent", stage: "Offer", score: 92, source: "Careers Page", applied: "2024-01-06", interviewer: "Omar Sherif" },
  { id: "CAN-004", name: "Ali Mostafa", job: "Junior Sales Agent", stage: "Rejected", score: 45, source: "LinkedIn", applied: "2024-01-09", interviewer: "Sales Manager" },
  { id: "CAN-005", name: "Nora Adel", job: "Senior Sales Agent", stage: "Applied", score: null, source: "Careers Page", applied: "2024-01-16", interviewer: null },
  { id: "CAN-006", name: "Khaled Samir", job: "HR Coordinator", stage: "Applied", score: null, source: "LinkedIn", applied: "2024-01-17", interviewer: null },
];

// ── TRAINING COURSES ──
export const TRAINING = [
  { id: "CRS-001", title: "Real Estate Fundamentals", progress: 100, score: 92, due: "2024-11-30", status: "Completed", required: true },
  { id: "CRS-002", title: "Anti-Money Laundering Compliance", progress: 65, score: null, due: "2024-12-15", status: "In Progress", required: true },
  { id: "CRS-003", title: "Egyptian Real Estate Regulations & Ethics", progress: 40, score: null, due: "2024-12-20", status: "In Progress", required: true },
  { id: "CRS-004", title: "CRM Platform Essentials", progress: 100, score: 88, due: "2024-11-25", status: "Completed", required: true },
  { id: "CRS-005", title: "Matrix EGMLS Navigation", progress: 0, score: null, due: "2025-01-10", status: "Locked", required: true },
  { id: "CRS-006", title: "Advanced Negotiation Skills", progress: 20, score: null, due: "2025-02-15", status: "In Progress", required: false },
  { id: "CRS-007", title: "Customer Communication Excellence", progress: 0, score: null, due: "2025-03-01", status: "Not Started", required: false },
];

// ── COMMISSION POLICIES ──
export const COMMISSION_POLICIES = [
  { id: "COM-001", developer: "Palm Hills", project: "Palm Hills New Cairo", rate: 2.0, override: false, status: "Active" },
  { id: "COM-002", developer: "Ora", project: "ZED East", rate: 2.0, override: false, status: "Active" },
  { id: "COM-003", developer: "Hyde Park", project: "Hyde Park New Cairo", rate: 1.8, override: false, status: "Active" },
  { id: "COM-004", developer: "Palm Hills", project: "Hacienda Bay", rate: 2.2, override: true, overrideReason: "Premium launch incentive", approver: "Nour El-Din", status: "Active" },
  { id: "COM-005", developer: "Talaat Moustafa", project: "Madinaty", rate: 1.5, override: false, status: "Active" },
  { id: "COM-006", developer: "Sodic", project: "Sodic West", rate: 1.8, override: false, status: "Active" },
];

// ── AUDIT LOGS ──
export const AUDIT_LOGS = [
  { id: "AUD-001", action: "Lead Assigned", actor: "Nour El-Din", target: "L-1001 → Ahmed Hassan", module: "CRM", timestamp: "2024-01-15 09:23:44", detail: "Lead assigned from manager queue" },
  { id: "AUD-002", action: "Role Created", actor: "System Admin", target: "Senior Agent Role", module: "Backoffice", timestamp: "2024-01-14 14:11:02", detail: "New role with 12 permissions created" },
  { id: "AUD-003", action: "Commission Override", actor: "Sales Manager", target: "D-503 Hacienda Bay", module: "Finance", timestamp: "2024-01-13 16:45:00", detail: "Rate changed from 2.0% to 2.2% — Premium launch" },
  { id: "AUD-004", action: "Document Rejected", actor: "Backoffice Admin", target: "DOC006 National ID", module: "Backoffice", timestamp: "2024-01-12 11:30:00", detail: "Image quality insufficient" },
  { id: "AUD-005", action: "Employee Suspended", actor: "HR Manager", target: "A005 Yasmin Adel", module: "HR", timestamp: "2024-01-11 10:00:00", detail: "Training compliance overdue" },
  { id: "AUD-006", action: "Job Published", actor: "Dina Samir", target: "JOB-001 Senior Sales Agent", module: "Recruitment", timestamp: "2024-01-05 08:30:00", detail: "Published to careers page" },
  { id: "AUD-007", action: "Deal Stage Changed", actor: "Fatma Ibrahim", target: "D-502 → Reservation", module: "CRM", timestamp: "2024-01-10 15:20:00", detail: "Stage moved from Negotiation to Reservation" },
  { id: "AUD-008", action: "SSO Login", actor: "Ahmed Hassan", target: "Agent Session", module: "Security", timestamp: "2024-01-18 08:00:00", detail: "SSO authenticated via Microsoft Entra" },
];

// ── ROLES & PERMISSIONS ──
export const ROLES = [
  { id: "ROLE-001", name: "Sales Agent", department: "Sales", permissions: 8, users: 4, status: "Active", desc: "Standard CRM access for lead management, tasks, and deals" },
  { id: "ROLE-002", name: "Team Leader", department: "Sales", permissions: 14, users: 2, status: "Active", desc: "Team oversight, lead distribution, and reporting" },
  { id: "ROLE-003", name: "Sales Manager", department: "Sales", permissions: 22, users: 2, status: "Active", desc: "Manager queue, hierarchy assignment, approvals" },
  { id: "ROLE-004", name: "HR Recruiter", department: "HR / Recruitment", permissions: 12, users: 2, status: "Active", desc: "Job publishing, candidate pipeline, onboarding" },
  { id: "ROLE-005", name: "Finance Officer", department: "Finance", permissions: 10, users: 2, status: "Active", desc: "Commission policies, finance validation, reports" },
  { id: "ROLE-006", name: "Backoffice Admin", department: "Backoffice", permissions: 28, users: 3, status: "Active", desc: "Full governance, roles, departments, audit" },
  { id: "ROLE-007", name: "Super Admin", department: "System", permissions: 45, users: 1, status: "Active", desc: "Full platform access and configuration" },
];

// ── MARKETPLACE / PROJECTS ──
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

// ── EXCEPTIONS ──
export const EXCEPTIONS = [
  { id:'EXC-001', type:'Commission Dispute', title:'Unauthorized discount on North Edge deal', severity:'Critical', reporter:'Nour El-Din', assignee:'Finance Team', status:'Open', created:'2024-01-15' },
  { id:'EXC-002', type:'Training Overdue', title:'3 agents have overdue mandatory training', severity:'High', reporter:'System', assignee:'HR Team', status:'Open', created:'2024-01-14' },
  { id:'EXC-003', type:'Document Missing', title:'Brokerage agreement missing for Yasmin Adel', severity:'Medium', reporter:'Backoffice', assignee:'Yasmin Adel', status:'Pending', created:'2024-01-12' },
  { id:'EXC-004', type:'Access Violation', title:'Attempt to access restricted financial data', severity:'Critical', reporter:'System', assignee:'System Admin', status:'Resolved', created:'2024-01-10' },
  { id:'EXC-005', type:'Data Quality', title:'Duplicate lead flagged for manual review', severity:'Low', reporter:'CRM System', assignee:'Sales Ops', status:'Open', created:'2024-01-16' },
  { id:'EXC-006', type:'SLA Breach', title:'Lead response time exceeded 4-hour SLA', severity:'High', reporter:'System', assignee:'Sales Manager', status:'Resolved', created:'2024-01-11' },
];

// ── FINANCE ──
export const DEALS_REV = [
  { id:'DL001', unit:'PH-BAD-A101', developer:'Palm Hills', agent:'Ahmed Hassan', price:4500000, revenue:90000, status:'Approved' },
  { id:'DL002', unit:'EM-VIL-B205', developer:'SODIC', agent:'Fatma Ibrahim', price:6200000, revenue:124000, status:'Pending' },
  { id:'DL003', unit:'MV-IC-C310', developer:'Mountain View', agent:'Mohamed Ali', price:3800000, revenue:76000, status:'Paid' },
  { id:'DL004', unit:'ORA-ZED-D102', developer:'Ora Developers', agent:'Sara Nabil', price:5100000, revenue:102000, status:'Approved' },
  { id:'DL005', unit:'CE-NC-E201', developer:'City Edge', agent:'Dina Samir', price:2900000, revenue:58000, status:'Pending' },
  { id:'DL006', unit:'TM-OW-F305', developer:'Ora Developers', agent:'Ahmed Hassan', price:7800000, revenue:156000, status:'Paid' },
  { id:'DL007', unit:'SD-EST-G110', developer:'SODIC', agent:'Mohamed Ali', price:9200000, revenue:184000, status:'Approved' },
];

export const COMM_ENGINE = [
  { id:'CE-01', deal:'PH-BAD-A101', agent:'Ahmed Hassan', pool:135000, agentShare:45000, tlShare:13500, companyShare:76500, status:'Approved' },
  { id:'CE-02', deal:'EM-VIL-B205', agent:'Fatma Ibrahim', pool:186000, agentShare:62000, tlShare:18600, companyShare:105400, status:'Pending' },
  { id:'CE-03', deal:'MV-IC-C310', agent:'Mohamed Ali', pool:114000, agentShare:38000, tlShare:11400, companyShare:64600, status:'Paid' },
  { id:'CE-04', deal:'ORA-ZED-D102', agent:'Sara Nabil', pool:153000, agentShare:51000, tlShare:15300, companyShare:86700, status:'Approved' },
  { id:'CE-05', deal:'CE-NC-E201', agent:'Dina Samir', pool:87000, agentShare:29000, tlShare:8700, companyShare:49300, status:'Pending' },
  { id:'CE-06', deal:'TM-OW-F305', agent:'Ahmed Hassan', pool:234000, agentShare:78000, tlShare:23400, companyShare:132600, status:'Paid' },
  { id:'CE-07', deal:'SD-EST-G110', agent:'Mohamed Ali', pool:276000, agentShare:92000, tlShare:27600, companyShare:156400, status:'Approved' },
];

export const AGENT_DUES = [
  { id:'AD-01', agent:'Ahmed Hassan', totalEarned:123000, paid:78000, pending:45000, status:'Partial' },
  { id:'AD-02', agent:'Fatma Ibrahim', totalEarned:62000, paid:0, pending:62000, status:'Unpaid' },
  { id:'AD-03', agent:'Mohamed Ali', totalEarned:130000, paid:38000, pending:92000, status:'Partial' },
  { id:'AD-04', agent:'Sara Nabil', totalEarned:51000, paid:51000, pending:0, status:'Cleared' },
  { id:'AD-05', agent:'Dina Samir', totalEarned:29000, paid:0, pending:29000, status:'Unpaid' },
  { id:'AD-06', agent:'Hana Mahmoud', totalEarned:0, paid:0, pending:0, status:'No Deals' },
];

export const PAYROLL = [
  { id:'PAY-01', name:'Ahmed Hassan', title:'Senior Sales Executive', base:18000, commission:37500, deductions:3200, net:52300, period:'January 2024', status:'Approved' },
  { id:'PAY-02', name:'Mohamed Ali', title:'Team Leader', base:25000, commission:66000, deductions:4500, net:86500, period:'January 2024', status:'Approved' },
  { id:'PAY-03', name:'Nour El-Din', title:'Sales Manager', base:35000, commission:135000, deductions:6200, net:163800, period:'January 2024', status:'Draft' },
  { id:'PAY-04', name:'Omar Sherif', title:'Team Leader', base:22000, commission:54000, deductions:3800, net:72200, period:'January 2024', status:'Approved' },
  { id:'PAY-05', name:'Sara Nabil', title:'Sales Executive', base:15000, commission:28500, deductions:2800, net:40700, period:'January 2024', status:'Paid' },
  { id:'PAY-06', name:'Hana Mahmoud', title:'Junior Sales', base:12000, commission:0, deductions:2100, net:9900, period:'January 2024', status:'Draft' },
];

// ── MASTER DATA ──
// Property/photo helper — Unsplash CDN, no API key needed. Declared here so
// both DEVELOPERS (below) and LISTINGS (further down) can use it. Must stay
// above DEVELOPERS since `const` arrow functions are NOT hoisted.
const _img = (id, w = 800) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

// Each developer carries a brand-color pair (gradient) used to render an
// initials-style logo card and a tagline visible in the directory grid.
export const DEVELOPERS = [
  { id:'DEV-001', name:'Palm Hills',       country:'Egypt', projects:12, status:'Active',  initials:'PH', color1:'#0f172a', color2:'#334155', tagline:'Premium gated communities · West & East Cairo, North Coast', image:_img('1600566753190-17f0baa2a6c3', 600) },
  { id:'DEV-002', name:'Ora Developers',   country:'Egypt', projects:8,  status:'Active',  initials:'OR', color1:'#1e3a8a', color2:'#3b82f6', tagline:'Mixed-use icons — ZED East, ZED West, ZED Strip', image:_img('1564013799919-ab600027ffc6', 600) },
  { id:'DEV-003', name:'SODIC',            country:'Egypt', projects:6,  status:'Active',  initials:'SO', color1:'#7c2d12', color2:'#ea580c', tagline:'Master-planned communities & lifestyle compounds', image:_img('1600585154526-990dced4db0d', 600) },
  { id:'DEV-004', name:'Mountain View',    country:'Egypt', projects:10, status:'Active',  initials:'MV', color1:'#064e3b', color2:'#10b981', tagline:'Smart living iCities & resort destinations', image:_img('1600585154340-be6161a56a0c', 600) },
  { id:'DEV-005', name:'Hyde Park',        country:'Egypt', projects:4,  status:'Active',  initials:'HP', color1:'#581c87', color2:'#a855f7', tagline:'Iconic central park communities — New Cairo & North Coast', image:_img('1572120360610-d971b9d7767c', 600) },
  { id:'DEV-006', name:'Talaat Moustafa',  country:'Egypt', projects:15, status:'Active',  initials:'TM', color1:'#7f1d1d', color2:'#dc2626', tagline:'Madinaty, Al Rehab, Celia — large-scale townships', image:_img('1599809275671-b5942cabc7a2', 600) },
  { id:'DEV-007', name:'City Edge',        country:'Egypt', projects:5,  status:'Active',  initials:'CE', color1:'#1e3a8a', color2:'#0ea5e9', tagline:'Public-sector developer — North Edge, Etapa, Zahya', image:_img('1605276374104-dee2a0ed3cd6', 600) },
  { id:'DEV-008', name:'Better Home',      country:'Egypt', projects:3,  status:'Pending', initials:'BH', color1:'#831843', color2:'#ec4899', tagline:'Boutique residential & administrative projects', image:_img('1568605114967-8130f3a36994', 600) },
];

export const COMPOUNDS = [
  { id:'CMP-001', name:'New Cairo Compounds', developer:'Multiple', city:'New Cairo', projects:8, status:'Active' },
  { id:'CMP-002', name:'North Coast Resorts', developer:'Multiple', city:'North Coast', projects:5, status:'Active' },
  { id:'CMP-003', name:'6th October Zone', developer:'Multiple', city:'6th October', projects:4, status:'Active' },
  { id:'CMP-004', name:'Sheikh Zayed', developer:'Multiple', city:'Sheikh Zayed', projects:3, status:'Active' },
];

export const UNIT_TYPES = [
  { id:'UT-001', name:'Apartment', category:'Residential', status:'Active' },
  { id:'UT-002', name:'Villa', category:'Residential', status:'Active' },
  { id:'UT-003', name:'Townhouse', category:'Residential', status:'Active' },
  { id:'UT-004', name:'Duplex', category:'Residential', status:'Active' },
  { id:'UT-005', name:'Penthouse', category:'Residential', status:'Active' },
  { id:'UT-006', name:'Chalet', category:'Resort', status:'Active' },
  { id:'UT-007', name:'Twin House', category:'Residential', status:'Active' },
  { id:'UT-008', name:'Studio', category:'Residential', status:'Active' },
];

export const CITIES = [
  { id:'CTY-001', name:'Cairo', region:'Greater Cairo', areas:15, status:'Active' },
  { id:'CTY-002', name:'Giza', region:'Greater Cairo', areas:8, status:'Active' },
  { id:'CTY-003', name:'Alexandria', region:'North Coast', areas:6, status:'Active' },
  { id:'CTY-004', name:'North Coast', region:'Coastal', areas:12, status:'Active' },
  { id:'CTY-005', name:'Ain Sokhna', region:'Red Sea', areas:4, status:'Active' },
];

export const AREAS = [
  { id:'AR-001', name:'New Cairo', city:'Cairo', projects:12, status:'Active' },
  { id:'AR-002', name:'6th October', city:'Giza', projects:8, status:'Active' },
  { id:'AR-003', name:'Sheikh Zayed', city:'Giza', projects:6, status:'Active' },
  { id:'AR-004', name:'Heliopolis', city:'Cairo', projects:3, status:'Active' },
  { id:'AR-005', name:'Maadi', city:'Cairo', projects:2, status:'Active' },
  { id:'AR-006', name:'Sahel', city:'North Coast', projects:10, status:'Active' },
];

export const BRANCHES = [
  { id:'BR-001', name:'New Cairo HQ', city:'New Cairo', manager:'Nour El-Din', staff:18, status:'Active' },
  { id:'BR-002', name:'6th October', city:'6th October', manager:'Omar Sherif', staff:8, status:'Active' },
  { id:'BR-003', name:'Sheikh Zayed', city:'Sheikh Zayed', manager:'Mohamed Ali', staff:6, status:'Active' },
  { id:'BR-004', name:'Heliopolis', city:'Heliopolis', manager:'—', staff:0, status:'Planned' },
];

export const TEAMS = [
  { id:'TM-001', name:'Alpha', department:'Sales', leader:'Sales Manager', members:5, status:'Active' },
  { id:'TM-002', name:'Beta', department:'Sales', leader:'Omar Sherif', members:4, status:'Active' },
  { id:'TM-003', name:'Gamma', department:'Sales', leader:'Mohamed Ali', members:3, status:'Active' },
];

export const EMPLOYMENT_CATEGORIES = [
  { id:'EC-001', name:'Licensed Agent', desc:'Full licensed real estate agent', status:'Active' },
  { id:'EC-002', name:'Trainee Agent', desc:'Agent in training period', status:'Active' },
  { id:'EC-003', name:'Team Leader', desc:'Sales team leadership role', status:'Active' },
  { id:'EC-004', name:'Sales Manager', desc:'Senior sales management', status:'Active' },
  { id:'EC-005', name:'Backoffice Staff', desc:'Administrative and operations', status:'Active' },
];

export const PAYOUT_CYCLES = [
  { id:'PC-001', name:'Monthly Agent Payout', frequency:'Monthly', nextDate:'2024-02-01', status:'Active' },
  { id:'PC-002', name:'Quarterly TL Bonus', frequency:'Quarterly', nextDate:'2024-04-01', status:'Active' },
  { id:'PC-003', name:'Annual Performance', frequency:'Annually', nextDate:'2025-01-01', status:'Scheduled' },
];

export const EXPENSE_CATEGORIES = [
  { id:'EX-001', name:'Office Rent', type:'Fixed', budget:'EGP 45,000/mo', status:'Active' },
  { id:'EX-002', name:'Marketing', type:'Variable', budget:'EGP 80,000/mo', status:'Active' },
  { id:'EX-003', name:'Staff Salaries', type:'Fixed', budget:'EGP 127,000/mo', status:'Active' },
  { id:'EX-004', name:'Utilities', type:'Fixed', budget:'EGP 8,000/mo', status:'Active' },
  { id:'EX-005', name:'Training', type:'Variable', budget:'EGP 15,000/mo', status:'Active' },
];

export const LEAD_SOURCES = [
  { id:'LS-001', name:'Website', status:'Active' },
  { id:'LS-002', name:'Social Media', status:'Active' },
  { id:'LS-003', name:'Referral', status:'Active' },
  { id:'LS-004', name:'Walk-in', status:'Active' },
  { id:'LS-005', name:'Developer Event', status:'Active' },
  { id:'LS-006', name:'Cold Call', status:'Active' },
  { id:'LS-007', name:'Property Fair', status:'Active' },
  { id:'LS-008', name:'Campaign', status:'Active' },
  { id:'LS-009', name:'Marketplace', status:'Active' },
];

// ── AGENT NOTIFICATIONS ──
export const AGENT_NOTIFICATIONS = [
  { id:'N-001', text:'Your National ID has been approved', time:'2 hours ago', type:'success' },
  { id:'N-002', text:'Training module "Anti-Money Laundering" is due in 3 days', time:'5 hours ago', type:'warning' },
  { id:'N-003', text:'Welcome to Homes! Complete your onboarding checklist to get started.', time:'1 day ago', type:'info' },
  { id:'N-004', text:'Your MLS ID verification is in progress. Estimated: 2-3 business days.', time:'2 days ago', type:'info' },
  { id:'N-005', text:'Please upload your Proof of Address document', time:'3 days ago', type:'warning' },
];

// ── AGENT DOCUMENTS (personal) ──
export const AGENT_DOCS = [
  { id:'AD-001', doc:'National ID', type:'Identity', status:'Approved', date:'2024-01-14' },
  { id:'AD-002', doc:'Tax Card', type:'Financial', status:'Approved', date:'2024-01-14' },
  { id:'AD-003', doc:'RERA License', type:'Regulatory', status:'Approved', date:'2024-01-12' },
  { id:'AD-004', doc:'Brokerage Agreement', type:'Legal', status:'Approved', date:'2024-01-10' },
  { id:'AD-005', doc:'Criminal Record', type:'Legal', status:'Approved', date:'2024-01-08' },
  { id:'AD-006', doc:'Bank Details', type:'Financial', status:'Approved', date:'2024-01-08' },
  { id:'AD-007', doc:'Profile Photo', type:'Identity', status:'Approved', date:'2024-01-05' },
  { id:'AD-008', doc:'Proof of Address', type:'Identity', status:'Pending', date:'—' },
  { id:'AD-009', doc:'Insurance', type:'Financial', status:'Pending', date:'—' },
];

// ── SUPPORT TICKETS (Agent Help) ──
export const SUPPORT_TICKETS = [
  { id:'TKT-001', subject:'MLS ID activation delay', category:'Operations', priority:'High', status:'Open', created:'2024-01-16' },
  { id:'TKT-002', subject:'CRM login issue', category:'IT Support', priority:'Medium', status:'Resolved', created:'2024-01-12' },
  { id:'TKT-003', subject:'Commission inquiry — D-501', category:'Finance', priority:'Low', status:'Resolved', created:'2024-01-10' },
  { id:'TKT-004', subject:'Profile photo upload error', category:'IT Support', priority:'Low', status:'Resolved', created:'2024-01-08' },
  { id:'TKT-005', subject:'Payout schedule clarification', category:'Finance', priority:'Low', status:'Resolved', created:'2024-01-05' },
];

// ── CRM ACTIVITY LOG ──
export const CRM_ACTIVITY = [
  { id: 'ACT-001', action: 'Lead Created', detail: 'Mohamed Hassan added via Marketplace', actor: 'System', time: '2 min ago', type: 'lead' },
  { id: 'ACT-002', action: 'Deal Stage Changed', detail: 'D-502 Hyde Park → Reservation', actor: 'Fatma Ibrahim', time: '15 min ago', type: 'deal' },
  { id: 'ACT-003', action: 'Task Completed', detail: 'Schedule tour - ZED East', actor: 'Fatma Ibrahim', time: '1 hour ago', type: 'task' },
  { id: 'ACT-004', action: 'Lead Assigned', detail: 'L-1001 → Ahmed Hassan', actor: 'Nour El-Din', time: '2 hours ago', type: 'lead' },
  { id: 'ACT-005', action: 'Call Logged', detail: 'Follow up with Karim Fouad', actor: 'Omar Sherif', time: '3 hours ago', type: 'task' },
  { id: 'ACT-006', action: 'Deal Created', detail: 'D-504 Palm Hills New Cairo — EGP 8.5M', actor: 'Ahmed Hassan', time: '4 hours ago', type: 'deal' },
  { id: 'ACT-007', action: 'WhatsApp Sent', detail: 'Payment plan details to Nour Ibrahim', actor: 'Hana Mahmoud', time: '5 hours ago', type: 'task' },
  { id: 'ACT-008', action: 'Lead Lost', detail: 'Tarek Mansour — Budget exceeded', actor: 'Ahmed Hassan', time: '6 hours ago', type: 'lead' },
];

// ── LISTINGS / INVENTORY ──
// (`_img` is declared once near the top of this file, above DEVELOPERS, so
// listings can reuse it without redeclaring.)
export const LISTINGS = [
  { id:'LST-001', project:'Palm Hills New Cairo', developer:'Palm Hills', unitType:'Villa', unitCode:'PH-NC-V101', area:320, bedrooms:4, bathrooms:3, floor:'Ground', price:12500000, paymentPlan:'10% down, 7 years', status:'Available', features:['Garden','Pool','Smart Home','Garage'], created:'2024-01-05', image:_img('1613490493576-7fde63acd811') },
  { id:'LST-002', project:'ZED East', developer:'Ora', unitType:'Apartment', unitCode:'ZED-A205', area:180, bedrooms:3, bathrooms:2, floor:'2nd', price:8200000, paymentPlan:'15% down, 8 years', status:'Available', features:['Club Access','Gym','Landscape View'], created:'2024-01-06', image:_img('1564013799919-ab600027ffc6') },
  { id:'LST-003', project:'Hacienda Bay', developer:'Palm Hills', unitType:'Chalet', unitCode:'HB-CH-A12', area:140, bedrooms:2, bathrooms:2, floor:'Ground', price:16000000, paymentPlan:'20% down, 5 years', status:'Reserved', features:['Beach Access','Pool','Furnished'], created:'2024-01-07', image:_img('1572120360610-d971b9d7767c') },
  { id:'LST-004', project:'Hyde Park', developer:'Hyde Park', unitType:'Townhouse', unitCode:'HP-TH-B304', area:260, bedrooms:4, bathrooms:3, floor:'Ground+1', price:11200000, paymentPlan:'10% down, 8 years', status:'Available', features:['Garden','Roof','Corner Unit'], created:'2024-01-08', image:_img('1600566753190-17f0baa2a6c3') },
  { id:'LST-005', project:'Madinaty', developer:'Talaat Moustafa', unitType:'Apartment', unitCode:'MD-APT-C110', area:150, bedrooms:3, bathrooms:2, floor:'1st', price:5200000, paymentPlan:'25% down, 6 years', status:'Available', features:['Park View','Balcony','Storage'], created:'2024-01-09', image:_img('1600585154340-be6161a56a0c') },
  { id:'LST-006', project:'Sodic West', developer:'Sodic', unitType:'Twin House', unitCode:'SW-TW-D201', area:280, bedrooms:4, bathrooms:3, floor:'Ground+1', price:9800000, paymentPlan:'15% down, 7 years', status:'Sold', features:['Garden','Smart Home','Club Access'], created:'2024-01-03', image:_img('1600596542815-ffad4c1539a9') },
  { id:'LST-007', project:'Mountain View', developer:'Mountain View', unitType:'Duplex', unitCode:'MV-DX-E105', area:220, bedrooms:3, bathrooms:3, floor:'3rd+4th', price:7800000, paymentPlan:'10% down, 8 years', status:'Available', features:['Terrace','View','Double Height'], created:'2024-01-10', image:_img('1600585154526-990dced4db0d') },
  { id:'LST-008', project:'Palm Hills New Cairo', developer:'Palm Hills', unitType:'Penthouse', unitCode:'PH-NC-PH801', area:350, bedrooms:4, bathrooms:4, floor:'8th', price:18500000, paymentPlan:'20% down, 6 years', status:'Available', features:['Roof Terrace','Panoramic View','Private Elevator','Pool'], created:'2024-01-11', image:_img('1600607687939-ce8a6c25118c') },
];

// ── TOURS ──
export const TOURS = [
  { id:'TOUR-001', leadId:'L-1001', leadName:'Mohamed Hassan', listingId:'LST-001', property:'Palm Hills New Cairo — PH-NC-V101', date:'2024-01-20', time:'10:00 AM', agent:'Ahmed Hassan', status:'Completed', feedback:'Very interested, loved the garden. Wants to discuss payment plan.', rating:5 },
  { id:'TOUR-002', leadId:'L-1002', leadName:'Sara Ali', listingId:'LST-002', property:'ZED East — ZED-A205', date:'2024-01-19', time:'2:00 PM', agent:'Fatma Ibrahim', status:'Completed', feedback:'Good location but wants larger unit. Will check 3BR options.', rating:4 },
  { id:'TOUR-003', leadId:'L-1004', leadName:'Nour Ibrahim', listingId:'LST-003', property:'Hacienda Bay — HB-CH-A12', date:'2024-01-22', time:'11:00 AM', agent:'Hana Mahmoud', status:'Scheduled', feedback:null, rating:null },
  { id:'TOUR-004', leadId:'L-1007', leadName:'Youssef Tarek', listingId:'LST-004', property:'Hyde Park — HP-TH-B304', date:'2024-01-18', time:'3:00 PM', agent:'Fatma Ibrahim', status:'Completed', feedback:'Ready to reserve. Proceeding with reservation deposit.', rating:5 },
  { id:'TOUR-005', leadId:'L-1003', leadName:'Karim Fouad', listingId:'LST-005', property:'Madinaty — MD-APT-C110', date:'2024-01-23', time:'10:00 AM', agent:'Omar Sherif', status:'Scheduled', feedback:null, rating:null },
  { id:'TOUR-006', leadId:'L-1005', leadName:'Layla Ahmed', listingId:'LST-007', property:'Mountain View — MV-DX-E105', date:'2024-01-21', time:'4:00 PM', agent:'Ahmed Hassan', status:'No-Show', feedback:'Client did not attend. Reschedule needed.', rating:null },
  { id:'TOUR-007', leadId:'L-1008', leadName:'Mona Fawzy', listingId:'LST-007', property:'Mountain View — MV-DX-E105', date:'2024-01-24', time:'11:00 AM', agent:'Omar Sherif', status:'Scheduled', feedback:null, rating:null },
  { id:'TOUR-008', leadId:'L-1006', leadName:'Tarek Mansour', listingId:'LST-005', property:'Madinaty — MD-APT-C110', date:'2024-01-15', time:'1:00 PM', agent:'Ahmed Hassan', status:'Cancelled', feedback:'Client cancelled — budget exceeded.', rating:null },
];

// ── CONTRACTS ──
export const CONTRACTS = [
  { id:'CON-001', dealId:'D-502', leadName:'Youssef Tarek', project:'Hyde Park', unitCode:'HP-TH-B304', value:11200000, downPayment:1120000, downPct:10, installments:96, monthlyInstall:105000, stage:'Signed', createdDate:'2024-01-12', signDate:'2024-01-18', lawyer:'Mahmoud Samy', notes:'Standard contract. Client paid down payment via bank transfer.' },
  { id:'CON-002', dealId:'D-503', leadName:'Nour Ibrahim', project:'Hacienda Bay', unitCode:'HB-CH-A12', value:16000000, downPayment:3200000, downPct:20, installments:60, monthlyInstall:213333, stage:'Under Review', createdDate:'2024-01-14', signDate:null, lawyer:'Mahmoud Samy', notes:'Awaiting legal review. Expected sign within 5 business days.' },
  { id:'CON-003', dealId:'D-501', leadName:'Sara Ali', project:'ZED East', unitCode:'ZED-A205', value:12200000, downPayment:1830000, downPct:15, installments:96, monthlyInstall:108021, stage:'Draft', createdDate:'2024-01-16', signDate:null, lawyer:null, notes:'Contract being prepared. Unit selection confirmed.' },
  { id:'CON-004', dealId:'D-504', leadName:'Mohamed Hassan', project:'Palm Hills New Cairo', unitCode:'PH-NC-V101', value:8500000, downPayment:850000, downPct:10, installments:84, monthlyInstall:91071, stage:'Draft', createdDate:'2024-01-17', signDate:null, lawyer:null, notes:'Pending qualification completion.' },
  { id:'CON-005', dealId:'D-502', leadName:'Youssef Tarek', project:'Hyde Park', unitCode:'HP-TH-B304', value:11200000, downPayment:1120000, downPct:10, installments:96, monthlyInstall:105000, stage:'Registered', createdDate:'2024-01-10', signDate:'2024-01-15', lawyer:'Mahmoud Samy', notes:'Contract registered with Real Estate Publicity dept. Complete.' },
];

// ── LISTING SHARES ──
export const LISTING_SHARES = [
  { id:'SHR-001', listingId:'LST-001', property:'Palm Hills New Cairo V101', leadId:'L-1001', leadName:'Mohamed Hassan', channel:'WhatsApp', agent:'Ahmed Hassan', timestamp:'2024-01-15 10:30', response:'Interested' },
  { id:'SHR-002', listingId:'LST-002', property:'ZED East A205', leadId:'L-1002', leadName:'Sara Ali', channel:'Email', agent:'Fatma Ibrahim', timestamp:'2024-01-14 14:15', response:'Viewed' },
  { id:'SHR-003', listingId:'LST-003', property:'Hacienda Bay CH-A12', leadId:'L-1004', leadName:'Nour Ibrahim', channel:'WhatsApp', agent:'Hana Mahmoud', timestamp:'2024-01-13 09:45', response:'Interested' },
  { id:'SHR-004', listingId:'LST-004', property:'Hyde Park TH-B304', leadId:'L-1007', leadName:'Youssef Tarek', channel:'Call', agent:'Fatma Ibrahim', timestamp:'2024-01-12 16:00', response:'Interested' },
  { id:'SHR-005', listingId:'LST-005', property:'Madinaty APT-C110', leadId:'L-1003', leadName:'Karim Fouad', channel:'WhatsApp', agent:'Omar Sherif', timestamp:'2024-01-16 11:20', response:'No Response' },
  { id:'SHR-006', listingId:'LST-007', property:'Mountain View DX-E105', leadId:'L-1005', leadName:'Layla Ahmed', channel:'Email', agent:'Ahmed Hassan', timestamp:'2024-01-17 08:00', response:'Viewed' },
  { id:'SHR-007', listingId:'LST-001', property:'Palm Hills New Cairo V101', leadId:'L-1008', leadName:'Mona Fawzy', channel:'SMS', agent:'Omar Sherif', timestamp:'2024-01-18 13:30', response:'No Response' },
  { id:'SHR-008', listingId:'LST-008', property:'Palm Hills PH801', leadId:'L-1001', leadName:'Mohamed Hassan', channel:'WhatsApp', agent:'Ahmed Hassan', timestamp:'2024-01-16 15:45', response:'Interested' },
  { id:'SHR-009', listingId:'LST-004', property:'Hyde Park TH-B304', leadId:'L-1002', leadName:'Sara Ali', channel:'Call', agent:'Fatma Ibrahim', timestamp:'2024-01-15 10:00', response:'Viewed' },
  { id:'SHR-010', listingId:'LST-002', property:'ZED East A205', leadId:'L-1006', leadName:'Tarek Mansour', channel:'Email', agent:'Ahmed Hassan', timestamp:'2024-01-11 09:15', response:'No Response' },
];

// ── BUYER PREFERENCES (per lead) ──
export const BUYER_PREFERENCES = [
  { leadId:'L-1001', propertyTypes:['Villa','Townhouse'], locations:['New Cairo','Sheikh Zayed'], budgetMin:7000000, budgetMax:15000000, bedrooms:'4+', bathrooms:'3+', amenities:['Garden','Pool','Smart Home','Garage'], preferredDevelopers:['Palm Hills','Hyde Park'], timeline:'3 months', notes:'Prefers gated compound with international school nearby' },
  { leadId:'L-1002', propertyTypes:['Apartment','Duplex'], locations:['New Cairo'], budgetMin:8000000, budgetMax:14000000, bedrooms:'3', bathrooms:'2', amenities:['Club Access','Gym','Landscape View'], preferredDevelopers:['Ora','Sodic'], timeline:'6 months', notes:'Young couple, first home. Wants modern design.' },
  { leadId:'L-1003', propertyTypes:['Apartment'], locations:['New Cairo','Heliopolis'], budgetMin:3000000, budgetMax:6000000, bedrooms:'3', bathrooms:'2', amenities:['Park View','Balcony'], preferredDevelopers:['Talaat Moustafa'], timeline:'Immediate', notes:'Cash buyer, wants ready-to-move or near delivery.' },
  { leadId:'L-1004', propertyTypes:['Chalet','Villa'], locations:['North Coast'], budgetMin:12000000, budgetMax:20000000, bedrooms:'2-3', bathrooms:'2', amenities:['Beach Access','Pool','Furnished'], preferredDevelopers:['Palm Hills','Mountain View'], timeline:'6 months', notes:'Summer home, premium finishing required.' },
  { leadId:'L-1005', propertyTypes:['Twin House','Villa'], locations:['Sheikh Zayed','6th October'], budgetMin:8000000, budgetMax:12000000, bedrooms:'4', bathrooms:'3', amenities:['Garden','Smart Home','Club Access'], preferredDevelopers:['Sodic'], timeline:'1 year', notes:'Relocating from Maadi, needs good schools zone.' },
  { leadId:'L-1007', propertyTypes:['Townhouse'], locations:['New Cairo'], budgetMin:9000000, budgetMax:13000000, bedrooms:'4', bathrooms:'3', amenities:['Garden','Roof','Corner Unit'], preferredDevelopers:['Hyde Park'], timeline:'Immediate', notes:'Already visited, ready to reserve.' },
];

// ── SOURCE HISTORY (attribution per lead) ──
export const SOURCE_HISTORY = [
  { leadId:'L-1001', touchpoints:[{channel:'Marketplace',campaign:'New Cairo Launch',date:'2024-01-10',detail:'Viewed Palm Hills listing'},{channel:'WhatsApp',campaign:null,date:'2024-01-12',detail:'Agent sent payment plan'},{channel:'Call',campaign:null,date:'2024-01-14',detail:'Qualification call 15min'},{channel:'Tour',campaign:null,date:'2024-01-15',detail:'Site visit Palm Hills'}] },
  { leadId:'L-1002', touchpoints:[{channel:'Referral',campaign:'Broker Referral',date:'2024-01-08',detail:'Referred by external broker'},{channel:'Email',campaign:null,date:'2024-01-10',detail:'Brochure sent'},{channel:'Call',campaign:null,date:'2024-01-12',detail:'Discovery call'},{channel:'Tour',campaign:null,date:'2024-01-14',detail:'ZED East tour'}] },
  { leadId:'L-1003', touchpoints:[{channel:'Walk-in',campaign:'Branch Visit',date:'2024-01-16',detail:'Walked into New Cairo branch'}] },
  { leadId:'L-1004', touchpoints:[{channel:'Marketplace',campaign:'North Coast Summer',date:'2024-01-05',detail:'Hacienda Bay inquiry'},{channel:'WhatsApp',campaign:null,date:'2024-01-08',detail:'Video tour shared'},{channel:'Call',campaign:null,date:'2024-01-10',detail:'Budget discussion'},{channel:'WhatsApp',campaign:null,date:'2024-01-12',detail:'Payment plan details'}] },
  { leadId:'L-1005', touchpoints:[{channel:'Campaign',campaign:'Sheikh Zayed Promo',date:'2024-01-15',detail:'Facebook ad click'},{channel:'Marketplace',campaign:null,date:'2024-01-16',detail:'Viewed Sodic West listing'},{channel:'Email',campaign:null,date:'2024-01-17',detail:'Auto-responder sent'}] },
];

// ── DUPLICATE CANDIDATES ──
export const DUPLICATE_CANDIDATES = [
  { id:'DUP-001', leadId:'L-1003', matchedLeadId:'L-1008', leadName:'Karim Fouad', matchedName:'Mona Fawzy', matchType:'Phone', confidence:75, status:'Pending', detail:'Similar phone prefix +20 122 vs +20 100' },
  { id:'DUP-002', leadId:'L-1008', matchedLeadId:'L-1003', leadName:'Mona Fawzy', matchedName:'Karim Fouad', matchType:'Phone', confidence:75, status:'Pending', detail:'Reverse match of DUP-001' },
  { id:'DUP-003', leadId:'L-1001', matchedLeadId:'L-1006', leadName:'Mohamed Hassan', matchedName:'Tarek Mansour', matchType:'Email', confidence:40, status:'Dismissed', detail:'Different email domains, low match' },
];

// ── ASSIGNMENT LOG ──
export const ASSIGNMENT_LOG = [
  { id:'ASN-001', leadId:'L-1001', leadName:'Mohamed Hassan', fromAgent:null, toAgent:'Ahmed Hassan', reason:'Auto-assignment (round-robin)', date:'2024-01-15 09:23', approver:'System' },
  { id:'ASN-002', leadId:'L-1002', leadName:'Sara Ali', fromAgent:null, toAgent:'Fatma Ibrahim', reason:'Referral — direct assignment', date:'2024-01-14 10:00', approver:'Nour El-Din' },
  { id:'ASN-003', leadId:'L-1004', leadName:'Nour Ibrahim', fromAgent:'Ahmed Hassan', toAgent:'Hana Mahmoud', reason:'Territory reassignment — North Coast specialist', date:'2024-01-12 14:30', approver:'Nour El-Din' },
  { id:'ASN-004', leadId:'L-1006', leadName:'Tarek Mansour', fromAgent:null, toAgent:'Ahmed Hassan', reason:'Manager queue pickup', date:'2024-01-10 11:00', approver:'Sales Manager' },
  { id:'ASN-005', leadId:'L-1008', leadName:'Mona Fawzy', fromAgent:null, toAgent:'Omar Sherif', reason:'Walk-in — branch assignment', date:'2024-01-18 09:15', approver:'System' },
];

// ── REFERENCE LISTS ──
export const STAGES = ['New', 'Contacted', 'Qualified', 'Tour Scheduled', 'Negotiation', 'Reservation', 'Contracting', 'Closed Won', 'Closed Lost'];
export const PRIORITIES = ['Hot', 'Warm', 'Cold'];
export const SOURCES = ['Marketplace', 'Referral', 'Walk-in', 'Campaign', 'Cold Call', 'Property Fair'];
export const TASK_TYPES = ['Call', 'Tour', 'WhatsApp', 'Meeting', 'Contract', 'Finance', 'Follow-up'];
export const TASK_STATUS = ['Pending', 'In Progress', 'Completed', 'Overdue'];
export const APPLICATION_STATUS = ['Submitted', 'Under Review', 'Interview Pending', 'Missing Documents', 'Training Pending', 'Approved', 'Rejected'];
export const DOC_STATUS = ['Pending Review', 'Approved', 'Rejected', 'Missing'];
export const CANDIDATE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
export const JOB_STATUS = ['Draft', 'Published', 'Closed'];
export const TOUR_STATUS = ['Scheduled', 'Completed', 'Cancelled', 'No-Show'];
export const CONTRACT_STAGES = ['Draft', 'Under Review', 'Signed', 'Registered'];
export const SHARE_CHANNELS = ['WhatsApp', 'Email', 'Call', 'SMS'];
export const SHARE_RESPONSES = ['Interested', 'Viewed', 'No Response'];
export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Townhouse', 'Duplex', 'Penthouse', 'Chalet', 'Twin House', 'Studio'];
export const LISTING_STATUS = ['Available', 'Reserved', 'Sold'];
