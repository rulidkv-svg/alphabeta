import { PAUD_PROGRAM_DATA } from '../data/paudTrainingData';
import { Certificate } from '../types';

export interface PaudAssignmentSubmission {
  submissionId: string;
  userId: string;
  userName: string;
  userEmail?: string;
  moduleId: string;
  moduleNumber: number;
  assignmentTitle: string;
  fileName?: string;
  fileDataUrl?: string;
  fileType?: string;
  fileSizeMB?: number;
  images?: string[];
  videoUrl?: string;
  textContent?: string;
  notes?: string;
  submittedAt: string;
  status: 'Draft' | 'Submitted' | 'Under Review' | 'Approved' | 'Revision Required';
  score?: number;
  feedback?: string;
  rubricScores?: Record<string, number>;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface PaudQuizResult {
  moduleId: string;
  score: number;
  passed: boolean;
  completedAt: string;
  answers: Record<string, string>;
  attemptsCount: number;
}

export interface PaudStudentProgress {
  userId: string;
  userName: string;
  userEmail?: string;
  enrolledAt: string;
  readMaterials: Record<string, boolean>;
  quizResults: Record<string, PaudQuizResult>;
  submissions: Record<string, PaudAssignmentSubmission>;
  certificate?: {
    certificateId: string;
    certificateNumber: string;
    issueDate: string;
    finalScore: number;
    gradePredikat: string;
    facilitatorName: string;
    directorName: string;
    verifyUrl: string;
    qrCodeData: string;
  };
}

const STORAGE_PREFIX = 'alpha_beta_paud_progress_';
const GLOBAL_SUBMISSIONS_KEY = 'alpha_beta_paud_all_submissions';
const GLOBAL_PARTICIPANTS_KEY = 'alpha_beta_paud_participants';

// Initial Mock Submissions for Facilitator testing
const INITIAL_MOCK_SUBMISSIONS: PaudAssignmentSubmission[] = [
  {
    submissionId: 'SUB-PAUD-001',
    userId: 'PST-002',
    userName: 'Dewi Lestari, S.Pd.',
    userEmail: 'dewi.lestari@paud.sch.id',
    moduleId: 'MOD-PAUD-01',
    moduleNumber: 1,
    assignmentTitle: 'RPPH Berbasis Bermain Bermakna',
    fileName: 'RPPH_Sentra_Bermain_Bermakna_DewiLestari.pdf',
    fileType: 'application/pdf',
    fileSizeMB: 1.4,
    textContent: 'RPPH Topik: "Kebun Sayur Ceria" untuk usia 4-5 tahun. Menitikberatkan pada eksplorasi Loose Parts dedaunan dan timbangan air dengan invitasi main terbuka.',
    submittedAt: '2026-08-10T14:30:00Z',
    status: 'Approved',
    score: 92,
    feedback: 'Luar biasa Bu Dewi! Penataan invitasi main sangat kontekstual dan pertanyaan pemantik yang dirumuskan sudah memenuhi kaidah HOTS sederhana.',
    rubricScores: {
      'Kesesuaian Tujuan Pembelajaran': 24,
      'Rancangan Kegiatan Bermain Bermakna': 28,
      'Kualitas Pertanyaan Pemantik (Open-Ended)': 19,
      'Kreativitas & Kontekstualitas Bahan': 13,
      'Kerapian Sistematika Dokumen': 8
    },
    reviewedAt: '2026-08-11T09:15:00Z',
    reviewedBy: 'Vita Situ Zulaikha, S.Pd., M.Pd.'
  },
  {
    submissionId: 'SUB-PAUD-002',
    userId: 'PST-003',
    userName: 'Nurul Hidayati, S.Pd.AUD',
    userEmail: 'nurul.hidayati@gmail.com',
    moduleId: 'MOD-PAUD-02',
    moduleNumber: 2,
    assignmentTitle: 'Membuat APE dari Bahan Daur Ulang',
    fileName: 'Dokumentasi_APE_Papan_Labirin_Kardus.pdf',
    fileType: 'application/pdf',
    fileSizeMB: 3.2,
    images: [
      'https://images.unsplash.com/photo-1596464716127-f2a829822391?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=500&auto=format&fit=crop&q=80'
    ],
    textContent: 'APE: "Papan Geometri & Labirin Bola Kelereng Sensori" dari tutup kardus sepatu, potongan sedotan kertas, dan tutup botol bekas. Menstimulasi motorik halus dan penalaran spasial.',
    submittedAt: '2026-08-12T10:00:00Z',
    status: 'Under Review',
    notes: 'Mohon masukan untuk aspek keamanan sudut kardus.'
  },
  {
    submissionId: 'SUB-PAUD-003',
    userId: 'PST-004',
    userName: 'Siti Rohimah, S.Pd.',
    userEmail: 'siti.rohimah@tkpertiwi.id',
    moduleId: 'MOD-PAUD-03',
    moduleNumber: 3,
    assignmentTitle: 'Praktik Storytelling untuk Stimulasi Bahasa',
    fileName: 'Video_Storytelling_Kelinci_Pemberani_Siti.mp4',
    fileType: 'video/mp4',
    fileSizeMB: 18.5,
    videoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=500&auto=format&fit=crop&q=80',
    textContent: 'Mendongeng buku "Kelinci Kecil yang Suka Menolong" dengan variasi suara 3 karakter binatang dan media wayang kertas sederhana.',
    submittedAt: '2026-08-13T16:20:00Z',
    status: 'Submitted'
  },
  {
    submissionId: 'SUB-PAUD-004',
    userId: 'PST-005',
    userName: 'Ratna Wulandari, S.Pd.',
    userEmail: 'ratna.wulandari@gmail.com',
    moduleId: 'MOD-PAUD-04',
    moduleNumber: 4,
    assignmentTitle: 'Jurnal Refleksi Disiplin Positif',
    textContent: 'Refleksi pengalaman menangani ananda Farel yang melempar balok saat marah karena menaranya tersenggol. Di masa lalu saya langsung memarahi Farel dan menyuruhnya berdiri. Setelah mempelajari Modul 4, saya menyadari Farel membutuhkan regulasi emosi amigdala. Saya kini memvalidasi perasaannya ("Ibu tahu kamu kecewa"), mengajaknya ke Pojok Tenang, dan menerapkan konsekuensi logis merapikan balok bersama setelah tenang.',
    submittedAt: '2026-08-13T18:00:00Z',
    status: 'Revision Required',
    score: 65,
    feedback: 'Refleksi sudah baik Bu Ratna, namun mohon lengkapi bagian contoh kalimat instruksi positif spesifik yang akan diucapkan kepada Farel saat kejadian berlangsung.',
    reviewedAt: '2026-08-14T08:00:00Z',
    reviewedBy: 'Vita Situ Zulaikha, S.Pd., M.Pd.'
  }
];

export const paudStorageService = {
  // Get all submissions across participants (for Facilitator Panel)
  getAllSubmissions(): PaudAssignmentSubmission[] {
    try {
      const stored = localStorage.getItem(GLOBAL_SUBMISSIONS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      // Ignore
    }
    localStorage.setItem(GLOBAL_SUBMISSIONS_KEY, JSON.stringify(INITIAL_MOCK_SUBMISSIONS));
    return INITIAL_MOCK_SUBMISSIONS;
  },

  saveAllSubmissions(submissions: PaudAssignmentSubmission[]): void {
    try {
      localStorage.setItem(GLOBAL_SUBMISSIONS_KEY, JSON.stringify(submissions));
    } catch (e) {
      // Ignore
    }
  },

  // Get single student progress
  getStudentProgress(userId: string, userName: string, userEmail?: string): PaudStudentProgress {
    const key = `${STORAGE_PREFIX}${userId}`;
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed: PaudStudentProgress = JSON.parse(raw);
        return parsed;
      }
    } catch (e) {
      // Ignore
    }

    // Default clean progress for new student
    const defaultProgress: PaudStudentProgress = {
      userId,
      userName: userName || 'Peserta Guru PAUD',
      userEmail: userEmail || 'guru.paud@alphabeta.edu.eu.org',
      enrolledAt: new Date().toISOString(),
      readMaterials: {},
      quizResults: {},
      submissions: {}
    };

    try {
      localStorage.setItem(key, JSON.stringify(defaultProgress));
    } catch (e) {
      // Ignore
    }
    return defaultProgress;
  },

  saveStudentProgress(progress: PaudStudentProgress): void {
    const key = `${STORAGE_PREFIX}${progress.userId}`;
    try {
      localStorage.setItem(key, JSON.stringify(progress));
    } catch (e) {
      // Ignore
    }
  },

  // Mark material as read
  markMaterialRead(userId: string, userName: string, moduleId: string): PaudStudentProgress {
    const progress = this.getStudentProgress(userId, userName);
    progress.readMaterials[moduleId] = true;
    this.saveStudentProgress(progress);
    return progress;
  },

  // Save Quiz Result
  saveQuizResult(
    userId: string,
    userName: string,
    moduleId: string,
    score: number,
    passed: boolean,
    answers: Record<string, string>
  ): PaudStudentProgress {
    const progress = this.getStudentProgress(userId, userName);
    const existingAttempt = progress.quizResults[moduleId]?.attemptsCount || 0;
    
    progress.quizResults[moduleId] = {
      moduleId,
      score,
      passed,
      completedAt: new Date().toISOString(),
      answers,
      attemptsCount: existingAttempt + 1
    };

    this.saveStudentProgress(progress);
    return progress;
  },

  // Submit or update assignment
  submitAssignment(
    userId: string,
    userName: string,
    userEmail: string | undefined,
    moduleId: string,
    moduleNumber: number,
    assignmentTitle: string,
    submissionData: Partial<PaudAssignmentSubmission>
  ): PaudStudentProgress {
    const progress = this.getStudentProgress(userId, userName, userEmail);
    const submissionId = progress.submissions[moduleId]?.submissionId || `SUB-PAUD-${Date.now()}`;

    const newSubmission: PaudAssignmentSubmission = {
      submissionId,
      userId,
      userName,
      userEmail,
      moduleId,
      moduleNumber,
      assignmentTitle,
      fileName: submissionData.fileName,
      fileDataUrl: submissionData.fileDataUrl,
      fileType: submissionData.fileType,
      fileSizeMB: submissionData.fileSizeMB,
      images: submissionData.images,
      videoUrl: submissionData.videoUrl,
      textContent: submissionData.textContent,
      notes: submissionData.notes,
      submittedAt: new Date().toISOString(),
      status: 'Submitted'
    };

    progress.submissions[moduleId] = newSubmission;
    this.saveStudentProgress(progress);

    // Also update global facilitator list
    const all = this.getAllSubmissions();
    const idx = all.findIndex(s => s.submissionId === submissionId);
    if (idx >= 0) {
      all[idx] = newSubmission;
    } else {
      all.unshift(newSubmission);
    }
    this.saveAllSubmissions(all);

    return progress;
  },

  // Facilitator grades an assignment
  gradeAssignment(
    submissionId: string,
    userId: string,
    moduleId: string,
    status: 'Approved' | 'Revision Required',
    score: number,
    feedback: string,
    rubricScores: Record<string, number>,
    facilitatorName: string
  ): void {
    // 1. Update in student progress
    const progress = this.getStudentProgress(userId, '');
    if (progress.submissions[moduleId]) {
      progress.submissions[moduleId].status = status;
      progress.submissions[moduleId].score = score;
      progress.submissions[moduleId].feedback = feedback;
      progress.submissions[moduleId].rubricScores = rubricScores;
      progress.submissions[moduleId].reviewedAt = new Date().toISOString();
      progress.submissions[moduleId].reviewedBy = facilitatorName;
      this.saveStudentProgress(progress);
    }

    // 2. Update in global list
    const all = this.getAllSubmissions();
    const subIdx = all.findIndex(s => s.submissionId === submissionId);
    if (subIdx >= 0) {
      all[subIdx].status = status;
      all[subIdx].score = score;
      all[subIdx].feedback = feedback;
      all[subIdx].rubricScores = rubricScores;
      all[subIdx].reviewedAt = new Date().toISOString();
      all[subIdx].reviewedBy = facilitatorName;
      this.saveAllSubmissions(all);
    }
  },

  // Check Graduation Eligibility
  checkGraduationEligibility(progress: PaudStudentProgress): {
    eligible: boolean;
    materialsCompletedCount: number;
    materialsPercentage: number;
    quizzesCompletedCount: number;
    quizzesPassedCount: number;
    assignmentsSubmittedCount: number;
    assignmentsApprovedCount: number;
    checklist: {
      materialsDone: boolean;
      allQuizzesDone: boolean;
      allQuizzesPassed: boolean;
      allAssignmentsSubmitted: boolean;
      allAssignmentsApproved: boolean;
    };
    overallProgressPercentage: number;
  } {
    const totalModules = PAUD_PROGRAM_DATA.modules.length; // 4

    // 1. Materials
    let materialsDoneCount = 0;
    PAUD_PROGRAM_DATA.modules.forEach(m => {
      if (progress.readMaterials[m.id]) materialsDoneCount++;
    });
    const materialsDone = materialsDoneCount === totalModules;
    const materialsPercentage = Math.round((materialsDoneCount / totalModules) * 100);

    // 2. Quizzes
    let quizzesDoneCount = 0;
    let quizzesPassedCount = 0;
    PAUD_PROGRAM_DATA.modules.forEach(m => {
      const q = progress.quizResults[m.id];
      if (q) {
        quizzesDoneCount++;
        if (q.passed && q.score >= m.quiz.passingScore) {
          quizzesPassedCount++;
        }
      }
    });
    const allQuizzesDone = quizzesDoneCount === totalModules;
    const allQuizzesPassed = quizzesPassedCount === totalModules;

    // 3. Assignments
    let assignmentsSubmittedCount = 0;
    let assignmentsApprovedCount = 0;
    PAUD_PROGRAM_DATA.modules.forEach(m => {
      const sub = progress.submissions[m.id];
      if (sub && sub.status !== 'Draft') {
        assignmentsSubmittedCount++;
        if (sub.status === 'Approved') {
          assignmentsApprovedCount++;
        }
      }
    });
    const allAssignmentsSubmitted = assignmentsSubmittedCount === totalModules;
    const allAssignmentsApproved = assignmentsApprovedCount === totalModules;

    const eligible = materialsDone && allQuizzesPassed && allAssignmentsApproved;

    // Overall Progress calculation (Weight: Materials 25%, Quizzes 35%, Assignments 40%)
    const materialWeight = (materialsDoneCount / totalModules) * 25;
    const quizWeight = (quizzesPassedCount / totalModules) * 35;
    const assignmentWeight = (assignmentsApprovedCount / totalModules) * 40;
    const overallProgressPercentage = Math.min(100, Math.round(materialWeight + quizWeight + assignmentWeight));

    return {
      eligible,
      materialsCompletedCount: materialsDoneCount,
      materialsPercentage,
      quizzesCompletedCount: quizzesDoneCount,
      quizzesPassedCount,
      assignmentsSubmittedCount,
      assignmentsApprovedCount,
      checklist: {
        materialsDone,
        allQuizzesDone,
        allQuizzesPassed,
        allAssignmentsSubmitted,
        allAssignmentsApproved
      },
      overallProgressPercentage
    };
  },

  // Issue / Claim Certificate
  generateCertificate(userId: string, userName: string): PaudStudentProgress {
    const progress = this.getStudentProgress(userId, userName);
    const eligibility = this.checkGraduationEligibility(progress);

    if (!eligibility.eligible) {
      return progress;
    }

    // Calculate Final Score average from Quizzes & Assignments
    let totalScore = 0;
    let scoreItems = 0;
    PAUD_PROGRAM_DATA.modules.forEach(m => {
      if (progress.quizResults[m.id]) {
        totalScore += progress.quizResults[m.id].score;
        scoreItems++;
      }
      if (progress.submissions[m.id]?.score) {
        totalScore += progress.submissions[m.id].score!;
        scoreItems++;
      }
    });

    const finalScore = scoreItems > 0 ? Math.round(totalScore / scoreItems) : 88;
    let gradePredikat = 'Sangat Baik (A)';
    if (finalScore >= 90) gradePredikat = 'Dengan Pujian / Amat Baik (A+)';
    else if (finalScore >= 80) gradePredikat = 'Sangat Baik (A)';
    else if (finalScore >= 70) gradePredikat = 'Baik (B)';

    const cleanUserNum = userId.replace(/[^0-9]/g, '') || Math.floor(100 + Math.random() * 900).toString();
    const certNumber = `CERT/PAUD/2026/${cleanUserNum.padStart(3, '0')}`;
    const certId = certNumber;
    const issueDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    progress.certificate = {
      certificateId: certId,
      certificateNumber: certNumber,
      issueDate,
      finalScore,
      gradePredikat,
      facilitatorName: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
      directorName: 'Ruli Lesmana, S.T., Gr.',
      verifyUrl: `${window.location.origin}/?view=verify&certNo=${encodeURIComponent(certNumber)}`,
      qrCodeData: `https://alphabeta.edu.eu.org/verify?certNo=${certNumber}&holder=${encodeURIComponent(userName)}&prog=PAUD`
    };

    this.saveStudentProgress(progress);

    // Also register into global certificate repository for universal verification
    try {
      const certsRaw = localStorage.getItem('alpha_beta_certificates');
      const certs: Certificate[] = certsRaw ? JSON.parse(certsRaw) : [];
      const exists = certs.some(c => c.CertificateID === certId || c.CertificateNumber === certNumber);
      if (!exists) {
        const newCert: Certificate = {
          CertificateID: certId,
          CertificateNumber: certNumber,
          UserID: userId,
          UserName: userName,
          CourseID: 'CRS-PAUD01',
          CourseTitle: 'Pelatihan Guru PAUD: Pembelajaran Bermakna, Kreativitas, Tumbuh Kembang & Disiplin Positif',
          FinalScore: finalScore,
          GradePredikat: gradePredikat,
          IssueDate: issueDate,
          GraduationDate: issueDate,
          InstructorName: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
          DirectorName: 'Ruli Lesmana, S.T., Gr.',
          OrganizationName: 'LPK ALPHA BETA (VIN: 20002320503 | NISN: K9980820)',
          Status: 'AKTIF',
          VerifyURL: progress.certificate.verifyUrl,
          QRCodeData: progress.certificate.qrCodeData,
          CreatedAt: new Date().toISOString()
        };
        certs.unshift(newCert);
        localStorage.setItem('alpha_beta_certificates', JSON.stringify(certs));
      }
    } catch (e) {
      // Ignore
    }

    return progress;
  }
};
