'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

interface TOCItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
}

export default function TableOfContents({ items }: TableOfContentsProps) {
  const t = useTranslations('article');
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '');

  useEffect(() => {
    const ids = items.map((item) => item.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: 0 },
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const handleClick = (id: string) => {
    setActiveId(id);
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="sidebar-box">
      <p className="section-label">{t('toc')}</p>
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
