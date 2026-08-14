import React, { useState } from 'react';
import { Code2, Copy, Check, ExternalLink, Play, Database, FileCode, CheckCircle2, ShieldCheck, Sparkles, Zap, RefreshCw, ArrowUpRight } from 'lucide-react';
import { GAS_CODE_GS, GAS_DATABASE_GS, GAS_AUTH_GS, GAS_ALL_IN_ONE_GS } from '../gas/gasScripts';
import { apiService } from '../services/api';

export const GasDeployView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'code' | 'db' | 'auth'>('all');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);
  const [syncSuccess, setSyncSuccess] = useState<boolean | null>(null);

  const SPREADSHEET_URL = "https://docs.google.com/spreadsheets/d/1DcM2Sn579APizeP5dfOIBchOKQgvjYPhVBrgkeUJk2w/edit?usp=sharing";

  const getActiveCode = () => {
    if (activeTab === 'all') return GAS_ALL_IN_ONE_GS;
    if (activeTab === 'code') return GAS_CODE_GS;
    if (activeTab === 'db') return GAS_DATABASE_GS;
    return GAS_AUTH_GS;
  };

  const handleCopy = (code: string, tabName: string) => {
    navigator.clipboard.writeText(code);
    setCopiedTab(tabName);
    setTimeout(() => setCopiedTab(null), 2000);
  };

  const handlePushAllData = async () => {
    setIsSyncing(true);
    setSyncStatus('Sedang mengirim seluruh data web ke Google Sheet...');
    setSyncSuccess(null);
    try {
      const res = await apiService.pushGAS();
      if (res.success) {
        setSyncSuccess(true);
        setSyncStatus(`✅ ${res.message || 'Semua data web berhasil dikirim dan tersinkronisasi ke Google Sheet!'}`);
      } else {
        setSyncSuccess(false);
        setSyncStatus(`❌ Gagal: ${res.message}`);
      }
    } catch (e: any) {
      setSyncSuccess(false);
      setSyncStatus(`❌ Terjadi kendala saat mengirim: ${e?.message || 'Error'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-8 py-8 max-w-5xl mx-auto">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
            Google Sheets & Apps Script Sync
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">⚡ GOOGLE APPS SCRIPT DEPLOYMENT CENTER</h1>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Salin kode backend master siap pakai di bawah ini ke Google Apps Script Anda. Jalankan <code>setupDatabase()</code> untuk otomatis membuat 26 sheet tabel database Google Sheets secara instan!
        </p>
      </div>

      {/* QUICK ACTION: KIRIM SEMUA DATA WEB KE GOOGLE SHEET */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" /> Auto Sync Engine
              </span>
              <h2 className="text-base font-extrabold text-white">Sinkronisasi Database Web → Google Sheet</h2>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Kirim seluruh tabel (Peserta 200+, Nilai Ujian, Progres, Sertifikat, Absensi, Log Aktivitas) langsung ke spreadsheet Anda.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <a
              href={SPREADSHEET_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs flex items-center gap-1.5 border border-slate-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Buka Spreadsheet
            </a>
            <button
              onClick={handlePushAllData}
              disabled={isSyncing}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Zap className={`w-4 h-4 text-amber-300 ${isSyncing ? 'animate-bounce' : ''}`} />
              {isSyncing ? 'Mengirim Data...' : '⚡ Kirim Semua Data Sekarang'}
            </button>
          </div>
        </div>

        {syncStatus && (
          <div className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2 border ${
            syncSuccess ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200' : 'bg-rose-950/80 border-rose-500/50 text-rose-200'
          }`}>
            {syncSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <RefreshCw className="w-4 h-4 text-rose-400 shrink-0" />}
            <span className="leading-relaxed">{syncStatus}</span>
          </div>
        )}
      </div>

      {/* Deployment Guide Steps */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Play className="w-4 h-4 text-emerald-600 fill-emerald-600" />
          <span>Panduan Cepat Otomatisasi Tabel Google Sheets (5 Langkah)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs font-medium text-slate-700">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-extrabold text-blue-600">1. Buat Sheet</span>
            <p className="text-slate-500 text-[11px]">Buka Google Sheets baru & beri nama "LPK Alpha Beta LMS DB".</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-extrabold text-blue-600">2. Buka Apps Script</span>
            <p className="text-slate-500 text-[11px]">Klik menu <strong>Extensions → Apps Script</strong> di Google Sheets.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-extrabold text-blue-600">3. Paste Master Code</span>
            <p className="text-slate-500 text-[11px]">Hapus isi Code.gs bawaan lalu tempel kode tab <strong>"Semua Kode (All-in-One)"</strong>.</p>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
            <span className="font-extrabold text-blue-600">4. Run setupDatabase</span>
            <p className="text-slate-500 text-[11px]">Pilih fungsi <code>setupDatabase</code> di dropdown lalu klik <strong>Run</strong> untuk buat 26 tabel!</p>
          </div>

          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1 text-emerald-900">
            <span className="font-extrabold text-emerald-700">5. Deploy Web App</span>
            <p className="text-emerald-800 text-[11px]">Deploy → New deployment → Web app → Execute as: Me, Access: <strong>Anyone</strong>.</p>
          </div>
        </div>
      </div>

      {/* Code Tabs & Copy Manager */}
      <div className="bg-slate-900 text-slate-100 rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'all' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Semua Kode (All-in-One Code.gs) ⭐</span>
            </button>

            <button
              onClick={() => setActiveTab('db')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'db' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Database.gs (setupDatabase)</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'code' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <FileCode className="w-4 h-4" />
              <span>Code.gs (Router)</span>
            </button>

            <button
              onClick={() => setActiveTab('auth')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'auth' ? 'bg-blue-600 text-white shadow-xs' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Auth.gs</span>
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={() => handleCopy(getActiveCode(), activeTab)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold text-xs text-white flex items-center gap-2 transition-all shadow-md"
          >
            {copiedTab === activeTab ? (
              <>
                <Check className="w-4 h-4" />
                <span>Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Salin Kode ({activeTab === 'all' ? 'All-in-One' : activeTab.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>

        {/* Code Content */}
        <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-[500px] leading-relaxed">
          {getActiveCode()}
        </pre>
      </div>
    </div>
  );
};
