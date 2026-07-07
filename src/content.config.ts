import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string().optional().default(''),
    date: z.coerce.date(),
    url: z.string(),
    categories: z.array(z.string()).optional(),
  }),
});

export const collections = {
  blog,
};
