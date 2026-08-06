'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getCategoryClass } from '@/lib/category-style';
import SensitiveLink from '@/components/SensitiveLink';

interface ArticleCardProps {
    href: string;
    sensitive?: boolean;
    thumbnailUrl: string | null;
    title: string;
    categories: string[];
    date: string;
    description?: string | null;
    readingTime?: number;
    compact?: boolean;
}

export default function ArticleCard({
    href,
    sensitive,
    thumbnailUrl,
    title,
    categories,
    date,
    description,
    readingTime,
    compact = false,
}: ArticleCardProps) {
    const t = useTranslations('article');

    if (compact) {
        return (
            <SensitiveLink href={href} className="related-card" sensitive={sensitive}>
                <div className="related-thumb">
                    {thumbnailUrl ? (
                        <Image
                            src={thumbnailUrl}
                            alt={title}
                            fill
                            sizes="52px"
                            style={{ objectFit: 'cover', borderRadius: 'inherit' }}
                        />
                    ) : (
                        '📰'
                    )}
                </div>
                <div>
                    <p className="related-title">{title}</p>
                    <p className="related-date">
                        {categories.length > 0 && (
                            <span className="badges-inline">
                                {categories.map((cat, i) => (
                                    <span key={i} className={`badge badge-sm ${getCategoryClass(cat)}`}>{cat}</span>
                                ))}
                            </span>
                        )}{' '}
                        {date}
                    </p>
                </div>
            </SensitiveLink>
        );
    }

    return (
        <SensitiveLink href={href} className="article-card" sensitive={sensitive}>
            <div className="article-thumb">
                {thumbnailUrl ? (
                    <Image
                        src={thumbnailUrl}
                        alt={title}
                        fill
                        sizes="68px"
                        style={{ objectFit: 'cover', borderRadius: 'inherit' }}
                    />
                ) : (
                    '📰'
                )}
            </div>
            <div className="article-body">
                <p className="article-title">{title}</p>
                {description && (
                    <p className="article-description">{description}</p>
                )}
                <p className="article-meta">
                    {categories.map((cat, i) => (
                        <span key={i} className={`badge badge-sm ${getCategoryClass(cat)}`}>{cat}</span>
                    ))}
                    {date} · {readingTime} {t('readTime')}
                </p>
            </div>
        </SensitiveLink>
    );
}
