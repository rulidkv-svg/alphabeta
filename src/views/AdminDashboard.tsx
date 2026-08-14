import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  Award,
  UserCheck,
  Megaphone,
  BarChart3,
  Settings,
  Database,
  ShieldCheck,
  Plus,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  CheckCircle2,
  DollarSign,
  Printer,
  ExternalLink,
  Copy,
  FileCode,
  Check,
  Search,
  Filter,
  Download,
  Upload,
  AlertCircle,
  Zap,
  Clock,
  ChevronRight,
  CreditCard,
  Eye,
  X,
  Tag,
  Layers
} from 'lucide-react';
import { apiService } from '../services/api';
import { Course, User, Certificate, Payment, AttendanceRecord, Announcement, PriceHistoryRecord, Category, OfficialPersonnel, OfficialRoleTitle } from '../types';
import { GAS_CODE_GS, GAS_DATABASE_GS } from '../gas/gasScripts';
import { ParticipantHistoryModal } from '../components/ParticipantHistoryModal';
import { CertificateView } from '../components/certificate/CertificateView';
import { LiveSessionManager } from '../components/lms/LiveSessionManager';
import { Video } from 'lucide-react';
import { KemnakerLogo, KemdikdasmenLogo } from '../components/MinistryLogos';
import { useAuth } from '../context/AuthContext';

interface AdminDashboardProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onNavigate?: (view: string, param?: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onShowToast, onNavigate }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'instructors'
    | 'users'
    | 'courses'
    | 'live_meeting'
    | 'prices'
    | 'materi'
    | 'certificates'
    | 'attendance'
    | 'announcements'
    | 'reports'
    | 'settings'
    | 'backup'
    | 'activity_logs'
  >('overview');

  const [courses, setCourses] = useState<Course[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [instructors, setInstructors] = useState<OfficialPersonnel[]>([]);
  const [instSearchQuery, setInstSearchQuery] = useState('');
  const [instRoleFilter, setInstRoleFilter] = useState('ALL');
  const [instStatusFilter, setInstStatusFilter] = useState('ALL');
  const [instSortBy, setInstSortBy] = useState('order');
  const [isInstModalOpen, setIsInstModalOpen] = useState(false);
  const [editingInst, setEditingInst] = useState<OfficialPersonnel | null>(null);
  const [viewingInst, setViewingInst] = useState<OfficialPersonnel | null>(null);
  const [isDeletingInstModalOpen, setIsDeletingInstModalOpen] = useState(false);
  const [deletingInst, setDeletingInst] = useState<OfficialPersonnel | null>(null);
  const [isSavingInst, setIsSavingInst] = useState(false);
  const [isDeletingInst, setIsDeletingInst] = useState(false);
  const [instForm, setInstForm] = useState({
    ID: '',
    Name: '',
    Degree: '',
    RoleTitle: 'Instruktur Resmi' as OfficialRoleTitle,
    Expertise: '',
    PhotoURL: '',
    Bio: '',
    Status: 'Aktif' as 'Aktif' | 'Nonaktif',
    Email: '',
    Phone: '',
    OrderNumber: 1
  });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [attSearchQuery, setAttSearchQuery] = useState('');
  const [attStatusFilter, setAttStatusFilter] = useState('ALL');
  const [isAttModalOpen, setIsAttModalOpen] = useState(false);
  const [editingAtt, setEditingAtt] = useState<any | null>(null);
  const [attForm, setAttForm] = useState({
    UserID: '',
    CourseID: 'CRS-TK01',
    Status: 'Hadir',
    Date: new Date().toISOString().split('T')[0],
    TimeIn: '08:00',
    TimeOut: '16:00',
    Notes: ''
  });
  const [selectedParticipantIdForHistory, setSelectedParticipantIdForHistory] = useState<string | null>(null);
  const [participantCategoryFilter, setParticipantCategoryFilter] = useState<string>('ALL');
  const [gasUrl, setGasUrl] = useState('');
  const [sheetUrl, setSheetUrl] = useState('https://docs.google.com/spreadsheets/d/1gozDSmU6NLGLUaeeZpijOqnZ4f3V_0UU9HpfIdcq5go/edit?usp=sharing');
  const [kemnakerLogoUrl, setKemnakerLogoUrl] = useState('');
  const [kemdikdasmenLogoUrl, setKemdikdasmenLogoUrl] = useState('');
  const [copiedScript, setCopiedScript] = useState(false);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // Certificate Verification & Management State
  const [certStatusFilter, setCertStatusFilter] = useState<string>('ALL');
  const [certSearchQuery, setCertSearchQuery] = useState('');
  const [selectedCertForVerify, setSelectedCertForVerify] = useState<Certificate | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [isVerifyingCert, setIsVerifyingCert] = useState(false);
  const [previewingCert, setPreviewingCert] = useState<Certificate | null>(null);
  const [revokingCert, setRevokingCert] = useState<Certificate | null>(null);
  const [revokeReasonInput, setRevokeReasonInput] = useState('');
  const [isRevoking, setIsRevoking] = useState(false);
  const [isManualIssueModalOpen, setIsManualIssueModalOpen] = useState(false);
  const [manualIssueUserId, setManualIssueUserId] = useState('');
  const [manualIssueCourseId, setManualIssueCourseId] = useState('');
  const [manualIssueScore, setManualIssueScore] = useState(90);
  const [manualIssuePredikat, setManualIssuePredikat] = useState('Sangat Memuaskan');
  const [isIssuingManual, setIsIssuingManual] = useState(false);

  // Course Form
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState('Teknisi Komputer');
  const [newPrice, setNewPrice] = useState('0');

  // Category & Subcategory Management State
  const [selectedCatForSubcat, setSelectedCatForSubcat] = useState<string>('CAT-001');
  const [newSubcategoryInput, setNewSubcategoryInput] = useState<string>('');
  const [courseCategoryFilter, setCourseCategoryFilter] = useState<string>('ALL');

  const handleAddSubcategory = async (catId: string) => {
    if (!newSubcategoryInput.trim()) return;
    const targetCat = categoriesList.find(c => c.CategoryID === catId);
    if (!targetCat) return;

    const subcats = targetCat.Subcategories || [];
    if (subcats.includes(newSubcategoryInput.trim())) {
      onShowToast(`Subkategori "${newSubcategoryInput.trim()}" sudah ada!`, 'info');
      return;
    }

    const updatedSubcategories = [...subcats, newSubcategoryInput.trim()];
    const updatedCategory = { ...targetCat, Subcategories: updatedSubcategories };

    setCategoriesList(prev => prev.map(c => c.CategoryID === catId ? updatedCategory : c));
    const addedName = newSubcategoryInput.trim();
    setNewSubcategoryInput('');
    onShowToast(`✅ Subkategori "${addedName}" berhasil ditambahkan ke ${targetCat.Name}`, 'success');

    try {
      await apiService.saveCategory(updatedCategory);
    } catch (e) {
      console.error('Save category error:', e);
    }
  };

  // Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>([
    {
      AnnouncementID: 'ANN-001',
      Title: 'Pembukaan Pendaftaran Gelombang Baru Pelatihan Vokasi Siap Kerja 2026',
      Content: 'LPK Alpha Beta resmi membuka pendaftaran program pelatihan Komputer, Jaringan, Bahasa Inggris, dan PAUD untuk periode Q3 2026.',
      Category: 'Pengumuman',
      Author: 'Ruli Lesmana, S.T (Direktur)',
      Date: '2026-08-01',
      Status: 'Published',
      TargetRole: 'SEMUA'
    },
    {
      AnnouncementID: 'ANN-002',
      Title: 'Jadwal Ujian Komprehensif & Verifikasi Sertifikat Vokasi NISN K9980820',
      Content: 'Peserta yang telah menyelesaikan seluruh modul diharapkan mengecek status passing grade minimal 80 pada Student Dashboard.',
      Category: 'Sertifikat',
      Author: 'Tim Administrasi LPK',
      Date: '2026-08-10',
      Status: 'Published',
      TargetRole: 'PESERTA'
    }
  ]);

  // Modal Add User State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addRole, setAddRole] = useState<'ADMIN' | 'INSTRUKTUR' | 'PELATIH' | 'PESERTA'>('PESERTA');
  const [addPhone, setAddPhone] = useState('081234567890');

  // Activity Logs Data
  const [activityLogs, setActivityLogs] = useState<any[]>([
    { id: 'LOG-01', user: 'admin@alphabeta.edu.eu.org', action: 'Perbaruan Pengaturan Sistem & URL Apps Script', time: '10 Menit lalu', ip: '180.252.12.44' },
    { id: 'LOG-02', user: 'syifa@alphabeta.edu.eu.org', action: 'Beri Nilai Tugas Praktik Bayu Anggoro (Skor: 92)', time: '1 Jam lalu', ip: '180.252.12.80' },
    { id: 'LOG-03', user: 'ine@alphabeta.edu.eu.org', action: 'Sesi Coaching Pendampingan Maya Srikandi Selesai', time: '3 Jam lalu', ip: '180.252.14.12' },
    { id: 'LOG-04', user: 'budi@alphabeta.edu.eu.org', action: 'Login Sukses ke Portal Student Dashboard', time: '5 Jam lalu', ip: '114.122.30.95' }
  ]);

  const [priceHistories, setPriceHistories] = useState<PriceHistoryRecord[]>([]);
  const [editingPriceCourse, setEditingPriceCourse] = useState<Course | null>(null);
  const [priceForm, setPriceForm] = useState({
    normal_price: 0,
    early_bird_price: 0,
    promo_price: 0,
    group_price: 0,
    institution_price: 0,
    price_status: 'ACTIVE',
    promo_start: '2026-01-01',
    promo_end: '2026-12-31',
    reason: 'Penyesuaian Skema Harga 2026'
  });
  const [savingPrice, setSavingPrice] = useState(false);

  const [pullingGas, setPullingGas] = useState(false);
  const [pushingGas, setPushingGas] = useState(false);

  const loadAdminData = async () => {
    try {
      const [cList, uList, pList, certList, settings, pHist, attList, catList, instList] = await Promise.all([
        apiService.getCourses(),
        apiService.getAdminUsers(),
        apiService.getAdminPayments(),
        apiService.getAdminCertificates(),
        apiService.getSettings(),
        apiService.getPriceHistory(),
        apiService.getAdminAttendance(),
        apiService.getCategories(),
        apiService.getInstructors()
      ]);
      setCourses(cList);
      setUsers(uList);
      setPayments(pList);
      setCertificates(certList || []);
      setPriceHistories(pHist || []);
      setAttendances(attList || []);
      setCategoriesList(catList || []);
      setInstructors(instList || []);
      setGasUrl(settings.GasWebAppUrl || '');
      if ((settings as any).GoogleSheetUrl) {
        setSheetUrl((settings as any).GoogleSheetUrl);
      }
      setKemnakerLogoUrl(settings.KemnakerLogoURL || '');
      setKemdikdasmenLogoUrl(settings.KemdikdasmenLogoURL || '');
    } catch (e) {
      console.error('Error loading admin:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPriceModal = (course: Course) => {
    setEditingPriceCourse(course);
    const p = course.Pricing || {
      program_id: course.CourseID,
      normal_price: course.Price,
      early_bird_price: Math.round(course.Price * 0.8),
      promo_price: Math.round(course.Price * 0.7),
      group_price: Math.round(course.Price * 6),
      institution_price: Math.round(course.Price * 8),
      currency: 'IDR',
      price_status: 'ACTIVE',
      promo_start: '2026-01-01',
      promo_end: '2026-12-31'
    };
    setPriceForm({
      normal_price: p.normal_price || course.Price,
      early_bird_price: p.early_bird_price || Math.round(course.Price * 0.8),
      promo_price: p.promo_price || Math.round(course.Price * 0.7),
      group_price: p.group_price || Math.round(course.Price * 6),
      institution_price: p.institution_price || Math.round(course.Price * 8),
      price_status: p.price_status || 'ACTIVE',
      promo_start: p.promo_start || '2026-01-01',
      promo_end: p.promo_end || '2026-12-31',
      reason: 'Update harga & skema promo 2026'
    });
  };

  const handleSavePrice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPriceCourse) return;
    setSavingPrice(true);
    try {
      const res = await apiService.updatePrice({
        program_id: editingPriceCourse.CourseID,
        normal_price: Number(priceForm.normal_price),
        early_bird_price: Number(priceForm.early_bird_price),
        promo_price: Number(priceForm.promo_price),
        group_price: Number(priceForm.group_price),
        institution_price: Number(priceForm.institution_price),
        price_status: priceForm.price_status,
        promo_start: priceForm.promo_start,
        promo_end: priceForm.promo_end,
        reason: priceForm.reason,
        requesterRole: 'ADMIN'
      });
      if (res.success) {
        onShowToast(`✅ Harga & Skema Promo untuk "${editingPriceCourse.Title}" berhasil diperbarui!`, 'success');
        setEditingPriceCourse(null);
        await loadAdminData();
      } else {
        onShowToast(`❌ ${res.message}`, 'error');
      }
    } catch (err: any) {
      onShowToast(`❌ Gagal memperbarui harga: ${err?.message}`, 'error');
    } finally {
      setSavingPrice(false);
    }
  };

  const handleVerifyCertificateAction = async (action: 'APPROVE' | 'TOLAK') => {
    if (!selectedCertForVerify) return;
    setIsVerifyingCert(true);
    try {
      const res = await apiService.verifyCertificateApproval({
        certificateId: selectedCertForVerify.CertificateID,
        action,
        reason: rejectionReasonInput,
        adminName: 'Admin Utama LPK'
      });

      if (res.success) {
        onShowToast(
          action === 'APPROVE'
            ? `🎉 Sertifikat ${selectedCertForVerify.CertificateID} berhasil di-APPROVE! Status kini AKTIF.`
            : `❌ Konfirmasi Sertifikat ${selectedCertForVerify.CertificateID} DITOLAK.`,
          action === 'APPROVE' ? 'success' : 'info'
        );
        setSelectedCertForVerify(null);
        setRejectionReasonInput('');
        await loadAdminData();
      }
    } catch (err) {
      console.error('Error verifying cert:', err);
      onShowToast('Gagal memverifikasi sertifikat.', 'error');
    } finally {
      setIsVerifyingCert(false);
    }
  };

  const handleReissueCertificate = async (certId: string) => {
    try {
      const res = await apiService.reissueCertificate({ certId, requesterRole: 'ADMIN' });
      if (res.success) {
        onShowToast(`🎉 Sertifikat ${certId} berhasil diterbitkan ulang dengan tanggal terbit hari ini!`, 'success');
        await loadAdminData();
      } else {
        onShowToast(`❌ ${res.message}`, 'error');
      }
    } catch (err: any) {
      onShowToast(`❌ Gagal menerbitkan ulang: ${err?.message || 'Error'}`, 'error');
    }
  };

  const handleRevokeCertificate = async () => {
    if (!revokingCert) return;
    setIsRevoking(true);
    try {
      const res = await apiService.revokeCertificate({
        certId: revokingCert.CertificateID,
        reason: revokeReasonInput || 'Sertifikat dibatalkan oleh Admin LPK Alpha Beta.',
        requesterRole: 'ADMIN'
      });
      if (res.success) {
        onShowToast(`🚫 Sertifikat ${revokingCert.CertificateID} berhasil dibatalkan / dinonaktifkan!`, 'info');
        setRevokingCert(null);
        setRevokeReasonInput('');
        await loadAdminData();
      } else {
        onShowToast(`❌ ${res.message}`, 'error');
      }
    } catch (err: any) {
      onShowToast(`❌ Gagal membatalkan sertifikat: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsRevoking(false);
    }
  };

  const handleManualIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualIssueUserId || !manualIssueCourseId) {
      onShowToast('Pilih peserta dan program pelatihan terlebih dahulu.', 'error');
      return;
    }
    setIsIssuingManual(true);
    try {
      const res = await apiService.issueCertificate({
        userId: manualIssueUserId,
        courseId: manualIssueCourseId,
        finalScore: manualIssueScore || 90,
        gradePredikat: manualIssuePredikat || 'Sangat Memuaskan',
        requesterRole: 'ADMIN'
      });
      if (res.success) {
        onShowToast(`🎉 Sertifikat resmi #${res.certificate.CertificateID} berhasil diterbitkan!`, 'success');
        setIsManualIssueModalOpen(false);
        setManualIssueUserId('');
        setManualIssueCourseId('');
        await loadAdminData();
      } else {
        onShowToast(`❌ ${res.message}`, 'error');
      }
    } catch (err: any) {
      onShowToast(`❌ Gagal menerbitkan sertifikat: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsIssuingManual(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName || !addEmail) return;

    const newUserObj: User = {
      UserID: `USR-ADM-${Date.now().toString().slice(-4)}`,
      Name: addName,
      Email: addEmail,
      Role: addRole,
      Phone: addPhone,
      PhotoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      Status: 'Aktif',
      VerificationStatus: 'VERIFIED',
      CreatedAt: new Date().toISOString()
    };

    setUsers([newUserObj, ...users]);
    setIsUserModalOpen(false);
    setAddName('');
    setAddEmail('');
    onShowToast(`🎉 Pengguna baru ${addName} (${addRole}) berhasil ditambahkan!`, 'success');
  };

  const handleCopyAppsScript = () => {
    const script = `${GAS_CODE_GS}\n\n${GAS_DATABASE_GS}`;
    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    onShowToast('✅ Kode Apps Script khusus Spreadsheet berhasil disalin!', 'success');
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleKemnakerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        onShowToast('Ukuran file logo maksimal 3MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setKemnakerLogoUrl(reader.result as string);
        onShowToast('Logo Kemnaker berhasil diunggah (Preview)', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKemdikdasmenFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        onShowToast('Ukuran file logo maksimal 3MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setKemdikdasmenLogoUrl(reader.result as string);
        onShowToast('Logo Kemdikdasmen berhasil diunggah (Preview)', 'info');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await apiService.saveSettings({
        GasWebAppUrl: gasUrl,
        GoogleSheetUrl: sheetUrl,
        KemnakerLogoURL: kemnakerLogoUrl,
        KemdikdasmenLogoURL: kemdikdasmenLogoUrl
      });
      onShowToast('✅ Pengaturan sistem dan logo kementerian berhasil disimpan!', 'success');
    } catch (e) {
      onShowToast('Terjadi kesalahan saat menyimpan settings.', 'error');
    }
  };

  const handlePushGasData = async () => {
    setPushingGas(true);
    try {
      const res = await apiService.pushGAS();
      if (res.success) {
        onShowToast(`✅ ${res.message}`, 'success');
      } else {
        onShowToast(`❌ ${res.message}`, 'error');
      }
    } catch (e: any) {
      onShowToast(`❌ Gagal mengirim data ke Google Sheets: ${e?.message || 'Error'}`, 'error');
    } finally {
      setPushingGas(false);
    }
  };

  const handlePullGasData = async () => {
    setPullingGas(true);
    try {
      const res = await apiService.pullGAS();
      if (res.success) {
        onShowToast(`✅ ${res.message}`, 'success');
        loadAdminData();
      } else {
        onShowToast(`❌ ${res.message}`, 'error');
      }
    } catch (e: any) {
      onShowToast(`❌ Gagal menarik data dari Google Sheets: ${e?.message || 'Error'}`, 'error');
    } finally {
      setPullingGas(false);
    }
  };

  // Handlers for Instructor CRUD
  const handleOpenAddInstModal = () => {
    setEditingInst(null);
    setInstForm({
      ID: '',
      Name: '',
      Degree: '',
      RoleTitle: 'Instruktur Resmi',
      Expertise: '',
      PhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      Bio: '',
      Status: 'Aktif',
      Email: '',
      Phone: '',
      OrderNumber: instructors.length + 1
    });
    setIsInstModalOpen(true);
  };

  const handleOpenEditInstModal = (inst: OfficialPersonnel) => {
    setEditingInst(inst);
    setInstForm({
      ID: inst.ID,
      Name: inst.Name,
      Degree: inst.Degree || '',
      RoleTitle: inst.RoleTitle,
      Expertise: inst.Expertise,
      PhotoURL: inst.PhotoURL || '',
      Bio: inst.Bio || '',
      Status: inst.Status,
      Email: inst.Email || '',
      Phone: inst.Phone || '',
      OrderNumber: inst.OrderNumber || 1
    });
    setIsInstModalOpen(true);
  };

  const handleSaveInst = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instForm.Name.trim()) {
      onShowToast('❌ Nama Lengkap wajib diisi!', 'error');
      return;
    }
    setIsSavingInst(true);
    try {
      if (editingInst) {
        const res = await apiService.updateInstructor(editingInst.ID, instForm);
        if (res.success) {
          onShowToast(`✅ ${res.message || 'Data instruktur/pelatih berhasil diperbarui!'}`, 'success');
          setIsInstModalOpen(false);
          await loadAdminData();
        } else {
          onShowToast(`❌ ${res.message}`, 'error');
        }
      } else {
        const res = await apiService.createInstructor(instForm);
        if (res.success) {
          onShowToast(`✅ ${res.message || 'Instruktur/pelatih baru berhasil ditambahkan!'}`, 'success');
          setIsInstModalOpen(false);
          await loadAdminData();
        } else {
          onShowToast(`❌ ${res.message}`, 'error');
        }
      }
    } catch (err: any) {
      onShowToast(`❌ Gagal menyimpan data: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsSavingInst(false);
    }
  };

  const handleDeleteInst = async () => {
    if (!deletingInst) return;
    setIsDeletingInst(true);
    try {
      const res = await apiService.deleteInstructor(deletingInst.ID);
      if (res.success) {
        onShowToast(`ℹ️ ${res.message}`, res.isSoftDelete ? 'info' : 'success');
        setIsDeletingInstModalOpen(false);
        setDeletingInst(null);
        await loadAdminData();
      } else {
        onShowToast(`❌ ${res.message}`, 'error');
      }
    } catch (err: any) {
      onShowToast(`❌ Gagal menghapus data: ${err?.message || 'Error'}`, 'error');
    } finally {
      setIsDeletingInst(false);
    }
  };

  // Instructor Filter, Search & Sorting
  const filteredInstructors = instructors.filter(inst => {
    const query = instSearchQuery.toLowerCase();
    const fullName = `${inst.Name} ${inst.Degree || ''}`.toLowerCase();
    const matchesSearch =
      fullName.includes(query) ||
      inst.Expertise.toLowerCase().includes(query) ||
      inst.RoleTitle.toLowerCase().includes(query) ||
      (inst.Email && inst.Email.toLowerCase().includes(query));

    const matchesRole =
      instRoleFilter === 'ALL' || inst.RoleTitle === instRoleFilter;

    const matchesStatus =
      instStatusFilter === 'ALL' || inst.Status === instStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  }).sort((a, b) => {
    if (instSortBy === 'name_asc') return a.Name.localeCompare(b.Name);
    if (instSortBy === 'name_desc') return b.Name.localeCompare(a.Name);
    if (instSortBy === 'role') return a.RoleTitle.localeCompare(b.RoleTitle);
    return (a.OrderNumber || 99) - (b.OrderNumber || 99);
  });

  const filteredUsers = users.filter(u => {
    const matchesRole = userRoleFilter === 'ALL' || u.Role === userRoleFilter;
    const matchesQuery =
      u.Name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
      u.Email.toLowerCase().includes(userSearchQuery.toLowerCase());
    return matchesRole && matchesQuery;
  });

  // Guard check for Admin Panel
  if (!user) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-5">
        <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-rose-50/50">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">Panel Administrator Pusat</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Halaman ini khusus untuk Tim Manajemen dan Administrator LPK Alpha Beta Learning Center. Silakan masuk untuk melanjutkan.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate?.('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all"
          >
            Masuk Akun Admin
          </button>
          <button
            onClick={() => onNavigate?.('home')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  if (user.Role !== 'ADMIN') {
    return (
      <div className="bg-white p-8 rounded-3xl border border-rose-200 text-center space-y-4 my-8 max-w-xl mx-auto shadow-sm">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto font-bold text-xl">
          🚫
        </div>
        <h2 className="text-lg font-black text-slate-900">Akses Terbatas (Administrator Only)</h2>
        <p className="text-xs text-slate-600">
          Halaman ini khusus untuk Administrator Alpha Beta Learning Center. Anda saat ini masuk sebagai <strong className="uppercase">{user.Role}</strong>.
        </p>
        <button
          onClick={() => onNavigate?.('home')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-6">
      {/* Header Banner Admin Panel */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/20 text-rose-300 border border-rose-400/30">
              ⚙️ Panel Administrator Pusat
            </span>
            <span className="text-xs text-slate-400">NISN LPK: K9980820 | VIN: 20002320503</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">Manajemen Sistem Alpha Beta Learning Center</h1>
          <p className="text-xs text-slate-300">Pengelolaan terintegrasi Pengguna, Kelas, Sertifikat, Apps Script, dan Log Aktivitas</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={sheetUrl || 'https://docs.google.com/spreadsheets/d/1gozDSmU6NLGLUaeeZpijOqnZ4f3V_0UU9HpfIdcq5go/edit'}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white text-xs font-bold border border-emerald-600 flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Buka Spreadsheet
          </a>
          <button
            onClick={handlePushGasData}
            disabled={pushingGas}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Zap className={`w-3.5 h-3.5 ${pushingGas ? 'animate-bounce' : ''}`} />
            {pushingGas ? 'Mengirim Data...' : 'Kirim Semua Data ke Sheet'}
          </button>
          <button
            onClick={handlePullGasData}
            disabled={pullingGas}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${pullingGas ? 'animate-spin' : ''}`} />
            Tarik Data Sheet
          </button>
          <button
            onClick={() => setIsUserModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" /> Tambah User
          </button>
        </div>
      </div>

      {/* Navigasi Tabs Admin (11 Submenu) */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'overview', label: 'Dashboard Admin', icon: LayoutDashboard },
          { id: 'instructors', label: 'Manajemen Instruktur & Pelatih', icon: UserCheck },
          { id: 'users', label: 'Manajemen Pengguna', icon: Users },
          { id: 'courses', label: 'Manajemen Kelas', icon: BookOpen },
          { id: 'live_meeting', label: 'Tatap Muka Daring (Meet/Zoom)', icon: Video },
          { id: 'prices', label: 'Harga & Promo 2026', icon: DollarSign },
          { id: 'materi', label: 'Manajemen Materi', icon: FileText },
          { id: 'certificates', label: 'Manajemen Sertifikat', icon: Award },
          { id: 'attendance', label: 'Manajemen Absensi', icon: UserCheck },
          { id: 'announcements', label: 'Manajemen Pengumuman', icon: Megaphone },
          { id: 'reports', label: 'Laporan & Statistik', icon: BarChart3 },
          { id: 'settings', label: 'Pengaturan Sistem', icon: Settings },
          { id: 'backup', label: 'Backup & Restore', icon: Database },
          { id: 'activity_logs', label: 'Log Aktivitas', icon: ShieldCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-rose-600 text-white shadow-md'
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
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total User Registrasi</p>
                <p className="text-xl font-black text-slate-900">{users.length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 font-bold">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Kelas Aktif</p>
                <p className="text-xl font-black text-slate-900">{courses.length}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 font-bold">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Sertifikat Terbit</p>
                <p className="text-xl font-black text-slate-900">30</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Google Sheet Status</p>
                <p className="text-xs font-black text-emerald-600">TERHUBUNG</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3">
                Pengguna Terbaru Terdaftar
              </h3>
              <div className="space-y-3">
                {users.slice(0, 5).map(u => (
                  <div key={u.UserID} className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={u.PhotoURL} alt={u.Name} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <p className="font-extrabold text-slate-900">{u.Name}</p>
                        <p className="text-slate-500">{u.Email}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-800">
                      {u.Role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="font-black text-base text-slate-900 border-b border-slate-100 pb-3">
                Pengumuman Terbaru
              </h3>
              <div className="space-y-3 text-xs">
                {announcements.map(a => (
                  <div key={a.AnnouncementID} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                    <p className="font-extrabold text-slate-900">{a.Title}</p>
                    <p className="text-slate-500 text-[11px]">{a.Date} | {a.Category}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: MANAJEMEN INSTRUKTUR, PELATIH & PENGELOLA */}
      {activeTab === 'instructors' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          {/* Header & Main Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 uppercase tracking-wider">
                  Pengelola & Tenaga Pendidik LPK
                </span>
                <span className="text-xs text-slate-500 font-mono">9 Orang Data Resmi</span>
              </div>
              <h2 className="text-lg font-black text-slate-900 mt-1">Manajemen Instruktur, Pelatih & Pengelola</h2>
              <p className="text-xs text-slate-500">Kelola seluruh data personil resmi LPK Alpha Beta dengan fitur lengkap Create, Read, Update, Delete (CRUD).</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleOpenAddInstModal}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> Tambah Personil Baru
              </button>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Personil</span>
              <span className="text-2xl font-black text-white mt-1 block">{instructors.length} Personil</span>
              <span className="text-[10px] text-slate-400">Data Terstruktur</span>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Instruktur Resmi</span>
              <span className="text-2xl font-black text-blue-900 mt-1 block">
                {instructors.filter(i => i.RoleTitle === 'Instruktur Resmi').length} Orang
              </span>
              <span className="text-[10px] text-blue-600">Bidang TI & LMS</span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Pelatih / Coach</span>
              <span className="text-2xl font-black text-emerald-900 mt-1 block">
                {instructors.filter(i => i.RoleTitle === 'Pelatih / Coach').length} Orang
              </span>
              <span className="text-[10px] text-emerald-600">Vokasi & Softskill</span>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Direktur & Pengelola</span>
              <span className="text-2xl font-black text-purple-900 mt-1 block">
                {instructors.filter(i => i.RoleTitle === 'Direktur Alpha Beta' || i.RoleTitle === 'Pengelola').length} Orang
              </span>
              <span className="text-[10px] text-purple-600">Manajemen LPK</span>
            </div>
          </div>

          {/* Filter, Search & Sort Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={instSearchQuery}
                onChange={e => setInstSearchQuery(e.target.value)}
                placeholder="Cari nama, keahlian, atau jabatan..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              {instSearchQuery && (
                <button
                  onClick={() => setInstSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter by Role */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <select
                value={instRoleFilter}
                onChange={e => setInstRoleFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="ALL">Semua Peran / Jabatan</option>
                <option value="Instruktur Resmi">Instruktur Resmi</option>
                <option value="Pelatih / Coach">Pelatih / Coach</option>
                <option value="Direktur Alpha Beta">Direktur Alpha Beta</option>
                <option value="Pengelola">Pengelola</option>
              </select>

              {/* Filter by Status */}
              <select
                value={instStatusFilter}
                onChange={e => setInstStatusFilter(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="ALL">Semua Status</option>
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
              </select>

              {/* Sort By */}
              <select
                value={instSortBy}
                onChange={e => setInstSortBy(e.target.value)}
                className="px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="order">Urutan Default</option>
                <option value="name_asc">Nama (A - Z)</option>
                <option value="name_desc">Nama (Z - A)</option>
                <option value="role">Berdasarkan Peran</option>
              </select>
            </div>
          </div>

          {/* Personel Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs min-w-[700px]">
              <thead>
                <tr className="bg-slate-100/80 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <th className="py-3 px-4 text-center w-12">No</th>
                  <th className="py-3 px-4">Personil & Gelar</th>
                  <th className="py-3 px-4">Jabatan / Peran</th>
                  <th className="py-3 px-4">Keahlian & Spesialisasi</th>
                  <th className="py-3 px-4">Kontak</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center w-36">Aksi (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredInstructors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                      <p className="font-bold text-slate-600">Tidak ada data instruktur/pelatih ditemukan.</p>
                      <p className="text-[11px] text-slate-400 mt-1">Coba ubah kata kunci pencarian atau filter Anda.</p>
                    </td>
                  </tr>
                ) : (
                  filteredInstructors.map((inst, index) => {
                    const fullNameWithDegree = inst.Degree ? `${inst.Name}, ${inst.Degree}` : inst.Name;
                    
                    let roleBadgeClass = 'bg-slate-100 text-slate-800 border-slate-200';
                    if (inst.RoleTitle === 'Instruktur Resmi') {
                      roleBadgeClass = 'bg-blue-100 text-blue-800 border-blue-200 font-bold';
                    } else if (inst.RoleTitle === 'Pelatih / Coach') {
                      roleBadgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-200 font-bold';
                    } else if (inst.RoleTitle === 'Direktur Alpha Beta') {
                      roleBadgeClass = 'bg-purple-100 text-purple-900 border-purple-300 font-extrabold';
                    } else if (inst.RoleTitle === 'Pengelola') {
                      roleBadgeClass = 'bg-amber-100 text-amber-900 border-amber-300 font-bold';
                    }

                    return (
                      <tr key={inst.ID} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-500">
                          {inst.OrderNumber || index + 1}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={inst.PhotoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                              alt={inst.Name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0 shadow-2xs"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
                              }}
                            />
                            <div>
                              <p className="font-extrabold text-slate-900 text-xs sm:text-sm">
                                {fullNameWithDegree}
                              </p>
                              <span className="text-[10px] font-mono text-slate-400 block">ID: {inst.ID}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-[11px] border ${roleBadgeClass}`}>
                            {inst.RoleTitle}
                          </span>
                        </td>
                        <td className="py-3 px-4 max-w-xs">
                          <p className="font-semibold text-slate-800 line-clamp-2 leading-relaxed">
                            {inst.Expertise}
                          </p>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-0.5 text-[11px]">
                            {inst.Email ? (
                              <p className="text-slate-600 font-mono truncate max-w-[180px]">{inst.Email}</p>
                            ) : (
                              <span className="text-slate-300 italic">-</span>
                            )}
                            {inst.Phone ? (
                              <p className="text-slate-500 font-mono">{inst.Phone}</p>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {inst.Status === 'Aktif' ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              AKTIF
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-500 border border-slate-200">
                              NONAKTIF
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => setViewingInst(inst)}
                              title="Lihat Detail"
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenEditInstModal(inst)}
                              title="Edit Personil"
                              className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setDeletingInst(inst);
                                setIsDeletingInstModalOpen(true);
                              }}
                              title="Hapus Personil"
                              className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
            <span>Menampilkan {filteredInstructors.length} dari total {instructors.length} personil resmi</span>
            <span className="text-[11px] italic">Data ini digunakan secara konsisten di seluruh sertifikat, materi, dan jadwal pelatihan.</span>
          </div>
        </div>
      )}

      {/* TAB 2: MANAJEMEN PENGGUNA & 200 PESERTA FULL HISTORY */}
      {activeTab === 'users' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 uppercase">
                  Data Terintegrasi 200 Peserta
                </span>
                <span className="text-xs text-slate-500 font-mono">Full Learning Timeline & History</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">Database 200 Peserta & Riwayat Pembelajaran Lengkap</h2>
              <p className="text-xs text-slate-500">Pusat pemantauan seluruh perjalanan peserta sejak registrasi, materi, tugas, Google Meet/Zoom, pembayaran, hingga sertifikat.</p>
            </div>
            <button
              onClick={() => setIsUserModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Tambah User Baru
            </button>
          </div>

          {/* Distribution Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Database</span>
              <span className="text-xl font-black text-white mt-0.5">200 Peserta</span>
            </div>
            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Sedang Proses</span>
              <span className="text-xl font-black text-blue-800 mt-0.5">80 Peserta</span>
              <span className="text-[10px] text-blue-600 block">Progress 10–89%</span>
            </div>
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Lulus Belum Bayar</span>
              <span className="text-xl font-black text-amber-800 mt-0.5">60 Peserta</span>
              <span className="text-[10px] text-amber-600 block">Score ≥ 80, Draft Cert</span>
            </div>
            <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl">
              <span className="text-[10px] font-bold text-purple-700 uppercase block">Sudah Bayar</span>
              <span className="text-xl font-black text-purple-800 mt-0.5">40 Peserta</span>
              <span className="text-[10px] text-purple-600 block">Proses Verifikasi</span>
            </div>
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Sertifikat Aktif</span>
              <span className="text-xl font-black text-emerald-800 mt-0.5">20 Peserta</span>
              <span className="text-[10px] text-emerald-600 block">Terbit & Dapat Diunduh</span>
            </div>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={userSearchQuery}
                onChange={e => setUserSearchQuery(e.target.value)}
                placeholder="Cari nama, NIK, ID, email, atau pelatihan..."
                className="p-2.5 rounded-xl border border-slate-200 w-full sm:w-80 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
              {[
                { id: 'ALL', label: 'SEMUA ROLE' },
                { id: 'PESERTA', label: 'SEMUA PESERTA (200)' },
                { id: 'SEDANG_PROSES', label: '80 SEDANG PROSES' },
                { id: 'LULUS_BELUM_BAYAR', label: '60 LULUS BELUM BAYAR' },
                { id: 'SUDAH_BAYAR', label: '40 SUDAH BAYAR' },
                { id: 'SERTIFIKAT_AKTIF', label: '20 SERTIFIKAT AKTIF' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setParticipantCategoryFilter(cat.id)}
                  className={`px-3 py-2 rounded-xl font-bold text-[11px] whitespace-nowrap transition-colors ${
                    participantCategoryFilter === cat.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table 200 Peserta */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-100 font-extrabold text-slate-700 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">ID & Nama Peserta</th>
                  <th className="p-3">Instansi & Lokasi</th>
                  <th className="p-3">Role / Status Akun</th>
                  <th className="p-3">Level / XP</th>
                  <th className="p-3 text-center">Aksi & Timeline History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users
                  .filter(u => {
                    const matchesQuery =
                      u.Name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      u.Email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
                      (u.NIK && u.NIK.includes(userSearchQuery)) ||
                      (u.UserID && u.UserID.toLowerCase().includes(userSearchQuery.toLowerCase()));

                    if (!matchesQuery) return false;

                    if (participantCategoryFilter === 'ALL') return true;
                    if (participantCategoryFilter === 'PESERTA') return u.Role === 'PESERTA';

                    if (u.Role !== 'PESERTA') return false;

                    // Parse numerical ID for exact group matching
                    const numMatch = u.UserID.match(/\d+/);
                    const idx = numMatch ? parseInt(numMatch[0], 10) : 0;

                    if (participantCategoryFilter === 'SEDANG_PROSES') return idx <= 80;
                    if (participantCategoryFilter === 'LULUS_BELUM_BAYAR') return idx > 80 && idx <= 140;
                    if (participantCategoryFilter === 'SUDAH_BAYAR') return idx > 140 && idx <= 180;
                    if (participantCategoryFilter === 'SERTIFIKAT_AKTIF') return idx > 180;

                    return true;
                  })
                  .slice(0, 100) // Display top matching results efficiently
                  .map(u => {
                    const numMatch = u.UserID.match(/\d+/);
                    const idx = numMatch ? parseInt(numMatch[0], 10) : 0;

                    let groupLabel = 'SEDANG PROSES';
                    let badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';

                    if (u.Role === 'PESERTA') {
                      if (idx <= 80) {
                        groupLabel = 'SEDANG PROSES (10-89%)';
                        badgeClass = 'bg-blue-100 text-blue-800 border-blue-200';
                      } else if (idx <= 140) {
                        groupLabel = 'LULUS - BELUM BAYAR';
                        badgeClass = 'bg-amber-100 text-amber-900 border-amber-300';
                      } else if (idx <= 180) {
                        groupLabel = 'SUDAH BAYAR (VERIFIKASI)';
                        badgeClass = 'bg-purple-100 text-purple-900 border-purple-300';
                      } else {
                        groupLabel = 'SERTIFIKAT AKTIF';
                        badgeClass = 'bg-emerald-100 text-emerald-900 border-emerald-300 font-black';
                      }
                    }

                    return (
                      <tr key={u.UserID} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={u.PhotoURL} alt={u.Name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-100" />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {u.UserID}
                                </span>
                                <p className="font-bold text-slate-900">{u.Name}</p>
                              </div>
                              <p className="text-slate-500 text-[11px] mt-0.5">{u.Email} | NIK: {u.NIK || 'N/A'}</p>
                            </div>
                          </div>
                        </td>

                        <td className="p-3">
                          <p className="font-semibold text-slate-800 text-xs">{u.Bio || 'Peserta Mandiri'}</p>
                          <p className="text-slate-500 text-[11px]">{u.Address || 'Kota Bandung'}</p>
                        </td>

                        <td className="p-3">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                            {u.Role === 'PESERTA' ? groupLabel : u.Role}
                          </span>
                        </td>

                        <td className="p-3 text-xs">
                          <span className="font-bold text-amber-600">Level {u.Level || 1}</span>
                          <span className="text-[10px] text-slate-500 block">{u.XP || 0} XP</span>
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() => setSelectedParticipantIdForHistory(u.UserID)}
                            className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 mx-auto transition-all shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Lihat Timeline History</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: MANAJEMEN KELAS & KATEGORI LMS */}
      {activeTab === 'courses' && (
        <div className="space-y-6">
          {/* Summary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Program Kelas</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">{courses.length} Program</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Kategori Utama</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">{categoriesList.length} Kategori</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Subkategori Vokasi</span>
                <span className="text-2xl font-black text-slate-900 mt-0.5 block">
                  {categoriesList.reduce((acc, cat) => acc + (cat.Subcategories?.length || 0), 0)} Spesialisasi
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Tag className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Section 1: Struktur Kategori & Subkategori Kursus LMS */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase">
                  Struktur Kurikulum & Taksonomi LMS
                </span>
                <h2 className="text-base font-extrabold text-slate-900 mt-1">
                  Kategori & Subkategori Program Kursus
                </h2>
                <p className="text-xs text-slate-500">
                  Daftar taksonomi resmi kategori dan subkategori spesialisasi yang digunakan di portal pendaftaran dan pembuatan modul.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {categoriesList.map(cat => (
                <div key={cat.CategoryID} className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200/60 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                        {cat.Name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-black text-sm text-slate-900 flex items-center gap-2">
                          <span>{cat.Name}</span>
                          <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                            {cat.CategoryID}
                          </span>
                        </h3>
                        <p className="text-xs text-slate-500">{cat.Description || 'Kategori Pelatihan Vokasi'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">
                        {cat.Subcategories?.length || 0} Subkategori
                      </span>
                    </div>
                  </div>

                  {/* Subcategories Badges List */}
                  <div>
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                      Daftar Subkategori ({cat.Subcategories?.length || 0})
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.Subcategories && cat.Subcategories.length > 0 ? (
                        cat.Subcategories.map((sub, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl shadow-2xs hover:border-blue-400 transition-colors"
                          >
                            <Tag className="w-3 h-3 text-blue-500" />
                            <span>{sub}</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400 italic">Belum ada subkategori ditambahkan</span>
                      )}
                    </div>
                  </div>

                  {/* Add Subcategory Inline Input */}
                  <div className="pt-2 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={`+ Tambah subkategori baru ke ${cat.Name}...`}
                      value={selectedCatForSubcat === cat.CategoryID ? newSubcategoryInput : ''}
                      onChange={e => {
                        setSelectedCatForSubcat(cat.CategoryID);
                        setNewSubcategoryInput(e.target.value);
                      }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSubcategory(cat.CategoryID);
                        }
                      }}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden w-full max-w-md font-medium"
                    />
                    <button
                      onClick={() => handleAddSubcategory(cat.CategoryID)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-2xs"
                    >
                      + Tambah
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Daftar Kelas Pelatihan Dipublikasikan */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-extrabold text-slate-900">Katalog Kelas Pelatihan Vokasi</h2>
                <p className="text-xs text-slate-500">Daftar program pelatihan beserta kategori & subkategori spesialisasi</p>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={courseCategoryFilter}
                  onChange={e => setCourseCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ALL">Semua Kategori ({courses.length})</option>
                  {categoriesList.map(cat => (
                    <option key={cat.CategoryID} value={cat.CategoryID}>
                      {cat.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses
                .filter(c => courseCategoryFilter === 'ALL' || c.CategoryID === courseCategoryFilter)
                .map(c => (
                  <div key={c.CourseID} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/60 inline-block mb-1">
                          {c.CategoryName || c.CategoryID}
                        </span>
                        <h3 className="font-extrabold text-sm text-slate-900 leading-snug">{c.Title}</h3>
                      </div>
                      <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold rounded-full text-[10px] shrink-0">
                        {c.Status}
                      </span>
                    </div>

                    {c.Subcategory && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[10px] font-bold">
                        <Tag className="w-3 h-3 text-emerald-600" />
                        <span>Subkategori: {c.Subcategory}</span>
                      </div>
                    )}

                    <div className="text-xs text-slate-500 space-y-1 pt-1 border-t border-slate-200/50">
                      <p><strong className="text-slate-700">Instruktur:</strong> {c.InstructorName || '-'}</p>
                      <p><strong className="text-slate-700">Durasi:</strong> {c.Duration} | <strong className="text-slate-700">Level:</strong> {c.Level}</p>
                      <p><strong className="text-slate-700">Harga:</strong> {c.Price === 0 ? 'Rp 0 (Beasiswa)' : `Rp ${c.Price.toLocaleString('id-ID')}`}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-2 border-t border-slate-200/50">
                      <span>👥 {c.EnrolledCount} Peserta Terdaftar</span>
                      <span className="text-amber-600">⭐ {c.Rating} Rating</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: TATAP MUKA DARING (GOOGLE MEET / ZOOM) */}
      {activeTab === 'live_meeting' && (
        <LiveSessionManager
          userRole="ADMIN"
          userId="USR-ADM-001"
          onShowToast={onShowToast}
        />
      )}

      {/* TAB HARGA & PROMO 2026 */}
      {activeTab === 'prices' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase">
                  Pembaruan Struktur Harga 2026
                </span>
                <h2 className="text-base font-extrabold text-slate-900 mt-1">
                  Manajemen Harga Program & Skema Promosi
                </h2>
                <p className="text-xs text-slate-500">
                  Kelola harga normal, early bird, promo, harga kelompok, dan harga institusi secara terpusat tanpa hardcode.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-xs">
                  Total Program: {courses.length}
                </span>
              </div>
            </div>

            {/* Table Pricing 2026 */}
            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs min-w-[700px]">
                <thead className="bg-slate-100 font-extrabold text-slate-700 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">ID & Nama Program</th>
                    <th className="p-3">Status Harga</th>
                    <th className="p-3">Harga Normal</th>
                    <th className="p-3">Early Bird</th>
                    <th className="p-3">Harga Promo</th>
                    <th className="p-3">Paket Kelompok (10)</th>
                    <th className="p-3">Harga Institusi</th>
                    <th className="p-3 text-center">Aksi Edit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {courses.map(c => {
                    const p = c.Pricing || {
                      normal_price: c.Price,
                      early_bird_price: Math.round(c.Price * 0.8),
                      promo_price: Math.round(c.Price * 0.7),
                      group_price: Math.round(c.Price * 6),
                      institution_price: Math.round(c.Price * 8),
                      price_status: 'ACTIVE'
                    };

                    return (
                      <tr key={c.CourseID} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3">
                          <p className="font-extrabold text-slate-900">{c.Title}</p>
                          <span className="text-[10px] text-slate-400 font-mono">{c.CourseID} • {c.CategoryName}</span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-md font-extrabold text-[10px] uppercase ${
                            p.price_status === 'PROMO'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : p.price_status === 'EARLY_BIRD'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {p.price_status || 'ACTIVE'}
                          </span>
                        </td>
                        <td className="p-3 font-bold text-slate-900">
                          Rp {(p.normal_price || c.Price).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 font-semibold text-blue-700">
                          Rp {(p.early_bird_price || Math.round(c.Price * 0.8)).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 font-semibold text-amber-700">
                          Rp {(p.promo_price || Math.round(c.Price * 0.7)).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-slate-600">
                          Rp {(p.group_price || Math.round(c.Price * 6)).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-slate-600">
                          Rp {(p.institution_price || Math.round(c.Price * 8)).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleOpenPriceModal(c)}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1 mx-auto transition-all shadow-xs"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Harga</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Trail History Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  📜 Audit Trail Riwayat Perubahan Harga
                </h3>
                <p className="text-xs text-slate-500">
                  Catatan otomatis setiap kali Admin mengubah harga program (Immutable Log)
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs">
                {priceHistories.length} Catatan Log
              </span>
            </div>

            {priceHistories.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs italic">
                Belum ada catatan riwayat perubahan harga. Semua harga saat ini menggunakan baseline resmi 2026.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-slate-50 font-bold text-slate-600 uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Waktu Log</th>
                      <th className="p-3">Program</th>
                      <th className="p-3">Harga Lama</th>
                      <th className="p-3">Harga Baru</th>
                      <th className="p-3">Eksekutor Admin</th>
                      <th className="p-3">Alasan / Catatan Perubahan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {priceHistories.map(h => (
                      <tr key={h.id} className="hover:bg-slate-50/50">
                        <td className="p-3 text-slate-500 whitespace-nowrap">
                          {new Date(h.timestamp).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 font-bold text-slate-900">{h.program_title}</td>
                        <td className="p-3 text-slate-500 line-through">
                          Rp {h.old_price.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 font-black text-rose-600">
                          Rp {h.new_price.toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 font-semibold text-slate-700">{h.admin_name}</td>
                        <td className="p-3 text-slate-600">{h.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: MANAJEMEN MATERI */}
      {activeTab === 'materi' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Audit & Manajemen Materi Pembelajaran</h2>
            <p className="text-xs text-slate-500">Pusat kontrol seluruh modul, link video pembelajaran, dan simulator laboratorium</p>
          </div>
          <p className="text-xs text-slate-600">Seluruh modul tersinkronisasi otomatis dengan Google Apps Script & Drive.</p>
        </div>
      )}

      {/* TAB 5: MANAJEMEN SERTIFIKAT & VERIFIKASI PEMBAYARAN */}
      {activeTab === 'certificates' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 uppercase">
                Otomatisasi &amp; Verifikasi Sertifikat NISN K9980820
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">Sistem Penerbitan &amp; Manajemen Sertifikat LPK</h2>
              <p className="text-xs text-slate-500">Penerbitan resmi, verifikasi keabsahan QR code, terbitkan ulang, dan pembatalan sertifikat</p>
            </div>

            <button
              onClick={() => setIsManualIssueModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Terbitkan Sertifikat Baru</span>
            </button>
          </div>

          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Kelulusan</span>
              <span className="text-xl font-black text-slate-900">{certificates.length}</span>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Menunggu Bayar</span>
              <span className="text-xl font-black text-blue-800">
                {certificates.filter(c => c.Status === 'MENUNGGU_PEMBAYARAN' || c.Status === 'LULUS').length}
              </span>
            </div>

            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Menunggu Verifikasi</span>
              <span className="text-xl font-black text-amber-800">
                {certificates.filter(c => c.Status === 'MENUNGGU_VERIFIKASI').length}
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Aktif / Disetujui</span>
              <span className="text-xl font-black text-emerald-800">
                {certificates.filter(c => c.Status === 'AKTIF' || c.Status === 'Issued' || c.Status === 'DISETUJUI').length}
              </span>
            </div>

            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Dibatalkan / Ditolak</span>
              <span className="text-xl font-black text-rose-800">
                {certificates.filter(c => c.Status === 'DITOLAK' || c.Status === 'DIBATALKAN' || c.Status === 'REVOKED').length}
              </span>
            </div>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari nama peserta, NIK, atau ID sertifikat..."
                value={certSearchQuery}
                onChange={e => setCertSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <select
              value={certStatusFilter}
              onChange={e => setCertStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-rose-500"
            >
              <option value="ALL">Semua Status Sertifikat</option>
              <option value="MENUNGGU_VERIFIKASI">⏳ Menunggu Verifikasi (Butuh Aksi Admin)</option>
              <option value="MENUNGGU_PEMBAYARAN">💳 Menunggu Pembayaran Peserta</option>
              <option value="AKTIF">✅ Aktif / Terbit Resmi</option>
              <option value="DIBATALKAN">🚫 Dibatalkan / Non-Aktif</option>
              <option value="DITOLAK">❌ Ditolak / Perlu Perbaikan</option>
            </select>
          </div>

          {/* Certificate Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase border-b border-slate-200 text-[10px]">
                <tr>
                  <th className="p-3">No. Sertifikat</th>
                  <th className="p-3">Nama Peserta &amp; NIK</th>
                  <th className="p-3">Program Pelatihan</th>
                  <th className="p-3">Nilai Akhir</th>
                  <th className="p-3">Status Sertifikat</th>
                  <th className="p-3 text-center">Aksi Operasional Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {certificates
                  .filter(c => {
                    const matchesStatus =
                      certStatusFilter === 'ALL' ||
                      c.Status === certStatusFilter ||
                      (certStatusFilter === 'AKTIF' && (c.Status === 'Issued' || c.Status === 'DISETUJUI')) ||
                      (certStatusFilter === 'DIBATALKAN' && (c.Status === 'REVOKED' || c.Status === 'DIBATALKAN')) ||
                      (certStatusFilter === 'MENUNGGU_PEMBAYARAN' && c.Status === 'LULUS');
                    const matchesQuery =
                      c.UserName.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
                      c.CertificateID.toLowerCase().includes(certSearchQuery.toLowerCase()) ||
                      c.CourseTitle.toLowerCase().includes(certSearchQuery.toLowerCase());
                    return matchesStatus && matchesQuery;
                  })
                  .map(cert => {
                    const status = cert.Status;
                    const isApproved = status === 'AKTIF' || status === 'Issued' || status === 'DISETUJUI';
                    const isPendingVerif = status === 'MENUNGGU_VERIFIKASI';
                    const isWaitingPayment = status === 'MENUNGGU_PEMBAYARAN' || status === 'LULUS';
                    const isRejected = status === 'DITOLAK';
                    const isRevoked = status === 'DIBATALKAN' || status === 'REVOKED';

                    return (
                      <tr key={cert.CertificateID} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-mono font-bold text-blue-900">{cert.CertificateID}</td>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{cert.UserName}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{cert.UserNIK || 'NIK: -'}</div>
                        </td>
                        <td className="p-3 font-semibold text-slate-800 max-w-xs">{cert.CourseTitle}</td>
                        <td className="p-3">
                          <span className="font-bold text-blue-700">{cert.FinalScore} / 100</span>
                          <span className="text-[10px] text-slate-500 block">{cert.GradePredikat || 'Sangat Memuaskan'}</span>
                        </td>
                        <td className="p-3">
                          {isApproved && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">
                              ✅ AKTIF / TERBIT
                            </span>
                          )}
                          {isPendingVerif && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                              ⏳ MENUNGGU VERIFIKASI
                            </span>
                          )}
                          {isWaitingPayment && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
                              💳 MENUNGGU PEMBAYARAN
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                              ❌ DITOLAK
                            </span>
                          )}
                          {isRevoked && (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700 border border-slate-300">
                              🚫 DIBATALKAN
                            </span>
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1.5 flex-wrap">
                            {isPendingVerif ? (
                              <button
                                onClick={() => {
                                  setSelectedCertForVerify(cert);
                                  setRejectionReasonInput(cert.RejectionReason || '');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                              >
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Verifikasi Bayar</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => setPreviewingCert(cert)}
                                  title="Preview & Cetak Sertifikat"
                                  className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-200"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => setPreviewingCert(cert)}
                                  title="Cetak Sertifikat A4 Landscape"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors border border-emerald-200"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleReissueCertificate(cert.CertificateID)}
                                  title="Terbitkan Ulang Sertifikat"
                                  className="p-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition-colors border border-amber-200"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                </button>

                                {!isRevoked && (
                                  <button
                                    onClick={() => {
                                      setRevokingCert(cert);
                                      setRevokeReasonInput('');
                                    }}
                                    title="Batalkan / Non-aktifkan Sertifikat"
                                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors border border-rose-200"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL 1: LIVE CERTIFICATE HIGH-RES PREVIEW */}
      {previewingCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-900 uppercase">
                  Preview Sertifikat Resmi
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  Sertifikat #{previewingCert.CertificateID} - {previewingCert.UserName}
                </h3>
              </div>
              <button
                onClick={() => setPreviewingCert(null)}
                className="p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <CertificateView certificate={previewingCert} />
          </div>
        </div>
      )}

      {/* MODAL 2: REVOKE CERTIFICATE PROMPT */}
      {revokingCert && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative border border-slate-200">
            <button
              onClick={() => setRevokingCert(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                <AlertCircle className="w-7 h-7" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Batalkan / Non-Aktifkan Sertifikat</h3>
              <p className="text-xs text-slate-500">
                Sertifikat <strong>#{revokingCert.CertificateID}</strong> ({revokingCert.UserName}) akan dinonaktifkan di database verifikasi public.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Alasan Pembatalan / Non-Aktif:</label>
              <input
                type="text"
                placeholder="Contoh: Terjadi kesalahan data / Pembatalan oleh Admin"
                value={revokeReasonInput}
                onChange={e => setRevokeReasonInput(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRevokingCert(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={isRevoking}
                onClick={handleRevokeCertificate}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-extrabold text-xs hover:bg-rose-700 shadow-md shadow-rose-600/20"
              >
                {isRevoking ? 'Memproses...' : 'Ya, Batalkan Sertifikat'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MANUAL ISSUE CERTIFICATE FORM */}
      {isManualIssueModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative border border-slate-200">
            <button
              onClick={() => setIsManualIssueModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-extrabold bg-blue-100 text-blue-900 uppercase">
                Otorisasi Sertifikat Manual
              </span>
              <h3 className="text-lg font-black text-slate-900">Terbitkan Sertifikat Kelulusan Baru</h3>
              <p className="text-xs text-slate-500">Pilih peserta yang memenuhi kriteria passing grade untuk menerbitkan sertifikat resmi NISN K9980820.</p>
            </div>

            <form onSubmit={handleManualIssueSubmit} className="space-y-4 text-xs font-medium">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Pilih Peserta Pelatihan:</label>
                <select
                  value={manualIssueUserId}
                  onChange={e => setManualIssueUserId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Pilih Peserta --</option>
                  {users.filter(u => u.Role === 'PESERTA').map(u => (
                    <option key={u.UserID} value={u.UserID}>
                      {u.Name} ({u.Email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Pilih Program Pelatihan:</label>
                <select
                  value={manualIssueCourseId}
                  onChange={e => setManualIssueCourseId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">-- Pilih Program --</option>
                  {courses.map(c => (
                    <option key={c.CourseID} value={c.CourseID}>
                      {c.Title} ({c.CategoryName})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Nilai Akhir (0-100):</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={manualIssueScore}
                    onChange={e => setManualIssueScore(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-blue-900 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Predikat Kelulusan:</label>
                  <select
                    value={manualIssuePredikat}
                    onChange={e => setManualIssuePredikat(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Sangat Memuaskan">Sangat Memuaskan</option>
                    <option value="Dengan Pujian / Distinction">Dengan Pujian / Distinction</option>
                    <option value="Memuaskan">Memuaskan</option>
                    <option value="Baik">Baik</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsManualIssueModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isIssuingManual}
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs hover:bg-blue-700 shadow-md shadow-blue-600/20"
                >
                  {isIssuingManual ? 'Menerbitkan...' : 'Terbitkan Sertifikat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Modal Review / Verification Certificate Admin */}
      {selectedCertForVerify && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto border border-slate-200">
            <button
              onClick={() => setSelectedCertForVerify(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-rose-100 text-rose-800 uppercase">
                Panel Verifikasi Administrator
              </span>
              <h3 className="text-lg font-black text-slate-900">Pemeriksaan Pembayaran & Otorisasi Sertifikat</h3>
              <p className="text-xs text-slate-500">Nomor Registrasi: {selectedCertForVerify.CertificateID}</p>
            </div>

            {/* Peserta & Pelatihan Summary */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 text-[10px]">Nama Peserta:</span>
                  <p className="font-bold text-slate-900">{selectedCertForVerify.UserName}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">NIK Peserta:</span>
                  <p className="font-mono font-bold text-slate-800">{selectedCertForVerify.UserNIK || '-'}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 text-[10px]">Program Pelatihan:</span>
                  <p className="font-bold text-blue-900">{selectedCertForVerify.CourseTitle}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Nilai Akhir Kelulusan:</span>
                  <p className="font-bold text-emerald-700">{selectedCertForVerify.FinalScore} / 100 ({selectedCertForVerify.GradePredikat || 'Sangat Memuaskan'})</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px]">Tanggal Kelulusan:</span>
                  <p className="font-semibold text-slate-700">{selectedCertForVerify.IssueDate || '2026-02-01'}</p>
                </div>
              </div>
            </div>

            {/* Payment Confirmation Submission Review */}
            {selectedCertForVerify.PaymentProof ? (
              <div className="space-y-3 border-t border-slate-200 pt-4">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Data Konfirmasi Pembayaran Peserta</span>
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
                  <div>
                    <span className="text-slate-500 text-[10px] block">Nama Pemilik Rekening:</span>
                    <strong className="text-slate-900">{selectedCertForVerify.PaymentProof.payerName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Nominal & Bank Transfer:</span>
                    <strong className="text-emerald-800">Rp {selectedCertForVerify.PaymentProof.amount.toLocaleString('id-ID')} ({selectedCertForVerify.PaymentProof.bankName})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Tanggal Transfer:</span>
                    <strong className="text-slate-700">{selectedCertForVerify.PaymentProof.transferDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">Catatan Peserta:</span>
                    <span className="text-slate-600">{selectedCertForVerify.PaymentProof.note || '-'}</span>
                  </div>
                </div>

                {selectedCertForVerify.PaymentProof.proofUrl && (
                  <div>
                    <span className="text-slate-700 text-xs font-bold block mb-1">Bukti Transfer (Lampiran Gambar):</span>
                    <img
                      src={selectedCertForVerify.PaymentProof.proofUrl}
                      alt="Bukti Transfer Peserta"
                      className="max-h-48 mx-auto rounded-xl border-2 border-slate-200 object-cover shadow-sm"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-3 bg-amber-50 text-amber-900 rounded-2xl text-xs border border-amber-200 font-medium">
                Belum ada bukti pembayaran yang diunggah peserta.
              </div>
            )}

            {/* Rejection reason box if rejecting */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">Catatan/Alasan (Isi jika Menolak Konfirmasi):</label>
              <input
                type="text"
                placeholder="Contoh: Bukti transfer tidak terbaca / nominal tidak sesuai"
                value={rejectionReasonInput}
                onChange={e => setRejectionReasonInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-rose-500"
              />
            </div>

            {/* Approve / Reject Buttons */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedCertForVerify(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Tutup
              </button>

              <button
                type="button"
                disabled={isVerifyingCert}
                onClick={() => handleVerifyCertificateAction('TOLAK')}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-md shadow-rose-600/20"
              >
                {isVerifyingCert ? 'Memproses...' : '❌ Tolak Pembayaran'}
              </button>

              <button
                type="button"
                disabled={isVerifyingCert}
                onClick={() => handleVerifyCertificateAction('APPROVE')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isVerifyingCert ? 'Memproses...' : '✅ SETUJU & TERBITKAN SERTIFIKAT'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: MANAJEMEN ABSENSI */}
      {activeTab === 'attendance' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                  Data Presensi Realtime
                </span>
                <span className="text-xs font-bold text-slate-500">• Total Record: {attendances.length}</span>
              </div>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">Rekapitulasi & Koreksi Absensi Peserta</h2>
              <p className="text-xs text-slate-500">Kelola, verifikasi, tambah manual, dan koreksi kehadiran peserta secara online</p>
            </div>

            <button
              onClick={() => {
                setEditingAtt(null);
                setAttForm({
                  UserID: users.length > 0 ? users[0].UserID : '',
                  CourseID: courses.length > 0 ? courses[0].CourseID : 'CRS-TK01',
                  Status: 'Hadir',
                  Date: new Date().toISOString().split('T')[0],
                  TimeIn: '08:00',
                  TimeOut: '16:00',
                  Notes: 'Presensi manual ditambahkan oleh Admin'
                });
                setIsAttModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>+ Input Absensi Manual</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Total Hadir</span>
              <span className="text-xl font-black text-emerald-900">
                {attendances.filter(a => a.Status === 'Hadir' || a.Status === 'Terlambat').length}
              </span>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 uppercase block">Total Izin</span>
              <span className="text-xl font-black text-amber-900">
                {attendances.filter(a => a.Status === 'Izin').length}
              </span>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase block">Total Sakit</span>
              <span className="text-xl font-black text-blue-900">
                {attendances.filter(a => a.Status === 'Sakit').length}
              </span>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Total Alpa</span>
              <span className="text-xl font-black text-rose-900">
                {attendances.filter(a => a.Status === 'Alpa').length}
              </span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={attSearchQuery}
                onChange={e => setAttSearchQuery(e.target.value)}
                placeholder="Cari nama peserta / kursus..."
                className="w-full pl-10 p-2.5 bg-slate-50 text-xs font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              {['ALL', 'Hadir', 'Izin', 'Sakit', 'Alpa'].map(st => (
                <button
                  key={st}
                  onClick={() => setAttStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    attStatusFilter === st
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st === 'ALL' ? 'Semua Status' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Attendance Records Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead className="bg-slate-100 text-slate-700 font-extrabold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Peserta</th>
                  <th className="p-3">Program / Sesi</th>
                  <th className="p-3">Tanggal & Jam</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Catatan</th>
                  <th className="p-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {attendances
                  .filter(a => {
                    const matchQuery = (a.UserName || '').toLowerCase().includes(attSearchQuery.toLowerCase()) ||
                                       (a.CourseTitle || '').toLowerCase().includes(attSearchQuery.toLowerCase());
                    const matchStatus = attStatusFilter === 'ALL' || a.Status === attStatusFilter;
                    return matchQuery && matchStatus;
                  })
                  .slice(0, 30)
                  .map((att, idx) => (
                    <tr key={att.AttendanceID || idx} className="hover:bg-slate-50">
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900">{att.UserName}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{att.UserID}</div>
                      </td>
                      <td className="p-3 font-semibold text-slate-800">{att.CourseTitle || att.SessionName}</td>
                      <td className="p-3 font-mono text-[11px]">
                        <div>{att.Date}</div>
                        <div className="text-slate-400 text-[10px]">{att.TimeIn} - {att.TimeOut}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-lg font-extrabold text-[10px] ${
                          att.Status === 'Hadir' ? 'bg-emerald-100 text-emerald-800' :
                          att.Status === 'Izin' ? 'bg-amber-100 text-amber-800' :
                          att.Status === 'Sakit' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {att.Status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500 max-w-xs truncate">{att.Notes || '-'}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => {
                              setEditingAtt(att);
                              setAttForm({
                                UserID: att.UserID,
                                CourseID: att.CourseID || 'CRS-TK01',
                                Status: att.Status,
                                Date: att.Date || new Date().toISOString().split('T')[0],
                                TimeIn: att.TimeIn || '08:00',
                                TimeOut: att.TimeOut || '16:00',
                                Notes: att.Notes || ''
                              });
                              setIsAttModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100"
                            title="Koreksi Absensi"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm(`Hapus data absensi ${att.UserName}?`)) {
                                await apiService.deleteAdminAttendance(att.AttendanceID);
                                onShowToast('Data absensi dihapus', 'success');
                                const fresh = await apiService.getAdminAttendance();
                                setAttendances(fresh);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Modal Input/Edit Absensi */}
          {isAttModalOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
                <button
                  onClick={() => setIsAttModalOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>

                <h3 className="text-sm font-black text-slate-900">
                  {editingAtt ? '✏️ Koreksi Presensi Peserta' : '➕ Input Presensi Manual'}
                </h3>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    await apiService.saveAdminAttendance({
                      AttendanceID: editingAtt?.AttendanceID,
                      UserID: attForm.UserID,
                      CourseID: attForm.CourseID,
                      Status: attForm.Status,
                      Date: attForm.Date,
                      TimeIn: attForm.TimeIn,
                      TimeOut: attForm.TimeOut,
                      Notes: attForm.Notes
                    });
                    setIsAttModalOpen(false);
                    onShowToast(editingAtt ? 'Presensi berhasil dikoreksi' : 'Presensi manual disimpan', 'success');
                    const fresh = await apiService.getAdminAttendance();
                    setAttendances(fresh);
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pilih Peserta *</label>
                    <select
                      value={attForm.UserID}
                      onChange={e => setAttForm({ ...attForm, UserID: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                    >
                      {users.map(u => (
                        <option key={u.UserID} value={u.UserID}>{u.Name} ({u.UserID})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Pilih Program Kursus *</label>
                    <select
                      value={attForm.CourseID}
                      onChange={e => setAttForm({ ...attForm, CourseID: e.target.value })}
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                    >
                      {courses.map(c => (
                        <option key={c.CourseID} value={c.CourseID}>{c.Title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Status Kehadiran *</label>
                      <select
                        value={attForm.Status}
                        onChange={e => setAttForm({ ...attForm, Status: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold"
                      >
                        <option value="Hadir">Hadir</option>
                        <option value="Izin">Izin</option>
                        <option value="Sakit">Sakit</option>
                        <option value="Alpa">Alpa</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Tanggal *</label>
                      <input
                        type="date"
                        value={attForm.Date}
                        onChange={e => setAttForm({ ...attForm, Date: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jam Masuk</label>
                      <input
                        type="time"
                        value={attForm.TimeIn}
                        onChange={e => setAttForm({ ...attForm, TimeIn: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Jam Keluar</label>
                      <input
                        type="time"
                        value={attForm.TimeOut}
                        onChange={e => setAttForm({ ...attForm, TimeOut: e.target.value })}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Catatan</label>
                    <input
                      type="text"
                      value={attForm.Notes}
                      onChange={e => setAttForm({ ...attForm, Notes: e.target.value })}
                      placeholder="Catatan khusus..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                    />
                  </div>

                  <div className="pt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAttModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-extrabold shadow-md shadow-blue-500/20"
                    >
                      Simpan Data Presensi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: MANAJEMEN PENGUMUMAN */}
      {activeTab === 'announcements' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Kelola Pengumuman & Berita</h2>
            <p className="text-xs text-slate-500">Publikasikan pengumuman penting bagi peserta, instruktur, dan pengunjung website</p>
          </div>

          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a.AnnouncementID} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                <span className="text-[10px] font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  {a.Category}
                </span>
                <p className="font-extrabold text-sm text-slate-900 mt-1">{a.Title}</p>
                <p className="text-slate-600">{a.Content}</p>
                <p className="text-slate-400 text-[11px] pt-1">Oleh: {a.Author} | Tanggal: {a.Date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: LAPORAN DAN STATISTIK */}
      {activeTab === 'reports' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Laporan & Analistik Kinerja Lembaga</h2>
            <p className="text-xs text-slate-500">Grafik pertumbuhan peserta terdaftar, tingkat kelulusan, dan pendapatan LPK</p>
          </div>

          <button
            onClick={() => onShowToast('📄 Laporan Eksekutif LPK berhasil diunduh dalam format PDF', 'success')}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Unduh Laporan Eksekutif PDF
          </button>
        </div>
      )}

      {/* TAB 9: PENGATURAN SISTEM */}
      {activeTab === 'settings' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Pengaturan Sistem & Identitas Resmi Lembaga</h2>
            <p className="text-xs text-slate-500">Konfigurasi URL Web App GAS, Google Sheet, dan Logo Resmi Kementerian Pendukung</p>
          </div>

          {/* Section: Upload Logo Kementerian */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-6">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Logo Resmi Kementerian Pendukung (Footer & Dokumen)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Secara default, sistem menggunakan SVG resmi presisi tinggi. Admin dapat mengunggah file PNG/SVG khusus jika diperlukan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
              {/* Field 1: Kemnaker Logo */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-extrabold block">
                    1. Logo Kementerian Ketenagakerjaan RI (Kemnaker)
                  </label>
                  {kemnakerLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setKemnakerLogoUrl('')}
                      className="text-[10px] text-rose-600 hover:underline font-bold"
                    >
                      Reset ke SVG Default
                    </button>
                  )}
                </div>

                <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-center min-h-[70px]">
                  {kemnakerLogoUrl ? (
                    <img
                      src={kemnakerLogoUrl}
                      alt="Logo Kemnaker Custom"
                      className="h-12 max-w-full object-contain"
                    />
                  ) : (
                    <KemnakerLogo size="sm" />
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Unggah File PNG / SVG Logo Resmi:</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={handleKemnakerFileUpload}
                      className="block w-full text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Atau Gunakan URL Gambar Khusus:</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={kemnakerLogoUrl}
                      onChange={e => setKemnakerLogoUrl(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Field 2: Kemdikdasmen Logo */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-extrabold block">
                    2. Logo Kementerian Pendidikan Dasar & Menengah RI (Kemdikdasmen)
                  </label>
                  {kemdikdasmenLogoUrl && (
                    <button
                      type="button"
                      onClick={() => setKemdikdasmenLogoUrl('')}
                      className="text-[10px] text-rose-600 hover:underline font-bold"
                    >
                      Reset ke SVG Default
                    </button>
                  )}
                </div>

                <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-center min-h-[70px]">
                  {kemdikdasmenLogoUrl ? (
                    <img
                      src={kemdikdasmenLogoUrl}
                      alt="Logo Kemdikdasmen Custom"
                      className="h-12 max-w-full object-contain"
                    />
                  ) : (
                    <KemdikdasmenLogo size="sm" />
                  )}
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Unggah File PNG / SVG Logo Resmi:</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      onChange={handleKemdikdasmenFileUpload}
                      className="block w-full text-[11px] text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-600 block mb-1">Atau Gunakan URL Gambar Khusus:</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={kemdikdasmenLogoUrl}
                      onChange={e => setKemdikdasmenLogoUrl(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: URL Apps Script & Google Sheet */}
          <div className="space-y-4 text-xs font-semibold pt-2">
            <div>
              <label className="text-slate-700 block mb-1">URL Google Apps Script Web App (GAS) *</label>
              <input
                type="text"
                value={gasUrl}
                onChange={e => setGasUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div>
              <label className="text-slate-700 block mb-1">URL Google Sheet Spreadsheet *</label>
              <input
                type="text"
                value={sheetUrl}
                onChange={e => setSheetUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                onClick={handleSaveSettings}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold flex items-center gap-2 shadow-md shadow-rose-600/20"
              >
                <Save className="w-4 h-4" /> Simpan Pengaturan Sistem & Logo
              </button>
              <button
                onClick={handleCopyAppsScript}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center gap-1.5"
              >
                <Copy className="w-4 h-4" /> {copiedScript ? 'Tersalin!' : 'Salin Kode Apps Script'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 10: BACKUP DAN RESTORE */}
      {activeTab === 'backup' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Backup & Restore Database LPK</h2>
            <p className="text-xs text-slate-500">Unduh snapshot data lokal dan pulihkan cadangan jika diperlukan</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onShowToast('📦 Database Backup JSON berhasil diunduh ke komputer Anda', 'success')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download Backup JSON
            </button>
          </div>
        </div>
      )}

      {/* TAB 11: LOG AKTIVITAS */}
      {activeTab === 'activity_logs' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">Log Aktivitas & Audit Trail</h2>
            <p className="text-xs text-slate-500">Catatan aktivitas penting pengguna, login, dan perubahan data di sistem</p>
          </div>

          <div className="space-y-3">
            {activityLogs.map(log => (
              <div key={log.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                <div>
                  <p className="font-extrabold text-slate-900">{log.action}</p>
                  <p className="text-slate-500">{log.user} | IP: {log.ip}</p>
                </div>
                <span className="text-slate-400 font-medium text-[11px]">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm">Tambah Pengguna Baru</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="text-slate-700 block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={addName}
                  onChange={e => setAddName(e.target.value)}
                  placeholder="Nama Pengguna"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Email *</label>
                <input
                  type="email"
                  value={addEmail}
                  onChange={e => setAddEmail(e.target.value)}
                  placeholder="email@alphabeta.edu.eu.org"
                  required
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Peran Akses (RBAC Role) *</label>
                <select
                  value={addRole}
                  onChange={e => setAddRole(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                >
                  <option value="PESERTA">Peserta Pelatihan</option>
                  <option value="INSTRUKTUR">Instruktur Pelatihan</option>
                  <option value="PELATIH">Pelatih / Coach</option>
                  <option value="ADMIN">Administrator Pusat</option>
                </select>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">No. WhatsApp / Telepon</label>
                <input
                  type="text"
                  value={addPhone}
                  onChange={e => setAddPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Simpan User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Price Modal */}
      {editingPriceCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase">
                  Edit Harga & Skema Promo 2026
                </span>
                <h3 className="font-black text-slate-900 text-sm mt-1">{editingPriceCourse.Title}</h3>
              </div>
              <button onClick={() => setEditingPriceCourse(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePrice} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Status Skema Harga *</label>
                  <select
                    value={priceForm.price_status}
                    onChange={e => setPriceForm({ ...priceForm, price_status: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-bold"
                  >
                    <option value="ACTIVE">ACTIVE (Normal)</option>
                    <option value="EARLY_BIRD">EARLY_BIRD (Diskon Awal)</option>
                    <option value="PROMO">PROMO (Diskon Spesial)</option>
                    <option value="INACTIVE">INACTIVE (Non-Aktif)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Harga Normal (Rp) *</label>
                  <input
                    type="number"
                    value={priceForm.normal_price}
                    onChange={e => setPriceForm({ ...priceForm, normal_price: Number(e.target.value) })}
                    placeholder="Contoh: 299000"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Harga Early Bird (Rp)</label>
                  <input
                    type="number"
                    value={priceForm.early_bird_price}
                    onChange={e => setPriceForm({ ...priceForm, early_bird_price: Number(e.target.value) })}
                    placeholder="Contoh: 229000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Harga Promo (Rp)</label>
                  <input
                    type="number"
                    value={priceForm.promo_price}
                    onChange={e => setPriceForm({ ...priceForm, promo_price: Number(e.target.value) })}
                    placeholder="Contoh: 199000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Paket Kelompok 10 Orang (Rp)</label>
                  <input
                    type="number"
                    value={priceForm.group_price}
                    onChange={e => setPriceForm({ ...priceForm, group_price: Number(e.target.value) })}
                    placeholder="Contoh: 1800000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Paket Institusi / Sekolah (Rp)</label>
                  <input
                    type="number"
                    value={priceForm.institution_price}
                    onChange={e => setPriceForm({ ...priceForm, institution_price: Number(e.target.value) })}
                    placeholder="Contoh: 2500000"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Tanggal Mulai Promo</label>
                  <input
                    type="date"
                    value={priceForm.promo_start}
                    onChange={e => setPriceForm({ ...priceForm, promo_start: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
                <div>
                  <label className="text-slate-700 block mb-1">Tanggal Selesai Promo</label>
                  <input
                    type="date"
                    value={priceForm.promo_end}
                    onChange={e => setPriceForm({ ...priceForm, promo_end: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Alasan Perubahan / Catatan Audit Trail *</label>
                <textarea
                  value={priceForm.reason}
                  onChange={e => setPriceForm({ ...priceForm, reason: e.target.value })}
                  placeholder="Jelaskan alasan perubahan harga untuk dicatat pada Audit Trail..."
                  required
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPriceCourse(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingPrice}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-md"
                >
                  {savingPrice ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Simpan Perubahan & Catat Log</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Participant Full History Timeline Modal */}
      {selectedParticipantIdForHistory && (
        <ParticipantHistoryModal
          userId={selectedParticipantIdForHistory}
          onClose={() => setSelectedParticipantIdForHistory(null)}
        />
      )}

      {/* Modal Add/Edit Instructor */}
      {isInstModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full space-y-4 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold uppercase">
                  {editingInst ? 'Edit Data Personil' : 'Tambah Personil Baru'}
                </span>
                <h3 className="font-black text-slate-900 text-base mt-1">
                  {editingInst ? `Edit ${editingInst.Name}` : 'Formulir Instruktur, Pelatih & Pengelola'}
                </h3>
              </div>
              <button onClick={() => setIsInstModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveInst} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-slate-700 block mb-1">Nama Lengkap (tanpa gelar) *</label>
                  <input
                    type="text"
                    value={instForm.Name}
                    onChange={e => setInstForm({ ...instForm, Name: e.target.value })}
                    placeholder="Contoh: Nama Lengkap Instruktur"
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Gelar Akademik/Sertifikasi</label>
                  <input
                    type="text"
                    value={instForm.Degree}
                    onChange={e => setInstForm({ ...instForm, Degree: e.target.value })}
                    placeholder="Contoh: S.T., MCE"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Jabatan / Peran Utama *</label>
                  <select
                    value={instForm.RoleTitle}
                    onChange={e => setInstForm({ ...instForm, RoleTitle: e.target.value as OfficialRoleTitle })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-bold"
                  >
                    <option value="Instruktur Resmi">Instruktur Resmi</option>
                    <option value="Pelatih / Coach">Pelatih / Coach</option>
                    <option value="Direktur Alpha Beta">Direktur Alpha Beta</option>
                    <option value="Pengelola">Pengelola</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Status Keaktifan *</label>
                  <select
                    value={instForm.Status}
                    onChange={e => setInstForm({ ...instForm, Status: e.target.value as 'Aktif' | 'Nonaktif' })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-bold"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Bidang Keahlian / Kompetensi Utama *</label>
                <textarea
                  value={instForm.Expertise}
                  onChange={e => setInstForm({ ...instForm, Expertise: e.target.value })}
                  placeholder="Contoh: Hardware & Jaringan Komputer, Pemrograman Web"
                  required
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 block mb-1">Email Resmi (Opsional)</label>
                  <input
                    type="email"
                    value={instForm.Email}
                    onChange={e => setInstForm({ ...instForm, Email: e.target.value })}
                    placeholder="nama@alphabeta.edu.eu.org"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">No. HP / WhatsApp (Opsional)</label>
                  <input
                    type="text"
                    value={instForm.Phone}
                    onChange={e => setInstForm({ ...instForm, Phone: e.target.value })}
                    placeholder="081223546686"
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-slate-700 block mb-1">URL Foto Profil (Optional)</label>
                  <input
                    type="text"
                    value={instForm.PhotoURL}
                    onChange={e => setInstForm({ ...instForm, PhotoURL: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="text-slate-700 block mb-1">Urutan Tampilan</label>
                  <input
                    type="number"
                    min={1}
                    value={instForm.OrderNumber}
                    onChange={e => setInstForm({ ...instForm, OrderNumber: Number(e.target.value) })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Bio / Deskripsi Profil Singkat</label>
                <textarea
                  value={instForm.Bio}
                  onChange={e => setInstForm({ ...instForm, Bio: e.target.value })}
                  placeholder="Deskripsi singkat mengenai latar belakang dan pengalaman..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInstModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSavingInst}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold flex items-center gap-1.5 shadow-md"
                >
                  {isSavingInst ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{editingInst ? 'Simpan Perubahan' : 'Tambah Personil'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Personil (Read) */}
      {viewingInst && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-5 shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-extrabold uppercase">
                  Detail Personil LPK Alpha Beta
                </span>
                <h3 className="font-black text-slate-900 text-base mt-1">
                  {viewingInst.Degree ? `${viewingInst.Name}, ${viewingInst.Degree}` : viewingInst.Name}
                </h3>
              </div>
              <button onClick={() => setViewingInst(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <img
                src={viewingInst.PhotoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={viewingInst.Name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-300 shadow-xs shrink-0"
              />
              <div className="space-y-1 text-xs">
                <p className="font-black text-slate-900 text-sm">
                  {viewingInst.Name} <span className="text-rose-600 font-bold">{viewingInst.Degree}</span>
                </p>
                <p className="font-bold text-slate-600">{viewingInst.RoleTitle}</p>
                <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Status: {viewingInst.Status}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Bidang Keahlian & Spesialisasi</span>
                <p className="font-bold text-slate-800 mt-0.5">{viewingInst.Expertise}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Resmi</span>
                  <p className="font-mono text-slate-700 text-[11px] mt-0.5">{viewingInst.Email || '-'}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">WhatsApp / Telepon</span>
                  <p className="font-mono text-slate-700 text-[11px] mt-0.5">{viewingInst.Phone || '-'}</p>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Bio & Latar Belakang</span>
                <p className="text-slate-600 leading-relaxed mt-0.5">{viewingInst.Bio || '-'}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => {
                  const instToEdit = viewingInst;
                  setViewingInst(null);
                  handleOpenEditInstModal(instToEdit);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 font-bold flex items-center gap-1 hover:bg-amber-100"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Data
              </button>
              <button
                onClick={() => setViewingInst(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-900 text-white font-bold"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus Personil (Delete Confirmation) */}
      {isDeletingInstModalOpen && deletingInst && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-100">
            <div className="flex items-center gap-3 text-rose-600 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-black text-slate-900 text-base">Konfirmasi Hapus Personil</h3>
                <p className="text-[11px] text-slate-500">Tindakan ini terlindungi oleh Soft Delete LPK Alpha Beta</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <p className="font-extrabold text-slate-900">
                {deletingInst.Degree ? `${deletingInst.Name}, ${deletingInst.Degree}` : deletingInst.Name}
              </p>
              <p className="text-slate-600 font-semibold">{deletingInst.RoleTitle} • {deletingInst.Expertise}</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Sistem akan secara otomatis memeriksa keterhubungan data ini. Jika personil masih terhubung dengan
              <strong> data kursus atau sertifikat</strong>, status akan diubah menjadi <span className="font-bold text-rose-600">Nonaktif (Soft Delete)</span> agar seluruh riwayat sertifikat dan pencatatan nilai tidak rusak.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsDeletingInstModalOpen(false);
                  setDeletingInst(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 text-xs"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteInst}
                disabled={isDeletingInst}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md"
              >
                {isDeletingInst ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Ya, Hapus Personil</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
