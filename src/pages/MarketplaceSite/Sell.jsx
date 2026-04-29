import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { PM_HOW_IT_WORKS, PM_FAQ_SELL } from '../../data/publicMarketplaceData';

export const Sell = () => {
  const [open, setOpen] = useState(0);

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

        <form className="pm-form-card" style={{ marginTop: 28 }} onSubmit={e=>{e.preventDefault(); alert('Property details submitted (demo)');}}>
          <h3>Owner Information</h3>
          <div className="pm-form-row">
            <div className="pm-form-field"><label>Full Name *</label><input placeholder="Your Full Name" required/></div>
            <div className="pm-form-field"><label>Phone Number *</label><input placeholder="+20 xxx xxx xxxx" required/></div>
          </div>
          <div className="pm-form-row single">
            <div className="pm-form-field"><label>Email *</label><input type="email" placeholder="you@example.com" required/></div>
          </div>

          <h3 style={{marginTop:24}}>Property Details</h3>
          <div className="pm-form-row">
            <div className="pm-form-field"><label>Property Type *</label>
              <select required defaultValue=""><option value="">Select type</option><option>Apartment</option><option>Villa</option><option>Townhouse</option><option>Penthouse</option><option>Chalet</option></select>
            </div>
            <div className="pm-form-field"><label>City / Area *</label>
              <select required defaultValue=""><option value="">Select city</option><option>New Cairo</option><option>6th of October</option><option>Sheikh Zayed</option><option>North Coast</option><option>New Capital</option></select>
            </div>
          </div>
          <div className="pm-form-row">
            <div className="pm-form-field"><label>Property Sub Type</label>
              <select defaultValue=""><option value="">Select sub type</option><option>Standalone</option><option>Twin</option><option>Duplex</option></select>
            </div>
            <div className="pm-form-field"><label>Address / Location Description *</label><input placeholder="e.g. Compound Azure, Fifth Settlement" required/></div>
          </div>

          <div className="pm-form-checkbox">
            <input type="checkbox" id="agree" defaultChecked/>
            <label htmlFor="agree">I agree to be contacted by Homes regarding the sale of my property</label>
          </div>
          <button type="submit" className="pm-form-submit">Submit Property Details</button>
        </form>
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
