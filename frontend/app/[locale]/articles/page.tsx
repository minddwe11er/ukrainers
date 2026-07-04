import type { Metadata } from 'next';
import Header from '@/components/Header';
import ArticleList from '@/components/ArticleList';
import CategoryFilter from '@/components/CategoryFilter';
import SearchInput from '@/components/SearchInput';
import Pagination from '@/components/Pagination';
import Subscribe from '@/components/Subscribe';
import Footer from '@/components/Footer';
import {
    getArticlesPaginated,
    getCategories,
    getStrapiImageUrl,
} from '@/lib/strapi';
import { localizeArticle, localizeCategory } from '@/lib/localize';
import { getTranslations } from 'next-intl/server';
import { formatDate, estimateReadingTime } from '@/lib/format';

interface ArticlesPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('newsPage');
    const title = t('title');

    return {
        title,
        openGraph: { title },
    };
}

export default async function ArticlesPage({
    params,
    searchParams,
}: ArticlesPageProps) {
    const { locale } = await params;
    const sp = await searchParams;
    const t = await getTranslations('newsPage');

    const currentPage = Math.max(1, Number(sp.page) || 1);
    const currentCategory =
        typeof sp.category === 'string' ? sp.category : undefined;
    const searchQuery =
        typeof sp.search === 'string' ? sp.search.trim() : '';

    const [{ data: rawArticles, pagination }, allCategories] =
        await Promise.all([
            getArticlesPaginated({
                page: currentPage,
                pageSize: 10,
                categorySlug: currentCategory,
                search: searchQuery || undefined,
            }),
            getCategories(),
        ]);

    const visibleArticles = rawArticles.filter(
        a => locale !== 'de' || a.body_de,
    );

    const articles = visibleArticles.map(a => {
        const la = localizeArticle(a, locale);
        return {
            slug: la.slug,
            title: la.title,
            description: la.descr || null,
            category: la.categories[0]?.name ?? null,
            date:
                (la.originalPublishedAt ?? la.publishedAt)
                    ? formatDate(
                          (la.originalPublishedAt ?? la.publishedAt)!,
                          locale,
                      )
                    : '',
            readingTime: estimateReadingTime(la.body),
            thumbnailUrl: getStrapiImageUrl(la.coverImage),
            sensitive: a.sensitive ?? false,
            locale,
        };
    });

    const localizedCategories = allCategories.map(c =>
        localizeCategory(c, locale),
    );
    const basePath = `/${locale}/articles`;

    return (
        <>
            <Header />
            <div className="portal">
                <div className="news-listing">
                <h1 className="news-listing-title">{t('title')}</h1>

                <SearchInput
                    basePath={basePath}
                    currentQuery={searchQuery}
                    currentCategory={currentCategory}
                    placeholder={t('searchPlaceholder')}
                />

                <CategoryFilter
                    mode="select"
                    categories={localizedCategories}
                    currentSlug={currentCategory}
                    basePath={basePath}
                    allLabel={t('allCategories')}
                    searchQuery={searchQuery || undefined}
                />

                {articles.length > 0 ? (
                    <ArticleList articles={articles} showLabel={false} />
                ) : (
                    <p className="news-empty">{t('empty')}</p>
                )}

                <Pagination
                    currentPage={pagination.page}
                    pageCount={pagination.pageCount}
                    basePath={basePath}
                    currentCategory={currentCategory}
                    searchQuery={searchQuery || undefined}
                    prevLabel={t('prev')}
                    nextLabel={t('next')}
                />
                </div>
                <Subscribe />
                <Footer />
            </div>
        </>
    );
}
