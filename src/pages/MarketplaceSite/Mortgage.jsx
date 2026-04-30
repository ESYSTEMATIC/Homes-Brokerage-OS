import { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Calculator, Calendar, BarChart3, Search, Plus, Minus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { PM_FAQ_MORTGAGE, PM_MORTGAGE_FEATURES } from '../../data/publicMarketplaceData';
import { addLead } from '../../data/marketplaceStore';

// Pure SVG doughnut — equivalent to Chart.js's `doughnut` for Principal vs Interest.
const Doughnut = ({ parts, centerLabel, centerValue, size = 200, stroke = 30 }) => {
  const total = parts.reduce((s, p) => s + Math.max(0, p.value), 0) || 1;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} style={{ display: 'block', margin: '0 auto' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f3f5" strokeWidth={stroke} />
      {parts.map((p, i) => {
        const len = (p.value / total) * c;
        const dash = `${len} ${c - len}`;
        const offset = c * 0.25 - acc; // start at top
        acc += len;
        return (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none"
            stroke={p.color} strokeWidth={stroke} strokeDasharray={dash} strokeDashoffset={offset}
            transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="butt"
          />
        );
      })}
      {centerLabel && <text x="50%" y="46%" textAnchor="middle" fontSize="11" fill="#94a3b8" fontFamily="var(--font)">{centerLabel}</text>}
      {centerValue && <text x="50%" y="58%" textAnchor="middle" fontSize="14" fontWeight="800" fill="#0f172a" fontFamily="var(--font)">{centerValue}</text>}
    </svg>
  );
};

const ICONS = [Calculator, Calendar, BarChart3, Search];

const fmtEgp = (n) => new Intl.NumberFormat('en-EG').format(Math.round(n));
const monthlyPayment = (principal, annualRate, years) => {
  const r = annualRate / 12 / 100;
  const n = years * 12;
  if (r === 0 || n === 0) return n === 0 ? 0 : principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
};
const ANNUAL_RATE = 18; // EG market default for the demo

// Income eligibility — banks usually cap monthly installment at ~33% of monthly income.
const ELIGIBILITY_RATIO = 0.33;

export const Mortgage = () => {
  const location = useLocation();

  // Read deep-link params from listing detail (?price=…&down=…&years=…)
  const seed = useMemo(() => {
    const p = new URLSearchParams(location.search);
    return {
      price: parseInt(p.get('price') || '0', 10) || '',
      down:  parseInt(p.get('down')  || '0', 10) || '',
      years: parseInt(p.get('years') || '0', 10) || '',
    };
  }, [location.search]);

  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(0);
  const [calc, setCalc] = useState({
    propertyPrice: seed.price || 5000000,
    downPayment:   seed.down  || 1000000,
    annualIncome:  600000,
    years:         seed.years || 15,
  });
  const [errors, setErrors] = useState({});
  const [showResult, setShowResult] = useState(Boolean(seed.price));

  // Bank form (lead capture #5)
  const [bankForm, setBankForm] = useState({
    name: '', phone: '', email: '',
    occupation: '', income: '',
    unitPrice: seed.price || '',
    agree: true,
  });
  const [bankErr, setBankErr] = useState({});
  const [bankSent, setBankSent] = useState(false);

  // Auto-recompute results whenever calc fields change after first calculate.
  const monthly = useMemo(() => {
    const loan = Math.max(0, calc.propertyPrice - calc.downPayment);
    return monthlyPayment(loan, ANNUAL_RATE, calc.years);
  }, [calc]);
  const totalInterest = monthly * calc.years * 12 - (calc.propertyPrice - calc.downPayment);
  const totalCost = (calc.propertyPrice - calc.downPayment) + totalInterest;
  const monthlyIncome = calc.annualIncome / 12;
  const eligibleMonthly = monthlyIncome * ELIGIBILITY_RATIO;
  const eligible = monthly <= eligibleMonthly;

  // Validation per step (BRD-equivalent: ≥15% down, ≥0 income, term 1-25y)
  const validateStep = (s) => {
    const e = {};
    if (s >= 1) {
      if (!calc.propertyPrice || calc.propertyPrice <= 0) e.propertyPrice = 'Required';
      if (!calc.downPayment   || calc.downPayment   <= 0) e.downPayment = 'Required';
      else if (calc.downPayment >= calc.propertyPrice)    e.downPayment = 'Down payment must be less than the price';
      else if ((calc.downPayment / calc.propertyPrice) < 0.15) e.downPayment = 'Banks require at least 15% down';
    }
    if (s >= 2) {
      if (!calc.annualIncome || calc.annualIncome <= 0) e.annualIncome = 'Required';
    }
    if (s >= 3) {
      if (!calc.years || calc.years < 1 || calc.years > 25) e.years = 'Term must be 1–25 years';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep(step)) setStep(s => Math.min(3, s + 1)); };
  const calculate = () => { if (validateStep(3)) setShowResult(true); };

  const submitBankForm = (e) => {
    e.preventDefault();
    const err = {};
    if (!bankForm.name.trim()) err.name = 'Required';
    if (!/^[\d+\s-]{8,}$/.test(bankForm.phone)) err.phone = 'Enter a valid phone';
    if (!/^\S+@\S+\.\S+$/.test(bankForm.email)) err.email = 'Invalid email';
    if (!bankForm.occupation) err.occupation = 'Required';
    if (!bankForm.income) err.income = 'Required';
    if (!bankForm.agree) err.agree = 'You must agree';
    setBankErr(err);
    if (Object.keys(err).length) return;

    addLead({
      kind: 'mortgage',
      payload: {
        ...bankForm,
        unitPrice: bankForm.unitPrice ? Number(bankForm.unitPrice) : calc.propertyPrice,
        downPayment: calc.downPayment,
        years: calc.years,
        monthly: Math.round(monthly),
        annualIncome: calc.annualIncome,
        eligible,
      },
    });
    setBankSent(true);
  };

  // Reset eligibility/result if the user edits inputs after seeing results.
  useEffect(() => { /* result auto-updates via useMemo */ }, [calc]);

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
        <h2>{showResult ? 'Your Results' : 'Mortgage Calculator'}</h2>
        <p className="lead">{showResult ? `Based on EGP ${fmtEgp(calc.propertyPrice)} property over ${calc.years} years at ${ANNUAL_RATE}% APR.` : 'Answer a few questions to see what you could afford.'}</p>

        <div className="pm-stepper" style={{ marginTop: 28 }}>
          {[1,2,3].map(n => (
            <div key={n} className={`pm-stepper-item ${showResult ? 'done' : (step===n?'active':'')}`}>
              <div className="pm-stepper-num">{showResult ? '✓' : n}</div>
              <div className="pm-stepper-label">{['Down Payment','Annual Income','Mortgage Term'][n-1]}</div>
            </div>
          ))}
        </div>

        {/* Wizard hides once we have results — replaced inline by the
            results card per EREP pattern. */}
        {!showResult && (
        <div className="pm-calc-card">
          <div className="pm-calc-form">
            <div style={{fontSize:11,color:'#9ca3af',fontWeight:700,marginBottom:6}}>STEP {step} OF 3</div>

            {step === 1 && (
              <>
                <h3 style={{marginBottom:6}}>Property price &amp; down payment</h3>
                <p style={{fontSize:12,color:'#6b7280',marginBottom:18}}>Banks in Egypt require a minimum 15% down payment.</p>
                <div className="pm-form-field">
                  <label>Property price (EGP) *</label>
                  <input type="number" value={calc.propertyPrice} onChange={e => setCalc({...calc, propertyPrice: Number(e.target.value)})} placeholder="5,000,000"/>
                  {errors.propertyPrice && <span className="pm-form-err">{errors.propertyPrice}</span>}
                </div>
                <div className="pm-form-field">
                  <label>Down payment (EGP) * <span style={{color:'#94a3b8',fontWeight:500}}>{calc.propertyPrice ? `≈ ${Math.round((calc.downPayment/calc.propertyPrice)*100)}%` : ''}</span></label>
                  <input type="number" value={calc.downPayment} onChange={e => setCalc({...calc, downPayment: Number(e.target.value)})} placeholder="1,000,000"/>
                  {errors.downPayment && <span className="pm-form-err">{errors.downPayment}</span>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3 style={{marginBottom:6}}>What is your annual income?</h3>
                <p style={{fontSize:12,color:'#6b7280',marginBottom:18}}>This helps banks assess your affordability.</p>
                <div className="pm-form-field">
                  <label>Annual income (EGP) *</label>
                  <input type="number" value={calc.annualIncome} onChange={e => setCalc({...calc, annualIncome: Number(e.target.value)})} placeholder="600,000"/>
                  {errors.annualIncome && <span className="pm-form-err">{errors.annualIncome}</span>}
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <h3 style={{marginBottom:6}}>Preferred mortgage term?</h3>
                <p style={{fontSize:12,color:'#6b7280',marginBottom:18}}>How long would you like to repay over?</p>
                <div className="pm-form-field">
                  <label>Term (Years) *</label>
                  <select value={calc.years} onChange={e => setCalc({...calc, years: Number(e.target.value)})}>
                    {[5,10,15,20,25].map(y => <option key={y} value={y}>{y} years</option>)}
                  </select>
                  {errors.years && <span className="pm-form-err">{errors.years}</span>}
                </div>
              </>
            )}

            <div style={{display:'flex',gap:8,marginTop:18}}>
              {step > 1 && <button type="button" className="pm-btn-outline" onClick={()=>setStep(s=>s-1)}>← Back</button>}
              {step < 3 ? (
                <button type="button" className="pm-btn-primary" onClick={next}>Next <ArrowRight size={14}/></button>
              ) : (
                <button type="button" className="pm-btn-primary" onClick={calculate}>Calculate</button>
              )}
            </div>
          </div>

          <aside className="pm-calc-aside">
            <h4>About Down Payments</h4>
            In Egypt, most banks require a minimum down payment of 15%–20% of the property value.
            A larger deposit means you'll borrow less, resulting in lower monthly repayments and less interest paid overall.
          </aside>
        </div>
        )}

        {/* Inline results — replaces the wizard once user clicks Calculate
            (matches EREP's `ResultsStep` inline-replacement pattern). */}
        {showResult && Object.keys(errors).length === 0 && (
          <div className="pm-mortgage-result">
            <div className="pm-result-card">
              <div className="pm-result-left">
                <div className="pm-result-headline">
                  <div className="lbl">Estimated monthly repayment</div>
                  <div className="hi">EGP {fmtEgp(monthly)}</div>
                  <div className="sub">at {ANNUAL_RATE}% APR · {calc.years} years</div>
                </div>
                <div className="pm-result-headline secondary">
                  <div className="lbl">Property price you can afford</div>
                  <div className="val">EGP {fmtEgp(calc.propertyPrice)}</div>
                  <div className="sub">Based on {calc.annualIncome ? `EGP ${fmtEgp(calc.annualIncome)} annual income` : 'your inputs'}</div>
                </div>

                <ul className="pm-result-rows">
                  <li><span>Mortgage Amount</span><b>EGP {fmtEgp(calc.propertyPrice - calc.downPayment)}</b></li>
                  <li><span>Down Payment</span><b>EGP {fmtEgp(calc.downPayment)}</b></li>
                  <li><span>Mortgage Duration</span><b>{calc.years} years</b></li>
                  <li><span>Total Interest</span><b>EGP {fmtEgp(totalInterest)}</b></li>
                  <li><span>Total Cost</span><b>EGP {fmtEgp(calc.propertyPrice + totalInterest)}</b></li>
                </ul>

                <div className={`pm-result-eligibility ${eligible ? 'ok' : 'warn'}`}>
                  {eligible ? <CheckCircle2 size={16}/> : <Calculator size={16}/>}
                  <div>
                    <b>{eligible ? 'You appear eligible' : 'Affordability concern'}</b> —
                    cap is EGP {fmtEgp(eligibleMonthly)}/month, yours is EGP {fmtEgp(monthly)}.
                  </div>
                </div>

                <div className="pm-result-actions">
                  <button type="button" className="pm-btn-outline" onClick={() => { setShowResult(false); setStep(1); }}>Start Again</button>
                  <button type="button" className="pm-btn-primary" onClick={() => {
                    setBankForm({ ...bankForm, unitPrice: calc.propertyPrice });
                    document.getElementById('pm-bank-form')?.scrollIntoView({ behavior: 'smooth' });
                  }}>Get in Touch <ArrowRight size={14}/></button>
                </div>
              </div>

              {/* Doughnut — pure SVG so we don't add a charting dep */}
              <div className="pm-result-right">
                <Doughnut
                  parts={[
                    { label: 'Principal', value: calc.propertyPrice - calc.downPayment, color: 'var(--brand)' },
                    { label: 'Interest',  value: totalInterest,                          color: '#0f172a' },
                  ]}
                  centerLabel="Loan + Interest"
                  centerValue={`EGP ${fmtEgp(calc.propertyPrice - calc.downPayment + totalInterest)}`}
                />
                <div className="pm-result-legend">
                  <div><span className="dot" style={{background:'var(--brand)'}} />Principal · EGP {fmtEgp(calc.propertyPrice - calc.downPayment)}</div>
                  <div><span className="dot" style={{background:'#0f172a'}} />Interest · EGP {fmtEgp(totalInterest)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="pm-section tight" id="pm-bank-form">
        <h2>Form For Bank</h2>
        <p className="lead">Tell us about your property and our team will reach out within 24 hours.</p>

        {bankSent ? (
          <div className="pm-form-card" style={{ marginTop: 28, textAlign: 'center', padding: '40px 22px' }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(16,185,129,0.12)', color: 'var(--success)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
              <CheckCircle2 size={28}/>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800 }}>Request received</h3>
            <p style={{ color: '#6b7280', marginTop: 8 }}>
              Our mortgage team will contact you on <b>{bankForm.phone}</b> within 24 hours
              with options from partner banks.
            </p>
            <button type="button" className="pm-btn-outline" style={{ marginTop: 18 }} onClick={() => { setBankSent(false); }}>Submit another</button>
          </div>
        ) : (
          <form className="pm-form-card" style={{ marginTop: 28 }} onSubmit={submitBankForm}>
            <div className="pm-form-row">
              <div className="pm-form-field">
                <label>Name *</label>
                <input value={bankForm.name} onChange={e => setBankForm({...bankForm, name: e.target.value})} placeholder="Your full name"/>
                {bankErr.name && <span className="pm-form-err">{bankErr.name}</span>}
              </div>
              <div className="pm-form-field">
                <label>Mobile number *</label>
                <input value={bankForm.phone} onChange={e => setBankForm({...bankForm, phone: e.target.value})} placeholder="+20 xxx xxx xxxx"/>
                {bankErr.phone && <span className="pm-form-err">{bankErr.phone}</span>}
              </div>
            </div>
            <div className="pm-form-row single">
              <div className="pm-form-field">
                <label>Email *</label>
                <input type="email" value={bankForm.email} onChange={e => setBankForm({...bankForm, email: e.target.value})} placeholder="you@example.com"/>
                {bankErr.email && <span className="pm-form-err">{bankErr.email}</span>}
              </div>
            </div>
            <div className="pm-form-row">
              <div className="pm-form-field">
                <label>Occupation *</label>
                <select value={bankForm.occupation} onChange={e => setBankForm({...bankForm, occupation: e.target.value})}>
                  <option value="">Select occupation</option><option>Architect</option><option>Engineer</option><option>Doctor</option><option>Banker</option><option>Other</option>
                </select>
                {bankErr.occupation && <span className="pm-form-err">{bankErr.occupation}</span>}
              </div>
              <div className="pm-form-field">
                <label>Income band *</label>
                <select value={bankForm.income} onChange={e => setBankForm({...bankForm, income: e.target.value})}>
                  <option value="">Select income</option><option>10K – 30K</option><option>30K – 80K</option><option>80K – 200K</option><option>200K+</option>
                </select>
                {bankErr.income && <span className="pm-form-err">{bankErr.income}</span>}
              </div>
            </div>
            <div className="pm-form-row single">
              <div className="pm-form-field">
                <label>Price of the unit to be financed</label>
                <input type="number" value={bankForm.unitPrice} onChange={e => setBankForm({...bankForm, unitPrice: e.target.value})} placeholder="Property price (EGP)"/>
              </div>
            </div>
            <div className="pm-form-checkbox">
              <input type="checkbox" id="bank-agree" checked={bankForm.agree} onChange={e => setBankForm({...bankForm, agree: e.target.checked})}/>
              <label htmlFor="bank-agree">I agree to share my personal data with the bank to provide real estate financing services.</label>
            </div>
            {bankErr.agree && <span className="pm-form-err">{bankErr.agree}</span>}
            <button type="submit" className="pm-form-submit">Send request</button>
          </form>
        )}
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
