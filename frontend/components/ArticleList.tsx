'use client';

import { useTranslations } from 'next-intl';
import { getCategoryClass } from '@/lib/category-style';

interface ArticleItem {
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  date: string;
  readingTime: number;
  thumbnailUrl: string | null;
  locale: string;
}

interface ArticleListProps {
  articles: ArticleItem[];
}

export default function ArticleList({ articles }: ArticleListProps) {
  const t = useTranslations();

  return (
    <section>
      <p className="section-label">{t('articles.label')}</p>
      <div className="articles">
        {articles.map((article) => (
          <a
            key={article.slug}
            href={`/${article.locale}/articles/${article.slug}`}
            className="article-card"
          >
            <div className="article-thumb">
              {article.thumbnailUrl ? (
                <img
                  src={article.thumbnailUrl}
                  alt={article.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }}
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
          </a>
        ))}
      </div>
    </section>
  );
}
