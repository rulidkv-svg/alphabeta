import React, { useRef } from 'react';
import {
  Award,
  Download,
  Printer,
  Share2,
  CheckCircle2,
  X,
  ShieldCheck,
  Sparkles,
  QrCode
} from 'lucide-react';

interface PaudCertificateModalProps {
  certificate: {
    certificateId: string;
    certificateNumber: string;
    issueDate: string;
    finalScore: number;
    gradePredikat: string;
    facilitatorName: string;
    directorName: string;
    verifyUrl: string;
    qrCodeData: string;
  };
  userName: string;
  onClose: () => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PaudCertificateModal: React.FC<PaudCertificateModalProps> = ({
  certificate,
  userName,
  onClose,
  onShowToast
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Sertifikat Resmi Pelatihan Guru PAUD - ${userName}`,
          text: `Saya telah resmi lulus Pelatihan Guru PAUD Berstandar Alpha Beta Learning Center!`,
          url: certificate.verifyUrl
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(certificate.verifyUrl);
      if (onShowToast) {
        onShowToast('Tautan verifikasi sertifikat berhasil disalin ke clipboard!', 'success');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[96vh]">
        {/* Header Bar */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-300">
                Sertifikat Kompetensi Resmi
              </span>
              <h3 className="text-xs sm:text-sm font-black text-white line-clamp-1">
                Alpha Beta Learning Center — Program Pelatihan Guru PAUD
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Cetak / Unduh PDF</span>
            </button>
            <button
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bagikan</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Viewable & Printable Canvas */}
        <div className="p-4 sm:p-8 overflow-y-auto flex-1 bg-slate-100 flex items-center justify-center">
          <div
            ref={certRef}
            className="w-full max-w-3xl bg-white rounded-2xl p-6 sm:p-10 border-8 border-double border-amber-600/30 shadow-2xl relative overflow-hidden text-slate-800 space-y-6"
            style={{
              backgroundImage: 'radial-gradient(#f1f5f9 1px, transparent 1px)',
              backgroundSize: '16px 16px'
            }}
          >
            {/* Watermark Logo Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
              <Award className="w-96 h-96 text-emerald-900" />
            </div>

            {/* Certificate Header */}
            <div className="text-center space-y-2 border-b-2 border-amber-600/20 pb-5 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 text-white text-[10px] font-black uppercase tracking-widest mb-1 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>LPK ALPHA BETA • LEMBAGA PELATIHAN KERJA TERAKREDITASI</span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold">
                NISN LPK: K9980820 • VIN: 20002320503 • Standar Kemendikdasmen & SKKNI
              </p>
              <h1 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight pt-1">
                SERTIFIKAT KELULUSAN & KOMPETENSI
              </h1>
              <p className="text-xs font-mono font-bold text-amber-800">
                Nomor Registrasi: {certificate.certificateNumber}
              </p>
            </div>

            {/* Recipient Details */}
            <div className="text-center space-y-2 relative z-10 py-2">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-bold">
                Diberikan dengan bangga kepada:
              </p>
              <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 underline decoration-amber-400 decoration-wavy underline-offset-8">
                {userName}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-xl mx-auto pt-2 leading-relaxed">
                Telah menyelesaikan seluruh rangkaian materi, kuis kompetensi, dan tugas praktik mandiri
                pada program:
              </p>
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl inline-block max-w-2xl">
                <h3 className="text-sm sm:text-base font-black text-emerald-950">
                  PELATIHAN GURU PAUD: PEMBELAJARAN BERMAKNA, KREATIVITAS, TUMBUH KEMBANG & DISIPLIN POSITIF
                </h3>
                <p className="text-[11px] text-emerald-800 font-semibold mt-0.5">
                  Beban Belajar: 32 Jam Pelajaran (JP) • Predikat: <strong>{certificate.gradePredikat}</strong> (Skor Akhir: {certificate.finalScore})
                </p>
              </div>
            </div>

            {/* Competency Units Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 relative z-10">
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>1. Implementasi Bermain Bermakna Kurikulum Merdeka</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>2. Kreasi APE Bahan Daur Ulang (Loose Parts)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>3. Deteksi Dini Tumbuh Kembang & Stimulasi Bahasa</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>4. Pendekatan Disiplin Positif (Tanpa Hukuman)</span>
              </div>
            </div>

            {/* Signatures & QR Code */}
            <div className="pt-4 border-t-2 border-amber-600/20 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 text-center sm:text-left">
              {/* Facilitator Sign */}
              <div className="space-y-1 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Pelatih / Coach PAUD</p>
                <div className="h-12 flex items-center justify-center font-serif text-lg font-black text-emerald-900 italic">
                  Vita S. Zulaikha
                </div>
                <p className="text-xs font-black text-slate-900 underline">
                  {certificate.facilitatorName}
                </p>
                <p className="text-[9px] text-slate-400 font-semibold">Fasilitator Kurikulum Merdeka PAUD</p>
              </div>

              {/* QR Verification Seal */}
              <div className="text-center space-y-1 flex flex-col items-center">
                <div className="p-2 bg-white border border-slate-300 rounded-xl shadow-xs">
                  <QrCode className="w-14 h-14 text-slate-900" />
                </div>
                <p className="text-[9px] font-mono text-slate-500 font-bold">PINDAI UNTUK VERIFIKASI</p>
                <p className="text-[9px] text-slate-400">Diterbitkan: {certificate.issueDate}</p>
              </div>

              {/* Director Sign */}
              <div className="space-y-1 text-center">
                <p className="text-[10px] text-slate-400 uppercase font-bold">Pimpinan Lembaga</p>
                <div className="h-12 flex items-center justify-center font-serif text-lg font-black text-emerald-900 italic">
                  Ruli Lesmana
                </div>
                <p className="text-xs font-black text-slate-900 underline">
                  {certificate.directorName}
                </p>
                <p className="text-[9px] text-slate-400 font-semibold">LPK Alpha Beta Learning Center</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
