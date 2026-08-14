import React from 'react';
import { User, Certificate, UserBadge } from '../../types';
import { Award, Briefcase, GraduationCap, CheckCircle2, Mail, Phone, MapPin, Printer, ShieldCheck } from 'lucide-react';
import { INITIAL_SETTINGS } from '../../data/initialData';

interface DigitalCVProps {
  user: User;
  certificates: Certificate[];
}

export const DigitalCV: React.FC<DigitalCVProps> = ({ user, certificates }) => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Printable CV Container */}
      <div id="printable-cv" className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
        {/* CV Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 border-b border-slate-100 pb-6">
          <img
            src={user.PhotoURL}
            alt={user.Name}
            className="w-24 h-24 rounded-2xl object-cover ring-4 ring-blue-500/20 shadow-md"
          />
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
              <h2 className="text-2xl font-black text-slate-900">{user.Name}</h2>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
                🎓 Lulusan Tersertifikasi LPK Alpha Beta
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{user.Bio || 'Peserta LPK Alpha Beta Ready for Work.'}</p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-blue-600" /> {user.Email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-emerald-600" /> {user.Phone}</span>
            </div>
          </div>
        </div>

        {/* Competency Skills */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-blue-600" />
            <span>Keahlian & Kompetensi Siap Kerja</span>
          </h3>
          <div className="flex flex-wrap gap-2">
            {user.Skills?.map((skill, i) => (
              <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
                ✓ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Certified Courses & Official Certificates */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-blue-600" />
            <span>Sertifikasi Pelatihan Resmi</span>
          </h3>

          {certificates.length > 0 ? (
            <div className="space-y-3">
              {certificates.map(cert => (
                <div key={cert.CertificateID} className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold text-blue-950">{cert.CourseTitle}</h4>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      STATUS: LULUS (Nilai {cert.FinalScore})
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600">
                    <span>Penerbit: {INITIAL_SETTINGS.LPKName}</span>
                    <span className="font-mono text-blue-700 font-bold">No: {cert.CertificateID}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">Belum ada sertifikat kelulusan terbit.</p>
          )}
        </div>

        {/* Verification Watermark */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 font-bold text-emerald-700">
            <ShieldCheck className="w-3.5 h-3.5" /> DIGITAL CV VERIFIED BY ALPHA BETA LEARNING CENTER
          </span>
          <span>Dicetak Tanggal: {new Date().toLocaleDateString('id-ID')}</span>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Digital CV / Portfolio (PDF)</span>
        </button>
      </div>
    </div>
  );
};
