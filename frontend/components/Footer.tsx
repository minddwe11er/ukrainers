import { useTranslations } from 'next-intl';

export default function Footer() {
    const t = useTranslations('footer');

    return (
        <footer className="footer">
            <p>{t('copyright')}</p>
            <div className="footer-links">
                <a href="#">{t('links.contacts')}</a>
                <a href="#">{t('links.telegram')}</a>
                <a href="#">{t('links.privacy')}</a>
            </div>
        </footer>
    );
}
