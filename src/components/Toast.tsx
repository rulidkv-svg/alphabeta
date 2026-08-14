import React from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose }) => {
  return (
    <div className="fixed top-20 right-4 z-50 flex items-center justify-between p-4 rounded-2xl shadow-xl border text-xs font-bold transition-all animate-in fade-in slide-in-from-top-4 max-w-md w-full bg-white border-slate-200">
      <div className="flex items-center gap-3">
        {type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />}
        {type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />}
        {type === 'info' && <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />}
        <span className="text-slate-800">{message}</span>
      </div>
      <button
        onClick={onClose}
        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
