import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import { routing } from '../../i18n/routing';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
    title: 'Наша спільнота — новини й світ',
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

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
