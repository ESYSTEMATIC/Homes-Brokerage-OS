// ═══════════════════════════════════════════════════════════════
// CRM Campaigns — Social media + ad campaigns surface
// ───────────────────────────────────────────────────────────────
// Modelled on the reference screenshots from the campaign/ folder:
//   • KPI strip: Total Campaigns / Leads / Impressions / Total Spent
//   • Status tabs: All · Active · Paused · Draft · Completed
//   • Campaign cards (3-col grid): name, platforms (FB/IG), status pill,
//     leads / impressions / CTR, budget bar, primary action (Pause / Resume / Publish)
//   • "+ New Campaign" split button → Create Social Media Campaign modal
//   • Modal: name, description, objective, budget, platforms, media + live post preview
// Visible exclusively to the marketing persona (BRD §8.23).
// ═══════════════════════════════════════════════════════════════
import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { canSeeCampaigns } from '../../data/crmAccess';
import {
  Plus, Megaphone, Users, Eye, DollarSign, Pause, Play, Send,
  Facebook, Instagram, Image, Video, X, MoreHorizontal, ThumbsUp, MessageCircle, Share2,
} from 'lucide-react';

const SEED_CAMPAIGNS = [
  {
    id: 'CMP-001', name: 'Social Studio', status: 'Active',
    platforms: ['Facebook','Instagram'], objective: 'Lead Generation',
    budget: 0, spend: 0, leads: 0, impressions: 0, ctr: 0,
    description: 'Demo brand awareness campaign across social channels.',
    auto: false, durationDays: null,
  },
  {
    id: 'CMP-002', name: 'PPC - Microsite', status: 'Draft',
    platforms: ['Facebook'], objective: 'Lead Generation',
    budget: 500, spend: 0, leads: 0, impressions: 0, ctr: 0,
    description: 'Auto-created from PPCPL wizard. Budget $500/mo, Duration 30 days.',
    auto: true, durationDays: 30,
  },
  {
    id: 'CMP-003', name: 'Brickell Launch', status: 'Active',
    platforms: ['Facebook','Instagram'], objective: 'Brand Awareness',
    budget: 500, spend: 0, leads: 0, impressions: 0, ctr: 0,
    description: 'Launch teaser for Brickell — sponsored post + reels.',
    auto: false, durationDays: null,
  },
];

const OBJECTIVES = ['Lead Generation','Brand Awareness','Engagement','Reach','Traffic','Conversions'];
const STATUS_TABS = ['All','Active','Paused','Draft','Completed'];

const PlatformIcon = ({ p, size = 14 }) =>
  p === 'Facebook' ? <Facebook size={size} color="#1877F2" /> :
  p === 'Instagram' ? <Instagram size={size} color="#E4405F" /> : null;

const StatusPill = ({ status }) => {
  const tone = {
    Active:    { bg: '#dcfce7', fg: '#166534' },
    Paused:    { bg: '#fef3c7', fg: '#92400e' },
    Draft:     { bg: '#e2e8f0', fg: '#475569' },
    Completed: { bg: '#dbeafe', fg: '#1e40af' },
  }[status] || { bg: '#e2e8f0', fg: '#475569' };
  return (
    <span style={{display:'inline-block',padding:'3px 10px',borderRadius:999,background:tone.bg,color:tone.fg,fontSize:10,fontWeight:700,letterSpacing:'.04em',textTransform:'uppercase'}}>
      {status}
    </span>
  );
};

// ─── Post Preview pane ───────────────────────────────────────────
const PostPreview = ({ name, description, platform, setPlatform }) => {
  const previewName = name.trim() || 'Your Campaign';
  const previewBody = description.trim() || 'Your post content will appear here…';

  return (
    <div style={{background:'#f8fafc',border:'1px solid var(--border)',borderRadius:12,padding:16,minHeight:280}}>
      {/* Tabs */}
      <div style={{display:'flex',gap:0,background:'#fff',border:'1px solid var(--border)',borderRadius:10,padding:4,marginBottom:14}}>
        {['Facebook','Instagram'].map(p => (
          <button
            key={p}
            type="button"
            onClick={() => setPlatform(p)}
            style={{
              flex:1,padding:'8px 12px',borderRadius:8,border:'none',cursor:'pointer',
              background: platform === p ? '#fff' : 'transparent',
              boxShadow: platform === p ? '0 1px 2px rgba(0,0,0,.06)' : 'none',
              fontWeight:600,fontSize:12,color:platform===p?'var(--text-primary)':'var(--text-secondary)',
              display:'flex',alignItems:'center',justifyContent:'center',gap:6,
            }}
          >
            <PlatformIcon p={p} size={14}/> {p}
          </button>
        ))}
      </div>

      {/* Mock post card */}
      <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:14}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
          <div style={{width:36,height:36,borderRadius:'50%',background:'linear-gradient(135deg,#3b82f6,#1d4ed8)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:14}}>
            {previewName.substring(0,1).toUpperCase()}
          </div>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:13}}>{previewName}</div>
            <div style={{fontSize:11,color:'var(--text-tertiary)'}}>Just now · 🌍</div>
          </div>
          <MoreHorizontal size={16} color="var(--text-tertiary)"/>
        </div>
        <div style={{fontSize:13,color:'var(--text-primary)',marginBottom:12,lineHeight:1.5}}>{previewBody}</div>
        <div style={{height:140,background:'#e2e8f0',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#94a3b8',fontSize:11,marginBottom:10}}>
          Media preview
        </div>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:11,color:'var(--text-secondary)',paddingBottom:8,borderBottom:'1px solid var(--border)'}}>
          <span>👍❤ 124</span>
          <span>23 comments · 8 shares</span>
        </div>
        <div style={{display:'flex',justifyContent:'space-around',paddingTop:8}}>
          {[['Like',ThumbsUp],['Comment',MessageCircle],['Share',Share2]].map(([label, Icon]) => (
            <div key={label} style={{display:'flex',alignItems:'center',gap:6,fontSize:12,color:'var(--text-secondary)',fontWeight:600}}>
              <Icon size={14}/> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ─── Create Campaign modal ───────────────────────────────────────
const CreateCampaignModal = ({ defaultPlatforms, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('Lead Generation');
  const [budget, setBudget] = useState(5000);
  const [platforms, setPlatforms] = useState(defaultPlatforms || []);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState('Facebook');

  const togglePlatform = (p) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const canSubmit = name.trim().length > 0 && platforms.length > 0;

  const submit = () => {
    if (!canSubmit) return;
    onCreate({ name: name.trim(), description: description.trim(), objective, budget: Number(budget) || 0, platforms });
  };

  return (
    <div className="ui-overlay" onClick={onClose}>
      <div className={`ui-modal ${showPreview ? 'ui-modal-lg' : ''}`} style={{maxWidth: showPreview ? 920 : 560}} onClick={e => e.stopPropagation()}>
        <div className="ui-modal-header">
          <div>
            <h3>Create Social Media Campaign</h3>
          </div>
          <button className="ui-icon-btn" onClick={onClose} type="button"><X size={18}/></button>
        </div>
        <div className="ui-modal-body" style={{display:'grid',gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr',gap:24}}>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Campaign Name</label>
              <input
                type="text"
                placeholder="e.g., Brickell Launch"
                value={name}
                onChange={e=>setName(e.target.value)}
                style={{width:'100%',padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,fontSize:14,fontFamily:'inherit'}}
              />
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Description</label>
              <textarea
                placeholder="Campaign description…"
                value={description}
                onChange={e=>setDescription(e.target.value)}
                rows={3}
                style={{width:'100%',padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,fontSize:14,fontFamily:'inherit',resize:'vertical'}}
              />
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Objective</label>
                <select value={objective} onChange={e=>setObjective(e.target.value)} style={{width:'100%',padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,fontSize:14,background:'#fff',fontFamily:'inherit'}}>
                  {OBJECTIVES.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Budget (USD)</label>
                <input
                  type="number"
                  value={budget}
                  onChange={e=>setBudget(e.target.value)}
                  style={{width:'100%',padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,fontSize:14,fontFamily:'inherit'}}
                />
              </div>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Platforms</label>
              <div style={{display:'flex',gap:18}}>
                {['Facebook','Instagram'].map(p => (
                  <label key={p} style={{display:'flex',alignItems:'center',gap:6,fontSize:13,cursor:'pointer'}}>
                    <input type="checkbox" checked={platforms.includes(p)} onChange={()=>togglePlatform(p)}/>
                    <PlatformIcon p={p} size={14}/> {p}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label style={{fontSize:12,fontWeight:600,color:'var(--text-secondary)',display:'block',marginBottom:6}}>Media</label>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <button type="button" style={{padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,fontSize:13}}>
                  <Image size={14}/> Photos
                </button>
                <button type="button" style={{padding:'10px 12px',border:'1px solid var(--border)',borderRadius:8,background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:6,fontSize:13}}>
                  <Video size={14}/> Video
                </button>
              </div>
            </div>
          </div>

          <div style={{display:'flex',flexDirection:'column'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
              <span style={{fontSize:13,fontWeight:700}}>Post Preview</span>
              <button type="button" onClick={()=>setShowPreview(s=>!s)} style={{background:'transparent',border:'none',color:'var(--brand)',fontSize:12,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
                <Eye size={13}/> {showPreview ? 'Hide Preview' : 'Show Preview'}
              </button>
            </div>
            {showPreview && (
              <PostPreview
                name={name}
                description={description}
                platform={previewPlatform}
                setPlatform={setPreviewPlatform}
              />
            )}
            {!showPreview && (
              <div style={{display:'none'}}/>
            )}
          </div>
        </div>
        <div className="ui-modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={submit}
            disabled={!canSubmit}
            style={{opacity: canSubmit ? 1 : .5, cursor: canSubmit ? 'pointer' : 'not-allowed'}}
          >
            Create Campaign
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main page ───────────────────────────────────────────────────
export const CrmCampaigns = () => {
  const { personaKey, toast, writeAudit } = useApp();
  const [campaigns, setCampaigns] = useState(SEED_CAMPAIGNS);
  const [tab, setTab] = useState('All');
  const [query, setQuery] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [createPlatforms, setCreatePlatforms] = useState([]);

  // Hard-block any non-marketing persona that reaches this URL directly.
  if (!canSeeCampaigns(personaKey)) {
    return (
      <div style={{padding:'48px 24px',textAlign:'center'}}>
        <Megaphone size={36} color="var(--text-tertiary)" style={{marginBottom:12}}/>
        <h2 style={{fontSize:18,fontWeight:700,color:'var(--text-primary)'}}>Campaigns are restricted to the Marketing role</h2>
        <p style={{fontSize:13,color:'var(--text-secondary)',marginTop:6}}>This module is exclusive to marketing@homesbrokerage.eg.</p>
      </div>
    );
  }

  const filtered = useMemo(() => campaigns.filter(c =>
    (tab === 'All' || c.status === tab) &&
    (query === '' || c.name.toLowerCase().includes(query.toLowerCase()))
  ), [campaigns, tab, query]);

  const totals = useMemo(() => ({
    count: campaigns.length,
    leads: campaigns.reduce((s,c)=>s+c.leads,0),
    impressions: campaigns.reduce((s,c)=>s+c.impressions,0),
    spend: campaigns.reduce((s,c)=>s+c.spend,0),
  }), [campaigns]);

  const openCreate = (platforms) => {
    setCreatePlatforms(platforms || []);
    setCreateOpen(true);
  };

  const create = (data) => {
    const id = `CMP-${String(100 + campaigns.length + 1).padStart(3,'0')}`;
    const next = { id, ...data, status: 'Draft', spend: 0, leads: 0, impressions: 0, ctr: 0, auto: false, durationDays: null };
    setCampaigns(prev => [next, ...prev]);
    writeAudit('Campaign created', `${id} · ${data.name}`, 'Campaigns', `Platforms: ${data.platforms.join(', ')}, Budget: $${data.budget}`);
    toast(`Campaign "${data.name}" saved as Draft`,'success');
    setCreateOpen(false);
  };

  const togglePause = (c) => {
    const next = c.status === 'Active' ? 'Paused' : 'Active';
    setCampaigns(prev => prev.map(x => x.id===c.id ? {...x, status: next} : x));
    writeAudit(`Campaign ${next === 'Active' ? 'resumed' : 'paused'}`, `${c.id} · ${c.name}`, 'Campaigns');
    toast(`${c.name} → ${next}`, next==='Active'?'success':'info');
  };

  const publish = (c) => {
    setCampaigns(prev => prev.map(x => x.id===c.id ? {...x, status: 'Active'} : x));
    writeAudit('Campaign published', `${c.id} · ${c.name}`, 'Campaigns');
    toast(`${c.name} is now Active`,'success');
  };

  return (
    <div>
      {/* Header */}
      <div style={{marginBottom:18}}>
        <h1 style={{fontSize:24,fontWeight:800}}>Social Campaigns</h1>
        <p style={{color:'var(--text-secondary)',marginTop:4,fontSize:13}}>Manage your social media and ad campaigns</p>
      </div>

      {/* KPI strip */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:18}}>
        {[
          ['Total Campaigns', totals.count, '#16a34a', Megaphone],
          ['Leads Generated', totals.leads, '#3b82f6', Users],
          ['Impressions',     totals.impressions.toLocaleString(), '#8b5cf6', Eye],
          ['Total Spent',     `$${totals.spend.toLocaleString()}`, '#f59e0b', DollarSign],
        ].map(([label, value, color, Icon]) => (
          <div key={label} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:'14px 18px',display:'flex',alignItems:'center',gap:14}}>
            <div style={{width:38,height:38,borderRadius:10,background:`${color}1a`,color,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Icon size={18}/>
            </div>
            <div>
              <div style={{fontSize:11,fontWeight:700,color:'var(--text-secondary)',textTransform:'uppercase',letterSpacing:'.05em'}}>{label}</div>
              <div style={{fontSize:22,fontWeight:800,marginTop:2}}>{value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab strip */}
      <div style={{display:'flex',gap:6,marginBottom:14,flexWrap:'wrap'}}>
        {STATUS_TABS.map(s => (
          <button
            key={s}
            onClick={()=>setTab(s)}
            style={{
              padding:'7px 14px',borderRadius:6,border:'none',cursor:'pointer',
              background: tab === s ? 'var(--brand)' : '#fff',
              color: tab === s ? '#fff' : 'var(--text-primary)',
              fontWeight:600,fontSize:12,
              border: tab === s ? '1px solid var(--brand)' : '1px solid var(--border)',
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Filter row — auto-search input + direct New Campaign button */}
      <div style={{display:'flex',gap:10,marginBottom:18,alignItems:'center',flexWrap:'wrap'}}>
        <input
          placeholder="Search campaigns…"
          value={query}
          onChange={e=>setQuery(e.target.value)}
          style={{padding:'9px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,flex:1,maxWidth:380,fontFamily:'inherit'}}
        />
        <button
          onClick={() => openCreate([])}
          style={{display:'flex',alignItems:'center',gap:6,background:'#16a34a',color:'#fff',border:'none',padding:'9px 16px',borderRadius:8,fontSize:13,fontWeight:700,cursor:'pointer',marginLeft:'auto'}}
        >
          <Plus size={14}/> New Campaign
        </button>
      </div>

      {/* Campaign cards grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))',gap:14}}>
        {filtered.map(c => (
          <div key={c.id} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:12,padding:16,display:'flex',flexDirection:'column',gap:12}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:6,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{c.name}</div>
                <div style={{display:'flex',alignItems:'center',gap:8,flexWrap:'wrap'}}>
                  <StatusPill status={c.status}/>
                  <div style={{display:'flex',gap:6,alignItems:'center'}}>
                    {c.platforms.map(p => <PlatformIcon key={p} p={p} size={14}/>)}
                  </div>
                </div>
              </div>
              <button style={{background:'transparent',border:'none',cursor:'pointer',color:'var(--text-tertiary)'}}>
                <MoreHorizontal size={16}/>
              </button>
            </div>

            {c.auto && (
              <div style={{fontSize:11,color:'var(--text-secondary)',background:'#f1f5f9',padding:'6px 10px',borderRadius:6,lineHeight:1.4}}>
                Auto-created from PPCPL wizard.<br/>
                Budget ${c.budget}/mo, Duration {c.durationDays} days.
              </div>
            )}

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,padding:'10px 0',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:11,color:'var(--text-secondary)',fontWeight:600}}>Leads</div>
                <div style={{fontSize:18,fontWeight:800,marginTop:2}}>{c.leads}</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:11,color:'var(--text-secondary)',fontWeight:600}}>Impressions</div>
                <div style={{fontSize:18,fontWeight:800,marginTop:2}}>{c.impressions}</div>
              </div>
              <div style={{textAlign:'center'}}>
                <div style={{fontSize:11,color:'var(--text-secondary)',fontWeight:600}}>CTR</div>
                <div style={{fontSize:18,fontWeight:800,marginTop:2}}>{c.ctr.toFixed(2)}%</div>
              </div>
            </div>

            {c.budget > 0 && (
              <div>
                <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'var(--text-secondary)',marginBottom:4}}>
                  <span>Budget</span>
                  <span>${c.spend} / ${c.budget} USD</span>
                </div>
                <div style={{height:5,background:'#f1f5f9',borderRadius:3,overflow:'hidden'}}>
                  <div style={{width:`${Math.min(100,(c.spend/c.budget)*100)}%`,height:'100%',background:'#16a34a'}}/>
                </div>
              </div>
            )}

            <div style={{display:'flex',justifyContent:'flex-end'}}>
              {c.status === 'Active' && (
                <button onClick={()=>togglePause(c)} style={{display:'flex',alignItems:'center',gap:6,background:'transparent',border:'1px solid var(--border)',padding:'7px 12px',borderRadius:6,fontSize:12,fontWeight:600,cursor:'pointer',color:'var(--text-secondary)'}}>
                  <Pause size={12}/> Pause
                </button>
              )}
              {c.status === 'Paused' && (
                <button onClick={()=>togglePause(c)} style={{display:'flex',alignItems:'center',gap:6,background:'transparent',border:'1px solid var(--border)',padding:'7px 12px',borderRadius:6,fontSize:12,fontWeight:600,cursor:'pointer',color:'var(--text-secondary)'}}>
                  <Play size={12}/> Resume
                </button>
              )}
              {c.status === 'Draft' && (
                <button onClick={()=>publish(c)} style={{display:'flex',alignItems:'center',gap:6,background:'transparent',border:'none',padding:'7px 12px',fontSize:12,fontWeight:700,cursor:'pointer',color:'#16a34a'}}>
                  <Send size={12}/> Publish
                </button>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div style={{gridColumn:'1 / -1',textAlign:'center',padding:'48px 24px',color:'var(--text-tertiary)'}}>
            <Megaphone size={32} style={{marginBottom:8}}/>
            <div style={{fontSize:14,fontWeight:600}}>No campaigns match your filters.</div>
          </div>
        )}
      </div>

      {createOpen && (
        <CreateCampaignModal
          defaultPlatforms={createPlatforms}
          onClose={()=>setCreateOpen(false)}
          onCreate={create}
        />
      )}
    </div>
  );
};
