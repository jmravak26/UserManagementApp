import React, { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type DatabaseMode = 'mock' | 'real';

interface DatabaseModeContextType {
  mode: DatabaseMode;
  setMode: (mode: DatabaseMode) => void;
}

const DatabaseModeContext = createContext<DatabaseModeContextType | undefined>(undefined);

interface DatabaseModeProviderProps {
  children: ReactNode;
}

export const DatabaseModeProvider: React.FC<DatabaseModeProviderProps> = ({ children }) => {
  const [mode, setModeState] = useState<DatabaseMode>(() => {
    // Get saved mode from localStorage or default to 'mock'
    const savedMode = localStorage.getItem('databaseMode') as DatabaseMode;
    return savedMode || 'mock';
  });

  const setMode = (newMode: DatabaseMode) => {
    setModeState(newMode);
    localStorage.setItem('databaseMode', newMode);
  };

  return (
    <DatabaseModeContext.Provider value={{ mode, setMode }}>
      {children}
    </DatabaseModeContext.Provider>
  );
};

export const useDatabaseMode = () => {
  const context = useContext(DatabaseModeContext);
  if (context === undefined) {
    throw new Error('useDatabaseMode must be used within a DatabaseModeProvider');
  }
  return context;
};