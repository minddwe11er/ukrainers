'use client';

import { useState, useEffect, ReactNode, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface SensitiveLinkProps {
    href: string;
    sensitive?: boolean;
    className?: string;
    children: ReactNode;
}

export default function SensitiveLink({ href, sensitive, className, children }: SensitiveLinkProps) {
    const t = useTranslations('sensitive');
    const router = useRouter();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!showModal) return;

        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        const portal = document.querySelector('.portal') as HTMLElement | null;

        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        if (portal) portal.style.filter = 'blur(4px)';

        return () => {
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
            if (portal) portal.style.filter = '';
        };
    }, [showModal]);

    function handleClick(e: MouseEvent) {
        e.preventDefault();
        if (sensitive) {
            setShowModal(true);
        } else {
            setLoading(true);
            router.push(href);
        }
    }

    return (
        <>
            <Link href={href} className={`${className ?? ''} ${loading ? 'link-loading' : ''}`} onClick={handleClick}>
                {loading ? <span className="link-spinner"><span className="spinner spinner-sm" /></span> : children}
            </Link>
            {showModal && createPortal(
                <div className="sensitive-overlay" onClick={() => setShowModal(false)}>
                    <div className="sensitive-modal" onClick={e => e.stopPropagation()}>
                        <p className="sensitive-title">{t('title')}</p>
                        <p className="sensitive-text">{t('message')}</p>
                        <div className="sensitive-actions">
                            <button
                                className="sensitive-btn sensitive-btn-cancel"
                                onClick={() => setShowModal(false)}
                            >
                                {t('cancel')}
                            </button>
                            <button
                                className="sensitive-btn sensitive-btn-confirm"
                                disabled={loading}
                                onClick={() => {
                                    setLoading(true);
                                    router.push(href);
                                }}
                            >
                                {loading ? <span className="spinner spinner-sm" /> : t('confirm')}
                            </button>
                        </div>
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
}
