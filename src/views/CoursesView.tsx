import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Star,
  BookOpen,
  Clock,
  Award,
  CheckCircle2,
  Tag,
  Layers,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  X,
  Cpu,
  Palette,
  Briefcase,
  Languages,
  Monitor,
  Bot,
  GraduationCap,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { apiService } from '../services/api';
import { Course, Category, ProgramTierLevel } from '../types';
import { CourseCardSkeleton, EmptyState, ErrorState } from '../components/common/Skeletons';
import { CourseCard } from '../components/common/CourseCard';
import { calculateCoursePrice, getCourseTier, TIER_CONFIGS } from '../utils/pricing';
import { useLanguage } from '../context/LanguageContext';
import { getLocalizedCourse, getLocalizedCategory } from '../i18n/courseTranslations';
import { fadeUpVariant, staggerContainer } from '../utils/animations';

interface CoursesViewProps {
  initialCategory?: string;
  onNavigate: (view: string, param?: string) => void;
}

const ITEMS_PER_PAGE = 9;

export const CoursesView: React.FC<CoursesViewProps> = ({ initialCategory, onNavigate }) => {
  const { t, language } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Filters State
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all'); // all, short, medium, intensive
  const [selectedType, setSelectedType] = useState<string>('all'); // all, free, certified, promo
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'price_low' | 'price_high'>('popular');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Parse initialCategory prop (handles "CAT-001", "search:python", etc.)
  useEffect(() => {
    if (initialCategory) {
      if (initialCategory.startsWith('search:')) {
        setSearchQuery(initialCategory.replace('search:', ''));
        setSelectedCat('all');
      } else {
        setSelectedCat(initialCategory);
      }
    }
  }, [initialCategory]);

  const fetchData = async () => {
    setLoading(true);
    setError(false);
    try {
      const [cList, catList] = await Promise.all([
        apiService.getCourses(),
        apiService.getCategories()
      ]);
      setCourses(cList || []);
      setCategories(catList || []);
    } catch (e) {
      console.error('Error loading courses catalog:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCat, selectedLevel, selectedDuration, selectedType, selectedTier, searchQuery, sortBy]);

  // Reset all filters helper
  const handleResetFilters = () => {
    setSelectedCat('all');
    setSelectedLevel('all');
    setSelectedDuration('all');
    setSelectedType('all');
    setSelectedTier('all');
    setSearchQuery('');
    setSortBy('popular');
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCat !== 'all' ||
    selectedLevel !== 'all' ||
    selectedDuration !== 'all' ||
    selectedType !== 'all' ||
    selectedTier !== 'all' ||
    searchQuery.trim().length > 0;

  // Filter and Sort Courses
  const filteredAndSortedCourses = useMemo(() => {
    let result = courses.filter(course => {
      const localized = getLocalizedCourse(course, language);

      // Category filter
      if (selectedCat !== 'all' && course.CategoryID !== selectedCat) {
        return false;
      }

      // Level filter
      if (selectedLevel !== 'all') {
        const cLevel = (course.Level || 'Semua Level').toLowerCase();
        if (selectedLevel === 'beginner' && !cLevel.includes('pemula') && !cLevel.includes('dasar') && !cLevel.includes('semua')) return false;
        if (selectedLevel === 'intermediate' && !cLevel.includes('menengah') && !cLevel.includes('semua')) return false;
        if (selectedLevel === 'advanced' && !cLevel.includes('mahir') && !cLevel.includes('profesional') && !cLevel.includes('semua')) return false;
      }

      // Duration filter
      if (selectedDuration !== 'all') {
        const durText = (course.Duration || '').toLowerCase();
        const jpMatch = durText.match(/(\d+)\s*jp/);
        const jp = jpMatch ? parseInt(jpMatch[1], 10) : 10;
        if (selectedDuration === 'short' && jp > 15) return false;
        if (selectedDuration === 'medium' && (jp <= 15 || jp > 30)) return false;
        if (selectedDuration === 'intensive' && jp <= 30) return false;
      }

      // Course Type filter
      if (selectedType !== 'all') {
        const priceInfo = calculateCoursePrice(course);
        if (selectedType === 'free' && priceInfo.effectivePrice > 0) return false;
        if (selectedType === 'promo' && (!priceInfo.promoPrice || priceInfo.promoPrice >= priceInfo.normalPrice)) return false;
        if (selectedType === 'certified' && !course.DirectorName && !course.InstructorName) return false;
      }

      // Tier filter
      if (selectedTier !== 'all') {
        const tier = getCourseTier(course);
        if (tier !== selectedTier) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = localized.Title.toLowerCase().includes(query);
        const matchesDesc = localized.Description.toLowerCase().includes(query);
        const matchesSubcat = course.Subcategory ? course.Subcategory.toLowerCase().includes(query) : false;
        const matchesCat = course.CategoryName ? course.CategoryName.toLowerCase().includes(query) : false;
        const matchesInstructor = course.InstructorName ? course.InstructorName.toLowerCase().includes(query) : false;

        if (!matchesTitle && !matchesDesc && !matchesSubcat && !matchesCat && !matchesInstructor) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.Rating || 0) - (a.Rating || 0);
      }
      if (sortBy === 'popular') {
        return (b.EnrolledCount || 0) - (a.EnrolledCount || 0);
      }
      if (sortBy === 'price_low') {
        const pA = calculateCoursePrice(a).effectivePrice;
        const pB = calculateCoursePrice(b).effectivePrice;
        return pA - pB;
      }
      if (sortBy === 'price_high') {
        const pA = calculateCoursePrice(a).effectivePrice;
        const pB = calculateCoursePrice(b).effectivePrice;
        return pB - pA;
      }
      return 0;
    });

    return result;
  }, [courses, language, selectedCat, selectedLevel, selectedDuration, selectedType, selectedTier, searchQuery, sortBy]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredAndSortedCourses.length / ITEMS_PER_PAGE) || 1;
  const paginatedCourses = filteredAndSortedCourses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Sidebar Filter Component Content
  const renderFilterSidebar = () => (
    <div className="space-y-6 text-xs">
      {/* Header with Reset */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-blue-600" />
          Filter Kursus
        </span>
        {hasActiveFilters && (
          <button
            onClick={handleResetFilters}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-lg transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* 1. Kategori */}
      <div className="space-y-2">
        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
          Kategori Kursus
        </label>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCat('all')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
              selectedCat === 'all'
                ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200/60'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <span>Semua Kategori</span>
            <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500">
              {courses.length}
            </span>
          </button>

          {categories.map(cat => {
            const count = courses.filter(c => c.CategoryID === cat.CategoryID).length;
            const isSelected = selectedCat === cat.CategoryID;
            return (
              <button
                key={cat.CategoryID}
                onClick={() => setSelectedCat(cat.CategoryID)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                  isSelected
                    ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200/60'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="truncate pr-2">{cat.Name}</span>
                <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-500 shrink-0">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Level Kursus */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
          Tingkat Kesulitan
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'Semua Tingkat' },
            { id: 'beginner', label: '🎯 Pemula (Beginner)' },
            { id: 'intermediate', label: '⚡ Menengah (Intermediate)' },
            { id: 'advanced', label: '🔥 Mahir / Profesional' },
          ].map(lvl => (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevel(lvl.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedLevel === lvl.id
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200/60'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Durasi Pelatihan */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
          Durasi Pelatihan
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'Semua Durasi' },
            { id: 'short', label: '⏱ Singkat (&le; 15 JP)' },
            { id: 'medium', label: '⏱ Menengah (16 - 30 JP)' },
            { id: 'intensive', label: '⏱ Intensif (&gt; 30 JP / Bootcamp)' },
          ].map(dur => (
            <button
              key={dur.id}
              onClick={() => setSelectedDuration(dur.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedDuration === dur.id
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200/60'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {dur.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Tipe Kursus & Biaya */}
      <div className="space-y-2 pt-3 border-t border-slate-100">
        <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider block">
          Tipe & Biaya
        </label>
        <div className="space-y-1">
          {[
            { id: 'all', label: 'Semua Tipe' },
            { id: 'certified', label: '🏆 Bersertifikat Resmi' },
            { id: 'free', label: '🎁 Gratis / Beasiswa' },
            { id: 'promo', label: '🏷️ Harga Promo' },
          ].map(tp => (
            <button
              key={tp.id}
              onClick={() => setSelectedType(tp.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedType === tp.id
                  ? 'bg-blue-50 text-blue-600 font-bold border border-blue-200/60'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tp.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      className="space-y-8 py-4 sm:py-6"
    >
      {/* Header Banner */}
      <motion.div
        variants={fadeUpVariant}
        className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800"
      >
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Katalog Program Vokasi Terakreditasi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Jelajahi Semua Kursus Alpha Beta Learning Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Tingkatkan keahlian praktis berstandar SKKNI dengan materi komprehensif, simulator virtual, kuis evaluasi, dan sertifikat resmi.
          </p>
        </div>
      </motion.div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs sticky top-24">
          {renderFilterSidebar()}
        </aside>

        {/* Right Column: Courses Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* Top Bar: Search, Sort & Mobile Filter Toggle */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Cari judul kursus, materi, instruktur..."
                  className="w-full pl-10 pr-9 py-2.5 bg-slate-50 focus:bg-white text-slate-900 text-xs font-medium rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort & Mobile Filter Button */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Mobile Filter Drawer Button */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3.5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1.5"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filter</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  )}
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as any)}
                    aria-label="Urutkan daftar kursus"
                    className="px-3 py-2.5 bg-slate-50 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="popular">⭐ Terpopuler</option>
                    <option value="rating">✨ Rating Tertinggi</option>
                    <option value="price_low">💰 Harga Terendah</option>
                    <option value="price_high">💎 Harga Tertinggi</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Count & Active Filter Tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-500 font-medium">
                Menampilkan <b className="text-slate-900">{filteredAndSortedCourses.length}</b> dari {courses.length} kursus
              </span>

              {hasActiveFilters && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">Filter Aktif:</span>
                  <button
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-rose-600 hover:underline"
                  >
                    Hapus Semua
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <ErrorState
              title="Gagal Memuat Katalog"
              description="Terjadi kendala saat mengambil data kursus. Silakan coba lagi."
              onRetry={fetchData}
            />
          )}

          {/* Empty State */}
          {!loading && !error && filteredAndSortedCourses.length === 0 && (
            <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Tidak ada kursus yang cocok</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Coba ubah kata kunci pencarian atau sesuaikan kombinasi filter yang Anda pilih.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-all shadow-xs"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

          {/* Courses Grid */}
          {!loading && !error && paginatedCourses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedCourses.map(course => (
                <CourseCard
                  key={course.CourseID}
                  course={course}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {[...Array(totalPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer / Modal */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto z-10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                  <span className="font-bold text-sm text-slate-900">Filter Katalog</span>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {renderFilterSidebar()}
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs text-center shadow-md"
                >
                  Tampilkan ({filteredAndSortedCourses.length}) Kursus
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
