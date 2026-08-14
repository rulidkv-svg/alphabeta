import React, { useState } from 'react';
import { Cpu, CheckCircle2, AlertCircle, RefreshCw, Zap, Award, Play, ShieldAlert, Monitor, Info } from 'lucide-react';

interface PCPart {
  id: string;
  name: string;
  slot: string;
  image: string;
  description: string;
}

const PARTS_CATALOG: PCPart[] = [
  { id: 'cpu', name: 'Intel / AMD Processor (CPU)', slot: 'cpu_socket', image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=300&auto=format&fit=crop&q=80', description: 'Otak pemroses utama komputasi.' },
  { id: 'ram', name: 'RAM DDR4 / DDR5 (8GB/16GB)', slot: 'ram_slot', image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=300&auto=format&fit=crop&q=80', description: 'Penyimpanan data sementara kecepatan tinggi.' },
  { id: 'cooler', name: 'CPU Cooler / Heatsink', slot: 'cooler_slot', image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=300&auto=format&fit=crop&q=80', description: 'Penyejuk suhu processor.' },
  { id: 'gpu', name: 'Graphics Card (GPU / VGA)', slot: 'gpu_slot', image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=300&auto=format&fit=crop&q=80', description: 'Pengolah visual dan grafis 3D.' },
  { id: 'ssd', name: 'SSD M.2 NVMe Storage', slot: 'ssd_slot', image: 'https://images.unsplash.com/photo-1597872250969-2592ac24296d?w=300&auto=format&fit=crop&q=80', description: 'Penyimpanan sistem operasi berkecepatan tinggi.' },
  { id: 'psu', name: 'Power Supply Unit 650W Gold', slot: 'psu_bay', image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=300&auto=format&fit=crop&q=80', description: 'Penyedia arus daya stabil.' },
  { id: 'cables', name: 'Kabel Power ATX 24-Pin & CPU 8-Pin', slot: 'cable_header', image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=300&auto=format&fit=crop&q=80', description: 'Kabel penghantar arus ke motherboard.' }
];

const CORRECT_ORDER = ['cpu', 'ram', 'cooler', 'ssd', 'psu', 'gpu', 'cables'];

interface PCSimulatorProps {
  onComplete?: (score: number) => void;
}

export const PCSimulator: React.FC<PCSimulatorProps> = ({ onComplete }) => {
  const [placedParts, setPlacedParts] = useState<Record<string, PCPart>>({});
  const [selectedPart, setSelectedPart] = useState<PCPart | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; text: string }>({
    type: 'info',
    text: 'Pilih komponen di panel kiri, lalu klik slot tujuan pada Motherboard/Casing.'
  });
  const [errorsCount, setErrorsCount] = useState(0);
  const [isAssemblyComplete, setIsAssemblyComplete] = useState(false);
  const [isPoweredOn, setIsPoweredOn] = useState(false);

  const handleSelectPart = (part: PCPart) => {
    if (placedParts[part.slot]) {
      setFeedback({ type: 'error', text: `Komponen ${part.name} sudah terpasang!` });
      return;
    }
    setSelectedPart(part);
    setFeedback({
      type: 'info',
      text: `Anda memilih ${part.name}. Sekarang klik slot "${part.slot.toUpperCase()}" pada Motherboard.`
    });
  };

  const handleSlotClick = (slotId: string) => {
    if (!selectedPart) {
      setFeedback({ type: 'error', text: 'Pilih komponen dari katalog terlebih dahulu!' });
      return;
    }

    if (selectedPart.slot !== slotId) {
      setErrorsCount(prev => prev + 1);
      setFeedback({
        type: 'error',
        text: `❌ Posisi ${selectedPart.name} salah! Komponen ini harus dipasang pada slot ${selectedPart.slot.toUpperCase()}.`
      });
      return;
    }

    // Check order step recommendation
    const currentStepIndex = Object.keys(placedParts).length;
    const expectedPartId = CORRECT_ORDER[currentStepIndex];

    if (selectedPart.id !== expectedPartId && currentStepIndex < 2) {
      setFeedback({
        type: 'info',
        text: `💡 Tips Praktik: Disarankan memasang Processor (CPU) dan RAM terlebih dahulu sebelum komponen besar lainnya.`
      });
    }

    const newPlaced = { ...placedParts, [slotId]: selectedPart };
    setPlacedParts(newPlaced);
    setSelectedPart(null);

    setFeedback({
      type: 'success',
      text: `✅ ${selectedPart.name} berhasil dipasang dengan sempurna!`
    });

    // Check if all parts placed
    if (Object.keys(newPlaced).length === PARTS_CATALOG.length) {
      setIsAssemblyComplete(true);
      const calculatedScore = Math.max(60, 100 - errorsCount * 10);
      if (onComplete) onComplete(calculatedScore);
    }
  };

  const handleTestPowerOn = () => {
    setIsPoweredOn(true);
    setFeedback({
      type: 'success',
      text: '🎉 POST SUCCESSFUL! Kipas berputar, lampu RGB menyala, dan sistem BIOS berhasil mendeteksi seluruh komponen PC!'
    });
  };

  const handleReset = () => {
    setPlacedParts({});
    setSelectedPart(null);
    setErrorsCount(0);
    setIsAssemblyComplete(false);
    setIsPoweredOn(false);
    setFeedback({
      type: 'info',
      text: 'Simulator direset. Silakan mulai kembali perakitan.'
    });
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              Interactive 2D Lab
            </span>
            <h3 className="text-lg font-bold text-white">Simulator Perakitan PC Interaktif</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pasang komponen hardware ke slot Motherboard & Casing yang tepat secara berurutan.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700 text-xs font-semibold">
          <div>
            <span className="text-slate-400">Progress:</span>
            <span className="ml-1 text-emerald-400 font-bold">{Object.keys(placedParts).length} / {PARTS_CATALOG.length}</span>
          </div>
          <div className="w-px h-4 bg-slate-700"></div>
          <div>
            <span className="text-slate-400">Kesalahan:</span>
            <span className="ml-1 text-rose-400 font-bold">{errorsCount}</span>
          </div>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors ml-1"
            title="Reset Simulator"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      <div
        className={`p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-3 transition-all ${
          feedback.type === 'success'
            ? 'bg-emerald-950/80 border border-emerald-800 text-emerald-300'
            : feedback.type === 'error'
            ? 'bg-rose-950/80 border border-rose-800 text-rose-300'
            : 'bg-blue-950/80 border border-blue-800 text-blue-300'
        }`}
      >
        {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
        {feedback.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />}
        {feedback.type === 'info' && <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />}
        <span>{feedback.text}</span>
      </div>

      {/* Main Assembly Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parts Inventory (Catalog) */}
        <div className="lg:col-span-4 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Katalog Komponent PC</span>
          </h4>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {PARTS_CATALOG.map(part => {
              const isPlaced = !!placedParts[part.slot];
              const isSelected = selectedPart?.id === part.id;

              return (
                <div
                  key={part.id}
                  onClick={() => !isPlaced && handleSelectPart(part)}
                  className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                    isPlaced
                      ? 'bg-slate-800/40 border-slate-800 opacity-50 cursor-not-allowed'
                      : isSelected
                      ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                      : 'bg-slate-800/80 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
                  }`}
                >
                  <img
                    src={part.image}
                    alt={part.name}
                    className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{part.name}</p>
                    <p className="text-[10px] text-slate-400 line-clamp-1">{part.description}</p>
                    <span className="text-[9px] font-semibold text-blue-400">Slot: {part.slot.toUpperCase()}</span>
                  </div>
                  {isPlaced && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Motherboard & Case Canvas */}
        <div className="lg:col-span-8 bg-slate-950 rounded-3xl p-4 border border-slate-800 relative min-h-[420px] flex flex-col justify-between overflow-hidden">
          {/* Visual Motherboard Grid Layout */}
          <div className="text-center mb-2">
            <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase">
              ALPHA BETA ATX MOTHERBOARD V2.0
            </span>
          </div>

          <div className="relative w-full aspect-video bg-slate-900/90 rounded-2xl border-2 border-dashed border-slate-800 p-4 grid grid-cols-3 gap-3 items-center">
            {/* Slot 1: CPU Socket */}
            <div
              onClick={() => handleSlotClick('cpu_socket')}
              className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[100px] ${
                placedParts['cpu_socket']
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
                  : selectedPart?.slot === 'cpu_socket'
                  ? 'bg-blue-900/40 border-blue-400 animate-pulse'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 mb-1">CPU_SOCKET_LGA1700</span>
              {placedParts['cpu_socket'] ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="text-[10px] font-bold mt-1 text-white">{placedParts['cpu_socket'].name}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-semibold">Klik pasang CPU</span>
              )}
            </div>

            {/* Slot 2: RAM Slot */}
            <div
              onClick={() => handleSlotClick('ram_slot')}
              className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[100px] ${
                placedParts['ram_slot']
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
                  : selectedPart?.slot === 'ram_slot'
                  ? 'bg-blue-900/40 border-blue-400 animate-pulse'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 mb-1">DIMM_RAM_SLOT_1&2</span>
              {placedParts['ram_slot'] ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="text-[10px] font-bold mt-1 text-white">{placedParts['ram_slot'].name}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-semibold">Klik pasang RAM</span>
              )}
            </div>

            {/* Slot 3: CPU Cooler */}
            <div
              onClick={() => handleSlotClick('cooler_slot')}
              className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[100px] ${
                placedParts['cooler_slot']
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
                  : selectedPart?.slot === 'cooler_slot'
                  ? 'bg-blue-900/40 border-blue-400 animate-pulse'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 mb-1">CPU_COOLER_MOUNT</span>
              {placedParts['cooler_slot'] ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="text-[10px] font-bold mt-1 text-white">{placedParts['cooler_slot'].name}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-semibold">Klik pasang Cooler</span>
              )}
            </div>

            {/* Slot 4: M.2 SSD */}
            <div
              onClick={() => handleSlotClick('ssd_slot')}
              className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[100px] ${
                placedParts['ssd_slot']
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
                  : selectedPart?.slot === 'ssd_slot'
                  ? 'bg-blue-900/40 border-blue-400 animate-pulse'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 mb-1">M.2_NVME_SLOT</span>
              {placedParts['ssd_slot'] ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="text-[10px] font-bold mt-1 text-white">{placedParts['ssd_slot'].name}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-semibold">Klik pasang SSD</span>
              )}
            </div>

            {/* Slot 5: GPU PCIe x16 */}
            <div
              onClick={() => handleSlotClick('gpu_slot')}
              className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[100px] ${
                placedParts['gpu_slot']
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
                  : selectedPart?.slot === 'gpu_slot'
                  ? 'bg-blue-900/40 border-blue-400 animate-pulse'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 mb-1">PCIe_x16_GPU_SLOT</span>
              {placedParts['gpu_slot'] ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="text-[10px] font-bold mt-1 text-white">{placedParts['gpu_slot'].name}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-semibold">Klik pasang VGA</span>
              )}
            </div>

            {/* Slot 6: PSU Bay */}
            <div
              onClick={() => handleSlotClick('psu_bay')}
              className={`p-3 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center transition-all cursor-pointer min-h-[100px] ${
                placedParts['psu_bay']
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
                  : selectedPart?.slot === 'psu_bay'
                  ? 'bg-blue-900/40 border-blue-400 animate-pulse'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <span className="text-[10px] font-bold text-slate-400 mb-1">PSU_SHROUD_BAY</span>
              {placedParts['psu_bay'] ? (
                <div className="flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  <span className="text-[10px] font-bold mt-1 text-white">{placedParts['psu_bay'].name}</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-semibold">Klik pasang PSU</span>
              )}
            </div>

            {/* Slot 7: Cables Header */}
            <div
              onClick={() => handleSlotClick('cable_header')}
              className={`col-span-3 p-3 rounded-2xl border-2 border-dashed flex items-center justify-center gap-3 transition-all cursor-pointer ${
                placedParts['cable_header']
                  ? 'bg-emerald-950/40 border-emerald-500/80 text-emerald-300'
                  : selectedPart?.slot === 'cable_header'
                  ? 'bg-blue-900/40 border-blue-400 animate-pulse'
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-500'
              }`}
            >
              <Zap className="w-5 h-5 text-amber-400" />
              <span className="text-[10px] font-bold text-slate-400">24-PIN & 8-PIN CABLE HARNESS</span>
              {placedParts['cable_header'] ? (
                <span className="text-[10px] font-bold text-emerald-400 ml-2">✅ Kabel Terhubung!</span>
              ) : (
                <span className="text-[10px] text-slate-500">Klik hubungkan kabel power</span>
              )}
            </div>
          </div>

          {/* Test Power Button */}
          {isAssemblyComplete && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Award className="w-5 h-5" />
                <span>Seluruh Komponen Berhasil Terpasang! Selesai Praktik.</span>
              </div>

              <button
                onClick={handleTestPowerOn}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Nyalakan PC (Power Test)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
