// ═══════════════════════════════════════════════════════════════════════
// AgentPerformance — deals performance + conversion analytics for an agent
// ───────────────────────────────────────────────────────────────────────
// SME feedback (May 2026):
//   • Agent profile needs deals-performance analytics (how many deals the
//     agent closed) and a conversion rate (closed deals ÷ total deals).
//   • A period filter drives both — Last 30 days / This month / This
//     quarter / Custom range.
//   • The Sales Director can view this for agents in their reporting line.
//
// Embedded in: User Profile, Staff Management drawer, Agents List drawer.
// ═══════════════════════════════════════════════════════════════════════
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { TrendingUp, Target, CheckCircle2, Layers } from 'lucide-react';

const fmtEGP = (n) => `EGP ${new Intl.NumberFormat('en-EG').format(Math.round(n || 0))}`;

// A deal is "closed / won" once it reaches Contract Signed — commission
// locks there (DEAL_STAGES_OFFPLAN). commissionLocked mirrors that exactly.
const WON_STAGES = ['Contract Signed', 'Early Collection Trigger (5%)', 'Standard Collection (10%)'];
const isWonDeal = (d) => d.commissionLocked === true || WON_STAGES.includes(d.stage);

// Period preset → [from, to] as inclusive YYYY-MM-DD strings.
const periodRange = (key, custom) => {
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  if (key === 'custom')  return [custom.from || '', custom.to || ''];
  if (key === '30d')     { const f = new Date(today); f.setDate(f.getDate() - 30); return [iso(f), iso(today)]; }
  if (key === 'month')   { const f = new Date(today.getFullYear(), today.getMonth(), 1); return [iso(f), iso(today)]; }
  if (key === 'quarter') { const q = Math.floor(today.getMonth() / 3); const f = new Date(today.getFullYear(), q * 3, 1); return [iso(f), iso(today)]; }
  return ['', ''];
};

const PERIODS = [
  ['30d', 'Last 30 days'],
  ['month', 'This month'],
  ['quarter', 'This quarter'],
  ['custom', 'Custom'],
];

const Tile = ({ icon: Icon, label, value, sub, color }) => (
  <div style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px' }}>
    <div style={{ display:'flex', alignItems:'center', gap:7, marginBottom:8 }}>
      <div style={{ width:26, height:26, borderRadius:7, background:`${color}1a`, color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        <Icon size={14} />
      </div>
      <span style={{ fontSize:10, fontWeight:700, color:'var(--text-tertiary)', textTransform:'uppercase', letterSpacing:'.05em' }}>{label}</span>
    </div>
    <div style={{ fontSize:22, fontWeight:800, color:'var(--text-primary)', lineHeight:1 }}>{value}</div>
    {sub && <div style={{ fontSize:10.5, color:'var(--text-tertiary)', marginTop:5 }}>{sub}</div>}
  </div>
);

export const AgentPerformancePanel = ({ agentName }) => {
  const { state } = useApp();
  const [period, setPeriod] = useState('30d');
  const [custom, setCustom] = useState({ from: '', to: '' });

  const [from, to] = periodRange(period, custom);

  const stats = useMemo(() => {
    const mine = (state.deals || []).filter(d => d.owner === agentName);
    const inPeriod = mine.filter(d => {
      const dt = d.created || '';
      if (from && dt < from) return false;
      if (to && dt > to) return false;
      return true;
    });
    const won = inPeriod.filter(isWonDeal);
    const lost = inPeriod.filter(d => d.status === 'Closed Lost');
    return {
      ownsAny: mine.length > 0,
      total: inPeriod.length,
      won: won.length,
      lost: lost.length,
      conv: inPeriod.length ? Math.round((won.length / inPeriod.length) * 100) : 0,
      wonValue: won.reduce((s, d) => s + (d.value || 0), 0),
      pipelineValue: inPeriod.reduce((s, d) => s + (d.value || 0), 0),
    };
  }, [state.deals, agentName, from, to]);

  return (
    <div style={{ marginTop:14, padding:'16px 18px', background:'#fafbfc', border:'1px solid var(--border)', borderRadius:12 }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, flexWrap:'wrap' }}>
        <TrendingUp size={16} color="var(--brand)" />
        <div style={{ fontSize:13, fontWeight:800, color:'var(--text-primary)' }}>Performance Analytics</div>
        <span style={{ fontSize:10, color:'var(--text-tertiary)', marginLeft:'auto' }}>
          Deals owned by {agentName}
        </span>
      </div>

      {/* Period selector */}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:12 }}>
        {PERIODS.map(([k, label]) => {
          const active = period === k;
          return (
            <button
              key={k}
              type="button"
              onClick={() => setPeriod(k)}
              style={{
                padding:'5px 11px', borderRadius:999, fontSize:11, fontWeight:700, cursor:'pointer',
                border:`1px solid ${active ? 'var(--brand)' : 'var(--border)'}`,
                background: active ? 'var(--brand)' : '#fff',
                color: active ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {label}
            </button>
          );
        })}
        {period === 'custom' && (
          <div style={{ display:'flex', gap:6, alignItems:'center' }}>
            <input type="date" value={custom.from} onChange={e => setCustom(c => ({ ...c, from: e.target.value }))}
              style={{ padding:'4px 8px', border:'1px solid var(--border)', borderRadius:7, fontSize:11, fontFamily:'inherit' }} />
            <span style={{ fontSize:11, color:'var(--text-tertiary)' }}>→</span>
            <input type="date" value={custom.to} onChange={e => setCustom(c => ({ ...c, to: e.target.value }))}
              style={{ padding:'4px 8px', border:'1px solid var(--border)', borderRadius:7, fontSize:11, fontFamily:'inherit' }} />
          </div>
        )}
      </div>

      {!stats.ownsAny ? (
        <div style={{ padding:'18px 14px', textAlign:'center', color:'var(--text-tertiary)', fontSize:12, background:'#fff', border:'1px dashed var(--border)', borderRadius:10 }}>
          No deals on record for this agent yet.
        </div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:10 }}>
            <Tile icon={CheckCircle2} color="#10b981" label="Deals closed"
              value={stats.won}
              sub={`${fmtEGP(stats.wonValue)} won`} />
            <Tile icon={Target} color="#E8672A" label="Conversion rate"
              value={`${stats.conv}%`}
              sub={`${stats.won} of ${stats.total} deals`} />
            <Tile icon={Layers} color="#3b82f6" label="Total deals"
              value={stats.total}
              sub={`${fmtEGP(stats.pipelineValue)} pipeline`} />
            <Tile icon={TrendingUp} color="#8b5cf6" label="Closed lost"
              value={stats.lost}
              sub={stats.lost ? 'Deals lost in period' : 'None lost'} />
          </div>
          {(from || to) && (
            <div style={{ fontSize:10, color:'var(--text-tertiary)', marginTop:10 }}>
              Period: {from || '—'} → {to || 'today'} · conversion = closed deals ÷ total deals · a deal counts as closed once it reaches Contract Signed.
            </div>
          )}
        </>
      )}
    </div>
  );
};
