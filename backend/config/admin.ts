import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
    sessions: {
      // Strapi 5.48+ splits auth into a short-lived access token + a refresh
      // token. `auth.options.expiresIn` is deprecated and no longer controls
      // the access token — it defaults to 30 min, which logged editors out
      // any time the admin tab sat idle for half an hour. Bumped so a normal
      // "post an article, come back later" workflow doesn't get logged out.
      accessTokenLifespan: 4 * 60 * 60, // 4h
      idleRefreshTokenLifespan: 14 * 24 * 60 * 60, // 14d (Strapi default)
      maxRefreshTokenLifespan: 30 * 24 * 60 * 60, // 30d (Strapi default)
    },
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },
});

export default config;
