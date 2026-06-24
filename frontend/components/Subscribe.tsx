'use client';

import { useState, FormEvent } from 'react';
import { useTranslations } from 'next-intl';

export default function Subscribe() {
    const t = useTranslations('subscribe');
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'already' | 'invalid' | 'error'>('idle');

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
        <div className="subscribe-banner">
            <div className="sub-icon">✉️</div>
            <div className="sub-text">
                <h3>{t('title')}</h3>
                <p>{t('description')}</p>
            </div>
            <div className="sub-form-wrapper">
                {status === 'success' ? (
                    <p className="sub-message sub-success">{t('success')}</p>
                ) : (
                    <form className="sub-form" onSubmit={handleSubmit} noValidate>
                        <input
                            name="website"
                            tabIndex={-1}
                            autoComplete="off"
                            className="honeypot"
                        />
                        <input
                            type="email"
                            placeholder={t('placeholder')}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            disabled={status === 'sending'}
                        />
                        <button type="submit" disabled={status === 'sending'}>
                            {status === 'sending' ? t('sending') : t('button')}
                        </button>
                    </form>
                )}
                {(status === 'invalid' || status === 'already' || status === 'error') && (
                    <p className="sub-message sub-error">{t(status)}</p>
                )}
            </div>
        </div>
    );
}
