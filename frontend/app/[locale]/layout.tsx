import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import '../globals.css';
import { routing } from '../../i18n/routing';
import { notFound } from 'next/navigation';
import ScrollToTop from '@/components/ScrollToTop';

export const metadata: Metadata = {
    title: 'разом / wir zusammen — новини й Швейцарія',
    description:
        'Новини й інформація для української спільноти в районі Санкт-Галлена, Швейцарія',
};

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{
        locale: string;
    }>;
}

export default async function LocaleLayout({
    children,
    params,
}: LocaleLayoutProps) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as any)) {
        notFound();
    }

    const messages = await getMessages();
    const cookieStore = await cookies();
    const theme = cookieStore.get('theme')?.value;

    return (
        <html lang={locale} data-theme={theme === 'dark' ? 'dark' : undefined} suppressHydrationWarning>
            <head />
            <body>
                <NextIntlClientProvider messages={messages}>
                    {children}
                    <ScrollToTop />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
