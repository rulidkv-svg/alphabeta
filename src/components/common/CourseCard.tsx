import React from 'react';
import {
  Star,
  Clock,
  BookOpen,
  Award,
  Users,
  Play,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { Course } from '../../types';
import { calculateCoursePrice, getCourseTier, formatRupiah } from '../../utils/pricing';
import { useLanguage } from '../../context/LanguageContext';
import { getLocalizedCourse } from '../../i18n/courseTranslations';

interface CourseCardProps {
  course: Course;
  onNavigate: (view: string, param?: string) => void;
  progress?: number;
  isEnrolled?: boolean;
  variant?: 'grid' | 'carousel' | 'compact' | 'horizontal';
  showProgress?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onNavigate,
  progress,
  isEnrolled = false,
  variant = 'grid',
  showProgress = true
}) => {
  const { language } = useLanguage();
  const localized = getLocalizedCourse(course, language);
  const tier = getCourseTier(course);
  const pricing = calculateCoursePrice(course);

  const isFree = pricing.effectivePrice === 0;

  // Category Icon / Emoji helper
  const getCategoryEmoji = (catId?: string, catName?: string) => {
    const text = (catName || '').toLowerCase();
    if (text.includes('ai') || text.includes('prompt')) return '🤖';
    if (text.includes('komputer') || text.includes('teknologi')) return '💻';
    if (text.includes('desain') || text.includes('kreatif')) return '🎨';
    if (text.includes('bahasa') || text.includes('english')) return '🌎';
    if (text.includes('marketing')) return '📈';
    if (text.includes('data') || text.includes('anal')) return '📊';
    if (text.includes('guru') || text.includes('paud')) return '👩‍🏫';
    if (text.includes('office') || text.includes('word') || text.includes('excel')) return '📑';
    if (text.includes('bisnis') || text.includes('usaha')) return '💼';
    return '📚';
  };

  const handleCardClick = () => {
    if (isEnrolled) {
      onNavigate('learning', course.CourseID);
    } else {
      onNavigate('course_detail', course.CourseID);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-xl hover:border-blue-300/80 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer active:scale-[0.99] ${
        variant === 'carousel' ? 'w-[300px] sm:w-[320px] shrink-0' : 'w-full'
      }`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <img
          src={course.Thumbnail}
          alt={localized.Title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Soft gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-xs border border-white/60">
            <span>{getCategoryEmoji(course.CategoryID, course.CategoryName)}</span>
            <span className="truncate max-w-[130px]">{course.CategoryName || 'Teknologi'}</span>
          </span>

          <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-blue-900/90 backdrop-blur-md text-[10px] font-extrabold text-blue-100 border border-blue-400/30 uppercase tracking-wider">
            {course.Level || 'Semua Level'}
          </span>
        </div>

        {/* Floating Play Indicator on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-blue-600/90 backdrop-blur-sm text-white flex items-center justify-center shadow-lg shadow-blue-600/40 transform scale-75 group-hover:scale-100 transition-transform duration-200">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>

        {/* Rating & Learners in Thumbnail Bottom */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-white font-medium drop-shadow-md">
          <div className="flex items-center gap-1 bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold">{course.Rating || 4.9}</span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900/70 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 text-slate-200">
            <Users className="w-3 h-3 text-blue-300" />
            <span>{course.EnrolledCount || 100}+ peserta</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div>
          {/* Subcategory or Tier */}
          {course.Subcategory && (
            <p className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider mb-1 line-clamp-1">
              {course.Subcategory}
            </p>
          )}

          {/* Title */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {localized.Title}
          </h3>

          {/* Instructor Line */}
          <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5 line-clamp-1">
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] border border-slate-200">
              {course.InstructorName ? course.InstructorName.charAt(0) : 'I'}
            </span>
            <span className="font-medium">{course.InstructorName || 'Belum ditentukan'}</span>
          </p>

          {/* Course Features Chips */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5 truncate">
              <BookOpen className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate">{course.WhatYouWillLearn?.length ? `${course.WhatYouWillLearn.length * 2} Modul` : '8 Modul'}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">{course.Duration || '10 JP (4 Sesi)'}</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <Award className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">Sertifikat Resmi</span>
            </div>
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="truncate">Kuis & Lab Praktik</span>
            </div>
          </div>
        </div>

        {/* Progress Bar (If Enrolled) */}
        {isEnrolled && showProgress && typeof progress === 'number' && (
          <div className="pt-2 border-t border-slate-100 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-600">Progress Belajar</span>
              <span className={progress >= 100 ? 'text-emerald-600 font-bold' : 'text-blue-600 font-bold'}>
                {progress}%
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progress >= 100
                    ? 'bg-emerald-500'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                }`}
                style={{ width: `${Math.min(100, Math.max(progress, 5))}%` }}
              />
            </div>
          </div>
        )}

        {/* Pricing and Action Footer */}
        <div className="pt-3 border-t border-slate-100/90 flex items-center justify-between gap-2 mt-auto">
          <div>
            {isEnrolled ? (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Terdaftar
              </span>
            ) : isFree ? (
              <span className="text-xs font-black text-emerald-600 uppercase tracking-wide">
                Gratis / Terbuka
              </span>
            ) : (
              <div className="flex flex-col">
                {pricing.promoPrice && pricing.promoPrice < pricing.normalPrice ? (
                  <>
                    <span className="text-[10px] text-slate-400 line-through">
                      {formatRupiah(pricing.normalPrice)}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900">
                      {formatRupiah(pricing.promoPrice)}
                    </span>
                  </>
                ) : (
                  <span className="text-xs sm:text-sm font-black text-slate-900">
                    {formatRupiah(pricing.effectivePrice)}
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              isEnrolled
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white group-hover:bg-blue-600 group-hover:text-white'
            }`}
          >
            <span>{isEnrolled ? 'Lanjut Belajar' : 'Lihat Kursus'}</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
