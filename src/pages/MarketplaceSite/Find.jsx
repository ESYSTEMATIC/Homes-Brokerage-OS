import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, ArrowRight } from 'lucide-react';
import { PM_AREAS } from '../../data/publicMarketplaceData';
import { MP_DEVELOPERS } from '../../data/marketplaceData';

export const Find = () => {
  const [tab, setTab] = useState('developers');
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  return (
    <>
      <section className="pm-feature-hero">
        <div>
          <h1>Find Your Next <span className="accent">Developer</span></h1>
          <p className="lead">Browse Egypt's leading developers, explore their portfolios, and discover the right team for your next move.</p>
          <div className="ctas">
            <button type="button" className="pm-btn-primary" onClick={() => document.querySelector('.pm-search-bar input')?.focus()}><Search size={14}/> Start Searching</button>
            <button type="button" className="pm-btn-outline" onClick={() => setTab('areas')}>Browse Areas</button>
          </div>
        </div>
        <div className="pm-feature-hero-art" />
      </section>

      <section className="pm-section tight">
        <div className="pm-type-tabs" style={{ justifyContent: 'center' }}>
          <button className={`pm-type-tab ${tab==='developers'?'active':''}`} onClick={()=>setTab('developers')}>
            <Building2 size={13} style={{verticalAlign:'-2px',marginRight:4}}/> Developers
          </button>
          <button className={`pm-type-tab ${tab==='areas'?'active':''}`} onClick={()=>setTab('areas')}>
            <MapPin size={13} style={{verticalAlign:'-2px',marginRight:4}}/> Areas
          </button>
        </div>

        <div className="pm-search-bar" style={{ marginTop: 18 }}>
          <Search size={16} color="#9ca3af"/>
          <input placeholder={`Search ${tab}…`} value={q} onChange={e => setQ(e.target.value)} />
        </div>

        {tab === 'developers' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 18 }}>
            {MP_DEVELOPERS.filter(d => !q || d.name.toLowerCase().includes(q.toLowerCase())).slice(0, 9).map((d, i) => (
              <button
                type="button"
                key={d.id}
                className="pm-card"
                style={{ padding: 22, textAlign: 'center', cursor: 'pointer', border: 'none', font: 'inherit' }}
                onClick={() => navigate(`/marketplace/buy?developer=${encodeURIComponent(d.name)}`)}
              >
                <div style={{
                  width: 60, height: 60, borderRadius: 12,
                  margin: '0 auto 12px',
                  background: `linear-gradient(135deg, hsl(${(i*42)%360},45%,55%), hsl(${(i*42+60)%360},45%,40%))`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 18,
                }}>{d.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                <div style={{ fontWeight: 800, fontSize: 14 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{d.projects} projects · {d.units} units</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>{d.governorates.join(', ')}</div>
                <span className="pm-btn-outline" style={{ marginTop: 14, padding: '8px 18px', display: 'inline-flex' }}>View Portfolio <ArrowRight size={12}/></span>
              </button>
            ))}
          </div>
        )}

        {tab === 'areas' && (
          <div className="pm-area-grid" style={{ justifyContent: 'flex-start' }}>
            {PM_AREAS.filter(a => !q || a.toLowerCase().includes(q.toLowerCase())).map(area => (
              <button key={area} type="button" className="pm-area-pill" onClick={() => navigate(`/marketplace/buy?area=${encodeURIComponent(area)}`)}>{area} <ArrowRight size={12} className="arrow"/></button>
            ))}
          </div>
        )}
      </section>
    </>
  );
};
