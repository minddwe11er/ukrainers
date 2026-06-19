const CATEGORY_MAP: Record<string, string> = {
  'Важливо': 'badge-important',
  'Wichtig': 'badge-important',
  'Події': 'badge-events',
  'Veranstaltungen': 'badge-events',
  'Events': 'badge-events',
  'Офіційно': 'badge-official',
  'Offiziell': 'badge-official',
  'Навчання': 'badge-education',
  'Lernen': 'badge-education',
};

export function getCategoryClass(name: string): string {
  return CATEGORY_MAP[name] || '';
}
