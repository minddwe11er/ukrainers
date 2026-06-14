// ============================================
// i18n.js — Перемикач мови UA / DE
// Підключається до homepage.html і article.html
// ============================================

const translations = {
  ua: {
    heroLabel:   'Головна новина місяця',
    heroBadge:   'Важливо',
    heroTitle:   'Спільнота відкриває культурний центр у Санкт-Галлені',
    heroExcerpt: 'Після кількох місяців підготовки ми раді оголосити відкриття нового простору для зустрічей, майстер-класів і концертів.',
    heroDate:    '3 червня 2026',
    heroAuthor:  'Редакція',
    heroRead:    'Читати далі →',
    newsLabel:   'Останні новини',
    a1: 'Зустріч з представниками кантонального офісу інтеграції', a1b: 'Офіційне',
    a2: 'Музичний вечір у неділю — запрошуємо всіх',              a2b: 'Подія',
    a3: 'Мовні курси для дорослих: нова група у вересні',          a3b: 'Навчання',
    a4: 'Волонтерська акція: допомагаємо збирати одяг для переселенців', a4b: 'Волонтерство',
    eventsLabel: 'Найближчі події',
    ev1: 'Зустріч спільноти в кафе',    ev1m: 'чер',
    ev2: 'Майстер-клас — вишиванка',    ev2m: 'чер',
    ev3: 'Спільний перегляд фільму',    ev3m: 'лип',
    subTitle: 'Отримуй новини на пошту',
    subDesc:  'Раз на тиждень — найважливіше з життя спільноти. Без спаму, лише корисне.',
    subEmail: 'твій@email.com',
    subBtn:   'Підписатись',
  },
  de: {
    heroLabel:   'Hauptnachricht des Monats',
    heroBadge:   'Wichtig',
    heroTitle:   'Die Gemeinschaft eröffnet ein Kulturzentrum in St. Gallen',
    heroExcerpt: 'Nach mehreren Monaten der Vorbereitung freuen wir uns, die Eröffnung eines neuen Raums für Begegnungen, Workshops und Konzerte bekanntzugeben.',
    heroDate:    '3. Juni 2026',
    heroAuthor:  'Redaktion',
    heroRead:    'Weiterlesen →',
    newsLabel:   'Aktuelle Nachrichten',
    a1: 'Treffen mit Vertreterinnen des kantonalen Integrationsbüros', a1b: 'Offiziell',
    a2: 'Musikabend am Sonntag — alle sind herzlich eingeladen',        a2b: 'Veranstaltung',
    a3: 'Sprachkurse für Erwachsene: neue Gruppe ab September',         a3b: 'Bildung',
    a4: 'Freiwilligenaktion: Kleidersammlung für Geflüchtete',           a4b: 'Ehrenamt',
    eventsLabel: 'Kommende Veranstaltungen',
    ev1: 'Gemeinschaftstreffen im Café',   ev1m: 'Jun',
    ev2: 'Workshop — ukrainische Stickerei', ev2m: 'Jun',
    ev3: 'Gemeinsamer Filmabend',           ev3m: 'Jul',
    subTitle: 'Neuigkeiten per E-Mail erhalten',
    subDesc:  'Einmal pro Woche — das Wichtigste aus dem Leben der Gemeinschaft. Kein Spam.',
    subEmail: 'deine@email.com',
    subBtn:   'Anmelden',
  }
};

// Хелпер — безпечно оновлює textContent якщо елемент існує
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setPlaceholder(id, text) {
  const el = document.getElementById(id);
  if (el) el.placeholder = text;
}

function switchLang(lang) {
  const l = translations[lang];
  if (!l) return;

  // Hero
  setText('hero-label',   l.heroLabel);
  setText('hero-badge',   l.heroBadge);
  setText('hero-title',   l.heroTitle);
  setText('hero-excerpt', l.heroExcerpt);
  setText('hero-date',    l.heroDate);
  setText('hero-author',  l.heroAuthor);
  setText('hero-read',    l.heroRead);

  // News list
  setText('news-label', l.newsLabel);
  setText('a1-title', l.a1); setText('a1-badge', l.a1b);
  setText('a2-title', l.a2); setText('a2-badge', l.a2b);
  setText('a3-title', l.a3); setText('a3-badge', l.a3b);
  setText('a4-title', l.a4); setText('a4-badge', l.a4b);

  // Events
  setText('events-label', l.eventsLabel);
  setText('ev1-title', l.ev1); setText('ev1-mon', l.ev1m);
  setText('ev2-title', l.ev2); setText('ev2-mon', l.ev2m);
  setText('ev3-title', l.ev3); setText('ev3-mon', l.ev3m);

  // Subscribe
  setText('sub-title', l.subTitle);
  setText('sub-desc',  l.subDesc);
  setText('sub-btn',   l.subBtn);
  setPlaceholder('sub-email', l.subEmail);

  // Buttons state
  const btnUa = document.getElementById('btn-ua');
  const btnDe = document.getElementById('btn-de');
  if (btnUa) btnUa.classList.toggle('active', lang === 'ua');
  if (btnDe) btnDe.classList.toggle('active', lang === 'de');

  // Зберігаємо вибір в sessionStorage
  sessionStorage.setItem('lang', lang);
}

// Відновлюємо мову при завантаженні сторінки
document.addEventListener('DOMContentLoaded', () => {
  const saved = sessionStorage.getItem('lang');
  if (saved && saved !== 'ua') switchLang(saved);
});
