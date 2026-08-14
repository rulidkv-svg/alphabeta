import React, { useState } from 'react';
import {
  Languages,
  BookOpen,
  CheckCircle2,
  Users,
  Clock,
  Award,
  Sparkles,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  PlayCircle,
  HelpCircle,
  FileText,
  Video,
  Star,
  Send,
  Calendar,
  Globe,
  Briefcase,
  Check
} from 'lucide-react';

interface EnglishTrainingViewProps {
  onNavigate: (view: string, param?: string) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const EnglishTrainingView: React.FC<EnglishTrainingViewProps> = ({
  onNavigate,
  onShowToast
}) => {
  const [activeLevel, setActiveLevel] = useState<'dasar' | 'menengah' | 'lanjutan'>('dasar');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Quick Registration State
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regLevel, setRegLevel] = useState('Level Dasar');
  const [regSchedule, setRegSchedule] = useState('Kelas Pagi (09:00 - 11:00)');
  const [regNotes, setRegNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmittedSuccess(true);
      if (onShowToast) {
        onShowToast('🎉 Pendaftaran Pelatihan Bahasa Inggris Berhasil Dikirim!', 'success');
      }
    }, 800);
  };

  const levelDasarMateri = [
    'Vocabulary dasar & Pengayaan Kosakata',
    'Greetings and Introduction (Perkenalan Diri)',
    'Daily Conversation (Percakapan Sehari-hari)',
    'Numbers, Time and Date (Angka, Waktu, Tanggal)',
    'Family and Activities (Keluarga & Kegiatan)',
    'Simple Grammar & Sentence Structure',
    'Listening Dasar & Pengenalan Audio Native',
    'Speaking Dasar & Latihan Pronunciation'
  ];

  const levelMenengahMateri = [
    'Intermediate Conversation & Small Talk',
    'Grammar in Use & Tenses Mastery',
    'Reading Comprehension & Article Analysis',
    'Writing Paragraphs & Email Etiquette',
    'Listening Practice (Podcasts & Dialogues)',
    'Presentation Skills & Body Language',
    'Public Speaking Basics in English',
    'English for Workplace & Business Basics'
  ];

  const levelLanjutanMateri = [
    'Advanced Conversation & Debate',
    'Academic English & Report Writing',
    'Business English & Executive Pitching',
    'Professional Presentation & Cross-cultural Comm',
    'Professional Communication & Negotiation',
    'Job Interview Preparation in English',
    'Writing Profesional (Proposal & Offical Email)',
    'English for Global Career Development'
  ];

  const learningMethods = [
    { title: 'Praktik Speaking', desc: 'Sesi latihan bicarakan topik harian secara intensif dengan pengawasan instruktur.', icon: MessageSquare },
    { title: 'Conversation & Role Play', desc: 'Simulasi percakapan situasi dunia nyata, wawancara kerja, dan negosiasi.', icon: Users },
    { title: 'Listening Practice', desc: 'Mendengarkan materi audio & video dari penutur asli untuk melatih pendengaran.', icon: PlayCircle },
    { title: 'Quiz & Game Interaktif', desc: 'Kuis mingguan menyenangkan untuk mengukur penguasaan kosakata dan tata bahasa.', icon: Sparkles },
    { title: 'Project-Based Learning', desc: 'Membuat video presentasi atau pidato dalam Bahasa Inggris sebagai tugas akhir.', icon: FileText },
    { title: 'Latihan Mandiri & Modul', desc: 'Akses e-book, lembar kerja, dan simulasi berbasis web yang bisa diakses 24/7.', icon: Globe }
  ];

  const instructors = [
    {
      name: 'Hanifah Saadah, S.Pd., S.Kom.',
      role: 'Pelatih / Coach Resmi LPK Alpha Beta - Bahasa Inggris',
      exp: 'Pelatih / Coach Resmi',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgs-wcVCe66i-7SaQL51S-pr4j3fkVooeMOMJBjuTSTeCor_OQRmDSd1A2-MocPwBGytdB0br3z3zfLyEk4xmc1Et1jGcCq1cgSLnaGHB6Vcim_9PjLFu6_nv0_cz8DL8uPe8cuflmq2sTwhZEecHUscpR4KWYEh5nor7AYukNz4jvgJXbgHz52OPU09v7n/s320/image.png',
      bio: 'Pelatih / Coach Spesialis Bahasa Inggris, English Conversation, Communication & Aplikasi Komputer LPK Alpha Beta.'
    },
    {
      name: 'Budi Iskandar, S.Si., M.Pd.',
      role: 'Pelatih / Coach Resmi LPK Alpha Beta - Bahasa Inggris, Ahli Kepanduan & Vokasi',
      exp: 'Pelatih / Coach Resmi',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
      bio: 'Pelatih / Coach Bahasa Inggris, Kepanduan, Praktik Lapangan & Pengembangan Kompetensi LPK Alpha Beta.'
    },
    {
      name: 'Wina Mulyani, S.Pd.',
      role: 'Pelatih / Coach Resmi LPK Alpha Beta - Pengelolaan & Kepanduan',
      exp: 'Pelatih / Coach Resmi',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      bio: 'Pelatih / Coach Pengelolaan, Kepanduan, Layanan Informasi & Keterampilan Karir LPK Alpha Beta.'
    },
    {
      name: 'Ine Yuniar Suryadi, S.Pd.',
      role: 'Pelatih / Coach Resmi LPK Alpha Beta - Aplikasi Perkantoran & Produktivitas Digital',
      exp: 'Pelatih / Coach Resmi',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
      bio: 'Pelatih / Coach Aplikasi Perkantoran & Komunikasi Bisnis LPK Alpha Beta.'
    }
  ];

  const faqs = [
    {
      q: 'Apakah pelatihan Bahasa Inggris ini cocok untuk pemula tanpa dasar?',
      a: 'Sangat cocok! Kami memiliki Level Dasar yang dirancang khusus untuk pemula, mulai dari kosakata harian, cara perkenalan, hingga percaya diri berbicara.'
    },
    {
      q: 'Bagaimana sistem menentukan level kelas saya?',
      a: 'Sebelum kelas dimulai, Anda akan mengikuti Placement Test singkat secara gratis untuk menempatkan Anda di kelas yang paling sesuai.'
    },
    {
      q: 'Apakah peserta mendapatkan sertifikat resmi?',
      a: 'Ya, setiap peserta yang lulus ujian akhir pelatihan akan mendapatkan Sertifikat Resmi dari LPK Alpha Beta dengan nomor verifikasi sertifikat terdaftar.'
    },
    {
      q: 'Apakah kelas diselenggarakan secara online atau offline?',
      a: 'Kami menyediakan metode Hybrid (Offline di Kampus LPK Alpha Beta dan Online via Zoom / LMS Interaktif).'
    }
  ];

  const testimonials = [
    {
      name: 'Rina Sulistia',
      role: 'Alumni Level Menengah - Staf Administrasi',
      text: 'Pelatihan Bahasa Inggris di LPK Alpha Beta sangat menyenangkan! Metode conversation-nya bikin percaya diri dan tidak takut salah lagi.',
      score: 5
    },
    {
      name: 'Ahmad Fauzan',
      role: 'Alumni Level Lanjutan - Supervisor Operasional',
      text: 'Materi Business English dan simulasi wawancaranya sangat membantu saya lolos seleksi kerja di perusahaan multinasional.',
      score: 5
    }
  ];

  return (
    <div className="space-y-10 pb-12 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button onClick={() => onNavigate('courses')} className="hover:text-blue-600 transition-colors">
          Program Pelatihan
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-blue-600 font-bold">Pelatihan Bahasa Inggris</span>
      </nav>

      {/* Hero Banner Section */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 border border-amber-300/30 rounded-full text-xs font-bold text-amber-300">
              <Languages className="w-4 h-4 text-amber-300" />
              <span>Program Unggulan LPK Alpha Beta</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Program Pelatihan Bahasa Inggris Praktis & Profesional
            </h1>

            <p className="text-sm text-blue-100 leading-relaxed font-normal">
              Program pelatihan Bahasa Inggris dirancang untuk meningkatkan kemampuan peserta dalam berkomunikasi menggunakan Bahasa Inggris secara praktis, baik untuk kebutuhan pendidikan, pekerjaan, maupun kehidupan sehari-hari.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-3 pt-2 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>3 Bulan (48 Jam Pertemuan)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Maksimal 20 Peserta / Kelas</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Award className="w-4 h-4 text-blue-400" />
                <span>Sertifikat Resmi Terakreditasi</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href="#form-pendaftaran-inggris"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Daftar Pelatihan Bahasa Inggris</span>
              </a>
              <button
                onClick={() => onNavigate('courses')}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all"
              >
                Lihat Program Lainnya
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-white/20 group">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80"
                alt="Pelatihan Bahasa Inggris"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                <div className="text-white text-xs space-y-1">
                  <p className="font-bold">Sesi Praktik Interactive Speaking</p>
                  <p className="text-[11px] text-slate-300">Suasana belajar kondusif dengan pendampingan trainer berpengalaman.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION MATERI BERDASARKAN LEVEL */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200/80 rounded-full text-xs font-extrabold uppercase tracking-wider">
            Kurikulum Terstruktur
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Materi Pelatihan Berdasarkan Level Kemampuan
          </h2>
          <p className="text-xs text-slate-500">
            Materi dirancang bertahap agar peserta dapat berkembang sesuai tingkat pemahaman masing-masing.
          </p>
        </div>

        {/* Level Tabs */}
        <div className="flex justify-center">
          <div className="bg-slate-200/70 p-1.5 rounded-2xl flex flex-wrap gap-1 max-w-md w-full border border-slate-300/50">
            <button
              onClick={() => setActiveLevel('dasar')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                activeLevel === 'dasar'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              🟢 Level Dasar
            </button>
            <button
              onClick={() => setActiveLevel('menengah')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                activeLevel === 'menengah'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              🟡 Level Menengah
            </button>
            <button
              onClick={() => setActiveLevel('lanjutan')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-extrabold transition-all ${
                activeLevel === 'lanjutan'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              🔴 Level Lanjutan
            </button>
          </div>
        </div>

        {/* Level Content Display */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
          {activeLevel === 'dasar' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Level Dasar (Basic English)</h3>
                  <p className="text-xs text-slate-500">Fokus pada fondasi kosakata, percakapan harian, dan kepercayaan diri bicara.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs rounded-full border border-emerald-200">
                  Untuk Pemula Total
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {levelDasarMateri.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeLevel === 'menengah' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Level Menengah (Intermediate English)</h3>
                  <p className="text-xs text-slate-500">Fokus pada kelancaran tata bahasa, pemahaman teks, dan percakapan dunia kerja.</p>
                </div>
                <span className="px-3 py-1 bg-amber-50 text-amber-700 font-bold text-xs rounded-full border border-amber-200">
                  Siap Kerja & Kuliah
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {levelMenengahMateri.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeLevel === 'lanjutan' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Level Lanjutan (Advanced & Business English)</h3>
                  <p className="text-xs text-slate-500">Fokus pada komunikasi profesional, debat bisnis, presentasi eksekutif, dan wawancara.</p>
                </div>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-xs rounded-full border border-indigo-200">
                  Level Profesional / Karir
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {levelLanjutanMateri.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* METODE PEMBELAJARAN GRID */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200/80 rounded-full text-xs font-extrabold uppercase tracking-wider">
            Interaktif & Aplikatif
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Metode Pembelajaran Bahasa Inggris
          </h2>
          <p className="text-xs text-slate-500">
            Pendekatan praktis 70% praktik langsung dan 30% teori pendukung.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {learningMethods.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-2.5"
              >
                <div className="p-2.5 w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* PROFIL INSTRUKTUR & TESTIMONI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Instruktur */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Tim Instruktur Berpengalaman
            </h3>
          </div>

          <div className="space-y-4">
            {instructors.map((ins, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <img
                  src={ins.image}
                  alt={ins.name}
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-500/20 shrink-0"
                />
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-900">{ins.name}</p>
                  <p className="text-[11px] text-blue-600 font-semibold">{ins.role}</p>
                  <p className="text-slate-500">{ins.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimoni Peserta */}
        <div className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Kata Alumni & Peserta
            </h3>
          </div>

          <div className="space-y-3">
            {testimonials.map((t, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.role}</p>
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(t.score)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-slate-600 italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ ACCORDION SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
            Pertanyaan Umum (FAQ) - Pelatihan Bahasa Inggris
          </h3>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200/80 rounded-xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 bg-slate-50/70 hover:bg-slate-100/80 font-bold text-xs text-slate-800 flex items-center justify-between gap-2"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="p-4 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FORM PENDAFTARAN KHUSUS BAHASA INGGRIS */}
      <div id="form-pendaftaran-inggris" className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 border border-blue-800 shadow-xl space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-300/30 rounded-full text-[10px] font-black uppercase tracking-wider">
            Formulir Pendaftaran
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Daftar Pelatihan Bahasa Inggris Sekarang
          </h2>
          <p className="text-xs text-blue-100">
            Isi data diri Anda di bawah ini. Tim admisi kami akan menghubungi Anda melalui WhatsApp untuk mengonfirmasi jadwal & tes penempatan.
          </p>
        </div>

        {submittedSuccess ? (
          <div className="bg-emerald-950/80 border border-emerald-500/50 p-6 sm:p-8 rounded-2xl text-center space-y-3 animate-in fade-in">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/10">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Pendaftaran Berhasil Dikirim!</h3>
            <p className="text-xs text-emerald-100 max-w-md mx-auto leading-relaxed">
              Pendaftaran berhasil dikirim. Silakan tunggu informasi selanjutnya melalui WhatsApp/email.
            </p>
            <button
              onClick={() => {
                setSubmittedSuccess(false);
                setRegName('');
                setRegPhone('');
                setRegEmail('');
              }}
              className="mt-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
            >
              Kirim Pendaftaran Lain
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="max-w-2xl mx-auto space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-200 block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="Contoh: Rina Sulistia"
                  required
                  className="w-full p-3 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
                  className="w-full p-3 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-200 block mb-1">Email Aktif *</label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="email@domain.com"
                  required
                  className="w-full p-3 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="text-slate-200 block mb-1">Pilihan Level *</label>
                <select
                  value={regLevel}
                  onChange={e => setRegLevel(e.target.value)}
                  className="w-full p-3 bg-slate-900 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Level Dasar">Level Dasar (Pemula)</option>
                  <option value="Level Menengah">Level Menengah (Intermediate)</option>
                  <option value="Level Lanjutan">Level Lanjutan (Advanced / Business)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-200 block mb-1">Pilihan Jadwal Kelas *</label>
                <select
                  value={regSchedule}
                  onChange={e => setRegSchedule(e.target.value)}
                  className="w-full p-3 bg-slate-900 text-white rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="Kelas Pagi (09:00 - 11:00)">Kelas Pagi (09:00 - 11:00 WIB)</option>
                  <option value="Kelas Sore (15:30 - 17:30)">Kelas Sore (15:30 - 17:30 WIB)</option>
                  <option value="Kelas Weekend (Sabtu - Minggu)">Kelas Weekend (Sabtu - Minggu)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-200 block mb-1">Catatan Tambahan / Motivasi</label>
                <input
                  type="text"
                  value={regNotes}
                  onChange={e => setRegNotes(e.target.value)}
                  placeholder="Misal: Persiapan wawancara kerja"
                  className="w-full p-3 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span>⏳ Mengirim Pendaftaran...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Daftar Pelatihan Bahasa Inggris</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
