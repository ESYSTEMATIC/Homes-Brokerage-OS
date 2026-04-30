import { useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Bell, Heart, GitCompare, User, Globe, MessageCircle, ChevronDown,
  Facebook, Twitter, Instagram, Linkedin, Youtube, LogOut, UserPlus, LogIn, Bookmark,
} from 'lucide-react';
import { PM_FOOTER, PM_LISTINGS } from '../data/publicMarketplaceData';
import { useMarketplaceStore } from '../data/marketplaceStore';
import { useMarketplaceUser, logout } from '../data/marketplaceUserStore';
import { buildWhatsAppUrl, onWhatsApp } from '../data/marketplaceCta';

// ─── Notifications generator ───────────────────────────────────
// EREP surfaces notifications via saved-search alerts. We generate them
// client-side: for each saved search, count how many listings currently
// match its filters and how many of those are "new" (top of the list).
const matchPriceBand = (band, priceM) => {
  if (!band || band === 'Any') return true;
  if (band === 'Under 3M EGP')   return priceM < 3;
  if (band === '3M – 6M EGP')    return priceM >= 3 && priceM < 6;
  if (band === '6M – 10M EGP')   return priceM >= 6 && priceM < 10;
  if (band === '10M – 20M EGP')  return priceM >= 10 && priceM < 20;
  if (band === '20M+ EGP')       return priceM >= 20;
  return true;
};
const matchMin = (opt, n) => !opt ? true : n >= parseInt(opt, 10);
const parsePrice = (p) => parseFloat((p + '').replace(/[^\d.]/g, '')) || 0;

const buildNotifications = ({ savedSearches, leads }) => {
  const items = [];
  // Saved-search match alerts (top 4)
  savedSearches.slice(0, 4).forEach(s => {
    const matches = PM_LISTINGS.filter(l => {
      const p = s.params || {};
      if (p.area && !l.city?.toLowerCase().includes(p.area.toLowerCase()) && !l.compound?.toLowerCase().includes(p.area.toLowerCase())) return false;
      if (p.developer && (l.developer || '').toLowerCase() !== p.developer.toLowerCase()) return false;
      if (p.sub && l.unitType && l.unitType !== p.sub) return false;
      if (!matchPriceBand(p.price, parsePrice(l.price))) return false;
      if (!matchMin(p.beds, l.beds)) return false;
      if (!matchMin(p.baths, l.baths)) return false;
      return true;
    });
    if (matches.length > 0) {
      items.push({
        id: `n-search-${s.id}`,
        kind: 'savedSearch',
        title: `${matches.length} listings match "${s.label}"`,
        body: matches.slice(0, 2).map(m => `${m.compound} · EGP ${m.price}M`).join(' · '),
        time: s.savedAt,
        action: { label: 'View matches', to: `/marketplace/buy?${new URLSearchParams(Object.entries(s.params || {}).filter(([_, v]) => v)).toString()}` },
      });
    }
  });
  // Lead status updates (newest 3)
  leads.slice(0, 3).forEach(l => {
    items.push({
      id: `n-lead-${l.id}`,
      kind: 'lead',
      title:
        l.kind === 'tour'     ? `Tour scheduled · MLS ${l.payload.listingId}`
      : l.kind === 'inquiry'  ? `Inquiry sent · MLS ${l.payload.listingId}`
      : l.kind === 'mortgage' ? `Mortgage request received`
      : l.kind === 'sell'     ? `Sell request received`
      : 'Request received',
      body: `Status: ${l.status || 'New'} — we'll be in touch within 24h.`,
      time: l.submittedAt,
      action: { label: 'View profile', to: '/marketplace/profile' },
    });
  });
  return items.sort((a, b) => new Date(b.time) - new Date(a.time));
};

export const MarketplaceSiteLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState(null);
  const [lang, setLang] = useState('EN');
  const ref = useRef(null);
  const store = useMarketplaceStore();
  const { user } = useMarketplaceUser();
  const favCount     = store.favorites.length;
  const compareCount = store.compare.length;
  const savedCount   = store.savedSearches.length;

  const notifications = useMemo(() => buildNotifications(store), [store]);
  const unread = notifications.length;

  useEffect(() => {
    if (!openMenu) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpenMenu(null); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openMenu]);

  // Close popovers on route change.
  useEffect(() => { setOpenMenu(null); }, [location.pathname, location.search]);

  const initials = user ? user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() : '';
  const goLogin = () => navigate(`/marketplace/login?next=${encodeURIComponent(location.pathname + location.search)}`);

  return (
    <div className="pm-shell">
      {/* ─────── Header ─────── */}
      <header className="pm-header">
        <div className="pm-header-inner">
          <div className="pm-logo" onClick={() => navigate('/marketplace')}>
            <img src={`${import.meta.env.BASE_URL}homes-logo-black.png`} alt="HOMES" />
          </div>
          <nav className="pm-nav">
            <NavLink to="/marketplace/buy"        className={({isActive}) => `pm-nav-link ${isActive ? 'active' : ''}`}>Buy</NavLink>
            <NavLink to="/marketplace/sell"       className={({isActive}) => `pm-nav-link ${isActive ? 'active' : ''}`}>Sell</NavLink>
            <NavLink to="/marketplace/developers" className={({isActive}) => `pm-nav-link ${isActive ? 'active' : ''}`}>Developers</NavLink>
            <NavLink to="/marketplace/mortgage"   className={({isActive}) => `pm-nav-link ${isActive ? 'active' : ''}`}>Mortgage</NavLink>
          </nav>

          <div className="pm-header-actions" ref={ref}>
            {/* Notifications */}
            <button type="button" className={`pm-icon ${openMenu === 'notif' ? 'active' : ''}`} title={`Notifications (${unread})`} onClick={() => setOpenMenu(openMenu === 'notif' ? null : 'notif')}>
              <Bell size={18}/>
              {unread > 0 && <span className="pm-icon-dot"/>}
            </button>
            {openMenu === 'notif' && (
              <div className="pm-popover pm-popover-wide">
                <div className="pm-pop-title">Notifications</div>
                {notifications.length === 0 ? (
                  <div className="pm-pop-empty">You're all caught up — save a search and we'll alert you when new matches land.</div>
                ) : (
                  <div className="pm-notif-list">
                    {notifications.map(n => (
                      <button type="button" key={n.id} className="pm-notif-item" onClick={() => { setOpenMenu(null); navigate(n.action.to); }}>
                        <div className={`pm-notif-ico ${n.kind}`}>{n.kind === 'savedSearch' ? <Bookmark size={13}/> : <Bell size={13}/>}</div>
                        <div className="meat">
                          <div className="ttl">{n.title}</div>
                          <div className="body">{n.body}</div>
                          <div className="time">{new Date(n.time).toLocaleString()}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            <span className="pm-divider"/>
            <button type="button" className="pm-icon" title={`Favorites (${favCount})`} onClick={() => navigate('/marketplace/favorites')}>
              <Heart size={18}/>
              {favCount > 0 && <span className="pm-icon-count">{favCount}</span>}
            </button>
            <button type="button" className="pm-icon" title={`Compare (${compareCount})`}  onClick={() => navigate('/marketplace/compare')}>
              <GitCompare size={18}/>
              {compareCount > 0 && <span className="pm-icon-count">{compareCount}</span>}
            </button>

            <span className="pm-divider"/>

            {/* Account */}
            <button type="button" className={`pm-icon pm-acct-btn ${openMenu === 'acct' ? 'active' : ''}`} title={user ? user.name : 'Sign in'} onClick={() => setOpenMenu(openMenu === 'acct' ? null : 'acct')}>
              {user ? <span className="pm-acct-avatar">{initials}</span> : <User size={18}/>}
            </button>
            {openMenu === 'acct' && (
              <div className="pm-popover">
                {user ? (
                  <>
                    <div className="pm-pop-acct">
                      <div className="pm-acct-avatar lg">{initials}</div>
                      <div>
                        <div className="name">{user.name}</div>
                        <div className="email">{user.email}</div>
                      </div>
                    </div>
                    <button type="button" className="pm-pop-link" onClick={() => { setOpenMenu(null); navigate('/marketplace/profile'); }}><User size={14}/> My profile</button>
                    <button type="button" className="pm-pop-link" onClick={() => { setOpenMenu(null); navigate('/marketplace/favorites'); }}>
                      <Heart size={14}/> Favorites <span className="r">{favCount}</span>
                    </button>
                    <button type="button" className="pm-pop-link" onClick={() => { setOpenMenu(null); navigate('/marketplace/compare'); }}>
                      <GitCompare size={14}/> Compare list <span className="r">{compareCount}</span>
                    </button>
                    <button type="button" className="pm-pop-link" onClick={() => { setOpenMenu(null); navigate('/marketplace/buy?view=saved'); }}>
                      <Bookmark size={14}/> Saved searches <span className="r">{savedCount}</span>
                    </button>
                    <button type="button" className="pm-pop-link" onClick={() => { setOpenMenu(null); navigate('/marketplace/sell'); }}>List a property</button>
                    <div className="pm-pop-sep" />
                    <button type="button" className="pm-pop-link danger" onClick={() => { logout(); setOpenMenu(null); navigate('/marketplace'); }}><LogOut size={14}/> Sign out</button>
                  </>
                ) : (
                  <>
                    <div className="pm-pop-title">Welcome to Homes</div>
                    <button type="button" className="pm-pop-cta primary" onClick={() => { setOpenMenu(null); goLogin(); }}><LogIn size={14}/> Log in</button>
                    <button type="button" className="pm-pop-cta" onClick={() => { setOpenMenu(null); navigate('/marketplace/signup'); }}><UserPlus size={14}/> Register</button>
                    <div className="pm-pop-sep" />
                    <button type="button" className="pm-pop-link" onClick={() => { setOpenMenu(null); navigate('/marketplace/favorites'); }}>
                      <Heart size={14}/> View favorites <span className="r">{favCount}</span>
                    </button>
                    <button type="button" className="pm-pop-link" onClick={() => { setOpenMenu(null); navigate('/marketplace/buy?view=saved'); }}>
                      <Bookmark size={14}/> Saved searches <span className="r">{savedCount}</span>
                    </button>
                  </>
                )}
              </div>
            )}

            <button type="button" className="pm-lang" onClick={() => setLang(l => l === 'EN' ? 'AR' : 'EN')}>
              <Globe size={14}/> {lang === 'EN' ? 'العربية' : 'English'} <ChevronDown size={12}/>
            </button>
          </div>
        </div>
      </header>

      {/* ─────── Page content ─────── */}
      <main className="pm-main">{children}</main>

      {/* ─────── Floating WhatsApp ─────── */}
      <a
        className="pm-whatsapp"
        title="Chat on WhatsApp"
        href={buildWhatsAppUrl({ message: 'Hello Homes — I have a question about a listing.' })}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => onWhatsApp({ source: 'floating' })}
      >
        <MessageCircle size={22} />
      </a>

      {/* ─────── Footer ─────── */}
      <footer className="pm-footer">
        <div className="pm-footer-inner">
          <div className="pm-footer-brand">
            <img src={`${import.meta.env.BASE_URL}homes-logo-white.png`} alt="HOMES" />
            <p>Homes — the brokerage operating system for Egypt. Find verified properties across the country with confidence.</p>
            <div className="pm-footer-contact">
              <div>📞 +20 122 544 4440</div>
              <div>✉ info@homes.com.eg</div>
            </div>
          </div>
          <div className="pm-footer-col">
            <h4>Quick Links</h4>
            {PM_FOOTER.quickLinks.map(([label, to]) => (
              to.startsWith('/')
                ? <a key={label} href={`#${to}`}>{label}</a>
                : <a key={label} href={to} onClick={(e) => { if (to === '#') { e.preventDefault(); window.alert(`${label} page (demo)`); } }}>{label}</a>
            ))}
          </div>
          <div className="pm-footer-col">
            <h4>Tools & Account</h4>
            <a href="#/marketplace/buy?view=favorites">Favorites</a>
            <a href="#/marketplace/buy?view=compare">Compare</a>
            <a href="#/marketplace/buy?view=saved">Saved searches</a>
            <a href="#/marketplace/profile">My profile</a>
            <a href="#" onClick={(e) => { e.preventDefault(); window.alert('FAQ page (demo)'); }}>FAQ</a>
          </div>
          <div className="pm-footer-col">
            <h4>Follow Us</h4>
            <div className="pm-socials">
              <a href="https://facebook.com"  target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook size={14}/></a>
              <a href="https://twitter.com"   target="_blank" rel="noopener noreferrer" aria-label="Twitter"><Twitter size={14}/></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={14}/></a>
              <a href="https://linkedin.com"  target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={14}/></a>
              <a href="https://youtube.com"   target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube size={14}/></a>
            </div>
          </div>
        </div>
        <div className="pm-footer-copyright">© 2026 — Homes. All rights reserved.</div>
      </footer>
    </div>
  );
};
