'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
    const t = useTranslations('header');
    const locale = useLocale();
    const pathname = usePathname();
    const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
    const isArticles = pathname.startsWith(`/${locale}/articles`);
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        if (!menuOpen) return;
        window.addEventListener('scroll', closeMenu, { once: true });
        return () => window.removeEventListener('scroll', closeMenu);
    }, [menuOpen]);

    return (
        <header className="site-header">
            <a href={`/${locale}`} className="logo">
                <span className="logo__ua">разом</span>
                <span className="logo__sep">/</span>
                <span className="logo__de">wir zusammen</span>
            </a>
            <button
                className="burger-btn"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
            >
                {menuOpen ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                )}
            </button>
            <div className={`header-right ${menuOpen ? 'open' : ''}`}>
                <nav className="nav" onClick={closeMenu}>
                    {!isHome && (
                        <a href={`/${locale}`} className="nav-link">
                            {t('nav.home')}
                        </a>
                    )}
                    {!isArticles && (
                        <a href={`/${locale}/articles`} className="nav-link">
                            {t('nav.news')}
                        </a>
                    )}
                    <a href={`/${locale}/about`} className="nav-link">
                        {t('nav.about')}
                    </a>
                </nav>
                <div className="header-controls">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
}
