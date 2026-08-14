import React from 'react';
import {
  ShieldCheck,
  Building2,
  Award,
  Users,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Globe,
  X,
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { Logo } from './Logo';
import { KemnakerLogo, KemdikdasmenLogo } from './MinistryLogos';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const directorData = {
    name: 'Ruli Lesmana, S.T., Gr.',
    title: 'Direktur Utama Alpha Beta',
    role: 'Manajemen LPK & Penandatangan Sah Sertifikat Kompetensi',
    email: 'admin@alphabeta.edu.eu.org',
    secondaryEmail: 'roeli.eunih.sjy@gmail.com',
    phone: '081223546686',
    photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    degree: 'S1 Teknik & Profesi Pendidik (S.T., Gr.)',
    bio: 'Ruli Lesmana, S.T., Gr. adalah Direktur Utama Lembaga Pelatihan Kerja (LPK) Alpha Beta. Berpengalaman luas dalam manajemen pendidikan vokasi, tata kelola LPK terakreditasi, perancangan kurikulum pelatihan berbasis standar industri (SKKNI), serta penjaminan mutu keabsahan sertifikasi kompetensi digital.',
    competencies: [
      'Manajemen Tata Kelola LPK Terakreditasi',
      'Penandatangan Sah Sertifikat Kelulusan',
      'Pengembangan Kurikulum Vokasi Berbasis SKKNI',
      'Kepemimpinan Vokasi & Kemitraan Industri',
      'Arsitektur LMS & Aplikasi Pembelajaran'
    ]
  };

  const officialTeam = [
    { name: 'Roni Nuroni, S.T., MCE', title: 'Instruktur Resmi', role: 'Hardware & Jaringan Komputer' },
    { name: 'Ridwan Abdul Aziz, S.T.', title: 'Instruktur Resmi', role: 'Teknologi Informasi & Sistem Komputer' },
    { name: 'Syifa Rahmawati, S.T.', title: 'Instruktur Resmi', role: 'Aplikasi Digital & LMS' },
    { name: 'Ine Yuniar Suryadi, S.Pd.', title: 'Pelatih / Coach', role: 'Aplikasi Perkantoran & Produktivitas Digital' },
    { name: 'Vita Situ Zulaikha, S.Pd., M.Pd.', title: 'Pelatih / Coach', role: 'Desain Grafis & PAUD' },
    { name: 'Budi Iskandar, S.Si., M.Pd.', title: 'Pelatih / Coach', role: 'Bahasa Inggris, Kepanduan & Vokasi' },
    { name: 'Wina Mulyani, S.Pd.', title: 'Pelatih / Coach', role: 'Pengelolaan & Kepanduan' },
    { name: 'Hanifah Saadah, S.Pd., S.Kom.', title: 'Pelatih / Coach', role: 'Bahasa Inggris' },
    { name: 'Ruli Lesmana, S.T., Gr.', title: 'Direktur Alpha Beta', role: 'Manajemen LPK & Penandatangan Sertifikat' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white p-6 relative flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 border border-blue-500/40 rounded-2xl">
              <Building2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>TENTANG KAMI & PROFIL LEMBAGA</span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                LPK Alpha Beta — Lembaga Pelatihan Kerja & Pengembangan SDM Terakreditasi
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-6 overflow-y-auto space-y-8 flex-1 text-slate-800 text-xs">
          {/* Institutional Overview */}
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 rounded-2xl space-y-4 shadow-lg border border-blue-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="px-2.5 py-1 bg-amber-400/20 border border-amber-300/30 text-amber-300 font-extrabold text-[10px] rounded-full uppercase tracking-wider inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Lembaga Pelatihan Terakreditasi
                </span>
                <h3 className="text-xl font-black tracking-tight text-white pt-1">
                  LPK Alpha Beta (Learning Center)
                </h3>
              </div>

              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/20">
                <KemnakerLogo size="sm" />
                <KemdikdasmenLogo size="sm" />
              </div>
            </div>

            <p className="text-xs text-blue-100 leading-relaxed font-normal">
              LPK Alpha Beta adalah pusat pelatihan kerja terpadu yang berfokus pada penyiapan SDM unggul di bidang Teknologi Informasi, Bahasa Inggris Vokasi, dan Pendidikan PAUD. Dengan kurikulum terstandar industri dan sertifikasi digital terverifikasi QR Code, kami memastikan setiap lulusan memiliki keahlian riil dan siap bersaing di dunia kerja.
            </p>

            <div className="flex flex-wrap gap-2 text-[11px] font-mono font-bold">
              <span className="px-3 py-1 bg-blue-950/80 border border-blue-700/80 text-amber-300 rounded-lg">
                NISN: K9980820
              </span>
              <span className="px-3 py-1 bg-blue-950/80 border border-blue-700/80 text-emerald-300 rounded-lg">
                VIN: 20002320503
              </span>
            </div>
          </div>

          {/* Profil Direktur Utama (Ruli Lesmana, S.T., Gr.) */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <GraduationCap className="w-5 h-5 text-rose-600" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Profil Direktur Utama &amp; Penandatangan Sertifikat Sah
              </h3>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
                <img
                  src={directorData.photo}
                  alt={directorData.name}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover ring-4 ring-rose-500/20 shadow-md flex-shrink-0"
                />

                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-base font-extrabold text-slate-900">{directorData.name}</h4>
                    <span className="px-2.5 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-extrabold rounded-full border border-rose-200 uppercase">
                      {directorData.title}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-semibold">{directorData.degree}</p>

                  <div className="text-[11px] text-slate-500 font-mono space-y-0.5">
                    <p>✉️ {directorData.email} | {directorData.secondaryEmail}</p>
                    <p>📞 WhatsApp: {directorData.phone}</p>
                  </div>

                  <div className="pt-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[10px] font-extrabold">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Penandatangan Sah Sertifikat Digital LPK Alpha Beta</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Bio Detail */}
              <div className="space-y-2 pt-2 border-t border-slate-200/80">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-rose-700">
                  Biodata Professional &amp; Pengalaman
                </h5>
                <p className="text-xs text-slate-700 leading-relaxed font-normal bg-white p-3.5 rounded-xl border border-slate-200/60 shadow-2xs">
                  {directorData.bio}
                </p>
              </div>

              {/* Core Competencies */}
              <div className="space-y-2 pt-1">
                <h5 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-700">
                  Bidang Keahlian &amp; Kewenangan Utama:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {directorData.competencies.map((comp, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200/80 text-[11px] font-medium text-slate-800">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{comp}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tim Instruktur, Pelatih & Pengelola LPK Alpha Beta */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-1 border-b border-slate-200">
              <Users className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Tim Instruktur, Pelatih, dan Pengelola Resmi (9 Personel)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {officialTeam.map((staff, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${
                    staff.name.includes('Ruli Lesmana')
                      ? 'bg-rose-100 text-rose-700 border border-rose-300'
                      : 'bg-blue-100 text-blue-700 border border-blue-300'
                  }`}>
                    {staff.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900">{staff.name}</h4>
                    <span className="text-[10px] font-bold text-amber-600 block">{staff.title}</span>
                    <span className="text-[10px] text-slate-500 font-medium">{staff.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact & Address Section */}
          <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl space-y-3 border border-slate-800">
            <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <MapPin className="w-4 h-4 text-rose-400" />
              <span>Alamat Sekretariat &amp; Layanan Resmi</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              📍 Kp. Sukawangi RT. 01 RW. 01 Desa Sukawangi, Kec. Singajaya, Kab. Garut, Prov. Jawa Barat (Kode Pos: 44173)
            </p>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-indigo-300 pt-1">
              <span>🌐 alphabeta.edu.eu.org</span>
              <span>🌐 www.alphabeta.edu.eu.org</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-all"
          >
            Tutup Informasi
          </button>
        </div>
      </div>
    </div>
  );
};
