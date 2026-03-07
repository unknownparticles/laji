/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Search, Globe, ChevronLeft, ExternalLink, Menu, X, BookOpen, Clock, Tag, User, TrendingUp, Award, FileText, Download, Share2, Bookmark, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { papers } from './data/papers';
import { news } from './data/news';
import { Language, Paper, SiteContent, News } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const content: Record<Language, SiteContent & { about: any; submit: any; archive: any }> = {
  zh: {
    nav: { home: '首页', browse: '期刊库', about: '关于我们', submit: '在线投稿', donate: '捐赠', journals: '所有期刊', news: '新闻中心', tags: '专题系列' },
    searchPlaceholder: '检索论文、作者、DOI或关键词...',
    readMore: '阅读全文',
    backToList: '返回',
    featured: '本期封面文章',
    latest: '最新研究成果',
    results: '条结果',
    metrics: {
      title: '期刊指标',
      impactFactor: '影响因子',
      acceptanceRate: '录取率',
      avgReviewTime: '平均审稿周期',
      citations: '引用次数 (自引)'
    },
    trending: '热门话题',
    mostRead: {
      title: '本月必读',
      unit: '阅读量'
    },
    callForPapers: {
      title: '征稿启事：结构性懈怠与拖延的流体力学',
      description: '本期特刊《无所事事的高级应用》现面向全球征集未完成的初稿。截稿日期：取决于主编的起床时间。',
      action: '立即投稿'
    },
    reader: {
      originalArticle: '原创研究文章',
      readText: '阅读文字版',
      viewPdf: '查看 PDF 原件',
      abstract: '摘要',
      references: '参考文献与引用',
      articleInfo: '文章信息',
      published: '出版日期',
      journal: '期刊',
      volume: '卷',
      issue: '期',
      doi: 'DOI',
      relatedArticles: '相关文章'
    },
    footer: {
      motto: '“凡俗之料，皆可成集”',
      publication: {
        title: '学术出版',
        current: '当期内容',
        all: '所有期刊',
        special: '专题系列',
        mostCited: '高被引论文'
      },
      authors: {
        title: '作者',
        submit: '在线投稿',
        guidelines: '作者指南',
        peerReview: '同行评议过程',
        openAccess: '开放获取'
      },
      about: {
        title: '关于',
        board: '编辑委员会',
        contact: '联系我们',
        press: '新闻中心',
        sponsors: '赞助与支持'
      },
      privacy: '隐私政策',
      terms: '使用条款',
      cookies: 'Cookie 政策',
      publishedBy: '由拉集出版社出版 (Published by Absurdity Press)'
    },
    about: {
      title: '关于 L.A.J.I.',
      subtitle: '凡俗之料，皆可成集',
      description: '拉集(L.A.J.I. JOURNAL) 是一本致力于传播高度可疑、极其具体且无意中令人捧腹的学术研究的国际期刊。我们相信，即使是最普通的问题，也值得拥有一个看起来很严肃的 PDF。',
      mission: '我们的使命是打破学术界的沉闷，证明幽默与严谨可以并存。',
    },
    submit: {
      title: '投稿至 L.A.J.I.',
      subtitle: '将您的奇思妙想转化为学术成果。',
      description: '感谢您考虑将您的研究成果提交给 L.A.J.I.。目前我们已采用全新的精简投稿流程。',
      action: '撰写邮件投稿',
    },
    archive: {
      title: '期刊库',
      subtitle: '探索过往的智慧（或尴尬）。',
      volumes: '卷期列表'
    },
    donate: {
      title: '捐赠支持',
      subtitle: '支持我们的日常运营（和咖啡消耗）',
      description: '每一分捐赠都将直接用于维持服务器运转，以及改善主编的精神健康。',
      alipay: '支付宝',
      wechat: '微信支付'
    },
    news: {
      title: '新闻中心',
      subtitle: '不靠谱研究的最新动态'
    },
    tags: {
      title: '专题与标签',
      subtitle: '按兴趣分类的学术垃圾'
    },
    guide: {
      title: '投稿指南',
      templateTitle: 'Markdown 投稿模板'
    }
  },
  en: {
    nav: { home: 'Home', browse: 'Archive', about: 'About', submit: 'Submission', donate: 'Donate', journals: 'Journals', news: 'News', tags: 'Tags' },
    searchPlaceholder: 'Search papers, authors, DOI...',
    readMore: 'Read Full Article',
    backToList: 'Back',
    featured: 'Featured Article',
    latest: 'Latest Research',
    results: 'Results',
    metrics: {
      title: 'Journal Metrics',
      impactFactor: 'Impact Factor',
      acceptanceRate: 'Acceptance Rate',
      avgReviewTime: 'Avg. Review Time',
      citations: 'Citations (Self)'
    },
    trending: 'Trending Topics',
    mostRead: {
      title: 'Most Read This Month',
      unit: 'Views'
    },
    callForPapers: {
      title: 'Call for Papers: The Science of Procrastination',
      description: 'We are seeking submissions for our upcoming special issue on "The Advanced Mechanics of Doing Nothing." Deadline: Whenever you feel like it.',
      action: 'Submit Now'
    },
    reader: {
      originalArticle: 'Original Research Article',
      readText: 'Read Text',
      viewPdf: 'View Original PDF',
      abstract: 'Abstract',
      references: 'References & Citations',
      articleInfo: 'Article Information',
      published: 'Published',
      journal: 'Journal',
      volume: 'Volume',
      issue: 'Issue',
      doi: 'Digital Object Identifier (DOI)',
      relatedArticles: 'Related Articles'
    },
    footer: {
      motto: '“Ordinary materials, all can be collected.”',
      publication: {
        title: 'Publication',
        current: 'Current Issue',
        all: 'All Issues',
        special: 'Special Collections',
        mostCited: 'Most Cited'
      },
      authors: {
        title: 'Authors',
        submit: 'Submit Manuscript',
        guidelines: 'Author Guidelines',
        peerReview: 'Peer Review Process',
        openAccess: 'Open Access'
      },
      about: {
        title: 'About',
        board: 'Editorial Board',
        contact: 'Contact',
        press: 'Press',
        sponsors: 'Sponsors'
      },
      privacy: 'Privacy',
      terms: 'Terms',
      cookies: 'Cookies',
      publishedBy: 'Published by Absurdity Press'
    },
    about: {
      title: 'About L.A.J.I. JOURNAL',
      subtitle: 'Ordinary materials, all can be collected.',
      description: 'L.A.J.I. JOURNAL is an international journal dedicated to the dissemination of highly questionable, absurdly specific, and unintentionally hilarious academic research. We believe that even the silliest questions deserve a serious-looking PDF.',
      mission: 'Our mission is to break the dullness of academia and prove that humor and rigor can coexist.',
    },
    submit: {
      title: 'Submit to L.A.J.I. JOURNAL',
      subtitle: 'Transform your wild ideas into academic achievements.',
      description: 'Thank you for considering submitting your research to L.A.J.I. JOURNAL. We have now adopted a streamlined submission process.',
      action: 'Compose Submission Email',
    },
    archive: {
      title: 'Archive',
      subtitle: 'Explore past wisdom (or embarrassment).',
      volumes: 'Volumes & Issues'
    },
    donate: {
      title: 'Support Us',
      subtitle: 'Fund our operations (and caffeine intake)',
      description: 'Every donation goes directly to keeping the servers running and improving the Editor-in-Chief\'s mental health.',
      alipay: 'Alipay',
      wechat: 'WeChat Pay'
    },
    news: {
      title: 'News Center',
      subtitle: 'Latest updates on unreliable research'
    },
    tags: {
      title: 'Tags & Series',
      subtitle: 'Categorized academic garbage'
    },
    guide: {
      title: 'Submission Guide',
      templateTitle: 'Markdown Template'
    }
  }
};

type View = 'home' | 'archive' | 'about' | 'submit' | 'reader' | 'donate' | 'news' | 'tags' | 'journals' | 'readerNews';

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setCurrentView(event.state.view || 'home');
        setSelectedPaperId(event.state.paperId || null);
      } else {
        setCurrentView('home');
        setSelectedPaperId(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    if (!window.history.state) {
      window.history.replaceState({ view: 'home', paperId: null }, '');
    }
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const t = content[lang];

  const filteredPapers = useMemo(() => {
    if (!searchQuery) return papers;
    const query = searchQuery.toLowerCase();
    return papers.filter(p =>
      p.title[lang].toLowerCase().includes(query) ||
      p.authors.some(a => a.toLowerCase().includes(query)) ||
      p.keywords[lang].some(k => k.toLowerCase().includes(query)) ||
      p.abstract[lang].toLowerCase().includes(query)
    );
  }, [searchQuery, lang]);

  const featuredPaper = papers[0];
  const homePapersList = papers.slice(1, 11);

  const archivePapersByYear = useMemo(() => {
    let targetPapers = filteredPapers;
    if (searchQuery) return { [t.results]: targetPapers };

    // Pagination logic applied only when there is no search query
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedPapers = targetPapers.slice(startIndex, startIndex + itemsPerPage);

    const groups: Record<string, Paper[]> = {};
    paginatedPapers.forEach(p => {
      const year = p.date.split('-')[0];
      if (!groups[year]) groups[year] = [];
      groups[year].push(p);
    });
    return groups;
  }, [searchQuery, filteredPapers, currentPage, itemsPerPage, t.results]);

  const totalPages = Math.ceil(filteredPapers.length / itemsPerPage);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    papers.forEach(p => {
      p.keywords[lang]?.forEach(k => tags.add(k));
    });
    return Array.from(tags);
  }, [lang]);

  const selectedPaper = useMemo(() =>
    papers.find(p => p.id === selectedPaperId),
    [selectedPaperId]);

  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  const navigateTo = (view: View, paperId: string | null = null, newsId: string | null = null) => {
    setCurrentView(view);
    setSelectedPaperId(paperId);
    setSelectedNewsId(newsId);
    setIsMenuOpen(false);
    setCurrentPage(1); // Reset page on navigation
    window.scrollTo(0, 0);
    window.history.pushState({ view, paperId, newsId }, '');
  };

  const handleBack = () => {
    if (window.history.length > 1 && window.history.state) {
      window.history.back();
    } else {
      navigateTo('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-black selection:text-white">
      {/* Top Navigation */}
      <header className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b",
        scrolled ? "bg-white/90 backdrop-blur-md border-black/10 py-3" : "bg-transparent border-transparent py-6"
      )}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 flex justify-between items-center">
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => navigateTo('home')}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-white flex items-center justify-center transition-transform group-hover:scale-105 overflow-hidden border border-black/5">
                <img src="/favicon.png" alt="S" className="w-full h-full object-contain" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 border-2 border-white" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-black tracking-tighter leading-none">
                {lang === 'zh' ? '拉集 / L.A.J.I.' : 'L.A.J.I. JOURNAL'}
              </h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-black/40 font-bold mt-1">
                League of Academic Junk Inquiry
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            <button onClick={() => navigateTo('home')} className={cn("text-[11px] uppercase tracking-[0.15em] font-bold transition-colors relative group", currentView === 'home' ? "text-black" : "text-black/50 hover:text-black")}>
              {t.nav.home}
              <span className={cn("absolute -bottom-1 left-0 h-[1px] bg-black transition-all", currentView === 'home' ? "w-full" : "w-0 group-hover:w-full")} />
            </button>
            <button onClick={() => navigateTo('journals')} className={cn("text-[11px] uppercase tracking-[0.15em] font-bold transition-colors relative group", currentView === 'journals' ? "text-black" : "text-black/50 hover:text-black")}>
              {t.nav.journals}
              <span className={cn("absolute -bottom-1 left-0 h-[1px] bg-black transition-all", currentView === 'journals' ? "w-full" : "w-0 group-hover:w-full")} />
            </button>
            <button onClick={() => navigateTo('tags')} className={cn("text-[11px] uppercase tracking-[0.15em] font-bold transition-colors relative group", currentView === 'tags' ? "text-black" : "text-black/50 hover:text-black")}>
              {t.nav.tags}
              <span className={cn("absolute -bottom-1 left-0 h-[1px] bg-black transition-all", currentView === 'tags' ? "w-full" : "w-0 group-hover:w-full")} />
            </button>
            <button onClick={() => navigateTo('news')} className={cn("text-[11px] uppercase tracking-[0.15em] font-bold transition-colors relative group", currentView === 'news' ? "text-black" : "text-black/50 hover:text-black")}>
              {t.nav.news}
              <span className={cn("absolute -bottom-1 left-0 h-[1px] bg-black transition-all", currentView === 'news' ? "w-full" : "w-0 group-hover:w-full")} />
            </button>
            <button onClick={() => navigateTo('submit')} className={cn("text-[11px] uppercase tracking-[0.15em] font-bold transition-colors relative group", currentView === 'submit' ? "text-black" : "text-black/50 hover:text-black")}>
              {t.nav.submit}
              <span className={cn("absolute -bottom-1 left-0 h-[1px] bg-black transition-all", currentView === 'submit' ? "w-full" : "w-0 group-hover:w-full")} />
            </button>
            <button onClick={() => navigateTo('donate')} className={cn("text-[11px] uppercase tracking-[0.15em] font-bold transition-colors relative group", currentView === 'donate' ? "text-black" : "text-black/50 hover:text-black")}>
              {t.nav.donate}
              <span className={cn("absolute -bottom-1 left-0 h-[1px] bg-black transition-all", currentView === 'donate' ? "w-full" : "w-0 group-hover:w-full")} />
            </button>
            <div className="h-6 w-[1px] bg-black/10" />
            <button
              onClick={toggleLang}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-2 border-black px-4 py-2 hover:bg-black hover:text-white transition-all"
            >
              <Globe className="w-3 h-3" />
              {lang === 'zh' ? 'EN' : 'ZH'}
            </button>
          </nav>

          <button className="lg:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[60] bg-white pt-24 px-6 lg:hidden"
          >
            <nav className="flex flex-col gap-8">
              <button onClick={() => navigateTo('home')} className="text-2xl font-serif font-bold text-left">{t.nav.home}</button>
              <button onClick={() => navigateTo('journals')} className="text-2xl font-serif font-bold text-left">{t.nav.journals}</button>
              <button onClick={() => navigateTo('tags')} className="text-2xl font-serif font-bold text-left">{t.nav.tags}</button>
              <button onClick={() => navigateTo('news')} className="text-2xl font-serif font-bold text-left">{t.nav.news}</button>
              <button onClick={() => navigateTo('submit')} className="text-2xl font-serif font-bold text-left">{t.nav.submit}</button>
              <button onClick={() => navigateTo('donate')} className="text-2xl font-serif font-bold text-left">{t.nav.donate}</button>
              <button onClick={toggleLang} className="text-sm font-black uppercase tracking-widest border-2 border-black px-6 py-3 self-start">
                {lang === 'zh' ? 'Switch to English' : '切换至中文'}
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow pt-24">
        <AnimatePresence mode="wait">
          {selectedPaperId ? (
            <motion.div
              key="reader"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white min-h-screen"
            >
              {selectedPaper && (
                <PaperReader
                  paper={selectedPaper}
                  lang={lang}
                  onBack={handleBack}
                  t={t}
                />
              )}
            </motion.div>
          ) : currentView === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-24"
            >
              {/* Hero Section */}
              {!searchQuery && (
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24 items-center">
                  <div className="lg:col-span-7 space-y-8">
                    <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-red-600">
                      <Award className="w-4 h-4" />
                      {t.featured}
                    </div>
                    <h2
                      className="font-serif text-4xl md:text-7xl font-bold leading-[1.1] tracking-tight cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => navigateTo('reader', featuredPaper.id)}
                    >
                      {featuredPaper.title[lang]}
                    </h2>
                    <p className="text-lg text-black/60 leading-relaxed max-w-2xl font-serif italic">
                      "{featuredPaper.abstract[lang]}"
                    </p>
                    <div className="flex flex-wrap items-center gap-6 pt-4">
                      <button
                        onClick={() => navigateTo('reader', featuredPaper.id)}
                        className="bg-black text-white px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-black/80 transition-all flex items-center gap-3"
                      >
                        {t.readMore} <ChevronLeft className="w-4 h-4 rotate-180" />
                      </button>
                      <div className="flex items-center gap-2 text-xs font-bold text-black/40">
                        <User className="w-4 h-4" />
                        {featuredPaper.authors.join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5 relative group">
                    <div className="aspect-[4/5] bg-stone-100 border border-black/5 overflow-hidden relative">
                      <img
                        src={`https://picsum.photos/seed/${featuredPaper.id}/800/1000`}
                        alt="Cover"
                        className="w-full h-full object-cover grayscale opacity-80 group-hover:scale-105 transition-transform duration-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
                      <div className="absolute top-8 left-8 right-8 text-white">
                        <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-70">Volume 12 • Issue 4</div>
                        <div className="h-[1px] w-12 bg-white/50 mb-4" />
                        <div className="font-serif text-3xl font-bold leading-tight drop-shadow-lg">
                          {featuredPaper.title[lang]}
                        </div>
                      </div>
                    </div>
                    <div className="absolute -bottom-6 -right-6 w-32 h-32 border-r-2 border-b-2 border-black/10 -z-10" />
                  </div>
                </section>
              )}

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-20">
                  <div className="flex items-center justify-between border-b-2 border-black pb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em]">{t.latest}</h3>
                    <div className="flex gap-4">
                      <button className="p-1 hover:bg-black/5"><BarChart2 className="w-4 h-4" /></button>
                      <button className="p-1 hover:bg-black/5"><TrendingUp className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="space-y-16">
                    {papers.slice(1, 4).map((paper, idx) => (
                      <PaperEntry
                        key={paper.id}
                        paper={paper}
                        lang={lang}
                        idx={idx}
                        onClick={() => navigateTo('reader', paper.id)}
                        t={t}
                      />
                    ))}
                  </div>

                  {/* Call for Papers Section */}
                  <section className="bg-red-600 text-white p-12 space-y-6">
                    <h3 className="font-serif text-3xl font-bold">{t.callForPapers.title}</h3>
                    <p className="text-white/80 leading-relaxed">{t.callForPapers.description}</p>
                    <button onClick={() => navigateTo('submit')} className="bg-white text-black px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-stone-100 transition-all">{t.callForPapers.action}</button>
                  </section>
                </div>

                <aside className="lg:col-span-4 space-y-16">
                  {/* Journal Stats */}
                  <div className="border border-black p-8 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-black/10 pb-4">{t.metrics.title}</h4>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="text-3xl font-serif font-bold">0.00</div>
                        <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-1">{t.metrics.impactFactor}</div>
                      </div>
                      <div>
                        <div className="text-3xl font-serif font-bold">99%</div>
                        <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-1">{t.metrics.acceptanceRate}</div>
                      </div>
                      <div>
                        <div className="text-3xl font-serif font-bold">2.4s</div>
                        <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-1">{t.metrics.avgReviewTime}</div>
                      </div>
                      <div>
                        <div className="text-3xl font-serif font-bold">∞</div>
                        <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-1">{t.metrics.citations}</div>
                      </div>
                    </div>
                  </div>

                  {/* Trending Topics */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> {t.trending}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {['Feline Physics', 'Coffee Dynamics', 'Pigeonomics', 'Sleep Science', 'Absurdity', 'Meta-Review'].map(tag => (
                        <button key={tag} className="px-3 py-1.5 border border-black/10 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Most Read Section */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{t.mostRead.title}</h4>
                    <div className="space-y-6">
                      {papers.slice(0, 3).map((p, i) => (
                        <div key={p.id} className="flex gap-4 group cursor-pointer" onClick={() => navigateTo('reader', p.id)}>
                          <span className="text-2xl font-serif font-black text-black/10 group-hover:text-black transition-colors">{i + 1}</span>
                          <div>
                            <h5 className="text-sm font-bold leading-tight group-hover:underline">{p.title[lang]}</h5>
                            <p className="text-[10px] text-black/40 mt-1 uppercase tracking-widest">{p.authors[0]}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          ) : currentView === 'journals' ? (
            <motion.div key="journals" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-24 space-y-12">
              <div className="text-center space-y-4 mb-16">
                <h2 className="font-serif text-5xl font-bold">{t.archive.title}</h2>
                <p className="text-black/50 italic font-serif">{t.archive.subtitle}</p>
              </div>

              {/* Archive Search Bar */}
              <div className="max-w-3xl mx-auto bg-white border-y-2 lg:border-2 border-black p-2 flex items-center mb-16">
                <Search className="ml-4 w-6 h-6 text-black/30" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow px-4 py-4 focus:outline-none font-serif text-xl italic min-w-0"
                />
                <div className="hidden md:flex items-center gap-4 px-4 border-l border-black/10 text-[10px] font-black uppercase tracking-widest text-black/40">
                  <span>{filteredPapers.length} {t.results}</span>
                </div>
              </div>

              <div className="space-y-16">
                {Object.entries(archivePapersByYear).sort((a, b) => b[0].localeCompare(a[0])).map(([year, yearPapers]) => (
                  <div key={year} className="space-y-8">
                    <h3 className="text-3xl font-serif font-bold border-b-2 border-black pb-4">{year}</h3>
                    <div className="space-y-12">
                      {yearPapers.map((paper, idx) => (
                        <PaperEntry
                          key={paper.id}
                          paper={paper}
                          lang={lang}
                          idx={(currentPage - 1) * itemsPerPage + idx}
                          onClick={() => navigateTo('reader', paper.id)}
                          t={t}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {!searchQuery && totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 mt-20 pt-10 border-t border-black/10">
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.max(1, p - 1));
                      window.scrollTo(0, 0);
                    }}
                    disabled={currentPage === 1}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:text-red-600 disabled:opacity-30 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" /> PREV
                  </button>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                    <span className="text-black">{currentPage}</span> / {totalPages}
                  </div>
                  <button
                    onClick={() => {
                      setCurrentPage(p => Math.min(totalPages, p + 1));
                      window.scrollTo(0, 0);
                    }}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-black hover:text-red-600 disabled:opacity-30 transition-colors"
                  >
                    NEXT <ChevronLeft className="w-4 h-4 rotate-180" />
                  </button>
                </div>
              )}
            </motion.div>
          ) : currentView === 'tags' ? (
            <motion.div key="tags" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-24 space-y-12">
              <div className="text-center space-y-4 mb-16">
                <h2 className="font-serif text-5xl font-bold">{t.tags.title}</h2>
                <p className="text-black/50 italic font-serif">{t.tags.subtitle}</p>
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSearchQuery(tag);
                      navigateTo('journals');
                    }}
                    className="px-6 py-3 border-2 border-black text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : currentView === 'news' ? (
            <motion.div key="news" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-24 space-y-12">
              <div className="text-center space-y-4 mb-16">
                <h2 className="font-serif text-5xl font-bold">{t.news.title}</h2>
                <p className="text-black/50 italic font-serif">{t.news.subtitle}</p>
              </div>
              <div className="space-y-8">
                {news.map(item => (
                  <div key={item.id} className="border-2 border-black p-8 bg-white cursor-pointer hover:bg-stone-50 transition-colors shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px]" onClick={() => navigateTo('readerNews', null, item.id)}>
                    <div className="text-[10px] font-black uppercase tracking-widest text-black/50 mb-4">{item.date}</div>
                    <h3 className="font-serif text-3xl font-bold mb-4">{item.title[lang]}</h3>
                    <div className="text-sm font-bold text-red-600 flex items-center gap-2">{t.readMore} <ChevronLeft className="w-3 h-3 rotate-180" /></div>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : currentView === 'readerNews' && selectedNewsId ? (
            <motion.div key="readerNews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-24 space-y-12">
              {news.filter(n => n.id === selectedNewsId).map(item => (
                <div key={item.id}>
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors mb-12"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    {t.backToList}
                  </button>
                  <h1 className="font-serif text-5xl font-bold mb-6">{item.title[lang]}</h1>
                  <div className="text-[12px] font-black uppercase tracking-widest text-black/50 mb-12 pb-8 border-b-2 border-black">{item.date}</div>
                  <div className="markdown-body text-lg leading-relaxed font-serif prose prose-lg">
                    <Markdown rehypePlugins={[rehypeRaw]}>{item.content[lang]}</Markdown>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : currentView === 'donate' ? (
            <motion.div key="donate" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-6 py-24 space-y-12">
              <div className="text-center space-y-4 mb-16">
                <h2 className="font-serif text-5xl font-bold">{t.donate.title}</h2>
                <p className="text-xl font-serif italic text-red-600">{t.donate.subtitle}</p>
                <p className="text-lg font-serif text-black/70">{t.donate.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-2xl mx-auto">
                <div className="border-2 border-black p-6 bg-white flex flex-col items-center">
                  <h3 className="text-xl font-bold mb-6">{t.donate.alipay}</h3>
                  <img src="/assets/image/alipay.JPG" alt="Alipay" className="w-full aspect-square object-cover bg-stone-100" />
                </div>
                <div className="border-2 border-black p-6 bg-white flex flex-col items-center">
                  <h3 className="text-xl font-bold mb-6">{t.donate.wechat}</h3>
                  <img src="/assets/image/wechat.JPG" alt="Wechat" className="w-full aspect-square object-cover bg-stone-100" />
                </div>
              </div>
            </motion.div>
          ) : currentView === 'about' ? (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-6 py-24 space-y-12">
              <div className="space-y-6">
                <h2 className="font-serif text-5xl font-bold">{t.about.title}</h2>
                <p className="text-xl font-serif italic text-red-600">{t.about.subtitle}</p>
              </div>
              <div className="prose prose-lg font-serif leading-relaxed text-black/70 space-y-8">
                <p>{t.about.description}</p>
                <div className="bg-stone-100 p-8 border-l-4 border-black italic">
                  "{t.about.mission}"
                </div>
                <p>Our editorial board consists of some of the most imaginative (and easily distracted) minds in the world. We pride ourselves on a peer-review process that is as rigorous as a game of rock-paper-scissors.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-24 space-y-12">
              <div className="space-y-4">
                <h2 className="font-serif text-5xl font-bold">{t.submit.title}</h2>
                <p className="text-black/50 italic font-serif">{t.submit.subtitle}</p>
              </div>
              <div className="space-y-8 border-2 border-black p-10 bg-white">
                <p className="font-serif text-lg text-black/80">{t.submit.description}</p>

                <div className="bg-stone-50 border border-black p-8 relative overflow-hidden">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.2em] mb-6 border-b border-black pb-4">{t.guide.templateTitle}</h3>
                  <pre className="text-sm font-mono text-black/70 overflow-x-auto whitespace-pre-wrap">
                    {`---
title: 
  zh: "论文中文标题"
  en: "English Title"
authors: 
  - "作者1"
  - "作者2"
contact: "alunHK@outlook.com"
social: "@twitter_handle"
keywords:
  zh: ["关键词1", "关键词2"]
  en: ["Keyword 1", "Keyword 2"]
abstract:
  zh: "这里是中文摘要。不超过500字。"
  en: "Here is the English abstract. Unbelievably succinct."
---

# 引言
（在此处写下你荒诞但不失学术严谨的开场白）

## 方法学
（解释你是如何吃沙县小吃并同时开拖拉机的）

...`}
                  </pre>
                </div>

                <div className="pt-4 text-center">
                  <a href="mailto:alunHK@outlook.com" className="inline-block bg-black text-white px-12 py-6 text-sm font-black uppercase tracking-widest hover:bg-black/80 transition-all shadow-[8px_8px_0px_0px_rgba(255,0,0,1)] hover:shadow-none hover:translate-x-[8px] hover:translate-y-[8px]">
                    {t.submit.action} (alunHK@outlook.com)
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-24 mt-20">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-5 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white text-black flex items-center justify-center font-serif text-2xl font-bold">L</div>
                <h3 className="font-serif text-3xl font-bold tracking-tighter">L.A.J.I. JOURNAL</h3>
              </div>
              <p className="text-lg text-white/50 leading-relaxed font-serif italic">
                {t.footer.motto}
              </p>
              <div className="flex gap-6">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert(lang === 'zh' ? '链接已复制到剪贴板！' : 'Link copied to clipboard!');
                  }}
                  className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <a href="https://github.com/unknownparticles" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all">
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">{t.footer.publication.title}</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li onClick={() => navigateTo('archive')} className="cursor-pointer hover:text-white/60">{t.footer.publication.current}</li>
                  <li onClick={() => navigateTo('archive')} className="cursor-pointer hover:text-white/60">{t.footer.publication.all}</li>
                  <li onClick={() => navigateTo('archive')} className="cursor-pointer hover:text-white/60">{t.footer.publication.special}</li>
                  <li onClick={() => navigateTo('archive')} className="cursor-pointer hover:text-white/60">{t.footer.publication.mostCited}</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">{t.footer.authors.title}</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li onClick={() => navigateTo('submit')} className="cursor-pointer hover:text-white/60">{t.footer.authors.submit}</li>
                  <li onClick={() => navigateTo('about')} className="cursor-pointer hover:text-white/60">{t.footer.authors.guidelines}</li>
                  <li onClick={() => navigateTo('about')} className="cursor-pointer hover:text-white/60">{t.footer.authors.peerReview}</li>
                  <li onClick={() => navigateTo('about')} className="cursor-pointer hover:text-white/60">{t.footer.authors.openAccess}</li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">{t.footer.about.title}</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li onClick={() => navigateTo('about')} className="cursor-pointer hover:text-white/60">{t.footer.about.board}</li>
                  <li onClick={() => navigateTo('about')} className="cursor-pointer hover:text-white/60">{t.footer.about.contact}</li>
                  <li onClick={() => navigateTo('about')} className="cursor-pointer hover:text-white/60">{t.footer.about.press}</li>
                  <li onClick={() => navigateTo('about')} className="cursor-pointer hover:text-white/60">{t.footer.about.sponsors}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-black text-white/30">
            <p>© 2024 L.A.J.I. JOURNAL • ISSN 2024-8888 • {t.footer.publishedBy}</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-white">{t.footer.privacy}</a>
              <a href="#" className="hover:text-white">{t.footer.terms}</a>
              <a href="#" className="hover:text-white">{t.footer.cookies}</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function PaperEntry({ paper, lang, idx, onClick, t }: { paper: Paper; lang: Language; idx: number; onClick: () => void; t: SiteContent }) {
  return (
    <article
      className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-8 items-start border-b-2 border-black pb-12"
      onClick={onClick}
    >
      <div className="md:col-span-1 text-2xl font-serif font-black text-black/20 group-hover:text-black transition-colors pt-1">
        {String(idx + 1).padStart(2, '0')}
      </div>
      <div className="md:col-span-8 space-y-4">
        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-black/50">
          <span className="text-black inline-block border border-black px-2 py-0.5">{paper.category}</span>
          <span>{paper.date}</span>
          {paper.impactFactor && (
            <>
              <span className="w-1 h-1 bg-black/20 rounded-full" />
              <span className="text-red-600">IF {paper.impactFactor}</span>
            </>
          )}
          <span className="w-1 h-1 bg-black/20 rounded-full hidden sm:block" />
          <span className="hidden sm:inline">DOI: 10.LAJI/{paper.id.split('-').pop()}</span>
        </div>
        <h3 className="font-serif text-3xl font-bold leading-tight text-black group-hover:text-black/70 transition-colors">
          {paper.title[lang]}
        </h3>
        <p className="text-base text-black/60 line-clamp-3 leading-relaxed font-serif text-justify mt-4">
          {paper.abstract[lang]}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-black/10">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-black">
            {paper.authors.join(', ')}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
            {t.readMore} <ChevronLeft className="w-3 h-3 rotate-180" />
          </div>
        </div>
      </div>
      <div className="md:col-span-3 hidden md:block">
        <div className="aspect-[4/5] bg-stone-100 overflow-hidden border border-black/10">
          <img
            src={`https://picsum.photos/seed/${paper.id}/400/500`}
            alt="Paper thumb"
            className="w-full h-full object-cover grayscale opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </article>
  );
}

function PaperReader({ paper, lang, onBack, t }: { paper: Paper; lang: Language; onBack: () => void; t: SiteContent }) {
  const [viewMode, setViewMode] = useState<'text' | 'pdf'>('text');

  const processedContent = useMemo(() => {
    return paper.content[lang].replace(/\[\[doc_refer_(\d+)\]\]/g, '<sup class="citation">[$1]</sup>');
  }, [paper.content, lang]);


  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-20">
      <div className="flex justify-between items-center mb-16">
        <button
          onClick={onBack}
          className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-black/40 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          {t.backToList}
        </button>
        <div className="flex gap-4">
          {paper.pdfUrl && (
            <button
              onClick={() => setViewMode(prev => prev === 'text' ? 'pdf' : 'text')}
              className={cn(
                "px-6 py-3 border-2 border-black text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                viewMode === 'pdf' ? "bg-black text-white" : "hover:bg-black hover:text-white"
              )}
            >
              <FileText className="w-4 h-4" />
              {viewMode === 'pdf' ? t.reader.readText : t.reader.viewPdf}
            </button>
          )}
          <a
            href={paper.pdfUrl}
            download
            className="p-3 border border-black/10 hover:bg-black hover:text-white transition-all block"
          >
            <Download className="w-4 h-4" />
          </a>
          <button className="p-3 border border-black/10 hover:bg-black hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
          <button className="p-3 border border-black/10 hover:bg-black hover:text-white transition-all"><Bookmark className="w-4 h-4" /></button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-12">
          {viewMode === 'pdf' && paper.pdfUrl ? (
            <div className="w-full aspect-[1/1.4] border-2 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-stone-100">
              <iframe
                src={paper.pdfUrl}
                className="w-full h-full"
                title="PDF Viewer"
              />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-600">
                  <span className="border border-red-600 px-2 py-0.5">{t.reader.originalArticle}</span>
                  <span className="w-1 h-1 bg-red-600/30 rounded-full" />
                  <span>DOI: 10.LAJI/{paper.id.split('-').pop()}</span>
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight text-black">
                  {paper.title[lang]}
                </h1>

                <div className="space-y-4 border-y border-black py-8">
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-lg font-serif font-bold text-black">
                    {paper.authors.map((author, i) => (
                      <span key={i} className="flex items-center">
                        {author}<sup className="ml-1 text-xs font-sans text-black/60">{i === 0 ? '1, *' : i === 1 ? '2' : '3'}</sup>
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1 text-sm text-black/60 font-serif italic">
                    <p><sup>1</sup> Institute of Advanced Procrastination, L.A.J.I. University</p>
                    {paper.authors.length > 1 && <p><sup>2</sup> Department of Absurd Studies</p>}
                    <p className="pt-2"><sup>*</sup> Corresponding author. Email: alunHK@outlook.com</p>
                  </div>
                </div>
              </div>

              {/* Abstract */}
              <div className="bg-stone-50 border border-black p-10 space-y-8 relative">
                <div className="absolute top-0 left-0 w-full h-[4px] bg-black" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">{t.reader.abstract}</h2>
                <div className="text-justify">
                  <p className="text-xl leading-relaxed font-serif text-black/80">
                    {paper.abstract[lang]}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 pt-6 border-t border-black/10">
                  {paper.keywords[lang].map((tag, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-white border border-black px-3 py-1.5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Body */}
              <div className="markdown-body text-lg py-12">
                <Markdown rehypePlugins={[rehypeRaw]}>{processedContent}</Markdown>
              </div>

              {/* References */}
              <div className="pt-20 border-t-2 border-black">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10">{t.reader.references}</h2>
                <div className="space-y-8 font-mono text-xs text-black/50">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-6">
                      <span className="font-black text-black/20">[{i}]</span>
                      <p className="leading-relaxed">
                        {i === 1 ? 'Ig Nobel Prize Committee. (2023). "Why we do what we do." Journal of Improbable Research, 29(4), 12-45.' :
                          i === 2 ? 'Einstein, A. (1905). "On the Electrodynamics of Moving Bodies." Annalen der Physik, 17(10), 891-921.' :
                            'Doe, J. (2022). "The correlation between bread toast orientation and floor impact." SG Archive, 11(2), 101.'}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Reader Sidebar */}
        <aside className="lg:col-span-4 space-y-12">
          <div className="sticky top-32 space-y-12">
            {/* Article Info */}
            <div className="border border-black p-8 space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-black/10 pb-4">{t.reader.articleInfo}</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-black/40">{t.reader.published}</span>
                  <span>{paper.date}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-black/40">{t.reader.journal}</span>
                  <span>SG</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-black/40">{t.reader.volume}</span>
                  <span>{paper.volume}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-black/40">{t.reader.issue}</span>
                  <span>{paper.issue}</span>
                </div>
                {paper.impactFactor !== undefined && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-red-600">
                    <span>{t.metrics.impactFactor}</span>
                    <span>{paper.impactFactor}</span>
                  </div>
                )}
                {paper.citations !== undefined && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-black/40">{t.metrics.citations}</span>
                    <span>{paper.citations}</span>
                  </div>
                )}
                {paper.reviewScore !== undefined && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-black/40">Review Score</span>
                    <span>{paper.reviewScore}/10.0</span>
                  </div>
                )}
                <div className="pt-4 border-t border-black/5">
                  <div className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-2">{t.reader.doi}</div>
                  <div className="text-[11px] font-mono break-all">{paper.doi}</div>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">{t.reader.relatedArticles}</h4>
              <div className="space-y-8">
                {papers.filter(p => p.id !== paper.id).slice(0, 2).map(p => (
                  <div key={p.id} className="group cursor-pointer" onClick={() => { window.scrollTo(0, 0); onBack(); /* Simplified navigation */ }}>
                    <div className="text-[9px] font-bold text-black/40 uppercase tracking-widest mb-2">{p.category}</div>
                    <h5 className="font-serif text-base font-bold group-hover:underline leading-tight">
                      {p.title[lang]}
                    </h5>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
