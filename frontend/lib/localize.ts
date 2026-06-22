import type {
    StrapiArticle,
    StrapiAuthor,
    StrapiCategory,
    StrapiEvent,
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

export interface LocalizedAuthor {
    name: string;
    role: string;
    avatar: StrapiAuthor['avatar'];
    initials: string;
}

export function localizeAuthor(author: StrapiAuthor, locale: string): LocalizedAuthor {
    const isDE = locale === 'de';
    const name = loc(isDE, author.name_de, author.name);
    return {
        name,
        role: loc(isDE, author.role_de, author.role ?? null) ?? '',
        avatar: author.avatar ?? null,
        initials: name
            .split(' ')
            .map(w => w[0])
            .join('')
            .slice(0, 2),
    };
}

export function localizeAuthors(authors: StrapiAuthor[], locale: string): LocalizedAuthor[] {
    if (authors.length === 0) {
        return [{
            name: locale === 'de' ? 'Redaktion' : 'Редакція',
            role: '',
            avatar: null,
            initials: locale === 'de' ? 'Re' : 'Ре',
        }];
    }
    return authors.map(a => localizeAuthor(a, locale));
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
        authors: localizeAuthors(article.authors ?? [], locale),
    };
}

export function localizeEvent(event: StrapiEvent, locale: string) {
    const isDE = locale === 'de';
    return {
        ...event,
        title: loc(isDE, event.title_de, event.title),
        body: loc(isDE, event.body_de, event.body),
        location: event.location,
    };
}

export function localizePage(page: StrapiPage, locale: string) {
    const isDE = locale === 'de';
    return { ...page, body: loc(isDE, page.body_de, page.body) };
}
