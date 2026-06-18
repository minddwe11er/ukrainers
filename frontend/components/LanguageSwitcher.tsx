'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const switchLanguage = (newLocale: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPathname);
  };

  return (
    <div className="lang-switcher">
      <button
        className={`lang-btn ${locale === 'uk' ? 'active' : ''}`}
        onClick={() => switchLanguage('uk')}
      >
        🇺🇦 UA
      </button>
      <button
        className={`lang-btn ${locale === 'de' ? 'active' : ''}`}
        onClick={() => switchLanguage('de')}
      >
        🇨🇭 DE
      </button>
    </div>
  );
}
