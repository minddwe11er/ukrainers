import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ArticleList from '@/components/ArticleList';
import Sidebar from '@/components/Sidebar';
import Subscribe from '@/components/Subscribe';
import Footer from '@/components/Footer';
import { getArticles, getStrapiImageUrl } from '@/lib/strapi';
import { localizeArticle, localizeCategory } from '@/lib/localize';
import { formatDate, estimateReadingTime } from '@/lib/format';

interface HomeProps {
    params: Promise<{ locale: string }>;
}

const HERO_CATEGORY = 'Важливо';

export default async function Home({ params }: HomeProps) {
    const { locale } = await params;
    const allArticles = await getArticles(6);

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

    return (
        <div className="portal">
            <Header />
            <Hero article={heroArticle} />
            <div className="main">
                <ArticleList articles={articles} />
                <Sidebar locale={locale} />
            </div>
            <Subscribe />
            <Footer />
        </div>
    );
}
