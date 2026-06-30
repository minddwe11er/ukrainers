'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'theme';

const THEME_COLOR = { light: '#2c5aa0', dark: '#5b8fd4' };

function SunIcon() {
  return (
    <svg className="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" fill="#f59e0b" stroke="#f59e0b" />
      <line x1="12" y1="1" x2="12" y2="3" stroke="#f59e0b" />
      <line x1="12" y1="21" x2="12" y2="23" stroke="#f59e0b" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" stroke="#f59e0b" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" stroke="#f59e0b" />
      <line x1="1" y1="12" x2="3" y2="12" stroke="#f59e0b" />
      <line x1="21" y1="12" x2="23" y2="12" stroke="#f59e0b" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" stroke="#f59e0b" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" stroke="#f59e0b" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="#6366f1" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggle = () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(STORAGE_KEY, next);
    document.cookie = `theme=${next};path=/;max-age=31536000`;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next]);
  };

  return (
    <button onClick={mounted ? toggle : undefined} className="theme-switcher" aria-label="Toggle theme">
      <SunIcon />
      <MoonIcon />
    </button>
  );
}
