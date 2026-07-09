import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { toPlainText } from '../lib/plain-text';

export async function GET(context) {
  const posts = await getCollection('blog');

  // Sort posts by date, newest first
  const sortedPosts = posts.sort((a, b) =>
    b.data.date.getTime() - a.data.date.getTime()
  );

  return rss({
    title: 'Eric Brookfield',
    description: 'Thoughts on technology, design, and the craft of building digital products.',
    site: context.site,
    items: sortedPosts.map(post => {
      // Extract the URL path from the original URL or generate from slug
      const urlMatch = post.data.url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\.html/);
      const localUrl = urlMatch
        ? `/${urlMatch[1]}/${urlMatch[2]}/${urlMatch[3]}/${urlMatch[4]}`
        : `/blog/${post.id}`;

      // Get plain text from post body for description
      const plainText = toPlainText(post.body);

      // Use title if available, otherwise use first part of content
      const displayTitle = post.data.title ||
        (plainText ? plainText.substring(0, 95) + '...' : 'No content available');

      // Get description - use full content if no title, otherwise excerpt
      const description = post.data.title ?
        plainText.substring(0, 200) + '...' :
        plainText;

      return {
        title: displayTitle,
        pubDate: post.data.date,
        description: description,
        link: `${context.site}${localUrl}`,
      };
    }),
  });
}
