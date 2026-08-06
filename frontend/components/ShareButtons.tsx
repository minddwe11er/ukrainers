'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function ShareButtons() {
  const t = useTranslations('article');
  const [currentUrl, setCurrentUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timeout);
  }, [copied]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
  };

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}`;

  return (
    <>
      <div className="share-row">
        <span className="share-label">{t('share')}</span>
        <span className="tooltip-anchor">
          <button className="share-btn" onClick={handleCopyLink}>
            {t('copyLink')}
          </button>
          {copied && <span className="tooltip">{t('copied')}</span>}
        </span>
        <a href={telegramShareUrl} className="share-btn" target="_blank" rel="noopener noreferrer">
          {t('telegram')}
        </a>
      </div>
    </>
  );
}
