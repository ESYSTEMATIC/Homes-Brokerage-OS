import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, Building2, Home as HomeIcon, DollarSign, BedDouble,
  ArrowRight, ArrowLeft, MapPin, Bath, Maximize2, Phone, Heart, GitCompare,
  Tag, Calculator, ChevronRight, Newspaper, Calendar,
} from 'lucide-react';
import {
  PM_AREAS, PM_FEATURED, PM_SERVICES, PM_POPULAR_READS,
  PM_PROPERTY_TYPES, PM_PROPERTY_SUBS, PM_PRICE_BANDS, PM_BEDS_OPTIONS, PM_BATHS_OPTIONS,
} from '../../data/publicMarketplaceData';

// Reusable dropdown filter — opens a popover on click, closes on outside click.
const FilterDropdown = ({ icon: Icon, label, value, children, width = 240 }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div className="pm-filter-wrap" ref={ref}>
      <button className={`pm-filter ${open ? 'open' : ''}`} type="button" onClick={() => setOpen(o => !o)}>
        <Icon size={14} /> {value || label} <ChevronDown size={12} />
      </button>
      {open && (
        <div className="pm-filter-pop" style={{ width }}>
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
        </div>
      )}
    </div>
  );
};

const SimpleList = ({ options, value, onChange, close }) => (
  <div className="pm-filter-list">
    {options.map(o => (
      <button
        key={o}
        type="button"
        className={`pm-filter-list-item ${value === o ? 'active' : ''}`}
        onClick={() => { onChange(o); close(); }}
      >
        {o}
      </button>
    ))}
  </div>
);

const ServiceIcon = ({ name }) => {
  const map = { home: HomeIcon, tag: Tag, calc: Calculator };
  const I = map[name] || HomeIcon;
  return <I size={26} />;
};

export const Home = () => {
  const navigate = useNavigate();

  // Search-bar state
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [sub, setSub] = useState('');
  const [price, setPrice] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');

  // Carousel state
  const [carouselIx, setCarouselIx] = useState(0);
  const featured = PM_FEATURED;
  const visible = 3;
  const maxIx = Math.max(0, featured.length - visible);
  const next = () => setCarouselIx(i => Math.min(maxIx, i + 1));
  const prev = () => setCarouselIx(i => Math.max(0, i - 1));

  const submitSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (type && type !== 'All') params.set('type', type);
    if (sub) params.set('sub', sub);
    if (price && price !== 'Any') params.set('price', price);
    if (beds) params.set('beds', beds);
    if (baths) params.set('baths', baths);
    const qs = params.toString();
    navigate(`/marketplace/buy${qs ? `?${qs}` : ''}`);
  };

  const onTour = (l) => {
    window.alert(`Tour requested for ${l.compound} (MLS ${l.id}). A specialist will contact you within 24 hours.`);
  };

  return (
    <>
      {/* ─────── Hero: full-width blog banner (100%) with the search card
                  overlaid on top of the image. No text overlay competes
                  with the artwork. ─────── */}
      <section className="pm-hero pm-hero-banner">
        <img
          src="https://blog.homes.com.eg/wp-content/uploads/2026/03/Homes-Banners2.webp"
          alt="Homes — Swipe To Your Next Home"
          className="pm-hero-banner-img"
        />
        <div className="pm-search-card pm-search-card-on-banner" onKeyDown={e => { if (e.key === 'Enter') submitSearch(); }}>
          <div className="pm-search-row">
            <div className="pm-search-input">
              <Search size={16} color="#9ca3af" />
              <input
                placeholder="Search by compound, city region, or MLS ID…"
                value={q}
                onChange={e => setQ(e.target.value)}
              />
            </div>
            <button className="pm-advanced" type="button" onClick={() => navigate('/marketplace/buy')}>⚙ Advanced</button>
          </div>
          <div className="pm-filters-row">
            <FilterDropdown icon={Building2} label="Properties type" value={type}>
              {({ close }) => <SimpleList options={PM_PROPERTY_TYPES} value={type} onChange={setType} close={close} />}
            </FilterDropdown>
            <FilterDropdown icon={HomeIcon} label="Sub Types" value={sub}>
              {({ close }) => <SimpleList options={PM_PROPERTY_SUBS} value={sub} onChange={setSub} close={close} />}
            </FilterDropdown>
            <FilterDropdown icon={DollarSign} label="Price" value={price} width={220}>
              {({ close }) => <SimpleList options={PM_PRICE_BANDS} value={price} onChange={setPrice} close={close} />}
            </FilterDropdown>
            <FilterDropdown icon={BedDouble} label="Beds & Baths" value={beds || baths ? `${beds || 'Any'} / ${baths || 'Any'}` : ''} width={280}>
              {({ close }) => (
                <div style={{ padding: 14 }}>
                  <div className="pm-pop-label">Bedrooms</div>
                  <div className="pm-pop-pillrow">
                    {PM_BEDS_OPTIONS.map(b => (
                      <button key={b} type="button" className={`pm-pop-pill ${beds === b ? 'active' : ''}`} onClick={() => setBeds(b)}>{b}</button>
                    ))}
                  </div>
                  <div className="pm-pop-label" style={{ marginTop: 14 }}>Bathrooms</div>
                  <div className="pm-pop-pillrow">
                    {PM_BATHS_OPTIONS.map(b => (
                      <button key={b} type="button" className={`pm-pop-pill ${baths === b ? 'active' : ''}`} onClick={() => setBaths(b)}>{b}</button>
                    ))}
                  </div>
                  <div className="pm-pop-actions">
                    <button type="button" className="pm-pop-clear" onClick={() => { setBeds(''); setBaths(''); }}>Clear</button>
                    <button type="button" className="pm-pop-apply" onClick={close}>Apply</button>
                  </div>
                </div>
              )}
            </FilterDropdown>
            <button className="pm-search-btn" type="button" onClick={submitSearch}>
              <Search size={14} /> Search
            </button>
          </div>
        </div>

        <button
          className="pm-scroll-hint"
          type="button"
          onClick={() => document.getElementById('pm-services')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Scroll<span className="arrow">⌄</span>
        </button>
      </section>

      {/* ─────── Service cards ─────── */}
      <section className="pm-services" id="pm-services">
        <div className="pm-services-inner">
          <h2>How can Homes help you?</h2>
          <p className="lead">Three ways to make your next move — buy with confidence, list with reach, plan with clarity.</p>
          <div className="pm-service-grid">
            {PM_SERVICES.map(s => (
              <div key={s.title} className="pm-service-card">
                <div className="pm-service-icon"><ServiceIcon name={s.icon} /></div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <button type="button" className="pm-service-cta" onClick={() => navigate(s.to)}>
                  {s.cta} <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── Featured Properties carousel ─────── */}
      <section className="pm-featured">
        <div className="pm-featured-head">
          <div>
            <h2>Featured Properties</h2>
            <p className="lead">Hand-picked listings from across Egypt's most loved compounds.</p>
          </div>
          <div className="pm-featured-arrows">
            <button type="button" className="pm-arrow" onClick={prev} disabled={carouselIx === 0} aria-label="Previous"><ArrowLeft size={14}/></button>
            <button type="button" className="pm-arrow" onClick={next} disabled={carouselIx === maxIx} aria-label="Next"><ArrowRight size={14}/></button>
          </div>
        </div>
        <div className="pm-featured-viewport">
          <div className="pm-featured-track" style={{ transform: `translateX(calc(-${carouselIx} * (33.333% + 12px)))` }}>
            {featured.map(l => (
              <article key={l.id} className="pm-feat-card">
                <div className="pm-feat-img" style={{ backgroundImage: `url(${l.img})` }}>
                  <div className="pm-feat-img-actions">
                    <button type="button" title="Compare" onClick={() => window.alert(`Added ${l.id} to comparison`)}><GitCompare size={13}/></button>
                    <button type="button" title="Favorite" onClick={() => window.alert(`Saved ${l.id} to favorites`)}><Heart size={13}/></button>
                  </div>
                  <div className="pm-feat-img-tag">Featured</div>
                </div>
                <div className="pm-feat-body">
                  <div className="pm-feat-price">EGP {l.price}</div>
                  <div className="pm-feat-meta">
                    <span><BedDouble size={12}/> {l.beds} Beds</span>
                    <span><Bath size={12}/> {l.baths} Baths</span>
                    <span><Maximize2 size={12}/> {l.sqft.toLocaleString()} m²</span>
                  </div>
                  <div className="pm-feat-loc"><MapPin size={11}/> {l.compound}</div>
                  <div className="pm-feat-foot">
                    <span className="pm-feat-mls">MLS: {l.id}</span>
                    <button type="button" className="pm-feat-cta" onClick={() => onTour(l)}>Schedule a Tour</button>
                    <button type="button" className="pm-feat-call" title="Call agent" onClick={() => window.alert('Calling agent (demo): +20 122 544 4440')}><Phone size={13}/></button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="pm-featured-foot">
          <button type="button" className="pm-btn-outline" onClick={() => navigate('/marketplace/buy')}>
            View all properties <ArrowRight size={12}/>
          </button>
        </div>
      </section>

      {/* ─────── Explore by Areas ─────── */}
      <section className="pm-section tight" style={{ background: '#fafbfc', borderRadius: 16, margin: '28px auto 40px', maxWidth: 1280 }}>
        <h2>Explore by Areas<span className="underline-mark"></span></h2>
        <p className="lead">Browse properties by areas, compounds, developers, and trending searches.</p>
        <div className="pm-area-grid">
          {PM_AREAS.map(area => (
            <button
              key={area}
              type="button"
              className="pm-area-pill"
              onClick={() => navigate(`/marketplace/buy?area=${encodeURIComponent(area)}`)}
            >
              {area} <ArrowRight size={12} className="arrow" />
            </button>
          ))}
        </div>
      </section>

      {/* ─────── Popular Reads (blog inspiration) ─────── */}
      <section className="pm-section tight" id="pm-popular">
        <div className="pm-popular-head">
          <div>
            <span className="pm-popular-eyebrow"><Newspaper size={13}/> From the Homes Blog</span>
            <h2 style={{ textAlign: 'left' }}>Popular Reads</h2>
            <p className="lead" style={{ textAlign: 'left', marginLeft: 0 }}>
              Compound deep-dives, lifestyle guides, and market notes from the Homes editorial desk.
            </p>
          </div>
          <button type="button" className="pm-btn-outline" onClick={() => window.alert('Full blog opens at blog.homes.com.eg (demo)')}>
            Visit Blog <ChevronRight size={12}/>
          </button>
        </div>
        <div className="pm-popular-grid">
          {PM_POPULAR_READS.map(p => (
            <article key={p.id} className="pm-popular-card">
              <div className="pm-popular-img" style={{ backgroundImage: `url(${p.img})` }}>
                <span className="pm-popular-cat">{p.category}</span>
              </div>
              <div className="pm-popular-body">
                <div className="pm-popular-meta"><Calendar size={11}/> {p.date} · {p.author}</div>
                <h4>{p.title}</h4>
                <p>{p.excerpt}</p>
                <button type="button" className="pm-popular-link" onClick={() => window.alert(`Open article: ${p.title}`)}>
                  Read More <ArrowRight size={12}/>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};
