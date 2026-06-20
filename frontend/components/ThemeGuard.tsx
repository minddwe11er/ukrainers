'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function ThemeGuard() {
  const pathname = usePathname();

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, [pathname]);

  return null;
}
