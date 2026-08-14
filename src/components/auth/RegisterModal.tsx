import React, { useState, useEffect } from 'react';
import { Logo } from '../Logo';
import { X, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2, User, ShieldCheck, ArrowRight, Lock, Mail, Phone, IdCard, GraduationCap, Calendar, MapPin } from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: (initialIdentifier?: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onShowToast
}) => {
  const { register } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [nik, setNik] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [address, setAddress] = useState('');
  const [education, setEducation] = useState('SMA/SMK');
  const [occupation, setOccupation] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Real-time server verification states
  const [emailCheckStatus, setEmailCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [emailCheckMsg, setEmailCheckMsg] = useState('');

  const [phoneCheckStatus, setPhoneCheckStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [phoneCheckMsg, setPhoneCheckMsg] = useState('');
  const [normalizedPhone, setNormalizedPhone] = useState('');

  // Registered Success Data
  const [registeredData, setRegisteredData] = useState<{
    userId: string;
    name: string;
    email: string;
    phone: string;
  } | null>(null);

  // Phone Normalizer function
  const normalizePhoneNumber = (raw: string): string => {
    let clean = raw.replace(/\D/g, '');
    if (clean.startsWith('0')) {
      clean = '62' + clean.slice(1);
    } else if (clean.startsWith('8')) {
      clean = '628' + clean.slice(1);
    }
    return clean;
  };

  // Email Realtime check
  useEffect(() => {
    if (!email.trim()) {
      setEmailCheckStatus('idle');
      setEmailCheckMsg('');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailCheckStatus('invalid');
      setEmailCheckMsg('Format email tidak valid');
      return;
    }

    setEmailCheckStatus('checking');
    setEmailCheckMsg('Memeriksa ketersediaan email...');

    const timer = setTimeout(async () => {
      try {
        const res = await apiService.checkEmail(email.trim());
        if (res.available) {
          setEmailCheckStatus('available');
          setEmailCheckMsg('Email tersedia');
        } else {
          setEmailCheckStatus('taken');
          setEmailCheckMsg('Email sudah terdaftar');
        }
      } catch (err) {
        setEmailCheckStatus('idle');
        setEmailCheckMsg('');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [email]);

  // Phone Realtime check & Normalization
  useEffect(() => {
    if (!phone.trim()) {
      setPhoneCheckStatus('idle');
      setPhoneCheckMsg('');
      setNormalizedPhone('');
      return;
    }

    const norm = normalizePhoneNumber(phone);
    setNormalizedPhone(norm);

    if (norm.length < 10 || norm.length > 15) {
      setPhoneCheckStatus('invalid');
      setPhoneCheckMsg('Nomor WhatsApp harus 10-15 digit');
      return;
    }

    setPhoneCheckStatus('checking');
    setPhoneCheckMsg('Memeriksa nomor WhatsApp...');

    const timer = setTimeout(async () => {
      try {
        const res = await apiService.checkPhone(norm);
        if (res.available) {
          setPhoneCheckStatus('available');
          setPhoneCheckMsg(`Nomor WhatsApp tersedia (${norm})`);
        } else {
          setPhoneCheckStatus('taken');
          setPhoneCheckMsg('Nomor WhatsApp sudah digunakan');
        }
      } catch (err) {
        setPhoneCheckStatus('idle');
        setPhoneCheckMsg('');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [phone]);

  // Password Strength Calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', percent: 0 };
    if (password.length < 8) return { label: 'Password lemah (min. 8 karakter)', color: 'text-red-600 bg-red-50 border-red-200', percent: 30 };

    let score = 0;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { label: 'Password cukup', color: 'text-amber-600 bg-amber-50 border-amber-200', percent: 65 };
    return { label: 'Password kuat & aman', color: 'text-emerald-600 bg-emerald-50 border-emerald-200', percent: 100 };
  };

  const strength = getPasswordStrength();

  // Overall Form Validation Check
  const isFormValid =
    name.trim().length > 0 &&
    emailCheckStatus === 'available' &&
    phoneCheckStatus === 'available' &&
    password.length >= 8 &&
    password === confirmPassword &&
    agreeTerms;

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      onShowToast('Nama Lengkap wajib diisi sesuai KTP/Ijazah.', 'error');
      return;
    }
    if (emailCheckStatus !== 'available') {
      onShowToast('Email sudah digunakan atau format tidak valid.', 'error');
      return;
    }
    if (phoneCheckStatus !== 'available') {
      onShowToast('Nomor WhatsApp sudah digunakan atau format tidak valid.', 'error');
      return;
    }
    if (password.length < 8) {
      onShowToast('Kata sandi minimal 8 karakter.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      onShowToast('Kata sandi dan konfirmasi kata sandi tidak cocok.', 'error');
      return;
    }
    if (!agreeTerms) {
      onShowToast('Anda harus menyetujui syarat & ketentuan pendaftaran.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        name: name.trim(),
        nik: nik.trim(),
        email: email.trim().toLowerCase(),
        phone: normalizedPhone || phone.trim(),
        gender,
        birthPlace: birthPlace.trim(),
        birthDate,
        address: address.trim(),
        education,
        occupation: occupation.trim(),
        password,
        confirmPassword,
        photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        agreeTerms: true
      };

      const res = await register(payload);

      if (res.success && res.user) {
        onShowToast(`Pendaftaran Berhasil! Selamat datang, ${res.user.Name}.`, 'success');
        setRegisteredData({
          userId: res.user.UserID,
          name: res.user.Name,
          email: res.user.Email,
          phone: res.user.Phone
        });
      } else {
        onShowToast(`Pendaftaran gagal: ${res.message}`, 'error');
      }
    } catch (err: any) {
      onShowToast('Terjadi gangguan saat mendaftar. Silakan coba kembali.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-5 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-100 relative my-8 animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all z-10"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {registeredData ? (
          /* REGISTRATION SUCCESS VIEW */
          <div className="text-center space-y-6 py-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Pendaftaran Berhasil Diterima
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Selamat datang di <strong>LPK Alpha Beta Learning Center</strong>. Akun peserta Anda telah aktif dan siap digunakan.
              </p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-left space-y-2.5 max-w-md mx-auto text-xs font-medium">
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">ID Pengguna (User ID):</span>
                <span className="font-extrabold text-blue-700 font-mono text-sm">{registeredData.userId}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Nama Lengkap:</span>
                <span className="font-bold text-slate-900">{registeredData.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/60 pb-2">
                <span className="text-slate-500">Email Akun:</span>
                <span className="font-bold text-slate-900">{registeredData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nomor WhatsApp:</span>
                <span className="font-bold text-slate-900">{registeredData.phone}</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onSwitchToLogin(registeredData.email);
                }}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mx-auto"
              >
                <span>Masuk ke Akun Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM VIEW */
          <div className="space-y-6">
            <div className="text-center space-y-1.5 flex flex-col items-center border-b border-slate-100 pb-4">
              <Logo size="md" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 pt-2">
                Pendaftaran Akun Peserta Baru
              </h2>
              <p className="text-xs text-slate-500 max-w-md">
                Lengkapi identitas resmi Anda untuk aktivasi akun portal pembelajaran dan pencatatan sertifikat.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="text-slate-700 block mb-1">
                    Nama Lengkap <span className="text-red-500">*</span> <span className="text-slate-400 font-normal">(Sesuai KTP / Ijazah)</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Masukkan nama lengkap..."
                      required
                      className="w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="text-slate-700 block mb-1">
                    Email Aktif <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="nama@email.com"
                      required
                      className="w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                  {emailCheckMsg && (
                    <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                      {emailCheckStatus === 'checking' && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
                      {emailCheckStatus === 'available' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {(emailCheckStatus === 'taken' || emailCheckStatus === 'invalid') && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                      <span className={emailCheckStatus === 'available' ? 'text-emerald-600 font-bold' : emailCheckStatus === 'checking' ? 'text-blue-600' : 'text-red-500 font-bold'}>
                        {emailCheckMsg}
                      </span>
                    </div>
                  )}
                </div>

                {/* Phone WhatsApp */}
                <div>
                  <label className="text-slate-700 block mb-1">
                    Nomor WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="081234567890"
                      required
                      className="w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                  </div>
                  {phoneCheckMsg && (
                    <div className="flex items-center gap-1.5 mt-1 text-[11px]">
                      {phoneCheckStatus === 'checking' && <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />}
                      {phoneCheckStatus === 'available' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {(phoneCheckStatus === 'taken' || phoneCheckStatus === 'invalid') && <AlertCircle className="w-3.5 h-3.5 text-red-500" />}
                      <span className={phoneCheckStatus === 'available' ? 'text-emerald-600 font-bold' : phoneCheckStatus === 'checking' ? 'text-blue-600' : 'text-red-500 font-bold'}>
                        {phoneCheckMsg}
                      </span>
                    </div>
                  )}
                </div>

                {/* NIK */}
                <div>
                  <label className="text-slate-700 block mb-1">NIK / No. KTP (16 Digit)</label>
                  <div className="relative">
                    <IdCard className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={nik}
                      onChange={e => setNik(e.target.value.replace(/\D/g, ''))}
                      placeholder="3578xxxxxxxxxxxx"
                      maxLength={16}
                      className="w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div>
                  <label className="text-slate-700 block mb-1">Jenis Kelamin</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                {/* Education */}
                <div>
                  <label className="text-slate-700 block mb-1">Pendidikan Terakhir</label>
                  <select
                    value={education}
                    onChange={e => setEducation(e.target.value)}
                    className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  >
                    <option value="SD">SD / MI</option>
                    <option value="SMP">SMP / MTs</option>
                    <option value="SMA/SMK">SMA / SMK / MA</option>
                    <option value="D3">Diploma (D1/D2/D3)</option>
                    <option value="S1/S2/S3">Sarjana (S1/S2/S3)</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Occupation */}
                <div>
                  <label className="text-slate-700 block mb-1">Status Pekerjaan</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={e => setOccupation(e.target.value)}
                    placeholder="Pelajar / Mahasiswa / Karyawan"
                    className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="text-slate-700 block mb-1">
                    Kata Sandi Baru <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimal 8 karakter..."
                      required
                      className="w-full pl-10 pr-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {password && (
                    <div className="mt-1.5 space-y-1">
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            strength.percent <= 30
                              ? 'bg-red-500'
                              : strength.percent <= 65
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${strength.percent}%` }}
                        ></div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border block w-max ${strength.color}`}>
                        {strength.label}
                      </span>
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
                      placeholder="Ulangi kata sandi..."
                      required
                      className="w-full pl-10 pr-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && (
                    <p className={`text-[11px] font-bold mt-1 ${password === confirmPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                      {password === confirmPassword ? '✓ Konfirmasi cocok' : '✗ Kata sandi tidak cocok'}
                    </p>
                  )}
                </div>
              </div>

              {/* Terms Agreement Checkbox */}
              <div className="pt-2 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="agreeTermsModal"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                />
                <label htmlFor="agreeTermsModal" className="text-[11px] text-slate-600 leading-snug cursor-pointer">
                  Saya menyetujui seluruh <strong>Syarat & Ketentuan Pendaftaran</strong> di LPK Alpha Beta Learning Center dan menyatakan data yang diisi adalah benar.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !isFormValid}
                className={`w-full py-3.5 rounded-2xl font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  isFormValid && !submitting
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                }`}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Membuat akun resmi...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>DAFTAR AKUN PESERTA RESMI</span>
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-600">
                Sudah memiliki akun terdaftar?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToLogin();
                  }}
                  className="font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1 ml-1"
                >
                  <span>Masuk ke Akun</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
