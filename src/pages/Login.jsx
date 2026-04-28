import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { HomesLogoFull, HomesLogoShowcase } from '../components/HomesLogo';
import { Activity, ShieldCheck, Key } from 'lucide-react';
import '../Login.css';

export const Login = () => {
  const { login, PERSONAS } = useApp();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [selectedPersona, setSelectedPersona] = useState(null);

  const handleLogin = (personaKey) => {
    setSelectedPersona(personaKey);
    setIsAuthenticating(true);
    // Simulate SSO delay
    setTimeout(() => {
      login(personaKey);
    }, 1500);
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-brand">
          <HomesLogoFull height={42} light={false} />
        </div>
        <div className="login-content">
          <h1 className="login-title">Sign in to HOMES</h1>
          <p className="login-subtitle">Enterprise Real Estate Brokerage OS</p>
          
          <div className="sso-box">
            <div className="sso-header">
              <ShieldCheck size={20} className="sso-icon" />
              <span>Single Sign-On (SSO)</span>
            </div>
            <p className="sso-desc">Select your user profile to simulate enterprise authentication.</p>
            
            <div className="persona-grid">
              {Object.entries(PERSONAS).map(([key, persona]) => (
                <button
                  key={key}
                  className={`persona-btn ${selectedPersona === key ? 'authenticating' : ''}`}
                  onClick={() => handleLogin(key)}
                  disabled={isAuthenticating}
                >
                  <div className="persona-btn-content">
                    <div className="persona-avatar">
                      {persona.label.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="persona-text">
                      <span className="persona-name">{persona.label}</span>
                      <span className="persona-email">{persona.email}</span>
                      <span className="persona-role">{persona.scope}</span>
                    </div>
                  </div>
                  {selectedPersona === key && <Activity size={18} className="animate-spin" />}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="login-footer">
          <p>&copy; {new Date().getFullYear()} eSystematic. All rights reserved.</p>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-showcase">
          <HomesLogoShowcase />
          <h2 className="showcase-title">Streamline Your Brokerage</h2>
          <p className="showcase-desc">
            Centralize your operations from CRM and Deals to HR and Finance with our powerful, intuitive operating system.
          </p>
        </div>
      </div>
    </div>
  );
};
