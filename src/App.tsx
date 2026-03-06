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
import { Language, Paper, SiteContent } from './types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const content: Record<Language, SiteContent & { about: any; submit: any; archive: any }> = {
  zh: {
    nav: { home: '首页', browse: '期刊库', about: '关于我们', submit: '在线投稿' },
    searchPlaceholder: '检索论文、作者、DOI或关键词...',
    readMore: '阅读全文',
    backToList: '返回期刊目录',
    featured: '本期封面文章',
    latest: '最新研究成果',
    about: {
      title: '关于拉集',
      subtitle: '凡俗之料，皆可成集',
      description: '拉集(LAJI JOURNAL) 是一本致力于传播高度可疑、极其具体且无意中令人捧腹的学术研究的国际期刊。我们相信，即使是最普通的问题，也值得拥有一个看起来很严肃的 PDF。',
      mission: '我们的使命是打破学术界的沉闷，证明幽默与严谨可以并存。',
    },
    submit: {
      title: '投稿至拉集',
      subtitle: '将您的奇思妙想转化为学术成果。',
      description: '感谢您考虑将您的研究成果提交给拉集。目前我们已采用全新的精简投稿流程。',
      action: '撰写邮件投稿',
    },
    archive: {
      title: '期刊库',
      subtitle: '探索过往的智慧（或尴尬）。',
      volumes: '卷期列表'
    }
  },
  en: {
    nav: { home: 'Home', browse: 'Archive', about: 'About', submit: 'Submission' },
    searchPlaceholder: 'Search papers, authors, DOI...',
    readMore: 'Read Full Article',
    backToList: 'Back to Archive',
    featured: 'Featured Article',
    latest: 'Latest Research',
    about: {
      title: 'About LAJI JOURNAL',
      subtitle: 'Ordinary materials, all can be collected.',
      description: 'LAJI JOURNAL is an international journal dedicated to the dissemination of highly questionable, absurdly specific, and unintentionally hilarious academic research. We believe that even the silliest questions deserve a serious-looking PDF.',
      mission: 'Our mission is to break the dullness of academia and prove that humor and rigor can coexist.',
    },
    submit: {
      title: 'Submit to LAJI JOURNAL',
      subtitle: 'Transform your wild ideas into academic achievements.',
      description: 'Thank you for considering submitting your research to LAJI JOURNAL. We have now adopted a streamlined submission process.',
      action: 'Compose Submission Email',
    },
    archive: {
      title: 'Archive',
      subtitle: 'Explore past wisdom (or embarrassment).',
      volumes: 'Volumes & Issues'
    }
  }
};

type View = 'home' | 'archive' | 'about' | 'submit' | 'reader';

export default function App() {
  const [lang, setLang] = useState<Language>('zh');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPaperId, setSelectedPaperId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
  const otherPapers = filteredPapers.filter(p => p.id !== (selectedPaperId || featuredPaper.id));

  const selectedPaper = useMemo(() =>
    papers.find(p => p.id === selectedPaperId),
    [selectedPaperId]);

  const toggleLang = () => setLang(prev => prev === 'zh' ? 'en' : 'zh');

  const navigateTo = (view: View) => {
    setCurrentView(view);
    setSelectedPaperId(null);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
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
              <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-serif text-2xl font-bold transition-transform group-hover:scale-105">
                S
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-600 border-2 border-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-2xl font-black tracking-tighter leading-none">
                {lang === 'zh' ? '拉集' : 'LAJI JOURNAL'}
              </h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-black/40 font-bold mt-1">
                凡俗之料，皆可成集
              </p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-10">
            <button onClick={() => navigateTo('home')} className={cn("text-[11px] uppercase tracking-[0.15em] font-bold transition-colors relative group", currentView === 'home' ? "text-black" : "text-black/50 hover:text-black")}>
              {t.nav.home}
              <span className={cn("absolute -bottom-1 left-0 h-[1px] bg-black transition-all", currentView === 'home' ? "w-full" : "w-0 group-hover:w-full")} />
            </button>
            <button onClick={() => navigateTo('archive')} className={cn("text-[11px] uppercase tracking-[0.15em] font-bold transition-colors relative group", currentView === 'archive' ? "text-black" : "text-black/50 hover:text-black")}>
              {t.nav.browse}
              <span className={cn("absolute -bottom-1 left-0 h-[1px] bg-black transition-all", currentView === 'archive' ? "w-full" : "w-0 group-hover:w-full")} />
            </button>
            <button onClick={() => navigateTo('about')} className={cn("text-[11px] uppercase tracking-[0.15em] font-bold transition-colors relative group", currentView === 'about' ? "text-black" : "text-black/50 hover:text-black")}>
              {t.nav.about}
              <span className={cn("absolute -bottom-1 left-0 h-[1px] bg-black transition-all", currentView === 'about' ? "w-full" : "w-0 group-hover:w-full")} />
            </button>
            <button onClick={() => navigateTo('submit')} className={cn("text-[11px] uppercase tracking-[0.15em] font-bold transition-colors relative group", currentView === 'submit' ? "text-black" : "text-black/50 hover:text-black")}>
              {t.nav.submit}
              <span className={cn("absolute -bottom-1 left-0 h-[1px] bg-black transition-all", currentView === 'submit' ? "w-full" : "w-0 group-hover:w-full")} />
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
            className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden"
          >
            <nav className="flex flex-col gap-8">
              <button onClick={() => navigateTo('home')} className="text-2xl font-serif font-bold text-left">{t.nav.home}</button>
              <button onClick={() => navigateTo('archive')} className="text-2xl font-serif font-bold text-left">{t.nav.browse}</button>
              <button onClick={() => navigateTo('about')} className="text-2xl font-serif font-bold text-left">{t.nav.about}</button>
              <button onClick={() => navigateTo('submit')} className="text-2xl font-serif font-bold text-left">{t.nav.submit}</button>
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
                  onBack={() => setSelectedPaperId(null)}
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
                      onClick={() => setSelectedPaperId(featuredPaper.id)}
                    >
                      {featuredPaper.title[lang]}
                    </h2>
                    <p className="text-lg text-black/60 leading-relaxed max-w-2xl font-serif italic">
                      "{featuredPaper.abstract[lang]}"
                    </p>
                    <div className="flex flex-wrap items-center gap-6 pt-4">
                      <button
                        onClick={() => setSelectedPaperId(featuredPaper.id)}
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

              {/* Search Bar */}
              <div className="sticky top-24 z-40 mb-20">
                <div className="max-w-3xl mx-auto bg-white border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-2 flex items-center">
                  <Search className="ml-4 w-6 h-6 text-black/30" />
                  <input
                    type="text"
                    placeholder={t.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow px-4 py-4 focus:outline-none font-serif text-xl italic min-w-0"
                  />
                  <div className="hidden md:flex items-center gap-4 px-4 border-l border-black/10 text-[10px] font-black uppercase tracking-widest text-black/40">
                    <span>{filteredPapers.length} Results</span>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                <div className="lg:col-span-8 space-y-20">
                  <div className="flex items-center justify-between border-b-2 border-black pb-4">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em]">{searchQuery ? 'Search Results' : t.latest}</h3>
                    <div className="flex gap-4">
                      <button className="p-1 hover:bg-black/5"><BarChart2 className="w-4 h-4" /></button>
                      <button className="p-1 hover:bg-black/5"><TrendingUp className="w-4 h-4" /></button>
                    </div>
                  </div>

                  <div className="space-y-16">
                    {otherPapers.map((paper, idx) => (
                      <PaperEntry
                        key={paper.id}
                        paper={paper}
                        lang={lang}
                        idx={idx}
                        onClick={() => setSelectedPaperId(paper.id)}
                        t={t}
                      />
                    ))}
                  </div>

                  {/* Call for Papers Section */}
                  <section className="bg-red-600 text-white p-12 space-y-6">
                    <h3 className="font-serif text-3xl font-bold">Call for Papers: The Science of Procrastination</h3>
                    <p className="text-white/80 leading-relaxed">We are seeking submissions for our upcoming special issue on "The Advanced Mechanics of Doing Nothing." Deadline: Whenever you feel like it.</p>
                    <button onClick={() => navigateTo('submit')} className="bg-white text-black px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-stone-100 transition-all">Submit Now</button>
                  </section>
                </div>

                <aside className="lg:col-span-4 space-y-16">
                  {/* Journal Stats */}
                  <div className="border border-black p-8 space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-black/10 pb-4">Journal Metrics</h4>
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <div className="text-3xl font-serif font-bold">0.00</div>
                        <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-1">Impact Factor</div>
                      </div>
                      <div>
                        <div className="text-3xl font-serif font-bold">99%</div>
                        <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-1">Acceptance Rate</div>
                      </div>
                      <div>
                        <div className="text-3xl font-serif font-bold">2.4s</div>
                        <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-1">Avg. Review Time</div>
                      </div>
                      <div>
                        <div className="text-3xl font-serif font-bold">∞</div>
                        <div className="text-[9px] uppercase tracking-widest text-black/40 font-bold mt-1">Citations (Self)</div>
                      </div>
                    </div>
                  </div>

                  {/* Trending Topics */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" /> Trending Topics
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
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Most Read This Month</h4>
                    <div className="space-y-6">
                      {papers.slice(0, 3).map((p, i) => (
                        <div key={p.id} className="flex gap-4 group cursor-pointer" onClick={() => setSelectedPaperId(p.id)}>
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
          ) : currentView === 'archive' ? (
            <motion.div key="archive" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto px-6 py-24 space-y-12">
              <div className="text-center space-y-4">
                <h2 className="font-serif text-5xl font-bold">{t.archive.title}</h2>
                <p className="text-black/50 italic font-serif">{t.archive.subtitle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[2024, 2023, 2022, 2021].map(year => (
                  <div key={year} className="border border-black p-8 hover:bg-black hover:text-white transition-all cursor-pointer group">
                    <h3 className="text-2xl font-serif font-bold mb-4">Volume {year - 2012} ({year})</h3>
                    <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest opacity-60 group-hover:opacity-100">
                      <span>Issue 1</span>
                      <span>Issue 2</span>
                      <span>Issue 3</span>
                      <span>Issue 4</span>
                    </div>
                  </div>
                ))}
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
            <motion.div key="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto px-6 py-24 space-y-12">
              <div className="space-y-4">
                <h2 className="font-serif text-5xl font-bold">{t.submit.title}</h2>
                <p className="text-black/50 italic font-serif">{t.submit.subtitle}</p>
              </div>
              <div className="space-y-8 border-2 border-black p-10 bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] text-center">
                <p className="font-serif text-lg text-black/80">{t.submit.description}</p>
                <div className="pt-4">
                  <a href="mailto:alunHK@outlook.com" className="inline-block bg-black text-white px-12 py-6 text-sm font-black uppercase tracking-widest hover:bg-black/80 transition-all">
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
                <h3 className="font-serif text-3xl font-bold tracking-tighter">LAJI JOURNAL</h3>
              </div>
              <p className="text-lg text-white/50 leading-relaxed font-serif italic">
                “凡俗之料，皆可成集”
              </p>
              <div className="flex gap-6">
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Share2 className="w-4 h-4" /></button>
                <button className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-all"><Globe className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-12">
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Publication</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li onClick={() => navigateTo('archive')} className="cursor-pointer hover:text-white/60">Current Issue</li>
                  <li onClick={() => navigateTo('archive')} className="cursor-pointer hover:text-white/60">All Issues</li>
                  <li><a href="#" className="hover:text-white/60">Special Collections</a></li>
                  <li><a href="#" className="hover:text-white/60">Most Cited</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">Authors</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li onClick={() => navigateTo('submit')} className="cursor-pointer hover:text-white/60">Submit Manuscript</li>
                  <li><a href="#" className="hover:text-white/60">Author Guidelines</a></li>
                  <li><a href="#" className="hover:text-white/60">Peer Review Process</a></li>
                  <li><a href="#" className="hover:text-white/60">Open Access</a></li>
                </ul>
              </div>
              <div className="space-y-6">
                <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-white/40">About</h4>
                <ul className="space-y-4 text-sm font-medium">
                  <li onClick={() => navigateTo('about')} className="cursor-pointer hover:text-white/60">Editorial Board</li>
                  <li><a href="#" className="hover:text-white/60">Contact</a></li>
                  <li><a href="#" className="hover:text-white/60">Press</a></li>
                  <li><a href="#" className="hover:text-white/60">Sponsors</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] uppercase tracking-[0.2em] font-black text-white/30">
            <p>© 2024 LAJI JOURNAL • ISSN 2024-8888 • Published by Absurdity Press</p>
            <div className="flex gap-12">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Cookies</a>
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
      className="group cursor-pointer grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
      onClick={onClick}
    >
      <div className="md:col-span-1 text-4xl font-serif font-black text-black/5 group-hover:text-black/10 transition-colors">
        {String(idx + 1).padStart(2, '0')}
      </div>
      <div className="md:col-span-8 space-y-4">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-black/40">
          <span className="text-black">{paper.category}</span>
          <span className="w-1 h-1 bg-black/20 rounded-full" />
          <span>{paper.date}</span>
          {paper.impactFactor && (
            <>
              <span className="w-1 h-1 bg-black/20 rounded-full" />
              <span className="text-red-600 font-bold">IF: {paper.impactFactor}</span>
            </>
          )}
        </div>
        <h3 className="font-serif text-3xl font-bold leading-tight group-hover:underline decoration-2 underline-offset-8">
          {paper.title[lang]}
        </h3>
        <p className="text-base text-black/50 line-clamp-2 leading-relaxed font-serif italic">
          {paper.abstract[lang]}
        </p>
        <div className="flex items-center gap-6 pt-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-tighter text-black/60">
            <User className="w-3 h-3" />
            {paper.authors.join(', ')}
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
            {t.readMore} <ChevronLeft className="w-3 h-3 rotate-180" />
          </div>
        </div>
      </div>
      <div className="md:col-span-3 hidden md:block">
        <div className="aspect-square bg-stone-100 overflow-hidden grayscale opacity-40 group-hover:opacity-100 transition-all duration-500">
          <img
            src={`https://picsum.photos/seed/${paper.id}/400/400`}
            alt="Paper thumb"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
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
              {viewMode === 'pdf' ? (lang === 'zh' ? '阅读文字版' : 'Read Text') : (lang === 'zh' ? '查看 PDF 原件' : 'View Original PDF')}
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
                  <Award className="w-4 h-4" />
                  Original Research Article
                </div>
                <h1 className="font-serif text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
                  {paper.title[lang]}
                </h1>
                <div className="flex flex-wrap gap-x-8 gap-y-4 text-sm font-bold uppercase tracking-widest border-y border-black/5 py-6">
                  {paper.authors.map((author, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <User className="w-4 h-4 text-black/20" />
                      {author}<sup>{i + 1}</sup>
                    </span>
                  ))}
                </div>
              </div>

              {/* Abstract */}
              <div className="bg-stone-50 p-10 border-l-8 border-black space-y-6">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em]">Abstract</h2>
                <p className="text-xl leading-relaxed text-justify italic font-serif text-black/80">
                  {paper.abstract[lang]}
                </p>
                <div className="flex flex-wrap gap-3 pt-4">
                  {paper.keywords[lang].map((tag, i) => (
                    <span key={i} className="text-[9px] font-black uppercase tracking-widest bg-white border border-black/10 px-3 py-1.5">
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
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10">References & Citations</h2>
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
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] border-b border-black/10 pb-4">Article Information</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-black/40">Published</span>
                  <span>{paper.date}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-black/40">Journal</span>
                  <span>SG</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-black/40">Volume</span>
                  <span>{paper.volume}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-black/40">Issue</span>
                  <span>{paper.issue}</span>
                </div>
                {paper.impactFactor !== undefined && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-red-600">
                    <span>Impact Factor</span>
                    <span>{paper.impactFactor}</span>
                  </div>
                )}
                {paper.citations !== undefined && (
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-black/40">Citations</span>
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
                  <div className="text-[9px] font-black text-black/30 uppercase tracking-widest mb-2">Digital Object Identifier</div>
                  <div className="text-[11px] font-mono break-all">{paper.doi}</div>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em]">Related Articles</h4>
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
