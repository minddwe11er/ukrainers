import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Разом — українська спільнота в Санкт-Галлені',
        short_name: 'Разом',
        icons: [
            {
                src: '/favicon-16.png',
                sizes: '16x16',
                type: 'image/png',
            },
            {
                src: '/favicon-32.png',
                sizes: '32x32',
                type: 'image/png',
            },
            {
                src: '/favicon-512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        display: 'standalone',
    };
}
