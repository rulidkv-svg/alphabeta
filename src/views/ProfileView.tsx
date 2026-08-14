import React, { useState } from 'react';
import { User, Certificate } from '../types';
import { useAuth } from '../context/AuthContext';
import { DigitalCV } from '../components/career/DigitalCV';
import { UserCheck, Edit3, Save, ShieldCheck, KeyRound, Award, BookOpen, Clock, Calendar, CheckCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import { apiService } from '../services/api';

interface ProfileViewProps {
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onNavigate?: (view: string, param?: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onShowToast, onNavigate }) => {
  const { user, updateUserInContext } = useAuth();
  const [activeTab, setActiveTab] = useState<'info' | 'edit' | 'password' | 'cv'>('info');

  // Edit Profile Form State
  const [name, setName] = useState(user?.Name || '');
  const [phone, setPhone] = useState(user?.Phone || '');
  const [photoUrl, setPhotoUrl] = useState(user?.PhotoURL || '');
  const [education, setEducation] = useState(user?.Education || 'SMA/SMK');
  const [occupation, setOccupation] = useState(user?.Occupation || '');
  const [address, setAddress] = useState(user?.Address || '');
  const [bio, setBio] = useState(user?.Bio || '');
  const [skillsStr, setSkillsStr] = useState(user?.Skills?.join(', ') || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Change Password Form State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [changingPass, setChangingPass] = useState(false);

  if (!user) {
    return (
      <div className="py-16 text-center max-w-md mx-auto space-y-5">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto ring-8 ring-blue-50/50">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-slate-900">Profil & Pengaturan Akun</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Silakan masuk ke akun Anda untuk mengelola profil, CV digital, kompetensi keahlian, dan kata sandi.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate?.('login')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md shadow-blue-600/20 transition-all"
          >
            Masuk ke Akun
          </button>
          <button
            onClick={() => onNavigate?.('register')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    try {
      const skills = skillsStr.split(',').map(s => s.trim()).filter(Boolean);
      const updateData: Partial<User> = {
        Name: name,
        Phone: phone,
        PhotoURL: photoUrl,
        Education: education,
        Occupation: occupation,
        Address: address,
        Bio: bio,
        Skills: skills
      };

      const res = await apiService.updateProfile(user.UserID, updateData);
      if (res.success && res.user) {
        updateUserInContext(res.user);
        onShowToast('✅ Profil & Kompetensi berhasil diperbarui!', 'success');
        setActiveTab('info');
      } else {
        onShowToast(`Gagal update profil: ${res.message}`, 'error');
      }
    } catch (err) {
      onShowToast('Terjadi kesalahan koneksi saat menyimpan profil.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      onShowToast('❌ Masukkan password lama Anda.', 'error');
      return;
    }
    if (newPassword.length < 8) {
      onShowToast('❌ Password baru minimal 8 karakter.', 'error');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      onShowToast('❌ Password baru dan konfirmasi tidak sama.', 'error');
      return;
    }

    setChangingPass(true);

    try {
      const res = await apiService.changePassword(user.UserID, oldPassword, newPassword);
      if (res.success) {
        onShowToast('✅ Password berhasil diubah! Silakan gunakan password baru pada login berikutnya.', 'success');
        setOldPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setActiveTab('info');
      } else {
        onShowToast(`❌ ${res.message}`, 'error');
      }
    } catch (err) {
      onShowToast('Terjadi kesalahan sistem saat mengubah password.', 'error');
    } finally {
      setChangingPass(false);
    }
  };

  const sampleCertificates: Certificate[] = [
    {
      CertificateID: 'AB-2026-000123',
      UserID: user.UserID,
      UserName: user.Name,
      CourseID: 'CRS-TK01',
      CourseTitle: 'Teknisi Komputer & Perakitan PC',
      FinalScore: 92,
      IssueDate: '11 Agustus 2026',
      VerifyURL: 'https://alphabeta.edu.eu.org/verify?cert=AB-2026-000123',
      DirectorName: 'Ruli Lesmana, S.T., Gr.',
      InstructorName: 'Roni Nuroni, S.T., MCE',
      Status: 'Issued',
      QRCodeData: 'AB-2026-000123'
    }
  ];

  const formattedJoinDate = user.CreatedAt ? new Date(user.CreatedAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : '10 Januari 2026';

  const formattedLastLogin = user.LastLogin ? new Date(user.LastLogin).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '12 Agustus 2026, 15:30';

  return (
    <div className="space-y-6 py-6 max-w-4xl mx-auto">
      {/* Profile Header Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            👤 PROFIL PESERTA
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola identitas diri, keamanan akun, dan Digital CV resmi.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'info' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'edit' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Edit Profil
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'password' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔑 Ganti Password
          </button>
          <button
            onClick={() => setActiveTab('cv')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'cv' ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital CV
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & STATS */}
      {activeTab === 'info' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={user.PhotoURL}
              alt={user.Name}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-500/10 shadow-lg"
            />
            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-extrabold text-slate-900">{user.Name}</h2>
                <span className="px-3 py-1 bg-rose-50 text-rose-800 text-[10px] font-black rounded-full border border-rose-200 uppercase tracking-wider">
                  {user.Name.includes('Ruli Lesmana') ? 'Direktur Alpha Beta' : user.Role}
                </span>
                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full border border-emerald-200">
                  STATUS: {user.Status || 'Aktif'}
                </span>
              </div>

              <div className="text-xs text-slate-600 font-mono space-y-1">
                <p><strong>User ID:</strong> <span className="text-blue-700 font-bold">{user.UserID}</span></p>
                <p><strong>Jabatan Resmi:</strong> <span className="text-rose-700 font-bold">Direktur Utama LPK Alpha Beta</span></p>
                <p><strong>Email Resmi:</strong> {user.Email}</p>
                <p><strong>WhatsApp:</strong> {user.Phone}</p>
              </div>

              <p className="text-xs text-slate-700 pt-1 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                "{user.Bio || 'Direktur Utama LPK Alpha Beta - Pengelola & Penandatangan Resmi Sertifikat Kompetensi.'}"
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Joined</span>
              <p className="text-xs font-black text-slate-900">{formattedJoinDate}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Kursus Selesai</span>
              <p className="text-lg font-black text-blue-600">1 Kursus</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Sertifikat</span>
              <p className="text-lg font-black text-emerald-600">1 Kelulusan</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-1 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Last Login</span>
              <p className="text-[11px] font-extrabold text-slate-700">{formattedLastLogin}</p>
            </div>
          </div>

          {/* Detailed Info Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 text-xs">
            <h3 className="font-extrabold text-slate-900 uppercase text-xs tracking-wider text-blue-700">
              📋 Rincian Biodata Peserta
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Pendidikan Terakhir</span>
                <span className="font-bold text-slate-800">{user.Education || 'SMA/SMK'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Pekerjaan</span>
                <span className="font-bold text-slate-800">{user.Occupation || 'Siswa / Karyawan'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Alamat Domisili</span>
                <span className="font-bold text-slate-800">{user.Address || 'Surabaya, Jawa Timur'}</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 sm:col-span-2">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Daftar Keahlian Utama</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {user.Skills && user.Skills.length > 0 ? (
                    user.Skills.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 text-slate-800 rounded-lg text-[10px] font-bold">
                        ✓ {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">Belum diisi.</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDIT PROFILE */}
      {activeTab === 'edit' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <img
              src={photoUrl || user.PhotoURL}
              alt={user.Name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20"
            />
            <div>
              <h2 className="text-base font-bold text-slate-900">Edit Data Peserta</h2>
              <p className="text-xs text-slate-500">Perbarui informasi profil dan keahlian Anda.</p>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="text-slate-600 block mb-1">Nama Lengkap (Sesuai Sertifikat)</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">
                Email Login <span className="text-amber-600 font-normal">(Tidak dapat diubah langsung)</span>
              </label>
              <input
                type="text"
                value={user.Email}
                disabled
                className="w-full p-3 bg-slate-100 text-slate-500 rounded-xl border border-slate-200 cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Nomor WhatsApp / HP</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-slate-600 block mb-1">Pendidikan Terakhir</label>
                <select
                  value={education}
                  onChange={e => setEducation(e.target.value)}
                  className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="SD">SD</option>
                  <option value="SMP">SMP</option>
                  <option value="SMA/SMK">SMA / SMK</option>
                  <option value="D3">Diploma (D3)</option>
                  <option value="S1/S2/S3">Sarjana (S1/S2/S3)</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Pekerjaan Saat Ini</label>
                <input
                  type="text"
                  value={occupation}
                  onChange={e => setOccupation(e.target.value)}
                  placeholder="Siswa / Karyawan / Fresh Graduate"
                  className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Alamat Lengkap</label>
              <textarea
                value={address}
                onChange={e => setAddress(e.target.value)}
                rows={2}
                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Link Foto Profil / Google Drive</label>
              <input
                type="url"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... atau link foto Drive"
                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Bio / Deskripsi Siap Kerja</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                rows={2}
                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            <div>
              <label className="text-slate-600 block mb-1">Daftar Keahlian / Skill (Pisahkan koma)</label>
              <input
                type="text"
                value={skillsStr}
                onChange={e => setSkillsStr(e.target.value)}
                placeholder="Perakitan PC, Trobleshoot Hardware, Windows 11"
                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {savingProfile ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>⏳ Menyimpan Perubahan...</span>
                </>
              ) : (
                <span>💾 SIMPAN PERUBAHAN PROFIL</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: CHANGE PASSWORD */}
      {activeTab === 'password' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-6 animate-in fade-in duration-200">
          <div className="text-center space-y-1">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-200">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">🔑 GANTI PASSWORD AKUN</h2>
            <p className="text-xs text-slate-500">Perbarui kata sandi Anda secara berkala untuk keamanan.</p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-semibold">
            <div>
              <label className="text-slate-700 block mb-1">Password Lama</label>
              <div className="relative">
                <input
                  type={showOldPass ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                  placeholder="Masukkan password lama..."
                  required
                  className="w-full p-3 pr-10 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPass(!showOldPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Password Baru</label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Minimal 8 karakter"
                  required
                  className="w-full p-3 pr-10 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Konfirmasi Password Baru</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={e => setConfirmNewPassword(e.target.value)}
                placeholder="Ketik ulang password baru..."
                required
                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
              />
              {confirmNewPassword && (
                <p className={`text-[11px] font-bold mt-1 ${newPassword === confirmNewPassword ? 'text-emerald-600' : 'text-red-500'}`}>
                  {newPassword === confirmNewPassword ? '✅ Password baru sesuai' : '❌ Password baru dan konfirmasi tidak sama'}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={changingPass}
              className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {changingPass ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>⏳ Memperbarui Password...</span>
                </>
              ) : (
                <span>🔑 SIMPAN PASSWORD BARU</span>
              )}
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: DIGITAL CV */}
      {activeTab === 'cv' && (
        <DigitalCV user={user} certificates={sampleCertificates} />
      )}
    </div>
  );
};
