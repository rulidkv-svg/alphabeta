import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award,
  Search,
  Filter,
  FileText,
  Eye,
  MessageSquare,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  Check,
  X,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { PAUD_PROGRAM_DATA } from '../../data/paudTrainingData';
import {
  PaudAssignmentSubmission,
  paudStorageService
} from '../../services/paudStorageService';

interface PaudFacilitatorPanelProps {
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PaudFacilitatorPanel: React.FC<PaudFacilitatorPanelProps> = ({
  onShowToast
}) => {
  const [submissions, setSubmissions] = useState<PaudAssignmentSubmission[]>(() =>
    paudStorageService.getAllSubmissions()
  );
  const [selectedSub, setSelectedSub] = useState<PaudAssignmentSubmission | null>(null);
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('ALL');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Grading Modal State
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [facilitatorName, setFacilitatorName] = useState<string>(
    'Vita Situ Zulaikha, S.Pd., M.Pd.'
  );

  const refreshList = () => {
    setSubmissions(paudStorageService.getAllSubmissions());
  };

  const handleOpenGrading = (sub: PaudAssignmentSubmission) => {
    setSelectedSub(sub);
    const mod = PAUD_PROGRAM_DATA.modules.find(m => m.id === sub.moduleId);
    if (mod) {
      // Initialize rubric scores from existing or default max
      const initialScores: Record<string, number> = {};
      mod.assignment.rubric.forEach(r => {
        initialScores[r.criterion] = sub.rubricScores?.[r.criterion] ?? r.weight;
      });
      setRubricScores(initialScores);
    }
    setFeedbackText(sub.feedback || '');
  };

  const calculateTotalScore = (): number => {
    return Object.values(rubricScores).reduce<number>((acc, curr) => acc + (Number(curr) || 0), 0);
  };

  const handleSaveEvaluation = (status: 'Approved' | 'Revision Required') => {
    if (!selectedSub) return;
    const totalScore = calculateTotalScore();

    paudStorageService.gradeAssignment(
      selectedSub.submissionId,
      selectedSub.userId,
      selectedSub.moduleId,
      status,
      totalScore,
      feedbackText,
      rubricScores,
      facilitatorName
    );

    refreshList();
    setSelectedSub(null);

    const message =
      status === 'Approved'
        ? `Tugas ${selectedSub.userName} berhasil disetujui dengan nilai ${totalScore}!`
        : `Permintaan revisi tugas telah dikirim kepada ${selectedSub.userName}.`;

    if (onShowToast) {
      onShowToast(message, status === 'Approved' ? 'success' : 'info');
    }
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter(sub => {
    const matchModule =
      selectedModuleFilter === 'ALL' || sub.moduleId === selectedModuleFilter;
    const matchStatus =
      selectedStatusFilter === 'ALL' || sub.status === selectedStatusFilter;
    const matchSearch =
      sub.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.submissionId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchModule && matchStatus && matchSearch;
  });

  // Metrics
  const totalSubmissions = submissions.length;
  const pendingCount = submissions.filter(
    s => s.status === 'Submitted' || s.status === 'Under Review'
  ).length;
  const approvedCount = submissions.filter(s => s.status === 'Approved').length;
  const revisionCount = submissions.filter(s => s.status === 'Revision Required').length;

  const currentMod = selectedSub
    ? PAUD_PROGRAM_DATA.modules.find(m => m.id === selectedSub.moduleId)
    : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Portal Penilaian Fasilitator & Pelatih LPK</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
            Panel Evaluasi & Review Tugas Guru PAUD
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-medium leading-relaxed">
            Kelola dan evaluasi tugas mandiri, periksa portofolio media Loose Parts, telaah video
            storytelling, dan berikan bimbingan formatif berkualitas bagi seluruh peserta pelatihan.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
            <span>Total Tugas Masuk</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900">{totalSubmissions}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span>Menunggu Penilaian</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-950">{pendingCount}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span>Telah Disetujui</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-950">{approvedCount}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold">
            <span>Perlu Revisi</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-950">{revisionCount}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari nama peserta guru, judul tugas, ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedModuleFilter}
            onChange={e => setSelectedModuleFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Modul (1 - 4)</option>
            {PAUD_PROGRAM_DATA.modules.map(m => (
              <option key={m.id} value={m.id}>
                Modul {m.number}: {m.title}
              </option>
            ))}
          </select>

          <select
            value={selectedStatusFilter}
            onChange={e => setSelectedStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          >
            <option value="ALL">Semua Status</option>
            <option value="Submitted">Menunggu Review</option>
            <option value="Approved">Disetujui (Approved)</option>
            <option value="Revision Required">Perlu Revisi</option>
          </select>
        </div>
      </div>

      {/* Submissions Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-700" />
            <span>Daftar Pengumpulan Tugas Peserta ({filteredSubmissions.length})</span>
          </h3>
          <button
            onClick={refreshList}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Ulang</span>
          </button>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-sm font-bold text-slate-700">Belum ada tugas yang cocok dengan filter</p>
            <p className="text-xs text-slate-400">
              Silakan ubah kata kunci pencarian atau filter status di atas.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredSubmissions.map(sub => {
              const mod = PAUD_PROGRAM_DATA.modules.find(m => m.id === sub.moduleId);
              return (
                <div
                  key={sub.submissionId}
                  className="p-4 sm:p-5 hover:bg-slate-50/70 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                        Modul {sub.moduleNumber || mod?.number}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        {new Date(sub.submittedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      {sub.status === 'Approved' ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" /> Disetujui (Nilai: {sub.score})
                        </span>
                      ) : sub.status === 'Revision Required' ? (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-black uppercase flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-600" /> Perlu Revisi
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-black uppercase flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" /> Perlu Dinilai
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-black text-slate-900">{sub.assignmentTitle}</h4>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium">
                      <span className="font-bold text-emerald-900 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-emerald-700" /> {sub.userName}
                      </span>
                      {sub.fileName && (
                        <span className="text-slate-500 truncate max-w-xs flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> {sub.fileName}
                        </span>
                      )}
                    </div>

                    {sub.textContent && (
                      <p className="text-xs text-slate-500 line-clamp-1 italic bg-slate-50 p-1.5 rounded-md border border-slate-100">
                        "{sub.textContent}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <button
                      onClick={() => handleOpenGrading(sub)}
                      className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{sub.status === 'Approved' ? 'Lihat / Ubah Nilai' : 'Periksa & Beri Nilai'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grading Evaluation Modal */}
      {selectedSub && currentMod && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between shrink-0">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                  Form Penilaian & Rubrik Fasilitator
                </span>
                <h3 className="text-sm sm:text-base font-black text-white line-clamp-1">
                  {selectedSub.assignmentTitle} — {selectedSub.userName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSub(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Participant & Submission Meta */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-medium">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Nama Peserta:</span>
                    <span className="font-black text-slate-900 text-xs">{selectedSub.userName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Waktu Kirim:</span>
                    <span className="font-bold text-slate-700">
                      {new Date(selectedSub.submittedAt).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {selectedSub.fileName && (
                  <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-700" />
                      <span className="font-bold text-slate-900 truncate max-w-sm">
                        {selectedSub.fileName} ({selectedSub.fileSizeMB || 1.2} MB)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-bold text-[10px]">
                      Berkas Terlampir
                    </span>
                  </div>
                )}

                {selectedSub.images && selectedSub.images.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <span className="font-bold text-slate-700 block">Dokumentasi Foto APE:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedSub.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Dokumentasi APE ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-xl border border-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {selectedSub.textContent && (
                  <div className="pt-2 border-t border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 block">Teks / Refleksi Peserta:</span>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-normal">
                      {selectedSub.textContent}
                    </div>
                  </div>
                )}

                {selectedSub.notes && (
                  <div className="text-[11px] text-slate-500 italic">
                    <strong>Catatan Peserta:</strong> {selectedSub.notes}
                  </div>
                )}
              </div>

              {/* Rubric Criteria Evaluation Sliders / Inputs */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h4 className="font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Penilaian Berdasarkan Rubrik Modul {currentMod.number}</span>
                  </h4>
                  <div className="px-3 py-1 bg-emerald-100 border border-emerald-300 rounded-xl font-black text-emerald-900 text-xs">
                    Total Nilai: <span className="text-sm">{calculateTotalScore()}</span> / 100
                  </div>
                </div>

                <div className="space-y-3">
                  {currentMod.assignment.rubric.map(rub => {
                    const currentScore = rubricScores[rub.criterion] ?? rub.weight;
                    return (
                      <div
                        key={rub.criterion}
                        className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-slate-900">{rub.criterion}</p>
                            <p className="text-[11px] text-slate-500">{rub.description}</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-black text-[10px] shrink-0">
                            Bobot: {rub.weight}%
                          </span>
                        </div>

                        <div className="flex items-center gap-3 pt-1">
                          <input
                            type="range"
                            min="0"
                            max={rub.weight}
                            value={currentScore}
                            onChange={e =>
                              setRubricScores(prev => ({
                                ...prev,
                                [rub.criterion]: Number(e.target.value)
                              }))
                            }
                            className="flex-1 accent-emerald-600 cursor-pointer"
                          />
                          <span className="w-12 text-center font-black text-emerald-800 bg-white py-1 px-2 rounded-lg border border-slate-200 text-xs">
                            {currentScore} / {rub.weight}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Feedback and Notes Area */}
              <div className="space-y-2">
                <label className="font-bold text-slate-900 block flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Umpan Balik & Catatan Konstruktif Fasilitator:</span>
                </label>
                <textarea
                  rows={3}
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="Tuliskan apresiasi, masukan perbaikan spesifik, atau penguatan konsep untuk peserta guru ini..."
                  className="w-full p-3.5 text-xs text-slate-900 bg-slate-50 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed font-medium"
                />

                {/* Quick Feedback Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      setFeedbackText(
                        'Sangat baik dan komprehensif! Penataan kegiatan dan pertanyaan pemantik sudah selaras dengan semangat Kurikulum Merdeka PAUD.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                  >
                    + Sangat Baik
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFeedbackText(
                        'Rancangan media sudah kreatif dan aman. Mohon tingkatkan variasi pertanyaan terbuka pada saat anak memainkannya.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                  >
                    + Perlu Penguatan Pertanyaan
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFeedbackText(
                        'Refleksi sudah jujur dan menyentuh. Mohon lengkapi contoh konkret kalimat instruksi positif yang akan diterapkan di kelas.'
                      )
                    }
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold"
                  >
                    + Minta Contoh Kalimat Positif
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedSub(null)}
                className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
              >
                Batal
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleSaveEvaluation('Revision Required')}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Minta Revisi Tugas</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveEvaluation('Approved')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Setujui & Terbitkan Nilai</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
