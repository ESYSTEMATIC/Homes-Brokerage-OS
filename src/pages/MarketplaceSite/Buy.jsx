import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, ArrowDownUp, Heart, Bookmark, GitCompare, Phone,
  MapPin, BedDouble, Bath, Maximize2, ChevronLeft, ChevronRight,
  Map as MapIcon, List as ListIcon, X, Trash2, Save,
} from 'lucide-react';
import {
  PM_LISTINGS, PM_PRICE_BANDS, PM_BEDS_OPTIONS, PM_BATHS_OPTIONS,
  PM_PROPERTY_SUBS, PM_PROPERTY_TYPES,
} from '../../data/publicMarketplaceData';
import {
  useMarketplaceStore, toggleFavorite, toggleCompare,
  addSavedSearch, removeSavedSearch, COMPARE_MAX,
} from '../../data/marketplaceStore';
import { buildWhatsAppUrl, onWhatsApp, onPhoneCall, phoneLink } from '../../data/marketplaceCta';
import { Breadcrumb } from '../../components/Breadcrumb';

const PAGE_SIZE = 6;

// ─── URL-state helpers ──────────────────────────────────────────
const FILTER_KEYS = ['q', 'type', 'sub', 'price', 'beds', 'baths', 'area', 'developer', 'page', 'sort', 'view'];
const readFilters = (search) => {
  const p = new URLSearchParams(search);
  const out = {};
  FILTER_KEYS.forEach(k => { const v = p.get(k); if (v) out[k] = v; });
  return out;
};
const writeFilters = (filters) => {
  const p = new URLSearchParams();
  Object.entries(filters).forEach(([k, v]) => { if (v !== '' && v != null && v !== 'all' && v !== 'All') p.set(k, v); });
  return p.toString();
};

// ─── Filter helpers ─────────────────────────────────────────────
const parsePriceMillions = (p) => parseFloat((p || '0').toString().replace(/[^\d.]/g, '')) || 0;
const matchPriceBand = (band, priceM) => {
  if (!band || band === 'Any') return true;
  if (band === 'Under 3M EGP')   return priceM < 3;
  if (band === '3M – 6M EGP')    return priceM >= 3 && priceM < 6;
  if (band === '6M – 10M EGP')   return priceM >= 6 && priceM < 10;
  if (band === '10M – 20M EGP')  return priceM >= 10 && priceM < 20;
  if (band === '20M+ EGP')       return priceM >= 20;
  return true;
};
const matchMinNumber = (opt, n) => !opt ? true : n >= parseInt(opt, 10);

// ─── Reusable filter pill with popover ──────────────────────────
const FilterPill = ({ label, value, children, onClear }) => {
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
      <button type="button" className={`pm-filter-pill ${open ? 'open' : ''} ${value ? 'has-value' : ''}`} onClick={() => setOpen(o => !o)}>
        {value ? <strong>{value}</strong> : label} <ChevronDown size={12} />
      </button>
      {open && (
        <div className="pm-filter-pop" style={{ width: 240, padding: 8 }}>
          {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
          {onClear && value && (
            <button type="button" className="pm-filter-list-item" style={{borderTop:'1px solid #f1f3f5',marginTop:4,color:'#b91c1c'}} onClick={() => { onClear(); setOpen(false); }}>
              Clear {label}
            </button>
          )}
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
      >{o}</button>
    ))}
  </div>
);

// ─── Leaflet hook (Google tiles) — emits bounds back to caller ──
const useLeafletMap = (containerRef, listings, onBoundsChange, onMarker) => {
  const mapRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled || !window.L || !containerRef.current || mapRef.current) return;
      const map = window.L.map(containerRef.current, { center: [30.05, 31.45], zoom: 6, zoomControl: true, scrollWheelZoom: false });
      window.L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20, subdomains: ['mt0','mt1','mt2','mt3'], attribution: '© Google',
      }).addTo(map);
      map.on('moveend', () => onBoundsChange?.(map.getBounds()));
      mapRef.current = { map, markers: [] };
    };
    if (window.L) { init(); }
    else if (!document.getElementById('leaflet-css')) {
      const css = document.createElement('link');
      css.id = 'leaflet-css'; css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      const js = document.createElement('script');
      js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      js.async = true; js.onload = init;
      document.body.appendChild(js);
    } else {
      const wait = setInterval(() => { if (window.L) { clearInterval(wait); init(); } }, 80);
      return () => clearInterval(wait);
    }
    return () => { cancelled = true; };
  }, [containerRef, onBoundsChange]);

  useEffect(() => {
    const ref = mapRef.current;
    if (!ref) return;
    ref.markers.forEach(m => m.remove());
    ref.markers = listings.map(l => {
      const html = `<div class="pm-map-pin">${l.price}M</div>`;
      const icon = window.L.divIcon({ className: 'pm-map-pin-wrap', html, iconSize: [56, 26], iconAnchor: [28, 13] });
      const m = window.L.marker([l.lat, l.lng], { icon })
        .addTo(ref.map)
        .bindPopup(`<strong>${l.compound}</strong><br/>EGP ${l.price}M · ${l.beds} bd · ${l.baths} ba<br/><a href="#/marketplace/listings/${l.id}">View MLS ${l.id}</a>`);
      m.on('click', () => onMarker?.(l));
      return m;
    });
    if (listings.length && !mapRef.current.fittedOnce) {
      ref.map.fitBounds(window.L.latLngBounds(listings.map(l => [l.lat, l.lng])).pad(0.2), { animate: false });
      mapRef.current.fittedOnce = true;
    }
  }, [listings, onMarker]);
};

// ─── Sort options ───────────────────────────────────────────────
const SORTS = {
  'newest':       { label: 'Newest first',     fn: (a, b) => b.id.localeCompare(a.id) },
  'price-asc':    { label: 'Price ↑',          fn: (a, b) => parsePriceMillions(a.price) - parsePriceMillions(b.price) },
  'price-desc':   { label: 'Price ↓',          fn: (a, b) => parsePriceMillions(b.price) - parsePriceMillions(a.price) },
  'sqft-desc':    { label: 'Largest area first', fn: (a, b) => b.sqft - a.sqft },
};

export const Buy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const f = readFilters(location.search);
  const store = useMarketplaceStore();

  const [view, setView] = useState(f.view === 'list' || f.view === 'map' ? f.view : 'map');
  // Re-sync local view state when the URL changes (e.g., programmatic navigation
  // from a CTA on Home, Find, or a saved-search "Run" button). Without this,
  // the page stays in its initial-mounted view even after the URL switches
  // to ?view=favorites/compare/saved or back to map.
  useEffect(() => {
    const next = f.view === 'list' || f.view === 'map' ? f.view : 'map';
    if (next !== view) setView(next);
  }, [f.view]); // eslint-disable-line react-hooks/exhaustive-deps
  const [bounds, setBounds] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sortRef = useRef(null);

  // Close sort menu on outside click + Escape.
  useEffect(() => {
    if (!showSortMenu) return;
    const onDoc = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setShowSortMenu(false); };
    const onKey = (e) => { if (e.key === 'Escape') setShowSortMenu(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [showSortMenu]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveLabel, setSaveLabel] = useState('');

  // Special "view" modes — favorites / compare / saved-searches
  const specialView = f.view === 'favorites' || f.view === 'compare' || f.view === 'saved' ? f.view : null;

  // Update URL when filters change (single source of truth).
  const setFilter = useCallback((patch) => {
    const next = { ...f, ...patch };
    // Reset page on filter change unless caller is explicitly setting page.
    if (!('page' in patch)) delete next.page;
    const qs = writeFilters(next);
    navigate(`/marketplace/buy${qs ? `?${qs}` : ''}`, { replace: false });
  }, [f, navigate]);

  const clearAll = () => navigate('/marketplace/buy');

  // ─── Filtered set (URL filters → in-memory filter) ─────────────
  const filtered = useMemo(() => {
    let out = PM_LISTINGS.slice();
    if (specialView === 'favorites') out = out.filter(l => store.favorites.includes(l.id));
    if (specialView === 'compare')   out = out.filter(l => store.compare.includes(l.id));
    out = out.filter(l => {
      const match = (l.id + ' ' + l.compound + ' ' + l.city + ' ' + (l.developer || '')).toLowerCase();
      if (f.q && !match.includes(f.q.toLowerCase())) return false;
      if (f.area && !l.city?.toLowerCase().includes(f.area.toLowerCase()) && !l.compound?.toLowerCase().includes(f.area.toLowerCase())) return false;
      if (f.developer) {
        const want = f.developer.toLowerCase();
        const dev  = (l.developer || '').toLowerCase();
        const cmp  = (l.compound  || '').toLowerCase();
        // Match if the listing's developer string contains the searched name,
        // OR the searched name appears in the compound (handles "Hyde Park"
        // matching "Hyde Park, New Cairo" even before developer was a column).
        if (!dev.includes(want) && !cmp.includes(want)) return false;
      }
      if (f.sub && l.unitType && l.unitType !== f.sub) return false;
      if (!matchPriceBand(f.price, parsePriceMillions(l.price))) return false;
      if (!matchMinNumber(f.beds, l.beds)) return false;
      if (!matchMinNumber(f.baths, l.baths)) return false;
      return true;
    });
    if (f.sort && SORTS[f.sort]) out = out.sort(SORTS[f.sort].fn);
    return out;
  }, [f, specialView, store.favorites, store.compare]);

  // Apply map bounds AFTER filters in map view.
  const inBounds = useMemo(() => {
    if (view !== 'map' || !bounds || specialView) return filtered;
    return filtered.filter(l => bounds.contains(window.L.latLng(l.lat, l.lng)));
  }, [filtered, bounds, view, specialView]);

  // Pagination
  const page = Math.max(1, parseInt(f.page || '1', 10));
  const totalPages = Math.max(1, Math.ceil(inBounds.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return inBounds.slice(start, start + PAGE_SIZE);
  }, [inBounds, page]);

  // Map fits to current filtered set; pin set follows the in-bounds listings.
  const mapRef = useRef(null);
  const onBoundsChange = useCallback((b) => setBounds(b), []);
  useLeafletMap(mapRef, filtered, onBoundsChange);

  // Active-filters chips (excluding default page/view).
  const activeChips = useMemo(() => Object.entries(f).filter(([k, v]) => v && !['page', 'view', 'sort'].includes(k)), [f]);

  const onTour = (l) => navigate(`/marketplace/listings/${l.id}?action=tour`);
  const onCall = (l) => { onPhoneCall({ listing: l?.id }); window.location.href = `tel:${phoneLink}`; };
  const goPage = (p) => {
    setFilter({ page: p });
    document.querySelector('.pm-buy-cards-pane')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Page now scrolls naturally — the map column uses position: sticky to
  // track the viewport while cards scroll past. No body-lock needed.
  useEffect(() => {
    document.body.classList.remove('app-locked');
    return () => document.body.classList.remove('app-locked');
  }, [view, specialView]);

  const setView2 = (v) => { setView(v); setFilter({ view: v }); };

  const saveSearchNow = () => {
    if (!saveLabel.trim()) { return; }
    addSavedSearch({ label: saveLabel.trim(), params: { ...f, view: undefined, page: undefined } });
    setSaveLabel(''); setShowSaveModal(false);
  };

  const filterLabel = (k, v) => {
    if (k === 'q')         return `Search: "${v}"`;
    if (k === 'type')      return `Type: ${v}`;
    if (k === 'sub')       return `Sub-type: ${v}`;
    if (k === 'price')     return `Price: ${v}`;
    if (k === 'beds')      return `${v} bedrooms`;
    if (k === 'baths')     return `${v} bathrooms`;
    if (k === 'area')      return `Area: ${v}`;
    if (k === 'developer') return `Developer: ${v}`;
    return `${k}: ${v}`;
  };

  // Header copy adapts to special views
  const pageTitle = specialView === 'favorites' ? `Favorites (${filtered.length})`
                  : specialView === 'compare'   ? `Compare List (${filtered.length}/${COMPARE_MAX})`
                  : specialView === 'saved'     ? 'Saved Searches'
                  : `Properties for Sale in Egypt`;
  const pageSub = specialView === 'favorites' ? 'Listings you saved on this device.'
                : specialView === 'compare'   ? 'Side-by-side compare list — local to this device.'
                : specialView === 'saved'     ? 'Searches you saved for quick access.'
                : `Showing ${inBounds.length.toLocaleString()} properties in Egypt`;

  return (
    <div className={`pm-buy-page view-${view}${specialView ? ' view-special' : ''}`}>
      {/* ─── Top chrome ─── */}
      <div className="pm-buy-chrome">
        <Breadcrumb items={[
          { label: 'Buy', to: specialView ? '/marketplace/buy' : undefined },
          ...(specialView ? [{ label: specialView.charAt(0).toUpperCase() + specialView.slice(1) }] : []),
        ]} />

        <div className="pm-buy-titlebar">
          <div>
            <h1>{pageTitle}</h1>
            <div className="pm-buy-subtitle">{pageSub}</div>
          </div>
          {!specialView && (
            <div className="pm-view-toggle">
              <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView2('list')}>
                <ListIcon size={14}/> List
              </button>
              <button type="button" className={view === 'map' ? 'active' : ''} onClick={() => setView2('map')}>
                <MapIcon size={14}/> Map
              </button>
            </div>
          )}
          {specialView && <button type="button" className="pm-btn-outline" onClick={() => navigate('/marketplace/buy')}>Back to all properties</button>}
        </div>

        {!specialView && (
          <>
            <div className="pm-buy-search-row">
              <div className="pm-search-bar" style={{ flex: 1, marginBottom: 0 }}>
                <Search size={16} color="#9ca3af" />
                <input
                  placeholder="Search by compound, city region, or MLS ID…"
                  value={f.q || ''}
                  onChange={e => setFilter({ q: e.target.value })}
                />
                {f.q && <button type="button" className="pm-clear-input" onClick={() => setFilter({ q: '' })}><X size={12}/></button>}
              </div>
              <div className="pm-sort-wrap" ref={sortRef}>
                <button type="button" className={`pm-sort-btn ${showSortMenu ? 'open' : ''} ${f.sort ? 'has-value' : ''}`} onClick={() => setShowSortMenu(s => !s)} aria-label={f.sort ? `Sort: ${SORTS[f.sort]?.label}` : 'Sort'}>
                  <ArrowDownUp size={14} />
                  <span>Sort</span>
                  {f.sort && <span className="pm-sort-dot" aria-hidden="true" />}
                </button>
                {showSortMenu && (
                  <div className="pm-sort-pop" role="menu">
                    <div className="pm-sort-pop-title">Sort by</div>
                    {Object.entries(SORTS).map(([k, s]) => (
                      <button key={k} type="button" role="menuitemradio" aria-checked={f.sort === k}
                        className={`pm-sort-item ${f.sort === k ? 'active' : ''}`}
                        onClick={() => { setFilter({ sort: k }); setShowSortMenu(false); }}>
                        <span>{s.label}</span>
                        {f.sort === k && <span className="pm-sort-tick">✓</span>}
                      </button>
                    ))}
                    {f.sort && (
                      <button type="button" className="pm-sort-reset" onClick={() => { setFilter({ sort: '' }); setShowSortMenu(false); }}>
                        Reset to Recommended
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="pm-buy-filter-row">
              <FilterPill label="Property type" value={f.type} onClear={() => setFilter({ type: '' })}>
                {({ close }) => <SimpleList options={PM_PROPERTY_TYPES} value={f.type} onChange={v => setFilter({ type: v })} close={close} />}
              </FilterPill>
              <FilterPill label="Sub Type" value={f.sub} onClear={() => setFilter({ sub: '' })}>
                {({ close }) => <SimpleList options={PM_PROPERTY_SUBS} value={f.sub} onChange={v => setFilter({ sub: v })} close={close} />}
              </FilterPill>
              <FilterPill label="Price" value={f.price} onClear={() => setFilter({ price: '' })}>
                {({ close }) => <SimpleList options={PM_PRICE_BANDS} value={f.price} onChange={v => setFilter({ price: v })} close={close} />}
              </FilterPill>
              <FilterPill label="Beds & Baths" value={f.beds || f.baths ? `${f.beds || 'Any'} / ${f.baths || 'Any'}` : ''} onClear={() => setFilter({ beds: '', baths: '' })}>
                {({ close }) => (
                  <div style={{ padding: 6 }}>
                    <div className="pm-pop-label">Beds</div>
                    <div className="pm-pop-pillrow">
                      {PM_BEDS_OPTIONS.map(b => (
                        <button key={b} type="button" className={`pm-pop-pill ${f.beds === b ? 'active' : ''}`} onClick={() => setFilter({ beds: b })}>{b}</button>
                      ))}
                    </div>
                    <div className="pm-pop-label" style={{ marginTop: 12 }}>Baths</div>
                    <div className="pm-pop-pillrow">
                      {PM_BATHS_OPTIONS.map(b => (
                        <button key={b} type="button" className={`pm-pop-pill ${f.baths === b ? 'active' : ''}`} onClick={() => setFilter({ baths: b })}>{b}</button>
                      ))}
                    </div>
                    <div className="pm-pop-actions">
                      <button type="button" className="pm-pop-clear" onClick={() => setFilter({ beds: '', baths: '' })}>Clear</button>
                      <button type="button" className="pm-pop-apply" onClick={close}>Apply</button>
                    </div>
                  </div>
                )}
              </FilterPill>
              <FilterPill label="Area" value={f.area} onClear={() => setFilter({ area: '' })}>
                {({ close }) => <SimpleList options={['New Cairo','New Capital City','North Coast','6th of October City','El Sheikh Zayed','Ain Sokhna']} value={f.area} onChange={v => setFilter({ area: v })} close={close} />}
              </FilterPill>
              <button type="button" className="pm-save-search pm-buy-save" onClick={() => setShowSaveModal(true)}>
                <Bookmark size={13} /> Save Search
              </button>
            </div>

            {/* Applied filter chips */}
            {activeChips.length > 0 && (
              <div className="pm-applied-chips">
                {activeChips.map(([k, v]) => (
                  <button key={k} type="button" className="pm-chip" onClick={() => setFilter({ [k]: '' })}>
                    {filterLabel(k, v)} <X size={11}/>
                  </button>
                ))}
                <button type="button" className="pm-chip pm-chip-clear" onClick={clearAll}>Clear all</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ─── Saved searches view ─── */}
      {specialView === 'saved' && (
        <div className="pm-buy-cards-pane" style={{padding:'22px 32px'}}>
          {store.savedSearches.length === 0 ? (
            <div className="pm-empty"><strong>No saved searches yet</strong><p>Save your filters from the Buy page to revisit them later.</p></div>
          ) : (
            <div style={{display:'grid',gap:12,maxWidth:760}}>
              {store.savedSearches.map(s => (
                <article key={s.id} className="pm-card" style={{display:'flex',padding:16,gap:14,alignItems:'center'}}>
                  <div style={{width:40,height:40,borderRadius:10,background:'rgba(232,103,42,.1)',color:'var(--brand)',display:'flex',alignItems:'center',justifyContent:'center'}}><Bookmark size={18}/></div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:700,fontSize:14}}>{s.label}</div>
                    <div style={{fontSize:11,color:'var(--text-secondary)',marginTop:4}}>
                      {Object.entries(s.params).filter(([_, v]) => v).map(([k, v]) => <span key={k} style={{marginRight:10}}>{k}: <b>{v}</b></span>)}
                    </div>
                    <div style={{fontSize:10,color:'var(--text-tertiary)',marginTop:4}}>Saved {new Date(s.savedAt).toLocaleString()}</div>
                  </div>
                  <button type="button" className="pm-card-cta" onClick={() => navigate(`/marketplace/buy?${writeFilters(s.params)}`)}>Run search</button>
                  <button type="button" className="btn-icon" onClick={() => removeSavedSearch(s.id)} title="Delete saved search"><Trash2 size={14}/></button>
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── List/Map split (or special favorites/compare which hide the map) ─── */}
      {specialView !== 'saved' && (
        <div className="pm-buy-split">
          <div className="pm-buy-cards-pane">
            {pageItems.length === 0 && (
              <div className="pm-empty">
                <strong>No matches</strong>
                <p>Try clearing filters, broadening your area, or {bounds && view === 'map' ? 'zooming the map out.' : 'choosing a different price band.'}</p>
              </div>
            )}

            <div className="pm-buy-cards-grid">
              {pageItems.map((l) => {
                const isFav  = store.favorites.includes(l.id);
                const isCmp  = store.compare.includes(l.id);
                return (
                  <article key={l.id} className="pm-card pm-buy-card" onClick={() => navigate(`/marketplace/listings/${l.id}`)}>
                    <div className="pm-card-img" style={{ backgroundImage: `url(${l.img})` }}>
                      <div className="pm-card-img-actions" onClick={e => e.stopPropagation()}>
                        <button type="button" className={`pm-card-img-action ${isCmp ? 'active' : ''}`} title="Compare" onClick={() => {
                          const r = toggleCompare(l.id);
                          if (r.reason) { window.alert(r.reason); }
                        }}>
                          <GitCompare size={13} />
                        </button>
                        <button type="button" className={`pm-card-img-action ${isFav ? 'active' : ''}`} title="Favorite" onClick={() => toggleFavorite(l.id)}>
                          <Heart size={13} />
                        </button>
                      </div>
                      <div className="pm-card-img-watermark">EGYPT MLS</div>
                    </div>
                    <div className="pm-card-body">
                      <div className="pm-card-price">EGP {l.price}</div>
                      <div className="pm-card-meta">
                        <span><BedDouble size={12} /> {l.beds} Beds</span>
                        <span><Bath size={12} /> {l.baths} Baths</span>
                        <span><Maximize2 size={12} /> {l.sqft.toLocaleString()} m²</span>
                      </div>
                      <div className="pm-card-loc"><MapPin size={11} /> {l.city}, {l.compound}</div>
                      <div className="pm-card-foot" onClick={e => e.stopPropagation()}>
                        <span className="pm-card-mlsid">MLS: {l.id}</span>
                        <button type="button" className="pm-card-cta" onClick={() => onTour(l)}>Schedule a Tour</button>
                        <button type="button" className="pm-card-call" title="Call agent" onClick={() => onCall(l)}><Phone size={13} /></button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="pm-pagination">
                <button type="button" className="pm-pg-arrow" disabled={page === 1} onClick={() => goPage(page - 1)} aria-label="Previous page"><ChevronLeft size={14}/></button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  return <button key={p} type="button" className={`pm-pg-num ${p === page ? 'active' : ''}`} onClick={() => goPage(p)}>{p}</button>;
                })}
                <button type="button" className="pm-pg-arrow" disabled={page === totalPages} onClick={() => goPage(page + 1)} aria-label="Next page"><ChevronRight size={14}/></button>
                <span className="pm-pg-count">Page {page} of {totalPages} · {inBounds.length.toLocaleString()} listings{bounds && view === 'map' && ' in view'}</span>
              </div>
            )}
          </div>

          {!specialView && (
            <aside className="pm-buy-map-pane">
              <div ref={mapRef} className="pm-map" />
              <button type="button" className="pm-buy-map-badge"><MapIcon size={13}/> Map</button>
              {bounds && (
                <div className="pm-map-info">{inBounds.length} of {filtered.length} in view · pan to filter</div>
              )}
            </aside>
          )}
        </div>
      )}

      {/* ─── Save search modal ─── */}
      {showSaveModal && (
        <div className="modal-overlay" onClick={() => setShowSaveModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{maxWidth:420}}>
            <div className="modal-header"><h3>Save this search</h3><button className="btn-icon" onClick={() => setShowSaveModal(false)}><X size={18}/></button></div>
            <div className="modal-body" style={{display:'flex',flexDirection:'column',gap:10}}>
              <p style={{fontSize:13,color:'var(--text-secondary)'}}>Name your search so you can return to it later.</p>
              <input
                type="text"
                placeholder="e.g. New Cairo · 4BD · 6–10M"
                value={saveLabel}
                onChange={e => setSaveLabel(e.target.value)}
                style={{padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:14}}
              />
              <div style={{fontSize:11,color:'var(--text-tertiary)'}}>
                Filters being saved: {activeChips.length === 0 ? 'none — adds an empty search' : activeChips.map(([k,v]) => `${k}=${v}`).join(' · ')}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowSaveModal(false)}>Cancel</button>
              <button className="btn btn-brand" onClick={saveSearchNow} disabled={!saveLabel.trim()}><Save size={13}/> Save</button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Selection action bar (favorites/compare counters) ─── */}
      {(store.favorites.length > 0 || store.compare.length > 0) && !specialView && (
        <div className="pm-action-bar">
          {store.favorites.length > 0 && <button type="button" className="pm-action-pill" onClick={() => navigate('/marketplace/buy?view=favorites')}><Heart size={13}/> {store.favorites.length} saved</button>}
          {store.compare.length > 0 && <button type="button" className="pm-action-pill" onClick={() => navigate('/marketplace/buy?view=compare')}><GitCompare size={13}/> {store.compare.length} in compare</button>}
        </div>
      )}
    </div>
  );
};
