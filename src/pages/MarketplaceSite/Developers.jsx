import { useMemo, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Search, Building2, MapPin, ArrowRight, ExternalLink, Phone, Mail, Globe2,
  ChevronLeft, BedDouble, Bath, Maximize2,
} from 'lucide-react';
import { MP_DEVELOPERS } from '../../data/marketplaceData';
import { PM_LISTINGS } from '../../data/publicMarketplaceData';
import { Breadcrumb } from '../../components/Breadcrumb';

const fmtEgp = (n) => new Intl.NumberFormat('en-EG').format(n);
const fmtMillions = (n) => `EGP ${(n / 1_000_000).toFixed(n >= 1_000_000 ? 1 : 2)}M`;

// ─── Developer Directory ───────────────────────────────────────
export const Developers = () => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return MP_DEVELOPERS;
    return MP_DEVELOPERS.filter(d =>
      d.name.toLowerCase().includes(needle) ||
      d.mlsId?.toLowerCase().includes(needle) ||
      d.tagline?.toLowerCase().includes(needle)
    );
  }, [q]);

  return (
    <div className="pm-developers">
      <header className="pm-developers-head">
        <Breadcrumb items={[{ label: 'Developers' }]} />
        <h1>Developers in Egypt</h1>
        <div className="pm-developers-sub">{MP_DEVELOPERS.length.toLocaleString()} verified developers · listed on Homes</div>
      </header>

      <div className="pm-developers-toolbar">
        <div className="pm-search-bar" style={{ flex: 1, padding: '0 18px', minHeight: 52 }}>
          <Search size={16} color="#9ca3af" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by developer name or MLS ID…" />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="pm-empty"><strong>No developers match your search</strong><p>Try a different name or clear the search.</p></div>
      ) : (
        <div className="pm-developers-grid">
          {filtered.map(d => (
            <article key={d.id} className="pm-dev-card" onClick={() => navigate(`/marketplace/developers/${d.slug}`)}>
              <div className="pm-dev-cover" style={{ backgroundImage: d.cover ? `url(${d.cover})` : undefined }}>
                <div className="pm-dev-logo" style={{ background: `linear-gradient(135deg, ${d.color1 || '#0f172a'}, ${d.color2 || '#334155'})` }}>
                  {d.initials || d.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
                </div>
              </div>
              <div className="pm-dev-body">
                <div className="pm-dev-titlebar">
                  <h3>{d.name}</h3>
                  <span className="pm-dev-mls">MLS {d.mlsId}</span>
                </div>
                <p className="pm-dev-tag">{d.tagline}</p>
                <div className="pm-dev-stats">
                  <div><strong>{d.projects}</strong><span>Projects</span></div>
                  <div><strong>{d.units}</strong><span>Units</span></div>
                  <div><strong>{fmtMillions(d.priceMin)}</strong><span>From</span></div>
                </div>
                <div className="pm-dev-foot">
                  <div className="pm-dev-govs">
                    {(d.governorates || []).map(g => <span key={g} className="pm-dev-gov">{g}</span>)}
                  </div>
                  <span className="pm-dev-cta">View Portfolio <ArrowRight size={12}/></span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Developer Detail ──────────────────────────────────────────
export const DeveloperDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dev = useMemo(() => MP_DEVELOPERS.find(d => d.slug === slug), [slug]);
  const [tab, setTab] = useState('about');

  if (!dev) {
    return (
      <div className="pm-developers" style={{ textAlign: 'center', padding: '80px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Developer not found</h1>
        <p style={{ color: '#6b7280', marginTop: 8 }}>"{slug}" doesn't match any developer in our directory.</p>
        <button type="button" className="pm-btn-primary" style={{ marginTop: 18 }} onClick={() => navigate('/marketplace/developers')}>Back to directory</button>
      </div>
    );
  }

  // Match listings owned by this developer (case-insensitive name match).
  const linkedListings = PM_LISTINGS.filter(l =>
    (l.developer || '').toLowerCase() === dev.name.toLowerCase() ||
    dev.name.toLowerCase().includes((l.developer || '').toLowerCase().split(' ')[0])
  ).slice(0, 6);

  const tabs = [
    { id: 'about',     label: 'About' },
    { id: 'projects',  label: `Projects (${dev.projectsList?.length || 0})` },
    { id: 'units',     label: `Available Units (${linkedListings.length})` },
    { id: 'contact',   label: 'Contact' },
  ];

  return (
    <div className="pm-developer-detail">
      {/* Hero */}
      <div className="pm-dev-hero" style={{ backgroundImage: dev.cover ? `url(${dev.cover})` : undefined }}>
        <div className="pm-dev-hero-overlay" />
        <div className="pm-dev-hero-inner">
          <Breadcrumb
            homeTo="/marketplace"
            items={[
              { label: 'Developers', to: '/marketplace/developers' },
              { label: dev.name },
            ]}
          />
          <div className="pm-dev-hero-card">
            <div className="pm-dev-hero-logo" style={{ background: `linear-gradient(135deg, ${dev.color1 || '#0f172a'}, ${dev.color2 || '#334155'})` }}>
              {dev.initials || dev.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()}
            </div>
            <div className="pm-dev-hero-meat">
              <h1>{dev.name}</h1>
              <p className="pm-dev-hero-tag">{dev.tagline}</p>
              <div className="pm-dev-hero-meta">
                <span><strong>MLS</strong> {dev.mlsId}</span>
                <span>·</span>
                <span>{(dev.governorates || []).join(' · ')}</span>
              </div>
            </div>
            <div className="pm-dev-hero-stats">
              <div><strong>{dev.projects}</strong><span>Projects</span></div>
              <div><strong>{dev.units}</strong><span>Units</span></div>
              <div><strong>{fmtMillions(dev.priceMin)}</strong><span>From</span></div>
              <div><strong>{fmtMillions(dev.priceMax)}</strong><span>Up to</span></div>
            </div>
          </div>
        </div>
      </div>

      <div className="pm-dev-body">
        {/* Tabs */}
        <nav className="pm-dev-tabs" role="tablist">
          {tabs.map(t => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>

        <div className="pm-dev-tab-body">
          {tab === 'about' && (
            <section className="pm-dev-section pm-dev-about">
              <h2>About {dev.name}</h2>
              <p>{dev.description}</p>
              <div className="pm-dev-about-grid">
                <div><div className="lbl">Type</div><div className="val" style={{textTransform:'capitalize'}}>{dev.type}</div></div>
                <div><div className="lbl">MLS ID</div><div className="val mono">{dev.mlsId}</div></div>
                <div><div className="lbl">Governorates</div><div className="val">{(dev.governorates || []).join(', ')}</div></div>
                <div><div className="lbl">Active Projects</div><div className="val">{dev.projects}</div></div>
                <div><div className="lbl">Available Units</div><div className="val">{dev.units}</div></div>
                <div><div className="lbl">Price Range</div><div className="val">{fmtMillions(dev.priceMin)} – {fmtMillions(dev.priceMax)}</div></div>
              </div>
            </section>
          )}

          {tab === 'projects' && (
            <section className="pm-dev-section">
              <h2>Projects by {dev.name}</h2>
              {dev.projectsList?.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No projects listed yet.</p>
              ) : (
                <div className="pm-dev-project-grid">
                  {dev.projectsList.map(p => (
                    <article key={p.id} className="pm-dev-project-card" onClick={() => navigate(`/marketplace/buy?developer=${encodeURIComponent(dev.name)}`)}>
                      <div className="pm-dev-project-img" style={{ backgroundImage: `url(${p.image})` }} />
                      <div className="pm-dev-project-body">
                        <h4>{p.name}</h4>
                        <div className="city"><MapPin size={11}/> {p.city}</div>
                        <div className="meta">
                          <div><div className="lbl">Starting from</div><div className="val">{fmtMillions(p.startPrice)}</div></div>
                          <div><div className="lbl">Properties</div><div className="val">{p.propertiesCount}</div></div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          )}

          {tab === 'units' && (
            <section className="pm-dev-section">
              <h2>Available Units from {dev.name}</h2>
              {linkedListings.length === 0 ? (
                <p style={{ color: '#6b7280' }}>No listings published yet for {dev.name}.</p>
              ) : (
                <>
                  <div className="pm-buy-cards-grid">
                    {linkedListings.map(l => (
                      <article key={l.id} className="pm-card pm-buy-card" onClick={() => navigate(`/marketplace/listings/${l.id}`)}>
                        <div className="pm-card-img" style={{ backgroundImage: `url(${l.img})` }} />
                        <div className="pm-card-body">
                          <div className="pm-card-price">EGP {l.price}</div>
                          <div className="pm-card-meta">
                            <span><BedDouble size={12}/> {l.beds} Beds</span>
                            <span><Bath size={12}/> {l.baths} Baths</span>
                            <span><Maximize2 size={12}/> {l.sqft.toLocaleString()} m²</span>
                          </div>
                          <div className="pm-card-loc"><MapPin size={11}/> {l.city}, {l.compound}</div>
                        </div>
                      </article>
                    ))}
                  </div>
                  <div style={{ textAlign: 'center', marginTop: 18 }}>
                    <button type="button" className="pm-btn-primary" onClick={() => navigate(`/marketplace/buy?developer=${encodeURIComponent(dev.name)}`)}>
                      View all {dev.name} listings <ArrowRight size={14}/>
                    </button>
                  </div>
                </>
              )}
            </section>
          )}

          {tab === 'contact' && (
            <section className="pm-dev-section">
              <h2>Contact {dev.name}</h2>
              <div className="pm-dev-contact-grid">
                {dev.contact?.phone && (
                  <a className="pm-dev-contact-card" href={`tel:${dev.contact.phone.replace(/\s/g, '')}`}>
                    <div className="ico"><Phone size={16}/></div>
                    <div><div className="lbl">Phone</div><div className="val">{dev.contact.phone}</div></div>
                  </a>
                )}
                {dev.contact?.email && (
                  <a className="pm-dev-contact-card" href={`mailto:${dev.contact.email}`}>
                    <div className="ico"><Mail size={16}/></div>
                    <div><div className="lbl">Email</div><div className="val">{dev.contact.email}</div></div>
                  </a>
                )}
                {dev.contact?.website && (
                  <a className="pm-dev-contact-card" href={`https://${dev.contact.website}`} target="_blank" rel="noopener noreferrer">
                    <div className="ico"><Globe2 size={16}/></div>
                    <div><div className="lbl">Website</div><div className="val">{dev.contact.website} <ExternalLink size={11}/></div></div>
                  </a>
                )}
              </div>
              <div style={{ marginTop: 24 }}>
                <button type="button" className="pm-btn-primary" onClick={() => navigate(`/marketplace/buy?developer=${encodeURIComponent(dev.name)}`)}>
                  See available units <ArrowRight size={14}/>
                </button>
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
