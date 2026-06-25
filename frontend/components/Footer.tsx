import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
    const t = useTranslations('footer');
    const locale = useLocale();

    return (
        <footer className="footer">
            <p>{t('copyright')}</p>
            <div className="footer-links">
                <Link href={`/${locale}/pages/Kontakt`}>{t('links.contacts')}</Link>
            </div>
        </footer>
    );
}