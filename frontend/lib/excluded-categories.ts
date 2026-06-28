import { cookies } from 'next/headers';

export const EXCLUDED_COOKIE_NAME = 'excluded-categories';

export async function getExcludedSlugs(
  urlExclude: string | undefined,
): Promise<string[]> {
  if (urlExclude) {
    return urlExclude.split(',').filter(Boolean);
  }

  const cookieStore = await cookies();
  const value = cookieStore.get(EXCLUDED_COOKIE_NAME)?.value;
  return value ? value.split(',').filter(Boolean) : [];
}
