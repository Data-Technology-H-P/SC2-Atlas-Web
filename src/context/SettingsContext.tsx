'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  disable3D: boolean;
  setDisable3D: (val: boolean) => void;
  analyticsEnabled: boolean | null;
  setAnalyticsEnabled: (val: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [disable3D, setDisable3DState] = useState<boolean>(false);
  const [analyticsEnabled, setAnalyticsEnabledState] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const stored3D = localStorage.getItem('sc2-atlas-disable-3d');
    if (stored3D) {
      setDisable3DState(stored3D === 'true');
    }
    
    const storedAnalytics = localStorage.getItem('sc2-atlas-analytics-enabled');
    if (storedAnalytics !== null) {
      setAnalyticsEnabledState(storedAnalytics === 'true');
    }
    
    setMounted(true);
  }, []);

  const setDisable3D = (val: boolean) => {
    setDisable3DState(val);
    localStorage.setItem('sc2-atlas-disable-3d', val ? 'true' : 'false');
  };

  const setAnalyticsEnabled = (val: boolean) => {
    setAnalyticsEnabledState(val);
    localStorage.setItem('sc2-atlas-analytics-enabled', val ? 'true' : 'false');
  };

  // Prevent hydration mismatch by returning standard values until mounted on client
  return (
    <SettingsContext.Provider 
      value={{ 
        disable3D: mounted ? disable3D : false, 
        setDisable3D,
        analyticsEnabled: mounted ? analyticsEnabled : null,
        setAnalyticsEnabled
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
