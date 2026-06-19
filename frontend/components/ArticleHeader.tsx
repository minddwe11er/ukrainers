'use client';

import { useTranslations } from 'next-intl';

interface ArticleHeaderProps {
  title: string;
  categories: string[];
  author: {
    name: string;
    role: string;
    avatarUrl: string | null;
    initials: string;
  };
  publishedAt: string;
  readingTime: number;
}

export default function ArticleHeader({
  title,
  categories,
  author,
  publishedAt,
  readingTime,
}: ArticleHeaderProps) {
  const t = useTranslations('article');

  return (
    <>
      <div className="badges">
        {categories.map((cat, i) => (
          <span key={i} className={`badge ${i > 0 ? 'badge-warn' : ''}`}>
            {cat}
          </span>
        ))}
      </div>

      <h1 className="article-page-title">{title}</h1>

      <div className="author-row">
        <div className="avatar">
          {author.avatarUrl ? (
            <img src={author.avatarUrl} alt={author.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
          ) : (
            author.initials
          )}
        </div>
        <div className="author-info">
          <div className="author-name">{author.name}</div>
          <div className="author-role">{author.role}</div>
        </div>
        <div className="article-page-meta">
          <span>📅 {publishedAt}</span>
          <span>🕐 {readingTime} {t('readTime')}</span>
        </div>
      </div>
    </>
  );
}
