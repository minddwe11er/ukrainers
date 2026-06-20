import type {
    StrapiArticle,
    StrapiAuthor,
    StrapiCategory,
    StrapiPage,
} from './strapi';

function loc(isDE: boolean, de: string | null | undefined, uk: string): string;
function loc(
    isDE: boolean,
    de: string | null | undefined,
    uk: string | null,
): string | null;
function loc(
    isDE: boolean,
    de: string | null | undefined,
    uk: string | null,
): string | null {
    return isDE && de ? de : uk;
}

export function localizeCategory(category: StrapiCategory, locale: string) {
    const isDE = locale === 'de';
    return { ...category, name: loc(isDE, category.name_de, category.name) };
}

export function localizeAuthor(author: StrapiAuthor | null, locale: string) {
    const isDE = locale === 'de';
    const name =
        loc(isDE, author?.name_de, author?.name ?? '') ||
        (isDE ? 'Redaktion' : 'Редакція');
    return {
        name,
        role: loc(isDE, author?.role_de, author?.role ?? null) ?? '',
        avatar: author?.avatar ?? null,
        initials: name
            .split(' ')
            .map(w => w[0])
            .join('')
            .slice(0, 2),
    };
}

export function localizeArticle(article: StrapiArticle, locale: string) {
    const isDE = locale === 'de';
    return {
        ...article,
        title: loc(isDE, article.title_de, article.title),
        body: loc(isDE, article.body_de, article.body),
        descr: loc(isDE, article.descr_de, article.descr),
        categories: (article.categories ?? []).map(c =>
            localizeCategory(c, locale),
        ),
        author: localizeAuthor(article.author, locale),
    };
}

export function localizePage(page: StrapiPage, locale: string) {
    const isDE = locale === 'de';
    return { ...page, body: loc(isDE, page.body_de, page.body) };
}
