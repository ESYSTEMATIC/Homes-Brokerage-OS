import React, { createContext, useContext, useState, useEffect } from 'react';
import { PERSONAS } from '../data/staticData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Initialize based on URL so direct links to /agent work automatically
  const getInitialPersona = () => {
    if (typeof window !== 'undefined') {
      const path = window.location.hash || window.location.pathname;
      if (path.includes('/agent')) return 'agent';
    }
    return 'backofficeAdmin';
  };

  const [personaKey, setPersonaKey] = useState(getInitialPersona);
  const persona = PERSONAS[personaKey];

  // Optional: keep URL in sync if they switch persona manually
  useEffect(() => {
    if (persona.hub === 'agent' && !window.location.hash.includes('/agent')) {
      window.location.hash = '#/agent/dashboard';
    } else if (persona.hub === 'backoffice' && window.location.hash.includes('/agent')) {
      window.location.hash = '#/backoffice/dashboard';
    }
  }, [persona.hub]);

  return (
    <AppContext.Provider value={{ personaKey, setPersonaKey, persona, PERSONAS }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
