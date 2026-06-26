'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategoryClass } from '@/lib/category-style';

interface CategoryFilterProps {
  categories: { slug: string; name: string }[];
  currentSlug: string | undefined;
  basePath: string;
  allLabel: string;
}

export default function CategoryFilter({
  categories,
  currentSlug,
  basePath,
  allLabel,
}: CategoryFilterProps) {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | false>(false);

  useEffect(() => {
    setLoadingSlug(false);
  }, [currentSlug]);

  function handleClick(e: React.MouseEvent, href: string, slug: string) {
    e.preventDefault();
    const current = currentSlug ?? '__all__';
    if (slug === current) return;
    setLoadingSlug(slug);
    router.push(href);
  }

  const allLoading = loadingSlug === '__all__';

  return (
    <div className="category-filter">
      <a
        href={basePath}
        className={`category-filter-btn ${!currentSlug ? 'active' : ''}`}
        onClick={e => handleClick(e, basePath, '__all__')}
      >
        {allLoading ? <span className="spinner spinner-sm" /> : allLabel}
      </a>
      {categories.map(cat => {
        const href = `${basePath}?category=${cat.slug}`;
        const isActive = currentSlug === cat.slug;
        const isLoading = loadingSlug === cat.slug;
        return (
          <a
            key={cat.slug}
            href={href}
            className={`category-filter-btn ${isActive ? 'active' : ''} ${getCategoryClass(cat.name)}`}
            onClick={e => handleClick(e, href, cat.slug)}
          >
            {isLoading ? <span className="spinner spinner-sm" /> : cat.name}
          </a>
        );
      })}
    </div>
  );
}
