import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { localePaths, site, type Locale } from '@/i18n/ui';
import { getPosts, parsePostId } from '@/lib/posts';

export function getStaticPaths() {
  return localePaths();
}

export async function GET(context: APIContext) {
  const lang = context.params.lang as Locale;
  const posts = await getPosts(lang);
  const brand = site[lang];

  return rss({
    title: brand.name,
    description: brand.description,
    site: context.site!,
    items: posts.map((post) => {
      const { slug } = parsePostId(post.id);
      return {
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `${lang}/posts/${slug}/`,
        categories: post.data.tags,
      };
    }),
  });
}
