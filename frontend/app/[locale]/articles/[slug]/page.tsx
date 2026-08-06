import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Header from '@/components/Header';
import ArticleHeader from '@/components/ArticleHeader';
import ArticleHero from '@/components/ArticleHero';
import ArticleBody from '@/components/ArticleBody';
import ShareButtons from '@/components/ShareButtons';
import RelatedArticles from '@/components/RelatedArticles';
import TableOfContents from '@/components/TableOfContents';
import SubscribeSidebar from '@/components/SubscribeSidebar';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';
import { getArticleBySlug, getArticles, getStrapiImageUrl } from '@/lib/strapi';
import { localizeArticle } from '@/lib/localize';
import { formatDateFull as formatDate, estimateReadingTime } from '@/lib/format';
import { buildAlternates, SITE_URL } from '@/lib/seo';

interface ArticlePageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const article = await getArticleBySlug(slug);
    if (!article) return {};

    const { title, descr } = localizeArticle(article, locale);
    const ogImage = getStrapiImageUrl(article.coverImage);

    return {
        title,
        description: descr ?? undefined,
        alternates: buildAlternates(locale, `/articles/${slug}`, !!article.body_de),
        openGraph: {
            title,
            description: descr ?? undefined,
            ...(ogImage ? { images: [ogImage] } : {}),
        },
    };
}

function extractHeadings(markdown: string): { id: string; label: string }[] {
    const headingRegex = /^##\s+(.+)$/gm;
    const headings: { id: string; label: string }[] = [];
    let match;
    let index = 0;
    while ((match = headingRegex.exec(markdown)) !== null) {
        index++;
        headings.push({
            id: `heading-${index}`,
            label: match[1].trim(),
        });
    }
    return headings;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { locale, slug } = await params;

    const [article, tNews] = await Promise.all([
        getArticleBySlug(slug),
        getTranslations('newsPage'),
    ]);

    if (!article) {
        notFound();
    }

    if (locale === 'de' && !article.body_de) {
        redirect('/de');
    }

    const { title, descr, body, categories, authors } = localizeArticle(article, locale);
    const categoryNames = categories.map(c => c.name).slice(-3);

    const rawPublishedAt = article.originalPublishedAt ?? article.publishedAt;
    const publishedAt = rawPublishedAt ? formatDate(rawPublishedAt, locale) : '';

    const readingTime = estimateReadingTime(body);
    const tableOfContents = extractHeadings(body);

    const coverUrl = getStrapiImageUrl(article.coverImage);

    const currentCategorySlugs = categories.map(c => c.slug);
    const allArticles = await getArticles(10);
    const candidates = allArticles
        .filter(a => a.slug !== slug)
        .filter(a => locale !== 'de' || a.body_de);
    const sameCategory = candidates.filter(a =>
        (a.categories ?? []).some(c => currentCategorySlugs.includes(c.slug))
    );
    const otherCategory = candidates.filter(a =>
        !(a.categories ?? []).some(c => currentCategorySlugs.includes(c.slug))
    );
    const relatedArticles = [...sameCategory, ...otherCategory]
        .slice(0, 3)
        .map(a => {
            const la = localizeArticle(a, locale);
            return {
                id: String(la.id),
                title: la.title,
                date: (la.originalPublishedAt ?? la.publishedAt) ? formatDate((la.originalPublishedAt ?? la.publishedAt)!, locale) : '',
                categories: la.categories.map(c => c.name),
                thumbnailUrl: getStrapiImageUrl(la.coverImage),
                href: `/${locale}/articles/${la.slug}`,
                sensitive: a.sensitive ?? false,
            };
        });

    const breadcrumbItems = [
        { label: tNews('title'), href: `/${locale}/articles` },
        ...(categoryNames.length > 0 ? [{ label: categoryNames[0] }] : []),
    ];

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: title,
        description: descr ?? undefined,
        image: coverUrl ? [coverUrl] : undefined,
        datePublished: rawPublishedAt ?? undefined,
        dateModified: article.updatedAt,
        author: authors.map(a => ({ '@type': 'Person', name: a.name })),
        publisher: {
            '@type': 'Organization',
            name: 'разом / wir zusammen',
            url: SITE_URL,
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${SITE_URL}/${locale}/articles/${slug}`,
        },
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Header />
            {article.hero && (
                <ArticleHero
                    title={title}
                    descr={descr}
                    categories={categoryNames}
                    authors={authors.map(a => ({
                        name: a.name,
                        avatarUrl: getStrapiImageUrl(a.avatar),
                        initials: a.initials,
                    }))}
                    publishedAt={publishedAt}
                    readingTime={readingTime}
                    coverUrl={coverUrl}
                    breadcrumbItems={breadcrumbItems}
                />
            )}
            <div className="portal portal-wide">
                <div className="article-layout">
                <article className="article-page">
                    {!article.hero && (
                        <>
                            <Breadcrumb items={breadcrumbItems} />

                            <ArticleHeader
                                title={title}
                                categories={categoryNames}
                                authors={authors.map(a => ({
                                    name: a.name,
                                    role: a.role,
                                    avatarUrl: getStrapiImageUrl(a.avatar),
                                    initials: a.initials,
                                }))}
                                publishedAt={publishedAt}
                                readingTime={readingTime}
                            />

                            {coverUrl && (
                                <div className="article-cover">
                                    <Image
                                        src={coverUrl}
                                        alt={
                                            article.coverImage?.alternativeText || title
                                        }
                                        fill
                                        sizes="(max-width: 768px) 100vw, 720px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    <ArticleBody content={body} />

                    <div className="divider"></div>

                    <ShareButtons />

                    <div className="divider"></div>

                    {relatedArticles.length > 0 && (
                        <RelatedArticles articles={relatedArticles} />
                    )}
                </article>

                <aside className="article-sidebar">
                    {tableOfContents.length > 0 && (
                        <TableOfContents items={tableOfContents} />
                    )}
                    <SubscribeSidebar />
                </aside>
                </div>

                <Footer />
            </div>
        </>
    );
}
