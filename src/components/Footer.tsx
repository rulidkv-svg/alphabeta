import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Globe,
  Youtube,
  Linkedin,
  ChevronRight,
  Award,
  CheckCircle2,
  FileCheck2,
  Building2,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { INITIAL_SETTINGS } from '../data/initialData';
import { AppSettings } from '../types';
import { apiService } from '../services/api';
import { Logo } from './Logo';
import { KemnakerLogo, KemdikdasmenLogo } from './MinistryLogos';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './common/LanguageSelector';

interface FooterProps {
  onNavigate?: (view: string, param?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const { t, isRTL } = useLanguage();

  useEffect(() => {
    let isMounted = true;
    apiService.getSettings()
      .then(res => {
        if (isMounted && res) {
          setSettings(res);
        }
      })
      .catch(err => {
        console.log('Error loading settings in footer:', err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleNavClick = (view: string, param?: string) => {
    if (onNavigate) {
      onNavigate(view, param);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-10 md:pt-14 pb-28 md:pb-16 lg:pb-12 border-t border-slate-800/90 relative overflow-hidden">
      {/* Background Subtle Accent Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-transparent via-blue-500/40 to-transparent blur-xs pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================= */}
        {/* SECTION 1: DIDUKUNG OLEH KEMENTERIAN REPUBLIK INDONESIA   */}
        {/* ========================================================= */}
        <div className="mb-10 sm:mb-12 p-5 sm:p-7 md:p-8 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-2xl relative overflow-hidden">
          {/* Subtle Background Glows */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-5">
            {/* Title Header */}
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-200">
                  {t.hero.accreditedBadge}
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.common.verified}</span>
              </div>
            </div>

            {/* Ministry Logos - Side by Side Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
              {/* Logo 1: Kementerian Ketenagakerjaan RI */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 hover:border-amber-500/50 transition-all flex items-center gap-3 sm:gap-4 group shadow-lg">
                <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-xs shrink-0 flex items-center justify-center min-w-[130px] h-14">
                  <KemnakerLogo size="sm" customUrl={settings.KemnakerLogoURL} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                    Kementerian Ketenagakerjaan
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-400">
                    Republik Indonesia
                  </p>
                  <div className="pt-1">
                    <span className="inline-block text-[10px] font-bold text-amber-400 bg-amber-950/70 border border-amber-800/80 px-2 py-0.5 rounded-md">
                      {t.footer.vinCode}: {settings.VIN || '20002320503'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Logo 2: Kementerian Pendidikan Dasar dan Menengah RI */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/90 border border-slate-800/90 hover:border-sky-500/50 transition-all flex items-center gap-3 sm:gap-4 group shadow-lg">
                <div className="p-2 sm:p-2.5 bg-white rounded-xl shadow-xs shrink-0 flex items-center justify-center min-w-[80px] h-14">
                  <KemdikdasmenLogo size="sm" customUrl={settings.KemdikdasmenLogoURL} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs sm:text-sm font-black text-white group-hover:text-sky-300 transition-colors leading-snug">
                    Kementerian Pendidikan Dasar dan Menengah
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-400">
                    Republik Indonesia
                  </p>
                  <div className="pt-1">
                    <span className="inline-block text-[10px] font-bold text-sky-400 bg-sky-950/70 border border-sky-800/80 px-2 py-0.5 rounded-md">
                      {t.footer.nisnCode}: {settings.NISN || 'K9980820'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: INFORMASI PLATFORM & LEMBAGA (MAIN FOOTER)     */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-12">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-3.5 sm:col-span-2 lg:col-span-2">
            <div className="bg-white p-2.5 px-3 rounded-2xl inline-flex items-center shadow-sm border border-slate-200/50">
              <Logo size="md" showTagline={false} />
            </div>

            <div>
              <h3 className="text-base font-black text-white tracking-wide">ALPHA BETA LEARNING CENTER</h3>
              <p className="text-xs font-bold text-amber-400 mt-0.5">
                &ldquo;Belajar • Berlatih • Bersertifikat • Siap Kerja&rdquo;
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-normal max-w-sm">
              Platform pendidikan dan pelatihan keterampilan kerja profesional terakreditasi resmi. Mempersiapkan talenta digital yang kompeten, berdaya saing, dan siap berkarier di industri modern.
            </p>

            {/* Language Selector in Footer */}
            <div className="pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-blue-400" />
                <span>{t.common.selectLanguage}</span>
              </p>
              <LanguageSelector variant="footer" />
            </div>
          </div>

          {/* Column 2: Kategori Kursus */}
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block"></span>
              <span>Kategori</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => handleNavClick('courses', 'CAT-001')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Komputer & Teknologi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('courses', 'CAT-002')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Kreatif & Desain</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('courses', 'CAT-004')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Bahasa Internasional</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('courses', 'search:ai')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>AI & Prompt Eng.</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('courses', 'search:marketing')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Digital Marketing</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('courses', 'search:data')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Data Analytics</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('courses', 'CAT-005')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Pendidikan & Guru</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Program & Pelatihan */}
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              <span>Program</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => handleNavClick('english_training')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>English Communication</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('paud_training')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Pelatihan Guru PAUD</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('courses')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Semua Kursus Online</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('materi')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Materi & E-Book</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Navigasi Cepat */}
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block"></span>
              <span>Tentang & Layanan</span>
            </h4>
            <ul className="space-y-2 text-xs text-slate-400 font-medium">
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Tentang Kami</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('verify')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Cek Sertifikat</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('alumni')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Alumni & Karier</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('news')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Berita & Artikel</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('gallery')}
                  className="hover:text-blue-400 flex items-center gap-1.5 transition-colors group text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-transform group-hover:translate-x-0.5" />
                  <span>Galeri Aktivitas</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Column 5: Kontak & Medsos */}
          <div>
            <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
              <span>Kontak</span>
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-[11px]">{settings.Address || INITIAL_SETTINGS.Address}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a
                  href={`https://wa.me/${(settings.PhoneWhatsApp || INITIAL_SETTINGS.PhoneWhatsApp).replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-300 transition-colors text-[11px]"
                >
                  WA: {settings.PhoneWhatsApp || INITIAL_SETTINGS.PhoneWhatsApp}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a
                  href={`mailto:${settings.Email || INITIAL_SETTINGS.Email}`}
                  className="hover:text-amber-300 transition-colors text-[11px] truncate"
                >
                  {settings.Email || INITIAL_SETTINGS.Email}
                </a>
              </div>

              {/* Social Media Icons (Facebook, Instagram, YouTube, TikTok) */}
              <div className="flex items-center gap-2 pt-2">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-blue-600 hover:text-white flex items-center justify-center text-slate-400 transition-all border border-slate-800"
                >
                  <Facebook className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-gradient-to-tr hover:from-amber-500 hover:to-purple-600 hover:text-white flex items-center justify-center text-slate-400 transition-all border border-slate-800"
                >
                  <Instagram className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-rose-600 hover:text-white flex items-center justify-center text-slate-400 transition-all border border-slate-800"
                >
                  <Youtube className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-700 hover:text-white flex items-center justify-center text-slate-400 transition-all border border-slate-800 text-[10px] font-black"
                >
                  TT
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 3: COPYRIGHT BOTTOM BAR                           */}
        {/* ========================================================= */}
        <div className="pt-6 border-t border-slate-900/90 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-400">
            © 2026 <strong className="text-slate-200">Alpha Beta Learning Center</strong>. {t.footer.allRightsReserved}
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 bg-slate-900 px-3.5 py-1 rounded-full border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{t.footer.legalNote}</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
