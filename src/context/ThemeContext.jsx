import { createContext, useContext, useState } from 'react';
const ThemeContext = createContext();
export function ThemeProvider({ children }) {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };
  const t = {
    bg: dark ? '#0f0f0f' : '#ffffff',
    bg2: dark ? '#1a1a1a' : '#f9f9f9',
    bg3: dark ? '#2a2a2a' : '#f0f0f0',
    text: dark ? '#ffffff' : '#1a1a1a',
    text2: dark ? '#aaaaaa' : '#666666',
    border: dark ? '#333333' : '#eeeeee',
    card: dark ? '#1e1e1e' : '#ffffff',
    accent: '#6c63ff',
    green: dark ? '#1a3a1a' : '#e8f5e9',
    greenText: dark ? '#66bb6a' : '#2e7d32',
    blue: dark ? '#1a2a3a' : '#e3f2fd',
    blueText: dark ? '#64b5f6' : '#1565c0',
  };
  return <ThemeContext.Provider value={{ dark, toggle, t }}>{children}</ThemeContext.Provider>;
}
export const useTheme = () => useContext(ThemeContext);
