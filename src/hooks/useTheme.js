import { useCallback, useState } from 'react';

export function useTheme() {
  const [theme, set] = useState(() => document.documentElement.dataset.theme || 'light');
  const setTheme = useCallback((t) => {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem('gt-theme', t); } catch { /* bỏ qua */ }
    set(t);
  }, []);
  return [theme, setTheme];
}
