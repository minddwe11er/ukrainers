'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCategoryClass } from '@/lib/category-style';
const COOKIE_NAME = 'excluded-categories';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

function saveExcludedSlugs(excluded: string[]) {
  document.cookie = `${COOKIE_NAME}=${excluded.join(',')};path=/;max-age=${COOKIE_MAX_AGE};SameSite=Lax`;
}

interface CategoryFilterSelectProps {
  mode: 'select';
  categories: { slug: string; name: string }[];
  currentSlug: string | undefined;
  basePath: string;
  allLabel: string;
  searchQuery?: string;
}

interface CategoryFilterExcludeProps {
  mode: 'exclude';
  categories: { slug: string; name: string }[];
  excludedSlugs: string[];
  basePath: string;
  allLabel: string;
}

type CategoryFilterProps = CategoryFilterSelectProps | CategoryFilterExcludeProps;

export default function CategoryFilter(props: CategoryFilterProps) {
  if (props.mode === 'select') {
    return <SelectFilter {...props} />;
  }
  return <ExcludeFilter {...props} />;
}

function SelectFilter({
  categories,
  currentSlug,
  basePath,
  allLabel,
  searchQuery,
}: CategoryFilterSelectProps) {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | false>(false);

  useEffect(() => {
    setLoadingSlug(false);
  }, [currentSlug]);

  function buildHref(slug: string | undefined): string {
    const params = new URLSearchParams();
    if (slug) params.set('category', slug);
    if (searchQuery) params.set('search', searchQuery);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function handleClick(slug: string | undefined) {
    const current = currentSlug ?? '__all__';
    const target = slug ?? '__all__';
    if (target === current) return;
    setLoadingSlug(target);
    router.push(buildHref(slug));
  }

  return (
    <div className="category-filter">
      <button
        className={`category-filter-btn ${!currentSlug ? 'active' : ''}`}
        onClick={() => handleClick(undefined)}
      >
        {loadingSlug === '__all__' ? <span className="spinner spinner-sm" /> : allLabel}
      </button>
      {categories.map(cat => {
        const isActive = currentSlug === cat.slug;
        const isLoading = loadingSlug === cat.slug;
        return (
          <button
            key={cat.slug}
            className={`category-filter-btn ${getCategoryClass(cat.name)} ${isActive ? 'active' : ''}`}
            onClick={() => handleClick(cat.slug)}
          >
            {isLoading ? <span className="spinner spinner-sm" /> : cat.name}
          </button>
        );
      })}
    </div>
  );
}

function ExcludeFilter({
  categories,
  excludedSlugs,
  basePath,
  allLabel,
}: CategoryFilterExcludeProps) {
  const router = useRouter();
  const [loadingSlug, setLoadingSlug] = useState<string | false>(false);

  const excludeKey = excludedSlugs.join(',');
  useEffect(() => {
    setLoadingSlug(false);
  }, [excludeKey]);

  function buildHref(newExcluded: string[]): string {
    const params = new URLSearchParams();
    if (newExcluded.length > 0) params.set('exclude', newExcluded.join(','));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  function handleToggle(slug: string) {
    setLoadingSlug(slug);
    const newExcluded = excludedSlugs.includes(slug)
      ? excludedSlugs.filter(s => s !== slug)
      : [...excludedSlugs, slug];
    saveExcludedSlugs(newExcluded);
    router.push(buildHref(newExcluded), { scroll: false });
  }

  function handleResetAll() {
    if (excludedSlugs.length === 0) return;
    setLoadingSlug('__all__');
    saveExcludedSlugs([]);
    router.push(buildHref([]), { scroll: false });
  }

  return (
    <div className="category-filter">
      <button
        className={`category-filter-btn ${excludedSlugs.length === 0 ? 'active' : ''}`}
        onClick={handleResetAll}
      >
        {loadingSlug === '__all__' ? <span className="spinner spinner-sm" /> : allLabel}
      </button>
      {categories.map(cat => {
        const isExcluded = excludedSlugs.includes(cat.slug);
        const isLoading = loadingSlug === cat.slug;
        return (
          <button
            key={cat.slug}
            className={`category-filter-btn ${getCategoryClass(cat.name)} ${isExcluded ? 'excluded' : ''}`}
            onClick={() => handleToggle(cat.slug)}
          >
            {isLoading ? <span className="spinner spinner-sm" /> : cat.name}
          </button>
        );
      })}
    </div>
  );
}
