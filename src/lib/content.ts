import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const projectsDir = path.join(process.cwd(), "src/content/projects");
const skillsDir = path.join(process.cwd(), "src/content/skills");
const profileDir = path.join(process.cwd(), "src/content/profile");

export interface ProjectMetadata {
  id: string;
  title: string;
  tag: string;
  year: string;
  role: string;
  description: string;
  repoLink?: string;
  liveLink?: string;
  imageUrl?: string;
  skills?: string[];
}

export interface Skill {
  slug: string;
  name: string;
  category: string;
  description: string;
  contentHtml: string;
  rawMarkdown: string;
}

export interface Profile {
  name?: string;
  role?: string;
  email?: string;
  github?: string;
  linkedin?: string;
  photoUrl?: string;
  contentHtml: string;
  rawMarkdown: string;
}

export interface Project {
  slug: string;
  metadata: ProjectMetadata;
  contentHtml: string;
  rawMarkdown: string;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const fullPath = path.join(projectsDir, `${slug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);
    const contentHtml = await marked(content);
    
    return {
      slug,
      metadata: data as ProjectMetadata,
      contentHtml,
      rawMarkdown: content,
    };
  } catch (e) {
    return null;
  }
}

export async function getAllProjects(): Promise<Project[]> {
  if (!fs.existsSync(projectsDir)) return [];
  const fileNames = fs.readdirSync(projectsDir).filter((fn) => fn.endsWith(".md"));
  const projects = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      return getProjectBySlug(slug);
    })
  );

  return projects
    .filter((p): p is Project => p !== null)
    .sort((a, b) => parseInt(a.metadata.id) - parseInt(b.metadata.id));
}

export async function getAllSkills(): Promise<Skill[]> {
  if (!fs.existsSync(skillsDir)) return [];
  const fileNames = fs.readdirSync(skillsDir).filter(fn => fn.endsWith(".md"));
  const skills = await Promise.all(
    fileNames.map(async (fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(skillsDir, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);
      const contentHtml = await marked(content);
      
      return {
        slug,
        name: data.name || slug,
        category: data.category || "General",
        description: data.description || "",
        contentHtml,
        rawMarkdown: content
      };
    })
  );
  return skills;
}

export async function getProfile(): Promise<Profile | null> {
  const fullPath = path.join(profileDir, "about.md");
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const contentHtml = await marked(content);
  return {
    ...data,
    contentHtml,
    rawMarkdown: content
  } as Profile;
}
