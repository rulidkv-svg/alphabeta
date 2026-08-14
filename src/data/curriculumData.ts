import { Module, Lesson, Quiz, Exam, Question, Course } from '../types';
import { COMPREHENSIVE_COURSES } from './coursesData';

// Helper to generate high-quality questions
function makeQuestions(prefix: string, topic: string, items: Array<{ q: string; opts: string[]; a: string; exp: string }>): Question[] {
  return items.map((item, idx) => ({
    QuestionID: `${prefix}-Q${idx + 1}`,
    Question: item.q,
    Type: 'multiple_choice',
    Options: item.opts,
    CorrectAnswer: item.a,
    Explanation: item.exp,
    Points: Math.round(100 / items.length)
  }));
}

// Map of custom curated curricula for specialized flagship courses
export const SPECIALIZED_CURRICULA: Record<string, { modules: Module[]; quizzes: Quiz[]; exams: Exam[] }> = {
  'CRS-TK01': {
    modules: [
      {
        ModuleID: 'MOD-TK-01',
        CourseID: 'CRS-TK01',
        Title: 'Modul 1: Fondasi Hardware & Arsitektur PC Modern',
        Description: 'Mengenal seluruh komponen fisik PC, arsitektur bus, socket processor, dan pemilihan daya PSU standar industri.',
        Order: 1,
        Lessons: [
          {
            ActivityID: 'ACT-TK-101',
            ModuleID: 'MOD-TK-01',
            CourseID: 'CRS-TK01',
            Title: '1.1 Pengenalan Komponen Inti (CPU, Motherboard, RAM, PSU, Storage)',
            Type: 'text',
            Duration: '25 Menit',
            Order: 1,
            XP: 50,
            Content: `🎯 TUJUAN PEMBELAJARAN:
1. Mengidentifikasi fungsi vital CPU, Motherboard, RAM, SSD/HDD, dan PSU.
2. Memahami kompatibilitas socket CPU (LGA vs AM4/AM5) dan chipset motherboard.
3. Menganalisis kebutuhan daya sistem (Wattage Calculation) bersertifikasi 80 Plus.

📖 MATERI PEMBELAJARAN LENGKAP:

A. Central Processing Unit (CPU)
CPU adalah unit pemroses logika dan aritmatika utama dalam sebuah komputer. Saat memilih CPU, teknisi harus memperhatikan:
- Socket Type: Menentukan kecocokan fisik dengan motherboard (misal Intel LGA1700 atau AMD AM5).
- Core & Thread: Menentukan kemampuan multi-tasking dan rendering.
- TDP (Thermal Design Power): Menentukan kapasitas cooler yang dibutuhkan.

B. Motherboard (Mainboard)
Motherboard adalah papan sirkuit utama yang menghubungkan seluruh komponen. Faktor penting meliputi:
- Form Factor: ATX, Micro-ATX (mATX), dan Mini-ITX.
- VRM (Voltage Regulator Module): Menjamin pasokan arus stabil ke CPU.
- Slot Ekspansi: PCIe 4.0/5.0 x16 untuk GPU, slot M.2 NVMe PCIe untuk penyimpanan berkecepatan tinggi.

C. Random Access Memory (RAM)
RAM adalah memori volatile berkecepatan tinggi untuk menyimpan data aplikasi aktif:
- Generasi: DDR4 vs DDR5 (memiliki notch pin berbeda).
- Dual Channel Architecture: Memasang dua modul RAM identik pada slot 2 dan 4 untuk menggandakan bandwidth bus.

D. Power Supply Unit (PSU)
Jantung kelistrikan komputer yang mengonversi arus AC PLN menjadi DC (+12V, +5V, +3.3V):
- Selalu pilih PSU dengan sertifikasi minimal 80 Plus Bronze dengan proteksi OVP, UVP, OCP, dan SCP.

💡 STUDI KASUS LAPANGAN:
Sebuah PC kantor tiba-tiba mati mendadak saat menjalankan aplikasi berat. Setelah dicek menggunakan PSU Tester, jalur 12V mengalami drop tegangan hingga 10.8V. Solusinya adalah mengganti PSU standar bawaan casing dengan PSU bersertifikat 80 Plus 550W.

📝 TUGAS PRAKTIK MANDIRI:
Buatlah daftar inventaris spesifikasi PC untuk kebutuhan administrasi kantor dengan anggaran Rp 6.000.000 mencakup CPU, Motherboard, RAM 16GB, SSD NVMe 512GB, dan PSU 500W Bronze.`,
            PDFURL: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=1200&auto=format&fit=crop&q=80'
          },
          {
            ActivityID: 'ACT-TK-102',
            ModuleID: 'MOD-TK-01',
            CourseID: 'CRS-TK01',
            Title: '1.2 Simulasi Laboratorium Perakitan Hardware PC',
            Type: 'simulator',
            Duration: '30 Menit',
            Order: 2,
            XP: 75,
            SimulatorType: 'pc_assembly',
            Content: `Gunakan Simulator Interaktif Perakitan PC untuk mempraktikkan pemasangan CPU, pengolesan thermal paste, instalasi RAM Dual Channel, pemasangan Cooler, dan kabel Front Panel secara aman.`
          },
          {
            ActivityID: 'ACT-TK-103',
            ModuleID: 'MOD-TK-01',
            CourseID: 'CRS-TK01',
            Title: '1.3 Kuis Evaluasi Pemahaman Hardware & Arsitektur Komputer',
            Type: 'quiz',
            Duration: '15 Menit',
            Order: 3,
            XP: 60,
            QuizID: 'QUIZ-TK-01'
          }
        ]
      },
      {
        ModuleID: 'MOD-TK-02',
        CourseID: 'CRS-TK01',
        Title: 'Modul 2: SOP Perakitan, Manajemen Kabel & Thermal Management',
        Description: 'Langkah demi langkah perakitan komputer sesuai Standar Kompetensi Kerja Nasional Indonesia (SKKNI).',
        Order: 2,
        Lessons: [
          {
            ActivityID: 'ACT-TK-201',
            ModuleID: 'MOD-TK-02',
            CourseID: 'CRS-TK01',
            Title: '2.1 Prosedur K3 (Kesehatan & Keselamatan Kerja) dan Anti-Statis',
            Type: 'text',
            Duration: '20 Menit',
            Order: 1,
            XP: 50,
            Content: `🎯 TUJUAN PEMBELAJARAN:
1. Memahami bahaya Electrostatic Discharge (ESD) terhadap chip IC semikonduktor.
2. Menerapkan SOP K3 di meja kerja teknisi (Anti-static Wrist Strap & Mat).
3. Melakukan tata kelola kabel (Cable Management) untuk kelancaran sirkulasi udara (Airflow).

📖 MATERI LENGKAP:
- Pelepasan Muatan Statis: Sentuh casing logam beraliran ground sebelum memegang motherboard/RAM.
- Pemasangan I/O Shield dan Standoff Screw: Pastikan tidak ada standoff berlebih di bawah motherboard yang dapat menyebabkan korsleting ke ground sasis.
- Pengaplikasian Pasta Termal: Gunakan teknik "Pea Size" (sebesar biji jagung) atau "Cross X" di tengah IHS Processor agar panas tersalur sempurna ke heatsink.
- Manajemen Aliran Udara (Airflow): Posisi kipas depan sebagai Intake (memasukkan udara segar) dan kipas belakang/atas sebagai Exhaust (mengeluarkan udara panas).`
          },
          {
            ActivityID: 'ACT-TK-202',
            ModuleID: 'MOD-TK-02',
            CourseID: 'CRS-TK01',
            Title: '2.2 Kuis Evaluasi Perakitan & Manajemen Thermal',
            Type: 'quiz',
            Duration: '15 Menit',
            Order: 2,
            XP: 60,
            QuizID: 'QUIZ-TK-02'
          }
        ]
      },
      {
        ModuleID: 'MOD-TK-03',
        CourseID: 'CRS-TK01',
        Title: 'Modul 3: Konfigurasi BIOS/UEFI, Instalasi OS & Driver',
        Description: 'Pengaturan Boot Order, TPM 2.0, Secure Boot, partisi GPT/MBR, dan instalasi Windows/Linux terstandar.',
        Order: 3,
        Lessons: [
          {
            ActivityID: 'ACT-TK-301',
            ModuleID: 'MOD-TK-03',
            CourseID: 'CRS-TK01',
            Title: '3.1 Konfigurasi BIOS/UEFI & Instalasi Windows 11 Bersih (Clean Install)',
            Type: 'text',
            Duration: '30 Menit',
            Order: 1,
            XP: 50,
            Content: `🎯 TUJUAN PEMBELAJARAN:
1. Mengakses BIOS/UEFI Setup (tombol DEL / F2).
2. Mengaktifkan XMP/DOCP untuk kecepatan RAM maksimal dan fitur TPM 2.0 / PTT.
3. Membuat bootable USB menggunakan Rufus dengan skema partisi GPT dan target UEFI.
4. Melakukan instalasi OS bersih, partisi drive, dan update driver chipset serta grafis.`
          },
          {
            ActivityID: 'ACT-TK-302',
            ModuleID: 'MOD-TK-03',
            CourseID: 'CRS-TK01',
            Title: '3.2 Troubleshooting BSOD (Blue Screen) & Analisis Beep Code',
            Type: 'text',
            Duration: '25 Menit',
            Order: 2,
            XP: 50,
            Content: `🎯 PANDUAN TROUBLESHOOTING BEP CODE & BSOD:
- 1 Beep Panjang, 2-3 Pendek: Masalah pada VGA / Kartu Grafis.
- Beep Berulang Terus Menerus: Masalah pada modul RAM kotor/rusak.
- BSOD "PAGE_FAULT_IN_NONPAGED_AREA": Indikasi error pada RAM atau driver hardware corrupt.
- BSOD "INACCESSIBLE_BOOT_DEVICE": Masalah controller SATA/NVMe di BIOS (AHCI vs RAID mode).`
          }
        ]
      },
      {
        ModuleID: 'MOD-TK-04',
        CourseID: 'CRS-TK01',
        Title: 'Modul 4: Ujian Akhir Sertifikasi Teknisi Komputer',
        Description: 'Ujian komprehensif kelulusan teori dan praktik untuk penerbitan Sertifikat Resmi Terverifikasi LPK Alpha Beta.',
        Order: 4,
        Lessons: [
          {
            ActivityID: 'ACT-TK-401',
            ModuleID: 'MOD-TK-04',
            CourseID: 'CRS-TK01',
            Title: '4.1 Ujian Akhir Teori & Studi Kasus Troubleshooting PC',
            Type: 'exam',
            Duration: '45 Menit',
            Order: 1,
            XP: 100,
            ExamID: 'EXAM-TK-FINAL'
          }
        ]
      }
    ],
    quizzes: [
      {
        QuizID: 'QUIZ-TK-01',
        CourseID: 'CRS-TK01',
        Title: 'Kuis Modul 1: Hardware & Arsitektur PC',
        Description: 'Uji penguasaan komponen dasar komputer dan fungsinya.',
        PassingGrade: 80,
        Questions: makeQuestions('Q-TK1', 'Hardware', [
          {
            q: 'Komponen yang berfungsi sebagai otak utama pengendali logika dan perhitungan aritmatika pada komputer adalah:',
            opts: ['Motherboard', 'CPU (Central Processing Unit)', 'RAM', 'Power Supply Unit'],
            a: 'CPU (Central Processing Unit)',
            exp: 'CPU memproses seluruh instruksi program dan logika sistem operasi.'
          },
          {
            q: 'Mengapa modul RAM sebaiknya dipasang pada slot 2 dan 4 (Dual Channel) jika menggunakan 2 keping?',
            opts: ['Agar tidak panas', 'Mengaktifkan bus 128-bit untuk menggandakan bandwidth memori', 'Membuat lampu RGB menyala', 'Menghemat konsumsi daya'],
            a: 'Mengaktifkan bus 128-bit untuk menggandakan bandwidth memori',
            exp: 'Konfigurasi Dual Channel mengoptimalkan jalur transmisi data antara memori dan prosesor.'
          },
          {
            q: 'Sertifikasi efisiensi daya pada Power Supply Unit (PSU) yang menjamin efisiensi di atas 80% disebut:',
            opts: ['Gold Standard', '80 Plus Certification', 'Energy Star 5', 'ISO 9001'],
            a: '80 Plus Certification',
            exp: 'Sertifikasi 80 Plus (White, Bronze, Silver, Gold, Platinum) menjamin efisiensi energi minimal 80% pada berbagai beban kerja.'
          },
          {
            q: 'Fungsi utama dari pasta termal (thermal paste) antara CPU dan heatsink adalah:',
            opts: ['Menempelkan CPU agar tidak goyang', 'Mengisi celah mikroskopis udara untuk memaksimalkan konduksi panas', 'Sebagai isolator listrik', 'Mencegah karat'],
            a: 'Mengisi celah mikroskopis udara untuk memaksimalkan konduksi panas',
            exp: 'Udara adalah konduktor panas yang sangat buruk, sehingga celah mikroskopis diisi oleh pasta konduktif termal.'
          }
        ])
      },
      {
        QuizID: 'QUIZ-TK-02',
        CourseID: 'CRS-TK01',
        Title: 'Kuis Modul 2: K3 & SOP Perakitan PC',
        Description: 'Evaluasi keselamatan kerja dan prosedur perakitan.',
        PassingGrade: 80,
        Questions: makeQuestions('Q-TK2', 'Perakitan', [
          {
            q: 'Bahaya utama dari Electrostatic Discharge (ESD) saat memegang komponen komputer adalah:',
            opts: ['Dapat merusak komponen microchip semikonduktor tanpa terlihat', 'Menyebabkan komputer meledak', 'Menghapus data di monitor', 'Menghilangkan garansi casing'],
            a: 'Dapat merusak komponen microchip semikonduktor tanpa terlihat',
            exp: 'Tegangan statis tubuh manusia dapat mencapai ribuan volt yang cukup untuk melubangi jalur sirkuit IC mikro.'
          },
          {
            q: 'Arah aliran kipas (airflow) yang paling ideal untuk sirkulasi udara di casing komputer adalah:',
            opts: ['Semua kipas meniup ke dalam', 'Depan/Bawah Intake (Masuk), Belakang/Atas Exhaust (Keluar)', 'Semua kipas meniup ke luar', 'Kipas hanya di pasang di atas'],
            a: 'Depan/Bawah Intake (Masuk), Belakang/Atas Exhaust (Keluar)',
            exp: 'Prinsip konveksi: udara panas bergerak ke atas dan ke belakang, sehingga ditarik keluar oleh exhaust fan.'
          }
        ])
      }
    ],
    exams: [
      {
        ExamID: 'EXAM-TK-FINAL',
        CourseID: 'CRS-TK01',
        Title: 'Ujian Akhir Kelulusan: Teknisi Komputer & Perakitan PC',
        Description: 'Ujian kelulusan akhir resmi untuk penerbitan Sertifikat Kompetensi Teknisi Komputer Alpha Beta Learning Center.',
        PassingGrade: 80,
        Questions: makeQuestions('EX-TK', 'Sertifikasi Komputer', [
          {
            q: 'Gejala komputer menyala, kipas berputar, namun tidak ada tampilan di layar (No Display) disertai bunyi beep 1 panjang 2 pendek mengindikasikan:',
            opts: ['Kerusakan pada hard disk', 'Masalah pada VGA / Kartu Grafis', 'Keyboard belum dipasang', 'Kipas processor mati'],
            a: 'Masalah pada VGA / Kartu Grafis',
            exp: 'Kode beep standar AMI/Award 1 panjang 2 pendek secara universal menunjukkan kegagalan inisialisasi video adapter.'
          },
          {
            q: 'Format partisi drive yang wajib digunakan untuk instalasi Windows 11 dengan boot mode UEFI dan TPM 2.0 adalah:',
            opts: ['MBR (Master Boot Record)', 'GPT (GUID Partition Table)', 'FAT32', 'Ext4'],
            a: 'GPT (GUID Partition Table)',
            exp: 'UEFI mensyaratkan skema partisi GPT agar fitur Secure Boot dan partisi boot EFI dapat berjalan.'
          },
          {
            q: 'Langkah pertama dalam penanganan komputer yang mengalami Overheating (suhu CPU mencapai 95°C) adalah:',
            opts: ['Menambah kapasitas RAM', 'Memeriksa mounting cooler, membersihkan debu heatsink, dan mengganti thermal paste', 'Mengganti kabel monitor', 'Menginstal ulang Windows'],
            a: 'Memeriksa mounting cooler, membersihkan debu heatsink, dan mengganti thermal paste',
            exp: 'Overheat disebabkan oleh transfer panas yang terhambat akibat pasta kering, debu, atau cooler yang tidak terpasang rapat.'
          },
          {
            q: 'Alat bantu yang digunakan untuk menguji kesehatan jalur tegangan 12V, 5V, dan 3.3V pada Power Supply tanpa menyalakan motherboard adalah:',
            opts: ['Digital Multimeter / PSU Tester', 'Crimping Tool', 'Thermal Gun', 'LAN Tester'],
            a: 'Digital Multimeter / PSU Tester',
            exp: 'PSU Tester memberikan beban simulasi dan mengukur stabilitas voltase serta sinyal Power Good (PG).'
          }
        ])
      }
    ]
  }
};

// Generic smart generator to produce comprehensive curriculum for all other courses
export function generateCurriculumForCourse(course: Course): { modules: Module[]; quizzes: Quiz[]; exams: Exam[] } {
  // If dedicated specialized curriculum exists, return it
  if (SPECIALIZED_CURRICULA[course.CourseID]) {
    return SPECIALIZED_CURRICULA[course.CourseID];
  }

  const cid = course.CourseID;
  const title = course.Title;
  const category = course.CategoryName || 'Pelatihan Vokasi & Keterampilan';
  const instructor = course.InstructorName || 'Belum ditentukan';

  const mod1Id = `MOD-${cid}-01`;
  const mod2Id = `MOD-${cid}-02`;
  const mod3Id = `MOD-${cid}-03`;
  const mod4Id = `MOD-${cid}-04`;

  const quiz1Id = `QUIZ-${cid}-01`;
  const quiz2Id = `QUIZ-${cid}-02`;
  const examId = `EXAM-${cid}-FINAL`;

  const modules: Module[] = [
    {
      ModuleID: mod1Id,
      CourseID: cid,
      Title: `Modul 1: Fondasi & Konsep Inti ${title}`,
      Description: `Pemahaman dasar filosofi, terminologi kunci, standar kompetensi, dan pengenalan alur kerja pada ${title}.`,
      Order: 1,
      Lessons: [
        {
          ActivityID: `ACT-${cid}-101`,
          ModuleID: mod1Id,
          CourseID: cid,
          Title: `1.1 Pengenalan Konsep Dasar & Prinsip Utama ${title}`,
          Type: 'text',
          Duration: '25 Menit',
          Order: 1,
          XP: 50,
          Content: `🎯 TUJUAN PEMBELAJARAN:
1. Memahami latar belakang, urgensi, dan peluang kerja di bidang ${title}.
2. Menguasai terminologi, konsep esensial, dan kerangka kerja profesional.
3. Mengenal standar operasional dan etika kerja di bawah pengampuan ${instructor}.

📖 RINGKASAN MATERI PEMBELAJARAN:
Program pelatihan "${title}" di Alpha Beta Learning Center disusun secara komprehensif untuk membekali peserta dengan keterampilan praktis siap kerja berstandar SKKNI dan industri global.

A. Ruang Lingkup & Kompetensi Kunci:
- Pengenalan alat kerja, software, metodologi, dan mindset profesional.
- Pemahaman standar kualitas output kerja di bidang ${category}.
- Alur kerja sistematis mulai dari perencanaan, eksekusi, hingga pengujian.

B. Langkah-Langkah Praktis:
1. Analisis Kebutuhan: Mengidentifikasi tujuan proyek atau permasalahan nyata.
2. Perancangan & Penyusunan Konsep: Memilih metode, alat, dan material terbaik.
3. Implementasi Terstruktur: Mengeksekusi tugas sesuai SOP dan checklist kualitas.
4. Evaluasi & Perbaikan Berkelanjutan: Melakukan audit hasil kerja dan optimasi.

💡 CONTOH STUDI KASUS NYATA:
Dalam skenario kerja profesional, efisiensi dan ketepatan penerapan standar sangat menentukan kepuasan klien dan pimpinan. Melalui pemahaman materi ini, Anda dapat menyelesaikan tugas dengan tingkat akurasi tinggi dan minim kesalahan.

📝 TUGAS PRAKTIK PEMBELAJARAN:
Buatlah lembar kerja ringkasan mengenai 3 poin kunci yang paling relevan dengan kebutuhan karier Anda dari materi Modul 1 ini.`,
          PDFURL: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop&q=80'
        },
        {
          ActivityID: `ACT-${cid}-102`,
          ModuleID: mod1Id,
          CourseID: cid,
          Title: `1.2 Lembar Kerja Interaktif & Panduan Praktik`,
          Type: 'practice',
          Duration: '30 Menit',
          Order: 2,
          XP: 60,
          PracticeInstructions: `Silakan pelajari dokumen pedoman terlampir, lalu selesaikan simulasi studi kasus mandiri untuk memperkuat pemahaman materi ${title}.`
        },
        {
          ActivityID: `ACT-${cid}-103`,
          ModuleID: mod1Id,
          CourseID: cid,
          Title: `1.3 Kuis Evaluasi Pemahaman Modul 1`,
          Type: 'quiz',
          Duration: '15 Menit',
          Order: 3,
          XP: 60,
          QuizID: quiz1Id
        }
      ]
    },
    {
      ModuleID: mod2Id,
      CourseID: cid,
      Title: `Modul 2: Praktik Terapan, Studi Kasus & Alur Kerja Profesional`,
      Description: `Penerapan metode praktis, studi kasus nyata, dan teknik eksekusi langsung untuk ${title}.`,
      Order: 2,
      Lessons: [
        {
          ActivityID: `ACT-${cid}-201`,
          ModuleID: mod2Id,
          CourseID: cid,
          Title: `2.1 Prosedur Operasional Standar (SOP) & Studi Kasus Terapan`,
          Type: 'text',
          Duration: '35 Menit',
          Order: 1,
          XP: 50,
          Content: `🎯 TUJUAN PEMBELAJARAN:
1. Menerapkan metodologi terbukti dalam menyelesaikan skenario kerja nyata.
2. Memahami teknik pemecahan masalah (troubleshooting & problem solving).
3. Menghasilkan karya/output kerja sesuai standar industri.

📖 MATERI PEMBELAJARAN:
Pada modul ini, peserta diajak untuk membedah langkah demi langkah penerapan praktis ${title}:
- Skenario Kerja 1: Penanganan tugas rutin dan efisiensi waktu.
- Skenario Kerja 2: Penanganan masalah kompleks dan teknik mitigasi risiko.
- Skenario Kerja 3: Kolaborasi tim dan pelaporan hasil kerja secara profesional.

💡 TIPS INSTRUKTUR (${instructor}):
"Kunci keberhasilan dalam menguasai ${title} adalah konsistensi dalam berlatih dan keberanian untuk mempraktikkan setiap konsep secara langsung pada proyek nyata."`
        },
        {
          ActivityID: `ACT-${cid}-202`,
          ModuleID: mod2Id,
          CourseID: cid,
          Title: `2.2 Kuis Evaluasi Praktik Terapan Modul 2`,
          Type: 'quiz',
          Duration: '15 Menit',
          Order: 2,
          XP: 60,
          QuizID: quiz2Id
        }
      ]
    },
    {
      ModuleID: mod3Id,
      CourseID: cid,
      Title: `Modul 3: Penguasaan Tingkat Lanjut & Standarisasi Industri`,
      Description: `Optimalisasi teknik lanjutan, efisiensi alur kerja, integrasi teknologi modern, dan etika profesi.`,
      Order: 3,
      Lessons: [
        {
          ActivityID: `ACT-${cid}-301`,
          ModuleID: mod3Id,
          CourseID: cid,
          Title: `3.1 Optimalisasi Lanjutan & Integrasi Praktik Terbaik (Best Practices)`,
          Type: 'text',
          Duration: '30 Menit',
          Order: 1,
          XP: 50,
          Content: `🎯 TUJUAN PEMBELAJARAN:
1. Memaksimalkan kualitas dan kecepatan penyelesaian tugas.
2. Memanfaatkan tools dan teknologi pendukung terbaru.
3. Mempersiapkan portofolio kompetensi profesional.

📖 PANDUAN PENGUASAAN LANJUTAN:
Pelajari teknik otomasi, standarisasi dokumen, serta evaluasi metrik kinerja untuk memastikan hasil kerja Anda selalu memenuhi ekspektasi tertinggi di dunia kerja.`
        }
      ]
    },
    {
      ModuleID: mod4Id,
      CourseID: cid,
      Title: `Modul 4: Evaluasi Akhir, Ujian Sertifikasi & Kelulusan`,
      Description: `Ujian komprehensif kelulusan untuk memperoleh Sertifikat Resmi Terakreditasi Alpha Beta Learning Center.`,
      Order: 4,
      Lessons: [
        {
          ActivityID: `ACT-${cid}-401`,
          ModuleID: mod4Id,
          CourseID: cid,
          Title: `4.1 Ujian Akhir Sertifikasi Kelulusan: ${title}`,
          Type: 'exam',
          Duration: '45 Menit',
          Order: 1,
          XP: 100,
          ExamID: examId
        }
      ]
    }
  ];

  const quizzes: Quiz[] = [
    {
      QuizID: quiz1Id,
      CourseID: cid,
      Title: `Kuis Modul 1: Konsep & Fondasi ${title}`,
      Description: `Uji pemahaman dasar materi ${title}. Passing grade: 75%.`,
      PassingGrade: 75,
      Questions: makeQuestions(`Q-${cid}-1`, title, [
        {
          q: `Apa tujuan utama dari penerapan metode standar dalam ${title}?`,
          opts: [
            'Memastikan efisiensi, akurasi, dan kualitas hasil kerja yang konsisten',
            'Menambah durasi pengerjaan agar tampak rumit',
            'Hanya sebagai formalitas tanpa fungsi nyata',
            'Mengurangi fleksibilitas kerja tim'
          ],
          a: 'Memastikan efisiensi, akurasi, dan kualitas hasil kerja yang konsisten',
          exp: 'Penerapan standar kerja terbukti meningkatkan produktivitas dan meminimalkan kesalahan operasional.'
        },
        {
          q: `Langkah awal yang paling krusial sebelum memulai proyek pada ${title} adalah:`,
          opts: [
            'Analisis kebutuhan, tujuan, dan perencanaan yang matang',
            'Langsung mengeksekusi tanpa memeriksa petunjuk',
            'Menunggu instruksi tanpa inisiatif',
            'Mengabaikan standar keselamatan dan prosedur'
          ],
          a: 'Analisis kebutuhan, tujuan, dan perencanaan yang matang',
          exp: 'Perencanaan yang baik adalah separuh dari keberhasilan setiap proyek profesional.'
        },
        {
          q: `Manakah sikap profesional yang paling diutamakan saat menghadapi kendala teknis?`,
          opts: [
            'Melakukan analisis sistematis, mencari akar masalah, dan merujuk pada SOP/pedoman',
            'Menyalahkan rekan kerja atau alat kerja',
            'Membiarkan masalah tanpa penanganan',
            'Menghentikan seluruh operasional secara sepihak'
          ],
          a: 'Melakukan analisis sistematis, mencari akar masalah, dan merujuk pada SOP/pedoman',
          exp: 'Pendekatan analitis dan merujuk pada SOP memastikan masalah diselesaikan secara tuntas.'
        },
        {
          q: `Mengapa evaluasi hasil kerja penting dilakukan secara berkala?`,
          opts: [
            'Untuk mengidentifikasi area perbaikan dan menjaga standar mutu tertinggi',
            'Hanya untuk mencari-cari kesalahan teknisi',
            'Tidak memiliki manfaat nyata bagi kemajuan organisasi',
            'Untuk memperlambat rilis produk'
          ],
          a: 'Untuk mengidentifikasi area perbaikan dan menjaga standar mutu tertinggi',
          exp: 'Siklus evaluasi (Plan-Do-Check-Act) adalah fondasi perbaikan berkelanjutan di dunia industri.'
        }
      ])
    },
    {
      QuizID: quiz2Id,
      CourseID: cid,
      Title: `Kuis Modul 2: Praktik Terapan & Studi Kasus ${title}`,
      Description: `Evaluasi pemahaman studi kasus dan alur kerja terapan ${title}.`,
      PassingGrade: 75,
      Questions: makeQuestions(`Q-${cid}-2`, title, [
        {
          q: `Dalam menyelesaikan studi kasus praktis, prioritas utama teknisi/praktisi adalah:`,
          opts: [
            'Ketepatan solusi sesuai kebutuhan dan kepatuhan terhadap standar mutu',
            'Kecepatan tanpa memedulikan akurasi hasil',
            'Menggunakan cara instan yang berisiko',
            'Mengabaikan umpan balik dari pengguna'
          ],
          a: 'Ketepatan solusi sesuai kebutuhan dan kepatuhan terhadap standar mutu',
          exp: 'Kualitas dan kepatuhan terhadap standar adalah jaminan kepuasan jangka panjang.'
        },
        {
          q: `Dokumentasi hasil kerja pada bidang ${category} berfungsi untuk:`,
          opts: [
            'Menyediakan rekam jejak, mempermudah audit, dan panduan pemeliharaan ke depan',
            'Menghabiskan ruang penyimpanan semata',
            'Menyulitkan proses serah terima pekerjaan',
            'Menyembunyikan detail teknis yang penting'
          ],
          a: 'Menyediakan rekam jejak, mempermudah audit, dan panduan pemeliharaan ke depan',
          exp: 'Dokumentasi yang rapi dan terstruktur adalah ciri khas tenaga profesional yang kompeten.'
        }
      ])
    }
  ];

  const exams: Exam[] = [
    {
      ExamID: examId,
      CourseID: cid,
      Title: `Ujian Akhir Kelulusan: ${title}`,
      Description: `Ujian komprehensif kelulusan resmi program ${title} untuk penerbitan Sertifikat Resmi Alpha Beta Learning Center. Passing grade: 75%.`,
      PassingGrade: 75,
      TimeLimitMinutes: 45,
      Questions: makeQuestions(`EX-${cid}`, title, [
        {
          q: `Prinsip utama dalam menerapkan kompetensi ${title} di lingkungan profesional adalah:`,
          opts: [
            'Integritas, kepatuhan pada SOP, orientasi kualitas, dan peningkatan berkelanjutan',
            'Menyelesaikan tugas seadanya tanpa verifikasi ulang',
            'Menolak adaptasi terhadap perkembangan teknologi baru',
            'Bekerja tanpa memedulikan keselamatan dan kenyamanan pengguna'
          ],
          a: 'Integritas, kepatuhan pada SOP, orientasi kualitas, dan peningkatan berkelanjutan',
          exp: 'Integritas dan kepatuhan pada standar mutu adalah pilar utama kompetensi tenaga kerja berdaya saing.'
        },
        {
          q: `Saat terjadi perbedaan ekspektasi atau kesalahan dalam hasil kerja, tindakan yang paling tepat adalah:`,
          opts: [
            'Bertanggung jawab, melakukan verifikasi objektif, dan segera menerapkan tindakan perbaikan (corrective action)',
            'Menutupi kesalahan agar tidak diketahui pihak lain',
            'Menolak bertanggung jawab dan membatalkan proyek',
            'Mengabaikan laporan keluhan'
          ],
          a: 'Bertanggung jawab, melakukan verifikasi objektif, dan segera menerapkan tindakan perbaikan (corrective action)',
          exp: 'Tindakan korektif yang cepat dan transparan mencerminkan profesionalisme tingkat tinggi.'
        },
        {
          q: `Faktor apa yang paling menentukan keunggulan kompetitif lulusan pelatihan ${title}?`,
          opts: [
            'Penguasaan keterampilan praktis, kepemilikan portofolio nyata, dan sertifikasi resmi',
            'Hanya sekadar menghafal teori tanpa praktik',
            'Kemampuan bekerja lambat tanpa target waktu',
            'Tidak memiliki sertifikat kompetensi'
          ],
          a: 'Penguasaan keterampilan praktis, kepemilikan portofolio nyata, dan sertifikasi resmi',
          exp: 'Kombinasi keahlian praktis, bukti karya portofolio, dan sertifikat resmi sangat dihargai di dunia industri.'
        },
        {
          q: `Bagaimana cara menjaga kompetensi ${title} agar selalu relevan dengan perkembangan industri terkini?`,
          opts: [
            'Terus belajar mandiri, mengikuti pelatihan lanjutan, dan aktif dalam komunitas profesional',
            'Merasa sudah cukup dengan ilmu yang lama tanpa pembaruan',
            'Menghindari penggunaan software atau teknologi modern',
            'Berhenti mengasah keterampilan setelah lulus ujian'
          ],
          a: 'Terus belajar mandiri, mengikuti pelatihan lanjutan, dan aktif dalam komunitas profesional',
          exp: 'Lifelong learning (belajar sepanjang hayat) adalah kunci keberlanjutan karier di era digital.'
        }
      ])
    }
  ];

  return { modules, quizzes, exams };
}

// Master accessor for course curriculum
export function getCourseCurriculum(course: Course): { modules: Module[]; quizzes: Quiz[]; exams: Exam[] } {
  return generateCurriculumForCourse(course);
}

// Global registry of all quizzes and exams across all comprehensive courses
let allQuizzesCache: Quiz[] | null = null;
let allExamsCache: Exam[] | null = null;
let allModulesCache: Module[] | null = null;

export function getAllCurriculumData() {
  if (!allQuizzesCache || !allExamsCache || !allModulesCache) {
    const quizzes: Quiz[] = [];
    const exams: Exam[] = [];
    const modules: Module[] = [];

    COMPREHENSIVE_COURSES.forEach(c => {
      const cur = generateCurriculumForCourse(c);
      modules.push(...cur.modules);
      quizzes.push(...cur.quizzes);
      exams.push(...cur.exams);
    });

    allQuizzesCache = quizzes;
    allExamsCache = exams;
    allModulesCache = modules;
  }

  return {
    modules: allModulesCache,
    quizzes: allQuizzesCache,
    exams: allExamsCache
  };
}

export function getCurriculumQuiz(quizId: string): Quiz | undefined {
  const { quizzes } = getAllCurriculumData();
  return quizzes.find(q => q.QuizID === quizId);
}

export function getCurriculumExam(examId: string): Exam | undefined {
  const { exams } = getAllCurriculumData();
  return exams.find(e => e.ExamID === examId);
}
