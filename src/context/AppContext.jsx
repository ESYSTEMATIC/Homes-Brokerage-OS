import React, { createContext, useContext, useState, useEffect } from 'react';
import { PERSONAS } from '../data/staticData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Check local storage for existing session
  const getInitialLoginState = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isLoggedIn') === 'true';
    }
    return false;
  };

  const getInitialPersona = () => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('personaKey');
      if (saved && PERSONAS[saved]) return saved;
      
      const path = window.location.hash || window.location.pathname;
      if (path.includes('/agent')) return 'agent';
    }
    return 'backofficeAdmin';
  };

  const [isLoggedIn, setIsLoggedIn] = useState(getInitialLoginState);
  const [personaKey, setPersonaKey] = useState(getInitialPersona);
  const persona = PERSONAS[personaKey];

  const login = (key) => {
    setPersonaKey(key);
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('personaKey', key);
    
    // Auto-redirect to appropriate hub
    if (PERSONAS[key].hub === 'agent') {
      window.location.hash = '#/agent/dashboard';
    } else {
      window.location.hash = '#/backoffice/dashboard';
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('personaKey');
    window.location.hash = '#/';
  };

  // Keep URL in sync if they switch persona manually
  useEffect(() => {
    if (isLoggedIn) {
      if (persona.hub === 'agent' && !window.location.hash.includes('/agent')) {
        window.location.hash = '#/agent/dashboard';
      } else if (persona.hub === 'backoffice' && window.location.hash.includes('/agent')) {
        window.location.hash = '#/backoffice/dashboard';
      }
    }
  }, [persona.hub, isLoggedIn]);

  return (
    <AppContext.Provider value={{ isLoggedIn, login, logout, personaKey, setPersonaKey, persona, PERSONAS }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
