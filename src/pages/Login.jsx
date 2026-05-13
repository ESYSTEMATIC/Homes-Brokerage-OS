import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HomesLogoBlack } from '../components/HomesLogo';
import { Target, Building2, GraduationCap, ShieldCheck, KeyRound, ChevronRight } from 'lucide-react';

// Microsoft 365 logo (4-square mark) — inline SVG.
const Microsoft365Logo = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg" aria-label="Microsoft">
    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
);

export const LoginPage = () => {
  const { signIn, PERSONAS, toast, writeAudit } = useApp();
  // Two states: 'start' (Sign in with Microsoft button) → 'persona' (account picker)
  const [step, setStep] = useState('start');
  const [splash, setSplash] = useState(false);

  const launchSSO = (key) => {
    setSplash(true);
    setTimeout(() => {
      writeAudit('SSO Login', `Microsoft Entra · ${PERSONAS[key].label}`, 'Security', `Email: ${PERSONAS[key].email}`);
      signIn(key);
      toast(`Welcome, ${PERSONAS[key].label.split(' ')[0]} — signed in via Microsoft 365`);
    }, 900);
  };

  if (splash) {
    return (
      <div className="sso-splash">
        <div className="ring" />
        <h2>Authenticating with Microsoft Entra…</h2>
        <p>Validating credentials and resolving role-based access</p>
      </div>
    );
  }

  return (
    <div className="login-shell">
      <div className="login-hero">
        <div>
          <img src={`${import.meta.env.BASE_URL}homes-logo-white.png`} alt="HOMES" style={{ height: 44 }} />
          <h1 style={{ marginTop: 36 }}>The brokerage <span>operating system</span> for Egypt.</h1>
          <p className="lead">Single sign-on at the Employee Board. From here you reach the federated Homes systems that your role is entitled to.</p>

          <div style={{fontSize:10,fontWeight:800,color:'rgba(255,255,255,.45)',letterSpacing:'.1em',textTransform:'uppercase',marginTop:32}}>Federated systems via SSO</div>
          <div className="systems-list" style={{marginTop:10}}>
            <div className="system-pill"><Target size={16}/>CRM</div>
            <div className="system-pill"><Building2 size={16}/>Marketplace Dashboard</div>
            <div className="system-pill"><ShieldCheck size={16}/>Backoffice Admin Portal</div>
            <div className="system-pill"><KeyRound size={16}/>Matrix EGMLS</div>
            <div className="system-pill"><GraduationCap size={16}/>Homes Academy</div>
          </div>
        </div>

        <div className="footer-note">© Homes Brokerage · Cairo · V1.3 · SSO via Microsoft Entra ID</div>
      </div>

      <div className="login-card-wrap">
        <div className="login-card">
          <div className="logo-wrap"><HomesLogoBlack height={44}/></div>

          {step === 'start' && (
            <>
              <h2>Sign in</h2>
              <div className="sub">All Homes employees sign in with their Microsoft 365 account. Access is governed by your role.</div>

              <button className="ms-button" onClick={()=>setStep('persona')}>
                <Microsoft365Logo size={18}/> Sign in with Microsoft
              </button>

              <div style={{marginTop:18,padding:'12px 14px',background:'#fafbfc',border:'1px solid var(--border)',borderRadius:8,fontSize:11,color:'var(--text-secondary)',lineHeight:1.6}}>
                Microsoft 365 (Entra ID) is the only sign-in method. Email/password and other identity providers are not supported.
              </div>
            </>
          )}

          {step === 'persona' && (
            <>
              <h2>Choose an account</h2>
              <div className="sub">All accounts authenticate through Microsoft 365 SSO. Pick one to enter the demo as that user.</div>
              <div className="quick-personas">
                {Object.entries(PERSONAS).map(([key, p]) => (
                  <button key={key} className="quick-persona" onClick={()=>launchSSO(key)}>
                    <div>
                      <div className="name">{p.label}</div>
                      <div className="role">{p.email}</div>
                    </div>
                    <span className="arrow"><ChevronRight size={16}/></span>
                  </button>
                ))}
              </div>
              <button onClick={()=>setStep('start')} style={{background:'none',border:'none',color:'var(--brand)',fontSize:12,cursor:'pointer',fontWeight:600,padding:0}}>← Back</button>
            </>
          )}

          <div className="terms">
            By signing in you agree to the Homes <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>. SSO sessions are audited.
          </div>
        </div>
      </div>
    </div>
  );
};
