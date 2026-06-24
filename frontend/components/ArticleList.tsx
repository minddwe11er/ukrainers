'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getCategoryClass } from '@/lib/category-style';
import SensitiveLink from '@/components/SensitiveLink';

interface ArticleItem {
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  date: string;
  readingTime: number;
  thumbnailUrl: string | null;
  locale: string;
  sensitive?: boolean;
}

interface ArticleListProps {
  articles: ArticleItem[];
  showLabel?: boolean;
}

export default function ArticleList({ articles, showLabel = true }: ArticleListProps) {
  const t = useTranslations();

  return (
    <section>
      {showLabel && <p className="section-label">{t('articles.label')}</p>}
      <div className="articles">
        {articles.map((article) => (
          <SensitiveLink
            key={article.slug}
            href={`/${article.locale}/articles/${article.slug}`}
            className="article-card"
            sensitive={article.sensitive}
          >
            <div className="article-thumb">
              {article.thumbnailUrl ? (
                <Image
                  src={article.thumbnailUrl}
                  alt={article.title}
                  fill
                  sizes="68px"
                  style={{ objectFit: 'cover', borderRadius: 'inherit' }}
                />
              ) : (
                '📰'
              )}
            </div>
            <div className="article-body">
              <p className="article-title">{article.title}</p>
              {article.description && (
                <p className="article-description">{article.description}</p>
              )}
              <p className="article-meta">
                {article.category && (
                  <span className={`badge badge-sm ${getCategoryClass(article.category)}`}>{article.category}</span>
                )}
                {article.date} · {article.readingTime} {t('article.readTime')}
              </p>
            </div>
          </SensitiveLink>
        ))}
      </div>
    </section>
  );
}
