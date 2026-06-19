import crypto from 'crypto';

function generateId(): string {
  return crypto.randomBytes(6).toString('base64url');
}

export default {
  beforeCreate(event: any) {
    const { data } = event.params;
    if (!data.slug) {
      data.slug = generateId();
    }
  },
  beforeUpdate(event: any) {
    const { data } = event.params;
    if (data.slug === '' || data.slug === null) {
      data.slug = generateId();
    }
  },
};
