import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Clock,
  Star,
  Users,
  Award,
  CheckCircle2,
  Play,
  Video,
  FileText,
  Cpu,
  HelpCircle,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  ChevronRight,
  Target,
  Sparkles,
  ChevronDown,
  Send,
  Check,
  Calendar,
  Building,
  GraduationCap,
  Tag,
  DollarSign,
  Briefcase,
  Layers,
  CheckCircle,
  Share2,
  Bot,
  Zap,
  Globe,
  Info,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';
import { Course, Module } from '../types';
import { useAuth } from '../context/AuthContext';
import { INITIAL_SETTINGS } from '../data/initialData';
import { calculateCoursePrice, getCourseTier, TIER_CONFIGS, formatRupiah } from '../utils/pricing';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCourse, getLocalizedCategory } from '../i18n/courseTranslations';
import { fadeUpVariant, staggerContainer } from '../utils/animations';

interface CourseDetailViewProps {
  courseId: string;
  onNavigate: (view: string, param?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CourseDetailView: React.FC<CourseDetailViewProps> = ({
  courseId,
  onNavigate,
  onShowToast
}) => {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [activeTab, setActiveTab] = useState<'about' | 'curriculum' | 'instructor' | 'reviews'>('about');
  const [openModuleIds, setOpenModuleIds] = useState<Record<string, boolean>>({});
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Form registration state
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPackage, setRegPackage] = useState('REGULAR');
  const [regSchedule, setRegSchedule] = useState('Kelas Pagi (09:00 - 11:00 WIB)');
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await apiService.getCourseDetail(courseId);
        setCourse(res.course);
        setModules(res.modules);
        // Default open the first module
        if (res.modules && res.modules.length > 0) {
          setOpenModuleIds({ [res.modules[0].ModuleID]: true });
        }
      } catch (e) {
        console.error('Error loading course detail:', e);
      } finally {
        setLoading(false);
      }
    };
    loadDetail();
  }, [courseId]);

  const toggleModule = (modId: string) => {
    setOpenModuleIds(prev => ({
      ...prev,
      [modId]: !prev[modId]
    }));
  };

  const handleEnroll = async () => {
    if (!user) {
      onShowToast('Silakan login terlebih dahulu untuk memulai belajar', 'info');
      onNavigate('login');
      return;
    }

    setEnrolling(true);
    try {
      const res = await apiService.enrollCourse(user.UserID, courseId);
      if (res.success) {
        onShowToast(`🎉 Selamat! Anda telah terdaftar di kursus ini`, 'success');
        onNavigate('learning', courseId);
      }
    } catch (e) {
      onShowToast('Gagal memproses pendaftaran kursus. Silakan coba lagi.', 'error');
    } finally {
      setEnrolling(false);
    }
  };

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setRegSubmitting(true);
    setTimeout(() => {
      setRegSubmitting(false);
      setRegSuccess(true);
      onShowToast(`🎉 Formulir pendaftaran berhasil dikirim! Tim kami akan menghubungi via WhatsApp.`, 'success');
    }, 800);
  };

  if (loading || !course) {
    return (
      <div className="py-20 text-center text-slate-500 text-xs">
        <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <span>Memuat detail kursus...</span>
      </div>
    );
  }

  const localized = getLocalizedCourse(course, language);
  const tier = getCourseTier(course);
  const tierCfg = TIER_CONFIGS[tier];
  const priceInfo = calculateCoursePrice(course);
  const p = course.Pricing;

  const normalPrice = p?.normal_price || course.Price || 0;
  const promoPrice = p?.promo_price || Math.round(normalPrice * 0.8);
  const memberPrice = p?.member_price || Math.round(normalPrice * 0.75);
  const privatePrice = p?.private_price || Math.round(normalPrice * 2.2);

  // Total lessons count & duration estimate
  const totalLessons = modules.reduce((acc, m) => acc + (m.Lessons?.length || 0), 0);

  const courseFaqs = [
    {
      q: 'Apakah pemula tanpa latar belakang teknis bisa mengikuti program ini?',
      a: 'Sangat bisa! Seluruh materi dirancang bertahap mulai dari pemahaman konsep dasar, demonstrasi simulator interaktif, studi kasus praktis, hingga pendampingan oleh instruktur.'
    },
    {
      q: 'Bagaimana bentuk sertifikat resmi yang didapatkan?',
      a: `Seluruh peserta yang menyelesaikan seluruh modul dan lulus ujian evaluasi berhak memperoleh Sertifikat Pelatihan Resmi dari LPK Alpha Beta (NISN: ${INITIAL_SETTINGS.NISN} & VIN: ${INITIAL_SETTINGS.VIN}) dilengkapi QR Code verifikasi online.`
    },
    {
      q: 'Apakah ada diskon atau beasiswa pelatihan?',
      a: 'Ya, kami menyediakan diskon Member/Alumni, promo Early Bird, serta program beasiswa pelatihan vokasi berkala untuk siswa dan pencari kerja.'
    },
    {
      q: 'Berapa lama masa akses materi setelah mendaftar?',
      a: 'Akses ke materi e-learning, video modul, dan simulator interaktif berlaku seumur hidup (Lifetime Access).'
    }
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-8 py-4 sm:py-6"
    >
      {/* SECTION A: BREADCRUMB & HERO DETAIL KURSUS */}
      <div className="space-y-4">
        {/* Breadcrumb */}
        <motion.nav variants={fadeUpVariant} className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">
            Beranda
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button onClick={() => onNavigate('courses')} className="hover:text-blue-600 transition-colors">
            Katalog Kursus
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button
            onClick={() => onNavigate('courses', course.CategoryID)}
            className="hover:text-blue-600 transition-colors text-slate-600"
          >
            {getLocalizedCategory(course.CategoryName || 'Komputer & Teknologi', language)}
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-blue-600 font-bold truncate max-w-xs">{localized.Title}</span>
        </motion.nav>

        {/* Hero Header Banner */}
        <motion.div
          variants={fadeUpVariant}
          className="bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 space-y-6"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {getLocalizedCategory(course.CategoryName || 'Komputer & Teknologi', language)}
            </span>
            <span className={`${tierCfg.badgeBg} ${tierCfg.badgeColor} px-3 py-1 rounded-full font-black flex items-center gap-1.5`}>
              <span>{tierCfg.icon}</span>
              <span>{tierCfg.label}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              🎯 {course.Level || 'Semua Tingkat'}
            </span>
            {course.DurationJP && (
              <span className="px-3 py-1 rounded-full bg-slate-800 text-blue-200 border border-slate-700">
                ⏱️ {course.DurationJP} JP
              </span>
            )}
            <span className="ms-auto bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Sertifikat Resmi NISN/VIN
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            {localized.Title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl font-normal">
            {localized.Description}
          </p>

          {/* Meta bar: Instruktur, Rating, Update */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300 pt-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                {course.InstructorName ? course.InstructorName.charAt(0) : 'I'}
              </div>
              <span>Instruktur: <strong className="text-white">{course.InstructorName || 'Instruktur LPK Alpha Beta'}</strong></span>
            </div>

            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{course.Rating || 4.9}</span>
              <span className="text-slate-400 font-normal">({course.EnrolledCount || 120} Peserta)</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Globe className="w-3.5 h-3.5" />
              <span>Bahasa Indonesia</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>Update: 2025</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* SECTION B & C: 2-COLUMN MAIN CONTENT & STICKY SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tabbed Content Navigation (Coursera-like) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Content Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
            {[
              { id: 'about', label: 'Tentang Kursus', icon: Info },
              { id: 'curriculum', label: `Kurikulum & Modul (${modules.length})`, icon: BookOpen },
              { id: 'instructor', label: 'Instruktur', icon: UserCheck },
              { id: 'reviews', label: 'Ulasan Peserta', icon: MessageSquare }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-all ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: TENTANG KURSUS */}
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Special PAUD Interactive Portal Banner if course is PAUD */}
              {course.CourseID.startsWith('CRS-PAUD') && (
                <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 rounded-3xl p-6 text-white border border-emerald-800 shadow-lg space-y-4">
                  <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>PORTAL KHUSUS GURU PAUD TERSEDIA</span>
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-white">
                      Akses Kelas Mandiri, 4 Modul Interaktif, Kuis & Tugas Praktik
                    </h4>
                    <p className="text-xs text-emerald-100/90 mt-1 leading-relaxed">
                      Program ini memiliki Portal E-Learning khusus dengan materi terstruktur tanpa kunci, kuis 10 soal per modul, uploader tugas mandiri, dan sertifikat kelulusan resmi ber-QR Code.
                    </p>
                  </div>
                  <div>
                    <button
                      onClick={() => onNavigate('paud_training')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center gap-2 shadow-md shadow-emerald-600/30"
                    >
                      <BookOpen className="w-4 h-4 text-amber-300" />
                      <span>Buka Portal E-Learning Guru PAUD</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Apa yang akan dipelajari */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                    Yang Akan Anda Pelajari dalam Program Ini
                  </h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-700">
                  {(course.WhatYouWillLearn && course.WhatYouWillLearn.length > 0 ? course.WhatYouWillLearn : [
                    'Memahami konsep fundamental dan terminologi standar industri (SKKNI).',
                    'Mengoperasikan tools dan perangkat kerja secara langsung dan aplikatif.',
                    'Melakukan troubleshooting dan penyelesaian studi kasus di dunia nyata.',
                    'Mempersiapkan portofolio karya dan mengikuti ujian sertifikasi kompetensi resmi.'
                  ]).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sasaran Peserta & Prasyarat */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                    <Users className="w-4 h-4" />
                    <span>Target Peserta</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Siswa SMK, Mahasiswa, & Fresh Graduate</li>
                    <li>Pencari kerja yang ingin meningkatkan skill</li>
                    <li>Praktisi / Karyawan untuk sertifikasi karir</li>
                    <li>Umum yang berminat pada keahlian digital</li>
                  </ul>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4" />
                    <span>Persyaratan Mengikuti</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                    <li>Memiliki laptop/komputer atau smartphone</li>
                    <li>Koneksi internet untuk mengakses LMS & simulator</li>
                    <li>Komitmen menyelesaikan latihan dan kuis modul</li>
                    <li>Tidak diperlukan pengalaman teknis sebelumnya</li>
                  </ul>
                </div>
              </div>

              {/* Fasilitas & Benefit Pembelajaran */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Fasilitas & Keunggulan Program
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold">
                  <div className="p-3 rounded-2xl bg-blue-50 border border-blue-100 text-blue-800 flex items-center gap-2">
                    <Video className="w-4 h-4 text-blue-600" /> Video Modul HD
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" /> Modul & E-Book
                  </div>
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-600" /> Simulator Lab
                  </div>
                  <div className="p-3 rounded-2xl bg-purple-50 border border-purple-100 text-purple-800 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-purple-600" /> AI Tutor 24 Jam
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-800 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-600" /> Kuis & Evaluasi
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 flex items-center gap-2">
                    <Award className="w-4 h-4 text-rose-600" /> Sertifikat NISN/VIN
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Pertanyaan yang Sering Diajukan (FAQ)
                </h3>
                <div className="space-y-2">
                  {courseFaqs.map((faq, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 font-bold text-xs text-slate-800 flex items-center justify-between gap-2 transition-colors"
                        >
                          <span>{faq.q}</span>
                          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                          {isOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="p-3.5 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed"
                            >
                              {faq.a}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: KURIKULUM & MODUL (ACCORDION MODUL) */}
          {activeTab === 'curriculum' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="font-semibold">
                  Total <b className="text-slate-900">{modules.length}</b> Modul • <b className="text-slate-900">{totalLessons}</b> Aktivitas Materi
                </span>
                <button
                  onClick={() => {
                    const allOpen = modules.every(m => openModuleIds[m.ModuleID]);
                    const nextState: Record<string, boolean> = {};
                    modules.forEach(m => {
                      nextState[m.ModuleID] = !allOpen;
                    });
                    setOpenModuleIds(nextState);
                  }}
                  className="text-xs font-bold text-blue-600 hover:underline"
                >
                  {modules.every(m => openModuleIds[m.ModuleID]) ? 'Tutup Semua' : 'Buka Semua'}
                </button>
              </div>

              {/* Accordion List */}
              <div className="space-y-3">
                {modules.map((mod, modIdx) => {
                  const isOpen = !!openModuleIds[mod.ModuleID];
                  const lessonCount = mod.Lessons?.length || 0;

                  return (
                    <div
                      key={mod.ModuleID}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                    >
                      {/* Module Header Toggle */}
                      <button
                        onClick={() => toggleModule(mod.ModuleID)}
                        className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50/70 hover:bg-slate-100/80 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                            {modIdx + 1}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {mod.Title}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                              {mod.Description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                            {lessonCount} Materi
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                              isOpen ? 'rotate-180 text-blue-600' : ''
                            }`}
                          />
                        </div>
                      </button>

                      {/* Lessons List inside Module */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-slate-100 divide-y divide-slate-100 bg-white"
                          >
                            {mod.Lessons && mod.Lessons.length > 0 ? (
                              mod.Lessons.map((lesson, lIdx) => {
                                const type = lesson.Type?.toLowerCase() || '';
                                return (
                                  <div
                                    key={lesson.ActivityID || lIdx}
                                    className="p-3.5 sm:px-5 flex items-center justify-between gap-3 hover:bg-blue-50/30 transition-colors text-xs"
                                  >
                                    <div className="flex items-center gap-3">
                                      {type.includes('quiz') || type.includes('kuis') ? (
                                        <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                                      ) : type.includes('simulator') || type.includes('lab') ? (
                                        <Cpu className="w-4 h-4 text-emerald-500 shrink-0" />
                                      ) : type.includes('video') ? (
                                        <Play className="w-4 h-4 text-blue-500 shrink-0" />
                                      ) : (
                                        <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                                      )}
                                      <span className="font-semibold text-slate-800">
                                        {lesson.Title}
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className="text-[11px] text-slate-400 font-medium">
                                        {lesson.Duration || '15 mnt'}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-4 text-center text-xs text-slate-400 italic">
                                Belum ada aktivitas pelajaran di modul ini.
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: INSTRUKTUR */}
          {activeTab === 'instructor' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6"
            >
              <div className="flex items-start gap-4 pb-6 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shrink-0 shadow-md">
                  {course.InstructorName ? course.InstructorName.charAt(0) : 'I'}
                </div>
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-extrabold uppercase border border-blue-200/60">
                    Instruktur Resmi LPK Alpha Beta
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {course.InstructorName || 'Instruktur Senior Vokasi'}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Praktisi IT, Komputer & Vokasi Berlisensi dengan pengalaman mengajar 10+ tahun.
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Profil & Pengalaman
                </h4>
                <p>
                  Telah membimbing ratusan siswa dan peserta pelatihan kerja untuk meraih kompetensi berstandar SKKNI dan siap terjun ke dunia industri maupun berwirausaha mandiri.
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 4: ULASAN / REVIEW */}
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-black text-slate-900">
                    {course.Rating || 4.9}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Berdasarkan ulasan alumni & peserta resmi
                    </p>
                  </div>
                </div>
              </div>

              {/* Student reviews list */}
              <div className="space-y-4">
                {[
                  {
                    name: 'Budi Santoso',
                    rating: 5,
                    date: '2 minggu lalu',
                    comment: 'Penyampaian materinya sangat jelas dan to-the-point. Simulator kuisnya sangat membantu mengasah pemahaman sebelum ujian sertifikasi.'
                  },
                  {
                    name: 'Dewi Lestari',
                    rating: 5,
                    date: '1 bulan lalu',
                    comment: 'Sangat puas dengan modulnya! Bimbingan dari instruktur dan AI Tutor membuat saya yang awalnya awam jadi sangat percaya diri.'
                  }
                ].map((rev, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{rev.name}</span>
                      <span className="text-slate-400 text-[11px]">{rev.date}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed italic">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Registration Form Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 bg-amber-400/20 text-amber-300 border border-amber-300/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                Formulir Pendaftaran
              </span>
              <h3 className="text-lg font-black text-white">Daftar Kursus: {localized.Title}</h3>
              <p className="text-xs text-slate-300">Pilih skema paket dan amankan kuota pelatihan Anda sekarang.</p>
            </div>

            {regSuccess ? (
              <div className="bg-emerald-950/80 border border-emerald-500/50 p-6 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white">Pendaftaran Berhasil!</h4>
                <p className="text-xs text-emerald-100">Data Anda telah diterima. Admin kami akan segera menghubungi via WhatsApp.</p>
              </div>
            ) : (
              <form onSubmit={handleQuickRegister} className="space-y-3 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-200 block mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="Nama Lengkap Anda"
                      required
                      className="w-full p-2.5 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-slate-200 block mb-1">Nomor WhatsApp *</label>
                    <input
                      type="text"
                      value={regPhone}
                      onChange={e => setRegPhone(e.target.value)}
                      placeholder="081234567890"
                      required
                      className="w-full p-2.5 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-200 block mb-1">Pilihan Paket Tarif *</label>
                    <select
                      value={regPackage}
                      onChange={e => setRegPackage(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 font-bold"
                    >
                      <option value="REGULAR">Reguler ({formatRupiah(normalPrice)})</option>
                      <option value="PROMO">Promo Spesial ({formatRupiah(promoPrice)})</option>
                      <option value="MEMBER">Member / Alumni ({formatRupiah(memberPrice)})</option>
                      <option value="PRIVATE">Kelas Privat 1-on-1 ({formatRupiah(privatePrice)})</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-200 block mb-1">Pilihan Jadwal *</label>
                    <select
                      value={regSchedule}
                      onChange={e => setRegSchedule(e.target.value)}
                      className="w-full p-2.5 bg-slate-900 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="Kelas Pagi (09:00 - 11:00 WIB)">Kelas Pagi (09:00 - 11:00 WIB)</option>
                      <option value="Kelas Sore (15:30 - 17:30 WIB)">Kelas Sore (15:30 - 17:30 WIB)</option>
                      <option value="Weekend Workshop (Sabtu & Minggu)">Weekend Workshop (Sabtu & Minggu)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regSubmitting}
                  className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {regSubmitting ? `Memproses...` : `Kirim Pendaftaran Kursus`}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Right Column: Sticky Sidebar Card (Coursera-like) */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div
            variants={fadeUpVariant}
            className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl sticky top-24 space-y-6"
          >
            {/* Thumbnail Preview */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-100 group">
              <img
                src={course.Thumbnail}
                alt={localized.Title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 fill-blue-600 ml-0.5" />
                </div>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Investasi Pelatihan</span>
                <span className={`${tierCfg.badgeBg} ${tierCfg.badgeColor} px-2 py-0.5 rounded-md text-[10px] font-black`}>
                  {tierCfg.label}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <div className="text-2xl sm:text-3xl font-black text-blue-700">
                  {priceInfo.effectivePriceFormatted}
                </div>
                {priceInfo.isDiscounted && (
                  <span className="text-xs text-slate-400 line-through font-semibold">
                    {priceInfo.normalPriceFormatted}
                  </span>
                )}
              </div>
              {priceInfo.appliedDiscount && (
                <p className="text-[10px] text-rose-600 font-extrabold">
                  🎉 Hemat {priceInfo.discountPercentage}% ({priceInfo.appliedDiscount})
                </p>
              )}
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{enrolling ? 'Memproses...' : 'Mulai Belajar Sekarang'}</span>
            </button>

            {/* Key Inclusions & Perks */}
            <div className="space-y-2.5 text-xs text-slate-700 font-medium pt-4 border-t border-slate-100">
              <p className="font-extrabold text-slate-900 text-[11px] uppercase tracking-wider">
                Paket Kursus Ini Meliputi:
              </p>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{course.Duration || '10 Jam Pembelajaran'} ({course.DurationJP || '10'} JP)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
                <span>{modules.length} Modul & {totalLessons} Aktivitas Belajar</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sertifikat Resmi Ber-QR Code (NISN & VIN)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Cpu className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Simulator Lab Praktik & Kuis Evaluasi</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Bot className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>AI Tutor Pendamping Belajar 24/7</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Akses Selamanya di Mobile & Desktop</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
