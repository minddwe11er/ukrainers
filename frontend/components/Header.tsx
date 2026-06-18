'use client';

import { useTranslations, useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
    const t = useTranslations('header');
    const locale = useLocale();

    return (
        <header className="header">
            <div className="logo">
                <span className="logo-icon">📍</span>
                {t('logo')}
            </div>
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
                    <a href="#" className="nav-link">
                        {t('nav.about')}
                    </a>
                </nav>
                <LanguageSwitcher />
            </div>
        </header>
    );
}
