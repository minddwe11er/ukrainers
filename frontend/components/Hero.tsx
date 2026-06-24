'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getCategoryClass } from '@/lib/category-style';
import SensitiveLink from '@/components/SensitiveLink';

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
    sensitive?: boolean;
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
          {article.coverUrl && (
            <Image
              src={article.coverUrl}
              alt={article.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              style={{ objectFit: 'cover', borderRadius: 'inherit' }}
            />
          )}
        </div>
        <div className="hero-content">
          {article.category && (
            <span className={`badge ${getCategoryClass(article.category)}`}>{article.category}</span>
          )}
          <SensitiveLink href={`/${article.locale}/articles/${article.slug}`} className="hero-title-link" sensitive={article.sensitive}>
            <h2 className="hero-title">{article.title}</h2>
          </SensitiveLink>
          {article.description && (
            <p className="hero-excerpt">{article.description}</p>
          )}
          <div className="hero-meta">
            <span>📅 <span>{article.date}</span></span>
            <span>✍️ <span>{article.author}</span></span>
          </div>
          <SensitiveLink href={`/${article.locale}/articles/${article.slug}`} className="read-btn" sensitive={article.sensitive}>
            {t('readMore')}
          </SensitiveLink>
        </div>
      </div>
    </section>
  );
}
