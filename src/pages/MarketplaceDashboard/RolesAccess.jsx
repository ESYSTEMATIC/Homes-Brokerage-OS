import { ShieldCheck, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MP_ROLES } from '../../data/marketplaceData';

export const RolesAccess = () => {
  const { toast } = useApp();
  return (
    <div>
      <div className="mp-page-head">
        <div><h1>Roles & Access</h1><p>Marketplace-scope roles and permissions for the federated dashboard</p></div>
        <button className="btn btn-primary" onClick={()=>toast('Role builder modal would open here','info')}><Plus size={14}/> Create Role</button>
      </div>

      <div className="mp-kpi-grid cols-4">
        <div className="mp-kpi-card"><div className="mp-kpi-label">Total Roles</div><div className="mp-kpi-value">{MP_ROLES.length}</div></div>
        <div className="mp-kpi-card"><div className="mp-kpi-label">Total Users Assigned</div><div className="mp-kpi-value">{MP_ROLES.reduce((s,r)=>s+r.users,0)}</div></div>
        <div className="mp-kpi-card"><div className="mp-kpi-label">Active Roles</div><div className="mp-kpi-value">{MP_ROLES.filter(r => r.status === 'Active').length}</div></div>
        <div className="mp-kpi-card"><div className="mp-kpi-label">Avg. Permissions / Role</div><div className="mp-kpi-value">{Math.round(MP_ROLES.reduce((s,r)=>s+r.perms,0) / MP_ROLES.length)}</div></div>
      </div>

      <div className="mp-table-wrap">
        <table className="mp-table">
          <thead><tr><th>Role</th><th>Scope</th><th>Permissions</th><th>Users</th><th>Status</th><th>Description</th></tr></thead>
          <tbody>{MP_ROLES.map(r => (
            <tr key={r.id}>
              <td style={{ fontWeight: 700 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <ShieldCheck size={14} color="var(--brand)"/>
                  {r.name}
                </div>
              </td>
              <td style={{ fontSize: 12, color: '#6b7280' }}>{r.scope}</td>
              <td>{r.perms}</td>
              <td>{r.users}</td>
              <td><span className="mp-pill" style={{ background: 'rgba(34,197,94,.10)', color: '#16a34a' }}>{r.status}</span></td>
              <td style={{ fontSize: 12, color: '#6b7280', maxWidth: 260 }}>{r.desc}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
};
