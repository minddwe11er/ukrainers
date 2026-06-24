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
  return (
    <div className="category-filter">
      <a
        href={basePath}
        className={`category-filter-btn ${!currentSlug ? 'active' : ''}`}
      >
        {allLabel}
      </a>
      {categories.map(cat => (
        <a
          key={cat.slug}
          href={`${basePath}?category=${cat.slug}`}
          className={`category-filter-btn ${currentSlug === cat.slug ? 'active' : ''} ${getCategoryClass(cat.name)}`}
        >
          {cat.name}
        </a>
      ))}
    </div>
  );
}
