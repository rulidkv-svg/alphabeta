import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  FileCheck,
  UserCheck,
  MessageSquare,
  TrendingUp,
  Award,
  User as UserIcon,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  Check,
  X,
  AlertCircle,
  Upload,
  Send,
  Star,
  Download,
  Filter,
  ShieldCheck,
  Users
} from 'lucide-react';
import { apiService } from '../services/api';
import { Course, User, Module, Assignment, AssignmentSubmission, AttendanceRecord, Category } from '../types';
import { useAuth } from '../context/AuthContext';
import { LiveSessionManager } from '../components/lms/LiveSessionManager';
import { GraduationRulesConfigModal } from '../components/lms/GraduationRulesConfigModal';
import { Video, Settings } from 'lucide-react';

interface InstructorDashboardProps {
  onNavigate: (view: string, param?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const InstructorDashboardView: React.FC<InstructorDashboardProps> = ({ onNavigate, onShowToast }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'classes'
    | 'live_meeting'
    | 'materi'
    | 'assignments'
    | 'attendance'
    | 'forum'
    | 'progress'
    | 'certificates'
    | 'profile'
  >('overview');

  const [selectedCourseForRules, setSelectedCourseForRules] = useState<Course | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<User[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassId, setSelectedClassId] = useState<string>('all');

  // Assignment Grading State
  const [submissions, setSubmissions] = useState<any[]>([
    {
      id: 'SUB-001',
      studentName: 'Bayu Anggoro',
      courseTitle: 'Teknisi Komputer & Perakitan PC',
      assignmentTitle: 'Tugas Praktik 1: Diagnosa Kerusakan RAM',
      submittedAt: '2026-08-10 14:30',
      status: 'Belum Dinilai',
      score: 0,
      notes: ''
    },
    {
      id: 'SUB-002',
      studentName: 'Maya Srikandi',
      courseTitle: 'Administrator Jaringan Komputer',
      assignmentTitle: 'Lab Mikrotik: Routing OSPF & Bandwidth Management',
      submittedAt: '2026-08-11 09:15',
      status: 'Sudah Dinilai',
      score: 92,
      notes: 'Konfigurasi sangat rapi dan lengkap.'
    },
    {
      id: 'SUB-003',
      studentName: 'Fajar Ramadhan',
      courseTitle: 'Mastering Microsoft Office',
      assignmentTitle: 'Proyek Akhir Excel: VLOOKUP & PivotTable Financial',
      submittedAt: '2026-08-11 16:45',
      status: 'Belum Dinilai',
      score: 0,
      notes: ''
    }
  ]);

  // Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { AttendanceID: 'ATT-001', SessionID: 'SES-01', SessionName: 'Pertemuan 1 - Pengenalan Hardware', UserID: 'AB-USER-000201', UserName: 'Bayu Anggoro', Date: '2026-08-10', Status: 'Hadir' },
    { AttendanceID: 'ATT-002', SessionID: 'SES-01', SessionName: 'Pertemuan 1 - Pengenalan Hardware', UserID: 'AB-USER-000202', UserName: 'Maya Srikandi', Date: '2026-08-10', Status: 'Hadir' },
    { AttendanceID: 'ATT-003', SessionID: 'SES-01', SessionName: 'Pertemuan 1 - Pengenalan Hardware', UserID: 'AB-USER-000203', UserName: 'Fajar Ramadhan', Date: '2026-08-10', Status: 'Izin', Notes: 'Sakit flu' },
    { AttendanceID: 'ATT-004', SessionID: 'SES-01', SessionName: 'Pertemuan 1 - Pengenalan Hardware', UserID: 'AB-USER-000204', UserName: 'Putri Ayu', Date: '2026-08-10', Status: 'Hadir' }
  ]);

  // Forum Threads
  const [forumThreads, setForumThreads] = useState<any[]>([
    {
      id: 'TH-01',
      title: 'Bagaimana cara mengatasi Beep Code 3x pada Motherboard ASUS?',
      author: 'Bayu Anggoro',
      date: '2 jam lalu',
      replies: 4,
      category: 'Teknisi Komputer',
      resolved: false,
      answers: [
        { author: 'Roni Nuroni, S.T., MCE (Instruktur)', text: 'Beep 3x pendek pada AMI BIOS menandakan masalah pada 64KB RAM pertama. Coba lepas dan bersihkan pin RAM menggunakan penghapus pensil bersih.', isInstructor: true }
      ]
    },
    {
      id: 'TH-02',
      title: 'Perbedaan Static Routing dan OSPF pada Router Board Mikrotik?',
      author: 'Maya Srikandi',
      date: 'Kemarin',
      replies: 2,
      category: 'Jaringan Komputer',
      resolved: true,
      answers: []
    }
  ]);

  // Grading Modal State
  const [gradingModalSub, setGradingModalSub] = useState<any | null>(null);
  const [inputScore, setInputScore] = useState<number>(85);
  const [inputNotes, setInputNotes] = useState<string>('');

  // Course Add/Edit Modal
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategoryID, setNewCourseCategoryID] = useState('CAT-001');
  const [newCourseSubcategory, setNewCourseSubcategory] = useState('');
  const [newCourseDuration, setNewCourseDuration] = useState('24 Jam (8 Sesi)');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [cList, uList, catList] = await Promise.all([
          apiService.getCourses(),
          apiService.getAdminUsers(),
          apiService.getCategories()
        ]);
        setCourses(cList);
        setStudents(uList.filter(u => u.Role === 'PESERTA'));
        setCategoriesList(catList);
        if (catList.length > 0 && catList[0].Subcategories?.length) {
          setNewCourseSubcategory(catList[0].Subcategories[0]);
        }
        if (cList.length > 0) {
          const detail = await apiService.getCourseDetail(cList[0].CourseID);
          setModules(detail.modules || []);
        }
      } catch (err) {
        console.error('Error loading instructor data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Unauthenticated Guard
  if (!user) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-5">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">Portal Instruktur & Pengajar</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Silakan masuk dengan akun Instruktur Anda untuk mengelola kurikulum materi, tugas peserta, presensi kelas, dan sertifikasi.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all"
          >
            Masuk Akun Instruktur
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

  // RBAC Guard Check
  if (user && user.Role !== 'INSTRUKTUR' && user.Role !== 'ADMIN') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 my-8 max-w-xl mx-auto shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-bold text-xl">
          🚫
        </div>
        <h2 className="text-lg font-black text-slate-900">Akses Terbatas (Instruktur Only)</h2>
        <p className="text-xs text-slate-600">
          Halaman ini khusus untuk Instruktur Alpha Beta Learning Center. Anda saat ini masuk sebagai <strong className="uppercase">{user.Role}</strong>.
        </p>
        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingModalSub) return;

    setSubmissions(prev =>
      prev.map(s =>
        s.id === gradingModalSub.id
          ? { ...s, score: inputScore, notes: inputNotes, status: 'Sudah Dinilai' }
          : s
      )
    );
    setGradingModalSub(null);
    onShowToast(`✅ Nilai ${inputScore} berhasil disimpan untuk ${gradingModalSub.studentName}`, 'success');
  };

  const handleMarkAttendance = (id: string, status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa') => {
    setAttendanceRecords(prev =>
      prev.map(a => (a.AttendanceID === id ? { ...a, Status: status } : a))
    );
    onShowToast(`✅ Presensi diperbarui menjadi ${status}`, 'success');
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;

    const catObj = categoriesList.find(c => c.CategoryID === newCourseCategoryID);

    const created: Course = {
      CourseID: `CRS-INS-${Date.now().toString().slice(-4)}`,
      Title: newCourseTitle,
      CategoryID: newCourseCategoryID,
      CategoryName: catObj?.Name || 'Komputer & Teknologi',
      Subcategory: newCourseSubcategory || 'Umum',
      Description: `Modul pelatihan baru yang diampu oleh ${user?.Name || 'Belum ditentukan'}.`,
      InstructorID: user?.UserID || 'INS-001',
      InstructorName: user?.Name || 'Belum ditentukan',
      Thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      Duration: newCourseDuration,
      Level: 'Pemula',
      Price: 0,
      Rating: 5.0,
      EnrolledCount: 0,
      Status: 'Published',
      HasCertificate: true,
      WhatYouWillLearn: ['Keterampilan Dasar', 'Praktik Simulator', 'Sertifikasi Siap Kerja'],
      Prerequisites: ['Dasar Komputer'],
      CreatedAt: new Date().toISOString()
    };

    setCourses([created, ...courses]);
    apiService.saveCourse(created).catch(err => console.error('Save course error:', err));
    setIsCourseModalOpen(false);
    setNewCourseTitle('');
    onShowToast('🎉 Kelas pelatihan baru berhasil ditambahkan!', 'success');
  };

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner Instruktur */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.PhotoURL}
            alt={user?.Name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-amber-500/30 shadow-lg"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30">
                👨‍🏫 Instruktur LPK
              </span>
              <span className="text-xs text-slate-400">NIP/ID: {user?.UserID}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black">{user?.Name}</h1>
            <p className="text-xs text-slate-300">Bidang Pengajaran: {user?.Skills?.join(', ') || 'Hardware & Networking'}</p>
          </div>
        </div>

        <button
          onClick={() => setIsCourseModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Tambah Kelas Baru
        </button>
      </div>

      {/* Navigasi Tabs Instruktur */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Dashboard Instruktur', icon: LayoutDashboard },
          { id: 'classes', label: 'Kelola Kelas', icon: BookOpen },
          { id: 'live_meeting', label: 'Tatap Muka Daring (Meet/Zoom)', icon: Video },
          { id: 'materi', label: 'Kelola Materi Pembelajaran', icon: FileText },
          { id: 'assignments', label: 'Kelola Tugas & Penilaian', icon: FileCheck },
          { id: 'attendance', label: 'Presensi Peserta', icon: UserCheck },
          { id: 'forum', label: 'Forum Diskusi', icon: MessageSquare },
          { id: 'progress', label: 'Laporan Kemajuan Peserta', icon: TrendingUp },
          { id: 'certificates', label: 'Sertifikat Peserta', icon: Award },
          { id: 'profile', label: 'Profil Instruktur', icon: UserIcon }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-amber-600 text-white shadow-md'
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
          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Kelas Diajar</p>
                <p className="text-xl font-black text-slate-900">{courses.length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Peserta</p>
                <p className="text-xl font-black text-slate-900">{students.length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold">
                <FileCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Perlu Dinilai</p>
                <p className="text-xl font-black text-slate-900">
                  {submissions.filter(s => s.status === 'Belum Dinilai').length}
                </p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Lulus Ujian</p>
                <p className="text-xl font-black text-slate-900">30</p>
              </div>
            </div>
          </div>

          {/* Quick Tasks & Submissions Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-black text-base text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-600" />
                  <span>Tugas Peserta Perlu Penilaian</span>
                </h3>
                <button
                  onClick={() => setActiveTab('assignments')}
                  className="text-xs font-bold text-amber-600 hover:text-amber-700"
                >
                  Kelola Semua →
                </button>
              </div>

              <div className="space-y-3">
                {submissions.filter(s => s.status === 'Belum Dinilai').map(sub => (
                  <div key={sub.id} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-slate-900">{sub.studentName}</span>
                        <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                          {sub.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-amber-900">{sub.assignmentTitle}</p>
                      <p className="text-[10px] text-slate-500">Dikirim: {sub.submittedAt} | Kelas: {sub.courseTitle}</p>
                    </div>

                    <button
                      onClick={() => setGradingModalSub(sub)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 shadow-xs"
                    >
                      Buka & Beri Nilai
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-black text-base text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Jadwal Sesi Hari Ini</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                    09.00 - 11.00 WIB
                  </span>
                  <p className="font-extrabold text-slate-900">Praktik Perakitan Motherboard & Processor</p>
                  <p className="text-slate-500 text-[11px]">Ruang Lab Hardware / PC Simulator</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    13.30 - 15.30 WIB
                  </span>
                  <p className="font-extrabold text-slate-900">Lab Mikrotik & Routing Basic</p>
                  <p className="text-slate-500 text-[11px]">Ruang Jaringan Komputer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: KELOLA KELAS */}
      {activeTab === 'classes' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Kelola Kelas Pelatihan</h2>
              <p className="text-xs text-slate-500">Kelola informasi kelas, kapasitas peserta, dan status publikasi</p>
            </div>
            <button
              onClick={() => setIsCourseModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Tambah Kelas
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map(course => (
              <div key={course.CourseID} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-white transition-all space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-md">
                      {course.CategoryName || course.Category}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-1">{course.Title}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {course.Status}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>Durasi: {course.Duration} | Level: {course.Level}</p>
                  <p>Jumlah Peserta Terdaftar: <strong>{course.EnrolledCount} Peserta</strong></p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/80 text-xs font-semibold">
                  <button
                    onClick={() => onNavigate('course_detail', course.CourseID)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => onNavigate('learning', course.CourseID)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-colors"
                  >
                    Buka Ruang Modul
                  </button>
                  <button
                    onClick={() => setSelectedCourseForRules(course)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold transition-colors ml-auto flex items-center gap-1"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>Syarat Kelulusan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: TATAP MUKA DARING (GOOGLE MEET / ZOOM) */}
      {activeTab === 'live_meeting' && (
        <LiveSessionManager
          userRole="INSTRUKTUR"
          userId={user?.UserID}
          onShowToast={onShowToast}
        />
      )}

      {/* TAB 3: KELOLA MATERI PEMBELAJARAN */}
      {activeTab === 'materi' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Kelola Materi Pembelajaran</h2>
              <p className="text-xs text-slate-500">Upload dan atur struktur modul, video, dan latihan simulator</p>
            </div>
            <button
              onClick={() => onShowToast('📌 Fitur unggah modul baru siap digunakan', 'info')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2"
            >
              <Upload className="w-4 h-4" /> Unggah Modul Baru
            </button>
          </div>

          <div className="space-y-4">
            {modules.map((mod, idx) => (
              <div key={mod.ModuleID} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900">{mod.Title}</h3>
                  </div>
                  <span className="text-xs text-slate-500 font-semibold">{mod.Lessons?.length || 0} Aktivitas</span>
                </div>
                <p className="text-xs text-slate-600">{mod.Description}</p>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => onShowToast(`Modul ${mod.Title} diperbarui`, 'success')}
                    className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Modul
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: KELOLA TUGAS DAN PENILAIAN */}
      {activeTab === 'assignments' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Kelola Tugas dan Penilaian</h2>
            <p className="text-xs text-slate-500">Periksa hasil pekerjaan peserta, beri skor dan masukan masukan konstruktif</p>
          </div>

          <div className="space-y-3">
            {submissions.map(sub => (
              <div key={sub.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-slate-900">{sub.studentName}</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                      sub.status === 'Sudah Dinilai' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800">{sub.assignmentTitle}</p>
                  <p className="text-[11px] text-slate-500">Kelas: {sub.courseTitle} | Dikirim: {sub.submittedAt}</p>
                  {sub.status === 'Sudah Dinilai' && (
                    <p className="text-xs text-emerald-700 font-bold">
                      Nilai: {sub.score}/100 {sub.notes ? `— "${sub.notes}"` : ''}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => {
                    setInputScore(sub.score || 85);
                    setInputNotes(sub.notes || '');
                    setGradingModalSub(sub);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0"
                >
                  {sub.status === 'Sudah Dinilai' ? 'Edit Nilai' : 'Beri Nilai'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: PRESENSI PESERTA */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Presensi Kehadiran Peserta</h2>
            <p className="text-xs text-slate-500">Catat dan rekap kehadiran peserta pada setiap sesi tatap muka & lab</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 font-extrabold text-slate-700 uppercase tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Nama Peserta</th>
                  <th className="p-3">Sesi Pelatihan</th>
                  <th className="p-3">Tanggal</th>
                  <th className="p-3">Status Presence</th>
                  <th className="p-3 rounded-r-xl">Aksi Presensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {attendanceRecords.map(rec => (
                  <tr key={rec.AttendanceID} className="hover:bg-slate-50/80">
                    <td className="p-3 font-extrabold text-slate-900">{rec.UserName}</td>
                    <td className="p-3 text-slate-600">{rec.SessionName}</td>
                    <td className="p-3 text-slate-500">{rec.Date}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                        rec.Status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                        rec.Status === 'Izin' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {rec.Status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {(['Hadir', 'Izin', 'Sakit', 'Alpa'] as const).map(st => (
                          <button
                            key={st}
                            onClick={() => handleMarkAttendance(rec.AttendanceID, st)}
                            className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                              rec.Status === st ? 'bg-amber-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: FORUM DISKUSI */}
      {activeTab === 'forum' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Forum Diskusi & Tanya Jawab</h2>
            <p className="text-xs text-slate-500">Jawab pertanyaan peserta dan fasilitasi diskusi seputar materi pelatihan</p>
          </div>

          <div className="space-y-4">
            {forumThreads.map(th => (
              <div key={th.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {th.category}
                    </span>
                    <h3 className="font-extrabold text-sm text-slate-900 mt-1">{th.title}</h3>
                    <p className="text-[11px] text-slate-500">Oleh: {th.author} | {th.date}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    th.resolved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {th.resolved ? 'Terjawab' : 'Perlu Balasan'}
                  </span>
                </div>

                {th.answers.map((ans: any, i: number) => (
                  <div key={i} className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-1">
                    <p className="font-extrabold text-amber-900">{ans.author}</p>
                    <p className="text-slate-800">{ans.text}</p>
                  </div>
                ))}

                <button
                  onClick={() => onNavigate('forum')}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
                >
                  Buka Diskusi Lengkap
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: LAPORAN KEMAJUAN PESERTA */}
      {activeTab === 'progress' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Laporan Kemajuan Peserta</h2>
            <p className="text-xs text-slate-500">Pantau progres pengerjaan modul dan persentase kelulusan kelas</p>
          </div>

          <div className="space-y-3">
            {students.slice(0, 8).map(st => (
              <div key={st.UserID} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-extrabold text-sm flex items-center justify-center">
                    {st.Name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-slate-900">{st.Name}</p>
                    <p className="text-xs text-slate-500">{st.Email} | NIS: {st.UserID}</p>
                  </div>
                </div>

                <div className="w-32 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div className="bg-amber-600 h-full rounded-full" style={{ width: `${(st.XP || 500) / 20}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: SERTIFIKAT PESERTA */}
      {activeTab === 'certificates' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Verifikasi & Penerbitan Sertifikat</h2>
            <p className="text-xs text-slate-500">Rekomendasikan kelulusan peserta untuk penerbitan sertifikat resmi berlisensi NISN & VIN</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-2">
            <p className="font-bold text-amber-900">ℹ️ Alur Penerbitan Sertifikat Instruktur:</p>
            <p className="text-amber-800">
              Instruktur memberikan verifikasi kelulusan nilai akhir peserta (Min. Score: 80). Setelah diverifikasi, sertifikat digital dengan QR Code akan otomatis terbit.
            </p>
          </div>
        </div>
      )}

      {/* TAB 9: PROFIL INSTRUKTUR */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3">
            Profil & Biodata Instruktur
          </h2>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img src={user?.PhotoURL} alt={user?.Name} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-amber-500/20" />
            <div className="space-y-1 text-xs">
              <p className="text-lg font-black text-slate-900">{user?.Name}</p>
              <p className="text-amber-600 font-bold">Instruktur LPK Alpha Beta</p>
              <p className="text-slate-500">Email: {user?.Email} | Telp: {user?.Phone}</p>
              <p className="text-slate-600 pt-2">{user?.Bio || 'Instruktur profesional berpengalaman pengajaran vokasi & industri.'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grading Modal */}
      {gradingModalSub && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm">Penilaian Tugas Peserta</h3>
              <button onClick={() => setGradingModalSub(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1 text-xs">
              <p className="text-slate-500">Nama Peserta: <strong className="text-slate-900">{gradingModalSub.studentName}</strong></p>
              <p className="text-slate-500">Judul Tugas: <strong className="text-slate-900">{gradingModalSub.assignmentTitle}</strong></p>
            </div>

            <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-slate-700 block mb-1">Skor Nilai (0 - 100) *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={inputScore}
                  onChange={e => setInputScore(Number(e.target.value))}
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Catatan & Masukan Instruktur</label>
                <textarea
                  value={inputNotes}
                  onChange={e => setInputNotes(e.target.value)}
                  rows={3}
                  placeholder="Beri catatan hasil pekerjaan..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setGradingModalSub(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Simpan Nilai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Course Modal */}
      {isCourseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm">Tambah Kelas Pelatihan Baru</h3>
              <button onClick={() => setIsCourseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCourse} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 block mb-1">Judul Kelas Pelatihan *</label>
                <input
                  type="text"
                  value={newCourseTitle}
                  onChange={e => setNewCourseTitle(e.target.value)}
                  placeholder="Contoh: Praktik Trouble Shooting Komputer Advanced"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Kategori Utama Pelatihan *</label>
                <select
                  value={newCourseCategoryID}
                  onChange={e => {
                    const catId = e.target.value;
                    setNewCourseCategoryID(catId);
                    const selectedCat = categoriesList.find(c => c.CategoryID === catId);
                    if (selectedCat && selectedCat.Subcategories && selectedCat.Subcategories.length > 0) {
                      setNewCourseSubcategory(selectedCat.Subcategories[0]);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  {categoriesList.map(cat => (
                    <option key={cat.CategoryID} value={cat.CategoryID}>
                      {cat.Name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Subkategori Spesialisasi *</label>
                {(() => {
                  const currentCat = categoriesList.find(c => c.CategoryID === newCourseCategoryID);
                  const subcats = currentCat?.Subcategories || [];
                  return (
                    <div className="space-y-2">
                      <select
                        value={newCourseSubcategory}
                        onChange={e => setNewCourseSubcategory(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-semibold bg-blue-50/50 text-blue-900"
                      >
                        {subcats.map((sub, i) => (
                          <option key={i} value={sub}>{sub}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={newCourseSubcategory}
                        onChange={e => setNewCourseSubcategory(e.target.value)}
                        placeholder="Atau ketik subkategori khusus..."
                        className="w-full p-2 rounded-xl border border-slate-200 text-slate-700 text-xs"
                      />
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Durasi Pelatihan *</label>
                <input
                  type="text"
                  value={newCourseDuration}
                  onChange={e => setNewCourseDuration(e.target.value)}
                  placeholder="24 Jam (8 Sesi)"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCourseModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Graduation Rules Config Modal */}
      {selectedCourseForRules && (
        <GraduationRulesConfigModal
          courseId={selectedCourseForRules.CourseID}
          courseTitle={selectedCourseForRules.Title}
          onClose={() => setSelectedCourseForRules(null)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
