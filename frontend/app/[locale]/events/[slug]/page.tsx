import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { redirect } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import Header from '@/components/Header';
import ArticleHeader from '@/components/ArticleHeader';
import ArticleBody from '@/components/ArticleBody';
import ShareButtons from '@/components/ShareButtons';
import SubscribeSidebar from '@/components/SubscribeSidebar';
import Footer from '@/components/Footer';
import { getTranslations } from 'next-intl/server';
import { getEventBySlug, getStrapiImageUrl } from '@/lib/strapi';
import { localizeEvent } from '@/lib/localize';
import { formatDateFull as formatDate, formatEventDateTime, estimateReadingTime } from '@/lib/format';

interface EventPageProps {
    params: Promise<{
        locale: string;
        slug: string;
    }>;
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const event = await getEventBySlug(slug);
    if (!event) return {};

    const { title, body } = localizeEvent(event, locale);
    const description = body.slice(0, 160).replace(/\n/g, ' ');
    const ogImage = getStrapiImageUrl(event.coverImage);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            ...(ogImage ? { images: [ogImage] } : {}),
        },
    };
}

export default async function EventPage({ params }: EventPageProps) {
    const { locale, slug } = await params;

    const [event, tEvents] = await Promise.all([
        getEventBySlug(slug),
        getTranslations('events'),
    ]);

    if (!event) {
        notFound();
    }

    if (locale === 'de' && !event.body_de) {
        redirect('/de');
    }

    const tEvent = await getTranslations('event');
    const tNews = await getTranslations('newsPage');

    const { title, body, location } = localizeEvent(event, locale);

    const publishedAt = event.publishedAt
        ? formatDate(event.publishedAt, locale)
        : '';

    const readingTime = estimateReadingTime(body);
    const coverUrl = getStrapiImageUrl(event.coverImage);
    const eventDateTime = formatEventDateTime(event.date, locale);

    const authors = [
        {
            name: locale === 'de' ? 'Redaktion' : 'Редакція',
            role: '',
            avatarUrl: null,
            initials: locale === 'de' ? 'Re' : 'Ре',
        },
    ];

    return (
        <div className="portal">
            <Header />

            <div className="article-layout">
                <article className="article-page">
                    <Breadcrumb
                        items={[
                            { label: tNews('title'), href: `/${locale}/articles` },
                            { label: tEvents('breadcrumb') },
                        ]}
                    />

                    <ArticleHeader
                        title={title}
                        categories={[]}
                        authors={authors}
                        publishedAt={publishedAt}
                        readingTime={readingTime}
                    />

                    <div className="event-details-box">
                        <div className="event-detail">
                            <span>
                                📅 {tEvent('date')}: {eventDateTime}
                            </span>
                        </div>
                        {location && (
                            <div className="event-detail">
                                <span>
                                    📍 {tEvent('location')}:{' '}
                                    {location.startsWith('-') ? (
                                        location.slice(1).trim()
                                    ) : (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="event-location-link"
                                        >
                                            {location}
                                        </a>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>

                    {coverUrl && (
                        <div className="article-cover">
                            <Image
                                src={coverUrl}
                                alt={event.coverImage?.alternativeText || title}
                                fill
                                sizes="(max-width: 768px) 100vw, 720px"
                                style={{ objectFit: 'cover' }}
                            />
                        </div>
                    )}

                    <ArticleBody content={body} />

                    <div className="divider"></div>

                    <ShareButtons />
                </article>

                <aside className="article-sidebar">
                    <SubscribeSidebar />
                </aside>
            </div>

            <Footer />
        </div>
    );
}
