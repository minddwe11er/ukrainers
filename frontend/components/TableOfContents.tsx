'use client';

import { useState } from 'react';

interface TOCItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');

  const handleClick = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="sidebar-box">
      <p className="section-label">Зміст</p>
      <div className="toc">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`toc-item ${activeId === item.id ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              handleClick(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </div>
    </div>
  );
}
