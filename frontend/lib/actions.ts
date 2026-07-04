'use server';

import { getArticlesOffset, getStrapiImageUrl } from '@/lib/strapi';
import { localizeArticle } from '@/lib/localize';
import { formatDate, estimateReadingTime } from '@/lib/format';

export interface NewsCardArticle {
    slug: string;
    title: string;
    category: string | null;
    date: string;
    readingTime: number;
    thumbnailUrl: string | null;
    locale: string;
    sensitive?: boolean;
}

export async function loadMoreNewsCards(
    offset: number,
    limit: number,
    locale: string,
    heroSlug: string | null,
    excludedCategorySlugs: string[],
): Promise<NewsCardArticle[]> {
    const raw = await getArticlesOffset(offset, limit, excludedCategorySlugs);

    const visible = raw.filter(a =>
        (locale !== 'de' || a.body_de) && a.slug !== heroSlug,
    );

    return visible.map(a => {
        const la = localizeArticle(a, locale);
        return {
            slug: la.slug,
            title: la.title,
            category: la.categories[0]?.name ?? null,
            date: (la.originalPublishedAt ?? la.publishedAt)
                ? formatDate((la.originalPublishedAt ?? la.publishedAt)!, locale)
                : '',
            readingTime: estimateReadingTime(la.body),
            thumbnailUrl: getStrapiImageUrl(la.coverImage),
            sensitive: a.sensitive ?? false,
            locale,
        };
    });
}
