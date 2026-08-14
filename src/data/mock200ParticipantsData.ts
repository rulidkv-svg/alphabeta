import {
  User,
  Course,
  Enrollment,
  Module,
  Assignment,
  AssignmentSubmission,
  Certificate,
  Payment,
  LearningHistory,
  AssessmentHistory,
  MessageRecord,
  LiveSession,
  MeetingAttendance,
  RecordingView,
  MeetingInteraction,
  NotificationRecord,
  ActivityLogRecord,
  ForumPost,
  ForumComment
} from '../types';

// ==========================================
// 10 MANDATORY COURSES DATA
// ==========================================
export const DUMMY_COURSES: Course[] = [
  {
    CourseID: 'COURSE-AI-01',
    Title: 'AI untuk Pembelajaran',
    CategoryID: 'CAT-01',
    CategoryName: 'Teknologi Pendidikan',
    Description: 'Pemanfaatan kecerdasan buatan dalam merancang materi, penilaian otomatis, dan personalisasi pembelajaran.',
    InstructorID: 'INS-003',
    InstructorName: 'Syifa Rahmawati, S.T.',
    Thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    Duration: '30 Jam',
    Level: 'Semua Level',
    Price: 499000,
    Pricing: {
      program_id: 'COURSE-AI-01',
      normal_price: 499000,
      early_bird_price: 349000,
      promo_price: 299000,
      group_price: 2500000,
      institution_price: 3999000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'PROMO'
    },
    Rating: 4.9,
    EnrolledCount: 200,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Prompt Engineering untuk Guru', 'Pembuatan Modul Ajar AI', 'Evaluasi Kinerja Siswa Berbasis AI'],
    Prerequisites: ['Dasar Penggunaan Komputer & Internet'],
    CreatedAt: '2026-01-05'
  },
  {
    CourseID: 'COURSE-LD-02',
    Title: 'Literasi Digital',
    CategoryID: 'CAT-02',
    CategoryName: 'Keterampilan Digital',
    Description: 'Pemahaman etika berinternet, keamanan data pribadi, kritis terhadap hoaks, dan kolaborasi online.',
    InstructorID: 'INS-002',
    InstructorName: 'Ridwan Abdul Aziz, S.T.',
    Thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    Duration: '24 Jam',
    Level: 'Pemula',
    Price: 199000,
    Pricing: {
      program_id: 'COURSE-LD-02',
      normal_price: 199000,
      early_bird_price: 149000,
      promo_price: 129000,
      group_price: 1200000,
      institution_price: 1800000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.8,
    EnrolledCount: 180,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Cyber Security Basics', 'Etika Komunikasi Digital', 'Pengelolaan Informasi Sahih'],
    Prerequisites: ['Tidak Ada'],
    CreatedAt: '2026-01-08'
  },
  {
    CourseID: 'COURSE-DG-03',
    Title: 'Desain Grafis',
    CategoryID: 'CAT-03',
    CategoryName: 'Desain & Kreatif',
    Description: 'Prinsip tata letak, teori warna, tipografi, dan pembuatan materi visual profesional.',
    InstructorID: 'CCH-002',
    InstructorName: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
    Thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=600&auto=format&fit=crop&q=80',
    Duration: '36 Jam',
    Level: 'Menengah',
    Price: 299000,
    Pricing: {
      program_id: 'COURSE-DG-03',
      normal_price: 299000,
      early_bird_price: 229000,
      promo_price: 199000,
      group_price: 1800000,
      institution_price: 2500000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.9,
    EnrolledCount: 165,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Photoshop & Illustrator Basics', 'Branding Kit', 'Layouting Poster & Banner'],
    Prerequisites: ['Laptop / Komputer Desain'],
    CreatedAt: '2026-01-10'
  },
  {
    CourseID: 'COURSE-UI-04',
    Title: 'UI/UX Design',
    CategoryID: 'CAT-03',
    CategoryName: 'Desain & Kreatif',
    Description: 'Perancangan antarmuka aplikasi web dan mobile dengan pendekatan User-Centered Design.',
    InstructorID: 'CCH-002',
    InstructorName: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
    Thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    Duration: '40 Jam',
    Level: 'Menengah',
    Price: 499000,
    Pricing: {
      program_id: 'COURSE-UI-04',
      normal_price: 499000,
      early_bird_price: 379000,
      promo_price: 329000,
      group_price: 3000000,
      institution_price: 4000000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.95,
    EnrolledCount: 150,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['User Research & Wireframing', 'Figma Prototyping', 'Usability Testing'],
    Prerequisites: ['Desain Dasar'],
    CreatedAt: '2026-01-12'
  },
  {
    CourseID: 'COURSE-MM-05',
    Title: 'Multimedia',
    CategoryID: 'CAT-03',
    CategoryName: 'Desain & Kreatif',
    Description: 'Integrasi audio, video, animasi 2D/3D, dan elemen interaktif untuk pembelajaran dan presentasi.',
    InstructorID: 'CCH-003',
    InstructorName: 'Budi Iskandar, S.Si., M.Pd.',
    Thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80',
    Duration: '32 Jam',
    Level: 'Menengah',
    Price: 499000,
    Pricing: {
      program_id: 'COURSE-MM-05',
      normal_price: 499000,
      early_bird_price: 379000,
      promo_price: 329000,
      group_price: 3000000,
      institution_price: 4000000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.75,
    EnrolledCount: 140,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Audio Editing & Sound Effects', '2D Motion Graphics', 'Interactive Media Creation'],
    Prerequisites: ['Kemampuan Komputer Dasar'],
    CreatedAt: '2026-01-15'
  },
  {
    CourseID: 'COURSE-DM-06',
    Title: 'Digital Marketing',
    CategoryID: 'CAT-04',
    CategoryName: 'Bisnis & Pemasaran',
    Description: 'Strategi pemasaran digital, Social Media Management, SEO, Content Creation, dan Meta Ads.',
    InstructorID: 'CCH-004',
    InstructorName: 'Wina Mulyani, S.Pd.',
    Thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
    Duration: '28 Jam',
    Level: 'Semua Level',
    Price: 399000,
    Pricing: {
      program_id: 'COURSE-DM-06',
      normal_price: 399000,
      early_bird_price: 299000,
      promo_price: 249000,
      group_price: 2400000,
      institution_price: 3200000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.85,
    EnrolledCount: 190,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Content Strategy & Calendar', 'Copywriting & Engagement', 'Analytics & ROI Measurement'],
    Prerequisites: ['Akun Media Sosial'],
    CreatedAt: '2026-01-18'
  },
  {
    CourseID: 'COURSE-VE-07',
    Title: 'Video Editing',
    CategoryID: 'CAT-03',
    CategoryName: 'Desain & Kreatif',
    Description: 'Editing video profesional menggunakan CapCut, Premiere Pro, color grading, dan audio mixing.',
    InstructorID: 'CCH-003',
    InstructorName: 'Budi Iskandar, S.Si., M.Pd.',
    Thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=600&auto=format&fit=crop&q=80',
    Duration: '32 Jam',
    Level: 'Semua Level',
    Price: 299000,
    Pricing: {
      program_id: 'COURSE-VE-07',
      normal_price: 299000,
      early_bird_price: 229000,
      promo_price: 199000,
      group_price: 1800000,
      institution_price: 2500000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.9,
    EnrolledCount: 175,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Cutting & Transition Techniques', 'Text Animation & Subtitles', 'Sound Design & Rendering'],
    Prerequisites: ['Aplikasi Video Editing'],
    CreatedAt: '2026-01-20'
  },
  {
    CourseID: 'COURSE-FT-08',
    Title: 'Fotografi Digital',
    CategoryID: 'CAT-03',
    CategoryName: 'Desain & Kreatif',
    Description: 'Teknik dasar fotografi, pencahayaan, komposisi, fotografi produk, dan retouching foto.',
    InstructorID: 'CCH-003',
    InstructorName: 'Budi Iskandar, S.Si., M.Pd.',
    Thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    Duration: '24 Jam',
    Level: 'Pemula',
    Price: 299000,
    Pricing: {
      program_id: 'COURSE-FT-08',
      normal_price: 299000,
      early_bird_price: 229000,
      promo_price: 199000,
      group_price: 1800000,
      institution_price: 2500000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.8,
    EnrolledCount: 130,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Triangle Exposure (ISO, Shutter, Aperture)', 'Composition Rules', 'Lightroom Photo Touchup'],
    Prerequisites: ['Kamera HP atau DSLR/Mirrorless'],
    CreatedAt: '2026-01-22'
  },
  {
    CourseID: 'COURSE-AIG-09',
    Title: 'AI Generatif untuk Kreator',
    CategoryID: 'CAT-01',
    CategoryName: 'Teknologi Pendidikan',
    Description: 'Penggunaan ChatGPT, Midjourney, Claude, Gemini, dan Suno AI dalam produktivitas kerja.',
    InstructorID: 'INS-003',
    InstructorName: 'Syifa Rahmawati, S.T.',
    Thumbnail: 'https://blogger.googleusercontent.com/img/a/AVvXsEgTvCnFEM0nNssn0cvIMnZiuGEt6xkIvudeG7DboQSjwq632syc6Lto31dZ7mGb89ENl8_plBM9S09bXn97337k9GwXDLc06C-iwNao-YU_x-GgoeCrt9fEYeXi6Gq5IWBHkrZzHNqZOtEb7R636BhqDMbVz61ReiJbB1wZdcvMgSGzyehQK7lN5AvuYLDa',
    Duration: '26 Jam',
    Level: 'Semua Level',
    Price: 399000,
    Pricing: {
      program_id: 'COURSE-AIG-09',
      normal_price: 399000,
      early_bird_price: 299000,
      promo_price: 249000,
      group_price: 2400000,
      institution_price: 3200000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.95,
    EnrolledCount: 200,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Generative Text & Image Prompts', 'Automated Content Creation', 'AI Workflow Integration'],
    Prerequisites: ['Tidak Ada'],
    CreatedAt: '2026-01-25'
  },
  {
    CourseID: 'COURSE-TPD-10',
    Title: 'Teknologi Pembelajaran Digital',
    CategoryID: 'CAT-01',
    CategoryName: 'Teknologi Pendidikan',
    Description: 'Penerapan LMS, Quizizz, Kahoot, Google Classroom, Canva, dan media pembelajaran interaktif.',
    InstructorID: 'INS-001',
    InstructorName: 'Roni Nuroni, S.T., MCE',
    Thumbnail: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
    Duration: '30 Jam',
    Level: 'Menengah',
    Price: 499000,
    Pricing: {
      program_id: 'COURSE-TPD-10',
      normal_price: 499000,
      early_bird_price: 349000,
      promo_price: 299000,
      group_price: 2500000,
      institution_price: 3999000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.88,
    EnrolledCount: 185,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Integrasi LMS & Interactive Quiz', 'Blended Learning Strategy', 'Gamifikasi Pembelajaran'],
    Prerequisites: ['Pengalaman Mengajar / Pelatih'],
    CreatedAt: '2026-01-28'
  },
  {
    CourseID: 'COURSE-CNV-11',
    Title: 'Canva untuk Profesional',
    CategoryID: 'CAT-03',
    CategoryName: 'Desain & Kreatif',
    Description: 'Membuat presentasi bisnis, konten sosial media, branding kit, dan materi cetak berstandar profesional dengan Canva.',
    InstructorID: 'CCH-002',
    InstructorName: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
    Thumbnail: 'https://images.unsplash.com/photo-1542744094-3a3172720177?w=600&auto=format&fit=crop&q=80',
    Duration: '18 Jam',
    Level: 'Pemula',
    Price: 249000,
    Pricing: {
      program_id: 'COURSE-CNV-11',
      normal_price: 249000,
      early_bird_price: 189000,
      promo_price: 159000,
      group_price: 1500000,
      institution_price: 2000000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.9,
    EnrolledCount: 160,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Brand Kit & Typography', 'Desain Presentasi Interaktif', 'Materi Promosi & Ads'],
    Prerequisites: ['Akses Browser & Internet'],
    CreatedAt: '2026-02-01'
  },
  {
    CourseID: 'COURSE-AIGU-12',
    Title: 'AI untuk Guru/Instruktur',
    CategoryID: 'CAT-01',
    CategoryName: 'Teknologi Pendidikan',
    Description: 'Otomasi administrasi pembelajaran, pembuatan soal otomatis, dan panduan praktis AI dalam pengajaran.',
    InstructorID: 'INS-003',
    InstructorName: 'Syifa Rahmawati, S.T.',
    Thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80',
    Duration: '30 Jam',
    Level: 'Semua Level',
    Price: 499000,
    Pricing: {
      program_id: 'COURSE-AIGU-12',
      normal_price: 499000,
      early_bird_price: 349000,
      promo_price: 299000,
      group_price: 2500000,
      institution_price: 3999000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.92,
    EnrolledCount: 170,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Otomasi RPP & Modul Ajar', 'Penilaian Otomatis Berbasis AI', 'Strategi Edukasi Digital'],
    Prerequisites: ['Guru / Pengajar / Pelatih'],
    CreatedAt: '2026-02-02'
  },
  {
    CourseID: 'COURSE-DDAI-13',
    Title: 'Digital Design berbasis AI',
    CategoryID: 'CAT-03',
    CategoryName: 'Desain & Kreatif',
    Description: 'Generasi karya seni digital, prompt image-to-image, inpainting, dan penyuntingan visual mutakhir dengan AI.',
    InstructorID: 'CCH-002',
    InstructorName: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
    Thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
    Duration: '32 Jam',
    Level: 'Menengah',
    Price: 599000,
    Pricing: {
      program_id: 'COURSE-DDAI-13',
      normal_price: 599000,
      early_bird_price: 449000,
      promo_price: 399000,
      group_price: 3600000,
      institution_price: 4800000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 4.88,
    EnrolledCount: 140,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Generative Design Workflow', 'Photoshop AI Firefly Integration', 'Visual Branding Prototyping'],
    Prerequisites: ['Dasar Desain Grafis'],
    CreatedAt: '2026-02-03'
  },
  {
    CourseID: 'COURSE-IUI-14',
    Title: 'Intensive UI/UX',
    CategoryID: 'CAT-03',
    CategoryName: 'Desain & Kreatif',
    Description: 'Bootcamp intensif UI/UX Design dengan live mentoring, case study nyata, portofolio rilis Figma, dan bimbingan karir.',
    InstructorID: 'CCH-002',
    InstructorName: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
    Thumbnail: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    Duration: '60 Jam (8 Minggu)',
    Level: 'Lanjutan',
    Price: 999000,
    Pricing: {
      program_id: 'COURSE-IUI-14',
      normal_price: 999000,
      early_bird_price: 749000,
      promo_price: 699000,
      group_price: 6000000,
      institution_price: 8000000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'EARLY_BIRD'
    },
    Rating: 4.98,
    EnrolledCount: 110,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['End-to-End Product Design', 'Design System Architecture', 'User Testing & Career Coaching'],
    Prerequisites: ['Memahami Figma dasar'],
    CreatedAt: '2026-02-04'
  },
  {
    CourseID: 'COURSE-PAI-15',
    Title: 'Professional AI Training',
    CategoryID: 'CAT-01',
    CategoryName: 'Teknologi Pendidikan',
    Description: 'Program pelatihan profesional untuk lembaga/perusahaan: pengembangan model AI kustom, otomasi workflow, dan integrasi enterprise API.',
    InstructorID: 'INS-001',
    InstructorName: 'Roni Nuroni, S.T., MCE',
    Thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=600&auto=format&fit=crop&q=80',
    Duration: '80 Jam (12 Minggu)',
    Level: 'Lanjutan',
    Price: 1499000,
    Pricing: {
      program_id: 'COURSE-PAI-15',
      normal_price: 1499000,
      early_bird_price: 1199000,
      promo_price: 999000,
      group_price: 9000000,
      institution_price: 12000000,
      promo_start: '2026-01-01',
      promo_end: '2026-12-31',
      currency: 'IDR',
      price_status: 'ACTIVE'
    },
    Rating: 5.0,
    EnrolledCount: 85,
    Status: 'Published',
    HasCertificate: true,
    WhatYouWillLearn: ['Enterprise AI Architecture', 'API Integration & Fine-Tuning', 'AI Security & Ethics'],
    Prerequisites: ['Latar Belakang IT / Managerial'],
    CreatedAt: '2026-02-05'
  }
];

// Helper Lists for Data Generation
const FIRST_NAMES_MALE = [
  'Budi', 'Agus', 'Dedi', 'Eko', 'Rizal', 'Rizky', 'Fajar', 'Hendra', 'Irfan', 'Joko',
  'Kurniawan', 'Lukman', 'Miftah', 'Naufal', 'Oky', 'Pratama', 'Qomar', 'Rian', 'Satria', 'Taufik',
  'Utama', 'Vicky', 'Wahyu', 'Xaverius', 'Yusuf', 'Zainal', 'Andi', 'Bambang', 'Candra', 'Dwi',
  'Edi', 'Firmansyah', 'Gilang', 'Hafiz', 'Indra', 'Jaya', 'Khairul', 'Lutfi', 'Muhammad', 'Nur'
];

const FIRST_NAMES_FEMALE = [
  'Anisa', 'Bunga', 'Citra', 'Dewi', 'Eka', 'Fitri', 'Gita', 'Hani', 'Indah', 'Jelita',
  'Kartika', 'Lestari', 'Maya', 'Nabila', 'Oktavia', 'Putri', 'Qori', 'Rina', 'Siti', 'Tia',
  'Utami', 'Vina', 'Wulan', 'Yulia', 'Zahra', 'Ayu', 'Dian', 'Elsa', 'Farida', 'Grace',
  'Hana', 'Intan', 'Jasmine', 'Kiki', 'Lia', 'Melati', 'Nadia', 'Niken', 'Rahma', 'Santi'
];

const LAST_NAMES = [
  'Santoso', 'Wijaya', 'Kusuma', 'Pratama', 'Hidayat', 'Saputra', 'Setiawan', 'Nugroho', 'Laksana', 'Suryadi',
  'Ramadhan', 'Firmansyah', 'Permana', 'Utomo', 'Siregar', 'Nst', 'Sembiring', 'Lubis', 'Koto', 'Tanjung',
  'Suhendra', 'Gunawan', 'Wibowo', 'Nugraha', 'Syahputra', 'Baskoro', 'Mahendra', 'Pradipta', 'Puspa', 'Astuti'
];

const CITIES = [
  { city: 'Kota Bandung', prov: 'Jawa Barat' },
  { city: 'Kab. Bandung Barat', prov: 'Jawa Barat' },
  { city: 'Kota Jakarta Selatan', prov: 'DKI Jakarta' },
  { city: 'Kota Surabaya', prov: 'Jawa Timur' },
  { city: 'Kota Semarang', prov: 'Jawa Tengah' },
  { city: 'Kota Yogyakarta', prov: 'DI Yogyakarta' },
  { city: 'Kota Medan', prov: 'Sumatera Utara' },
  { city: 'Kota Padang', prov: 'Sumatera Barat' },
  { city: 'Kota Palembang', prov: 'Sumatera Selatan' },
  { city: 'Kota Denpasar', prov: 'Bali' },
  { city: 'Kota Makassar', prov: 'Sulawesi Selatan' },
  { city: 'Kota Banjarmasin', prov: 'Kalimantan Selatan' },
  { city: 'Kab. Bogor', prov: 'Jawa Barat' },
  { city: 'Kota Depok', prov: 'Jawa Barat' },
  { city: 'Kota Bekasi', prov: 'Jawa Barat' },
  { city: 'Kota Tangerang', prov: 'Banten' }
];

const INSTITUTIONS = [
  'SMK Negeri 1 Bandung', 'SMK Negeri 2 Surabaya', 'SMK Negeri 3 Semarang',
  'SMA Negeri 1 Jakarta', 'SMA Negeri 5 Yogyakarta', 'Dinas Pendidikan Prov. Jawa Barat',
  'Universitas Pendidikan Indonesia', 'Universitas Gadjah Mada', 'Universitas Airlangga',
  'LPK Mandiri Tech', 'LPK Alpha Beta Learning Center', 'SDN Utama 01 Bandung',
  'SMP Negeri 4 Cimahi', 'Politeknik Negeri Bandung', 'PT Edukasi Nusantara'
];

const OCCUPATIONS = [
  'Siswa SMK', 'Mahasiswa', 'Guru Komputer', 'Guru PAUD/SD', 'Staf IT',
  'Operator Sekolah', 'Instruktur Muda', 'Freelancer Graphic Designer',
  'Content Creator', 'PNS / ASN Guru', 'Pengembang Kurikulum'
];

const AVATARS_MALE = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop&q=80'
];

const AVATARS_FEMALE = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
];

// Seed Data Generator Function for 200 Linked Participants
export function generate200ParticipantsData() {
  const users: User[] = [];
  const enrollments: Enrollment[] = [];
  const learningHistories: LearningHistory[] = [];
  const assignments: Assignment[] = [];
  const submissions: AssignmentSubmission[] = [];
  const assessmentHistories: AssessmentHistory[] = [];
  const liveSessions: LiveSession[] = [];
  const meetingAttendances: MeetingAttendance[] = [];
  const recordingViews: RecordingView[] = [];
  const meetingInteractions: MeetingInteraction[] = [];
  const messages: MessageRecord[] = [];
  const forumPosts: ForumPost[] = [];
  const forumComments: ForumComment[] = [];
  const payments: Payment[] = [];
  const certificates: Certificate[] = [];
  const notifications: NotificationRecord[] = [];
  const activityLogs: ActivityLogRecord[] = [];

  // Generate Base Assignments per Course
  DUMMY_COURSES.forEach((course, idx) => {
    assignments.push({
      AssignmentID: `ASG-${course.CourseID}-01`,
      CourseID: course.CourseID,
      ModuleID: `MOD-${course.CourseID}-03`,
      Title: `Tugas Praktik & Studi Kasus - ${course.Title}`,
      Instruction: `Silakan unduh studi kasus, kerjakan sesuai panduan modul 3, dan kumpulkan hasil akhir dalam format PDF / Link Drive.`,
      DueDate: '2026-02-28',
      MaxScore: 100
    });
  });

  // Generate Base Live Sessions per Course (2 live sessions per course: Meet & Zoom)
  DUMMY_COURSES.forEach((course, idx) => {
    liveSessions.push(
      {
        SessionID: `MEET-${course.CourseID}-01`,
        CourseID: course.CourseID,
        Title: `Webinar Orientasi & Konsep Dasar ${course.Title}`,
        Platform: 'GOOGLE_MEET',
        MeetingURL: `https://meet.google.com/abc-defg-${idx + 10}`,
        MeetingID: `928-102-${100 + idx}`,
        HostName: 'Admin LPK Alpha Beta',
        InstructorName: course.InstructorName || 'Roni Nuroni, S.T., MCE',
        TrainerName: 'Ine Yuniar Suryadi, S.Pd.',
        Date: '2026-01-15',
        StartTime: '09:00',
        EndTime: '11:30',
        DurationMinutes: 150,
        Status: 'Selesai'
      },
      {
        SessionID: `MEET-${course.CourseID}-02`,
        CourseID: course.CourseID,
        Title: `Live Coaching & Workshop Project ${course.Title}`,
        Platform: 'ZOOM',
        MeetingURL: `https://zoom.us/j/8291029${idx}`,
        MeetingID: `829 1029 ${idx}10`,
        HostName: 'Admin LPK Alpha Beta',
        InstructorName: course.InstructorName || 'Roni Nuroni, S.T., MCE',
        TrainerName: 'Ine Yuniar Suryadi, S.Pd.',
        Date: '2026-01-25',
        StartTime: '13:00',
        EndTime: '15:30',
        DurationMinutes: 150,
        Status: 'Selesai'
      }
    );
  });

  // Total 200 participants:
  // 0 - 79   : SEDANG PROSES (80)
  // 80 - 139 : LULUS BELUM BAYAR (60)
  // 140 - 179: SUDAH BAYAR (40)
  // 180 - 199: SERTIFIKAT AKTIF (20)

  for (let i = 1; i <= 200; i++) {
    const isFemale = i % 2 === 0;
    const fNames = isFemale ? FIRST_NAMES_FEMALE : FIRST_NAMES_MALE;
    const firstName = fNames[(i * 7) % fNames.length];
    const lastName = LAST_NAMES[(i * 13) % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const numPad = String(i).padStart(4, '0');
    const userId = `AB-USER-${numPad}`;
    const userNIK = `320102${String(1500000000 + i * 3829)}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@peserta.belajar.id`;
    const phone = `62812${String(10000000 + i * 4921)}`;
    const cityObj = CITIES[i % CITIES.length];
    const institution = INSTITUTIONS[i % INSTITUTIONS.length];
    const occupation = OCCUPATIONS[i % OCCUPATIONS.length];
    const avatar = isFemale ? AVATARS_FEMALE[i % AVATARS_FEMALE.length] : AVATARS_MALE[i % AVATARS_MALE.length];

    // Status Category Determination
    let categoryGroup: 'SEDANG_PROSES' | 'LULUS_BELUM_BAYAR' | 'SUDAH_BAYAR' | 'SERTIFIKAT_AKTIF';
    if (i <= 80) {
      categoryGroup = 'SEDANG_PROSES';
    } else if (i <= 140) {
      categoryGroup = 'LULUS_BELUM_BAYAR';
    } else if (i <= 180) {
      categoryGroup = 'SUDAH_BAYAR';
    } else {
      categoryGroup = 'SERTIFIKAT_AKTIF';
    }

    // Reg date between 2026-01-01 and 2026-01-20
    const regDay = String(1 + (i % 20)).padStart(2, '0');
    const createdAt = `2026-01-${regDay}T08:00:00Z`;

    const userRecord: User = {
      UserID: userId,
      Name: fullName,
      Email: email,
      Role: 'PESERTA',
      Phone: phone,
      PhotoURL: avatar,
      Status: 'Aktif',
      VerificationStatus: 'VERIFIED',
      NIK: userNIK,
      Gender: isFemale ? 'Perempuan' : 'Laki-laki',
      BirthPlace: cityObj.city.replace('Kab. ', '').replace('Kota ', ''),
      BirthDate: `2001-0${(i % 9) + 1}-${String(10 + (i % 18)).padStart(2, '0')}`,
      Address: `Jl. Raya Merdeka No. ${i}, ${cityObj.city}`,
      Education: i % 3 === 0 ? 'D3/S1' : 'SMA/SMK',
      Occupation: occupation,
      Bio: `Peserta aktif program pelatihan LPK Alpha Beta - ${institution}`,
      CreatedAt: createdAt,
      LastLogin: `2026-02-10T10:${String(i % 50).padStart(2, '0')}:00Z`,
      XP: categoryGroup === 'SERTIFIKAT_AKTIF' ? 1200 : categoryGroup === 'SUDAH_BAYAR' ? 1100 : categoryGroup === 'LULUS_BELUM_BAYAR' ? 1000 : 350 + (i * 5),
      Level: categoryGroup === 'SEDANG_PROSES' ? 1 : 3
    };
    users.push(userRecord);

    // Enroll in primary course
    const primaryCourse = DUMMY_COURSES[(i - 1) % DUMMY_COURSES.length];
    const courseId = primaryCourse.CourseID;
    const courseCode = courseId.includes('AI') ? 'AI' : courseId.includes('LD') ? 'LD' : courseId.includes('DG') ? 'DG' : courseId.includes('UI') ? 'UI' : courseId.includes('MM') ? 'MM' : courseId.includes('DM') ? 'DM' : courseId.includes('VE') ? 'VE' : courseId.includes('FT') ? 'FT' : courseId.includes('AIG') ? 'AIG' : 'TPD';

    // Enrollment values based on group
    let progress = 0;
    let enrollmentStatus: 'Active' | 'Completed' = 'Active';
    let finalScore = 0;

    if (categoryGroup === 'SEDANG_PROSES') {
      progress = 10 + ((i * 7) % 78); // 10% to 88%
      enrollmentStatus = 'Active';
      finalScore = Math.min(85, 50 + Math.floor(progress * 0.4));
    } else {
      progress = 100;
      enrollmentStatus = 'Completed';
      finalScore = 80 + (i % 20); // 80 - 99 (Lulus)
    }

    enrollments.push({
      EnrollmentID: `ENR-${numPad}`,
      UserID: userId,
      CourseID: courseId,
      EnrollmentDate: createdAt,
      Status: enrollmentStatus,
      PaymentStatus: categoryGroup === 'SEDANG_PROSES' || categoryGroup === 'LULUS_BELUM_BAYAR' ? 'Pending' : 'Paid',
      Progress: progress,
      FinalScore: finalScore,
      CompletedAt: progress === 100 ? '2026-02-01T15:00:00Z' : undefined
    });

    // Generate Timeline Learning History Events for this Participant
    const ip = `180.244.${(i * 3) % 250}.${(i * 7) % 250}`;
    const device = i % 2 === 0 ? 'Windows Chrome Browser' : 'Android Mobile App';

    learningHistories.push({
      ID: `LH-${numPad}-01`,
      ParticipantID: userId,
      CourseID: courseId,
      ActivityType: 'LOGIN',
      ActivityName: 'Peserta melakukan Login ke Platform LMS Alpha Beta',
      Status: 'SUKSES',
      Progress: 0,
      StartedAt: `2026-01-${regDay}T08:15:00Z`,
      Duration: '2 menit',
      Device: device,
      IPDummy: ip,
      Notes: 'Akses awal registrasi peserta'
    });

    learningHistories.push({
      ID: `LH-${numPad}-02`,
      ParticipantID: userId,
      CourseID: courseId,
      ActivityType: 'OPEN_COURSE',
      ActivityName: `Peserta Membuka Halaman Pelatihan: ${primaryCourse.Title}`,
      Status: 'SUKSES',
      Progress: 5,
      StartedAt: `2026-01-${regDay}T08:20:00Z`,
      Duration: '10 menit',
      Device: device,
      IPDummy: ip,
      Notes: 'Melihat silabus dan pengenalan materi'
    });

    learningHistories.push({
      ID: `LH-${numPad}-03`,
      ParticipantID: userId,
      CourseID: courseId,
      ModuleID: `MOD-${courseId}-01`,
      ActivityType: 'READ_MATERIAL',
      ActivityName: 'Membaca Modul 1: Orientasi & Pengenalan Dasar',
      Status: 'SELESAI',
      Progress: 20,
      StartedAt: `2026-01-${regDay}T09:00:00Z`,
      CompletedAt: `2026-01-${regDay}T09:45:00Z`,
      Duration: '45 menit',
      Device: device,
      IPDummy: ip
    });

    // Attendance at Webinar 1
    const meet1 = liveSessions.find(s => s.CourseID === courseId && s.Platform === 'GOOGLE_MEET');
    if (meet1) {
      const late = i % 7 === 0 ? 15 : 0;
      meetingAttendances.push({
        AttendanceID: `ATT-${numPad}-01`,
        ParticipantID: userId,
        ParticipantName: fullName,
        SessionID: meet1.SessionID,
        JoinTime: late > 0 ? '09:15' : '09:00',
        LeaveTime: '11:30',
        DurationMinutes: 150 - late,
        AttendanceStatus: late > 0 ? 'TERLAMBAT' : 'HADIR',
        LateMinutes: late,
        Device: device,
        ParticipationScore: 90,
        RecordingViewed: false
      });

      learningHistories.push({
        ID: `LH-${numPad}-04`,
        ParticipantID: userId,
        CourseID: courseId,
        ActivityType: 'ATTEND_MEETING',
        ActivityName: `Mengikuti Google Meet: ${meet1.Title}`,
        Status: late > 0 ? 'TERLAMBAT' : 'HADIR',
        Progress: Math.min(progress, 35),
        StartedAt: '2026-01-15T09:00:00Z',
        CompletedAt: '2026-01-15T11:30:00Z',
        Duration: `${150 - late} menit`,
        Device: device,
        Notes: late > 0 ? 'Terlambat 15 menit karena kendala jaringan' : 'Hadir penuh aktif'
      });

      // Meeting Interaction
      meetingInteractions.push({
        InteractionID: `INT-${numPad}-01`,
        ParticipantID: userId,
        ParticipantName: fullName,
        SessionID: meet1.SessionID,
        Timestamp: '2026-01-15T10:15:00Z',
        ActionType: 'Bertanya',
        Details: 'Menanyakan penerapan modul 2 pada studi kasus lapangan'
      });
    }

    // Assignment Submissions & Revisions
    const asg = assignments.find(a => a.CourseID === courseId);
    if (asg) {
      if (categoryGroup === 'SEDANG_PROSES' && progress < 40) {
        // Belum / Sedang Dikerjakan
        submissions.push({
          SubmissionID: `SUB-${numPad}`,
          AssignmentID: asg.AssignmentID,
          UserID: userId,
          UserName: fullName,
          CourseID: courseId,
          Content: 'Sedang dalam proses pengerjaan draft tugas.',
          SubmittedAt: '2026-01-20T10:00:00Z',
          Status: 'Belum Dikerjakan'
        });
      } else {
        // Submitted & Graded with Revision History simulation
        const isRevised = i % 4 === 0;
        const initialScore = isRevised ? 68 : finalScore;

        submissions.push({
          SubmissionID: `SUB-${numPad}`,
          AssignmentID: asg.AssignmentID,
          UserID: userId,
          UserName: fullName,
          CourseID: courseId,
          Content: `Berikut pengumpulan hasil praktik dan tugas ${primaryCourse.Title} oleh ${fullName}.\nFormat PDF & Dokumentasi lengkap terlampir.`,
          FileURL: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
          SubmittedAt: '2026-01-22T14:00:00Z',
          Score: finalScore,
          Feedback: isRevised
            ? 'Revisi diterima dengan sangat baik. Catatan tata letak dan sintaks telah diperbaiki sempurna. Nilai diperbarui dari 68 ke ' + finalScore
            : 'Tugas sangat lengkap, terstruktur, dan sesuai petunjuk instruktur. Selamat!',
          Status: 'Lulus'
        });

        if (isRevised) {
          assessmentHistories.push({
            HistoryID: `AH-${numPad}-01`,
            ParticipantID: userId,
            CourseID: courseId,
            ItemTitle: asg.Title,
            ScoreBefore: 68,
            ScoreAfter: finalScore,
            EvaluatorName: primaryCourse.InstructorName || 'Roni Nuroni, S.T., MCE',
            Feedback: 'Perbaikan tugas modul 3 telah disetujui. Nilai naik dari 68 menjadi ' + finalScore,
            Timestamp: '2026-01-26T11:00:00Z'
          });
        }

        learningHistories.push({
          ID: `LH-${numPad}-05`,
          ParticipantID: userId,
          CourseID: courseId,
          ActivityType: 'SUBMIT_ASSIGNMENT',
          ActivityName: `Mengumpulkan Tugas: ${asg.Title}`,
          Status: 'DIKUMPULKAN',
          Progress: Math.min(progress, 75),
          StartedAt: '2026-01-22T14:00:00Z',
          Device: device,
          IPDummy: ip
        });

        learningHistories.push({
          ID: `LH-${numPad}-06`,
          ParticipantID: userId,
          CourseID: courseId,
          ActivityType: 'RECEIVE_FEEDBACK',
          ActivityName: `Menerima Feedback Instruktur Nilai ${finalScore}`,
          Status: 'LULUS',
          Progress: Math.min(progress, 85),
          StartedAt: '2026-01-24T10:00:00Z',
          Notes: `Feedback dari ${primaryCourse.InstructorName}`
        });
      }
    }

    // Communication Message with Instructor
    messages.push({
      MessageID: `MSG-${numPad}-01`,
      SenderID: userId,
      SenderName: fullName,
      SenderRole: 'PESERTA',
      ReceiverID: primaryCourse.InstructorID,
      ReceiverName: primaryCourse.InstructorName || 'Instruktur',
      CourseID: courseId,
      Subject: 'Pertanyaan Materi Modul & Tugas Praktik',
      Message: `Halo Pak/Bu ${primaryCourse.InstructorName}, saya ${fullName} ingin mengonfirmasi petunjuk pengerjaan tugas modul 3. Apakah file hasil akhir boleh dikirim dalam format PDF terkompresi? Terima kasih.`,
      Timestamp: '2026-01-20T11:30:00Z',
      ReadStatus: true,
      MessageType: 'Pertanyaan Tugas'
    });

    messages.push({
      MessageID: `MSG-${numPad}-02`,
      SenderID: primaryCourse.InstructorID,
      SenderName: primaryCourse.InstructorName || 'Instruktur',
      SenderRole: 'INSTRUKTUR',
      ReceiverID: userId,
      ReceiverName: fullName,
      CourseID: courseId,
      Subject: 'Re: Pertanyaan Materi Modul & Tugas Praktik',
      Message: `Halo ${firstName}, tentu saja boleh. Silakan kumpulkan file PDF dan pastikan tulisan serta grafik terlampir dapat terbaca dengan jelas. Semangat belajar!`,
      Timestamp: '2026-01-20T12:00:00Z',
      ReadStatus: true,
      ReplyToMessageID: `MSG-${numPad}-01`,
      MessageType: 'Feedback'
    });

    // Forum Discussion
    if (i % 3 === 0) {
      const postId = `PST-${numPad}`;
      forumPosts.push({
        PostID: postId,
        CourseID: courseId,
        UserID: userId,
        UserName: fullName,
        UserPhoto: avatar,
        UserRole: 'PESERTA',
        Title: `Diskusi Studi Kasus Modul 2 - ${primaryCourse.Title}`,
        Content: `Bagaimana rekan-rekan menyelesaikan kendala pada bagian simulasi praktikum modul 2? Apakah ada kiat khusus?`,
        CreatedAt: '2026-01-18T14:20:00Z',
        CommentsCount: 2
      });

      forumComments.push({
        CommentID: `CMT-${numPad}-01`,
        PostID: postId,
        UserID: primaryCourse.InstructorID,
        UserName: primaryCourse.InstructorName || 'Roni Nuroni, S.T., MCE',
        UserPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        UserRole: 'INSTRUKTUR',
        Content: `Pastikan ikuti langkah di PDF modul halaman 14. Jika masih terkendala, bisa coba refresh browser atau gunakan tab Incognito.`,
        IsBestAnswer: true,
        CreatedAt: '2026-01-18T15:00:00Z'
      });
    }

    // Complete Course & Graduation for Categories 2, 3, 4
    if (categoryGroup !== 'SEDANG_PROSES') {
      learningHistories.push({
        ID: `LH-${numPad}-07`,
        ParticipantID: userId,
        CourseID: courseId,
        ActivityType: 'COMPLETE_COURSE',
        ActivityName: `Peserta Menyelesaikan Seluruh Evaluasi & Dinyatakan LULUS (Nilai: ${finalScore})`,
        Status: 'LULUS',
        Progress: 100,
        StartedAt: '2026-02-01T15:00:00Z',
        CompletedAt: '2026-02-01T15:05:00Z',
        Duration: '5 menit',
        Device: device,
        IPDummy: ip,
        Notes: 'Sistem membuat draft sertifikat otomatis'
      });

      const certNo = `CERT/2026/${courseCode}/${numPad}`;

      // Status determination for Certificate & Payment
      let certStatus: any = 'MENUNGGU_PEMBAYARAN';
      let payStatus: any = 'UNPAID';
      let rejectionReason = undefined;
      let paymentProofObj = undefined;

      if (categoryGroup === 'LULUS_BELUM_BAYAR') {
        certStatus = 'MENUNGGU_PEMBAYARAN';
        payStatus = 'UNPAID';
      } else if (categoryGroup === 'SUDAH_BAYAR') {
        if (i % 8 === 0) {
          // Simulation of Rejected Payment
          certStatus = 'DITOLAK';
          payStatus = 'CANCELLED';
          rejectionReason = 'Bukti transfer tidak terbaca / nominal kurang dari Rp 50.000. Silakan unggah konfirmasi ulang.';
          paymentProofObj = {
            ConfirmationID: `PAY-CONF-${numPad}`,
            PayerName: fullName,
            CourseTitle: primaryCourse.Title,
            Amount: 30000,
            TransferDate: '2026-02-05',
            BankName: 'BCA',
            ProofURL: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
            Note: 'Transfer sebagian via M-Banking',
            SubmittedAt: '2026-02-05T09:00:00Z'
          };
        } else if (i % 4 === 0) {
          // Approved
          certStatus = 'DISETUJUI';
          payStatus = 'PAID';
          paymentProofObj = {
            ConfirmationID: `PAY-CONF-${numPad}`,
            PayerName: fullName,
            CourseTitle: primaryCourse.Title,
            Amount: 50000,
            TransferDate: '2026-02-04',
            BankName: 'Bank Mandiri',
            ProofURL: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
            Note: 'Konfirmasi cetak via Mandiri Live',
            SubmittedAt: '2026-02-04T11:00:00Z'
          };
        } else {
          // Waiting Verification
          certStatus = 'MENUNGGU_VERIFIKASI';
          payStatus = 'WAITING_CONFIRMATION';
          paymentProofObj = {
            ConfirmationID: `PAY-CONF-${numPad}`,
            PayerName: fullName,
            CourseTitle: primaryCourse.Title,
            Amount: 50000,
            TransferDate: '2026-02-08',
            BankName: 'Bank Mandiri',
            ProofURL: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
            Note: 'Pembayaran biaya sertifikat resmi',
            SubmittedAt: '2026-02-08T14:30:00Z'
          };
        }
      } else if (categoryGroup === 'SERTIFIKAT_AKTIF') {
        certStatus = 'AKTIF';
        payStatus = 'PAID';
        paymentProofObj = {
          ConfirmationID: `PAY-CONF-${numPad}`,
          PayerName: fullName,
          CourseTitle: primaryCourse.Title,
          Amount: 50000,
          TransferDate: '2026-02-02',
          BankName: 'Bank Mandiri',
          ProofURL: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
          Note: 'Lunas via Mandiri Transfer',
          SubmittedAt: '2026-02-02T08:00:00Z'
        };
      }

      certificates.push({
        CertificateID: certNo,
        CertificateNumber: certNo,
        UserID: userId,
        UserName: fullName,
        UserNIK: userNIK,
        CourseID: courseId,
        CourseTitle: primaryCourse.Title,
        TrainingPeriod: '10 Januari 2026 - 01 Februari 2026',
        FinalScore: finalScore,
        GradePredikat: finalScore >= 90 ? 'Sangat Memuaskan' : finalScore >= 80 ? 'Memuaskan' : 'Baik',
        IssueDate: '2026-02-02',
        GraduationDate: '2026-02-01',
        InstructorName: primaryCourse.InstructorName || 'Roni Nuroni, S.T., MCE',
        DirectorName: 'Ruli Lesmana, S.T., Gr.',
        OrganizationName: 'LPK ALPHA BETA LEARNING CENTER (NISN: K9980820, VIN: 20002320503)',
        Status: certStatus,
        PaymentConfirmation: paymentProofObj,
        RejectionReason: rejectionReason,
        QRCodeData: `${certNo}|${fullName}|${primaryCourse.Title}|Score:${finalScore}`,
        VerifyURL: `/verify?cert=${certNo}`,
        CreatedAt: '2026-02-01T15:05:00Z',
        UpdatedAt: '2026-02-02T10:00:00Z'
      });

      payments.push({
        PaymentID: `PAY-${numPad}`,
        UserID: userId,
        UserName: fullName,
        CourseID: courseId,
        CourseTitle: primaryCourse.Title,
        CertificateID: certNo,
        Amount: 50000,
        Status: payStatus,
        PaymentDate: '2026-02-02T08:00:00Z',
        Note: paymentProofObj?.Note || 'Cetak Sertifikat Kelulusan Resmi',
        ProofURL: paymentProofObj?.ProofURL
      });

      if (certStatus === 'AKTIF') {
        activityLogs.push({
          LogID: `ACT-${numPad}-01`,
          UserID: 'ADM-001',
          UserName: 'Admin Utama LPK',
          Role: 'ADMIN',
          Action: `Approve Pembayaran & Terbitkan Sertifikat #${certNo} untuk ${fullName}`,
          TargetParticipantID: userId,
          DataChanged: 'Status Sertifikat',
          ValueBefore: 'MENUNGGU_VERIFIKASI',
          ValueAfter: 'AKTIF',
          Timestamp: '2026-02-02T10:30:00Z',
          IPAddress: '127.0.0.1',
          Device: 'Admin Desktop Workspace'
        });

        learningHistories.push({
          ID: `LH-${numPad}-08`,
          ParticipantID: userId,
          CourseID: courseId,
          ActivityType: 'DOWNLOAD_MATERIAL',
          ActivityName: `Peserta Mengunduh / Mencetak Sertifikat Resmi #${certNo}`,
          Status: 'SUKSES',
          Progress: 100,
          StartedAt: '2026-02-02T11:00:00Z',
          Device: device,
          IPDummy: ip
        });
      }
    }

    // Add Notifications
    notifications.push({
      NotificationID: `NOTIF-${numPad}-01`,
      UserID: userId,
      Type: categoryGroup === 'SERTIFIKAT_AKTIF' ? 'Sertifikat' : categoryGroup === 'LULUS_BELUM_BAYAR' ? 'Lulus' : 'Materi Baru',
      Title: categoryGroup === 'SERTIFIKAT_AKTIF' ? 'Sertifikat Resmi Diterbitkan' : 'Pengumuman Status Pembelajaran',
      Message: categoryGroup === 'SERTIFIKAT_AKTIF'
        ? `Selamat ${fullName}! Sertifikat Anda #${userId} telah terbit dan dapat diunduh/dicetak.`
        : `Halo ${fullName}, selamat mengikuti modul ${primaryCourse.Title}. Tetap semangat!`,
      Timestamp: '2026-02-02T12:00:00Z',
      IsRead: true,
      ReadAt: '2026-02-02T12:05:00Z'
    });
  }

  return {
    users,
    courses: DUMMY_COURSES,
    enrollments,
    learningHistories,
    assignments,
    submissions,
    assessmentHistories,
    liveSessions,
    meetingAttendances,
    recordingViews,
    meetingInteractions,
    messages,
    forumPosts,
    forumComments,
    payments,
    certificates,
    notifications,
    activityLogs
  };
}
