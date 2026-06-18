import Breadcrumb from '@/components/Breadcrumb';
import Header from '@/components/Header';
import ArticleHeader from '@/components/ArticleHeader';
import ArticleContent from '@/components/ArticleContent';
import ShareButtons from '@/components/ShareButtons';
import RelatedArticles from '@/components/RelatedArticles';
import TableOfContents from '@/components/TableOfContents';
import SubscribeSidebar from '@/components/SubscribeSidebar';
import Footer from '@/components/Footer';

export default function ArticlePage() {
  // Поки що hardcoded дані, потім звідси буде API запит до Strapi
  const article = {
    title: 'Спільнота відкриває культурний центр у Санкт-Галлені',
    categories: ['Важливо', 'Культура'],
    author: {
      name: 'Олена Коваль',
      role: 'Редактор',
      avatar: 'ОК',
    },
    publishedAt: '3 червня 2026',
    readingTime: 5,
    coverIcon: '🖼',
    content: [
      {
        type: 'paragraph' as const,
        text: 'Після кількох місяців підготовки та пошуку приміщення наша спільнота нарешті оголошує про відкриття культурного центру в самому серці Санкт-Галлена. Це місце стане простором для зустрічей, майстер-класів, концертів і просто теплого спілкування.',
      },
      {
        type: 'heading' as const,
        text: 'Як все починалось',
      },
      {
        type: 'paragraph' as const,
        text: 'Ідея виникла ще минулого року, коли ми зрозуміли що нам потрібне постійне місце — не тимчасова оренда залу раз на місяць, а справжній дім для спільноти. Після кількох зборів і голосування вирішили шукати приміщення в центрі міста.',
      },
      {
        type: 'quote' as const,
        text: 'Ми хотіли місце, куди можна прийти в будь-який час — випити кави, зустріти своїх, відчути себе вдома далеко від дому.',
      },
      {
        type: 'heading' as const,
        text: 'Що буде в центрі',
      },
      {
        type: 'paragraph' as const,
        text: 'Простір розрахований на різні формати: невеликі концерти та культурні вечори, мовні курси та навчальні групи, дитячі заходи у вихідні, зустрічі з представниками місцевих організацій.',
      },
      {
        type: 'heading' as const,
        text: 'Як долучитись',
      },
      {
        type: 'paragraph' as const,
        text: 'Якщо ти хочеш допомогти з організацією заходів, маєш ідеї або просто хочеш бути частиною команди — пиши нам у Telegram або залишай контакти через форму на сайті. Будемо раді кожному.',
      },
    ],
    tableOfContents: [
      { id: 'heading-1', label: 'Як все починалось' },
      { id: 'heading-2', label: 'Що буде в центрі' },
      { id: 'heading-3', label: 'Як долучитись' },
    ],
    relatedArticles: [
      {
        id: '1',
        title: 'Зустріч з представниками кантонального офісу інтеграції',
        date: '28 травня 2026',
        icon: '🏛',
        href: '/uk/articles/kantonalnyi-ofis',
      },
      {
        id: '2',
        title: 'Музичний вечір у неділю — запрошуємо всіх охочих',
        date: '25 травня 2026',
        icon: '🎵',
        href: '/uk/articles/muzychnyi-vechir',
      },
      {
        id: '3',
        title: 'Мовні курси для дорослих: нова група у вересні',
        date: '20 травня 2026',
        icon: '📚',
        href: '/uk/articles/movni-kursy',
      },
    ],
  };

  return (
    <div className="portal">
      <Header />

      <div className="article-layout">
        <article className="article-page">
          <Breadcrumb
            items={[
              { label: 'Новини', href: '/uk' },
              { label: article.categories[1] },
            ]}
          />

          <ArticleHeader
            title={article.title}
            categories={article.categories}
            author={article.author}
            publishedAt={article.publishedAt}
            readingTime={article.readingTime}
          />

          <ArticleContent coverIcon={article.coverIcon} content={article.content} />

          <div className="divider"></div>

          <ShareButtons />

          <div className="divider"></div>

          <RelatedArticles articles={article.relatedArticles} />
        </article>

        <aside className="article-sidebar">
          <TableOfContents items={article.tableOfContents} />
          <SubscribeSidebar />
        </aside>
      </div>

      <Footer />
    </div>
  );
}
