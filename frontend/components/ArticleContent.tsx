interface ArticleContentProps {
  coverIcon?: string;
  content: {
    type: 'paragraph' | 'heading' | 'quote';
    text: string;
  }[];
}

export default function ArticleContent({
  coverIcon = '🖼',
  content,
}: ArticleContentProps) {
  return (
    <>
      <div className="article-cover">
        <span className="placeholder-icon" style={{ fontSize: '3rem' }}>
          {coverIcon}
        </span>
        <span className="placeholder-text">Фото обкладинки</span>
      </div>

      <div className="article-text">
        {content.map((block, i) => {
          if (block.type === 'heading') {
            return <h3 key={i}>{block.text}</h3>;
          }
          if (block.type === 'quote') {
            return (
              <blockquote key={i} className="pullquote">
                {block.text}
              </blockquote>
            );
          }
          return <p key={i}>{block.text}</p>;
        })}
      </div>
    </>
  );
}
