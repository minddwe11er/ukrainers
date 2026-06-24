'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useTranslations } from 'next-intl';

const STORAGE_KEY = 'subscribe-sidebar-hidden';

export default function SubscribeSidebar() {
    const t = useTranslations('subscribeSideBar');
    const [hidden, setHidden] = useState(true);
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'already' | 'invalid' | 'error'>('idle');

    useEffect(() => {
        setHidden(localStorage.getItem(STORAGE_KEY) === '1');
    }, []);

    if (hidden) return null;

    const handleClose = () => {
        localStorage.setItem(STORAGE_KEY, '1');
        setHidden(true);
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        const trimmed = email.trim();
        if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
            setStatus('invalid');
            return;
        }

        setStatus('sending');

        const form = e.target as HTMLFormElement;
        const honeypot = (form.elements.namedItem('website') as HTMLInputElement)?.value;

        const res = await fetch('/api/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: trimmed, website: honeypot }),
        });

        if (res.ok) {
            setStatus('success');
            setEmail('');
        } else if (res.status === 409) {
            setStatus('already');
        } else {
            setStatus('error');
        }
    }

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
            {status === 'success' ? (
                <p className="sub-message sub-success">{t('success')}</p>
            ) : (
                <form onSubmit={handleSubmit} noValidate>
                    <input
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        className="honeypot"
                    />
                    <input
                        type="email"
                        placeholder={t('placeholder')}
                        className="sub-sidebar-input"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={status === 'sending'}
                    />
                    <button
                        type="submit"
                        className="sub-sidebar-btn"
                        disabled={status === 'sending'}
                    >
                        {status === 'sending' ? t('sending') : t('button')}
                    </button>
                    {(status === 'invalid' || status === 'already' || status === 'error') && (
                        <p className="sub-message sub-error">{t(status)}</p>
                    )}
                </form>
            )}
        </div>
    );
}
