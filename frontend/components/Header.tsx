'use client';

import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';

export default function Header() {
    const t = useTranslations('header');
    const locale = useLocale();

    return (
        <header className="header">
            <a href={`/${locale}`} className="logo">
                <span className="logo-icon">📍</span>
                {t('logo')}
            </a>
            <div className="header-right">
                <nav className="nav">
                    <a href={`/${locale}`} className="nav-link active">
                        {t('nav.news')}
                    </a>
                    <a href="#" className="nav-link">
                        {t('nav.events')}
                    </a>
                    <a href="#" className="nav-link">
                        {t('nav.articles')}
                    </a>
                    <a href={`/${locale}/about`} className="nav-link">
                        {t('nav.about')}
                    </a>
                </nav>
                <ThemeSwitcher />
                <LanguageSwitcher />
            </div>
        </header>
    );
}
