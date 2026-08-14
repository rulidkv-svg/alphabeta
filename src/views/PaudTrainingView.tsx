import React, { useState, useEffect } from 'react';
import {
  Baby,
  BookOpen,
  CheckCircle2,
  Users,
  Clock,
  Award,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Heart,
  Smile,
  ShieldCheck,
  Briefcase,
  HelpCircle,
  FileText,
  Star,
  Send,
  Check,
  Palette,
  Lightbulb,
  Video,
  Play,
  RotateCcw,
  AlertTriangle,
  QrCode,
  Download,
  Printer,
  ExternalLink,
  MessageSquare,
  Lock,
  Unlock,
  CheckSquare,
  Square
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PAUD_PROGRAM_DATA, PaudModuleData } from '../data/paudTrainingData';
import {
  paudStorageService,
  PaudStudentProgress,
  PaudAssignmentSubmission
} from '../services/paudStorageService';
import { PaudQuizModal } from '../components/paud/PaudQuizModal';
import { PaudAssignmentUploader } from '../components/paud/PaudAssignmentUploader';
import { PaudFacilitatorPanel } from '../components/paud/PaudFacilitatorPanel';
import { PaudCertificateModal } from '../components/paud/PaudCertificateModal';

interface PaudTrainingViewProps {
  onNavigate: (view: string, param?: string) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PaudTrainingView: React.FC<PaudTrainingViewProps> = ({
  onNavigate,
  onShowToast
}) => {
  const { user } = useAuth();

  // Active Main Tab: 'lms' | 'overview' | 'facilitator' | 'verify'
  const [activeMainTab, setActiveMainTab] = useState<'lms' | 'overview' | 'facilitator' | 'verify'>('lms');

  // Active module in LMS view (1, 2, 3, 4)
  const [activeModuleNumber, setActiveModuleNumber] = useState<number>(1);

  // Student Progress State
  const currentUserId = user?.UserID || 'GUEST-PAUD-01';
  const currentUserName = user?.Name || 'Peserta Guru PAUD';
  const currentUserEmail = user?.Email || 'guru.paud@alphabeta.edu.eu.org';

  const [progress, setProgress] = useState<PaudStudentProgress>(() =>
    paudStorageService.getStudentProgress(currentUserId, currentUserName, currentUserEmail)
  );

  // Active Quiz Modal
  const [activeQuizModule, setActiveQuizModule] = useState<PaudModuleData | null>(null);

  // Active Certificate Modal
  const [showCertModal, setShowCertModal] = useState<boolean>(false);

  // Quick Registration Form State
  const [regName, setRegName] = useState(user?.Name || '');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState(user?.Email || '');
  const [regInstitution, setRegInstitution] = useState('');
  const [regSchedule, setRegSchedule] = useState('Kelas Sabtu-Minggu (Weekend Workshop)');
  const [regNotes, setRegNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Certificate Quick Verification State
  const [verifyCertInput, setVerifyCertInput] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    searched: boolean;
    valid: boolean;
    certData?: any;
    msg?: string;
  }>({ searched: false, valid: false });

  // Reload progress on user change
  useEffect(() => {
    const loaded = paudStorageService.getStudentProgress(currentUserId, currentUserName, currentUserEmail);
    setProgress(loaded);
  }, [currentUserId, currentUserName, currentUserEmail]);

  // Eligibility check
  const eligibility = paudStorageService.checkGraduationEligibility(progress);

  // Mark Material As Read Handler
  const handleToggleMaterialRead = (moduleId: string) => {
    const isCurrentlyRead = Boolean(progress.readMaterials[moduleId]);
    const updated = { ...progress };
    updated.readMaterials[moduleId] = !isCurrentlyRead;
    paudStorageService.saveStudentProgress(updated);
    setProgress(updated);

    if (!isCurrentlyRead && onShowToast) {
      onShowToast('✅ Materi modul berhasil ditandai selesai dibaca!', 'success');
    }
  };

  // Quiz completion handler
  const handleSaveQuizResult = (score: number, passed: boolean, answers: Record<string, string>) => {
    if (!activeQuizModule) return;
    const updated = paudStorageService.saveQuizResult(
      currentUserId,
      currentUserName,
      activeQuizModule.id,
      score,
      passed,
      answers
    );
    setProgress(updated);

    if (passed && onShowToast) {
      onShowToast(`🎉 Selamat! Anda lulus Kuis Modul ${activeQuizModule.number} dengan skor ${score}!`, 'success');
    }
  };

  // Assignment submission handler
  const handleSaveAssignment = (moduleId: string, moduleNumber: number, title: string, data: Partial<PaudAssignmentSubmission>) => {
    const updated = paudStorageService.submitAssignment(
      currentUserId,
      currentUserName,
      currentUserEmail,
      moduleId,
      moduleNumber,
      title,
      data
    );
    setProgress(updated);
  };

  // Claim Certificate Handler
  const handleClaimCertificate = () => {
    if (!eligibility.eligible) {
      if (onShowToast) {
        onShowToast('Mohon lengkapi seluruh 5 syarat kelulusan sebelum mengklaim sertifikat.', 'error');
      }
      return;
    }

    const updated = paudStorageService.generateCertificate(currentUserId, currentUserName);
    setProgress(updated);
    setShowCertModal(true);

    if (onShowToast) {
      onShowToast('🎉 Selamat! Sertifikat Resmi Guru PAUD Anda telah berhasil diterbitkan!', 'success');
    }
  };

  // Quick Register Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmittedSuccess(true);
      if (onShowToast) {
        onShowToast('🎉 Pendaftaran Pelatihan Guru PAUD Berhasil Dikirim!', 'success');
      }
    }, 800);
  };

  // Verification lookup handler
  const handleVerifyLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyCertInput.trim()) return;

    try {
      const certsRaw = localStorage.getItem('alpha_beta_certificates');
      const certs = certsRaw ? JSON.parse(certsRaw) : [];
      const clean = verifyCertInput.trim().toLowerCase();
      const found = certs.find(
        (c: any) =>
          c.CertificateID?.toLowerCase() === clean ||
          c.CertificateNumber?.toLowerCase() === clean ||
          c.UserName?.toLowerCase().includes(clean)
      );

      if (found) {
        setVerificationResult({
          searched: true,
          valid: true,
          certData: found,
          msg: 'Sertifikat Ditemukan & Terverifikasi Asli oleh Lembaga LPK Alpha Beta.'
        });
      } else {
        setVerificationResult({
          searched: true,
          valid: false,
          msg: 'Nomor Sertifikat tidak terdaftar pada basis data kami. Pastikan format nomor benar (Contoh: CERT/PAUD/2026/089).'
        });
      }
    } catch (e) {
      setVerificationResult({
        searched: true,
        valid: false,
        msg: 'Terjadi kesalahan saat memeriksa data verifikasi.'
      });
    }
  };

  const activeModData = PAUD_PROGRAM_DATA.modules.find(m => m.number === activeModuleNumber) || PAUD_PROGRAM_DATA.modules[0];

  return (
    <div className="space-y-8 pb-16 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-emerald-700 transition-colors">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button onClick={() => onNavigate('courses')} className="hover:text-emerald-700 transition-colors">
          Program Pelatihan
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-emerald-800 font-bold">Pelatihan Guru PAUD</span>
      </nav>

      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden shadow-xl border border-emerald-900">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-400/20 border border-amber-300/30 rounded-full text-xs font-black text-amber-300">
              <Baby className="w-4 h-4 text-amber-300" />
              <span>PROGRAM PELATIHAN GURU PAUD RESMI</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
              {PAUD_PROGRAM_DATA.name}
            </h1>

            <p className="text-sm sm:text-base text-amber-200/90 font-bold italic">
              "{PAUD_PROGRAM_DATA.tagline}"
            </p>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-3xl font-medium">
              {PAUD_PROGRAM_DATA.objective}
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2.5 pt-2 text-xs font-bold text-slate-200">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{PAUD_PROGRAM_DATA.totalDurationJP} JP (4 Modul Lengkap)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Users className="w-4 h-4 text-emerald-300" />
                <span>Guru TK, KB, SPS, TPA & Pendidik Anak Usia Dini</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                <Award className="w-4 h-4 text-teal-300" />
                <span>Sertifikat Digital Resmi Ber-QR Code</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveMainTab('lms')}
                className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 active:scale-95"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Masuk Portal Belajar (LMS Interaktif)</span>
              </button>

              <button
                onClick={() => {
                  setActiveMainTab('overview');
                  setTimeout(() => {
                    document.getElementById('form-pendaftaran-paud')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all"
              >
                Daftar Program / Konsultasi
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 flex justify-center">
            <div className="relative w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-white/20 group">
              <img
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80"
                alt="Pelatihan Guru PAUD Alpha Beta"
                className="w-full h-64 sm:h-72 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent flex items-end p-5">
                <div className="text-white text-xs space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500 text-white font-black text-[10px]">
                    <ShieldCheck className="w-3 h-3" /> Terstandarisasi LPK
                  </div>
                  <p className="font-black text-sm">Pembelajaran Bermakna & Disiplin Positif</p>
                  <p className="text-[11px] text-slate-300">
                    Pelatih: Vita Situ Zulaikha, S.Pd., M.Pd.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation Bar */}
      <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-xs flex flex-wrap gap-2">
        <button
          onClick={() => setActiveMainTab('lms')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'lms'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Portal Belajar & Modul (LMS)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold ml-1">
            {eligibility.overallProgressPercentage}%
          </span>
        </button>

        <button
          onClick={() => setActiveMainTab('overview')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'overview'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Kurikulum & Pendaftaran</span>
        </button>

        <button
          onClick={() => setActiveMainTab('facilitator')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'facilitator'
              ? 'bg-slate-900 text-white shadow-md'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Panel Fasilitator / Penilai</span>
        </button>

        <button
          onClick={() => setActiveMainTab('verify')}
          className={`flex-1 min-w-[160px] py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
            activeMainTab === 'verify'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <QrCode className="w-4 h-4" />
          <span>Verifikasi Sertifikat</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PORTAL BELAJAR & LMS INTERAKTIF */}
      {/* ========================================================================= */}
      {activeMainTab === 'lms' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Graduation Eligibility & Progress Checklist Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                  Status Kelulusan & Progres Belajar Anda
                </span>
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Kemajuan Pembelajaran: {currentUserName}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Total Capaian</p>
                  <p className="text-2xl font-black text-emerald-800">
                    {eligibility.overallProgressPercentage}%
                  </p>
                </div>
                {eligibility.eligible ? (
                  <button
                    onClick={handleClaimCertificate}
                    className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/30 flex items-center gap-2 animate-bounce"
                  >
                    <Award className="w-4 h-4 text-slate-950" />
                    <span>🎉 Klaim & Cetak Sertifikat</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2 rounded-2xl bg-slate-100 text-slate-400 text-xs font-bold flex items-center gap-1.5 cursor-not-allowed"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Sertifikat Terkunci</span>
                  </button>
                )}
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-600">
                <span>Kelengkapan Syarat Sertifikasi (5 Indikator Wajib)</span>
                <span>{eligibility.overallProgressPercentage}% Selesai</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${eligibility.overallProgressPercentage}%` }}
                />
              </div>
            </div>

            {/* 5 Indicator Checklist Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              {/* Item 1: Materials */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  eligibility.checklist.materialsDone
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-[10px] uppercase">1. Materi 4 Modul</span>
                  {eligibility.checklist.materialsDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="font-bold text-slate-900">
                  {eligibility.materialsCompletedCount} / 4 Modul Selesai
                </p>
                <p className="text-[10px] text-slate-500">Wajib membaca semua materi</p>
              </div>

              {/* Item 2: All Quizzes Taken */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  eligibility.checklist.allQuizzesDone
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-[10px] uppercase">2. Pengerjaan Kuis</span>
                  {eligibility.checklist.allQuizzesDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="font-bold text-slate-900">
                  {eligibility.quizzesCompletedCount} / 4 Kuis Dikerjakan
                </p>
                <p className="text-[10px] text-slate-500">10 soal per modul</p>
              </div>

              {/* Item 3: Quiz Passing Grade */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  eligibility.checklist.allQuizzesPassed
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-[10px] uppercase">3. Skor Kuis ≥ 70</span>
                  {eligibility.checklist.allQuizzesPassed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                </div>
                <p className="font-bold text-slate-900">
                  {eligibility.quizzesPassedCount} / 4 Kuis Lulus
                </p>
                <p className="text-[10px] text-slate-500">Standar kelulusan min 70</p>
              </div>

              {/* Item 4: Submissions Submitted */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  eligibility.checklist.allAssignmentsSubmitted
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-[10px] uppercase">4. Pengumpulan Tugas</span>
                  {eligibility.checklist.allAssignmentsSubmitted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="font-bold text-slate-900">
                  {eligibility.assignmentsSubmittedCount} / 4 Tugas Masuk
                </p>
                <p className="text-[10px] text-slate-500">RPPH, APE, Video, Jurnal</p>
              </div>

              {/* Item 5: Submissions Approved */}
              <div
                className={`p-3.5 rounded-2xl border transition-all ${
                  eligibility.checklist.allAssignmentsApproved
                    ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-[10px] uppercase">5. Persetujuan Tugas</span>
                  {eligibility.checklist.allAssignmentsApproved ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </div>
                <p className="font-bold text-slate-900">
                  {eligibility.assignmentsApprovedCount} / 4 Tugas Disetujui
                </p>
                <p className="text-[10px] text-slate-500">Review oleh Fasilitator</p>
              </div>
            </div>
          </div>

          {/* Module Selector Tabs (Materi TIDAK BOLEH DIKUNCI - Semua Bebas Diakses) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Pilih Modul Pembelajaran (Semua Materi Terbuka / Tidak Dikunci):</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PAUD_PROGRAM_DATA.modules.map(mod => {
                const isSelected = activeModuleNumber === mod.number;
                const isMaterialDone = Boolean(progress.readMaterials[mod.id]);
                const quizRes = progress.quizResults[mod.id];
                const assignmentSub = progress.submissions[mod.id];

                return (
                  <button
                    key={mod.id}
                    onClick={() => setActiveModuleNumber(mod.number)}
                    className={`text-left p-4 rounded-3xl border transition-all flex flex-col justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-900 text-white border-emerald-800 shadow-lg shadow-emerald-900/20 ring-2 ring-emerald-500/50'
                        : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            isSelected
                              ? 'bg-amber-400 text-slate-950'
                              : 'bg-emerald-100 text-emerald-900'
                          }`}
                        >
                          Modul {mod.number}
                        </span>
                        <Unlock className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`} />
                      </div>
                      <h4 className="text-xs font-black line-clamp-2 leading-snug">
                        {mod.title}
                      </h4>
                    </div>

                    {/* Mini Status Badges */}
                    <div className="space-y-1 text-[10px] font-bold border-t border-slate-200/40 pt-2">
                      <div className="flex items-center justify-between">
                        <span className={isSelected ? 'text-emerald-200' : 'text-slate-500'}>Materi:</span>
                        <span className={isMaterialDone ? 'text-emerald-400 font-black' : isSelected ? 'text-slate-300' : 'text-slate-400'}>
                          {isMaterialDone ? '✓ Selesai' : 'Belum'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={isSelected ? 'text-emerald-200' : 'text-slate-500'}>Kuis:</span>
                        <span className={quizRes?.passed ? 'text-emerald-400 font-black' : isSelected ? 'text-slate-300' : 'text-slate-400'}>
                          {quizRes?.passed ? `✓ Lulus (${quizRes.score})` : quizRes ? `Ulangi (${quizRes.score})` : 'Belum'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={isSelected ? 'text-emerald-200' : 'text-slate-500'}>Tugas:</span>
                        <span className={assignmentSub?.status === 'Approved' ? 'text-emerald-400 font-black' : assignmentSub ? 'text-amber-300' : isSelected ? 'text-slate-300' : 'text-slate-400'}>
                          {assignmentSub?.status === 'Approved' ? '✓ Disetujui' : assignmentSub?.status || 'Belum'}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Module Details Canvas */}
          <div className="space-y-8">
            {/* Module Hero Bar */}
            <div className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-800 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 bg-amber-400 text-slate-950 rounded-full font-black text-xs uppercase">
                  Modul {activeModData.number}
                </span>
                <span className="text-xs text-emerald-200 font-semibold">
                  Alokasi Waktu: {activeModData.duration}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {activeModData.title}
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed">
                {activeModData.description}
              </p>
            </div>

            {/* 1. TUJUAN PEMBELAJARAN MODUL */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                  1
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Capaian Kompetensi
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Tujuan Pembelajaran Modul {activeModData.number}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeModData.objectives.map((obj, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100/80"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed">{obj}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. MATERI BACAAN LENGKAP & TERSTRUKTUR */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                    2
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      Materi Bacaan Terstruktur
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      {activeModData.readingMaterial.sectionTitle}
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleMaterialRead(activeModData.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
                    progress.readMaterials[activeModData.id]
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {progress.readMaterials[activeModData.id] ? (
                    <>
                      <CheckSquare className="w-4 h-4 text-amber-300" />
                      <span>Materi Selesai Dibaca</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 text-slate-400" />
                      <span>Tandai Selesai Dibaca</span>
                    </>
                  )}
                </button>
              </div>

              {/* Structured Sections A - H / A - K */}
              <div className="space-y-6">
                {activeModData.readingMaterial.sections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="p-5 sm:p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        {sec.letter}
                      </span>
                      <h4 className="text-sm font-black text-slate-900">{sec.title}</h4>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line pl-2">
                      {sec.content}
                    </p>

                    {/* Key points bullets */}
                    {sec.keyPoints && sec.keyPoints.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 space-y-1.5 mt-2">
                        <p className="text-[11px] font-black uppercase tracking-wider text-emerald-800">
                          Poin Inti Penting:
                        </p>
                        <ul className="space-y-1 pl-1">
                          {sec.keyPoints.map((kp, kpIdx) => (
                            <li key={kpIdx} className="text-xs text-slate-600 flex items-start gap-2">
                              <span className="text-emerald-600 font-bold">•</span>
                              <span className="leading-relaxed">{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Practical Tips */}
                    {sec.practicalTips && sec.practicalTips.length > 0 && (
                      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5 mt-2">
                        <p className="text-[11px] font-black uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                          <span>Tips Praktis di Kelas:</span>
                        </p>
                        <ul className="space-y-1 pl-1">
                          {sec.practicalTips.map((tip, tIdx) => (
                            <li key={tIdx} className="text-xs text-amber-950 flex items-start gap-2">
                              <span className="text-amber-600 font-bold">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Real Case Study */}
                    {sec.caseStudy && (
                      <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2 mt-2">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-700" />
                          <span className="font-black text-xs text-emerald-950">
                            {sec.caseStudy.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed italic">
                          "{sec.caseStudy.scenario}"
                        </p>
                        <p className="text-xs text-emerald-900 leading-relaxed font-semibold bg-white/70 p-2.5 rounded-lg border border-emerald-200/50">
                          <strong>💡 Analisis Pembelajaran:</strong> {sec.caseStudy.analysis}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bottom Material Confirmation */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-emerald-950 font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Sudah selesai memahami seluruh materi Modul {activeModData.number}? Lanjutkan ke sesi kuis kompetensi dan tugas praktik.
                  </span>
                </div>
                <button
                  onClick={() => handleToggleMaterialRead(activeModData.id)}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-black shrink-0 transition-all"
                >
                  {progress.readMaterials[activeModData.id]
                    ? '✓ Materi Sudah Ditandai'
                    : 'Tandai Materi Selesai'}
                </button>
              </div>
            </div>

            {/* 3. VIDEO & MEDIA VISUAL */}
            {activeModData.videoMedia && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                    3
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      Media Visual / Video Pendukung
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      {activeModData.videoMedia.title}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-7">
                    <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-video bg-slate-900 group">
                      <img
                        src={activeModData.videoMedia.thumbnailUrl}
                        alt={activeModData.videoMedia.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-xl shadow-emerald-600/40 group-hover:scale-110 transition-transform">
                          <Play className="w-7 h-7 fill-white ml-1" />
                        </div>
                      </div>
                      <span className="absolute bottom-3 right-3 px-2 py-1 bg-slate-950/80 text-white text-[10px] font-bold rounded-md">
                        {activeModData.videoMedia.duration}
                      </span>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-3 text-xs">
                    <span className="px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-black text-[10px] uppercase">
                      Video Praktik Mengajar
                    </span>
                    <h4 className="text-sm font-black text-slate-900">
                      {activeModData.videoMedia.title}
                    </h4>
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {activeModData.videoMedia.description}
                    </p>
                    <div className="pt-1">
                      <a
                        href={activeModData.videoMedia.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                      >
                        <span>Buka video simulasi di jendela baru</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. AKTIVITAS REFLEKSI DIRI GURU */}
            <div className="bg-gradient-to-br from-amber-50 via-amber-50/60 to-emerald-50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs">
                  4
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-900">
                    Aktivitas Refleksi Diri
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Merenungi Praktik Mengajar di Kelas
                  </h3>
                </div>
              </div>

              <div className="p-4 bg-white/90 rounded-2xl border border-amber-200/70 text-xs text-slate-800 leading-relaxed font-medium">
                <p className="italic">"{activeModData.reflectionPrompt}"</p>
              </div>
            </div>

            {/* 5. KUIS KOMPETENSI PILIHAN GANDA (10 SOAL) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                    5
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      Evaluasi Kompetensi (10 Soal Pilihan Ganda)
                    </span>
                    <h3 className="text-sm sm:text-base font-black text-slate-900">
                      {activeModData.quiz.title}
                    </h3>
                  </div>
                </div>

                {/* Current Quiz Status Badge */}
                <div>
                  {progress.quizResults[activeModData.id]?.passed ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 rounded-full font-black text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>LULUS (Skor: {progress.quizResults[activeModData.id].score})</span>
                    </div>
                  ) : progress.quizResults[activeModData.id] ? (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-900 rounded-full font-black text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>BELUM LULUS (Skor: {progress.quizResults[activeModData.id].score})</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-bold text-xs">
                      <span>BELUM DIKERJAKAN</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <p className="font-bold text-slate-800">
                    Standar Kelulusan: <span className="text-emerald-700 font-black">{activeModData.quiz.passingScore} Poin</span> (Benar minimal 7 dari 10 soal)
                  </p>
                  <p className="text-slate-500">
                    {activeModData.quiz.description} Anda dapat mengulang kuis kapan saja.
                  </p>
                </div>

                <button
                  onClick={() => setActiveQuizModule(activeModData)}
                  className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2 shrink-0"
                >
                  <HelpCircle className="w-4 h-4 text-amber-300" />
                  <span>
                    {progress.quizResults[activeModData.id]
                      ? 'Lihat Pembahasan / Ulangi Kuis'
                      : 'Mulai Kuis Modul Ini'}
                  </span>
                </button>
              </div>
            </div>

            {/* 6. TUGAS MANDIRI & PORTOFOLIO */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                  6
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Tugas & Penilaian Portofolio
                  </span>
                  <h3 className="text-sm sm:text-base font-black text-slate-900">
                    Unggah & Penilaian Tugas Modul {activeModData.number}
                  </h3>
                </div>
              </div>

              <PaudAssignmentUploader
                moduleNumber={activeModData.number}
                moduleId={activeModData.id}
                assignment={activeModData.assignment}
                submission={progress.submissions[activeModData.id]}
                onSubmit={data =>
                  handleSaveAssignment(
                    activeModData.id,
                    activeModData.number,
                    activeModData.assignment.title,
                    data
                  )
                }
                onShowToast={onShowToast}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: KURIKULUM LENGKAP & FORM PENDAFTARAN */}
      {/* ========================================================================= */}
      {activeMainTab === 'overview' && (
        <div className="space-y-10 animate-in fade-in">
          {/* KOMPETENSI YANG AKAN DIPEROLEH */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wider">
                Kompetensi Utama Guru PAUD Profesional
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Mampu mengimplementasikan Bermain Bermakna dalam Kurikulum Merdeka PAUD tanpa instruksi kaku.',
                'Kreatif merancang & merakit APE dari bahan daur ulang (Loose Parts) yang aman, murah, dan open-ended.',
                'Menguasai teknik deteksi dini tumbuh kembang (Red Flags) dan observasi objektif tanpa bias.',
                'Terampil membawakan Storytelling interaktif dengan intonasi vokal ekspresif untuk stimulasi bahasa.',
                'Menerapkan Disiplin Positif, regulasi emosi amigdala, validasi perasaan, dan konsekuensi logis tanpa marah.',
                'Mampu berkomunikasi secara empatis dan bermitra dengan orang tua peserta didik secara profesional.'
              ].map((comp, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-slate-800 leading-relaxed">{comp}</p>
                </div>
              ))}
            </div>
          </div>

          {/* MATERI 4 MODUL LENGKAP */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full text-xs font-black uppercase tracking-wider">
                Struktur 4 Modul Utama
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Silabus Lengkap Pelatihan Guru PAUD
              </h2>
              <p className="text-xs text-slate-500">
                Disusun berbasis standar SKKNI Pendidik PAUD, Kurikulum Merdeka Kemendikdasmen, dan praktik pedagogi modern.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PAUD_PROGRAM_DATA.modules.map(mod => (
                <div
                  key={mod.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-black text-xs uppercase">
                        Modul {mod.number}
                      </span>
                      <span className="text-xs text-slate-400 font-bold">{mod.duration}</span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {mod.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <p className="text-[11px] font-black uppercase tracking-wider text-slate-700">
                        Pokok Pembahasan:
                      </p>
                      <ul className="space-y-1 pl-1">
                        {mod.readingMaterial.sections.slice(0, 4).map((sec, sIdx) => (
                          <li key={sIdx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span>{sec.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-bold">
                      Tugas: <strong>{mod.assignment.title}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setActiveModuleNumber(mod.number);
                        setActiveMainTab('lms');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Buka Modul
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* METODE PELATIHAN */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="px-3 py-1 bg-teal-400/20 text-teal-300 border border-teal-300/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                Metode Pembelajaran Holistik
              </span>
              <h2 className="text-xl font-black text-white">Metode Pelatihan Kepaudan</h2>
              <p className="text-xs text-slate-300">
                Kombinasi teori kontekstual, studi kasus nyata, praktik pembuatan media Loose Parts, simulasi storytelling, dan coaching personal.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                'Workshop Interaktif',
                'Pembuatan APE Loose Parts',
                'Simulasi Storytelling Ekspresif',
                'Studi Kasus Tantrum Anak',
                'Refleksi Jurnal Mandiri',
                'Kuis Evaluasi 10 Soal',
                'Feedback Konstruktif Fasilitator',
                'Sertifikasi Digital Ber-QR'
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="p-3.5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 text-center text-xs font-bold text-slate-200 flex flex-col items-center justify-center gap-2"
                >
                  <Lightbulb className="w-5 h-5 text-amber-400" />
                  <span>{m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PROFIL INSTRUKTUR RESMI */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Profil Instruktur & Tim Pakar PAUD LPK Alpha Beta
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PAUD_PROGRAM_DATA.instructors.map((ins, idx) => (
                <div key={idx} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-200">
                  <img
                    src={ins.photo}
                    alt={ins.name}
                    className="w-20 h-20 rounded-2xl object-cover ring-2 ring-emerald-500/30 shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <h4 className="font-black text-slate-900 text-sm">{ins.name}</h4>
                    <p className="text-[11px] text-emerald-700 font-bold">{ins.role}</p>
                    <p className="text-slate-600 leading-relaxed font-normal pt-1">{ins.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ ACCORDION SECTION */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <HelpCircle className="w-5 h-5 text-emerald-600" />
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                Pertanyaan Umum (FAQ) - Pelatihan Guru PAUD
              </h3>
            </div>

            <div className="space-y-2">
              {[
                {
                  q: 'Apakah pelatihan ini terbuka untuk umum dan calon pendidik yang belum memiliki latar belakang S.Pd?',
                  a: 'Ya, program ini dirancang sangat aplikatif dan ramah bagi calon guru PAUD, pengelola kelompok bermain, kader Posyandu/BKB, maupun orang tua yang ingin memahami cara menstimulasi anak usia 3-6 tahun secara tepat.'
                },
                {
                  q: 'Bagaimana syarat kelulusan dan penerbitan sertifikat pelatihan?',
                  a: 'Peserta dinyatakan LULUS apabila telah menyelesaikan 4 materi modul, lulus 4 kuis dengan nilai minimal 70, dan mengumpulkan 4 tugas praktik yang disetujui (Approved) oleh fasilitator. Sertifikat digital resmi ber-QR Code akan terbit secara otomatis.'
                },
                {
                  q: 'Apakah peserta bisa mengulang kuis atau merevisi tugas jika belum mencapai nilai 70?',
                  a: 'Tentu saja. Anda dapat mengulang kuis tanpa batasan hingga mencapai skor 70, dan jika fasilitator meminta revisi tugas, Anda dapat mengunggah dokumen perbaikan dengan mudah.'
                },
                {
                  q: 'Berapa lama akses portal belajar ini berlaku?',
                  a: 'Akses materi, kuis, dan video pembelajaran terbuka tanpa batas waktu (Lifetime Access), sehingga Anda dapat menggunakannya kembali sebagai referensi mengajar kapan saja.'
                }
              ].map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left p-4 bg-slate-50/70 hover:bg-slate-100/80 font-bold text-xs text-slate-800 flex items-center justify-between gap-2"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 text-xs text-slate-600 bg-white border-t border-slate-100 leading-relaxed font-normal">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* FORM PENDAFTARAN KHUSUS KEPAUDAN */}
          <div
            id="form-pendaftaran-paud"
            className="bg-gradient-to-br from-emerald-950 to-teal-950 text-white rounded-3xl p-6 sm:p-10 border border-emerald-900 shadow-xl space-y-6"
          >
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-300/30 rounded-full text-[10px] font-black uppercase tracking-wider">
                Formulir Pendaftaran & Konsultasi
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Daftar Pelatihan Guru PAUD Alpha Beta
              </h2>
              <p className="text-xs text-emerald-100 font-medium">
                Isi formulir di bawah ini untuk mengamankan slot pelatihan, modul materi fisik/digital, dan sertifikat resmi LPK.
              </p>
            </div>

            {submittedSuccess ? (
              <div className="bg-emerald-900/60 border border-emerald-500/50 p-6 sm:p-8 rounded-3xl text-center space-y-3 animate-in fade-in">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto ring-4 ring-emerald-500/10">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white">Pendaftaran Berhasil Dikirim!</h3>
                <p className="text-xs text-emerald-100 max-w-md mx-auto leading-relaxed">
                  Pendaftaran Anda telah tercatat. Tim admin LPK Alpha Beta akan segera menghubungi Anda melalui WhatsApp untuk konfirmasi jadwal dan akun LMS.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => setActiveMainTab('lms')}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all"
                  >
                    Buka Portal LMS Sekarang
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="max-w-2xl mx-auto space-y-4 text-xs font-semibold">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-200 block mb-1">Nama Lengkap Guru / Pendidik *</label>
                    <input
                      type="text"
                      value={regName}
                      onChange={e => setRegName(e.target.value)}
                      placeholder="Contoh: Dra. Ani Wijaya"
                      required
                      className="w-full p-3 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
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
                      className="w-full p-3 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
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
                      className="w-full p-3 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>

                  <div>
                    <label className="text-slate-200 block mb-1">Asal Lembaga / Instansi / Sekolah</label>
                    <input
                      type="text"
                      value={regInstitution}
                      onChange={e => setRegInstitution(e.target.value)}
                      placeholder="Contoh: TK Kartika / PAUD Ceria"
                      className="w-full p-3 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-200 block mb-1">Pilihan Jadwal Workshop *</label>
                    <select
                      value={regSchedule}
                      onChange={e => setRegSchedule(e.target.value)}
                      className="w-full p-3 bg-slate-900 text-white rounded-xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="Kelas Mandiri Online (E-Learning LMS)">Kelas Mandiri Online (E-Learning LMS)</option>
                      <option value="Kelas Sabtu-Minggu (Weekend Workshop)">Kelas Sabtu-Minggu (Weekend Workshop)</option>
                      <option value="Kelas Regular Pagi (Selasa & Kamis)">Kelas Regular Pagi (Selasa & Kamis)</option>
                      <option value="In-House Training (Khusus Lembaga/Gugus PAUD)">In-House Training (Khusus Lembaga/Gugus PAUD)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-slate-200 block mb-1">Keterangan Tambahan</label>
                    <input
                      type="text"
                      value={regNotes}
                      onChange={e => setRegNotes(e.target.value)}
                      placeholder="Harapan / Pertanyaan khusus..."
                      className="w-full p-3 bg-white/10 text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-hidden focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>⏳ Mengirim Pendaftaran...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Kirim Pendaftaran Pelatihan Guru PAUD</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PANEL FASILITATOR & PENILAIAN */}
      {/* ========================================================================= */}
      {activeMainTab === 'facilitator' && (
        <div className="animate-in fade-in">
          <PaudFacilitatorPanel onShowToast={onShowToast} />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: VERIFIKASI KEASLIAN SERTIFIKAT PAUD */}
      {/* ========================================================================= */}
      {activeMainTab === 'verify' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
          <div className="max-w-xl mx-auto text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
              <QrCode className="w-6 h-6" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Verifikasi Sertifikat Pelatihan Guru PAUD
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Masukkan Nomor Registrasi Sertifikat atau Nama Peserta untuk memvalidasi keaslian dokumen kelulusan yang diterbitkan oleh LPK Alpha Beta.
            </p>
          </div>

          <form onSubmit={handleVerifyLookup} className="max-w-xl mx-auto flex gap-2">
            <input
              type="text"
              value={verifyCertInput}
              onChange={e => setVerifyCertInput(e.target.value)}
              placeholder="Contoh: CERT/PAUD/2026/001 atau Nama Peserta..."
              className="flex-1 px-4 py-3 text-xs bg-slate-50 border border-slate-300 rounded-2xl text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-bold"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-black shadow-md shadow-emerald-600/20"
            >
              Cari & Verifikasi
            </button>
          </form>

          {verificationResult.searched && (
            <div className="max-w-xl mx-auto animate-in zoom-in-95">
              {verificationResult.valid ? (
                <div className="p-6 rounded-3xl bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                    <div>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900 text-[10px] font-black uppercase">
                        Dokumen Sah & Terverifikasi
                      </span>
                      <h4 className="text-base font-black text-emerald-950">
                        {verificationResult.certData.UserName}
                      </h4>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs bg-white/80 p-4 rounded-2xl border border-emerald-200/60 font-medium">
                    <p>
                      <strong>Program:</strong> {verificationResult.certData.CourseTitle}
                    </p>
                    <p>
                      <strong>Nomor Sertifikat:</strong>{' '}
                      <span className="font-mono font-bold text-emerald-800">
                        {verificationResult.certData.CertificateNumber}
                      </span>
                    </p>
                    <p>
                      <strong>Tanggal Terbit:</strong> {verificationResult.certData.IssueDate}
                    </p>
                    <p>
                      <strong>Predikat:</strong> {verificationResult.certData.GradePredikat} (Nilai: {verificationResult.certData.FinalScore})
                    </p>
                    <p>
                      <strong>Lembaga Penerbit:</strong> {verificationResult.certData.OrganizationName}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs font-medium space-y-1 text-center">
                  <AlertTriangle className="w-6 h-6 text-rose-600 mx-auto" />
                  <p className="font-bold">{verificationResult.msg}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ACTIVE QUIZ MODAL */}
      {activeQuizModule && (
        <PaudQuizModal
          module={activeQuizModule}
          previousResult={progress.quizResults[activeQuizModule.id]}
          onSaveResult={handleSaveQuizResult}
          onClose={() => setActiveQuizModule(null)}
        />
      )}

      {/* ACTIVE CERTIFICATE MODAL */}
      {showCertModal && progress.certificate && (
        <PaudCertificateModal
          certificate={progress.certificate}
          userName={currentUserName}
          onClose={() => setShowCertModal(false)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
