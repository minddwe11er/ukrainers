'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SearchInputProps {
  basePath: string;
  currentQuery: string;
  currentCategory?: string;
  placeholder: string;
}

export default function SearchInput({
  basePath,
  currentQuery,
  currentCategory,
  placeholder,
}: SearchInputProps) {
  const router = useRouter();
  const [value, setValue] = useState(currentQuery);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const trimmed = value.trim();
    if (trimmed) params.set('search', trimmed);
    if (currentCategory) params.set('category', currentCategory);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function handleClear() {
    setValue('');
    const params = new URLSearchParams();
    if (currentCategory) params.set('category', currentCategory);
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <input
        type="search"
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder={placeholder}
        className="search-input"
      />
      {value && (
        <button type="button" onClick={handleClear} className="search-clear" aria-label="Clear">
          ✕
        </button>
      )}
    </form>
  );
}
