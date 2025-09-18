import { Moon, Sun } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';

export function ThemeSwitcher() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden"
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Sun 
        className={`h-4 w-4 transition-all duration-300 ${
          isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
        }`} 
      />
      <Moon 
        className={`absolute h-4 w-4 transition-all duration-300 ${
          isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
        }`} 
      />
    </Button>
  );
}