import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  Film,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Trash2,
  Eye,
  Check,
  Sparkles,
  Info,
  Clock,
  MessageSquare,
  Award
} from 'lucide-react';
import { PaudAssignmentSpec } from '../../data/paudTrainingData';
import { PaudAssignmentSubmission } from '../../services/paudStorageService';

interface PaudAssignmentUploaderProps {
  moduleNumber: number;
  moduleId: string;
  assignment: PaudAssignmentSpec;
  submission?: PaudAssignmentSubmission;
  onSubmit: (data: Partial<PaudAssignmentSubmission>) => void;
  onShowToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const PaudAssignmentUploader: React.FC<PaudAssignmentUploaderProps> = ({
  moduleNumber,
  moduleId,
  assignment,
  submission,
  onSubmit,
  onShowToast
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    sizeMB: number;
    type: string;
    dataUrl?: string;
  } | null>(
    submission?.fileName
      ? {
          name: submission.fileName,
          sizeMB: submission.fileSizeMB || 1.2,
          type: submission.fileType || 'application/pdf',
          dataUrl: submission.fileDataUrl
        }
      : null
  );

  // Multi-image state for APE Loose Parts
  const [imageUrls, setImageUrls] = useState<string[]>(
    submission?.images || []
  );

  // Video URL / Simulation
  const [videoUrl, setVideoUrl] = useState<string>(
    submission?.videoUrl || ''
  );

  // Text content for Rich editor / Journal reflection
  const [textContent, setTextContent] = useState<string>(
    submission?.textContent || ''
  );

  const [studentNotes, setStudentNotes] = useState<string>(
    submission?.notes || ''
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate word count for text editor
  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;

  const validateAndProcessFile = (file: File) => {
    setErrorMsg(null);

    // 1. Validate File Size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > assignment.maxFileSizeMB) {
      const err = `Ukuran file terlalu besar (${sizeMB.toFixed(1)} MB). Maksimal yang diizinkan adalah ${assignment.maxFileSizeMB} MB.`;
      setErrorMsg(err);
      if (onShowToast) onShowToast(err, 'error');
      return;
    }

    // 2. Validate Extension / Format
    const ext = file.name.split('.').pop()?.toUpperCase() || '';
    const isAccepted = assignment.acceptedFormats.some(f => f.toUpperCase() === ext);
    if (!isAccepted) {
      const err = `Format file .${ext} belum didukung. Gunakan salah satu dari: ${assignment.acceptedFormats.join(', ')}.`;
      setErrorMsg(err);
      if (onShowToast) onShowToast(err, 'error');
      return;
    }

    // 3. Simulate Upload Progress
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev === null || prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(null);

      // Create preview Data URL
      const reader = new FileReader();
      reader.onload = e => {
        const resultUrl = e.target?.result as string;
        setUploadedFile({
          name: file.name,
          sizeMB: Number(sizeMB.toFixed(2)),
          type: file.type,
          dataUrl: resultUrl
        });

        if (assignment.isMultiImage) {
          setImageUrls(prev => [...prev, resultUrl]);
        }
        if (assignment.isVideo) {
          setVideoUrl(resultUrl);
        }
      };
      reader.readAsDataURL(file);

      if (onShowToast) onShowToast(`File ${file.name} berhasil diunggah!`, 'success');
    }, 700);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setImageUrls([]);
    setVideoUrl('');
    setErrorMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    const hasFile = Boolean(uploadedFile);
    const hasText = textContent.trim().length > 20;
    const hasImages = imageUrls.length > 0;

    if (!hasFile && !hasText && !hasImages) {
      const err = 'Mohon unggah file dokumen/media atau isi teks tugas sebelum mengirim.';
      setErrorMsg(err);
      if (onShowToast) onShowToast(err, 'error');
      return;
    }

    onSubmit({
      fileName: uploadedFile?.name,
      fileDataUrl: uploadedFile?.dataUrl,
      fileType: uploadedFile?.type,
      fileSizeMB: uploadedFile?.sizeMB,
      images: imageUrls,
      videoUrl: videoUrl,
      textContent: textContent.trim(),
      notes: studentNotes.trim()
    });

    if (onShowToast) {
      onShowToast('🎉 Tugas berhasil dikirim dan menunggu penilaian fasilitator!', 'success');
    }
  };

  // Status Badge Rendering
  const renderStatusBadge = () => {
    const status = submission?.status || 'Draft';
    switch (status) {
      case 'Approved':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-full font-black text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>TUGAS DISETUJUI (APPROVED)</span>
          </div>
        );
      case 'Revision Required':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 border border-amber-300 text-amber-900 rounded-full font-black text-xs animate-pulse">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>PERLU REVISI (REVISION REQUIRED)</span>
          </div>
        );
      case 'Under Review':
      case 'Submitted':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-100 border border-blue-300 text-blue-900 rounded-full font-black text-xs">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>MENUNGGU PENILAIAN FASILITATOR</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 border border-slate-300 text-slate-700 rounded-full font-bold text-xs">
            <span>BELUM DIKUMPULKAN (DRAFT)</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-xs space-y-6">
      {/* Header with Title & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
            Tugas Mandiri Modul {moduleNumber}
          </span>
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            {assignment.title}
          </h3>
        </div>
        <div>{renderStatusBadge()}</div>
      </div>

      {/* Facilitator Feedback Card if available */}
      {submission && (submission.status === 'Approved' || submission.status === 'Revision Required') && (
        <div
          className={`p-5 rounded-2xl border text-xs space-y-3 ${
            submission.status === 'Approved'
              ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/80 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
              <span className="font-black uppercase tracking-wider">
                Catatan Penilaian Fasilitator ({submission.reviewedBy || 'Vita Situ Zulaikha, S.Pd., M.Pd.'})
              </span>
            </div>
            {submission.score !== undefined && (
              <span className="px-3 py-1 bg-white rounded-xl font-black text-sm border shadow-xs">
                Nilai: {submission.score} / 100
              </span>
            )}
          </div>

          <p className="text-xs leading-relaxed font-medium bg-white/70 p-3.5 rounded-xl border border-slate-200/50">
            {submission.feedback || 'Tugas telah dievaluasi dengan baik.'}
          </p>

          {submission.rubricScores && (
            <div className="space-y-1.5 pt-1">
              <p className="font-bold text-[11px] text-slate-600">Rincian Capaian Rubrik:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {Object.entries(submission.rubricScores).map(([crit, score]) => (
                  <div
                    key={crit}
                    className="flex items-center justify-between p-2 rounded-lg bg-white/80 border border-slate-200 text-[11px]"
                  >
                    <span className="font-semibold text-slate-700 truncate pr-2">{crit}</span>
                    <span className="font-black text-emerald-800 shrink-0">{score} Poin</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Task Instructions */}
      <div className="space-y-2">
        <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-emerald-600" />
          <span>Instruksi Pengerjaan:</span>
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">
          {assignment.description}
        </p>
        <ul className="space-y-1.5 pl-2 pt-1">
          {assignment.instructions.map((inst, idx) => (
            <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span>{inst}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Rubric Evaluation Weights */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <h5 className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Rubrik Penilaian Tugas (Bobot Total 100%):</span>
          </h5>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          {assignment.rubric.map((rub, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start justify-between gap-2"
            >
              <div className="space-y-0.5">
                <p className="font-bold text-slate-900">{rub.criterion}</p>
                <p className="text-[10px] text-slate-500">{rub.description}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] shrink-0">
                {rub.weight}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Rich Text Editor for Reflection / Notes if enabled */}
        {assignment.hasRichTextEditor && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-800 block">
                Tulis Refleksi / Narasi Tugas Langsung (Opsional / Dianjurkan):
              </label>
              <span
                className={`text-[11px] font-bold ${
                  wordCount >= 250 ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {wordCount} Kata (Target ~300 kata)
              </span>
            </div>
            <textarea
              rows={6}
              value={textContent}
              onChange={e => setTextContent(e.target.value)}
              placeholder="Ketikkan narasi deskripsi, latar belakang, dan refleksi mendalam Anda di sini..."
              className="w-full p-4 text-xs font-medium text-slate-900 bg-slate-50 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 leading-relaxed placeholder-slate-400"
            />
          </div>
        )}

        {/* Drag & Drop File Upload Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-800 block">
            Unggah Berkas Tugas (Format: {assignment.acceptedFormats.join(', ')} | Maks{' '}
            {assignment.maxFileSizeMB} MB):
          </label>

          {/* Hidden native input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept={assignment.acceptedFormats
              .map(f => `.${f.toLowerCase()},${f.toLowerCase()}`)
              .join(',')}
            className="hidden"
          />

          {uploadedFile ? (
            /* Uploaded File Preview Card */
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
                  {assignment.isVideo ? (
                    <Film className="w-6 h-6" />
                  ) : assignment.isMultiImage ? (
                    <ImageIcon className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>
                <div className="space-y-0.5 text-xs">
                  <p className="font-bold text-slate-900 line-clamp-1">{uploadedFile.name}</p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Ukuran: {uploadedFile.sizeMB} MB • Siap Dikirim
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Ganti File</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="px-3 py-1.5 bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Hapus</span>
                </button>
              </div>
            </div>
          ) : (
            /* Drag & Drop Dropzone */
            <div
              onDragOver={e => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-3 ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]'
                  : 'border-slate-300 hover:border-emerald-400 bg-slate-50/60 hover:bg-emerald-50/20'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                <Upload className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-bold text-slate-800">
                  Tarik & Letakkan file Anda di sini, atau{' '}
                  <span className="text-emerald-700 underline">Pilih File dari Perangkat</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Mendukung berkas {assignment.acceptedFormats.join(', ')} hingga {assignment.maxFileSizeMB} MB
                </p>
              </div>
            </div>
          )}

          {/* Upload Progress Bar if active */}
          {uploadProgress !== null && (
            <div className="space-y-1 pt-2 animate-in fade-in">
              <div className="flex justify-between text-[11px] font-bold text-slate-600">
                <span>Mengunggah berkas...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all duration-200"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Additional Student Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Catatan Tambahan untuk Fasilitator (Opsional):
          </label>
          <input
            type="text"
            value={studentNotes}
            onChange={e => setStudentNotes(e.target.value)}
            placeholder="Contoh: Tautan Google Drive / Penjelasan konteks kelas..."
            className="w-full px-3.5 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <p className="text-[11px] text-slate-400 font-medium">
            *Anda dapat memperbarui dan mengirim revisi file tugas kapan saja.
          </p>

          <button
            type="submit"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              {submission?.status === 'Revision Required'
                ? 'Kirim Revisi Tugas'
                : submission?.status === 'Approved'
                ? 'Perbarui Berkas Tugas'
                : 'Kumpulkan Tugas Sekarang'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
