import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Save, X, Award } from 'lucide-react';
import { apiService } from '../../services/api';
import { GraduationRules } from '../../types';

interface GraduationRulesConfigModalProps {
  courseId: string;
  courseTitle?: string;
  onClose: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GraduationRulesConfigModal: React.FC<GraduationRulesConfigModalProps> = ({
  courseId,
  courseTitle = 'Kursus',
  onClose,
  onShowToast
}) => {
  const [rules, setRules] = useState<GraduationRules>({
    minAttendancePercent: 80,
    requireAllMaterials: true,
    minAssignmentScore: 75,
    minPosttestScore: 75,
    requireProjectSubmitted: true,
    requireEvaluationCompleted: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadRules = async () => {
      try {
        const data = await apiService.getGraduationRules(courseId);
        if (data) setRules(data);
      } catch (e) {
        console.error('Error loading graduation rules:', e);
      } finally {
        setLoading(false);
      }
    };
    loadRules();
  }, [courseId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await apiService.saveGraduationRules(courseId, rules);
      if (res.success) {
        if (onShowToast) onShowToast('🎉 Persyaratan kelulusan berhasil diperbarui!', 'success');
        onClose();
      }
    } catch (e) {
      if (onShowToast) onShowToast('Gagal menyimpan aturan kelulusan.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">⏳ Memuat konfigurasi kelulusan...</div>;
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Pengaturan Syarat Kelulusan</h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{courseTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">Presensi Kehadiran Minimal (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={rules.minAttendancePercent}
              onChange={e => setRules({ ...rules, minAttendancePercent: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">Minimal persentase presensi yang harus dipenuhi peserta (default 80%).</span>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Nilai Rata-Rata Tugas Minimal</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={rules.minAssignmentScore}
              onChange={e => setRules({ ...rules, minAssignmentScore: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">Passing grade untuk tugas harian (default 75).</span>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">Nilai Posttest / Ujian Akhir Minimal</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={rules.minPosttestScore}
              onChange={e => setRules({ ...rules, minPosttestScore: Number(e.target.value) })}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-bold text-slate-900"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">Passing grade untuk Ujian Akhir Posttest (default 75).</span>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-slate-50">
              <input
                type="checkbox"
                checked={rules.requireAllMaterials}
                onChange={e => setRules({ ...rules, requireAllMaterials: e.target.checked })}
                className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500"
              />
              <span className="font-bold text-slate-800">Wajib menyelesaikan 100% materi pembelajaran</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-slate-50">
              <input
                type="checkbox"
                checked={rules.requireProjectSubmitted}
                onChange={e => setRules({ ...rules, requireProjectSubmitted: e.target.checked })}
                className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500"
              />
              <span className="font-bold text-slate-800">Wajib mengumpulkan Tugas Praktik / Proyek Akhir</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl hover:bg-slate-50">
              <input
                type="checkbox"
                checked={rules.requireEvaluationCompleted}
                onChange={e => setRules({ ...rules, requireEvaluationCompleted: e.target.checked })}
                className="w-4 h-4 rounded-md text-blue-600 focus:ring-blue-500"
              />
              <span className="font-bold text-slate-800">Wajib mengisi survei Evaluasi Kursus</span>
            </label>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Simpan Persyaratan'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
