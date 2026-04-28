import React from 'react';
import { Bell, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';

const NOTIFICATIONS = [
  { id: 1, type: 'success', title: 'Deal Approved', message: 'The deal for PH-BAD-A101 has been approved by the Finance Dept.', time: '2 mins ago', unread: true },
  { id: 2, type: 'info', title: 'New Lead Assigned', message: 'A new high-priority lead has been assigned to you from Marketplace.', time: '45 mins ago', unread: true },
  { id: 3, type: 'warning', title: 'Document Expiring', message: 'Your Tax ID document is expiring in 15 days. Please re-upload.', time: '2 hours ago', unread: false },
  { id: 4, type: 'error', title: 'Payment Rejected', message: 'Transaction #TX9902 was rejected due to incorrect bank details.', time: '1 day ago', unread: false },
  { id: 5, type: 'info', title: 'System Update', message: 'HOMES OS will be undergoing maintenance tonight at 2:00 AM.', time: '2 days ago', unread: false },
];

export const NotificationsPage = () => {
  const handleAction = (id) => alert(`Action for notification ${id}`);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">Stay updated with the latest activities and alerts</p>
        </div>
        <button className="btn btn-outline btn-sm">
          <CheckCircle2 size={16} /> Mark all as read
        </button>
      </div>

      <div className="data-panel" style={{ padding: 0 }}>
        {NOTIFICATIONS.map((n, i) => (
          <div key={n.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '24px 32px',
            borderBottom: i === NOTIFICATIONS.length - 1 ? 'none' : '1px solid var(--border)',
            background: n.unread ? 'rgba(235, 90, 40, 0.02)' : 'transparent',
            transition: 'background 0.2s',
            cursor: 'pointer'
          }} className="hover-item">
            <div className={`kpi-icon ${n.type === 'success' ? 'green' : n.type === 'warning' ? 'amber' : n.type === 'error' ? 'red' : 'blue'}`} style={{ width: 48, height: 48, marginRight: 20 }}>
              {n.type === 'success' ? <CheckCircle2 size={20} /> : n.type === 'warning' ? <AlertCircle size={20} /> : n.type === 'error' ? <AlertCircle size={20} /> : <Bell size={20} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--text-primary)' }}>{n.title}</span>
                {n.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent)' }}></div>}
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{n.message}</p>
            </div>
            <div style={{ textAlign: 'right', marginLeft: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-tertiary)', fontSize: 12, marginBottom: 8 }}>
                <Clock size={12} /> {n.time}
              </div>
              <div className="action-icons">
                <div className="action-icon" onClick={(e) => { e.stopPropagation(); handleAction(n.id); }}><Trash2 size={14} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
