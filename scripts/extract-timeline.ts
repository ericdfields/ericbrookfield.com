// scripts/extract-timeline.ts
import Anthropic from '@anthropic-ai/sdk';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import type { TimelineData, Tool, Project, Interest } from '../src/types/timeline';

const client = new Anthropic();

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  content: string;
}

async function loadBlogPosts(): Promise<BlogPost[]> {
  const posts: BlogPost[] = [];
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');

  function walkDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walkDir(fullPath);
      } else if (entry.name.endsWith('.md')) {
        const raw = fs.readFileSync(fullPath, 'utf-8');
        const { data, content } = matter(raw);
        posts.push({
          slug: entry.name.replace('.md', ''),
          title: data.title || '',
          date: data.date?.toISOString?.() || data.date || '',
          content: content.trim(),
        });
      }
    }
  }

  walkDir(blogDir);
  return posts.sort((a, b) => a.date.localeCompare(b.date));
}

async function extractFromPosts(posts: BlogPost[]): Promise<Partial<TimelineData>> {
  const postsContext = posts.map(p =>
    `[${p.date.split('T')[0]}] ${p.title}\n${p.content.slice(0, 500)}...`
  ).join('\n\n---\n\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    messages: [{
      role: 'user',
      content: `Analyze these blog posts and extract timeline data about:
1. Tools/technologies being used (with approximate dates)
2. Projects being worked on
3. Interests/topics being explored

For each item, provide:
- A unique id (lowercase, hyphenated)
- Name
- Status (for tools: active/exploring/dormant/abandoned; for projects: active/paused/completed/abandoned; for interests: current/recurring/past)
- Time spans (start date, optional end date)
- Brief reasoning for why you inferred this

Output as JSON matching this structure:
{
  "tools": [{ "id": "", "name": "", "category": "", "status": "", "spans": [{"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"}], "aiReasoning": "" }],
  "projects": [{ "id": "", "name": "", "description": "", "status": "", "spans": [...], "aiReasoning": "" }],
  "interests": [{ "id": "", "name": "", "status": "", "depth": "shallow|medium|deep", "spans": [...], "aiReasoning": "" }]
}

Blog posts:
${postsContext}`
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse AI response as JSON');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Add source: 'ai' to all items
  return {
    tools: (parsed.tools || []).map((t: Tool) => ({ ...t, source: 'ai' as const })),
    projects: (parsed.projects || []).map((p: Project) => ({ ...p, source: 'ai' as const })),
    interests: (parsed.interests || []).map((i: Interest) => ({ ...i, source: 'ai' as const })),
  };
}

async function main() {
  console.log('Loading blog posts...');
  const posts = await loadBlogPosts();
  console.log(`Found ${posts.length} posts`);

  console.log('Extracting timeline data with AI...');
  const aiData = await extractFromPosts(posts);

  console.log('Writing to data/timeline-ai.json...');
  const outputPath = path.join(process.cwd(), 'data', 'timeline-ai.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(aiData, null, 2));

  console.log('Done! Review the output and merge into curation.yaml as needed.');
  console.log(`Extracted: ${aiData.tools?.length || 0} tools, ${aiData.projects?.length || 0} projects, ${aiData.interests?.length || 0} interests`);
}

main().catch(console.error);
