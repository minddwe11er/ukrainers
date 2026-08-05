import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { cookies } from 'next/headers';
import '../globals.css';
import { routing } from '../../i18n/routing';
import { notFound } from 'next/navigation';
import Script from 'next/script';

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
        <html
            lang={locale}
            data-theme={isDark ? 'dark' : undefined}
            suppressHydrationWarning
        >
            <head>
                <meta
                    name="theme-color"
                    content={isDark ? '#5b8fd4' : '#2c5aa0'}
                />
                <Script
                    defer
                    src="https://razom-statistics.up.railway.app/script.js"
                    data-website-id="21107f0c-78ee-4f68-bc39-aa971b1db1ca"
                    strategy="afterInteractive"
                />
                <Script id="google-translate-fix" strategy="beforeInteractive">
                    {`
                    (function () {
                        var isDev = ${process.env.NODE_ENV !== 'production'};
                        var log = function (message, a, b) {
                            if (isDev) console.error(message, a, b);
                        };

                        var originalRemoveChild = Node.prototype.removeChild;
                        Node.prototype.removeChild = function (child) {
                            if (child.parentNode !== this) {
                                log('Blocked removeChild on a node that is no longer a child (likely Google Translate)', child, this);
                                return child;
                            }
                            return originalRemoveChild.apply(this, arguments);
                        };

                        var originalInsertBefore = Node.prototype.insertBefore;
                        Node.prototype.insertBefore = function (newNode, referenceNode) {
                            if (referenceNode && referenceNode.parentNode !== this) {
                                log('Blocked insertBefore with a reference node that is no longer a child (likely Google Translate)', referenceNode, this);
                                return newNode;
                            }
                            return originalInsertBefore.apply(this, arguments);
                        };
                    })();
                    `}
                </Script>
            </head>
            <body>
                <NextIntlClientProvider messages={messages}>
                    {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
