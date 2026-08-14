import React, { useState, useEffect } from 'react';
import {
  Video,
  Calendar,
  Clock,
  User,
  ExternalLink,
  CheckCircle2,
  Plus,
  Edit2,
  Trash2,
  FileText,
  PlayCircle,
  AlertCircle,
  Sparkles,
  Users,
  X
} from 'lucide-react';
import { LiveSession } from '../../types';
import { apiService } from '../../services/api';
import { INITIAL_OFFICIALS } from '../../data/initialData';

interface LiveSessionManagerProps {
  courseId?: string;
  userRole?: 'PESERTA' | 'INSTRUKTUR' | 'ADMIN' | 'PELATIH';
  userId?: string;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const LiveSessionManager: React.FC<LiveSessionManagerProps> = ({
  courseId,
  userRole = 'PESERTA',
  userId = '',
  onShowToast
}) => {
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Modal State for Instructor/Admin create/edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<Partial<LiveSession> | null>(null);

  // Modal State for Notes & Recording
  const [notesModalSession, setNotesModalSession] = useState<LiveSession | null>(null);
  const [notesText, setNotesText] = useState('');
  const [recordingUrlText, setRecordingUrlText] = useState('');

  const canManage = userRole === 'ADMIN' || userRole === 'INSTRUKTUR' || userRole === 'PELATIH';

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await apiService.getLiveSessions(courseId);
      setSessions(data || []);
    } catch (e) {
      console.error('Error loading live sessions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, [courseId]);

  const handleJoinMeeting = async (session: LiveSession) => {
    if (userId) {
      try {
        await apiService.attendLiveSession(session.SessionID, userId);
        if (onShowToast) onShowToast(`✅ Presensi dicatat untuk sesi: ${session.Title}`, 'success');
      } catch (e) {
        console.error('Auto attend error:', e);
      }
    }
    window.open(session.MeetingURL, '_blank', 'noopener,noreferrer');
  };

  const handleOpenCreateModal = () => {
    const defaultOfficial = INITIAL_OFFICIALS[0];
    const defaultInstructorName = defaultOfficial ? `${defaultOfficial.Name}, ${defaultOfficial.Degree}` : 'Belum ditentukan';
    setEditingSession({
      CourseID: courseId || 'CRS-TK01',
      Title: '',
      Description: '',
      Platform: 'GOOGLE_MEET',
      MeetingURL: '',
      MeetingID: '',
      Passcode: '',
      InstructorName: defaultInstructorName,
      Date: new Date().toISOString().split('T')[0],
      StartTime: '09:00',
      EndTime: '11:00',
      Status: 'Terjadwal'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (s: LiveSession) => {
    setEditingSession({ ...s });
    setIsModalOpen(true);
  };

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession || !editingSession.Title) return;

    try {
      const res = await apiService.saveLiveSession(editingSession);
      if (res.success) {
        if (onShowToast) onShowToast('🎉 Jadwal Tatap Muka Daring berhasil disimpan!', 'success');
        setIsModalOpen(false);
        setEditingSession(null);
        loadSessions();
      }
    } catch (e) {
      if (onShowToast) onShowToast('Gagal menyimpan jadwal meeting.', 'error');
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus jadwal tatap muka ini?')) return;
    try {
      await apiService.deleteLiveSession(sessionId);
      if (onShowToast) onShowToast('Jadwal berhasil dihapus', 'info');
      loadSessions();
    } catch (e) {
      if (onShowToast) onShowToast('Gagal menghapus jadwal.', 'error');
    }
  };

  const handleOpenNotesModal = (s: LiveSession) => {
    setNotesModalSession(s);
    setNotesText(s.Notes || '');
    setRecordingUrlText(s.RecordingURL || '');
  };

  const handleSaveNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notesModalSession) return;

    try {
      await apiService.updateLiveSessionNotes(notesModalSession.SessionID, {
        notes: notesText,
        recordingUrl: recordingUrlText
      });
      if (onShowToast) onShowToast('Catatan & rekaman pertemuan berhasil diperbarui!', 'success');
      setNotesModalSession(null);
      loadSessions();
    } catch (e) {
      if (onShowToast) onShowToast('Gagal memperbarui catatan.', 'error');
    }
  };

  const filteredSessions = sessions.filter(s => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'BERLANGSUNG') return s.Status === 'Sedang Berlangsung' || s.Status === 'Berlangsung';
    if (filterStatus === 'TERJADWAL') return s.Status === 'Terjadwal';
    if (filterStatus === 'SELESAI') return s.Status === 'Selesai';
    return true;
  });

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">⏳ Memuat jadwal tatap muka...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold text-slate-900">Jadwal Tatap Muka Daring</h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Google Meet & Zoom
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Sesi interaktif langsung bersama instruktur ahli LPK Alpha Beta
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 border-0 text-slate-700 focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">Semua Sesi ({sessions.length})</option>
            <option value="BERLANGSUNG">🔴 Sedang Berlangsung</option>
            <option value="TERJADWAL">📅 Terjadwal</option>
            <option value="SELESAI">✅ Selesai</option>
          </select>

          {canManage && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal</span>
            </button>
          )}
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300">
          <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Belum ada jadwal tatap muka daring</p>
          <p className="text-xs text-slate-500 mt-1">
            Instruktur akan menjadwalkan sesi Google Meet atau Zoom secara berkala.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map(session => {
            const isOngoing = session.Status === 'Sedang Berlangsung' || session.Status === 'Berlangsung';
            const isFinished = session.Status === 'Selesai';
            const isMeet = session.Platform === 'GOOGLE_MEET';

            return (
              <div
                key={session.SessionID}
                className={`bg-white rounded-3xl p-5 border transition-all relative flex flex-col justify-between space-y-4 ${
                  isOngoing
                    ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200/80 hover:shadow-md'
                }`}
              >
                {/* Status & Platform Header */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-3 py-1 rounded-full ${
                      isOngoing
                        ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                        : isFinished
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {isOngoing && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
                    <span>{session.Status}</span>
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-xl flex items-center gap-1 ${
                      isMeet
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>{isMeet ? 'Google Meet' : 'Zoom Meeting'}</span>
                  </span>
                </div>

                {/* Session Details */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                    {session.Title}
                  </h4>
                  {session.Description && (
                    <p className="text-xs text-slate-600 line-clamp-2">{session.Description}</p>
                  )}

                  <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{session.InstructorName}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{session.Date}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>
                        {session.StartTime} - {session.EndTime} WIB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes & Recording Indicator */}
                {(session.Notes || session.RecordingURL) && (
                  <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-700 space-y-1 border border-slate-100">
                    {session.Notes && (
                      <div className="flex items-start gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                        <p className="line-clamp-2">{session.Notes}</p>
                      </div>
                    )}
                    {session.RecordingURL && (
                      <a
                        href={session.RecordingURL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline mt-1"
                      >
                        <PlayCircle className="w-3.5 h-3.5" />
                        <span>Tonton Rekaman Pertemuan</span>
                      </a>
                    )}
                  </div>
                )}

                {/* Action Footer */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleJoinMeeting(session)}
                    className={`w-full py-2.5 px-4 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-sm transition-all ${
                      isOngoing
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <span>Gabung Pertemuan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {canManage && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenNotesModal(session)}
                        title="Catatan & Rekaman"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(session)}
                        title="Edit Sesi"
                        className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSession(session.SessionID)}
                        title="Hapus Sesi"
                        className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Create/Edit Session */}
      {isModalOpen && editingSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {editingSession.SessionID ? 'Edit Jadwal Tatap Muka' : 'Buat Jadwal Tatap Muka Daring'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSession} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Judul / Topik Pertemuan *</label>
                <input
                  type="text"
                  required
                  value={editingSession.Title || ''}
                  onChange={e => setEditingSession({ ...editingSession, Title: e.target.value })}
                  placeholder="misal: Live Webinar Orientasi & Konsep Dasar"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Deskripsi Ringkas Materi</label>
                <textarea
                  rows={2}
                  value={editingSession.Description || ''}
                  onChange={e => setEditingSession({ ...editingSession, Description: e.target.value })}
                  placeholder="Bahasan utama dalam sesi tatap muka daring..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Platform *</label>
                  <select
                    value={editingSession.Platform || 'GOOGLE_MEET'}
                    onChange={e =>
                      setEditingSession({
                        ...editingSession,
                        Platform: e.target.value as any,
                        MeetingURL:
                          e.target.value === 'ZOOM'
                            ? 'https://zoom.us/j/8291029384'
                            : 'https://meet.google.com/abc-defg-hij'
                      })
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
                  >
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="ZOOM">Zoom Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Status Sesi *</label>
                  <select
                    value={editingSession.Status || 'Terjadwal'}
                    onChange={e => setEditingSession({ ...editingSession, Status: e.target.value as any })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 font-bold"
                  >
                    <option value="Terjadwal">📅 Terjadwal</option>
                    <option value="Sedang Berlangsung">🔴 Sedang Berlangsung</option>
                    <option value="Selesai">✅ Selesai</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Link Pertemuan (Meeting URL) *</label>
                <input
                  type="url"
                  required
                  value={editingSession.MeetingURL || ''}
                  onChange={e => setEditingSession({ ...editingSession, MeetingURL: e.target.value })}
                  placeholder="https://meet.google.com/xyz atau https://zoom.us/j/12345"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Nama Instruktur / Host *</label>
                <select
                  required
                  value={editingSession.InstructorName || 'Belum ditentukan'}
                  onChange={e => setEditingSession({ ...editingSession, InstructorName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Belum ditentukan">-- Belum ditentukan --</option>
                  {INITIAL_OFFICIALS.map((off) => (
                    <option key={off.ID} value={`${off.Name}, ${off.Degree}`}>
                      {off.Name}, {off.Degree} ({off.RoleTitle} - {off.Expertise.split(',')[0]})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Tanggal *</label>
                  <input
                    type="date"
                    required
                    value={editingSession.Date || ''}
                    onChange={e => setEditingSession({ ...editingSession, Date: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mulai *</label>
                  <input
                    type="time"
                    required
                    value={editingSession.StartTime || '09:00'}
                    onChange={e => setEditingSession({ ...editingSession, StartTime: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Selesai *</label>
                  <input
                    type="time"
                    required
                    value={editingSession.EndTime || '11:00'}
                    onChange={e => setEditingSession({ ...editingSession, EndTime: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md"
                >
                  Simpan Jadwal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Notes & Recording */}
      {notesModalSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Catatan & Rekaman: {notesModalSession.Title}
              </h3>
              <button
                onClick={() => setNotesModalSession(null)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNotes} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Catatan Hasil Pertemuan</label>
                <textarea
                  rows={4}
                  value={notesText}
                  onChange={e => setNotesText(e.target.value)}
                  placeholder="Rangkuman poin penting, instruksi tugas, atau jawaban diskusi..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Link Rekaman Video Pertemuan (Optional)</label>
                <input
                  type="url"
                  value={recordingUrlText}
                  onChange={e => setRecordingUrlText(e.target.value)}
                  placeholder="https://drive.google.com/... atau link YouTube unlisted"
                  className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setNotesModalSession(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
