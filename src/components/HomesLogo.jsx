import React from 'react';

export const HomesLogo = ({ size = 32, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" className={className}>
    <path d="M50 8L15 35L25 35L50 16L75 35L85 35L50 8Z" fill="#E8672A"/>
    <path d="M50 20L22 42V50L50 28L78 50V42L50 20Z" fill="#E8672A"/>
    <path d="M30 46V88H44V64H56V88H70V46L50 30L30 46Z" fill="#E8672A"/>
    <path d="M38 54H48V62H38V54Z" fill="#0f172a" opacity="0.9"/>
    <path d="M52 54H62V62H52V54Z" fill="#0f172a" opacity="0.9"/>
  </svg>
);

export const HomesLogoFull = ({ height = 28 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: height + 8, height: height + 8, borderRadius: 10,
      background: 'linear-gradient(135deg, #E8672A, #F4943E)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(232,103,42,0.3)'
    }}>
      <span style={{ color: '#fff', fontWeight: 900, fontSize: height * 0.55, fontFamily: 'Inter, sans-serif' }}>H</span>
    </div>
    <div>
      <div style={{ color: '#fff', fontWeight: 800, fontSize: height * 0.6, letterSpacing: '0.04em', lineHeight: 1.1 }}>HOMES</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: height * 0.32, fontWeight: 500 }}>Backoffice v2</div>
    </div>
  </div>
);

export const HomesLogoAgent = ({ height = 28 }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: height + 8, height: height + 8, borderRadius: 10,
      background: 'linear-gradient(135deg, #E8672A, #F4943E)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(232,103,42,0.3)'
    }}>
      <span style={{ color: '#fff', fontWeight: 900, fontSize: height * 0.55, fontFamily: 'Inter, sans-serif' }}>H</span>
    </div>
    <div>
      <div style={{ color: '#fff', fontWeight: 800, fontSize: height * 0.6, letterSpacing: '0.04em', lineHeight: 1.1 }}>HOMES</div>
      <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: height * 0.32, fontWeight: 500 }}>Agent Platform</div>
    </div>
  </div>
);
