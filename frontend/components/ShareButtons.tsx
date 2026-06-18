'use client';

export default function ShareButtons() {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    typeof window !== 'undefined' ? window.location.href : ''
  )}`;

  return (
    <>
      <div className="share-row">
        <span className="share-label">Поділитись:</span>
        <button className="share-btn" onClick={handleCopyLink}>
          📋 Скопіювати посилання
        </button>
        <a href={telegramShareUrl} className="share-btn" target="_blank" rel="noopener noreferrer">
          ✈️ Telegram
        </a>
      </div>
    </>
  );
}
