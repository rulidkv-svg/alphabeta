import { Course, Category } from '../types';
import { Language } from './types';

// Multilingual translations map for course titles, descriptions, and metadata
export interface CourseLocaleData {
  title: Record<Language, string>;
  description: Record<Language, string>;
  whatYouWillLearn: Record<Language, string[]>;
  categoryName: Record<Language, string>;
  level: Record<Language, string>;
  duration: Record<Language, string>;
  language: 'id' | 'en' | 'de' | 'ar' | 'ms' | 'multi';
}

export const COURSE_TRANSLATIONS: Record<string, CourseLocaleData> = {
  'CRS-DK01': {
    language: 'multi',
    title: {
      id: 'Dasar-Dasar Komputer & Sistem Operasi',
      en: 'Computer Fundamentals & Operating Systems',
      de: 'Computer-Grundlagen & Betriebssysteme',
      ar: 'أساسيات الحاسوب وأنظمة التشغيل',
      ms: 'Asas Komputer & Sistem Pengoperasian'
    },
    description: {
      id: 'Pengenalan arsitektur hardware, dasar OS Windows/Linux, manajemen file dan folder, serta pengetikan 10 jari terstandar.',
      en: 'Introduction to hardware architecture, Windows/Linux OS fundamentals, file and folder management, and ergonomic 10-finger touch typing.',
      de: 'Einführung in Hardware-Architektur, Grundlagen von Windows/Linux-Betriebssystemen, Dateiverwaltung und ergonomisches 10-Finger-Tastschreiben.',
      ar: 'مقدمة في معمارية العتاد، أساسيات أنظمة ويندوز ولينكس، إدارة الملفات والمجلدات، والطباعة باللمس بـ 10 أصابع.',
      ms: 'Pengenalan kepada seni bina perkakasan, asas OS Windows/Linux, pengurusan fail dan folder, serta penaipan pantas 10 jari.'
    },
    whatYouWillLearn: {
      id: ['Pengoperasian Komputer Standar', 'Manajemen File & Folder', 'Pengetikan Cepat & Ergonomis', 'Penggunaan Browser & Email'],
      en: ['Standard Computer Operation', 'File & Directory Organization', 'Ergonomic Fast Touch Typing', 'Safe Web Browsing & Emailing'],
      de: ['Standard-Computerbedienung', 'Datei- und Ordnerorganisation', 'Ergonomisches 10-Finger-Tastschreiben', 'Sichere Internet- und E-Mail-Nutzung'],
      ar: ['تشغيل الحاسوب بالمعايير القياسية', 'تنظيم الملفات والمجلدات', 'الطباعة السريعة المريحة', 'تصفح الإنترنت والبريد الإلكتروني بأمان'],
      ms: ['Operasi Komputer Piawai', 'Pengurusan Fail & Folder', 'Penaipan Pantas & Ergonomik', 'Penggunaan Pelayar Web & Emel']
    },
    categoryName: {
      id: 'Komputer & Teknologi',
      en: 'Computer & Technology',
      de: 'Computer & Technologie',
      ar: 'الحاسوب والتكنولوجيا',
      ms: 'Komputer & Teknologi'
    },
    level: {
      id: 'Pemula (Basic)',
      en: 'Beginner (Basic)',
      de: 'Anfänger (Basic)',
      ar: 'مبتدئ (تأسيسي)',
      ms: 'Pemula (Asas)'
    },
    duration: {
      id: '10 JP (4 Pertemuan)',
      en: '10 Training Hours (4 Sessions)',
      de: '10 Unterrichtsstunden (4 Sitzungen)',
      ar: '10 ساعات تدريبية (4 جلسات)',
      ms: '10 Jam Latihan (4 Sesi)'
    }
  },
  'CRS-DL02': {
    language: 'multi',
    title: {
      id: 'Digital Literacy & Internet Produktif',
      en: 'Digital Literacy & Productive Internet',
      de: 'Digitale Kompetenz & Produktives Internet',
      ar: 'محو الأمية الرقمية والإنترنت الإنتاجي',
      ms: 'Literasi Digital & Internet Produktif'
    },
    description: {
      id: 'Pelatihan literasi digital, keamanan akun online, etika komunikasi digital, dan pemanfaatan cloud storage (Google Drive/OneDrive).',
      en: 'Training in digital literacy, online account security, digital communication ethics, and cloud storage workflows (Google Drive/OneDrive).',
      de: 'Schulung in digitaler Kompetenz, Online-Sicherheit, digitaler Kommunikationsetikette und Cloud-Speichernutzung.',
      ar: 'تدريب على المعرفة الرقمية، أمان الحسابات عبر الإنترنت، أخلاقيات التواصل الرقمي، واستخدام التخزين السحابي.',
      ms: 'Latihan literasi digital, keselamatan akaun dalam talian, etika komunikasi digital dan storan awan.'
    },
    whatYouWillLearn: {
      id: ['Keamanan Berinternet & Proteksi Password', 'Google Workspace Dasar', 'Pencarian Informasi Valid & Anti-Hoaks', 'Etika Komunikasi Online'],
      en: ['Internet Security & Strong Passwords', 'Google Workspace Fundamentals', 'Fact-Checking & Anti-Misinformation', 'Digital Communication Etiquette'],
      de: ['Internetsicherheit & Passwortschutz', 'Google Workspace Grundlagen', 'Faktencheck & Quellenbewertung', 'Digitale Kommunikationsetikette'],
      ar: ['أمان الإنترنت وحماية كلمات المرور', 'أساسيات Google Workspace', 'التحقق من صحة المعلومات ومكافحة التضليل', 'آداب التواصل الرقمي'],
      ms: ['Keselamatan Internet & Kata Laluan', 'Asas Google Workspace', 'Semakan Fakta & Anti-Berita Palsu', 'Etika Komunikasi Digital']
    },
    categoryName: {
      id: 'Komputer & Teknologi',
      en: 'Computer & Technology',
      de: 'Computer & Technologie',
      ar: 'الحاسوب والتكنولوجيا',
      ms: 'Komputer & Teknologi'
    },
    level: {
      id: 'Pemula (Basic)',
      en: 'Beginner (Basic)',
      de: 'Anfänger (Basic)',
      ar: 'مبتدئ (تأسيسي)',
      ms: 'Pemula (Asas)'
    },
    duration: {
      id: '10 JP (4 Pertemuan)',
      en: '10 Training Hours (4 Sessions)',
      de: '10 Unterrichtsstunden (4 Sitzungen)',
      ar: '10 ساعات تدريبية (4 جلسات)',
      ms: '10 Jam Latihan (4 Sesi)'
    }
  },
  'CRS-MO01': {
    language: 'multi',
    title: {
      id: 'Microsoft Office Dasar Perkantoran',
      en: 'Microsoft Office for Office Productivity',
      de: 'Microsoft Office Grundlagen für Büroberufe',
      ar: 'مايكروسوفت أوفيس الأساسي للأعمال المكتبية',
      ms: 'Microsoft Office Asas Pejabat'
    },
    description: {
      id: 'Fondasi pengoperasian MS Word untuk surat menyurat, MS Excel untuk tabel & aritmatika dasar, serta PowerPoint presentasi ringkas.',
      en: 'Foundation of MS Word document processing, MS Excel table and basic calculation workflows, and PowerPoint presentations.',
      de: 'Grundlagen der Textverarbeitung mit MS Word, Tabellenkalkulation mit MS Excel und Erstellung von PowerPoint-Präsentationen.',
      ar: 'إتقان معالجة النصوص عبر MS Word، وإعداد الجداول الحسابية عبر MS Excel، وتصميم العروض التقديمية في PowerPoint.',
      ms: 'Penguasaan MS Word untuk persuratan rasmi, MS Excel untuk hamparan data asas dan PowerPoint persembahan.'
    },
    whatYouWillLearn: {
      id: ['Formatting Dokumen Resmi MS Word', 'Tabel & Rumus Dasar MS Excel', 'Pembuatan Slide Presentasi PowerPoint', 'Cetak & Ekspor PDF Terstandar'],
      en: ['Official Document Formatting in Word', 'Formulas & Data Tables in Excel', 'Slide Presentations in PowerPoint', 'Standard Printing & PDF Exporting'],
      de: ['Formatierung offizieller Word-Dokumente', 'Tabellen & Formeln in Excel', 'Erstellung von PowerPoint-Folien', 'Drucken & PDF-Export'],
      ar: ['تنسيق المستندات الرسمية في Word', 'الجداول والصيغ الحسابية في Excel', 'تصميم شرائح PowerPoint', 'الطباعة وتصدير ملفات PDF'],
      ms: ['Format Dokumen Rasmi Word', 'Jadual & Formula Asas Excel', 'Persembahan Slaid PowerPoint', 'Pencetakan & Eksport PDF']
    },
    categoryName: {
      id: 'Komputer & Teknologi',
      en: 'Computer & Technology',
      de: 'Computer & Technologie',
      ar: 'الحاسوب والتكنولوجيا',
      ms: 'Komputer & Teknologi'
    },
    level: {
      id: 'Pemula (Basic)',
      en: 'Beginner (Basic)',
      de: 'Anfänger (Basic)',
      ar: 'مبتدئ (تأسيسي)',
      ms: 'Pemula (Asas)'
    },
    duration: {
      id: '15 JP (6 Pertemuan)',
      en: '15 Training Hours (6 Sessions)',
      de: '15 Unterrichtsstunden (6 Sitzungen)',
      ar: '15 ساعة تدريبية (6 جلسات)',
      ms: '15 Jam Latihan (6 Sesi)'
    }
  },
  'CRS-TK01': {
    language: 'multi',
    title: {
      id: 'Teknisi Komputer & Perakitan PC',
      en: 'Computer Hardware & PC Assembly Technician',
      de: 'PC-Techniker & Hardware-Montage',
      ar: 'فني حاسوب وتجميع أجهزة الكمبيوتر',
      ms: 'Juruteknik Komputer & Pemasangan PC'
    },
    description: {
      id: 'Pelatihan teknisi komputer meliputi identifikasi hardware, perakitan PC virtual/fisik, instalasi OS, partisi disk, dan troubleshooting kelistrikan.',
      en: 'Computer technician training covering hardware diagnostics, PC assembly in 3D simulator, OS installation, storage partitioning, and hardware troubleshooting.',
      de: 'Umfassendes Hardware-Training mit Komponentendiagnose, PC-Montagesimulation, Betriebssysteminstallation und Fehlerbehebung.',
      ar: 'دورة فني الحاسوب المتكاملة وتشمل تشخيص العتاد، تجميع أجهزة الكمبيوتر عبر المحاكي الافتراضي، وتثبيت الأنظمة وصيانة الأعطال.',
      ms: 'Latihan juruteknik perkakasan merangkumi diagnostik komponen, pemasangan PC melalui simulator, pemasangan OS dan penyelesaian masalah.'
    },
    whatYouWillLearn: {
      id: ['Arsitektur CPU, RAM, GPU & Motherboard', 'Perakitan Komputer Langkah demi Langkah', 'Instalasi OS & Driver Perangkat', 'Diagnosa Kerusakan & Solusi Hardware'],
      en: ['CPU, RAM, GPU & Motherboard Architecture', 'Step-by-step PC Assembly Workflow', 'OS Installation & Driver Setup', 'Hardware Diagnostics & Repair'],
      de: ['Hardware-Architektur (CPU, RAM, GPU)', 'Schritt-für-Schritt-PC-Montage', 'Betriebssystem- & Treiberinstallation', 'Hardware-Fehlerdiagnose und Reparatur'],
      ar: ['معمارية المعالج والذاكرة واللوحة الأم', 'تجميع الحاسوب خطوة بخطوة', 'تثبيت نظام التشغيل والتعريفات', 'تشخيص أعطال العتاد وصيانتها'],
      ms: ['Seni Bina CPU, RAM, GPU & Papan Induk', 'Pemasangan Komputer Langkah Demi Langkah', 'Pemasangan OS & Pemacu Perkakasan', 'Diagnostik & Pembaikan Perkakasan']
    },
    categoryName: {
      id: 'Komputer & Teknologi',
      en: 'Computer & Technology',
      de: 'Computer & Technologie',
      ar: 'الحاسوب والتكنولوجيا',
      ms: 'Komputer & Teknologi'
    },
    level: {
      id: 'Menengah (Standard)',
      en: 'Intermediate (Standard)',
      de: 'Mittelstufe (Standard)',
      ar: 'متوسط (قياسي)',
      ms: 'Pertengahan (Piawai)'
    },
    duration: {
      id: '20 JP (8 Pertemuan)',
      en: '20 Training Hours (8 Sessions)',
      de: '20 Unterrichtsstunden (8 Sitzungen)',
      ar: '20 ساعة تدريبية (8 جلسات)',
      ms: '20 Jam Latihan (8 Sesi)'
    }
  },
  'CRS-ENG01': {
    language: 'en',
    title: {
      id: 'English for Daily Conversation & Workplace',
      en: 'English for Daily Conversation & Workplace',
      de: 'Englisch für Alltag & Beruf',
      ar: 'اللغة الإنجليزية للمحادثة اليومية وبيئة العمل',
      ms: 'Bahasa Inggeris untuk Perbualan Harian & Tempat Kerja'
    },
    description: {
      id: 'Penguasaan percakapan Bahasa Inggris aktif, pelafalan natural, tata bahasa praktis, dan simulasi wawancara kerja profesional.',
      en: 'Mastery of active English communication, natural pronunciation, practical business vocabulary, and professional job interview simulations.',
      de: 'Praktische englische Konversation, natürliche Aussprache, berufsbezogener Wortschatz und Simulation von Vorstellungsgesprächen.',
      ar: 'إتقان مهارات المحادثة باللغة الإنجليزية، النطق الصحيح، والمفردات المهنية مع محاكاة مقابلات العمل.',
      ms: 'Penguasaan perbualan Bahasa Inggeris aktif, sebutan tepat, tatabahasa praktikal dan simulasi temuduga kerjaya.'
    },
    whatYouWillLearn: {
      id: ['Percakapan Sehari-hari & Percaya Diri', 'Komunikasi Email & Telepon Profesional', 'Simulasi Wawancara Kerja Bahasa Inggris', 'Presentasi Singkat & Negosiasi'],
      en: ['Confident Daily Conversation Fluency', 'Professional Email & Phone Etiquette', 'English Job Interview Simulations', 'Short Presentations & Negotiation'],
      de: ['Sichere Konversation im Alltag', 'Professionelle E-Mail- und Telefonkommunikation', 'Englische Vorstellungsgespräche', 'Kurzpräsentationen & Verhandlungsführung'],
      ar: ['الطلاقة في المحادثات اليومية', 'آداب المراسلات المهنية والاتصالات', 'محاكاة مقابلات التوظيف بالإنجليزية', 'تقديم العروض والتفاوض'],
      ms: ['Kefasihan Perbualan Harian', 'Etika Emel & Komunikasi Telefon Pejabat', 'Simulasi Temuduga Kerja Bahasa Inggeris', 'Pembentangan Ringkas & Rundingan']
    },
    categoryName: {
      id: 'Bahasa Asing',
      en: 'Foreign Languages',
      de: 'Fremdsprachen',
      ar: 'اللغات الأجنبية',
      ms: 'Bahasa Asing'
    },
    level: {
      id: 'Menengah (Standard)',
      en: 'Intermediate (Standard)',
      de: 'Mittelstufe (Standard)',
      ar: 'متوسط (قياسي)',
      ms: 'Pertengahan (Piawai)'
    },
    duration: {
      id: '20 JP (8 Pertemuan)',
      en: '20 Training Hours (8 Sessions)',
      de: '20 Unterrichtsstunden (8 Sitzungen)',
      ar: '20 ساعة تدريبية (8 جلسات)',
      ms: '20 Jam Latihan (8 Sesi)'
    }
  },
  'CRS-WD01': {
    language: 'multi',
    title: {
      id: 'Full-Stack Web Development Modern',
      en: 'Modern Full-Stack Web Development',
      de: 'Moderne Full-Stack Webentwicklung',
      ar: 'تطوير مواقع الويب الشاملة الحديثة (Full-Stack)',
      ms: 'Pembangunan Web Full-Stack Moden'
    },
    description: {
      id: 'Membangun aplikasi web interaktif berbasis React, TypeScript, Tailwind CSS, API RESTful, dan deployment ke cloud modern.',
      en: 'Build modern responsive web applications with React, TypeScript, Tailwind CSS, RESTful APIs, and automated cloud deployments.',
      de: 'Entwicklung moderner Web-Apps mit React, TypeScript, Tailwind CSS, REST-APIs und Cloud-Deployment.',
      ar: 'بناء تطبيقات ويب تفاعلية باستخدام React وTypeScript وTailwind CSS والربط مع الواجهات البرمجية والتوزيع السحابي.',
      ms: 'Membina aplikasi web responsif menggunakan React, TypeScript, Tailwind CSS, API RESTful dan pelancaran ke awan.'
    },
    whatYouWillLearn: {
      id: ['HTML5, Modern CSS & Tailwind Framework', 'React Hooks, Komponen & State Management', 'TypeScript Type Safety & Integrasi REST API', 'Deployment Cloud & Git Version Control'],
      en: ['HTML5, Modern CSS & Tailwind Framework', 'React Hooks, Components & State Management', 'TypeScript Type Safety & REST API Integration', 'Cloud Deployment & Git Version Control'],
      de: ['HTML5, Modernes CSS & Tailwind Framework', 'React Hooks, Komponenten & State-Management', 'TypeScript Typsicherheit & REST-APIs', 'Cloud-Deployment & Git-Versionskontrolle'],
      ar: ['HTML5 و CSS الحديث مع إطار عمل Tailwind', 'مكتبة React وإدارة حالة التطبيق', 'لغة TypeScript وتكامل واجهات API', 'النشر السحابي والتحكم بالإصدارات Git'],
      ms: ['HTML5, CSS Moden & Kerangka Tailwind', 'React Hooks, Komponen & Pengurusan Keadaan', 'TypeScript & Integrasi REST API', 'Pelancaran Awan & Kawalan Versi Git']
    },
    categoryName: {
      id: 'Komputer & Teknologi',
      en: 'Computer & Technology',
      de: 'Computer & Technologie',
      ar: 'الحاسوب والتكنولوجيا',
      ms: 'Komputer & Teknologi'
    },
    level: {
      id: 'Mahir (Professional)',
      en: 'Advanced (Professional)',
      de: 'Fortgeschritten (Professional)',
      ar: 'متقدم (احترافي)',
      ms: 'Maju (Profesional)'
    },
    duration: {
      id: '30 JP (12 Pertemuan)',
      en: '30 Training Hours (12 Sessions)',
      de: '30 Unterrichtsstunden (12 Sitzungen)',
      ar: '30 ساعة تدريبية (12 جلسة)',
      ms: '30 Jam Latihan (12 Sesi)'
    }
  },
  'CRS-CS01': {
    language: 'multi',
    title: {
      id: 'Cyber Security & Ethical Hacking Dasar',
      en: 'Cybersecurity & Ethical Hacking Fundamentals',
      de: 'Cybersicherheit & Ethical Hacking Grundlagen',
      ar: 'أساسيات الأمن السيبراني والاختراق الأخلاقي',
      ms: 'Asas Keselamatan Siber & Penggodaman Beretika'
    },
    description: {
      id: 'Konsep keamanan siber, analisis kerentanan sistem, audit keamanan jaringan, proteksi malware, dan etika profesi cybersecurity.',
      en: 'Cybersecurity principles, vulnerability scanning, network defense auditing, malware protection, and professional ethical guidelines.',
      de: 'Sicherheitskonzepte, Schwachstellenanalyse, Netzwerküberwachung, Malware-Schutz und Cybersicherheits-Richtlinien.',
      ar: 'مفاهيم حماية الأنظمة، فحص الثغرات الأمنية، تدقيق أمان الشبكات، والوقاية من البرمجيات الخبيثة وفق المعايير الأخلاقية.',
      ms: 'Konsep keselamatan siber, imbasan kelemahan sistem, audit pertahanan rangkaian dan perlindungan perisian hasad.'
    },
    whatYouWillLearn: {
      id: ['Prinsip CIA Triad & Threat Modeling', 'Network Scanning & Analisis Wireshark', 'Web Security (OWASP Top 10)', 'Hardening Sistem & Mitigasi Serangan'],
      en: ['CIA Triad Principles & Threat Modeling', 'Network Scanning & Wireshark Packet Analysis', 'Web Application Security (OWASP Top 10)', 'System Hardening & Attack Mitigation'],
      de: ['CIA-Triade & Bedrohungsmodellierung', 'Netzwerk-Scanning & Wireshark-Analyse', 'Web-Sicherheit (OWASP Top 10)', 'System-Härtung & Abwehrmaßnahmen'],
      ar: ['مبادئ أمن المعلومات (CIA) ونمذجة التهديدات', 'فحص الشبكات وتحليل الحزم عبر Wireshark', 'أمان تطبيقات الويب (OWASP Top 10)', 'تقوية الأنظمة وتفادي الهجمات'],
      ms: ['Prinsip Triad CIA & Pemodelan Ancaman', 'Imbasan Rangkaian & Analisis Wireshark', 'Keselamatan Web (OWASP Top 10)', 'Pengukuhan Sistem & Pencegahan Serangan']
    },
    categoryName: {
      id: 'Komputer & Teknologi',
      en: 'Computer & Technology',
      de: 'Computer & Technologie',
      ar: 'الحاسوب والتكنولوجيا',
      ms: 'Komputer & Teknologi'
    },
    level: {
      id: 'Mahir (Professional)',
      en: 'Advanced (Professional)',
      de: 'Fortgeschritten (Professional)',
      ar: 'متقدم (احترافي)',
      ms: 'Maju (Profesional)'
    },
    duration: {
      id: '30 JP (12 Pertemuan)',
      en: '30 Training Hours (12 Sessions)',
      de: '30 Unterrichtsstunden (12 Sitzungen)',
      ar: '30 ساعة تدريبية (12 جلسة)',
      ms: '30 Jam Latihan (12 Sesi)'
    }
  }
};

/**
 * Returns a localized version of a Course entity based on active language.
 */
export function getLocalizedCourse(course: Course, lang: Language): Course {
  const loc = COURSE_TRANSLATIONS[course.CourseID];
  if (!loc) {
    return course;
  }

  return {
    ...course,
    Title: loc.title[lang] || course.Title,
    Description: loc.description[lang] || course.Description,
    CategoryName: loc.categoryName[lang] || course.CategoryName,
    Duration: loc.duration[lang] || course.Duration,
    WhatYouWillLearn: loc.whatYouWillLearn[lang] || course.WhatYouWillLearn
  };
}

/**
 * Returns localized category name and description
 */
export function getLocalizedCategory(category: Category | string, lang: Language): any {
  const nameMap: Record<string, Record<Language, string>> = {
    'CAT-001': {
      id: 'Komputer & Teknologi',
      en: 'Computer & Technology',
      de: 'Computer & Technologie',
      ar: 'الحاسوب والتكنولوجيا',
      ms: 'Komputer & Teknologi'
    },
    'CAT-002': {
      id: 'Bisnis & Manajemen',
      en: 'Business & Management',
      de: 'Wirtschaft & Management',
      ar: 'الأعمال والإدارة',
      ms: 'Perniagaan & Pengurusan'
    },
    'CAT-003': {
      id: 'Desain & Multimedia',
      en: 'Design & Multimedia',
      de: 'Design & Multimedia',
      ar: 'التصميم والوسائط المتعددة',
      ms: 'Reka Bentuk & Multimedia'
    },
    'CAT-004': {
      id: 'Bahasa Asing',
      en: 'Foreign Languages',
      de: 'Fremdsprachen',
      ar: 'اللغات الأجنبية',
      ms: 'Bahasa Asing'
    },
    'CAT-005': {
      id: 'Pendidikan & Kepaudan',
      en: 'Early Childhood Education',
      de: 'Frühkindliche Bildung',
      ar: 'التربية والتعليم المبكر',
      ms: 'Pendidikan Awal Kanak-kanak'
    },
    'CAT-006': {
      id: 'Kejuruan & Keterampilan',
      en: 'Vocational & Practical Skills',
      de: 'Berufliche Fertigkeiten',
      ar: 'المهن والمهارات التطبيقية',
      ms: 'Kemahiran Vokasional'
    }
  };

  const stringMap: Record<string, Record<Language, string>> = {
    'Komputer & Teknologi': {
      id: 'Komputer & Teknologi',
      en: 'Computer & Technology',
      de: 'Computer & Technologie',
      ar: 'الحاسوب والتكنولوجيا',
      ms: 'Komputer & Teknologi'
    },
    'Kreatif & Desain': {
      id: 'Kreatif & Desain',
      en: 'Creative & Design',
      de: 'Kreativ & Design',
      ar: 'الإبداع والتصميم',
      ms: 'Kreatif & Reka Bentuk'
    },
    'Bahasa & Komunikasi': {
      id: 'Bahasa & Komunikasi',
      en: 'Language & Communication',
      de: 'Sprache & Kommunikation',
      ar: 'اللغة والتواصل',
      ms: 'Bahasa & Komunikasi'
    },
    'Kewirausahaan Digital': {
      id: 'Kewirausahaan Digital',
      en: 'Digital Entrepreneurship',
      de: 'Digitales Unternehmertum',
      ar: 'ريادة الأعمال الرقمية',
      ms: 'Keusahawanan Digital'
    }
  };

  if (typeof category === 'string') {
    return stringMap[category]?.[lang] || category;
  }

  const loc = nameMap[category.CategoryID];
  if (!loc) return category;

  return {
    ...category,
    Name: loc[lang] || category.Name
  };
}
