import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Award,
  Zap,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  BarChart3,
  UserCheck,
  FileText,
  Printer,
  ShieldCheck,
  MessageSquare,
  CreditCard,
  Upload,
  AlertTriangle,
  X,
  FileCheck,
  Download,
  Eye,
  RefreshCw,
  Flame,
  Target,
  ArrowRight,
  TrendingUp,
  Compass,
  Video,
  Calendar,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { Course, Enrollment, Certificate, Payment } from '../types';
import { CertificateView } from '../components/certificate/CertificateView';
import { LiveSessionManager } from '../components/lms/LiveSessionManager';
import { GraduationStatusCard } from '../components/lms/GraduationStatusCard';
import { LmsGuideModal } from '../components/lms/LmsGuideModal';
import { CourseCard } from '../components/common/CourseCard';

interface StudentDashboardViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const StudentDashboardView: React.FC<StudentDashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState<{
    enrolledCourses: (Enrollment & { course: Course })[];
    certificates: Certificate[];
    payments: Payment[];
    badges: any[];
  }>({
    enrolledCourses: [],
    certificates: [],
    payments: [],
    badges: []
  });
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab State: 'ONGOING' | 'COMPLETED' | 'CERTIFICATES' | 'ATTENDANCE' | 'RECOMMENDED'
  const [activeTab, setActiveTab] = useState<'ONGOING' | 'COMPLETED' | 'CERTIFICATES' | 'ATTENDANCE' | 'RECOMMENDED'>('ONGOING');

  // Payment Confirmation Modal State
  const [selectedCertForPayment, setSelectedCertForPayment] = useState<Certificate | null>(null);
  const [paymentForm, setPaymentForm] = useState({
    payerName: '',
    amount: 50000,
    transferDate: new Date().toISOString().split('T')[0],
    bankName: 'Bank Mandiri',
    proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
    note: ''
  });
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Certificate Preview Modal State
  const [activeCertPreview, setActiveCertPreview] = useState<Certificate | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Attendance / Absensi State
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [attendanceStats, setAttendanceStats] = useState<{
    total: number;
    hadirCount: number;
    izinCount: number;
    sakitCount: number;
    alpaCount: number;
    percentage: number;
  }>({ total: 0, hadirCount: 0, izinCount: 0, sakitCount: 0, alpaCount: 0, percentage: 100 });
  const [checkInForm, setCheckInForm] = useState({
    courseId: 'CRS-TK01',
    status: 'Hadir',
    notes: ''
  });
  const [isSubmittingCheckIn, setIsSubmittingCheckIn] = useState(false);
  const [checkInMessage, setCheckInMessage] = useState<string | null>(null);

  const loadDashboard = async () => {
    if (!user) return;
    try {
      const [res, attRes, catalogRes] = await Promise.all([
        apiService.getStudentDashboard(user.UserID),
        apiService.getStudentAttendance(user.UserID),
        apiService.getCourses()
      ]);
      setDashboardData({
        enrolledCourses: res.enrolledCourses || [],
        certificates: res.certificates || [],
        payments: res.payments || [],
        badges: res.badges || []
      });
      setAllCourses(catalogRes || []);
      if (attRes) {
        setAttendanceData(attRes.attendances || []);
        setAttendanceStats(attRes.stats || { total: 0, hadirCount: 0, izinCount: 0, sakitCount: 0, alpaCount: 0, percentage: 100 });
      }
    } catch (e) {
      console.error('Error loading dashboard:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmittingCheckIn(true);
    setCheckInMessage(null);
    try {
      const res = await apiService.submitStudentCheckIn({
        userId: user.UserID,
        courseId: checkInForm.courseId,
        status: checkInForm.status,
        notes: checkInForm.notes
      });
      if (res.success) {
        setCheckInMessage('✅ Presensi online berhasil dicatat hari ini!');
        setCheckInForm(prev => ({ ...prev, notes: '' }));
        const attRes = await apiService.getStudentAttendance(user.UserID);
        if (attRes) {
          setAttendanceData(attRes.attendances || []);
          setAttendanceStats(attRes.stats || { total: 0, hadirCount: 0, izinCount: 0, sakitCount: 0, alpaCount: 0, percentage: 100 });
        }
      }
    } catch (err) {
      setCheckInMessage('❌ Gagal mencatat presensi. Coba lagi.');
    } finally {
      setIsSubmittingCheckIn(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [user]);

  const handleOpenPaymentModal = (cert: Certificate) => {
    setSelectedCertForPayment(cert);
    setPaymentForm({
      payerName: user?.Name || cert.UserName,
      amount: 50000,
      transferDate: new Date().toISOString().split('T')[0],
      bankName: 'Bank Mandiri',
      proofUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
      note: ''
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentForm(prev => ({ ...prev, proofUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitPaymentConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCertForPayment || !user) return;

    setIsSubmittingPayment(true);
    try {
      await apiService.confirmCertificatePayment({
        certificateId: selectedCertForPayment.CertificateID,
        userId: user.UserID,
        payerName: paymentForm.payerName,
        courseTitle: selectedCertForPayment.CourseTitle,
        amount: Number(paymentForm.amount),
        transferDate: paymentForm.transferDate,
        bankName: paymentForm.bankName,
        proofUrl: paymentForm.proofUrl,
        note: paymentForm.note
      });

      setSelectedCertForPayment(null);
      await loadDashboard();
    } catch (err) {
      console.error('Error confirming payment:', err);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const handleOrderPhysicalCert = async (cert: Certificate) => {
    try {
      if (user) {
        await apiService.createCertificatePayment({
          userId: user.UserID,
          courseId: cert.CourseID,
          certificateId: cert.CertificateID
        });
      }
    } catch (e) {
      console.error('Error creating payment record:', e);
    }

    const waNum = '081223546686';
    const msg = encodeURIComponent(
      `Halo Admin Alpha Beta Learning Center.\n\nSaya ingin melakukan pembayaran/cetak fisik sertifikat.\n\nNama: ${cert.UserName}\nKursus: ${cert.CourseTitle}\nNomor Sertifikat: ${cert.CertificateID}\nBiaya: Rp 50.000\n\nMohon informasi verifikasi selanjutnya.\n\nTerima kasih.`
    );
    window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
  };

  if (!user) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-5">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">Dashboard Siswa</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Silakan masuk ke akun Anda untuk mengakses materi pembelajaran, kuis interaktif, lab simulator, dan sertifikat kompetensi.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all"
          >
            Masuk ke Akun
          </button>
          <button
            onClick={() => onNavigate('register')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
          >
            Daftar Peserta Baru
          </button>
        </div>
      </div>
    );
  }

  // Filtered course lists
  const ongoingCourses = dashboardData.enrolledCourses.filter(e => (e.Progress || 0) < 100);
  const completedCourses = dashboardData.enrolledCourses.filter(e => (e.Progress || 0) >= 100 || e.Status === 'Completed');
  
  // Recommended courses (those not yet enrolled)
  const enrolledIds = dashboardData.enrolledCourses.map(e => e.CourseID);
  const recommendedCourses = allCourses.filter(c => !enrolledIds.includes(c.CourseID)).slice(0, 4);

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto">
      {/* 1. Header Ringkasan Siswa */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* User Info & Streak */}
          <div className="flex items-center gap-4">
            <img
              src={user.PhotoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user.Name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Siswa Reguler
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-amber-300" /> 5 Hari Streak
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                Selamat datang kembali, {user.Name}! 👋
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Lanjutkan perjalanan belajar Anda menuju sertifikasi vokasi profesional berstandar industri.
              </p>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700/80 flex items-center gap-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Level Siswa</span>
                <span className="text-base font-black text-amber-300">Level {user.Level || 1}</span>
              </div>
              <div className="w-px h-8 bg-slate-700" />
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Poin</span>
                <span className="text-base font-black text-blue-400">⚡ {user.XP || 150} XP</span>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(true)}
              className="px-4 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span>Panduan</span>
            </button>
          </div>
        </div>

        {/* Weekly Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Target Belajar Mingguan:</span>
            <span className="text-slate-400">4 dari 5 Modul Selesai (80%)</span>
          </div>
          <div className="w-full sm:w-64 h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '80%' }} />
          </div>
        </div>
      </div>

      {/* 2. Quick Stats Cards (4 Metrics) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {dashboardData.enrolledCourses.length}
            </div>
            <p className="text-xs text-slate-500 font-medium">Kursus Diikuti</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-emerald-600">
              {completedCourses.length}
            </div>
            <p className="text-xs text-slate-500 font-medium">Kursus Selesai</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-amber-600">
              {dashboardData.certificates.length}
            </div>
            <p className="text-xs text-slate-500 font-medium">Sertifikat Diperoleh</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-indigo-600">
              28.5 Jam
            </div>
            <p className="text-xs text-slate-500 font-medium">Total Waktu Belajar</p>
          </div>
        </div>
      </div>

      {/* 3. Dashboard Navigation Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'ONGOING', label: `Kursus Saya (${ongoingCourses.length})`, icon: Play },
          { id: 'COMPLETED', label: `Kursus Selesai (${completedCourses.length})`, icon: CheckCircle2 },
          { id: 'CERTIFICATES', label: `Sertifikat Saya (${dashboardData.certificates.length})`, icon: Award },
          { id: 'ATTENDANCE', label: 'Presensi & Jadwal', icon: Calendar },
          { id: 'RECOMMENDED', label: 'Rekomendasi Kursus', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Kursus Saya (Sedang Berjalan) */}
      {activeTab === 'ONGOING' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900">
              Kursus yang Sedang Dipelajari
            </h2>
            <button
              onClick={() => onNavigate('courses')}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
            >
              <span>Jelajahi Katalog Kursus</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-500 text-xs">Memuat kursus Anda...</div>
          ) : ongoingCourses.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-800">Tidak ada kursus yang sedang berjalan.</p>
              <p className="text-xs text-slate-500">Mulai belajar dengan mendaftar kursus baru sekarang.</p>
              <button
                onClick={() => onNavigate('courses')}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all inline-block"
              >
                Lihat Katalog Kursus
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ongoingCourses.map(item => {
                const c = item.course;
                if (!c) return null;

                return (
                  <div
                    key={item.EnrollmentID}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between gap-5"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={c.Thumbnail}
                        alt={c.Title}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold text-[10px]">
                          {c.CategoryName || 'Komputer & Vokasi'}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{c.Title}</h3>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500">
                          <span>{c.TotalModules || 5} Modul</span>
                          <span>•</span>
                          <span>{c.Duration || '20 Jam'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Continue Button */}
                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-600">Progress Belajar:</span>
                          <span className="text-blue-600">{item.Progress || 0}% Selesai</span>
                        </div>
                        <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                            style={{ width: `${item.Progress || 0}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => onNavigate('learning', c.CourseID)}
                        className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>Lanjutkan Belajar</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Kursus Selesai */}
      {activeTab === 'COMPLETED' && (
        <div className="space-y-4">
          <h2 className="text-base font-black text-slate-900">
            Kursus yang Telah Selesai
          </h2>

          {completedCourses.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Belum ada kursus yang diselesaikan.</p>
              <p className="text-xs text-slate-500">Selesaikan semua modul dan ujian untuk mendapatkan sertifikat kelulusan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedCourses.map(item => {
                const c = item.course;
                if (!c) return null;

                return (
                  <div
                    key={item.EnrollmentID}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs space-y-4"
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={c.Thumbnail}
                        alt={c.Title}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-100 shrink-0"
                      />
                      <div className="space-y-1 flex-1 min-w-0">
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                          ✓ Lulus & Selesai
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{c.Title}</h3>
                        <p className="text-xs text-slate-500">Nilai Akhir: 95/100 (Sangat Memuaskan)</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onNavigate('learning', c.CourseID)}
                        className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
                      >
                        Ulangi Materi
                      </button>

                      <button
                        onClick={() => setActiveTab('CERTIFICATES')}
                        className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Unduh Sertifikat</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Sertifikat Saya */}
      {activeTab === 'CERTIFICATES' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-black text-slate-900">
                📜 Galeri Sertifikat Kompetensi
              </h2>
              <p className="text-xs text-slate-500">
                Sertifikat resmi terverifikasi yang diakui dan dapat diverifikasi secara publik online.
              </p>
            </div>

            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center gap-1.5 transition-all self-start sm:self-auto"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Buka Digital CV Anda</span>
            </button>
          </div>

          {dashboardData.certificates.length === 0 ? (
            <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center space-y-2">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-slate-700">Belum ada sertifikat yang diterbitkan.</p>
              <p className="text-xs text-slate-500">Selesaikan kursus Anda dan ikuti ujian sertifikasi untuk mendapatkan sertifikat resmi.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dashboardData.certificates.map(cert => {
                const status = cert.Status;
                const isApproved = status === 'AKTIF' || status === 'Issued' || status === 'DISETUJUI';
                const isPendingVerif = status === 'MENUNGGU_VERIFIKASI';
                const isWaitingPayment = status === 'MENUNGGU_PEMBAYARAN' || status === 'LULUS';
                const isRejected = status === 'DITOLAK';

                return (
                  <div
                    key={cert.CertificateID}
                    className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs space-y-4"
                  >
                    {/* Status Alert */}
                    {isApproved && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-bold">Sertifikat Aktif & Terverifikasi Online</span>
                      </div>
                    )}
                    {isPendingVerif && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
                        <Clock className="w-4 h-4 text-amber-600 shrink-0 animate-spin" />
                        <span className="font-bold">Menunggu Verifikasi Pembayaran Admin</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          ID: {cert.CertificateID}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 leading-snug">{cert.CourseTitle}</h3>
                        <p className="text-xs text-slate-600">Penerima: <strong>{cert.UserName}</strong></p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg inline-block">
                          {cert.FinalScore} / 100
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">{cert.IssueDate || '2026-02-01'}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
                      {isApproved ? (
                        <>
                          <button
                            onClick={() => setActiveCertPreview(cert)}
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview & Cetak</span>
                          </button>
                          <button
                            onClick={() => onNavigate('verify', cert.CertificateID)}
                            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Verifikasi</span>
                          </button>
                        </>
                      ) : (isWaitingPayment || isRejected) ? (
                        <button
                          onClick={() => handleOpenPaymentModal(cert)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2"
                        >
                          <CreditCard className="w-3.5 h-3.5" />
                          <span>Konfirmasi Pembayaran Sertifikat</span>
                        </button>
                      ) : (
                        <div className="w-full py-2 bg-slate-50 text-slate-500 rounded-xl text-center text-xs font-bold">
                          Sedang Diverifikasi Admin
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Presensi & Jadwal Tatap Muka */}
      {activeTab === 'ATTENDANCE' && (
        <div className="space-y-6">
          {/* Live Sessions Manager */}
          <LiveSessionManager userRole="PESERTA" userId={user.UserID} />

          {/* Presensi Check-In Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900">
                  📝 Presensi Kehadiran Belajar
                </h3>
                <p className="text-xs text-slate-500">
                  Catat kehadiran Anda untuk setiap sesi kelas tatap muka atau pengerjaan modul.
                </p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200 text-xs">
                <div className="text-center px-3">
                  <span className="text-[10px] text-slate-400 font-bold block">HADIR</span>
                  <span className="text-sm font-black text-emerald-600">{attendanceStats.hadirCount}</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="text-center px-3">
                  <span className="text-[10px] text-slate-400 font-bold block">IZIN/SAKIT</span>
                  <span className="text-sm font-black text-amber-600">{attendanceStats.izinCount + attendanceStats.sakitCount}</span>
                </div>
                <div className="w-px h-6 bg-slate-200" />
                <div className="text-center px-3">
                  <span className="text-[10px] text-slate-400 font-bold block">REKAP</span>
                  <span className="text-sm font-black text-blue-600">{attendanceStats.percentage}%</span>
                </div>
              </div>
            </div>

            {/* Check-In Form */}
            <form onSubmit={handleStudentCheckIn} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-600" /> Form Input Presensi Harian
              </h4>

              {checkInMessage && (
                <div className={`p-3 rounded-xl text-xs font-bold ${
                  checkInMessage.startsWith('✅') ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-rose-100 text-rose-900 border border-rose-300'
                }`}>
                  {checkInMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Program Kursus *</label>
                  <select
                    value={checkInForm.courseId}
                    onChange={e => setCheckInForm({ ...checkInForm, courseId: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                  >
                    {dashboardData.enrolledCourses.length > 0 ? (
                      dashboardData.enrolledCourses.map(e => (
                        <option key={e.CourseID} value={e.CourseID}>{e.course?.Title || e.CourseID}</option>
                      ))
                    ) : (
                      <option value="CRS-TK01">Teknisi Komputer & Perakitan PC</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Status Kehadiran *</label>
                  <select
                    value={checkInForm.status}
                    onChange={e => setCheckInForm({ ...checkInForm, status: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-bold focus:ring-2 focus:ring-blue-500 text-slate-900"
                  >
                    <option value="Hadir">✅ Hadir Tepat Waktu</option>
                    <option value="Izin">ℹ️ Izin</option>
                    <option value="Sakit">🏥 Sakit</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Keterangan</label>
                  <input
                    type="text"
                    value={checkInForm.notes}
                    onChange={e => setCheckInForm({ ...checkInForm, notes: e.target.value })}
                    placeholder="Contoh: Mengikuti sesi live..."
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmittingCheckIn}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isSubmittingCheckIn ? 'Menyimpan...' : 'Kirim Presensi'}</span>
                </button>
              </div>
            </form>

            {/* Attendance History Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-800">Riwayat Presensi Terbaru</h4>
              {attendanceData.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-2">Belum ada riwayat presensi.</p>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-700 font-extrabold uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Tanggal</th>
                        <th className="p-3">Program</th>
                        <th className="p-3">Waktu</th>
                        <th className="p-3">Status</th>
                        <th className="p-3">Keterangan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attendanceData.slice(0, 5).map((att, idx) => (
                        <tr key={att.AttendanceID || idx} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-slate-700">{att.Date}</td>
                          <td className="p-3 font-semibold text-slate-900">{att.CourseTitle || att.SessionName}</td>
                          <td className="p-3 font-mono text-slate-500">{att.TimeIn} WIB</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              att.Status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                              att.Status === 'Izin' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {att.Status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{att.Notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Rekomendasi Kursus */}
      {activeTab === 'RECOMMENDED' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-slate-900">
                ✨ Rekomendasi Kursus untuk Karir Anda
              </h2>
              <p className="text-xs text-slate-500">
                Tingkatkan kompetensi Anda dengan kursus vokasi yang relevan dengan perkembangan industri.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedCourses.map(c => (
              <CourseCard
                key={c.CourseID}
                course={c}
                onClick={() => onNavigate('course_detail', c.CourseID)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal Payment Confirmation Form */}
      {selectedCertForPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCertForPayment(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase">
                Konfirmasi Pembayaran Sertifikat
              </span>
              <h3 className="text-lg font-black text-slate-900">Formulir Konfirmasi Penerbitan</h3>
              <p className="text-xs text-slate-500">Sertifikat No: {selectedCertForPayment.CertificateID}</p>
            </div>

            <form onSubmit={handleSubmitPaymentConfirmation} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Program Pelatihan / Kursus</label>
                <input
                  type="text"
                  disabled
                  value={selectedCertForPayment.CourseTitle}
                  className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Pemilik Rekening / Pengirim *</label>
                <input
                  type="text"
                  required
                  value={paymentForm.payerName}
                  onChange={e => setPaymentForm({ ...paymentForm, payerName: e.target.value })}
                  placeholder="Contoh: Nama Lengkap Pengirim"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nominal Transfer (Rp) *</label>
                  <input
                    type="number"
                    required
                    value={paymentForm.amount}
                    onChange={e => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tanggal Transfer *</label>
                  <input
                    type="date"
                    required
                    value={paymentForm.transferDate}
                    onChange={e => setPaymentForm({ ...paymentForm, transferDate: e.target.value })}
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank / Metode Pembayaran *</label>
                <select
                  value={paymentForm.bankName}
                  onChange={e => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Bank Mandiri">Bank Mandiri (131002938102 - Alpha Beta Learning Center)</option>
                  <option value="BCA">BCA (8291029381 - Alpha Beta Learning Center)</option>
                  <option value="BRI">BRI (019283012938 - Alpha Beta Learning Center)</option>
                  <option value="BNI">BNI (0918239012 - Alpha Beta Learning Center)</option>
                  <option value="QRIS">QRIS All Payment</option>
                  <option value="GoPay / OVO / Dana">e-Wallet (GoPay / OVO / Dana)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Upload Bukti Transfer *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-all">
                  {paymentForm.proofUrl ? (
                    <div className="space-y-2">
                      <img
                        src={paymentForm.proofUrl}
                        alt="Bukti Transfer"
                        className="max-h-36 mx-auto rounded-xl border border-slate-200 object-cover shadow-xs"
                      />
                      <label className="cursor-pointer text-[11px] font-bold text-blue-600 hover:underline block">
                        Ganti File Bukti Transfer
                        <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                      </label>
                    </div>
                  ) : (
                    <label className="cursor-pointer space-y-2 block">
                      <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                      <span className="text-xs font-bold text-slate-600 block">Klik untuk pilih gambar bukti transfer</span>
                      <span className="text-[10px] text-slate-400 block">Format JPG, PNG (Maks 5MB)</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  value={paymentForm.note}
                  onChange={e => setPaymentForm({ ...paymentForm, note: e.target.value })}
                  placeholder="Tuliskan nomor referensi atau catatan..."
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedCertForPayment(null)}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPayment}
                  className="flex-1 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-md shadow-emerald-600/20"
                >
                  {isSubmittingPayment ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Preview & Print Certificate */}
      {activeCertPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[95vh] overflow-y-auto">
            <button
              onClick={() => setActiveCertPreview(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <CertificateView certificate={activeCertPreview} />
          </div>
        </div>
      )}

      {/* LMS User Guide Modal */}
      {showGuideModal && (
        <LmsGuideModal onClose={() => setShowGuideModal(false)} />
      )}
    </div>
  );
};
