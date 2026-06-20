const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';

interface StrapiResponse<T> {
  data: T;
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiImage {
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: { url: string; width: number; height: number };
    small?: { url: string; width: number; height: number };
    medium?: { url: string; width: number; height: number };
    large?: { url: string; width: number; height: number };
  };
}

export interface StrapiAuthor {
  id: number;
  documentId: string;
  name: string;
  name_de: string | null;
  role: string | null;
  role_de: string | null;
  email: string | null;
  sortNumber: string | null;
  avatar: StrapiImage | null;
}

export interface StrapiCategory {
  id: number;
  documentId: string;
  name: string;
  name_de: string | null;
  slug: string;
}

export interface StrapiArticle {
  id: number;
  documentId: string;
  title: string;
  title_de: string | null;
  descr: string | null;
  descr_de: string | null;
  body: string;
  body_de: string | null;
  slug: string;
  coverImage: StrapiImage | null;
  categories: StrapiCategory[];
  authors: StrapiAuthor[];
  publishedAt: string | null;
  originalPublishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

async function fetchStrapi<T>(
  path: string,
  params?: Record<string, string>,
): Promise<StrapiResponse<T>> {
  const url = new URL(`/api${path}`, STRAPI_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const res = await fetch(url.toString(), { next: { revalidate: 60 } });

  if (!res.ok) {
    throw new Error(`Strapi error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getArticleBySlug(
  slug: string,
): Promise<StrapiArticle | null> {
  const { data } = await fetchStrapi<StrapiArticle[]>('/articles', {
    'filters[slug][$eq]': slug,
    'populate[categories]': 'true',
    'populate[authors][populate]': 'avatar',
    'populate[coverImage]': 'true',
    'status': 'published',
  });

  return data?.[0] ?? null;
}

export async function getArticles(
  pageSize: number = 10,
): Promise<StrapiArticle[]> {
  const { data } = await fetchStrapi<StrapiArticle[]>('/articles', {
    'populate[categories]': 'true',
    'populate[authors][populate]': 'avatar',
    'populate[coverImage]': 'true',
    'sort': 'originalPublishedAt:desc',
    'pagination[pageSize]': String(pageSize),
    'status': 'published',
  });

  return data ?? [];
}

export interface StrapiEvent {
  id: number;
  documentId: string;
  title: string;
  title_de: string | null;
  body: string;
  body_de: string | null;
  slug: string;
  date: string;
  location: string | null;
  location_de: string | null;
  coverImage: StrapiImage | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StrapiPage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  body: string | null;
  body_de: string | null;
}

export async function getPageBySlug(slug: string): Promise<StrapiPage | null> {
  const { data } = await fetchStrapi<StrapiPage[]>('/pages', {
    'filters[slug][$eq]': slug,
    'status': 'published',
  });

  return data?.[0] ?? null;
}

export async function getAuthors(): Promise<StrapiAuthor[]> {
  const { data } = await fetchStrapi<StrapiAuthor[]>('/authors', {
    'populate': 'avatar',
  });

  return data ?? [];
}

export async function getEvents(): Promise<StrapiEvent[]> {
  const { data } = await fetchStrapi<StrapiEvent[]>('/events', {
    'populate[coverImage]': 'true',
    'sort': 'date:asc',
    'status': 'published',
  });

  return data ?? [];
}

export async function getEventBySlug(
  slug: string,
): Promise<StrapiEvent | null> {
  const { data } = await fetchStrapi<StrapiEvent[]>('/events', {
    'filters[slug][$eq]': slug,
    'populate[coverImage]': 'true',
    'status': 'published',
  });

  return data?.[0] ?? null;
}

export async function getUpcomingEvents(): Promise<StrapiEvent[]> {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data } = await fetchStrapi<StrapiEvent[]>('/events', {
    'filters[date][$gte]': oneHourAgo,
    'sort': 'date:asc',
    'pagination[pageSize]': '5',
    'status': 'published',
  });

  return data ?? [];
}

export function getStrapiImageUrl(image: StrapiImage | null): string | null {
  if (!image?.url) return null;
  if (image.url.startsWith('http')) return image.url;
  return `${STRAPI_URL}${image.url}`;
}
