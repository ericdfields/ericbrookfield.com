import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
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
