import Header from '@/components/Header';
import Hero from '@/components/Hero';
import FeedGrid from '@/components/FeedGrid';
import NewsCards from '@/components/NewsCards';
import ArticleList from '@/components/ArticleList';
import CategoryFilter from '@/components/CategoryFilter';
import Sidebar from '@/components/Sidebar';
import Subscribe from '@/components/Subscribe';
import Footer from '@/components/Footer';
import { getArticles, getHeroArticle, getCategories, getStrapiImageUrl } from '@/lib/strapi';
import { localizeArticle, localizeCategory } from '@/lib/localize';
import { formatDate, estimateReadingTime } from '@/lib/format';
import { getExcludedSlugs } from '@/lib/excluded-categories';
import { getTranslations } from 'next-intl/server';

interface HomeProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Home({ params, searchParams }: HomeProps) {
    const { locale } = await params;
    const sp = await searchParams;
    const t = await getTranslations('newsPage');

    const excludedSlugs = await getExcludedSlugs(
        typeof sp.exclude === 'string' ? sp.exclude : undefined,
    );

    const [heroRaw, allArticles, allCategories] = await Promise.all([
        getHeroArticle(),
        getArticles(8, excludedSlugs),
        getCategories(),
    ]);

    const heroFiltered = heroRaw && (locale !== 'de' || heroRaw.body_de) ? heroRaw : null;
    const heroLocalized = heroFiltered ? localizeArticle(heroFiltered, locale) : null;
    const heroCat = heroFiltered?.categories?.[0] ?? null;

    const heroArticle = heroLocalized
        ? {
              slug: heroLocalized.slug,
              title: heroLocalized.title,
              description: heroLocalized.descr || null,
              category: heroCat ? localizeCategory(heroCat, locale).name : null,
              date: (heroLocalized.originalPublishedAt ?? heroLocalized.publishedAt)
                  ? formatDate((heroLocalized.originalPublishedAt ?? heroLocalized.publishedAt)!, locale)
                  : '',
              author: heroLocalized.authors[0]?.name ?? '',
              coverUrl: getStrapiImageUrl(heroLocalized.coverImage),
              sensitive: heroFiltered!.sensitive,
              locale,
          }
        : null;

    const heroSlug = heroRaw?.slug ?? null;

    // walk raw fetch order and track exactly how many items were consumed
    // to gather the first 7 visible ones, so "show more" can resume at the
    // right offset regardless of whether hero/locale filtering skipped any
    const visibleArticles: typeof allArticles = [];
    let rawConsumed = 0;
    for (const a of allArticles) {
        rawConsumed++;
        if ((locale !== 'de' || a.body_de) && a.slug !== heroSlug) {
            visibleArticles.push(a);
        }
        if (visibleArticles.length >= 7) break;
    }

    const articles = visibleArticles.slice(0, 7).map(a => {
            const la = localizeArticle(a, locale);
            return {
                slug: la.slug,
                title: la.title,
                description: la.descr || null,
                category: la.categories[0]?.name ?? null,
                date: (la.originalPublishedAt ?? la.publishedAt) ? formatDate((la.originalPublishedAt ?? la.publishedAt)!, locale) : '',
                readingTime: estimateReadingTime(la.body),
                thumbnailUrl: getStrapiImageUrl(la.coverImage),
                sensitive: a.sensitive ?? false,
                locale,
            };
        });

    const localizedCategories = allCategories.map(c =>
        localizeCategory(c, locale),
    );
    const basePath = `/${locale}`;

    return (
        <>
            <Header />
            <Hero article={heroArticle} />
            <div className="portal portal-home">
                <FeedGrid
                    lead={articles[0]}
                    stack={articles.slice(1, 4)}
                    eventsSlot={<Sidebar locale={locale} variant="feed" />}
                />
                <NewsCards
                    initialArticles={articles.slice(4, 7)}
                    initialOffset={rawConsumed}
                    locale={locale}
                    heroSlug={heroSlug}
                    excludedCategorySlugs={excludedSlugs}
                />
                <div className="main">
                    <div className="main-content">
                        <ArticleList articles={articles} filterSlot={
                            <CategoryFilter
                                mode="exclude"
                                categories={localizedCategories}
                                excludedSlugs={excludedSlugs}
                                basePath={basePath}
                                allLabel={t('allCategories')}
                            />
                        } />
                    </div>
                    <Sidebar locale={locale} />
                </div>
                <Subscribe />
                <Footer />
            </div>
        </>
    );
}
