import React, { useState, useEffect } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  AlertCircle,
  Sparkles,
  FileCheck,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { apiService } from '../../services/api';
import { Certificate } from '../../types';

interface GraduationStatusCardProps {
  userId: string;
  courseId: string;
  courseTitle?: string;
  onNavigateToEvaluation?: () => void;
  onNavigateToPosttest?: () => void;
  onNavigateToAssignment?: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onViewCertificate?: (cert: Certificate) => void;
}

export const GraduationStatusCard: React.FC<GraduationStatusCardProps> = ({
  userId,
  courseId,
  courseTitle = 'Program Vokasi LPK Alpha Beta',
  onNavigateToEvaluation,
  onNavigateToPosttest,
  onNavigateToAssignment,
  onShowToast,
  onViewCertificate
}) => {
  const [data, setData] = useState<{
    isGraduated: boolean;
    enrollmentStatus: string;
    certificateStatus: string;
    certificate: Certificate | null;
    attendancePercent: number;
    materialsCompletedPercent: number;
    avgAssignmentScore: number;
    posttestScore: number;
    hasSubmittedProject: boolean;
    hasSubmittedEvaluation: boolean;
    rules: any;
    details: { label: string; passed: boolean; current: string }[];
  } | null>(null);

  const [loading, setLoading] = useState(true);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await apiService.checkGraduationStatus(userId, courseId);
      setData(res);
    } catch (e) {
      console.error('Error checking graduation status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && courseId) {
      loadStatus();
    }
  }, [userId, courseId]);

  if (loading) {
    return <div className="p-6 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">⏳ Mengecek status kelulusan...</div>;
  }

  if (!data) return null;

  const { isGraduated, certificate, details, rules } = data;

  return (
    <div className={`rounded-3xl p-6 border transition-all ${
      isGraduated
        ? 'bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white border-emerald-500/50 shadow-xl'
        : 'bg-white text-slate-900 border-slate-200/80 shadow-xs'
    }`}>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/20">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${isGraduated ? 'bg-amber-400/20 text-amber-300' : 'bg-blue-100 text-blue-700'}`}>
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${isGraduated ? 'text-amber-300' : 'text-blue-600'}`}>
              Status Kelulusan Kursus
            </span>
            <h3 className="text-base font-bold leading-tight">
              {courseTitle}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
            isGraduated
              ? 'bg-amber-400 text-slate-950 shadow-md animate-pulse'
              : 'bg-slate-100 text-slate-700'
          }`}>
            {isGraduated ? (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>LULUS RESMI</span>
              </>
            ) : (
              <>
                <Clock className="w-3.5 h-3.5" />
                <span>BELUM LULUS</span>
              </>
            )}
          </span>

          <button
            onClick={loadStatus}
            title="Cek Ulang Kelulusan"
            className={`p-2 rounded-xl transition-all ${isGraduated ? 'bg-emerald-700 hover:bg-emerald-600 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'}`}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Graduation Criteria Checklist Grid */}
      <div className="py-5 space-y-3">
        <h4 className={`text-xs font-bold uppercase tracking-wider ${isGraduated ? 'text-emerald-200' : 'text-slate-500'}`}>
          6 Persyaratan Kelulusan Otomatis:
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {details.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl flex items-center justify-between text-xs transition-all ${
                isGraduated
                  ? 'bg-emerald-950/40 border border-emerald-500/20 text-emerald-100'
                  : item.passed
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.passed ? (
                  <CheckCircle2 className={`w-4 h-4 shrink-0 ${isGraduated ? 'text-amber-300' : 'text-emerald-600'}`} />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0 text-slate-400" />
                )}
                <span className="font-semibold line-clamp-1">{item.label}</span>
              </div>

              <span className={`px-2 py-0.5 rounded-md font-extrabold text-[11px] shrink-0 ${
                item.passed
                  ? isGraduated ? 'bg-emerald-800 text-amber-200' : 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {item.current}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Graduation Action Footer */}
      <div className="pt-4 border-t border-slate-200/20 flex flex-col sm:flex-row items-center justify-between gap-3">
        {isGraduated ? (
          <>
            <p className="text-xs text-emerald-100 font-medium">
              🎉 Selamat! Anda telah memenuhi seluruh syarat kelulusan. Sertifikat berlisensi resmi siap diunduh.
            </p>

            <button
              onClick={() => {
                if (certificate && onViewCertificate) {
                  onViewCertificate(certificate);
                } else if (onShowToast) {
                  onShowToast('Sertifikat resmi sudah terbit di Dashboard Peserta!', 'success');
                }
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg flex items-center justify-center gap-2 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Sertifikat Kelulusan</span>
            </button>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2 text-xs text-amber-700 bg-amber-50 p-3 rounded-2xl border border-amber-200 w-full sm:w-auto">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Lengkapi komponen di atas agar status Anda berubah menjadi <b>LULUS</b>.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {!data.hasSubmittedEvaluation && onNavigateToEvaluation && (
                <button
                  onClick={onNavigateToEvaluation}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                >
                  Isi Evaluasi
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
