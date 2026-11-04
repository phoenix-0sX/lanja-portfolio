export interface NavItem {
  label: string;
  href: string;
}

export interface TechMeta {
  /** Iconify name, e.g. `logos:vue` */
  icon: string;
  /** Dark logos that disappear on a dark background */
  invertInDark?: boolean;
}

export type SkillTone = 'green' | 'blue' | 'amber' | 'red';

export interface SkillTier {
  id: string;
  tone: SkillTone;
  /** Badges shown under the icons, e.g. "expert", "> 3 years" */
  badges: string[];
  skills: string[];
}

export interface Experience {
  id: string;
  jobTitle: string;
  employmentType: 'Professional' | 'Internship';
  company: string;
  location: string;
  /** `YYYY-MM` */
  startDate: string;
  /** `YYYY-MM` or null when current */
  endDate: string | null;
  isCurrent: boolean;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  achievement?: { metric: string; description: string };
}

export interface Project {
  id: string;
  title: string;
  type: 'Professional' | 'Personal' | 'Academic' | 'Internship';
  company: string;
  description: string;
  problem: string;
  solution: string;
  technologies: string[];
  link: string;
  featured: boolean;
}

export interface Education {
  qualification: string;
  field: string;
  institution: string;
  location: string;
  /** `YYYY-MM` */
  graduationDate: string;
}

export interface SocialLinks {
  github: string;
  gitlab: string;
  linkedin: string;
  facebook: string;
  website: string;
}

export interface Portfolio {
  meta: {
    name: string;
    fullName: string;
    title: string;
  };
  navigation: NavItem[];
  hero: {
    greeting: string;
    intro: string;
    role: string;
    paragraph: string;
    tags: string[];
    primaryCta: NavItem;
    secondaryCta: NavItem;
  };
  about: {
    shortBio: string;
    fullBio: string;
    professionalSummary: string;
    education: Education[];
    interests: string[];
    languages: { name: string; level: string }[];
    other: { name: string; description: string }[];
  };
  skillTiers: SkillTier[];
  experience: Experience[];
  projects: {
    title: string;
    description: string;
    items: Project[];
  };
  contact: {
    title: string;
    intro: string;
    email: string;
    phone: string;
    phoneDisplay: string;
    location: string;
    socialLinks: SocialLinks;
    form: {
      submitLabel: string;
      successMessage: string;
    };
  };
  resume: {
    label: string;
    fileName: string;
    /** Hosted PDF path or URL. Leave empty to show the button as "coming soon". */
    fileUrl: string;
  };
}

/** Language-neutral source data (see data/portfolio.ts). Prose lives in i18n/locales. */
export type LocaleCode = 'en' | 'fr';

export interface PortfolioBase {
  meta: { name: string; fullName: string };
  navigation: string[];
  about: {
    education: { id: string; location: string; graduationDate: string }[];
    languages: string[];
    other: string[];
  };
  skillTiers: { id: string; tone: SkillTone; skills: string[] }[];
  experience: {
    id: string;
    employmentType: Experience['employmentType'];
    company: string;
    location: string;
    startDate: string;
    endDate: string | null;
    isCurrent: boolean;
    technologies: string[];
  }[];
  projects: {
    id: string;
    type: Project['type'];
    company: string;
    technologies: string[];
    link: string;
    featured: boolean;
  }[];
  contact: {
    email: string;
    phone: string;
    phoneDisplay: string;
    location: string;
    socialLinks: SocialLinks;
  };
  resume: {
    fileName: Record<LocaleCode, string>;
    fileUrl: Record<LocaleCode, string>;
  };
}
