import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2,
  LogOut, Heart, Bookmark, GitCompare, Inbox, Settings, MessageSquare, Calendar,
  ArrowLeft, KeyRound,
} from 'lucide-react';
import { useMarketplaceUser, register, login, logout, updateProfile } from '../../data/marketplaceUserStore';
import { useMarketplaceStore, removeSavedSearch, toggleFavorite, toggleCompare } from '../../data/marketplaceStore';
import { PM_LISTINGS } from '../../data/publicMarketplaceData';

const writeFilters = (filters) => {
  const p = new URLSearchParams();
  Object.entries(filters || {}).forEach(([k, v]) => { if (v !== '' && v != null && v !== 'all' && v !== 'All') p.set(k, v); });
  return p.toString();
};

// ────────────────────────────────────────────────────────────────
// Login
// ────────────────────────────────────────────────────────────────
// Reusable Google button (cosmetic only — no real OAuth in the demo).
const GoogleButton = ({ onClick }) => (
  <button type="button" className="pm-auth-google" onClick={onClick}>
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.5 12.27c0-.79-.07-1.54-.2-2.27H12v4.51h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.22-4.74 3.22-8.32z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.05-3.71 1.05-2.85 0-5.27-1.92-6.13-4.5H2.18v2.85C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.87 14.12A6.99 6.99 0 0 1 5.5 12c0-.74.13-1.45.37-2.12V7.03H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.97l3.69-2.85z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.03l3.69 2.85C6.73 7.3 9.15 5.38 12 5.38z"/>
    </svg>
    Continue with Google
  </button>
);

// ────────────────────────────────────────────────────────────────
// Login
// ────────────────────────────────────────────────────────────────
export const MpLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get('next') || '/marketplace';
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    const r = login(form.email, form.password);
    if (!r.ok) { setError(r.error); return; }
    navigate(next);
  };

  return (
    <div className="pm-auth">
      <div className="pm-auth-card">
        <button type="button" className="pm-auth-back" onClick={() => navigate('/marketplace')}><ArrowLeft size={14}/> Back to Homes</button>
        <div className="pm-auth-head">
          <h1>Log In</h1>
        </div>

        <GoogleButton onClick={() => alert('Google sign-in is not connected in this demo.')} />
        <div className="pm-auth-or"><span>or continue by email</span></div>

        {error && <div className="pm-auth-error"><AlertCircle size={14}/> {error}</div>}

        <form onSubmit={submit} className="pm-auth-form">
          <div className="pm-auth-field">
            <label>Email</label>
            <div className="pm-auth-input"><Mail size={14}/><input type="email" autoFocus value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" /></div>
          </div>
          <div className="pm-auth-field">
            <label>Password</label>
            <div className="pm-auth-input">
              <Lock size={14}/>
              <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="••••••••" />
              <button type="button" className="pm-auth-eye" onClick={() => setShowPass(s => !s)}>{showPass ? <EyeOff size={14}/> : <Eye size={14}/>}</button>
            </div>
          </div>
          <Link to="/marketplace/forgot-password" className="pm-auth-forgot">Forgot your password?</Link>
          <button type="submit" className="pm-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Log In <ArrowRight size={14}/></button>
        </form>

        <div className="pm-auth-foot">
          <span>Don't have an account?</span>
          <Link to={`/marketplace/signup${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Register</Link>
        </div>
        <div className="pm-auth-demo">
          Demo: <code>buyer@homes.demo</code> / <code>homes2026</code>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// Signup
// ────────────────────────────────────────────────────────────────
export const MpSignup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const next = new URLSearchParams(location.search).get('next') || '/marketplace';
  const [form, setForm] = useState({ first: '', last: '', email: '', phone: '', password: '', confirm: '', agree: true });
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.first.trim()) err.first = 'Required';
    if (!form.last.trim())  err.last = 'Required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Invalid email';
    if (!/^[\d+\s-]{8,}$/.test(form.phone)) err.phone = 'Enter a valid phone';
    if ((form.password || '').length < 6) err.password = 'Min 6 characters';
    if (form.password !== form.confirm)   err.confirm = 'Passwords do not match';
    if (!form.agree) err.agree = 'You must agree';
    setErrors(err);
    if (Object.keys(err).length) return;

    const r = register({ name: `${form.first} ${form.last}`.trim(), email: form.email, phone: form.phone, password: form.password });
    if (!r.ok) { setErrors({ email: r.error }); return; }
    navigate(next);
  };

  return (
    <div className="pm-auth">
      <div className="pm-auth-card">
        <button type="button" className="pm-auth-back" onClick={() => navigate('/marketplace')}><ArrowLeft size={14}/> Back to Homes</button>
        <div className="pm-auth-head">
          <h1>Registration</h1>
        </div>

        <GoogleButton onClick={() => alert('Google sign-in is not connected in this demo.')} />
        <div className="pm-auth-or"><span>or register by email</span></div>

        <form onSubmit={submit} className="pm-auth-form">
          <div className="pm-auth-grid">
            <div className="pm-auth-field">
              <label>First name</label>
              <div className="pm-auth-input"><User size={14}/><input value={form.first} onChange={e => setForm({...form, first: e.target.value})} placeholder="First name" /></div>
              {errors.first && <span className="pm-form-err">{errors.first}</span>}
            </div>
            <div className="pm-auth-field">
              <label>Last name</label>
              <div className="pm-auth-input"><User size={14}/><input value={form.last} onChange={e => setForm({...form, last: e.target.value})} placeholder="Last name" /></div>
              {errors.last && <span className="pm-form-err">{errors.last}</span>}
            </div>
          </div>
          <div className="pm-auth-field">
            <label>Email</label>
            <div className="pm-auth-input"><Mail size={14}/><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com" /></div>
            {errors.email && <span className="pm-form-err">{errors.email}</span>}
          </div>
          <div className="pm-auth-field">
            <label>Mobile number</label>
            <div className="pm-auth-input"><Phone size={14}/><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+20 …" /></div>
            {errors.phone && <span className="pm-form-err">{errors.phone}</span>}
          </div>
          <div className="pm-auth-grid">
            <div className="pm-auth-field">
              <label>Password</label>
              <div className="pm-auth-input">
                <Lock size={14}/>
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="At least 6 characters" />
                <button type="button" className="pm-auth-eye" onClick={() => setShowPass(s => !s)}>{showPass ? <EyeOff size={14}/> : <Eye size={14}/>}</button>
              </div>
              {errors.password && <span className="pm-form-err">{errors.password}</span>}
            </div>
            <div className="pm-auth-field">
              <label>Confirm password</label>
              <div className="pm-auth-input">
                <Lock size={14}/>
                <input type={showPass ? 'text' : 'password'} value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} placeholder="Repeat password" />
              </div>
              {errors.confirm && <span className="pm-form-err">{errors.confirm}</span>}
            </div>
          </div>
          <label className="pm-form-checkbox" style={{margin:0}}>
            <input type="checkbox" checked={form.agree} onChange={e => setForm({...form, agree: e.target.checked})}/>
            <span>I agree to Homes' <a href="#" onClick={e => e.preventDefault()}>terms</a> and <a href="#" onClick={e => e.preventDefault()}>privacy notice</a>.</span>
          </label>
          {errors.agree && <span className="pm-form-err">{errors.agree}</span>}

          <button type="submit" className="pm-btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>Registration <ArrowRight size={14}/></button>
        </form>

        <div className="pm-auth-foot">
          <span>Already have an account?</span>
          <Link to={`/marketplace/login${next ? `?next=${encodeURIComponent(next)}` : ''}`}>Log In</Link>
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// Forgot password → OTP → Reset (3-step demo flow)
// ────────────────────────────────────────────────────────────────
export const MpForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError('Enter a valid email'); return; }
    try { window.sessionStorage.setItem('homes.reset.email', email); } catch { /* ignore */ }
    navigate('/marketplace/verify-otp?flow=reset-password');
  };

  return (
    <div className="pm-auth">
      <div className="pm-auth-card">
        <button type="button" className="pm-auth-back" onClick={() => navigate('/marketplace/login')}><ArrowLeft size={14}/> Back to Log In</button>
        <div className="pm-auth-head">
          <h1>Forgot your password?</h1>
          <p>We'll email you a 6-digit code to reset your password.</p>
        </div>
        {error && <div className="pm-auth-error"><AlertCircle size={14}/> {error}</div>}
        <form onSubmit={submit} className="pm-auth-form">
          <div className="pm-auth-field">
            <label>Email</label>
            <div className="pm-auth-input"><Mail size={14}/><input type="email" autoFocus value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></div>
          </div>
          <button type="submit" className="pm-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send code <ArrowRight size={14}/></button>
        </form>
      </div>
    </div>
  );
};

export const MpVerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const flow = new URLSearchParams(location.search).get('flow') || 'reset-password';
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [error, setError] = useState('');
  const refs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const onChange = (i, v) => {
    const ch = (v || '').replace(/\D/g, '').slice(0, 1);
    const next = code.slice();
    next[i] = ch;
    setCode(next);
    if (ch && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !code[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const submit = (e) => {
    e.preventDefault();
    const joined = code.join('');
    if (joined.length !== 6) { setError('Enter the 6-digit code'); return; }
    // Demo accepts any 6 digits.
    if (flow === 'reset-password') navigate(`/marketplace/reset-password?code=${joined}`);
    else navigate('/marketplace');
  };

  const resend = () => { setSecondsLeft(60); /* in real app: re-send OTP */ };

  return (
    <div className="pm-auth">
      <div className="pm-auth-card">
        <button type="button" className="pm-auth-back" onClick={() => navigate(-1)}><ArrowLeft size={14}/> Back</button>
        <div className="pm-auth-head">
          <h1>Enter verification code</h1>
          <p>We sent a 6-digit code to your email. Enter it below to continue.</p>
        </div>
        {error && <div className="pm-auth-error"><AlertCircle size={14}/> {error}</div>}
        <form onSubmit={submit} className="pm-auth-form">
          <div className="pm-otp-row">
            {code.map((c, i) => (
              <input key={i} ref={el => refs.current[i] = el} value={c} onChange={e => onChange(i, e.target.value)} onKeyDown={e => onKey(i, e)} maxLength={1} inputMode="numeric" className="pm-otp-input" />
            ))}
          </div>
          <button type="submit" className="pm-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Send <ArrowRight size={14}/></button>
          <div className="pm-auth-resend">
            {secondsLeft > 0
              ? <span>Resend code in <b>{secondsLeft}s</b></span>
              : <button type="button" className="pm-auth-link" onClick={resend}>Resend code</button>}
          </div>
        </form>
      </div>
    </div>
  );
};

export const MpResetPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if ((form.password || '').length < 6) err.password = 'Min 6 characters';
    if (form.password !== form.confirm)   err.confirm = 'Passwords do not match';
    setErrors(err);
    if (Object.keys(err).length) return;
    setDone(true);
    setTimeout(() => navigate('/marketplace/login'), 1500);
  };

  return (
    <div className="pm-auth">
      <div className="pm-auth-card">
        <button type="button" className="pm-auth-back" onClick={() => navigate('/marketplace/login')}><ArrowLeft size={14}/> Back to Log In</button>
        <div className="pm-auth-head">
          <h1>{done ? 'Password updated' : 'Reset your password'}</h1>
          <p>{done ? 'Sign in with your new password — redirecting…' : 'Choose a new password to use from now on.'}</p>
        </div>
        {!done && (
          <form onSubmit={submit} className="pm-auth-form">
            <div className="pm-auth-field">
              <label>New password</label>
              <div className="pm-auth-input"><KeyRound size={14}/><input type="password" autoFocus value={form.password} onChange={e => setForm({...form, password: e.target.value})}/></div>
              {errors.password && <span className="pm-form-err">{errors.password}</span>}
            </div>
            <div className="pm-auth-field">
              <label>Confirm new password</label>
              <div className="pm-auth-input"><KeyRound size={14}/><input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})}/></div>
              {errors.confirm && <span className="pm-form-err">{errors.confirm}</span>}
            </div>
            <button type="submit" className="pm-btn-primary" style={{ width: '100%', justifyContent: 'center' }}>Update password</button>
          </form>
        )}
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────
// Profile
// ────────────────────────────────────────────────────────────────
export const MpProfile = () => {
  const navigate = useNavigate();
  const { user } = useMarketplaceUser();
  const store = useMarketplaceStore();
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });

  if (!user) {
    // Not signed in → bounce to login.
    setTimeout(() => navigate(`/marketplace/login?next=${encodeURIComponent('/marketplace/profile')}`), 0);
    return null;
  }

  const favorites = useMemo(() => PM_LISTINGS.filter(l => store.favorites.includes(l.id)), [store.favorites]);
  const compared  = useMemo(() => PM_LISTINGS.filter(l => store.compare.includes(l.id)),   [store.compare]);

  const onSaveProfile = () => {
    updateProfile({ name: form.name.trim() || user.name, phone: form.phone });
    setEditing(false);
  };

  const onLogout = () => { logout(); navigate('/marketplace'); };

  const initials = user.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="pm-profile">
      <header className="pm-profile-head">
        <div className="pm-profile-avatar">{initials}</div>
        <div className="pm-profile-id">
          <h1>{user.name}</h1>
          <div className="pm-profile-meta">
            <span><Mail size={12}/> {user.email}</span>
            <span><Phone size={12}/> {user.phone || '—'}</span>
            <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <button type="button" className="pm-btn-outline" onClick={onLogout}><LogOut size={14}/> Sign out</button>
      </header>

      <nav className="pm-profile-tabs">
        {[
          ['overview',  'Overview', Settings],
          ['favorites', `Favorites (${favorites.length})`, Heart],
          ['compare',   `Compare (${compared.length})`,    GitCompare],
          ['searches',  `Saved searches (${store.savedSearches.length})`, Bookmark],
          ['leads',     `My requests (${store.leads.length})`, Inbox],
        ].map(([id, label, Ico]) => (
          <button key={id} type="button" className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            <Ico size={14}/> {label}
          </button>
        ))}
      </nav>

      {tab === 'overview' && (
        <div className="pm-profile-grid">
          <div className="pm-profile-card">
            <div className="pm-profile-cardhead"><h3>Account information</h3>{!editing && <button type="button" className="pm-btn-outline" onClick={() => setEditing(true)}>Edit</button>}</div>
            {editing ? (
              <div className="pm-profile-form">
                <div className="pm-auth-field"><label>Full name</label><div className="pm-auth-input"><User size={14}/><input value={form.name} onChange={e => setForm({...form, name: e.target.value})}/></div></div>
                <div className="pm-auth-field"><label>Phone</label><div className="pm-auth-input"><Phone size={14}/><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})}/></div></div>
                <div className="pm-auth-field"><label>Email</label><div className="pm-auth-input pm-auth-input-locked"><Mail size={14}/><input value={user.email} disabled /></div><span style={{fontSize:11,color:'#94a3b8',marginTop:4}}>Contact support to change your email.</span></div>
                <div style={{display:'flex',gap:8,marginTop:6}}>
                  <button type="button" className="pm-btn-primary" onClick={onSaveProfile}>Save</button>
                  <button type="button" className="pm-btn-outline" onClick={() => { setEditing(false); setForm({ name: user.name, phone: user.phone }); }}>Cancel</button>
                </div>
              </div>
            ) : (
              <dl className="pm-profile-dl">
                <div><dt>Full name</dt><dd>{user.name}</dd></div>
                <div><dt>Email</dt><dd>{user.email}</dd></div>
                <div><dt>Phone</dt><dd>{user.phone || '—'}</dd></div>
                <div><dt>Joined</dt><dd>{new Date(user.createdAt).toLocaleDateString()}</dd></div>
              </dl>
            )}
          </div>

          <div className="pm-profile-card">
            <h3>Activity at a glance</h3>
            <div className="pm-profile-stats">
              <button type="button" onClick={() => setTab('favorites')}><Heart size={16}/><div><b>{favorites.length}</b> favorites</div></button>
              <button type="button" onClick={() => setTab('compare')}><GitCompare size={16}/><div><b>{compared.length}</b> in compare</div></button>
              <button type="button" onClick={() => setTab('searches')}><Bookmark size={16}/><div><b>{store.savedSearches.length}</b> saved searches</div></button>
              <button type="button" onClick={() => setTab('leads')}><Inbox size={16}/><div><b>{store.leads.length}</b> requests</div></button>
            </div>
          </div>
        </div>
      )}

      {tab === 'favorites' && <ListingGrid title="Your favorites" empty="No favorites yet — start saving from the Buy page." listings={favorites} onCard={(l) => navigate(`/marketplace/listings/${l.id}`)} onRemove={(l) => toggleFavorite(l.id)} />}
      {tab === 'compare'   && <ListingGrid title="Properties to compare" empty="Add up to 3 properties to compare." listings={compared} onCard={(l) => navigate(`/marketplace/listings/${l.id}`)} onRemove={(l) => toggleCompare(l.id)} />}

      {tab === 'searches' && (
        <div className="pm-profile-card">
          <h3>Saved searches</h3>
          {store.savedSearches.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 13 }}>You haven't saved a search yet. Apply filters on the Buy page and click <b>Save Search</b>.</p>
          ) : (
            <ul className="pm-profile-searches">
              {store.savedSearches.map(s => (
                <li key={s.id}>
                  <div>
                    <div className="ttl">{s.label}</div>
                    <div className="meta">
                      {Object.entries(s.params).filter(([_, v]) => v).map(([k, v]) => <span key={k}>{k}: <b>{v}</b></span>)}
                    </div>
                    <div className="when">Saved {new Date(s.savedAt).toLocaleString()}</div>
                  </div>
                  <div className="acts">
                    <button type="button" className="pm-btn-primary" onClick={() => navigate(`/marketplace/buy?${writeFilters(s.params)}`)}>Run</button>
                    <button type="button" className="pm-btn-outline" onClick={() => removeSavedSearch(s.id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === 'leads' && (
        <div className="pm-profile-card">
          <h3>Your requests</h3>
          {store.leads.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: 13 }}>You haven't submitted any requests yet.</p>
          ) : (
            <ul className="pm-profile-leads">
              {store.leads.map(l => {
                const Ico = l.kind === 'tour' ? Calendar : l.kind === 'mortgage' ? MessageSquare : l.kind === 'sell' ? Inbox : MessageSquare;
                return (
                  <li key={l.id}>
                    <div className="ico"><Ico size={14}/></div>
                    <div className="meat">
                      <div className="ttl">
                        {l.kind === 'tour' && `Tour requested for MLS ${l.payload.listingId}`}
                        {l.kind === 'inquiry' && `Inquiry on MLS ${l.payload.listingId}`}
                        {l.kind === 'mortgage' && `Mortgage request — EGP ${(l.payload.unitPrice || 0).toLocaleString()}`}
                        {l.kind === 'sell' && `List a property — ${l.payload.propertyType} in ${l.payload.city}`}
                      </div>
                      <div className="meta">{new Date(l.submittedAt).toLocaleString()} · {l.status || 'New'}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Reusable listing grid (used inside Profile tabs) ──────────
const ListingGrid = ({ title, listings, empty, onCard, onRemove }) => (
  <div className="pm-profile-card">
    <h3>{title}</h3>
    {listings.length === 0 ? (
      <p style={{ color: '#6b7280', fontSize: 13 }}>{empty}</p>
    ) : (
      <div className="pm-buy-cards-grid" style={{ marginTop: 12 }}>
        {listings.map(l => (
          <article key={l.id} className="pm-card pm-buy-card" onClick={() => onCard(l)}>
            <div className="pm-card-img" style={{ backgroundImage: `url(${l.img})` }}>
              <div className="pm-card-img-actions" onClick={e => e.stopPropagation()}>
                <button type="button" className="pm-card-img-action active" title="Remove" onClick={() => onRemove(l)}>×</button>
              </div>
            </div>
            <div className="pm-card-body">
              <div className="pm-card-price">EGP {l.price}</div>
              <div className="pm-card-loc">{l.compound} · {l.city}</div>
            </div>
          </article>
        ))}
      </div>
    )}
  </div>
);
