import React from 'react';
import { AlertTriangle, RefreshCw, FolderOpen } from 'lucide-react';

/**
 * Skeleton Loader for Course Cards
 */
export const CourseCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-pulse flex flex-col">
      <div className="h-40 bg-slate-200 w-full relative" />
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded-md w-1/4" />
            <div className="h-4 bg-slate-200 rounded-md w-1/5" />
          </div>
          <div className="h-5 bg-slate-200 rounded-md w-5/6" />
          <div className="h-4 bg-slate-100 rounded-md w-full" />
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="h-4 bg-slate-200 rounded-md w-1/3" />
          <div className="h-8 bg-slate-200 rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton Loader for Material / Lesson Items
 */
export const MaterialCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 animate-pulse flex items-center gap-4">
      <div className="w-10 h-10 rounded-xl bg-slate-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 rounded-md w-3/4" />
        <div className="h-3 bg-slate-100 rounded-md w-1/2" />
      </div>
      <div className="w-16 h-7 bg-slate-200 rounded-lg shrink-0" />
    </div>
  );
};

/**
 * Skeleton Loader for Dashboard Stat Cards
 */
export const StatCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 animate-pulse space-y-3">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-slate-200 rounded-md w-1/3" />
        <div className="w-8 h-8 rounded-lg bg-slate-200" />
      </div>
      <div className="h-7 bg-slate-200 rounded-md w-1/2" />
    </div>
  );
};

/**
 * Skeleton Loader for Table Rows
 */
export const TableRowSkeleton: React.FC<{ cols?: number }> = ({ cols = 5 }) => {
  return (
    <tr className="animate-pulse border-b border-slate-100">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="py-3 px-4">
          <div className="h-4 bg-slate-200 rounded-md w-4/5" />
        </td>
      ))}
    </tr>
  );
};

/**
 * Error State Component with Retry Button
 */
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Gagal Memuat Data',
  message = 'Materi/data belum dapat dimuat saat ini. Silakan periksa koneksi internet Anda.',
  onRetry,
}) => {
  return (
    <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-6 text-center space-y-3 max-w-md mx-auto my-6">
      <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 mx-auto">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-extrabold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-600 font-medium">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Coba Lagi</span>
        </button>
      )}
    </div>
  );
};

/**
 * Empty State Component
 */
interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'Belum Ada Data Tersedia',
  message = 'Belum ada data atau materi yang terdaftar dalam kategori ini.',
  icon,
  actionButton,
}) => {
  return (
    <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-3 max-w-md mx-auto my-6">
      <div className="w-12 h-12 bg-slate-200/70 rounded-2xl flex items-center justify-center text-slate-500 mx-auto">
        {icon || <FolderOpen className="w-6 h-6" />}
      </div>
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
        <p className="text-xs text-slate-500">{message}</p>
      </div>
      {actionButton && <div className="pt-2">{actionButton}</div>}
    </div>
  );
};
