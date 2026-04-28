import React from 'react';
import homesLogoImg from '../assets/homes-logo.png';

export const HomesLogo = ({ size = 32, className = '', light = false }) => (
  <img 
    src={homesLogoImg} 
    alt="Homes Logo" 
    style={{ 
      height: size, 
      width: 'auto', 
      objectFit: 'contain',
      filter: light ? 'brightness(0) invert(1)' : 'none'
    }} 
    className={className} 
  />
);

export const HomesLogoFull = ({ height = 32, light = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', filter: light ? 'brightness(0) invert(1)' : 'none' }}>
    <img 
      src={homesLogoImg} 
      alt="Homes Logo" 
      style={{ height: height, width: 'auto', objectFit: 'contain' }} 
    />
  </div>
);

export const HomesLogoAgent = ({ height = 32 }) => (
  <HomesLogoFull height={height} light={true} />
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
