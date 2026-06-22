import { getTranslations } from 'next-intl/server';
import { getUpcomingEvents } from '@/lib/strapi';
import { localizeEvent } from '@/lib/localize';
import Link from 'next/link';

interface SidebarProps {
    locale: string;
}

const MONTH_NAMES_UK = [
    'січ',
    'лют',
    'бер',
    'кві',
    'тра',
    'чер',
    'лип',
    'сер',
    'вер',
    'жов',
    'лис',
    'гру',
];
const MONTH_NAMES_DE = [
    'Jan',
    'Feb',
    'Mär',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dez',
];

function formatEventDate(dateString: string, locale: string) {
    const date = new Date(dateString);
    const months = locale === 'de' ? MONTH_NAMES_DE : MONTH_NAMES_UK;
    const time = date.toLocaleTimeString(locale === 'de' ? 'de-CH' : 'uk-UA', {
        hour: '2-digit',
        minute: '2-digit',
    });
    return {
        day: date.getDate(),
        month: months[date.getMonth()],
        time,
    };
}

export default async function Sidebar({ locale }: SidebarProps) {
    const t = await getTranslations('events');
    const events = await getUpcomingEvents();

    const visibleEvents = events.filter(e => locale !== 'de' || e.body_de);

    return (
        <aside>
            <div className="sidebar">
                <div className="sidebar-box">
                    <p className="section-label">{t('label')}</p>

                    {visibleEvents.length === 0 && (
                        <p className="event-empty">{t('empty')}</p>
                    )}

                    {visibleEvents.map(event => {
                        const localized = localizeEvent(event, locale);
                        const { day, month, time } = formatEventDate(
                            event.date,
                            locale,
                        );

                        return (
                            <div key={event.id} className="event-item">
                                <div className="event-date">
                                    <div className="event-day">{day}</div>
                                    <div className="event-mon">{month}</div>
                                    <div className="event-time">{time}</div>
                                </div>
                                <div className="event-info">
                                    <Link
                                        href={`/${locale}/events/${event.slug}`}
                                        className="event-title-link"
                                    >
                                        {localized.title}
                                    </Link>
                                    {localized.location && (
                                        /online|онлайн|zoom|facebook|discord|youtube/i.test(localized.location) ? (
                                            <span className="event-loc">
                                                {localized.location}
                                            </span>
                                        ) : (
                                            <a
                                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localized.location)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="event-loc event-location-link"
                                            >
                                                {localized.location}
                                            </a>
                                        )
                                    )}
                                </div>
                                <div className="event-mobile-actions">
                                    <Link
                                        href={`/${locale}/events/${event.slug}`}
                                        className="event-mobile-btn"
                                    >
                                        {t('readMore')}
                                    </Link>
                                    {localized.location && !/online|онлайн|zoom|facebook|discord|youtube/i.test(localized.location) && (
                                        <a
                                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(localized.location)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="event-mobile-btn event-mobile-btn-map"
                                        >
                                            {t('showOnMap')}
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
}
