'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getCategoryClass } from '@/lib/category-style';
import SensitiveLink from '@/components/SensitiveLink';

interface RelatedArticle {
    id: string;
    title: string;
    date: string;
    category: string | null;
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
                    <SensitiveLink
                        key={article.id}
                        href={article.href}
                        className="related-card"
                        sensitive={article.sensitive}
                    >
                        <div className="related-thumb">
                            {article.thumbnailUrl ? (
                                <Image
                                    src={article.thumbnailUrl}
                                    alt={article.title}
                                    fill
                                    sizes="52px"
                                    style={{
                                        objectFit: 'cover',
                                        borderRadius: 'inherit',
                                    }}
                                />
                            ) : (
                                '📰'
                            )}
                        </div>
                        <div>
                            <p className="related-title">{article.title}</p>
                            <p className="related-date">
                                {article.category && (
                                    <span
                                        className={`badge badge-sm ${getCategoryClass(article.category)}`}
                                    >
                                        {article.category}
                                    </span>
                                )}{' '}
                                {article.date}
                            </p>
                        </div>
                    </SensitiveLink>
                ))}
            </div>
        </div>
    );
}
