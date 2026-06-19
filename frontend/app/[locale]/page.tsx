import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ArticleList from '@/components/ArticleList';
import Sidebar from '@/components/Sidebar';
import Subscribe from '@/components/Subscribe';
import Footer from '@/components/Footer';
import { getArticles, getStrapiImageUrl } from '@/lib/strapi';

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
    const isDE = locale === 'de';

    const allArticles = await getArticles(6);

    const visibleArticles = allArticles.filter(a => !isDE || a.body_de);

    const heroRaw = visibleArticles.find(a =>
        (a.categories ?? []).some(c => c.name === HERO_CATEGORY),
    );

    const heroArticle = heroRaw
        ? {
              slug: heroRaw.slug,
              title:
                  isDE && heroRaw.title_de ? heroRaw.title_de : heroRaw.title,
              description:
                  isDE && heroRaw.descr_de
                      ? heroRaw.descr_de
                      : heroRaw.descr || null,
              category: isDE
                  ? (heroRaw.categories ?? []).find(
                        c => c.name === HERO_CATEGORY,
                    )?.name_de || HERO_CATEGORY
                  : HERO_CATEGORY,
              date: heroRaw.publishedAt
                  ? formatDate(heroRaw.publishedAt, locale)
                  : '',
              author:
                  (isDE && heroRaw.author?.name_de
                      ? heroRaw.author.name_de
                      : heroRaw.author?.name) ||
                  (isDE ? 'Redaktion' : 'Редакція'),
              coverUrl: getStrapiImageUrl(heroRaw.coverImage),
              locale,
          }
        : null;

    const articles = visibleArticles
        .filter(a => a.slug !== heroRaw?.slug)
        .map(a => {
            const body = isDE && a.body_de ? a.body_de : a.body;
            return {
                slug: a.slug,
                title: isDE && a.title_de ? a.title_de : a.title,
                description: isDE && a.descr_de ? a.descr_de : a.descr || null,
                category: (a.categories ?? [])[0]
                    ? isDE && a.categories[0].name_de
                        ? a.categories[0].name_de
                        : a.categories[0].name
                    : null,
                date: a.publishedAt ? formatDate(a.publishedAt, locale) : '',
                readingTime: estimateReadingTime(body),
                thumbnailUrl: getStrapiImageUrl(a.coverImage),
                locale,
            };
        });

    return (
        <div className="portal">
            <Header />
            <Hero article={heroArticle} />
            <div className="main">
                <ArticleList articles={articles} />
                <Sidebar />
            </div>
            <Subscribe />
            <Footer />
        </div>
    );
}
