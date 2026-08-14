import React, { useState } from 'react';
import { Image as ImageIcon, ChevronRight, Sparkles, Filter } from 'lucide-react';

interface GalleryViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  const categories = ['Semua', 'Bahasa Inggris', 'PAUD / Kepaudan', 'Teknisi Komputer', 'Sertifikasi & Wisuda'];

  const galleryItems = [
    {
      id: 1,
      title: 'Sesi Conversation & Public Speaking Bahasa Inggris',
      category: 'Bahasa Inggris',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80',
      date: '10 Februari 2026'
    },
    {
      id: 2,
      title: 'Workshop Pembuatan APE Kreatif Bahan Daur Ulang PAUD',
      category: 'PAUD / Kepaudan',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80',
      date: '05 Februari 2026'
    },
    {
      id: 3,
      title: 'Praktik Perakitan PC & Troubleshooting Hardware Komputer',
      category: 'Teknisi Komputer',
      image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
      date: '28 Januari 2026'
    },
    {
      id: 4,
      title: 'Penyerahan Sertifikat Kelulusan Resmi LPK Alpha Beta',
      category: 'Sertifikasi & Wisuda',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      date: '20 Januari 2026'
    },
    {
      id: 5,
      title: 'Simulasi Role Play Interview Kerja Bahasa Inggris',
      category: 'Bahasa Inggris',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80',
      date: '15 Januari 2026'
    },
    {
      id: 6,
      title: 'Praktik Storytelling & Media Pembelajaran Anak Usia Dini',
      category: 'PAUD / Kepaudan',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&auto=format&fit=crop&q=80',
      date: '10 Januari 2026'
    }
  ];

  const filteredItems = galleryItems.filter(
    item => selectedCategory === 'Semua' || item.category === selectedCategory
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-blue-600 font-bold">Galeri Kegiatan Pelatihan</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg space-y-2">
        <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-300/30 rounded-full text-[10px] font-black uppercase tracking-wider">
          Dokumentasi Kegiatan
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Galeri LPK Alpha Beta</h1>
        <p className="text-xs text-blue-100 max-w-xl">
          Dokumentasi momen pembelajaran, workshop interaktif, praktik laboratorium, dan ujian sertifikasi peserta.
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition-all group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold rounded-md">
                {item.category}
              </span>
            </div>
            <div className="p-4 space-y-1">
              <p className="text-[10px] text-slate-400 font-semibold">{item.date}</p>
              <h3 className="text-xs font-extrabold text-slate-900 leading-snug">
                {item.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
