import { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, BedDouble, Bath, Maximize2, MapPin, Phone, GitCompare, X, Home as HomeIcon } from 'lucide-react';
import { PM_LISTINGS } from '../../data/publicMarketplaceData';
import { useMarketplaceStore, toggleFavorite, toggleCompare } from '../../data/marketplaceStore';
import { useMarketplaceUser } from '../../data/marketplaceUserStore';
import { phoneLink, onPhoneCall } from '../../data/marketplaceCta';
import { Breadcrumb } from '../../components/Breadcrumb';

const PAGE_SIZE = 9;

export const Favorites = () => {
  const navigate = useNavigate();
  const { user } = useMarketplaceUser();
  const store = useMarketplaceStore();
  const items = useMemo(() => PM_LISTINGS.filter(l => store.favorites.includes(l.id)), [store.favorites]);
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));

  // ─── Auth-required state ───
  if (!user) {
    return (
      <div className="pm-favorites">
        <header className="pm-favorites-head">
          <div className="pm-favorites-title">
            <Breadcrumb items={[{ label: 'My Favorites' }]} />
            <h1>My Favorites</h1>
          </div>
        </header>
        <div className="pm-favorites-empty">
          <div className="ico"><Heart size={28}/></div>
          <h2>Sign in to view your favorites</h2>
          <p>Save listings to your account so they sync across devices and you get alerts when prices change.</p>
          <div style={{display:'flex',gap:8,justifyContent:'center'}}>
            <button type="button" className="pm-btn-primary" onClick={() => navigate(`/marketplace/login?next=${encodeURIComponent('/marketplace/favorites')}`)}>Log in</button>
            <button type="button" className="pm-btn-outline" onClick={() => navigate('/marketplace/signup')}>Create account</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Empty (signed-in but no favorites) ───
  if (items.length === 0) {
    return (
      <div className="pm-favorites">
        <header className="pm-favorites-head">
          <div className="pm-favorites-title">
            <Breadcrumb items={[{ label: 'My Favorites' }]} />
            <h1>My Favorites</h1>
          </div>
          <div className="pm-favorites-count">0 saved</div>
        </header>
        <div className="pm-favorites-empty">
          <div className="ico"><Heart size={28}/></div>
          <h2>No favorites yet</h2>
          <p>Tap the heart on any listing to save it here.</p>
          <button type="button" className="pm-btn-primary" onClick={() => navigate('/marketplace/buy')}>Browse properties <ArrowRight size={14}/></button>
        </div>
      </div>
    );
  }

  // ─── Grid ───
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = items.slice(start, start + PAGE_SIZE);

  const onRemove = (l) => {
    toggleFavorite(l.id);
    // If we just removed the last item on a page beyond 1, go back a page.
    if (pageItems.length === 1 && page > 1) setPage(p => p - 1);
  };

  return (
    <div className="pm-favorites">
      <header className="pm-favorites-head">
        <div className="pm-favorites-title">
          <Breadcrumb items={[{ label: 'My Favorites' }]} />
          <h1>My Favorites</h1>
        </div>
        <div className="pm-favorites-count">{items.length} saved</div>
      </header>

      <div className="pm-buy-cards-grid pm-favorites-grid">
        {pageItems.map(l => {
          const isCmp = store.compare.includes(l.id);
          return (
            <article key={l.id} className="pm-card pm-buy-card" onClick={() => navigate(`/marketplace/listings/${l.id}`)}>
              <div className="pm-card-img" style={{ backgroundImage: `url(${l.img})` }}>
                <div className="pm-card-img-actions" onClick={e => e.stopPropagation()}>
                  <button type="button" className={`pm-card-img-action ${isCmp ? 'active' : ''}`} title="Compare" onClick={() => toggleCompare(l.id)}><GitCompare size={13}/></button>
                  <button type="button" className="pm-card-img-action active" title="Remove" onClick={() => onRemove(l)}><X size={13}/></button>
                </div>
              </div>
              <div className="pm-card-body">
                <div className="pm-card-price">EGP {l.price}</div>
                <div className="pm-card-meta">
                  <span><BedDouble size={12}/> {l.beds} Beds</span>
                  <span><Bath size={12}/> {l.baths} Baths</span>
                  <span><Maximize2 size={12}/> {l.sqft.toLocaleString()} m²</span>
                </div>
                <div className="pm-card-loc"><MapPin size={11}/> {l.city}, {l.compound}</div>
                <div className="pm-card-foot" onClick={e => e.stopPropagation()}>
                  <span className="pm-card-mlsid">MLS: {l.id}</span>
                  <button type="button" className="pm-card-cta" onClick={() => navigate(`/marketplace/listings/${l.id}?action=tour`)}>Schedule a Tour</button>
                  <a className="pm-card-call" href={`tel:${phoneLink}`} onClick={() => onPhoneCall({ listing: l.id })}><Phone size={13}/></a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="pm-pagination">
          <button type="button" className="pm-pg-arrow" disabled={page === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14}/></button>
          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1;
            return <button key={p} type="button" className={`pm-pg-num ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>;
          })}
          <button type="button" className="pm-pg-arrow" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14}/></button>
          <span className="pm-pg-count">Page {page} of {totalPages} · {items.length} favorites</span>
        </div>
      )}
    </div>
  );
};
