import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { getCategoryClass } from '@/lib/category-style';
import SensitiveLink from '@/components/SensitiveLink';

interface FeedArticle {
    slug: string;
    title: string;
    description: string | null;
    category: string | null;
    date: string;
    readingTime: number;
    thumbnailUrl: string | null;
    locale: string;
    sensitive?: boolean;
}

interface FeedGridProps {
    lead?: FeedArticle;
    stack: FeedArticle[];
    eventsSlot: React.ReactNode;
}

export default async function FeedGrid({ lead, stack, eventsSlot }: FeedGridProps) {
    const tNews = await getTranslations('articles');
    const tArticle = await getTranslations('article');

    if (!lead) return null;

    return (
        <section className="feed">
            <div className="section-head">
                <p className="section-label">{tNews('label')}</p>
                <span className="rule" />
            </div>

            <div className="feed-grid">
                <SensitiveLink
                    href={`/${lead.locale}/articles/${lead.slug}`}
                    className="feed-lead col"
                    sensitive={lead.sensitive}
                >
                    <div className="thumb-lg">
                        {lead.thumbnailUrl ? (
                            <Image
                                src={lead.thumbnailUrl}
                                alt={lead.title}
                                fill
                                sizes="(max-width: 1000px) 100vw, 33vw"
                                style={{ objectFit: 'cover' }}
                            />
                        ) : '📰'}
                    </div>
                    {lead.category && (
                        <span className={`badge badge-sm ${getCategoryClass(lead.category)}`}>{lead.category}</span>
                    )}
                    <h3 className="feed-title feed-title-lg">{lead.title}</h3>
                    {lead.description && <p className="feed-excerpt">{lead.description}</p>}
                    <p className="feed-meta">{lead.date} · {lead.readingTime} {tArticle('readTime')}</p>
                </SensitiveLink>

                <div className="feed-stack col">
                    {stack.map(article => (
                        <SensitiveLink
                            key={article.slug}
                            href={`/${article.locale}/articles/${article.slug}`}
                            className="feed-item"
                            sensitive={article.sensitive}
                        >
                            {article.category && (
                                <span className={`badge badge-sm ${getCategoryClass(article.category)}`}>{article.category}</span>
                            )}
                            <h3 className="feed-title">{article.title}</h3>
                            <p className="feed-meta">{article.date} · {article.readingTime} {tArticle('readTime')}</p>
                        </SensitiveLink>
                    ))}
                </div>

                <div className="feed-events col">
                    {eventsSlot}
                </div>
            </div>
        </section>
    );
}
