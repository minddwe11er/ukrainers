'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getCategoryClass } from '@/lib/category-style';

interface AuthorInfo {
  name: string;
  role: string;
  avatarUrl: string | null;
  initials: string;
}

interface ArticleHeaderProps {
  title: string;
  categories: string[];
  authors: AuthorInfo[];
  publishedAt: string;
  readingTime: number;
}

export default function ArticleHeader({
  title,
  categories,
  authors,
  publishedAt,
  readingTime,
}: ArticleHeaderProps) {
  const t = useTranslations('article');

  return (
    <>
      <div className="badges">
        {categories.map((cat, i) => (
          <span key={i} className={`badge ${getCategoryClass(cat)}`}>
            {cat}
          </span>
        ))}
      </div>

      <h1 className="article-page-title">{title}</h1>

      <div className="author-row">
        <div className="authors-list">
          {authors.map((author, i) => (
            <div key={i} className="author-entry">
              <div className="avatar">
                {author.avatarUrl ? (
                  <Image src={author.avatarUrl} alt={author.name} fill sizes="34px" style={{ objectFit: 'cover' }} />
                ) : (
                  author.initials
                )}
              </div>
              <div className="author-info">
                <div className="author-name">{author.name}</div>
                <div className="author-role">{author.role}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="article-page-meta">
          <span>📅 {publishedAt}</span>
          <span>🕐 {readingTime} {t('readTime')}</span>
        </div>
      </div>
    </>
  );
}
