import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { isLocale, type Locale } from '../i18n/ui';

export type Post = CollectionEntry<'posts'>;

export function parsePostId(id: string): { locale: Locale; slug: string } {
  const [locale, ...rest] = id.split('/');
  const slug = rest.join('/').replace(/\.md$/, '');
  if (!isLocale(locale) || !slug) {
    throw new Error(`Unexpected post id: ${id}`);
  }
  return { locale, slug };
}

export async function getPosts(locale: Locale): Promise<Post[]> {
  const posts = await getCollection('posts', (post) => {
    const parsed = parsePostId(post.id);
    if (parsed.locale !== locale) return false;
    if (post.data.draft && import.meta.env.PROD) return false;
    return true;
  });
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getPost(locale: Locale, slug: string): Promise<Post | undefined> {
  return getEntry('posts', `${locale}/${slug}`);
}

export async function getTranslation(locale: Locale, slug: string): Promise<Post | undefined> {
  const other = locale === 'ru' ? 'en' : 'ru';
  const entry = await getEntry('posts', `${other}/${slug}`);
  if (!entry) return undefined;
  if (entry.data.draft && import.meta.env.PROD) return undefined;
  return entry;
}

export function readingTime(text: string, locale: Locale) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wpm = locale === 'ru' ? 160 : 200;
  return Math.max(1, Math.round(words / wpm));
}

export function allTags(posts: Post[]) {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

export function tagSlug(tag: string) {
  return encodeURIComponent(tag);
}
