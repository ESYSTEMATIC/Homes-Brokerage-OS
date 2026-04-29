import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Bell, Heart, GitCompare, User, Globe, MessageCircle, ChevronDown,
  Facebook, Twitter, Instagram, Linkedin, Youtube,
} from 'lucide-react';
import { PM_FOOTER } from '../data/publicMarketplaceData';

// Public marketplace site (homes.com.eg consumer surface). Outside the SSO
// flow — accessible to any visitor with no auth.
export const MarketplaceSiteLayout = ({ children }) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null);
  const [lang, setLang] = useState('EN');
  const ref = useRef(null);

  useEffect(() => {
    if (!openMenu) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpenMenu(null); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [openMenu]);

  return (
    <div className="pm-shell">
      {/* ─────── Header ─────── */}
      <header className="pm-header">
        <div className="pm-header-inner">
          <div className="pm-logo" onClick={() => navigate('/marketplace')}>
            <img src={`${import.meta.env.BASE_URL}homes-logo-black.png`} alt="HOMES" />
          </div>
          <nav className="pm-nav">
            <NavLink to="/marketplace/buy"      className={({isActive}) => `pm-nav-link ${isActive ? 'active' : ''}`}>Buy</NavLink>
            <NavLink to="/marketplace/sell"     className={({isActive}) => `pm-nav-link ${isActive ? 'active' : ''}`}>Sell</NavLink>
            <NavLink to="/marketplace/find"     className={({isActive}) => `pm-nav-link ${isActive ? 'active' : ''}`}>Find</NavLink>
            <NavLink to="/marketplace/mortgage" className={({isActive}) => `pm-nav-link ${isActive ? 'active' : ''}`}>Mortgage</NavLink>
          </nav>
          <div className="pm-header-actions" ref={ref}>
            <button type="button" className={`pm-icon ${openMenu === 'notif' ? 'active' : ''}`} title="Notifications" onClick={() => setOpenMenu(openMenu === 'notif' ? null : 'notif')}>
              <Bell size={18}/>
              <span className="pm-icon-dot"/>
            </button>
            {openMenu === 'notif' && (
              <div className="pm-popover">
                <div className="pm-pop-title">Notifications</div>
                <div className="pm-pop-empty">You're all caught up — no new alerts.</div>
              </div>
            )}
            <span className="pm-divider"/>
            <button type="button" className="pm-icon" title="Favorites" onClick={() => navigate('/marketplace/buy?saved=1')}><Heart size={18}/></button>
            <button type="button" className="pm-icon" title="Compare"  onClick={() => navigate('/marketplace/buy?compare=1')}><GitCompare size={18}/></button>
            <span className="pm-divider"/>
            <button type="button" className={`pm-icon ${openMenu === 'acct' ? 'active' : ''}`} title="Account" onClick={() => setOpenMenu(openMenu === 'acct' ? null : 'acct')}><User size={18}/></button>
            {openMenu === 'acct' && (
              <div className="pm-popover">
                <div className="pm-pop-title">Account</div>
                <button type="button" className="pm-pop-link" onClick={() => { setOpenMenu(null); navigate('/login'); }}>Sign in (Microsoft 365)</button>
                <button type="button" className="pm-pop-link" onClick={() => window.alert('Sign up form (demo)')}>Create an account</button>
                <button type="button" className="pm-pop-link" onClick={() => navigate('/marketplace/buy?saved=1')}>My favorites</button>
                <button type="button" className="pm-pop-link" onClick={() => navigate('/marketplace/sell')}>List a property</button>
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
        href="https://wa.me/201225444440"
        target="_blank"
        rel="noopener noreferrer"
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
            {PM_FOOTER.toolsAccount.map(([label, to]) => (
              <a key={label} href={to} onClick={(e) => { if (to === '#') { e.preventDefault(); window.alert(`${label} page (demo)`); } }}>{label}</a>
            ))}
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
