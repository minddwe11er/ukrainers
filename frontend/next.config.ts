import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
    images: {
        dangerouslyAllowLocalIP: process.env.NODE_ENV === 'development',
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
            },
            {
                protocol: 'https',
                hostname: 'razom.up.railway.app',
            },
        ],
    },
};

export default withNextIntl(nextConfig);
