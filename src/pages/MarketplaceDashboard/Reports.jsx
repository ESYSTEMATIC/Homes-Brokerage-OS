import { useNavigate } from 'react-router-dom';
import { Magnet, Users2, Building2, LineChart as LineIcon, MapPin } from 'lucide-react';
import { MP_REPORTS } from '../../data/marketplaceData';

const ICONS = { leads: Magnet, users: Users2, inv: Building2, traf: LineIcon, geo: MapPin };

export const Reports = () => {
  const navigate = useNavigate();
  return (
    <div>
      <div className="mp-page-head">
        <div><h1>Reports</h1><p>Generate custom reports for board presentations and internal review</p></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {MP_REPORTS.map(r => {
          const Icon = ICONS[r.id];
          return (
            <div key={r.id} className="mp-card">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'rgba(232,103,42,.10)', color: 'var(--brand)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={20} />
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6 }}>{r.title}</h3>
              <p style={{ fontSize: 12, color: '#6b7280', minHeight: 56, lineHeight: 1.5 }}>{r.desc}</p>
              <button className="btn btn-outline btn-sm" style={{ marginTop: 12 }} onClick={()=>navigate(`/system/marketplace-dashboard/reports/${r.id}`)}>Configure Report</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
