'use client';

import { useState, useEffect, useRef } from 'react';
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
  const tocRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = tocRef.current;
    const activeLink = container?.querySelector<HTMLAnchorElement>(`a[href="#${activeId}"]`);
    if (!container || !activeLink) return;

    // Scroll only within the TOC list itself — never the page. scrollIntoView
    // walks up every scrollable ancestor, and on mobile the sidebar sits
    // stacked below the article rather than pinned on screen, so "bringing
    // it into view" meant yanking the whole page down to it.
    const containerRect = container.getBoundingClientRect();
    const linkRect = activeLink.getBoundingClientRect();

    if (linkRect.top < containerRect.top) {
      container.scrollTop -= containerRect.top - linkRect.top;
    } else if (linkRect.bottom > containerRect.bottom) {
      container.scrollTop += linkRect.bottom - containerRect.bottom;
    }
  }, [activeId]);

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
      <div className="toc" ref={tocRef}>
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
