import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Heart, GitCompare, Share2, BedDouble, Bath, Maximize2, MapPin, Phone,
  Calendar, MessageCircle, ChevronLeft, ChevronRight, Calculator, CheckCircle2, X, Send,
} from 'lucide-react';
import { PM_LISTINGS } from '../../data/publicMarketplaceData';
import { Breadcrumb } from '../../components/Breadcrumb';
import {
  useMarketplaceStore, toggleFavorite, toggleCompare, addLead, COMPARE_MAX,
} from '../../data/marketplaceStore';
import { buildWhatsAppUrl, onWhatsApp, onPhoneCall, phoneLink, buildShareUrl } from '../../data/marketplaceCta';

const fmtEgp = (n) => new Intl.NumberFormat('en-EG').format(n);

// Mortgage estimate — same formula used on /marketplace/mortgage.
const monthlyPayment = (principal, annualRate, years) => {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};

// Build a small gallery from the single hero image (Unsplash returns
// different crops per query parameter — gives a 4-frame carousel feel).
const buildGallery = (l) => {
  if (!l?.img) return [];
  const variants = ['', '&sat=-15', '&blend=10pct', '&hue=10'];
  return variants.map((v, i) => ({
    id: i, src: l.img + v,
  }));
};

// Schedule-tour modal (lead capture #5).
const TourModal = ({ listing, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '', time: '', notes: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!/^[\d+\s-]{8,}$/.test(form.phone)) e.phone = 'Enter a valid phone';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.date) e.date = 'Pick a date';
    if (!form.time) e.time = 'Pick a time';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    addLead({ kind: 'tour', payload: { listingId: listing.id, ...form } });
    setSubmitted(true);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h3>Schedule a tour</h3>
          <button type="button" className="btn-icon" onClick={onClose}><X size={18}/></button>
        </div>

        {submitted ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '36px 22px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <CheckCircle2 size={28}/>
            </div>
            <h4 style={{ fontSize: 18, fontWeight: 800 }}>Tour requested</h4>
            <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 13 }}>
              A specialist will contact you on <b>{form.phone}</b> within 24 hours to confirm
              your tour at <b>{listing.compound}</b>.
            </p>
            <button className="btn btn-brand" style={{ marginTop: 18 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Full name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                {errors.name && <span className="pm-form-err">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+20 …"/>
                {errors.phone && <span className="pm-form-err">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                {errors.email && <span className="pm-form-err">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label>Preferred date *</label>
                <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}/>
                {errors.date && <span className="pm-form-err">{errors.date}</span>}
              </div>
              <div className="form-group">
                <label>Preferred time *</label>
                <input type="time" value={form.time} onChange={e => setForm({...form, time: e.target.value})}/>
                {errors.time && <span className="pm-form-err">{errors.time}</span>}
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label>Notes (optional)</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}/>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn btn-brand" onClick={submit}><Calendar size={13}/> Request tour</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Inquiry modal (lead capture #5).
const InquiryModal = ({ listing, onClose }) => {
  const [form, setForm] = useState({ name: '', phone: '', message: `I'm interested in MLS ${listing.id} (${listing.compound}). Please get in touch.` });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const submit = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!/^[\d+\s-]{8,}$/.test(form.phone)) e.phone = 'Enter a valid phone';
    if (!form.message.trim()) e.message = 'Required';
    setErrors(e);
    if (Object.keys(e).length) return;
    addLead({ kind: 'inquiry', payload: { listingId: listing.id, ...form } });
    setSubmitted(true);
  };
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <div className="modal-header">
          <h3>I'm interested</h3>
          <button type="button" className="btn-icon" onClick={onClose}><X size={18}/></button>
        </div>
        {submitted ? (
          <div className="modal-body" style={{ textAlign: 'center', padding: '36px 22px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}><CheckCircle2 size={28}/></div>
            <h4 style={{ fontSize: 18, fontWeight: 800 }}>Inquiry sent</h4>
            <p style={{ color: 'var(--text-secondary)', marginTop: 6, fontSize: 13 }}>An agent will reach you on <b>{form.phone}</b> shortly.</p>
            <button className="btn btn-brand" style={{ marginTop: 18 }} onClick={onClose}>Close</button>
          </div>
        ) : (
          <>
            <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="form-group">
                <label>Full name *</label>
                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})}/>
                {errors.name && <span className="pm-form-err">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Phone *</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+20 …"/>
                {errors.phone && <span className="pm-form-err">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Message *</label>
                <textarea rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})}/>
                {errors.message && <span className="pm-form-err">{errors.message}</span>}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={onClose}>Cancel</button>
              <button className="btn btn-brand" onClick={submit}><Send size={13}/> Send inquiry</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const store = useMarketplaceStore();
  const listing = useMemo(() => PM_LISTINGS.find(l => l.id === id), [id]);

  const [imgIx, setImgIx] = useState(0);
  const [showTour, setShowTour] = useState(false);
  const [showInquiry, setShowInquiry] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  // Mortgage estimate (assume 20% down, 8% APR, 15 years — readable defaults).
  const [downPct, setDownPct] = useState(20);
  const [years, setYears] = useState(15);
  const annualRate = 18; // EG market default for the demo

  // ?action=tour deep-links straight into the tour modal.
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    if (p.get('action') === 'tour') setShowTour(true);
  }, [location.search]);

  if (!listing) {
    return (
      <div className="pm-section" style={{textAlign:'center',padding:'80px 24px'}}>
        <h1 style={{fontSize:24,fontWeight:800}}>Listing not found</h1>
        <p style={{color:'#6b7280',marginTop:8}}>MLS {id} doesn't exist or has been removed.</p>
        <button className="pm-btn-primary" style={{marginTop:18}} onClick={() => navigate('/marketplace/buy')}>Back to Buy</button>
      </div>
    );
  }

  const gallery = buildGallery(listing);
  const isFav = store.favorites.includes(listing.id);
  const isCmp = store.compare.includes(listing.id);
  const priceM = parseFloat((listing.price + '').replace(/[^\d.]/g, ''));
  const priceEgp = priceM * 1_000_000;
  const downPayment = priceEgp * (downPct / 100);
  const loan = priceEgp - downPayment;
  const monthly = monthlyPayment(loan, annualRate, years);

  // Similar listings — same city, exclude this one, 3 picks.
  const similar = PM_LISTINGS.filter(l => l.id !== listing.id && l.city === listing.city).slice(0, 3);

  const onShare = async () => {
    const url = buildShareUrl(`/marketplace/listings/${listing.id}`);
    try {
      if (navigator.share) {
        await navigator.share({ title: `${listing.compound} — Homes`, text: `EGP ${listing.price}M · ${listing.beds}BD · ${listing.baths}BA`, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      } else {
        window.prompt('Copy this link:', url);
      }
    } catch { /* user cancelled */ }
  };

  return (
    <div className="pm-detail">
      {/* Breadcrumb only — back button removed per UX feedback */}
      <div className="pm-detail-top">
        <Breadcrumb items={[
          { label: 'Buy', to: '/marketplace/buy' },
          { label: listing.compound },
        ]} />
      </div>

      {/* Gallery */}
      <section className="pm-detail-gallery">
        <div className="pm-detail-main-img" style={{ backgroundImage: `url(${gallery[imgIx]?.src})` }}>
          {gallery.length > 1 && (
            <>
              <button type="button" className="pm-gallery-arrow left" onClick={() => setImgIx((imgIx - 1 + gallery.length) % gallery.length)} aria-label="Previous"><ChevronLeft size={18}/></button>
              <button type="button" className="pm-gallery-arrow right" onClick={() => setImgIx((imgIx + 1) % gallery.length)} aria-label="Next"><ChevronRight size={18}/></button>
              <div className="pm-gallery-counter">{imgIx + 1} / {gallery.length}</div>
            </>
          )}
        </div>
        <div className="pm-detail-thumbs">
          {gallery.map((g, i) => (
            <button key={g.id} type="button" className={`pm-detail-thumb ${i === imgIx ? 'active' : ''}`} style={{ backgroundImage: `url(${g.src})` }} onClick={() => setImgIx(i)} aria-label={`Photo ${i+1}`} />
          ))}
        </div>
      </section>

      {/* Two-column body */}
      <section className="pm-detail-body">
        <div className="pm-detail-main">
          {/* Title block */}
          <div className="pm-detail-titlebar">
            <div>
              <h1 className="pm-detail-price">EGP {listing.price}</h1>
              <div className="pm-detail-loc"><MapPin size={14}/> {listing.compound} · {listing.city}</div>
              <div className="pm-detail-mls">MLS {listing.id} · Listed by Homes</div>
            </div>
            <div className="pm-detail-actions">
              <button type="button" className={`pm-detail-iconbtn ${isFav ? 'active' : ''}`} onClick={() => toggleFavorite(listing.id)} title={isFav ? 'Remove from favorites' : 'Add to favorites'}>
                <Heart size={16}/>
              </button>
              <button type="button" className={`pm-detail-iconbtn ${isCmp ? 'active' : ''}`} onClick={() => { const r = toggleCompare(listing.id); if (r.reason) window.alert(r.reason); }} title={`Compare (${store.compare.length}/${COMPARE_MAX})`}>
                <GitCompare size={16}/>
              </button>
              <button type="button" className="pm-detail-iconbtn" onClick={onShare} title="Share">
                <Share2 size={16}/>
              </button>
              {shareCopied && <span className="pm-share-copied">Link copied</span>}
            </div>
          </div>

          {/* Specs strip */}
          <div className="pm-detail-specs">
            <div><BedDouble size={18}/><div><div className="lbl">Bedrooms</div><div className="val">{listing.beds}</div></div></div>
            <div><Bath size={18}/><div><div className="lbl">Bathrooms</div><div className="val">{listing.baths}</div></div></div>
            <div><Maximize2 size={18}/><div><div className="lbl">Size</div><div className="val">{listing.sqft.toLocaleString()} m²</div></div></div>
            <div><MapPin size={18}/><div><div className="lbl">City</div><div className="val">{listing.city}</div></div></div>
          </div>

          {/* Description */}
          <div className="pm-detail-section">
            <h2>About this property</h2>
            <p>
              {listing.compound} is a verified Homes listing in {listing.city}.
              This {listing.beds}-bedroom, {listing.baths}-bathroom unit
              spans {listing.sqft.toLocaleString()} m² and is offered at EGP {listing.price} million.
              Schedule a private tour or send an inquiry — a Homes specialist will respond within 24 hours.
            </p>
          </div>

          {/* Mortgage estimate */}
          <div className="pm-detail-section">
            <h2><Calculator size={18} style={{verticalAlign:-3,marginRight:6}}/>Mortgage estimate</h2>
            <div className="pm-mortgage-card">
              <div className="row">
                <label>Down payment <strong>{downPct}%</strong></label>
                <input type="range" min="10" max="50" step="5" value={downPct} onChange={e => setDownPct(parseInt(e.target.value, 10))}/>
              </div>
              <div className="row">
                <label>Term <strong>{years} years</strong></label>
                <input type="range" min="5" max="25" step="5" value={years} onChange={e => setYears(parseInt(e.target.value, 10))}/>
              </div>
              <div className="results">
                <div><div className="lbl">Loan amount</div><div className="val">EGP {fmtEgp(Math.round(loan))}</div></div>
                <div><div className="lbl">Down payment</div><div className="val">EGP {fmtEgp(Math.round(downPayment))}</div></div>
                <div className="hi"><div className="lbl">Monthly payment</div><div className="val">EGP {fmtEgp(Math.round(monthly))}</div></div>
              </div>
              <div className="footer">
                <span>Indicative · 18% APR · for full eligibility check</span>
                <button className="pm-btn-outline" onClick={() => navigate(`/marketplace/mortgage?price=${Math.round(priceEgp)}&down=${Math.round(downPayment)}&years=${years}`)}>
                  Open full calculator
                </button>
              </div>
            </div>
          </div>

          {/* Map placeholder (small) */}
          <div className="pm-detail-section">
            <h2>Location</h2>
            <div className="pm-detail-map" style={{
              backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${listing.lat},${listing.lng}&zoom=12&size=720x320&scale=2&markers=color:0xE8672A%7C${listing.lat},${listing.lng})`,
            }}>
              <div className="overlay">
                <strong>{listing.compound}</strong>
                <span>{listing.city}, Egypt</span>
              </div>
            </div>
          </div>

          {/* Similar listings */}
          {similar.length > 0 && (
            <div className="pm-detail-section">
              <h2>Similar properties in {listing.city}</h2>
              <div className="pm-similar-grid">
                {similar.map(l => (
                  <button key={l.id} type="button" className="pm-card pm-similar-card" onClick={() => navigate(`/marketplace/listings/${l.id}`)}>
                    <div className="pm-card-img" style={{ backgroundImage: `url(${l.img})` }} />
                    <div className="pm-card-body">
                      <div className="pm-card-price">EGP {l.price}</div>
                      <div className="pm-card-meta">
                        <span><BedDouble size={11}/> {l.beds}BD</span>
                        <span><Bath size={11}/> {l.baths}BA</span>
                        <span><Maximize2 size={11}/> {l.sqft}m²</span>
                      </div>
                      <div className="pm-card-loc"><MapPin size={11}/> {l.compound}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right rail — agent contact */}
        <aside className="pm-detail-aside">
          <div className="pm-agent-card">
            <div className="pm-agent-head">
              <div className="pm-agent-avatar">HM</div>
              <div>
                <div className="name">Homes Specialist</div>
                <div className="role">Licensed agent · {listing.city}</div>
              </div>
            </div>
            <div className="pm-agent-body">
              <button type="button" className="pm-btn-primary" onClick={() => setShowTour(true)}><Calendar size={14}/> Schedule a tour</button>
              <button type="button" className="pm-btn-outline" onClick={() => setShowInquiry(true)}><Send size={14}/> I'm interested</button>
              <a className="pm-btn-outline" href={`tel:${phoneLink}`} onClick={() => onPhoneCall({ listing: listing.id })}><Phone size={14}/> Call agent</a>
              <a className="pm-btn-whatsapp" href={buildWhatsAppUrl({ listing, message: `I'm interested in ${listing.compound}.` })} target="_blank" rel="noopener noreferrer" onClick={() => onWhatsApp({ listing: listing.id })}>
                <MessageCircle size={14}/> WhatsApp
              </a>
            </div>
            <div className="pm-agent-foot">
              <span>{phoneLink} · 24h response</span>
            </div>
          </div>

          <div className="pm-agent-card pm-agent-trust">
            <h4>Why Homes</h4>
            <ul>
              <li>Verified MLS-tagged listings only</li>
              <li>Direct line to a licensed agent — no middlemen</li>
              <li>Free mortgage pre-qualification</li>
              <li>Saved searches + favorites synced on this device</li>
            </ul>
          </div>
        </aside>
      </section>

      {showTour && <TourModal listing={listing} onClose={() => setShowTour(false)} />}
      {showInquiry && <InquiryModal listing={listing} onClose={() => setShowInquiry(false)} />}
    </div>
  );
};
