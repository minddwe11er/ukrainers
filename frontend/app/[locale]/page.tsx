import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ArticleList from '@/components/ArticleList';
import CategoryFilter from '@/components/CategoryFilter';
import Sidebar from '@/components/Sidebar';
import Subscribe from '@/components/Subscribe';
import Footer from '@/components/Footer';
import { getArticles, getCategories, getStrapiImageUrl } from '@/lib/strapi';
import { localizeArticle, localizeCategory } from '@/lib/localize';
import { formatDate, estimateReadingTime } from '@/lib/format';
import { getExcludedSlugs } from '@/lib/excluded-categories';
import { getTranslations } from 'next-intl/server';

interface HomeProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const HERO_CATEGORY = 'Важливо';

export default async function Home({ params, searchParams }: HomeProps) {
    const { locale } = await params;
    const sp = await searchParams;
    const t = await getTranslations('newsPage');

    const excludedSlugs = await getExcludedSlugs(
        typeof sp.exclude === 'string' ? sp.exclude : undefined,
    );

    const [allArticles, allCategories] = await Promise.all([
        getArticles(6, excludedSlugs),
        getCategories(),
    ]);

    const visibleArticles = allArticles.filter(a => locale !== 'de' || a.body_de);

    const heroRaw = visibleArticles.find(a =>
        (a.categories ?? []).some(c => c.name === HERO_CATEGORY),
    );
    const heroLocalized = heroRaw ? localizeArticle(heroRaw, locale) : null;
    const heroCat = (heroRaw?.categories ?? []).find(c => c.name === HERO_CATEGORY);

    const heroArticle = heroLocalized
        ? {
              slug: heroLocalized.slug,
              title: heroLocalized.title,
              description: heroLocalized.descr || null,
              category: heroCat
                  ? localizeCategory(heroCat, locale).name
                  : HERO_CATEGORY,
              date: (heroLocalized.originalPublishedAt ?? heroLocalized.publishedAt)
                  ? formatDate((heroLocalized.originalPublishedAt ?? heroLocalized.publishedAt)!, locale)
                  : '',
              author: heroLocalized.authors[0]?.name ?? '',
              coverUrl: getStrapiImageUrl(heroLocalized.coverImage),
              sensitive: heroRaw?.sensitive ?? false,
              locale,
          }
        : null;

    const articles = visibleArticles
        .filter(a => a.slug !== heroRaw?.slug)
        .map(a => {
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
        <div className="portal">
            <Header />
            <Hero article={heroArticle} />
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
    );
}
