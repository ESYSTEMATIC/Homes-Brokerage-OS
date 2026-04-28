import React from 'react';

export const HomesLogo = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    {/* Left bracket */}
    <path d="M40 20 L20 50 L40 80 L50 80 L30 50 L50 20 Z" fill="#EB5A28" />
    {/* Right bracket */}
    <path d="M60 20 L80 50 L60 80 L50 80 L70 50 L50 20 Z" fill="#EB5A28" />
    {/* Center crossbar */}
    <path d="M30 45 L70 45 L70 55 L30 55 Z" fill="#EB5A28" />
  </svg>
);

export const HomesLogoFull = ({ height = 36 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <HomesLogo size={height + 12} />
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ color: 'var(--text-primary)', fontWeight: 900, fontSize: height * 0.7, letterSpacing: '0.05em', lineHeight: 1 }}>HOMES</div>
      <div style={{ color: 'var(--text-secondary)', fontSize: height * 0.28, fontWeight: 500, fontStyle: 'italic', marginTop: 2 }}>Swipe to Your Next Home</div>
    </div>
  </div>
);

export const HomesLogoAgent = ({ height = 36 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <HomesLogo size={height + 12} />
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ color: '#fff', fontWeight: 900, fontSize: height * 0.7, letterSpacing: '0.05em', lineHeight: 1 }}>HOMES</div>
      <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: height * 0.28, fontWeight: 500, fontStyle: 'italic', marginTop: 2 }}>Swipe to Your Next Home</div>
    </div>
  </div>
);
export const HomesLogoShowcase = () => (
  <div className="logo-showcase-container">
    <div className="logo-glow-orb"></div>
    <div className="logo-3d-wrapper">
      <HomesLogo size={180} className="logo-svg-premium" />
      <div className="logo-text-premium">HOMES</div>
      <div className="logo-tagline-premium">Swipe to Your Next Home</div>
    </div>
  </div>
);
