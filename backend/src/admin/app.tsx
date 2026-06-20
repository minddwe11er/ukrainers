import type { StrapiApp } from '@strapi/strapi/admin';

export default {
    config: {
        locales: ['de', 'uk'],
        translations: {
            uk: {
                'content-manager.plugin.name': 'Менеджер контенту',
            },
        },
    },
    menu: {
        logo: null,
    },
    bootstrap(app: StrapiApp) {
        console.log(app);
    },
};
