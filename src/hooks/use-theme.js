
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => null,
});

export const ThemeProvider = ({ children, defaultTheme = 'light' }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || defaultTheme
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Mettre à jour les variables CSS de PrimeReact
    if (theme === 'dark') {
      root.style.setProperty('--surface-ground', '#121212');
      root.style.setProperty('--surface-section', '#1e1e1e');
      root.style.setProperty('--surface-card', '#1e1e1e');
      root.style.setProperty('--surface-overlay', '#2a2a2a');
      root.style.setProperty('--surface-border', '#383838');
      root.style.setProperty('--text-color', '#f8f9fa');
      root.style.setProperty('--text-color-secondary', '#e9ecef');
      root.style.setProperty('--primary-color', '#6366f1');
    } else {
      root.style.setProperty('--surface-ground', '#f8f9fa');
      root.style.setProperty('--surface-section', '#ffffff');
      root.style.setProperty('--surface-card', '#ffffff');
      root.style.setProperty('--surface-overlay', '#ffffff');
      root.style.setProperty('--surface-border', '#dee2e6');
      root.style.setProperty('--text-color', '#495057');
      root.style.setProperty('--text-color-secondary', '#6c757d');
      root.style.setProperty('--primary-color', '#6366f1');
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};
