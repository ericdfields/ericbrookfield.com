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

export function loadTimelineData(): TimelineData {
  const curationPath = path.join(process.cwd(), 'data', 'curation.yaml');

  let curation: CurationFile = { tools: [], projects: [], interests: [] };

  if (fs.existsSync(curationPath)) {
    const raw = fs.readFileSync(curationPath, 'utf-8');
    curation = yaml.load(raw) as CurationFile;
  }

  return {
    tools: curation.tools || [],
    projects: curation.projects || [],
    interests: curation.interests || [],
    generatedAt: new Date().toISOString(),
  };
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
  const latest = ends.length > 0
    ? new Date(Math.max(...ends.map(d => d.getTime())))
    : new Date();

  return { start: earliest, end: latest };
}
