import { useState } from 'react';
import { Calculator, Calendar, BarChart3, Search, Plus, Minus, ArrowRight } from 'lucide-react';
import { PM_FAQ_MORTGAGE, PM_MORTGAGE_FEATURES } from '../../data/publicMarketplaceData';

const ICONS = [Calculator, Calendar, BarChart3, Search];

export const Mortgage = () => {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(0);

  return (
    <>
      <section className="pm-feature-hero">
        <div>
          <h1>Mortgages Made <span className="accent">Simple</span></h1>
          <p className="lead">Whether you're a first-time buyer or looking to upgrade, Homes helps you understand, calculate, and apply for a mortgage.</p>
          <div className="ctas">
            <button type="button" className="pm-btn-primary" onClick={() => document.getElementById('pm-mortgage-calc')?.scrollIntoView({ behavior: 'smooth' })}><Calculator size={14}/> Calculate Mortgage</button>
            <button type="button" className="pm-btn-outline" onClick={() => document.getElementById('pm-bank-form')?.scrollIntoView({ behavior: 'smooth' })}>Get in Touch</button>
          </div>
        </div>
        <div className="pm-feature-hero-art" style={{ position: 'relative' }}>
          <div className="pm-feature-hero-chip" style={{ top: 60, right: -20 }}>
            <div className="ico"><Calendar size={16}/></div>
            <div><div className="lbl">Calculate Repayments</div><div className="meta">See your monthly costs</div></div>
          </div>
          <div className="pm-feature-hero-chip" style={{ bottom: 50, right: -20 }}>
            <div className="ico"><BarChart3 size={16}/></div>
            <div><div className="lbl">Check Affordability</div><div className="meta">Know your borrowing power</div></div>
          </div>
        </div>
      </section>

      <section className="pm-section tight">
        <div className="pm-features-row">
          {PM_MORTGAGE_FEATURES.map((f, i) => {
            const Icon = ICONS[i];
            return (
              <div key={f.title} className="pm-feature-card">
                <div className="ico"><Icon size={20}/></div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="pm-section tight" id="pm-mortgage-calc">
        <h2>Mortgage Calculator</h2>
        <p className="lead">Answer a few questions to see what you could afford.</p>

        <div className="pm-stepper" style={{ marginTop: 28 }}>
          {[1,2,3].map(n => (
            <div key={n} className={`pm-stepper-item ${step===n?'active':''}`}>
              <div className="pm-stepper-num">{n}</div>
              <div className="pm-stepper-label">{['Down Payment','Annual Income','Mortgage Term'][n-1]}</div>
            </div>
          ))}
        </div>

        <div className="pm-calc-card">
          <div className="pm-calc-form">
            <div style={{fontSize:11,color:'#9ca3af',fontWeight:700,marginBottom:6}}>STEP {step} OF 3</div>
            {step === 1 && (<>
              <h3 style={{marginBottom:6}}>How much is your down payment?</h3>
              <p style={{fontSize:12,color:'#6b7280',marginBottom:18}}>Enter the amount you've saved for your deposit.</p>
              <div className="pm-form-field"><label>Down Payment *</label><input type="number" placeholder="984564165" /></div>
            </>)}
            {step === 2 && (<>
              <h3 style={{marginBottom:6}}>What is your annual income?</h3>
              <p style={{fontSize:12,color:'#6b7280',marginBottom:18}}>This helps banks assess your affordability.</p>
              <div className="pm-form-field"><label>Annual Income (EGP) *</label><input type="number" placeholder="600000" /></div>
            </>)}
            {step === 3 && (<>
              <h3 style={{marginBottom:6}}>Preferred mortgage term?</h3>
              <p style={{fontSize:12,color:'#6b7280',marginBottom:18}}>How long would you like to repay over?</p>
              <div className="pm-form-field"><label>Term (Years) *</label>
                <select defaultValue=""><option value="">Select term</option><option>5 years</option><option>10 years</option><option>15 years</option><option>20 years</option><option>25 years</option></select>
              </div>
            </>)}
            <div style={{display:'flex',gap:8,marginTop:18}}>
              {step > 1 && <button className="pm-btn-outline" onClick={()=>setStep(s=>s-1)}>← Back</button>}
              {step < 3 ? (
                <button className="pm-btn-primary" onClick={()=>setStep(s=>s+1)}>Next <ArrowRight size={14}/></button>
              ) : (
                <button className="pm-btn-primary" onClick={()=>alert('Affordability calculated (demo)')}>Calculate</button>
              )}
            </div>
          </div>
          <aside className="pm-calc-aside">
            <h4>About Down Payments</h4>
            In Egypt, most banks require a minimum down payment of 15%–20% of the property value.
            A larger deposit means you'll borrow less, resulting in lower monthly repayments and less interest paid overall.
          </aside>
        </div>
      </section>

      <section className="pm-section tight" id="pm-bank-form">
        <h2>Form For Bank</h2>
        <p className="lead">Tell us about your property and our team will reach out within 24 hours.</p>

        <form className="pm-form-card" style={{ marginTop: 28 }} onSubmit={e=>{e.preventDefault(); alert('Bank form submitted (demo)');}}>
          <div className="pm-form-row">
            <div className="pm-form-field"><label>Name *</label><input placeholder="Your Full Name" required/></div>
            <div className="pm-form-field"><label>Mobile Number *</label><input placeholder="+20 xxx xxx xxxx" required/></div>
          </div>
          <div className="pm-form-row single">
            <div className="pm-form-field"><label>Email *</label><input type="email" placeholder="you@example.com" required/></div>
          </div>
          <div className="pm-form-row">
            <div className="pm-form-field"><label>Select your occupation *</label>
              <select required defaultValue=""><option value="">Select occupation</option><option>Architect</option><option>Engineer</option><option>Doctor</option><option>Banker</option><option>Other</option></select>
            </div>
            <div className="pm-form-field"><label>Select your Income *</label>
              <select required defaultValue=""><option value="">Select Income</option><option>10K – 30K</option><option>30K – 80K</option><option>80K – 200K</option><option>200K+</option></select>
            </div>
          </div>
          <div className="pm-form-row single">
            <div className="pm-form-field"><label>Price of the unit to be financed</label><input type="number" placeholder="Price of the unit to be financed" /></div>
          </div>
          <div className="pm-form-checkbox">
            <input type="checkbox" id="bank-agree" defaultChecked/>
            <label htmlFor="bank-agree">I agree to share my personal data with the bank to provide real estate financing services.</label>
          </div>
          <button type="submit" className="pm-form-submit">Send Request</button>
        </form>
      </section>

      <section className="pm-section tight">
        <h2>Mortgage Guide for Egypt</h2>
        <p className="lead">Everything you need to know about getting a mortgage in Egypt.</p>
        <div className="pm-faq" style={{ marginTop: 24 }}>
          {PM_FAQ_MORTGAGE.map((f, i) => (
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
