import path from 'path';
import fs from 'fs/promises';

// Load site configuration
export const getSiteConfig = async () => {
  const resolvedPath = path.resolve(process.cwd(), 'content/site.json');
  return JSON.parse(await fs.readFile(resolvedPath, 'utf8'));
};

// Load home content
export const getHomeContent = async () => {
  const resolvedPath = path.resolve(process.cwd(), 'content/home.json');
  return JSON.parse(await fs.readFile(resolvedPath, 'utf8'));
};

// Load work entries
export const getWorkContent = async () => {
  const resolvedPath = path.resolve(process.cwd(), 'content/work.json');
  return JSON.parse(await fs.readFile(resolvedPath, 'utf8'));
};

// Load resume content
export const getResumeContent = async () => {
  const resolvedPath = path.resolve(process.cwd(), 'content/resume.json');
  return JSON.parse(await fs.readFile(resolvedPath, 'utf8'));
};