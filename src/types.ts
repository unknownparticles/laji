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
  acceptanceRate?: string;
  avgReviewTime?: string;
}

export interface News {
  id: string;
  date: string;
  title: {
    zh: string;
    en: string;
  };
  content: {
    zh: string;
    en: string;
  };
}

export interface SiteContent {
  nav: {
    home: string;
    browse: string;
    about: string;
    submit: string;
    donate: string;
    journals: string;
    news: string;
    tags: string;
  };
  searchPlaceholder: string;
  readMore: string;
  backToList: string;
  featured: string;
  latest: string;
  results: string;
  metrics: {
    title: string;
    impactFactor: string;
    acceptanceRate: string;
    avgReviewTime: string;
    citations: string;
  };
  trending: string;
  mostRead: {
    title: string;
    unit: string;
  };
  callForPapers: {
    title: string;
    description: string;
    action: string;
  };
  reader: {
    originalArticle: string;
    readText: string;
    viewPdf: string;
    abstract: string;
    references: string;
    articleInfo: string;
    published: string;
    journal: string;
    volume: string;
    issue: string;
    doi: string;
    relatedArticles: string;
  };
  footer: {
    motto: string;
    publication: {
      title: string;
      current: string;
      all: string;
      special: string;
      mostCited: string;
    };
    authors: {
      title: string;
      submit: string;
      guidelines: string;
      peerReview: string;
      openAccess: string;
    };
    about: {
      title: string;
      board: string;
      contact: string;
      press: string;
      sponsors: string;
    };
    privacy: string;
    terms: string;
    cookies: string;
    publishedBy: string;
  };
  donate: {
    title: string;
    subtitle: string;
    description: string;
    alipay: string;
    wechat: string;
  };
  news: {
    title: string;
    subtitle: string;
  };
  tags: {
    title: string;
    subtitle: string;
  };
  guide: {
    title: string;
    templateTitle: string;
  };
}
