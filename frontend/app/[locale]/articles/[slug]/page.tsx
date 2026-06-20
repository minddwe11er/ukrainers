import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Header from '@/components/Header';
import ArticleHeader from '@/components/ArticleHeader';
import ArticleBody from '@/components/ArticleBody';
import ShareButtons from '@/components/ShareButtons';
import RelatedArticles from '@/components/RelatedArticles';
import TableOfContents from '@/components/TableOfContents';
import SubscribeSidebar from '@/components/SubscribeSidebar';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';
import { getArticleBySlug, getArticles, getStrapiImageUrl } from '@/lib/strapi';
import { localizeArticle } from '@/lib/localize';

interface ArticlePageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

function estimateReadingTime(text: string): number {
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}

function extractHeadings(markdown: string): { id: string; label: string }[] {
    const headingRegex = /^#{2,3}\s+(.+)$/gm;
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

function formatDate(dateString: string, locale: string): string {
    return new Date(dateString).toLocaleDateString(
        locale === 'uk' ? 'uk-UA' : 'de-CH',
        { day: 'numeric', month: 'long', year: 'numeric' },
    );
}

export default async function ArticlePage({ params }: ArticlePageProps) {
    const { locale, slug } = await params;

    const [article, t] = await Promise.all([
        getArticleBySlug(slug),
        getTranslations('header'),
    ]);

    if (!article) {
        notFound();
    }

    if (locale === 'de' && !article.body_de) {
        redirect('/de');
    }

    const { title, body, categories, authors } = localizeArticle(article, locale);
    const categoryNames = categories.map(c => c.name).slice(-3);

    const publishedAt = article.publishedAt
        ? formatDate(article.publishedAt, locale)
        : '';

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
                date: la.publishedAt ? formatDate(la.publishedAt, locale) : '',
                category: la.categories[0]?.name ?? null,
                thumbnailUrl: getStrapiImageUrl(la.coverImage),
                href: `/${locale}/articles/${la.slug}`,
            };
        });

    return (
        <div className="portal">
            <Header />

            <div className="article-layout">
                <article className="article-page">
                    <Breadcrumb
                        items={[
                            { label: t('nav.news'), href: `/${locale}` },
                            ...(categoryNames.length > 0
                                ? [{ label: categoryNames[0] }]
                                : []),
                        ]}
                    />

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

                    {coverUrl ? (
                        <div className="article-cover">
                            <img
                                src={coverUrl}
                                alt={
                                    article.coverImage?.alternativeText || title
                                }
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                        </div>
                    ) : (
                        <div className="article-cover">
                            <span
                                className="placeholder-icon"
                                style={{ fontSize: '3rem' }}
                            >
                                🖼
                            </span>
                            <span className="placeholder-text">
                                Фото обкладинки
                            </span>
                        </div>
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
    );
}
