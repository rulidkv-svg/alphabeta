import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  BookOpen,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Video,
  MessageSquare,
  DollarSign,
  Award,
  Shield,
  Activity,
  Calendar,
  MapPin,
  Building,
  Briefcase,
  Phone,
  Mail,
  ExternalLink,
  RefreshCw,
  Eye,
  Download,
  Printer
} from 'lucide-react';
import { apiService } from '../services/api';

interface ParticipantHistoryModalProps {
  userId: string;
  onClose: () => void;
}

export const ParticipantHistoryModal: React.FC<ParticipantHistoryModalProps> = ({ userId, onClose }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    'timeline' | 'course' | 'assignments' | 'meetings' | 'messages' | 'payments' | 'certificate' | 'audit'
  >('timeline');

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await apiService.getParticipantFullHistory(userId);
      setData(res);
    } catch (err) {
      console.error('Failed to load participant full history:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-100">
          <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-800">Memuat Riwayat Lengkap Peserta...</h3>
          <p className="text-sm text-slate-500 mt-1">Mengambil seluruh timeline pembelajaran, tugas, meeting, komunikasi, & sertifikat.</p>
        </div>
      </div>
    );
  }

  if (!data || !data.user) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800">Data Peserta Tidak Ditemukan</h3>
          <button onClick={onClose} className="mt-4 px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold">
            Tutup
          </button>
        </div>
      </div>
    );
  }

  const user = data.user;
  const course = data.courses?.[0] || {};
  const enrollment = data.enrollments?.[0] || {};
  const cert = data.certificate;
  const pay = data.payments?.[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <img
              src={user.PhotoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={user.Name}
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/10 shadow-lg"
            />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold">
                  {user.UserID}
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-300 text-xs font-medium">
                  NIK: {user.NIK || 'N/A'}
                </span>
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold ${
                  cert?.Status === 'AKTIF' || cert?.Status === 'Issued'
                    ? 'bg-emerald-500 text-white'
                    : pay?.Status === 'WAITING_CONFIRMATION' || cert?.Status === 'MENUNGGU_VERIFIKASI'
                    ? 'bg-amber-500 text-white'
                    : enrollment?.Status === 'Completed'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-600 text-white'
                }`}>
                  {cert?.Status === 'AKTIF' || cert?.Status === 'Issued'
                    ? 'SERTIFIKAT AKTIF'
                    : pay?.Status === 'WAITING_CONFIRMATION' || cert?.Status === 'MENUNGGU_VERIFIKASI'
                    ? 'SUDAH BAYAR - MENUNGGU VERIFIKASI'
                    : enrollment?.Status === 'Completed'
                    ? 'LULUS - BELUM BAYAR'
                    : 'SEDANG PROSES BELAJAR'}
                </span>
              </div>

              <h2 className="text-2xl font-bold tracking-tight text-white">{user.Name}</h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-1 gap-x-4 mt-2 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{user.Email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>+{user.Phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-amber-400" />
                  <span>{user.Bio || 'Peserta LPK Alpha Beta'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Pelatihan</p>
              <p className="text-sm font-bold text-white truncate mt-0.5">{course.Title || 'Tidak Ada'}</p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Progress Belajar</p>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-sm font-bold text-emerald-400">{enrollment.Progress || 0}%</p>
                <div className="w-16 bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full" style={{ width: `${enrollment.Progress || 0}%` }}></div>
                </div>
              </div>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Nilai Akhir</p>
              <p className="text-sm font-bold text-amber-400 mt-0.5">{enrollment.FinalScore || 0} / 100</p>
            </div>
            <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700/50">
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">No. Sertifikat</p>
              <p className="text-xs font-mono font-bold text-indigo-300 mt-0.5 truncate">{cert?.CertificateID || 'Belum Terbit'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 flex gap-2 overflow-x-auto flex-shrink-0 scrollbar-none">
          {[
            { id: 'timeline', label: 'Timeline Lengkap', icon: Clock, count: data.learningHistories?.length },
            { id: 'course', label: 'Pelatihan & Progress', icon: BookOpen },
            { id: 'assignments', label: 'Tugas & Revisi', icon: FileText, count: data.submissions?.length },
            { id: 'meetings', label: 'Google Meet / Zoom', icon: Video, count: data.meetingAttendances?.length },
            { id: 'messages', label: 'Chat & Diskusi', icon: MessageSquare, count: data.messages?.length },
            { id: 'payments', label: 'Pembayaran', icon: DollarSign, count: data.payments?.length },
            { id: 'certificate', label: 'Sertifikat', icon: Award },
            { id: 'audit', label: 'Audit Logs', icon: Shield, count: data.activityLogs?.length }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-3 text-xs sm:text-sm font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/40'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* 1. TIMELINE LENGKAP */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-indigo-950">Jalur Riwayat Aktivitas Pembelajaran (Timeline)</h4>
                  <p className="text-xs text-indigo-700 mt-0.5">Seluruh jejak digital peserta sejak pendaftaran sampai penerbitan sertifikat tercatat secara sistematis.</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-indigo-600 text-white rounded-lg">
                  {data.learningHistories?.length || 0} Aktivitas Recorded
                </span>
              </div>

              <div className="relative border-l-2 border-indigo-200 ml-4 pl-6 space-y-6 py-2">
                {data.learningHistories?.map((lh: any, idx: number) => (
                  <div key={lh.ID || idx} className="relative group">
                    {/* Timeline Node Icon */}
                    <div className="absolute -left-[33px] top-0 w-8 h-8 rounded-full bg-white border-2 border-indigo-600 flex items-center justify-center text-indigo-600 shadow-sm group-hover:scale-110 transition-transform">
                      {lh.ActivityType.includes('LOGIN') ? (
                        <User className="w-4 h-4" />
                      ) : lh.ActivityType.includes('MEETING') ? (
                        <Video className="w-4 h-4 text-emerald-600" />
                      ) : lh.ActivityType.includes('ASSIGNMENT') ? (
                        <FileText className="w-4 h-4 text-amber-600" />
                      ) : lh.ActivityType.includes('COURSE') ? (
                        <Award className="w-4 h-4 text-purple-600" />
                      ) : (
                        <BookOpen className="w-4 h-4 text-indigo-600" />
                      )}
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm hover:border-indigo-300 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1.5">
                        <span className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          {new Date(lh.StartedAt).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short'
                          })}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-slate-100 text-slate-700">
                            {lh.ActivityType}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {lh.Status}
                          </span>
                        </div>
                      </div>

                      <h5 className="text-sm font-bold text-slate-800">{lh.ActivityName}</h5>

                      {lh.Notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg mt-2 border border-slate-100 italic">
                          "{lh.Notes}"
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                        {lh.Duration && <span>⏱️ Durasi: <strong>{lh.Duration}</strong></span>}
                        {lh.Progress > 0 && <span>📈 Progress: <strong>{lh.Progress}%</strong></span>}
                        {lh.Device && <span>💻 Perangkat: <strong>{lh.Device}</strong></span>}
                        {lh.IPDummy && <span>🌐 IP: <strong>{lh.IPDummy}</strong></span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. COURSE & PROGRESS */}
          {activeTab === 'course' && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                <h4 className="text-base font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-600" />
                  Detail Program Pelatihan Terdaftar
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Judul Pelatihan</p>
                    <p className="font-bold text-slate-800 text-base mt-0.5">{course.Title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Instruktur Utama</p>
                    <p className="font-semibold text-slate-800 mt-0.5">{course.InstructorName || 'Roni Nuroni, S.T., MCE'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Tanggal Registrasi / Enrollment</p>
                    <p className="font-medium text-slate-700 mt-0.5">
                      {new Date(enrollment.EnrollmentDate || user.CreatedAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Status Pembelajaran</p>
                    <span className="inline-block mt-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                      {enrollment.Status === 'Completed' ? 'LULUS (100% Selesai)' : 'SEDANG BERJALAN'}
                    </span>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-slate-700">Overall Course Progress</span>
                    <span className="text-xs font-bold text-indigo-600">{enrollment.Progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${enrollment.Progress}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. TUGAS & REVISI */}
          {activeTab === 'assignments' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                Pengumpulan Tugas & Riwayat Penilaian
              </h4>

              {data.submissions?.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-slate-200">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 text-sm">Peserta belum mengumpulkan tugas.</p>
                </div>
              ) : (
                data.submissions?.map((sub: any, idx: number) => (
                  <div key={sub.SubmissionID || idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
                        Status: {sub.Status}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        Dikumpulkan: {new Date(sub.SubmittedAt).toLocaleString('id-ID')}
                      </span>
                    </div>

                    <p className="text-sm text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line">
                      {sub.Content}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-3 border-t border-slate-100">
                      <div>
                        <p className="text-xs text-slate-500">Nilai Tugas</p>
                        <p className="text-xl font-bold text-emerald-600 mt-0.5">{sub.Score || 0} / 100</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Feedback Instruktur</p>
                        <p className="text-xs text-slate-700 mt-0.5 italic">"{sub.Feedback || 'Tidak ada catatan.'}"</p>
                      </div>
                    </div>

                    {/* Assessment History Timeline if available */}
                    {data.assessmentHistories?.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-slate-100 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                        <p className="text-xs font-bold text-amber-900 mb-2">Riwayat Perubahan Nilai (Audit Assessment):</p>
                        {data.assessmentHistories.map((ah: any, aIdx: number) => (
                          <div key={ah.HistoryID || aIdx} className="text-xs text-amber-800 space-y-1">
                            <p>
                              • Nilai Awal <strong>{ah.ScoreBefore}</strong> → Revisi → <strong>{ah.ScoreAfter}</strong> oleh {ah.EvaluatorName} ({new Date(ah.Timestamp).toLocaleString('id-ID')})
                            </p>
                            <p className="pl-3 text-slate-600 italic">Catatan: "{ah.Feedback}"</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 4. GOOGLE MEET / ZOOM */}
          {activeTab === 'meetings' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Video className="w-5 h-5 text-emerald-600" />
                Riwayat Kehadiran Google Meet / Zoom & Rekaman Sesi
              </h4>

              {data.meetingAttendances?.map((ma: any, idx: number) => (
                <div key={ma.AttendanceID || idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold text-white ${
                        ma.AttendanceStatus === 'HADIR' ? 'bg-emerald-600' : 'bg-amber-500'
                      }`}>
                        {ma.AttendanceStatus}
                      </span>
                      <h5 className="font-bold text-slate-800 text-sm">Sesi Synchronous Web Seminar</h5>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Durasi: {ma.DurationMinutes} Menit</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <p className="text-slate-400">Join Time</p>
                      <p className="font-bold text-slate-700">{ma.JoinTime}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <p className="text-slate-400">Leave Time</p>
                      <p className="font-bold text-slate-700">{ma.LeaveTime}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <p className="text-slate-400">Keterlambatan</p>
                      <p className="font-bold text-slate-700">{ma.LateMinutes} Menit</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <p className="text-slate-400">Keaktifan</p>
                      <p className="font-bold text-emerald-600">{ma.ParticipationScore}% Active</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. MESSAGES & DISCUSSIONS */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Komunikasi dengan Instruktur & Forum Diskusi
              </h4>

              {data.messages?.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500 text-sm">Tidak ada riwayat pesan langsung.</p>
                </div>
              ) : (
                data.messages?.map((msg: any, idx: number) => (
                  <div key={msg.MessageID || idx} className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="font-bold text-indigo-900">{msg.SenderName} → {msg.ReceiverName}</span>
                      <span>{new Date(msg.Timestamp).toLocaleString('id-ID')}</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700">{msg.Subject}</p>
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line">
                      "{msg.Message}"
                    </p>
                  </div>
                ))
              )}
            </div>
          )}

          {/* 6. PAYMENTS */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                Riwayat Pembayaran & Bukti Transfer
              </h4>

              {data.payments?.length === 0 ? (
                <div className="text-center py-8 bg-white rounded-xl border border-slate-200">
                  <p className="text-slate-500 text-sm">Belum ada riwayat transaksi pembayaran.</p>
                </div>
              ) : (
                data.payments?.map((p: any, idx: number) => (
                  <div key={p.PaymentID || idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-sm">ID Pembayaran: {p.PaymentID}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                        p.Status === 'PAID' ? 'bg-emerald-600' : p.Status === 'WAITING_CONFIRMATION' ? 'bg-amber-500' : 'bg-rose-600'
                      }`}>
                        {p.Status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-slate-400">Nominal</p>
                        <p className="text-base font-bold text-emerald-600">Rp {p.Amount?.toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Catatan</p>
                        <p className="font-medium text-slate-700">{p.Note || '-'}</p>
                      </div>
                    </div>

                    {p.ProofURL && (
                      <div className="pt-2 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-1">Bukti Transfer Uploaded:</p>
                        <img src={p.ProofURL} alt="Proof" className="w-48 h-32 object-cover rounded-lg border border-slate-200" />
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* 7. CERTIFICATE */}
          {activeTab === 'certificate' && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm text-center space-y-4">
              <Award className="w-16 h-16 text-indigo-600 mx-auto" />
              <h4 className="text-lg font-bold text-slate-800">Status Sertifikat Resmi LPK Alpha Beta</h4>

              {cert ? (
                <div className="max-w-lg mx-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Nomor Sertifikat</span>
                    <span className="text-xs font-mono font-bold text-indigo-600">{cert.CertificateID}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Nama Pemilik</span>
                    <span className="text-xs font-bold text-slate-800">{cert.UserName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Status</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {cert.Status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Nilai Kelulusan</span>
                    <span className="text-xs font-bold text-emerald-600">{cert.FinalScore} ({cert.GradePredikat})</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-500">Peserta belum memiliki sertifikat resmi terbit.</p>
              )}
            </div>
          )}

          {/* 8. AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-3">
              <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Shield className="w-5 h-5 text-slate-700" />
                Catatan Audit Sistem & Log Perubahan
              </h4>

              {data.activityLogs?.map((al: any, idx: number) => (
                <div key={al.LogID || idx} className="bg-white rounded-xl p-3.5 border border-slate-200 text-xs flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{al.Action}</p>
                    <p className="text-slate-500 mt-0.5">Oleh: {al.UserName} ({al.Role}) | IP: {al.IPAddress}</p>
                  </div>
                  <span className="text-slate-400 font-mono">{new Date(al.Timestamp).toLocaleString('id-ID')}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-4 border-t border-slate-200 flex justify-between items-center flex-shrink-0">
          <p className="text-xs text-slate-500">
            ID Peserta: <strong className="font-mono text-slate-800">{user.UserID}</strong> | Tanggal Registrasi: {new Date(user.CreatedAt).toLocaleDateString('id-ID')}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-colors"
          >
            Tutup Modal
          </button>
        </div>
      </div>
    </div>
  );
};
