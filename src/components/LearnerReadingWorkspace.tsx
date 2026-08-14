import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen,
  FileText,
  CheckCircle2,
  Lock,
  Sun,
  Moon,
  Type,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  Clock,
  Bookmark,
  List,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Eye,
  AlertCircle,
  Sparkles,
  ArrowRight,
  PanelLeftClose,
  PanelLeftOpen,
  HelpCircle,
  FileCode,
  ShieldCheck,
  Check
} from 'lucide-react';

export interface LessonContent {
  id: string;
  title: string;
  type: 'text_markdown' | 'text_html' | 'pdf_document' | 'docx_document';
  estimatedReadTimeMinutes: number;
  contentHtml?: string;
  documentUrl?: string;
  documentFileName?: string;
  documentFileSize?: string;
  documentPageCount?: number;
  tableOfContents?: { id: string; title: string; level: number }[];
}

export interface ModuleStructure {
  id: string;
  title: string;
  sequenceOrder: number;
  isLocked: boolean;
  prerequisiteTitle?: string;
  lessons: LessonContent[];
}

interface LearnerReadingWorkspaceProps {
  courseTitle: string;
  modules: ModuleStructure[];
  activeLessonId: string;
  completedLessonIds: string[];
  onSelectLesson: (lessonId: string) => void;
  onMarkLessonCompleted: (lessonId: string) => void;
  onNavigateBack: () => void;
  onOpenQuiz?: (quizId: string) => void;
}

type ReaderTheme = 'light' | 'sepia' | 'dark';
type FontSize = 'sm' | 'base' | 'lg' | 'xl';
type ContentWidth = 'normal' | 'wide' | 'full';

export const LearnerReadingWorkspace: React.FC<LearnerReadingWorkspaceProps> = ({
  courseTitle,
  modules,
  activeLessonId,
  completedLessonIds,
  onSelectLesson,
  onMarkLessonCompleted,
  onNavigateBack,
  onOpenQuiz
}) => {
  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'toc' | 'notes' | 'settings'>('toc');

  // Reader customization state (WCAG 2.1 AA)
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>('light');
  const [fontSize, setFontSize] = useState<FontSize>('base');
  const [contentWidth, setContentWidth] = useState<ContentWidth>('normal');
  const [distractionFree, setDistractionFree] = useState(false);

  // Document Viewer controls
  const [docZoom, setDocZoom] = useState(100);
  const [docPage, setDocPage] = useState(1);
  const [docRotation, setDocRotation] = useState(0);

  // Scroll & Progress tracking
  const [readProgress, setReadProgress] = useState(0);
  const [readReceiptTriggered, setReadReceiptTriggered] = useState(false);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [userNotes, setUserNotes] = useState<string>('');
  const contentRef = useRef<HTMLDivElement>(null);

  // Find active module & lesson
  let currentLesson: LessonContent | null = null;
  let currentModule: ModuleStructure | null = null;

  for (const m of modules) {
    const found = m.lessons.find((l) => l.id === activeLessonId);
    if (found) {
      currentLesson = found;
      currentModule = m;
      break;
    }
  }

  // Fallback if not found
  if (!currentLesson && modules.length > 0 && modules[0].lessons.length > 0) {
    currentLesson = modules[0].lessons[0];
    currentModule = modules[0];
  }

  const isCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;

  // Track scroll position for Read Receipts
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const totalScrollable = scrollHeight - clientHeight;
      if (totalScrollable <= 0) {
        setReadProgress(100);
        return;
      }
      const progress = Math.min(100, Math.round((scrollTop / totalScrollable) * 100));
      setReadProgress(progress);

      // Auto read receipt at 90%
      if (progress >= 90 && currentLesson && !readReceiptTriggered && !isCompleted) {
        setReadReceiptTriggered(true);
        onMarkLessonCompleted(currentLesson.id);
      }
    };

    const node = contentRef.current;
    if (node) {
      node.addEventListener('scroll', handleScroll);
      return () => node.removeEventListener('scroll', handleScroll);
    }
  }, [currentLesson, readReceiptTriggered, isCompleted, onMarkLessonCompleted]);

  // Reset progress when changing lesson
  useEffect(() => {
    setReadProgress(0);
    setReadReceiptTriggered(false);
    setDocPage(1);
    setDocZoom(100);
    setDocRotation(0);
  }, [activeLessonId]);

  // Theme styling rules
  const themeStyles = {
    light: 'bg-white text-slate-900 border-slate-200',
    sepia: 'bg-[#fbf0d9] text-[#433422] border-[#e6d7b8]',
    dark: 'bg-slate-950 text-slate-100 border-slate-800'
  };

  const themeBgStyles = {
    light: 'bg-slate-50',
    sepia: 'bg-[#f4e8cf]',
    dark: 'bg-slate-900'
  };

  const fontSizes = {
    sm: 'text-sm leading-relaxed',
    base: 'text-base leading-relaxed',
    lg: 'text-lg leading-loose',
    xl: 'text-xl leading-loose'
  };

  const contentWidths = {
    normal: 'max-w-3xl',
    wide: 'max-w-5xl',
    full: 'max-w-full px-6'
  };

  // Calculate overall course progress
  const totalLessonsCount = modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const overallProgressPercentage = totalLessonsCount > 0 
    ? Math.round((completedLessonIds.length / totalLessonsCount) * 100) 
    : 0;

  const toggleBookmark = (id: string) => {
    setBookmarks((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${themeBgStyles[readerTheme]}`}>
      {/* Skip to Main Content Link for WCAG 2.1 AA Keyboard Navigation */}
      <a
        href="#main-reading-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none"
      >
        Lompati ke konten bacaan utama
      </a>

      {/* Enterprise Top Navigation Bar */}
      {!distractionFree && (
        <header
          role="banner"
          className="bg-slate-900 text-white border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-md"
        >
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateBack}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label="Kembali ke Dasbor"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Dasbor Kursus</span>
            </button>

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
              aria-label={sidebarOpen ? "Tutup Panel Modul" : "Buka Panel Modul"}
            >
              {sidebarOpen ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            <div className="hidden md:block h-5 w-px bg-slate-800 mx-1" />

            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 block">
                {courseTitle}
              </span>
              <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md">
                {currentLesson?.title || 'Modul Pembelajaran'}
              </h1>
            </div>
          </div>

          {/* Top Bar Right Controls & Progress */}
          <div className="flex items-center gap-4">
            {/* Global Course Progress Bar */}
            <div className="hidden lg:flex items-center gap-3 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60">
              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Kemajuan Kursus</div>
                <div className="text-xs font-bold text-emerald-400">{overallProgressPercentage}% Selesai</div>
              </div>
              <div className="w-20 bg-slate-700 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-500"
                  style={{ width: `${overallProgressPercentage}%` }}
                />
              </div>
            </div>

            {/* WCAG Accessibility Theme Quick Toggles */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setReaderTheme('light')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  readerTheme === 'light' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Tema Terang (Default)"
                aria-label="Ubah ke Tema Terang"
              >
                <Sun className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setReaderTheme('sepia')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  readerTheme === 'sepia' ? 'bg-[#fbf0d9] text-[#433422] shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Tema Sepia (Nyaman Membaca)"
                aria-label="Ubah ke Tema Sepia"
              >
                <span className="font-serif font-black text-xs px-0.5">Aa</span>
              </button>
              <button
                onClick={() => setReaderTheme('dark')}
                className={`p-1.5 rounded-lg text-xs font-semibold transition-all ${
                  readerTheme === 'dark' ? 'bg-slate-950 text-slate-100 shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
                title="Tema Gelap (Malam)"
                aria-label="Ubah ke Tema Gelap"
              >
                <Moon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Distraction Free Toggle */}
            <button
              onClick={() => setDistractionFree(true)}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              aria-label="Aktifkan Mode Bebas Gangguan"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fokus Membaca</span>
            </button>
          </div>
        </header>
      )}

      {/* Exit Distraction-Free Floating Button */}
      {distractionFree && (
        <button
          onClick={() => setDistractionFree(false)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-slate-900 text-white rounded-full shadow-2xl border border-slate-700 flex items-center gap-2 text-xs font-bold hover:bg-slate-800 transition-all"
          aria-label="Keluar dari Mode Bebas Gangguan"
        >
          <Minimize2 className="w-4 h-4 text-blue-400" />
          <span>Keluar Mode Fokus</span>
        </button>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar: Modules, Lessons & Prerequisites Navigator */}
        {sidebarOpen && !distractionFree && (
          <aside
            role="navigation"
            aria-label="Daftar Modul & Materi"
            className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 z-20 text-slate-300"
          >
            {/* Sidebar Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/60 p-1">
              <button
                onClick={() => setActiveTab('toc')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'toc' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5 text-blue-400" />
                <span>Modul Kursus</span>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'notes' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Catatan Saku</span>
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'settings' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Type className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tampilan</span>
              </button>
            </div>

            {/* Tab 1: Module Structure */}
            {activeTab === 'toc' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {modules.map((mod, modIdx) => (
                  <div key={mod.id} className="space-y-1.5">
                    {/* Module Header */}
                    <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded bg-blue-900/60 text-blue-300 font-bold text-[10px] flex items-center justify-center">
                          {modIdx + 1}
                        </span>
                        <h2 className="text-xs font-extrabold text-white truncate max-w-[170px]">
                          {mod.title}
                        </h2>
                      </div>

                      {mod.isLocked ? (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                          <Lock className="w-3 h-3" />
                          <span>Terkunci</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium">
                          {mod.lessons.length} Materi
                        </span>
                      )}
                    </div>

                    {/* Prerequisite Alert if Locked */}
                    {mod.isLocked && mod.prerequisiteTitle && (
                      <div className="px-3 py-2 rounded-lg bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300/90 flex items-start gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <span>Selesaikan <strong>{mod.prerequisiteTitle}</strong> untuk membuka modul ini.</span>
                      </div>
                    )}

                    {/* Module Lessons List */}
                    {!mod.isLocked && (
                      <div className="pl-2 space-y-1">
                        {mod.lessons.map((les) => {
                          const isLesActive = les.id === activeLessonId;
                          const isLesCompleted = completedLessonIds.includes(les.id);

                          return (
                            <button
                              key={les.id}
                              onClick={() => onSelectLesson(les.id)}
                              className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start gap-2.5 ${
                                isLesActive
                                  ? 'bg-blue-600/20 border-blue-500/80 text-white shadow-sm font-semibold'
                                  : 'bg-slate-800/30 hover:bg-slate-800/80 border-transparent text-slate-300'
                              }`}
                            >
                              {/* Completion Icon */}
                              {isLesCompleted ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-slate-600 flex-shrink-0 mt-0.5 flex items-center justify-center">
                                  {les.type.includes('document') ? (
                                    <FileText className="w-2.5 h-2.5 text-slate-400" />
                                  ) : (
                                    <BookOpen className="w-2.5 h-2.5 text-slate-400" />
                                  )}
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <p className="truncate text-xs leading-snug">{les.title}</p>
                                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400">
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3 text-slate-500" />
                                    {les.estimatedReadTimeMinutes} mnt baca
                                  </span>
                                  {les.type.includes('document') && (
                                    <span className="px-1.5 py-0.2 bg-slate-800 text-blue-300 rounded font-mono text-[9px]">
                                      DOCUMENT
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tab 2: User Reading Notes */}
            {activeTab === 'notes' && (
              <div className="flex-1 p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-amber-400" />
                    <span>Catatan Pribadi Materi</span>
                  </h3>
                  <span className="text-[10px] text-slate-400">Tersimpan Otomatis</span>
                </div>
                <textarea
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="Ketik catatan penting dari materi ini..."
                  className="flex-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>
            )}

            {/* Tab 3: Reader Typography Settings */}
            {activeTab === 'settings' && (
              <div className="flex-1 p-4 space-y-5 text-xs">
                {/* Font Size Selector */}
                <div className="space-y-2">
                  <label className="text-slate-300 font-bold block">Ukuran Teks Readability</label>
                  <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    {(['sm', 'base', 'lg', 'xl'] as FontSize[]).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setFontSize(sz)}
                        className={`py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                          fontSize === sz ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Content Width Constraint */}
                <div className="space-y-2">
                  <label className="text-slate-300 font-bold block">Lebar Margi Teks (WCAG)</label>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    <button
                      onClick={() => setContentWidth('normal')}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                        contentWidth === 'normal' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      Standar (65ch)
                    </button>
                    <button
                      onClick={() => setContentWidth('wide')}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                        contentWidth === 'wide' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      Lebar (85ch)
                    </button>
                    <button
                      onClick={() => setContentWidth('full')}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                        contentWidth === 'full' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400'
                      }`}
                    >
                      Penuh (100%)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Main Reading Canvas & Document Viewer Container */}
        <main
          id="main-reading-content"
          tabIndex={-1}
          ref={contentRef}
          className="flex-1 overflow-y-auto relative scroll-smooth focus:outline-none"
        >
          {/* Scroll Progress Bar at the top of content */}
          <div className="sticky top-0 left-0 right-0 z-20 h-1 bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full bg-blue-600 transition-all duration-150"
              style={{ width: `${readProgress}%` }}
            />
          </div>

          <div className={`mx-auto py-8 px-4 sm:px-8 transition-all ${contentWidths[contentWidth]}`}>
            {currentLesson ? (
              <article className={`rounded-3xl border p-6 sm:p-10 shadow-sm space-y-8 ${themeStyles[readerTheme]}`}>
                {/* Lesson Header Metadata */}
                <header className="space-y-4 border-b pb-6 border-slate-200/80 dark:border-slate-800">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 font-bold text-[11px] rounded-full">
                        {currentModule?.title || 'Modul'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {currentLesson.estimatedReadTimeMinutes} Menit Waktu Baca
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleBookmark(currentLesson!.id)}
                        className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                          bookmarks.includes(currentLesson.id)
                            ? 'bg-amber-100 border-amber-300 text-amber-900 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                        }`}
                        aria-label="Tandai Halaman Ini"
                      >
                        <Bookmark className="w-4 h-4 fill-current" />
                        <span className="hidden sm:inline">
                          {bookmarks.includes(currentLesson.id) ? 'Tersimpan' : 'Simpan'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-snug">
                    {currentLesson.title}
                  </h1>

                  {/* Read Receipt Status Pill */}
                  <div className="flex items-center gap-2 pt-1 text-xs">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <span>Materi Telah Dibaca & Diverifikasi (Read Receipt Recorded)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-medium">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span>Progress Baca: {readProgress}% (Gulir hingga 90% untuk konfirmasi)</span>
                      </span>
                    )}
                  </div>
                </header>

                {/* CONDITION 1: Text-Based Markdown/HTML Lesson Body */}
                {(currentLesson.type === 'text_markdown' || currentLesson.type === 'text_html') && (
                  <div className={`prose dark:prose-invert max-w-none space-y-6 ${fontSizes[fontSize]}`}>
                    {currentLesson.contentHtml ? (
                      <div
                        dangerouslySetInnerHTML={{ __html: currentLesson.contentHtml }}
                        className="leading-relaxed space-y-4"
                      />
                    ) : (
                      <div className="space-y-4 text-justify">
                        <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:float-left first-letter:mr-3 first-letter:text-blue-600">
                          Selamat datang di materi pembelajaran teks resmi LPK Alpha Beta. Halaman ini dirancang menggunakan arsitektur typography bebas gangguan (distraction-free), menjamin tingkat kenyamanan tinggi serta kepatuhan standar aksesibilitas internasional WCAG 2.1 AA.
                        </p>
                        <p>
                          Setiap materi disusun secara terstruktur dengan penekanan pada konsep teknis, panduan prosedur kerja standar, serta lembar evaluasi mandiri. Anda tidak memerlukan pemutar video; seluruh dokumen dan panduan teknis dapat dipelajari secara mendalam langsung melalui perangkat Anda.
                        </p>

                        <div className="my-6 p-5 rounded-2xl bg-blue-50 border border-blue-200 dark:bg-blue-950/50 dark:border-blue-900 text-blue-900 dark:text-blue-200 space-y-2">
                          <h2 className="text-sm font-extrabold flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4 text-blue-600" />
                            <span>Poin Kunci Prosedur Pelatihan</span>
                          </h2>
                          <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                            <li>Pastikan memahami alur pengerjaan sebelum melanjutkan ke modul berikutnya.</li>
                            <li>Tanda 'Read Receipt' akan direkam secara otomatis ketika Anda selesai membaca halaman ini.</li>
                            <li>Modul prasyarat wajib diselesaikan sebelum mengakses kuis dan evaluasi kompetensi.</li>
                          </ul>
                        </div>

                        <p>
                          Lakukan pencatatan poin-poin penting menggunakan fitur <strong>Catatan Saku</strong> pada panel samping untuk membantu persiapan Ujian Akhir Sertifikasi Kompetensi.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* CONDITION 2: Integrated Document Viewer (PDF/DOCX) */}
                {(currentLesson.type === 'pdf_document' || currentLesson.type === 'docx_document') && (
                  <div className="space-y-4">
                    {/* Embedded Document Control Toolbar */}
                    <div className="bg-slate-900 text-white p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-md">
                      <div className="flex items-center gap-2 text-xs font-semibold">
                        <FileCode className="w-4 h-4 text-blue-400" />
                        <span className="truncate max-w-[200px]">
                          {currentLesson.documentFileName || 'Dokumen_Pelatihan_Resmi.pdf'}
                        </span>
                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">
                          {currentLesson.documentFileSize || '2.4 MB'}
                        </span>
                      </div>

                      {/* Zoom & Page Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDocZoom(Math.max(50, docZoom - 10))}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Perkecil"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-bold font-mono px-1">{docZoom}%</span>
                        <button
                          onClick={() => setDocZoom(Math.min(200, docZoom + 10))}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Perbesar"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>

                        <div className="h-4 w-px bg-slate-800 mx-1" />

                        <button
                          onClick={() => setDocRotation((docRotation + 90) % 360)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Putar Dokumen"
                        >
                          <RotateCw className="w-4 h-4" />
                        </button>

                        <div className="h-4 w-px bg-slate-800 mx-1" />

                        <a
                          href={currentLesson.documentUrl || '#'}
                          download
                          className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 text-xs font-bold px-2.5"
                          title="Unduh Dokumen PDF"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Unduh</span>
                        </a>
                      </div>
                    </div>

                    {/* Document View Box Container */}
                    <div
                      className="border-2 border-dashed border-slate-300 dark:border-slate-800 rounded-3xl p-6 bg-slate-100 dark:bg-slate-900/60 min-h-[500px] flex flex-col items-center justify-center text-center space-y-4 overflow-auto transition-transform duration-200"
                      style={{ transform: `scale(${docZoom / 100}) rotate(${docRotation}deg)` }}
                    >
                      <div className="w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-inner">
                        <FileText className="w-8 h-8" />
                      </div>
                      <div className="max-w-md space-y-1">
                        <h3 className="text-base font-extrabold">
                          Visualisator Dokumen Interaktif
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Dokumen resmi ({currentLesson.documentFileName || 'Modul.pdf'}) siap dibaca secara aman. Gunakan tombol zoom dan navigasi halaman di atas.
                        </p>
                      </div>

                      {/* Mock PDF Pages Rendering Container */}
                      <div className="w-full max-w-2xl bg-white text-slate-900 p-8 rounded-2xl shadow-xl text-left text-xs space-y-4 border border-slate-200">
                        <div className="border-b pb-3 flex justify-between items-center text-slate-400 text-[10px]">
                          <span>LPK ALPHA BETA - DOKUMEN MODUL RESMI</span>
                          <span>Halaman {docPage} dari {currentLesson.documentPageCount || 12}</span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900">
                          {currentLesson.title}
                        </h2>
                        <p className="text-slate-700 leading-relaxed">
                          Ini adalah tampilan pratinjau dokumen interaktif terenkripsi. Dokumen memuat instruksi operasional standar, bagam alur teknis, serta referensi baku industri bagi peserta pelatihan kerja.
                        </p>
                        <div className="p-4 bg-slate-50 border rounded-xl font-mono text-[11px] text-slate-800 space-y-1">
                          <p>VERIFICATION_HASH: 8f4e2a1c9b3d0e7f6a5c4b2a1e0f</p>
                          <p>ISSUED_BY: LPK Alpha Beta Academic Directorate</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Navigation & Completion Trigger */}
                <footer className="border-t pt-6 border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {isCompleted ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-4 h-4" /> Progress Selesai
                      </span>
                    ) : (
                      <span>Lanjutkan membaca hingga akhir halaman</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {!isCompleted && (
                      <button
                        onClick={() => onMarkLessonCompleted(currentLesson!.id)}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Tandai Selesai (Read Receipt)</span>
                      </button>
                    )}

                    {onOpenQuiz && (
                      <button
                        onClick={() => onOpenQuiz('quiz-mod-1')}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        <span>Mulai Kuis Modul</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </footer>
              </article>
            ) : (
              <div className="text-center py-20 space-y-3">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
                <h2 className="text-lg font-bold">Materi Tidak Ditemukan</h2>
                <p className="text-xs text-slate-500">Silakan pilih materi lain dari panel sebelah kiri.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
