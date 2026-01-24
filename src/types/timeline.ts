// src/types/timeline.ts

export type ToolStatus = 'active' | 'exploring' | 'dormant' | 'abandoned';
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'abandoned';
export type InterestStatus = 'current' | 'recurring' | 'past';
export type InferenceSource = 'ai' | 'manual' | 'confirmed';

export interface TimelineSpan {
  start: string; // ISO date
  end?: string;  // ISO date, undefined means ongoing
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  status: ToolStatus;
  spans: TimelineSpan[];
  take?: string;           // your opinion/note
  replacedBy?: string;     // id of replacement tool
  replaces?: string;       // id of tool this replaced
  source: InferenceSource;
  aiReasoning?: string;    // why AI inferred this
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  spans: TimelineSpan[];
  tools?: string[];        // tool ids used
  links?: string[];
  learnings?: string;
  source: InferenceSource;
  aiReasoning?: string;
}

export interface Interest {
  id: string;
  name: string;
  status: InterestStatus;
  spans: TimelineSpan[];
  depth: 'shallow' | 'medium' | 'deep';
  relatedPosts?: string[]; // blog post slugs
  connections?: string[];  // other interest ids
  source: InferenceSource;
  aiReasoning?: string;
}

export interface TimelineData {
  tools: Tool[];
  projects: Project[];
  interests: Interest[];
  generatedAt: string;
}
