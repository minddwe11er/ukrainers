'use client';

import { useTranslations } from 'next-intl';
import { getCategoryClass } from '@/lib/category-style';

interface HeroProps {
  article: {
    slug: string;
    title: string;
    description: string | null;
    category: string | null;
    date: string;
    author: string;
    coverUrl: string | null;
    locale: string;
  } | null;
}

export default function Hero({ article }: HeroProps) {
  const t = useTranslations('hero');

  if (!article) return null;

  return (
    <section className="hero-section">
      <p className="section-label">{t('label')}</p>
      <div className="hero">
        <div className="hero-img">
          {article.coverUrl ? (
            <img
              src={article.coverUrl}
              alt={article.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
            />
          ) : (
            <div className="hero-img-placeholder">
              <span className="placeholder-icon">🖼</span>
              <span className="placeholder-text">Фото обкладинки</span>
            </div>
          )}
        </div>
        <div className="hero-content">
          {article.category && (
            <span className={`badge ${getCategoryClass(article.category)}`}>{article.category}</span>
          )}
          <a href={`/${article.locale}/articles/${article.slug}`} className="hero-title-link">
            <h2 className="hero-title">{article.title}</h2>
          </a>
          {article.description && (
            <p className="hero-excerpt">{article.description}</p>
          )}
          <div className="hero-meta">
            <span>📅 <span>{article.date}</span></span>
            <span>✍️ <span>{article.author}</span></span>
          </div>
          <a href={`/${article.locale}/articles/${article.slug}`} className="read-btn">
            {t('readMore')}
          </a>
        </div>
      </div>
    </section>
  );
}
