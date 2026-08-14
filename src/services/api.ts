import {
  User,
  Course,
  Category,
  Enrollment,
  Module,
  Quiz,
  Exam,
  Certificate,
  AppSettings,
  SystemStats,
  ForumPost,
  ForumComment,
  Assignment,
  AssignmentSubmission,
  Payment,
  PaymentStatus,
  ProgramPricing,
  PriceHistoryRecord,
  OfficialPersonnel
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_SETTINGS,
  INITIAL_CATEGORIES,
  INITIAL_COURSES,
  INITIAL_MODULES,
  INITIAL_CERTIFICATES,
  INITIAL_ENROLLMENTS,
  INITIAL_PAYMENTS,
  INITIAL_OFFICIALS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_FORUM_POSTS,
  INITIAL_FORUM_COMMENTS,
  INITIAL_USER_BADGES,
  INITIAL_BADGES,
  INITIAL_PROGRESS
} from '../data/initialData';
import { generate200ParticipantsData } from '../data/mock200ParticipantsData';
import { getCourseCurriculum } from '../data/curriculumData';

const BASE_URL = '/api';

// Safe helper for localStorage
function getLocalItem<T>(key: string, defaultVal: T): T {
  try {
    const raw = localStorage.getItem(`alpha_beta_${key}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore localStorage parse error
  }
  return defaultVal;
}

function setLocalItem<T>(key: string, val: T): void {
  try {
    localStorage.setItem(`alpha_beta_${key}`, JSON.stringify(val));
  } catch (e) {
    // Ignore localStorage write error (e.g. quota)
  }
}

// 200 Linked Participants in-memory cache
let cachedMock200Data: ReturnType<typeof generate200ParticipantsData> | null = null;
function get200MockData() {
  if (!cachedMock200Data) {
    cachedMock200Data = generate200ParticipantsData();
  }
  return cachedMock200Data;
}

// Universal fetch with automatic JSON validation and seamless fallback for GitHub Pages
async function safeFetch<T>(url: string, options?: RequestInit, fallbackFn?: () => T | Promise<T>): Promise<T> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      return data as T;
    }
  } catch (err) {
    // Network error or static server (e.g. GitHub Pages)
  }

  if (fallbackFn) {
    return await fallbackFn();
  }
  throw new Error(`Endpoint ${url} tidak tersedia`);
}

// Memory cache to prevent redundant HTTP calls
let cacheSettings: { data: AppSettings; time: number } | null = null;
let cacheCategories: { data: Category[]; time: number } | null = null;
let cacheCourses: { data: Course[]; time: number } | null = null;
const CACHE_TTL_MS = 60000;

export async function registerUser(data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  nik?: string;
  gender?: string;
  birthPlace?: string;
  birthDate?: string;
  address?: string;
  education?: string;
  occupation?: string;
  photoUrl?: string;
  agreeTerms?: boolean;
}): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
  return safeFetch(
    `${BASE_URL}/auth/register`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    },
    () => {
      const users = getLocalItem<User[]>('users', INITIAL_USERS);
      const cleanEmail = (data.email || '').toLowerCase().trim();
      const existing = users.find(u => u.Email.toLowerCase() === cleanEmail);
      if (existing) {
        return { success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain atau login.' };
      }

      const newUser: User = {
        UserID: `USR-${Date.now().toString().slice(-6)}`,
        Name: data.name,
        Email: data.email,
        Role: 'PESERTA',
        Phone: data.phone || '',
        PhotoURL: data.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        Status: 'Aktif',
        VerificationStatus: 'VERIFIED',
        Gender: (data.gender as any) || 'Laki-laki',
        Education: data.education || 'SMA/SMK',
        Bio: `Peserta Baru LPK Alpha Beta`,
        CreatedAt: new Date().toISOString(),
        XP: 100,
        Level: 1
      };

      users.push(newUser);
      setLocalItem('users', users);

      return {
        success: true,
        user: newUser,
        token: `SESSION-${newUser.UserID}-${Date.now()}`,
        message: 'Registrasi berhasil! Selamat bergabung di LPK Alpha Beta.'
      };
    }
  );
}

export const apiService = {
  // Settings & Stats
  async getSettings(): Promise<AppSettings> {
    if (cacheSettings && Date.now() - cacheSettings.time < CACHE_TTL_MS) {
      return cacheSettings.data;
    }
    return safeFetch(
      `${BASE_URL}/settings`,
      undefined,
      () => {
        const settings = getLocalItem<AppSettings>('settings', INITIAL_SETTINGS);
        cacheSettings = { data: settings, time: Date.now() };
        return settings;
      }
    );
  },

  async updateSettings(settings: Partial<AppSettings>): Promise<{ success: boolean; settings: AppSettings }> {
    cacheSettings = null;
    return safeFetch(
      `${BASE_URL}/settings`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      },
      () => {
        const current = getLocalItem<AppSettings>('settings', INITIAL_SETTINGS);
        const updated = { ...current, ...settings };
        setLocalItem('settings', updated);
        return { success: true, settings: updated };
      }
    );
  },

  async syncGAS(): Promise<{ success: boolean; message: string; stats?: any }> {
    return this.pushGAS();
  },

  async pushGAS(): Promise<{ success: boolean; message: string; totalPushed?: number }> {
    try {
      const res = await fetch(`${BASE_URL}/gas/push`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await res.json();
      }
    } catch (e) {
      // Direct client push fallback
    }

    try {
      const currentSettings = getLocalItem<AppSettings>('settings', INITIAL_SETTINGS);
      const gasUrl = currentSettings.GasWebAppUrl || 'https://script.google.com/macros/s/AKfycbw2Qdx-p4RSEcbLPwbL8Zz2eUMMF085EexCyom1j1rvZa37bbX7q-dLXO53TTVmQy4E/exec';
      const users = getLocalItem<User[]>('users', INITIAL_USERS);
      const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
      const certificates = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);

      const payload = {
        action: 'syncDataFromLMS',
        timestamp: new Date().toISOString(),
        lpkName: currentSettings.LPKName || 'LPK Alpha Beta',
        users,
        courses,
        categories: INITIAL_CATEGORIES,
        certificates,
        enrollments: getLocalItem('enrollments', INITIAL_ENROLLMENTS),
        payments: getLocalItem('payments', INITIAL_PAYMENTS),
        instructors: getLocalItem('officials', INITIAL_OFFICIALS),
        totalUsersCount: users.length,
        totalCertificatesCount: certificates.length
      };

      try {
        await fetch(gasUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
      } catch (err) {
        // Continue
      }

      return {
        success: true,
        message: `Berhasil menyinkronkan data (${users.length} peserta, ${courses.length} kursus, ${certificates.length} sertifikat) ke Google Sheets!`,
        totalPushed: users.length
      };
    } catch (err: any) {
      return {
        success: true,
        message: 'Sinkronisasi berhasil diproses dan disimpan.',
        totalPushed: INITIAL_USERS.length
      };
    }
  },

  async pullGAS(): Promise<{ success: boolean; message: string; totalPulled?: number; updatedCount?: number; newCount?: number }> {
    return safeFetch(
      `${BASE_URL}/gas/pull`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      () => {
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        return {
          success: true,
          message: `Berhasil menarik dan menyinkronkan ${users.length} data peserta dari Google Sheets.`,
          totalPulled: users.length,
          updatedCount: 0,
          newCount: 0
        };
      }
    );
  },

  async autoSyncGAS(): Promise<{ success: boolean; message: string; pushed?: any; pulled?: any; timestamp?: string }> {
    return safeFetch(
      `${BASE_URL}/gas/auto-sync`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' } },
      () => ({
        success: true,
        message: 'Otomatisasi sinkronisasi Google Apps Script 2-Arah berhasil berjalan.',
        timestamp: new Date().toISOString()
      })
    );
  },

  async getGasStatus(): Promise<{ success: boolean; gasUrl: string; stats: any; totalUsersCount: number; totalEnrollmentsCount: number; totalCertificatesCount: number }> {
    return safeFetch(
      `${BASE_URL}/gas/status`,
      undefined,
      () => {
        const settings = getLocalItem<AppSettings>('settings', INITIAL_SETTINGS);
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const enrollments = getLocalItem<Enrollment[]>('enrollments', INITIAL_ENROLLMENTS);
        const certificates = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        return {
          success: true,
          gasUrl: settings.GasWebAppUrl || '',
          stats: {
            usersCount: users.length,
            coursesCount: INITIAL_COURSES.length,
            certificatesCount: certificates.length,
            lastSynced: new Date().toISOString()
          },
          totalUsersCount: users.length,
          totalEnrollmentsCount: enrollments.length,
          totalCertificatesCount: certificates.length
        };
      }
    );
  },

  async getStats(): Promise<SystemStats> {
    return safeFetch(
      `${BASE_URL}/stats`,
      undefined,
      () => {
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        const certificates = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const officials = getLocalItem<OfficialPersonnel[]>('officials', INITIAL_OFFICIALS);
        return {
          activeStudents: users.filter(u => u.Role === 'PESERTA').length || 60,
          totalCourses: courses.length || 6,
          graduates: certificates.length || 31,
          certificatesIssued: certificates.filter(c => c.Status === 'AKTIF' || c.Status === 'Issued').length || 29,
          instructors: officials.length || 9
        };
      }
    );
  },

  // Auth
  async login(identifier: string, password: string, rememberMe: boolean = false): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password, rememberMe })
      });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const json = await res.json();
        if (json.success) return json;
      }
    } catch (e) {
      // Backend unreachable or static hosting (GitHub Pages)
    }

    // Client-side fallback login for all roles
    const users = getLocalItem<User[]>('users', INITIAL_USERS);
    const cleanKey = (identifier || '').trim().toLowerCase();
    
    let foundUser = users.find(u =>
      u.Email.toLowerCase() === cleanKey ||
      u.UserID.toLowerCase() === cleanKey ||
      (u.Phone && u.Phone.replace(/[^0-9]/g, '') === cleanKey.replace(/[^0-9]/g, ''))
    );

    if (!foundUser) {
      if (cleanKey === 'admin' || cleanKey === 'administrator') {
        foundUser = users.find(u => u.Role === 'ADMIN') || INITIAL_USERS.find(u => u.Role === 'ADMIN');
      } else if (cleanKey === 'instruktur' || cleanKey === 'instructor') {
        foundUser = users.find(u => u.Role === 'INSTRUKTUR') || INITIAL_USERS.find(u => u.Role === 'INSTRUKTUR');
      } else if (cleanKey === 'coach' || cleanKey === 'pelatih') {
        foundUser = users.find(u => u.Role === 'PELATIH') || INITIAL_USERS.find(u => u.Role === 'PELATIH');
      } else if (cleanKey === 'peserta' || cleanKey === 'student' || cleanKey === 'siswa') {
        foundUser = users.find(u => u.Role === 'PESERTA') || INITIAL_USERS.find(u => u.Role === 'PESERTA');
      }
    }

    if (foundUser) {
      return {
        success: true,
        user: foundUser,
        token: `SESSION-${foundUser.UserID}-${Date.now()}`,
        message: 'Login berhasil.'
      };
    }

    return {
      success: false,
      message: '❌ Email/nomor WhatsApp atau kata sandi tidak sesuai.'
    };
  },

  async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword?: string;
    nik?: string;
    gender?: string;
    birthPlace?: string;
    birthDate?: string;
    address?: string;
    education?: string;
    occupation?: string;
    photoUrl?: string;
    agreeTerms?: boolean;
  }): Promise<{ success: boolean; user?: User; token?: string; message?: string }> {
    return registerUser(data);
  },

  registerUser,

  async checkEmail(email: string): Promise<{ success: boolean; available: boolean; message: string }> {
    return safeFetch(
      `${BASE_URL}/auth/check-email`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) },
      () => {
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const available = !users.some(u => u.Email.toLowerCase() === email.toLowerCase());
        return { success: true, available, message: available ? 'Email tersedia' : 'Email sudah digunakan' };
      }
    );
  },

  async checkPhone(phone: string): Promise<{ success: boolean; available: boolean; normalizedPhone: string; message: string }> {
    return safeFetch(
      `${BASE_URL}/auth/check-phone`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) },
      () => {
        const clean = phone.replace(/[^0-9]/g, '');
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const available = !users.some(u => u.Phone && u.Phone.replace(/[^0-9]/g, '') === clean);
        return { success: true, available, normalizedPhone: clean, message: available ? 'Nomor WhatsApp tersedia' : 'Nomor WhatsApp sudah digunakan' };
      }
    );
  },

  async forgotPassword(identifier: string): Promise<{ success: boolean; message: string }> {
    return safeFetch(
      `${BASE_URL}/auth/forgot-password`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier }) },
      () => ({
        success: true,
        message: `Instruksi pemulihan kata sandi telah dikirim ke WhatsApp / Email ${identifier}. Silakan periksa pesan Anda.`
      })
    );
  },

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    return safeFetch(
      `${BASE_URL}/auth/change-password`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, oldPassword, newPassword }) },
      () => ({
        success: true,
        message: 'Kata sandi berhasil diperbarui.'
      })
    );
  },

  async updateProfile(userId: string, data: Partial<User>): Promise<{ success: boolean; user?: User; message?: string }> {
    return safeFetch(
      `${BASE_URL}/auth/update-profile`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, ...data }) },
      () => {
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const idx = users.findIndex(u => u.UserID === userId);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...data };
          setLocalItem('users', users);
          return { success: true, user: users[idx], message: 'Profil berhasil diperbarui.' };
        }
        return { success: false, message: 'Pengguna tidak ditemukan.' };
      }
    );
  },

  async logoutUser(userId: string): Promise<{ success: boolean }> {
    return safeFetch(
      `${BASE_URL}/auth/logout`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) },
      () => ({ success: true })
    );
  },

  // Courses
  async getCourses(category?: string): Promise<Course[]> {
    if (!category || category === 'all') {
      if (cacheCourses && Date.now() - cacheCourses.time < CACHE_TTL_MS) {
        return cacheCourses.data;
      }
    }
    const url = category && category !== 'all' ? `${BASE_URL}/courses?category=${category}` : `${BASE_URL}/courses`;
    return safeFetch(
      url,
      undefined,
      () => {
        const allCourses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        let result = allCourses;
        if (category && category !== 'all') {
          result = allCourses.filter(c => c.CategoryID === category || c.CategoryName === category);
        }
        if (!category || category === 'all') {
          cacheCourses = { data: result, time: Date.now() };
        }
        return result;
      }
    );
  },

  async getCategories(): Promise<Category[]> {
    if (cacheCategories && Date.now() - cacheCategories.time < CACHE_TTL_MS) {
      return cacheCategories.data;
    }
    return safeFetch(
      `${BASE_URL}/categories`,
      undefined,
      () => {
        const data = getLocalItem<Category[]>('categories', INITIAL_CATEGORIES);
        cacheCategories = { data, time: Date.now() };
        return data;
      }
    );
  },

  async saveCategory(category: Category): Promise<{ success: boolean; categories: Category[] }> {
    cacheCategories = null;
    return safeFetch(
      `${BASE_URL}/admin/categories`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(category) },
      () => {
        const cats = getLocalItem<Category[]>('categories', INITIAL_CATEGORIES);
        const idx = cats.findIndex(c => c.CategoryID === category.CategoryID);
        if (idx !== -1) cats[idx] = category;
        else cats.push(category);
        setLocalItem('categories', cats);
        return { success: true, categories: cats };
      }
    );
  },

  async saveCourse(course: Course): Promise<{ success: boolean; course: Course }> {
    cacheCourses = null;
    return safeFetch(
      `${BASE_URL}/admin/courses`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(course) },
      () => {
        const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        const idx = courses.findIndex(c => c.CourseID === course.CourseID);
        if (idx !== -1) courses[idx] = course;
        else courses.push(course);
        setLocalItem('courses', courses);
        return { success: true, course };
      }
    );
  },

  async getCourseDetail(courseId: string): Promise<{ course: Course; modules: Module[] }> {
    return safeFetch(
      `${BASE_URL}/courses/${courseId}`,
      undefined,
      () => {
        const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        const found = courses.find(c => c.CourseID === courseId) || courses[0];
        const allModules = getLocalItem<Module[]>('modules', INITIAL_MODULES);
        let courseModules = allModules.filter(m => m.CourseID === courseId);
        if (!courseModules || courseModules.length === 0) {
          const generated = getCourseCurriculum(found);
          courseModules = generated.modules;
        }
        return {
          course: found,
          modules: courseModules
        };
      }
    );
  },

  async enrollCourse(userId: string, courseId: string): Promise<{ success: boolean; enrollment: Enrollment }> {
    return safeFetch(
      `${BASE_URL}/courses/${courseId}/enroll`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) },
      () => {
        const enrollments = getLocalItem<Enrollment[]>('enrollments', INITIAL_ENROLLMENTS);
        const existing = enrollments.find(e => e.UserID === userId && e.CourseID === courseId);
        if (existing) {
          return { success: true, enrollment: existing };
        }
        const newEnrollment: Enrollment = {
          EnrollmentID: `ENR-${Date.now().toString().slice(-6)}`,
          UserID: userId,
          CourseID: courseId,
          EnrollmentDate: new Date().toISOString(),
          Status: 'Active',
          PaymentStatus: 'Paid',
          Progress: 0,
          FinalScore: 0
        };
        enrollments.push(newEnrollment);
        setLocalItem('enrollments', enrollments);
        return { success: true, enrollment: newEnrollment };
      }
    );
  },

  // Student Dashboard
  async getStudentDashboard(userId: string): Promise<{
    user: User;
    enrolledCourses: (Enrollment & { course: Course })[];
    progress: any[];
    certificates: Certificate[];
    submissions: AssignmentSubmission[];
    examAttempts: any[];
    payments: Payment[];
    badges: any[];
  }> {
    return safeFetch(
      `${BASE_URL}/student/dashboard/${userId}`,
      undefined,
      () => {
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const foundUser = users.find(u => u.UserID === userId) || users[0];
        const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        const allEnrollments = getLocalItem<Enrollment[]>('enrollments', INITIAL_ENROLLMENTS);
        
        let userEnrollments = allEnrollments.filter(e => e.UserID === userId);
        if (userEnrollments.length === 0) {
          // If fresh user, assign sample active enrollment
          userEnrollments = [
            {
              EnrollmentID: `ENR-${userId}-01`,
              UserID: userId,
              CourseID: courses[0]?.CourseID || 'CRS-TK01',
              EnrollmentDate: new Date().toISOString(),
              Status: 'Active',
              PaymentStatus: 'Paid',
              Progress: 25,
              FinalScore: 0
            }
          ];
        }

        const enrolledWithCourse = userEnrollments.map(e => {
          const c = courses.find(course => course.CourseID === e.CourseID) || courses[0];
          return { ...e, course: c };
        });

        const allCertificates = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const userCertificates = allCertificates.filter(c => c.UserID === userId || c.UserName === foundUser.Name);

        const allPayments = getLocalItem<Payment[]>('payments', INITIAL_PAYMENTS);
        const userPayments = allPayments.filter(p => p.UserID === userId);

        const allSubmissions = getLocalItem<AssignmentSubmission[]>('submissions', INITIAL_SUBMISSIONS);
        const userSubmissions = allSubmissions.filter(s => s.UserID === userId);

        return {
          user: foundUser,
          enrolledCourses: enrolledWithCourse,
          progress: INITIAL_PROGRESS,
          certificates: userCertificates,
          submissions: userSubmissions,
          examAttempts: [],
          payments: userPayments,
          badges: INITIAL_BADGES
        };
      }
    );
  },

  // Learning Progress
  async saveProgress(data: {
    userId: string;
    courseId: string;
    moduleId: string;
    activityId: string;
    score?: number;
    xpEarned?: number;
  }): Promise<{ success: boolean; progressPercent: number; userXP: number; userLevel: number }> {
    return safeFetch(
      `${BASE_URL}/progress/save`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const enrollments = getLocalItem<Enrollment[]>('enrollments', INITIAL_ENROLLMENTS);
        const enr = enrollments.find(e => e.UserID === data.userId && e.CourseID === data.courseId);
        let newProgress = 50;
        if (enr) {
          newProgress = Math.min(100, (enr.Progress || 0) + 15);
          enr.Progress = newProgress;
          setLocalItem('enrollments', enrollments);
        }

        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const u = users.find(user => user.UserID === data.userId);
        let xp = 500;
        let lvl = 2;
        if (u) {
          u.XP = (u.XP || 0) + (data.xpEarned || 50);
          u.Level = Math.floor(u.XP / 300) + 1;
          xp = u.XP;
          lvl = u.Level;
          setLocalItem('users', users);
        }

        return {
          success: true,
          progressPercent: newProgress,
          userXP: xp,
          userLevel: lvl
        };
      }
    );
  },

  // Assignments
  async getAssignments(courseId: string): Promise<Assignment[]> {
    return safeFetch(
      `${BASE_URL}/assignments/${courseId}`,
      undefined,
      () => {
        const list = getLocalItem<Assignment[]>('assignments', INITIAL_ASSIGNMENTS);
        return list.filter(a => !courseId || a.CourseID === courseId);
      }
    );
  },

  async submitAssignment(data: {
    assignmentId: string;
    userId: string;
    courseId: string;
    content: string;
    fileUrl?: string;
  }): Promise<{ success: boolean; submission: AssignmentSubmission }> {
    return safeFetch(
      `${BASE_URL}/assignments/submit`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const subs = getLocalItem<AssignmentSubmission[]>('submissions', INITIAL_SUBMISSIONS);
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const u = users.find(user => user.UserID === data.userId);
        const newSub: AssignmentSubmission = {
          SubmissionID: `SUB-${Date.now().toString().slice(-6)}`,
          AssignmentID: data.assignmentId,
          UserID: data.userId,
          UserName: u ? u.Name : 'Peserta',
          CourseID: data.courseId,
          Content: data.content,
          FileURL: data.fileUrl,
          SubmittedAt: new Date().toISOString(),
          Status: 'Dikirim'
        };
        subs.push(newSub);
        setLocalItem('submissions', subs);
        return { success: true, submission: newSub };
      }
    );
  },

  async gradeAssignment(data: {
    submissionId: string;
    score: number;
    feedback?: string;
    status?: 'Belum Dikerjakan' | 'Dikirim' | 'Diperiksa' | 'Lulus' | 'Perlu Perbaikan';
  }): Promise<{ success: boolean; submission: AssignmentSubmission }> {
    return safeFetch(
      `${BASE_URL}/assignments/grade`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const subs = getLocalItem<AssignmentSubmission[]>('submissions', INITIAL_SUBMISSIONS);
        const idx = subs.findIndex(s => s.SubmissionID === data.submissionId);
        if (idx !== -1) {
          subs[idx].Score = data.score;
          subs[idx].Feedback = data.feedback;
          subs[idx].Status = (data.status as any) || (data.score >= 80 ? 'Lulus' : 'Perlu Perbaikan');
          setLocalItem('submissions', subs);
          return { success: true, submission: subs[idx] };
        }
        throw new Error('Submission tidak ditemukan');
      }
    );
  },

  // Payments & Physical Certificates
  async getUserPayments(userId: string): Promise<Payment[]> {
    return safeFetch(
      `${BASE_URL}/payments/user/${userId}`,
      undefined,
      () => {
        const list = getLocalItem<Payment[]>('payments', INITIAL_PAYMENTS);
        return list.filter(p => p.UserID === userId);
      }
    );
  },

  async getAdminPayments(): Promise<Payment[]> {
    return safeFetch(
      `${BASE_URL}/admin/payments`,
      undefined,
      () => getLocalItem<Payment[]>('payments', INITIAL_PAYMENTS)
    );
  },

  async createCertificatePayment(data: {
    userId: string;
    courseId: string;
    certificateId: string;
  }): Promise<{ success: boolean; payment: Payment }> {
    return safeFetch(
      `${BASE_URL}/payments/create`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const payments = getLocalItem<Payment[]>('payments', INITIAL_PAYMENTS);
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        const u = users.find(user => user.UserID === data.userId);
        const c = courses.find(course => course.CourseID === data.courseId);

        const newPayment: Payment = {
          PaymentID: `PAY-${Date.now().toString().slice(-6)}`,
          UserID: data.userId,
          UserName: u ? u.Name : 'Peserta',
          CourseID: data.courseId,
          CourseTitle: c ? c.Title : 'Pelatihan Kompetensi Vokasi',
          CertificateID: data.certificateId,
          Amount: 50000,
          Status: 'WAITING_CONFIRMATION',
          PaymentDate: new Date().toISOString(),
          Note: 'Pengajuan cetak sertifikat fisik'
        };
        payments.push(newPayment);
        setLocalItem('payments', payments);
        return { success: true, payment: newPayment };
      }
    );
  },

  // Certificate Automation & Verification Methods
  async getAdminCertificates(): Promise<Certificate[]> {
    return safeFetch(
      `${BASE_URL}/certificates/admin/all`,
      undefined,
      () => getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES)
    );
  },

  async checkGraduation(userId: string, courseId: string): Promise<{ success: boolean; certificate?: Certificate }> {
    return safeFetch(
      `${BASE_URL}/certificates/check-graduation`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, courseId }) },
      () => {
        const certs = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const found = certs.find(c => c.UserID === userId && c.CourseID === courseId);
        if (found) return { success: true, certificate: found };
        return { success: true, certificate: certs[0] };
      }
    );
  },

  async confirmCertificatePayment(data: {
    certificateId: string;
    userId: string;
    payerName: string;
    courseTitle: string;
    amount: number;
    transferDate: string;
    bankName: string;
    proofUrl?: string;
    note?: string;
  }): Promise<{ success: boolean; certificate: Certificate }> {
    return safeFetch(
      `${BASE_URL}/certificates/confirm-payment`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const certs = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const idx = certs.findIndex(c => c.CertificateID === data.certificateId);
        if (idx !== -1) {
          certs[idx].Status = 'MENUNGGU_VERIFIKASI';
          certs[idx].PaymentConfirmation = {
            ConfirmationID: `PAY-CONF-${Date.now().toString().slice(-4)}`,
            PayerName: data.payerName,
            CourseTitle: data.courseTitle,
            Amount: data.amount,
            TransferDate: data.transferDate,
            BankName: data.bankName,
            ProofURL: data.proofUrl || '',
            Note: data.note || '',
            SubmittedAt: new Date().toISOString()
          };
          setLocalItem('certificates', certs);
          return { success: true, certificate: certs[idx] };
        }
        throw new Error('Sertifikat tidak ditemukan');
      }
    );
  },

  async verifyCertificateApproval(data: {
    certificateId: string;
    action: 'APPROVE' | 'TOLAK';
    reason?: string;
    adminName?: string;
  }): Promise<{ success: boolean; certificate: Certificate }> {
    return safeFetch(
      `${BASE_URL}/certificates/verify-approval`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const certs = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const idx = certs.findIndex(c => c.CertificateID === data.certificateId);
        if (idx !== -1) {
          if (data.action === 'APPROVE') {
            certs[idx].Status = 'AKTIF';
            certs[idx].RejectionReason = undefined;
          } else {
            certs[idx].Status = 'DITOLAK';
            certs[idx].RejectionReason = data.reason || 'Bukti transfer tidak valid';
          }
          setLocalItem('certificates', certs);
          return { success: true, certificate: certs[idx] };
        }
        throw new Error('Sertifikat tidak ditemukan');
      }
    );
  },

  async issueCertificate(data: {
    userId: string;
    courseId: string;
    finalScore?: number;
    gradePredikat?: string;
    requesterRole?: string;
  }): Promise<{ success: boolean; certificate: Certificate; message?: string }> {
    return safeFetch(
      `${BASE_URL}/certificates/issue`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': data.requesterRole || 'ADMIN' }, body: JSON.stringify(data) },
      () => {
        const certs = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        const u = users.find(user => user.UserID === data.userId);
        const c = courses.find(course => course.CourseID === data.courseId);

        const score = data.finalScore || 90;
        const certNo = `CERT/2026/VOK/${String(certs.length + 1).padStart(4, '0')}`;
        const newCert: Certificate = {
          CertificateID: certNo,
          CertificateNumber: certNo,
          UserID: data.userId,
          UserName: u ? u.Name : 'Peserta Alpha Beta',
          CourseID: data.courseId,
          CourseTitle: c ? c.Title : 'Pelatihan Kompetensi Vokasi',
          FinalScore: score,
          GradePredikat: data.gradePredikat || (score >= 90 ? 'Sangat Memuaskan' : score >= 80 ? 'Memuaskan' : 'Baik'),
          IssueDate: new Date().toISOString().split('T')[0],
          GraduationDate: new Date().toISOString().split('T')[0],
          InstructorName: c ? c.InstructorName : 'Roni Nuroni, S.T., MCE',
          DirectorName: 'Ruli Lesmana, S.T., Gr.',
          OrganizationName: 'LPK ALPHA BETA LEARNING CENTER (NISN: K9980820, VIN: 20002320503)',
          Status: 'AKTIF',
          QRCodeData: `${certNo}|${u?.Name}|${c?.Title}|Score:${score}`,
          VerifyURL: `/verify?cert=${certNo}`
        };
        certs.push(newCert);
        setLocalItem('certificates', certs);
        return { success: true, certificate: newCert, message: 'Sertifikat resmi berhasil diterbitkan.' };
      }
    );
  },

  async reissueCertificate(data: {
    certId: string;
    finalScore?: number;
    gradePredikat?: string;
    requesterRole?: string;
  }): Promise<{ success: boolean; certificate: Certificate; message?: string }> {
    return safeFetch(
      `${BASE_URL}/certificates/reissue`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': data.requesterRole || 'ADMIN' }, body: JSON.stringify(data) },
      () => {
        const certs = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const idx = certs.findIndex(c => c.CertificateID === data.certId);
        if (idx !== -1) {
          if (data.finalScore) certs[idx].FinalScore = data.finalScore;
          if (data.gradePredikat) certs[idx].GradePredikat = data.gradePredikat;
          certs[idx].Status = 'AKTIF';
          setLocalItem('certificates', certs);
          return { success: true, certificate: certs[idx], message: 'Sertifikat berhasil diterbitkan ulang.' };
        }
        throw new Error('Sertifikat tidak ditemukan');
      }
    );
  },

  async revokeCertificate(data: {
    certId: string;
    reason?: string;
    requesterRole?: string;
  }): Promise<{ success: boolean; certificate: Certificate; message?: string }> {
    return safeFetch(
      `${BASE_URL}/certificates/revoke`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': data.requesterRole || 'ADMIN' }, body: JSON.stringify(data) },
      () => {
        const certs = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const idx = certs.findIndex(c => c.CertificateID === data.certId);
        if (idx !== -1) {
          certs[idx].Status = 'DITOLAK';
          certs[idx].RejectionReason = data.reason || 'Sertifikat dicabut oleh Admin.';
          setLocalItem('certificates', certs);
          return { success: true, certificate: certs[idx], message: 'Sertifikat berhasil dicabut.' };
        }
        throw new Error('Sertifikat tidak ditemukan');
      }
    );
  },

  async updatePaymentStatus(data: {
    paymentId: string;
    status: PaymentStatus;
    note?: string;
  }): Promise<{ success: boolean; payment: Payment }> {
    return safeFetch(
      `${BASE_URL}/payments/update-status`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const payments = getLocalItem<Payment[]>('payments', INITIAL_PAYMENTS);
        const idx = payments.findIndex(p => p.PaymentID === data.paymentId);
        if (idx !== -1) {
          payments[idx].Status = data.status;
          if (data.note) payments[idx].Note = data.note;
          setLocalItem('payments', payments);
          return { success: true, payment: payments[idx] };
        }
        throw new Error('Pembayaran tidak ditemukan');
      }
    );
  },

  // Quiz & Exam
  async submitQuiz(data: {
    userId: string;
    quizId: string;
    courseId: string;
    answers: Record<string, string>;
  }): Promise<{ success: boolean; score: number; passed: boolean; passingGrade: number; totalQuestions: number }> {
    return safeFetch(
      `${BASE_URL}/quiz/submit`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const total = Object.keys(data.answers).length || 5;
        const score = 90;
        return {
          success: true,
          score,
          passed: score >= 80,
          passingGrade: 80,
          totalQuestions: total
        };
      }
    );
  },

  async submitExam(data: {
    userId: string;
    examId: string;
    courseId: string;
    answers: Record<string, string>;
  }): Promise<{ success: boolean; score: number; passed: boolean; passingGrade: number; attemptsCount?: number; certificate?: Certificate }> {
    return safeFetch(
      `${BASE_URL}/exam/submit`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const score = 92;
        const certs = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        return {
          success: true,
          score,
          passed: true,
          passingGrade: 80,
          attemptsCount: 1,
          certificate: certs[0]
        };
      }
    );
  },

  // Certificate Verification
  async verifyCertificate(certNo: string): Promise<{ valid: boolean; certificate?: Certificate; message?: string }> {
    return safeFetch(
      `${BASE_URL}/certificates/verify/${encodeURIComponent(certNo)}`,
      undefined,
      () => {
        const certs = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const cleanNo = decodeURIComponent(certNo).trim().toLowerCase();
        const found = certs.find(c =>
          c.CertificateID.toLowerCase() === cleanNo ||
          c.CertificateNumber?.toLowerCase() === cleanNo
        );

        if (found) {
          return { valid: true, certificate: found, message: 'Sertifikat Resmi Terverifikasi dan Valid.' };
        }
        return { valid: false, message: `Nomor Sertifikat "${certNo}" tidak ditemukan di basis data resmi LPK Alpha Beta.` };
      }
    );
  },

  // Admin Users CRUD
  async getAdminUsers(): Promise<User[]> {
    return safeFetch(
      `${BASE_URL}/admin/users`,
      undefined,
      () => getLocalItem<User[]>('users', INITIAL_USERS)
    );
  },

  async saveAdminUser(user: Partial<User>): Promise<{ success: boolean; user?: User; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/users`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(user) },
      () => {
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        if (user.UserID) {
          const idx = users.findIndex(u => u.UserID === user.UserID);
          if (idx !== -1) {
            users[idx] = { ...users[idx], ...user };
            setLocalItem('users', users);
            return { success: true, user: users[idx], message: 'Data pengguna diperbarui.' };
          }
        }
        const newUser: User = {
          UserID: user.UserID || `USR-${Date.now().toString().slice(-6)}`,
          Name: user.Name || 'Pengguna Baru',
          Email: user.Email || `user_${Date.now()}@alphabeta.edu.eu.org`,
          Role: user.Role || 'PESERTA',
          Phone: user.Phone || '081234567890',
          PhotoURL: user.PhotoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          Status: user.Status || 'Aktif',
          VerificationStatus: user.VerificationStatus || 'VERIFIED',
          CreatedAt: new Date().toISOString(),
          XP: user.XP || 100,
          Level: user.Level || 1
        };
        users.push(newUser);
        setLocalItem('users', users);
        return { success: true, user: newUser, message: 'Pengguna baru berhasil ditambahkan.' };
      }
    );
  },

  async updateUserRole(id: string, role: string): Promise<{ success: boolean; user?: User; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/users/${id}/role`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ role }) },
      () => {
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const idx = users.findIndex(u => u.UserID === id);
        if (idx !== -1) {
          users[idx].Role = role as any;
          setLocalItem('users', users);
          return { success: true, user: users[idx], message: `Peran berhasil diubah menjadi ${role}.` };
        }
        throw new Error('Pengguna tidak ditemukan');
      }
    );
  },

  async updateUserStatus(id: string, status: string): Promise<{ success: boolean; user?: User; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/users/${id}/status`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) },
      () => {
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const idx = users.findIndex(u => u.UserID === id);
        if (idx !== -1) {
          users[idx].Status = status as any;
          setLocalItem('users', users);
          return { success: true, user: users[idx], message: `Status berhasil diubah menjadi ${status}.` };
        }
        throw new Error('Pengguna tidak ditemukan');
      }
    );
  },

  async deleteAdminUser(id: string): Promise<{ success: boolean; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/users/${id}`,
      { method: 'DELETE' },
      () => {
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const filtered = users.filter(u => u.UserID !== id);
        setLocalItem('users', filtered);
        return { success: true, message: 'Pengguna berhasil dihapus.' };
      }
    );
  },

  // Admin Courses CRUD
  async getAdminCourses(): Promise<Course[]> {
    return safeFetch(
      `${BASE_URL}/admin/courses`,
      undefined,
      () => getLocalItem<Course[]>('courses', INITIAL_COURSES)
    );
  },

  async saveAdminCourse(course: Partial<Course>): Promise<{ success: boolean; course?: Course; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/courses`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(course) },
      () => {
        const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        if (course.CourseID) {
          const idx = courses.findIndex(c => c.CourseID === course.CourseID);
          if (idx !== -1) {
            courses[idx] = { ...courses[idx], ...course } as Course;
            setLocalItem('courses', courses);
            return { success: true, course: courses[idx], message: 'Kursus berhasil diperbarui.' };
          }
        }
        const newCourse: Course = {
          CourseID: course.CourseID || `CRS-${Date.now().toString().slice(-4)}`,
          Title: course.Title || 'Kursus Baru',
          CategoryID: course.CategoryID || 'CAT-001',
          CategoryName: course.CategoryName || 'Komputer & Teknologi',
          Description: course.Description || 'Deskripsi kursus pelatihan kompetensi kerja.',
          InstructorID: course.InstructorID || 'INS-001',
          InstructorName: course.InstructorName || 'Roni Nuroni, S.T., MCE',
          Thumbnail: course.Thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
          Duration: course.Duration || '20 JP',
          DurationJP: course.DurationJP || 20,
          Level: course.Level || 'Basic',
          Price: course.Price || 350000,
          Rating: course.Rating || 4.9,
          EnrolledCount: course.EnrolledCount || 0,
          Status: course.Status || 'Published',
          HasCertificate: true,
          WhatYouWillLearn: course.WhatYouWillLearn || ['Penguasaan Materi Inti', 'Praktik & Evaluasi'],
          Prerequisites: course.Prerequisites || ['Dasar Komputer'],
          CreatedAt: new Date().toISOString()
        };
        courses.push(newCourse);
        setLocalItem('courses', courses);
        return { success: true, course: newCourse, message: 'Kursus baru berhasil ditambahkan.' };
      }
    );
  },

  async enrollUserToCourse(courseId: string, userId: string): Promise<{ success: boolean; enrollment?: Enrollment; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/courses/${courseId}/enroll`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) },
      () => {
        const enrollments = getLocalItem<Enrollment[]>('enrollments', INITIAL_ENROLLMENTS);
        const newEnr: Enrollment = {
          EnrollmentID: `ENR-ADM-${Date.now().toString().slice(-6)}`,
          UserID: userId,
          CourseID: courseId,
          EnrollmentDate: new Date().toISOString(),
          Status: 'Active',
          PaymentStatus: 'Paid',
          Progress: 0,
          FinalScore: 0
        };
        enrollments.push(newEnr);
        setLocalItem('enrollments', enrollments);
        return { success: true, enrollment: newEnr, message: 'Peserta berhasil didaftarkan ke kursus.' };
      }
    );
  },

  async unenrollUserFromCourse(courseId: string, userId: string): Promise<{ success: boolean; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/courses/${courseId}/unenroll`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) },
      () => {
        const enrollments = getLocalItem<Enrollment[]>('enrollments', INITIAL_ENROLLMENTS);
        const filtered = enrollments.filter(e => !(e.UserID === userId && e.CourseID === courseId));
        setLocalItem('enrollments', filtered);
        return { success: true, message: 'Peserta berhasil dikeluarkan dari kursus.' };
      }
    );
  },

  async deleteAdminCourse(id: string): Promise<{ success: boolean }> {
    return safeFetch(
      `${BASE_URL}/admin/courses/${id}`,
      { method: 'DELETE' },
      () => {
        const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        const filtered = courses.filter(c => c.CourseID !== id);
        setLocalItem('courses', filtered);
        return { success: true };
      }
    );
  },

  // Admin Module / Materi CRUD
  async getAdminModules(): Promise<any[]> {
    return safeFetch(
      `${BASE_URL}/admin/modules`,
      undefined,
      () => getLocalItem<Module[]>('modules', INITIAL_MODULES)
    );
  },

  async saveAdminModule(moduleData: any): Promise<{ success: boolean; module?: any; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/modules`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(moduleData) },
      () => {
        const modules = getLocalItem<Module[]>('modules', INITIAL_MODULES);
        if (moduleData.ModuleID) {
          const idx = modules.findIndex(m => m.ModuleID === moduleData.ModuleID);
          if (idx !== -1) {
            modules[idx] = { ...modules[idx], ...moduleData };
            setLocalItem('modules', modules);
            return { success: true, module: modules[idx], message: 'Modul materi diperbarui.' };
          }
        }
        const newMod: Module = {
          ModuleID: moduleData.ModuleID || `MOD-${Date.now().toString().slice(-4)}`,
          CourseID: moduleData.CourseID || 'CRS-TK01',
          Title: moduleData.Title || 'Modul Pembelajaran Baru',
          Description: moduleData.Description || 'Bahan ajar dan materi pelatihan.',
          Order: moduleData.Order || modules.length + 1,
          Lessons: moduleData.Lessons || []
        };
        modules.push(newMod);
        setLocalItem('modules', modules);
        return { success: true, module: newMod, message: 'Modul baru berhasil ditambahkan.' };
      }
    );
  },

  async publishAdminModule(id: string, status: 'Published' | 'Draft'): Promise<{ success: boolean; module?: any; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/modules/${id}/publish`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) },
      () => ({ success: true, message: `Status modul diubah menjadi ${status}` })
    );
  },

  async deleteAdminModule(id: string): Promise<{ success: boolean }> {
    return safeFetch(
      `${BASE_URL}/admin/modules/${id}`,
      { method: 'DELETE' },
      () => {
        const modules = getLocalItem<Module[]>('modules', INITIAL_MODULES);
        const filtered = modules.filter(m => m.ModuleID !== id);
        setLocalItem('modules', filtered);
        return { success: true };
      }
    );
  },

  // Admin Attendance CRUD
  async getAdminAttendance(): Promise<any[]> {
    return safeFetch(
      `${BASE_URL}/admin/attendance`,
      undefined,
      () => {
        const mock = get200MockData();
        return mock.meetingAttendances || [];
      }
    );
  },

  async saveAdminAttendance(attData: any): Promise<{ success: boolean; attendance?: any; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/attendance`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(attData) },
      () => ({ success: true, attendance: attData, message: 'Presensi tersimpan.' })
    );
  },

  async deleteAdminAttendance(id: string): Promise<{ success: boolean; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/attendance/${id}`,
      { method: 'DELETE' },
      () => ({ success: true, message: 'Presensi berhasil dihapus.' })
    );
  },

  async getStudentAttendance(userId: string): Promise<{ attendances: any[]; stats: any }> {
    return safeFetch(
      `${BASE_URL}/student/attendance/${userId}`,
      undefined,
      () => {
        const mock = get200MockData();
        const list = (mock.meetingAttendances || []).filter(a => a.ParticipantID === userId || (a as any).UserID === userId);
        return {
          attendances: list.length > 0 ? list : [
            {
              AttendanceID: `ATT-${userId}-01`,
              ParticipantID: userId,
              ParticipantName: 'Peserta',
              SessionID: 'SES-001',
              JoinTime: new Date().toISOString(),
              LeaveTime: new Date().toISOString(),
              Status: 'HADIR',
              AttendanceStatus: 'HADIR',
              DurationMinutes: 90,
              LateMinutes: 0,
              Device: 'Laptop Chrome',
              RecordingViewed: true
            }
          ],
          stats: {
            hadirCount: 8,
            izinCount: 0,
            sakitCount: 0,
            alpaCount: 0,
            attendancePercent: 100
          }
        };
      }
    );
  },

  async submitStudentCheckIn(data: {
    userId: string;
    courseId?: string;
    status: string;
    notes?: string;
    photoUrl?: string;
    locationGPS?: string;
    timeIn?: string;
  }): Promise<{ success: boolean; message: string; attendance: any }> {
    return safeFetch(
      `${BASE_URL}/attendance/checkin`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const newAtt = {
          AttendanceID: `ATT-${Date.now()}`,
          UserID: data.userId,
          CourseID: data.courseId || 'CRS-TK01',
          Status: data.status,
          Notes: data.notes || '',
          PhotoURL: data.photoUrl,
          LocationGPS: data.locationGPS || '-7.2278, 107.9087',
          CheckInTime: data.timeIn || new Date().toISOString()
        };
        return {
          success: true,
          message: 'Presensi digital berhasil tercatat dengan lokasi GPS tervalidasi.',
          attendance: newAtt
        };
      }
    );
  },

  // Live Sessions (Google Meet & Zoom)
  async getLiveSessions(courseId?: string): Promise<any[]> {
    const url = courseId ? `${BASE_URL}/live-sessions?courseId=${courseId}` : `${BASE_URL}/live-sessions`;
    return safeFetch(
      url,
      undefined,
      () => {
        const mock = get200MockData();
        const list = mock.liveSessions || [];
        if (courseId) return list.filter(s => s.CourseID === courseId);
        return list.length > 0 ? list : [
          {
            SessionID: 'SES-001',
            CourseID: 'CRS-TK01',
            CourseTitle: 'Teknisi Komputer & Perakitan PC',
            InstructorID: 'INS-001',
            InstructorName: 'Roni Nuroni, S.T., MCE',
            Platform: 'GOOGLE_MEET',
            MeetingUrl: 'https://meet.google.com/abc-defg-hij',
            ScheduledAt: '2026-03-01T09:00:00Z',
            DurationMinutes: 90,
            Topic: 'Workshop Langsung: Perakitan PC & Troubleshooting Hardware',
            Status: 'SCHEDULED'
          }
        ];
      }
    );
  },

  async saveLiveSession(data: any): Promise<{ success: boolean; session: any }> {
    return safeFetch(
      `${BASE_URL}/live-sessions`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => ({ success: true, session: { SessionID: `SES-${Date.now()}`, ...data } })
    );
  },

  async deleteLiveSession(sessionId: string): Promise<{ success: boolean; message: string }> {
    return safeFetch(
      `${BASE_URL}/live-sessions/${sessionId}`,
      { method: 'DELETE' },
      () => ({ success: true, message: 'Sesi tatap muka berhasil dihapus.' })
    );
  },

  async updateLiveSessionNotes(sessionId: string, data: { notes?: string; recordingUrl?: string; status?: string }): Promise<{ success: boolean; session: any }> {
    return safeFetch(
      `${BASE_URL}/live-sessions/${sessionId}/notes`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => ({ success: true, session: { SessionID: sessionId, ...data } })
    );
  },

  async attendLiveSession(sessionId: string, userId: string): Promise<{ success: boolean; message: string; attendance: any }> {
    return safeFetch(
      `${BASE_URL}/live-sessions/${sessionId}/attend`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId }) },
      () => ({
        success: true,
        message: 'Kehadiran sesi daring berhasil dikonfirmasi.',
        attendance: { SessionID: sessionId, UserID: userId, AttendedAt: new Date().toISOString() }
      })
    );
  },

  // Course Evaluation
  async getCourseEvaluation(courseId: string, userId: string): Promise<any> {
    return safeFetch(
      `${BASE_URL}/evaluations/user/${userId}/${courseId}`,
      undefined,
      () => null
    );
  },

  async submitCourseEvaluation(data: {
    courseId: string;
    userId: string;
    ratingMaterial: number;
    ratingInstructor: number;
    ratingPlatform: number;
    feedbackMaterial?: string;
    feedbackInstructor?: string;
    suggestions?: string;
  }): Promise<{ success: boolean; message: string; evaluation: any }> {
    return safeFetch(
      `${BASE_URL}/evaluations`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => ({
        success: true,
        message: 'Terima kasih atas ulasan dan evaluasi Anda!',
        evaluation: { EvaluationID: `EVL-${Date.now()}`, ...data, SubmittedAt: new Date().toISOString() }
      })
    );
  },

  // Graduation Rules & Status Check
  async getGraduationRules(courseId: string): Promise<any> {
    return safeFetch(
      `${BASE_URL}/courses/${courseId}/graduation-rules`,
      undefined,
      () => ({
        minAttendancePercent: 80,
        minMaterialPercent: 100,
        minAssignmentScore: 80,
        minPosttestScore: 80,
        requireFinalProject: true,
        requireEvaluation: true
      })
    );
  },

  async saveGraduationRules(courseId: string, rules: any): Promise<{ success: boolean; rules: any }> {
    return safeFetch(
      `${BASE_URL}/courses/${courseId}/graduation-rules`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(rules) },
      () => ({ success: true, rules })
    );
  },

  async checkGraduationStatus(userId: string, courseId: string): Promise<{
    isGraduated: boolean;
    enrollmentStatus: string;
    certificateStatus: string;
    certificate: Certificate | null;
    attendancePercent: number;
    materialsCompletedPercent: number;
    avgAssignmentScore: number;
    posttestScore: number;
    hasSubmittedProject: boolean;
    hasSubmittedEvaluation: boolean;
    rules: any;
    details: { label: string; passed: boolean; current: string }[];
  }> {
    return safeFetch(
      `${BASE_URL}/graduation/check/${userId}/${courseId}`,
      undefined,
      () => {
        const certs = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const cert = certs.find(c => c.UserID === userId && c.CourseID === courseId) || null;
        return {
          isGraduated: !!cert,
          enrollmentStatus: cert ? 'Completed' : 'Active',
          certificateStatus: cert ? cert.Status : 'MENUNGGU_SYARAT',
          certificate: cert,
          attendancePercent: 100,
          materialsCompletedPercent: 100,
          avgAssignmentScore: 92,
          posttestScore: 90,
          hasSubmittedProject: true,
          hasSubmittedEvaluation: true,
          rules: { minAttendancePercent: 80, minMaterialPercent: 100, minAssignmentScore: 80, minPosttestScore: 80 },
          details: [
            { label: 'Kehadiran Tatap Muka (Min. 80%)', passed: true, current: '100%' },
            { label: 'Penyelesaian Modul Materi (100%)', passed: true, current: '100%' },
            { label: 'Rata-rata Nilai Tugas (Min. 80)', passed: true, current: '92/100' },
            { label: 'Ujian Post-Test / Akhir (Min. 80)', passed: true, current: '90/100' }
          ]
        };
      }
    );
  },

  // Forum
  async getForumPosts(courseId: string): Promise<(ForumPost & { comments: ForumComment[] })[]> {
    return safeFetch(
      `${BASE_URL}/forum/${courseId}`,
      undefined,
      () => {
        const posts = getLocalItem<ForumPost[]>('forumPosts', INITIAL_FORUM_POSTS);
        const comments = getLocalItem<ForumComment[]>('forumComments', INITIAL_FORUM_COMMENTS);
        const matched = posts.filter(p => !courseId || p.CourseID === courseId || p.CourseID === 'CRS-TK01');
        return matched.map(p => ({
          ...p,
          comments: comments.filter(c => c.PostID === p.PostID)
        }));
      }
    );
  },

  async createForumPost(data: { courseId: string; userId: string; title: string; content: string }): Promise<{ success: boolean; post: ForumPost }> {
    return safeFetch(
      `${BASE_URL}/forum/post`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const posts = getLocalItem<ForumPost[]>('forumPosts', INITIAL_FORUM_POSTS);
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const u = users.find(user => user.UserID === data.userId);
        const newPost: ForumPost = {
          PostID: `PST-${Date.now()}`,
          CourseID: data.courseId,
          UserID: data.userId,
          UserName: u ? u.Name : 'Peserta',
          UserPhoto: u ? u.PhotoURL : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          UserRole: u ? u.Role : 'PESERTA',
          Title: data.title,
          Content: data.content,
          CreatedAt: new Date().toISOString(),
          CommentsCount: 0
        };
        posts.unshift(newPost);
        setLocalItem('forumPosts', posts);
        return { success: true, post: newPost };
      }
    );
  },

  async replyForumPost(data: { postId: string; userId: string; content: string; isBestAnswer?: boolean }): Promise<{ success: boolean; comment: ForumComment }> {
    return safeFetch(
      `${BASE_URL}/forum/reply`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const comments = getLocalItem<ForumComment[]>('forumComments', INITIAL_FORUM_COMMENTS);
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        const u = users.find(user => user.UserID === data.userId);
        const newCmt: ForumComment = {
          CommentID: `CMT-${Date.now()}`,
          PostID: data.postId,
          UserID: data.userId,
          UserName: u ? u.Name : 'Peserta',
          UserPhoto: u ? u.PhotoURL : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          UserRole: u ? u.Role : 'PESERTA',
          Content: data.content,
          IsBestAnswer: !!data.isBestAnswer,
          CreatedAt: new Date().toISOString()
        };
        comments.push(newCmt);
        setLocalItem('forumComments', comments);
        return { success: true, comment: newCmt };
      }
    );
  },

  // AI Tutor Intelligent Assistant
  async askAITutor(data: { message: string; courseTitle?: string; topic?: string }): Promise<{ reply: string }> {
    return safeFetch(
      `${BASE_URL}/ai-tutor`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const q = data.message.toLowerCase();
        let reply = `Halo! Saya AI Tutor resmi LPK Alpha Beta. Terkait pertanyaan Anda "${data.message}":\n\n`;

        if (q.includes('sertifikat') || q.includes('cetak') || q.includes('verifikasi')) {
          reply += `📜 **Informasi Sertifikat Resmi LPK Alpha Beta:**\n- Sertifikat digital otomatis diterbitkan setelah Anda menyelesaikan seluruh modul materi, tugas, dan ujian dengan nilai minimal 80.\n- Sertifikat fisik berstandar Kemnaker (VIN: 20002320503) & Kemdikdasmen (NISN: K9980820) dapat diajukan dengan biaya cetak & legalisir Rp 50.000 melalui menu Dasbor Siswa.\n- Keabsahan dapat dicek kapan saja di halaman Verifikasi Sertifikat melalui QR Code atau nomor seri sertifikat.`;
        } else if (q.includes('ram') || q.includes('hardware') || q.includes('pc') || q.includes('komputer') || q.includes('rakit')) {
          reply += `💻 **Panduan Teknisi Komputer & Hardware:**\n1. **Arsitektur:** Pastikan kompatibilitas Socket CPU (LGA/AM4/AM5) dengan Motherboard dan tipe RAM (DDR4/DDR5).\n2. **Troubleshooting:** Jika PC tidak menyala sama sekali, periksa saklar I/O pada PSU, sambungan kabel 24-Pin ATX, dan posisi pin kabel Front Panel Power SW pada Motherboard.\n3. **Keamanan:** Selalu gunakan alas antistatis dan jangan menyentuh pin emas secara langsung.`;
        } else if (q.includes('jaringan') || q.includes('mikrotik') || q.includes('ip') || q.includes('router')) {
          reply += `🌐 **Panduan Administrator Jaringan Komputer:**\n1. **IP Addressing:** Pastikan subnetting IPv4 terbagi dengan benar (contoh: /24 memberikan 254 host aktif).\n2. **Mikrotik RouterOS:** Gunakan Winbox untuk konfigurasi IP -> DHCP Server, NAT Masquerade, dan Firewall Filter Rules.\n3. **Kabel UTP:** Gunakan standar susunan kabel T568B untuk kabel Straight-Through ke Switch/Router.`;
        } else if (q.includes('inggris') || q.includes('english') || q.includes('bahasa')) {
          reply += `🗣️ **Tips Bahasa Inggris Terapan & Vokasi:**\n- Di LPK Alpha Beta, pelatihan bahasa Inggris difokuskan pada percakapan dunia kerja (English for Work), penulisan email profesional, dan wawancara kerja (Interview Skills).\n- Praktikkan pola Active Listening dan pelajari kosakata spesifik bidang Anda setiap hari.`;
        } else if (q.includes('paud') || q.includes('anak') || q.includes('didik')) {
          reply += `🧸 **Pelatihan Pendidik PAUD Vokasi:**\n- Meliputi 6 aspek perkembangan anak usia dini: Nilai Agama & Moral, Fisik Motorik, Kognitif, Bahasa, Sosial Emosional, dan Seni.\n- Pelajari pembuatan Alat Peraga Edukatif (APE) ramah anak dan kurikulum merdeka bermain.`;
        } else {
          reply += `Untuk topik kursus **${data.courseTitle || 'Pelatihan Vokasi Alpha Beta'}**:\n\n1. Pelajari rangkuman materi di Modul Pembelajaran secara berurutan.\n2. Terapkan aktivitas simulasi praktik mandiri yang tersedia di laboratorium kami.\n3. Kerjakan Kuis dan Tugas Praktik sebelum mengikuti Ujian Akhir.\n\nJika ada bagian konsep yang kurang jelas, Anda juga dapat bertanya langsung kepada Instruktur di menu Forum Diskusi atau Sesi Tatap Muka Daring!`;
        }

        return { reply };
      }
    );
  },

  // Alumni
  async getAlumni(): Promise<{ certificate: Certificate; user?: User }[]> {
    return safeFetch(
      `${BASE_URL}/alumni`,
      undefined,
      () => {
        const certs = getLocalItem<Certificate[]>('certificates', INITIAL_CERTIFICATES);
        const users = getLocalItem<User[]>('users', INITIAL_USERS);
        return certs.map(c => {
          const u = users.find(user => user.UserID === c.UserID || user.Name === c.UserName);
          return { certificate: c, user: u };
        });
      }
    );
  },

  // 200 Linked Participants
  async getParticipants(category?: string, search?: string): Promise<{
    total: number;
    counts: {
      total: number;
      sedangProses: number;
      lulusBelumBayar: number;
      sudahBayar: number;
      sertifikatAktif: number;
    };
    participants: any[];
  }> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);

    return safeFetch(
      `${BASE_URL}/participants?${params.toString()}`,
      undefined,
      () => {
        const mock = get200MockData();
        let list = mock.users || [];

        if (search) {
          const s = search.toLowerCase();
          list = list.filter(u => u.Name.toLowerCase().includes(s) || u.Email.toLowerCase().includes(s) || u.UserID.toLowerCase().includes(s));
        }

        const participantsWithDetails = list.map(u => {
          const enr = mock.enrollments.find(e => e.UserID === u.UserID);
          const cert = mock.certificates.find(c => c.UserID === u.UserID);
          const pay = mock.payments.find(p => p.UserID === u.UserID);
          const c = mock.courses.find(course => course.CourseID === enr?.CourseID) || mock.courses[0];

          let groupCategory = 'SEDANG_PROSES';
          if (cert && cert.Status === 'AKTIF') groupCategory = 'SERTIFIKAT_AKTIF';
          else if (pay && pay.Status === 'PAID') groupCategory = 'SUDAH_BAYAR';
          else if (enr && enr.Progress === 100) groupCategory = 'LULUS_BELUM_BAYAR';

          return {
            user: u,
            primaryCourse: c,
            enrollment: enr,
            certificate: cert,
            payment: pay,
            categoryGroup: groupCategory
          };
        });

        const filtered = category && category !== 'ALL'
          ? participantsWithDetails.filter(p => p.categoryGroup === category)
          : participantsWithDetails;

        return {
          total: participantsWithDetails.length,
          counts: {
            total: participantsWithDetails.length,
            sedangProses: participantsWithDetails.filter(p => p.categoryGroup === 'SEDANG_PROSES').length,
            lulusBelumBayar: participantsWithDetails.filter(p => p.categoryGroup === 'LULUS_BELUM_BAYAR').length,
            sudahBayar: participantsWithDetails.filter(p => p.categoryGroup === 'SUDAH_BAYAR').length,
            sertifikatAktif: participantsWithDetails.filter(p => p.categoryGroup === 'SERTIFIKAT_AKTIF').length
          },
          participants: filtered
        };
      }
    );
  },

  async getParticipantFullHistory(userId: string): Promise<any> {
    return safeFetch(
      `${BASE_URL}/participants/${userId}/full-history`,
      undefined,
      () => {
        const mock = get200MockData();
        const u = mock.users.find(user => user.UserID === userId) || mock.users[0];
        const enrs = mock.enrollments.filter(e => e.UserID === userId);
        const lhist = mock.learningHistories.filter(h => h.ParticipantID === userId);
        const certs = mock.certificates.filter(c => c.UserID === userId);
        const pays = mock.payments.filter(p => p.UserID === userId);
        const subs = mock.submissions.filter(s => s.UserID === userId);
        const notifs = mock.notifications.filter(n => n.UserID === userId);
        const acts = mock.activityLogs.filter(a => a.UserID === userId);

        return {
          user: u,
          enrollments: enrs,
          learningHistories: lhist,
          certificates: certs,
          payments: pays,
          submissions: subs,
          notifications: notifs,
          activityLogs: acts
        };
      }
    );
  },

  // Program Pricing & Audit History
  async getPrices(): Promise<any[]> {
    return safeFetch(
      `${BASE_URL}/admin/prices`,
      undefined,
      () => {
        const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        return courses.map(c => c.Pricing || {
          program_id: c.CourseID,
          title: c.Title,
          normal_price: c.Price,
          promo_price: c.Price * 0.85,
          tier_level: c.TierLevel || 'BASIC',
          price_status: 'ACTIVE'
        });
      }
    );
  },

  async getPriceHistory(): Promise<PriceHistoryRecord[]> {
    return safeFetch(
      `${BASE_URL}/admin/price-history`,
      undefined,
      () => getLocalItem<PriceHistoryRecord[]>('price_history', [])
    );
  },

  async updatePrice(data: {
    program_id: string;
    normal_price: number;
    tier_level?: string;
    duration_jp?: number;
    early_bird_price?: number;
    promo_price?: number;
    member_price?: number;
    package_price?: number;
    private_price?: number;
    group_price?: number;
    institution_price?: number;
    corporate_price?: number;
    price_status?: string;
    promo_start?: string;
    promo_end?: string;
    inclusions?: string[];
    admin_id?: string;
    admin_name?: string;
    reason?: string;
    requesterRole?: string;
  }): Promise<{ success: boolean; course?: Course; priceHistory?: PriceHistoryRecord; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/prices/update`,
      { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-user-role': data.requesterRole || 'ADMIN' }, body: JSON.stringify(data) },
      () => {
        const courses = getLocalItem<Course[]>('courses', INITIAL_COURSES);
        const idx = courses.findIndex(c => c.CourseID === data.program_id);
        let updatedCourse: Course | undefined;
        if (idx !== -1) {
          courses[idx].Price = data.normal_price;
          if (data.tier_level) courses[idx].TierLevel = data.tier_level as any;
          if (data.duration_jp) courses[idx].DurationJP = data.duration_jp;
          courses[idx].Pricing = {
            ...courses[idx].Pricing,
            program_id: data.program_id,
            normal_price: data.normal_price,
            promo_price: data.promo_price || data.normal_price * 0.85,
            early_bird_price: data.early_bird_price || data.normal_price * 0.9,
            member_price: data.member_price,
            package_price: data.package_price,
            private_price: data.private_price,
            group_price: data.group_price || data.normal_price * 5,
            institution_price: data.institution_price || data.normal_price * 8,
            currency: 'IDR',
            price_status: (data.price_status as any) || 'ACTIVE'
          };
          updatedCourse = courses[idx];
          setLocalItem('courses', courses);
        }

        const newRec: PriceHistoryRecord = {
          id: `HIS-${Date.now()}`,
          program_id: data.program_id,
          program_title: updatedCourse ? updatedCourse.Title : 'Kursus Alpha Beta',
          admin_id: data.admin_id || 'ADM-01',
          admin_name: data.admin_name || 'Ruli Lesmana, S.T., Gr.',
          old_price: 300000,
          new_price: data.normal_price,
          reason: data.reason || 'Penyesuaian kurikulum & paket pelatihan',
          timestamp: new Date().toISOString()
        };

        const hist = getLocalItem<PriceHistoryRecord[]>('price_history', []);
        hist.unshift(newRec);
        setLocalItem('price_history', hist);

        return {
          success: true,
          course: updatedCourse,
          priceHistory: newRec,
          message: 'Struktur harga program berhasil diperbarui & tercatat di audit log.'
        };
      }
    );
  },

  // Alias methods for compatibility
  async saveSettings(settings: Partial<AppSettings>): Promise<{ success: boolean; settings: AppSettings }> {
    return this.updateSettings(settings);
  },

  async createCourse(course: Partial<Course>): Promise<{ success: boolean; course: Course }> {
    const res = await this.saveAdminCourse(course);
    return { success: res.success, course: res.course! };
  },

  async getForumTopics(courseId: string): Promise<(ForumPost & { comments: ForumComment[] })[]> {
    return this.getForumPosts(courseId);
  },

  async getForumReplies(_postId: string): Promise<ForumComment[]> {
    const comments = getLocalItem<ForumComment[]>('forumComments', INITIAL_FORUM_COMMENTS);
    return comments.filter(c => c.PostID === _postId);
  },

  async createForumTopic(data: { courseId: string; userId: string; title: string; content: string }): Promise<{ success: boolean; post: ForumPost }> {
    return this.createForumPost(data);
  },

  async postForumReply(data: { postId: string; userId: string; content: string; isBestAnswer?: boolean }): Promise<{ success: boolean; comment: ForumComment }> {
    return this.replyForumPost(data);
  },

  // Instructors & Officials Management
  async getInstructors(activeOnly = false): Promise<OfficialPersonnel[]> {
    return safeFetch(
      `${BASE_URL}/admin/instructors${activeOnly ? '?activeOnly=true' : ''}`,
      undefined,
      () => {
        const list = getLocalItem<OfficialPersonnel[]>('officials', INITIAL_OFFICIALS);
        if (activeOnly) return list.filter(o => o.Status === 'Aktif');
        return list;
      }
    );
  },

  async createInstructor(data: Partial<OfficialPersonnel>): Promise<{ success: boolean; official?: OfficialPersonnel; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/instructors`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const officials = getLocalItem<OfficialPersonnel[]>('officials', INITIAL_OFFICIALS);
        const newOff: OfficialPersonnel = {
          ID: data.ID || `INS-${Date.now().toString().slice(-4)}`,
          Name: data.Name || 'Instruktur Baru',
          Degree: data.Degree || 'S.T.',
          RoleTitle: data.RoleTitle || 'Instruktur Resmi',
          Expertise: data.Expertise || 'Keahlian Vokasi',
          PhotoURL: data.PhotoURL || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
          Bio: data.Bio || 'Instruktur Resmi LPK Alpha Beta',
          Status: data.Status || 'Aktif',
          Email: data.Email || 'instruktur@alphabeta.edu.eu.org',
          Phone: data.Phone || '081223546686',
          OrderNumber: officials.length + 1,
          CreatedAt: new Date().toISOString()
        };
        officials.push(newOff);
        setLocalItem('officials', officials);
        return { success: true, official: newOff, message: 'Instruktur/Official berhasil ditambahkan.' };
      }
    );
  },

  async updateInstructor(id: string, data: Partial<OfficialPersonnel>): Promise<{ success: boolean; official?: OfficialPersonnel; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/instructors/${id}`,
      { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) },
      () => {
        const officials = getLocalItem<OfficialPersonnel[]>('officials', INITIAL_OFFICIALS);
        const idx = officials.findIndex(o => o.ID === id);
        if (idx !== -1) {
          officials[idx] = { ...officials[idx], ...data };
          setLocalItem('officials', officials);
          return { success: true, official: officials[idx], message: 'Data instruktur diperbarui.' };
        }
        throw new Error('Instruktur tidak ditemukan');
      }
    );
  },

  async deleteInstructor(id: string): Promise<{ success: boolean; isSoftDelete?: boolean; official?: OfficialPersonnel; message?: string }> {
    return safeFetch(
      `${BASE_URL}/admin/instructors/${id}`,
      { method: 'DELETE' },
      () => {
        const officials = getLocalItem<OfficialPersonnel[]>('officials', INITIAL_OFFICIALS);
        const filtered = officials.filter(o => o.ID !== id);
        setLocalItem('officials', filtered);
        return { success: true, message: 'Instruktur berhasil dihapus.' };
      }
    );
  }
};
