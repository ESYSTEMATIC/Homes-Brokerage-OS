import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Search, ChevronDown, ArrowDownUp, Heart, Bookmark, GitCompare, Phone,
  MapPin, BedDouble, Bath, Maximize2, ChevronLeft, ChevronRight, Map as MapIcon, List as ListIcon,
} from 'lucide-react';
import {
  PM_LISTINGS, PM_PRICE_BANDS, PM_BEDS_OPTIONS, PM_BATHS_OPTIONS,
  PM_PROPERTY_SUBS,
} from '../../data/publicMarketplaceData';

const PAGE_SIZE = 6;

// Filter pill — same look as the homepage hero filter, with an open popover.
const FilterPill = ({ label, value, children }) => {
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
      <button type="button" className={`pm-filter-pill ${open ? 'open' : ''}`} onClick={() => setOpen(o => !o)}>
        {value || label} <ChevronDown size={12} />
      </button>
      {open && (
        <div className="pm-filter-pop" style={{ width: 240, padding: 8 }}>
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
      >{o}</button>
    ))}
  </div>
);

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
const matchMinNumber = (opt, n) => {
  if (!opt) return true;
  const min = parseInt(opt, 10);
  return n >= min;
};

// Interactive Leaflet map — loaded from CDN once, rendered with property markers.
const useLeafletMap = (containerRef, listings, onMarker) => {
  const mapRef = useRef(null);
  useEffect(() => {
    let cancelled = false;
    const init = () => {
      if (cancelled || !window.L || !containerRef.current || mapRef.current) return;
      const map = window.L.map(containerRef.current, {
        center: [30.05, 31.45], zoom: 6, zoomControl: true, scrollWheelZoom: false,
      });
      // Google Maps "roadmap" tiles — same look as EREP. Subdomain rotation
      // (mt0–mt3) keeps tile loading fast.
      window.L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '© Google',
      }).addTo(map);
      mapRef.current = { map, markers: [] };
    };
    if (window.L) { init(); }
    else if (!document.getElementById('leaflet-css')) {
      const css = document.createElement('link');
      css.id = 'leaflet-css';
      css.rel = 'stylesheet';
      css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(css);
      const js = document.createElement('script');
      js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      js.async = true;
      js.onload = init;
      document.body.appendChild(js);
    } else {
      const wait = setInterval(() => { if (window.L) { clearInterval(wait); init(); } }, 80);
      return () => clearInterval(wait);
    }
    return () => { cancelled = true; };
  }, [containerRef]);

  // Re-render markers whenever listings change.
  useEffect(() => {
    const ref = mapRef.current;
    if (!ref) return;
    ref.markers.forEach(m => m.remove());
    ref.markers = listings.map(l => {
      const html = `<div class="pm-map-pin">${l.price}M</div>`;
      const icon = window.L.divIcon({ className: 'pm-map-pin-wrap', html, iconSize: [56, 26], iconAnchor: [28, 13] });
      const m = window.L.marker([l.lat, l.lng], { icon })
        .addTo(ref.map)
        .bindPopup(`<strong>${l.compound}</strong><br/>EGP ${l.price} · ${l.beds} bd · ${l.baths} ba<br/>MLS ${l.id}`);
      m.on('click', () => onMarker?.(l));
      return m;
    });
    if (listings.length) {
      const bounds = window.L.latLngBounds(listings.map(l => [l.lat, l.lng]));
      ref.map.fitBounds(bounds.pad(0.2), { animate: false });
    }
  }, [listings, onMarker]);
};

export const Buy = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  // Default view → map (per spec). EREP uses this exact split.
  const [view, setView] = useState('map');
  const [type, setType] = useState('all');
  const [q, setQ] = useState(params.get('q') || '');
  const [price, setPrice] = useState(params.get('price') || '');
  const [beds, setBeds] = useState(params.get('beds') || '');
  const [baths, setBaths] = useState(params.get('baths') || '');
  const [sub, setSub] = useState(params.get('sub') || '');
  const [area, setArea] = useState(params.get('area') || '');
  const [page, setPage] = useState(1);
  const [favs, setFavs] = useState(new Set());
  const [compare, setCompare] = useState(new Set());

  const filtered = useMemo(() => PM_LISTINGS.filter(l => {
    const m = (l.id + ' ' + l.compound + ' ' + l.city).toLowerCase();
    if (q && !m.includes(q.toLowerCase())) return false;
    if (area && !l.city.toLowerCase().includes(area.toLowerCase()) && !l.compound.toLowerCase().includes(area.toLowerCase())) return false;
    if (!matchPriceBand(price, parsePriceMillions(l.price))) return false;
    if (!matchMinNumber(beds, l.beds)) return false;
    if (!matchMinNumber(baths, l.baths)) return false;
    return true;
  }), [q, area, price, beds, baths, sub]);

  useEffect(() => { setPage(1); }, [q, area, price, beds, baths, sub, type]);

  // Map view → lock the body so the fixed map stays anchored. List view →
  // free the body so the 3-column cards grid scrolls the page like EREP.
  useEffect(() => {
    if (view === 'map') document.body.classList.add('app-locked');
    else document.body.classList.remove('app-locked');
    return () => document.body.classList.remove('app-locked');
  }, [view]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const toggle = (set, setSet, id) => {
    const next = new Set(set);
    next.has(id) ? next.delete(id) : next.add(id);
    setSet(next);
  };

  const mapRef = useRef(null);
  // Map always shows ALL filtered results regardless of pagination.
  useLeafletMap(mapRef, filtered);

  const onTour = (l) => window.alert(`Tour requested for ${l.compound} (MLS ${l.id}). A specialist will contact you within 24 hours.`);
  const onCall = () => window.alert('Calling agent (demo): +20 122 544 4440');
  const goPage = (p) => { setPage(p); document.querySelector('.pm-buy-cards-pane')?.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className={`pm-buy-page view-${view}`}>
      {/* ─────── Top chrome — full width, identical to EREP ─────── */}
      <div className="pm-buy-chrome">
        <div className="pm-breadcrumb"><a href="#/marketplace">Home</a> &gt; <strong>Buy</strong></div>

        <div className="pm-buy-titlebar">
          <div>
            <h1>Properties for Sale in Egypt</h1>
            <div className="pm-buy-subtitle">Showing {filtered.length.toLocaleString()} properties in Egypt</div>
          </div>
          <div className="pm-view-toggle">
            <button type="button" className={view === 'list' ? 'active' : ''} onClick={() => setView('list')}>
              <ListIcon size={14}/> List
            </button>
            <button type="button" className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}>
              <MapIcon size={14}/> Map
            </button>
          </div>
        </div>

        <div className="pm-buy-search-row">
          <div className="pm-search-bar" style={{ flex: 1, marginBottom: 0 }}>
            <Search size={16} color="#9ca3af" />
            <input
              placeholder="Search by compound, city region, or MLS ID…"
              value={q}
              onChange={e => setQ(e.target.value)}
            />
          </div>
          <button type="button" className="pm-sort-btn" onClick={() => window.alert('Sort options (demo)')}>
            <ArrowDownUp size={13} /> Sort
          </button>
        </div>

        <div className="pm-buy-filter-row">
          <FilterPill label="Price" value={price}>
            {({ close }) => <SimpleList options={PM_PRICE_BANDS} value={price} onChange={setPrice} close={close} />}
          </FilterPill>
          <FilterPill label="Beds & Baths" value={beds || baths ? `${beds || 'Any'} / ${baths || 'Any'}` : ''}>
            {({ close }) => (
              <div style={{ padding: 6 }}>
                <div className="pm-pop-label">Beds</div>
                <div className="pm-pop-pillrow">
                  {PM_BEDS_OPTIONS.map(b => (
                    <button key={b} type="button" className={`pm-pop-pill ${beds === b ? 'active' : ''}`} onClick={() => setBeds(b)}>{b}</button>
                  ))}
                </div>
                <div className="pm-pop-label" style={{ marginTop: 12 }}>Baths</div>
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
          </FilterPill>
          <FilterPill label="Area" value={area}>
            {({ close }) => <SimpleList options={['','New Cairo','New Capital City','North Coast','6th of October City','El Sheikh Zayed','Ain Sokhna']} value={area} onChange={setArea} close={close} />}
          </FilterPill>
          <FilterPill label="View" value={null}>
            {({ close }) => <SimpleList options={['Sea View','Lagoon View','Garden View','Pool View','Open View']} value={null} onChange={() => {}} close={close} />}
          </FilterPill>
          <FilterPill label="Payment" value={null}>
            {({ close }) => <SimpleList options={['Cash','Installments','Mortgage Eligible']} value={null} onChange={() => {}} close={close} />}
          </FilterPill>
          <FilterPill label="Amenities" value={null}>
            {({ close }) => <SimpleList options={['Pool','Gym','Garden','Security','Smart Home','Maid Room']} value={null} onChange={() => {}} close={close} />}
          </FilterPill>
          <button type="button" className="pm-save-search pm-buy-save" onClick={() => window.alert('Saved search (demo) — alerts will go to your inbox.')}>
            <Bookmark size={13} /> Save Search
          </button>
        </div>

        <div className="pm-type-tabs pm-buy-tabs">
          <button type="button" className={`pm-type-tab ${type === 'residential' ? 'active' : ''}`} onClick={() => setType('residential')}>Residential</button>
          <button type="button" className={`pm-type-tab ${type === 'commercial' ? 'active' : ''}`} onClick={() => setType('commercial')}>Commercial</button>
          {(price || beds || baths || sub || area || q || type !== 'all') && (
            <button type="button" className="pm-type-tab" onClick={() => { setPrice(''); setBeds(''); setBaths(''); setSub(''); setArea(''); setQ(''); setType('all'); }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ─────── Split: paginated cards left · fixed map right ─────── */}
      <div className="pm-buy-split">
        <div className="pm-buy-cards-pane">
          {filtered.length === 0 && (
            <div className="pm-empty">
              <strong>No matches</strong>
              <p>Try clearing filters or broadening your area.</p>
            </div>
          )}
          <div className="pm-buy-cards-grid">
            {pageItems.map((l) => (
              <article key={l.id} className="pm-card pm-buy-card">
                <div className="pm-card-img" style={{ backgroundImage: `url(${l.img})` }}>
                  <div className="pm-card-img-actions">
                    <button type="button" className={`pm-card-img-action ${compare.has(l.id) ? 'active' : ''}`} title="Compare" onClick={() => toggle(compare, setCompare, l.id)}>
                      <GitCompare size={13} />
                    </button>
                    <button type="button" className={`pm-card-img-action ${favs.has(l.id) ? 'active' : ''}`} title="Favorite" onClick={() => toggle(favs, setFavs, l.id)}>
                      <Heart size={13} />
                    </button>
                  </div>
                  <div className="pm-card-img-watermark">EGYPT MLS</div>
                </div>
                <div className="pm-card-body">
                  <div className="pm-card-price">EGP {l.price} M</div>
                  <div className="pm-card-meta">
                    <span><BedDouble size={12} /> {l.beds} Beds</span>
                    <span><Bath size={12} /> {l.baths} Baths</span>
                    <span><Maximize2 size={12} /> {l.sqft.toLocaleString()} m²</span>
                  </div>
                  <div className="pm-card-loc"><MapPin size={11} /> {l.city}, {l.compound}</div>
                  <div className="pm-card-foot">
                    <span className="pm-card-mlsid">MLS: {l.id}</span>
                    <button type="button" className="pm-card-cta" onClick={() => onTour(l)}>Schedule a Tour</button>
                    <button type="button" className="pm-card-call" title="Call agent" onClick={onCall}><Phone size={13} /></button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pm-pagination">
              <button type="button" className="pm-pg-arrow" disabled={page === 1} onClick={() => goPage(page - 1)} aria-label="Previous page">
                <ChevronLeft size={14}/>
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                return (
                  <button key={p} type="button" className={`pm-pg-num ${p === page ? 'active' : ''}`} onClick={() => goPage(p)}>
                    {p}
                  </button>
                );
              })}
              <button type="button" className="pm-pg-arrow" disabled={page === totalPages} onClick={() => goPage(page + 1)} aria-label="Next page">
                <ChevronRight size={14}/>
              </button>
              <span className="pm-pg-count">
                Page {page} of {totalPages} · {filtered.length.toLocaleString()} listings
              </span>
            </div>
          )}
        </div>

        <aside className="pm-buy-map-pane">
          <div ref={mapRef} className="pm-map" />
          <button type="button" className="pm-buy-map-badge"><MapIcon size={13}/> Map</button>
        </aside>
      </div>

      {(favs.size > 0 || compare.size > 0) && (
        <div className="pm-action-bar">
          {favs.size > 0 && <span><Heart size={13}/> {favs.size} saved</span>}
          {compare.size > 0 && <span><GitCompare size={13}/> {compare.size} in compare</span>}
          <button type="button" className="pm-btn-primary" onClick={() => navigate('/marketplace/find')}>
            View saved & compared
          </button>
        </div>
      )}
    </div>
  );
};
