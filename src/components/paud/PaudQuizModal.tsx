import React, { useState } from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  Sparkles,
  Info,
  Check
} from 'lucide-react';
import { PaudModuleData } from '../../data/paudTrainingData';
import { PaudQuizResult } from '../../services/paudStorageService';

interface PaudQuizModalProps {
  module: PaudModuleData;
  previousResult?: PaudQuizResult;
  onSaveResult: (score: number, passed: boolean, answers: Record<string, string>) => void;
  onClose: () => void;
}

export const PaudQuizModal: React.FC<PaudQuizModalProps> = ({
  module,
  previousResult,
  onSaveResult,
  onClose
}) => {
  const questions = module.quiz.questions;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>(
    previousResult?.answers || {}
  );
  const [isSubmitted, setIsSubmitted] = useState(Boolean(previousResult?.passed));
  const [calculatedScore, setCalculatedScore] = useState<number>(previousResult?.score || 0);

  const currentQ = questions[currentIdx];
  const allAnswered = questions.every(q => selectedAnswers[q.id]);

  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQ.id]: key
    }));
  };

  const calculateResults = () => {
    let correct = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    const score = Math.round((correct / questions.length) * 100);
    const passed = score >= module.quiz.passingScore;

    setCalculatedScore(score);
    setIsSubmitted(true);
    onSaveResult(score, passed, selectedAnswers);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIdx(0);
    setCalculatedScore(0);
  };

  const correctCount = questions.filter(q => selectedAnswers[q.id] === q.correctAnswer).length;
  const isPassed = calculatedScore >= module.quiz.passingScore;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <HelpCircle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">
                Kuis Modul {module.number}
              </span>
              <h3 className="text-sm sm:text-base font-black text-white line-clamp-1">
                {module.quiz.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Score Result Banner if submitted */}
          {isSubmitted ? (
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              <div
                className={`p-6 rounded-3xl border text-center space-y-3 ${
                  isPassed
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white shadow-lg ${
                    isPassed ? 'bg-emerald-600 shadow-emerald-500/30' : 'bg-rose-600 shadow-rose-500/30'
                  }`}
                >
                  {isPassed ? <Award className="w-8 h-8" /> : <RotateCcw className="w-8 h-8" />}
                </div>

                <div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-1 ${
                      isPassed
                        ? 'bg-emerald-200/80 text-emerald-900'
                        : 'bg-rose-200/80 text-rose-900'
                    }`}
                  >
                    {isPassed ? '🎉 Lulus Kuis' : '⚠️ Belum Lulus (Minimal 70)'}
                  </span>
                  <h4 className="text-2xl font-black">
                    Skor Anda: <span className="text-3xl">{calculatedScore}</span> / 100
                  </h4>
                  <p className="text-xs mt-1 text-slate-600 font-medium">
                    Benar {correctCount} dari {questions.length} Soal (Standar Kelulusan:{' '}
                    {module.quiz.passingScore})
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleRetake}
                    className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ulangi Kuis</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Selesai & Tutup</span>
                  </button>
                </div>
              </div>

              {/* Review Questions Breakdown */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h5 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <Info className="w-4 h-4 text-emerald-600" />
                    <span>Pembahasan & Kunci Jawaban Lengkap ({questions.length} Soal)</span>
                  </h5>
                </div>

                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const userAns = selectedAnswers[q.id];
                    const isCorrect = userAns === q.correctAnswer;
                    return (
                      <div
                        key={q.id}
                        className={`p-4 rounded-2xl border text-xs space-y-2.5 transition-all ${
                          isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-bold text-slate-900">
                            {idx + 1}. {q.question}
                          </p>
                          <span
                            className={`shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                              isCorrect
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Benar
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3 text-rose-600" /> Salah
                              </>
                            )}
                          </span>
                        </div>

                        {/* Options List */}
                        <div className="space-y-1.5 pl-2">
                          {q.options.map(opt => {
                            const isUserChoice = userAns === opt.key;
                            const isKey = q.correctAnswer === opt.key;
                            return (
                              <div
                                key={opt.key}
                                className={`p-2 rounded-xl text-[11px] font-medium flex items-center gap-2 ${
                                  isKey
                                    ? 'bg-emerald-100/90 text-emerald-950 font-bold border border-emerald-300'
                                    : isUserChoice && !isCorrect
                                    ? 'bg-rose-100 text-rose-900 line-through border border-rose-300'
                                    : 'text-slate-600 bg-white/60'
                                }`}
                              >
                                <span className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {opt.key}
                                </span>
                                <span>{opt.text}</span>
                                {isKey && (
                                  <span className="ml-auto text-[10px] text-emerald-800 font-extrabold uppercase">
                                    (Kunci)
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-[11px] leading-relaxed">
                          <strong>💡 Pembahasan:</strong> {q.explanation}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Active Quiz Solver Screen */
            <div className="space-y-6">
              {/* Progress and Question Counter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>
                    Soal <strong className="text-emerald-700">{currentIdx + 1}</strong> dari {questions.length}
                  </span>
                  <span>{Object.keys(selectedAnswers).length} Terjawab</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${((currentIdx + 1) / questions.length) * 100}%`
                    }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">
                  Pertanyaan #{currentIdx + 1}
                </span>
                <p className="text-xs sm:text-sm font-black text-slate-900 leading-relaxed">
                  {currentQ.question}
                </p>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map(opt => {
                  const isSelected = selectedAnswers[currentQ.id] === opt.key;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleSelectOption(opt.key)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center gap-3 text-xs font-semibold ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <span
                        className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${
                          isSelected ? 'bg-white text-emerald-700' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {opt.key}
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Question Navigation Bubbles */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-400 mb-2">Navigasi Nomor Soal:</p>
                <div className="flex flex-wrap gap-1.5">
                  {questions.map((q, idx) => {
                    const isAns = Boolean(selectedAnswers[q.id]);
                    const isCurr = idx === currentIdx;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(idx)}
                        className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                          isCurr
                            ? 'ring-2 ring-emerald-500 bg-emerald-600 text-white'
                            : isAns
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        {!isSubmitted && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
            <button
              onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
              disabled={currentIdx === 0}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold disabled:opacity-40 flex items-center gap-1 hover:bg-slate-100"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-600/20"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={calculateResults}
                disabled={!allAnswered}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Selesaikan & Kumpulkan Kuis</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
