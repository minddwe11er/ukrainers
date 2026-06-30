import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import '../globals.css';
import { routing } from '../../i18n/routing';
import { notFound } from 'next/navigation';
import Script from 'next/script';
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
    const isDark = theme === 'dark';

    return (
        <html lang={locale} data-theme={isDark ? 'dark' : undefined} suppressHydrationWarning>
            <head>
                <meta name="theme-color" content={isDark ? '#5b8fd4' : '#2c5aa0'} />
                <Script
                    defer
                    src="https://razom-statistics.up.railway.app/script.js"
                    data-website-id="21107f0c-78ee-4f68-bc39-aa971b1db1ca"
                    strategy="afterInteractive"
                />
            </head>
            <body>
                <NextIntlClientProvider messages={messages}>
                    {children}
                    <ScrollToTop />
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
