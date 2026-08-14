import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { BottomNav } from './components/BottomNav';
import { Toast, ToastType } from './components/Toast';
import { AITutorModal } from './components/AITutorModal';
import { LoginModal } from './components/auth/LoginModal';
import { AboutUsModal } from './components/AboutUsModal';
import { motion, AnimatePresence } from 'motion/react';

import { HomeView } from './views/HomeView';
import { CoursesView } from './views/CoursesView';
import { CourseDetailView } from './views/CourseDetailView';
import { StudentDashboardView } from './views/StudentDashboardView';
import { LearningView } from './views/LearningView';
import { ForumView } from './views/ForumView';
import { AlumniView } from './views/AlumniView';
import { CertificateVerification } from './components/certificate/CertificateVerification';
import { AdminDashboard } from './views/AdminDashboard';
import { InstructorDashboardView } from './views/InstructorDashboardView';
import { CoachDashboardView } from './views/CoachDashboardView';
import { ProfileView } from './views/ProfileView';
import { GasDeployView } from './views/GasDeployView';
import { RegistrationView } from './views/RegistrationView';
import { EnglishTrainingView } from './views/EnglishTrainingView';
import { PaudTrainingView } from './views/PaudTrainingView';
import { MateriView } from './views/MateriView';
import { GalleryView } from './views/GalleryView';
import { NewsView } from './views/NewsView';
import { ContactView } from './views/ContactView';

const MainAppContent: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Modals State
  const [isAITutorOpen, setIsAITutorOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const showToast = (message: string, type: ToastType = 'info') => {
    setToast({ message, type });
  };

  const handleNavigate = (view: string, param?: string) => {
    if (view === 'login') {
      setIsLoginModalOpen(true);
      return;
    }
    if (view === 'about') {
      setIsAboutModalOpen(true);
      return;
    }
    setCurrentView(view);
    setViewParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white pb-20 md:pb-0">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Navigation Header */}
      <Header
        activeTab={currentView}
        onNavigate={handleNavigate}
        onOpenAITutor={() => setIsAITutorOpen(true)}
        onOpenLogin={() => setIsLoginModalOpen(true)}
      />

      {/* Main Page Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (viewParam || '')}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {currentView === 'home' && (
              <HomeView onNavigate={handleNavigate} />
            )}

            {currentView === 'courses' && (
              <CoursesView
                initialCategory={viewParam}
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'course_detail' && viewParam && (
              <CourseDetailView
                courseId={viewParam}
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {currentView === 'student_dashboard' && (
              <StudentDashboardView onNavigate={handleNavigate} />
            )}

            {currentView === 'learning' && viewParam && (
              <LearningView
                courseId={viewParam}
                onNavigate={handleNavigate}
                onOpenAITutor={() => setIsAITutorOpen(true)}
                onShowToast={showToast}
              />
            )}

            {currentView === 'forum' && (
              <ForumView courseId={viewParam || 'CRS-TK01'} />
            )}

            {currentView === 'alumni' && (
              <AlumniView />
            )}

            {currentView === 'verify' && (
              <CertificateVerification initialCertNo={viewParam} />
            )}

            {currentView === 'admin' && (
              <AdminDashboard onShowToast={showToast} onNavigate={handleNavigate} />
            )}

            {currentView === 'instructor' && (
              <InstructorDashboardView onNavigate={handleNavigate} onShowToast={showToast} />
            )}

            {currentView === 'coach' && (
              <CoachDashboardView onNavigate={handleNavigate} onShowToast={showToast} />
            )}

            {currentView === 'profile' && (
              <ProfileView onShowToast={showToast} onNavigate={handleNavigate} />
            )}

            {currentView === 'gas_deploy' && (
              <GasDeployView />
            )}

            {currentView === 'register' && (
              <RegistrationView
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {currentView === 'english_training' && (
              <EnglishTrainingView
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {currentView === 'paud_training' && (
              <PaudTrainingView
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}

            {currentView === 'materi' && (
              <MateriView
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'gallery' && (
              <GalleryView
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'news' && (
              <NewsView
                onNavigate={handleNavigate}
              />
            )}

            {currentView === 'contact' && (
              <ContactView
                onNavigate={handleNavigate}
                onShowToast={showToast}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav activeTab={currentView} onNavigate={handleNavigate} />

      {/* AI Tutor Floating Modal */}
      <AITutorModal
        isOpen={isAITutorOpen}
        onClose={() => setIsAITutorOpen(false)}
        activeCourseTitle="Alpha Beta Learning Center LMS"
        activeTopic="Bantuan Tutor Cerdas"
      />

      {/* Quick Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setCurrentView('register');
        }}
        onShowToast={showToast}
      />

      {/* About Us & Director Profile Modal */}
      <AboutUsModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainAppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
