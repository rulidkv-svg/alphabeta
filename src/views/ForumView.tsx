import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, User, Star, ShieldCheck, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
import { ForumTopic, ForumReply } from '../types';
import { useAuth } from '../context/AuthContext';

interface ForumViewProps {
  courseId?: string;
}

export const ForumView: React.FC<ForumViewProps> = ({ courseId = 'CRS-TK01' }) => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<ForumTopic[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<ForumTopic | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newReplyContent, setNewReplyContent] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTopics = async () => {
    try {
      const data = await apiService.getForumTopics(courseId);
      setTopics(data);
      if (data.length > 0 && !selectedTopic) {
        handleSelectTopic(data[0]);
      }
    } catch (e) {
      console.error('Error loading forum:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTopics();
  }, [courseId]);

  const handleSelectTopic = async (topic: ForumTopic) => {
    setSelectedTopic(topic);
    try {
      const rep = await apiService.getForumReplies(topic.PostID);
      setReplies(rep);
    } catch (e) {
      console.error('Error loading replies:', e);
    }
  };

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim() || !user) return;

    try {
      await apiService.createForumTopic({
        courseId,
        userId: user.UserID,
        title: newTitle,
        content: newContent
      });

      setNewTitle('');
      setNewContent('');
      loadTopics();
    } catch (err) {
      console.error('Error creating topic:', err);
    }
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReplyContent.trim() || !selectedTopic || !user) return;

    try {
      await apiService.postForumReply({
        postId: selectedTopic.PostID,
        userId: user.UserID,
        content: newReplyContent
      });

      setNewReplyContent('');
      handleSelectTopic(selectedTopic);
    } catch (err) {
      console.error('Error posting reply:', err);
    }
  };

  return (
    <div className="space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">💬 FORUM DISKUSI & TANYA JAWAB</h1>
        <p className="text-xs text-slate-500 mt-1">
          Wadah diskusi aktif antara sesama peserta, alumni, dan instruktur pengampu kursus.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Topics List & New Topic Form */}
        <div className="lg:col-span-5 space-y-6">
          {/* Create Topic Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">➕ Buat Diskusi Baru</h3>
            <form onSubmit={handleCreateTopic} className="space-y-3">
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Judul topik diskusi / pertanyaan..."
                className="w-full p-3 bg-slate-50 text-xs font-semibold text-slate-900 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                rows={3}
                placeholder="Detail kendala atau pertanyaan Anda..."
                className="w-full p-3 bg-slate-50 text-xs font-normal text-slate-900 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
              ></textarea>
              <button
                type="submit"
                disabled={!user}
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
              >
                Kirim Diskusi Baru
              </button>
            </form>
          </div>

          {/* Topics List */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 max-h-[480px] overflow-y-auto">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Topik Diskusi Terkini</h3>
            {topics.map(t => {
              const isSelected = selectedTopic?.TopicID === t.TopicID;
              return (
                <div
                  key={t.TopicID}
                  onClick={() => handleSelectTopic(t)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-1.5 ${
                    isSelected
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{t.Title}</h4>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>{t.UserName} ({t.UserRole})</span>
                    <span>💬 {t.ReplyCount || 0} Balasan</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Topic Thread & Replies */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          {selectedTopic ? (
            <div className="space-y-6">
              {/* Main Topic Header */}
              <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900">{selectedTopic.UserName} ({selectedTopic.UserRole})</span>
                  <span className="text-[10px] font-mono text-slate-400">{selectedTopic.CreatedAt}</span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-900">{selectedTopic.Title}</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{selectedTopic.Content}</p>
              </div>

              {/* Replies Thread */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Balasan ({replies.length})
                </h4>

                {replies.map(r => (
                  <div
                    key={r.ReplyID}
                    className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                      r.IsInstructorReply
                        ? 'bg-amber-50/80 border-amber-200 text-amber-950'
                        : 'bg-slate-50 border-slate-200/80 text-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold flex items-center gap-1.5">
                        <span>{r.UserName}</span>
                        {r.IsInstructorReply && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-200 text-amber-900 text-[9px] font-extrabold">
                            ⭐ INSTRUKTUR
                          </span>
                        )}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{r.CreatedAt}</span>
                    </div>
                    <p className="leading-relaxed">{r.Content}</p>
                  </div>
                ))}
              </div>

              {/* Reply Form */}
              <form onSubmit={handlePostReply} className="space-y-2 pt-2 border-t border-slate-100">
                <textarea
                  value={newReplyContent}
                  onChange={e => setNewReplyContent(e.target.value)}
                  rows={2}
                  placeholder="Tuliskan jawaban atau solusi Anda..."
                  className="w-full p-3 bg-slate-50 text-xs text-slate-900 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
                <button
                  type="submit"
                  disabled={!user}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Balasan</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">Pilih topik untuk melihat diskusi.</div>
          )}
        </div>
      </div>
    </div>
  );
};
