import React from 'react';
import { PROJECTS } from '../data/staticData';
import { Building2, MapPin, Layers, Layout, Clock, TrendingUp, DollarSign, User, Mail, Phone, Calendar, Briefcase, ShieldCheck, FileText, CheckCircle, Clock3, AlertCircle, HelpCircle, MessageSquare, ExternalLink } from 'lucide-react';

const fmt = v => new Intl.NumberFormat('en-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 0 }).format(v);

export const AgentProducts = () => {
  const handleAction = (name) => alert(`Viewing details for ${name}...`);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Products & Services</h1>
        <p className="page-subtitle">Browse available developer inventory — projects and compounds</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
        {PROJECTS.filter(p => p.status === 'Published').map(p => (
          <div key={p.id} className="quick-card" style={{ padding: 0, overflow: 'hidden', cursor: 'default' }}>
            <div style={{ height: 160, background: 'linear-gradient(135deg, #1e3a5f, #2563eb)', position: 'relative', display: 'flex', alignItems: 'flex-end', padding: 20 }}>
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <span className={`badge ${p.type === 'Resort' ? 'badge-info' : p.type === 'Township' ? 'badge-success' : 'badge-warning'}`}>{p.type}</span>
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{p.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MapPin size={12} /> {p.location} · {p.developer}
                </div>
              </div>
            </div>
            <div style={{ padding: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <div className="kpi-label" style={{ fontSize: 10 }}>Total Units</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.units}</div>
                </div>
                <div>
                  <div className="kpi-label" style={{ fontSize: 10 }}>Available</div>
                  <div style={{ fontWeight: 700, color: 'var(--success)' }}>{p.available}</div>
                </div>
                <div>
                  <div className="kpi-label" style={{ fontSize: 10 }}>Starting From</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{fmt(p.priceFrom)}</div>
                </div>
                <div>
                  <div className="kpi-label" style={{ fontSize: 10 }}>Delivery</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{p.delivery}</div>
                </div>
              </div>
              <button className="btn btn-outline btn-sm w-full" onClick={() => handleAction(p.name)}>View Full Inventory</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AgentPerformance = () => (
  <div className="animate-fade-in">
    <div className="page-header">
      <h1 className="page-title">Performance Metrics</h1>
      <p className="page-subtitle">Your sales activity and productivity — Live from CRM</p>
    </div>
    
    <div className="kpi-grid kpi-grid-4" style={{ marginBottom: 24 }}>
      <div className="kpi-card">
        <div><div className="kpi-label">Leads Assigned</div><div className="kpi-value">0</div></div>
        <div className="kpi-icon gray"><Briefcase size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Tours Completed</div><div className="kpi-value">0</div></div>
        <div className="kpi-icon gray"><MapPin size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Deals Closed</div><div className="kpi-value">0</div></div>
        <div className="kpi-icon gray"><CheckCircle size={20} /></div>
      </div>
      <div className="kpi-card">
        <div><div className="kpi-label">Commission Ratio</div><div className="kpi-value">0%</div></div>
        <div className="kpi-icon gray"><TrendingUp size={20} /></div>
      </div>
    </div>
    
    <div className="info-banner" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <AlertCircle size={18} />
      <span>Performance data will populate once CRM access is granted and leads are assigned to your account.</span>
    </div>
  </div>
);

export const AgentProfile = () => (
  <div className="animate-fade-in">
    <div className="page-header">
      <h1 className="page-title">Personal Profile</h1>
      <p className="page-subtitle">Manage your account and verified credentials</p>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24 }}>
      <div className="data-panel" style={{ padding: 32, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #EB5A28, #f59e0b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: 20, boxShadow: '0 8px 16px rgba(235,90,40,0.2)' }}>SE</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, margin: 0 }}>Sarah El-Masry</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Senior Licensed Agent</p>
        <div className="badge badge-success" style={{ marginTop: 16, padding: '8px 16px' }}>Verified Professional</div>
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border-color)', width: '100%', fontSize: 12, color: 'var(--text-tertiary)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}><span>MLS ID</span><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>EGMLS-287451</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Member Since</span><span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Jan 2024</span></div>
        </div>
      </div>
      
      <div className="data-panel" style={{ padding: 32 }}>
        <h3 className="section-title" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <User size={18} className="orange" /> Professional Information
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {[
            { label: 'Full Name', value: 'Sarah El-Masry', icon: <User size={14} /> },
            { label: 'Email Address', value: 'sarah@homesbrokerage.eg', icon: <Mail size={14} /> },
            { label: 'Phone Number', value: '+20 100 123 4567', icon: <Phone size={14} /> },
            { label: 'Home Branch', value: 'New Cairo Headquarters', icon: <MapPin size={14} /> },
            { label: 'Department', value: 'Residential Sales', icon: <Briefcase size={14} /> },
            { label: 'Reports To', value: 'Karim Mostafa (Team Lead)', icon: <ShieldCheck size={14} /> },
          ].map((item) => (
            <div key={item.label}>
              <div className="kpi-label" style={{ fontSize: 10, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                {item.icon} {item.label}
              </div>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{ marginTop: 32 }}>Request Information Update</button>
      </div>
    </div>
  </div>
);

export const AgentDocuments = () => {
  const handleAction = (doc) => alert(`Initiating upload for ${doc}...`);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Digital Vault</h1>
          <p className="page-subtitle">Upload and manage your required professional compliance documents</p>
        </div>
        <div className="badge badge-warning" style={{ padding: '8px 16px' }}>2 Documents Required</div>
      </div>

      <div className="kpi-grid kpi-grid-3" style={{ marginBottom: 32 }}>
        <div className="kpi-card">
          <div><div className="kpi-label">Verified</div><div className="kpi-value">7</div></div>
          <div className="kpi-icon green"><CheckCircle size={20} /></div>
        </div>
        <div className="kpi-card">
          <div><div className="kpi-label">Pending Action</div><div className="kpi-value">2</div></div>
          <div className="kpi-icon amber"><Clock3 size={20} /></div>
        </div>
        <div className="kpi-card">
          <div><div className="kpi-label">Compliance Status</div><div className="kpi-value" style={{ fontSize: 18 }}>92% Clear</div></div>
          <div className="kpi-icon blue"><ShieldCheck size={20} /></div>
        </div>
      </div>

      <div className="data-panel">
        <div className="data-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Document Name</th>
                <th>Category</th>
                <th>Verification Status</th>
                <th>Last Update</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['National ID (Front & Back)', 'Identity', 'Approved', 'Jan 14, 2024'],
                ['Personal Tax Card', 'Financial', 'Approved', 'Jan 14, 2024'],
                ['Valid RERA License', 'Regulatory', 'Approved', 'Jan 12, 2024'],
                ['Master Brokerage Agreement', 'Legal', 'Approved', 'Jan 10, 2024'],
                ['Clean Criminal Record', 'Legal', 'Approved', 'Jan 08, 2024'],
                ['Official Bank Details', 'Financial', 'Approved', 'Jan 08, 2024'],
                ['Professional Profile Photo', 'Identity', 'Approved', 'Jan 05, 2024'],
                ['Proof of Residential Address', 'Identity', 'Pending', '—'],
                ['Professional Indemnity Insurance', 'Financial', 'Pending', '—']
              ].map(([doc, type, status, date]) => (
                <tr key={doc}>
                  <td className="bold">{doc}</td>
                  <td className="muted">{type}</td>
                  <td>
                    <span className={`badge ${status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>{status}</span>
                  </td>
                  <td className="muted">{date}</td>
                  <td style={{ textAlign: 'right' }}>
                    {status === 'Pending' ? (
                      <button className="btn btn-primary btn-sm" onClick={() => handleAction(doc)}>Upload Now</button>
                    ) : (
                      <button className="btn btn-outline btn-sm" onClick={() => alert(`Downloading ${doc}...`)}>Download</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const AgentNotifications = () => {
  const handleAction = (text) => alert(`Action taken for: ${text}`);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Notification Hub</h1>
        <p className="page-subtitle">Stay updated on your compliance, leads, and platform activity</p>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {[
          { text: 'Your National ID has been successfully verified by Compliance', time: '2 hours ago', type: 'success', icon: <CheckCircle size={18} /> },
          { text: 'Training module "Anti-Money Laundering" is due for completion in 3 days', time: '5 hours ago', type: 'warning', icon: <Clock3 size={18} /> },
          { text: 'System Welcome: Complete your onboarding journey to unlock CRM access', time: '1 day ago', type: 'info', icon: <AlertCircle size={18} /> },
          { text: 'MLS ID verification is currently in progress with EGMLS', time: '2 days ago', type: 'info', icon: <ShieldCheck size={18} /> },
          { text: 'Urgent: Please upload your "Proof of Address" document for account validation', time: '3 days ago', type: 'warning', icon: <AlertCircle size={18} /> },
        ].map((n, i) => (
          <div key={i} className={`alert-card ${n.type === 'warning' ? 'warning' : n.type === 'success' ? 'success' : 'info'}`} style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: `4px solid ${n.type === 'success' ? 'var(--success)' : n.type === 'warning' ? 'var(--warning)' : 'var(--accent)'}`, background: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ color: n.type === 'success' ? 'var(--success)' : n.type === 'warning' ? 'var(--warning)' : 'var(--accent)' }}>{n.icon}</div>
              <div>
                <div className="alert-card-text" style={{ fontWeight: 600, fontSize: 14 }}>{n.text}</div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{n.time}</div>
              </div>
            </div>
            <span className="alert-card-action" onClick={() => handleAction(n.text)}>Mark as Read</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AgentHelp = () => {
  const handleTicket = () => alert('Opening ticket creation form...');

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Support Center</h1>
          <p className="page-subtitle">FAQs, onboarding guides, and dedicated support ticket management</p>
        </div>
        <button className="btn btn-primary" onClick={handleTicket}>+ Open New Ticket</button>
      </div>

      <div className="kpi-grid kpi-grid-3" style={{ marginBottom: 32 }}>
        <div className="kpi-card">
          <div><div className="kpi-label">Active Tickets</div><div className="kpi-value">1</div></div>
          <div className="kpi-icon amber"><MessageSquare size={20} /></div>
        </div>
        <div className="kpi-card">
          <div><div className="kpi-label">Resolved Cases</div><div className="kpi-value">4</div></div>
          <div className="kpi-icon green"><CheckCircle size={20} /></div>
        </div>
        <div className="kpi-card">
          <div><div className="kpi-label">Avg. Response</div><div className="kpi-value">2.4h</div></div>
          <div className="kpi-icon blue"><Clock3 size={20} /></div>
        </div>
      </div>

      <div className="data-panel" style={{ padding: 32 }}>
        <h3 className="section-title" style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <HelpCircle size={18} className="orange" /> Knowledge Base & FAQs
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {[
            { q: 'How do I request CRM access?', a: 'CRM access is automatically granted once all required training courses are completed and your background check is approved by HR and Compliance.' },
            { q: 'When are commissions paid?', a: 'Commissions are processed in two monthly cycles: the 10th and 25th, provided the developer has cleared the underlying payment.' },
            { q: 'Who do I contact for MLS ID issues?', a: 'Please open a support ticket from this page and route it specifically to the "Operations & Systems" department.' },
          ].map((faq, i) => (
            <div key={i} style={{ padding: 20, border: '1px solid var(--border-color)', borderRadius: 12, background: 'var(--content-bg)' }}>
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, fontSize: 15 }}>{faq.q}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>{faq.a}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 32, textAlign: 'center' }}>
          <button className="btn btn-outline" onClick={() => alert('Opening Full Help Center...')}>
            <ExternalLink size={16} style={{ marginRight: 8 }} /> View Full Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
