import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Shield, MapPin, Calendar, Camera, Phone, Briefcase } from 'lucide-react';
import { AgentPerformancePanel } from '../components/AgentPerformance';
import { personaOwnerName } from '../data/crmAccess';

export const ProfilePage = () => {
  const { persona, personaKey } = useApp();
  // Sales-track personas map to a deal owner — show their performance
  // analytics. Non-sales roles have no deals, so the panel is omitted.
  const agentName = personaOwnerName(personaKey);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">User Profile</h1>
        <p className="page-subtitle">Manage your personal information and security settings</p>
      </div>

      <div className="grid-2col">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Main Info Card */}
          <div className="data-panel" style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 24px' }}>
              <div className="topbar-avatar" style={{ width: 120, height: 120, fontSize: 36, background: 'var(--sidebar-bg)' }}>
                {persona.label.substring(0, 2).toUpperCase()}
              </div>
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: 'var(--accent)', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', border: '4px solid #fff', cursor: 'pointer' }}>
                <Camera size={16} />
              </div>
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{persona.label}</h2>
            <p style={{ color: 'var(--text-secondary)', fontWeight: 600, marginTop: 4 }}>{persona.role || 'Staff Member'}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
              <span className="badge badge-success">Active</span>
              <span className="badge badge-info">{persona.scope}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="data-panel">
            <h3 className="section-title">Account Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="kpi-icon gray" style={{ width: 40, height: 40 }}><Mail size={18} /></div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>EMAIL ADDRESS</div>
                  <div style={{ fontWeight: 600 }}>{persona.email || 'user@homes.com.eg'}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="kpi-icon gray" style={{ width: 40, height: 40 }}><Phone size={18} /></div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>PHONE NUMBER</div>
                  <div style={{ fontWeight: 600 }}>+20 100 234 5678</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="kpi-icon gray" style={{ width: 40, height: 40 }}><MapPin size={18} /></div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>LOCATION</div>
                  <div style={{ fontWeight: 600 }}>Cairo, Egypt</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Role & Permissions */}
          <div className="data-panel">
            <h3 className="section-title">Role & Security</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="kpi-icon gray" style={{ width: 40, height: 40 }}><Shield size={18} /></div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>ACCESS LEVEL</div>
                  <div style={{ fontWeight: 600 }}>{persona.label} Access</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="kpi-icon gray" style={{ width: 40, height: 40 }}><Briefcase size={18} /></div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>HUB</div>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{persona.hub} Management</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div className="kpi-icon gray" style={{ width: 40, height: 40 }}><Calendar size={18} /></div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 700 }}>MEMBER SINCE</div>
                  <div style={{ fontWeight: 600 }}>Jan 2024</div>
                </div>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 32 }} onClick={() => alert('Change Password functionality coming soon...')}>
              Change Password
            </button>
          </div>
        </div>
      </div>

      {/* Deals performance + conversion analytics (SME ask, May 2026) */}
      {agentName && <AgentPerformancePanel agentName={agentName} />}
    </div>
  );
};
