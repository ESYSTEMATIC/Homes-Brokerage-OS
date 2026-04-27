import React, { createContext, useContext, useState } from 'react';
import { PERSONAS } from '../data/staticData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [personaKey, setPersonaKey] = useState('backofficeAdmin');
  const persona = PERSONAS[personaKey];

  return (
    <AppContext.Provider value={{ personaKey, setPersonaKey, persona, PERSONAS }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
