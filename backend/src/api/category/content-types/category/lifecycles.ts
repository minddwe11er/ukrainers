import { generateSlug } from '../../../../utils/slug';

export default {
  beforeCreate(event: any) {
    const { data } = event.params;
    if (!data.slug) {
      data.slug = generateSlug();
    }
  },
  beforeUpdate(event: any) {
    const { data } = event.params;
    if (data.slug === '' || data.slug === null) {
      data.slug = generateSlug();
    }
  },
};
