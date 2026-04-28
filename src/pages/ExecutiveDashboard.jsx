import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { exportCSV } from '../components/UI';
import { Download, RefreshCw, MapPin } from 'lucide-react';

const today = () => new Date().toISOString().split('T')[0];
const fmt = v => 'EGP ' + (v||0).toLocaleString();

// ── Egypt geography ──
// All city points and the country outline are derived from real lat/lng then
// projected into the SVG viewBox (700×560) using:
//   x = 30 + (lng - 24.7) * 52.5
//   y = 30 + (31.667 - lat) * 51.5
// (The bounding box is Egypt's natural extent: 22..31.67°N, 24.7..36.9°E.)

const CITY_COORDS = {
  // 30.0444°N, 31.2357°E
  'Cairo':           { x: 374, y: 114 },
  // 30.0030°N, 31.4912°E (slightly east of Cairo)
  'New Cairo':       { x: 387, y: 116 },
  // 29.9285°N, 30.9188°E (west of Giza)
  '6th October':     { x: 357, y: 120 },
  // 30.0707°N, 30.9805°E
  'Sheikh Zayed':    { x: 360, y: 113 },
  // 30.0905°N, 31.3242°E
  'Heliopolis':      { x: 378, y: 112 },
  // 29.9602°N, 31.2569°E
  'Maadi':           { x: 374, y: 119 },
  // 30.0131°N, 31.2089°E
  'Giza':            { x: 372, y: 116 },
  // 31.2001°N, 29.9187°E
  'Alexandria':      { x: 304, y: 54 },
  // ~30.94°N, 28.5°E (Marsa Matrouh region)
  'North Coast':     { x: 230, y: 67 },
  'Sahel':           { x: 230, y: 67 },
  // 29.6033°N, 32.3434°E
  'Ain Sokhna':      { x: 432, y: 137 },
  // ~30°N, 31.74°E
  'New Capital':     { x: 400, y: 116 },
  // 31.0364°N, 31.3807°E
  'Mansoura':        { x: 380, y: 63 },
  // 27.2579°N, 33.8116°E
  'Hurghada':        { x: 508, y: 257 },
  // 24.0889°N, 32.8998°E
  'Aswan':           { x: 460, y: 422 },
  // 25.6872°N, 32.6396°E
  'Luxor':           { x: 446, y: 339 },
  // 27.9158°N, 34.3300°E
  'Sharm El-Sheikh': { x: 535, y: 224 },
  // 30.5965°N, 32.2715°E
  'Ismailia':        { x: 428, y: 85 },
  // 31.2653°N, 32.3019°E
  'Port Said':       { x: 430, y: 51 },
};

// ── Real Egypt outline ──
// 70+ vertices traced from simplified GeoJSON, projected with the formulas above.
// Going clockwise starting from the NW corner (Sallum / Libya border on the Mediterranean):
const EGYPT_PATH = `
  M 56 39
  L 78 41 L 102 43 L 128 45 L 158 46 L 188 47 L 215 48 L 240 50 L 263 52
  L 285 56 L 297 53 L 304 54 L 312 55 L 322 49 L 332 47 L 343 45 L 355 46
  L 367 49 L 380 47 L 393 49 L 408 53 L 420 51 L 430 51 L 445 52 L 462 50
  L 480 51 L 498 51 L 515 51 L 528 50
  L 540 71 L 550 92 L 558 117 L 564 142 L 562 165 L 555 188 L 545 209 L 535 224
  L 525 209 L 510 188 L 492 162 L 472 138 L 450 119 L 432 117
  L 446 142 L 462 168 L 478 196 L 490 222 L 502 248 L 514 276 L 524 308
  L 532 340 L 540 372 L 550 408 L 562 442 L 580 472 L 605 498 L 642 510
  L 600 514 L 540 518 L 480 522 L 420 524 L 360 524 L 300 522 L 240 518
  L 180 514 L 120 510 L 70 506 L 32 502
  L 30 460 L 30 410 L 30 350 L 32 290 L 36 230 L 42 170 L 49 110 Z
`;

const EgyptMap = ({ cityStats }) => {
  const [hovered, setHovered] = useState(null);
  const total = Object.values(cityStats).reduce((s, c) => s + c.leads + c.deals, 0);
  const max = Math.max(1, ...Object.values(cityStats).map(c => c.leads + c.deals));

  return (
    <svg viewBox="0 0 700 560" style={{width:'100%',height:520,display:'block'}}>
      <defs>
        {/* Land — clean monochrome with very subtle vertical depth */}
        <linearGradient id="land" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef1f4"/>
          <stop offset="100%" stopColor="#e1e6eb"/>
        </linearGradient>
        {/* Soft drop shadow under the country */}
        <filter id="landShadow" x="-5%" y="-5%" width="110%" height="115%">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#0f172a" floodOpacity="0.10"/>
        </filter>
        {/* Heatmap bubble — radial fade like Mapbox/GA */}
        <radialGradient id="aura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#E8672A" stopOpacity="0.55"/>
          <stop offset="55%" stopColor="#E8672A" stopOpacity="0.20"/>
          <stop offset="100%" stopColor="#E8672A" stopOpacity="0.00"/>
        </radialGradient>
        {/* Glow filter for hovered bubble */}
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur"/>
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background — clean off-white, no gradients, no graticule */}
      <rect x="0" y="0" width="700" height="560" fill="#fafbfc"/>

      {/* Egypt land */}
      <path d={EGYPT_PATH} fill="url(#land)" stroke="#94a3b8" strokeWidth="1" strokeLinejoin="round" filter="url(#landShadow)"/>

      {/* Nile river — soft blue, just enough geographic context */}
      <path
        d="M 460 522 L 458 480 L 452 420 L 446 360 L 438 300 L 426 240 L 412 180 L 396 130 L 378 100 L 350 75 L 322 60 L 300 56"
        stroke="#7eb4e8" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.65"/>
      {/* Nile delta fan */}
      <g stroke="#7eb4e8" strokeWidth="1.4" fill="none" strokeOpacity="0.45" strokeLinecap="round">
        <path d="M 350 75 L 285 56"/>
        <path d="M 350 75 L 320 55"/>
        <path d="M 350 75 L 360 50"/>
        <path d="M 350 75 L 395 50"/>
        <path d="M 350 75 L 425 52"/>
      </g>

      {/* Subtle country watermark */}
      <text x="160" y="290" fontSize="44" fontWeight="800" fill="#94a3b8" fillOpacity="0.18" letterSpacing="10">EGYPT</text>

      {/* Reference cities (no data) — shown as small grey dots so the map gives context */}
      {Object.entries(CITY_COORDS).map(([city, c]) => {
        if (cityStats[city]) return null;
        return <circle key={city} cx={c.x} cy={c.y} r="2.2" fill="#94a3b8"/>;
      })}

      {/* Active cities (with leads/deals) — heatmap bubbles */}
      {Object.entries(cityStats).map(([city, stats]) => {
        const c = CITY_COORDS[city];
        if (!c) return null;
        const v = stats.leads + stats.deals;
        if (v === 0) return null;
        const r = 8 + (v / max) * 22;
        const isHovered = hovered === city;
        return (
          <g key={city} style={{cursor:'pointer'}}
             onMouseEnter={()=>setHovered(city)}
             onMouseLeave={()=>setHovered(null)}>
            {/* soft heat aura */}
            <circle cx={c.x} cy={c.y} r={r * 2.2} fill="url(#aura)"/>
            {/* solid centre */}
            <circle cx={c.x} cy={c.y} r={r} fill="#E8672A" stroke="#fff" strokeWidth={isHovered ? 3 : 2}
                    filter={isHovered ? 'url(#glow)' : undefined}/>
            {/* number */}
            <text x={c.x} y={c.y + r * 0.32} textAnchor="middle"
                  fontSize={Math.max(11, r * 0.72)} fontWeight="800" fill="#fff" pointerEvents="none">{v}</text>
            {/* city label */}
            <text x={c.x} y={c.y + r + 14} textAnchor="middle"
                  fontSize="11" fontWeight="700" fill="#0f172a" pointerEvents="none">{city}</text>

            {/* clean white tooltip card */}
            {isHovered && (() => {
              const cardW = 168, cardH = 70;
              const tipX = Math.max(cardW/2 + 8, Math.min(700 - cardW/2 - 8, c.x));
              const tipY = c.y - r - cardH - 14;
              return (
                <g pointerEvents="none">
                  <rect x={tipX - cardW/2} y={tipY} width={cardW} height={cardH} rx="10"
                        fill="#fff" stroke="#e5e7eb" filter="url(#glow)"/>
                  <text x={tipX} y={tipY + 22} textAnchor="middle" fontSize="13" fontWeight="800" fill="#0f172a">{city}</text>
                  <line x1={tipX - 60} y1={tipY + 30} x2={tipX + 60} y2={tipY + 30} stroke="#f1f5f9" strokeWidth="1"/>
                  <text x={tipX - 60} y={tipY + 50} fontSize="11" fontWeight="600" fill="#6b7280">Leads</text>
                  <text x={tipX + 60} y={tipY + 50} textAnchor="end" fontSize="13" fontWeight="800" fill="#E8672A">{stats.leads}</text>
                  <text x={tipX - 60} y={tipY + 64} fontSize="11" fontWeight="600" fill="#6b7280">Deals</text>
                  <text x={tipX + 60} y={tipY + 64} textAnchor="end" fontSize="13" fontWeight="800" fill="#0f172a">{stats.deals}</text>
                  <polygon points={`${c.x - 7},${tipY + cardH} ${c.x + 7},${tipY + cardH} ${c.x},${tipY + cardH + 8}`} fill="#fff" stroke="#e5e7eb"/>
                </g>
              );
            })()}
          </g>
        );
      })}

      {/* Minimal legend bottom-left */}
      <g transform="translate(20, 510)">
        <text x="0" y="0" fontSize="10" fontWeight="700" fill="#94a3b8" letterSpacing="1.2">ACTIVITY VOLUME</text>
        <circle cx="6" cy="20" r="4" fill="#E8672A"/>
        <circle cx="28" cy="20" r="8" fill="#E8672A"/>
        <circle cx="56" cy="20" r="13" fill="#E8672A"/>
        <text x="78" y="24" fontSize="10" fill="#6b7280">low → high</text>
      </g>

      {/* Total bottom-right */}
      <g transform="translate(540, 502)">
        <text x="140" y="0" textAnchor="end" fontSize="10" fontWeight="700" fill="#94a3b8" letterSpacing="1.2">TOTAL ACTIVITY</text>
        <text x="140" y="26" textAnchor="end" fontSize="22" fontWeight="800" fill="#0f172a">{total}</text>
      </g>
    </svg>
  );
};

export const ExecutiveDashboard = () => {
  const { state, toast, writeAudit } = useApp();
  const [period, setPeriod] = useState('This Month');

  // Build a lookup: project name → project location.
  const projectLocation = useMemo(
    () => state.projects.reduce((a, p) => ({ ...a, [p.name]: p.location }), {}),
    [state.projects]
  );

  // Aggregate leads + deals per city.
  const cityStats = useMemo(() => {
    const stats = {};
    const inc = (city, key) => {
      if (!city) return;
      stats[city] = stats[city] || { leads: 0, deals: 0 };
      stats[city][key] += 1;
    };
    state.leads.forEach(l => inc(projectLocation[l.project] || l.project, 'leads'));
    state.deals.forEach(d => inc(projectLocation[d.project] || d.project, 'deals'));
    return stats;
  }, [state.leads, state.deals, projectLocation]);

  const totalSales = state.deals.reduce((s, d) => s + d.value, 0);
  const revenue = totalSales * 0.02;
  const expenses = 293000;
  const net = revenue - expenses;
  const pendingComm = state.commEngine.filter(c => c.status === 'Pending').reduce((s, c) => s + c.pool, 0);
  const paidComm = state.commEngine.filter(c => c.status === 'Paid').reduce((s, c) => s + c.pool, 0);
  const activeAgents = state.staff.filter(s => s.status === 'Active').length;
  const apprPending =
    state.onboarding.filter(o => o.status === 'Approved').length + ' approved / ' +
    state.onboarding.filter(o => !['Approved', 'Rejected'].includes(o.status)).length + ' pending';

  const refresh = () => { toast('Dashboard refreshed', 'info'); writeAudit('Dashboard Refreshed', 'Executive Dashboard', 'Reporting'); };
  const exportSnapshot = () => {
    const snap = [{ period, totalSales, revenue, expenses, net, pendingComm, paidComm, activeAgents, totalAgents: state.staff.length }];
    exportCSV(`executive_snapshot_${today()}`, snap);
    toast('Snapshot exported');
    writeAudit('Snapshot Exported', 'Executive Dashboard', 'Reporting', period);
  };

  // City rankings table
  const ranked = useMemo(() => {
    const total = Object.values(cityStats).reduce((s, c) => s + c.leads + c.deals, 0) || 1;
    return Object.entries(cityStats)
      .map(([city, c]) => ({ city, leads: c.leads, deals: c.deals, total: c.leads + c.deals, share: ((c.leads + c.deals) / total * 100).toFixed(1) }))
      .sort((a, b) => b.total - a.total);
  }, [cityStats]);

  return (
    <div>
      <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-end',gap:16}}>
        <div>
          <div className="page-breadcrumb"><span>Dashboard</span><span>&gt;</span><span className="current">Executive Dashboard</span></div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">High-level overview for leadership — BRD Section 9</p>
        </div>
        <div style={{display:'flex',gap:10,alignItems:'center'}}>
          <select className="data-select" value={period} onChange={e => setPeriod(e.target.value)}><option>This Month</option><option>Last Month</option><option>This Quarter</option><option>YTD</option></select>
          <button className="btn btn-outline btn-sm" onClick={refresh}><RefreshCw size={13}/> Refresh</button>
          <button className="btn btn-primary btn-sm" onClick={exportSnapshot}><Download size={13}/> Export Snapshot</button>
        </div>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Total Sales ({period})</div><div className="kpi-value" style={{fontSize:22}}>{fmt(totalSales)}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>📈</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Company Revenue</div><div className="kpi-value" style={{fontSize:22}}>{fmt(revenue)}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>💰</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Total Expenses</div><div className="kpi-value" style={{fontSize:22}}>{fmt(expenses)}</div></div><div className="kpi-icon red"><span style={{fontSize:20}}>💸</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Net Operating Result</div><div className="kpi-value" style={{fontSize:22}}>{fmt(net)}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>🏦</span></div></div>
      </div>
      <div className="kpi-grid kpi-grid-4">
        <div className="kpi-card"><div><div className="kpi-label">Pending Commissions</div><div className="kpi-value" style={{fontSize:22}}>{fmt(pendingComm)}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>⏳</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Paid Commissions</div><div className="kpi-value" style={{fontSize:22}}>{fmt(paidComm)}</div></div><div className="kpi-icon green"><span style={{fontSize:20}}>✅</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Active Agents</div><div className="kpi-value">{activeAgents} / {state.staff.length}</div></div><div className="kpi-icon blue"><span style={{fontSize:20}}>👥</span></div></div>
        <div className="kpi-card"><div><div className="kpi-label">Applications</div><div className="kpi-value" style={{fontSize:18}}>{apprPending}</div></div><div className="kpi-icon amber"><span style={{fontSize:20}}>📋</span></div></div>
      </div>

      {/* ── Egypt Map: Leads & Deals Distribution ── */}
      <h2 className="section-title" style={{marginTop:24,display:'flex',alignItems:'center',gap:8}}>
        <MapPin size={18} color="var(--brand)"/>
        Leads & Deals Distribution — Egypt
      </h2>
      <div className="grid-2col" style={{marginBottom:24}}>
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,overflow:'hidden',boxShadow:'var(--card-shadow)'}}>
          <EgyptMap cityStats={cityStats} />
          <div style={{padding:'12px 18px',fontSize:11,color:'var(--text-tertiary)',borderTop:'1px solid var(--border)',background:'#fafbfc'}}>Hover any city marker to see exact leads + deals counts. Bubble size scales with total activity volume.</div>
        </div>
        <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'18px 20px',boxShadow:'var(--card-shadow)'}}>
          <h3 style={{fontSize:14,fontWeight:700,marginBottom:14}}>City Rankings</h3>
          <div style={{display:'flex',flexDirection:'column',gap:8,maxHeight:420,overflowY:'auto',paddingRight:6}}>
            {ranked.length === 0 && <div className="empty-state" style={{padding:20}}>No location data yet.</div>}
            {ranked.map((r, i) => (
              <div key={r.city} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 12px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8}}>
                <div style={{width:24,height:24,borderRadius:'50%',background:i<3?'var(--brand)':'#e5e7eb',color:i<3?'#fff':'var(--text-secondary)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,flexShrink:0}}>{i+1}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:'var(--text-primary)'}}>{r.city}</div>
                  <div style={{fontSize:11,color:'var(--text-secondary)'}}>{r.leads} leads · {r.deals} deals</div>
                </div>
                <div style={{textAlign:'right',flexShrink:0}}>
                  <div style={{fontSize:14,fontWeight:800,color:'var(--brand)'}}>{r.total}</div>
                  <div style={{fontSize:10,color:'var(--text-tertiary)'}}>{r.share}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-equal-2" style={{marginTop:8}}>
        <div className="chart-placeholder">
          <div className="chart-title">Revenue vs Expenses Trend (Monthly)</div>
          <div className="chart-bars">
            {[65,72,85,90,88,95].map((v,i)=><div key={i} className="chart-bar" style={{background:'rgba(232,103,42,.18)',height:`${v}%`,borderTop:'3px solid var(--brand)'}}/>)}
            {[20,25,22,28,30,26].map((v,i)=><div key={`e${i}`} className="chart-bar" style={{background:'rgba(220,38,38,.15)',height:`${v}%`,borderTop:'3px solid var(--danger)'}}/>)}
          </div>
        </div>
        <div className="chart-placeholder">
          <div className="chart-title">Onboarding Funnel</div>
          <div style={{display:'flex',flexDirection:'column',gap:12,flex:1,justifyContent:'center'}}>
            {[['Submitted',90],['Under Review',75],['Docs Complete',85],['Training Done',65],['CRM Ready',40],['Matrix Ready',30]].map(([label,pct])=>(
              <div key={label} style={{display:'flex',alignItems:'center',gap:12}}>
                <span style={{width:100,fontSize:12,color:'var(--text-secondary)',textAlign:'right'}}>{label}</span>
                <div className="progress-bar" style={{flex:1}}><div className="progress-fill blue" style={{width:`${pct}%`}}/></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
