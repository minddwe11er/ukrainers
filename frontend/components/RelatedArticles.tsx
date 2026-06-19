'use client';

import { useTranslations } from 'next-intl';
import { getCategoryClass } from '@/lib/category-style';

interface RelatedArticle {
  id: string;
  title: string;
  date: string;
  category: string | null;
  thumbnailUrl: string | null;
  href: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  const t = useTranslations('article');

  return (
    <div>
      <p className="section-label">{t('related')}</p>
      <div className="related-cards">
        {articles.map((article) => (
          <a key={article.id} href={article.href} className="related-card">
            <div className="related-thumb">
              {article.thumbnailUrl ? (
                <img src={article.thumbnailUrl} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'inherit' }} />
              ) : '📰'}
            </div>
            <div>
              <p className="related-title">{article.title}</p>
              <p className="related-date">
                {article.category && <span className={`badge badge-sm ${getCategoryClass(article.category)}`}>{article.category}</span>}
                {article.date}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
