export type Language = 'id' | 'en' | 'de' | 'ar' | 'ms';

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  dir: 'ltr' | 'rtl';
  locale: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'id',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    dir: 'ltr',
    locale: 'id-ID'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English (US/UK)',
    flag: '🇬🇧',
    dir: 'ltr',
    locale: 'en-US'
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    dir: 'ltr',
    locale: 'de-DE'
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    dir: 'rtl',
    locale: 'ar-SA'
  },
  {
    code: 'ms',
    name: 'Malay',
    nativeName: 'Bahasa Melayu',
    flag: '🇲🇾',
    dir: 'ltr',
    locale: 'ms-MY'
  }
];

export interface TranslationDictionary {
  common: {
    home: string;
    courses: string;
    instructors: string;
    materials: string;
    dashboard: string;
    profile: string;
    login: string;
    register: string;
    logout: string;
    search: string;
    searchPlaceholder: string;
    next: string;
    previous: string;
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    back: string;
    filter: string;
    all: string;
    allCategories: string;
    loading: string;
    success: string;
    error: string;
    close: string;
    viewAll: string;
    readMore: string;
    details: string;
    detail: string;
    action: string;
    status: string;
    active: string;
    inactive: string;
    language: string;
    selectLanguage: string;
    switchRole: string;
    roleAccess: string;
    yes: string;
    no: string;
    total: string;
    share: string;
    copy: string;
    copied: string;
    download: string;
    print: string;
    verified: string;
    official: string;
    jp: string;
    reset: string;
  };
  nav: {
    brand: string;
    home: string;
    about: string;
    courses: string;
    english: string;
    paud: string;
    materials: string;
    gallery: string;
    news: string;
    contact: string;
    student: string;
    instructor: string;
    admin: string;
    studentDashboard: string;
    instructorDashboard: string;
    coachDashboard: string;
    adminDashboard: string;
    myProfile: string;
    aiTutor: string;
    checkCert: string;
    login: string;
    loginBtn: string;
    registerBtn: string;
  };
  hero: {
    badge: string;
    officialLms: string;
    titlePart1: string;
    titlePart2: string;
    titleHighlight: string;
    headline: string;
    subheadline: string;
    subtitle: string;
    description: string;
    ctaStart: string;
    ctaExplore: string;
    ctaVerify: string;
    ctaPrimary: string;
    ctaSecondary: string;
    accreditedBadge: string;
    statStudents: string;
    statCourses: string;
    statGraduates: string;
    statCertificates: string;
    statInstructors: string;
  };
  stats: {
    activeStudents: string;
    totalCourses: string;
    graduates: string;
    certificatesIssued: string;
    instructors: string;
  };
  courses: {
    catalogTitle: string;
    catalogSubtitle: string;
    filterByTier: string;
    filterByCategory: string;
    filterByLang: string;
    allLangs: string;
    level: string;
    duration: string;
    certificate: string;
    officialCert: string;
    students: string;
    rating: string;
    price: string;
    freeScholarship: string;
    enrollNow: string;
    viewDetails: string;
    whatYouWillLearn: string;
    prerequisites: string;
    inclusions: string;
    syllabus: string;
    modulesCount: string;
    lessonsCount: string;
    investmentPlan: string;
    tierLabel: string;
    promoActive: string;
    earlyBird: string;
    regular: string;
    memberDiscount: string;
    bundlingPackage: string;
    privateClass: string;
    groupSchool: string;
    faqTitle: string;
    noCoursesFound: string;
    noCoursesFoundDesc: string;
    resetFilter: string;
    featuredCourses: string;
    trainingInvestment: string;
    registerCourse: string;
    startLearning: string;
    searchPlaceholder: string;
    tierFilter: string;
    allTiers: string;
    subcategories: string;
    allSubcategories: string;
    noCourses: string;
  };
  learning: {
    startLearning: string;
    continueLearning: string;
    completed: string;
    progress: string;
    overallProgress: string;
    module: string;
    lesson: string;
    nextLesson: string;
    prevLesson: string;
    markAsCompleted: string;
    simulatorLab: string;
    practice: string;
    quiz: string;
    assignment: string;
    finalExam: string;
    certificateEarned: string;
    claimCertificate: string;
    readingWorkspace: string;
    aiTutorHelp: string;
    learningNotes: string;
    videoLesson: string;
    presentation: string;
    document: string;
    instructor: string;
    loginRequired: string;
  };
  quiz: {
    pretest: string;
    posttest: string;
    evaluation: string;
    startQuiz: string;
    submitQuiz: string;
    retakeQuiz: string;
    question: string;
    of: string;
    score: string;
    minScoreToPass: string;
    passedCongratulations: string;
    failedTryAgain: string;
    explanation: string;
    correctAnswer: string;
    yourAnswer: string;
  };
  certificate: {
    verificationTitle: string;
    verificationSubtitle: string;
    inputPlaceholder: string;
    verifyButton: string;
    certFound: string;
    certNotFound: string;
    studentName: string;
    courseName: string;
    certNumber: string;
    nisnNumber: string;
    vinNumber: string;
    issueDate: string;
    gradeScore: string;
    director: string;
    headInstructor: string;
    downloadPdf: string;
    printCert: string;
    qrVerificationNote: string;
    validOfficial: string;
    CertificateID: string;
    CourseTitle: string;
    FinalScore: string;
    GradePredikat: string;
    IssueDate: string;
    Status: string;
    UserName: string;
    UserNIK: string;
  };
  checkout: {
    registrationTitle: string;
    registrationSubtitle: string;
    selectPackage: string;
    fullName: string;
    whatsappNumber: string;
    emailAddress: string;
    scheduleOption: string;
    morningClass: string;
    eveningClass: string;
    weekendClass: string;
    submitBtn: string;
    submitting: string;
    successTitle: string;
    successDesc: string;
    inclusionsTitle: string;
  };
  dashboard: {
    studentWelcome: string;
    myLearning: string;
    activeCourses: string;
    completedCourses: string;
    totalXP: string;
    earnedCertificates: string;
    learningHours: string;
    recentActivities: string;
    continueCourse: string;
    browseMoreCourses: string;
    noEnrollmentYet: string;
  };
  instructor: {
    dashboardTitle: string;
    activeStudents: string;
    coursesManaged: string;
    averageRating: string;
    pendingReviews: string;
    modulesList: string;
    studentProgressTrack: string;
  };
  admin: {
    dashboardTitle: string;
    manageCourses: string;
    managePrices: string;
    manageUsers: string;
    priceHistory: string;
    gasSync: string;
    auditLogs: string;
    systemSettings: string;
    addNewCourse: string;
    editPricing: string;
    exportReport: string;
  };
  auth: {
    loginTitle: string;
    loginSubtitle: string;
    registerTitle: string;
    registerSubtitle: string;
    emailOrPhone: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    loginBtn: string;
    registerSubmitBtn: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    loginSuccess: string;
    logoutSuccess: string;
  };
  login: {
    title: string;
    subtitle: string;
    identifier: string;
    identifierPlaceholder: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    resetPassword: string;
    loginButton: string;
    portalAccount: string;
    noAccount: string;
    registerNow: string;
  };
  register: {
    title: string;
    subtitle: string;
    fullName: string;
    gender: string;
    male: string;
    female: string;
    email: string;
    phone: string;
    whatsapp: string;
    education: string;
    password: string;
    confirmPassword: string;
    passwordMin8: string;
    passwordMismatch: string;
    termsAndConditions: string;
    agreeTermsRequired: string;
    emailValidRequired: string;
    registerButton: string;
    hasAccount: string;
    successTitle: string;
    successSubtitle: string;
    successDesc: string;
  };
  footer: {
    aboutTitle: string;
    aboutDesc: string;
    quickLinks: string;
    programs: string;
    contactUs: string;
    address: string;
    phone: string;
    email: string;
    operatingHours: string;
    legalNote: string;
    allRightsReserved: string;
    nisnCode: string;
    vinCode: string;
    careerAlumni: string;
    platformTagline: string;
  };
}
