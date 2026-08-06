'use client';

import { useTranslations } from 'next-intl';
import ArticleCard from '@/components/ArticleCard';

interface RelatedArticle {
    id: string;
    title: string;
    date: string;
    categories: string[];
    thumbnailUrl: string | null;
    href: string;
    sensitive?: boolean;
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
                {articles.map(article => (
                    <ArticleCard
                        key={article.id}
                        href={article.href}
                        sensitive={article.sensitive}
                        thumbnailUrl={article.thumbnailUrl}
                        title={article.title}
                        categories={article.categories}
                        date={article.date}
                        compact
                    />
                ))}
            </div>
        </div>
    );
}
