import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  HeartHandshake,
  Calendar,
  Target,
  NotebookPen,
  CheckCircle2,
  BarChart3,
  User as UserIcon,
  Plus,
  Edit,
  Trash2,
  Search,
  Check,
  X,
  AlertTriangle,
  Clock,
  Sparkles,
  Download,
  Filter,
  CheckSquare,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';
import { User, CoachingRecord, AttendanceRecord } from '../types';
import { useAuth } from '../context/AuthContext';

interface CoachDashboardProps {
  onNavigate: (view: string, param?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CoachDashboardView: React.FC<CoachDashboardProps> = ({ onNavigate, onShowToast }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'monitoring'
    | 'coaching'
    | 'schedule'
    | 'evaluations'
    | 'notes'
    | 'attendance'
    | 'reports'
    | 'profile'
  >('overview');

  const [mentees, setMentees] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Coaching Records
  const [coachingList, setCoachingList] = useState<CoachingRecord[]>([
    {
      CoachingID: 'COACH-001',
      CoachID: 'CCH-001',
      CoachName: 'Ine Yuniar Suryadi, S.Pd.',
      StudentID: 'AB-USER-000201',
      StudentName: 'Bayu Anggoro',
      Date: '2026-08-11',
      Topic: 'Orientasi Kesiapan Kerja & Kedisiplinan Waktu',
      CompetencyScore: 88,
      Notes: 'Peserta sangat antusias, perlu penguatan pada penguasaan istilah teknis hardware.',
      ActionPlan: 'Latihan simulasi wawancara kerja teknisi minggu depan.',
      Status: 'Selesai'
    },
    {
      CoachingID: 'COACH-002',
      CoachID: 'CCH-001',
      CoachName: 'Ine Yuniar Suryadi, S.Pd.',
      StudentID: 'AB-USER-000202',
      StudentName: 'Maya Srikandi',
      Date: '2026-08-12',
      Topic: 'Coaching Karir Admin Jaringan & Portofolio CV',
      CompetencyScore: 94,
      Notes: 'Kemampuan analisis Mikrotik sangat baik, portofolio jaringan siap dipublikasikan.',
      ActionPlan: 'Finalisasi pembuatan Digital CV di portal Alpha Beta.',
      Status: 'Selesai'
    },
    {
      CoachingID: 'COACH-003',
      CoachID: 'CCH-002',
      CoachName: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
      StudentID: 'AB-USER-000203',
      StudentName: 'Fajar Ramadhan',
      Date: '2026-08-14',
      Topic: 'Pendampingan Manajemen Stres & Waktu Belajar',
      CompetencyScore: 80,
      Notes: 'Sempat terlambat mengumpulkan modul 2 karena kendala perangkat.',
      ActionPlan: 'Sesi latihan tambahan di Lab Komputer LPK Alpha Beta.',
      Status: 'Jadwal'
    }
  ]);

  // Mentee Readiness Index Data
  const [readinessData, setReadinessData] = useState<any[]>([
    { id: 'AB-USER-000201', name: 'Bayu Anggoro', course: 'Teknisi Komputer', hardSkill: 85, softSkill: 90, status: 'Siap Kerja', alert: false },
    { id: 'AB-USER-000202', name: 'Maya Srikandi', course: 'Jaringan Komputer', hardSkill: 92, softSkill: 95, status: 'Siap Kerja', alert: false },
    { id: 'AB-USER-000203', name: 'Fajar Ramadhan', course: 'Office Perkantoran', hardSkill: 75, softSkill: 78, status: 'Pendampingan Khusus', alert: true },
    { id: 'AB-USER-000204', name: 'Putri Ayu', course: 'Desain Grafis', hardSkill: 80, softSkill: 88, status: 'Siap Kerja', alert: false }
  ]);

  // Modal New Coaching Session
  const [isCoachingModalOpen, setIsCoachingModalOpen] = useState(false);
  const [newStudentName, setNewStudentName] = useState('Bayu Anggoro');
  const [newTopic, setNewTopic] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newActionPlan, setNewActionPlan] = useState('');

  useEffect(() => {
    const loadMentees = async () => {
      try {
        setLoading(true);
        const users = await apiService.getAdminUsers();
        setMentees(users.filter(u => u.Role === 'PESERTA'));
      } catch (err) {
        console.error('Error loading mentees:', err);
      } finally {
        setLoading(false);
      }
    };
    loadMentees();
  }, []);

  // Unauthenticated Guard
  if (!user) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-5">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-indigo-50/50">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">Portal Pelatih & Pembimbing</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Silakan masuk dengan akun Pelatih Anda untuk memantau kemajuan peserta bimbingan, jadwal konsultasi, dan evaluasi berkala.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all"
          >
            Masuk Akun Pelatih
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  // RBAC Guard
  if (user && user.Role !== 'PELATIH' && user.Role !== 'ADMIN') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 my-8 max-w-xl mx-auto shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-bold text-xl">
          🚫
        </div>
        <h2 className="text-lg font-black text-slate-900">Akses Terbatas (Pelatih/Coach Only)</h2>
        <p className="text-xs text-slate-600">
          Halaman ini khusus untuk Pelatih & Coach Pendamping Alpha Beta Learning Center. Anda saat ini masuk sebagai <strong className="uppercase">{user.Role}</strong>.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handleAddCoaching = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopic.trim()) return;

    const record: CoachingRecord = {
      CoachingID: `COACH-${Date.now().toString().slice(-4)}`,
      CoachID: user?.UserID || 'CCH-001',
      CoachName: user?.Name || 'Ine Yuniar Suryadi, S.Pd.',
      StudentID: 'AB-USER-999',
      StudentName: newStudentName,
      Date: new Date().toISOString().split('T')[0],
      Topic: newTopic,
      CompetencyScore: 85,
      Notes: newNotes,
      ActionPlan: newActionPlan,
      Status: 'Selesai'
    };

    setCoachingList([record, ...coachingList]);
    setIsCoachingModalOpen(false);
    setNewTopic('');
    setNewNotes('');
    setNewActionPlan('');
    onShowToast('🎉 Catatan coaching pendampingan berhasil disimpan!', 'success');
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner Pelatih */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.PhotoURL}
            alt={user?.Name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-500/30 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                👨‍💼 Pelatih & Coach Pendamping
              </span>
              <span className="text-xs text-slate-400">ID Pelatih: {user?.UserID}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">{user?.Name}</h1>
            <p className="text-xs text-slate-300">Bidang Pembinaan: Mentoring Karir, Soft Skills & Kesiapan Kerja Industri</p>
          </div>
        </div>

        <button
          onClick={() => setIsCoachingModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Catat Sesi Coaching
        </button>
      </div>

      {/* Navigasi Tabs Pelatih */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Dashboard Pelatih', icon: LayoutDashboard },
          { id: 'monitoring', label: 'Monitoring Peserta', icon: Users },
          { id: 'coaching', label: 'Pendampingan & Coaching', icon: HeartHandshake },
          { id: 'schedule', label: 'Jadwal Pelatihan', icon: Calendar },
          { id: 'evaluations', label: 'Evaluasi Kompetensi', icon: Target },
          { id: 'notes', label: 'Catatan Pembinaan', icon: NotebookPen },
          { id: 'attendance', label: 'Rekap Kehadiran', icon: CheckCircle2 },
          { id: 'reports', label: 'Laporan Perkembangan', icon: BarChart3 },
          { id: 'profile', label: 'Profil Pelatih', icon: UserIcon }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Peserta Binaan</p>
                <p className="text-xl font-black text-slate-900">{mentees.length || 30}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Coaching Selesai</p>
                <p className="text-xl font-black text-slate-900">24 Sesi</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Indeks Siap Kerja</p>
                <p className="text-xl font-black text-slate-900">89.4%</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Perlu Perhatian</p>
                <p className="text-xl font-black text-slate-900">2 Peserta</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <HeartHandshake className="w-5 h-5 text-indigo-600" />
                  <span>Sesi Coaching Terakhir & Rencana Aksi</span>
                </h3>
                <button
                  onClick={() => setActiveTab('coaching')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Lihat Semua →
                </button>
              </div>

              <div className="space-y-3">
                {coachingList.map(c => (
                  <div key={c.CoachingID} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-black text-xs text-slate-900">{c.StudentName}</span>
                        <p className="text-xs font-bold text-indigo-900">{c.Topic}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.Status === 'Selesai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.Status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">Catatan: {c.Notes}</p>
                    <div className="p-2.5 bg-indigo-50/80 rounded-xl text-[11px] text-indigo-950 font-semibold border border-indigo-100">
                      🎯 Rencana Aksi: {c.ActionPlan}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <span>Peringatan Pembinaan Peserta</span>
              </h3>
              <div className="space-y-3 text-xs">
                {readinessData.filter(r => r.alert).map(r => (
                  <div key={r.id} className="p-3 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                    <p className="font-extrabold text-amber-900">{r.name}</p>
                    <p className="text-slate-600">Kelas: {r.course}</p>
                    <p className="text-amber-800 font-bold text-[11px]">⚠️ Perlu sesi pendampingan khusus hard skill.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONITORING PESERTA */}
      {activeTab === 'monitoring' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Monitoring Peserta & Status Kesiapan Kerja</h2>
            <p className="text-xs text-slate-500">Pantau keseimbangan hard skill dan soft skill peserta binaan secara langsung</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {readinessData.map(r => (
              <div key={r.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-black text-sm text-slate-900">{r.name}</h3>
                    <p className="text-xs text-slate-500">{r.course}</p>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                    r.status === 'Siap Kerja' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {r.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>Hard Skills (Teknis)</span>
                      <span>{r.hardSkill}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-600 h-full rounded-full" style={{ width: `${r.hardSkill}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>Soft Skills & Sikap Kerja</span>
                      <span>{r.softSkill}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${r.softSkill}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PENDAMPINGAN DAN COACHING */}
      {activeTab === 'coaching' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Sesi Pendampingan & Coaching</h2>
              <p className="text-xs text-slate-500">Jadwal dan riwayat pendampingan 1-on-1 maupun kelompok</p>
            </div>
            <button
              onClick={() => setIsCoachingModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
            >
              + Buat Sesi Coaching
            </button>
          </div>

          <div className="space-y-4">
            {coachingList.map(c => (
              <div key={c.CoachingID} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-black text-sm text-slate-900">{c.StudentName}</span>
                  <span className="text-xs text-slate-500 font-bold">{c.Date}</span>
                </div>
                <p className="text-xs font-bold text-indigo-900">{c.Topic}</p>
                <p className="text-xs text-slate-600">{c.Notes}</p>
                <p className="text-xs text-emerald-800 font-bold bg-emerald-50 p-2 rounded-xl">
                  Action Plan: {c.ActionPlan}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: JADWAL PELATIHAN */}
      {activeTab === 'schedule' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Jadwal Sesi Pembinaan & Mentoring</h2>
            <p className="text-xs text-slate-500">Kalender agenda pendampingan rutin dan workshop kesiapan kerja</p>
          </div>

          <div className="space-y-3">
            {[
              { time: 'Rabu, 13 Ags 2026 (09.00 - 10.30)', topic: 'Coaching Portofolio CV & Simulasi Interview', room: 'Ruang Counseling 1' },
              { time: 'Jumat, 15 Ags 2026 (13.00 - 15.00)', topic: 'Workshop Etika Komunikasi & Kerja Tim Vokasi', room: 'Aula Utama LPK' }
            ].map((sch, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex justify-between items-center text-xs">
                <div>
                  <span className="text-[10px] font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                    {sch.time}
                  </span>
                  <p className="font-extrabold text-slate-900 mt-1">{sch.topic}</p>
                  <p className="text-slate-500">{sch.room}</p>
                </div>
                <button onClick={() => onShowToast('Jadwal ditambahkan ke Google Calendar', 'info')} className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-800 font-bold">
                  Ingatkan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EVALUASI KOMPETENSI */}
      {activeTab === 'evaluations' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Evaluasi Rubrik Kompetensi Peserta</h2>
            <p className="text-xs text-slate-500">Penilaian komprehensif aspek Kedisiplinan, Problem Solving, dan Soft Skills</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 text-xs space-y-1">
            <p className="font-bold text-indigo-900">📋 Rubrik Standar Pembinaan LPK Alpha Beta:</p>
            <p className="text-indigo-800">1. Kedisiplinan Kehadiran (25%) | 2. Kemampuan Pemecahan Masalah (35%) | 3. Kerjasama Tim & Etika (40%)</p>
          </div>
        </div>
      )}

      {/* TAB 6: CATATAN PEMBINAAN */}
      {activeTab === 'notes' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Jurnal & Catatan Pembinaan Harian</h2>
            <p className="text-xs text-slate-500">Rekam jejak perkembangan karakter dan kemajuan peserta setiap minggu</p>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs space-y-1">
              <span className="text-[10px] text-slate-400 font-bold">10 Agustus 2026</span>
              <p className="font-bold text-slate-900">Catatan Mingguan: Bayu Anggoro</p>
              <p className="text-slate-600">Progres perakitan PC meningkat pesat. Sudah dapat mendiagnosa beep code tanpa panduan modul.</p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: REKAP KEHADIRAN */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Rekap Kehadiran Sesi Pembinaan</h2>
            <p className="text-xs text-slate-500">Tingkat partisipasi peserta dalam sesi coaching and mentoring</p>
          </div>

          <div className="text-xs text-slate-600">
            <p>Rata-rata kehadiran seluruh peserta binaan: <strong className="text-emerald-600 font-extrabold">96.5%</strong></p>
          </div>
        </div>
      )}

      {/* TAB 8: LAPORAN PERKEMBANGAN */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Laporan Perkembangan Kesiapan Kerja</h2>
            <p className="text-xs text-slate-500">Ringkasan grafik dan metrik kesiapan penyaluran kerja lulusan</p>
          </div>

          <button
            onClick={() => onShowToast('📄 Laporan Perkembangan berhasil diunduh dalam format PDF', 'success')}
            className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Unduh Laporan PDF
          </button>
        </div>
      )}

      {/* TAB 9: PROFIL PELATIH */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Profil & Pengalaman Pelatih
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img src={user?.PhotoURL} alt={user?.Name} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-indigo-500/20" />
            <div className="space-y-1 text-xs">
              <p className="text-lg font-black text-slate-900">{user?.Name}</p>
              <p className="text-indigo-600 font-bold">Pelatih & Coach Pendamping LPK Alpha Beta</p>
              <p className="text-slate-500">Email: {user?.Email} | Telp: {user?.Phone}</p>
              <p className="text-slate-600 pt-2">{user?.Bio || 'Pelatih vokasi bersertifikatBNSP spesialis pengembangan SDM Siap Kerja.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Coaching Session Modal */}
      {isCoachingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm">Catat Sesi Coaching Pendampingan</h3>
              <button onClick={() => setIsCoachingModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCoaching} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 block mb-1">Nama Peserta *</label>
                <select
                  value={newStudentName}
                  onChange={e => setNewStudentName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Bayu Anggoro">Bayu Anggoro (Teknisi Komputer)</option>
                  <option value="Maya Srikandi">Maya Srikandi (Jaringan Komputer)</option>
                  <option value="Fajar Ramadhan">Fajar Ramadhan (Office Perkantoran)</option>
                  <option value="Putri Ayu">Putri Ayu (Desain Grafis)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Topik Sesi Coaching *</label>
                <input
                  type="text"
                  value={newTopic}
                  onChange={e => setNewTopic(e.target.value)}
                  placeholder="Contoh: Evaluasi Softskills & Persiapan Interview"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Catatan Pembinaan *</label>
                <textarea
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  rows={2}
                  placeholder="Catatan hasil diskusi..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Rencana Aksi (Action Plan) *</label>
                <textarea
                  value={newActionPlan}
                  onChange={e => setNewActionPlan(e.target.value)}
                  rows={2}
                  placeholder="Rencana tindak lanjut peserta..."
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCoachingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                >
                  Simpan Coaching
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
