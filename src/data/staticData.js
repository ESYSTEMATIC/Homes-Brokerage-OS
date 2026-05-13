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

// ── DEAL PIPELINES (Deal Stages.docx · received from business team) ──
// Two parallel pipelines drive the deal lifecycle. The `type` field picks
// which stage list applies to a given deal.
export const DEAL_STAGES_OFFPLAN = [
  'Lead Qualified',                 // Buyer budget/timeline/project confirmed
  'Reservation',                    // Reservation deposit paid
  'Contract Signed',                // SPA executed, down payment per plan, Closed Won, commission LOCKED
  'Early Collection Trigger (5%)',  // Developer hit initial collection threshold — Homes Advance available
  'Standard Collection (10%)',      // Developer hit standard threshold — commission released by developer
];
export const DEAL_STAGES_RESALE = [
  'Lead Qualified',                 // Both buyer + seller qualified
  'Property Viewed',                // Site visit done, feedback logged
  'Offer Made',                     // Buyer submits price + payment method
  'Offer Accepted',                 // Seller accepts, MOU prep
  'Contract Signed & Payment',      // Final SPA + payment + handover, commission released
];
// Convenience: returns the right stage list for a deal record.
export const stagesForDealType = (type) => type === 'Resale' ? DEAL_STAGES_RESALE : DEAL_STAGES_OFFPLAN;

// ── DEALS ──
// New schema (08-May business inputs from Deal Stages.docx):
//   type              'OffPlan' | 'Resale'
//   stage             one of the pipeline stages above
//   propertyId        FK to a Listing (l.id) — what unit/property the deal is about
//   attachments       [{ id, name, size, uploadedAt }]
//   reservationDeposit  Off Plan only (EGP) — deposit at Reservation stage
//   paymentPlan       Off Plan only — e.g. "10% down, 5y installments"
//   paymentMethod     Resale only — 'Cash' | 'Mortgage'
//   offerPrice        Resale only (EGP)
//   collectionPercent Off Plan only — % collected by developer (0..100)
//   commissionLocked  true once Contract Signed reached
//   homesAdvanceAvailable  true at Early Collection Trigger (Off Plan)
//   revenueRecognised true once commission released (Standard Collection / Resale Contract Signed)
export const DEALS = [
  // Off Plan — various stages
  { id: "D-501", type: "OffPlan", lead: "Sara Ali", owner: "Fatma Ibrahim", team: "Alpha", project: "ZED East", developer: "Ora", propertyId: "LST-002", stage: "Reservation", value: 12200000, commission: 2.0, reservationDeposit: 250000, paymentPlan: "15% down · 6y installments", collectionPercent: 0, commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], status: "Active", created: "2024-01-14" },
  { id: "D-502", type: "OffPlan", lead: "Youssef Tarek", owner: "Fatma Ibrahim", team: "Alpha", project: "Hyde Park", developer: "Hyde Park", propertyId: "LST-004", stage: "Contract Signed", value: 11200000, commission: 1.8, reservationDeposit: 200000, paymentPlan: "10% down · 8y installments", collectionPercent: 3, commissionLocked: true, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [{ id:'ATT-001', name:'SPA_Hyde_Park_TH-B304.pdf', size:'1.2 MB', uploadedAt:'2024-01-10' }], status: "Active", created: "2024-01-10" },
  { id: "D-503", type: "OffPlan", lead: "Nour Ibrahim", owner: "Hana Mahmoud", team: "Beta", project: "Hacienda Bay", developer: "Palm Hills", propertyId: "LST-003", stage: "Early Collection Trigger (5%)", value: 16000000, commission: 2.2, reservationDeposit: 400000, paymentPlan: "20% down · 5y installments", collectionPercent: 6, commissionLocked: true, homesAdvanceAvailable: true, revenueRecognised: false, attachments: [{ id:'ATT-002', name:'SPA_Hacienda_CH-A12.pdf', size:'1.4 MB', uploadedAt:'2024-01-12' }, { id:'ATT-003', name:'Reservation_Receipt.pdf', size:'320 KB', uploadedAt:'2024-01-12' }], status: "Active", created: "2024-01-12" },
  { id: "D-504", type: "OffPlan", lead: "Mohamed Hassan", owner: "Ahmed Hassan", team: "Alpha", project: "Palm Hills New Cairo", developer: "Palm Hills", propertyId: "LST-001", stage: "Lead Qualified", value: 8500000, commission: 2.0, reservationDeposit: 0, paymentPlan: "10% down · 7y installments", collectionPercent: 0, commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], status: "Active", created: "2024-01-15" },
  { id: "D-506", type: "OffPlan", lead: "Karim Fouad", owner: "Omar Sherif", team: "Alpha", project: "Madinaty", developer: "Talaat Moustafa", propertyId: "LST-005", stage: "Standard Collection (10%)", value: 5200000, commission: 1.5, reservationDeposit: 100000, paymentPlan: "10% down · 10y installments", collectionPercent: 12, commissionLocked: true, homesAdvanceAvailable: true, revenueRecognised: true, attachments: [{ id:'ATT-004', name:'SPA_Madinaty_APT-C110.pdf', size:'1.1 MB', uploadedAt:'2023-12-20' }, { id:'ATT-005', name:'Commission_Release_TM.pdf', size:'180 KB', uploadedAt:'2024-01-15' }], status: "Closed Won", created: "2023-12-15" },
  // Resale — various stages
  { id: "D-507", type: "Resale", lead: "Mona Fawzy", owner: "Omar Sherif", team: "Beta", project: "Mountain View", developer: "Mountain View", propertyId: "LST-007", stage: "Property Viewed", value: 7000000, commission: 2.0, offerPrice: 0, paymentMethod: "Cash", commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], status: "Active", created: "2024-01-18" },
  { id: "D-508", type: "Resale", lead: "Layla Ahmed", owner: "Ahmed Hassan", team: "Alpha", project: "Sodic West", developer: "Sodic", propertyId: "LST-006", stage: "Offer Made", value: 9800000, commission: 2.5, offerPrice: 9500000, paymentMethod: "Mortgage", commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [{ id:'ATT-006', name:'Offer_Letter.pdf', size:'95 KB', uploadedAt:'2024-01-17' }], status: "Active", created: "2024-01-17" },
  { id: "D-509", type: "Resale", lead: "Fatma Tarek", owner: "Fatma Ibrahim", team: "Alpha", project: "Palm Hills Katameya", developer: "Palm Hills", propertyId: "LST-008", stage: "Offer Accepted", value: 14500000, commission: 2.0, offerPrice: 14200000, paymentMethod: "Cash", commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [{ id:'ATT-007', name:'MOU_draft.pdf', size:'240 KB', uploadedAt:'2024-01-16' }], status: "Active", created: "2024-01-14" },
  // Lost
  { id: "D-505", type: "OffPlan", lead: "Tarek Mansour", owner: "Ahmed Hassan", team: "Alpha", project: "Midtown", developer: "Better Home", propertyId: null, stage: "Lead Qualified", value: 4500000, commission: 1.5, reservationDeposit: 0, paymentPlan: "—", collectionPercent: 0, commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], lostReason: "Budget exceeded", status: "Closed Lost", created: "2024-01-10" },
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
// `expires` is the document's validity end date. Identity / Legal docs that
// don't expire use null. Regulatory docs (RERA, Tax) carry rolling expiry.
export const DOCUMENTS = [
  { id: "DOC001", doc: "National ID", type: "Identity", agent: "Fatma Ibrahim", date: "2024-01-14", status: "Pending Review", expires: "2031-01-14" },
  { id: "DOC002", doc: "Tax Card", type: "Financial", agent: "Fatma Ibrahim", date: "2024-01-14", status: "Pending Review", expires: "2026-12-31" },
  { id: "DOC003", doc: "Commercial Register", type: "Legal", agent: "Ahmed Hassan", date: "2024-01-10", status: "Approved", expires: "2025-12-31" },
  { id: "DOC004", doc: "National ID", type: "Identity", agent: "Ahmed Hassan", date: "2023-12-20", status: "Approved", expires: "2030-12-20" },
  { id: "DOC005", doc: "Brokerage Agreement", type: "Legal", agent: "Yasmin Adel", date: "—", status: "Missing", expires: null },
  { id: "DOC006", doc: "National ID", type: "Identity", agent: "Hana Mahmoud", date: "2024-01-08", status: "Rejected", expires: null },
  { id: "DOC007", doc: "RERA License", type: "Regulatory", agent: "Mohamed Ali", date: "2024-01-12", status: "Approved", expires: "2026-06-30" },
  { id: "DOC008", doc: "Contract Agreement", type: "Legal", agent: "Omar Sherif", date: "2024-01-05", status: "Approved", expires: "2026-01-05" },
];

// ── RECRUITMENT / JOB VACANCIES ──
export const JOBS = [
  {
    id: "JOB-001", title: "Senior Sales Agent", department: "Sales", location: "New Cairo", type: "Full-time", mode: "On-site",
    headcount: 3, hiringManager: "Sales Manager", status: "Published", applicants: 12, created: "2026-05-01",
    deadline: "2026-06-15", experienceYears: "3-6",
    summary: "Drive new business and own end-to-end deals with Egypt's top real-estate developers. You'll work primarily on Off Plan and Resale pipelines, owning the customer journey from first contact to commission release.",
    responsibilities: [
      "Manage a personal pipeline of 30-50 active leads on the Homes CRM",
      "Qualify inbound leads (Marketplace, Cold Calls, Referrals) within SLA",
      "Schedule tours, present payment plans, and negotiate offers",
      "Own deals from Lead Qualified through Standard Collection (10%) trigger",
      "Maintain MLS listings and share inventory with leads via tracked links",
      "Hit monthly target: 10+ leads, 4+ deals, EGP 30M+ pipeline",
    ],
    requirements: [
      "Bachelor's degree (any field)",
      "3-6 years real estate sales experience in Egypt",
      "Active RERA license or willing to obtain within 30 days",
      "Fluent in Arabic and conversational English",
      "Own car preferred for site visits",
      "Comfortable with CRM tools and Microsoft 365",
    ],
    benefits: [
      "Competitive base salary + uncapped commission",
      "Homes Advance — early commission release at developer's 5% collection",
      "Health insurance for employee + family",
      "Microsoft 365 + Homes Academy access",
      "Monthly transport allowance",
      "Annual top-performer trip",
    ],
  },
  {
    id: "JOB-002", title: "Junior Sales Agent", department: "Sales", location: "6th October", type: "Full-time", mode: "On-site",
    headcount: 5, hiringManager: "Omar Sherif", status: "Published", applicants: 28, created: "2026-05-04",
    deadline: "2026-06-30", experienceYears: "0-2",
    summary: "Start your real-estate career with structured onboarding, mentorship from senior agents, and access to live Homes Marketplace leads. We invest in talent — most of our top performers started here.",
    responsibilities: [
      "Complete the 6-week onboarding programme on Homes Academy",
      "Handle inbound inquiries from Homes Marketplace and partner agencies",
      "Run qualification calls and capture buyer preferences in CRM",
      "Shadow senior agents on tours for the first 2 months",
      "Maintain a clean activity log on every assigned lead",
      "Build toward owning your own pipeline by month 4",
    ],
    requirements: [
      "Bachelor's degree (recent graduates welcome)",
      "0-2 years of sales experience (real estate not required)",
      "Strong communication skills · Arabic native, English working level",
      "Self-motivated and target-driven",
      "Tech-comfortable (CRM, Excel, M365)",
    ],
    benefits: [
      "Base salary + commission after onboarding completion",
      "Paid 6-week training via Homes Academy",
      "Mentorship from a senior agent",
      "Health insurance after probation",
      "Clear progression path to Senior Sales Agent (12-18 months)",
    ],
  },
  {
    id: "JOB-003", title: "HR Coordinator", department: "HR / Recruitment", location: "New Cairo", type: "Full-time", mode: "Hybrid",
    headcount: 1, hiringManager: "Dina Samir", status: "Published", applicants: 0, created: "2026-05-10",
    deadline: "2026-06-20", experienceYears: "2-4",
    summary: "Own end-to-end recruitment for our growing sales team. You'll partner with the Sales Director to forecast headcount and run the candidate pipeline on the Homes Backoffice portal.",
    responsibilities: [
      "Source candidates via job boards, LinkedIn, and referrals",
      "Screen applications and shortlist for hiring managers",
      "Schedule interviews and coordinate panels",
      "Run onboarding: documents, training assignments, equipment, system access",
      "Track time-to-hire and quality-of-hire KPIs",
      "Maintain employee records on the HR portal",
    ],
    requirements: [
      "Bachelor's degree in HR, Business or related",
      "2-4 years recruitment experience (real estate background a plus)",
      "Familiar with ATS/CRM tools",
      "Excellent Arabic and English communication",
      "Detail-oriented with strong follow-through",
    ],
    benefits: [
      "Competitive salary",
      "Hybrid schedule · 3 days office / 2 days remote",
      "Health insurance",
      "Annual learning budget",
      "Microsoft 365 + Homes Academy access",
    ],
  },
  {
    id: "JOB-004", title: "Marketing Campaign Lead", department: "Marketing", location: "New Cairo", type: "Full-time", mode: "Hybrid",
    headcount: 1, hiringManager: "Tamer Said", status: "Published", applicants: 6, created: "2026-05-11",
    deadline: "2026-06-25", experienceYears: "4-7",
    summary: "Own paid social and content marketing across Facebook, Instagram, Google, and TikTok. You'll work inside the Homes CRM Campaigns module — tracking every lead back to its campaign source with full attribution.",
    responsibilities: [
      "Plan and launch monthly campaigns across FB, IG, Google, TikTok",
      "Manage outsourced creative and media agencies — issue tracking URLs and review attribution",
      "Set and review monthly campaign budgets (USD)",
      "Build retargeting flows for marketplace visitors who didn't convert",
      "Hit cost-per-lead and ROAS targets per channel",
      "Coordinate with Sales Director on cold-call list imports",
    ],
    requirements: [
      "Bachelor's in Marketing, Communications, or related",
      "4-7 years digital marketing experience · ideally with real estate or e-commerce",
      "Hands-on with Meta Ads Manager, Google Ads, TikTok Ads",
      "Comfortable with marketing analytics and attribution modelling",
      "Native Arabic with strong English written skills",
    ],
    benefits: [
      "Competitive salary + performance bonus",
      "Hybrid schedule",
      "Ownership of full marketing budget across paid channels",
      "Health insurance for employee + family",
      "Annual industry-conference budget",
    ],
  },
  {
    id: "JOB-005", title: "CRM Operations Specialist", department: "Operations", location: "New Cairo", type: "Full-time", mode: "On-site",
    headcount: 1, hiringManager: "Sales Director", status: "Published", applicants: 3, created: "2026-05-12",
    deadline: "2026-07-01", experienceYears: "2-5",
    summary: "Be the subject-matter expert on the Homes CRM. You'll keep data clean, master configuration of pipelines/stages/rules, and train new agents on the platform.",
    responsibilities: [
      "Maintain CRM data quality — duplicates, missing fields, stale leads",
      "Configure deal pipelines (Off Plan + Resale) and stage transitions",
      "Run weekly hygiene reports for managers (SLA breaches, overdue tasks)",
      "Train new agents on Homes Academy CRM module",
      "Support Sales Director on commission override approval queue",
      "Liaise with IT on integrations (EGMLS, M365, marketing agencies)",
    ],
    requirements: [
      "Bachelor's degree",
      "2-5 years experience with CRM platforms (Salesforce, HubSpot, or equivalent)",
      "Real estate domain experience a strong plus",
      "Excel power-user · pivot tables, lookups, formulas",
      "Comfortable with role-based access concepts",
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Microsoft 365 + Homes Academy access",
      "Direct exposure to Sales Director and exec team",
    ],
  },
  {
    id: "JOB-006", title: "Finance Analyst (Commissions)", department: "Finance", location: "New Cairo", type: "Full-time", mode: "On-site",
    headcount: 1, hiringManager: "Amr Khaled", status: "Closed", applicants: 8, created: "2026-04-01",
    deadline: "2026-04-30", experienceYears: "3-5",
    summary: "[CLOSED] Run commission calculation and payout cycles for the entire sales team. Liaise with developers on collection triggers and revenue recognition.",
    responsibilities: [
      "Calculate commissions on every Closed Won deal",
      "Manage Homes Advance approvals at 5% collection trigger",
      "Run monthly payout cycle and reconciliation",
    ],
    requirements: [
      "Bachelor's in Finance / Accounting",
      "3-5 years finance experience",
      "Familiar with Egyptian real-estate commission norms",
    ],
    benefits: ["Competitive salary","Health insurance","Annual bonus"],
  },
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
  // ─── CRM activity (appears on CRM Dashboard Recent Activity) ───
  { id: "AUD-001", action: "Lead Assigned",         actor: "Nour El-Din",     target: "L-1001 → Ahmed Hassan",     module: "Leads",     timestamp: "2026-05-13 09:23:44", detail: "Lead assigned from manager queue" },
  { id: "AUD-007", action: "Deal Stage Changed",    actor: "Fatma Ibrahim",   target: "D-502",                      module: "Deals",     timestamp: "2026-05-13 08:50:00", detail: "Hyde Park · Negotiation → Reservation" },
  { id: "AUD-009", action: "Action Logged · Call",  actor: "Fatma Ibrahim",   target: "L-1002",                      module: "Leads",     timestamp: "2026-05-13 08:32:11", detail: "Call Outcome: Interested — Discussed budget" },
  { id: "AUD-010", action: "Tour Scheduled",        actor: "Fatma Ibrahim",   target: "L-1004",                      module: "Leads",     timestamp: "2026-05-12 17:14:55", detail: "Site visit Hacienda Bay — Thu 16:00" },
  { id: "AUD-011", action: "Commission Override",   actor: "Tarek Amin",      target: "D-503",                      module: "Deals",     timestamp: "2026-05-12 16:45:00", detail: "Rate 2.0% → 2.2% — Premium launch (approved)" },
  { id: "AUD-012", action: "Listing Shared",        actor: "Ahmed Hassan",    target: "L-1001",                      module: "Listing Shares", timestamp: "2026-05-12 15:30:22", detail: "Palm Hills V101 → Mohamed Hassan via WhatsApp" },
  { id: "AUD-013", action: "Cold Call Assigned",    actor: "Tarek Amin",      target: "CC-004 Lina Sherif",          module: "Cold Calls", timestamp: "2026-05-12 14:50:00", detail: "Assigned to Fatma Ibrahim" },
  { id: "AUD-014", action: "Cold Call Logged",      actor: "Fatma Ibrahim",   target: "CC-002 Marwa Refaat",         module: "Cold Calls", timestamp: "2026-05-12 13:18:42", detail: "Interested — Sheikh Zayed villa, 8-12M budget" },
  { id: "AUD-015", action: "Lead → Nurturing",      actor: "Omar Sherif",     target: "L-1006",                      module: "Leads",     timestamp: "2026-05-12 12:05:33", detail: "Buyer postponed until end of Ramadan" },
  { id: "AUD-016", action: "Deal Created (Reservation)", actor: "Fatma Ibrahim", target: "D-502",                  module: "Deals",     timestamp: "2026-05-12 10:42:18", detail: "Off Plan · Youssef Tarek · Hyde Park" },
  { id: "AUD-017", action: "Campaign created",      actor: "Ahmed Hassan",    target: "C-105 Mortgage Awareness",    module: "Campaigns", timestamp: "2026-05-12 09:30:00", detail: "Platforms: Google, Budget: $75K" },
  { id: "AUD-018", action: "Lead Reassigned",       actor: "Omar Sherif",     target: "L-1004",                      module: "Leads",     timestamp: "2026-05-11 16:20:00", detail: "Ahmed Hassan → Hana Mahmoud (territory)" },
  // ─── Non-CRM (Backoffice / HR / Recruitment / Security) — filtered out of CRM Dashboard ───
  { id: "AUD-002", action: "Role Created",          actor: "System Admin",    target: "Senior Agent Role",          module: "Backoffice", timestamp: "2026-05-11 14:11:02", detail: "New role with 12 permissions created" },
  { id: "AUD-004", action: "Document Rejected",     actor: "Backoffice Admin",target: "DOC006 National ID",          module: "Backoffice", timestamp: "2026-05-11 11:30:00", detail: "Image quality insufficient" },
  { id: "AUD-005", action: "Employee Suspended",    actor: "HR Manager",      target: "A005 Yasmin Adel",            module: "HR",         timestamp: "2026-05-10 10:00:00", detail: "Training compliance overdue" },
  { id: "AUD-006", action: "Job Published",         actor: "Dina Samir",      target: "JOB-001 Senior Sales Agent",  module: "Recruitment", timestamp: "2026-05-09 08:30:00", detail: "Published to careers page" },
  { id: "AUD-008", action: "SSO Login",             actor: "Ahmed Hassan",    target: "Agent Session",               module: "Security",   timestamp: "2026-05-13 08:00:00", detail: "SSO authenticated via Microsoft Entra" },
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

// ── COMPANY ANNOUNCEMENTS ──
// Surfaced on the post-onboarding Agent Dashboard + Notifications drawer.
// kind: 'launch' | 'hr' | 'department' | 'training' | 'system'
// priority: 'high' | 'normal'
export const ANNOUNCEMENTS = [
  { id:'ANN-001', kind:'launch',     priority:'high',   title:'New launch: Mountain View iCity Q2',                                   body:'Pre-launch briefing 10 May, 10:00 AM at HQ. Booking opens for agents from 12 May. Commission boost +0.5% for first 20 reservations.', author:'Tarek Amin', date:'2026-05-04', read:false },
  { id:'ANN-002', kind:'department', priority:'normal', title:'Ramadan working hours · 10:00 – 16:00',                                body:'Effective from 11 May through end of Ramadan. Branch operations adjusted. Calls / WhatsApp coverage continues per the on-call schedule.', author:'Nour El-Din', date:'2026-05-03', read:false },
  { id:'ANN-003', kind:'hr',         priority:'normal', title:'Q3 performance reviews scheduled · 15 July',                           body:'Self-assessment forms open in HR portal next week. Targets achievement is part of the review. Talk to your TL if you have questions.', author:'HR — Dina Samir', date:'2026-05-02', read:true },
  { id:'ANN-004', kind:'training',   priority:'normal', title:'New course in Homes Academy · "Resale Mastery"',                        body:'90-min course on resale negotiation, MOU prep, and offer acceptance flow. Optional for agents, recommended before handling resale leads.', author:'Homes Academy', date:'2026-05-01', read:true },
  { id:'ANN-005', kind:'department', priority:'normal', title:'Sales kickoff meeting · Sunday 9:00 AM, Main Hall',                    body:'Q2 numbers review, new compound launches, updated commission policies. Mandatory for all agents and TLs.', author:'Nour El-Din', date:'2026-04-30', read:true },
  { id:'ANN-006', kind:'launch',     priority:'normal', title:'Hyde Park Phase 4 — pricing released',                                  body:'New phase pricing live in Matrix EGMLS. Townhouses from EGP 12.5M, villas from EGP 24M. Updated brochure in CRM Listings.', author:'Tarek Amin', date:'2026-04-28', read:true },
];

// ── CAMPAIGN → BUYER-PREFERENCE INFERENCE ──
// 11-May meeting (2:08-2:10): when a lead enters via a campaign with a clear
// geographic / property-type signal (e.g. "North Coast Summer" → North Coast
// chalets), the system pre-fills the buyer preferences so the agent opens the
// conversation already knowing the customer's interest. Inferences are marked
// `inferred: true` so the agent knows they're confirmed-from-source rather
// than captured during the call.
export const CAMPAIGN_INFERENCE = {
  'New Cairo Launch':       { locations: ['New Cairo'],                   propertyTypes: ['Villa','Townhouse','Apartment'],         budgetMin: 6_000_000, budgetMax: 15_000_000 },
  'North Coast Summer':     { locations: ['North Coast'],                 propertyTypes: ['Chalet','Villa'],                         budgetMin: 10_000_000, budgetMax: 25_000_000, season:'Summer' },
  'New Capital Launch':     { locations: ['New Capital'],                 propertyTypes: ['Apartment','Office'],                     budgetMin: 4_000_000, budgetMax: 12_000_000 },
  'Sheikh Zayed Promo':     { locations: ['Sheikh Zayed','6th October'],  propertyTypes: ['Villa','Twin House','Townhouse'],         budgetMin: 8_000_000, budgetMax: 14_000_000 },
  'Madinaty Q2':            { locations: ['New Cairo','Madinaty'],        propertyTypes: ['Apartment','Duplex'],                     budgetMin: 3_000_000, budgetMax: 7_000_000 },
  'Mortgage Awareness Q2':  { locations: ['Any'],                          propertyTypes: ['Apartment','Villa'],                     budgetMin: 3_000_000, budgetMax: 10_000_000, mortgageReady: true },
  'Broker Referral':        null,  // referrals carry no inference signal
  'Branch Walk-in':         null,  // walk-ins start blank
  'Agent Referral':         null,
};

// Build a BuyerPreferences row from a campaign tag. Returns null if the
// campaign has no inferable signal.
export const inferPreferencesFromCampaign = (campaign) => {
  const map = CAMPAIGN_INFERENCE[campaign];
  if (!map) return null;
  return { ...map, inferred: true, inferredFrom: campaign };
};

// ── MARKETING AGENCIES (outsourced) ──
// 11-May stakeholder ask (action item 3): each outsourced marketing agency
// gets a unique tracking URL. Leads coming through that URL auto-tag with the
// agency name + active campaign so attribution is preserved end-to-end.
// The token is the URL-safe identifier appended as `?src=<token>`.
export const MARKETING_AGENCIES = [
  { id:'MAG-001', name:'Nexus Digital',     token:'nexus_digital',     status:'Active',  contact:'Mariam Hassan',  email:'mariam@nexusdigital.eg',   phone:'+20 100 222 8800', activeCampaign:'New Cairo Summer 2026', focus:'Facebook + Instagram', leadsThisMonth: 38, contractStart:'2026-04-01' },
  { id:'MAG-002', name:'BlueWave Media',    token:'bluewave_media',    status:'Active',  contact:'Sherif Adel',    email:'sherif@bluewave.media',    phone:'+20 100 333 4400', activeCampaign:'North Coast Drive',     focus:'Google Ads + YouTube', leadsThisMonth: 24, contractStart:'2026-03-15' },
  { id:'MAG-003', name:'OrangeKite Agency', token:'orange_kite',       status:'Active',  contact:'Yara Hossam',    email:'yara@orangekite.co',       phone:'+20 100 444 9900', activeCampaign:'Sheikh Zayed Promo',    focus:'Multi-platform',       leadsThisMonth: 15, contractStart:'2026-05-01' },
  { id:'MAG-004', name:'Skyline Creative',  token:'skyline_creative',  status:'Paused',  contact:'Hossam El-Din',  email:'hossam@skylinecreative.eg',phone:'+20 100 555 6600', activeCampaign:'(no active campaign)', focus:'Outdoor + Print',     leadsThisMonth: 0,  contractStart:'2026-01-10' },
  { id:'MAG-005', name:'PixelHive Studio',  token:'pixel_hive',        status:'Active',  contact:'Layla Mostafa',  email:'layla@pixelhive.studio',   phone:'+20 100 666 1100', activeCampaign:'Mortgage Awareness Q2', focus:'TikTok + Reels',       leadsThisMonth: 19, contractStart:'2026-04-20' },
];

// Build the public landing-page URL for a given agency. In production this
// would point at the homes.com.eg marketplace lead form with UTM tags.
export const buildAgencyTrackingUrl = (agency, campaignSlug) => {
  const base = 'https://homes.com.eg/lead-form';
  const params = new URLSearchParams({
    src: agency.token,
    utm_source: agency.token,
    utm_medium: 'agency',
    utm_campaign: campaignSlug || agency.activeCampaign.toLowerCase().replace(/[^a-z0-9]+/g,'-'),
  });
  return `${base}?${params.toString()}`;
};

// ── SALES TARGETS (per-persona, monthly) ──
// Demo seed — in production these would be set by the manager via a Targets
// admin page. Used by the CRM Dashboard Targets card and the post-onboarding
// Agent Dashboard KPI strip.
export const TARGETS = {
  // agent (Sarah) — pre-onboarding so targets won't render until CRM unlocked
  agent:        { period:'May 2026', leadsTarget: 8,  dealsTarget: 2, pipelineTarget: 15_000_000, closedWonTarget: 1 },
  agentActive:  { period:'May 2026', leadsTarget: 10, dealsTarget: 4, pipelineTarget: 30_000_000, closedWonTarget: 2 },
  teamLeader:   { period:'May 2026', leadsTarget: 28, dealsTarget: 12, pipelineTarget: 95_000_000, closedWonTarget: 5, scope: 'team' },
  salesManager: { period:'May 2026', leadsTarget: 80, dealsTarget: 32, pipelineTarget: 250_000_000, closedWonTarget: 14, scope: 'cross' },
  salesDirector:{ period:'May 2026', leadsTarget: 160,dealsTarget: 60, pipelineTarget: 500_000_000, closedWonTarget: 28, scope: 'all' },
};

// ── AGENT NOTIFICATIONS ──
// Feed categories: 'document' | 'hr' | 'department' | 'feature' | 'training' | 'system'
// type: 'success' | 'info' | 'warning' | 'danger' (controls badge color)
export const AGENT_NOTIFICATIONS = [
  // Document updates
  { id:'N-001', category:'document', text:'Your National ID has been approved', time:'2 hours ago', type:'success' },
  { id:'N-002', category:'document', text:'Please upload your Proof of Address document', time:'3 days ago', type:'warning' },
  { id:'N-003', category:'document', text:'RERA License expires in 28 days — please renew', time:'1 day ago', type:'warning' },
  // HR updates
  { id:'N-004', category:'hr', text:'Q3 performance review scheduled for 15 July 2026', time:'4 hours ago', type:'info' },
  { id:'N-005', category:'hr', text:'New leave balance: 18 days available', time:'2 days ago', type:'info' },
  { id:'N-006', category:'hr', text:'Salary slip for April 2026 is available', time:'5 days ago', type:'success' },
  // Department updates
  { id:'N-007', category:'department', text:'Sales kickoff meeting — Sunday 9:00 AM, Main Hall', time:'6 hours ago', type:'info' },
  { id:'N-008', category:'department', text:'New compound launch: Mountain View iCity Q2 — briefing 10 May', time:'1 day ago', type:'info' },
  { id:'N-009', category:'department', text:'Ramadan working hours: 10:00 – 16:00 starting next week', time:'3 days ago', type:'info' },
  // Feature launches
  { id:'N-010', category:'feature', text:'NEW · Social Campaigns module is now live for Marketing', time:'today', type:'success' },
  { id:'N-011', category:'feature', text:'NEW · Listing Shares now supports multi-lead selection', time:'2 days ago', type:'success' },
  { id:'N-012', category:'feature', text:'UPDATE · Mortgage calculator now seeds from listing detail', time:'4 days ago', type:'info' },
  // Training (legacy — kept for backwards compatibility)
  { id:'N-013', category:'training', text:'Training module "Anti-Money Laundering" is due in 3 days', time:'5 hours ago', type:'warning' },
];

// ── AGENT DOCUMENTS (personal) ──
// ── COLD CALLS ──
// Stakeholder ask 08-May (item 10). Flow: Marketing/Director imports contacts
// → Director assigns to agent → Agent calls + comments → Director reviews
// and marks Convert to Lead (auto-creates a Lead) or Not Lead.
// Status values: New | Assigned | Called | Converted | NotLead
export const COLD_CALL_SOURCES = ['Facebook Lead Magnet','Instagram Ads','Google Ads','Website Form','Property Expo','Referral','Walk-in DB','Outdoor Campaign'];
export const COLD_CALL_BATCHES = [
  { id: 'BATCH-2026-05-01-FB', source: 'Facebook Lead Magnet', importedBy: 'Ahmed Hassan',  importedAt: '2026-05-01', count: 6 },
  { id: 'BATCH-2026-05-02-GO', source: 'Google Ads',           importedBy: 'Ahmed Hassan',  importedAt: '2026-05-02', count: 5 },
  { id: 'BATCH-2026-05-03-EX', source: 'Property Expo',        importedBy: 'Tarek Amin',    importedAt: '2026-05-03', count: 4 },
  { id: 'BATCH-2026-05-04-IG', source: 'Instagram Ads',        importedBy: 'Ahmed Hassan',  importedAt: '2026-05-04', count: 5 },
];

export const COLD_CALLS = [
  // ─── BATCH-2026-05-01-FB · Facebook ───
  { id:'CC-001', name:'Hesham Magdy',    phone:'+20 100 555 1111', source:'Facebook Lead Magnet', importBatch:'BATCH-2026-05-01-FB', importedBy:'Ahmed Hassan', importedAt:'2026-05-01', status:'Converted', assignedAgent:'Fatma Ibrahim',  assignedAt:'2026-05-02', callOutcome:'Interested', callDuration:'8m 24s', agentComment:'Looking for 3BR in New Cairo, budget ~9M EGP. Wants to view ZED East next week.', directorDecision:'Convert to Lead', decidedBy:'Tarek Amin', decidedAt:'2026-05-03', convertedLeadId:'L-2001' },
  { id:'CC-002', name:'Marwa Refaat',    phone:'+20 100 555 2222', source:'Facebook Lead Magnet', importBatch:'BATCH-2026-05-01-FB', importedBy:'Ahmed Hassan', importedAt:'2026-05-01', status:'Called',    assignedAgent:'Fatma Ibrahim',  assignedAt:'2026-05-02', callOutcome:'Interested', callDuration:'5m 12s', agentComment:'Considering Sheikh Zayed. Open to villa or townhouse, 8M-12M.', directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-003', name:'Ramy Saber',      phone:'+20 100 555 3333', source:'Facebook Lead Magnet', importBatch:'BATCH-2026-05-01-FB', importedBy:'Ahmed Hassan', importedAt:'2026-05-01', status:'NotLead',   assignedAgent:'Sarah El-Masry', assignedAt:'2026-05-02', callOutcome:'Wrong Number', callDuration:'0m 30s', agentComment:'Number belongs to someone else, not interested.', directorDecision:'Not Lead', decidedBy:'Tarek Amin', decidedAt:'2026-05-03', convertedLeadId:null },
  { id:'CC-004', name:'Lina Sherif',     phone:'+20 100 555 4444', source:'Facebook Lead Magnet', importBatch:'BATCH-2026-05-01-FB', importedBy:'Ahmed Hassan', importedAt:'2026-05-01', status:'Assigned',  assignedAgent:'Fatma Ibrahim',  assignedAt:'2026-05-04', callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-005', name:'Omar Wahba',      phone:'+20 100 555 5555', source:'Facebook Lead Magnet', importBatch:'BATCH-2026-05-01-FB', importedBy:'Ahmed Hassan', importedAt:'2026-05-01', status:'New',       assignedAgent:null,             assignedAt:null,        callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-006', name:'Yara Hosny',      phone:'+20 100 555 6666', source:'Facebook Lead Magnet', importBatch:'BATCH-2026-05-01-FB', importedBy:'Ahmed Hassan', importedAt:'2026-05-01', status:'New',       assignedAgent:null,             assignedAt:null,        callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  // ─── BATCH-2026-05-02-GO · Google ───
  { id:'CC-007', name:'Kareem Adel',     phone:'+20 100 555 7777', source:'Google Ads',            importBatch:'BATCH-2026-05-02-GO', importedBy:'Ahmed Hassan', importedAt:'2026-05-02', status:'Converted', assignedAgent:'Hana Mahmoud',  assignedAt:'2026-05-03', callOutcome:'Interested', callDuration:'12m 03s', agentComment:'Cash buyer, ready for 6M budget, prefers North Coast resale.', directorDecision:'Convert to Lead', decidedBy:'Tarek Amin', decidedAt:'2026-05-04', convertedLeadId:'L-2002' },
  { id:'CC-008', name:'Heba Mostafa',    phone:'+20 100 555 8888', source:'Google Ads',            importBatch:'BATCH-2026-05-02-GO', importedBy:'Ahmed Hassan', importedAt:'2026-05-02', status:'Called',    assignedAgent:'Fatma Ibrahim',  assignedAt:'2026-05-03', callOutcome:'Callback Later', callDuration:'2m 18s', agentComment:'Asked to call back next week, currently traveling.', directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-009', name:'Mostafa Hamed',   phone:'+20 100 555 9999', source:'Google Ads',            importBatch:'BATCH-2026-05-02-GO', importedBy:'Ahmed Hassan', importedAt:'2026-05-02', status:'Assigned',  assignedAgent:'Sarah El-Masry', assignedAt:'2026-05-04', callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-010', name:'Nada Hamdy',      phone:'+20 100 555 0000', source:'Google Ads',            importBatch:'BATCH-2026-05-02-GO', importedBy:'Ahmed Hassan', importedAt:'2026-05-02', status:'New',       assignedAgent:null,             assignedAt:null,        callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-011', name:'Sherif Lotfy',    phone:'+20 101 555 1010', source:'Google Ads',            importBatch:'BATCH-2026-05-02-GO', importedBy:'Ahmed Hassan', importedAt:'2026-05-02', status:'New',       assignedAgent:null,             assignedAt:null,        callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  // ─── BATCH-2026-05-03-EX · Property Expo ───
  { id:'CC-012', name:'Tamer Ramy',      phone:'+20 101 555 1212', source:'Property Expo',         importBatch:'BATCH-2026-05-03-EX', importedBy:'Tarek Amin',   importedAt:'2026-05-03', status:'Called',    assignedAgent:'Fatma Ibrahim',  assignedAt:'2026-05-04', callOutcome:'Not Interested', callDuration:'1m 45s', agentComment:'Already bought elsewhere last month.', directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-013', name:'Reem Magdi',      phone:'+20 101 555 1313', source:'Property Expo',         importBatch:'BATCH-2026-05-03-EX', importedBy:'Tarek Amin',   importedAt:'2026-05-03', status:'Assigned',  assignedAgent:'Hana Mahmoud',  assignedAt:'2026-05-04', callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-014', name:'Hossam Fathy',    phone:'+20 101 555 1414', source:'Property Expo',         importBatch:'BATCH-2026-05-03-EX', importedBy:'Tarek Amin',   importedAt:'2026-05-03', status:'New',       assignedAgent:null,             assignedAt:null,        callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-015', name:'Mai Yehia',       phone:'+20 101 555 1515', source:'Property Expo',         importBatch:'BATCH-2026-05-03-EX', importedBy:'Tarek Amin',   importedAt:'2026-05-03', status:'New',       assignedAgent:null,             assignedAt:null,        callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  // ─── BATCH-2026-05-04-IG · Instagram ───
  { id:'CC-016', name:'Bassel Khaled',   phone:'+20 101 555 1616', source:'Instagram Ads',         importBatch:'BATCH-2026-05-04-IG', importedBy:'Ahmed Hassan', importedAt:'2026-05-04', status:'Called',    assignedAgent:'Fatma Ibrahim',  assignedAt:'2026-05-05', callOutcome:'Interested', callDuration:'6m 30s', agentComment:'First-time buyer, looking at New Capital. Asked for mortgage info.', directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-017', name:'Salma Adly',      phone:'+20 101 555 1717', source:'Instagram Ads',         importBatch:'BATCH-2026-05-04-IG', importedBy:'Ahmed Hassan', importedAt:'2026-05-04', status:'Assigned',  assignedAgent:'Sarah El-Masry', assignedAt:'2026-05-05', callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-018', name:'Adham Saeed',     phone:'+20 101 555 1818', source:'Instagram Ads',         importBatch:'BATCH-2026-05-04-IG', importedBy:'Ahmed Hassan', importedAt:'2026-05-04', status:'New',       assignedAgent:null,             assignedAt:null,        callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-019', name:'Mariam Tarek',    phone:'+20 101 555 1919', source:'Instagram Ads',         importBatch:'BATCH-2026-05-04-IG', importedBy:'Ahmed Hassan', importedAt:'2026-05-04', status:'New',       assignedAgent:null,             assignedAt:null,        callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
  { id:'CC-020', name:'Khalil Mahmoud',  phone:'+20 101 555 2020', source:'Instagram Ads',         importBatch:'BATCH-2026-05-04-IG', importedBy:'Ahmed Hassan', importedAt:'2026-05-04', status:'New',       assignedAgent:null,             assignedAt:null,        callOutcome:null, callDuration:null, agentComment:null, directorDecision:null, decidedBy:null, decidedAt:null, convertedLeadId:null },
];

export const AGENT_DOCS = [
  // `expires` — validity end date. null for non-expiring docs.
  { id:'AD-001', doc:'National ID', type:'Identity', status:'Approved', date:'2024-01-14', expires:'2031-01-14' },
  { id:'AD-002', doc:'Tax Card', type:'Financial', status:'Approved', date:'2024-01-14', expires:'2026-12-31' },
  { id:'AD-003', doc:'RERA License', type:'Regulatory', status:'Approved', date:'2024-01-12', expires:'2026-06-30' },
  { id:'AD-004', doc:'Brokerage Agreement', type:'Legal', status:'Approved', date:'2024-01-10', expires:'2026-01-10' },
  { id:'AD-005', doc:'Criminal Record', type:'Legal', status:'Approved', date:'2024-01-08', expires:'2025-07-08' },
  { id:'AD-006', doc:'Bank Details', type:'Financial', status:'Approved', date:'2024-01-08', expires:null },
  { id:'AD-007', doc:'Profile Photo', type:'Identity', status:'Approved', date:'2024-01-05', expires:null },
  { id:'AD-008', doc:'Proof of Address', type:'Identity', status:'Pending', date:'—', expires:null },
  { id:'AD-009', doc:'Insurance', type:'Financial', status:'Pending', date:'—', expires:'2026-09-30' },
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
  { id:'LST-001', project:'Palm Hills New Cairo', developer:'Palm Hills', unitType:'Villa', unitCode:'PH-NC-V101', area:320, bedrooms:4, bathrooms:3, floor:'Ground', price:12500000, paymentPlan:'10% down, 7 years', status:'Available', features:['Garden','Pool','Smart Home','Garage'], created:'2024-01-05', image:_img('1613490493576-7fde63acd811'), lat:30.029,  lng:31.490, city:'New Cairo' },
  { id:'LST-002', project:'ZED East', developer:'Ora', unitType:'Apartment', unitCode:'ZED-A205', area:180, bedrooms:3, bathrooms:2, floor:'2nd', price:8200000, paymentPlan:'15% down, 8 years', status:'Available', features:['Club Access','Gym','Landscape View'], created:'2024-01-06', image:_img('1564013799919-ab600027ffc6'), lat:30.043, lng:31.547, city:'New Cairo' },
  { id:'LST-003', project:'Hacienda Bay', developer:'Palm Hills', unitType:'Chalet', unitCode:'HB-CH-A12', area:140, bedrooms:2, bathrooms:2, floor:'Ground', price:16000000, paymentPlan:'20% down, 5 years', status:'Reserved', features:['Beach Access','Pool','Furnished'], created:'2024-01-07', image:_img('1572120360610-d971b9d7767c'), lat:30.890, lng:28.892, city:'North Coast' },
  { id:'LST-004', project:'Hyde Park', developer:'Hyde Park', unitType:'Townhouse', unitCode:'HP-TH-B304', area:260, bedrooms:4, bathrooms:3, floor:'Ground+1', price:11200000, paymentPlan:'10% down, 8 years', status:'Available', features:['Garden','Roof','Corner Unit'], created:'2024-01-08', image:_img('1600566753190-17f0baa2a6c3'), lat:30.013, lng:31.473, city:'New Cairo' },
  { id:'LST-005', project:'Madinaty', developer:'Talaat Moustafa', unitType:'Apartment', unitCode:'MD-APT-C110', area:150, bedrooms:3, bathrooms:2, floor:'1st', price:5200000, paymentPlan:'25% down, 6 years', status:'Available', features:['Park View','Balcony','Storage'], created:'2024-01-09', image:_img('1600585154340-be6161a56a0c'), lat:30.122, lng:31.696, city:'New Cairo' },
  { id:'LST-006', project:'Sodic West', developer:'Sodic', unitType:'Twin House', unitCode:'SW-TW-D201', area:280, bedrooms:4, bathrooms:3, floor:'Ground+1', price:9800000, paymentPlan:'15% down, 7 years', status:'Sold', features:['Garden','Smart Home','Club Access'], created:'2024-01-03', image:_img('1600596542815-ffad4c1539a9'), lat:30.058, lng:30.971, city:'Sheikh Zayed' },
  { id:'LST-007', project:'Mountain View', developer:'Mountain View', unitType:'Duplex', unitCode:'MV-DX-E105', area:220, bedrooms:3, bathrooms:3, floor:'3rd+4th', price:7800000, paymentPlan:'10% down, 8 years', status:'Available', features:['Terrace','View','Double Height'], created:'2024-01-10', image:_img('1600585154526-990dced4db0d'), lat:30.011, lng:31.499, city:'New Cairo' },
  { id:'LST-008', project:'Palm Hills New Cairo', developer:'Palm Hills', unitType:'Penthouse', unitCode:'PH-NC-PH801', area:350, bedrooms:4, bathrooms:4, floor:'8th', price:18500000, paymentPlan:'20% down, 6 years', status:'Available', features:['Roof Terrace','Panoramic View','Private Elevator','Pool'], created:'2024-01-11', image:_img('1600607687939-ce8a6c25118c'), lat:30.025, lng:31.489, city:'New Cairo' },
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

// Contracts module retired on 08-May. The CONTRACTS seed and CONTRACT_STAGES
// reference list have been removed. Contract lifecycle now lives on the Deal
// (see DEAL_STAGES_OFFPLAN and DEAL_STAGES_RESALE above): commission locks at
// "Contract Signed" / "Contract Signed & Payment"; revenue recognises at
// "Standard Collection (10%)" (Off Plan) or "Contract Signed & Payment" (Resale).

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
// `inferred: true` rows are pre-filled from the lead's campaign signal
// (CAMPAIGN_INFERENCE above) — the agent didn't capture them on a call.
// 11-May meeting (2:08-2:10): so the agent opens the conversation already
// knowing the customer's interest area.
export const BUYER_PREFERENCES = [
  { leadId:'L-1001', propertyTypes:['Villa','Townhouse','Apartment'], locations:['New Cairo'], budgetMin:6000000, budgetMax:15000000, inferred:true, inferredFrom:'New Cairo Launch', notes:'Auto-filled from campaign signal. Agent to confirm and refine on first call.' },
  { leadId:'L-1002', propertyTypes:['Apartment','Duplex'], locations:['New Cairo'], budgetMin:8000000, budgetMax:14000000, bedrooms:'3', bathrooms:'2', amenities:['Club Access','Gym','Landscape View'], preferredDevelopers:['Ora','Sodic'], timeline:'6 months', notes:'Young couple, first home. Wants modern design.' },
  { leadId:'L-1003', propertyTypes:['Apartment'], locations:['New Cairo','Heliopolis'], budgetMin:3000000, budgetMax:6000000, bedrooms:'3', bathrooms:'2', amenities:['Park View','Balcony'], preferredDevelopers:['Talaat Moustafa'], timeline:'Immediate', notes:'Cash buyer, wants ready-to-move or near delivery.' },
  { leadId:'L-1004', propertyTypes:['Chalet','Villa'], locations:['North Coast'], budgetMin:10000000, budgetMax:25000000, inferred:true, inferredFrom:'North Coast Summer', season:'Summer', notes:'Auto-filled from campaign. Confirm bedroom count and timeline on first call.' },
  { leadId:'L-1005', propertyTypes:['Villa','Twin House','Townhouse'], locations:['Sheikh Zayed','6th October'], budgetMin:8000000, budgetMax:14000000, inferred:true, inferredFrom:'Sheikh Zayed Promo', notes:'Auto-filled from campaign signal.' },
  { leadId:'L-1006', propertyTypes:['Apartment','Office'], locations:['New Capital'], budgetMin:4000000, budgetMax:12000000, inferred:true, inferredFrom:'New Capital Launch', notes:'Auto-filled from campaign signal.' },
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
// 11-May stakeholder ask: add Nurturing stage as an alternative to Closed Lost
// so leads that aren't ready right now are kept warm for re-engagement.
export const STAGES = ['New', 'Contacted', 'Qualified', 'Tour Scheduled', 'Negotiation', 'Reservation', 'Contracting', 'Closed Won', 'Nurturing', 'Closed Lost'];
export const PRIORITIES = ['Hot', 'Warm', 'Cold'];
export const SOURCES = ['Marketplace', 'Referral', 'Walk-in', 'Campaign', 'Cold Call', 'Property Fair'];
export const TASK_TYPES = ['Call', 'Tour', 'WhatsApp', 'Meeting', 'Contract', 'Finance', 'Follow-up'];
export const TASK_STATUS = ['Pending', 'In Progress', 'Completed', 'Overdue'];
export const APPLICATION_STATUS = ['Submitted', 'Under Review', 'Interview Pending', 'Missing Documents', 'Training Pending', 'Approved', 'Rejected'];
export const DOC_STATUS = ['Pending Review', 'Approved', 'Rejected', 'Missing'];
export const CANDIDATE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
export const JOB_STATUS = ['Draft', 'Published', 'Closed'];
export const TOUR_STATUS = ['Scheduled', 'Completed', 'Cancelled', 'No-Show'];
// CONTRACT_STAGES retired — see DEAL_STAGES_OFFPLAN / DEAL_STAGES_RESALE above.
export const SHARE_CHANNELS = ['WhatsApp', 'Email', 'Call', 'SMS'];
export const SHARE_RESPONSES = ['Interested', 'Viewed', 'No Response'];
export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Townhouse', 'Duplex', 'Penthouse', 'Chalet', 'Twin House', 'Studio'];
export const LISTING_STATUS = ['Available', 'Reserved', 'Sold'];
