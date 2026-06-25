import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');
    const locale = useLocale();

    return (
        <footer className="footer">
            <p>{t('copyright')}</p>
            <div className="footer-links">
                <a href={`/${locale}/pages/Kontakt`}>{t('links.contacts')}</a>
            </div>
        </footer>
    );
}