import React, { useState } from 'react';
import { Star, MessageSquare, Send, X, CheckCircle2 } from 'lucide-react';
import { apiService } from '../../services/api';

interface CourseEvaluationModalProps {
  courseId: string;
  userId: string;
  courseTitle?: string;
  onClose: () => void;
  onSuccess: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const CourseEvaluationModal: React.FC<CourseEvaluationModalProps> = ({
  courseId,
  userId,
  courseTitle = 'Program Vokasi',
  onClose,
  onSuccess,
  onShowToast
}) => {
  const [ratingMaterial, setRatingMaterial] = useState(5);
  const [ratingInstructor, setRatingInstructor] = useState(5);
  const [ratingPlatform, setRatingPlatform] = useState(5);
  const [feedbackMaterial, setFeedbackMaterial] = useState('Materi sangat terstruktur, jelas, dan aplikatif untuk dunia kerja.');
  const [feedbackInstructor, setFeedbackInstructor] = useState('Instruktur sangat kompeten dan membantu proses belajar.');
  const [suggestions, setSuggestions] = useState('Pertahankan kualitas pelayanan LPK Alpha Beta.');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiService.submitCourseEvaluation({
        courseId,
        userId,
        ratingMaterial,
        ratingInstructor,
        ratingPlatform,
        feedbackMaterial,
        feedbackInstructor,
        suggestions
      });

      if (res.success) {
        if (onShowToast) onShowToast('🎉 Evaluasi kursus berhasil dikirimkan!', 'success');
        onSuccess();
        onClose();
      }
    } catch (e) {
      if (onShowToast) onShowToast('Gagal mengirimkan evaluasi.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarPicker = (val: number, setVal: (n: number) => void) => (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => setVal(star)}
          className="p-1 transition-transform hover:scale-110 focus:outline-hidden"
        >
          <Star
            className={`w-6 h-6 ${
              star <= val ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
            }`}
          />
        </button>
      ))}
      <span className="text-xs font-bold text-slate-700 ml-2">{val} / 5</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              Evaluasi & Feedback Peserta
            </span>
            <h3 className="text-base font-bold text-slate-900">{courseTitle}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Rating 1: Materi */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <label className="font-bold text-slate-800 block">1. Penilaian Kualitas Materi & Modul</label>
            {renderStarPicker(ratingMaterial, setRatingMaterial)}
            <input
              type="text"
              value={feedbackMaterial}
              onChange={e => setFeedbackMaterial(e.target.value)}
              placeholder="Pendapat Anda tentang materi..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
            />
          </div>

          {/* Rating 2: Instruktur */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <label className="font-bold text-slate-800 block">2. Penilaian Kinerja Instruktur</label>
            {renderStarPicker(ratingInstructor, setRatingInstructor)}
            <input
              type="text"
              value={feedbackInstructor}
              onChange={e => setFeedbackInstructor(e.target.value)}
              placeholder="Pendapat Anda tentang pengajaran instruktur..."
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
            />
          </div>

          {/* Rating 3: Platform */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <label className="font-bold text-slate-800 block">3. Kemudahan Platform LMS Alpha Beta</label>
            {renderStarPicker(ratingPlatform, setRatingPlatform)}
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Saran & Masukan Tambahan</label>
            <textarea
              rows={3}
              value={suggestions}
              onChange={e => setSuggestions(e.target.value)}
              placeholder="Masukan untuk perbaikan LPK Alpha Beta ke depan..."
              className="w-full p-2.5 rounded-xl border border-slate-200"
            ></textarea>
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
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold shadow-md flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Sending...' : 'Kirim Evaluasi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
