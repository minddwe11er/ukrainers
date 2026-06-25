import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleBody from '@/components/ArticleBody';
import { getTranslations } from 'next-intl/server';
import { getAuthors, getPageBySlug, getStrapiImageUrl, getEventCount, getAuthorCount } from '@/lib/strapi';

interface AboutPageProps {
    params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
    const { locale } = await params;
    const isDE = locale === 'de';
    const [t, authors, page, eventCount, authorCount] = await Promise.all([
        getTranslations('about'),
        getAuthors(),
        getPageBySlug('about'),
        getEventCount(),
        getAuthorCount(),
    ]);

    const foundedDate = new Date(2024, 7, 27);
    const now = new Date();
    const yearsTotal = (now.getTime() - foundedDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    const yearsTogether = yearsTotal < 1
        ? `<1`
        : `${Math.floor(yearsTotal)}+`;

    const body = page
        ? isDE && page.body_de
            ? page.body_de
            : page.body
        : null;

    const withOrder = authors.filter(
        a => a.sortNumber && !isNaN(Number(a.sortNumber)),
    );
    const withoutOrder = authors.filter(
        a => !a.sortNumber || isNaN(Number(a.sortNumber)),
    );
    const maxPos =
        withOrder.length > 0
            ? Math.max(...withOrder.map(a => Number(a.sortNumber)))
            : 0;
    const sorted: typeof authors = [];
    const slots = new Array<(typeof authors)[0] | null>(
        Math.max(maxPos, authors.length),
    ).fill(null);
    for (const a of withOrder) {
        slots[Number(a.sortNumber) - 1] = a;
    }
    let noOrderIdx = 0;
    for (let i = 0; i < slots.length; i++) {
        if (slots[i]) {
            sorted.push(slots[i]!);
        } else if (noOrderIdx < withoutOrder.length) {
            sorted.push(withoutOrder[noOrderIdx++]);
        }
    }
    while (noOrderIdx < withoutOrder.length) {
        sorted.push(withoutOrder[noOrderIdx++]);
    }

    return (
        <div className="portal">
            <Header />

            <div className="about-page">
                <div className="about-hero">
                    <h1 className="about-title">{t('title')}</h1>
                    <p className="about-subtitle">{t('subtitle')}</p>
                </div>
                {sorted.length > 0 && (
                    <section className="about-section">
                        <h2 className="about-heading">{t('team')}</h2>
                        <div className="about-team">
                            {sorted.map(author => {
                                const avatarUrl = getStrapiImageUrl(
                                    author.avatar,
                                );
                                const name =
                                    isDE && author.name_de
                                        ? author.name_de
                                        : author.name;
                                const role =
                                    (isDE && author.role_de
                                        ? author.role_de
                                        : author.role) ||
                                    author.role_de ||
                                    author.role ||
                                    '';
                                const initials = name
                                    .split(' ')
                                    .map(w => w[0])
                                    .join('')
                                    .slice(0, 2);

                                return (
                                    <div
                                        key={author.id}
                                        className="about-team-card"
                                    >
                                        <div className="about-team-avatar">
                                            {avatarUrl ? (
                                                <Image
                                                    src={avatarUrl}
                                                    alt={name}
                                                    fill
                                                    sizes="80px"
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <span>{initials}</span>
                                            )}
                                        </div>
                                        <div className="about-team-name">
                                            {name}
                                        </div>
                                        {role && (
                                            <div className="about-team-role">
                                                {role}
                                            </div>
                                        )}
                                        {author.email && (
                                            <a
                                                href={`mailto:${author.email}`}
                                                className="about-team-email"
                                            >
                                                {author.email}
                                            </a>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                {body && (
                    <section className="about-section">
                        <ArticleBody content={body} />
                    </section>
                )}

                <section className="about-section about-stats">
                    <div className="about-stat">
                        <span className="about-stat-number">{eventCount}</span>
                        <span className="about-stat-label">{t('stats.events')}</span>
                    </div>
                    <div className="about-stat">
                        <span className="about-stat-number">{authorCount}</span>
                        <span className="about-stat-label">{t('stats.volunteers')}</span>
                    </div>
                    <div className="about-stat">
                        <span className="about-stat-number">{yearsTogether}</span>
                        <span className="about-stat-label">{t('stats.years')}</span>
                    </div>
                </section>

                <section className="about-section">
                    <h2 className="about-heading">{t('contact')}</h2>
                    <div className="about-contacts">
                        <a
                            href="https://t.me/"
                            className="about-contact-btn"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            ✈️ {t('telegram')}
                        </a>
                        <a
                            href="mailto:info@example.com"
                            className="about-contact-btn"
                        >
                            ✉️ {t('email')}
                        </a>
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}
