import { useTranslations } from 'next-intl';

export default function SubscribeSidebar() {
    const t = useTranslations('subscribeSideBar');

    return (
        <div className="subscribe-box-sidebar">
            <p
                className="section-label"
                style={{ border: 'none', padding: 0, marginBottom: '8px' }}
            >
                {t('title')}
            </p>
            <p className="sub-sidebar-desc">{t('description')}</p>
            <input
                type="email"
                placeholder={t('placeholder')}
                className="sub-sidebar-input"
            />
            <button className="sub-sidebar-btn">{t('button')}</button>
        </div>
    );
}
