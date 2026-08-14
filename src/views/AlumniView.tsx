import React, { useEffect, useState } from 'react';
import { GraduationCap, Award, ShieldCheck, Search, Briefcase, UserCheck } from 'lucide-react';
import { apiService } from '../services/api';
import { Certificate, User } from '../types';

export const AlumniView: React.FC = () => {
  const [alumniList, setAlumniList] = useState<{ certificate: Certificate; user?: User }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlumni = async () => {
      try {
        const data = await apiService.getAlumni();
        setAlumniList(data);
      } catch (e) {
        console.error('Error loading alumni:', e);
      } finally {
        setLoading(false);
      }
    };
    loadAlumni();
  }, []);

  return (
    <div className="space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">🎓 DIREKTORI ALUMNI & CAREER CENTER</h1>
        <p className="text-xs text-slate-500 mt-1">
          Daftar lulusan tersertifikasi resmi LPK Alpha Beta yang siap diserap oleh industri & mitra kerja.
        </p>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-xs">⏳ Memuat direktori alumni...</div>
      ) : alumniList.length === 0 ? (
        <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          Belum ada data alumni terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {alumniList.map((item, idx) => {
            const cert = item.certificate;
            const u = item.user;

            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u?.PhotoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
                      alt={cert.UserName}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-blue-500/20"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{cert.UserName}</h3>
                      <p className="text-[10px] font-semibold text-emerald-700 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Graduate
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Program Keahlian</span>
                    <p className="font-bold text-slate-900 line-clamp-1">{cert.CourseTitle}</p>
                    <p className="text-[10px] text-blue-700 font-bold">Nilai: {cert.FinalScore} / 100</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-500">
                  <span>ID: {cert.CertificateID}</span>
                  <span>{cert.IssueDate}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
