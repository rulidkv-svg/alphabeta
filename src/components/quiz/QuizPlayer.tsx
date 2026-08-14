import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Award, RefreshCw, Zap } from 'lucide-react';
import { Quiz, Question } from '../../types';
import { apiService } from '../../services/api';

interface QuizPlayerProps {
  quiz: Quiz;
  userId: string;
  courseId: string;
  onComplete: (score: number, passed: boolean) => void;
}

export const QuizPlayer: React.FC<QuizPlayerProps> = ({ quiz, userId, courseId, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [finalResult, setFinalResult] = useState<{ score: number; passed: boolean } | null>(null);

  const currentQ: Question = quiz.Questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (submitted[currentQ.QuestionID]) return;
    setUserAnswers(prev => ({ ...prev, [currentQ.QuestionID]: option }));
  };

  const handleSubmitAnswer = () => {
    if (!userAnswers[currentQ.QuestionID]) return;
    setSubmitted(prev => ({ ...prev, [currentQ.QuestionID]: true }));
  };

  const handleNext = () => {
    if (currentIndex < quiz.Questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    try {
      const res = await apiService.submitQuiz({
        userId,
        quizId: quiz.QuizID,
        courseId,
        answers: userAnswers
      });

      setFinalResult({ score: res.score, passed: res.passed });
      setIsFinished(true);
      onComplete(res.score, res.passed);
    } catch (e) {
      // Fallback local calc
      let score = 0;
      quiz.Questions.forEach(q => {
        if (userAnswers[q.QuestionID] === q.CorrectAnswer) score += q.Points;
      });
      const passed = score >= quiz.PassingGrade;
      setFinalResult({ score, passed });
      setIsFinished(true);
      onComplete(score, passed);
    }
  };

  if (isFinished && finalResult) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 text-center space-y-4 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold">
          <Award className="w-8 h-8 text-amber-500" />
        </div>

        <h3 className="text-xl font-bold text-slate-900">Hasil Kuis Selesai!</h3>
        <p className="text-xs text-slate-500">{quiz.Title}</p>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 inline-block w-full">
          <div className="text-3xl font-extrabold text-blue-600 mb-1">{finalResult.score} / 100</div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
              finalResult.passed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}
          >
            {finalResult.passed ? '✅ LULUS KUIS' : '⚠️ BELUM MEMENUHI PASSING GRADE'}
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {finalResult.passed
            ? 'Selamat! Nilai Anda telah melampaui batas minimal kelulusan kuis.'
            : 'Nilai Anda belum mencapai passing grade minimal (80). Anda dapat mengulang kuis ini.'}
        </p>
      </div>
    );
  }

  const isCurrentSubmitted = submitted[currentQ.QuestionID];
  const selectedOpt = userAnswers[currentQ.QuestionID];
  const isCorrect = selectedOpt === currentQ.CorrectAnswer;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 space-y-6 max-w-2xl mx-auto">
      {/* Quiz Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{quiz.Title}</span>
          <h3 className="text-sm font-bold text-slate-900">
            Pertanyaan {currentIndex + 1} dari {quiz.Questions.length}
          </h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
          Bobot: {currentQ.Points} Poin
        </span>
      </div>

      {/* Question Text */}
      <div className="space-y-4">
        {currentQ.ImageURL && (
          <img
            src={currentQ.ImageURL}
            alt="Question"
            className="w-full h-48 object-cover rounded-2xl border border-slate-100"
          />
        )}

        <p className="text-sm font-bold text-slate-900 leading-relaxed">{currentQ.Question}</p>

        {/* Options List */}
        <div className="space-y-2.5">
          {currentQ.Options?.map((opt, idx) => {
            let optionStyle = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';

            if (selectedOpt === opt) {
              optionStyle = 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-500/20';
            }

            if (isCurrentSubmitted) {
              if (opt === currentQ.CorrectAnswer) {
                optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
              } else if (selectedOpt === opt && !isCorrect) {
                optionStyle = 'bg-rose-50 border-rose-500 text-rose-900';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelectOption(opt)}
                disabled={isCurrentSubmitted}
                className={`w-full p-3.5 rounded-2xl border text-xs text-left transition-all flex items-center justify-between ${optionStyle}`}
              >
                <span>{opt}</span>
                {isCurrentSubmitted && opt === currentQ.CorrectAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}
                {isCurrentSubmitted && selectedOpt === opt && !isCorrect && (
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Submit or Next Control */}
        {!isCurrentSubmitted ? (
          <button
            onClick={handleSubmitAnswer}
            disabled={!selectedOpt}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
          >
            Jawab Pertanyaan Ini
          </button>
        ) : (
          <div className="space-y-4 pt-2">
            <div
              className={`p-4 rounded-2xl border text-xs leading-relaxed space-y-1 ${
                isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5">
                {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                <span>{isCorrect ? 'Jawaban Anda Benar!' : 'Jawaban Belum Tepat.'}</span>
              </div>
              <p className="text-slate-700">{currentQ.Explanation}</p>
            </div>

            <button
              onClick={handleNext}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{currentIndex < quiz.Questions.length - 1 ? 'Pertanyaan Selanjutnya' : 'Selesaikan Kuis'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
