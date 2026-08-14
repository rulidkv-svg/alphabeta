import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../context/LanguageContext';
import { Language } from '../../i18n/types';

interface LanguageSelectorProps {
  variant?: 'dropdown' | 'compact' | 'pills' | 'footer';
  className?: string;
  showLabel?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'dropdown',
  className = '',
  showLabel = true
}) => {
  const { language, setLanguage, languages, currentLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // If pills variant (useful in footers or settings cards)
  if (variant === 'pills' || variant === 'footer') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {languages.map(lang => {
          const isActive = lang.code === language;
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-500/20'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-200/60'
              }`}
              title={lang.nativeName}
            >
              <span className="text-sm">{lang.flag}</span>
              <span>{lang.nativeName}</span>
              {isActive && <Check className="w-3 h-3 text-blue-200" />}
            </button>
          );
        })}
      </div>
    );
  }

  // Compact variant (e.g. mobile headers or small bars)
  if (variant === 'compact') {
    return (
      <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-100/90 hover:bg-slate-200 text-slate-700 font-medium text-xs border border-slate-200/80 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          title={`Language: ${currentLanguage.nativeName}`}
        >
          <span className="text-base">{currentLanguage.flag}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute mt-2 w-48 rounded-2xl bg-white shadow-xl border border-slate-200/80 py-1.5 z-50 ${
                isRTL ? 'left-0' : 'right-0'
              }`}
            >
              <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Pilih Bahasa / Language
              </div>
              {languages.map(lang => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold transition-colors ${
                    lang.code === language
                      ? 'bg-blue-50 text-blue-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-base">{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                  </span>
                  {lang.code === language && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Standard Dropdown variant
  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 text-slate-800 font-semibold text-xs border border-slate-200/90 shadow-2xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      >
        <span className="text-sm">{currentLanguage.flag}</span>
        {showLabel && <span className="hidden sm:inline font-medium">{currentLanguage.nativeName}</span>}
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`absolute mt-2 w-52 rounded-2xl bg-white shadow-2xl border border-slate-200/90 py-1.5 z-50 ${
              isRTL ? 'left-0' : 'right-0'
            }`}
          >
            <div className="px-3.5 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>Language / Bahasa</span>
              <Globe className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="p-1 space-y-0.5">
              {languages.map(lang => {
                const isCurrent = lang.code === language;
                return (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => {
                      setLanguage(lang.code as Language);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    {isCurrent && <Check className="w-4 h-4 text-white" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
