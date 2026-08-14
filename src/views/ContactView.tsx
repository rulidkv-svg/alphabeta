import React from 'react';
import { PhoneCall, Mail, MapPin, Send, MessageSquare, Clock, Globe, ChevronRight } from 'lucide-react';
import { INITIAL_SETTINGS } from '../data/initialData';

interface ContactViewProps {
  onNavigate: (view: string, param?: string) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ onNavigate, onShowToast }) => {
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (onShowToast) {
      onShowToast('📩 Pesan Anda telah dikirim! Tim layanan LPK Alpha Beta akan segera membalas.', 'success');
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-200">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <button onClick={() => onNavigate('home')} className="hover:text-blue-600 transition-colors">
          Beranda
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-blue-600 font-bold">Kontak & Layanan LPK Alpha Beta</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-lg space-y-2">
        <span className="px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-300/30 rounded-full text-[10px] font-black uppercase tracking-wider">
          Pusat Bantuan & Layanan
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Hubungi LPK Alpha Beta</h1>
        <p className="text-xs text-blue-100 max-w-xl">
          Ada pertanyaan seputar pendaftaran program pelatihan Bahasa Inggris, Kepaudan, atau sertifikasi? Tim kami siap membantu Anda.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
              Informasi Kontak Resmi
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Alamat Kampus LPK</p>
                  <p className="text-slate-500 leading-relaxed mt-0.5">{INITIAL_SETTINGS.Address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">WhatsApp Admisi & Layanan</p>
                  <p className="text-slate-500 mt-0.5">{INITIAL_SETTINGS.PhoneWhatsApp}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Email Resmi</p>
                  <p className="text-slate-500 mt-0.5">{INITIAL_SETTINGS.Email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Situs Web Resmi</p>
                  <p className="text-slate-500 mt-0.5">{INITIAL_SETTINGS.WebsiteURL}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-2">
            <h3 className="text-xs font-bold text-amber-300">Jam Operasional Layanan</h3>
            <p className="text-xs text-slate-300">
              Senin - Sabtu: 08:00 - 17:00 WIB<br />
              Minggu / Tanggal Merah: Hanya Kelas Workshop / On Call WhatsApp.
            </p>
          </div>
        </div>

        {/* Quick Message Form */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h2 className="text-sm font-extrabold text-slate-900 border-b border-slate-100 pb-2">
            Kirim Pesan Langsung
          </h2>

          <form onSubmit={handleSendMessage} className="space-y-4 text-xs font-semibold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-slate-700 block mb-1">Nama Anda *</label>
                <input
                  type="text"
                  placeholder="Nama lengkap"
                  required
                  className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-slate-700 block mb-1">Nomor WhatsApp *</label>
                <input
                  type="text"
                  placeholder="081234567890"
                  required
                  className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Subjek Pertanyaan</label>
              <select className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500">
                <option value="inggris">Informasi Pelatihan Bahasa Inggris</option>
                <option value="paud">Informasi Pelatihan Kepaudan (PAUD)</option>
                <option value="komputer">Informasi Pelatihan Komputer & TI</option>
                <option value="sertifikat">Verifikasi & Cetak Sertifikat</option>
                <option value="kerjasama">Kerjasama / In-House Training</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 block mb-1">Pesan / Pertanyaan *</label>
              <textarea
                rows={4}
                placeholder="Tuliskan pertanyaan Anda secara detail di sini..."
                required
                className="w-full p-3 bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Pesan Layanan</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
