import React from 'react';
import { Certificate } from '../../types';
import { Award, ShieldCheck, Printer, Download, CheckCircle2 } from 'lucide-react';
import { Logo } from '../Logo';
import { KemnakerLogo, KemdikdasmenLogo } from '../MinistryLogos';

interface CertificateViewProps {
  certificate: Certificate;
  onPrint?: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate, onPrint }) => {
  // Direct verification URL
  const verificationUrl = `${window.location.origin}/?view=verify&certNo=${encodeURIComponent(
    certificate.CertificateID
  )}`;

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    verificationUrl
  )}`;

  const handlePrintTrigger = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const isRevoked = certificate.Status === 'DIBATALKAN' || certificate.Status === 'REVOKED' || certificate.Status === 'DITOLAK';

  return (
    <div className="space-y-6">
      {/* Container that isolates printable element */}
      <div id="printable-certificate-container" className="w-full flex justify-center">
        <div
          id="printable-certificate"
          className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 border-[10px] border-double border-blue-950 shadow-2xl relative overflow-hidden w-full max-w-4xl min-h-[580px] flex flex-col justify-between select-none"
          style={{
            backgroundImage: 'radial-gradient(circle at center, rgba(239, 246, 255, 0.4) 0%, rgba(255, 255, 255, 1) 70%)'
          }}
        >
          {/* Decorative Corner Ornaments */}
          <div className="absolute top-2 left-2 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-xl pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-xl pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-xl pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-xl pointer-events-none"></div>

          {/* Revoked Banner Overlay */}
          {isRevoked && (
            <div className="absolute inset-0 bg-rose-950/20 backdrop-blur-[2px] z-30 flex items-center justify-center">
              <div className="bg-rose-600 text-white font-black text-2xl uppercase tracking-widest px-10 py-4 rounded-2xl shadow-2xl border-4 border-white rotate-[-12deg] flex items-center gap-3">
                <ShieldCheck className="w-8 h-8" />
                <span>SERTIFIKAT INI DIBATALKAN / NON-AKTIF</span>
              </div>
            </div>
          )}

          {/* Background Watermark Badge */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-96 h-96 text-blue-950" />
          </div>

          <div className="relative z-10 space-y-4">
            {/* Institution Header */}
            <div className="flex items-center justify-between border-b-2 border-amber-400 pb-3 gap-2">
              <div className="flex items-center gap-2 sm:gap-3">
                <Logo size="md" />
                <div>
                  <h1 className="text-xs sm:text-sm font-black text-blue-950 tracking-wider uppercase">
                    LEMBAGA PELATIHAN KERJA ALPHA BETA
                  </h1>
                  <p className="text-[10px] font-bold text-slate-600">
                    VIN: 20002320503 | NISN: K9980820 | TERAKREDITASI RESMI
                  </p>
                </div>
              </div>

              {/* Ministry Logos Endorsement */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 bg-white rounded-xl border border-slate-200 shadow-2xs">
                  <KemnakerLogo size="xs" />
                  <KemdikdasmenLogo size="xs" />
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 bg-blue-900 text-amber-300 font-black text-[10px] rounded-lg tracking-widest uppercase shadow-xs inline-block">
                    SERTIFIKAT RESMI
                  </span>
                  <p className="text-[9px] font-mono text-slate-500 mt-1">
                    ID: <span className="font-bold text-slate-800">{certificate.CertificateID}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="text-center pt-2 space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-blue-950 tracking-tight uppercase">
                SERTIFIKAT KELULUSAN &amp; KOMPETENSI
              </h2>
              <p className="text-[11px] font-serif italic text-slate-600">
                CERTIFICATE OF COMPLETION AND PROFESSIONAL COMPETENCY
              </p>
            </div>

            {/* Recipient Section */}
            <div className="text-center py-2 space-y-1">
              <p className="text-xs font-serif italic text-slate-500">Dengan bangga diberikan kepada / Awarded to:</p>
              <h3 className="text-2xl sm:text-3xl font-black text-blue-950 tracking-tight border-b-2 border-amber-400 inline-block px-10 py-0.5">
                {certificate.UserName}
              </h3>
              {certificate.UserNIK && (
                <p className="text-[10px] font-mono text-slate-500 pt-1">
                  ID Peserta / NIK: <strong className="text-slate-800">{certificate.UserNIK}</strong>
                </p>
              )}
            </div>

            {/* Course & Grade Details */}
            <div className="text-center space-y-2 max-w-2xl mx-auto text-xs text-slate-700">
              <p>
                Atas keberhasilannya memenuhi seluruh kriteria penilaian dan dinyatakan <strong className="text-emerald-800 uppercase">LULUS</strong> pada program pelatihan berbasis kompetensi:
              </p>
              <div className="bg-blue-50/90 py-2.5 px-6 rounded-2xl border border-blue-200/80 shadow-xs inline-block w-full">
                <h4 className="text-base font-extrabold text-blue-950">{certificate.CourseTitle}</h4>
              </div>

              <div className="flex items-center justify-center gap-6 text-xs font-semibold text-slate-700 pt-1">
                <span>Nilai Akhir: <strong className="text-blue-900 font-black text-sm">{certificate.FinalScore} / 100</strong></span>
                <span className="text-slate-300">•</span>
                <span>Predikat: <strong className="text-emerald-700 font-black text-sm">{certificate.GradePredikat || 'Sangat Memuaskan'}</strong></span>
              </div>
            </div>
          </div>

          {/* Single Official Signatory & Verification Section */}
          <div className="relative z-10 pt-4 grid grid-cols-2 gap-8 items-end border-t border-slate-200 mt-2">
            {/* Gold Embossed Seal & QR Code Verification */}
            <div className="flex flex-col items-center sm:items-start justify-center space-y-2 pl-2 sm:pl-6">
              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 p-1 shadow-lg flex items-center justify-center border-2 border-amber-300">
                    <div className="w-full h-full rounded-full border border-amber-600 border-dashed flex items-center justify-center bg-gradient-to-b from-amber-500 to-amber-700 text-white">
                      <Award className="w-8 h-8 text-amber-100" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={qrUrl}
                    alt="QR Code Verification"
                    className="w-14 h-14 border-2 border-slate-300 p-0.5 bg-white rounded-lg shadow-md flex-shrink-0"
                  />
                  <div className="text-left">
                    <span className="text-[9px] font-mono font-bold text-blue-900 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>VERIFIED CERTIFICATE</span>
                    </span>
                    <p className="text-[8px] font-mono text-slate-500 font-semibold mt-0.5">
                      NISN: K9980820 | VIN: 20002320503
                    </p>
                    <p className="text-[8px] font-mono text-slate-400">Scan QR untuk Cek Keaslian</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Single Official Signatory: Direktur Alpha Beta */}
            <div className="text-center flex flex-col items-center justify-end pr-2 sm:pr-6">
              <p className="text-xs font-extrabold text-slate-700 tracking-wide uppercase">
                Direktur Alpha Beta
              </p>

              <div className="relative my-1 flex items-center justify-center h-16 w-48">
                <img
                  src="/src/assets/images/director_signature_gr_1786584761059.jpg"
                  alt="Tanda Tangan Digital Ruli Lesmana, S.T., Gr."
                  className="h-14 max-w-full object-contain mix-blend-multiply filter contrast-125"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="border-b-2 border-slate-400 w-48 mx-auto mb-1"></div>

              <p className="text-sm font-black text-blue-950 tracking-tight">
                Ruli Lesmana, S.T., Gr.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-500 font-mono pt-2 border-t border-slate-100">
            <span>Diterbitkan: {certificate.IssueDate} • Bandung, Jawa Barat</span>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-semibold hidden sm:inline">Terakreditasi:</span>
              <div className="flex items-center gap-1.5 bg-white px-1.5 py-0.5 rounded-lg border border-slate-200">
                <KemnakerLogo size="xs" />
                <KemdikdasmenLogo size="xs" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 no-print">
        <button
          onClick={handlePrintTrigger}
          className="px-6 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Sertifikat (A4 Landscape)</span>
        </button>

        <a
          href={verificationUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-2 border border-slate-200"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Uji Halaman Verifikasi Public</span>
        </a>
      </div>
    </div>
  );
};
