'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
    const t = useTranslations('header');
    const locale = useLocale();
    const pathname = usePathname();
    const isHome = pathname === `/${locale}` || pathname === `/${locale}/`;
    const isArticles = pathname.startsWith(`/${locale}/articles`);
    const [menuOpen, setMenuOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 400);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return;
        window.addEventListener('scroll', closeMenu, { once: true });
        return () => window.removeEventListener('scroll', closeMenu);
    }, [menuOpen]);

    return (
        <header className="site-header">
            <Link href={`/${locale}`} className="logo">
                <span className="logo__ua">ми разом</span>
                <span className="logo__sep">/</span>
                <span className="logo__de">wir zusammen</span>
            </Link>
            <div className="header-mobile-actions">
                {scrolled && (
                    <button
                        className="header-scroll-top"
                        onClick={() =>
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                        aria-label="Scroll to top"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <polyline points="18 15 12 9 6 15" />
                        </svg>
                    </button>
                )}
                {hydrated ? (
                    <button
                        className="burger-btn"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                        aria-expanded={menuOpen}
                    >
                        {menuOpen ? (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                        ) : (
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </svg>
                        )}
                    </button>
                ) : (
                    <div className="burger-btn">
                        <span className="spinner spinner-sm" />
                    </div>
                )}
            </div>
            <div className={`header-right ${menuOpen ? 'open' : ''}`}>
                <nav className="nav" onClick={closeMenu}>
                    {!isHome && (
                        <Link href={`/${locale}`} className="nav-link">
                            {t('nav.home')}
                        </Link>
                    )}
                    {!isArticles && (
                        <Link href={`/${locale}/articles`} className="nav-link">
                            {t('nav.news')}
                        </Link>
                    )}
                    <Link href={`/${locale}/about`} className="nav-link">
                        {t('nav.about')}
                    </Link>
                </nav>
                <div className="header-controls">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                </div>
            </div>
        </header>
    );
}
