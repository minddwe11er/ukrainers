'use client';

import { useTranslations } from 'next-intl';

interface RelatedArticle {
  id: string;
  title: string;
  date: string;
  icon: string;
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
            <div className="related-thumb">{article.icon}</div>
            <div>
              <p className="related-title">{article.title}</p>
              <p className="related-date">{article.date}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
