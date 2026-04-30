import { useState } from 'react';
import { Plus, Minus, CheckCircle2 } from 'lucide-react';
import { PM_HOW_IT_WORKS, PM_FAQ_SELL } from '../../data/publicMarketplaceData';
import { addLead } from '../../data/marketplaceStore';

export const Sell = () => {
  const [open, setOpen] = useState(0);
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    propertyType: '', city: '', subType: '', address: '',
    agree: true,
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (!form.name.trim()) err.name = 'Required';
    if (!/^[\d+\s-]{8,}$/.test(form.phone)) err.phone = 'Enter a valid phone';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Invalid email';
    if (!form.propertyType) err.propertyType = 'Required';
    if (!form.city) err.city = 'Required';
    if (!form.address.trim()) err.address = 'Required';
    if (!form.agree) err.agree = 'You must agree';
    setErrors(err);
    if (Object.keys(err).length) return;
    addLead({ kind: 'sell', payload: form });
    setSubmitted(true);
  };

  return (
    <>
      <section className="pm-feature-hero">
        <div>
          <h1>Sell Your Property<br/>with <span className="accent">Confidence</span></h1>
          <p className="lead">Whether you're selling an apartment in Cairo or a villa on the coast, Homes connects you with the right buyers and guides you through every step.</p>
          <div className="ctas">
            <button className="pm-btn-primary" onClick={()=>document.getElementById('pm-sell-form')?.scrollIntoView({behavior:'smooth'})}>Get Started ↗</button>
            <button className="pm-btn-outline">Get in Touch</button>
          </div>
        </div>
        <div className="pm-feature-hero-art" />
      </section>

      <section className="pm-section tight">
        <h2>How It Works</h2>
        <p className="lead">Selling your property through Homes is straightforward. Here's what to expect.</p>
        <div className="pm-steps">
          {PM_HOW_IT_WORKS.map(step => (
            <div key={step.n} className="pm-step">
              <div className="pm-step-num">{step.n}</div>
              <h4>{step.title}</h4>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{maxWidth:1280,margin:'0 auto',padding:'0 28px'}}>
        <div className="pm-cta-banner">
          <h3>Ready to Sell? Get Started Today</h3>
          <p>Submit your property details and our team will reach out within 24 hours.</p>
          <button className="btn-cta" onClick={()=>document.getElementById('pm-sell-form')?.scrollIntoView({behavior:'smooth'})}>Get Started ↗</button>
        </div>
      </section>

      <section className="pm-section tight" id="pm-sell-form">
        <h2>Submit Your Property Details</h2>
        <p className="lead">Tell us about your property and our team will reach out within 24 hours with a free valuation.</p>

        {submitted ? (
          <div className="pm-form-card" style={{ marginTop: 28, textAlign: 'center', padding: '40px 22px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <CheckCircle2 size={28}/>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>Thanks {form.name.split(' ')[0]} — your property is in the queue</h3>
            <p style={{ color: '#6b7280', marginTop: 8 }}>
              A Homes specialist will call you on <b>{form.phone}</b> within 24 hours
              with a free valuation for your <b>{form.propertyType}</b> in <b>{form.city}</b>.
            </p>
            <button type="button" className="pm-btn-outline" style={{ marginTop: 18 }} onClick={() => { setSubmitted(false); setForm({...form, name:'',phone:'',email:''}); }}>Submit another property</button>
          </div>
        ) : (
          <form className="pm-form-card" style={{ marginTop: 28 }} onSubmit={submit}>
            <h3>Owner Information</h3>
            <div className="pm-form-row">
              <div className="pm-form-field"><label>Full Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Your Full Name"/>{errors.name && <span className="pm-form-err">{errors.name}</span>}</div>
              <div className="pm-form-field"><label>Phone Number *</label><input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="+20 xxx xxx xxxx"/>{errors.phone && <span className="pm-form-err">{errors.phone}</span>}</div>
            </div>
            <div className="pm-form-row single">
              <div className="pm-form-field"><label>Email *</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="you@example.com"/>{errors.email && <span className="pm-form-err">{errors.email}</span>}</div>
            </div>

            <h3 style={{marginTop:24}}>Property Details</h3>
            <div className="pm-form-row">
              <div className="pm-form-field"><label>Property Type *</label>
                <select value={form.propertyType} onChange={e => setForm({...form, propertyType: e.target.value})}><option value="">Select type</option><option>Apartment</option><option>Villa</option><option>Townhouse</option><option>Penthouse</option><option>Chalet</option></select>
                {errors.propertyType && <span className="pm-form-err">{errors.propertyType}</span>}
              </div>
              <div className="pm-form-field"><label>City / Area *</label>
                <select value={form.city} onChange={e => setForm({...form, city: e.target.value})}><option value="">Select city</option><option>New Cairo</option><option>6th of October</option><option>Sheikh Zayed</option><option>North Coast</option><option>New Capital</option></select>
                {errors.city && <span className="pm-form-err">{errors.city}</span>}
              </div>
            </div>
            <div className="pm-form-row">
              <div className="pm-form-field"><label>Property Sub Type</label>
                <select value={form.subType} onChange={e => setForm({...form, subType: e.target.value})}><option value="">Select sub type</option><option>Standalone</option><option>Twin</option><option>Duplex</option></select>
              </div>
              <div className="pm-form-field"><label>Address / Location Description *</label><input value={form.address} onChange={e => setForm({...form, address: e.target.value})} placeholder="e.g. Compound Azure, Fifth Settlement"/>{errors.address && <span className="pm-form-err">{errors.address}</span>}</div>
            </div>

            <div className="pm-form-checkbox">
              <input type="checkbox" id="agree" checked={form.agree} onChange={e => setForm({...form, agree: e.target.checked})}/>
              <label htmlFor="agree">I agree to be contacted by Homes regarding the sale of my property</label>
            </div>
            {errors.agree && <span className="pm-form-err">{errors.agree}</span>}
            <button type="submit" className="pm-form-submit">Submit Property Details</button>
          </form>
        )}
      </section>

      <section className="pm-section tight">
        <h2>Frequently Asked Questions</h2>
        <p className="lead">Common questions about selling property in Egypt.</p>
        <div className="pm-faq" style={{ marginTop: 24 }}>
          {PM_FAQ_SELL.map((f, i) => (
            <div key={i} className="pm-faq-item" onClick={() => setOpen(open===i ? -1 : i)}>
              <div className="pm-faq-q">
                <span>{f.q}</span>
                <span className="plus">{open===i ? <Minus size={14}/> : <Plus size={14}/>}</span>
              </div>
              {open===i && <div className="pm-faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
