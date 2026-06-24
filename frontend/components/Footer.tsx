import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');

    return (
        <footer className="footer">
            <p>{t('copyright')}</p>
            <div className="footer-links">
                <a href="#">{t('links.contacts')}</a>
            </div>
        </footer>
    );
}