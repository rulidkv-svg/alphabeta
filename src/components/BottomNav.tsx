import React from 'react';
import { Home, BookOpen, GraduationCap, Award, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface BottomNavProps {
  activeTab?: string;
  currentView?: string;
  onNavigate: (view: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, currentView, onNavigate }) => {
  const { t } = useLanguage();
  const active = activeTab || currentView || 'home';

  const navItems = [
    { id: 'home', label: t.common.home, icon: Home },
    { id: 'courses', label: t.common.courses, icon: BookOpen },
    { id: 'student_dashboard', label: t.common.dashboard, icon: GraduationCap },
    { id: 'verify', label: t.courses.certificate, icon: Award },
    { id: 'profile', label: t.common.profile, icon: User }
  ];

  return (
    <nav
      id="bottom-navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-2 py-1 shadow-lg"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-blue-600 bg-blue-50 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5 tracking-tight font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};


