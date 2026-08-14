import React from 'react';
import { Newspaper, ChevronRight, Calendar, User, ArrowRight } from 'lucide-react';

interface NewsViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onNavigate }) => {
  const newsList = [
    {
      id: 'NEWS-01',
      title: 'Pembukaan Pendaftaran Pelatihan Bahasa Inggris Intensif Angkatan I Tahun 2026',
      date: '10 Februari 2026',
      author: 'Tim Humas LPK Alpha Beta',
      category: 'Informasi Pelatihan',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
      summary: 'LPK Alpha Beta membuka pendaftaran program Bahasa Inggris untuk tingkat dasar, menengah, dan lanjutan dengan fasilitas instruktur berpengalaman.',
      courseId: 'english_training'
    },
    {
      id: 'NEWS-02',
      title: 'Workshop Kepaudan: Peningkatan Kompetensi Pendidik Anak Usia Dini dalam Pembelajaran Kreatif',
      date: '02 Februari 2026',
      author: 'Direktorat Pelatihan',
      category: 'Kepaudan / PAUD',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      summary: 'Program sertifikasi kepaudan angkatan terbaru berfokus pada pengembangan Alat Permainan Edukatif (APE) dan manajemen kelas ramah anak.',
      courseId: 'paud_training'
    },
    {
      id: 'NEWS-03',
      title: 'Kelulusan 30 Peserta Pelatihan Teknisi Komputer & Perakitan PC Siap Kerja',
      date: '25 Januari 2026',
      author: 'Ruli Lesmana, S.T.',
      category: 'Sertifikasi Alumni',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
      summary: 'Sebanyak 30 alumni berhasil meraih sertifikat kompetensi resmi setelah menyelesaikan ujian akhir perakitan dan troubleshooting PC.',
      courseId: 'CRS-TK01'
    }
  ];

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-blue-600 font-bold">Berita & Pengumuman</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg space-y-2">
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[10px] font-black uppercase tracking-wider">
          Kabar LPK Alpha Beta
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Berita & Informasi Terbaru</h1>
        <p className="text-xs text-slate-300 max-w-xl">
          Dapatkan pengumuman jadwal pelatihan baru, kabar alumni, liputan kegiatan workshop, dan informasi sertifikasi resmi.
        </p>
      </div>

      {/* News List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsList.map(n => (
          <div
            key={n.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden">
                <img
                  src={n.image}
                  alt={n.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-md">
                  {n.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {n.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3 h-3" /> {n.author}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                  {n.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {n.summary}
                </p>
              </div>
            </div>

            <div className="p-5 pt-0">
              <button
                onClick={() => onNavigate(n.courseId)}
                className="w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1.5"
              >
                <span>Baca Selengkapnya</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
