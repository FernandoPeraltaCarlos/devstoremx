import snapshot from '../data/author-projects.json' with { type: 'json' };
import { projectContentBySlug, type ProjectContent } from '../data/project-content.ts';

export interface ProjectImage {
  id?: string;
  src: string;
  avif?: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  source?: string;
  capturedDate?: string;
}

export interface AuthorProject {
  slug: string;
  author: string;
  kind: 'career' | 'personal';
  context: string;
  relatedServices: string[];
  title: string;
  metaTitle: string;
  name: string;
  description: string;
  lead: string;
  summary: string;
  role: string;
  year: string;
  publishedAt: string;
  updatedAt: string;
  sourceUrl: string;
  sourcePublishedAt?: string;
  liveUrl?: string;
  socialImage: string;
  cover?: ProjectImage;
  stack: string[];
  skills: string[];
  challenge: string;
  approach: string;
  howItWorks?: { intro: string; steps: { title: string; description: string }[] };
  workTitle: string;
  work: { title: string; description: string }[];
  resultsTitle: string;
  results: { title: string; description: string }[];
  currentNote?: string;
  images: ProjectImage[];
  gallery: { id: string; layout: string }[];
  sources: { label: string; href: string }[];
  content: ProjectContent;
}

export const authorProjects: AuthorProject[] = (snapshot as Omit<AuthorProject, 'content'>[]).map((project) => {
  const content = projectContentBySlug[project.slug];
  if (!content) throw new Error(`Falta el contenido comercial del proyecto: ${project.slug}`);
  return { ...project, content };
});

export function projectPath(project: Pick<AuthorProject, 'author' | 'slug'>): string {
  return `/equipo/${project.author}/${project.slug}`;
}

/** Los enlaces anteriores del perfil también resuelven a la página local correspondiente. */
export function localProjectPath(sourceUrl: string): string {
  const normalized = sourceUrl.replace(/\/$/, '');
  const project = authorProjects.find((item) => item.sourceUrl.replace(/\/$/, '') === normalized);
  return project ? projectPath(project) : sourceUrl;
}
