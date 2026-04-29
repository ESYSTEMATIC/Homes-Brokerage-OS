// ═══════════════════════════════════════════════════════════════
// HOMES BROKERAGE OS — COMPREHENSIVE STATIC DATA (BRD V1.3 ALIGNED)
// ═══════════════════════════════════════════════════════════════

// ── PERSONAS (BRD Section 5) ──
export const PERSONAS = {
  backofficeAdmin: { label: "Super Admin", scope: "Full platform access", hub: "backoffice", email: "admin@homesbrokerage.eg" },
  salesManager: { label: "Sales Manager", scope: "Managed teams Alpha + Beta", hub: "backoffice", email: "nour@homesbrokerage.eg" },
  salesDirector: { label: "Sales Director", scope: "All sales hierarchy", hub: "backoffice", email: "tarek@homesbrokerage.eg" },
  hrRecruiter: { label: "HR Recruiter", scope: "Recruitment and onboarding", hub: "backoffice", email: "hr@homesbrokerage.eg" },
  financeOfficer: { label: "Finance Officer", scope: "Finance + commission data", hub: "backoffice", email: "finance@homesbrokerage.eg" },
  marketplaceAdmin: { label: "Marketplace Dashboard Admin", scope: "Marketplace Dashboard system — exclusive access", hub: "backoffice", email: "marketplace@homesbrokerage.eg" },
  executive: { label: "Executive / CEO", scope: "Corporate visibility", hub: "backoffice", email: "ceo@homesbrokerage.eg" },
  systemAdmin: { label: "System Admin", scope: "Platform configuration", hub: "backoffice", email: "sysadmin@homesbrokerage.eg" },
  agent: { label: "Sarah El-Masry", scope: "Licensed Agent · New Cairo Branch", hub: "agent", email: "sarah@homesbrokerage.eg", mls: "Pending", role: "Licensed Agent (Onboarding)", onboardingComplete: false },
  teamLeader: { label: "Omar Sherif", scope: "Team Leader · Alpha Team", hub: "agent", email: "omar@homesbrokerage.eg", mls: "EGMLS-287451", role: "Team Leader", onboardingComplete: true },
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
  { id: "A001", name: "Ahmed Hassan", department: "Sales", title: "Senior Sales Executive", branch: "New Cairo", manager: "Karim Mostafa", status: "Active", type: "Employee", email: "ahmed@homesbrokerage.eg", phone: "+20 100 111 0001", joinDate: "2023-06-01" },
  { id: "A002", name: "Fatma Ibrahim", department: "Sales", title: "Sales Agent", branch: "6th October", manager: "Omar Sherif", status: "Active", type: "Employee", email: "fatma@homesbrokerage.eg", phone: "+20 100 111 0002", joinDate: "2023-07-15" },
  { id: "A003", name: "Mohamed Ali", department: "Sales", title: "Team Leader", branch: "Sheikh Zayed", manager: "Tarek Amin", status: "Active", type: "Team Leader", email: "mali@homesbrokerage.eg", phone: "+20 100 111 0003", joinDate: "2022-03-10" },
  { id: "A004", name: "Nour El-Din", department: "Sales", title: "Sales Manager", branch: "New Cairo", manager: "CEO", status: "Active", type: "Sales Manager", email: "nour@homesbrokerage.eg", phone: "+20 100 111 0004", joinDate: "2021-09-01" },
  { id: "A005", name: "Yasmin Adel", department: "Sales", title: "Sales Agent", branch: "Heliopolis", manager: "Karim Mostafa", status: "Suspended", type: "Employee", email: "yasmin@homesbrokerage.eg", phone: "+20 100 111 0005", joinDate: "2023-11-20" },
  { id: "A006", name: "Karim Mostafa", department: "Sales", title: "Sales Manager", branch: "New Cairo", manager: "CEO", status: "Active", type: "Sales Manager", email: "karim@homesbrokerage.eg", phone: "+20 100 111 0006", joinDate: "2021-05-01" },
  { id: "A007", name: "Hana Mahmoud", department: "Sales", title: "Junior Sales", branch: "6th October", manager: "Omar Sherif", status: "Pending", type: "Employee", email: "hana@homesbrokerage.eg", phone: "+20 100 111 0007", joinDate: "2024-01-10" },
  { id: "A008", name: "Omar Sherif", department: "Sales", title: "Team Leader", branch: "6th October", manager: "Nour El-Din", status: "Active", type: "Team Leader", email: "omar@homesbrokerage.eg", phone: "+20 100 111 0008", joinDate: "2022-08-15" },
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

// ── EXCEPTIONS (BRD 10.4) ──
export const EXCEPTIONS = [
  { id:'EXC-001', type:'Commission Dispute', title:'Unauthorized discount on North Edge deal', severity:'Critical', reporter:'Nour El-Din', assignee:'Finance Team', status:'Open', created:'2024-01-15' },
  { id:'EXC-002', type:'Training Overdue', title:'3 agents have overdue mandatory training', severity:'High', reporter:'System', assignee:'HR Team', status:'Open', created:'2024-01-14' },
  { id:'EXC-003', type:'Document Missing', title:'Brokerage agreement missing for Yasmin Adel', severity:'Medium', reporter:'Backoffice', assignee:'Yasmin Adel', status:'Pending', created:'2024-01-12' },
  { id:'EXC-004', type:'Access Violation', title:'Attempt to access restricted financial data', severity:'Critical', reporter:'System', assignee:'System Admin', status:'Resolved', created:'2024-01-10' },
  { id:'EXC-005', type:'Data Quality', title:'Duplicate lead flagged for manual review', severity:'Low', reporter:'CRM System', assignee:'Sales Ops', status:'Open', created:'2024-01-16' },
  { id:'EXC-006', type:'SLA Breach', title:'Lead response time exceeded 4-hour SLA', severity:'High', reporter:'System', assignee:'Karim Mostafa', status:'Resolved', created:'2024-01-11' },
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
export const DEVELOPERS = [
  { id:'DEV-001', name:'Palm Hills', country:'Egypt', projects:12, status:'Active' },
  { id:'DEV-002', name:'Ora Developers', country:'Egypt', projects:8, status:'Active' },
  { id:'DEV-003', name:'SODIC', country:'Egypt', projects:6, status:'Active' },
  { id:'DEV-004', name:'Mountain View', country:'Egypt', projects:10, status:'Active' },
  { id:'DEV-005', name:'Hyde Park', country:'Egypt', projects:4, status:'Active' },
  { id:'DEV-006', name:'Talaat Moustafa', country:'Egypt', projects:15, status:'Active' },
  { id:'DEV-007', name:'City Edge', country:'Egypt', projects:5, status:'Active' },
  { id:'DEV-008', name:'Better Home', country:'Egypt', projects:3, status:'Pending' },
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
  { id:'TM-001', name:'Alpha', department:'Sales', leader:'Karim Mostafa', members:5, status:'Active' },
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

// ── REFERENCE LISTS ──
export const STAGES = ['New', 'Contacted', 'Qualified', 'Tour Scheduled', 'Negotiation', 'Reservation', 'Contracting', 'Closed Won', 'Closed Lost'];
export const PRIORITIES = ['Hot', 'Warm', 'Cold'];
export const SOURCES = ['Marketplace', 'Referral', 'Walk-in', 'Campaign', 'Cold Call', 'Property Fair'];
export const TASK_TYPES = ['Call', 'Tour', 'WhatsApp', 'Meeting', 'Contract', 'Finance'];
export const TASK_STATUS = ['Pending', 'Completed', 'Overdue'];
export const APPLICATION_STATUS = ['Submitted', 'Under Review', 'Interview Pending', 'Missing Documents', 'Training Pending', 'Approved', 'Rejected'];
export const DOC_STATUS = ['Pending Review', 'Approved', 'Rejected', 'Missing'];
export const CANDIDATE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
export const JOB_STATUS = ['Draft', 'Published', 'Closed'];
