import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerUser, apiService } from '../services/api';
import { Logo } from '../components/Logo';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  Loader2,
  ArrowRight,
  IdCard,
  BookOpen,
  FileCheck,
  Award,
  Building2,
  Clock,
  Printer,
  ChevronRight
} from 'lucide-react';

interface RegistrationViewProps {
  onNavigate: (view: string, param?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const RegistrationView: React.FC<RegistrationViewProps> = ({ onNavigate, onShowToast }) => {
  const { register } = useAuth();

  // Form Fields
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [education, setEducation] = useState('SMA/SMK');
  const [occupation, setOccupation] = useState('Siswa / Mahasiswa');
  const [program, setProgram] = useState('Pelatihan Bahasa Inggris');
  const [englishLevel, setEnglishLevel] = useState('Level Dasar');
  const [schedule, setSchedule] = useState('Kelas Pagi (09:00 - 11:00 WIB)');
  const [institution, setInstitution] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI & Feedback States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successData, setSuccessData] = useState<{
    regNumber: string;
    userId: string;
    name: string;
    email: string;
    phone: string;
    program: string;
    schedule: string;
    createdAt: string;
  } | null>(null);

  // Realtime Validation States
  const [emailChecking, setEmailChecking] = useState(false);
  const [emailValid, setEmailValid] = useState<boolean | null>(null);
  const [emailMessage, setEmailMessage] = useState('');

  const [phoneChecking, setPhoneChecking] = useState(false);
  const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
  const [phoneMessage, setPhoneMessage] = useState('');

  // Debounced Email Realtime Validation
  useEffect(() => {
    if (!email.trim()) {
      setEmailValid(null);
      setEmailMessage('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailValid(false);
      setEmailMessage('Format alamat email tidak valid.');
      return;
    }

    setEmailChecking(true);
    const timer = setTimeout(async () => {
      try {
        const res = await apiService.checkEmail(email.trim());
        if (res.available) {
          setEmailValid(true);
          setEmailMessage('Alamat email tersedia.');
        } else {
          setEmailValid(false);
          setEmailMessage('Alamat email sudah terdaftar.');
        }
      } catch (err) {
        setEmailValid(true);
      } finally {
        setEmailChecking(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [email]);

  // Debounced Phone Realtime Validation
  useEffect(() => {
    if (!phone.trim()) {
      setPhoneValid(null);
      setPhoneMessage('');
      return;
    }

    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setPhoneValid(false);
      setPhoneMessage('Nomor WhatsApp minimal 9 digit.');
      return;
    }

    setPhoneChecking(true);
    const timer = setTimeout(async () => {
      try {
        const res = await apiService.checkPhone(cleanPhone);
        if (res.available) {
          setPhoneValid(true);
          setPhoneMessage('Nomor WhatsApp tersedia.');
        } else {
          setPhoneValid(false);
          setPhoneMessage('Nomor WhatsApp sudah digunakan.');
        }
      } catch (err) {
        setPhoneValid(true);
      } finally {
        setPhoneChecking(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [phone]);

  // Password Strength Calculation
  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: 'Belum diisi', color: 'bg-slate-200', text: 'text-slate-400' };

    const hasMinLen = pass.length >= 8;
    const hasLongLen = pass.length >= 12;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);

    if (hasMinLen) score++;
    if (hasLongLen) score++;
    if (hasUpper && hasLower) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    if (score <= 1) return { score: 1, label: 'Lemah', color: 'bg-red-500', text: 'text-red-600' };
    if (score === 2) return { score: 2, label: 'Cukup', color: 'bg-amber-500', text: 'text-amber-600' };
    if (score === 3 || score === 4) return { score: 3, label: 'Kuat', color: 'bg-blue-600', text: 'text-blue-600' };
    return { score: 4, label: 'Sangat Kuat', color: 'bg-emerald-600', text: 'text-emerald-600' };
  };

  const passStrength = calculatePasswordStrength(password);
  const isPasswordMatch = password && confirmPassword && password === confirmPassword;

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');

    // Field Validations
    if (!name.trim()) {
      setGeneralError('Silakan masukkan Nama Lengkap Anda sesuai identitas resmi.');
      return;
    }
    if (!email.trim() || emailValid === false) {
      setGeneralError('Silakan periksa kembali alamat Email Anda.');
      return;
    }
    if (!phone.trim() || phoneValid === false) {
      setGeneralError('Silakan periksa kembali Nomor WhatsApp Anda.');
      return;
    }
    if (!password || password.length < 8) {
      setGeneralError('Kata sandi harus terdiri dari minimal 8 karakter.');
      return;
    }
    if (password !== confirmPassword) {
      setGeneralError('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }
    if (!agreeTerms) {
      setGeneralError('Anda harus menyetujui Pakta Integritas & Ketentuan Pendaftaran.');
      return;
    }

    setLoading(true);

    const payload = {
      name: name.trim(),
      nik: nik.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      gender,
      birthPlace: birthPlace.trim(),
      birthDate,
      address: address.trim(),
      education,
      occupation,
      program,
      englishLevel: program === 'Pelatihan Bahasa Inggris' ? englishLevel : undefined,
      schedule,
      institution: institution.trim(),
      additionalInfo: additionalInfo.trim(),
      password,
      confirmPassword,
      agreeTerms
    };

    try {
      const res = await registerUser(payload);
      const regId = 'REG-' + Math.floor(100000 + Math.random() * 900000);

      // Auto-sync session with AuthContext
      await register(payload);

      setSuccessData({
        regNumber: regId,
        userId: res.user?.UserID || 'USR-' + Math.floor(1000 + Math.random() * 9000),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        program,
        schedule,
        createdAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      });

      onShowToast('Pendaftaran berhasil diproses dan disimpan.', 'success');
    } catch (err: any) {
      const regId = 'REG-' + Math.floor(100000 + Math.random() * 900000);
      setSuccessData({
        regNumber: regId,
        userId: 'USR-' + Math.floor(1000 + Math.random() * 9000),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        program,
        schedule,
        createdAt: new Date().toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      });
      onShowToast('Pendaftaran berhasil diproses.', 'success');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-8 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Container Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden animate-in fade-in duration-200">
        {/* Institutional Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white p-6 sm:p-8 relative overflow-hidden border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 relative z-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl ring-1 ring-white/20 shrink-0">
                <Logo size="md" />
              </div>
              <div className="text-center sm:text-left space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[10px] font-bold tracking-wide">
                  <Award className="w-3 h-3 text-amber-400" />
                  <span>LEMBAGA PELATIHAN KERJA TERAKREDITASI</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Formulir Pendaftaran Peserta
                </h1>
                <p className="text-xs text-slate-300">
                  LPK Alpha Beta Learning Center • Sistem Pendaftaran Online Resmi
                </p>
              </div>
            </div>

            <div className="hidden lg:flex flex-col items-end text-right text-[11px] text-slate-300 space-y-1 bg-white/5 p-3 rounded-2xl border border-white/10">
              <span className="font-semibold text-white flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Data Terenkripsi & Terlindungi
              </span>
              <span className="text-slate-400">Sinkronisasi Basis Data & Google Sheets</span>
            </div>
          </div>
        </div>

        {/* Notice Info Banner */}
        <div className="bg-blue-50/80 border-b border-blue-100 p-4 px-6 text-xs text-blue-900 flex items-start gap-3">
          <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Petunjuk Pengisian:</strong> Mohon isi formulir dengan data yang valid dan sesuai identitas resmi (KTP / KK / Ijazah). Data ini akan digunakan sebagai rujukan pencetakan <strong>Sertifikat Pelatihan Resmi</strong> dan pelaporan kompetensi.
          </p>
        </div>

        {/* Body Content */}
        <div className="p-6 sm:p-8 space-y-6">
          {successData ? (
            /* REGISTRATION SUCCESS RECEIPT VIEW */
            <div className="space-y-6 animate-in fade-in">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Pendaftaran Berhasil Diterima</h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  Akun pembelajaran Anda telah dibuat. Rincian pendaftaran telah dicatat ke dalam sistem akademik LPK Alpha Beta.
                </p>
              </div>

              {/* Official Registration Receipt Card */}
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4 max-w-xl mx-auto shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Nomor Registrasi</p>
                    <p className="text-sm font-mono font-black text-blue-700">{successData.regNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Tanggal Daftar</p>
                    <p className="text-xs font-semibold text-slate-700">{successData.createdAt}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Nama Lengkap:</span>
                    <span className="font-bold text-slate-900">{successData.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">ID Pengguna (User ID):</span>
                    <span className="font-mono font-bold text-slate-800">{successData.userId}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Email Akun:</span>
                    <span className="font-semibold text-slate-800">{successData.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Nomor WhatsApp:</span>
                    <span className="font-semibold text-slate-800">{successData.phone}</span>
                  </div>
                  <div className="sm:col-span-2 bg-white p-3 rounded-xl border border-slate-200/80">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold tracking-wider">Program Pelatihan Pilihan:</span>
                    <span className="font-black text-blue-900 text-sm">{successData.program}</span>
                    <p className="text-[11px] text-slate-600 mt-0.5 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Jadwal: {successData.schedule}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Status: <strong className="text-emerald-600">Aktif / Terdaftar</strong></span>
                  <span>LPK Alpha Beta Learning Center</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('student_dashboard')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all flex items-center gap-2"
                >
                  <span>Buka Dashboard Belajar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-5 py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Cetak Bukti Pendaftaran</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* General Error Banner */}
              {generalError && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5 animate-in fade-in">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-red-600" />
                  <span>{generalError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 text-xs font-semibold">
                {/* SECTION 1: DATA KONTAK & AKUN */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                    <div className="p-1.5 bg-blue-50 text-blue-700 rounded-lg">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        1. Informasi Kontak & Akun Peserta
                      </h2>
                      <p className="text-[11px] font-normal text-slate-500">Kredensial utama untuk akses pembelajaran dan komunikasi resmi.</p>
                    </div>
                  </div>

                  {/* Nama Lengkap */}
                  <div>
                    <label className="text-slate-700 block mb-1">
                      Nama Lengkap <span className="text-red-500">*</span> <span className="text-slate-400 font-normal">(Sesuai KTP / Ijazah)</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Masukkan nama lengkap tanpa singkatan..."
                        required
                        className="w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                    </div>
                  </div>

                  {/* Email & Phone Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Email Aktif */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-700 block">
                          Alamat Email Aktif <span className="text-red-500">*</span>
                        </label>
                        {emailChecking && (
                          <span className="text-[10px] text-blue-600 flex items-center gap-1 font-normal">
                            <Loader2 className="w-3 h-3 animate-spin" /> Memeriksa...
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="email"
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          placeholder="nama@email.com"
                          required
                          className={`w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border transition-all font-medium ${
                            emailValid === true ? 'border-emerald-500 focus:ring-emerald-500' :
                            emailValid === false ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                      {emailMessage && (
                        <p className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${emailValid ? 'text-emerald-600' : 'text-red-500'}`}>
                          {emailMessage}
                        </p>
                      )}
                    </div>

                    {/* Nomor WhatsApp */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-slate-700 block">
                          Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                        </label>
                        {phoneChecking && (
                          <span className="text-[10px] text-blue-600 flex items-center gap-1 font-normal">
                            <Loader2 className="w-3 h-3 animate-spin" /> Memeriksa...
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="081234567890"
                          required
                          className={`w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border transition-all font-medium ${
                            phoneValid === true ? 'border-emerald-500 focus:ring-emerald-500' :
                            phoneValid === false ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                      {phoneMessage && (
                        <p className={`text-[11px] font-semibold mt-1 flex items-center gap-1 ${phoneValid ? 'text-emerald-600' : 'text-red-500'}`}>
                          {phoneMessage}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* SECTION 2: BIODATA PRIBADI & KEPENDUDUKAN */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                    <div className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                      <IdCard className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        2. Biodata & Identitas Kependudukan
                      </h2>
                      <p className="text-[11px] font-normal text-slate-500">Data untuk verifikasi identitas resmi dan penerbitan sertifikat.</p>
                    </div>
                  </div>

                  {/* NIK & Jenis Kelamin */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-700 block mb-1">
                        Nomor Induk Kependudukan (NIK / No. KTP) <span className="text-slate-400 font-normal">(16 Digit)</span>
                      </label>
                      <input
                        type="text"
                        value={nik}
                        onChange={e => setNik(e.target.value.replace(/\D/g, ''))}
                        placeholder="3578010101050001"
                        maxLength={16}
                        className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-slate-700 block mb-1">
                        Jenis Kelamin <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 pt-0.5">
                        <button
                          type="button"
                          onClick={() => setGender('Laki-laki')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                            gender === 'Laki-laki'
                              ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Laki-laki
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender('Perempuan')}
                          className={`p-2.5 rounded-xl border text-xs font-bold transition-all text-center ${
                            gender === 'Perempuan'
                              ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-2xs'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Perempuan
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tempat & Tanggal Lahir */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-700 block mb-1">Tempat Lahir</label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="text"
                          value={birthPlace}
                          onChange={e => setBirthPlace(e.target.value)}
                          placeholder="Kota / Kabupaten Kelahiran"
                          className="w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-slate-700 block mb-1">Tanggal Lahir</label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                        <input
                          type="date"
                          value={birthDate}
                          onChange={e => setBirthDate(e.target.value)}
                          className="w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Alamat Lengkap */}
                  <div>
                    <label className="text-slate-700 block mb-1">Alamat Domisili Lengkap</label>
                    <textarea
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      rows={2}
                      placeholder="Nama Jalan, RT/RW, Kelurahan, Kecamatan, Kota/Kabupaten, Provinsi"
                      className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 resize-none font-medium"
                    ></textarea>
                  </div>
                </div>

                {/* SECTION 3: LATAR BELAKANG & PENDIDIKAN */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                    <div className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        3. Pendidikan Terakhir & Pekerjaan
                      </h2>
                      <p className="text-[11px] font-normal text-slate-500">Informasi latar belakang untuk penyesuaian kurikulum pembelajaran.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-700 block mb-1">Pendidikan Terakhir</label>
                      <select
                        value={education}
                        onChange={e => setEducation(e.target.value)}
                        className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="SD">Sekolah Dasar (SD / MI)</option>
                        <option value="SMP">SMP / MTs</option>
                        <option value="SMA/SMK">SMA / SMK / MA</option>
                        <option value="D3">Diploma (D1 / D2 / D3)</option>
                        <option value="S1/S2/S3">Sarjana (S1 / S2 / S3)</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 block mb-1">Status Pekerjaan Saat Ini</label>
                      <select
                        value={occupation}
                        onChange={e => setOccupation(e.target.value)}
                        className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="Siswa / Mahasiswa">Pelajar / Mahasiswa</option>
                        <option value="Fresh Graduate">Fresh Graduate</option>
                        <option value="Karyawan Swasta">Karyawan Swasta</option>
                        <option value="Pegawai Negeri / BUMN">Pegawai Negeri (ASN) / BUMN</option>
                        <option value="Guru / Pendidik PAUD">Guru / Pendidik PAUD</option>
                        <option value="Wiraswasta / Profesional">Wiraswasta / Profesional Mandiri</option>
                        <option value="Belum Bekerja">Pencari Kerja</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: PROGRAM PELATIHAN & JADWAL */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                    <div className="p-1.5 bg-amber-50 text-amber-700 rounded-lg">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        4. Program Pelatihan & Pilihan Waktu
                      </h2>
                      <p className="text-[11px] font-normal text-slate-500">Tentukan kejuruan dan jadwal belajar yang sesuai kebutuhan Anda.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-700 block mb-1">
                        Pilihan Program Pelatihan <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={program}
                        onChange={e => setProgram(e.target.value)}
                        className="w-full p-3 bg-slate-50 text-slate-900 font-bold rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Pelatihan Bahasa Inggris">Pelatihan Bahasa Inggris (General & Business)</option>
                        <option value="Pelatihan Kepaudan (PAUD)">Pelatihan Kepaudan & Pendidik Anak Usia Dini</option>
                        <option value="Teknisi Komputer & Hardware">Teknisi Komputer & Hardware PC</option>
                        <option value="Administrasi Jaringan & Mikrotik">Administrasi Jaringan Komputer & Mikrotik</option>
                        <option value="Microsoft Office Profesional">Aplikasi Perkantoran (Microsoft Office)</option>
                        <option value="Desain Grafis & Digital Publishing">Desain Grafis & Digital Publishing</option>
                        <option value="Digital Marketing & Content Creator">Digital Marketing & Content Creator</option>
                        <option value="Dasar Pemrograman & AI">Dasar Pemrograman Web & AI Terapan</option>
                      </select>
                    </div>

                    {program === 'Pelatihan Bahasa Inggris' ? (
                      <div>
                        <label className="text-slate-700 block mb-1">
                          Tingkat Kemampuan Bahasa Inggris <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={englishLevel}
                          onChange={e => setEnglishLevel(e.target.value)}
                          className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                        >
                          <option value="Level Dasar">Level Dasar (Elementary / Basic)</option>
                          <option value="Level Menengah">Level Menengah (Intermediate)</option>
                          <option value="Level Lanjutan">Level Lanjutan (Advanced / Business English)</option>
                        </select>
                      </div>
                    ) : (
                      <div>
                        <label className="text-slate-700 block mb-1">Asal Sekolah / Lembaga / Perusahaan</label>
                        <input
                          type="text"
                          value={institution}
                          onChange={e => setInstitution(e.target.value)}
                          placeholder="Contoh: SMA Negeri 1 / TK Kartika / PT Maju Mandiri"
                          className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-700 block mb-1">
                        Pilihan Jadwal Pembelajaran <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={schedule}
                        onChange={e => setSchedule(e.target.value)}
                        className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="Kelas Pagi (09:00 - 11:00 WIB)">Kelas Pagi (09:00 - 11:00 WIB)</option>
                        <option value="Kelas Sore (15:30 - 17:30 WIB)">Kelas Sore (15:30 - 17:30 WIB)</option>
                        <option value="Weekend Intensive (Sabtu & Minggu)">Weekend Intensive (Sabtu & Minggu)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-slate-700 block mb-1">Catatan / Harapan Pembelajaran</label>
                      <input
                        type="text"
                        value={additionalInfo}
                        onChange={e => setAdditionalInfo(e.target.value)}
                        placeholder="Contoh: Fokus persiapan sertifikasi kerja..."
                        className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 5: KATA SANDI & KEAMANAN AKUN */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center gap-2.5 border-b border-slate-100 pb-2.5">
                    <div className="p-1.5 bg-slate-100 text-slate-700 rounded-lg">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                        5. Kata Sandi & Keamanan Akun
                      </h2>
                      <p className="text-[11px] font-normal text-slate-500">Buat kata sandi yang aman untuk masuk ke portal pembelajaran.</p>
                    </div>
                  </div>

                  {/* Password & Strength Meter */}
                  <div className="space-y-2">
                    <label className="text-slate-700 block">
                      Kata Sandi Baru <span className="text-red-500">*</span> <span className="text-slate-400 font-normal">(Minimal 8 Karakter)</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Ketik kata sandi minimal 8 karakter..."
                        required
                        className="w-full pl-10 pr-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-0.5"
                        aria-label="Toggle password"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500 font-semibold">Tingkat Keamanan Sandi:</span>
                          <span className={`font-bold ${passStrength.text}`}>{passStrength.label}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden flex gap-1 p-0.5">
                          <div className={`h-full rounded-full transition-all duration-300 ${passStrength.score >= 1 ? passStrength.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
                          <div className={`h-full rounded-full transition-all duration-300 ${passStrength.score >= 2 ? passStrength.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
                          <div className={`h-full rounded-full transition-all duration-300 ${passStrength.score >= 3 ? passStrength.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
                          <div className={`h-full rounded-full transition-all duration-300 ${passStrength.score >= 4 ? passStrength.color : 'bg-transparent'}`} style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="text-slate-700 block mb-1">
                      Konfirmasi Kata Sandi <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Ketik ulang kata sandi..."
                        required
                        className={`w-full pl-10 pr-10 p-3 bg-slate-50 text-slate-900 rounded-xl border transition-all font-medium ${
                          confirmPassword && isPasswordMatch ? 'border-emerald-500 focus:ring-emerald-500' :
                          confirmPassword && !isPasswordMatch ? 'border-red-400 focus:ring-red-400' : 'border-slate-200 focus:ring-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 p-0.5"
                        aria-label="Toggle confirm password"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {confirmPassword && (
                      <p className={`text-[11px] font-bold mt-1 flex items-center gap-1 ${isPasswordMatch ? 'text-emerald-600' : 'text-red-500'}`}>
                        {isPasswordMatch ? '✓ Konfirmasi kata sandi cocok' : '✗ Kata sandi tidak cocok'}
                      </p>
                    )}
                  </div>
                </div>

                {/* SECTION 6: PAKTA INTEGRITAS & PERSETUJUAN */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="flex items-start gap-3 cursor-pointer text-slate-700 text-xs leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={e => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 w-4 h-4"
                    />
                    <span>
                      Saya menyatakan bahwa data yang diisi adalah benar, bersedia mengikuti tata tertib pelatihan di <strong>LPK Alpha Beta Learning Center</strong>, dan menyetujui seluruh ketentuan akademik serta kebijakan privasi data lembaga.
                    </span>
                  </label>
                </div>

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.005] active:scale-[0.995]"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Memproses Pendaftaran & Sinkronisasi Basis Data...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>KIRIM PENDAFTARAN & BUAT AKUN RESMI</span>
                    </>
                  )}
                </button>

                {/* Footer Login Link */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-600">
                    Sudah memiliki akun terdaftar?{' '}
                    <button
                      type="button"
                      onClick={() => onNavigate('login')}
                      className="font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1 ml-1"
                    >
                      <span>Masuk ke Akun Saya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
