export type Language = 'zh' | 'en';

export interface Paper {
  id: string;
  title: {
    zh: string;
    en: string;
  };
  authors: string[];
  abstract: {
    zh: string;
    en: string;
  };
  content: {
    zh: string;
    en: string;
  };
  date: string;
  journal: string;
  volume: string;
  issue: string;
  doi: string;
  keywords: {
    zh: string[];
    en: string[];
  };
  category: string;
  pdfUrl?: string;
  impactFactor?: number;
  citations?: number;
  reviewScore?: number;
}

export interface SiteContent {
  nav: {
    home: string;
    browse: string;
    about: string;
    submit: string;
  };
  searchPlaceholder: string;
  readMore: string;
  backToList: string;
  featured: string;
  latest: string;
}
