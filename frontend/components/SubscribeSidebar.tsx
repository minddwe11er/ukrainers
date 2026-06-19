'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'subscribe-sidebar-hidden';

export default function SubscribeSidebar() {
    const t = useTranslations('subscribeSideBar');
    const [hidden, setHidden] = useState(true);

    useEffect(() => {
        setHidden(localStorage.getItem(STORAGE_KEY) === '1');
    }, []);

    if (hidden) return null;

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, '1');
        setHidden(true);
    };

    return (
        <div className="subscribe-box-sidebar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p
                    className="section-label"
                    style={{ border: 'none', padding: 0, margin: 0 }}
                >
                    {t('title')}
                </p>
                <button
                    onClick={handleClose}
                    className="subscribe-close"
                    aria-label="Close"
                >
                    ✕
                </button>
            </div>
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
