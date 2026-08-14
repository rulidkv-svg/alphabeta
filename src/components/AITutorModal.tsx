import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, RefreshCw, HelpCircle, Lightbulb } from 'lucide-react';
import { apiService } from '../services/api';
import { AITutorMessage } from '../types';

interface AITutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCourseTitle?: string;
  activeTopic?: string;
}

export const AITutorModal: React.FC<AITutorModalProps> = ({
  isOpen,
  onClose,
  activeCourseTitle,
  activeTopic
}) => {
  const [messages, setMessages] = useState<AITutorMessage[]>([
    {
      id: '1',
      sender: 'tutor',
      text: `Halo! Saya **Alpha Beta AI Tutor** 🤖. Selamat datang! \n Ada materi ${activeTopic ? `tentang "${activeTopic}"` : ''} atau konsep yang ingin dijawab atau dijelaskan dengan lebih sederhana?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: AITutorMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await apiService.askAITutor({
        message: query,
        courseTitle: activeCourseTitle,
        topic: activeTopic
      });

      const tutorMsg: AITutorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, tutorMsg]);
    } catch (e) {
      const errorMsg: AITutorMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'tutor',
        text: 'Maaf, terjadi kendala saat menghubungkan ke AI Tutor.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'Jelaskan perbedaan RAM dan SSD dengan analogi sederhana',
    'Bagaimana cara memasang CPU ke socket motherboard dengan aman?',
    'Buatkan 3 contoh kuis latihan untuk materi ini',
    'Apa itu subnetting IPv4 /24?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-lg w-full h-[600px] max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Bot className="w-6 h-6 text-amber-300 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">Alpha Beta AI Tutor</h3>
              <p className="text-[11px] text-blue-100 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>Asisten Belajar Cerdas Alpha Beta Learning Center</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Course Context Banner */}
        {activeCourseTitle && (
          <div className="bg-blue-50/80 px-4 py-2 border-b border-blue-100 text-xs font-semibold text-blue-800 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span className="truncate">Konteks Kursus: {activeCourseTitle} {activeTopic ? `(${activeTopic})` : ''}</span>
          </div>
        )}

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map(m => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-indigo-600 text-white'
                }`}
              >
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-300" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-white p-3 rounded-2xl border border-slate-200 w-fit">
              <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
              <span>AI Tutor sedang memproses penjelasan...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[11px] font-medium text-slate-600">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 whitespace-nowrap transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Tanyakan materi atau minta penjelasan..."
            className="flex-1 bg-slate-100 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
