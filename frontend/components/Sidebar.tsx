import { getTranslations } from 'next-intl/server';
import { getUpcomingEvents } from '@/lib/strapi';
import { localizeEvent } from '@/lib/localize';
import Link from 'next/link';

interface SidebarProps {
  locale: string;
}

const MONTH_NAMES_UK = ['січ', 'лют', 'бер', 'кві', 'тра', 'чер', 'лип', 'сер', 'вер', 'жов', 'лис', 'гру'];
const MONTH_NAMES_DE = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];

function formatEventDate(dateString: string, locale: string) {
  const date = new Date(dateString);
  const months = locale === 'de' ? MONTH_NAMES_DE : MONTH_NAMES_UK;
  const time = date.toLocaleTimeString(
    locale === 'de' ? 'de-CH' : 'uk-UA',
    { hour: '2-digit', minute: '2-digit' },
  );
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
            const { day, month, time } = formatEventDate(event.date, locale);

            return (
              <Link
                key={event.id}
                href={`/${locale}/events/${event.slug}`}
                className="event-item"
              >
                <div className="event-date">
                  <div className="event-day">{day}</div>
                  <div className="event-mon">{month}</div>
                  <div className="event-time">{time}</div>
                </div>
                <div>
                  <p className="event-title">{localized.title}</p>
                  {localized.location && (
                    <p className="event-loc">📍 {localized.location}</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
