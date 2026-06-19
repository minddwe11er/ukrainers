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

    const isDE = locale === 'de';

    if (isDE && !article.body_de) {
        redirect('/de');
    }

    const title = isDE && article.title_de ? article.title_de : article.title;
    const body = isDE && article.body_de ? article.body_de : article.body;

    const categoryNames = (article.categories ?? [])
        .map(c => (isDE && c.name_de ? c.name_de : c.name))
        .slice(-3);
    const authorName =
        (isDE && article.author?.name_de
            ? article.author.name_de
            : article.author?.name) || (isDE ? 'Redaktion' : 'Редакція');
    const authorRole =
        (isDE && article.author?.role_de
            ? article.author.role_de
            : article.author?.role) ?? '';
    const avatarUrl = getStrapiImageUrl(article.author?.avatar ?? null);
    const avatarInitials = authorName
        .split(' ')
        .map(w => w[0])
        .join('')
        .slice(0, 2);

    const publishedAt = article.publishedAt
        ? formatDate(article.publishedAt, locale)
        : '';

    const readingTime = estimateReadingTime(body);
    const tableOfContents = extractHeadings(body);

    const coverUrl = getStrapiImageUrl(article.coverImage);

    const currentCategorySlugs = (article.categories ?? []).map(c => c.slug);
    const allArticles = await getArticles(10);
    const candidates = allArticles
        .filter(a => a.slug !== slug)
        .filter(a => !isDE || a.body_de);
    const sameCategory = candidates.filter(a =>
        (a.categories ?? []).some(c => currentCategorySlugs.includes(c.slug))
    );
    const otherCategory = candidates.filter(a =>
        !(a.categories ?? []).some(c => currentCategorySlugs.includes(c.slug))
    );
    const relatedArticles = [...sameCategory, ...otherCategory]
        .slice(0, 3)
        .map(a => ({
            id: String(a.id),
            title: isDE && a.title_de ? a.title_de : a.title,
            date: a.publishedAt ? formatDate(a.publishedAt, locale) : '',
            category: (a.categories ?? [])[0]
                ? isDE && a.categories[0].name_de
                    ? a.categories[0].name_de
                    : a.categories[0].name
                : null,
            thumbnailUrl: getStrapiImageUrl(a.coverImage),
            href: `/${locale}/articles/${a.slug}`,
        }));

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
                        author={{
                            name: authorName,
                            role: authorRole,
                            avatarUrl: avatarUrl,
                            initials: avatarInitials,
                        }}
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
