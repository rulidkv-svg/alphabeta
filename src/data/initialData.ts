import {
  User,
  Course,
  Category,
  Enrollment,
  Module,
  Quiz,
  Exam,
  Certificate,
  Badge,
  UserBadge,
  ForumPost,
  ForumComment,
  AppSettings,
  Progress,
  Assignment,
  AssignmentSubmission,
  ExamAttempt,
  Payment,
  OfficialPersonnel
} from '../types';
import { COMPREHENSIVE_COURSES } from './coursesData';
import { getAllCurriculumData } from './curriculumData';

export const INITIAL_SETTINGS: AppSettings = {
  LPKName: 'LPK Alpha Beta',
  UnitKerja: 'LKP Alpha Beta',
  Tagline: 'Belajar • Berlatih • Bersertifikat • Siap Kerja',
  LogoURL: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
  KemnakerLogoURL: '',
  KemdikdasmenLogoURL: '',
  Email: 'admin@alphabeta.edu.eu.org',
  SecondaryEmail: 'roeli.eunih.sjy@gmail.com',
  PhoneWhatsApp: '081223546686',
  AdminWhatsApp: '081223546686',
  PrintCertificateFee: 50000,
  Address: 'Kp. Sukawangi RT. 01 RW. 01 Desa Sukawangi Kec. Singajaya Kab. Garut, Prov. Jawa Barat Kode Pos: 44173',
  PassingGradeDefault: 80,
  DirectorName: 'Ruli Lesmana, S.T., Gr.',
  DirectorTitle: 'Direktur Alpha Beta',
  NISN: 'K9980820',
  VIN: '20002320503',
  SocialInstagram: '@lpkalphabeta',
  SocialFacebook: 'LPK Alpha Beta',
  WebsiteURL: 'alphabeta.edu.eu.org',
  SecondaryWebsite: 'www.alphabeta.edu.eu.org',
  GasWebAppUrl: 'https://script.google.com/macros/s/AKfycbw2Qdx-p4RSEcbLPwbL8Zz2eUMMF085EexCyom1j1rvZa37bbX7q-dLXO53TTVmQy4E/exec',
  GoogleSheetUrl: 'https://docs.google.com/spreadsheets/d/1DcM2Sn579APizeP5dfOIBchOKQgvjYPhVBrgkeUJk2w/edit?usp=sharing',
  SpreadsheetId: '1DcM2Sn579APizeP5dfOIBchOKQgvjYPhVBrgkeUJk2w',
  StaffList: [
    'Roni Nuroni, S.T., MCE',
    'Ridwan Abdul Aziz, S.T.',
    'Syifa Rahmawati, S.T.',
    'Ine Yuniar Suryadi, S.Pd.',
    'Vita Situ Zulaikha, S.Pd., M.Pd.',
    'Budi Iskandar, S.Si., M.Pd.',
    'Wina Mulyani, S.Pd.',
    'Hanifah Saadah, S.Pd., S.Kom.',
    'Ruli Lesmana, S.T., Gr.'
  ]
};

// SEED DATA FOR 30 GRADUATED PARTICIPANTS & 30 ACTIVE PARTICIPANTS
const GRADUATED_SEED_DATA = [
  { name: 'Ahmad Fauzi', email: 'ahmad.fauzi@gmail.com', phone: '081234560101', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-TK01', courseTitle: 'Teknisi Komputer & Perakitan PC Profesional', instructor: 'Roni Nuroni, S.T., MCE', score: 92 },
  { name: 'Siti Rahmawati', email: 'siti.rahma@gmail.com', phone: '081234560102', gender: 'Perempuan', edu: 'SMA/SMK', courseId: 'CRS-MO03', courseTitle: 'Mastering Microsoft Office untuk Dunia Kerja', instructor: 'Ine Yuniar Suryadi, S.Pd.', score: 95 },
  { name: 'Rizky Pratama', email: 'rizky.pratama@gmail.com', phone: '081234560103', gender: 'Laki-laki', edu: 'D3', courseId: 'CRS-JK02', courseTitle: 'Administrator Jaringan Komputer & Mikrotik Lab', instructor: 'Ridwan Abdul Aziz, S.T.', score: 88 },
  { name: 'Dewi Lestari', email: 'dewi.lestari@gmail.com', phone: '081234560104', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-DG04', courseTitle: 'Desain Grafis & Visual Branding Kreatif', instructor: 'Vita Situ Zulaikha, S.Pd., M.Pd.', score: 90 },
  { name: 'Hendra Wijaya', email: 'hendra.w@gmail.com', phone: '081234560105', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-TK01', courseTitle: 'Teknisi Komputer & Perakitan PC Profesional', instructor: 'Roni Nuroni, S.T., MCE', score: 86 },
  { name: 'Nur Hidayah', email: 'nur.hidayah@gmail.com', phone: '081234560106', gender: 'Perempuan', edu: 'D3', courseId: 'CRS-MO03', courseTitle: 'Mastering Microsoft Office untuk Dunia Kerja', instructor: 'Ine Yuniar Suryadi, S.Pd.', score: 94 },
  { name: 'Muhammad Arifin', email: 'm.arifin@gmail.com', phone: '081234560107', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-JK02', courseTitle: 'Administrator Jaringan Komputer & Mikrotik Lab', instructor: 'Ridwan Abdul Aziz, S.T.', score: 91 },
  { name: 'Indah Permata', email: 'indah.p@gmail.com', phone: '081234560108', gender: 'Perempuan', edu: 'SMA/SMK', courseId: 'CRS-DG04', courseTitle: 'Desain Grafis & Visual Branding Kreatif', instructor: 'Vita Situ Zulaikha, S.Pd., M.Pd.', score: 89 },
  { name: 'Agus Setiawan', email: 'agus.setiawan@gmail.com', phone: '081234560109', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-TK01', courseTitle: 'Teknisi Komputer & Perakitan PC Profesional', instructor: 'Roni Nuroni, S.T., MCE', score: 93 },
  { name: 'Rina Fitriani', email: 'rina.fitriani@gmail.com', phone: '081234560110', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-MO03', courseTitle: 'Mastering Microsoft Office untuk Dunia Kerja', instructor: 'Ine Yuniar Suryadi, S.Pd.', score: 96 },
  { name: 'Eko Prasetyo', email: 'eko.prasetyo@gmail.com', phone: '081234560111', gender: 'Laki-laki', edu: 'D3', courseId: 'CRS-JK02', courseTitle: 'Administrator Jaringan Komputer & Mikrotik Lab', instructor: 'Ridwan Abdul Aziz, S.T.', score: 87 },
  { name: 'Dian Sastrowardoyo', email: 'dian.sastro@gmail.com', phone: '081234560112', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-DG04', courseTitle: 'Desain Grafis & Visual Branding Kreatif', instructor: 'Vita Situ Zulaikha, S.Pd., M.Pd.', score: 92 },
  { name: 'Bambang Pamungkas', email: 'bambang.p@gmail.com', phone: '081234560113', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-TK01', courseTitle: 'Teknisi Komputer & Perakitan PC Profesional', instructor: 'Roni Nuroni, S.T., MCE', score: 85 },
  { name: 'Tri Wahyuni', email: 'tri.wahyuni@gmail.com', phone: '081234560114', gender: 'Perempuan', edu: 'D3', courseId: 'CRS-MO03', courseTitle: 'Mastering Microsoft Office untuk Dunia Kerja', instructor: 'Ine Yuniar Suryadi, S.Pd.', score: 93 },
  { name: 'Dedi Kurniawan', email: 'dedi.kurniawan@gmail.com', phone: '081234560115', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-JK02', courseTitle: 'Administrator Jaringan Komputer & Mikrotik Lab', instructor: 'Ridwan Abdul Aziz, S.T.', score: 89 },
  { name: 'Sri Mulyani', email: 'sri.mulyani@gmail.com', phone: '081234560116', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-DG04', courseTitle: 'Desain Grafis & Visual Branding Kreatif', instructor: 'Vita Situ Zulaikha, S.Pd., M.Pd.', score: 94 },
  { name: 'Arif Budiman', email: 'arif.budiman@gmail.com', phone: '081234560117', gender: 'Laki-laki', edu: 'D3', courseId: 'CRS-TK01', courseTitle: 'Teknisi Komputer & Perakitan PC Profesional', instructor: 'Roni Nuroni, S.T., MCE', score: 88 },
  { name: 'Yulia Kartika', email: 'yulia.kartika@gmail.com', phone: '081234560118', gender: 'Perempuan', edu: 'SMA/SMK', courseId: 'CRS-MO03', courseTitle: 'Mastering Microsoft Office untuk Dunia Kerja', instructor: 'Ine Yuniar Suryadi, S.Pd.', score: 91 },
  { name: 'Joko Widodo', email: 'joko.widodo@gmail.com', phone: '081234560119', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-JK02', courseTitle: 'Administrator Jaringan Komputer & Mikrotik Lab', instructor: 'Ridwan Abdul Aziz, S.T.', score: 90 },
  { name: 'Megawati Soekarno', email: 'megawati.s@gmail.com', phone: '081234560120', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-DG04', courseTitle: 'Desain Grafis & Visual Branding Kreatif', instructor: 'Vita Situ Zulaikha, S.Pd., M.Pd.', score: 87 },
  { name: 'Surya Paloh', email: 'surya.paloh@gmail.com', phone: '081234560121', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-TK01', courseTitle: 'Teknisi Komputer & Perakitan PC Profesional', instructor: 'Roni Nuroni, S.T., MCE', score: 92 },
  { name: 'Khofifah Indar', email: 'khofifah.i@gmail.com', phone: '081234560122', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-MO03', courseTitle: 'Mastering Microsoft Office untuk Dunia Kerja', instructor: 'Ine Yuniar Suryadi, S.Pd.', score: 95 },
  { name: 'Ganjar Pranowo', email: 'ganjar.p@gmail.com', phone: '081234560123', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-JK02', courseTitle: 'Administrator Jaringan Komputer & Mikrotik Lab', instructor: 'Ridwan Abdul Aziz, S.T.', score: 86 },
  { name: 'Anies Baswedan', email: 'anies.b@gmail.com', phone: '081234560124', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-DG04', courseTitle: 'Desain Grafis & Visual Branding Kreatif', instructor: 'Vita Situ Zulaikha, S.Pd., M.Pd.', score: 93 },
  { name: 'Prabowo Subianto', email: 'prabowo.s@gmail.com', phone: '081234560125', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-TK01', courseTitle: 'Teknisi Komputer & Perakitan PC Profesional', instructor: 'Roni Nuroni, S.T., MCE', score: 90 },
  { name: 'Sandiaga Uno', email: 'sandiaga.u@gmail.com', phone: '081234560126', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-MO03', courseTitle: 'Mastering Microsoft Office untuk Dunia Kerja', instructor: 'Ine Yuniar Suryadi, S.Pd.', score: 97 },
  { name: 'Ridwan Kamil', email: 'ridwan.kamil@gmail.com', phone: '081234560127', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-JK02', courseTitle: 'Administrator Jaringan Komputer & Mikrotik Lab', instructor: 'Ridwan Abdul Aziz, S.T.', score: 94 },
  { name: 'Erick Thohir', email: 'erick.thohir@gmail.com', phone: '081234560128', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-DG04', courseTitle: 'Desain Grafis & Visual Branding Kreatif', instructor: 'Vita Situ Zulaikha, S.Pd., M.Pd.', score: 91 },
  { name: 'Agus Harimurti', email: 'agus.harimurti@gmail.com', phone: '081234560129', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-TK01', courseTitle: 'Teknisi Komputer & Perakitan PC Profesional', instructor: 'Roni Nuroni, S.T., MCE', score: 89 },
  { name: 'Puan Maharani', email: 'puan.maharani@gmail.com', phone: '081234560130', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-MO03', courseTitle: 'Mastering Microsoft Office untuk Dunia Kerja', instructor: 'Ine Yuniar Suryadi, S.Pd.', score: 88 }
];

const ACTIVE_SEED_DATA = [
  { name: 'Bayu Anggoro', email: 'bayu.anggoro@gmail.com', phone: '081234560201', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-TK01', progress: 65 },
  { name: 'Maya Srikandi', email: 'maya.srikandi@gmail.com', phone: '081234560202', gender: 'Perempuan', edu: 'D3', courseId: 'CRS-JK02', progress: 45 },
  { name: 'Fajar Ramadhan', email: 'fajar.ramadhan@gmail.com', phone: '081234560203', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-MO03', progress: 70 },
  { name: 'Putri Ayu', email: 'putri.ayu@gmail.com', phone: '081234560204', gender: 'Perempuan', edu: 'SMA/SMK', courseId: 'CRS-DG04', progress: 35 },
  { name: 'Gilang Permana', email: 'gilang.p@gmail.com', phone: '081234560205', gender: 'Laki-laki', edu: 'D3', courseId: 'CRS-TK01', progress: 80 },
  { name: 'Nabila Putri', email: 'nabila.putri@gmail.com', phone: '081234560206', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-JK02', progress: 50 },
  { name: 'Aditya Pratama', email: 'aditya.p@gmail.com', phone: '081234560207', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-MO03', progress: 60 },
  { name: 'Tari Wulandari', email: 'tari.w@gmail.com', phone: '081234560208', gender: 'Perempuan', edu: 'D3', courseId: 'CRS-DG04', progress: 25 },
  { name: 'Rizky Febrian', email: 'rizky.febrian@gmail.com', phone: '081234560209', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-TK01', progress: 75 },
  { name: 'Amanda Manopo', email: 'amanda.m@gmail.com', phone: '081234560210', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-JK02', progress: 40 },
  { name: 'Arya Saloka', email: 'arya.saloka@gmail.com', phone: '081234560211', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-MO03', progress: 55 },
  { name: 'Prilly Latuconsina', email: 'prilly.l@gmail.com', phone: '081234560212', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-DG04', progress: 30 },
  { name: 'Raffi Ahmad', email: 'raffi.ahmad@gmail.com', phone: '081234560213', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-TK01', progress: 85 },
  { name: 'Nagita Slavina', email: 'nagita.s@gmail.com', phone: '081234560214', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-JK02', progress: 60 },
  { name: 'Atta Halilintar', email: 'atta.h@gmail.com', phone: '081234560215', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-MO03', progress: 20 },
  { name: 'Aurel Hermansyah', email: 'aurel.h@gmail.com', phone: '081234560216', gender: 'Perempuan', edu: 'SMA/SMK', courseId: 'CRS-DG04', progress: 50 },
  { name: 'Baim Wong', email: 'baim.wong@gmail.com', phone: '081234560217', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-TK01', progress: 45 },
  { name: 'Paula Verhoeven', email: 'paula.v@gmail.com', phone: '081234560218', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-JK02', progress: 70 },
  { name: 'Deddy Corbuzier', email: 'deddy.c@gmail.com', phone: '081234560219', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-MO03', progress: 35 },
  { name: 'Sabrina Chairunnisa', email: 'sabrina.c@gmail.com', phone: '081234560220', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-DG04', progress: 80 },
  { name: 'Raditya Dika', email: 'raditya.dika@gmail.com', phone: '081234560221', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-TK01', progress: 50 },
  { name: 'Anissa Aziza', email: 'anissa.aziza@gmail.com', phone: '081234560222', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-JK02', progress: 30 },
  { name: 'Sule Sutisna', email: 'sule.s@gmail.com', phone: '081234560223', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-MO03', progress: 65 },
  { name: 'Nathalie Holscher', email: 'nathalie.h@gmail.com', phone: '081234560224', gender: 'Perempuan', edu: 'SMA/SMK', courseId: 'CRS-DG04', progress: 40 },
  { name: 'Andre Taulany', email: 'andre.taulany@gmail.com', phone: '081234560225', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-TK01', progress: 75 },
  { name: 'Kiky Saputri', email: 'kiky.saputri@gmail.com', phone: '081234560226', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-JK02', progress: 55 },
  { name: 'Denny Cagur', email: 'denny.cagur@gmail.com', phone: '081234560227', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-MO03', progress: 45 },
  { name: 'Ruben Onsu', email: 'ruben.onsu@gmail.com', phone: '081234560228', gender: 'Laki-laki', edu: 'SMA/SMK', courseId: 'CRS-DG04', progress: 60 },
  { name: 'Sarwendah Tan', email: 'sarwendah@gmail.com', phone: '081234560229', gender: 'Perempuan', edu: 'S1/S2/S3', courseId: 'CRS-TK01', progress: 35 },
  { name: 'Ivan Gunawan', email: 'ivan.gunawan@gmail.com', phone: '081234560230', gender: 'Laki-laki', edu: 'S1/S2/S3', courseId: 'CRS-JK02', progress: 70 }
];

const generatedGraduatedUsers: User[] = GRADUATED_SEED_DATA.map((item, index) => {
  const numStr = String(101 + index).padStart(6, '0');
  const userId = `AB-USER-${numStr}`;
  return {
    UserID: userId,
    Name: item.name,
    Email: item.email,
    Role: 'PESERTA',
    Phone: item.phone,
    PhotoURL: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
    Status: 'Aktif',
    VerificationStatus: 'VERIFIED',
    Gender: item.gender as any,
    Education: item.edu,
    Bio: `Alumni Peserta Pelatihan ${item.courseTitle} LPK Alpha Beta.`,
    CreatedAt: '2026-01-05T08:00:00Z',
    XP: 1500 + index * 50,
    Level: 5
  };
});

const generatedGraduatedEnrollments: Enrollment[] = GRADUATED_SEED_DATA.map((item, index) => {
  const numStr = String(101 + index).padStart(6, '0');
  const userId = `AB-USER-${numStr}`;
  return {
    EnrollmentID: `ENR-GRAD-${String(index + 1).padStart(3, '0')}`,
    UserID: userId,
    CourseID: item.courseId,
    EnrollmentDate: '2026-01-10T09:00:00Z',
    Status: 'Completed',
    PaymentStatus: 'Paid',
    Progress: 100,
    FinalScore: item.score,
    CompletedAt: '2026-02-01T15:00:00Z'
  };
});

const generatedGraduatedCertificates: Certificate[] = GRADUATED_SEED_DATA.map((item, index) => {
  const numStr = String(index + 1).padStart(4, '0');
  const userId = `AB-USER-${String(101 + index).padStart(6, '0')}`;
  const courseCode = item.courseId.includes('TK') ? 'TK' : item.courseId.includes('DG') ? 'DG' : 'VOK';
  const certId = `CERT/2026/${courseCode}/${numStr}`;
  
  let status: any = 'AKTIF';
  let confirmation = undefined;
  let rejectionReason = undefined;

  // Variasi status sampel untuk pengujian fitur otomatisasi penerbitan & verifikasi admin
  if (index === 0) {
    status = 'MENUNGGU_PEMBAYARAN';
  } else if (index === 1) {
    status = 'MENUNGGU_VERIFIKASI';
    confirmation = {
      ConfirmationID: `PAY-CONF-${numStr}`,
      PayerName: item.name,
      CourseTitle: item.courseTitle,
      Amount: 50000,
      TransferDate: '2026-02-10',
      BankName: 'Bank Mandiri',
      ProofURL: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
      Note: 'Konfirmasi cetak sertifikat via transfer M-Banking',
      SubmittedAt: '2026-02-10T14:30:00Z'
    };
  } else if (index === 2) {
    status = 'DITOLAK';
    confirmation = {
      ConfirmationID: `PAY-CONF-${numStr}`,
      PayerName: item.name,
      CourseTitle: item.courseTitle,
      Amount: 30000,
      TransferDate: '2026-02-08',
      BankName: 'BCA',
      ProofURL: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80',
      Note: 'Transfer sebagian',
      SubmittedAt: '2026-02-08T10:00:00Z'
    };
    rejectionReason = 'Nominal transfer tidak sesuai (minimal Rp 50.000). Silakan lakukan konfirmasi ulang dengan nominal yang pas.';
  }

  return {
    CertificateID: certId,
    CertificateNumber: certId,
    UserID: userId,
    UserName: item.name,
    UserNIK: `320102150899${String(1000 + index)}`,
    CourseID: item.courseId,
    CourseTitle: item.courseTitle,
    TrainingPeriod: '10 Januari 2026 - 01 Februari 2026',
    FinalScore: item.score,
    GradePredikat: item.score >= 90 ? 'Sangat Memuaskan' : item.score >= 80 ? 'Memuaskan' : 'Baik',
    IssueDate: '2026-02-01',
    GraduationDate: '2026-02-01',
    InstructorName: item.instructor,
    DirectorName: 'Ruli Lesmana, S.T., Gr.',
    OrganizationName: 'LPK ALPHA BETA LEARNING CENTER (NISN: K9980820, VIN: 20002320503)',
    Status: status,
    PaymentConfirmation: confirmation,
    RejectionReason: rejectionReason,
    QRCodeData: `${certId}|${item.name}|${item.courseTitle}|Score:${item.score}`,
    VerifyURL: `/verify?cert=${certId}`
  };
});

const generatedActiveUsers: User[] = ACTIVE_SEED_DATA.map((item, index) => {
  const numStr = String(201 + index).padStart(6, '0');
  const userId = `AB-USER-${numStr}`;
  return {
    UserID: userId,
    Name: item.name,
    Email: item.email,
    Role: 'PESERTA',
    Phone: item.phone,
    PhotoURL: `https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80`,
    Status: 'Aktif',
    VerificationStatus: 'VERIFIED',
    Gender: item.gender as any,
    Education: item.edu,
    Bio: `Peserta Aktif Pelatihan LPK Alpha Beta Learning Center.`,
    CreatedAt: '2026-02-01T08:00:00Z',
    XP: item.progress * 10,
    Level: Math.floor(item.progress / 20) + 1
  };
});

const generatedActiveEnrollments: Enrollment[] = ACTIVE_SEED_DATA.map((item, index) => {
  const numStr = String(201 + index).padStart(6, '0');
  const userId = `AB-USER-${numStr}`;
  return {
    EnrollmentID: `ENR-ACT-${String(index + 1).padStart(3, '0')}`,
    UserID: userId,
    CourseID: item.courseId,
    EnrollmentDate: '2026-02-01T10:00:00Z',
    Status: 'Active',
    PaymentStatus: 'Paid',
    Progress: item.progress,
    FinalScore: 0
  };
});

// Master Data List untuk Instruktur, Pelatih/Coach, dan Direktur Resmi LPK Alpha Beta (9 Orang Resmi)
export const INITIAL_OFFICIALS: OfficialPersonnel[] = [
  {
    ID: 'INS-001',
    Name: 'Roni Nuroni',
    Degree: 'S.T., MCE',
    RoleTitle: 'Instruktur Resmi',
    Expertise: 'Hardware & Jaringan Komputer',
    PhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    Bio: 'Instruktur Resmi LPK Alpha Beta - Hardware & Jaringan Komputer',
    Status: 'Aktif',
    Email: 'roni@alphabeta.edu.eu.org',
    Phone: '081223546686',
    OrderNumber: 1,
    CreatedAt: '2025-11-01T08:00:00Z'
  },
  {
    ID: 'INS-002',
    Name: 'Ridwan Abdul Aziz',
    Degree: 'S.T.',
    RoleTitle: 'Instruktur Resmi',
    Expertise: 'Teknologi Informasi & Sistem Komputer',
    PhotoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    Bio: 'Instruktur Resmi LPK Alpha Beta - Teknologi Informasi & Sistem Komputer',
    Status: 'Aktif',
    Email: 'ridwan@alphabeta.edu.eu.org',
    Phone: '081223546687',
    OrderNumber: 2,
    CreatedAt: '2025-11-01T08:00:00Z'
  },
  {
    ID: 'INS-003',
    Name: 'Syifa Rahmawati',
    Degree: 'S.T.',
    RoleTitle: 'Instruktur Resmi',
    Expertise: 'Aplikasi Digital & LMS',
    PhotoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    Bio: 'Instruktur Resmi LPK Alpha Beta - Aplikasi Digital & LMS',
    Status: 'Aktif',
    Email: 'syifa@alphabeta.edu.eu.org',
    Phone: '081223546688',
    OrderNumber: 3,
    CreatedAt: '2025-11-01T08:00:00Z'
  },
  {
    ID: 'CCH-001',
    Name: 'Ine Yuniar Suryadi',
    Degree: 'S.Pd.',
    RoleTitle: 'Pelatih / Coach',
    Expertise: 'Aplikasi Perkantoran & Produktivitas Digital',
    PhotoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    Bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Aplikasi Perkantoran & Produktivitas Digital',
    Status: 'Aktif',
    Email: 'ine@alphabeta.edu.eu.org',
    Phone: '081223546689',
    OrderNumber: 4,
    CreatedAt: '2025-11-01T08:00:00Z'
  },
  {
    ID: 'CCH-002',
    Name: 'Vita Situ Zulaikha',
    Degree: 'S.Pd., M.Pd.',
    RoleTitle: 'Pelatih / Coach',
    Expertise: 'Desain Grafis & Pendidikan Anak Usia Dini (PAUD)',
    PhotoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    Bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Desain Grafis & Pendidikan Anak Usia Dini (PAUD)',
    Status: 'Aktif',
    Email: 'vita@alphabeta.edu.eu.org',
    Phone: '081223546690',
    OrderNumber: 5,
    CreatedAt: '2025-11-01T08:00:00Z'
  },
  {
    ID: 'CCH-003',
    Name: 'Budi Iskandar',
    Degree: 'S.Si., M.Pd.',
    RoleTitle: 'Pelatih / Coach',
    Expertise: 'Bahasa Inggris, Ahli Kepanduan, Vokasi, Praktik Lapangan & Pengembangan Kompetensi',
    PhotoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    Bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Bahasa Inggris, Ahli Kepanduan, Vokasi, Praktik Lapangan & Pengembangan Kompetensi',
    Status: 'Aktif',
    Email: 'budi@alphabeta.edu.eu.org',
    Phone: '081223546691',
    OrderNumber: 6,
    CreatedAt: '2025-11-01T08:00:00Z'
  },
  {
    ID: 'CCH-004',
    Name: 'Wina Mulyani',
    Degree: 'S.Pd.',
    RoleTitle: 'Pelatih / Coach',
    Expertise: 'Pengelolaan & Kepanduan',
    PhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    Bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Pengelolaan & Kepanduan',
    Status: 'Aktif',
    Email: 'wina@alphabeta.edu.eu.org',
    Phone: '081223546692',
    OrderNumber: 7,
    CreatedAt: '2025-11-01T08:00:00Z'
  },
  {
    ID: 'CCH-005',
    Name: 'Hanifah Saadah',
    Degree: 'S.Pd., S.Kom.',
    RoleTitle: 'Pelatih / Coach',
    Expertise: 'Bahasa Inggris',
    PhotoURL: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    Bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Bahasa Inggris',
    Status: 'Aktif',
    Email: 'hanifah@alphabeta.edu.eu.org',
    Phone: '081223546693',
    OrderNumber: 8,
    CreatedAt: '2025-11-01T08:00:00Z'
  },
  {
    ID: 'INS-004',
    Name: 'Ruli Lesmana',
    Degree: 'S.T., Gr.',
    RoleTitle: 'Direktur Alpha Beta',
    Expertise: 'Manajemen LPK, Kepemimpinan Vokasi, Penandatangan Sertifikat Resmi & Tata Kelola Pendidikan Vokasi',
    PhotoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    Bio: 'Ruli Lesmana, S.T., Gr. adalah Direktur Utama Lembaga Pelatihan Kerja (LPK) Alpha Beta. Sebagai praktisi dan pendidik profesional di bidang Rekayasa Teknologi, beliau memimpin tata kelola LPK terakreditasi, pengembangan kurikulum vokasi berbasis standar industri (SKKNI), serta penjaminan mutu keabsahan sertifikasi kompetensi digital.',
    Status: 'Aktif',
    Email: 'admin@alphabeta.edu.eu.org',
    Phone: '081223546686',
    OrderNumber: 9,
    CreatedAt: '2025-10-01T08:00:00Z'
  }
];

export const MASTER_INSTRUKTUR = [
  { id: 'INS-001', name: 'Roni Nuroni, S.T., MCE', email: 'roni@alphabeta.edu.eu.org', role: 'INSTRUKTUR', title: 'Instruktur Resmi', expertise: 'Hardware & Jaringan Komputer', bio: 'Instruktur Resmi LPK Alpha Beta - Hardware & Jaringan Komputer' },
  { id: 'INS-002', name: 'Ridwan Abdul Aziz, S.T.', email: 'ridwan@alphabeta.edu.eu.org', role: 'INSTRUKTUR', title: 'Instruktur Resmi', expertise: 'Teknologi Informasi & Sistem Komputer', bio: 'Instruktur Resmi LPK Alpha Beta - Teknologi Informasi & Sistem Komputer' },
  { id: 'INS-003', name: 'Syifa Rahmawati, S.T.', email: 'syifa@alphabeta.edu.eu.org', role: 'INSTRUKTUR', title: 'Instruktur Resmi', expertise: 'Aplikasi Digital & LMS', bio: 'Instruktur Resmi LPK Alpha Beta - Aplikasi Digital & LMS' }
];

export const MASTER_COACH = [
  { id: 'CCH-001', name: 'Ine Yuniar Suryadi, S.Pd.', email: 'ine@alphabeta.edu.eu.org', role: 'PELATIH', title: 'Pelatih / Coach', expertise: 'Aplikasi Perkantoran & Produktivitas Digital', bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Aplikasi Perkantoran & Produktivitas Digital' },
  { id: 'CCH-002', name: 'Vita Situ Zulaikha, S.Pd., M.Pd.', email: 'vita@alphabeta.edu.eu.org', role: 'PELATIH', title: 'Pelatih / Coach', expertise: 'Desain Grafis & Pendidikan Anak Usia Dini (PAUD)', bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Desain Grafis & Pendidikan Anak Usia Dini (PAUD)' },
  { id: 'CCH-003', name: 'Budi Iskandar, S.Si., M.Pd.', email: 'budi@alphabeta.edu.eu.org', role: 'PELATIH', title: 'Pelatih / Coach', expertise: 'Bahasa Inggris, Ahli Kepanduan, Vokasi, Praktik Lapangan & Pengembangan Kompetensi', bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Bahasa Inggris, Ahli Kepanduan, Vokasi, Praktik Lapangan & Pengembangan Kompetensi' },
  { id: 'CCH-004', name: 'Wina Mulyani, S.Pd.', email: 'wina@alphabeta.edu.eu.org', role: 'PELATIH', title: 'Pelatih / Coach', expertise: 'Pengelolaan & Kepanduan', bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Pengelolaan & Kepanduan' },
  { id: 'CCH-005', name: 'Hanifah Saadah, S.Pd., S.Kom.', email: 'hanifah@alphabeta.edu.eu.org', role: 'PELATIH', title: 'Pelatih / Coach', expertise: 'Bahasa Inggris', bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Bahasa Inggris' }
];

export const MASTER_DIRECTOR = {
  id: 'INS-004',
  name: 'Ruli Lesmana, S.T., Gr.',
  email: 'admin@alphabeta.edu.eu.org',
  role: 'ADMIN',
  title: 'Direktur Alpha Beta',
  expertise: 'Manajemen LPK & Penandatangan Sertifikat',
  bio: 'Direktur Alpha Beta - Manajemen LPK & Penandatangan Sertifikat'
};

export const MASTER_OFFICIALS = [
  ...MASTER_INSTRUKTUR,
  ...MASTER_COACH,
  MASTER_DIRECTOR
];

const BASE_USERS: User[] = [
  {
    UserID: 'USR-001',
    Name: 'Budi Santoso',
    Email: 'budi@alphabeta.edu.eu.org',
    Role: 'PESERTA',
    Phone: '081234567891',
    PhotoURL: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Siswa SMK Jurusan TKJ yang bersemangat menjadi Teknisi Komputer Profesional.',
    Skills: ['Hardware', 'Windows OS', 'Mikrotik', 'Troubleshooting'],
    CreatedAt: '2026-01-10T08:00:00Z',
    XP: 850,
    Level: 3
  },
  {
    UserID: 'USR-002',
    Name: 'Ani Wijaya',
    Email: 'ani@alphabeta.edu.eu.org',
    Role: 'PESERTA',
    Phone: '081234567892',
    PhotoURL: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Peserta kursus Desain Grafis & Digital Marketing.',
    Skills: ['Photoshop', 'Canva', 'Social Media'],
    CreatedAt: '2026-02-01T09:30:00Z',
    XP: 1200,
    Level: 4
  },
  {
    UserID: 'USR-003',
    Name: 'Bambang Pratama',
    Email: 'bambang@alphabeta.edu.eu.org',
    Role: 'PESERTA',
    Phone: '081234567893',
    PhotoURL: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Alumni LPK Alpha Beta - Sertifikasi Teknisi Komputer & Jaringan.',
    Skills: ['Computer Assembly', 'Network Routing', 'Cisco Packet Tracer', 'Windows Server'],
    CreatedAt: '2026-01-05T10:00:00Z',
    XP: 2500,
    Level: 7
  },
  {
    UserID: 'INS-001',
    Name: 'Roni Nuroni, S.T., MCE',
    Email: 'roni@alphabeta.edu.eu.org',
    Role: 'INSTRUKTUR',
    Phone: '081223546686',
    PhotoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Instruktur Resmi LPK Alpha Beta - Hardware & Jaringan Komputer.',
    Skills: ['Hardware', 'Jaringan Komputer', 'Perakitan PC', 'Mikrotik'],
    CreatedAt: '2025-11-01T08:00:00Z',
    XP: 5200,
    Level: 16
  },
  {
    UserID: 'INS-002',
    Name: 'Ridwan Abdul Aziz, S.T.',
    Email: 'ridwan@alphabeta.edu.eu.org',
    Role: 'INSTRUKTUR',
    Phone: '081223546687',
    PhotoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Instruktur Resmi LPK Alpha Beta - Teknologi Informasi & Sistem Komputer.',
    Skills: ['Teknologi Informasi', 'Sistem Komputer', 'Networking', 'Server'],
    CreatedAt: '2025-11-01T08:00:00Z',
    XP: 5000,
    Level: 15
  },
  {
    UserID: 'INS-003',
    Name: 'Syifa Rahmawati, S.T.',
    Email: 'syifa@alphabeta.edu.eu.org',
    Role: 'INSTRUKTUR',
    Phone: '081223546688',
    PhotoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Instruktur Resmi LPK Alpha Beta - Aplikasi Digital & LMS.',
    Skills: ['Aplikasi Digital', 'LMS', 'Microsoft Office', 'AI Productivity'],
    CreatedAt: '2025-11-01T08:00:00Z',
    XP: 5100,
    Level: 15
  },
  {
    UserID: 'INS-004',
    Name: 'Ruli Lesmana, S.T., Gr.',
    Email: 'admin@alphabeta.edu.eu.org',
    Role: 'ADMIN',
    Phone: '081223546686',
    PhotoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Direktur Utama Lembaga Pelatihan Kerja (LPK) Alpha Beta. Berpengalaman luas dalam manajemen pendidikan vokasi, tata kelola LPK terakreditasi, perancangan kurikulum berbasis industri (SKKNI), serta penjaminan mutu keabsahan sertifikasi kompetensi digital.',
    Skills: ['Direktur Utama LPK', 'Manajemen LPK', 'Penandatangan Sertifikat', 'Teknik Informatika', 'Pendidikan Vokasi'],
    Education: 'S1 Teknik & Profesi Pendidik (S.T., Gr.)',
    Occupation: 'Direktur LPK Alpha Beta',
    Address: 'Kp. Sukawangi RT. 01 RW. 01 Desa Sukawangi, Kec. Singajaya, Kab. Garut, Jawa Barat (44173)',
    CreatedAt: '2025-10-01T08:00:00Z',
    XP: 10000,
    Level: 20
  },
  {
    UserID: 'CCH-001',
    Name: 'Ine Yuniar Suryadi, S.Pd.',
    Email: 'ine@alphabeta.edu.eu.org',
    Role: 'PELATIH',
    Phone: '081223546689',
    PhotoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Aplikasi Perkantoran & Produktivitas Digital.',
    Skills: ['Aplikasi Perkantoran', 'Produktivitas Digital', 'Microsoft Excel', 'Administrasi'],
    CreatedAt: '2025-11-01T08:00:00Z',
    XP: 4700,
    Level: 14
  },
  {
    UserID: 'CCH-002',
    Name: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
    Email: 'vita@alphabeta.edu.eu.org',
    Role: 'PELATIH',
    Phone: '081223546690',
    PhotoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Desain Grafis & Pendidikan Anak Usia Dini (PAUD).',
    Skills: ['Desain Grafis', 'Pendidikan Anak Usia Dini (PAUD)', 'Visual Branding', 'Canva'],
    CreatedAt: '2025-11-01T08:00:00Z',
    XP: 4800,
    Level: 14
  },
  {
    UserID: 'CCH-003',
    Name: 'Budi Iskandar, S.Si., M.Pd.',
    Email: 'budi@alphabeta.edu.eu.org',
    Role: 'PELATIH',
    Phone: '081223546691',
    PhotoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Bahasa Inggris, Ahli Kepanduan, Vokasi, Praktik Lapangan & Pengembangan Kompetensi.',
    Skills: ['Bahasa Inggris', 'Ahli Kepanduan', 'Pelatihan Vokasi', 'Praktik Lapangan'],
    CreatedAt: '2025-11-01T08:00:00Z',
    XP: 4600,
    Level: 13
  },
  {
    UserID: 'CCH-004',
    Name: 'Wina Mulyani, S.Pd.',
    Email: 'wina@alphabeta.edu.eu.org',
    Role: 'PELATIH',
    Phone: '081223546692',
    PhotoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Pengelolaan & Kepanduan.',
    Skills: ['Pengelolaan', 'Kepanduan', 'Digital Marketing', 'Pelatihan Karir'],
    CreatedAt: '2025-11-01T08:00:00Z',
    XP: 4500,
    Level: 13
  },
  {
    UserID: 'CCH-005',
    Name: 'Hanifah Saadah, S.Pd., S.Kom.',
    Email: 'hanifah@alphabeta.edu.eu.org',
    Role: 'PELATIH',
    Phone: '081223546693',
    PhotoURL: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80',
    Status: 'Aktif',
    Bio: 'Pelatih / Coach Resmi LPK Alpha Beta - Bahasa Inggris.',
    Skills: ['Bahasa Inggris', 'Informatika', 'English Conversation', 'English Communication'],
    CreatedAt: '2025-11-01T08:00:00Z',
    XP: 4500,
    Level: 13
  }
];

export const INITIAL_USERS: User[] = [
  ...BASE_USERS,
  ...generatedGraduatedUsers,
  ...generatedActiveUsers
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    CategoryID: 'CAT-001',
    Name: 'Komputer & Teknologi',
    Icon: 'Cpu',
    Description: 'Materi perakitan PC, teknisi laptop, jaringan komputer, pemrograman, AI, dan infrastruktur IT.',
    Subcategories: [
      'Dasar-Dasar Komputer',
      'Sistem Komputer',
      'Hardware & Software',
      'Jaringan Komputer',
      'Internet & Teknologi Digital',
      'Pemrograman Dasar',
      'Web Development',
      'Aplikasi Perkantoran',
      'Database',
      'Artificial Intelligence (AI)',
      'Keamanan Siber',
      'Cloud Computing',
      'Internet of Things (IoT)',
      'Teknologi Informasi dan Komunikasi',
      'Digital Literacy',
      'Sistem Operasi',
      'Pemrograman Web',
      'Pemrograman Mobile',
      'Struktur Data & Algoritma',
      'Analisis Data',
      'Data Science',
      'Machine Learning',
      'Otomasi Digital',
      'Teknologi Blockchain',
      'DevOps',
      'IT Support & Troubleshooting',
      'Manajemen Server',
      'Digital Forensics',
      'Teknisi Komputer'
    ]
  },
  {
    CategoryID: 'CAT-002',
    Name: 'Kreatif & Desain',
    Icon: 'Palette',
    Description: 'Desain grafis, UI/UX, video editing, 3D modeling, animasi, fotografi, dan konten kreatif.',
    Subcategories: [
      'Desain Komunikasi Visual (DKV)',
      'Desain Grafis',
      'Dasar-Dasar Desain',
      'Tipografi',
      'Ilustrasi Digital',
      'Fotografi',
      'Videografi',
      'Editing Foto',
      'Editing Video',
      'Motion Graphic',
      'UI/UX Design',
      'Branding & Identitas Visual',
      'Desain Logo',
      'Desain Kemasan',
      'Desain Konten Media Sosial',
      'Animasi',
      'Digital Art',
      'Creative Content',
      'Personal Branding',
      'Layout & Komposisi',
      'Desain Editorial',
      'Infografis',
      'Desain Presentasi',
      'Desain Advertising',
      'Creative Advertising',
      'Art Direction',
      'Storyboard',
      'Cinematography',
      'Produksi Film Pendek',
      'Sound Design',
      '3D Design',
      '3D Modeling',
      'Character Design',
      'Game Design',
      'Content Creator',
      'Social Media Content',
      'Creative Photography',
      'Product Photography',
      'Digital Illustration',
      'Portfolio Design'
    ]
  },
  {
    CategoryID: 'CAT-003',
    Name: 'Bahasa Internasional',
    Icon: 'Languages',
    Description: 'Persiapan kerja & akademik: Bahasa Inggris, Jepang, Korea, Mandarin, Arab, Jerman, Prancis, Spanyol.',
    Subcategories: [
      'Bahasa Inggris Dasar',
      'English Conversation',
      'English for Work',
      'English for Business',
      'English for Tourism',
      'Grammar',
      'Vocabulary',
      'Pronunciation',
      'Listening',
      'Speaking',
      'Reading',
      'Writing',
      'Public Speaking',
      'Presentation Skills',
      'TOEFL Preparation',
      'IELTS Preparation',
      'Bahasa Jepang',
      'Bahasa Korea',
      'Bahasa Mandarin',
      'Bahasa Arab',
      'English for Students',
      'English for Professionals',
      'English for Technology',
      'English for Creative Industry',
      'English for Digital Marketing',
      'Business English',
      'Academic English',
      'English Interview',
      'English Writing',
      'English Communication',
      'Japanese Conversation',
      'Korean Conversation',
      'Mandarin Conversation',
      'German Basic',
      'French Basic',
      'Spanish Basic'
    ]
  },
  {
    CategoryID: 'CAT-004',
    Name: 'Kewirausahaan & Digital',
    Icon: 'Briefcase',
    Description: 'Digital marketing, manajemen bisnis online, e-commerce, strategi penjualan, dan monetisasi digital.',
    Subcategories: [
      'Dasar-Dasar Kewirausahaan',
      'Ide dan Peluang Bisnis',
      'Business Model Canvas',
      'Digital Entrepreneurship',
      'Bisnis Online',
      'Digital Marketing',
      'Social Media Marketing',
      'Content Marketing',
      'Copywriting',
      'Branding Bisnis',
      'Marketplace',
      'E-Commerce',
      'Strategi Penjualan',
      'Customer Service',
      'Manajemen Keuangan Usaha',
      'Perencanaan Bisnis',
      'UMKM Go Digital',
      'Personal Branding untuk Bisnis',
      'Affiliate Marketing',
      'Freelance & Creativepreneur',
      'Monetisasi Konten Digital',
      'Bisnis Berbasis AI',
      'Business Planning',
      'Business Strategy',
      'Startup',
      'Financial Literacy',
      'Digital Finance',
      'Marketing Strategy',
      'SEO',
      'SEM',
      'Email Marketing',
      'Influencer Marketing',
      'Sales & Negotiation',
      'Customer Relationship Management',
      'Product Development',
      'Market Research',
      'Business Analytics',
      'Leadership',
      'Team Management',
      'Project Management',
      'Freelancing',
      'Digital Product',
      'Online Course Business',
      'Creator Economy',
      'AI for Business',
      'E-Commerce Management'
    ]
  },
  {
    CategoryID: 'CAT-005',
    Name: 'Pendidikan & Pelatihan Vokasi',
    Icon: 'GraduationCap',
    Description: 'Pedagogi PAUD, pengelolaan kelas, asesmen pembelajaran, dan pengembangan kurikulum vokasi.',
    Subcategories: [
      'Dasar-Dasar PAUD',
      '6 Aspek Perkembangan Anak',
      'Perencanaan Pembelajaran',
      'Praktik Pembelajaran & APE',
      'Asesmen & Dokumentasi',
      'Pengelolaan Kelas & Komunikasi Orang Tua'
    ]
  }
];

export const INITIAL_COURSES: Course[] = COMPREHENSIVE_COURSES;

const BASE_MODULES: Module[] = [
  {
    ModuleID: 'MOD-TK-01',
    CourseID: 'CRS-TK01',
    Title: 'Modul 1: Arsitektur & Pengenalan Component Hardware',
    Description: 'Memahami fungsi utama Motherboard, Processor, RAM, Graphic Card, Storage, Power Supply, dan Cassing.',
    Order: 1,
    Lessons: [
      {
        ActivityID: 'LES-TK-101',
        ModuleID: 'MOD-TK-01',
        CourseID: 'CRS-TK01',
        Title: 'Pengenalan Arsitektur Hardware Komputer Modern',
        Type: 'text',
        Duration: '15 Menit',
        Order: 1,
        XP: 50,
        Content: `
# 📖 MODUL 1: ARSITEKTUR & HARDWARE KOMPUTER MODERN

---

### **A. TUJUAN PEMBELAJARAN**
Setelah menyelesaikan bahan ajar ini, peserta pelatihan diharapkan mampu:
1. Memahami arsitektur Von Neumann dan alur pemrosesan data (Input - Process - Output - Storage).
2. Mengidentifikasi seluruh komponen utama di dalam casing PC beserta fungsinya masing-masing.
3. Menganalisis kompatibilitas antar-komponen (Socket CPU, Chipset Motherboard, Form Factor RAM, TDP Power Supply).

---

### **B. MATERI INTI**
Sistem komputer modern terdiri dari tiga pilar utama yang saling terintegrasi:
* **Hardware (Perangkat Keras):** Komponen fisik yang mengolah sinyal listrik menjadi komputasi data.
* **Software (Perangkat Lunak):** Sistem operasi (Windows/Linux/macOS) dan driver perangkat.
* **Brainware (Pengguna/Teknisi):** Manusia yang merancang, merakit, dan mengoperasikan sistem.

Komponen utama di dalam sistem PC meliputi:
1. **Motherboard (Papan Induk):** Pusat konektivitas seluruh bus data dan daya listrik.
2. **Processor (CPU):** Unit pemroses sentral yang mengeksekusi instruksi program.
3. **Random Access Memory (RAM):** Penyimpanan data sementara berkecepatan sangat tinggi.
4. **Storage (SSD NVMe / SATA HDD):** Penyimpanan data non-volatile permanen.
5. **Power Supply Unit (PSU):** Konverter arus listrik AC ke DC dengan efisiensi sertifikasi 80 Plus.

---

### **C. SUBMATERI & SPESIFIKASI DUKUNGAN**
1. **Socket & Form Factor:**
   * Intel LGA (LGA1700, LGA1200) vs AMD PGA/LGA (AM4, AM5).
   * Ukuran Motherboard: ATX, Micro-ATX, Mini-ITX.
2. **Generasi RAM & Speed:**
   * DDR4 (2133 - 3600 MHz) vs DDR5 (4800 - 7200+ MHz).
   * Dual-Channel Memory vs Single-Channel.
3. **Penyimpanan Berkecepatan Tinggi:**
   * M.2 NVMe PCIe Gen 4x4 (hingga 7000 MB/s) vs SATA SSD (550 MB/s).

---

### **D. CONTOH KASUS DILAPANGAN**
**Kasus:** Klien ingin merakit PC untuk kebutuhan editing video 4K dan desain 3D.
**Analisis Spesifikasi Rekomendasi:**
* **CPU:** Intel Core i7-13700K atau AMD Ryzen 7 7700X.
* **RAM:** 32GB DDR5 6000MHz Dual-Channel.
* **Storage:** 1TB SSD NVMe M.2 PCIe 4.0 untuk OS & Cache + 2TB HDD untuk arsip.
* **PSU:** 750W 80 Plus Gold Fully Modular.

---

### **E. AKTIVITAS PRAKTIK MANDIRI**
1. Buka casing PC di Laboratorium Hardware LPK Alpha Beta.
2. Catat seluruh spesifikasi komponen yang terpasang (Model CPU, Seri Motherboard, Kapasitas RAM).
3. Gunakan gelang antistatis saat memegang komponen sensitif.

---

### **F. TIPS & CATATAN PENTING TEKNISI**
* ⚠️ **Penting:** JANGAN PERNAH menyentuh pin pendar emas pada CPU atau RAM langsung dengan jari telanjang karena kelembaban dan lemak tubuh dapat menyebabkan korosi atau kendala *no display*.
* 💡 **Tips:** Gunakan PSU bersertifikasi minimal 80 Plus Bronze untuk melindungi motherboard dan GPU dari lonjakan voltase PLN.

---

### **G. RANGKUMAN**
Pemahaman arsitektur hardware merupakan pondasi utama seorang Teknisi Komputer profesional. Kompatibilitas antar-komponen harus dipastikan sebelum perakitan fisik dilakukan demi mencegah kerusakan elektrikal dan bottleneck performa.

---

### **H. EVALUASI MANDIRI**
1. Mengapa RAM disebut memori volatile sedangkan SSD disebut non-volatile?
2. Sebutkan perbedaan mendasar antara Socket CPU tipe LGA dan PGA!
        `
      },
      {
        ActivityID: 'LES-TK-102',
        ModuleID: 'MOD-TK-01',
        CourseID: 'CRS-TK01',
        Title: 'Video Tutorial: Identifikasi Komponen Hardware PC',
        Type: 'video',
        Duration: '12 Menit',
        Order: 2,
        XP: 50,
        VideoURL: 'https://www.youtube.com/embed/fA8N3Y_P1Z0'
      },
      {
        ActivityID: 'LES-TK-103',
        ModuleID: 'MOD-TK-01',
        CourseID: 'CRS-TK01',
        Title: 'Lab Praktik 1: Identifikasi Hardware Interaktif',
        Type: 'practice',
        SimulatorType: 'hardware_lab',
        Duration: '15 Menit',
        Order: 3,
        XP: 100,
        PracticeInstructions: 'Uji kemampuan Anda mengidentifikasi komponen fisik komputer melalui gambar interaktif dan kuis visual!'
      },
      {
        ActivityID: 'LES-TK-104',
        ModuleID: 'MOD-TK-01',
        CourseID: 'CRS-TK01',
        Title: 'Kuis Modul 1: Komponen Hardware',
        Type: 'quiz',
        QuizID: 'QUIZ-TK-01',
        Duration: '10 Menit',
        Order: 4,
        XP: 100
      }
    ]
  },
  {
    ModuleID: 'MOD-TK-02',
    CourseID: 'CRS-TK01',
    Title: 'Modul 2: Perakitan PC Interaktif (PC Assembly Simulator)',
    Description: 'Praktik merakit PC langkah demi langkah dengan simulator interaktif drag & drop.',
    Order: 2,
    Lessons: [
      {
        ActivityID: 'LES-TK-201',
        ModuleID: 'MOD-TK-02',
        CourseID: 'CRS-TK01',
        Title: 'Langkah-Langkah & Urutan Perakitan PC yang Benar',
        Type: 'text',
        Duration: '15 Menit',
        Order: 1,
        XP: 50,
        Content: `
# 📖 MODUL 2: SOP & URUTAN PERAKITAN KOMPUTER STANDAR INDUSTRI

---

### **A. TUJUAN PEMBELAJARAN**
1. Menerapkan Standard Operating Procedure (SOP) perakitan PC sesuai standar keselamatan kerja (K3LH).
2. Menguasai urutan perakitan komponen dari penyiapan motherboard hingga cable management.
3. Melakukan tes booting awal (POST - Power On Self Test) untuk memastikan sistem berfungsi normal.

---

### **B. MATERI INTI**
Perakitan komputer membutuhkan ketelitian dan kehati-hatian. Urutan standar perakitan PC adalah sebagai berikut:
1. **Persiapan Motherboard di Luar Casing:**
   * Pasang CPU pada Socket (pasti kan segitiga petunjuk sejajar).
   * Kunci tuas pengait Socket CPU.
   * Oleskan *thermal paste* (ukuran biji jagung) di atas IHS CPU.
   * Pasang Heatsink / HSF / Liquid AIO Cooler.
   * Pasang RAM pada slot DIMM 2 & 4 untuk dukungan Dual Channel.
2. **Pemasangan Power Supply Unit (PSU) & Storage:**
   * Pasang PSU di bagian bawah/atas casing dan kencangkan 4 baut.
   * Pasang SSD NVMe M.2 pada slot PCIe M.2 utama.
3. **Pemasangan Motherboard ke Casing:**
   * Pasang I/O Shield pada bagian belakang casing.
   * Pasang baut standoff pada titik lubang motherboard.
   * Letakkan motherboard dan kencangkan baut pengunci.
4. **Pemasangan GPU & Manajemen Kabel:**
   * Pasang Kartu Grafis (GPU) pada PCIe x16 utama.
   * Hubungkan Kabel Power 24-Pin ATX Motherboard, 8-Pin CPU EPS, Kabel SATA/PCIe GPU.
   * Pasang kabel Front Panel (Power SW, Reset SW, Power LED, HDD LED, Front Audio, USB 3.0).

---

### **C. SUBMATERI**
* **Pengenal Baut & Standoff:** Baut M3 vs Baut 6-32.
* **Pin Front Panel Header:** Urutan positif (+) dan negatif (-) LED serta tombol power/reset.
* **Cable Management:** Penggunaan Cable Tie dan Jalur Grommet Casing untuk sirkulasi udara optimal.

---

### **D. CONTOH KASUS & TROUBLESHOOTING**
**Gejala:** PC yang baru dirakit dinyalakan, kipas berputar tetapi tidak tampil di layar (No Display) dan terdengar bunyi Beep 3x.
**Penyebab:** RAM kurang tancap/kotor atau salah slot.
**Solusi:** Lepas RAM, bersihkan pin menggunakan penghapus pensil bersih, lalu tancapkan kembali hingga berbunyi 'KLIK' kuat di kedua sisi.

---

### **E. AKTIVITAS PRAKTIK MANDIRI**
Gunakan **Simulator Perakitan PC Interaktif** pada pelajaran berikutnya untuk merakit unit komputer impian Anda secara virtual.

---

### **F. TIPS & CATATAN PENTING**
* ⚡ Selalu cabut kabel listrik PLN sebelum memegang komponen internal PC.
* 🛠️ Jangan memaksa memasukkan komponen jika terasa mengganjal; periksa arah takik (*notch*) socket.

---

### **G. RANGKUMAN**
Perakitan PC yang rapi dan sesuai SOP memperpanjang umur komponen dan memudahkan proses perawatan serta upgrade di masa depan.

---

### **H. EVALUASI MANDIRI**
1. Apa akibatnya jika motherboard dipasang ke casing tanpa baut standoff?
2. Bagaimana cara membedakan kabel 8-pin CPU EPS dan kabel 8-pin PCIe GPU?
        `
      },
      {
        ActivityID: 'LES-TK-202',
        ModuleID: 'MOD-TK-02',
        CourseID: 'CRS-TK01',
        Title: 'Simulator Perakitan PC Interaktif (Practical Test)',
        Type: 'simulator',
        SimulatorType: 'pc_assembly',
        Duration: '25 Menit',
        Order: 2,
        XP: 250,
        PracticeInstructions: 'Gunakan Simulator Perakitan PC untuk memasang Processor, Cooler, RAM, GPU, SSD, PSU, dan Kabel hingga PC berhasil menyala (POST Successful).'
      },
      {
        ActivityID: 'LES-TK-203',
        ModuleID: 'MOD-TK-02',
        CourseID: 'CRS-TK01',
        Title: 'Kuis Modul 2: Perakitan Komputer',
        Type: 'quiz',
        QuizID: 'QUIZ-TK-02',
        Duration: '10 Menit',
        Order: 3,
        XP: 100
      }
    ]
  },
  {
    ModuleID: 'MOD-TK-03',
    CourseID: 'CRS-TK01',
    Title: 'Modul 3: Instalasi OS & Driver Simulator',
    Description: 'Simulasi konfigurasi BIOS/UEFI, instalasi Windows 11, dan update driver.',
    Order: 3,
    Lessons: [
      {
        ActivityID: 'LES-TK-301',
        ModuleID: 'MOD-TK-03',
        CourseID: 'CRS-TK01',
        Title: 'Konfigurasi BIOS Boot Priority & Instalasi Windows',
        Type: 'text',
        Duration: '15 Menit',
        Order: 1,
        XP: 50,
        Content: `
# 📖 MODUL 3: INSTALASI SISTEM OPERASI WINDOWS 11 & DRIVER

---

### **A. TUJUAN PEMBELAJARAN**
1. Mengonfigurasi menu BIOS / UEFI Boot Priority.
2. Memahami perbedaan skema partisi MBR (Legacy BIOS) dan GPT (UEFI).
3. Melakukan instalasi Windows 11, penginstalan driver chipset/VGA, serta aktivasi lisensi.

---

### **B. MATERI INTI**
Proses penginstalan OS memerlukan media instalasi USB Bootable (dibuat menggunakan aplikasi Rufus atau Media Creation Tool).

**Langkah-Langkah Instalasi:**
1. Masukkan USB Flashdisk Bootable ke Port USB PC.
2. Nyalakan PC lalu tekan tombol **DEL** atau **F2** secara berulang untuk masuk menu BIOS/UEFI.
3. Atur **Boot Option #1** mengarah ke Flashdisk USB.
4. Simpan konfigurasi (tekan **F10**) dan restart.
5. Saat muncul wizard Windows Setup, pilih Bahasa, Keyboard Layout, dan klik *Install Now*.
6. Pilih skema partisi SSD: Buat Partisi C (System) dan Partisi D (Data).
7. Tunggu proses *Copying & Expanding Files* selesai hingga masuk ke halaman Out-of-Box Experience (OOBE).

---

### **C. SUBMATERI**
* **GPT vs MBR:** GPT mendukung disk >2TB dan hingga 128 partisi primer; MBR maksimal 2TB dan 4 partisi primer.
* **Pentingnya Driver Chipset & VGA:** Menjamin performa kartu grafis dan stabilitas transfer data USB/LAN.

---

### **D. CONTOH KASUS**
**Masalah:** Saat memilih drive instalasi Windows 11 muncul pesan *"Windows cannot be installed to this disk. The selected disk is of the GPT partition style"*.
**Solusi:** Ubah mode Boot pada BIOS dari Legacy/CSM Mode menjadi UEFI Mode, atau buat ulang USB BootableRufus berformat GPT-UEFI.

---

### **E. AKTIVITAS PRAKTIK MANDIRI**
Buka Software Lab Simulator pada sesi berikutnya untuk mensimulasikan proses membuat partisi dan menginstal Windows secara interaktif.

---

### **F. TIPS TEKNISI**
* selalu cadangkan data penting (backup) sebelum melakukan format partisi!

---

### **G. RANGKUMAN**
Konfigurasi BIOS dan format partisi yang tepat adalah kunci kecepatan dan kestabilan sistem operasi Windows.

---

### **H. EVALUASI MANDIRI**
1. Mengapa Windows 11 mewajibkan fitur Secure Boot dan TPM 2.0 aktif di BIOS?
        `
      },
      {
        ActivityID: 'LES-TK-302',
        ModuleID: 'MOD-TK-03',
        CourseID: 'CRS-TK01',
        Title: 'Software Lab: Simulasi Instalasi & Troubleshooting OS',
        Type: 'practice',
        SimulatorType: 'software_lab',
        Duration: '20 Menit',
        Order: 2,
        XP: 150
      }
    ]
  },
  {
    ModuleID: 'MOD-TK-04',
    CourseID: 'CRS-TK01',
    Title: 'Modul 4: Ujian Akhir Sertifikasi Teknisi Komputer',
    Description: 'Ujian komprehensif untuk mendapatkan Sertifikat Resmi Teknisi Komputer.',
    Order: 4,
    Lessons: [
      {
        ActivityID: 'LES-TK-401',
        ModuleID: 'MOD-TK-04',
        CourseID: 'CRS-TK01',
        Title: '🎯 Ujian Akhir Kelulusan Teknisi Komputer',
        Type: 'exam',
        ExamID: 'EXAM-TK-FINAL',
        Duration: '30 Menit',
        Order: 1,
        XP: 500
      }
    ]
  },
  // Modules for Network Lab
  {
    ModuleID: 'MOD-JK-01',
    CourseID: 'CRS-JK02',
    Title: 'Modul 1: Topologi & Virtual Network Lab Simulator',
    Description: 'Membuat jaringan komputer virtual, konfigurasi IP, dan tes konektivitas Ping.',
    Order: 1,
    Lessons: [
      {
        ActivityID: 'LES-JK-101',
        ModuleID: 'MOD-JK-01',
        CourseID: 'CRS-JK02',
        Title: 'Konsep Dasar IP Address & Subnetting IPv4',
        Type: 'text',
        Duration: '15 Menit',
        Order: 1,
        XP: 50,
        Content: `
# 📖 MODUL 1: KONSEP DASAR IP ADDRESS & SUBNETTING JARINGAN

---

### **A. TUJUAN PEMBELAJARAN**
1. Memahami pengalamatan IPv4, Kelas IP (A, B, C), dan IP Private vs IP Public.
2. Menguasai perhitungan Subnetting CIDR (/24, /25, /26, /27, /28).
3. Konfigurasi IP Address, Subnet Mask, Default Gateway, dan DNS Server.

---

### **B. MATERI INTI**
Setiap perangkat dalam jaringan komputer memerlukan alamat unik yang disebut **IP Address** (Internet Protocol).
* **IPv4 Address:** Terdiri dari 32-bit angka biner yang dibagi menjadi 4 oktet (contoh: 192.168.1.10).
* **Subnet Mask:** Menentukan batas Network ID dan Host ID (contoh: 255.255.255.0 untuk /24).
* **Default Gateway:** Alamat IP Router tempat lalu lintas data dikirim keluar ke jaringan lain/Internet.
* **DNS Server:** Mengubah nama domain (contoh: alphabeta.edu.eu.org) menjadi alamat IP.

---

### **C. SUBMATERI & CIDR SUBNETTING**
* **/24:** 256 Total IP (254 IP Host usable), Subnet Mask 255.255.255.0.
* **/25:** 128 Total IP (126 IP Host usable), Subnet Mask 255.255.255.128.
* **/26:** 64 Total IP (62 IP Host usable), Subnet Mask 255.255.255.192.
* **/27:** 32 Total IP (30 IP Host usable), Subnet Mask 255.255.255.224.

---

### **D. CONTOH PERHITUNGAN SUBNETTING**
**Soal:** Sebuah kantor memiliki 25 unit komputer. Tentukan Prefix CIDR yang paling efisien!
**Jawaban:** Prefix **/27** menyediakan 30 IP usable, sangat pas untuk 25 PC tanpa membuang alokasi IP Address.

---

### **E. AKTIVITAS PRAKTIK MANDIRI**
Buka **Virtual Network Lab Simulator** di modul ini untuk merancang jaringan LAN PC - Switch - Router secara virtual.

---

### **F. TIPS ADMINISTRATOR JARINGAN**
* 💡 Gunakan perintah \`ping\` untuk menguji konektivitas latensi dan \`tracert\` untuk melacak rute paket data.

---

### **G. RANGKUMAN**
Subnetting yang efektif menghemat alokasi IP Address, mengurangi *broadcast storm*, dan meningkatkan keamanan jaringan LAN.

---

### **H. EVALUASI MANDIRI**
1. Berapa alokasi IP usable untuk prefix /28?
2. Apa fungsi utama dari Default Gateway dalam jaringan lokal?
        `
      },
      {
        ActivityID: 'LES-JK-102',
        ModuleID: 'MOD-JK-01',
        CourseID: 'CRS-JK02',
        Title: 'Virtual Network Lab: Simulator Topologi & Ping',
        Type: 'simulator',
        SimulatorType: 'network_lab',
        Duration: '30 Menit',
        Order: 2,
        XP: 300,
        PracticeInstructions: 'Rancang topologi PC -> Switch -> Router -> Internet, konfigurasikan IP address, dan lakukan pengujian koneksi Ping!'
      },
      {
        ActivityID: 'LES-JK-103',
        ModuleID: 'MOD-JK-01',
        CourseID: 'CRS-JK02',
        Title: '🎯 Ujian Akhir Network Administrator',
        Type: 'exam',
        ExamID: 'EXAM-JK-FINAL',
        Duration: '30 Menit',
        Order: 3,
        XP: 500
      }
    ]
  }
];

const BASE_QUIZZES: Quiz[] = [
  {
    QuizID: 'QUIZ-TK-01',
    CourseID: 'CRS-TK01',
    ModuleID: 'MOD-TK-01',
    Title: 'Kuis Modul 1: Arsitektur & Hardware Komputer',
    Description: 'Uji pemahaman dasar mengenai fungsi komponen hardware PC.',
    PassingGrade: 80,
    Questions: [
      {
        QuestionID: 'Q-TK-101',
        QuizID: 'QUIZ-TK-01',
        Question: 'Komponen apakah yang berfungsi sebagai otak utama pengolah data pada sistem komputer?',
        Type: 'multiple_choice',
        Options: ['Motherboard', 'CPU (Central Processing Unit)', 'RAM', 'Power Supply'],
        CorrectAnswer: 'CPU (Central Processing Unit)',
        Explanation: 'CPU (Processor) bertindak sebagai otak utama yang mengeksekusi semua perintah dan komputasi di komputer.',
        Points: 25
      },
      {
        QuestionID: 'Q-TK-102',
        QuizID: 'QUIZ-TK-01',
        Question: 'RAM bertindak sebagai tempat penyimpanan data permanen yang tidak hilang saat komputer dimatikan.',
        Type: 'true_false',
        Options: ['Benar', 'Salah'],
        CorrectAnswer: 'Salah',
        Explanation: 'RAM adalah memori volatile (sementara). Data di RAM hilang saat komputer dimatikan. Penyimpanan permanen berada di SSD/HDD.',
        Points: 25
      },
      {
        QuestionID: 'Q-TK-103',
        QuizID: 'QUIZ-TK-01',
        Question: 'Manakah komponen yang mengubah tegangan listrik PLN menjadi tegangan DC untuk komputer?',
        Type: 'multiple_choice',
        Options: ['Inverter', 'Power Supply Unit (PSU)', 'UPS', 'Heatsink'],
        CorrectAnswer: 'Power Supply Unit (PSU)',
        Explanation: 'PSU mengubah arus bolak-balik (AC) PLN menjadi arus searah (DC) yang stabil untuk motherboard & komponen.',
        Points: 25
      },
      {
        QuestionID: 'Q-TK-104',
        QuizID: 'QUIZ-TK-01',
        Question: 'Slot apakah pada motherboard yang khusus digunakan untuk memasang Kartu Grafis (VGA Card)?',
        Type: 'multiple_choice',
        Options: ['Slot DIMM', 'Slot PCIe x16', 'Slot SATA', 'Slot M.2 NVMe'],
        CorrectAnswer: 'Slot PCIe x16',
        Explanation: 'Slot PCIe x16 memiliki bandwidth tertinggi yang dirancang khusus untuk Graphics Card (GPU).',
        Points: 25
      }
    ]
  },
  {
    QuizID: 'QUIZ-TK-02',
    CourseID: 'CRS-TK01',
    ModuleID: 'MOD-TK-02',
    Title: 'Kuis Modul 2: Prosedur Perakitan Komputer',
    Description: 'Kuis seputar langkah dan kehati-hatian dalam merakit komponen PC.',
    PassingGrade: 80,
    Questions: [
      {
        QuestionID: 'Q-TK-201',
        QuizID: 'QUIZ-TK-02',
        Question: 'Mengapa pasta thermal (thermal paste) harus dioleskan di antara Processor dan Heatsink CPU Cooler?',
        Type: 'multiple_choice',
        Options: [
          'Agar processor menempel erat tidak lepas',
          'Untuk mengisi mikro-celah udara agar hantaran panas dari CPU ke heatsink maksimal',
          'Sebagai penahan aliran listrik statis',
          'Agar CPU berjalan lebih kencang'
        ],
        CorrectAnswer: 'Untuk mengisi mikro-celah udara agar hantaran panas dari CPU ke heatsink maksimal',
        Explanation: 'Pasta thermal menutup celah mikroskopis udara sehingga konduksi panas dari permukaan CPU ke heatsink berlangsung efisien.',
        Points: 50
      },
      {
        QuestionID: 'Q-TK-202',
        QuizID: 'QUIZ-TK-02',
        Question: 'Kabel utama dari Power Supply yang dicolokkan ke motherboard untuk memberikan daya ke seluruh papan sistem berukuran:',
        Type: 'multiple_choice',
        Options: ['4-Pin Molex', '8-Pin CPU', '24-Pin ATX Power', 'SATA Power'],
        CorrectAnswer: '24-Pin ATX Power',
        Explanation: 'Kabel 24-Pin ATX adalah kabel daya utama untuk papan sirkuit Motherboard.',
        Points: 50
      }
    ]
  }
];

const BASE_EXAMS: Exam[] = [
  {
    ExamID: 'EXAM-TK-FINAL',
    CourseID: 'CRS-TK01',
    Title: 'Ujian Akhir Kelulusan: Teknisi Komputer & Perakitan PC',
    Description: 'Selesaikan Ujian Akhir ini dengan nilai minimal 80 untuk mendapatkan SERTIFIKAT KELULUSAN RESMI dari LPK Alpha Beta.',
    PassingGrade: 80,
    TimeLimitMinutes: 30,
    Questions: [
      {
        QuestionID: 'EX-TK-01',
        Question: 'Komponen yang bertanggung jawab mengolah grafik dan visual ke layar monitor adalah:',
        Type: 'multiple_choice',
        Options: ['RAM', 'GPU / Graphics Card', 'Sound Card', 'LAN Card'],
        CorrectAnswer: 'GPU / Graphics Card',
        Explanation: 'GPU (Graphics Processing Unit) memproses data grafis 2D & 3D untuk ditampilkan pada layar monitor.',
        Points: 20
      },
      {
        QuestionID: 'EX-TK-02',
        Question: 'Ketika PC dinyalakan terdengar Beep 1 kali panjang dan 2 kali pendek. Masalah biasanya terletak pada:',
        Type: 'multiple_choice',
        Options: ['VGA / Kartu Grafis', 'Keyboard terlepas', 'Harddisk penuh', 'Kabel Power longgar'],
        CorrectAnswer: 'VGA / Kartu Grafis',
        Explanation: 'Secara standar Award/AMI BIOS, beep code 1 panjang 2 pendek menandakan kegagalan deteksi kartu grafis (VGA).',
        Points: 20
      },
      {
        QuestionID: 'EX-TK-03',
        Question: 'Langkah pertama yang benar sebelum melakukan perakitan komponen fisik komputer adalah:',
        Type: 'multiple_choice',
        Options: [
          'Memasang kartu VGA ke slot PCIe',
          'Membumikan listrik statis tubuh (Grounding) / menggunakan gelang antistatis',
          'Menyambungkan kabel PLN ke PSU',
          'Mengoleskan minyak ke motherboard'
        ],
        CorrectAnswer: 'Membumikan listrik statis tubuh (Grounding) / menggunakan gelang antistatis',
        Explanation: 'Listrik statis dari tubuh manusia dapat merusak sirkuit mikrokontroler peka seperti RAM atau CPU.',
        Points: 20
      },
      {
        QuestionID: 'EX-TK-04',
        Question: 'Teknologi media penyimpanan permanen berkecepatan paling tinggi saat ini yang langsung terhubung ke jalur PCIe motherboard adalah:',
        Type: 'multiple_choice',
        Options: ['Harddisk HDD 7200 RPM', 'Floppy Disk', 'SSD M.2 NVMe', 'CD-ROM'],
        CorrectAnswer: 'SSD M.2 NVMe',
        Explanation: 'SSD M.2 NVMe memanfaatkan protokol PCIe dengan kecepatan baca/tulis hingga ribuan MB/s.',
        Points: 20
      },
      {
        QuestionID: 'EX-TK-05',
        Question: 'Program dasar firmware yang tersimpan pada chip ROM motherboard untuk inisialisasi hardware pertama kali disebut:',
        Type: 'multiple_choice',
        Options: ['Windows OS', 'BIOS / UEFI', 'Device Driver', 'Antivirus'],
        CorrectAnswer: 'BIOS / UEFI',
        Explanation: 'BIOS (Basic Input Output System) / UEFI memeriksa seluruh hardware saat POST (Power On Self Test).',
        Points: 20
      }
    ]
  },
  {
    ExamID: 'EXAM-JK-FINAL',
    CourseID: 'CRS-JK02',
    Title: 'Ujian Akhir Kelulusan: Administrator Jaringan Komputer',
    Description: 'Ujian Sertifikasi Jaringan Komputer LPK Alpha Beta.',
    PassingGrade: 80,
    TimeLimitMinutes: 30,
    Questions: [
      {
        QuestionID: 'EX-JK-01',
        Question: 'Jika IP Address komputer A adalah 192.168.1.10/24 dan Komputer B adalah 192.168.1.20/24, subnet mask keduanya adalah:',
        Type: 'multiple_choice',
        Options: ['255.255.255.0', '255.255.0.0', '255.0.0.0', '255.255.255.255'],
        CorrectAnswer: '255.255.255.0',
        Explanation: 'Prefix /24 setara dengan netmask 255.255.255.0.',
        Points: 50
      },
      {
        QuestionID: 'EX-JK-02',
        Question: 'Perintah utilitas jaringan yang digunakan untuk menguji konektivitas antar dua host IP dinamakan:',
        Type: 'multiple_choice',
        Options: ['ping', 'ipconfig', 'cls', 'format'],
        CorrectAnswer: 'ping',
        Explanation: 'Ping mengirimkan paket ICMP Echo Request untuk menguji respon dari perangkat tujuan.',
        Points: 50
      }
    ]
  }
];

// Initialize and merge curriculum data for all comprehensive courses
const { modules: generatedModules, quizzes: generatedQuizzes, exams: generatedExams } = getAllCurriculumData();

export const INITIAL_MODULES: Module[] = [
  ...BASE_MODULES,
  ...generatedModules.filter(gm => !BASE_MODULES.some(bm => bm.CourseID === gm.CourseID))
];

export const INITIAL_QUIZZES: Quiz[] = [
  ...BASE_QUIZZES,
  ...generatedQuizzes.filter(gq => !BASE_QUIZZES.some(bq => bq.QuizID === gq.QuizID))
];

export const INITIAL_EXAMS: Exam[] = [
  ...BASE_EXAMS,
  ...generatedExams.filter(ge => !BASE_EXAMS.some(be => be.ExamID === ge.ExamID))
];

const BASE_ENROLLMENTS: Enrollment[] = [
  {
    EnrollmentID: 'ENR-001',
    UserID: 'USR-001',
    CourseID: 'CRS-TK01',
    EnrollmentDate: '2026-01-15T10:00:00Z',
    Status: 'Active',
    PaymentStatus: 'Free',
    Progress: 75,
    FinalScore: 0
  },
  {
    EnrollmentID: 'ENR-002',
    UserID: 'USR-003',
    CourseID: 'CRS-TK01',
    EnrollmentDate: '2026-01-06T11:00:00Z',
    Status: 'Completed',
    PaymentStatus: 'Free',
    Progress: 100,
    FinalScore: 92,
    CompletedAt: '2026-01-20T15:30:00Z'
  },
  {
    EnrollmentID: 'ENR-003',
    UserID: 'USR-002',
    CourseID: 'CRS-MO03',
    EnrollmentDate: '2026-02-02T14:00:00Z',
    Status: 'Active',
    PaymentStatus: 'Paid',
    Progress: 40,
    FinalScore: 0
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  ...BASE_ENROLLMENTS,
  ...generatedGraduatedEnrollments,
  ...generatedActiveEnrollments
];

export const INITIAL_PROGRESS: Progress[] = [
  {
    ProgressID: 'PRG-001',
    UserID: 'USR-001',
    CourseID: 'CRS-TK01',
    ModuleID: 'MOD-TK-01',
    ActivityID: 'LES-TK-101',
    Status: 'Completed',
    Score: 100,
    StartedAt: '2026-01-16T08:00:00Z',
    CompletedAt: '2026-01-16T08:15:00Z'
  },
  {
    ProgressID: 'PRG-002',
    UserID: 'USR-001',
    CourseID: 'CRS-TK01',
    ModuleID: 'MOD-TK-01',
    ActivityID: 'LES-TK-102',
    Status: 'Completed',
    Score: 100,
    StartedAt: '2026-01-16T08:20:00Z',
    CompletedAt: '2026-01-16T08:32:00Z'
  },
  {
    ProgressID: 'PRG-003',
    UserID: 'USR-001',
    CourseID: 'CRS-TK01',
    ModuleID: 'MOD-TK-01',
    ActivityID: 'LES-TK-103',
    Status: 'Completed',
    Score: 100,
    StartedAt: '2026-01-16T08:35:00Z',
    CompletedAt: '2026-01-16T08:50:00Z'
  },
  {
    ProgressID: 'PRG-004',
    UserID: 'USR-001',
    CourseID: 'CRS-TK01',
    ModuleID: 'MOD-TK-01',
    ActivityID: 'LES-TK-104',
    Status: 'Completed',
    Score: 100,
    StartedAt: '2026-01-16T09:00:00Z',
    CompletedAt: '2026-01-16T09:10:00Z'
  },
  {
    ProgressID: 'PRG-005',
    UserID: 'USR-001',
    CourseID: 'CRS-TK01',
    ModuleID: 'MOD-TK-02',
    ActivityID: 'LES-TK-201',
    Status: 'Completed',
    Score: 100,
    StartedAt: '2026-01-17T10:00:00Z',
    CompletedAt: '2026-01-17T10:15:00Z'
  },
  {
    ProgressID: 'PRG-006',
    UserID: 'USR-001',
    CourseID: 'CRS-TK01',
    ModuleID: 'MOD-TK-02',
    ActivityID: 'LES-TK-202',
    Status: 'Completed',
    Score: 95,
    StartedAt: '2026-01-17T10:20:00Z',
    CompletedAt: '2026-01-17T10:45:00Z'
  }
];

const BASE_CERTIFICATES: Certificate[] = [
  {
    CertificateID: 'AB-2026-000123',
    UserID: 'USR-003',
    UserName: 'Ruli Lesmana',
    CourseID: 'CRS-TK01',
    CourseTitle: 'Teknisi Komputer & Perakitan PC Profesional',
    FinalScore: 92,
    IssueDate: '2026-01-20',
    InstructorName: 'Roni Nuroni, S.T., MCE',
    DirectorName: 'Ruli Lesmana, S.T., Gr.',
    Status: 'Issued',
    QRCodeData: 'AB-2026-000123|Ruli Lesmana|Teknisi Komputer & Perakitan PC|Score:92',
    VerifyURL: '/verify?cert=AB-2026-000123'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  ...BASE_CERTIFICATES,
  ...generatedGraduatedCertificates
];

export const INITIAL_BADGES: Badge[] = [
  {
    BadgeID: 'BDG-01',
    Name: 'First Lesson',
    Icon: 'BookOpen',
    Description: 'Menyelesaikan modul pembelajaran pertama Anda!',
    XPReward: 100
  },
  {
    BadgeID: 'BDG-02',
    Name: 'Quiz Master',
    Icon: 'Award',
    Description: 'Mendapatkan nilai sempurna 100 pada kuis pembelajaran.',
    XPReward: 200
  },
  {
    BadgeID: 'BDG-03',
    Name: 'Computer Technician',
    Icon: 'Cpu',
    Description: 'Berhasil merakit PC tanpa kesalahan pada Simulator Perakitan PC!',
    XPReward: 300
  },
  {
    BadgeID: 'BDG-04',
    Name: 'Network Expert',
    Icon: 'Network',
    Description: 'Menyelesaikan simulasi topologi jaringan dan ping test.',
    XPReward: 300
  },
  {
    BadgeID: 'BDG-05',
    Name: 'Certified Graduate',
    Icon: 'GraduationCap',
    Description: 'Lulus Ujian Akhir & meraih Sertifikat Resmi Alpha Beta!',
    XPReward: 500
  }
];

export const INITIAL_USER_BADGES: UserBadge[] = [
  { UserBadgeID: 'UBD-01', UserID: 'USR-001', BadgeID: 'BDG-01', EarnedAt: '2026-01-16T08:15:00Z' },
  { UserBadgeID: 'UBD-02', UserID: 'USR-001', BadgeID: 'BDG-03', EarnedAt: '2026-01-17T10:45:00Z' },
  { UserBadgeID: 'UBD-03', UserID: 'USR-003', BadgeID: 'BDG-01', EarnedAt: '2026-01-07T08:00:00Z' },
  { UserBadgeID: 'UBD-04', UserID: 'USR-003', BadgeID: 'BDG-02', EarnedAt: '2026-01-10T09:00:00Z' },
  { UserBadgeID: 'UBD-05', UserID: 'USR-003', BadgeID: 'BDG-05', EarnedAt: '2026-01-20T15:30:00Z' }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    PostID: 'PST-001',
    CourseID: 'CRS-TK01',
    UserID: 'USR-001',
    UserName: 'Budi Santoso',
    UserPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    UserRole: 'PESERTA',
    Title: 'Tanya: Mengapa PC tidak menyala sama sekali setelah tombol power ditekan?',
    Content: 'Saya mencoba merakit PC di rumah, namun ketika tombol power ditekan tidak ada kipas yang berputar dan lampu indikator mati. Langkah troubleshooting apa yang harus saya cek pertama kali?',
    CreatedAt: '2026-02-05T09:00:00Z',
    CommentsCount: 2
  }
];

export const INITIAL_FORUM_COMMENTS: ForumComment[] = [
  {
    CommentID: 'CMT-001',
    PostID: 'PST-001',
    UserID: 'INS-001',
    UserName: 'Roni Nuroni, S.T., MCE',
    UserPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    UserRole: 'INSTRUKTUR',
    Content: 'Halo Budi! Pertama, pastikan saklar I/O di bagian belakang Power Supply (PSU) sudah di posisi I. Kedua, periksa pemasangan kabel Front Panel (Power SW) pada motherboard apakah sudah pas di pin yang tepat. Ketiga, periksa kabel 24-pin ATX.',
    IsBestAnswer: true,
    CreatedAt: '2026-02-05T09:30:00Z'
  },
  {
    CommentID: 'CMT-002',
    PostID: 'PST-001',
    UserID: 'USR-003',
    UserName: 'Ruli Lesmana',
    UserPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    UserRole: 'PESERTA',
    Content: 'Setuju dengan Pak Roni, sering kali jumper Front Panel Power SW salah pin atau kendor!',
    IsBestAnswer: false,
    CreatedAt: '2026-02-05T10:15:00Z'
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    AssignmentID: 'ASN-001',
    CourseID: 'CRS-TK01',
    ModuleID: 'MOD-TK01',
    Title: 'Tugas Mandiri: Analisis Spesifikasi Komputer Kantor & Gaming',
    Instruction: 'Buatlah dokumen ringkas berisi perbandingan spesifikasi hardware untuk PC Kantor (Budget RP 5 Juta) dan PC Gaming/Editing (Budget Rp 15 Juta). Sertakan alasan pemilihan Prosessor, RAM, Storage (SSD NVMe), dan Power Supply.',
    DueDate: '2026-03-01',
    MaxScore: 100
  }
];

export const INITIAL_SUBMISSIONS: AssignmentSubmission[] = [
  {
    SubmissionID: 'SUB-001',
    AssignmentID: 'ASN-001',
    UserID: 'USR-001',
    UserName: 'Budi Santoso',
    CourseID: 'CRS-TK01',
    Content: 'Laporan Tugas Analisis Spesifikasi PC Kantor vs Gaming:\n1. PC Kantor: Core i3 12100, RAM 8GB DDR4, SSD 512GB, PSU 400W 80+\n2. PC Gaming: Ryzen 5 5600, RAM 16GB DDR4, RTX 3060 12GB, SSD NVMe 1TB, PSU 650W Bronze.\nLink Google Drive: https://drive.google.com/file/d/laporan-tugas-analisis-rakit-pc-budi',
    SubmittedAt: '2026-02-10T14:20:00Z',
    Score: 92,
    Feedback: 'Bagus sekali Budi! Penjelasan pemilihan PSU 80+ sudah tepat.',
    Status: 'Lulus'
  }
];

export const INITIAL_EXAM_ATTEMPTS: ExamAttempt[] = [
  {
    AttemptID: 'ATT-001',
    UserID: 'USR-003',
    ExamID: 'EXM-TK01',
    CourseID: 'CRS-TK01',
    AttemptNumber: 1,
    Score: 90,
    Passed: true,
    CompletedAt: '2026-01-20T15:00:00Z'
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    PaymentID: 'PAY-001',
    UserID: 'USR-003',
    UserName: 'Ruli Lesmana',
    CourseID: 'CRS-TK01',
    CourseTitle: 'Teknisi Komputer & Perakitan PC Hardware',
    CertificateID: 'AB-2026-000123',
    Amount: 50000,
    Status: 'PRINTED',
    PaymentDate: '2026-01-21T10:00:00Z',
    Note: 'Pembayaran cetak sertifikat fisik terkonfirmasi via WhatsApp.'
  }
];
