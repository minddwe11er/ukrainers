'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { getCategoryClass } from '@/lib/category-style';
import Breadcrumb from '@/components/Breadcrumb';

interface AuthorInfo {
  name: string;
  avatarUrl: string | null;
  initials: string;
}

interface ArticleHeroProps {
  title: string;
  descr: string | null;
  categories: string[];
  authors: AuthorInfo[];
  publishedAt: string;
  readingTime: number;
  coverUrl: string | null;
  breadcrumbItems: { label: string; href?: string }[];
}

export default function ArticleHero({
  title,
  descr,
  categories,
  authors,
  publishedAt,
  readingTime,
  coverUrl,
  breadcrumbItems,
}: ArticleHeroProps) {
  const t = useTranslations('article');

  return (
    <section className="article-hero">
      {coverUrl && (
        <Image
          src={coverUrl}
          alt={title}
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover' }}
        />
      )}
      <div className="article-hero__scrim" />

      <div className="article-hero__crumbs">
        <div className="article-layout">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="article-hero__content">
        <div className="article-layout">
          <div className="article-hero__body">
            <div className="badges">
              {categories.map((cat, i) => (
                <span key={i} className={`badge ${getCategoryClass(cat)}`}>
                  {cat}
                </span>
              ))}
            </div>

            <h1 className="article-hero__title">{title}</h1>

            {descr && <p className="article-hero__desc">{descr}</p>}

            <div className="article-hero__meta">
              <div className="article-hero__avatars">
                {authors.map((author, i) => (
                  <div key={i} className="article-hero__avatar">
                    {author.avatarUrl ? (
                      <Image src={author.avatarUrl} alt={author.name} fill sizes="32px" style={{ objectFit: 'cover' }} />
                    ) : (
                      author.initials
                    )}
                  </div>
                ))}
              </div>
              <span className="article-hero__authors">{authors.map(a => a.name).join(', ')}</span>
              <span className="article-hero__date">· {publishedAt} · {readingTime} {t('readTime')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
