import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, ShieldAlert, GraduationCap, CheckCircle2, Award, Calendar, User, BookOpen, Printer, AlertTriangle } from 'lucide-react';
import { apiService } from '../../services/api';
import { Certificate } from '../../types';
import { CertificateView } from './CertificateView';

interface CertificateVerificationProps {
  initialCertNo?: string;
}

export const CertificateVerification: React.FC<CertificateVerificationProps> = ({ initialCertNo }) => {
  const [certNo, setCertNo] = useState(initialCertNo || 'AB-2026-000101');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ valid: boolean; certificate?: Certificate; message?: string } | null>(null);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);

  const handleVerify = async (queryCertNo?: string) => {
    const query = queryCertNo || certNo;
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    setShowCertificatePreview(false);

    try {
      const res = await apiService.verifyCertificate(query.trim());
      setResult(res);
    } catch (e) {
      setResult({ valid: false, message: 'Terjadi kesalahan sistem saat memverifikasi sertifikat.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If URL has certNo parameter or initialCertNo
    const urlParams = new URLSearchParams(window.location.search);
    const paramCertNo = urlParams.get('certNo') || urlParams.get('certId') || initialCertNo;
    if (paramCertNo) {
      setCertNo(paramCertNo);
      handleVerify(paramCertNo);
    }
  }, [initialCertNo]);

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 px-4 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 border-2 border-blue-400">
          <ShieldCheck className="w-9 h-9" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          🔍 VERIFIKASI KEASLIAN SERTIFIKAT LPK ALPHA BETA
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
          Sistem Validasi Resmi Lembaga Pelatihan Kerja (LPK) Alpha Beta (VIN: 20002320503 | NISN: K9980820). Masukkan nomor registrasi sertifikat untuk mengecek keabsahan.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white p-4 rounded-3xl shadow-xl border border-slate-200 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={certNo}
            onChange={e => setCertNo(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleVerify()}
            placeholder="Masukkan Nomor Sertifikat (Contoh: AB-2026-000101 / CERT-2026-AB-...)"
            className="w-full pl-11 pr-4 py-3 bg-slate-50 text-xs font-mono font-bold text-slate-900 rounded-2xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 uppercase"
          />
        </div>
        <button
          onClick={() => handleVerify()}
          disabled={loading}
          className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Memeriksa DB...' : 'Cek Verifikasi'}
        </button>
      </div>

      {/* Result Display */}
      {result && (
        <div className="animate-in fade-in duration-200 space-y-6">
          {result.valid && result.certificate ? (
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-200 space-y-6">
              {/* Status Banner */}
              {result.certificate.Status === 'DIBATALKAN' || result.certificate.Status === 'REVOKED' ? (
                <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-300 text-amber-900 font-bold text-sm">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                  <div>
                    <p className="text-base font-extrabold">⚠️ STATUS SERTIFIKAT: DIBATALKAN / NON-AKTIF</p>
                    <p className="text-xs text-amber-800 font-normal">
                      Sertifikat ini sebelumnya pernah diterbitkan namun telah dinonaktifkan/dibatalkan oleh Administrator LPK Alpha Beta.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 font-bold text-sm">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="text-base font-extrabold">✅ SERTIFIKAT TERVERIFIKASI RESMI &amp; VALID</p>
                    <p className="text-xs text-emerald-700 font-normal">
                      Sertifikat ini secara sah terdaftar dalam database resmi LPK Alpha Beta dengan akreditasi VIN 20002320503 &amp; NISN K9980820.
                    </p>
                  </div>
                </div>
              )}

              {/* Data Detail Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-slate-700">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-blue-600" /> Nama Peserta Lulusan
                  </span>
                  <p className="text-sm font-black text-slate-900">{result.certificate.UserName}</p>
                  {result.certificate.UserNIK && (
                    <p className="text-[10px] font-mono text-slate-500">ID/NIK: {result.certificate.UserNIK}</p>
                  )}
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" /> Program Pelatihan &amp; Penandatangan Resmi
                  </span>
                  <p className="text-xs font-extrabold text-slate-900">{result.certificate.CourseTitle}</p>
                  <p className="text-[10px] text-slate-600 font-medium">Penandatangan: <strong>Direktur Alpha Beta (Ruli Lesmana, S.T., Gr.)</strong></p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-blue-600" /> Nilai Akhir &amp; Predikat
                  </span>
                  <p className="text-xs font-bold text-emerald-700">
                    Nilai: {result.certificate.FinalScore} / 100 • Predikat: {result.certificate.GradePredikat || 'Sangat Memuaskan'}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" /> Tanggal Penerbitan
                  </span>
                  <p className="text-xs font-bold text-slate-900">{result.certificate.IssueDate}</p>
                  <p className="text-[10px] font-mono text-blue-800">NO REG: {result.certificate.CertificateID}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => setShowCertificatePreview(!showCertificatePreview)}
                  className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>{showCertificatePreview ? 'Sembunyikan Preview' : 'Tampilkan Visual Sertifikat'}</span>
                </button>
              </div>

              {/* Embedded Live Certificate Render */}
              {showCertificatePreview && (
                <div className="pt-4 border-t border-slate-200">
                  <CertificateView certificate={result.certificate} />
                </div>
              )}
            </div>
          ) : (
            <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-3 text-rose-800 max-w-xl mx-auto">
              <ShieldAlert className="w-12 h-12 text-rose-600 mx-auto" />
              <h3 className="text-base font-extrabold">❌ SERTIFIKAT TIDAK DITEMUKAN</h3>
              <p className="text-xs text-rose-700 leading-relaxed">
                Nomor sertifikat <span className="font-mono font-bold bg-rose-100 px-2 py-0.5 rounded">{certNo}</span> tidak cocok dengan data terdaftar di database LPK Alpha Beta.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
