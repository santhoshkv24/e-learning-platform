import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

// Teal color palette
const tealPalette = {
  primary: '#14b8a6',    // Teal
  secondary: '#0ea5e9',  // Sky
  accent: '#f43f5e',     // Rose
  neutral: '#71717a',    // Zinc
  success: '#22c55e',    // Green
  warning: '#eab308',    // Yellow
  error: '#ef4444',      // Red
  info: '#3b82f6',       // Blue
};

// Create a context for our custom theme data
export const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  colors: tealPalette,
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  // Apply the colors to CSS custom properties
  useEffect(() => {
    const root = document.documentElement;
    
    // Set all colors as CSS properties
    Object.entries(tealPalette).forEach(([key, value]) => {
      root.style.setProperty(`--${key}-color`, value);
    });
    
    // Create a style element with important rules
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      .text-primary { color: ${tealPalette.primary} !important; }
      .bg-primary { background-color: ${tealPalette.primary} !important; }
      .border-primary { border-color: ${tealPalette.primary} !important; }
      
      .text-secondary { color: ${tealPalette.secondary} !important; }
      .bg-secondary { background-color: ${tealPalette.secondary} !important; }
      .border-secondary { border-color: ${tealPalette.secondary} !important; }
      
      .text-accent { color: ${tealPalette.accent} !important; }
      .bg-accent { background-color: ${tealPalette.accent} !important; }
      .border-accent { border-color: ${tealPalette.accent} !important; }
      
      .text-neutral { color: ${tealPalette.neutral} !important; }
      .bg-neutral { background-color: ${tealPalette.neutral} !important; }
      .border-neutral { border-color: ${tealPalette.neutral} !important; }
      
      .text-success { color: ${tealPalette.success} !important; }
      .bg-success { background-color: ${tealPalette.success} !important; }
      .border-success { border-color: ${tealPalette.success} !important; }
      
      .text-warning { color: ${tealPalette.warning} !important; }
      .bg-warning { background-color: ${tealPalette.warning} !important; }
      .border-warning { border-color: ${tealPalette.warning} !important; }
      
      .text-error { color: ${tealPalette.error} !important; }
      .bg-error { background-color: ${tealPalette.error} !important; }
      .border-error { border-color: ${tealPalette.error} !important; }
      
      .text-info { color: ${tealPalette.info} !important; }
      .bg-info { background-color: ${tealPalette.info} !important; }
      .border-info { border-color: ${tealPalette.info} !important; }
      
      /* Force white text in all colored buttons */
      button.bg-primary,
      button.bg-secondary,
      button.bg-accent,
      button.bg-success,
      button.bg-warning,
      button.bg-error,
      button.bg-info,
      button.bg-neutral,
      .bg-primary,
      .bg-secondary,
      .bg-accent,
      .bg-success,
      .bg-warning,
      .bg-error,
      .bg-info,
      .bg-neutral,
      .bg-gradient-primary,
      .bg-gradient-accent,
      .bg-gradient-cool,
      .bg-gradient-warm,
      [class*="bg-gradient"] {
        color: white !important;
      }
      
      /* Exception for outline buttons */
      button.border-primary:not([class*="bg-"]),
      .btn.border-primary:not([class*="bg-"]) {
        color: ${tealPalette.primary} !important;
        background-color: transparent !important;
      }

      /* Add exceptions for all other border colors */
      button.border-secondary:not([class*="bg-"]), 
      .btn.border-secondary:not([class*="bg-"]) {
        color: ${tealPalette.secondary} !important;
        background-color: transparent !important;
      }
      
      button.border-accent:not([class*="bg-"]), 
      .btn.border-accent:not([class*="bg-"]) {
        color: ${tealPalette.accent} !important;
        background-color: transparent !important;
      }
      
      button.border-success:not([class*="bg-"]), 
      .btn.border-success:not([class*="bg-"]) {
        color: ${tealPalette.success} !important;
        background-color: transparent !important;
      }
      
      button.border-warning:not([class*="bg-"]), 
      .btn.border-warning:not([class*="bg-"]) {
        color: ${tealPalette.warning} !important;
        background-color: transparent !important;
      }
      
      button.border-error:not([class*="bg-"]), 
      .btn.border-error:not([class*="bg-"]) {
        color: ${tealPalette.error} !important;
        background-color: transparent !important;
      }
      
      button.border-info:not([class*="bg-"]), 
      .btn.border-info:not([class*="bg-"]) {
        color: ${tealPalette.info} !important;
        background-color: transparent !important;
      }
      
      /* Default text color for regular buttons without bg class */
      button:not([class*="bg-"]):not([class*="border-"]),
      .btn:not([class*="bg-"]):not([class*="border-"]),
      .button:not([class*="bg-"]):not([class*="border-"]),
      [type="button"]:not([class*="bg-"]):not([class*="border-"]),
      [type="submit"]:not([class*="bg-"]):not([class*="border-"]),
      [type="reset"]:not([class*="bg-"]):not([class*="border-"]) {
        color: #333 !important;
      }
    `;
    
    // Remove any existing style elements we added before
    const oldStyles = document.querySelectorAll('[data-theme-colors]');
    oldStyles.forEach(el => el.remove());
    
    // Add the data attribute to identify our style element
    styleElement.setAttribute('data-theme-colors', 'true');
    document.head.appendChild(styleElement);
    
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      colors: tealPalette
    }}>
      <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
        {children}
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 