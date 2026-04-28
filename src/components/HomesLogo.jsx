import React from 'react';
import homesLogoImg from '../assets/homes-logo.png';

export const HomesLogo = ({ size = 32, className = '' }) => (
  <img 
    src={homesLogoImg} 
    alt="Homes Logo" 
    style={{ height: size, width: 'auto', objectFit: 'contain' }} 
    className={className} 
  />
);

export const HomesLogoFull = ({ height = 40 }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <img 
      src={homesLogoImg} 
      alt="Homes Logo" 
      style={{ height: height, width: 'auto', objectFit: 'contain' }} 
    />
  </div>
);

export const HomesLogoAgent = ({ height = 40 }) => (
  <div style={{ display: 'flex', alignItems: 'center', filter: 'brightness(0) invert(1)' }}>
    <img 
      src={homesLogoImg} 
      alt="Homes Logo" 
      style={{ height: height, width: 'auto', objectFit: 'contain' }} 
    />
  </div>
);

export const HomesLogoShowcase = () => (
  <div className="logo-showcase-container">
    <div className="logo-glow-orb"></div>
    <div className="logo-3d-wrapper">
      <img 
        src={homesLogoImg} 
        alt="Homes Logo" 
        style={{ width: '320px', height: 'auto', marginBottom: '20px' }} 
      />
    </div>
  </div>
);
