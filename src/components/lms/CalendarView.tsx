import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Video, FileText, CheckCircle2, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { apiService } from '../../services/api';

interface CalendarViewProps {
  courseId?: string;
  onNavigateToSession?: (sessionId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ courseId }) => {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await apiService.getLiveSessions(courseId);
        setSessions(data || []);
      } catch (e) {
        console.error('Error loading calendar sessions:', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [courseId]);

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">⏳ Memuat kalender kegiatan...</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-100 text-blue-700">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Kalender Kegiatan & Tatap Muka</h3>
            <p className="text-xs text-slate-500">Jadwal sesi live, batas waktu tugas, dan ujian sertifikasi</p>
          </div>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          Belum ada kegiatan terjadwal di kalender.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map(s => (
            <div
              key={s.SessionID}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition-all hover:bg-slate-100/80"
            >
              <div className="flex items-start gap-3">
                <div className={`p-3 rounded-2xl shrink-0 ${
                  s.Platform === 'ZOOM' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800">
                      {s.Platform === 'ZOOM' ? 'Zoom Meeting' : 'Google Meet'}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{s.Status}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{s.Title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      {s.Date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {s.StartTime} - {s.EndTime} WIB
                    </span>
                  </p>
                </div>
              </div>

              <a
                href={s.MeetingURL}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shrink-0 self-end sm:self-auto"
              >
                Gabung Pertemuan
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
