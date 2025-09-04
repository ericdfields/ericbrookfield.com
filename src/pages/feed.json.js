import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');

  // Sort posts by date, newest first
  const sortedPosts = posts.sort((a, b) =>
    b.data.date.getTime() - a.data.date.getTime()
  );

  const feedItems = sortedPosts.map(post => {
    // Extract the URL path from the original URL or generate from slug
    const urlMatch = post.data.url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+)\.html/);
    const localUrl = urlMatch
      ? `/${urlMatch[1]}/${urlMatch[2]}/${urlMatch[3]}/${urlMatch[4]}`
      : `/blog/${post.slug}`;

    // Get plain text from post body
    const plainText = post.body
      .replace(/<[^>]*>/g, '')
      .replace(/\n+/g, ' ')
      .trim();

    // Use title if available, otherwise use first part of content
    const displayTitle = post.data.title ||
      (plainText ? plainText.substring(0, 95) + '...' : 'No content available');

    // Get content for the feed
    const contentText = plainText;
    const summary = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');

    return {
      id: `${context.site}${localUrl}`,
      url: `${context.site}${localUrl}`,
      title: displayTitle,
      content_text: contentText,
      content_html: post.body,
      summary: summary,
      date_published: post.data.date.toISOString(),
      date_modified: post.data.date.toISOString(),
    };
  });

  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Eric Brookfield',
    home_page_url: context.site,
    feed_url: `${context.site}feed.json`,
    description: 'Thoughts on technology, design, and the craft of building digital products.',
    author: {
      name: 'Eric Brookfield',
      url: context.site,
    },
    items: feedItems,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
