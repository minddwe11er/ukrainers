export const SITE_URL = 'https://razom.ch';

/**
 * Canonical + hreflang alternates for a route. `pathAfterLocale` is the part
 * of the URL after the /uk or /de segment (e.g. '' for home, '/articles/foo').
 * Pass hasDE = false when the DE translation doesn't exist, so we don't
 * advertise a language variant that 404s/redirects.
 */
export function buildAlternates(locale: string, pathAfterLocale: string, hasDE = true) {
    const canonical = `/${locale}${pathAfterLocale}`;

    if (!hasDE) {
        return { canonical };
    }

    return {
        canonical,
        languages: {
            uk: `/uk${pathAfterLocale}`,
            de: `/de${pathAfterLocale}`,
        },
    };
}
