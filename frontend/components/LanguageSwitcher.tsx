'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

function FlagUA() {
  return (
    <svg width="20" height="15" viewBox="0 0 20 15" style={{ borderRadius: 2, verticalAlign: 'middle' }}>
      <rect width="20" height="7.5" fill="#005BBB" />
      <rect y="7.5" width="20" height="7.5" fill="#FFD500" />
    </svg>
  );
}

function FlagCH() {
  return (
    <svg width="20" height="15" viewBox="0 0 20 15" style={{ borderRadius: 2, verticalAlign: 'middle' }}>
      <rect width="20" height="15" fill="#D52B1E" />
      <rect x="8.5" y="3" width="3" height="9" fill="#fff" />
      <rect x="5.5" y="6" width="9" height="3" fill="#fff" />
    </svg>
  );
}

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const [switching, setSwitching] = useState<string | null>(null);

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) return;
    setSwitching(newLocale);
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${locale === 'uk' ? 'active' : ''}`}
        disabled={switching !== null}
        onClick={() => switchLanguage('uk')}
      >
        {switching === 'uk' ? <span className="spinner spinner-sm" /> : <><FlagUA /> UA</>}
      </button>
      <button
        className={`lang-btn ${locale === 'de' ? 'active' : ''}`}
        disabled={switching !== null}
        onClick={() => switchLanguage('de')}
      >
        {switching === 'de' ? <span className="spinner spinner-sm" /> : <><FlagCH /> DE</>}
      </button>
    </div>
  );
}
