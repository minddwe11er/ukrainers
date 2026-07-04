'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getCategoryClass } from '@/lib/category-style';
import SensitiveLink from '@/components/SensitiveLink';
import { loadMoreNewsCards, type NewsCardArticle } from '@/lib/actions';

interface NewsCardsProps {
    initialArticles: NewsCardArticle[];
    initialOffset: number;
    locale: string;
    heroSlug: string | null;
    excludedCategorySlugs: string[];
    pageSize?: number;
}

export default function NewsCards({
    initialArticles,
    initialOffset,
    locale,
    heroSlug,
    excludedCategorySlugs,
    pageSize = 3,
}: NewsCardsProps) {
    const t = useTranslations();
    const [articles, setArticles] = useState(initialArticles);
    const [offset, setOffset] = useState(initialOffset);
    const [hasMore, setHasMore] = useState(initialArticles.length === pageSize);
    const [loading, setLoading] = useState(false);

    if (articles.length === 0) return null;

    async function handleShowMore() {
        setLoading(true);
        try {
            const next = await loadMoreNewsCards(offset, pageSize, locale, heroSlug, excludedCategorySlugs);
            setArticles(prev => [...prev, ...next]);
            setOffset(o => o + pageSize);
            setHasMore(next.length === pageSize);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="feed-cards">
                {articles.map(article => (
                    <SensitiveLink
                        key={article.slug}
                        href={`/${article.locale}/articles/${article.slug}`}
                        className="news-card"
                        sensitive={article.sensitive}
                    >
                        <div className="thumb-card">
                            {article.thumbnailUrl ? (
                                <Image
                                    src={article.thumbnailUrl}
                                    alt={article.title}
                                    fill
                                    sizes="(max-width: 1000px) 100vw, 33vw"
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : '📰'}
                        </div>
                        <div className="news-card-body">
                            {article.category && (
                                <span className={`badge badge-sm ${getCategoryClass(article.category)}`}>{article.category}</span>
                            )}
                            <h4 className="feed-title">{article.title}</h4>
                            <p className="feed-meta">{article.date} · {article.readingTime} {t('article.readTime')}</p>
                        </div>
                    </SensitiveLink>
                ))}
            </div>

            {hasMore && (
                <div className="show-more-row">
                    <button
                        className="show-more-btn"
                        onClick={handleShowMore}
                        disabled={loading}
                    >
                        {loading ? <span className="spinner spinner-sm" /> : t('articles.showMore')}
                    </button>
                </div>
            )}
        </>
    );
}
