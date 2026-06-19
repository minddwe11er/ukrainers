'use client';

import { useTranslations } from 'next-intl';

export default function ShareButtons() {
  const t = useTranslations('article');
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.href : ''
  )}`;

  return (
    <>
      <div className="share-row">
        <span className="share-label">{t('share')}</span>
        <button className="share-btn" onClick={handleCopyLink}>
          {t('copyLink')}
        </button>
        <a href={telegramShareUrl} className="share-btn" target="_blank" rel="noopener noreferrer">
          {t('telegram')}
        </a>
      </div>
    </>
  );
}
