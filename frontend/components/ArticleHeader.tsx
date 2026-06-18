interface ArticleHeaderProps {
  title: string;
  categories: string[];
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readingTime: number;
}

export default function ArticleHeader({
  title,
  categories,
  author,
  publishedAt,
  readingTime,
}: ArticleHeaderProps) {
  return (
    <>
      <div className="badges">
        {categories.map((cat, i) => (
          <span key={i} className={`badge ${i > 0 ? 'badge-warn' : ''}`}>
            {cat}
          </span>
        ))}
      </div>

      <h1 className="article-page-title">{title}</h1>

      <div className="author-row">
        <div className="avatar">{author.avatar}</div>
        <div className="author-info">
          <div className="author-name">{author.name}</div>
          <div className="author-role">{author.role}</div>
        </div>
        <div className="article-page-meta">
          <span>📅 {publishedAt}</span>
          <span>🕐 {readingTime} хв читання</span>
        </div>
      </div>
    </>
  );
}
