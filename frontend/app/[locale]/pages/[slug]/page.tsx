import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleBody from '@/components/ArticleBody';
import { getPageBySlug } from '@/lib/strapi';
import { localizePage } from '@/lib/localize';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export default async function DynamicPage({ params }: PageProps) {
  const { locale, slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const { title, body } = localizePage(page, locale);

  if (!body) {
    if (locale === 'de') {
      const { redirect } = await import('next/navigation');
      redirect('/de');
    }
    notFound();
  }

  return (
    <div className="portal">
      <Header />

      <div className="about-page">
        <div className="about-hero">
          <h1 className="about-title">{title}</h1>
        </div>

        <section className="about-section">
          <ArticleBody content={body} />
        </section>
      </div>

      <Footer />
    </div>
  );
}
