import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LogIn,
  Mail,
  Lock,
  X,
  Eye,
  EyeOff,
  Loader2,
  KeyRound,
  AlertTriangle,
  ShieldCheck,
  Headphones,
  ArrowRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '../Logo';
import { apiService } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from '../common/LanguageSelector';
import { modalVariant } from '../../utils/animations';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  initialIdentifier?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onShowToast,
  initialIdentifier = ''
}) => {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [identifier, setIdentifier] = useState(initialIdentifier);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Forgot Password View Mode
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage(t.login.identifier || 'Silakan masukkan Email atau Nomor WhatsApp Anda.');
      return;
    }
    if (!password) {
      setErrorMessage(t.login.password || 'Silakan masukkan Kata Sandi Anda.');
      return;
    }

    setLoading(true);

    try {
      const res = await login(identifier.trim(), password, rememberMe);
      if (res.success && res.user) {
        onShowToast(`Selamat datang kembali, ${res.user.Name}.`, 'success');
        onClose();
      } else {
        setErrorMessage(res.message || 'Kombinasi email/nomor WhatsApp dan kata sandi tidak sesuai.');
      }
    } catch (err: any) {
      setErrorMessage(t.common.error || 'Terjadi gangguan saat memproses login. Silakan coba beberapa saat lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotIdentifier.trim()) {
      onShowToast('Silakan masukkan email atau nomor WhatsApp terdaftar.', 'error');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await apiService.forgotPassword(forgotIdentifier.trim());
      setForgotSuccessMsg(res.message || 'Petunjuk pemulihan kata sandi telah dikirimkan ke kontak terdaftar Anda.');
      onShowToast(res.message || 'Instruksi pemulihan telah dikirim.', 'info');
    } catch (e) {
      onShowToast(t.common.error || 'Gagal mengirim instruksi pemulihan.', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariant}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-100 space-y-6 relative my-8 overflow-hidden"
      >
        {/* Top bar controls */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 -mt-1">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Portal Pembelajaran Resmi</span>
          </div>
          <div className="flex items-center gap-2">
            <LanguageSelector compact variant="light" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {isForgotPassword ? (
          /* FORGOT PASSWORD VIEW */
          <div className="space-y-5">
            <div className="text-center space-y-2 flex flex-col items-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <KeyRound className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-black text-slate-900 pt-1">Pemulihan Kata Sandi</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Masukkan alamat email atau nomor WhatsApp yang terdaftar untuk menerima tautan pemulihan.
              </p>
            </div>

            {forgotSuccessMsg ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2 text-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                <p className="font-bold">{forgotSuccessMsg}</p>
                <p className="text-slate-600 text-[11px]">
                  Silakan periksa kotak masuk/spam email atau pesan WhatsApp Anda.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setForgotSuccessMsg('');
                  }}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 transition-colors"
                >
                  Kembali ke Halaman Masuk
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="text-slate-700 block mb-1">Email atau Nomor WhatsApp Terdaftar</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={forgotIdentifier}
                      onChange={e => setForgotIdentifier(e.target.value)}
                      placeholder="contoh: peserta@email.com / 081234567890"
                      required
                      className="w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  {forgotLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Memproses Permintaan...</span>
                    </>
                  ) : (
                    <span>Kirim Instruksi Pemulihan</span>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setIsForgotPassword(false)}
                    className="text-slate-600 font-bold hover:text-slate-900 transition-colors"
                  >
                    ← Kembali ke Halaman Masuk
                  </button>

                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Admin%20LPK%20Alpha%20Beta,%20saya%20butuh%20bantuan%20reset%20kata%20sandi"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-bold hover:underline flex items-center gap-1"
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    <span>Bantuan CS</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        ) : (
          /* NORMAL LOGIN VIEW */
          <div className="space-y-5">
            <div className="text-center space-y-1.5 flex flex-col items-center">
              <Logo size="md" />
              <h2 className="text-lg font-black text-slate-900 pt-2">Masuk ke Portal Pembelajaran</h2>
              <p className="text-xs text-slate-500 max-w-xs">
                Akses kurikulum materi, lab simulator, tugas, presensi, dan sertifikasi kompetensi Anda.
              </p>
            </div>

            {/* ERROR BANNER */}
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email / Phone Login Form */}
            <form onSubmit={handleCustomSubmit} className="space-y-3.5 text-xs font-semibold">
              <div>
                <label className="text-slate-700 block mb-1">
                  Email atau Nomor WhatsApp <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder="nama@email.com / 081234567890"
                    required
                    autoComplete="username"
                    className="w-full pl-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-700 block mb-1">
                  Kata Sandi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    required
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span>Ingat saya di perangkat ini</span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setErrorMessage('');
                  }}
                  className="text-blue-600 font-extrabold hover:underline"
                >
                  Lupa Kata Sandi?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-lg shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Masuk ke Akun Saya</span>
                  </>
                )}
              </button>
            </form>

            {/* Security Guarantee Badge */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-2.5 text-[11px] text-slate-600">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 block">Sesi Terenkripsi SSL 256-Bit</span>
                <span className="text-[10px] text-slate-500">Data akun dan aktivitas pembelajaran Anda terlindungi secara aman.</span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center pt-2 border-t border-slate-100">
              <p className="text-xs text-slate-600">
                Belum memiliki akun pembelajaran?{' '}
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onSwitchToRegister();
                  }}
                  className="font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1 ml-1"
                >
                  <span>Daftar Peserta Baru</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
