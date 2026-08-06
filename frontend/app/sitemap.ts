import type { MetadataRoute } from 'next';
import { getAllArticles, getEvents, getPages } from '@/lib/strapi';
import { routing } from '@/i18n/routing';
import { SITE_URL } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [articles, events, pages] = await Promise.all([
        getAllArticles(),
        getEvents(),
        getPages(),
    ]);

    const entries: MetadataRoute.Sitemap = [];

    for (const locale of routing.locales) {
        entries.push(
            { url: `${SITE_URL}/${locale}`, changeFrequency: 'daily', priority: 1 },
            { url: `${SITE_URL}/${locale}/articles`, changeFrequency: 'daily', priority: 0.8 },
            { url: `${SITE_URL}/${locale}/about`, changeFrequency: 'monthly', priority: 0.4 },
        );
    }

    for (const article of articles) {
        for (const locale of routing.locales) {
            if (locale === 'de' && !article.body_de) continue;
            entries.push({
                url: `${SITE_URL}/${locale}/articles/${article.slug}`,
                lastModified: article.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.7,
            });
        }
    }

    for (const event of events) {
        for (const locale of routing.locales) {
            if (locale === 'de' && !event.body_de) continue;
            entries.push({
                url: `${SITE_URL}/${locale}/events/${event.slug}`,
                lastModified: event.updatedAt,
                changeFrequency: 'weekly',
                priority: 0.5,
            });
        }
    }

    for (const page of pages) {
        for (const locale of routing.locales) {
            if (locale === 'de' && !page.body_de) continue;
            entries.push({
                url: `${SITE_URL}/${locale}/pages/${page.slug}`,
                lastModified: page.updatedAt,
                changeFrequency: 'monthly',
                priority: 0.3,
            });
        }
    }

    return entries;
}
