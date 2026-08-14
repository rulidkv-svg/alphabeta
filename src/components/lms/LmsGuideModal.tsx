import React from 'react';
import { BookOpen, CheckCircle2, Video, Calendar, Award, FileText, HelpCircle, X, ArrowRight, ShieldCheck } from 'lucide-react';

interface LmsGuideModalProps {
  onClose: () => void;
}

export const LmsGuideModal: React.FC<LmsGuideModalProps> = ({ onClose }) => {
  const steps = [
    { title: '1. Login & Dashboard', desc: 'Masuk dengan kredensial yang terdaftar dan pantau progres kursus di Dashboard Peserta.' },
    { title: '2. Pretest Awal', desc: 'Selesaikan Pretest sebelum memulai materi untuk mengukur pemahaman awal Anda.' },
    { title: '3. Modul & Bahan Bacaan', desc: 'Pelajari materi utama berupa Dokumen PDF, Presentation Slides, Artikel, dan Praktik Lab.' },
    { title: '4. Tatap Muka Daring', desc: 'Ikuti sesi interaktif Google Meet atau Zoom sesuai jadwal yang ditentukan instruktur.' },
    { title: '5. Presensi Online', desc: 'Lakukan check-in presensi pada setiap sesi tatap muka atau presensi mandiri harian (minimal 80%).' },
    { title: '6. Pengumpulan Tugas', desc: 'Kerjakan tugas latihan & proyek praktik, lalu unggah dokumen atau tautan hasil kerja.' },
    { title: '7. Forum Diskusi', desc: 'Gunakan forum diskusi untuk bertanya kepada instruktur dan berdiskusi dengan sesama peserta.' },
    { title: '8. Posttest & Evaluasi', desc: 'Selesaikan Ujian Akhir Posttest (minimal nilai 75) dan isi survei evaluasi kursus.' },
    { title: '9. Download Sertifikat', desc: 'Setelah seluruh 6 syarat kelulusan terpenuhi, tombol Download Sertifikat akan aktif secara otomatis.' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Panduan Penggunaan LMS Alpha Beta</h3>
              <p className="text-xs text-slate-500">Alur alur pembelajaran lengkap dari pendaftaran hingga penerbitan sertifikat</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-xl text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Diagram Steps */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Alur Pembelajaran Vokasi Standard LPK Alpha Beta:
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {steps.map((st, i) => (
              <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
                <span className="text-xs font-extrabold text-blue-600 block">{st.title}</span>
                <p className="text-[11px] text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Sertifikat Kelulusan Otomatis:</span>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Sistem akan memverifikasi kelulusan Anda secara otomatis berdasarkan kehadiran, kelengkapan materi, nilai tugas, nilai posttest, dan evaluasi.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs"
          >
            Paham & Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
