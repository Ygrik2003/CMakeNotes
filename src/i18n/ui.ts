export const locales = ['ru', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'ru';

export const site = {
  ru: {
    name: 'Заметки о CMake',
    tagline: 'Практика сборки, без магии.',
    description:
      'Заметки про CMake, генераторы, Ninja и то, что обычно остаётся в комментариях к CMakeLists.txt.',
  },
  en: {
    name: 'CMake Notes',
    tagline: 'Build system notes, no magic.',
    description:
      'Notes on CMake, generators, Ninja, and the parts that usually stay buried in CMakeLists.txt comments.',
  },
} as const;

export const ui = {
  ru: {
    navHome: 'Главная',
    navPosts: 'Статьи',
    navTags: 'Теги',
    navAbout: 'Обо мне',
    navSearch: 'Поиск',
    latest: 'Последние заметки',
    allPosts: 'Все статьи',
    readMore: 'Читать',
    readingTime: (n: number) => (n === 1 ? '1 мин' : `${n} мин`),
    published: 'Опубликовано',
    updated: 'Обновлено',
    tags: 'Теги',
    tagged: 'Статьи с тегом',
    noTags: 'Тегов пока нет.',
    noPosts: 'Статей ещё нет.',
    noPostsTag: 'С этим тегом статей нет.',
    toc: 'Содержание',
    prev: 'Раньше',
    next: 'Позже',
    translationMissing: 'Этой статьи пока нет на английском.',
    translationAvailable: 'English version',
    searchPlaceholder: 'Поиск по заголовкам и тексту…',
    searchEmpty: 'Начните вводить запрос.',
    searchNoResults: 'Ничего не нашлось.',
    searchHint: 'Ищем по заголовку, описанию, тегам и тексту статьи.',
    rss: 'RSS',
    footerNote: 'Пишите статьи в Markdown с KaTeX. Публикация — GitHub Pages.',
    language: 'Язык',
    theme: 'Тема',
    themeLight: 'Светлая',
    themeDark: 'Тёмная',
    notFound: 'Страница не найдена',
    notFoundBody: 'Такого адреса нет. Вернитесь на главную или в ленту статей.',
    draft: 'Черновик',
    codeCaption: 'Листинг',
  },
  en: {
    navHome: 'Home',
    navPosts: 'Notes',
    navTags: 'Tags',
    navAbout: 'About',
    navSearch: 'Search',
    latest: 'Latest notes',
    allPosts: 'All notes',
    readMore: 'Read',
    readingTime: (n: number) => (n === 1 ? '1 min' : `${n} min`),
    published: 'Published',
    updated: 'Updated',
    tags: 'Tags',
    tagged: 'Notes tagged',
    noTags: 'No tags yet.',
    noPosts: 'No notes yet.',
    noPostsTag: 'No notes with this tag.',
    toc: 'On this page',
    prev: 'Earlier',
    next: 'Later',
    translationMissing: 'This note is not translated into Russian yet.',
    translationAvailable: 'Русская версия',
    searchPlaceholder: 'Search titles and text…',
    searchEmpty: 'Start typing to search.',
    searchNoResults: 'Nothing matched.',
    searchHint: 'Search looks through titles, descriptions, tags, and the article body.',
    rss: 'RSS',
    footerNote: 'Write in Markdown with KaTeX. Published on GitHub Pages.',
    language: 'Language',
    theme: 'Theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    notFound: 'Page not found',
    notFoundBody: 'This URL does not exist. Head home or browse the notes.',
    draft: 'Draft',
    codeCaption: 'Listing',
  },
} as const;

export function isLocale(value: string | undefined): value is Locale {
  return value === 'ru' || value === 'en';
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'ru' ? 'en' : 'ru';
}

export function localePaths() {
  return locales.map((lang) => ({ params: { lang } }));
}

/** Locale-prefixed URL that respects `import.meta.env.BASE_URL`. */
export function href(locale: Locale, ...parts: string[]) {
  const base = import.meta.env.BASE_URL.endsWith('/')
    ? import.meta.env.BASE_URL
    : `${import.meta.env.BASE_URL}/`;
  const rest = parts
    .filter(Boolean)
    .join('/')
    .replace(/^\/+|\/+$/g, '');
  if (!rest) return `${base}${locale}/`;
  if (/\.[a-z0-9]+$/i.test(rest)) return `${base}${locale}/${rest}`;
  return `${base}${locale}/${rest}/`;
}

export function formatDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'ru' ? 'ru-RU' : 'en-GB', {
    dateStyle: 'long',
  }).format(date);
}
