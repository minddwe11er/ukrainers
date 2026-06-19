import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ArticleBodyProps {
  content: string;
}

let headingIndex = 0;

export default function ArticleBody({ content }: ArticleBodyProps) {
  headingIndex = 0;

  return (
    <div className="article-text">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ children }) => {
            headingIndex++;
            return <h2 id={`heading-${headingIndex}`}>{children}</h2>;
          },
          h3: ({ children }) => {
            headingIndex++;
            return <h3 id={`heading-${headingIndex}`}>{children}</h3>;
          },
          blockquote: ({ children }) => (
            <blockquote className="pullquote">{children}</blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
