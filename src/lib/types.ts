export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  email: string;
}

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  introText: string;
  demoReelUrl: string;
}

export interface WorkItem {
  id: string;
  title: string;
  link: string;
  description?: string;
}

export interface ResumeContent {
  personalInfo: {
    name: string;
    email: string;
    location?: string;
  };
  summary: string;
  experience: Array<{
    role: string;
    company: string;
    period: string;
    description: string;
  }>;
  skills: string[];
  education: Array<{
    degree: string;
    school: string;
    year: string;
  }>;
}


