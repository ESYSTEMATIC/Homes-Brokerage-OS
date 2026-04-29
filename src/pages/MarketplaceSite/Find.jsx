import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Building2, Users2, ArrowRight } from 'lucide-react';
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
          <p className="lead">Browse Egypt's leading developers and brokerages, explore their portfolios, and discover the right team for your next move.</p>
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
          <button className={`pm-type-tab ${tab==='brokerages'?'active':''}`} onClick={()=>setTab('brokerages')}>
            <Users2 size={13} style={{verticalAlign:'-2px',marginRight:4}}/> Brokerages
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
              <div key={d.id} className="pm-card" style={{ padding: 22, textAlign: 'center' }}>
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
                <button type="button" className="pm-btn-outline" style={{ marginTop: 14, padding: '8px 18px' }} onClick={() => window.alert(`Open ${d.name} portfolio (demo)`)}>View Portfolio <ArrowRight size={12}/></button>
              </div>
            ))}
          </div>
        )}

        {tab === 'brokerages' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginTop: 18 }}>
            {['Sotheby\'s International Realty Egypt', 'RE/MAX Egypt', 'Century 21 Egypt', 'Coldwell Banker Egypt'].filter(b => !q || b.toLowerCase().includes(q.toLowerCase())).map((b, i) => (
              <div key={b} className="pm-card" style={{ padding: 22 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 12,
                    background: `linear-gradient(135deg, hsl(${(i*60)%360},45%,55%), hsl(${(i*60+60)%360},45%,40%))`,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: 16,
                  }}>{b.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14 }}>{b}</div>
                    <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>49 listings · 39 active leads</div>
                  </div>
                  <button type="button" className="pm-card-cta" style={{ marginLeft: 'auto' }} onClick={() => navigate('/marketplace/buy')}>View Listings</button>
                </div>
              </div>
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
