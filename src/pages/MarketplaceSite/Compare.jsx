import { useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, X, GitCompare, Heart, MapPin, BedDouble, Bath, Maximize2, Trash2, ArrowRight, Phone } from 'lucide-react';
import { PM_LISTINGS } from '../../data/publicMarketplaceData';
import { useMarketplaceStore, toggleCompare, clearCompare, toggleFavorite, COMPARE_MAX } from '../../data/marketplaceStore';
import { phoneLink, onPhoneCall } from '../../data/marketplaceCta';
import { Breadcrumb } from '../../components/Breadcrumb';

// Numeric "best" indicator — used per row to highlight the winning value.
const bestIndex = (vals, mode = 'high') => {
  const filtered = vals.map((v, i) => [Number.isFinite(v) ? v : NaN, i]).filter(([v]) => !isNaN(v));
  if (!filtered.length) return -1;
  const best = filtered.reduce((acc, cur) => mode === 'low' ? (cur[0] < acc[0] ? cur : acc) : (cur[0] > acc[0] ? cur : acc));
  return best[1];
};

export const Compare = () => {
  const navigate = useNavigate();
  const store = useMarketplaceStore();
  const items = useMemo(() => PM_LISTINGS.filter(l => store.compare.includes(l.id)), [store.compare]);

  // ─── Empty state ───
  if (items.length === 0) {
    return (
      <div className="pm-compare">
        <header className="pm-compare-head">
          <div className="pm-compare-title">
            <Breadcrumb items={[{ label: 'Compare' }]} />
            <h1>Compare properties</h1>
          </div>
        </header>
        <div className="pm-compare-empty">
          <div className="ico"><GitCompare size={28}/></div>
          <h2>No Units Available to Compare</h2>
          <p>Pick up to {COMPARE_MAX} properties from the Buy page to compare side-by-side.</p>
          <button type="button" className="pm-btn-primary" onClick={() => navigate('/marketplace/buy')}>Browse properties <ArrowRight size={14}/></button>
        </div>
      </div>
    );
  }

  // ─── Best-of indicators per numeric attribute ───
  const prices = items.map(l => Number((l.price + '').replace(/[^\d.]/g, '')));
  const sqfts  = items.map(l => l.sqft);
  const beds   = items.map(l => l.beds);
  const baths  = items.map(l => l.baths);

  const cells = (vals, mode) => {
    const ix = bestIndex(vals, mode);
    return vals.map((v, i) => ({ v, best: i === ix }));
  };

  const priceCells = cells(prices, 'low');   // lower is better
  const sqftCells  = cells(sqfts,  'high');
  const bedCells   = cells(beds,   'high');
  const bathCells  = cells(baths,  'high');

  // Section helper
  const Row = ({ label, render }) => (
    <tr>
      <th>{label}</th>
      {items.map((l, i) => <td key={l.id}>{render(l, i)}</td>)}
      {Array.from({ length: COMPARE_MAX - items.length }).map((_, i) => <td key={`pad-${i}`} className="pad" />)}
    </tr>
  );
  const SectionHeader = ({ label }) => (
    <tr className="section">
      <th colSpan={COMPARE_MAX + 1}>{label}</th>
    </tr>
  );

  return (
    <div className="pm-compare">
      <header className="pm-compare-head">
        <div className="pm-compare-title">
          <Breadcrumb items={[{ label: 'Compare' }]} />
          <h1>Compare properties <span className="count">({items.length}/{COMPARE_MAX})</span></h1>
        </div>
        <button type="button" className="pm-btn-outline" onClick={clearCompare}><Trash2 size={13}/> Clear all</button>
      </header>

      {/* Sticky card strip — desktop horizontal grid, mobile horizontal scroll */}
      <div className="pm-compare-strip">
        {items.map(l => (
          <article key={l.id} className="pm-compare-card">
            <button type="button" className="pm-compare-x" onClick={() => toggleCompare(l.id)} aria-label={`Remove ${l.compound}`}><X size={14}/></button>
            <button type="button" className={`pm-compare-fav ${store.favorites.includes(l.id) ? 'on' : ''}`} onClick={() => toggleFavorite(l.id)} title="Favorite"><Heart size={13}/></button>
            <div className="pm-compare-img" style={{ backgroundImage: `url(${l.img})` }} onClick={() => navigate(`/marketplace/listings/${l.id}`)} />
            <div className="pm-compare-card-body">
              <div className="price">EGP {l.price}</div>
              <div className="title">{l.compound}</div>
              <div className="loc"><MapPin size={11}/> {l.city}</div>
              <div className="meta">
                <span><BedDouble size={11}/> {l.beds}</span>
                <span><Bath size={11}/> {l.baths}</span>
                <span><Maximize2 size={11}/> {l.sqft}m²</span>
              </div>
              <div className="acts">
                <button type="button" className="pm-card-cta" onClick={() => navigate(`/marketplace/listings/${l.id}?action=tour`)}>Schedule a Tour</button>
                <a className="pm-card-call" href={`tel:${phoneLink}`} onClick={() => onPhoneCall({ listing: l.id })}><Phone size={13}/></a>
              </div>
            </div>
          </article>
        ))}
        {items.length < COMPARE_MAX && (
          <button type="button" className="pm-compare-add" onClick={() => navigate('/marketplace/buy')}>
            <Plus size={20}/>
            <span>Add a Property</span>
            <small>Pick from the Buy page</small>
          </button>
        )}
      </div>

      {/* Attribute table */}
      <div className="pm-compare-table-wrap">
        <table className="pm-compare-table">
          <thead>
            <tr>
              <th />
              {items.map(l => <th key={l.id}>{l.compound}</th>)}
              {Array.from({ length: COMPARE_MAX - items.length }).map((_, i) => <th key={`hpad-${i}`} className="pad">—</th>)}
            </tr>
          </thead>
          <tbody>
            <SectionHeader label="Listing Details" />
            <Row label="Property type" render={l => l.unitType || 'Residential'} />
            <Row label="Sub type" render={l => l.unitType || '—'} />
            <Row label="MLS ID" render={l => <code>{l.id}</code>} />
            <Row label="Payment terms" render={() => 'Cash · Installments'} />
            <Row label="Furnished" render={() => 'Semi-furnished'} />

            <SectionHeader label="Specifications" />
            <tr>
              <th>Bedrooms</th>
              {items.map((l, i) => <td key={l.id} className={bedCells[i].best ? 'best' : ''}>{l.beds}{bedCells[i].best && <span className="best-pill">Best</span>}</td>)}
              {Array.from({ length: COMPARE_MAX - items.length }).map((_, i) => <td key={`bp-${i}`} className="pad" />)}
            </tr>
            <tr>
              <th>Bathrooms</th>
              {items.map((l, i) => <td key={l.id} className={bathCells[i].best ? 'best' : ''}>{l.baths}{bathCells[i].best && <span className="best-pill">Best</span>}</td>)}
              {Array.from({ length: COMPARE_MAX - items.length }).map((_, i) => <td key={`bp2-${i}`} className="pad" />)}
            </tr>
            <tr>
              <th>Gross area</th>
              {items.map((l, i) => <td key={l.id} className={sqftCells[i].best ? 'best' : ''}>{l.sqft.toLocaleString()} m²{sqftCells[i].best && <span className="best-pill">Largest</span>}</td>)}
              {Array.from({ length: COMPARE_MAX - items.length }).map((_, i) => <td key={`sp-${i}`} className="pad" />)}
            </tr>
            <Row label="Year built" render={() => '2024'} />
            <Row label="Floor" render={l => l.unitType === 'Villa' || l.unitType === 'Townhouse' ? 'Ground+1' : '2nd'} />

            <SectionHeader label="Project Info" />
            <Row label="Developer" render={l => l.developer || '—'} />
            <Row label="Compound" render={l => l.compound} />
            <tr>
              <th>Price</th>
              {items.map((l, i) => <td key={l.id} className={priceCells[i].best ? 'best' : ''}>EGP {l.price}{priceCells[i].best && <span className="best-pill">Best</span>}</td>)}
              {Array.from({ length: COMPARE_MAX - items.length }).map((_, i) => <td key={`pp-${i}`} className="pad" />)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
