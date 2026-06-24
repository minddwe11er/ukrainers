'use client';

import { useState, useEffect, ReactNode, MouseEvent } from 'react';
import { createPortal } from 'react-dom';
import { useTranslations } from 'next-intl';

interface SensitiveLinkProps {
    href: string;
    sensitive?: boolean;
    className?: string;
    children: ReactNode;
}

export default function SensitiveLink({ href, sensitive, className, children }: SensitiveLinkProps) {
    const t = useTranslations('sensitive');
    const [showModal, setShowModal] = useState(false);

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
        if (!sensitive) return;
        e.preventDefault();
        setShowModal(true);
    }

    return (
        <>
            <a href={href} className={className} onClick={handleClick}>
                {children}
            </a>
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
                            <a href={href} className="sensitive-btn sensitive-btn-confirm">
                                {t('confirm')}
                            </a>
                        </div>
                    </div>
                </div>,
                document.body,
            )}
        </>
    );
}
