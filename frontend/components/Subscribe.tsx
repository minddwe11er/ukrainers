import { useTranslations, useLocale } from 'next-intl';

export default function Subscribe() {
    const t = useTranslations('subscribe');
    const locale = useLocale();

    return (
        <div className="subscribe-banner">
            <div className="sub-icon">✉️</div>
            <div className="sub-text">
                <h3>{t('title')}</h3>
                <p>{t('description')}</p>
            </div>
            <div className="sub-form">
                <input type="email" placeholder={t('placeholder')} />
                <button>{t('button')}</button>
            </div>
        </div>
    );
}
