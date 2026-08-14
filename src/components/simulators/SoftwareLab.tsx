import React, { useState } from 'react';
import { Monitor, CheckCircle2, Play, RefreshCw, Terminal, Layers } from 'lucide-react';

export const SoftwareLab: React.FC = () => {
  const [step, setStep] = useState(1);
  const [biosSetting, setBiosSetting] = useState('HDD');
  const [osSelected, setOsSelected] = useState('Windows 11 Pro (64-bit)');
  const [logs, setLogs] = useState<string[]>([
    '[BIOS / UEFI POST] Checking system devices...',
    'Memory OK: 16384 MB DDR5',
    'Storage detected: M.2 NVMe SSD 512GB',
    'Bootable USB Installer detected at Port USB 3.0'
  ]);

  const handleSetBoot = () => {
    setBiosSetting('USB Flashdisk');
    setLogs(prev => [...prev, '✔ Boot priority set to: USB Flashdisk (Windows Installer)']);
    setStep(2);
  };

  const handleStartInstall = () => {
    setLogs(prev => [
      ...prev,
      '--> Starting Windows Setup Wizard...',
      'Copying files: [100%]',
      'Getting files ready for installation: [100%]',
      'Installing features & drivers...',
      '✅ Windows 11 installation completed successfully! Restarting PC...'
    ]);
    setStep(3);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-emerald-400" />
          <h3 className="text-base font-bold text-white">Software Lab: Simulasi OS & Driver Setup</h3>
        </div>
        <span className="text-xs font-semibold text-emerald-400">Step {step} dari 3</span>
      </div>

      <div className="space-y-4">
        {step === 1 && (
          <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <h4 className="font-bold text-white">Langkah 1: Konfigurasi BIOS / UEFI Boot Priority</h4>
            <p className="text-slate-400">
              Pilih urutan boot agar komputer membaca media instalasi USB Flashdisk saat dinyalakan.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-slate-300">1st Boot Device:</span>
              <button
                onClick={handleSetBoot}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all"
              >
                Ubah ke: USB Flashdisk (Windows Installer)
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <h4 className="font-bold text-white">Langkah 2: Pemilihan Partisi & Instalasi OS</h4>
            <p className="text-slate-400">
              Sistem telah mendeteksi SSD M.2 512GB Unallocated Space. Klik Mulai Instalasi.
            </p>
            <button
              onClick={handleStartInstall}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Mulai Instalasi Windows 11</span>
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl text-xs text-emerald-300 font-semibold space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Instalasi OS & Driver VGA/Chipset Berhasil Diselesaikan!</span>
            </div>
            <p className="text-slate-300 font-normal">
              Komputer telah siap digunakan untuk aktivitas produktif kerja.
            </p>
          </div>
        )}

        {/* Terminal Display */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 font-mono text-xs space-y-1 text-emerald-400 max-h-40 overflow-y-auto">
          {logs.map((l, idx) => (
            <div key={idx}>{l}</div>
          ))}
        </div>
      </div>
    </div>
  );
};
