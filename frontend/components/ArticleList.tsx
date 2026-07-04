'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ArticleCard from '@/components/ArticleCard';

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
  filterSlot?: React.ReactNode;
}

export default function ArticleList({ articles, showLabel = true, filterSlot }: ArticleListProps) {
  const t = useTranslations();
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <section>
      {showLabel && (
        <div className="section-label-row">
          <p className="section-label">{t('articles.label')}</p>
          {filterSlot && (
            <button
              className={`filter-toggle-btn${filtersOpen ? ' active' : ''}`}
              onClick={() => setFiltersOpen(o => !o)}
              aria-label={t('articles.filterToggle')}
              aria-expanded={filtersOpen}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 4.5h12M4 8h8M6 11.5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>
      )}
      {filterSlot && (
        <div className={`filter-collapsible${filtersOpen ? ' open' : ''}`}>
          <div>
            <div className="filter-collapsible-inner">
              {filterSlot}
            </div>
          </div>
        </div>
      )}
      <div className="articles">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            href={`/${article.locale}/articles/${article.slug}`}
            sensitive={article.sensitive}
            thumbnailUrl={article.thumbnailUrl}
            title={article.title}
            description={article.description}
            category={article.category}
            date={article.date}
            readingTime={article.readingTime}
          />
        ))}
      </div>
    </section>
  );
}
