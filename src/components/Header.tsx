import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldAlert,
  Sparkles,
  Menu,
  X,
  Briefcase,
  Home,
  Users,
  Languages,
  Baby,
  FileText,
  Image as ImageIcon,
  Newspaper,
  PhoneCall,
  Building2,
  Globe,
  Search,
  Bell,
  CheckCircle2,
  Layers,
  Cpu,
  Palette,
  Bot,
  TrendingUp,
  BarChart3,
  Monitor
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Logo } from './Logo';
import { LanguageSelector } from './common/LanguageSelector';
import { COMPREHENSIVE_COURSES } from '../data/coursesData';

interface HeaderProps {
  activeTab?: string;
  currentView?: string;
  onNavigate: (view: string, param?: string) => void;
  onOpenAITutor: () => void;
  onOpenLogin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  currentView,
  onNavigate,
  onOpenAITutor,
  onOpenLogin
}) => {
  const { user, logout } = useAuth();
  const { t, isRTL } = useLanguage();

  // Dropdown states
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const activeView = activeTab || currentView || 'home';

  // Structured categories matching specification
  const headerCategories = [
    { id: 'CAT-001', name: 'Komputer & Teknologi', icon: Cpu, color: 'text-blue-600 bg-blue-50' },
    { id: 'CAT-002', name: 'Kreatif & Desain', icon: Palette, color: 'text-purple-600 bg-purple-50' },
    { id: 'CAT-004', name: 'Bahasa Internasional', icon: Globe, color: 'text-emerald-600 bg-emerald-50' },
    { id: 'CAT-003', name: 'Kewirausahaan & Digital', icon: Briefcase, color: 'text-amber-600 bg-amber-50' },
    { id: 'cat-ai', name: 'AI & Prompt Engineering', icon: Bot, color: 'text-indigo-600 bg-indigo-50', query: 'ai' },
    { id: 'cat-dm', name: 'Digital Marketing', icon: TrendingUp, color: 'text-rose-600 bg-rose-50', query: 'marketing' },
    { id: 'cat-da', name: 'Data Analytics', icon: BarChart3, color: 'text-cyan-600 bg-cyan-50', query: 'data' },
    { id: 'CAT-005', name: 'Pendidikan & Guru', icon: Baby, color: 'text-pink-600 bg-pink-50' },
    { id: 'cat-off', name: 'Office & Productivity', icon: Monitor, color: 'text-teal-600 bg-teal-50', query: 'office' },
  ];

  // Filtered courses for live search preview
  const liveSearchResults = searchQuery.trim().length > 0
    ? COMPREHENSIVE_COURSES.filter(c =>
        c.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.Description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.Subcategory && c.Subcategory.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.InstructorName && c.InstructorName.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(target)) {
        setCategoryDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotificationDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(target)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('courses', `search:${searchQuery.trim()}`);
      setSearchFocused(false);
      setMobileSearchOpen(false);
    } else {
      onNavigate('courses');
    }
  };

  const handleCategorySelect = (cat: typeof headerCategories[0]) => {
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
    if (cat.query) {
      onNavigate('courses', `search:${cat.query}`);
    } else {
      onNavigate('courses', cat.id);
    }
  };

  const handleLoginClick = () => {
    if (onOpenLogin) {
      onOpenLogin();
    } else {
      onNavigate('login');
    }
  };

  const handleProgramSayaClick = () => {
    if (!user) {
      handleLoginClick();
    } else {
      onNavigate('student_dashboard');
    }
  };

  const handleDashboardClick = () => {
    if (!user) {
      handleLoginClick();
      return;
    }
    if (user.Role === 'ADMIN') onNavigate('admin');
    else if (user.Role === 'INSTRUKTUR') onNavigate('instructor');
    else if (user.Role === 'PELATIH') onNavigate('coach');
    else onNavigate('student_dashboard');
  };

  const navLinks = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'courses', label: t.nav.courses, icon: BookOpen },
    { id: 'english_training', label: t.nav.english, icon: Languages },
    { id: 'paud_training', label: t.nav.paud, icon: Baby },
    { id: 'materi', label: t.nav.materials, icon: FileText },
    { id: 'about', label: t.nav.about, icon: Building2 },
    { id: 'gallery', label: t.nav.gallery, icon: ImageIcon },
    { id: 'news', label: t.nav.news, icon: Newspaper },
    { id: 'contact', label: t.nav.contact, icon: PhoneCall },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs transition-all duration-200">
      {/* Top Banner Bar for Official LMS Notice */}
      <div className="bg-slate-900 text-white text-[11px] font-medium py-1.5 px-4 text-center hidden md:flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1 text-amber-400 font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          ALPHA BETA LEARNING CENTER
        </span>
        <span className="text-slate-400">•</span>
        <span className="text-slate-200">
          Belajar • Berlatih • Bersertifikat • Siap Kerja | Akreditasi Resmi & Penyaluran Kerja
        </span>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Logo & Category Dropdown */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 active:scale-95 transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo */}
          <div
            onClick={() => onNavigate('home')}
            className="cursor-pointer group select-none transition-transform active:scale-98"
          >
            <Logo size="sm" showTagline={false} />
          </div>

          {/* Category Dropdown (Desktop) */}
          <div className="relative hidden lg:block" ref={categoryRef}>
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 border border-slate-200/80 transition-all active:scale-98"
            >
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Kategori</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Jelajahi Topik Kursus
                  </p>
                </div>
                <div className="space-y-0.5 max-h-[380px] overflow-y-auto">
                  {headerCategories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat)}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-blue-600 flex items-center gap-2.5 transition-colors group"
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cat.color} shrink-0`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="truncate">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setCategoryDropdownOpen(false);
                      onNavigate('courses');
                    }}
                    className="w-full text-center py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                  >
                    Lihat Semua Kursus →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center: Prominent Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Apa yang ingin Anda pelajari?"
              className="w-full pl-10 pr-10 py-2.5 bg-slate-100/90 focus:bg-white text-slate-800 text-xs sm:text-sm font-medium rounded-full border border-slate-200 focus:border-blue-500 focus:ring-3 focus:ring-blue-500/15 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Live Search Autocomplete Popover */}
          {searchFocused && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 flex items-center justify-between">
                <span>Hasil Pencarian Cepat</span>
                <span>{liveSearchResults.length} ditemukan</span>
              </div>
              {liveSearchResults.length > 0 ? (
                <div className="py-1 space-y-1">
                  {liveSearchResults.map(course => (
                    <button
                      key={course.CourseID}
                      onClick={() => {
                        setSearchFocused(false);
                        onNavigate('course_detail', course.CourseID);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded-xl flex items-center gap-3 transition-colors group"
                    >
                      <img
                        src={course.Thumbnail}
                        alt={course.Title}
                        className="w-10 h-8 rounded-lg object-cover shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-slate-800 group-hover:text-blue-600 truncate">
                          {course.Title}
                        </p>
                        <p className="text-[10px] text-slate-500 truncate">
                          {course.InstructorName} • {course.CategoryName}
                        </p>
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full text-center py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-colors border-t border-slate-100"
                  >
                    Lihat Semua Hasil untuk &quot;{searchQuery}&quot; →
                  </button>
                </div>
              ) : (
                <div className="p-4 text-center text-xs text-slate-500">
                  Tidak ada kursus yang cocok dengan kata kunci tersebut.
                  <button
                    onClick={handleSearchSubmit}
                    className="block mx-auto mt-2 font-bold text-blue-600 hover:underline"
                  >
                    Buka Katalog Kursus
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Actions, Program Saya, Dashboard, Notifications, AI Tutor & User Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95"
            aria-label="Cari kursus"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Program Saya Link (Desktop) */}
          <button
            onClick={handleProgramSayaClick}
            className="hidden xl:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <span>Program Saya</span>
          </button>

          {/* Dashboard Link (Desktop) */}
          <button
            onClick={handleDashboardClick}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
          >
            <GraduationCap className="w-4 h-4 text-slate-500" />
            <span>Dashboard</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotificationDropdownOpen(!notificationDropdownOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 active:scale-95 transition-all relative"
              title="Notifikasi"
            >
              <Bell className="w-4 h-4 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
            </button>

            {notificationDropdownOpen && (
              <div className={`absolute mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${isRTL ? 'left-0' : 'right-0'}`}>
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-900">Notifikasi</p>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                    3 Baru
                  </span>
                </div>
                <div className="py-1 max-h-72 overflow-y-auto divide-y divide-slate-50 text-xs">
                  <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                    <p className="font-bold text-slate-800">Modul Baru Telah Dibuka 🚀</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Modul AI & Prompt Engineering kini tersedia di katalog.</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Baru saja</span>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                    <p className="font-bold text-slate-800">Sertifikat Siap Diverifikasi 🏆</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Selesaikan kuis dengan nilai &ge;80 untuk klaim sertifikat otomatis.</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">2 jam lalu</span>
                  </div>
                  <div className="px-4 py-2.5 hover:bg-slate-50 cursor-pointer">
                    <p className="font-bold text-slate-800">Simulator Praktik PC & Lab 🧪</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Coba Virtual Lab Perakitan PC dan Topologi Jaringan gratis.</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">1 hari lalu</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI Tutor Button */}
          <button
            onClick={onOpenAITutor}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 shrink-0 group"
            title="AI Tutor Alpha Beta Learning Center"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">AI Tutor</span>
          </button>

          {/* Language Selector (Desktop) */}
          <div className="hidden sm:block">
            <LanguageSelector variant="dropdown" />
          </div>

          {/* User Profile / Auth Action */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-98"
              >
                <img
                  src={user.PhotoURL}
                  alt={user.Name}
                  className="w-7 h-7 rounded-lg object-cover ring-2 ring-blue-500/20"
                />
                <div className="text-left hidden md:block max-w-[120px]">
                  <p className="text-xs font-bold text-slate-800 truncate leading-tight">{user.Name}</p>
                  <p className="text-[10px] font-medium text-slate-500 capitalize leading-tight">
                    {user.Role.toLowerCase()}
                  </p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {profileDropdownOpen && (
                <div className={`absolute mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${isRTL ? 'left-0' : 'right-0'}`}>
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.Name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.Email}</p>
                    <div className="mt-2 flex items-center justify-between text-[11px] bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100">
                      <span className="font-semibold text-slate-600">Level {user.Level || 1}</span>
                      <span className="font-bold text-amber-600 flex items-center gap-1">⚡ {user.XP || 0} XP</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('profile');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      <span>{t.nav.myProfile}</span>
                    </button>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('student_dashboard');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                    >
                      <GraduationCap className="w-4 h-4 text-blue-500" />
                      <span>Kursus & Dashboard Saya</span>
                    </button>

                    {user.Role === 'INSTRUKTUR' && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('instructor');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <Users className="w-4 h-4 text-amber-500" />
                        <span>{t.nav.instructorDashboard}</span>
                      </button>
                    )}

                    {user.Role === 'PELATIH' && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('coach');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-indigo-500" />
                        <span>{t.nav.coachDashboard}</span>
                      </button>
                    )}

                    {user.Role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('admin');
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                      >
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        <span>{t.nav.adminDashboard}</span>
                      </button>
                    )}
                  </div>

                  <div className="border-t border-slate-100 pt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        onNavigate('login');
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{t.common.logout}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleLoginClick}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors"
              >
                {t.common.login}
              </button>
              <button
                onClick={() => onNavigate('register')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-xs hover:bg-blue-700 active:scale-95 transition-all"
              >
                {t.common.register}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Bar Popup (When toggled) */}
      {mobileSearchOpen && (
        <div className="md:hidden bg-slate-50 p-3 border-t border-slate-200 animate-in fade-in slide-in-from-top-1 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Apa yang ingin Anda pelajari?"
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 bg-white text-slate-800 text-xs font-medium rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      )}

      {/* Mobile Nav Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 text-sm font-medium shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
          {/* Mobile Language Selector */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{t.common.language}</span>
            </p>
            <LanguageSelector variant="pills" />
          </div>

          {/* Mobile Categories Accordion */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Kategori Kursus</p>
            <div className="grid grid-cols-2 gap-1.5">
              {headerCategories.slice(0, 8).map(cat => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat)}
                    className="text-left p-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 border border-slate-100 flex items-center gap-2 truncate"
                  >
                    <Icon className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="truncate">{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Navigation Links */}
          <div className="pt-2 border-t border-slate-100 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Navigasi Utama</p>
            <div className="grid grid-cols-2 gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = activeView === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onNavigate(link.id);
                    }}
                    className={`text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 font-bold border border-blue-100'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                    <span className="truncate">{link.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};


