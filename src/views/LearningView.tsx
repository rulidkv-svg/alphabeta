import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Lock,
  FileText,
  Video,
  Cpu,
  HelpCircle,
  Award,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Sparkles,
  Bot,
  ArrowLeft,
  Calendar,
  MessageSquare,
  Download,
  ExternalLink,
  Star,
  FileCheck,
  Send,
  Play,
  RotateCcw,
  Check,
  Zap,
  Globe,
  Info
} from 'lucide-react';
import { apiService } from '../services/api';
import { Course, Module, Lesson, Quiz, Exam, Certificate } from '../types';
import { useAuth } from '../context/AuthContext';
import { getCurriculumQuiz, getCurriculumExam } from '../data/curriculumData';
import { PCSimulator } from '../components/simulators/PCSimulator';
import { NetworkLab } from '../components/simulators/NetworkLab';
import { HardwareLab } from '../components/simulators/HardwareLab';
import { SoftwareLab } from '../components/simulators/SoftwareLab';
import { QuizPlayer } from '../components/quiz/QuizPlayer';
import { ExamPlayer } from '../components/quiz/ExamPlayer';
import { CertificateView } from '../components/certificate/CertificateView';
import { LiveSessionManager } from '../components/lms/LiveSessionManager';
import { GraduationStatusCard } from '../components/lms/GraduationStatusCard';
import { CourseEvaluationModal } from '../components/lms/CourseEvaluationModal';

interface LearningViewProps {
  courseId: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAITutor: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const LearningView: React.FC<LearningViewProps> = ({
  courseId,
  onNavigate,
  onOpenAITutor,
  onShowToast
}) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [earnedCert, setEarnedCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  // Classroom Navigation Subtabs
  const [mainViewTab, setMainViewTab] = useState<'CLASSROOM' | 'LIVE_MEETING' | 'GRADUATION'>('CLASSROOM');
  const [contentTab, setContentTab] = useState<'notes' | 'ai_tutor' | 'forum' | 'resources'>('notes');

  // Sidebar expanded modules state
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Mini AI Assistant state
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: 'ai' | 'user'; text: string }>>([
    {
      role: 'ai',
      text: 'Halo! Saya AI Tutor Alpha Beta Learning Center. Tanyakan apa saja seputar materi ini atau minta ringkasan konsep!'
    }
  ]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // Evaluation Modal
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);

  // Forum state
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [isSubmittingPost, setIsSubmittingPost] = useState(false);

  useEffect(() => {
    const loadLearningData = async () => {
      try {
        const res = await apiService.getCourseDetail(courseId);
        setCourse(res.course);
        setModules(res.modules);

        if (res.modules.length > 0) {
          // Open first module by default
          setExpandedModules({ [res.modules[0].ModuleID]: true });
          if (res.modules[0].Lessons && res.modules[0].Lessons.length > 0) {
            const firstMod = res.modules[0];
            const firstLes = firstMod.Lessons[0];
            setActiveModule(firstMod);
            setActiveLesson(firstLes);
            if (firstLes.Type === 'quiz' && firstLes.QuizID) {
              const qz = getCurriculumQuiz(firstLes.QuizID) || INITIAL_QUIZZES_DATA.find(q => q.QuizID === firstLes.QuizID);
              if (qz) setActiveQuiz(qz);
            } else if (firstLes.Type === 'exam' && firstLes.ExamID) {
              const ex = getCurriculumExam(firstLes.ExamID) || INITIAL_EXAMS_DATA.find(e => e.ExamID === firstLes.ExamID);
              if (ex) setActiveExam(ex);
            }
          }
        }

        if (user) {
          const dash = await apiService.getStudentDashboard(user.UserID);
          const doneIds = (dash.progress || [])
            .filter((p: any) => p.CourseID === courseId && p.Status === 'Completed')
            .map((p: any) => p.ActivityID);
          setCompletedActivities(doneIds);
        }

        // Load forum posts
        const posts = await apiService.getForumPosts(courseId);
        setForumPosts(posts || []);
      } catch (e) {
        console.error('Error loading learning player:', e);
      } finally {
        setLoading(false);
      }
    };
    loadLearningData();
  }, [courseId, user]);

  const toggleModuleExpand = (modId: string) => {
    setExpandedModules(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const handleSelectLesson = (mod: Module, les: Lesson) => {
    setActiveModule(mod);
    setActiveLesson(les);
    setActiveQuiz(null);
    setActiveExam(null);
    setEarnedCert(null);
    setMainViewTab('CLASSROOM');

    // If quiz lesson
    if (les.Type === 'quiz' && les.QuizID) {
      const qz = getCurriculumQuiz(les.QuizID) || INITIAL_QUIZZES_DATA.find(q => q.QuizID === les.QuizID);
      if (qz) setActiveQuiz(qz);
    }

    // If exam lesson
    if (les.Type === 'exam' && les.ExamID) {
      const ex = getCurriculumExam(les.ExamID) || INITIAL_EXAMS_DATA.find(e => e.ExamID === les.ExamID);
      if (ex) setActiveExam(ex);
    }
  };

  const handleMarkComplete = async (score: number = 100) => {
    if (!user || !activeLesson || !activeModule) return;

    try {
      await apiService.saveProgress({
        userId: user.UserID,
        courseId,
        moduleId: activeModule.ModuleID,
        activityId: activeLesson.ActivityID,
        score,
        xpEarned: activeLesson.XP || 50
      });

      if (!completedActivities.includes(activeLesson.ActivityID)) {
        setCompletedActivities(prev => [...prev, activeLesson.ActivityID]);
      }

      onShowToast(`✅ Aktivitas "${activeLesson.Title}" Selesai! (+${activeLesson.XP || 50} XP)`, 'success');

      // Auto Advance to next lesson
      handleNextLesson();
    } catch (e) {
      console.error('Error saving progress:', e);
    }
  };

  // Find all flattened lessons for next/prev navigation
  const flattenedLessons: Array<{ module: Module; lesson: Lesson }> = [];
  modules.forEach(mod => {
    mod.Lessons?.forEach(les => {
      flattenedLessons.push({ module: mod, lesson: les });
    });
  });

  const currentIndex = flattenedLessons.findIndex(
    item => item.lesson.ActivityID === activeLesson?.ActivityID
  );

  const handlePrevLesson = () => {
    if (currentIndex > 0) {
      const prev = flattenedLessons[currentIndex - 1];
      setExpandedModules(p => ({ ...p, [prev.module.ModuleID]: true }));
      handleSelectLesson(prev.module, prev.lesson);
    }
  };

  const handleNextLesson = () => {
    if (currentIndex < flattenedLessons.length - 1) {
      const next = flattenedLessons[currentIndex + 1];
      setExpandedModules(p => ({ ...p, [next.module.ModuleID]: true }));
      handleSelectLesson(next.module, next.lesson);
    } else {
      setMainViewTab('GRADUATION');
    }
  };

  // Mini AI Assistant question sender
  const handleSendAiPrompt = (promptText?: string) => {
    const query = promptText || aiInput;
    if (!query.trim() || aiLoading) return;

    const userMsg = query.trim();
    setAiChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiInput('');
    setAiLoading(true);

    setTimeout(() => {
      let reply = `Bagus sekali! Terkait topik "${activeLesson?.Title || 'materi ini'}": pastikan Anda memahami implementasi praktisnya dan mencoba simulator terkait agar pemahaman konsep semakin mendalam.`;
      if (userMsg.toLowerCase().includes('ringkas') || userMsg.toLowerCase().includes('rangkum')) {
        reply = `📌 Rangkuman "${activeLesson?.Title}": Materi ini membahas poin-poin utama standar industri yang harus dikuasai, langkah-langkah praktis, serta checklist evaluasi untuk mempersiapkan ujian kelulusan.`;
      } else if (userMsg.toLowerCase().includes('contoh') || userMsg.toLowerCase().includes('soal')) {
        reply = `💡 Contoh Soal Terkait: "Apa fungsi utama dari komponen/metode pada modul ${activeLesson?.Title}?" - Jawabannya berkaitan erat dengan efisiensi kerja dan standarisasi proses.`;
      }

      setAiChatMessages(prev => [...prev, { role: 'ai', text: reply }]);
      setAiLoading(false);
    }, 600);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newPostTitle || !newPostContent) return;
    setIsSubmittingPost(true);
    try {
      const res = await apiService.createForumPost({
        courseId,
        userId: user.UserID,
        title: newPostTitle,
        content: newPostContent
      });
      if (res.success) {
        onShowToast('🎉 Diskusi baru berhasil dikirimkan!', 'success');
        setNewPostTitle('');
        setNewPostContent('');
        const updated = await apiService.getForumPosts(courseId);
        setForumPosts(updated || []);
      }
    } catch (e) {
      onShowToast('Gagal mengirimkan postingan.', 'error');
    } finally {
      setIsSubmittingPost(false);
    }
  };

  if (loading || !course) {
    return (
      <div className="py-20 text-center text-slate-500 text-xs">
        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <span>Memuat ruang belajar interaktif...</span>
      </div>
    );
  }

  // Calculate overall course progress percentage
  const totalCourseLessons = flattenedLessons.length || 1;
  const completedCount = completedActivities.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalCourseLessons) * 100));

  return (
    <div className="space-y-6 py-4">
      {/* Top Header Bar */}
      <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-xl space-y-4 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('course_detail', courseId)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Kembali ke Detail Kursus"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
                {course.CategoryName || 'Komputer & Vokasi'}
              </span>
              <h1 className="text-base sm:text-lg font-black text-white line-clamp-1">
                {course.Title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setShowEvaluationModal(true)}
              className="px-3 py-2 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 transition-all"
            >
              <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
              <span>Isi Evaluasi</span>
            </button>

            <button
              onClick={onOpenAITutor}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-md hover:scale-[1.02] transition-all"
            >
              <Bot className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>Tanya AI Tutor</span>
            </button>
          </div>
        </div>

        {/* Classroom Top View Switcher Tabs */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setMainViewTab('CLASSROOM')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              mainViewTab === 'CLASSROOM'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Materi & Modul Kelas</span>
          </button>

          <button
            onClick={() => setMainViewTab('LIVE_MEETING')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              mainViewTab === 'LIVE_MEETING'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tatap Muka Daring</span>
          </button>

          <button
            onClick={() => setMainViewTab('GRADUATION')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              mainViewTab === 'GRADUATION'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-300" />
            <span>Status Kelulusan & Sertifikat</span>
          </button>
        </div>
      </div>

      {/* Main View Display */}
      {mainViewTab === 'LIVE_MEETING' ? (
        <LiveSessionManager
          courseId={courseId}
          userRole={user?.Role || 'PESERTA'}
          userId={user?.UserID}
          onShowToast={onShowToast}
        />
      ) : mainViewTab === 'GRADUATION' ? (
        <GraduationStatusCard
          userId={user?.UserID || 'USR-001'}
          courseId={courseId}
          courseTitle={course.Title}
          onNavigateToEvaluation={() => setShowEvaluationModal(true)}
          onShowToast={onShowToast}
          onViewCertificate={cert => setEarnedCert(cert)}
        />
      ) : (
        /* 2-Column Coursera-like Classroom Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Sidebar: Progress & Modules Hierarchy */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-5 lg:sticky lg:top-24 max-h-[85vh] overflow-y-auto">
            {/* Overall Progress Widget */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-blue-600" />
                  Progress Belajar
                </span>
                <span className="text-blue-600">{progressPercent}%</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                <span>{completedCount} dari {totalCourseLessons} selesai</span>
                <span>{modules.length} Modul</span>
              </div>
            </div>

            {/* Modules Accordion */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Daftar Modul & Materi
                </h3>
              </div>

              <div className="space-y-2.5">
                {modules.map((mod, modIdx) => {
                  const isExpanded = !!expandedModules[mod.ModuleID];
                  const modLessons = mod.Lessons || [];
                  const modCompletedCount = modLessons.filter(l => completedActivities.includes(l.ActivityID)).length;

                  return (
                    <div
                      key={mod.ModuleID}
                      className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs"
                    >
                      {/* Module Header Toggle */}
                      <button
                        onClick={() => toggleModuleExpand(mod.ModuleID)}
                        className="w-full p-3.5 text-left flex items-center justify-between gap-2 bg-slate-50/70 hover:bg-slate-100/70 transition-colors"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-6 h-6 rounded-md bg-blue-600 text-white font-black text-[11px] flex items-center justify-center shrink-0">
                            {modIdx + 1}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                              {mod.Title}
                            </h4>
                            <span className="text-[10px] text-slate-500">
                              {modCompletedCount}/{modLessons.length} Selesai
                            </span>
                          </div>
                        </div>

                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            isExpanded ? 'rotate-180 text-blue-600' : ''
                          }`}
                        />
                      </button>

                      {/* Lessons List */}
                      {isExpanded && (
                        <div className="divide-y divide-slate-100 border-t border-slate-100">
                          {modLessons.map(les => {
                            const isSelected = activeLesson?.ActivityID === les.ActivityID;
                            const isDone = completedActivities.includes(les.ActivityID);
                            const type = les.Type?.toLowerCase() || '';

                            return (
                              <button
                                key={les.ActivityID}
                                onClick={() => handleSelectLesson(mod, les)}
                                className={`w-full p-3 text-left flex items-center justify-between gap-2 transition-colors text-xs ${
                                  isSelected
                                    ? 'bg-blue-50 text-blue-700 font-bold border-l-3 border-blue-600'
                                    : 'text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 line-clamp-1">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : isSelected ? (
                                    <Play className="w-3.5 h-3.5 text-blue-600 fill-blue-600 shrink-0" />
                                  ) : (
                                    <span className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0" />
                                  )}
                                  <span className="truncate">{les.Title}</span>
                                </div>

                                <div className="flex items-center gap-1.5 shrink-0">
                                  {type.includes('quiz') || type.includes('kuis') ? (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold">Kuis</span>
                                  ) : type.includes('simulator') || type.includes('lab') ? (
                                    <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold">Lab</span>
                                  ) : (
                                    <span className="text-[10px] text-slate-400">{les.Duration || '15m'}</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Main Viewer Area */}
          <div className="lg:col-span-8 space-y-6">
            {earnedCert ? (
              <CertificateView certificate={earnedCert} />
            ) : activeQuiz ? (
              <QuizPlayer
                quiz={activeQuiz}
                userId={user?.UserID || 'USR-001'}
                courseId={courseId}
                onComplete={(score, passed) => {
                  if (passed) handleMarkComplete(score);
                }}
              />
            ) : activeExam ? (
              <ExamPlayer
                exam={activeExam}
                userId={user?.UserID || 'USR-001'}
                courseId={courseId}
                onExamPassed={cert => {
                  setEarnedCert(cert);
                  handleMarkComplete(100);
                }}
              />
            ) : activeLesson?.SimulatorType === 'pc_assembly' ? (
              <PCSimulator
                onComplete={score => {
                  handleMarkComplete(score);
                }}
              />
            ) : activeLesson?.SimulatorType === 'network_lab' ? (
              <NetworkLab />
            ) : activeLesson?.SimulatorType === 'hardware_lab' ? (
              <HardwareLab />
            ) : activeLesson?.SimulatorType === 'software_lab' ? (
              <SoftwareLab />
            ) : (
              /* Main Lesson Reader / Player Container */
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
                {/* Lesson Header Navigation */}
                <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                  <div>
                    <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200/60 uppercase">
                      {activeModule?.Title}
                    </span>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                      {activeLesson?.Title}
                    </h2>
                  </div>

                  {/* Prev / Next Nav Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevLesson}
                      disabled={currentIndex <= 0}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Sebelumnya</span>
                    </button>

                    <button
                      onClick={handleNextLesson}
                      disabled={currentIndex >= flattenedLessons.length - 1}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold flex items-center gap-1 transition-all"
                    >
                      <span>Selanjutnya</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* PDF / Document Attachment if available */}
                {(activeLesson?.PDFURL || activeLesson?.DocumentURL || activeLesson?.PresentationURL) && (
                  <div className="m-5 p-4 bg-blue-50/70 rounded-2xl border border-blue-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Lampiran Dokumen Materi PDF</span>
                        <span className="text-[10px] text-slate-500">Tersedia untuk dibaca atau diunduh sebagai referensi belajar.</span>
                      </div>
                    </div>
                    <a
                      href={activeLesson.PDFURL || activeLesson.DocumentURL || activeLesson.PresentationURL}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shrink-0"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh</span>
                    </a>
                  </div>
                )}

                {/* Structured Lesson Content */}
                <div className="p-6 sm:p-8 space-y-6">
                  <div className="prose max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap bg-slate-50/60 p-6 rounded-2xl border border-slate-100 font-sans">
                    {activeLesson?.Content || 'Materi pembelajaran siap dipelajari secara mendalam.'}
                  </div>

                  {/* Primary Action Button: Mark Complete & Continue */}
                  <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Dapatkan <b>+{activeLesson?.XP || 50} XP</b> setelah menyelesaikan materi ini</span>
                    </div>

                    <button
                      onClick={() => handleMarkComplete(100)}
                      className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tandai Selesai & Lanjut</span>
                    </button>
                  </div>
                </div>

                {/* Sub-tabs below content: Notes, AI Tutor, Forum, Resources */}
                <div className="border-t border-slate-200 bg-slate-50/80 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
                    {[
                      { id: 'notes', label: 'Ringkasan & Catatan', icon: BookOpen },
                      { id: 'ai_tutor', label: '🤖 AI Tutor Asisten', icon: Bot },
                      { id: 'forum', label: `Forum Diskusi (${forumPosts.length})`, icon: MessageSquare },
                      { id: 'resources', label: 'Unduh Referensi', icon: Download }
                    ].map(st => {
                      const Icon = st.icon;
                      const isActive = contentTab === st.id;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setContentTab(st.id as any)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                            isActive
                              ? 'bg-white text-blue-600 shadow-xs border border-slate-200'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{st.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Sub-tab 1: Notes */}
                  {contentTab === 'notes' && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
                      <h4 className="font-bold text-slate-900">Poin Kunci Materi:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Pahami fungsi dasar komponen dan alur kerja sesuai standar SKKNI.</li>
                        <li>Gunakan simulator interaktif bila tersedia untuk menguji skenario troubleshooting.</li>
                        <li>Pastikan menyelesaikan kuis evaluasi untuk membuka materi selanjutnya.</li>
                      </ul>
                    </div>
                  )}

                  {/* Sub-tab 2: AI Tutor Embedded Mini Assistant */}
                  {contentTab === 'ai_tutor' && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-xs text-slate-900">AI Tutor Pembelajaran</span>
                        </div>
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                          Online 24/7
                        </span>
                      </div>

                      {/* Prompt Quick Chips */}
                      <div className="flex flex-wrap gap-1.5 text-[11px]">
                        <button
                          onClick={() => handleSendAiPrompt('Rangkum poin utama materi ini')}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium"
                        >
                          ✨ Rangkum materi ini
                        </button>
                        <button
                          onClick={() => handleSendAiPrompt('Berikan contoh soal evaluasi terkait')}
                          className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-medium"
                        >
                          📝 Buat contoh soal
                        </button>
                        <button
                          onClick={() => handleSendAiPrompt('Jelaskan istilah teknis yang paling penting')}
                          className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-medium"
                        >
                          💡 Istilah penting
                        </button>
                      </div>

                      {/* Chat messages box */}
                      <div className="max-h-56 overflow-y-auto space-y-2.5 p-3 bg-slate-50 rounded-xl text-xs">
                        {aiChatMessages.map((msg, i) => (
                          <div
                            key={i}
                            className={`p-2.5 rounded-xl max-w-[90%] ${
                              msg.role === 'user'
                                ? 'bg-blue-600 text-white ml-auto'
                                : 'bg-white text-slate-800 border border-slate-200'
                            }`}
                          >
                            {msg.text}
                          </div>
                        ))}
                        {aiLoading && (
                          <div className="p-2.5 bg-white rounded-xl text-slate-400 text-xs border border-slate-200">
                            AI sedang mengetik...
                          </div>
                        )}
                      </div>

                      {/* Chat input form */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={aiInput}
                          onChange={e => setAiInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && handleSendAiPrompt()}
                          placeholder="Tanyakan hal yang belum dipahami..."
                          className="flex-1 px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-blue-500"
                        />
                        <button
                          onClick={() => handleSendAiPrompt()}
                          disabled={aiLoading}
                          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                        >
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 3: Forum Diskusi */}
                  {contentTab === 'forum' && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-4 text-xs">
                      <form onSubmit={handleCreatePost} className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                        <span className="font-bold text-slate-900 block">Tulis Diskusi Baru</span>
                        <input
                          type="text"
                          required
                          value={newPostTitle}
                          onChange={e => setNewPostTitle(e.target.value)}
                          placeholder="Judul pertanyaan..."
                          className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs"
                        />
                        <textarea
                          rows={2}
                          required
                          value={newPostContent}
                          onChange={e => setNewPostContent(e.target.value)}
                          placeholder="Jelaskan pertanyaan Anda..."
                          className="w-full p-2 bg-white rounded-lg border border-slate-200 text-xs"
                        />
                        <div className="flex justify-end">
                          <button
                            type="submit"
                            disabled={isSubmittingPost}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
                          >
                            Kirim
                          </button>
                        </div>
                      </form>

                      <div className="space-y-2">
                        {forumPosts.map(p => (
                          <div key={p.PostID} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                            <div className="flex items-center justify-between font-bold text-slate-900">
                              <span>{p.Title}</span>
                              <span className="text-[10px] text-slate-400 font-normal">{p.CreatedAt}</span>
                            </div>
                            <p className="text-slate-600">{p.Content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-tab 4: Resources */}
                  {contentTab === 'resources' && (
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                      <h4 className="font-bold text-slate-900">Dokumen & Referensi Pendukung:</h4>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-medium text-slate-700">Modul Panduan Lengkap SKKNI (PDF)</span>
                          <span className="text-blue-600 font-bold cursor-pointer hover:underline">Unduh</span>
                        </div>
                        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                          <span className="font-medium text-slate-700">Lembar Kerja & Latihan Praktikum (DOCX)</span>
                          <span className="text-blue-600 font-bold cursor-pointer hover:underline">Unduh</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Course Evaluation Modal */}
      {showEvaluationModal && (
        <CourseEvaluationModal
          courseId={courseId}
          userId={user?.UserID || 'USR-001'}
          courseTitle={course.Title}
          onClose={() => setShowEvaluationModal(false)}
          onSuccess={() => {
            onShowToast('🎉 Evaluasi kursus berhasil diterima. Terima kasih!', 'success');
          }}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};

const INITIAL_QUIZZES_DATA = [
  {
    QuizID: 'QUIZ-TK-01',
    CourseID: 'CRS-TK01',
    Title: 'Kuis Modul 1: Arsitektur & Hardware Komputer',
    Description: 'Uji pemahaman dasar.',
    PassingGrade: 80,
    Questions: [
      {
        QuestionID: 'Q-TK-101',
        Question: 'Komponen apakah yang berfungsi sebagai otak utama pengolah data pada sistem komputer?',
        Type: 'multiple_choice',
        Options: ['Motherboard', 'CPU (Central Processing Unit)', 'RAM', 'Power Supply'],
        CorrectAnswer: 'CPU (Central Processing Unit)',
        Explanation: 'CPU (Processor) bertindak sebagai otak utama pengolah logika.',
        Points: 50
      },
      {
        QuestionID: 'Q-TK-102',
        Question: 'RAM bertindak sebagai tempat penyimpanan data permanen.',
        Type: 'true_false',
        Options: ['Benar', 'Salah'],
        CorrectAnswer: 'Salah',
        Explanation: 'RAM adalah memori volatile sementara.',
        Points: 50
      }
    ]
  }
];

const INITIAL_EXAMS_DATA = [
  {
    ExamID: 'EXAM-TK-FINAL',
    CourseID: 'CRS-TK01',
    Title: 'Ujian Akhir Kelulusan: Teknisi Komputer & Perakitan PC',
    Description: 'Passing grade 80% untuk mendapatkan Sertifikat Resmi Alpha Beta.',
    PassingGrade: 80,
    Questions: [
      {
        QuestionID: 'EX-TK-01',
        Question: 'Komponen yang bertugas memproses visual dan grafis ke monitor adalah:',
        Type: 'multiple_choice',
        Options: ['RAM', 'GPU / Graphics Card', 'Sound Card', 'LAN Card'],
        CorrectAnswer: 'GPU / Graphics Card',
        Explanation: 'GPU memproses grafis 2D/3D.',
        Points: 50
      },
      {
        QuestionID: 'EX-TK-02',
        Question: 'Langkah pertama sebelum merakit komponen fisik komputer adalah:',
        Type: 'multiple_choice',
        Options: ['Memasang VGA', 'Membumikan listrik statis tubuh (Grounding)', 'Mengoleskan minyak', 'Menyambungkan kabel PLN'],
        CorrectAnswer: 'Membumikan listrik statis tubuh (Grounding)',
        Explanation: 'Mencegah kerusakan statis komponen.',
        Points: 50
      }
    ]
  }
];
