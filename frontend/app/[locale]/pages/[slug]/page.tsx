import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ArticleBody from '@/components/ArticleBody';
import { getPageBySlug } from '@/lib/strapi';
import { localizePage } from '@/lib/localize';
import { buildAlternates } from '@/lib/seo';

interface PageProps {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};

  const { title } = localizePage(page, locale);

  return {
    title,
    alternates: buildAlternates(locale, `/pages/${slug}`, !!page.body_de),
  };
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
    <>
      <Header />
      <div className="portal portal-wide">
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
    </>
  );
}
