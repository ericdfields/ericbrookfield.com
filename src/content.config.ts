import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const authorshipEnum = z.enum(['human', 'human-ai-assisted', 'ai-generated']);

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().optional().default(''),
    description: z.string().optional(),
    date: z.coerce.date(),
    url: z.string(),
    categories: z.array(z.string()).optional(),
    // Authorship metadata for editorial transparency.
    // Not retroactively applied to posts where provenance is unknown.
    authorship: authorshipEnum.optional(),
    // When true, the post is displayed with a withdrawal notice and the
    // original prose is struck through. Source text is preserved.
    withdrawn: z.boolean().optional(),
  }),
});

export const collections = {
  blog,
};
