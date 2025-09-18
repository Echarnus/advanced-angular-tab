import { useKV } from '@github/spark/hooks';
import { useEffect } from 'react';

export type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useKV<Theme>('app-theme', 'light');

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light');
  };

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === 'dark'
  };
}