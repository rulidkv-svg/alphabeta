import React, { useState } from 'react';
import { Cpu, CheckCircle2, AlertCircle, RefreshCw, Award, HelpCircle } from 'lucide-react';

interface HardwareQuestion {
  id: string;
  image: string;
  question: string;
  options: string[];
  correct: string;
  explanation: string;
}

const HARDWARE_ITEMS: HardwareQuestion[] = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400&auto=format&fit=crop&q=80',
    question: 'Komponen hardware apakah yang tampak pada gambar di atas?',
    options: ['RAM Memory', 'Processor (CPU)', 'Graphics Card (GPU)', 'Power Supply (PSU)'],
    correct: 'Processor (CPU)',
    explanation: 'Processor (CPU) merupakan chip silikon mikrokontroler utama yang bertindak sebagai pusat pemrosesan logika komputer.'
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=400&auto=format&fit=crop&q=80',
    question: 'Hardware apakah ini dan berada di slot mana pada motherboard?',
    options: ['RAM (Random Access Memory) di Slot DIMM', 'SSD di Slot M.2', 'Power Supply di Casing', 'Harddisk di Slot SATA'],
    correct: 'RAM (Random Access Memory) di Slot DIMM',
    explanation: 'Komponen tersebut adalah modul RAM (DIMM) yang berfungsi menyimpan data aplikasi aktif sementara.'
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&auto=format&fit=crop&q=80',
    question: 'Identifikasi komponen dengan kipas pendingin khusus ini:',
    options: ['Sound Card', 'LAN Card', 'Kartu Grafis (GPU / VGA)', 'Motherboard'],
    correct: 'Kartu Grafis (GPU / VGA)',
    explanation: 'Graphics Processing Unit (GPU) bertugas memproses rendering visual 2D/3D untuk output monitor.'
  }
];

export const HardwareLab: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const currentQ = HARDWARE_ITEMS[currentIndex];

  const handleAnswer = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
    setIsSubmitted(true);
    if (option === currentQ.correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setIsSubmitted(false);
    if (currentIndex < HARDWARE_ITEMS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-3xl p-4 sm:p-6 shadow-2xl border border-slate-800 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-400" />
          <h3 className="text-base font-bold text-white">Hardware Identification Lab</h3>
        </div>
        <span className="text-xs font-semibold text-slate-400">
          Soal {currentIndex + 1} dari {HARDWARE_ITEMS.length}
        </span>
      </div>

      <div className="space-y-4">
        <img
          src={currentQ.image}
          alt="Hardware Test"
          className="w-full h-52 object-cover rounded-2xl border border-slate-700 bg-slate-950"
        />

        <p className="text-sm font-bold text-white leading-relaxed">{currentQ.question}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {currentQ.options.map((opt, i) => {
            let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-800';
            if (isSubmitted) {
              if (opt === currentQ.correct) btnStyle = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
              else if (selectedOption === opt) btnStyle = 'bg-rose-950 border-rose-500 text-rose-300';
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                disabled={isSubmitted}
                className={`p-3 rounded-2xl border text-xs text-left transition-all ${btnStyle}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {isSubmitted && (
          <div className="p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs leading-relaxed space-y-1">
            <p className="font-bold text-blue-300">Penjelasan Instruksional:</p>
            <p className="text-slate-300">{currentQ.explanation}</p>
          </div>
        )}

        {isSubmitted && currentIndex < HARDWARE_ITEMS.length - 1 && (
          <button
            onClick={handleNext}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Lanjut ke Soal Berikutnya →
          </button>
        )}
      </div>
    </div>
  );
};
