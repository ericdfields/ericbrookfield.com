// src/lib/timeline.ts
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import type { TimelineData, Tool, Project, Interest } from '../types/timeline';

interface CurationFile {
  tools?: Tool[];
  projects?: Project[];
  interests?: Interest[];
}

interface AIFile {
  tools?: Tool[];
  projects?: Project[];
  interests?: Interest[];
}

export function loadTimelineData(): TimelineData {
  const curationPath = path.join(process.cwd(), 'data', 'curation.yaml');
  const aiPath = path.join(process.cwd(), 'data', 'timeline-ai.json');

  let curation: CurationFile = { tools: [], projects: [], interests: [] };
  let aiData: AIFile = { tools: [], projects: [], interests: [] };

  if (fs.existsSync(curationPath)) {
    const raw = fs.readFileSync(curationPath, 'utf-8');
    curation = yaml.load(raw) as CurationFile;
  }

  if (fs.existsSync(aiPath)) {
    const raw = fs.readFileSync(aiPath, 'utf-8');
    aiData = JSON.parse(raw) as AIFile;
  }

  // Merge: curation overrides AI data by id
  const mergedTools = mergeById(aiData.tools || [], curation.tools || []);
  const mergedProjects = mergeById(aiData.projects || [], curation.projects || []);
  const mergedInterests = mergeById(aiData.interests || [], curation.interests || []);

  return {
    tools: mergedTools,
    projects: mergedProjects,
    interests: mergedInterests,
    generatedAt: new Date().toISOString(),
  };
}

function mergeById<T extends { id: string }>(aiItems: T[], curationItems: T[]): T[] {
  const merged = new Map<string, T>();

  // Add AI items first
  for (const item of aiItems) {
    merged.set(item.id, item);
  }

  // Curation items override or add
  for (const item of curationItems) {
    merged.set(item.id, item);
  }

  return Array.from(merged.values());
}

export function getActiveAtDate(
  items: (Tool | Project | Interest)[],
  date: Date
): (Tool | Project | Interest)[] {
  const dateStr = date.toISOString().split('T')[0];

  return items.filter(item => {
    return item.spans.some(span => {
      const started = span.start <= dateStr;
      const notEnded = !span.end || span.end >= dateStr;
      return started && notEnded;
    });
  });
}

export function getTimelineRange(data: TimelineData): { start: Date; end: Date } {
  const allSpans = [
    ...data.tools.flatMap(t => t.spans),
    ...data.projects.flatMap(p => p.spans),
    ...data.interests.flatMap(i => i.spans),
  ];

  if (allSpans.length === 0) {
    return { start: new Date('2020-01-01'), end: new Date() };
  }

  const starts = allSpans.map(s => new Date(s.start));
  const ends = allSpans
    .filter(s => s.end)
    .map(s => new Date(s.end!));

  const earliest = new Date(Math.min(...starts.map(d => d.getTime())));

  // End date must always be at least today (active items have no end date)
  const now = new Date();
  const latestEnded = ends.length > 0
    ? new Date(Math.max(...ends.map(d => d.getTime())))
    : now;
  const latest = latestEnded.getTime() > now.getTime() ? latestEnded : now;

  return { start: earliest, end: latest };
}
