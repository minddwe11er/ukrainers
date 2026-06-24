interface PaginationProps {
  currentPage: number;
  pageCount: number;
  basePath: string;
  currentCategory: string | undefined;
  prevLabel: string;
  nextLabel: string;
}

export default function Pagination({
  currentPage,
  pageCount,
  basePath,
  currentCategory,
  prevLabel,
  nextLabel,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  function buildHref(page: number): string {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', String(page));
    if (currentCategory) params.set('category', currentCategory);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < pageCount;

  const pages: number[] = [];
  for (let i = 1; i <= pageCount; i++) {
    pages.push(i);
  }

  return (
    <nav className="pagination" aria-label="Pagination">
      {hasPrev ? (
        <a href={buildHref(currentPage - 1)} className="pagination-btn">
          {prevLabel}
        </a>
      ) : (
        <span className="pagination-btn disabled">{prevLabel}</span>
      )}

      <div className="pagination-pages">
        {pages.map(p => (
          <a
            key={p}
            href={buildHref(p)}
            className={`pagination-page ${p === currentPage ? 'active' : ''}`}
          >
            {p}
          </a>
        ))}
      </div>

      {hasNext ? (
        <a href={buildHref(currentPage + 1)} className="pagination-btn">
          {nextLabel}
        </a>
      ) : (
        <span className="pagination-btn disabled">{nextLabel}</span>
      )}
    </nav>
  );
}
