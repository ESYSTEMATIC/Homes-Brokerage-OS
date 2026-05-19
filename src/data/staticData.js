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
  // parentId expresses the org-chart hierarchy. Executive is the root.
  { id: "DEP-007", name: "Executive", head: "CEO", teams: 0, employees: 2, status: "Active", parentId: null },
  { id: "DEP-001", name: "Sales", head: "Nour El-Din", teams: 3, employees: 12, status: "Active", parentId: "DEP-007" },
  { id: "DEP-002", name: "HR / Recruitment", head: "Dina Samir", teams: 1, employees: 4, status: "Active", parentId: "DEP-007" },
  { id: "DEP-003", name: "Finance", head: "Amr Khaled", teams: 1, employees: 3, status: "Active", parentId: "DEP-007" },
  { id: "DEP-004", name: "Backoffice", head: "Laila Hassan", teams: 1, employees: 5, status: "Active", parentId: "DEP-007" },
  { id: "DEP-005", name: "Marketing", head: "Tamer Said", teams: 1, employees: 3, status: "Active", parentId: "DEP-007" },
  { id: "DEP-006", name: "Marketplace Operations", head: "Rania Youssef", teams: 1, employees: 2, status: "Active", parentId: "DEP-007" },
];

// ── STAFF / EMPLOYEES ──
// Sample photos use Unsplash with stable photo IDs depicting Arab/Middle
// Eastern people, sized via the `w=200&h=200&fit=crop&crop=faces` parameter
// set. Resume names are filled but the data URL is null — the drawer
// surfaces a friendly "older record" toast on download.
export const STAFF = [
  { id: "A001", name: "Ahmed Hassan",    department: "Sales", title: "Senior Sales Executive", branch: "New Cairo",   manager: "Karim Mahmoud", team: "Beta",  status: "Active",   type: "Employee",      email: "ahmed@homesbrokerage.eg", phone: "+20 100 111 0001", joinDate: "2023-06-01",
    photoDataUrl: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "ahmed-hassan.png",  resumeName: "ahmed-hassan-cv.pdf",  resumeDataUrl: null,
    nationalityCountry: "Egyptian", nationalId: "29010101******", source: "Careers Page",  rera: "RERA-EG-2024-1101", contractType: "Full-time, indefinite" },
  { id: "A002", name: "Fatma Ibrahim",   department: "Sales", title: "Sales Agent",            branch: "6th October", manager: "Omar Sherif",    team: "Alpha", status: "Active",   type: "Employee",      email: "fatma@homesbrokerage.eg", phone: "+20 100 111 0002", joinDate: "2023-07-15",
    photoDataUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "fatma-ibrahim.png", resumeName: "fatma-ibrahim-cv.pdf", resumeDataUrl: null,
    nationalityCountry: "Egyptian", nationalId: "29508081******", source: "Referral",       rera: "RERA-EG-2024-1102", contractType: "Full-time, indefinite" },
  { id: "A003", name: "Mohamed Ali",     department: "Sales", title: "Team Leader",            branch: "Sheikh Zayed", manager: "Karim Mahmoud",    team: "Beta", status: "Active",   type: "Team Leader",   email: "mali@homesbrokerage.eg",  phone: "+20 100 111 0003", joinDate: "2022-03-10",
    photoDataUrl: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "mohamed-ali.png",   resumeName: "mohamed-ali-cv.pdf",   resumeDataUrl: null,
    nationalityCountry: "Egyptian", nationalId: "28804152******", source: "Direct outreach", rera: "RERA-EG-2023-0871", contractType: "Full-time, indefinite" },
  { id: "A004", name: "Nour El-Din",     department: "Sales", title: "Sales Manager",          branch: "New Cairo",   manager: "Tarek Amin",     team: "Alpha", status: "Active",   type: "Sales Manager", email: "nour@homesbrokerage.eg",  phone: "+20 100 111 0004", joinDate: "2021-09-01",
    photoDataUrl: "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "nour-eldin.png",    resumeName: "nour-eldin-cv.pdf",    resumeDataUrl: null,
    nationalityCountry: "Egyptian", nationalId: "28012061******", source: "LinkedIn",       rera: "RERA-EG-2021-0312", contractType: "Full-time, indefinite" },
  { id: "A005", name: "Yasmin Adel",     department: "Sales", title: "Sales Agent",            branch: "Heliopolis",  manager: "Mohamed Ali",     team: "Beta",  status: "Suspended",type: "Employee",      email: "yasmin@homesbrokerage.eg", phone: "+20 100 111 0005", joinDate: "2023-11-20",
    photoDataUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "yasmin-adel.png",   resumeName: "yasmin-adel-cv.pdf",   resumeDataUrl: null,
    nationalityCountry: "Egyptian", nationalId: "29612031******", source: "LinkedIn",       rera: "Pending verification", contractType: "Full-time, probation" },
  { id: "A006", name: "Karim Mahmoud",   department: "Sales", title: "Sales Manager",          branch: "New Cairo",   manager: "Tarek Amin",     team: "Beta",  status: "Active",   type: "Sales Manager", email: "karim@homesbrokerage.eg", phone: "+20 100 111 0006", joinDate: "2021-05-01",
    photoDataUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "karim-mahmoud.png", resumeName: "karim-mahmoud-cv.pdf", resumeDataUrl: null,
    nationalityCountry: "Egyptian", nationalId: "27908111******", source: "Direct outreach", rera: "RERA-EG-2021-0188", contractType: "Full-time, indefinite" },
  { id: "A007", name: "Hana Mahmoud",    department: "Sales", title: "Junior Sales",           branch: "6th October", manager: "Omar Sherif",    team: "Alpha", status: "Pending",  type: "Employee",      email: "hana@homesbrokerage.eg",  phone: "+20 100 111 0007", joinDate: "2024-01-10",
    photoDataUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "hana-mahmoud.png",  resumeName: "hana-mahmoud-cv.pdf",  resumeDataUrl: null,
    nationalityCountry: "Egyptian", nationalId: "30002171******", source: "Careers Page",   rera: "In progress",         contractType: "Full-time, probation" },
  { id: "A008", name: "Omar Sherif",     department: "Sales", title: "Team Leader",            branch: "6th October", manager: "Nour El-Din",    team: "Alpha", status: "Active",   type: "Team Leader",   email: "omar@homesbrokerage.eg",  phone: "+20 100 111 0008", joinDate: "2022-08-15",
    photoDataUrl: "https://images.unsplash.com/photo-1545167622-3a6ac756afa4?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "omar-sherif.png",   resumeName: "omar-sherif-cv.pdf",   resumeDataUrl: null,
    nationalityCountry: "Egyptian", nationalId: "28705241******", source: "Referral",       rera: "RERA-EG-2023-0654", contractType: "Full-time, indefinite" },
  // Sales Director — top of the sales hierarchy. Tarek leads Nour El-Din
  // (Alpha team) and Karim Mahmoud (Beta team). The full chain becomes:
  //   Tarek Amin → { Nour El-Din → Omar Sherif → {Fatma, Hana},
  //                  Karim Mahmoud → Mohamed Ali → {Ahmed, Yasmin} }
  { id: "A009", name: "Tarek Amin",      department: "Sales", title: "Sales Director",         branch: "New Cairo",   manager: "CEO",            team: null,    status: "Active",   type: "Sales Director", email: "tarek@homesbrokerage.eg", phone: "+20 100 111 0009", joinDate: "2019-04-12",
    photoDataUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "tarek-amin.png",
    resumeName: "tarek-amin-cv.pdf", resumeDataUrl: null,
    nationalityCountry: "Egyptian", nationalId: "27510020******", source: "Direct outreach", rera: "RERA-EG-2019-0042", contractType: "Full-time, indefinite" },
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
  // ─── Expansion seed (May 2026) — investor-ready volume across all stages ───
  { id: "L-1009", name: "Hassan Magdy",   phone: "+20 100 234 1100", email: "hassan.magdy@mail.com",   source: "Marketplace", campaign: "New Cairo Launch", project: "Mivida",        developer: "Emaar",            budget: 6800000,  stage: "New",            owner: "Ahmed Hassan",  team: "Alpha", duplicate: "Clear", priority: "Warm", created: "2026-05-16" },
  { id: "L-1010", name: "Rania Adel",     phone: "+20 111 345 2210", email: "rania.adel@mail.com",     source: "Marketplace", campaign: "North Coast Summer", project: "Hacienda Bay", developer: "Palm Hills",       budget: 14500000, stage: "New",            owner: null,             team: "Unassigned", duplicate: "Clear", priority: "Hot",  created: "2026-05-17" },
  { id: "L-1011", name: "Amr Khaled",     phone: "+20 122 456 3320", email: "amr.khaled@mail.com",     source: "Cold Call",   campaign: "Database Reactivation", project: "Capital Heights", developer: "Better Home", budget: 4200000,  stage: "New",            owner: null,             team: "Unassigned", duplicate: "Clear", priority: "Cold", created: "2026-05-15" },
  { id: "L-1012", name: "Salma Tarek",    phone: "+20 100 567 4430", email: "salma.tarek@mail.com",    source: "Referral",    campaign: "Agent Referral", project: "Eastown Residences", developer: "Sodic",       budget: 11000000, stage: "New",            owner: "Fatma Ibrahim",  team: "Alpha", duplicate: "Clear", priority: "Hot",  created: "2026-05-16" },
  { id: "L-1013", name: "Walid Sherif",   phone: "+20 111 678 5540", email: "walid.sherif@mail.com",   source: "Walk-in",     campaign: "Mall Pop-up", project: "Cairo Festival City", developer: "Al-Futtaim",   budget: 5700000,  stage: "New",            owner: "Omar Sherif",    team: "Beta",  duplicate: "Clear", priority: "Warm", created: "2026-05-14" },
  { id: "L-1014", name: "Heba Ezzat",     phone: "+20 122 789 6650", email: "heba.ezzat@mail.com",     source: "Property Fair", campaign: "Cityscape 2026", project: "Cairo Gate",      developer: "Emaar",            budget: 9300000,  stage: "New",            owner: null,             team: "Unassigned", duplicate: "Clear", priority: "Warm", created: "2026-05-15" },
  { id: "L-1015", name: "Sameh Galal",    phone: "+20 100 890 7760", email: "sameh.galal@mail.com",    source: "Marketplace", campaign: "New Capital Launch", project: "Midtown",         developer: "Better Home",      budget: 3800000,  stage: "New",            owner: "Ahmed Hassan",   team: "Alpha", duplicate: "Clear", priority: "Cold", created: "2026-05-13" },
  { id: "L-1016", name: "Nadia Riad",     phone: "+20 111 901 8870", email: "nadia.riad@mail.com",     source: "Campaign",    campaign: "EOY Bonus", project: "ZED East",                developer: "Ora",              budget: 13700000, stage: "New",            owner: null,             team: "Unassigned", duplicate: "Review", priority: "Hot",  created: "2026-05-17" },
  { id: "L-1017", name: "Bassem Helmy",   phone: "+20 100 012 9980", email: "bassem.helmy@mail.com",   source: "Marketplace", campaign: "Sheikh Zayed Promo", project: "Sodic West",      developer: "Sodic",            budget: 8400000,  stage: "Contacted",      owner: "Ahmed Hassan",   team: "Alpha", duplicate: "Clear", priority: "Hot",  created: "2026-05-12" },
  { id: "L-1018", name: "Reem Saleh",     phone: "+20 122 123 1090", email: "reem.saleh@mail.com",     source: "Referral",    campaign: "VIP Client Referral", project: "Marassi",         developer: "Emaar",            budget: 22000000, stage: "Contacted",      owner: "Fatma Ibrahim",  team: "Alpha", duplicate: "Clear", priority: "Hot",  created: "2026-05-10" },
  { id: "L-1019", name: "Magdy Nasr",     phone: "+20 100 234 2100", email: "magdy.nasr@mail.com",     source: "Walk-in",     campaign: "Branch Walk-in", project: "Madinaty",            developer: "Talaat Moustafa",  budget: 4900000,  stage: "Contacted",      owner: "Omar Sherif",    team: "Beta",  duplicate: "Clear", priority: "Warm", created: "2026-05-09" },
  { id: "L-1020", name: "Inji Lotfy",     phone: "+20 111 345 3210", email: "inji.lotfy@mail.com",     source: "Marketplace", campaign: "Summer Sahel", project: "Telal Sokhna",            developer: "Roya",             budget: 7600000,  stage: "Contacted",      owner: "Hana Mahmoud",   team: "Beta",  duplicate: "Clear", priority: "Warm", created: "2026-05-08" },
  { id: "L-1021", name: "Ashraf Khalil",  phone: "+20 122 456 4320", email: "ashraf.khalil@mail.com",  source: "Cold Call",   campaign: "Targeted Outreach", project: "Palm Parks",       developer: "Palm Hills",       budget: 6200000,  stage: "Contacted",      owner: "Ahmed Hassan",   team: "Alpha", duplicate: "Clear", priority: "Cold", created: "2026-05-11" },
  { id: "L-1022", name: "Mariam Fathy",   phone: "+20 100 567 5430", email: "mariam.fathy@mail.com",   source: "Referral",    campaign: "Broker Referral", project: "Al Rehab City",       developer: "Talaat Moustafa",  budget: 5400000,  stage: "Contacted",      owner: "Omar Sherif",    team: "Beta",  duplicate: "Clear", priority: "Warm", created: "2026-05-07" },
  { id: "L-1023", name: "Adel Naguib",    phone: "+20 111 678 6540", email: "adel.naguib@mail.com",    source: "Marketplace", campaign: "New Cairo Launch", project: "Hyde Park",          developer: "Hyde Park",        budget: 10800000, stage: "Qualified",      owner: "Fatma Ibrahim",  team: "Alpha", duplicate: "Clear", priority: "Hot",  created: "2026-05-04" },
  { id: "L-1024", name: "Yasmin Nabil",   phone: "+20 122 789 7650", email: "yasmin.nabil@mail.com",   source: "Marketplace", campaign: "North Coast Summer", project: "Marassi",        developer: "Emaar",            budget: 17500000, stage: "Qualified",      owner: "Hana Mahmoud",   team: "Beta",  duplicate: "Clear", priority: "Hot",  created: "2026-05-03" },
  { id: "L-1025", name: "Ramy Aziz",      phone: "+20 100 890 8760", email: "ramy.aziz@mail.com",      source: "Campaign",    campaign: "Ramadan Offer", project: "Mountain View iCity", developer: "Mountain View",    budget: 8900000,  stage: "Qualified",      owner: "Omar Sherif",    team: "Beta",  duplicate: "Clear", priority: "Hot",  created: "2026-05-05" },
  { id: "L-1026", name: "Farida Samir",   phone: "+20 111 901 9870", email: "farida.samir@mail.com",   source: "Referral",    campaign: "Agent Referral", project: "Zahya New Mansoura", developer: "City Edge",         budget: 4500000,  stage: "Qualified",      owner: "Ahmed Hassan",   team: "Alpha", duplicate: "Clear", priority: "Warm", created: "2026-05-02" },
  { id: "L-1027", name: "Hossam Magdy",   phone: "+20 100 012 0980", email: "hossam.magdy@mail.com",   source: "Property Fair", campaign: "Project Fair Q1", project: "Eastown Residences", developer: "Sodic",          budget: 12100000, stage: "Qualified",      owner: "Fatma Ibrahim",  team: "Alpha", duplicate: "Clear", priority: "Warm", created: "2026-05-01" },
  { id: "L-1028", name: "Habiba Adel",    phone: "+20 122 123 2090", email: "habiba.adel@mail.com",    source: "Marketplace", campaign: "New Cairo Launch", project: "Palm Hills New Cairo", developer: "Palm Hills",     budget: 13200000, stage: "Tour Scheduled", owner: "Fatma Ibrahim",  team: "Alpha", duplicate: "Clear", priority: "Hot",  created: "2026-04-28" },
  { id: "L-1029", name: "Ehab Saleh",     phone: "+20 100 234 3100", email: "ehab.saleh@mail.com",     source: "Marketplace", campaign: "Sheikh Zayed Promo", project: "Sodic West",      developer: "Sodic",            budget: 9700000,  stage: "Tour Scheduled", owner: "Ahmed Hassan",   team: "Alpha", duplicate: "Clear", priority: "Hot",  created: "2026-04-26" },
  { id: "L-1030", name: "Aya Nasr",       phone: "+20 111 345 4210", email: "aya.nasr@mail.com",       source: "Referral",    campaign: "Broker Referral", project: "ZED East",            developer: "Ora",              budget: 14800000, stage: "Tour Scheduled", owner: "Hana Mahmoud",   team: "Beta",  duplicate: "Clear", priority: "Hot",  created: "2026-04-25" },
  { id: "L-1031", name: "Wael Helmy",     phone: "+20 122 456 5320", email: "wael.helmy@mail.com",     source: "Walk-in",     campaign: "Branch Visit", project: "Cairo Festival City",     developer: "Al-Futtaim",       budget: 6500000,  stage: "Tour Scheduled", owner: "Omar Sherif",    team: "Beta",  duplicate: "Clear", priority: "Warm", created: "2026-04-24" },
  { id: "L-1032", name: "Rasha Ezzat",    phone: "+20 100 567 6430", email: "rasha.ezzat@mail.com",    source: "Marketplace", campaign: "North Coast Summer", project: "Hacienda Bay",   developer: "Palm Hills",       budget: 18900000, stage: "Negotiation",    owner: "Hana Mahmoud",   team: "Beta",  duplicate: "Clear", priority: "Hot",  created: "2026-04-18" },
  { id: "L-1033", name: "Ayman Lotfy",    phone: "+20 111 678 7540", email: "ayman.lotfy@mail.com",    source: "Referral",    campaign: "VIP Client Referral", project: "Hyde Park",       developer: "Hyde Park",        budget: 12400000, stage: "Negotiation",    owner: "Fatma Ibrahim",  team: "Alpha", duplicate: "Clear", priority: "Hot",  created: "2026-04-15" },
  { id: "L-1034", name: "Dina Khalil",    phone: "+20 122 789 8650", email: "dina.khalil@mail.com",    source: "Marketplace", campaign: "EOY Bonus", project: "Mivida",                       developer: "Emaar",            budget: 7800000,  stage: "Negotiation",    owner: "Ahmed Hassan",   team: "Alpha", duplicate: "Clear", priority: "Warm", created: "2026-04-12" },
  { id: "L-1035", name: "Sherif Galal",   phone: "+20 100 890 9760", email: "sherif.galal@mail.com",   source: "Property Fair", campaign: "Cityscape 2026", project: "Marassi",          developer: "Emaar",            budget: 16500000, stage: "Reservation",    owner: "Fatma Ibrahim",  team: "Alpha", duplicate: "Clear", priority: "Hot",  created: "2026-04-05" },
  { id: "L-1036", name: "Maha Riad",      phone: "+20 111 901 0870", email: "maha.riad@mail.com",      source: "Marketplace", campaign: "New Capital Launch", project: "Capital Heights", developer: "Better Home",     budget: 5100000,  stage: "Reservation",    owner: "Omar Sherif",    team: "Beta",  duplicate: "Clear", priority: "Hot",  created: "2026-04-02" },
  { id: "L-1037", name: "Khaled Tarek",   phone: "+20 100 012 1980", email: "khaled.tarek@mail.com",   source: "Referral",    campaign: "Agent Referral", project: "Mountain View iCity", developer: "Mountain View",    budget: 9400000,  stage: "Closed Won",     owner: "Ahmed Hassan",   team: "Alpha", duplicate: "Clear", priority: "Hot",  created: "2026-02-20" },
  { id: "L-1038", name: "Nour Magdy",     phone: "+20 122 123 3090", email: "nour.magdy@mail.com",     source: "Marketplace", campaign: "Sheikh Zayed Promo", project: "Sodic West",      developer: "Sodic",            budget: 10300000, stage: "Closed Won",     owner: "Fatma Ibrahim",  team: "Alpha", duplicate: "Clear", priority: "Hot",  created: "2026-02-10" },
  { id: "L-1039", name: "Ehab Khaled",    phone: "+20 100 234 4100", email: "ehab.khaled@mail.com",    source: "Cold Call",   campaign: "Old Lead Follow-up", project: "Midtown",         developer: "Better Home",      budget: 3500000,  stage: "Closed Lost",    owner: "Omar Sherif",    team: "Beta",  duplicate: "Clear", priority: "Cold", created: "2026-03-15", lostReason: "Budget gap, customer chose competitor" },
  { id: "L-1040", name: "Salma Adel",     phone: "+20 111 345 5210", email: "salma.adel@mail.com",     source: "Marketplace", campaign: "North Coast Summer", project: "Telal Sokhna",   developer: "Roya",             budget: 6200000,  stage: "Closed Lost",    owner: "Hana Mahmoud",   team: "Beta",  duplicate: "Clear", priority: "Cold", created: "2026-03-08", lostReason: "Delivery date too far, customer wanted ready-to-move" },
  { id: "L-1041", name: "Tarek Aziz",     phone: "+20 122 456 6320", email: "tarek.aziz@mail.com",     source: "Marketplace", campaign: "New Cairo Launch", project: "Palm Hills New Cairo", developer: "Palm Hills",      budget: 11800000, stage: "Closed Lost",    owner: "Ahmed Hassan",   team: "Alpha", duplicate: "Clear", priority: "Cold", created: "2026-03-22", lostReason: "Withdrew — buying outside Egypt" },
  { id: "L-1042", name: "Inji Samir",     phone: "+20 100 567 7430", email: "inji.samir@mail.com",     source: "Referral",    campaign: "VIP Client Referral", project: "Cairo Gate",      developer: "Emaar",            budget: 13500000, stage: "Nurturing",      owner: "Fatma Ibrahim",  team: "Alpha", duplicate: "Clear", priority: "Cold", created: "2026-02-25", notes: "[Nurturing] Customer waiting for next launch phase (Q3 2026)." },
  { id: "L-1043", name: "Hossam Adel",    phone: "+20 111 678 8540", email: "hossam.adel@mail.com",    source: "Property Fair", campaign: "Project Fair Q1", project: "Eastown Residences", developer: "Sodic",         budget: 8700000,  stage: "Nurturing",      owner: "Omar Sherif",    team: "Beta",  duplicate: "Clear", priority: "Cold", created: "2026-02-18", notes: "[Nurturing] Budget too low right now, re-engage after EOY bonus." },
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
  // ─── Expansion seed (May 2026) — broader pipeline for analytics ───
  { id: "D-510", type: "OffPlan", lead: "Adel Naguib",     leadName: "Adel Naguib",     owner: "Fatma Ibrahim", team: "Alpha", project: "Hyde Park",            developer: "Hyde Park",        propertyId: "LST-004", stage: "Lead Qualified",                value: 10800000, commission: 1.8, reservationDeposit: 0,      paymentPlan: "10% down · 8y installments", collectionPercent: 0, commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], status: "Active",     created: "2026-05-04" },
  { id: "D-511", type: "OffPlan", lead: "Yasmin Nabil",    leadName: "Yasmin Nabil",    owner: "Hana Mahmoud",  team: "Beta",  project: "Marassi",              developer: "Emaar",            propertyId: null,      stage: "Lead Qualified",                value: 17500000, commission: 2.2, reservationDeposit: 0,      paymentPlan: "20% down · 5y installments", collectionPercent: 0, commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], status: "Active",     created: "2026-05-03" },
  { id: "D-512", type: "OffPlan", lead: "Ramy Aziz",       leadName: "Ramy Aziz",       owner: "Omar Sherif",   team: "Beta",  project: "Mountain View iCity",  developer: "Mountain View",    propertyId: "LST-007", stage: "Reservation",                   value: 8900000,  commission: 2.0, reservationDeposit: 180000, paymentPlan: "10% down · 7y installments", collectionPercent: 0, commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [{ id:'ATT-010', name:'Reservation_Receipt_MV.pdf', size:'250 KB', uploadedAt:'2026-05-05' }], status: "Active", created: "2026-05-05" },
  { id: "D-513", type: "OffPlan", lead: "Habiba Adel",     leadName: "Habiba Adel",     owner: "Fatma Ibrahim", team: "Alpha", project: "Palm Hills New Cairo", developer: "Palm Hills",       propertyId: "LST-001", stage: "Contract Signed",               value: 13200000, commission: 2.0, reservationDeposit: 300000, paymentPlan: "15% down · 6y installments", collectionPercent: 4, commissionLocked: true,  homesAdvanceAvailable: false, revenueRecognised: false, attachments: [{ id:'ATT-011', name:'SPA_Palm_Hills.pdf', size:'1.3 MB', uploadedAt:'2026-04-30' }], status: "Active", created: "2026-04-28" },
  { id: "D-514", type: "OffPlan", lead: "Rasha Ezzat",     leadName: "Rasha Ezzat",     owner: "Hana Mahmoud",  team: "Beta",  project: "Hacienda Bay",         developer: "Palm Hills",       propertyId: "LST-003", stage: "Early Collection Trigger (5%)", value: 18900000, commission: 2.5, reservationDeposit: 450000, paymentPlan: "20% down · 5y installments", collectionPercent: 6, commissionLocked: true,  homesAdvanceAvailable: true,  revenueRecognised: false, attachments: [{ id:'ATT-012', name:'SPA_Hacienda_Bay.pdf', size:'1.5 MB', uploadedAt:'2026-04-22' }, { id:'ATT-013', name:'Reservation.pdf', size:'320 KB', uploadedAt:'2026-04-20' }], status: "Active", created: "2026-04-18" },
  { id: "D-515", type: "OffPlan", lead: "Ayman Lotfy",     leadName: "Ayman Lotfy",     owner: "Fatma Ibrahim", team: "Alpha", project: "Hyde Park",            developer: "Hyde Park",        propertyId: "LST-004", stage: "Contract Signed",               value: 12400000, commission: 2.0, reservationDeposit: 260000, paymentPlan: "10% down · 8y installments", collectionPercent: 3, commissionLocked: true,  homesAdvanceAvailable: false, revenueRecognised: false, attachments: [{ id:'ATT-014', name:'SPA_Hyde_Park_B.pdf', size:'1.2 MB', uploadedAt:'2026-04-18' }], status: "Active", created: "2026-04-15" },
  { id: "D-516", type: "OffPlan", lead: "Sherif Galal",    leadName: "Sherif Galal",    owner: "Fatma Ibrahim", team: "Alpha", project: "Marassi",              developer: "Emaar",            propertyId: null,      stage: "Reservation",                   value: 16500000, commission: 2.3, reservationDeposit: 350000, paymentPlan: "25% down · 5y installments", collectionPercent: 0, commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], status: "Active",     created: "2026-04-05" },
  { id: "D-517", type: "OffPlan", lead: "Maha Riad",       leadName: "Maha Riad",       owner: "Omar Sherif",   team: "Beta",  project: "Capital Heights",      developer: "Better Home",      propertyId: null,      stage: "Reservation",                   value: 5100000,  commission: 1.6, reservationDeposit: 110000, paymentPlan: "10% down · 9y installments", collectionPercent: 0, commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], status: "Active",     created: "2026-04-02" },
  { id: "D-518", type: "OffPlan", lead: "Khaled Tarek",    leadName: "Khaled Tarek",    owner: "Ahmed Hassan",  team: "Alpha", project: "Mountain View iCity",  developer: "Mountain View",    propertyId: "LST-007", stage: "Standard Collection (10%)",     value: 9400000,  commission: 2.0, reservationDeposit: 200000, paymentPlan: "10% down · 7y installments", collectionPercent: 12, commissionLocked: true, homesAdvanceAvailable: true,  revenueRecognised: true,  attachments: [{ id:'ATT-015', name:'SPA_MV_Approved.pdf', size:'1.1 MB', uploadedAt:'2026-03-01' }, { id:'ATT-016', name:'Commission_Release.pdf', size:'180 KB', uploadedAt:'2026-05-02' }], status: "Closed Won", created: "2026-02-20" },
  { id: "D-519", type: "OffPlan", lead: "Nour Magdy",      leadName: "Nour Magdy",      owner: "Fatma Ibrahim", team: "Alpha", project: "Sodic West",           developer: "Sodic",            propertyId: "LST-006", stage: "Standard Collection (10%)",     value: 10300000, commission: 2.1, reservationDeposit: 220000, paymentPlan: "15% down · 6y installments", collectionPercent: 14, commissionLocked: true, homesAdvanceAvailable: true,  revenueRecognised: true,  attachments: [{ id:'ATT-017', name:'SPA_Sodic_West.pdf', size:'1.2 MB', uploadedAt:'2026-02-25' }, { id:'ATT-018', name:'Commission_Release_Sodic.pdf', size:'180 KB', uploadedAt:'2026-04-28' }], status: "Closed Won", created: "2026-02-10" },
  { id: "D-520", type: "Resale",  lead: "Aya Nasr",        leadName: "Aya Nasr",        owner: "Hana Mahmoud",  team: "Beta",  project: "ZED East",             developer: "Ora",              propertyId: "LST-002", stage: "Property Viewed",               value: 14800000, commission: 2.5, offerPrice: 0,           paymentMethod: "Cash",                    commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], status: "Active",     created: "2026-04-25" },
  { id: "D-521", type: "Resale",  lead: "Wael Helmy",      leadName: "Wael Helmy",      owner: "Omar Sherif",   team: "Beta",  project: "Cairo Festival City",  developer: "Al-Futtaim",       propertyId: null,      stage: "Property Viewed",               value: 6500000,  commission: 2.0, offerPrice: 0,           paymentMethod: "Mortgage",                commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], status: "Active",     created: "2026-04-24" },
  { id: "D-522", type: "Resale",  lead: "Dina Khalil",     leadName: "Dina Khalil",     owner: "Ahmed Hassan",  team: "Alpha", project: "Mivida",               developer: "Emaar",            propertyId: null,      stage: "Offer Made",                    value: 7800000,  commission: 2.2, offerPrice: 7500000,     paymentMethod: "Cash",                    commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [{ id:'ATT-019', name:'Offer_Letter_Mivida.pdf', size:'90 KB', uploadedAt:'2026-04-15' }], status: "Active", created: "2026-04-12" },
  { id: "D-523", type: "Resale",  lead: "Hossam Magdy",    leadName: "Hossam Magdy",    owner: "Fatma Ibrahim", team: "Alpha", project: "Eastown Residences",   developer: "Sodic",            propertyId: null,      stage: "Offer Accepted",                value: 12100000, commission: 2.3, offerPrice: 11800000,    paymentMethod: "Mortgage",                commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [{ id:'ATT-020', name:'MOU_Eastown.pdf', size:'260 KB', uploadedAt:'2026-05-01' }], status: "Active", created: "2026-05-01" },
  { id: "D-524", type: "Resale",  lead: "Hassan Magdy",    leadName: "Hassan Magdy",    owner: "Ahmed Hassan",  team: "Alpha", project: "Mivida",               developer: "Emaar",            propertyId: null,      stage: "Lead Qualified",                value: 6800000,  commission: 2.0, offerPrice: 0,           paymentMethod: "Cash",                    commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], status: "Active",     created: "2026-05-16" },
  // Closed Lost / cancelled
  { id: "D-525", type: "OffPlan", lead: "Ehab Khaled",     leadName: "Ehab Khaled",     owner: "Omar Sherif",   team: "Beta",  project: "Midtown",              developer: "Better Home",      propertyId: null,      stage: "Lead Qualified",                value: 3500000,  commission: 1.5, reservationDeposit: 0,      paymentPlan: "—",                         collectionPercent: 0, commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], lostReason: "Customer chose competitor", status: "Closed Lost", created: "2026-03-15" },
  { id: "D-526", type: "Resale",  lead: "Salma Adel",      leadName: "Salma Adel",      owner: "Hana Mahmoud",  team: "Beta",  project: "Telal Sokhna",         developer: "Roya",             propertyId: null,      stage: "Property Viewed",               value: 6200000,  commission: 2.0, offerPrice: 0,           paymentMethod: "Cash",                    commissionLocked: false, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [], lostReason: "Customer wanted ready-to-move", status: "Closed Lost", created: "2026-03-08" },
  // Pending Sales Director override approval
  { id: "D-527", type: "OffPlan", lead: "Reem Saleh",      leadName: "Reem Saleh",      owner: "Fatma Ibrahim", team: "Alpha", project: "Marassi",              developer: "Emaar",            propertyId: null,      stage: "Contract Signed",               value: 22000000, commission: 2.0, reservationDeposit: 500000, paymentPlan: "20% down · 5y installments", collectionPercent: 5, commissionLocked: true, homesAdvanceAvailable: false, revenueRecognised: false, attachments: [{ id:'ATT-021', name:'SPA_Marassi.pdf', size:'1.4 MB', uploadedAt:'2026-05-10' }], commissionOverride: { currentPct: 2.0, requestedPct: 2.4, requestedBy: 'Fatma Ibrahim', requestedAt: '2026-05-12T10:00', reason: 'VIP referral, retain client for future launches', approver: 'Sales Director', status: 'Pending', history: [] }, status: "Active", created: "2026-05-10" },
];

// ── TASKS ──
export const TASKS = [
  { id: "T-001", title: "Follow up with Mohamed Hassan", type: "Call", owner: "Ahmed Hassan", lead: "L-1001", due: "2024-01-18", priority: "High", status: "Pending" },
  { id: "T-002", title: "Schedule tour - ZED East", type: "Tour", owner: "Fatma Ibrahim", lead: "L-1002", due: "2024-01-19", priority: "High", status: "Completed" },
  { id: "T-003", title: "Send payment plan details", type: "WhatsApp", owner: "Hana Mahmoud", lead: "L-1004", due: "2024-01-17", priority: "Medium", status: "Overdue" },
  { id: "T-004", title: "Qualification call - Layla Ahmed", type: "Call", owner: null, lead: "L-1005", due: "2024-01-20", priority: "Medium", status: "Pending" },
  { id: "T-005", title: "Contract review - Hyde Park", type: "Contract", owner: "Fatma Ibrahim", lead: "L-1007", due: "2024-01-21", priority: "High", status: "Pending" },
  { id: "T-006", title: "Finance follow-up on Hacienda deal", type: "Finance", owner: "Hana Mahmoud", lead: "L-1004", due: "2024-01-22", priority: "High", status: "Pending" },
  // ─── Expansion seed (May 2026) ───
  { id: "T-007", title: "Send Mivida brochure to Hassan Magdy",     type: "WhatsApp", owner: "Ahmed Hassan",  lead: "L-1009", due: "2026-05-19", priority: "Medium", status: "Pending" },
  { id: "T-008", title: "Qualification call — Rania Adel",          type: "Call",     owner: null,             lead: "L-1010", due: "2026-05-19", priority: "High",   status: "Pending" },
  { id: "T-009", title: "Database reactivation — Amr Khaled",       type: "Call",     owner: null,             lead: "L-1011", due: "2026-05-20", priority: "Low",    status: "Pending" },
  { id: "T-010", title: "Schedule discovery call — Salma Tarek",    type: "Call",     owner: "Fatma Ibrahim",  lead: "L-1012", due: "2026-05-18", priority: "High",   status: "In Progress" },
  { id: "T-011", title: "Send Marassi options to Reem Saleh",       type: "Email",    owner: "Fatma Ibrahim",  lead: "L-1018", due: "2026-05-15", priority: "High",   status: "Completed" },
  { id: "T-012", title: "Follow-up Eastown viewing — Hossam Magdy", type: "Follow-up",owner: "Fatma Ibrahim",  lead: "L-1027", due: "2026-05-08", priority: "Medium", status: "Overdue" },
  { id: "T-013", title: "Tour Hyde Park TH-B304 — Adel Naguib",     type: "Tour",     owner: "Fatma Ibrahim",  lead: "L-1023", due: "2026-05-21", priority: "High",   status: "Pending" },
  { id: "T-014", title: "Tour Marassi Penthouse — Yasmin Nabil",    type: "Tour",     owner: "Hana Mahmoud",   lead: "L-1024", due: "2026-05-22", priority: "High",   status: "Pending" },
  { id: "T-015", title: "Site visit Mountain View — Ramy Aziz",     type: "Tour",     owner: "Omar Sherif",    lead: "L-1025", due: "2026-05-20", priority: "Medium", status: "Pending" },
  { id: "T-016", title: "Contract review — Habiba Adel",            type: "Contract", owner: "Fatma Ibrahim",  lead: "L-1028", due: "2026-05-23", priority: "High",   status: "Pending" },
  { id: "T-017", title: "SPA signing — Ayman Lotfy",                type: "Contract", owner: "Fatma Ibrahim",  lead: "L-1033", due: "2026-05-19", priority: "High",   status: "In Progress" },
  { id: "T-018", title: "Reservation deposit follow-up — Maha Riad",type: "Finance",  owner: "Omar Sherif",    lead: "L-1036", due: "2026-05-20", priority: "High",   status: "Pending" },
  { id: "T-019", title: "Commission release — Khaled Tarek (D-518)",type: "Finance",  owner: "Ahmed Hassan",   lead: "L-1037", due: "2026-05-25", priority: "Medium", status: "Pending" },
  { id: "T-020", title: "Negotiation meeting — Rasha Ezzat",        type: "Meeting",  owner: "Hana Mahmoud",   lead: "L-1032", due: "2026-05-19", priority: "High",   status: "In Progress" },
  { id: "T-021", title: "Send payment plan — Adel Naguib",          type: "WhatsApp", owner: "Fatma Ibrahim",  lead: "L-1023", due: "2026-05-17", priority: "Medium", status: "Completed" },
  { id: "T-022", title: "Re-engagement call — Inji Samir",          type: "Call",     owner: "Fatma Ibrahim",  lead: "L-1042", due: "2026-06-01", priority: "Low",    status: "Pending" },
  { id: "T-023", title: "Cold call follow-up — Ashraf Khalil",      type: "Call",     owner: "Ahmed Hassan",   lead: "L-1021", due: "2026-05-20", priority: "Low",    status: "Pending" },
  { id: "T-024", title: "Property fair lead — Heba Ezzat",          type: "Follow-up",owner: null,             lead: "L-1014", due: "2026-05-19", priority: "Medium", status: "Pending" },
  { id: "T-025", title: "Send Capital Heights pricing — Maha Riad", type: "Email",    owner: "Omar Sherif",    lead: "L-1036", due: "2026-05-17", priority: "Medium", status: "Completed" },
  { id: "T-026", title: "WhatsApp Mivida options — Dina Khalil",    type: "WhatsApp", owner: "Ahmed Hassan",   lead: "L-1034", due: "2026-05-15", priority: "Medium", status: "Completed" },
  { id: "T-027", title: "Site visit ZED East — Aya Nasr",           type: "Tour",     owner: "Hana Mahmoud",   lead: "L-1030", due: "2026-05-24", priority: "Medium", status: "Pending" },
  { id: "T-028", title: "Override approval review — D-527 Marassi", type: "Finance",  owner: "Tarek Amin",     lead: null,     due: "2026-05-19", priority: "High",   status: "Pending" },
  { id: "T-029", title: "Sales Manager 1:1 — Omar Sherif",          type: "Meeting",  owner: "Nour El-Din",    lead: null,     due: "2026-05-20", priority: "Medium", status: "Pending" },
  { id: "T-030", title: "Weekly pipeline review",                   type: "Meeting",  owner: "Nour El-Din",    lead: null,     due: "2026-05-22", priority: "High",   status: "Pending" },
  { id: "T-031", title: "Send Marassi brochure — Sherif Galal",     type: "Email",    owner: "Fatma Ibrahim",  lead: "L-1035", due: "2026-04-08", priority: "Medium", status: "Completed" },
];

// ── ONBOARDING APPLICATIONS ──
// Rich applicant record. statusHistory[] is the immutable timeline used
// by the drawer Timeline tab. linkedCandidateId / linkedOfferId connect
// records to the Recruitment pipeline. employeeId is populated when the
// applicant is approved and a Staff record is created.
export const ONBOARDING = [
  {
    id: "APP001", applicant: "Mona Fawzy", type: "Agent",
    date: "2026-05-08", status: "Under Review",
    department: "Sales", branch: "New Cairo",
    photoDataUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "mona-fawzy.png",
    resumeName: "mona-fawzy-cv.pdf", resumeDataUrl: null,
    phone: "+20 100 234 5610", email: "mona.fawzy@example.com",
    requestedRole: "Senior Sales Agent",
    targetStartDate: "2026-06-15",
    hiringManager: "Nour El-Din",
    source: "Careers Page",
    linkedCandidateId: null, linkedOfferId: null, employeeId: null,
    statusHistory: [
      { stage: "Submitted",    at: "2026-05-08T09:00:00", by: "Self-service · Careers form", note: "Application received" },
      { stage: "Under Review", at: "2026-05-09T11:20:00", by: "Dina Samir", note: "Initial screening passed — moving to documents" },
    ],
    notes: "Strong CV — 4 years at Coldwell Banker. Awaiting RERA + ID upload.",
  },
  {
    id: "APP002", applicant: "Khaled Magdy", type: "Employee",
    date: "2026-05-04", status: "Documents Pending",
    department: "Sales", branch: "6th October",
    photoDataUrl: "https://images.unsplash.com/photo-1573497019418-b400bb3ab074?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "khaled-magdy.png",
    resumeName: "khaled-magdy-cv.pdf", resumeDataUrl: null,
    phone: "+20 100 234 5611", email: "khaled.magdy@example.com",
    requestedRole: "Junior Sales Agent",
    targetStartDate: "2026-06-01",
    hiringManager: "Omar Sherif",
    source: "Referral",
    linkedCandidateId: "CAN-003", linkedOfferId: "OFR-001", employeeId: null,
    statusHistory: [
      { stage: "Submitted",         at: "2026-05-04T08:30:00", by: "Auto · Offer accepted (OFR-001)", note: "Spawned from accepted offer" },
      { stage: "Under Review",      at: "2026-05-04T14:15:00", by: "Dina Samir", note: "Application picked up" },
      { stage: "Documents Pending", at: "2026-05-06T10:00:00", by: "Dina Samir", note: "Awaiting RERA + Education Certificate" },
    ],
    notes: "Referral from Omar Sherif. Onboarding paid by HR.",
  },
  {
    id: "APP003", applicant: "Rania Youssef", type: "Agent",
    date: "2026-05-02", status: "Training In Progress",
    department: "Sales", branch: "Sheikh Zayed",
    photoDataUrl: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "rania-youssef.png",
    resumeName: "rania-youssef-cv.pdf", resumeDataUrl: null,
    phone: "+20 100 234 5612", email: "rania.youssef@example.com",
    requestedRole: "Senior Sales Agent",
    targetStartDate: "2026-05-30",
    hiringManager: "Nour El-Din",
    source: "LinkedIn",
    linkedCandidateId: null, linkedOfferId: null, employeeId: null,
    statusHistory: [
      { stage: "Submitted",            at: "2026-05-02T09:45:00", by: "Self-service",    note: "Application received" },
      { stage: "Under Review",         at: "2026-05-03T10:00:00", by: "Dina Samir",      note: "Screening passed" },
      { stage: "Documents Pending",    at: "2026-05-04T11:30:00", by: "Dina Samir",      note: "Awaiting docs" },
      { stage: "Training In Progress", at: "2026-05-09T09:00:00", by: "Homes Academy",   note: "All docs received — training enrolled" },
    ],
    notes: "Documents complete. Currently on AML + Ethics courses.",
  },
  {
    id: "APP004", applicant: "Tamer Said", type: "Employee",
    date: "2026-04-15", status: "Approved",
    department: "Marketing", branch: "New Cairo",
    photoDataUrl: "https://images.unsplash.com/photo-1542178243-bc20204b769f?w=200&h=200&fit=crop&crop=faces&auto=format&q=80&dpr=1", photoName: "tamer-said.png",
    resumeName: "tamer-said-cv.pdf", resumeDataUrl: null,
    phone: "+20 100 234 5613", email: "tamer.said@example.com",
    requestedRole: "Marketing Campaign Lead",
    targetStartDate: "2026-05-01",
    hiringManager: "CEO",
    source: "Direct outreach",
    linkedCandidateId: null, linkedOfferId: null, employeeId: "A013",
    statusHistory: [
      { stage: "Submitted",            at: "2026-04-15T08:00:00", by: "HR",         note: "Application received" },
      { stage: "Under Review",         at: "2026-04-16T09:00:00", by: "Dina Samir", note: "Fast-track approved" },
      { stage: "Documents Pending",    at: "2026-04-17T10:00:00", by: "Dina Samir", note: "Awaiting docs" },
      { stage: "Training In Progress", at: "2026-04-19T09:00:00", by: "Academy",    note: "Onboarding training" },
      { stage: "Final Approval",       at: "2026-04-28T13:00:00", by: "Dina Samir", note: "Awaiting Director sign-off" },
      { stage: "Approved",             at: "2026-04-30T16:30:00", by: "Tarek Hassan", note: "Approved · Employee A013 created" },
    ],
    notes: "Joined as Marketing persona — owns campaigns surface in CRM.",
  },
  {
    id: "APP005", applicant: "Laila Hassan", type: "Agent",
    date: "2026-04-30", status: "Final Approval",
    department: "Sales", branch: "Maadi",
    photoDataUrl: "https://images.unsplash.com/photo-1488508872907-592763824245?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "laila-hassan.png",
    resumeName: "laila-hassan-cv.pdf", resumeDataUrl: null,
    phone: "+20 100 234 5614", email: "laila.hassan@example.com",
    requestedRole: "Senior Sales Agent",
    targetStartDate: "2026-05-25",
    hiringManager: "Nour El-Din",
    source: "Referral",
    linkedCandidateId: null, linkedOfferId: null, employeeId: null,
    statusHistory: [
      { stage: "Submitted",            at: "2026-04-30T09:00:00", by: "HR", note: "Application received" },
      { stage: "Under Review",         at: "2026-05-01T10:00:00", by: "Dina Samir", note: "Screening" },
      { stage: "Documents Pending",    at: "2026-05-02T11:00:00", by: "Dina Samir", note: "All docs received fast" },
      { stage: "Training In Progress", at: "2026-05-04T09:30:00", by: "Academy", note: "Training kicked off" },
      { stage: "Final Approval",       at: "2026-05-14T16:00:00", by: "Dina Samir", note: "Awaiting Director sign-off" },
    ],
    notes: "All checklist items green — ready for director approval.",
  },
  {
    id: "APP006", applicant: "Youssef Nader", type: "Agent",
    date: "2026-04-22", status: "Documents Pending",
    department: "Sales", branch: "Heliopolis",
    photoDataUrl: "https://images.unsplash.com/photo-1542931287-023b922fa89b?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "youssef-nader.png",
    resumeName: "youssef-nader-cv.pdf", resumeDataUrl: null,
    phone: "+20 100 234 5615", email: "youssef.nader@example.com",
    requestedRole: "Junior Sales Agent",
    targetStartDate: "2026-05-30",
    hiringManager: "Omar Sherif",
    source: "Careers Page",
    linkedCandidateId: null, linkedOfferId: null, employeeId: null,
    statusHistory: [
      { stage: "Submitted",         at: "2026-04-22T11:00:00", by: "Self-service", note: "Application received" },
      { stage: "Under Review",      at: "2026-04-23T10:30:00", by: "Dina Samir", note: "Screening" },
      { stage: "Documents Pending", at: "2026-04-24T14:00:00", by: "Dina Samir", note: "Awaiting RERA + ID" },
    ],
    notes: "STALLED — RERA not received after 23 days. Two reminders sent.",
  },
  {
    id: "APP007", applicant: "Nadia Gamal", type: "Employee",
    date: "2026-04-10", status: "Rejected",
    department: "HR / Recruitment", branch: "New Cairo",
    photoDataUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=faces&auto=format&q=80&dpr=2", photoName: "nadia-gamal.png",
    resumeName: "nadia-gamal-cv.pdf", resumeDataUrl: null,
    phone: "+20 100 234 5616", email: "nadia.gamal@example.com",
    requestedRole: "HR Coordinator",
    targetStartDate: null,
    hiringManager: "Dina Samir",
    source: "LinkedIn",
    linkedCandidateId: null, linkedOfferId: null, employeeId: null,
    statusHistory: [
      { stage: "Submitted",    at: "2026-04-10T09:00:00", by: "HR", note: "Application received" },
      { stage: "Under Review", at: "2026-04-11T10:00:00", by: "Dina Samir", note: "Screening" },
      { stage: "Rejected",     at: "2026-04-14T15:30:00", by: "Dina Samir", note: "Rejected — insufficient HR systems experience" },
    ],
    notes: "Not a fit for the current opening. Encouraged to reapply for L1 roles.",
  },
];

// Application-stage metadata. Used by the funnel visualization,
// the progress bar in the drawer, and the SLA breach calculation.
// slaDays = days an applicant is allowed in this status before HR is warned.
// owner   = who acts to advance this stage forward.
export const APPLICATION_STAGE_META = {
  'Submitted':            { order: 1, color: '#3b82f6', slaDays: 2,  owner: 'HR',      next: 'Under Review',
                            help: 'Application received. HR triages within 2 business days.' },
  'Under Review':         { order: 2, color: '#0ea5e9', slaDays: 3,  owner: 'HR',      next: 'Documents Pending',
                            help: 'Initial screening — CV review, eligibility check.' },
  'Documents Pending':    { order: 3, color: '#f59e0b', slaDays: 7,  owner: 'Applicant', next: 'Training In Progress',
                            help: 'Awaiting required documents from applicant (ID, RERA, Education).' },
  'Training In Progress': { order: 4, color: '#8b5cf6', slaDays: 14, owner: 'Academy', next: 'Final Approval',
                            help: 'Mandatory training enrolled. Auto-advances when all required courses complete.' },
  'Final Approval':       { order: 5, color: '#06b6d4', slaDays: 3,  owner: 'Director',next: 'Approved',
                            help: 'All checklist items complete — Sales Director sign-off required.' },
  'Approved':             { order: 6, color: '#10b981', slaDays: 0,  owner: 'System',  next: null,
                            help: 'Approved. Employee record created. Onboarding complete.' },
  'Rejected':             { order: 99, color: '#dc2626', slaDays: 0, owner: 'System',  next: null,
                            help: 'Application rejected — terminal.' },
};

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
    salaryBand: { min: 18000, max: 28000, currency: "EGP", period: "monthly", commission: "Uncapped — 0.5-1.2% of deal value" },
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
    salaryBand: { min: 10000, max: 15000, currency: "EGP", period: "monthly", commission: "After onboarding — 0.3-0.7% of deal value" },
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
    salaryBand: { min: 16000, max: 22000, currency: "EGP", period: "monthly", commission: null },
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
    salaryBand: { min: 28000, max: 42000, currency: "EGP", period: "monthly", commission: "Quarterly performance bonus" },
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
    salaryBand: { min: 20000, max: 30000, currency: "EGP", period: "monthly", commission: null },
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
    salaryBand: { min: 22000, max: 32000, currency: "EGP", period: "monthly", commission: null },
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

// Sample candidate photos use Unsplash with curated photo IDs depicting
// Arab/Middle Eastern people. resumeName is filled in but resumeDataUrl is
// null — the drawer "Download CV" button surfaces a friendly "older record"
// toast in that case.
export const CANDIDATES = [
  { id: "CAN-001", name: "Amira El-Sayed",  job: "Senior Sales Agent", vacancyId: "JOB-001", stage: "Interview", applied: "2024-01-10", interviewer: "Sales Manager", gender: "Female", ageBand: "25-34",
    email: "amira.elsayed@example.com",   phone: "+20 100 333 1001",
    photoDataUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "amira-elsayed.png",
    resumeName: "amira-elsayed-cv.pdf",   resumeDataUrl: null },
  { id: "CAN-002", name: "Hassan Nabil",    job: "Senior Sales Agent", vacancyId: "JOB-001", stage: "Screening", applied: "2024-01-12", interviewer: null,            gender: "Male",   ageBand: "25-34",
    email: "hassan.nabil@example.com",    phone: "+20 100 333 1002",
    photoDataUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "hassan-nabil.png",
    resumeName: "hassan-nabil-cv.pdf",    resumeDataUrl: null },
  { id: "CAN-003", name: "Fatma Youssef",   job: "Junior Sales Agent", vacancyId: "JOB-002", stage: "Offer",     applied: "2024-01-06", interviewer: "Omar Sherif",   gender: "Female", ageBand: "18-24",
    email: "fatma.youssef@example.com",   phone: "+20 100 333 1003",
    photoDataUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "fatma-youssef.png",
    resumeName: "fatma-youssef-cv.pdf",   resumeDataUrl: null },
  { id: "CAN-004", name: "Ali Mostafa",     job: "Junior Sales Agent", vacancyId: "JOB-002", stage: "Rejected",  applied: "2024-01-09", interviewer: "Sales Manager", gender: "Male",   ageBand: "18-24",
    email: "ali.mostafa@example.com",     phone: "+20 100 333 1004",
    photoDataUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "ali-mostafa.png",
    resumeName: "ali-mostafa-cv.pdf",     resumeDataUrl: null },
  { id: "CAN-005", name: "Nora Adel",       job: "Senior Sales Agent", vacancyId: "JOB-001", stage: "Applied",   applied: "2024-01-16", interviewer: null,            gender: "Female", ageBand: "25-34",
    email: "nora.adel@example.com",       phone: "+20 100 333 1005",
    photoDataUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "nora-adel.png",
    resumeName: "nora-adel-cv.pdf",       resumeDataUrl: null },
  { id: "CAN-006", name: "Khaled Samir",    job: "HR Coordinator",     vacancyId: "JOB-003", stage: "Applied",   applied: "2024-01-17", interviewer: null,            gender: "Male",   ageBand: "25-34",
    email: "khaled.samir@example.com",    phone: "+20 100 333 1006",
    photoDataUrl: "https://images.unsplash.com/photo-1556157382-97eda2d62296?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "khaled-samir.png",
    resumeName: "khaled-samir-cv.pdf",    resumeDataUrl: null },
  // ─── Expansion seed (May 2026) ───
  { id: "CAN-007", name: "Sherif Mostafa",  job: "Senior Sales Agent", vacancyId: "JOB-001", stage: "Applied",   applied: "2026-05-12", interviewer: null,             gender: "Male",   ageBand: "25-34",
    email: "sherif.mostafa@example.com",  phone: "+20 100 333 1007",
    photoDataUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "sherif-mostafa.png",
    resumeName: "sherif-mostafa-cv.pdf",  resumeDataUrl: null },
  { id: "CAN-008", name: "Mariam Helmy",    job: "Junior Sales Agent", vacancyId: "JOB-002", stage: "Screening", applied: "2026-05-08", interviewer: null,             gender: "Female", ageBand: "18-24",
    email: "mariam.helmy@example.com",    phone: "+20 100 333 1008",
    photoDataUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "mariam-helmy.png",
    resumeName: "mariam-helmy-cv.pdf",    resumeDataUrl: null },
  { id: "CAN-009", name: "Walid Khalil",    job: "Senior Sales Agent", vacancyId: "JOB-001", stage: "Screening", applied: "2026-05-10", interviewer: null,             gender: "Male",   ageBand: "35-44",
    email: "walid.khalil@example.com",    phone: "+20 100 333 1009",
    photoDataUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "walid-khalil.png",
    resumeName: "walid-khalil-cv.pdf",    resumeDataUrl: null },
  { id: "CAN-010", name: "Heba Naguib",     job: "Sales Manager",      vacancyId: "JOB-001", stage: "Interview", applied: "2026-04-25", interviewer: "Tarek Amin",     gender: "Female", ageBand: "35-44",
    email: "heba.naguib@example.com",     phone: "+20 100 333 1010",
    photoDataUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "heba-naguib.png",
    resumeName: "heba-naguib-cv.pdf",     resumeDataUrl: null },
  { id: "CAN-011", name: "Ramy Fawzy",      job: "Marketing Lead",     vacancyId: "JOB-004", stage: "Interview", applied: "2026-04-22", interviewer: "Dina Samir",     gender: "Male",   ageBand: "25-34",
    email: "ramy.fawzy@example.com",      phone: "+20 100 333 1011",
    photoDataUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "ramy-fawzy.png",
    resumeName: "ramy-fawzy-cv.pdf",      resumeDataUrl: null },
  { id: "CAN-012", name: "Aya Magdy",       job: "Finance Analyst",    vacancyId: "JOB-006", stage: "Offer",     applied: "2026-04-12", interviewer: "Khaled Magdy",   gender: "Female", ageBand: "25-34",
    email: "aya.magdy@example.com",       phone: "+20 100 333 1012",
    photoDataUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "aya-magdy.png",
    resumeName: "aya-magdy-cv.pdf",       resumeDataUrl: null },
  { id: "CAN-013", name: "Tamer Saleh",     job: "Junior Sales Agent", vacancyId: "JOB-002", stage: "Rejected",  applied: "2026-04-18", interviewer: "Omar Sherif",    gender: "Male",   ageBand: "18-24",
    email: "tamer.saleh@example.com",     phone: "+20 100 333 1013",
    photoDataUrl: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "tamer-saleh.png",
    resumeName: "tamer-saleh-cv.pdf",     resumeDataUrl: null,
    rejectionReason: "Below minimum experience requirement (2 years)" },
  { id: "CAN-014", name: "Inji Adel",       job: "HR Coordinator",     vacancyId: "JOB-003", stage: "Applied",   applied: "2026-05-15", interviewer: null,             gender: "Female", ageBand: "25-34",
    email: "inji.adel@example.com",       phone: "+20 100 333 1014",
    photoDataUrl: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "inji-adel.png",
    resumeName: "inji-adel-cv.pdf",       resumeDataUrl: null },
];

// ── OFFERS ── HR drafts → Sales Director approves → Sent → Accepted/Rejected
// Lifecycle: Draft → Pending Approval → Approved → Sent → (Accepted | Declined | Withdrawn)
export const OFFER_STAGES = ['Draft', 'Pending Approval', 'Approved', 'Sent', 'Accepted', 'Declined', 'Withdrawn'];

export const OFFERS = [
  {
    id: "OFR-001", candidateId: "CAN-003", candidateName: "Fatma Youssef",
    photoDataUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "fatma-youssef.png",
    jobId: "JOB-002", jobTitle: "Junior Sales Agent",
    salaryMonthly: 13500, currency: "EGP",
    commission: "0.5% of deal value after onboarding completion",
    bonus: "Annual top-performer trip + EGP 5,000 sign-on after probation",
    benefits: ["Health insurance (probation)", "Microsoft 365", "Homes Academy", "Transport allowance"],
    startDate: "2026-06-01", probationMonths: 3,
    workSchedule: "Sun–Thu, 9am–6pm",
    reportingTo: "Omar Sherif (Team Leader)",
    contractType: "Full-time, indefinite",
    stage: "Sent",
    draftedBy: "Dina Samir (HR Recruiter)",
    approvedBy: "Tarek Hassan (Sales Director)",
    approvedAt: "2026-05-14",
    sentAt: "2026-05-15",
    expiresAt: "2026-05-22",
    notes: "Strong impression from Omar's interview — fast-track. Junior band top-end."
  },
  {
    id: "OFR-002", candidateId: "CAN-001", candidateName: "Amira El-Sayed",
    photoDataUrl: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "amira-elsayed.png",
    jobId: "JOB-001", jobTitle: "Senior Sales Agent",
    salaryMonthly: 23000, currency: "EGP",
    commission: "Uncapped — 0.8% of deal value · Homes Advance at 5% collection trigger",
    bonus: "EGP 10,000 sign-on after RERA license activated",
    benefits: ["Health insurance + family", "Microsoft 365", "Homes Academy", "Transport allowance", "Annual top-performer trip"],
    startDate: "2026-06-15", probationMonths: 3,
    workSchedule: "Sun–Thu, 9am–6pm",
    reportingTo: "Nour El-Din (Sales Manager)",
    contractType: "Full-time, indefinite",
    stage: "Pending Approval",
    draftedBy: "Dina Samir (HR Recruiter)",
    approvedBy: null, approvedAt: null, sentAt: null,
    expiresAt: null,
    notes: "Mid-band — strong interview but limited RERA history."
  },
  // ─── Expansion seed (May 2026) ───
  {
    id: "OFR-003", candidateId: "CAN-010", candidateName: "Heba Naguib",
    photoDataUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "heba-naguib.png",
    jobId: "JOB-003", jobTitle: "Sales Manager",
    salaryMonthly: 38000, currency: "EGP",
    commission: "0.6% of team-attributed deal value + override on Closed Won",
    bonus: "EGP 25,000 sign-on after probation + quarterly performance bonus",
    benefits: ["Health insurance + family", "Microsoft 365", "Homes Academy", "Transport allowance", "Annual top-performer trip", "Company car allowance"],
    startDate: "2026-07-01", probationMonths: 6,
    workSchedule: "Sun–Thu, 9am–6pm",
    reportingTo: "Tarek Amin (Sales Director)",
    contractType: "Full-time, indefinite",
    stage: "Approved",
    draftedBy: "Dina Samir (HR Recruiter)",
    approvedBy: "Tarek Amin (Sales Director)",
    approvedAt: "2026-05-15",
    sentAt: null,
    expiresAt: "2026-05-25",
    notes: "Strong candidate, 10y experience at Coldwell Banker Egypt. Approved Friday — sending Monday."
  },
  {
    id: "OFR-004", candidateId: "CAN-012", candidateName: "Aya Magdy",
    photoDataUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "aya-magdy.png",
    jobId: "JOB-005", jobTitle: "Finance Analyst",
    salaryMonthly: 27500, currency: "EGP",
    commission: "—",
    bonus: "EGP 10,000 sign-on after probation",
    benefits: ["Health insurance", "Microsoft 365", "Homes Academy"],
    startDate: "2026-06-15", probationMonths: 3,
    workSchedule: "Sun–Thu, 9am–6pm",
    reportingTo: "Khaled Magdy (Finance Manager)",
    contractType: "Full-time, indefinite",
    stage: "Accepted",
    draftedBy: "Dina Samir (HR Recruiter)",
    approvedBy: "Tarek Amin (Sales Director)",
    approvedAt: "2026-05-08",
    sentAt: "2026-05-09",
    acceptedAt: "2026-05-12",
    expiresAt: "2026-05-16",
    notes: "Accepted within 3 days. Onboarding spawned (APP-008)."
  },
  {
    id: "OFR-005", candidateId: "CAN-011", candidateName: "Ramy Fawzy",
    photoDataUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "ramy-fawzy.png",
    jobId: "JOB-004", jobTitle: "Marketing Lead",
    salaryMonthly: 34000, currency: "EGP",
    commission: "Quarterly campaign-performance bonus",
    bonus: "EGP 15,000 sign-on after probation",
    benefits: ["Health insurance + family", "Microsoft 365", "Homes Academy", "Transport allowance"],
    startDate: "2026-07-01", probationMonths: 3,
    workSchedule: "Sun–Thu, 9am–6pm",
    reportingTo: "Tarek Amin (Sales Director)",
    contractType: "Full-time, indefinite",
    stage: "Draft",
    draftedBy: "Dina Samir (HR Recruiter)",
    approvedBy: null, approvedAt: null, sentAt: null,
    expiresAt: null,
    notes: "Draft pending — waiting on final sign-off from Marketing budget review."
  },
  {
    id: "OFR-006", candidateId: "CAN-007", candidateName: "Sherif Mostafa",
    photoDataUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "sherif-mostafa.png",
    jobId: "JOB-001", jobTitle: "Senior Sales Agent",
    salaryMonthly: 21000, currency: "EGP",
    commission: "Uncapped — 0.8% of deal value · Homes Advance at 5% collection trigger",
    bonus: "EGP 10,000 sign-on after RERA license activated",
    benefits: ["Health insurance", "Microsoft 365", "Homes Academy", "Transport allowance"],
    startDate: "2026-06-22", probationMonths: 3,
    workSchedule: "Sun–Thu, 9am–6pm",
    reportingTo: "Omar Sherif (Team Leader)",
    contractType: "Full-time, indefinite",
    stage: "Sent",
    draftedBy: "Dina Samir (HR Recruiter)",
    approvedBy: "Tarek Amin (Sales Director)",
    approvedAt: "2026-05-14",
    sentAt: "2026-05-15",
    expiresAt: "2026-05-23",
    notes: "Strong sales track record, 4y experience. Mid-band offer with stretch on commission."
  },
  {
    id: "OFR-007", candidateId: "CAN-008", candidateName: "Mariam Helmy",
    photoDataUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=faces&auto=format&q=80", photoName: "mariam-helmy.png",
    jobId: "JOB-002", jobTitle: "Junior Sales Agent",
    salaryMonthly: 12500, currency: "EGP",
    commission: "0.4% of deal value after onboarding completion",
    bonus: "EGP 5,000 sign-on after probation",
    benefits: ["Health insurance (probation)", "Microsoft 365", "Homes Academy"],
    startDate: "2026-06-15", probationMonths: 3,
    workSchedule: "Sun–Thu, 9am–6pm",
    reportingTo: "Omar Sherif (Team Leader)",
    contractType: "Full-time, indefinite",
    stage: "Declined",
    draftedBy: "Dina Samir (HR Recruiter)",
    approvedBy: "Tarek Amin (Sales Director)",
    approvedAt: "2026-05-10",
    sentAt: "2026-05-11",
    declinedAt: "2026-05-14",
    declineReason: "Accepted competing offer with higher base salary",
    expiresAt: "2026-05-18",
    notes: "Declined — competing offer EGP 14k. Recommend revisiting band."
  }
];

// Salary band reference matrix (governance — bands by role family + level)
// HR cannot draft an offer outside these bands without Sales Director justification.
export const SALARY_BANDS = [
  { id: "SB-Sales-Junior",  family: "Sales",      level: "Junior",   min: 10000, max: 15000, currency: "EGP" },
  { id: "SB-Sales-Mid",     family: "Sales",      level: "Mid",      min: 15000, max: 22000, currency: "EGP" },
  { id: "SB-Sales-Senior",  family: "Sales",      level: "Senior",   min: 18000, max: 28000, currency: "EGP" },
  { id: "SB-Sales-Lead",    family: "Sales",      level: "Team Lead",min: 25000, max: 38000, currency: "EGP" },
  { id: "SB-Mktg-Lead",     family: "Marketing",  level: "Lead",     min: 28000, max: 42000, currency: "EGP" },
  { id: "SB-Ops-Spec",      family: "Operations", level: "Specialist", min: 20000, max: 30000, currency: "EGP" },
  { id: "SB-HR-Coord",      family: "HR",         level: "Coordinator",min: 16000, max: 22000, currency: "EGP" },
  { id: "SB-HR-Mgr",        family: "HR",         level: "Manager",  min: 28000, max: 42000, currency: "EGP" },
  { id: "SB-Fin-Analyst",   family: "Finance",    level: "Analyst",  min: 22000, max: 32000, currency: "EGP" },
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
// Commission split defaults — used when a policy doesn't carry custom %s.
// The 4-persona split is now part of the policy itself (per developer per
// project) so the System Admin / Finance Officer can tune the breakdown
// once and have every downstream deal use those numbers automatically.
//   agent + tl + manager + director + company  MUST equal 100.
export const COMMISSION_SPLIT_DEFAULT = { agent: 33.33, tl: 10, manager: 5, director: 3, company: 48.67 };

// Pretty-format a split row for audit-log details.
const _splitStr = (s) => `Agent ${s.agent}% · TL ${s.tl}% · Mgr ${s.manager}% · Dir ${s.director}% · Co ${s.company}%`;

// Build the initial policyHistory[] entry — every policy starts with a
// 'Created' row so the per-record action log is never empty.
const _policySeedHistory = (p) => [{
  at: '2024-01-05T09:00:00.000Z',
  actor: 'System Admin',
  action: 'Created',
  detail: `Policy created for ${p.developer} / ${p.project} · rate ${p.rate}% · ${_splitStr(p.split)}`,
}];

const _withPolicyHistory = (rows) => rows.map(p => ({ ...p, history: _policySeedHistory(p) }));

export const COMMISSION_POLICIES = _withPolicyHistory([
  // Each policy carries the deal-side rate (commission % paid by developer
  // on the deal value) AND the internal 4-persona split that decides how
  // the resulting pool is divided across Agent / Team Leader / Sales
  // Manager / Sales Director / Company. Every field is editable from
  // System Admin → Financial Management → Commission Policies.
  { id: "COM-001", developer: "Palm Hills",      project: "Palm Hills New Cairo", rate: 2.0, override: false, status: "Active",
    split: { agent: 33.33, tl: 10, manager: 5, director: 3, company: 48.67 } },
  { id: "COM-002", developer: "Ora",             project: "ZED East",             rate: 2.0, override: false, status: "Active",
    split: { agent: 35,    tl: 10, manager: 5, director: 3, company: 47 } },
  { id: "COM-003", developer: "Hyde Park",       project: "Hyde Park New Cairo",  rate: 1.8, override: false, status: "Active",
    split: { agent: 33.33, tl: 10, manager: 5, director: 3, company: 48.67 } },
  { id: "COM-004", developer: "Palm Hills",      project: "Hacienda Bay",         rate: 2.2, override: true,
    overrideReason: "Premium launch incentive", approver: "Nour El-Din",          status: "Active",
    split: { agent: 40,    tl: 12, manager: 6, director: 4, company: 38 } },
  { id: "COM-005", developer: "Talaat Moustafa", project: "Madinaty",             rate: 1.5, override: false, status: "Active",
    split: { agent: 30,    tl: 10, manager: 5, director: 3, company: 52 } },
  { id: "COM-006", developer: "Sodic",           project: "Sodic West",           rate: 1.8, override: false, status: "Active",
    split: { agent: 33.33, tl: 10, manager: 5, director: 3, company: 48.67 } },
]);

// Look up the active policy that should apply to a (developer, project)
// pair. Returns null if there's no exact match — callers should fall back
// to COMMISSION_SPLIT_DEFAULT. Used by the deal pipeline + commission
// engine creation paths so every new pool is split per the configured
// policy automatically.
export const findCommissionPolicy = (policies, developer, project) =>
  (policies || []).find(p => p.developer === developer && p.project === project && p.status === 'Active') || null;

// Compute the per-persona split from a pool using a policy's percentages.
// The company share is computed as the residual so any rounding error
// lands on the company line (auditor-friendly: agent/TL/Mgr/Dir are exact).
export const computeSplit = (pool, split = COMMISSION_SPLIT_DEFAULT) => {
  const r = (pct) => Math.round((pool || 0) * (pct || 0) / 100);
  const agentShare    = r(split.agent);
  const tlShare       = r(split.tl);
  const managerShare  = r(split.manager);
  const directorShare = r(split.director);
  const companyShare  = (pool || 0) - agentShare - tlShare - managerShare - directorShare;
  return { agentShare, tlShare, managerShare, directorShare, companyShare };
};

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
  // ─── Expansion seed (May 2026) ───
  { id:'DL008', unit:'PH-NC-V101',  developer:'Palm Hills',    agent:'Fatma Ibrahim', price:13200000, revenue:264000, status:'Approved' },
  { id:'DL009', unit:'HP-TH-B304',  developer:'Hyde Park',     agent:'Fatma Ibrahim', price:12400000, revenue:248000, status:'Pending'  },
  { id:'DL010', unit:'MR-CH-12',    developer:'Emaar',         agent:'Fatma Ibrahim', price:17000000, revenue:340000, status:'Approved' },
  { id:'DL011', unit:'HB-CH-A12',   developer:'Palm Hills',    agent:'Hana Mahmoud',  price:18900000, revenue:472500, status:'Pending'  },
  { id:'DL012', unit:'MV-DX-44',    developer:'Mountain View', agent:'Ahmed Hassan',  price:9200000,  revenue:184000, status:'Paid'     },
  { id:'DL013', unit:'SW-V-08',     developer:'Sodic',         agent:'Fatma Ibrahim', price:10300000, revenue:216300, status:'Paid'     },
  { id:'DL014', unit:'CH-A-110',    developer:'Better Home',   agent:'Omar Sherif',   price:5100000,  revenue:81600,  status:'Pending'  },
  { id:'DL015', unit:'MV-V-201',    developer:'Emaar',         agent:'Ahmed Hassan',  price:7800000,  revenue:171600, status:'Pending'  },
  { id:'DL016', unit:'ET-A-301',    developer:'Sodic',         agent:'Fatma Ibrahim', price:12100000, revenue:278300, status:'Approved' },
  { id:'DL017', unit:'PP-TW-15',    developer:'Palm Hills',    agent:'Ahmed Hassan',  price:11500000, revenue:230000, status:'Approved' },
  { id:'DL018', unit:'CFC-A-410',   developer:'Al-Futtaim',    agent:'Omar Sherif',   price:7800000,  revenue:156000, status:'Approved' },
  { id:'DL019', unit:'MR-PH-08',    developer:'Emaar',         agent:'Hana Mahmoud',  price:22000000, revenue:440000, status:'Pending'  },
  { id:'DL020', unit:'ZH-A-105',    developer:'City Edge',     agent:'Ahmed Hassan',  price:4500000,  revenue:67500,  status:'Approved' },
  { id:'DL021', unit:'TS-CH-22',    developer:'Roya',          agent:'Hana Mahmoud',  price:7000000,  revenue:140000, status:'Paid'     },
  { id:'DL022', unit:'CG-A-308',    developer:'Emaar',         agent:'Fatma Ibrahim', price:9300000,  revenue:186000, status:'Approved' },
  { id:'DL023', unit:'MD-TW-302',   developer:'Talaat Moustafa', agent:'Omar Sherif', price:7900000,  revenue:118500, status:'Pending'  },
  { id:'DL024', unit:'AR-A-505',    developer:'Talaat Moustafa', agent:'Omar Sherif', price:4800000,  revenue:72000,  status:'Paid'     },
  { id:'DL025', unit:'HP-A-220',    developer:'Hyde Park',     agent:'Ahmed Hassan',  price:9800000,  revenue:196000, status:'Approved' },
];

// Commission split breakdown (May 2026 — auditor + Finance Officer ask):
// Pool is divided across the four sales-track personas + company:
//   agent      ≈ 33.33%  (1/3 of pool)
//   teamLeader ≈ 10%
//   manager    ≈  5%
//   director   ≈  3%
//   company    ≈ 48.67%  (remainder — covers ops, overhead, marketing)
// Names of the three management persons are denormalised onto each row so
// the detail drawer and the action log can show '→ Omar Sherif' rather
// than just 'TL share'.
const _split = (pool) => {
  const agentShare    = Math.round(pool * 0.3333);
  const tlShare       = Math.round(pool * 0.10);
  const managerShare  = Math.round(pool * 0.05);
  const directorShare = Math.round(pool * 0.03);
  const companyShare  = pool - agentShare - tlShare - managerShare - directorShare;
  return { agentShare, tlShare, managerShare, directorShare, companyShare };
};
// Demo hierarchy — same TL / Manager / Director chain for every row in the
// seed. In production these would come from the deal's owner → reporting
// graph at the time the commission row is created.
const _TL = 'Omar Sherif';
const _MGR = 'Nour El-Din';
const _DIR = 'Tarek Amin';

// EGP-formatted number for embedding into the seeded history details.
const _eg = (n) => `EGP ${(n || 0).toLocaleString('en-EG')}`;
// Build an ISO timestamp offset from createdAt by N days at a fixed time
// of day so different log rows have plausible spacing.
const _dt = (createdAt, days, hours = 10, minutes = 30) => {
  const d = new Date(createdAt + 'T00:00:00');
  d.setDate(d.getDate() + days);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};
// Build the canonical action-log entry list for a commission record
// based on its CURRENT status. Every seeded row gets a complete history
// so auditors can open any row and see the full transaction timeline —
// even rows that haven't been touched by the running app yet.
//   Pending  →  [Created]
//   Approved →  [Created, Approved]
//   Paid     →  [Created, Approved, Paid]
//   Rejected →  [Created, Rejected]
const _historyFor = (ce, splits) => {
  const created = {
    at: _dt(ce.createdAt, 0, 9, 5),
    actor: 'System',
    action: 'Created',
    toStatus: 'Pending',
    amount: ce.pool,
    detail: `Commission record opened for deal ${ce.deal} — pool ${_eg(ce.pool)}`,
  };
  const splitLine =
    `Agent ${_eg(splits.agentShare)} · TL ${_eg(splits.tlShare)} · ` +
    `Mgr ${_eg(splits.managerShare)} · Dir ${_eg(splits.directorShare)} · ` +
    `Co ${_eg(splits.companyShare)}`;
  const approved = {
    at: _dt(ce.createdAt, 3, 14, 15),
    actor: _DIR,
    action: 'Approved',
    fromStatus: 'Pending',
    toStatus: 'Approved',
    amount: ce.pool,
    detail: `Pool locked at ${_eg(ce.pool)} — ${splitLine}`,
  };
  const paid = {
    at: _dt(ce.createdAt, 10, 11, 0),
    actor: 'Finance Officer',
    action: 'Paid',
    fromStatus: 'Approved',
    toStatus: 'Paid',
    amount: ce.pool,
    detail:
      `Disbursed ${_eg(splits.agentShare)} → ${ce.agent} · ` +
      `${_eg(splits.tlShare)} → ${_TL} · ` +
      `${_eg(splits.managerShare)} → ${_MGR} · ` +
      `${_eg(splits.directorShare)} → ${_DIR} · ` +
      `${_eg(splits.companyShare)} → Company`,
  };
  const rejected = {
    at: _dt(ce.createdAt, 2, 16, 40),
    actor: _DIR,
    action: 'Rejected',
    fromStatus: 'Pending',
    toStatus: 'Rejected',
    detail: 'Rejected at finance review — split or supporting documents flagged.',
  };
  if (ce.status === 'Approved') return [created, approved];
  if (ce.status === 'Paid')     return [created, approved, paid];
  if (ce.status === 'Rejected') return [created, rejected];
  return [created]; // Pending
};
// Enrich each seeded record with split + history + the right stamped
// dates and actors for its current status. Keeps the seed declarative
// (one line per deal) without losing the audit-grade history.
const _enrichCE = (rows) => rows.map((ce) => {
  const splits = _split(ce.pool);
  const history = _historyFor(ce, splits);
  const approvedEntry = history.find(h => h.action === 'Approved');
  const paidEntry     = history.find(h => h.action === 'Paid');
  const rejectedEntry = history.find(h => h.action === 'Rejected');
  return {
    ...ce,
    ...splits,
    teamLeader: _TL,
    manager: _MGR,
    director: _DIR,
    history,
    approvedAt: approvedEntry?.at  || null,
    approvedBy: approvedEntry?.actor || null,
    paidAt:     paidEntry?.at      || null,
    paidBy:     paidEntry?.actor   || null,
    rejectedAt: rejectedEntry?.at  || null,
    rejectedBy: rejectedEntry?.actor || null,
  };
});

export const COMM_ENGINE = _enrichCE([
  { id:'CE-01', deal:'PH-BAD-A101', agent:'Ahmed Hassan',  pool:135000, status:'Approved', createdAt:'2026-04-12' },
  { id:'CE-02', deal:'EM-VIL-B205', agent:'Fatma Ibrahim', pool:186000, status:'Pending',  createdAt:'2026-05-14' },
  { id:'CE-03', deal:'MV-IC-C310',  agent:'Mohamed Ali',   pool:114000, status:'Paid',     createdAt:'2026-03-22' },
  { id:'CE-04', deal:'ORA-ZED-D102',agent:'Sara Nabil',    pool:153000, status:'Approved', createdAt:'2026-04-30' },
  { id:'CE-05', deal:'CE-NC-E201',  agent:'Dina Samir',    pool:87000,  status:'Pending',  createdAt:'2026-05-16' },
  { id:'CE-06', deal:'TM-OW-F305',  agent:'Ahmed Hassan',  pool:234000, status:'Paid',     createdAt:'2026-02-18' },
  { id:'CE-07', deal:'SD-EST-G110', agent:'Mohamed Ali',   pool:276000, status:'Approved', createdAt:'2026-05-02' },
  // ─── Expansion seed (May 2026) ───
  { id:'CE-08', deal:'PH-NC-V101',  agent:'Fatma Ibrahim', pool:396000, status:'Approved', createdAt:'2026-04-05' },
  { id:'CE-09', deal:'HP-TH-B304',  agent:'Fatma Ibrahim', pool:372000, status:'Pending',  createdAt:'2026-05-10' },
  { id:'CE-10', deal:'MR-CH-12',    agent:'Fatma Ibrahim', pool:510000, status:'Approved', createdAt:'2026-04-18' },
  { id:'CE-11', deal:'HB-CH-A12',   agent:'Hana Mahmoud',  pool:708750, status:'Pending',  createdAt:'2026-05-15' },
  { id:'CE-12', deal:'MV-DX-44',    agent:'Ahmed Hassan',  pool:276000, status:'Paid',     createdAt:'2026-01-25' },
  { id:'CE-13', deal:'SW-V-08',     agent:'Fatma Ibrahim', pool:324450, status:'Paid',     createdAt:'2026-02-08' },
  { id:'CE-14', deal:'CH-A-110',    agent:'Omar Sherif',   pool:122400, status:'Pending',  createdAt:'2026-05-17' },
  { id:'CE-15', deal:'MV-V-201',    agent:'Ahmed Hassan',  pool:257400, status:'Pending',  createdAt:'2026-05-09' },
  { id:'CE-16', deal:'ET-A-301',    agent:'Fatma Ibrahim', pool:417450, status:'Approved', createdAt:'2026-04-22' },
  { id:'CE-17', deal:'PP-TW-15',    agent:'Ahmed Hassan',  pool:345000, status:'Approved', createdAt:'2026-04-28' },
  { id:'CE-18', deal:'CFC-A-410',   agent:'Omar Sherif',   pool:234000, status:'Approved', createdAt:'2026-05-04' },
  { id:'CE-19', deal:'MR-PH-08',    agent:'Hana Mahmoud',  pool:660000, status:'Pending',  createdAt:'2026-05-13' },
  { id:'CE-20', deal:'ZH-A-105',    agent:'Ahmed Hassan',  pool:101250, status:'Approved', createdAt:'2026-04-10' },
  { id:'CE-21', deal:'TS-CH-22',    agent:'Hana Mahmoud',  pool:210000, status:'Paid',     createdAt:'2026-03-05' },
  { id:'CE-22', deal:'CG-A-308',    agent:'Fatma Ibrahim', pool:279000, status:'Approved', createdAt:'2026-04-24' },
  { id:'CE-23', deal:'AR-A-505',    agent:'Omar Sherif',   pool:108000, status:'Paid',     createdAt:'2026-02-12' },
  { id:'CE-24', deal:'HP-A-220',    agent:'Ahmed Hassan',  pool:294000, status:'Approved', createdAt:'2026-05-06' },
  // One rejected example so the timeline + filters demo the Rejected path.
  { id:'CE-25', deal:'PH-V-A305',   agent:'Mohamed Ali',   pool:198000, status:'Rejected', createdAt:'2026-05-08' },
]);

export const AGENT_DUES = [
  { id:'AD-01', agent:'Ahmed Hassan', totalEarned:123000, paid:78000, pending:45000, status:'Partial' },
  { id:'AD-02', agent:'Fatma Ibrahim', totalEarned:62000, paid:0, pending:62000, status:'Unpaid' },
  { id:'AD-03', agent:'Mohamed Ali', totalEarned:130000, paid:38000, pending:92000, status:'Partial' },
  { id:'AD-04', agent:'Sara Nabil', totalEarned:51000, paid:51000, pending:0, status:'Cleared' },
  { id:'AD-05', agent:'Dina Samir', totalEarned:29000, paid:0, pending:29000, status:'Unpaid' },
  // Updated totals (May 2026) — reflects expanded deal pipeline.
  { id:'AD-06', agent:'Hana Mahmoud', totalEarned:526250, paid:70000, pending:456250, status:'Partial' },
  { id:'AD-07', agent:'Fatma Ibrahim', totalEarned:806300, paid:108150, pending:698150, status:'Partial' },
  { id:'AD-08', agent:'Omar Sherif',  totalEarned:154800, paid:36000,  pending:118800, status:'Partial' },
];

export const PAYROLL = [
  { id:'PAY-01', name:'Ahmed Hassan', title:'Senior Sales Executive', base:18000, commission:37500, deductions:3200, net:52300, period:'January 2024', status:'Approved' },
  { id:'PAY-02', name:'Mohamed Ali', title:'Team Leader', base:25000, commission:66000, deductions:4500, net:86500, period:'January 2024', status:'Approved' },
  { id:'PAY-03', name:'Nour El-Din', title:'Sales Manager', base:35000, commission:135000, deductions:6200, net:163800, period:'January 2024', status:'Draft' },
  { id:'PAY-04', name:'Omar Sherif', title:'Team Leader', base:22000, commission:54000, deductions:3800, net:72200, period:'January 2024', status:'Approved' },
  { id:'PAY-05', name:'Sara Nabil', title:'Sales Executive', base:15000, commission:28500, deductions:2800, net:40700, period:'January 2024', status:'Paid' },
  { id:'PAY-06', name:'Hana Mahmoud', title:'Junior Sales', base:12000, commission:0, deductions:2100, net:9900, period:'January 2024', status:'Draft' },
  // ─── Expansion seed — May 2026 period ───
  { id:'PAY-07', name:'Ahmed Hassan',  title:'Senior Sales Executive', base:18000, commission:48500, deductions:3400, net:63100,  period:'May 2026', status:'Approved' },
  { id:'PAY-08', name:'Fatma Ibrahim', title:'Licensed Sales Agent',   base:18000, commission:132000, deductions:4200, net:145800, period:'May 2026', status:'Approved' },
  { id:'PAY-09', name:'Hana Mahmoud',  title:'Sales Agent',            base:15000, commission:70875,  deductions:3100, net:82775,  period:'May 2026', status:'Approved' },
  { id:'PAY-10', name:'Omar Sherif',   title:'Team Leader',            base:25000, commission:54000,  deductions:4500, net:74500,  period:'May 2026', status:'Approved' },
  { id:'PAY-11', name:'Nour El-Din',   title:'Sales Manager',          base:35000, commission:145000, deductions:6200, net:173800, period:'May 2026', status:'Draft'    },
  { id:'PAY-12', name:'Tarek Amin',    title:'Sales Director',         base:55000, commission:225000, deductions:9800, net:270200, period:'May 2026', status:'Draft'    },
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
  // ─── Expansion seed (May 2026) — EGMLS-synced sample ───
  { id:'LST-009', project:'Mivida',              developer:'Emaar',           unitType:'Villa',      unitCode:'MV-V-201',  area:380, bedrooms:5, bathrooms:4, floor:'Ground+1', price:22000000, paymentPlan:'25% down, 6 years', status:'Available', features:['Garden','Pool','Smart Home','Maids Room'],         created:'2026-05-01', image:_img('1613490493576-7fde63acd811'), lat:30.020, lng:31.495, city:'New Cairo' },
  { id:'LST-010', project:'Mivida',              developer:'Emaar',           unitType:'Apartment',  unitCode:'MV-A-102',  area:165, bedrooms:3, bathrooms:2, floor:'1st',     price:6500000,  paymentPlan:'15% down, 7 years', status:'Available', features:['Park View','Balcony','Storage'],                     created:'2026-05-02', image:_img('1564013799919-ab600027ffc6'), lat:30.022, lng:31.498, city:'New Cairo' },
  { id:'LST-011', project:'Marassi',             developer:'Emaar',           unitType:'Chalet',     unitCode:'MR-CH-12',  area:180, bedrooms:3, bathrooms:3, floor:'Ground',   price:17000000, paymentPlan:'20% down, 5 years', status:'Available', features:['Beach Access','Pool','Furnished','Sea View'],        created:'2026-05-03', image:_img('1572120360610-d971b9d7767c'), lat:30.870, lng:28.850, city:'North Coast' },
  { id:'LST-012', project:'Marassi',             developer:'Emaar',           unitType:'Penthouse',  unitCode:'MR-PH-08',  area:320, bedrooms:4, bathrooms:4, floor:'7th',     price:22000000, paymentPlan:'25% down, 5 years', status:'Reserved',  features:['Sea View','Roof Terrace','Pool','Private Elevator'], created:'2026-05-05', image:_img('1600607687939-ce8a6c25118c'), lat:30.872, lng:28.852, city:'North Coast' },
  { id:'LST-013', project:'Al Rehab City',       developer:'Talaat Moustafa', unitType:'Apartment',  unitCode:'AR-A-505',  area:140, bedrooms:3, bathrooms:2, floor:'5th',     price:4800000,  paymentPlan:'20% down, 6 years', status:'Available', features:['Park View','Storage','Garage'],                      created:'2026-04-28', image:_img('1600585154340-be6161a56a0c'), lat:30.063, lng:31.491, city:'Cairo' },
  { id:'LST-014', project:'Capital Heights',     developer:'Better Home',     unitType:'Apartment',  unitCode:'CH-A-110',  area:155, bedrooms:3, bathrooms:2, floor:'2nd',     price:5400000,  paymentPlan:'10% down, 8 years', status:'Available', features:['City View','Balcony','Storage'],                     created:'2026-04-30', image:_img('1600596542815-ffad4c1539a9'), lat:30.060, lng:31.730, city:'New Capital' },
  { id:'LST-015', project:'Eastown Residences',  developer:'Sodic',           unitType:'Apartment',  unitCode:'ET-A-301',  area:170, bedrooms:3, bathrooms:2, floor:'3rd',     price:12000000, paymentPlan:'15% down, 6 years', status:'Available', features:['Park View','Smart Home','Club Access'],              created:'2026-05-04', image:_img('1600585154526-990dced4db0d'), lat:30.022, lng:31.473, city:'New Cairo' },
  { id:'LST-016', project:'Eastown Residences',  developer:'Sodic',           unitType:'Townhouse',  unitCode:'ET-TW-12',  area:265, bedrooms:4, bathrooms:3, floor:'Ground+1', price:14800000, paymentPlan:'15% down, 7 years', status:'Available', features:['Garden','Corner Unit','Roof','Club Access'],         created:'2026-05-06', image:_img('1600566753190-17f0baa2a6c3'), lat:30.020, lng:31.475, city:'New Cairo' },
  { id:'LST-017', project:'Cairo Festival City', developer:'Al-Futtaim',      unitType:'Apartment',  unitCode:'CFC-A-410', area:175, bedrooms:3, bathrooms:2, floor:'4th',     price:7800000,  paymentPlan:'20% down, 6 years', status:'Available', features:['Mall Access','Gym','Pool','Smart Home'],             created:'2026-05-08', image:_img('1564013799919-ab600027ffc6'), lat:30.030, lng:31.408, city:'Cairo' },
  { id:'LST-018', project:'Telal Sokhna',        developer:'Roya',            unitType:'Chalet',     unitCode:'TS-CH-22',  area:135, bedrooms:2, bathrooms:2, floor:'Ground',   price:7000000,  paymentPlan:'25% down, 5 years', status:'Available', features:['Beach Access','Pool','Furnished'],                   created:'2026-05-09', image:_img('1572120360610-d971b9d7767c'), lat:29.605, lng:32.422, city:'Ain Sokhna' },
  { id:'LST-019', project:'Palm Parks',          developer:'Palm Hills',      unitType:'Twin House', unitCode:'PP-TW-15',  area:295, bedrooms:4, bathrooms:3, floor:'Ground+1', price:11500000, paymentPlan:'15% down, 7 years', status:'Available', features:['Garden','Pool','Smart Home','Garage'],               created:'2026-05-10', image:_img('1600585154340-be6161a56a0c'), lat:29.985, lng:30.985, city:'6th October' },
  { id:'LST-020', project:'Hyde Park',           developer:'Hyde Park',       unitType:'Apartment',  unitCode:'HP-A-220',  area:195, bedrooms:3, bathrooms:3, floor:'2nd',     price:9800000,  paymentPlan:'10% down, 8 years', status:'Available', features:['Park View','Balcony','Club Access'],                 created:'2026-05-11', image:_img('1600596542815-ffad4c1539a9'), lat:30.015, lng:31.475, city:'New Cairo' },
  { id:'LST-021', project:'Sodic West',          developer:'Sodic',           unitType:'Villa',      unitCode:'SW-V-08',   area:420, bedrooms:5, bathrooms:5, floor:'Ground+1', price:18500000, paymentPlan:'20% down, 6 years', status:'Available', features:['Garden','Pool','Smart Home','Maids Room','Garage'], created:'2026-05-12', image:_img('1613490493576-7fde63acd811'), lat:30.055, lng:30.975, city:'Sheikh Zayed' },
  { id:'LST-022', project:'Mountain View iCity', developer:'Mountain View',   unitType:'Duplex',     unitCode:'MV-DX-44',  area:240, bedrooms:4, bathrooms:3, floor:'4th+5th', price:9200000,  paymentPlan:'10% down, 8 years', status:'Sold',      features:['Terrace','View','Double Height','Smart Home'],       created:'2026-04-15', image:_img('1600585154526-990dced4db0d'), lat:30.013, lng:31.495, city:'New Cairo' },
  { id:'LST-023', project:'Zahya New Mansoura',  developer:'City Edge',       unitType:'Apartment',  unitCode:'ZH-A-105',  area:150, bedrooms:3, bathrooms:2, floor:'1st',     price:4500000,  paymentPlan:'10% down, 10 years', status:'Available', features:['Garden View','Storage','Balcony'],                  created:'2026-05-13', image:_img('1600585154340-be6161a56a0c'), lat:31.038, lng:31.380, city:'New Mansoura' },
  { id:'LST-024', project:'Cairo Gate',          developer:'Emaar',           unitType:'Apartment',  unitCode:'CG-A-308',  area:180, bedrooms:3, bathrooms:2, floor:'3rd',     price:9300000,  paymentPlan:'15% down, 7 years', status:'Available', features:['Skyline View','Smart Home','Club Access'],           created:'2026-05-14', image:_img('1564013799919-ab600027ffc6'), lat:30.063, lng:31.005, city:'Sheikh Zayed' },
  { id:'LST-025', project:'Madinaty',            developer:'Talaat Moustafa', unitType:'Townhouse',  unitCode:'MD-TW-302', area:280, bedrooms:4, bathrooms:3, floor:'Ground+1', price:7900000,  paymentPlan:'20% down, 6 years', status:'Available', features:['Garden','Corner Unit','Garage'],                     created:'2026-05-15', image:_img('1600566753190-17f0baa2a6c3'), lat:30.120, lng:31.700, city:'New Cairo' },
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
  // ─── Expansion seed (May 2026) ───
  { id:'TOUR-009', leadId:'L-1023', leadName:'Adel Naguib',     listingId:'LST-004', property:'Hyde Park — HP-TH-B304',         date:'2026-05-21', time:'11:00 AM', agent:'Fatma Ibrahim',  status:'Scheduled', feedback:null, rating:null },
  { id:'TOUR-010', leadId:'L-1024', leadName:'Yasmin Nabil',    listingId:'LST-012', property:'Marassi — MR-PH-08',             date:'2026-05-22', time:'2:00 PM',  agent:'Hana Mahmoud',   status:'Scheduled', feedback:null, rating:null },
  { id:'TOUR-011', leadId:'L-1025', leadName:'Ramy Aziz',       listingId:'LST-007', property:'Mountain View — MV-DX-E105',     date:'2026-05-20', time:'10:00 AM', agent:'Omar Sherif',    status:'Scheduled', feedback:null, rating:null },
  { id:'TOUR-012', leadId:'L-1028', leadName:'Habiba Adel',     listingId:'LST-001', property:'Palm Hills New Cairo — PH-NC-V101', date:'2026-05-12', time:'3:00 PM', agent:'Fatma Ibrahim', status:'Completed', feedback:'Loved the garden, proceeding with reservation deposit.', rating:5 },
  { id:'TOUR-013', leadId:'L-1029', leadName:'Ehab Saleh',      listingId:'LST-006', property:'Sodic West — SW-TW-D201',        date:'2026-05-10', time:'4:00 PM',  agent:'Ahmed Hassan',   status:'Completed', feedback:'Liked the layout but wants larger garden. Will check villa options.', rating:4 },
  { id:'TOUR-014', leadId:'L-1030', leadName:'Aya Nasr',        listingId:'LST-002', property:'ZED East — ZED-A205',            date:'2026-05-24', time:'11:00 AM', agent:'Hana Mahmoud',   status:'Scheduled', feedback:null, rating:null },
  { id:'TOUR-015', leadId:'L-1031', leadName:'Wael Helmy',      listingId:'LST-017', property:'Cairo Festival City — CFC-A-410', date:'2026-05-19', time:'5:00 PM',  agent:'Omar Sherif',    status:'Scheduled', feedback:null, rating:null },
  { id:'TOUR-016', leadId:'L-1032', leadName:'Rasha Ezzat',     listingId:'LST-003', property:'Hacienda Bay — HB-CH-A12',       date:'2026-04-22', time:'10:00 AM', agent:'Hana Mahmoud',   status:'Completed', feedback:'Excellent location, requested payment plan details.', rating:5 },
  { id:'TOUR-017', leadId:'L-1033', leadName:'Ayman Lotfy',     listingId:'LST-004', property:'Hyde Park — HP-TH-B304',         date:'2026-04-18', time:'3:00 PM',  agent:'Fatma Ibrahim',  status:'Completed', feedback:'Ready to sign. Contract under preparation.', rating:5 },
  { id:'TOUR-018', leadId:'L-1034', leadName:'Dina Khalil',     listingId:'LST-010', property:'Mivida — MV-A-102',              date:'2026-04-15', time:'1:00 PM',  agent:'Ahmed Hassan',   status:'Completed', feedback:'Good fit, but wants to compare with Eastown.', rating:4 },
  { id:'TOUR-019', leadId:'L-1035', leadName:'Sherif Galal',    listingId:'LST-011', property:'Marassi — MR-CH-12',             date:'2026-04-10', time:'12:00 PM', agent:'Fatma Ibrahim',  status:'Completed', feedback:'Decided to reserve. Penthouse upgrade requested.', rating:5 },
  { id:'TOUR-020', leadId:'L-1037', leadName:'Khaled Tarek',    listingId:'LST-007', property:'Mountain View — MV-DX-E105',     date:'2026-02-25', time:'2:00 PM',  agent:'Ahmed Hassan',   status:'Completed', feedback:'Closed Won.', rating:5 },
  { id:'TOUR-021', leadId:'L-1038', leadName:'Nour Magdy',      listingId:'LST-006', property:'Sodic West — SW-TW-D201',        date:'2026-02-15', time:'11:00 AM', agent:'Fatma Ibrahim',  status:'Completed', feedback:'Closed Won.', rating:5 },
  { id:'TOUR-022', leadId:'L-1040', leadName:'Salma Adel',      listingId:'LST-018', property:'Telal Sokhna — TS-CH-22',        date:'2026-03-10', time:'4:00 PM',  agent:'Hana Mahmoud',   status:'No-Show', feedback:'Client did not show up. Lead later moved to Closed Lost.', rating:null },
  { id:'TOUR-023', leadId:'L-1011', leadName:'Amr Khaled',      listingId:'LST-014', property:'Capital Heights — CH-A-110',     date:'2026-05-23', time:'1:00 PM',  agent:'Omar Sherif',    status:'Scheduled', feedback:null, rating:null },
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
  // ─── Expansion seed (May 2026) ───
  { id:'SHR-011', listingId:'LST-009', property:'Mivida Villa MV-V-201',           leadId:'L-1009', leadName:'Hassan Magdy',    channel:'WhatsApp', agent:'Ahmed Hassan',  timestamp:'2026-05-16 10:45', response:'Interested' },
  { id:'SHR-012', listingId:'LST-011', property:'Marassi Chalet MR-CH-12',         leadId:'L-1010', leadName:'Rania Adel',      channel:'Email',    agent:'Fatma Ibrahim', timestamp:'2026-05-17 09:20', response:'Viewed' },
  { id:'SHR-013', listingId:'LST-012', property:'Marassi Penthouse MR-PH-08',      leadId:'L-1024', leadName:'Yasmin Nabil',    channel:'WhatsApp', agent:'Hana Mahmoud',  timestamp:'2026-05-15 11:30', response:'Interested' },
  { id:'SHR-014', listingId:'LST-015', property:'Eastown Apartment ET-A-301',      leadId:'L-1027', leadName:'Hossam Magdy',    channel:'WhatsApp', agent:'Fatma Ibrahim', timestamp:'2026-05-14 14:00', response:'Interested' },
  { id:'SHR-015', listingId:'LST-007', property:'Mountain View Duplex MV-DX-E105', leadId:'L-1025', leadName:'Ramy Aziz',       channel:'Call',     agent:'Omar Sherif',   timestamp:'2026-05-13 15:45', response:'Interested' },
  { id:'SHR-016', listingId:'LST-017', property:'Cairo Festival City CFC-A-410',   leadId:'L-1031', leadName:'Wael Helmy',      channel:'WhatsApp', agent:'Omar Sherif',   timestamp:'2026-05-12 10:00', response:'Viewed' },
  { id:'SHR-017', listingId:'LST-020', property:'Hyde Park Apartment HP-A-220',    leadId:'L-1033', leadName:'Ayman Lotfy',     channel:'Email',    agent:'Fatma Ibrahim', timestamp:'2026-04-22 09:15', response:'Interested' },
  { id:'SHR-018', listingId:'LST-014', property:'Capital Heights CH-A-110',        leadId:'L-1036', leadName:'Maha Riad',       channel:'WhatsApp', agent:'Omar Sherif',   timestamp:'2026-04-05 13:20', response:'Interested' },
  { id:'SHR-019', listingId:'LST-010', property:'Mivida Apartment MV-A-102',       leadId:'L-1034', leadName:'Dina Khalil',     channel:'Email',    agent:'Ahmed Hassan',  timestamp:'2026-04-14 11:00', response:'Viewed' },
  { id:'SHR-020', listingId:'LST-016', property:'Eastown Townhouse ET-TW-12',      leadId:'L-1027', leadName:'Hossam Magdy',    channel:'Call',     agent:'Fatma Ibrahim', timestamp:'2026-05-08 16:30', response:'Interested' },
  { id:'SHR-021', listingId:'LST-021', property:'Sodic West Villa SW-V-08',        leadId:'L-1029', leadName:'Ehab Saleh',      channel:'WhatsApp', agent:'Ahmed Hassan',  timestamp:'2026-05-09 10:15', response:'Interested' },
  { id:'SHR-022', listingId:'LST-013', property:'Al Rehab City AR-A-505',          leadId:'L-1019', leadName:'Magdy Nasr',      channel:'SMS',      agent:'Omar Sherif',   timestamp:'2026-05-08 09:45', response:'No Response' },
  { id:'SHR-023', listingId:'LST-018', property:'Telal Sokhna TS-CH-22',           leadId:'L-1020', leadName:'Inji Lotfy',      channel:'Email',    agent:'Hana Mahmoud',  timestamp:'2026-05-07 14:30', response:'Viewed' },
  { id:'SHR-024', listingId:'LST-019', property:'Palm Parks Twin House PP-TW-15',  leadId:'L-1021', leadName:'Ashraf Khalil',   channel:'WhatsApp', agent:'Ahmed Hassan',  timestamp:'2026-05-11 12:00', response:'No Response' },
  { id:'SHR-025', listingId:'LST-025', property:'Madinaty Townhouse MD-TW-302',    leadId:'L-1022', leadName:'Mariam Fathy',    channel:'Email',    agent:'Omar Sherif',   timestamp:'2026-05-07 11:30', response:'Interested' },
];

// ── INTRO CALLS ──
// Real domain record auto-spawned when an offer is accepted. The new
// agent's Team Leader owns the call. Lifecycle: Scheduled → Completed
// (or No-Show / Cancelled). HR + the agent see the record but only the
// owner can reschedule or close it out.
//
// Each row links to the onboarding application (applicantId) created
// from the offer accept, plus the underlying candidateId / offerId.
export const INTRO_CALL_STATUS = ['Scheduled','Completed','No-Show','Cancelled'];

export const INTRO_CALLS = [
  // Karim Mahmoud (APP004, agent persona Sarah's onboarding hasn't finished)
  // — call is upcoming.
  {
    id: 'IC-001',
    applicantId: 'APP005',
    candidateName: 'Sarah El-Masry',
    owner: 'Omar Sherif',               // Team Leader
    salesManager: 'Nour El-Din',
    location: 'Microsoft Teams',
    scheduledAt: '2026-05-19T10:30',    // demo "tomorrow" relative to 18-May
    durationMinutes: 30,
    status: 'Scheduled',
    notes: 'First touch — walk through CRM, KPIs, expectations.',
    createdAt: '2026-05-15T09:00',
    createdBy: 'Auto · Offer accepted (OFR-001)',
    completedAt: null,
    history: [
      { at: '2026-05-15T09:00', actor: 'System', action: 'Auto-scheduled from accepted offer OFR-001' },
    ],
  },
  // Fatma Ibrahim — onboarding complete; call done.
  {
    id: 'IC-002',
    applicantId: 'APP002',
    candidateName: 'Fatma Ibrahim',
    owner: 'Omar Sherif',
    salesManager: 'Nour El-Din',
    location: 'Microsoft Teams',
    scheduledAt: '2026-02-12T11:00',
    durationMinutes: 30,
    status: 'Completed',
    notes: 'Covered: CRM walkthrough, MLS access, first-week lead plan. Fatma asked great questions.',
    createdAt: '2026-02-08T14:00',
    createdBy: 'Auto · Offer accepted (OFR-002)',
    completedAt: '2026-02-12T11:34',
    history: [
      { at: '2026-02-08T14:00', actor: 'System',       action: 'Auto-scheduled from accepted offer OFR-002' },
      { at: '2026-02-12T11:34', actor: 'Omar Sherif',  action: 'Marked Completed — strong fit' },
    ],
  },
  // Aya Magdy (Finance Analyst — different department, owner=Khaled Magdy)
  // shows the same mechanism works for non-sales hires.
  {
    id: 'IC-003',
    applicantId: 'APP008',
    candidateName: 'Aya Magdy',
    owner: 'Khaled Magdy',              // Finance Manager
    salesManager: null,
    location: 'New Cairo HQ · Floor 4 Conference Room',
    scheduledAt: '2026-05-21T14:00',
    durationMinutes: 45,
    status: 'Scheduled',
    notes: 'Finance onboarding — walk through commission engine + payout cycle.',
    createdAt: '2026-05-13T10:00',
    createdBy: 'Auto · Offer accepted (OFR-004)',
    completedAt: null,
    history: [
      { at: '2026-05-13T10:00', actor: 'System', action: 'Auto-scheduled from accepted offer OFR-004' },
    ],
  },
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
export const APPLICATION_STATUS = ['Submitted', 'Under Review', 'Documents Pending', 'Training In Progress', 'Final Approval', 'Approved', 'Rejected'];
export const DOC_STATUS = ['Pending Review', 'Approved', 'Rejected', 'Missing'];
export const CANDIDATE_STAGES = ['Applied', 'Screening', 'Interview', 'Offer', 'Rejected'];
export const JOB_STATUS = ['Draft', 'Published', 'Closed'];
export const TOUR_STATUS = ['Scheduled', 'Completed', 'Cancelled', 'No-Show'];
// CONTRACT_STAGES retired — see DEAL_STAGES_OFFPLAN / DEAL_STAGES_RESALE above.
export const SHARE_CHANNELS = ['WhatsApp', 'Email', 'Call', 'SMS'];
export const SHARE_RESPONSES = ['Interested', 'Viewed', 'No Response'];
export const PROPERTY_TYPES = ['Apartment', 'Villa', 'Townhouse', 'Duplex', 'Penthouse', 'Chalet', 'Twin House', 'Studio'];
export const LISTING_STATUS = ['Available', 'Reserved', 'Sold'];
