'use client';

import { useState, useEffect, useRef } from 'react';
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
    const isAbout = pathname === `/${locale}/about` || pathname === `/${locale}/about/`;
    const [menuOpen, setMenuOpen] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const navRef = useRef<HTMLElement>(null);
    const homeLinkRef = useRef<HTMLAnchorElement>(null);
    const newsLinkRef = useRef<HTMLAnchorElement>(null);
    const aboutLinkRef = useRef<HTMLAnchorElement>(null);
    const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

    const activeLinkRef = isHome ? homeLinkRef : isArticles ? newsLinkRef : isAbout ? aboutLinkRef : null;

    // .nav-link has 7px of horizontal padding (see globals.css); trim it off
    // so the indicator hugs the word instead of the whole clickable area
    const NAV_LINK_PADDING_X = 7;

    const moveIndicatorTo = (el: HTMLAnchorElement | null) => {
        if (!el) return;
        setIndicator({
            left: el.offsetLeft + NAV_LINK_PADDING_X,
            width: el.offsetWidth - NAV_LINK_PADDING_X * 2,
            opacity: 1,
        });
    };

    const resetIndicator = () => moveIndicatorTo(activeLinkRef?.current ?? null);

    const closeMenu = () => setMenuOpen(false);
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    const scrollTopIcon = (
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
    );

    useEffect(() => {
        setHydrated(true);
    }, []);

    useEffect(() => {
        resetIndicator();
        window.addEventListener('resize', resetIndicator);
        return () => window.removeEventListener('resize', resetIndicator);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

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
            <div className="header-inner">
                <Link href={`/${locale}`} className="logo">
                    <span className="logo__ua">ми разом</span>
                    <span className="logo__sep">/</span>
                    <span className="logo__de">wir zusammen</span>
                </Link>
                <div className="header-mobile-actions">
                    <button
                        className={`header-scroll-top${scrolled ? ' visible' : ''}`}
                        onClick={scrollToTop}
                        aria-label="Scroll to top"
                        tabIndex={scrolled ? 0 : -1}
                    >
                        {scrollTopIcon}
                    </button>
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
                    <nav
                        ref={navRef}
                        className="nav"
                        onClick={closeMenu}
                        onMouseLeave={resetIndicator}
                    >
                        <Link
                            ref={homeLinkRef}
                            href={`/${locale}`}
                            className={`nav-link${isHome ? ' active' : ''}`}
                            onMouseEnter={() => moveIndicatorTo(homeLinkRef.current)}
                        >
                            {t('nav.home')}
                        </Link>
                        <Link
                            ref={newsLinkRef}
                            href={`/${locale}/articles`}
                            className={`nav-link${isArticles ? ' active' : ''}`}
                            onMouseEnter={() => moveIndicatorTo(newsLinkRef.current)}
                        >
                            {t('nav.news')}
                        </Link>
                        <Link
                            ref={aboutLinkRef}
                            href={`/${locale}/about`}
                            className={`nav-link${isAbout ? ' active' : ''}`}
                            onMouseEnter={() => moveIndicatorTo(aboutLinkRef.current)}
                        >
                            {t('nav.about')}
                        </Link>
                        <span
                            className="nav-indicator"
                            style={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity }}
                        />
                    </nav>
                    <div className="header-controls">
                        <button
                            className={`header-scroll-top header-scroll-top-desktop${scrolled ? ' visible' : ''}`}
                            onClick={scrollToTop}
                            aria-label="Scroll to top"
                            tabIndex={scrolled ? 0 : -1}
                        >
                            {scrollTopIcon}
                        </button>
                        <ThemeSwitcher />
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
}
