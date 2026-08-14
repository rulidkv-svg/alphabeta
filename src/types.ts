export type UserRole = 'ADMIN' | 'INSTRUKTUR' | 'PELATIH' | 'PESERTA';
export type UserStatus = 'Aktif' | 'Nonaktif' | 'Pending';
export type VerificationStatus = 'VERIFIED' | 'PENDING_VERIFICATION' | 'SUSPENDED';

export interface AttendanceRecord {
  AttendanceID: string;
  SessionID: string;
  SessionName: string;
  CourseID?: string;
  UserID: string;
  UserName: string;
  Date: string;
  Status: 'Hadir' | 'Izin' | 'Sakit' | 'Alpa';
  Notes?: string;
}

export interface CoachingRecord {
  CoachingID: string;
  CoachID: string;
  CoachName: string;
  StudentName: string;
  StudentID: string;
  Date: string;
  Topic: string;
  CompetencyScore: number;
  Notes: string;
  ActionPlan: string;
  Status: 'Selesai' | 'Jadwal' | 'Tunda';
}

export interface Announcement {
  AnnouncementID: string;
  Title: string;
  Content: string;
  Category: 'Pengumuman' | 'Berita' | 'Jadwal' | 'Sertifikat';
  Author: string;
  Date: string;
  Status: 'Published' | 'Draft';
  TargetRole?: 'SEMUA' | 'PESERTA' | 'INSTRUKTUR' | 'PELATIH';
}

export type OfficialRoleTitle = 'Instruktur Resmi' | 'Pelatih / Coach' | 'Direktur Alpha Beta' | 'Pengelola';

export interface OfficialPersonnel {
  ID: string;
  Name: string;
  Degree?: string;
  RoleTitle: OfficialRoleTitle;
  Expertise: string;
  PhotoURL: string;
  Bio: string;
  Status: 'Aktif' | 'Nonaktif';
  Email?: string;
  Phone?: string;
  OrderNumber: number;
  CreatedAt: string;
  UpdatedAt?: string;
}

export interface User {
  UserID: string;
  Name: string;
  Email: string;
  PasswordHash?: string;
  Role: UserRole;
  Phone: string;
  PhotoURL: string;
  Status: UserStatus;
  VerificationStatus?: VerificationStatus;
  NIK?: string;
  Gender?: 'Laki-laki' | 'Perempuan';
  BirthPlace?: string;
  BirthDate?: string;
  Address?: string;
  Education?: string;
  Occupation?: string;
  Bio?: string;
  Skills?: string[];
  CreatedAt: string;
  LastLogin?: string;
  UpdatedAt?: string;
  XP?: number;
  Level?: number;
}

export interface LoginLog {
  LogID: string;
  UserID: string;
  Email?: string;
  UserName?: string;
  Action?: string;
  LoginTime?: string;
  LogoutTime?: string;
  Timestamp?: string;
  IPAddress?: string;
  Status?: 'SUCCESS' | 'FAILED' | 'LOGGED_OUT';
  DeviceInfo?: string;
  BrowserInfo?: string;
}

export interface UserSession {
  UserID: string;
  Role: UserRole;
  Name: string;
  Email: string;
  Phone: string;
  LoginTime: string;
  SessionStatus: 'ACTIVE' | 'EXPIRED';
  Token: string;
}

export type ProgramTierLevel = 'BASIC' | 'STANDARD' | 'PROFESSIONAL' | 'INTENSIVE' | 'CERTIFICATION';
export type PriceStatus = 'ACTIVE' | 'PROMO' | 'EARLY_BIRD' | 'INACTIVE' | 'ARCHIVED';

export interface ProgramPricing {
  program_id: string;
  tier_level?: ProgramTierLevel;
  duration_jp?: number;
  normal_price: number;
  early_bird_price: number;
  promo_price: number;
  member_price?: number;
  package_price?: number;
  private_price?: number;
  group_price: number;
  institution_price: number;
  corporate_price?: number;
  promo_start?: string;
  promo_end?: string;
  currency: string;
  price_status: PriceStatus;
  inclusions?: string[];
}

export interface PriceHistoryRecord {
  id: string;
  program_id: string;
  program_title: string;
  old_price: number;
  new_price: number;
  old_pricing?: Partial<ProgramPricing>;
  new_pricing?: Partial<ProgramPricing>;
  admin_id: string;
  admin_name: string;
  timestamp: string;
  reason: string;
}

export interface GraduationRules {
  minAttendancePercent: number; // default 80
  requireAllMaterials: boolean; // default true
  minAssignmentScore: number;   // default 75
  minPosttestScore: number;     // default 75
  requireProjectSubmitted: boolean; // default true
  requireEvaluationCompleted: boolean; // default true
}

export interface Course {
  CourseID: string;
  Title: string;
  CategoryID: string;
  CategoryName?: string;
  Subcategory?: string;
  Description: string;
  InstructorID: string;
  InstructorName?: string;
  Thumbnail: string;
  Duration: string;
  DurationJP?: number;
  TierLevel?: ProgramTierLevel;
  Level: 'Pemula' | 'Menengah' | 'Lanjutan' | 'Semua Level' | 'Basic' | 'Standard' | 'Professional' | 'Intensive' | 'Certification';
  Price: number;
  Pricing?: ProgramPricing;
  Rating: number;
  EnrolledCount: number;
  Status: 'Published' | 'Draft';
  HasCertificate: boolean;
  WhatYouWillLearn: string[];
  Prerequisites: string[];
  Inclusions?: string[];
  CreatedAt: string;
  GraduationRules?: GraduationRules;
}

export interface Category {
  CategoryID: string;
  Name: string;
  Icon: string;
  Description: string;
  Subcategories?: string[];
}

export interface Enrollment {
  EnrollmentID: string;
  UserID: string;
  CourseID: string;
  EnrollmentDate: string;
  Status: 'Active' | 'Pending' | 'Completed' | 'Cancelled';
  PaymentStatus: 'Paid' | 'Free' | 'Pending';
  Progress: number; // 0 to 100
  FinalScore: number;
  CompletedAt?: string;
}

export type LessonType = 'pdf' | 'document' | 'presentation' | 'article' | 'text' | 'practice' | 'simulator' | 'quiz' | 'exam' | 'video';

export interface Lesson {
  ActivityID: string;
  ModuleID: string;
  CourseID: string;
  Title: string;
  Type: LessonType;
  Duration: string;
  Order: number;
  Content?: string;
  DocumentURL?: string;
  PDFURL?: string;
  PresentationURL?: string;
  VideoURL?: string;
  PracticeInstructions?: string;
  SimulatorType?: 'pc_assembly' | 'network_lab' | 'hardware_lab' | 'software_lab';
  QuizID?: string;
  ExamID?: string;
  XP: number;
}

export interface Module {
  ModuleID: string;
  CourseID: string;
  Title: string;
  Description: string;
  Order: number;
  Lessons: Lesson[];
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'matching' | 'drag_drop' | 'image_id' | 'case_study';

export interface Question {
  QuestionID: string;
  QuizID?: string;
  ExamID?: string;
  Question: string;
  Type: QuestionType;
  Options?: string[];
  CorrectAnswer: string; // or JSON string for complex
  Explanation: string;
  Points: number;
  ImageURL?: string;
}

export interface Quiz {
  QuizID: string;
  CourseID: string;
  ModuleID?: string;
  Title: string;
  Description: string;
  PassingGrade: number;
  Questions: Question[];
}

export interface QuizResult {
  ResultID: string;
  UserID: string;
  QuizID: string;
  CourseID: string;
  Score: number;
  Passed: boolean;
  Answers: Record<string, string>;
  CompletedAt: string;
}

export interface Exam {
  ExamID: string;
  CourseID: string;
  Title: string;
  Description: string;
  PassingGrade: number; // e.g. 80
  TimeLimitMinutes?: number;
  Questions: Question[];
}

export interface ExamResult {
  ResultID: string;
  UserID: string;
  ExamID: string;
  CourseID: string;
  Score: number;
  Passed: boolean;
  CompletedAt: string;
}

export type ProgressStatus = 'Locked' | 'Available' | 'InProgress' | 'Completed';

export interface Progress {
  ProgressID: string;
  UserID: string;
  CourseID: string;
  ModuleID: string;
  ActivityID: string;
  Status: ProgressStatus;
  Score: number;
  StartedAt: string;
  CompletedAt?: string;
}

export type CertificateStatus =
  | 'BELUM_LULUS'
  | 'LULUS'
  | 'MENUNGGU_PEMBAYARAN'
  | 'MENUNGGU_VERIFIKASI'
  | 'DISETUJUI'
  | 'AKTIF'
  | 'DITOLAK'
  | 'DIBATALKAN'
  | 'REVOKED'
  | 'Issued'
  | 'Revoked';

export interface PaymentConfirmation {
  ConfirmationID: string;
  PayerName: string;
  CourseTitle: string;
  Amount: number;
  TransferDate: string;
  BankName: string;
  ProofURL?: string;
  Note?: string;
  SubmittedAt: string;
}

export interface Certificate {
  CertificateID: string; // e.g. CERT/2026/TK/0001
  CertificateNumber?: string;
  UserID: string;
  UserName: string;
  UserNIK?: string;
  CourseID: string;
  CourseTitle: string;
  TrainingPeriod?: string;
  FinalScore: number;
  GradePredikat?: string;
  IssueDate: string;
  GraduationDate?: string;
  InstructorName: string;
  DirectorName: string;
  OrganizationName?: string;
  Status: CertificateStatus;
  PaymentConfirmation?: PaymentConfirmation;
  RejectionReason?: string;
  RevocationReason?: string;
  RevokedAt?: string;
  QRCodeData?: string;
  VerifyURL?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

export interface Badge {
  BadgeID: string;
  Name: string;
  Icon: string;
  Description: string;
  XPReward: number;
}

export interface UserBadge {
  UserBadgeID: string;
  UserID: string;
  BadgeID: string;
  EarnedAt: string;
}

export interface ForumPost {
  PostID: string;
  CourseID: string;
  UserID: string;
  UserName: string;
  UserPhoto: string;
  UserRole: UserRole;
  Title: string;
  Content: string;
  CreatedAt: string;
  CommentsCount: number;
}

export interface ForumComment {
  CommentID: string;
  PostID: string;
  UserID: string;
  UserName: string;
  UserPhoto: string;
  UserRole: UserRole;
  Content: string;
  IsBestAnswer?: boolean;
  CreatedAt: string;
}

export type ForumTopic = ForumPost;
export type ForumReply = ForumComment;

export type PaymentStatus =
  | 'UNPAID'
  | 'WAITING_CONFIRMATION'
  | 'PAID'
  | 'PROCESSING'
  | 'PRINTED'
  | 'SENT'
  | 'CANCELLED';

export interface Payment {
  PaymentID: string;
  UserID: string;
  UserName: string;
  CourseID: string;
  CourseTitle: string;
  CertificateID: string;
  Amount: number;
  Status: PaymentStatus;
  PaymentDate: string;
  Note?: string;
  ProofURL?: string;
}

export interface Assignment {
  AssignmentID: string;
  CourseID: string;
  ModuleID: string;
  Title: string;
  Instruction: string;
  DueDate?: string;
  MaxScore: number;
}

export type SubmissionStatus = 'Belum Dikerjakan' | 'Dikirim' | 'Diperiksa' | 'Lulus' | 'Perlu Perbaikan';

export interface AssignmentSubmission {
  SubmissionID: string;
  AssignmentID: string;
  UserID: string;
  UserName: string;
  CourseID: string;
  Content: string;
  FileURL?: string;
  SubmittedAt: string;
  Score?: number;
  Feedback?: string;
  Status: SubmissionStatus;
}

export interface ExamAttempt {
  AttemptID: string;
  UserID: string;
  ExamID: string;
  CourseID: string;
  AttemptNumber: number;
  Score: number;
  Passed: boolean;
  CompletedAt: string;
}

export interface AppSettings {
  LPKName: string;
  UnitKerja?: string;
  Tagline: string;
  LogoURL: string;
  KemnakerLogoURL?: string;
  KemdikdasmenLogoURL?: string;
  Email: string;
  SecondaryEmail?: string;
  PhoneWhatsApp: string;
  AdminWhatsApp: string;
  PrintCertificateFee: number;
  Address: string;
  PassingGradeDefault: number;
  DirectorName: string;
  DirectorTitle: string;
  NISN?: string;
  VIN?: string;
  SocialInstagram: string;
  SocialFacebook: string;
  WebsiteURL: string;
  SecondaryWebsite?: string;
  GasWebAppUrl?: string;
  GoogleSheetUrl?: string;
  SpreadsheetId?: string;
  StaffList?: string[];
}

export interface LearningHistory {
  ID: string;
  ParticipantID: string;
  CourseID: string;
  ModuleID?: string;
  ActivityType:
    | 'LOGIN'
    | 'LOGOUT'
    | 'OPEN_COURSE'
    | 'OPEN_MODULE'
    | 'READ_MATERIAL'
    | 'WATCH_VIDEO'
    | 'DOWNLOAD_MATERIAL'
    | 'COMPLETE_MATERIAL'
    | 'START_ASSIGNMENT'
    | 'SUBMIT_ASSIGNMENT'
    | 'RESUBMIT_ASSIGNMENT'
    | 'START_QUIZ'
    | 'COMPLETE_QUIZ'
    | 'ATTEND_MEETING'
    | 'MISS_MEETING'
    | 'CHAT_INSTRUCTOR'
    | 'CHAT_TRAINER'
    | 'RECEIVE_FEEDBACK'
    | 'VIEW_SCORE'
    | 'COMPLETE_COURSE';
  ActivityName: string;
  Status: string;
  Progress: number;
  StartedAt: string;
  CompletedAt?: string;
  Duration?: string;
  Device?: string;
  IPDummy?: string;
  LastAccessed?: string;
  Notes?: string;
}

export interface AssessmentHistory {
  HistoryID: string;
  ParticipantID: string;
  CourseID: string;
  ItemTitle: string;
  ScoreBefore: number;
  ScoreAfter: number;
  EvaluatorName: string;
  Feedback: string;
  Timestamp: string;
}

export interface MessageRecord {
  MessageID: string;
  SenderID: string;
  SenderName: string;
  SenderRole: UserRole;
  ReceiverID: string;
  ReceiverName: string;
  CourseID: string;
  Subject: string;
  Message: string;
  Attachment?: string;
  Timestamp: string;
  ReadStatus: boolean;
  ReplyToMessageID?: string;
  MessageType:
    | 'Pertanyaan Materi'
    | 'Pertanyaan Tugas'
    | 'Permintaan Revisi'
    | 'Feedback'
    | 'Pengingat Deadline'
    | 'Informasi Nilai'
    | 'Konsultasi Proyek'
    | 'Masalah Akses'
    | 'Informasi Meeting'
    | 'Pengumuman Kelulusan';
}

export interface LiveSession {
  SessionID: string;
  CourseID: string;
  Title: string;
  Description?: string;
  Platform: 'GOOGLE_MEET' | 'ZOOM';
  MeetingURL: string;
  MeetingID?: string;
  Passcode?: string;
  HostName?: string;
  InstructorName: string;
  TrainerName?: string;
  Date: string;
  StartTime: string;
  EndTime: string;
  DurationMinutes?: number;
  Status: 'Selesai' | 'Sedang Berlangsung' | 'Terjadwal' | 'Berlangsung';
  Notes?: string;
  RecordingURL?: string;
}

export interface CourseEvaluation {
  EvaluationID: string;
  CourseID: string;
  UserID: string;
  UserName: string;
  RatingMaterial: number; // 1-5
  RatingInstructor: number; // 1-5
  RatingPlatform: number; // 1-5
  FeedbackMaterial?: string;
  FeedbackInstructor?: string;
  Suggestions?: string;
  SubmittedAt: string;
}

export interface MeetingAttendance {
  AttendanceID: string;
  ID?: string;
  ParticipantID: string;
  ParticipantName: string;
  SessionID: string;
  CourseID?: string;
  JoinTime: string;
  LeaveTime: string;
  DurationMinutes: number;
  AttendanceStatus: 'HADIR' | 'TERLAMBAT' | 'TIDAK HADIR' | 'IZIN' | string;
  LateMinutes: number;
  Device: string;
  ParticipationScore?: number;
  RecordingViewed: boolean;
  Notes?: string;
  Date?: string;
}

export interface RecordingView {
  RecordingID: string;
  ParticipantID: string;
  SessionID: string;
  SessionTitle: string;
  WatchedAt: string;
  DurationWatchedMinutes: number;
  Percentage: number;
  Status: 'SELESAI' | 'SEBAGIAN';
}

export interface MeetingInteraction {
  InteractionID: string;
  ParticipantID: string;
  ParticipantName: string;
  SessionID: string;
  Timestamp: string;
  ActionType: 'Bertanya' | 'Menjawab' | 'Chat' | 'Polling' | 'Reaksi' | 'Presentasi' | 'Konsultasi';
  Details: string;
}

export interface NotificationRecord {
  NotificationID: string;
  UserID: string;
  Type:
    | 'Materi Baru'
    | 'Tugas Baru'
    | 'Deadline'
    | 'Tugas Dinilai'
    | 'Revisi'
    | 'Meeting Dimulai'
    | 'Meeting Reminder'
    | 'Nilai Keluar'
    | 'Lulus'
    | 'Pembayaran'
    | 'Sertifikat';
  Title: string;
  Message: string;
  Timestamp: string;
  IsRead: boolean;
  ReadAt?: string;
}

export interface ActivityLogRecord {
  LogID: string;
  UserID: string;
  UserName: string;
  Role: UserRole;
  Action: string;
  TargetParticipantID?: string;
  DataChanged?: string;
  ValueBefore?: string;
  ValueAfter?: string;
  Timestamp: string;
  IPAddress: string;
  Device: string;
}

export interface SystemStats {
  activeStudents: number;
  totalCourses: number;
  graduates: number;
  certificatesIssued: number;
  instructors: number;
}

export interface AITutorMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
}
