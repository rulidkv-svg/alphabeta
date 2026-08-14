import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Search,
  Download,
  Video,
  Layers,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Lock,
  ExternalLink,
  Eye,
  X,
  FileCheck
} from 'lucide-react';
import { EmptyState } from '../components/common/Skeletons';

interface MateriViewProps {
  onNavigate: (view: string, param?: string) => void;
}

const ITEMS_PER_PAGE = 6;

export const MateriView: React.FC<MateriViewProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewMateri, setPreviewMateri] = useState<any | null>(null);

  const categories = [
    'Semua',
    'PAUD / Kepaudan',
    'Komputer & Vokasi',
    'Bahasa Asing',
    'Desain & Kreatif',
    'Pemrograman & IT'
  ];

  const materiList = [
    {
      id: 'MAT-PAUD-01',
      title: 'Modul 1: Implementasi Bermain Bermakna Kurikulum Merdeka PAUD',
      category: 'PAUD / Kepaudan',
      type: 'Buku Panduan PDF + LK',
      size: '14.2 MB',
      description: 'Panduan lengkap merancang stimulasi bermakna, active learning berpusat pada anak, dan asesmen observasi autentik.',
      downloads: 684,
      courseId: 'CRS-PAUD-TR01',
      highlights: [
        'Prinsip Bermain adalah Belajar untuk Anak Usia Dini',
        'Integrasi Capai Pembelajaran (CP) PAUD Kurikulum Merdeka',
        'Contoh Rancangan Kegiatan Mingguan & Harian (RPPM & RPPH)'
      ]
    },
    {
      id: 'MAT-PAUD-02',
      title: 'Modul 2: Kreasi APE dari Bahan Daur Ulang (Loose Parts)',
      category: 'PAUD / Kepaudan',
      type: 'Panduan Praktik Bergambar (PDF)',
      size: '18.5 MB',
      description: 'Panduan step-by-step membuat 7 komponen Loose Parts ramah lingkungan dan aman untuk motorik halus & kasar anak.',
      downloads: 812,
      courseId: 'CRS-PAUD-TR01',
      highlights: [
        'Katalog 7 Komponen Bahan Alam & Daur Ulang',
        'Standar K3 & Higienitas Media Belajar Anak',
        'Lembar Penilaian Eksplorasi Kreativitas Anak'
      ]
    },
    {
      id: 'MAT-PAUD-03',
      title: 'Modul 3: Deteksi Dini Tumbuh Kembang & Stimulasi Bahasa Anak',
      category: 'PAUD / Kepaudan',
      type: 'Instrumen Asesmen + Panduan (PDF)',
      size: '9.4 MB',
      description: 'Instrumen KPSP, deteksi speech delay, motorik, sosial-emosional, dan teknik read aloud untuk guru PAUD.',
      downloads: 576,
      courseId: 'CRS-PAUD-TR01',
      highlights: [
        'Tabel Milestone Perkembangan Usia 2-6 Tahun',
        'SOP Skrining & Rujukan Tumbuh Kembang',
        'Teknik Storytelling & Stimulasi Fonik Interaktif'
      ]
    },
    {
      id: 'MAT-PAUD-04',
      title: 'Modul 4: Pendekatan Disiplin Positif (Tanpa Marah dan Hukuman)',
      category: 'PAUD / Kepaudan',
      type: 'Panduan Manajemen Kelas (PDF)',
      size: '8.1 MB',
      description: 'Strategi regulasi emosi anak, kesepakatan kelas menyenangkan, dan manajemen tantrum secara profesional.',
      downloads: 692,
      courseId: 'CRS-PAUD-TR01',
      highlights: [
        'Perbedaan Konsekuensi Logis vs Hukuman',
        'Teknik Co-Regulation saat Anak Tantrum',
        'Panduan Konseling & Kerjasama Orang Tua'
      ]
    },
    {
      id: 'MAT-TK-01',
      title: 'Buku Saku Perakitan & Troubleshooting Hardware PC Standar SKKNI',
      category: 'Komputer & Vokasi',
      type: 'E-Book Panduan Praktik (PDF)',
      size: '11.8 MB',
      description: 'Panduan arsitektur motherboard, socket CPU, sertifikasi PSU 80 Plus, thermal management, dan analisis beep code.',
      downloads: 940,
      courseId: 'CRS-TK01',
      highlights: [
        'SOP K3 & Proteksi Electrostatic Discharge (ESD)',
        'Checklist Urutan Perakitan & Manajemen Airflow',
        'Tabel Troubleshooting Beep Code & BSOD Windows'
      ]
    },
    {
      id: 'MAT-JK-02',
      title: 'Panduan Lab Jaringan Komputer, Subnetting & Mikrotik Routing',
      category: 'Komputer & Vokasi',
      type: 'Lab Sheet & Workbook (PDF)',
      size: '13.2 MB',
      description: 'Perhitungan CIDR Subnetting IPv4 (/24 hingga /30), konfigurasi VLAN, DHCP Server, dan Firewall NAT.',
      downloads: 755,
      courseId: 'CRS-JK02',
      highlights: [
        'Tabel Rumus Cepat Subnetting IPv4',
        'Langkah Konfigurasi Winbox & RouterOS Mikrotik',
        'Skema Pengamanan Jaringan Hotspot & Bandwidth Queue'
      ]
    },
    {
      id: 'MAT-MO-03',
      title: 'Mastering Microsoft Excel & Otomasi Laporan Bisnis Perkantoran',
      category: 'Komputer & Vokasi',
      type: 'Template Excel + Modul (PDF)',
      size: '7.4 MB',
      description: 'Panduan rumus VLOOKUP/XLOOKUP, INDEX-MATCH, PivotTable, Dashboard interaktif, dan Mail Merge Word.',
      downloads: 1120,
      courseId: 'CRS-MO03',
      highlights: [
        'Kompilasi 50+ Formula Excel Paling Dibutuhkan di Kantor',
        'Template Otomatis Slip Gaji & Rekapitulasi Kas',
        'Panduan Membuat Dashboard Analitik Visual'
      ]
    },
    {
      id: 'MAT-ENG-01',
      title: 'Modul Daily Conversation & Professional Speaking (A1-B2)',
      category: 'Bahasa Asing',
      type: 'Modul E-Book (PDF)',
      size: '8.6 MB',
      description: 'Dialog percakapan tematik, pronunciation guide, frasa situasional, dan panduan presentasi formal.',
      downloads: 870,
      courseId: 'CRS-ENG01',
      highlights: [
        '100+ Situational Speaking Dialogues & Audio Script',
        'Business Email Writing & Meeting Etiquette',
        'Vocabulary Bank Siap Kerja di Perusahaan Multinasional'
      ]
    },
    {
      id: 'MAT-JPN-01',
      title: 'Modul Bahasa Jepang Dasar & Persiapan Kerja Magang (JLPT N5)',
      category: 'Bahasa Asing',
      type: 'Buku Latihan Hiragana/Katakana (PDF)',
      size: '10.5 MB',
      description: 'Penguasaan huruf Hiragana, Katakana, 100 Kanji dasar, tata bahasa Minna no Nihongo, dan budaya kerja Jepang.',
      downloads: 630,
      courseId: 'CRS-JPN01',
      highlights: [
        'Lembar Latihan Menulis Stroke Order Huruf Jepang',
        'Tata Bahasa & Pola Kalimat Esensial JLPT N5',
        'Etika Komunikasi & Wawancara Kerja Program Tokutei Ginou'
      ]
    },
    {
      id: 'MAT-DG-01',
      title: 'Panduan Desain Grafis Komersial, Color Harmony & Canva Pro',
      category: 'Desain & Kreatif',
      type: 'Panduan Visual + Template (PDF)',
      size: '16.8 MB',
      description: 'Prinsip desain visual, psikologi warna promosi, tipografi berjenjang, dan pembuatan konten media sosial memikat.',
      downloads: 915,
      courseId: 'CRS-DG04',
      highlights: [
        'Panduan Rasio Emas & Grid Layout Profesional',
        'Kombinasi Font Pairing Modern untuk Brand Identity',
        'Template Banner Instagram & Marketplace High Conversion'
      ]
    },
    {
      id: 'MAT-DEV-01',
      title: 'Roadmap Fullstack Web Development & Database Modern',
      category: 'Pemrograman & IT',
      type: 'Cheatsheet & Code Handbook (PDF)',
      size: '12.1 MB',
      description: 'Panduan sintaks HTML5, Tailwind CSS, TypeScript, React Hooks, REST API Express, dan integrasi database.',
      downloads: 820,
      courseId: 'CRS-FS01',
      highlights: [
        'Cheatsheet Komponen React & Clean Code Architecture',
        'Panduan Desain REST API & Autentikasi JWT/OAuth',
        'Checklist Deployment Production ke Cloud Server'
      ]
    }
  ];

  const filteredMateri = materiList.filter(item => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredMateri.length / ITEMS_PER_PAGE) || 1;
  const paginatedMateri = filteredMateri.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-blue-600 font-bold">Materi & Modul Pembelajaran</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded-full text-[10px] font-black uppercase tracking-wider">
            E-Learning Repository Resmi
          </span>
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-[10px] font-black uppercase tracking-wider">
            Kurikulum SKKNI & Merdeka
          </span>
        </div>
        <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white">
          Pusat Materi, Modul & Lembar Kerja Pelatihan
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Akses perpustakaan e-book terstandar, lembar observasi PAUD, panduan laboratorium komputer, dan template kerja praktis untuk seluruh program pelatihan di Alpha Beta Learning Center.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Cari modul, materi, atau topik..."
            className="w-full pl-10 p-2.5 bg-white text-xs font-semibold rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Materi Grid or Empty State */}
      {filteredMateri.length === 0 ? (
        <EmptyState
          title="Belum Ada Materi Ditemukan"
          message="Tidak ada modul atau materi pembelajaran yang cocok dengan kata kunci pencarian Anda."
          actionButton={
            <button
              onClick={() => { setSelectedCategory('Semua'); setSearchTerm(''); }}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all"
            >
              Reset Filter
            </button>
          }
        />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {paginatedMateri.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {m.category}
                    </span>
                    <span className="text-slate-400 font-semibold">{m.size}</span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {m.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                    {m.description}
                  </p>

                  {/* Highlights list */}
                  {m.highlights && (
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Cakupan Utama:
                      </span>
                      {m.highlights.map((hl: string, hidx: number) => (
                        <div key={hidx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="line-clamp-1">{hl}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPreviewMateri(m)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                    <span>Lihat Detail</span>
                  </button>

                  <button
                    onClick={() => onNavigate('course_detail', m.courseId)}
                    className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                  >
                    <span>Buka Kelas</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
              <span>Halaman {currentPage} dari {totalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Sebelumnya</span>
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:hover:bg-transparent flex items-center gap-1"
                >
                  <span>Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Preview Modal */}
      {previewMateri && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                  {previewMateri.category}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">
                  {previewMateri.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewMateri(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {previewMateri.description}
            </p>

            {previewMateri.highlights && (
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-900 block">
                  Pokok Pembahasan & Kompetensi:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {previewMateri.highlights.map((hl: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-400">
                Format: <b>{previewMateri.type}</b> ({previewMateri.size})
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const cId = previewMateri.courseId;
                    setPreviewMateri(null);
                    onNavigate('learning', cId);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Buka Ruang Belajar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

