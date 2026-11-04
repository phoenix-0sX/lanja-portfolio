import type { PortfolioBase } from '~/types/portfolio';

/**
 * Language-neutral facts: ids, dates, technologies, links and contact details.
 * Every visible sentence lives in `i18n/locales/{en,fr}.json`, keyed by the ids below,
 * and is merged in by `usePortfolio()`.
 * Date of birth and age are intentionally left out of the public site.
 */
export const base: PortfolioBase = {
  meta: {
    name: 'Lanja',
    fullName: 'ANDRIAMANANTSOA Faniry Harilanja',
  },

  navigation: ['home', 'about', 'skills', 'experience', 'projects', 'contact'],

  about: {
    education: [
      {
        id: 'master',
        location: 'Fianarantsoa, Madagascar',
        graduationDate: '2022-11',
      },
      {
        id: 'bachelor',
        location: 'Fianarantsoa, Madagascar',
        graduationDate: '2020-02',
      },
    ],
    languages: ['malagasy', 'french', 'english'],
    other: ['linux', 'scrum', 'uml', 'database', 'performance', 'deployment'],
  },

  // Grouped like the mockup: most used, advanced, intermediate, academic / learning.
  skillTiers: [
    {
      id: 'expert',
      tone: 'green',
      skills: [
        'JavaScript',
        'TypeScript',
        'Vue.js',
        'Vite',
        'MySQL',
        'Git',
        'REST API',
        'npm',
        'Tailwind CSS',
        'Bootstrap',
      ],
    },
    {
      id: 'advanced',
      tone: 'blue',
      skills: ['PHP', 'Laravel', 'PostgreSQL', 'Nuxt.js'],
    },
    {
      id: 'intermediate',
      tone: 'amber',
      skills: ['Python', 'Flask', 'FastAPI', 'Docker', 'GraphQL', 'Nginx'],
    },
    {
      id: 'academic',
      tone: 'red',
      skills: [
        'Java',
        'React.js',
        'React Native',
        'Flutter',
        'Ionic Capacitor',
        'Node.js',
        'Symfony',
        'CodeIgniter',
        'C',
        'C++',
        'SQLite',
        'Redis',
      ],
    },
  ],

  experience: [
    {
      id: 'neoshore-frontend-developer',
      employmentType: 'Professional',
      company: 'Neoshore Madagascar / Thegreenshot',
      location: 'Antananarivo, Madagascar',
      startDate: '2023-11',
      endDate: '2026-11',
      isCurrent: false,
      technologies: [
        'Vue.js',
        'JavaScript',
        'TypeScript',
        'MySQL',
        'Git',
        'GraphQL',
        'Docker',
      ],
    },
    {
      id: 'kontiki-full-stack-developer',
      employmentType: 'Professional',
      company: 'Kontiki Service',
      location: 'Antsahavola, Antananarivo, Madagascar',
      startDate: '2023-01',
      endDate: '2023-11',
      isCurrent: false,
      technologies: [
        'Laravel',
        'PHP',
        'Nuxt.js',
        'Vue.js',
        'JavaScript',
        'TypeScript',
        'Python',
        'Flask',
        'FastAPI',
        'MySQL',
        'PostgreSQL',
        'REST API',
        'Git',
        'Docker',
      ],
    },
    {
      id: 'kontiki-internship',
      employmentType: 'Internship',
      company: 'Kontiki Service',
      location: 'Antsahavola, Antananarivo, Madagascar',
      startDate: '2022-06',
      endDate: '2022-12',
      isCurrent: false,
      technologies: [
        'Flask',
        'Laravel',
        'Vue.js',
        'MySQL',
        'PostgreSQL',
        'REST API',
      ],
    },
    {
      id: 'dgi-php-internship',
      employmentType: 'Internship',
      company:
        "Service du Système d'Information Fiscale, Direction générale des Impôts",
      location: 'Antananarivo, Madagascar',
      startDate: '2019-11',
      endDate: '2020-02',
      isCurrent: false,
      technologies: [
        'HTML',
        'CSS',
        'JavaScript',
        'jQuery',
        'Laravel',
        'PHP',
        'PostgreSQL',
        'REST API',
      ],
    },
  ],

  projects: [
    {
      id: 'neoshore-vuejs-application',
      type: 'Professional',
      company: 'Neoshore Madagascar / Thegreenshot',
      technologies: [
        'Vue.js',
        'JavaScript',
        'TypeScript',
        'MySQL',
        'GraphQL',
        'Docker',
        'Git',
      ],
      link: '',
      featured: true,
    },
    {
      id: 'campaign-data-dashboard',
      type: 'Professional',
      company: 'Kontiki Service',
      technologies: [
        'Vue.js',
        'JavaScript',
        'TypeScript',
        'Nuxt.js',
        'REST API',
      ],
      link: '',
      featured: true,
    },
    {
      id: 'campaign-minisite-generator',
      type: 'Professional',
      company: 'Kontiki Service',
      technologies: ['PHP', 'Laravel', 'Docker'],
      link: '',
      featured: true,
    },
    {
      id: 'automated-campaign-data-processing',
      type: 'Professional',
      company: 'Kontiki Service',
      technologies: ['Python', 'Flask', 'FastAPI'],
      link: '',
      featured: false,
    },
    {
      id: 'tax-minimum-payment-platform',
      type: 'Internship',
      company: 'Direction générale des Impôts',
      technologies: [
        'PHP',
        'Laravel',
        'JavaScript',
        'jQuery',
        'PostgreSQL',
        'REST API',
      ],
      link: '',
      featured: true,
    },
  ],

  contact: {
    email: 'lanjarl054@gmail.com',
    phone: '+261349388953',
    phoneDisplay: '+261 34 93 889 53',
    location: 'Analamanga, Antananarivo 101, Madagascar',
    // Fill these in and the icons appear automatically in the footer and contact section.
    socialLinks: {
      github: 'https://github.com/phoenix-0sX',
      gitlab: '',
      linkedin:
        'https://www.linkedin.com/in/andriamanantsoa-faniry-harilanja-3b0b76197/',
      facebook: 'https://web.facebook.com/ratsah.firephoenix.5',
      website: '',
    },
  },

  resume: {
    // One PDF per language. Drop the files in app/public/cv/ and set e.g.
    // fr: '/cv/CV_ANDRIAMANANTSOA_Faniry_Harilanja_FR.pdf'. Empty = button shows "coming soon".
    fileName: {
      en: 'CV_ANDRIAMANANTSOA_Faniry_Harilanja_EN.pdf',
      fr: 'CV_ANDRIAMANANTSOA_Faniry_Harilanja_FR.pdf',
    },
    fileUrl: {
      en: '/cv/CV_ANDRIAMANANTSOA_Faniry_Harilanja_EN.pdf',
      fr: '/cv/CV_ANDRIAMANANTSOA_Faniry_Harilanja_FR.pdf',
    },
  },
};
