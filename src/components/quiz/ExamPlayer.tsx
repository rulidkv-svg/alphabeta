import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, AlertCircle, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { Exam, Certificate } from '../../types';
import { apiService } from '../../services/api';

interface ExamPlayerProps {
  exam: Exam;
  userId: string;
  courseId: string;
  onExamPassed: (cert: Certificate) => void;
}

export const ExamPlayer: React.FC<ExamPlayerProps> = ({ exam, userId, courseId, onExamPassed }) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [examResult, setExamResult] = useState<{
    score: number;
    passed: boolean;
    certificate?: Certificate;
  } | null>(null);

  const handleSelectOption = (questionId: string, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmitExam = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await apiService.submitExam({
        userId,
        examId: exam.ExamID,
        courseId,
        answers
      });

      setExamResult({
        score: res.score,
        passed: res.passed,
        certificate: res.certificate
      });

      if (res.passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        if (res.certificate) {
          onExamPassed(res.certificate);
        }
      }
    } catch (e) {
      console.error('Error submitting exam:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const isAllAnswered = answeredCount === exam.Questions.length;

  if (examResult) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-center space-y-6 max-w-xl mx-auto animate-in fade-in duration-300">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center shadow-lg shadow-amber-500/10">
          <Award className="w-10 h-10 text-amber-500" />
        </div>

        <div>
          <h3 className="text-2xl font-extrabold text-slate-900">
            {examResult.passed ? '🎉 SELAMAT! ANDA LULUS UJIAN' : '⚠️ HASIL UJIAN AKHIR'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">{exam.Title}</p>
        </div>

        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/80 space-y-2">
          <div className="text-4xl font-extrabold text-blue-600">{examResult.score} / 100</div>
          <p className="text-xs font-semibold text-slate-500">
            Batas Kelulusan Minimal (Passing Grade): {exam.PassingGrade || 80}%
          </p>
          <span
            className={`px-4 py-1.5 rounded-full text-xs font-extrabold inline-block mt-2 ${
              examResult.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {examResult.passed ? '✅ STATUS: KELULUSAN TERVERIFIKASI' : '❌ STATUS: BELUM MEMENUHI SYARAT'}
          </span>
        </div>

        {examResult.passed && examResult.certificate && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-left space-y-2 text-xs text-emerald-900">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Sertifikat Kelulusan Resmi Diterbitkan!</span>
            </div>
            <p>
              Nomor Sertifikat: <strong className="font-mono">{examResult.certificate.CertificateID}</strong>
            </p>
            <p>Sertifikat ini telah tersimpan secara resmi di database LPK Alpha Beta dan terhubung ke QR Code verifikasi publik.</p>
          </div>
        )}

        {!examResult.passed ? (
          <div className="space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Anda belum mencapai passing grade minimum <strong>{exam.PassingGrade || 80}%</strong>. Jangan berkecil hati, pelajari kembali materi dan Anda dapat mengulang ujian ini.
            </p>
            <button
              onClick={() => {
                setExamResult(null);
                setAnswers({});
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 mx-auto"
            >
              🔄 ULANGI UJIAN AKHIR
            </button>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            <button
              onClick={async () => {
                if (examResult.certificate) {
                  try {
                    await apiService.createCertificatePayment({
                      userId,
                      courseId,
                      certificateId: examResult.certificate.CertificateID
                    });
                  } catch (e) {
                    console.error('Error creating payment record:', e);
                  }

                  const waNum = '081223546686';
                  const msg = encodeURIComponent(
                    `Halo Admin Alpha Beta Learning Center.\n\nSaya ingin melakukan pembayaran untuk cetak sertifikat fisik.\n\nNama: ${examResult.certificate.UserName}\nKursus: ${examResult.certificate.CourseTitle}\nNomor Sertifikat: ${examResult.certificate.CertificateID}\nBiaya: Rp 50.000\n\nMohon informasi pembayaran selanjutnya.\n\nTerima kasih.`
                  );
                  window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
                }
              }}
              className="w-full px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
            >
              💬 BAYAR / KONFIRMASI CETAK SERTIFIKAT VIA WHATSAPP (081223546686)
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-100 space-y-8 max-w-3xl mx-auto">
      {/* Exam Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 uppercase tracking-wider">
              Ujian Akhir Kelulusan
            </span>
            <h3 className="text-lg font-bold text-slate-900">{exam.Title}</h3>
          </div>
          <p className="text-xs text-slate-500 mt-1">{exam.Description}</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <Clock className="w-4 h-4 text-blue-600" />
          <span>Passing Grade: {exam.PassingGrade}%</span>
        </div>
      </div>

      {/* Questions Form */}
      <div className="space-y-6">
        {exam.Questions.map((q, idx) => (
          <div key={q.QuestionID} className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-bold text-slate-900 leading-relaxed">
                <span className="text-blue-600 font-extrabold mr-1.5">{idx + 1}.</span>
                {q.Question}
              </p>
              <span className="text-[10px] font-bold text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {q.Points} Poin
              </span>
            </div>

            <div className="space-y-2 pt-1">
              {q.Options?.map((opt, optIdx) => {
                const isSelected = answers[q.QuestionID] === opt;
                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(q.QuestionID, opt)}
                    className={`w-full p-3 rounded-xl border text-xs text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span>{opt}</span>
                    <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[10px]">
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-medium text-slate-500">
          Terjawab: <strong className="text-slate-900">{answeredCount}</strong> dari {exam.Questions.length} Soal
        </span>

        <button
          onClick={handleSubmitExam}
          disabled={!isAllAnswered || isSubmitting}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <span>Menghitung Nilai Kelulusan...</span>
          ) : (
            <>
              <span>Kirim & Evaluasi Ujian Akhir</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
