import React, { useEffect, useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Play,
  Cpu,
  Palette,
  Briefcase,
  Languages,
  ChevronRight,
  Star,
  UserCheck,
  Search,
  Bot,
  Layers,
  Clock,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Monitor,
  Flame,
  Zap,
  Globe,
  Baby,
  Check
} from 'lucide-react';
import { motion } from 'motion/react';
import { apiService } from '../services/api';
import { Course, SystemStats } from '../types';
import { CourseCard } from '../components/common/CourseCard';
import { useLanguage } from '../context/LanguageContext';
import { fadeUpVariant, staggerContainer } from '../utils/animations';
import { INITIAL_COURSES } from '../data/initialData';
import { COMPREHENSIVE_COURSES } from '../data/coursesData';
import { KemnakerLogo, KemdikdasmenLogo } from '../components/MinistryLogos';

interface HomeViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<SystemStats>({
    activeStudents: 342,
    totalCourses: 12,
    graduates: 188,
    certificatesIssued: 215,
    instructors: 8
  });
  const [courses, setCourses] = useState<Course[]>(COMPREHENSIVE_COURSES || INITIAL_COURSES);
  const [heroSearch, setHeroSearch] = useState('');
  const [activeCourseFilter, setActiveCourseFilter] = useState<'all' | 'popular' | 'new' | 'certified' | 'beginner'>('all');

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [statsData, coursesData] = await Promise.all([
          apiService.getStats(),
          apiService.getCourses()
        ]);
        if (statsData) setStats(statsData);
        if (coursesData && coursesData.length > 0) {
          setCourses(coursesData);
        }
      } catch (e) {
        console.error('Error loading home stats:', e);
      }
    };
    loadHomeData();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      onNavigate('courses', `search:${heroSearch.trim()}`);
    } else {
      onNavigate('courses');
    }
  };

  // 9 Required Categories
  const categoriesList = [
    {
      id: 'CAT-001',
      title: 'Komputer & Teknologi',
      icon: Cpu,
      count: '14 Modul',
      badge: 'SKKNI IT',
      color: 'from-blue-600 to-indigo-600',
      bgClass: 'hover:border-blue-300 bg-gradient-to-b from-blue-50/60 to-white'
    },
    {
      id: 'CAT-002',
      title: 'Kreatif & Desain',
      icon: Palette,
      count: '10 Modul',
      badge: 'Desain Grafis',
      color: 'from-purple-600 to-pink-600',
      bgClass: 'hover:border-purple-300 bg-gradient-to-b from-purple-50/60 to-white'
    },
    {
      id: 'CAT-004',
      title: 'Bahasa Internasional',
      icon: Globe,
      count: '12 Modul',
      badge: 'Global Skill',
      color: 'from-emerald-600 to-teal-600',
      bgClass: 'hover:border-emerald-300 bg-gradient-to-b from-emerald-50/60 to-white'
    },
    {
      id: 'cat-ai',
      query: 'ai',
      title: 'AI & Prompt Engineering',
      icon: Bot,
      count: '8 Modul',
      badge: 'Trending 🔥',
      color: 'from-indigo-600 to-violet-600',
      bgClass: 'hover:border-indigo-300 bg-gradient-to-b from-indigo-50/60 to-white'
    },
    {
      id: 'cat-dm',
      query: 'marketing',
      title: 'Digital Marketing',
      icon: TrendingUp,
      count: '6 Modul',
      badge: 'Bisnis Digital',
      color: 'from-rose-600 to-orange-600',
      bgClass: 'hover:border-rose-300 bg-gradient-to-b from-rose-50/60 to-white'
    },
    {
      id: 'cat-da',
      query: 'data',
      title: 'Data Analytics',
      icon: BarChart3,
      count: '8 Modul',
      badge: 'High Demand',
      color: 'from-cyan-600 to-blue-600',
      bgClass: 'hover:border-cyan-300 bg-gradient-to-b from-cyan-50/60 to-white'
    },
    {
      id: 'CAT-005',
      title: 'Pendidikan & Guru',
      icon: Baby,
      count: '9 Modul',
      badge: 'Guru PAUD',
      color: 'from-pink-600 to-rose-600',
      bgClass: 'hover:border-pink-300 bg-gradient-to-b from-pink-50/60 to-white'
    },
    {
      id: 'CAT-003',
      title: 'Kewirausahaan & Digital',
      icon: Briefcase,
      count: '7 Modul',
      badge: 'E-Commerce',
      color: 'from-amber-600 to-yellow-600',
      bgClass: 'hover:border-amber-300 bg-gradient-to-b from-amber-50/60 to-white'
    },
    {
      id: 'cat-off',
      query: 'office',
      title: 'Office & Productivity',
      icon: Monitor,
      count: '11 Modul',
      badge: 'Siap Kerja',
      color: 'from-teal-600 to-emerald-600',
      bgClass: 'hover:border-teal-300 bg-gradient-to-b from-teal-50/60 to-white'
    }
  ];

  // 8 Featured Programs Matching Specification
  const featuredPrograms = [
    {
      id: 'prog-ai',
      title: 'AI & Prompt Engineering',
      desc: 'Kuasai implementasi LLM, ChatGPT, Midjourney, dan otomatisasi workflow cerdas di industri modern.',
      duration: '18 Jam • 12 Modul',
      level: 'Semua Tingkat',
      instructor: 'Syifa Rahmawati, S.T.',
      students: 480,
      rating: 4.9,
      icon: Bot,
      category: 'Kecerdasan Buatan',
      searchKey: 'ai',
      thumbnail: 'https://blogger.googleusercontent.com/img/a/AVvXsEhuOmT3V1lMDBNU8KfhAXJogKExOlbP0ejfvAP4mFF0pQFyXnooacqNqnJhr1aQTqZfy6L76mYFrVryyphtv_jeZLo5YM-rLNDD8tErXjo3VPxWDJ8Us28lMGS-Dq6eYnVEKz5xo4Ty5fkWtSmfRfrXtFuXnayaC-NRrKcB546oy8dN6XivPRc2T-7309NB'
    },
    {
      id: 'prog-dm',
      title: 'Digital Marketing & Social Media Strategy',
      desc: 'Strategi iklan berbayar (Meta & Google Ads), SEO, content planning, dan konversi penjualan digital.',
      duration: '16 Jam • 10 Modul',
      level: 'Menengah',
      instructor: 'Wina Mulyani, S.Pd.',
      students: 390,
      rating: 4.9,
      icon: TrendingUp,
      category: 'Bisnis Digital',
      searchKey: 'marketing',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prog-da',
      title: 'Data Analytics & Business Intelligence',
      desc: 'Analisis data bisnis menggunakan SQL, Excel Advanced, Python Pandas, dan visualisasi dashboard interaktif.',
      duration: '22 Jam • 14 Modul',
      level: 'Menengah',
      instructor: 'Ridwan Abdul Aziz, S.T.',
      students: 310,
      rating: 4.8,
      icon: BarChart3,
      category: 'Data Science',
      searchKey: 'data',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prog-off',
      title: 'Microsoft Office & Administrasi Perkantoran',
      desc: 'Standardisasi skill perkantoran profesional: Word, Excel Makro, PowerPoint, dan pengarsipan cloud.',
      duration: '20 Jam • 16 Modul',
      level: 'Pemula',
      instructor: 'Ine Yuniar Suryadi, S.Pd.',
      students: 620,
      rating: 4.9,
      icon: Monitor,
      category: 'Produktivitas',
      searchKey: 'office',
      thumbnail: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prog-gd',
      title: 'Graphic Design & Digital Branding',
      desc: 'Desain visual profesional dengan Canva Pro, Figma, Photoshop, dan pembuatan aset identitas merek.',
      duration: '18 Jam • 12 Modul',
      level: 'Pemula & Menengah',
      instructor: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
      students: 440,
      rating: 4.9,
      icon: Palette,
      category: 'Desain Komunikasi Visual',
      searchKey: 'desain',
      thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prog-eng',
      title: 'English Communication for Workplace',
      desc: 'Pelatihan percakapan bahasa Inggris profesional, email bisnis, presentasi, dan wawancara kerja.',
      duration: '24 Jam • 15 Modul',
      level: 'Semua Tingkat',
      instructor: 'Hanifah Saadah, S.Pd., S.Kom.',
      students: 530,
      rating: 4.9,
      icon: Globe,
      category: 'Bahasa Asing',
      searchKey: 'english',
      thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prog-paud',
      title: 'Pelatihan Guru PAUD & Inovasi Belajar',
      desc: 'Metodologi pengajaran anak usia dini, media kreatif berbasis bermain, dan evaluasi tumbuh kembang.',
      duration: '20 Jam • 14 Modul',
      level: 'Pendidik & Guru',
      instructor: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
      students: 370,
      rating: 4.9,
      icon: Baby,
      category: 'Pendidikan Vokasi',
      searchKey: 'paud',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'prog-comp',
      title: 'Komputer & Perakitan PC Hardware Lab',
      desc: 'Teknisi hardware komputer, troubleshooting komponen, perakitan virtual simulator, dan instalasi OS.',
      duration: '26 Jam • 18 Modul',
      level: 'Pemula s/d Mahir',
      instructor: 'Roni Nuroni, S.T., MCE',
      students: 580,
      rating: 5.0,
      icon: Cpu,
      category: 'Teknologi Informasi',
      searchKey: 'teknisi',
      thumbnail: 'https://blogger.googleusercontent.com/img/a/AVvXsEiZIlmWV49LoVo4He6zYPfrmgu7NGx7mK4q2cn6wGrUkATXg_jCz1J7N88MwVSPBpOQeE-EaADcSfD6KdBRMvgEmqUqgGYmhjfVluViTVexpWDPvCUtBKSTyTXGV4pRno48y88i91PCxRMJ_CMOx5hHgIgYOFdKFQD_Sm4nUPUHSg4DJyaYVPfE4VQ2dvwU'
    }
  ];

  // Official Personnel Profiles List from INITIAL_OFFICIALS
  const instructorList = [
    {
      name: 'Ruli Lesmana, S.T., Gr.',
      role: 'Direktur Alpha Beta',
      field: 'Manajemen LPK & Tata Kelola Vokasi',
      photo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjC22VTDR1o6-eA0KhgTQ9PpOSJAAzFPc_PQ4VINmNQzWMA29_9uyqfdsIa0J9i9cJmxQ5UjPjSOH8yhJn3jOB7LQ3cgSY3ZGCxPufKKrRrf9eoiRM4ORfUg5IAI-b0JRtx_nhrZheVgOaoGCUzNkkrDMrevH0pTtXSlD8W5jOl6p1VufgsG08YQ4Bcsk6v/s320/Ruli%204x6.jpg',
      coursesCount: 6,
      studentsCount: 1240,
      rating: 4.9,
      bio: 'Direktur Lembaga Pelatihan Kerja (LPK) Alpha Beta dengan sertifikasi pendidik profesional, memimpin standardisasi kurikulum vokasi berbasis SKKNI dan penandatangan sertifikat resmi.'
    },
    {
      name: 'Roni Nuroni, S.T., MCE',
      role: 'Instruktur Resmi',
      field: 'Hardware & Jaringan Komputer',
      photo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh2ZQBYKi1Y-v0k7gymLgvDFbxXptNamIEaEVBUk3iCa1P1zf9YIjelK8oTO4EgkqNzIy3jNtToFIt9upIcF3trTWV8h8nquBeBUXulHfsdzImYIZF-PGcP6Cl24xN27XfJ5Sw8dKH6GuoQt7-F9VtgBQN3qheqN-rClkmNMywv-ECKyI0ZBScRkN3jKLZg/s320/image1786713699',
      coursesCount: 4,
      studentsCount: 890,
      rating: 5.0,
      bio: 'Instruktur Resmi LPK Alpha Beta bersertifikasi Microsoft Certified Educator (MCE) spesialisasi Hardware Komputer, Troubleshooting & Jaringan.'
    },
    {
      name: 'Hanifah Saadah, S.Pd., S.Kom.',
      role: 'Pelatih / Coach',
      field: 'Bahasa Inggris & Komunikasi Global',
      photo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgs-wcVCe66i-7SaQL51S-pr4j3fkVooeMOMJBjuTSTeCor_OQRmDSd1A2-MocPwBGytdB0br3z3zfLyEk4xmc1Et1jGcCq1cgSLnaGHB6Vcim_9PjLFu6_nv0_cz8DL8uPe8cuflmq2sTwhZEecHUscpR4KWYEh5nor7AYukNz4jvgJXbgHz52OPU09v7n/s320/image.png',
      coursesCount: 4,
      studentsCount: 750,
      rating: 4.9,
      bio: 'Pelatih resmi LPK Alpha Beta untuk program Business English, TOEFL/IELTS Preparation, dan percakapan bahasa Inggris profesional.'
    },
    {
      name: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
      role: 'Pelatih / Coach',
      field: 'Desain Grafis & Pendidikan PAUD',
      photo: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6d1w0Hu5SsMTHCp5h5MxwkZmRkoPzht081efl50zE5XinbTBiY3yKsAl_m0Hf_2n4S_hnQnPih7Q0vodcuVZOMJ6fpF9KEM7ntJFiPNk331sMEBbBKauNjcL7UhIjKIgx84ybwf-H2Pd-v57H4o9WwIxfM6GoUnklxr6uKmwxc9ltgKz6Tv5Fb3patTze/s320/image.png',
      coursesCount: 4,
      studentsCount: 620,
      rating: 4.9,
      bio: 'Pelatih resmi LPK Alpha Beta spesialisasi metodologi pembelajaran anak usia dini (PAUD), media kreatif edukatif, dan desain visual.'
    },
    {
      name: 'Budi Iskandar, S.Si., M.Pd.',
      role: 'Pelatih / Coach',
      field: 'Bahasa Inggris, Kepanduan & Vokasi',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      coursesCount: 5,
      studentsCount: 580,
      rating: 4.9,
      bio: 'Pelatih / Coach resmi LPK Alpha Beta bidang Bahasa Inggris, Ahli Kepanduan, Vokasi, Praktik Lapangan & Pengembangan Kompetensi Peserta.'
    },
    {
      name: 'Ine Yuniar Suryadi, S.Pd.',
      role: 'Pelatih / Coach',
      field: 'Aplikasi Perkantoran & Produktivitas Digital',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      coursesCount: 3,
      studentsCount: 640,
      rating: 4.9,
      bio: 'Pelatih resmi LPK Alpha Beta untuk standardisasi keterampilan Microsoft Office profesional, otomatisasi data, dan administrasi perkantoran.'
    },
    {
      name: 'Syifa Rahmawati, S.T.',
      role: 'Instruktur Resmi',
      field: 'Aplikasi Digital & LMS',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      coursesCount: 3,
      studentsCount: 490,
      rating: 4.9,
      bio: 'Instruktur Resmi LPK Alpha Beta spesialisasi sistem pembelajaran digital, teknologi kecerdasan buatan, dan arsitektur aplikasi LMS.'
    },
    {
      name: 'Ridwan Abdul Aziz, S.T.',
      role: 'Instruktur Resmi',
      field: 'Teknologi Informasi & Sistem Komputer',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      coursesCount: 3,
      studentsCount: 460,
      rating: 4.8,
      bio: 'Instruktur Resmi LPK Alpha Beta bidang Teknologi Informasi, Analisis Data Bisnis, dan Rekayasa Sistem Komputer.'
    }
  ];

  // Testimonials matching Alpha Beta Learning Center
  const testimonials = [
    {
      name: 'Ahmad Fauzi',
      role: 'IT Support Specialist di PT Nusantara Mediatek',
      avatar: 'https://blogger.googleusercontent.com/img/a/AVvXsEg8PFBsGajTF7W-WCOuV6B5YjQU5SxTgAD2rl7w4LlrRVN6ttYkU4umgGJmM14Y1nb_KAdYuzzY6uo_-iD2P77q8dJ4KxbmW2VPBUuO-vK2RpHOFwbPzgDnQEGY4BDWIgMVk0d6eFzemlTwoPBNQZADnXoOPS4qEOdwvwm-Y4GxpCvsYNwWMO3r9N8IPc7I',
      course: 'Teknisi Komputer & Perakitan PC Profesional',
      rating: 5,
      content: 'Materi di Alpha Beta Learning Center sangat aplikatif dan simulator perakitan PC-nya sangat membantu saya memahami hardware sebelum terjun langsung ke dunia kerja. Sertifikat resminya langsung diakui oleh perusahaan tempat saya bekerja sekarang!'
    },
    {
      name: 'Siti Rahmawati',
      role: 'Administrative Officer di Bank Daerah',
      avatar: 'https://blogger.googleusercontent.com/img/a/AVvXsEhL64gsyq2hPW9cSMwATIrYjQvDN9uRZBK2aB-q0VCWj6F76InbVE0v7gGl9I1bPM2GbytgpruYIHUV6nqxe1Kmd8WsgsvWOd3I5nJ-IL0NyuIWn5j6wKCQ-CxrRQzx9Lf4VU0bzNcZEAldmMz_xYES98tU62iTDXiF4_uFgBS5m-857xSJb_7K_jvHGNZn',
      course: 'Mastering Microsoft Office & Excel Dunia Kerja',
      rating: 5,
      content: 'Modul spreadsheet dan fungsi logika Excel diajarkan dari dasar hingga mahir. Ujian kompetensinya sangat kredibel dan AI Tutor-nya responsif saat saya ada kendala rumus. Sangat direkomendasikan untuk siapa pun!'
    },
    {
      name: 'Rizky Pratama',
      role: 'Junior Network Administrator',
      avatar: 'https://blogger.googleusercontent.com/img/a/AVvXsEgteQJRYajcLjSnZ5DHaHEPQ5ZlpvLRGwF5q0lgOXIawRz78mm6Dz7qcYPur-nNEHpcPofFcmClPtopl8kUTw2lGIWXsZ0-iyviR_safVfJt3z_CIeCtjfD4-9kJ7g-hNRUf94-5ll2AXlFL94KHVCsNf3eFzIIru3nAhz4C-YDcj_fdyk8tKNiLNFEoV4I',
      course: 'Administrator Jaringan Komputer & Mikrotik Lab',
      rating: 5,
      content: 'Belajar konfigurasi router dan subnetting jadi sangat terstruktur. Instrukturnya sangat berpengalaman. Verifikasi sertifikat via QR Code memudahkan saat proses rekrutmen kerja!'
    }
  ];

  // Filtered popular & new courses
  const filteredPopularCourses = courses.filter(c => (c.Rating || 0) >= 4.8 || (c.EnrolledCount || 0) > 80).slice(0, 4);
  const filteredNewCourses = [...courses].reverse().slice(0, 4);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-16 sm:space-y-24 py-4 sm:py-8 overflow-x-hidden"
    >
      {/* ========================================================================= */}
      {/* 1. HERO SECTION (Clean, Mobile-First, Modern Educational Aesthetics)      */}
      {/* ========================================================================= */}
      <motion.section
        variants={fadeUpVariant}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-blue-950 text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-slate-800"
      >
        {/* Soft background glows */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Accreditation Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>ALPHA BETA LEARNING CENTER • AKREDITASI RESMI</span>
            </div>

            {/* Main Headline (Exact copy requested) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-tight">
              Belajar Skill Baru.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-amber-300">
                Bangun Masa Depanmu.
              </span>
            </h1>

            {/* Subheadline (Exact copy requested) */}
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-xl">
              Platform pembelajaran dan pelatihan profesional untuk meningkatkan keterampilan, kompetensi, dan kesiapan kerja.
            </p>

            {/* Search Bar: "Apa yang ingin Anda pelajari?" */}
            <form onSubmit={handleHeroSearch} className="relative max-w-lg">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                value={heroSearch}
                onChange={e => setHeroSearch(e.target.value)}
                placeholder="Apa yang ingin Anda pelajari?"
                className="w-full pl-11 pr-24 sm:pr-28 py-3.5 bg-white/10 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-300 text-xs sm:text-sm font-medium rounded-2xl border border-white/20 focus:border-blue-400 outline-none backdrop-blur-md transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center justify-center"
              >
                Cari
              </button>
            </form>

            {/* Main Buttons (Mulai Belajar & Jelajahi Kursus) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('courses')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
              >
                <span>Mulai Belajar</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('courses')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-blue-300" />
                <span>Jelajahi Kursus</span>
              </button>
            </div>
          </div>

          {/* Hero Right Visual: Academic Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-md bg-white/95 text-slate-900 rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/30 backdrop-blur-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900">Alpha Beta Learning Center</h3>
                    <p className="text-[11px] text-slate-500">Pendidikan & Pelatihan Kerja</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  Terverifikasi
                </span>
              </div>

              {/* Tagline Feature Points */}
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 font-black text-[10px]">
                    1
                  </div>
                  <span className="font-bold text-slate-800">Belajar:</span>
                  <span className="text-slate-600">Kurikulum terstruktur & video interaktif</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 font-black text-[10px]">
                    2
                  </div>
                  <span className="font-bold text-slate-800">Berlatih:</span>
                  <span className="text-slate-600">Virtual Lab, Simulator & Kuis Evaluasi</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 font-black text-[10px]">
                    3
                  </div>
                  <span className="font-bold text-slate-800">Bersertifikat:</span>
                  <span className="text-slate-600">Sertifikat resmi QR Code NISN & VIN</span>
                </div>

                <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-black text-[10px]">
                    4
                  </div>
                  <span className="font-bold text-slate-800">Siap Kerja:</span>
                  <span className="text-slate-600">Portofolio nyata & pendampingan karier</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span>NISN: <b className="text-slate-800">K9980820</b></span>
                <span>VIN: <b className="text-slate-800">20002320503</b></span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 2. STATISTIK SECTION                                                      */}
      {/* ========================================================================= */}
      <motion.section variants={fadeUpVariant} className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Peserta Aktif</span>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.activeStudents}+</div>
          <p className="text-[11px] text-slate-500">Siswa & Profesional</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Modul</span>
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">100+</div>
          <p className="text-[11px] text-slate-500">Standar SKKNI & Industri</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Lulusan</span>
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.graduates}+</div>
          <p className="text-[11px] text-slate-500">Siap Kerja di Industri</p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-indigo-600">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sertifikat Terbit</span>
            <Award className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.certificatesIssued}+</div>
          <p className="text-[11px] text-slate-500">QR Code Terverifikasi</p>
        </div>

        <div className="col-span-2 lg:col-span-1 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between text-rose-500">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Instruktur & Coach</span>
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.instructors}</div>
          <p className="text-[11px] text-slate-500">Praktisi Berpengalaman</p>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 3. KATEGORI (Jelajahi Berdasarkan Kategori - 9 Kategori)                   */}
      {/* ========================================================================= */}
      <motion.section variants={fadeUpVariant} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Bidang Keahlian</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Jelajahi Berdasarkan Kategori
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Pilih bidang keahlian vokasi dan kompetensi digital sesuai minat Anda.
            </p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Semua Kategori</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Responsive Grid: 1-2 cols on mobile, 2-3 cols on tablet, 3-4 cols on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {categoriesList.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  if (cat.query) {
                    onNavigate('courses', `search:${cat.query}`);
                  } else {
                    onNavigate('courses', cat.id);
                  }
                }}
                className={`p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between ${cat.bgClass}`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-xl bg-white shadow-xs border border-slate-200/70 flex items-center justify-center font-bold text-blue-600 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-600">
                      {cat.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-blue-600 transition-colors">
                      {cat.title}
                    </h3>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-blue-600">
                  <span>{cat.count}</span>
                  <div className="flex items-center gap-1 font-bold">
                    <span>Eksplor</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 4. KURSUS POPULER (Grid Responsif 4/2/1)                                  */}
      {/* ========================================================================= */}
      <motion.section variants={fadeUpVariant} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Pilihan Favorit Peserta</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kursus Populer
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Kursus dengan rating tertinggi dan paling banyak diikuti oleh peserta di seluruh Indonesia.
            </p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Lihat Semua</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPopularCourses.map(course => (
            <CourseCard
              key={course.CourseID}
              course={course}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 5. KURSUS TERBARU                                                         */}
      {/* ========================================================================= */}
      <motion.section variants={fadeUpVariant} className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Materi & Modul Baru</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Kursus Terbaru
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Kurikulum termutakhir disesuaikan dengan kebutuhan teknologi dan industri saat ini.
            </p>
          </div>
          <button
            onClick={() => onNavigate('courses')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Semua Kursus</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredNewCourses.map(course => (
            <CourseCard
              key={course.CourseID}
              course={course}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 6. PROGRAM UNGGULAN (8 Program Terperinci)                                */}
      {/* ========================================================================= */}
      <motion.section variants={fadeUpVariant} className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
            Karier & Kompetensi
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Program Unggulan Alpha Beta Learning Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Jalur pelatihan intensif berbasis sertifikasi kompetensi dengan pendampingan instruktur dan virtual lab.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredPrograms.map(prog => {
            const Icon = prog.icon;
            return (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-lg transition-all flex flex-col overflow-hidden group"
              >
                <div className="relative h-40 overflow-hidden bg-slate-900">
                  <img
                    src={prog.thumbnail}
                    alt={prog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    {prog.category}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-amber-400 text-slate-950 font-black text-[11px] px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-slate-950" />
                    <span>{prog.rating}</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                      {prog.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {prog.desc}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {prog.duration}
                      </span>
                      <span className="font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        {prog.level}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 text-[11px]">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="truncate">{prog.instructor}</span>
                    </div>

                    <button
                      onClick={() => {
                        if (prog.id === 'prog-paud') {
                          onNavigate('paud_training');
                        } else if (prog.id === 'prog-eng') {
                          onNavigate('english_training');
                        } else {
                          onNavigate('courses', `search:${prog.searchKey}`);
                        }
                      }}
                      className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition-all text-center flex items-center justify-center gap-1.5"
                    >
                      <span>Lihat Detail Program</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 7. KENAPA ALPHA BETA (6 Pilar Keunggulan)                                  */}
      {/* ========================================================================= */}
      <motion.section variants={fadeUpVariant} className="space-y-8 bg-slate-50/80 rounded-3xl p-6 sm:p-10 border border-slate-200/80">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
            Keunggulan Lembaga
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Kenapa Alpha Beta Learning Center?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Pengalaman belajar vokasi yang dirancang untuk keberhasilan karier dan sertifikasi nyata.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Pembelajaran Terstruktur</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Materi disusun bertahap dari pemahaman konsep dasar, studi kasus nyata, hingga proyek akhir siap portofolio kerja.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Sertifikat Resmi & Terverifikasi</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Sertifikat kelulusan sah ditandatangani Direktur Lembaga dengan nomor NISN/VIN dan QR Code verifikasi online.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Akses Fleksibel 24/7</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Belajar kapan saja dan di mana saja melalui smartphone, tablet, atau laptop dengan progress tersimpan otomatis.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Simulator Praktik & Virtual Lab</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Uji pemahaman langsung dengan simulator hardware, visual code compiler, flowcharts, dan kuis evaluasi bertingkat.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">AI Tutor Pendamping Belajar</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dapatkan bantuan instan, rangkuman konsep rumit, dan tips ujian dari asisten kecerdasan buatan terintegrasi.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900">Pendampingan Karir & CV Digital</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Dilengkapi fitur CV Digital otomatis dan portofolio keahlian yang dapat langsung dilampirkan saat melamar kerja.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 8. INSTRUKTUR (Profil Praktisi & Mentor Berpengalaman)                    */}
      {/* ========================================================================= */}
      <motion.section variants={fadeUpVariant} className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Pengajar Berpengalaman</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Belajar Langsung dari Instruktur Profesional
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Instruktur bersertifikasi dan praktisi industri yang siap membimbing Anda mencapai kompetensi optimal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructorList.map((inst, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 flex flex-col justify-between space-y-4 hover:shadow-md transition-all group"
            >
              <div className="space-y-3">
                <div className="relative w-20 h-20 mx-auto">
                  <img
                    src={inst.photo}
                    alt={inst.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-500/20 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-slate-950" />
                    <span>{inst.rating}</span>
                  </div>
                </div>

                <div className="text-center space-y-0.5">
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors">
                    {inst.name}
                  </h4>
                  <p className="text-[11px] font-semibold text-blue-600">{inst.role}</p>
                  <p className="text-[10px] text-slate-400">{inst.field}</p>
                </div>

                <p className="text-xs text-slate-500 text-center leading-relaxed line-clamp-3">
                  {inst.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>📚 {inst.coursesCount} Kursus</span>
                <span>👥 {inst.studentsCount}+ Siswa</span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 9. TESTIMONI (Kisah Sukses Peserta)                                       */}
      {/* ========================================================================= */}
      <motion.section variants={fadeUpVariant} className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>Kisah Sukses Alumni</span>
          </div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Dipercaya Oleh Ratusan Peserta di Seluruh Indonesia
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Inilah pengalaman nyata para alumni yang telah menyelesaikan pelatihan di Alpha Beta Learning Center.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  &ldquo;{item.content}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-500">{item.role}</p>
                  <span className="text-[10px] font-semibold text-blue-600 mt-0.5 block">
                    Alumni: {item.course}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* 10. CALL TO ACTION (Akselerasi Karier Digital)                             */}
      {/* ========================================================================= */}
      <motion.section
        variants={fadeUpVariant}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white p-8 sm:p-12 text-center shadow-xl border border-blue-600/50"
      >
        <div className="max-w-2xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Kembangkan Potensi Anda Sekarang</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
            Siap Mengakselerasi Keterampilan & Karier Digital Anda?
          </h2>

          <p className="text-xs sm:text-sm text-blue-100 leading-relaxed max-w-xl mx-auto">
            Daftar sekarang dan dapatkan akses ke modul pembelajaran interaktif, kuis terstandar industri, virtual lab, dan sertifikat resmi Alpha Beta Learning Center.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/30 transition-all hover:scale-105 active:scale-95"
            >
              🚀 Daftar Akun Belajar Gratis
            </button>

            <button
              onClick={() => onNavigate('courses')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all active:scale-95"
            >
              Lihat Katalog Kursus
            </button>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};

