export function formatDate(dateString: string, locale: string): string {
    return new Date(dateString).toLocaleDateString(
        locale === 'uk' ? 'uk-UA' : 'de-CH',
        { day: 'numeric', month: 'long' },
    );
}

export function formatDateFull(dateString: string, locale: string): string {
    return new Date(dateString).toLocaleDateString(
        locale === 'uk' ? 'uk-UA' : 'de-CH',
        { day: 'numeric', month: 'long', year: 'numeric' },
    );
}

export function formatEventDateTime(dateString: string, locale: string): string {
    const date = new Date(dateString);
    const dateFormatted = date.toLocaleDateString(
        locale === 'uk' ? 'uk-UA' : 'de-CH',
        { day: 'numeric', month: 'long', year: 'numeric' },
    );
    const timeFormatted = date.toLocaleTimeString(
        locale === 'uk' ? 'uk-UA' : 'de-CH',
        { hour: '2-digit', minute: '2-digit' },
    );
    return `${dateFormatted}, ${timeFormatted}`;
}

export function estimateReadingTime(text: string): number {
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}
