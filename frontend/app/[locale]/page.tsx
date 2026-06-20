import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ArticleList from '@/components/ArticleList';
import Sidebar from '@/components/Sidebar';
import Subscribe from '@/components/Subscribe';
import Footer from '@/components/Footer';
import { getArticles, getStrapiImageUrl } from '@/lib/strapi';
import { localizeArticle, localizeCategory } from '@/lib/localize';

interface HomeProps {
    params: Promise<{ locale: string }>;
}

function formatDate(dateString: string, locale: string): string {
    return new Date(dateString).toLocaleDateString(
        locale === 'uk' ? 'uk-UA' : 'de-CH',
        { day: 'numeric', month: 'long' },
    );
}

function estimateReadingTime(text: string): number {
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
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
              date: heroLocalized.publishedAt
                  ? formatDate(heroLocalized.publishedAt, locale)
                  : '',
              author: heroLocalized.authors[0]?.name ?? '',
              coverUrl: getStrapiImageUrl(heroLocalized.coverImage),
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
                date: la.publishedAt ? formatDate(la.publishedAt, locale) : '',
                readingTime: estimateReadingTime(la.body),
                thumbnailUrl: getStrapiImageUrl(la.coverImage),
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
