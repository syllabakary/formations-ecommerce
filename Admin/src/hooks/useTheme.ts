import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';

export function useTheme() {
  const [settings] = useLocalStorage('appSettings', {
    appearance: { theme: 'light' }
  });
  
  const [theme, setTheme] = useState(settings.appearance.theme);

  useEffect(() => {
    setTheme(settings.appearance.theme);
    
    // Appliquer le thème au document
    const root = document.documentElement;
    
    if (settings.appearance.theme === 'dark') {
      root.classList.add('dark');
      document.body.style.backgroundColor = '#1a1a1a';
      document.body.style.color = '#ffffff';
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#1f2937';
    }
  }, [settings.appearance.theme]);

  return theme;
}