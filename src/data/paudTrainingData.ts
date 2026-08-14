export interface PaudQuizQuestion {
  id: string;
  question: string;
  options: { key: 'A' | 'B' | 'C' | 'D'; text: string }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface PaudRubricItem {
  criterion: string;
  weight: number; // e.g. 25 for 25%
  description: string;
}

export interface PaudAssignmentSpec {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  acceptedFormats: string[]; // e.g. ['PDF', 'DOC', 'DOCX']
  maxFileSizeMB: number;
  rubric: PaudRubricItem[];
  hasRichTextEditor?: boolean;
  isMultiImage?: boolean;
  isVideo?: boolean;
}

export interface PaudModuleData {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  objectives: string[];
  readingMaterial: {
    sectionTitle: string;
    sections: {
      letter: string;
      title: string;
      content: string;
      keyPoints?: string[];
      caseStudy?: {
        title: string;
        scenario: string;
        analysis: string;
      };
      practicalTips?: string[];
    }[];
  };
  videoMedia?: {
    title: string;
    description: string;
    duration: string;
    videoUrl: string;
    thumbnailUrl: string;
  };
  reflectionPrompt: string;
  quiz: {
    title: string;
    description: string;
    passingScore: number;
    questions: PaudQuizQuestion[];
  };
  assignment: PaudAssignmentSpec;
}

export interface PaudProgramData {
  id: string;
  name: string;
  tagline: string;
  objective: string;
  skkniLevel: string;
  totalDurationJP: number;
  instructors: {
    name: string;
    role: string;
    nip?: string;
    photo: string;
    bio: string;
  }[];
  modules: PaudModuleData[];
}

export const PAUD_PROGRAM_DATA: PaudProgramData = {
  id: 'PROG-PAUD-2026',
  name: 'Pelatihan Guru PAUD: Pembelajaran Bermakna, Kreativitas, Tumbuh Kembang & Disiplin Positif',
  tagline: 'Guru Hebat, Anak Tumbuh Bahagia dan Bermakna',
  objective: 'Membantu guru PAUD meningkatkan kompetensi dalam merancang pembelajaran yang bermakna, membuat media pembelajaran kreatif, memahami tumbuh kembang anak, memberikan stimulasi bahasa, serta menerapkan disiplin positif tanpa marah dan hukuman.',
  skkniLevel: 'Standar Kompetensi Pendidik PAUD Kemendikdasmen & SKKNI',
  totalDurationJP: 32,
  instructors: [
    {
      name: 'Vita Situ Zulaikha, S.Pd., M.Pd.',
      role: 'Pelatih / Coach Resmi LPK Alpha Beta - Metodologi PAUD & Loose Parts',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
      bio: 'Pakar Pendidikan Anak Usia Dini, Fasilitator Kurikulum Merdeka PAUD, dan Pengembang Media APE Inovatif ramah lingkungan.'
    },
    {
      name: 'Ruli Lesmana, S.T., Gr.',
      role: 'Pimpinan Lembaga & Instruktur Pembina LPK Alpha Beta',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
      bio: 'Pimpinan Lembaga Pelatihan Kerja (LPK) Alpha Beta (NISN: K9980820 | VIN: 20002320503) dengan dedikasi pada standarisasi mutu vokasi dan pelatihan guru.'
    }
  ],
  modules: [
    // ==========================================
    // MODUL 1: BERMAIN BERMAKNA
    // ==========================================
    {
      id: 'MOD-PAUD-01',
      number: 1,
      title: 'Implementasi Bermain Bermakna dalam Kurikulum Merdeka',
      subtitle: 'Fondasi Pembelajaran Berpusat pada Anak & Fasilitasi Eksplorasi Mandiri',
      description: 'Guru memahami konsep bermain bermakna dan mampu merancang kegiatan pembelajaran PAUD yang berpusat pada anak tanpa dominasi instruksi kaku.',
      duration: '8 JP (E-Learning & Praktik RPPH)',
      objectives: [
        'Menjelaskan konsep dasar Kurikulum Merdeka untuk PAUD secara tepat.',
        'Menjelaskan pengertian bermain bermakna (meaningful play).',
        'Membedakan secara kritis antara bermain biasa dan bermain bermakna.',
        'Memahami dan menjalankan peran guru sebagai fasilitator bukan pengendali tunggal.',
        'Merancang kegiatan bermain yang benar-benar berpusat pada anak (child-centered).',
        'Mengurangi instruksi guru yang berlebihan dan menggantinya dengan pertanyaan pemantik (open-ended questions).',
        'Memberikan keleluasaan bagi anak untuk bereksplorasi, berekspresi, dan mengambil inisiatif.'
      ],
      readingMaterial: {
        sectionTitle: 'Materi Komprehensif: Konsep & Praktik Bermain Bermakna',
        sections: [
          {
            letter: 'A',
            title: 'Konsep Dasar Kurikulum Merdeka untuk PAUD',
            content: `Kurikulum Merdeka pada jenjang PAUD menitikberatkan pada pengembangan karakter Profil Pelajar Pancasila dan fondasi holistik anak usia dini. Inti dari kurikulum ini adalah fleksibilitas pembelajaran yang disesuaikan dengan tahap perkembangan, minat alami anak, serta konteks lingkungan lokal satuan pendidikan. Anak tidak dituntut capaian akademik kaku (seperti membaca, menulis, dan berhitung mekanis secara drilling), melainkan distimulasi kecintaan belajarnya melalui eksplorasi nyata yang menggembirakan.`,
            keyPoints: [
              'Fleksibilitas Capaian Pembelajaran (CP) PAUD.',
              'Fokus pada 3 elemen CP: Nilai Agama & Budi Pekerti, Jati Diri, dan Dasar-dasar Literasi, Matematika, Sains, Teknologi, Rekayasa & Seni (STEAM).',
              'Menghilangkan target calistung drilling yang membebani psikologis anak.'
            ]
          },
          {
            letter: 'B',
            title: 'Pembelajaran yang Berpusat pada Anak (Child-Centered Learning)',
            content: `Pembelajaran berpusat pada anak mengakui bahwa anak adalah pembelajar aktif, memiliki rasa ingin tahu alami, dan memiliki hak suara (agency) dalam proses belajarnya. Guru tidak memposisikan diri sebagai "penceramah" yang mengisi wadah kosong, melainkan menyiapkan lingkungan belajar kaya stimulasi (provokasi) yang mengundang anak untuk bertanya, mencoba, gagal, dan menemukan solusi secara mandiri.`,
            keyPoints: [
              'Anak memiliki kebebasan memilih alat dan sudut kegiatan yang diminatinya.',
              'Guru menghargai tempo dan gaya belajar unik setiap individu anak.',
              'Suasana kelas yang aman secara emosional dan fisik untuk bereksplorasi.'
            ]
          },
          {
            letter: 'C',
            title: 'Pengertian Bermain Bermakna (Meaningful Play)',
            content: `Bermain bermakna adalah aktivitas bermain yang melibatkan motivasi intrinsik anak, memberikan kebebasan eksplorasi, menstimulasi proses berpikir tingkat tinggi (Higher Order Thinking Skills sederhana), serta menghubungkan pengalaman bermain dengan pemahaman dunia nyata anak. Dalam bermain bermakna, fokus utama adalah pada PROSES eksplorasi anak, bukan semata-mata hasil akhir produk yang seragam.`,
            keyPoints: [
              'Memiliki tujuan yang dirasakan bermakna oleh anak itu sendiri.',
              'Melibatkan keterlibatan mental, emosional, dan fisik yang mendalam.',
              'Memberikan ruang untuk trial-and-error tanpa takut disalahkan.'
            ]
          },
          {
            letter: 'D',
            title: 'Perbedaan: Bermain Biasa vs Bermain Bermakna',
            content: `Seringkali dijumpai kegiatan di kelas yang berlabel "bermain" namun sebenarnya hanya instruksi mekanis guru. Mari cermati perbedaannya secara mendalam:`,
            keyPoints: [
              'BERMAIN BIASA / TERLALU DIKENDALIKAN GURU: Guru mendikte setiap langkah ("Potong kertas di garis merah, tempel di lingkaran hijau!"), semua anak harus menghasilkan karya yang sama persis, anak pasif menunggu giliran, tidak ada ruang bertanya atau berimajinasi lain.',
              'BERMAIN BERMAKNA: Guru menyediakan bahan beragam (misal berbagai daun, ranting, kertas warna-warni) dan mengajukan pertanyaan pemantik: "Bagaimana cara kita membuat jembatan yang kokoh untuk mobil-mobilan ini?", anak bebas memilih cara, berkolaborasi dengan teman, dan menceritakan idenya.'
            ]
          },
          {
            letter: 'E',
            title: 'Ciri-Ciri Bermain Bermakna',
            content: `Bermain bermakna memiliki karakteristik utama: (1) Menyenangkan dan memicu kegembiraan alami, (2) Bermakna secara kontekstual bagi anak, (3) Melibatkan keterlibatan aktif dan fokus anak (deep engagement), (4) Bersifat iteratif (anak mengulang dan menguji coba cara baru), dan (5) Memberikan interaksi sosial yang sehat.`,
            keyPoints: [
              'Joyful (Menyenangkan)',
              'Meaningful (Bermakna)',
              'Actively Engaging (Keterlibatan Aktif)',
              'Iterative (Iteratif/Eksperimen Berulang)',
              'Socially Interactive (Interaksi Sosial Positif)'
            ]
          },
          {
            letter: 'F',
            title: 'Peran Guru sebagai Fasilitator Pembelajaran',
            content: `Sebagai fasilitator, peran guru berubah dari pemberi perintah menjadi: (1) Penata Lingkungan Main (menyiapkan ragam densitas dan penataan invitasi main yang mengundang), (2) Pengamat Cermat (melakukan observasi dan mencatat minat anak), (3) Pemicu Berpikir (mengajukan pertanyaan terbuka/open-ended), dan (4) Pendamping Empatis (hadir saat anak membutuhkan dukungan regulasi emosi).`,
            practicalTips: [
              'Duduk sejajar dengan mata anak saat berbicara.',
              'Gunakan teknik scaffolding: beri bantuan secukupnya hanya saat anak menemui jalan buntu, lalu biarkan ia melanjutkan sendiri.',
              'Hindari memotong konsentrasi anak yang sedang asyik bereksplorasi.'
            ]
          },
          {
            letter: 'G',
            title: 'Cara Memberikan Stimulasi Tanpa Instruksi Berlebihan',
            content: `Instruksi yang terlalu banyak justru mematikan daya nalar anak. Ganti kalimat instruktif ("Jangan begitu!", "Warnai dulu bunganya!") dengan pertanyaan terbuka pemantik rasa ingin tahu.`,
            practicalTips: [
              'Ganti "Buat rumah seperti punya Ibu guru" menjadi "Kira-kira bangunan apa yang ingin kamu buat hari ini?"',
              'Ganti "Warna langit harus biru" menjadi "Warna apa yang pernah kamu lihat saat matahari terbit?"',
              'Gunakan pertanyaan: "Apa yang terjadi jika...?", "Bagaimana kalau kita coba...?", "Bisa ceritakan apa yang sedang kamu rancang?"'
            ]
          },
          {
            letter: 'H',
            title: 'Contoh Praktik Kegiatan Bermain Bermakna di PAUD',
            content: `Contoh skenario: "Proyek Pasar Tradisional di Kelas". Guru tidak membagikan lembar kerja bergambar sayur, melainkan menata sudut pasar dengan timbangan sederhana dari gantungan baju, uang koin kardus buatan anak, dan aneka dedaunan serta buah lokal. Anak bergantian menjadi penjual, pembeli, penimbang, dan kasir sambil bernegosiasi secara alami.`,
            caseStudy: {
              title: 'Studi Kasus: Dari Mewarnai Pola Menjadi Arsitek Cilik',
              scenario: 'Di TK Melati, Bu Guru Rina biasanya membagikan lembar kerja pola rumah untuk diwarnai krayon. Anak-anak tampak bosan setelah 10 menit dan saling berebut krayon. Bu Rina kemudian mengubah pendekatan: ia meletakkan aneka balok kayu, kardus bekas susu, dan dedaunan di karpet dengan pertanyaan: "Bisakah kita membangun tempat tinggal yang nyaman untuk kelinci peliharaan kita?"',
              analysis: 'Hasilnya: Anak-anak berdiskusi selama 45 menit penuh semangat, saling bekerja sama menumpuk balok, mengukur pintu masuk kelinci, dan menceritakan detail ruangannya. Inilah perubahan dari bermain pasif menjadi bermain bermakna!'
            }
          }
        ]
      },
      videoMedia: {
        title: 'Video Simulasi: Penataan Invitasi Main Bermakna Kurikulum Merdeka',
        description: 'Tonton bagaimana guru menata 4 sudut invitasi main interaktif dan menggunakan pertanyaan pemantik terbuka untuk membangkitkan inisiatif anak.',
        duration: '06:45 Menit',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&auto=format&fit=crop&q=80'
      },
      reflectionPrompt: 'Refleksikan kegiatan mengajar Anda minggu ini: Apakah kegiatan bermain di kelas Anda masih didominasi perintah langkah-demi-langkah guru, atau sudah memberi ruang anak untuk mengambil inisiatif dan menentukan caranya sendiri?',
      quiz: {
        title: 'Kuis Evaluasi Modul 1: Konsep & Praktik Bermain Bermakna',
        description: 'Jawablah 10 pertanyaan pilihan ganda berikut untuk menguji pemahaman Anda terhadap prinsip Kurikulum Merdeka dan Bermain Bermakna.',
        passingScore: 70,
        questions: [
          {
            id: 'Q1-01',
            question: 'Apa filosofi utama Kurikulum Merdeka pada jenjang Pendidikan Anak Usia Dini (PAUD)?',
            options: [
              { key: 'A', text: 'Mengharuskan seluruh anak menguasai membaca, menulis, dan berhitung sebelum masuk SD.' },
              { key: 'B', text: 'Pembelajaran yang fleksibel, menyenangkan, dan berpusat pada perkembangan alami serta minat anak.' },
              { key: 'C', text: 'Menerapkan jadwal belajar seragam dan instruksi satu arah dari guru.' },
              { key: 'D', text: 'Memperbanyak lembar kerja siswa (LKS) berbentuk mewarnai pola garis.' }
            ],
            correctAnswer: 'B',
            explanation: 'Kurikulum Merdeka PAUD menekankan pembelajaran berpusat pada anak yang fleksibel dan menggembirakan, bukan drilling akademik kaku.'
          },
          {
            id: 'Q1-02',
            question: 'Manakah dari pernyataan berikut yang paling tepat mendefinisikan "Bermain Bermakna" (Meaningful Play)?',
            options: [
              { key: 'A', text: 'Aktivitas bermain yang sepenuhnya diatur langkah-langkahnya oleh guru demi mencapai hasil produk yang sama.' },
              { key: 'B', text: 'Bermain bebas tanpa pengawasan dan tanpa persiapan lingkungan oleh guru.' },
              { key: 'C', text: 'Aktivitas bermain yang melibatkan motivasi intrinsik anak, memicu eksplorasi, penalaran, dan relevan dengan dunia anak.' },
              { key: 'D', text: 'Kegiatan mengerjakan soal-soal hitungan matematika sambil bernyanyi bersama.' }
            ],
            correctAnswer: 'C',
            explanation: 'Bermain bermakna menekankan motivasi intrinsik, rasa ingin tahu alami, proses bernalar, dan relevansi bagi anak.'
          },
          {
            id: 'Q1-03',
            question: 'Dalam konsep bermain bermakna, apa fokus utama yang dinilai oleh guru PAUD?',
            options: [
              { key: 'A', text: 'Kerapian dan kesamaan hasil karya akhir anak dengan contoh buatan guru.' },
              { key: 'B', text: 'Kecepatan anak menyelesaikan tugas sebelum waktu istirahat tiba.' },
              { key: 'C', text: 'Kepatuhan anak dalam mengikuti setiap instruksi kata per kata.' },
              { key: 'D', text: 'Proses eksplorasi, ide, kreativitas, dan daya nalar anak selama beraktivitas.' }
            ],
            correctAnswer: 'D',
            explanation: 'Fokus utama bermain bermakna terletak pada proses eksplorasi dan pemikiran anak, bukan keseragaman produk akhir.'
          },
          {
            id: 'Q1-04',
            question: 'Manakah contoh peran guru sebagai FASILITATOR yang benar saat anak sedang bermain balok?',
            options: [
              { key: 'A', text: 'Mengambil alih balok dan menyusunkan bentuk gedung yang bagus untuk anak.' },
              { key: 'B', text: 'Duduk mengamati lalu bertanya: "Bagaimana cara membuat bagian bawah menara ini agar tidak mudah roboh saat ditambah balok atas?"' },
              { key: 'C', text: 'Memarahi anak saat menara baloknya terjatuh karena menyenggol meja.' },
              { key: 'D', text: 'Menyuruh anak membongkar balok dan menggantinya dengan buku mewarnai.' }
            ],
            correctAnswer: 'B',
            explanation: 'Fasilitator mengajukan pertanyaan pemantik terbuka (open-ended question) untuk memancing penalaran anak mencari solusi.'
          },
          {
            id: 'Q1-05',
            question: 'Manakah kegiatan di bawah ini yang tergolong "Bermain yang Terlalu Dikendalikan Guru" (Bukan bermain bermakna)?',
            options: [
              { key: 'A', text: 'Guru membagikan pola apel yang sudah digaris, lalu mewajibkan semua anak menempelkan kertas merah di dalam garis tanpa boleh warna lain.' },
              { key: 'B', text: 'Guru menyediakan aneka daun kering, ranting, dan kancing untuk anak membuat representasi kebun impian mereka.' },
              { key: 'C', text: 'Anak bereksperimen mencampur air dengan pewarna alami untuk melihat perubahan warna.' },
              { key: 'D', text: 'Anak bermain peran di sudut toko buah dan menghitung jumlah jeruk dengan biji saga.' }
            ],
            correctAnswer: 'A',
            explanation: 'Mewajibkan pola seragam tanpa pilihan pilihan warna atau bentuk mematikan inisiatif dan kreativitas anak.'
          },
          {
            id: 'Q1-06',
            question: 'Apa dampak negatif jika guru PAUD terlalu banyak memberikan instruksi searah di kelas?',
            options: [
              { key: 'A', text: 'Anak menjadi sangat kreatif dan berani mengambil risiko belajar.' },
              { key: 'B', text: 'Anak menjadi pasif, takut salah, dan bergantung pada perintah guru untuk memulai sesuatu.' },
              { key: 'C', text: 'Anak mampu menyelesaikan masalah secara mandiri dengan cepat.' },
              { key: 'D', text: 'Anak lebih aktif berkolaborasi dengan teman sebayanya.' }
            ],
            correctAnswer: 'B',
            explanation: 'Instruksi berlebihan menciptakan ketergantungan psikologis dan membatasi keberanian bereksplorasi.'
          },
          {
            id: 'Q1-07',
            question: 'Manakah yang merupakan ciri-ciri pertanyaan pemantik terbuka (Open-Ended Question)?',
            options: [
              { key: 'A', text: 'Pertanyaan yang hanya bisa dijawab "Ya" atau "Tidak".' },
              { key: 'B', text: 'Pertanyaan yang mendorong anak untuk berpikir, menganalisis, dan memberikan jawaban beragam sesuai imajinasinya.' },
              { key: 'C', text: 'Pertanyaan untuk menguji apakah anak sudah hafal rumus matematika.' },
              { key: 'D', text: 'Pertanyaan yang hanya memiliki satu kunci jawaban mutlak dari buku panduan.' }
            ],
            correctAnswer: 'B',
            explanation: 'Pertanyaan terbuka membuka ruang berpikir luas tanpa membatasi jawaban anak pada satu kata benar/salah.'
          },
          {
            id: 'Q1-08',
            question: 'Studi Kasus: Saat kegiatan seni, Andi memilih menggambar dinosaurus bertanduk tiga padahal tema hari itu adalah "Binatang Ternak". Respon fasilitator yang bijak adalah...',
            options: [
              { key: 'A', text: 'Menghukum Andi dan menyobek kertas gambarnya agar menggambar sapi.' },
              { key: 'B', text: 'Memuji imajinasinya lalu bertanya: "Wah hebat sekali tanduknya! Ceritakan pada Ibu, bagaimana jika dinosaurus ini berteman dengan kambing di peternakan?"' },
              { key: 'C', text: 'Memberi nilai nol karena tidak sesuai instruksi silabus.' },
              { key: 'D', text: 'Menyuruh teman-temannya menertawakan gambar Andi.' }
            ],
            correctAnswer: 'B',
            explanation: 'Menghargai minat anak dan menghubungkannya dengan konteks tema melalui dialog positif.'
          },
          {
            id: 'Q1-09',
            question: 'Apa yang dimaksud dengan "Scaffolding" dalam fasilitasi belajar PAUD?',
            options: [
              { key: 'A', text: 'Memberikan dukungan atau bantuan bertahap saat anak kesulitan, lalu menguranginya secara perlahan seiring anak mampu mandiri.' },
              { key: 'B', text: 'Mengerjakan seluruh tugas anak agar hasilnya sempurna saat dipajang.' },
              { key: 'C', text: 'Membiarkan anak sendirian tanpa pengawasan sama sekali.' },
              { key: 'D', text: 'Membuat jadwal hukuman jika anak tidak menyelesaikan tugas.' }
            ],
            correctAnswer: 'A',
            explanation: 'Scaffolding adalah teknik pendampingan bertahap dari Lev Vygotsky untuk mendukung Zone of Proximal Development (ZPD).'
          },
          {
            id: 'Q1-10',
            question: 'Mengapa penyediaan sudut invitasi main dengan berbagai pilihan alat sangat penting di kelas PAUD Merdeka?',
            options: [
              { key: 'A', text: 'Agar guru bisa beristirahat santai tanpa perlu mengamati anak.' },
              { key: 'B', text: 'Untuk memberikan kesempatan bagi anak menentukan minat belajarnya sendiri (agency/suara anak).' },
              { key: 'C', text: 'Agar kelas terlihat sangat ramai dan berantakan setiap hari.' },
              { key: 'D', text: 'Sebagai syarat formalitas foto administrasi akreditasi semata.' }
            ],
            correctAnswer: 'B',
            explanation: 'Invitasi main multi-pilihan menumbuhkan kemandirian, agensi anak, dan motivasi belajar alami.'
          }
        ]
      },
      assignment: {
        id: 'TASK-PAUD-01',
        title: 'RPPH Berbasis Bermain Bermakna',
        description: 'Rancanglah Rencana Pelaksanaan Pembelajaran Harian (RPPH / Modul Ajar Harian) sederhana berpusat pada satu kegiatan bermain bermakna yang mengutamakan eksplorasi anak.',
        instructions: [
          'Tentukan tema/topik pembelajaran yang kontekstual dan menarik bagi anak usia 4-6 tahun.',
          'Rumuskan tujuan pembelajaran yang mencakup minimal 2 aspek perkembangan (misal: kognitif & motorik halus atau sosial emosional).',
          'Rancang deskripsi penataan lingkungan main (invitasi main) dan alat/bahan yang disediakan.',
          'Tuliskan minimal 3 contoh pertanyaan pemantik terbuka (open-ended questions) yang akan diajukan guru.',
          'Jelaskan alur kegiatan: Pembukaan (apersepsi), Inti (eksplorasi bermain bermakna), dan Penutup (refleksi bersama anak).',
          'Unggah dokumen rencana pembelajaran dalam format PDF, DOC, atau DOCX (maksimal 10 MB).'
        ],
        acceptedFormats: ['PDF', 'DOC', 'DOCX'],
        maxFileSizeMB: 10,
        hasRichTextEditor: true,
        rubric: [
          { criterion: 'Kesesuaian Tujuan Pembelajaran', weight: 25, description: 'Tujuan terukur, relevan dengan Capaian Pembelajaran PAUD dan karakteristik usia anak.' },
          { criterion: 'Rancangan Kegiatan Bermain Bermakna', weight: 30, description: 'Kegiatan berpusat pada anak, memicu inisiatif, eksplorasi, dan bukan instruksi drilling kaku.' },
          { criterion: 'Kualitas Pertanyaan Pemantik (Open-Ended)', weight: 20, description: 'Pertanyaan memicu daya nalar kritis, imajinasi, dan penalaran tingkat tinggi sederhana.' },
          { criterion: 'Kreativitas & Kontekstualitas Bahan', weight: 15, description: 'Memanfaatkan media beragam dan dekat dengan lingkungan keseharian anak.' },
          { criterion: 'Kerapian Sistematika Dokumen', weight: 10, description: 'Format tersusun rapi, bahasa komunikatif, jelas, dan mudah diimplementasikan.' }
        ]
      }
    },

    // ==========================================
    // MODUL 2: LOOSE PARTS (BAHAN DAUR ULANG)
    // ==========================================
    {
      id: 'MOD-PAUD-02',
      number: 2,
      title: 'Kreasi Media Pembelajaran dari Bahan Daur Ulang (Loose Parts)',
      subtitle: 'Membuat APE Inovatif, Ekonomis, Aman, & Multi-Sensori dari Lingkungan Sekitar',
      description: 'Mendorong guru membuat media pembelajaran kreatif, murah, aman, dan menarik menggunakan bahan lepasan yang tersedia di lingkungan sekitar.',
      duration: '8 JP (E-Learning, Workshop Pembuatan APE & Portofolio)',
      objectives: [
        'Memahami konsep dan filosofi dasar Loose Parts (bahan lepasan).',
        'Mengenali aneka jenis bahan lepasan di alam dan limbah daur ulang yang dapat digunakan.',
        'Memilih dan menyiapkan bahan daur ulang yang bersih, aman, tidak tajam, dan tidak beracun.',
        'Membuat media pembelajaran / Alat Permainan Edukatif (APE) sederhana secara mandiri.',
        'Menghubungkan penggunaan media Loose Parts dengan 6 aspek perkembangan holistik anak.',
        'Merancang skenario kegiatan bermain terbuka (open-ended) menggunakan Loose Parts.'
      ],
      readingMaterial: {
        sectionTitle: 'Materi Komprehensif: Pemanfaatan Loose Parts dalam Pembelajaran PAUD',
        sections: [
          {
            letter: 'A',
            title: 'Pengertian Loose Parts dalam PAUD',
            content: `Konsep Loose Parts pertama kali diperkenalkan oleh arsitek Simon Nicholson pada tahun 1971. Loose Parts adalah benda-benda lepasan, dapat dipindahkan, digabungkan, dipisahkan, disejajarkan, dan diubah bentuknya secara bebas oleh anak tanpa aturan baku yang kaku. Berbeda dengan mainan pabrikan plastik satu fungsi (seperti pistol mainan atau mobil remote), Loose Parts tidak memiliki instruksi tunggal sehingga memicu imajinasi tanpa batas.`,
            keyPoints: [
              'Bahan lepasan yang fleksibel dan serbaguna.',
              'Menumbuhkan rasa kepemilikan dan kreativitas tanpa batas (open-ended).',
              'Sangat hemat biaya dan ramah lingkungan.'
            ]
          },
          {
            letter: 'B',
            title: 'Prinsip Dasar Penggunaan Bahan Lepasan',
            content: `Prinsip utama Loose Parts adalah "Open-Ended" (terbuka). Sebuah tutup botol bisa menjadi roda mobil hari ini, koin uang di toko esok hari, mata boneka lusa, atau media menyusun pola matematika. Tidak ada kata "salah" dalam cara anak menyusun Loose Parts.`,
            keyPoints: [
              'Fleksibilitas tak terbatas (dapat diubah-ubah sesuai imajinasi anak).',
              'Mendukung Higher Order Thinking Skills (HOTS) melalui eksperimen langsung.',
              'Menumbuhkan kesadaran ekologis dan cinta lingkungan sejak dini.'
            ]
          },
          {
            letter: 'C',
            title: 'Jenis-Jenis Bahan Loose Parts & Standar Keselamatan Wajib',
            content: `Bahan Loose Parts diklasifikasikan ke dalam 7 kategori utama: (1) Bahan alam (daun kering, ranting halus, batu kerikil licin, biji-bijian, cangkang kerang), (2) Bahan kayu & bambu (stik es krim, potongan balok halus, pasak kayu), (3) Bahan plastik aman (tutup botol aneka warna, corong, sedotan kertas/plastik tumpul, wadah bekas bersih), (4) Bahan logam tumpul (tutup toples kaleng tanpa gerigi tajam, sendok takar), (5) Bahan kaca/keramik tumpul tebal dengan pengawasan, (6) Bahan kain & serat (perca kain, benang wol, tali rami, pita), dan (7) Bahan kemasan kardus & gulungan kertas (karton tisu gulung, kotak sereal, kardus sepatu).`,
            practicalTips: [
              'STANDAR KESELAMATAN WAJIB:',
              '1. Bersih & Higienis: Cuci dan desinfeksi seluruh wadah bekas sebelum diberikan ke anak.',
              '2. Tidak Tajam / Kasar: Pastikan tidak ada tepi kaleng berkarat, paku, atau serpihan kaca tajam.',
              '3. Tidak Beracun: Bebas dari sisa zat kimia pembersih, pestisida, atau cat timbal berbahaya.',
              '4. Ukuran Sesuai Usia: Untuk anak di bawah 3 tahun, hindari benda berdiameter < 3 cm yang berisiko tertelan/tersedak (choking hazard).',
              '5. Pengawasan Penuh Guru: Guru selalu hadir mendampingi selama sesi eksplorasi bahan lepasan.'
            ]
          },
          {
            letter: 'D',
            title: 'Loose Parts untuk Perkembangan Motorik Kasar & Halus',
            content: `Aktivitas meronce tutup botol, menjepit pom-pom kain dengan penjepit jemuran, atau menyusun menara stik es krim melatih koordinasi mata-tangan dan kekuatan otot jemari (kekuatan genggaman pincer grasp yang penting sebagai fondasi memegang pensil kelak).`,
            keyPoints: [
              'Meronce dan menjepit melatih motorik halus.',
              'Mengangkat dan memindahkan kardus besar melatih motorik kasar dan proprioseptif.'
            ]
          },
          {
            letter: 'E',
            title: 'Loose Parts untuk Perkembangan Kognitif & Literasi-Numerasi',
            content: `Loose Parts adalah media konkret terbaik untuk konsep pra-matematika: mengelompokkan (klasifikasi warna/ukuran), membuat pola berulang (seriasi AB-AB), menghitung jumlah konkret (one-to-one correspondence), dan konsep pengukuran panjang/berat. Untuk literasi, anak dapat membentuk huruf dari susunan kerikil atau daun.`,
            keyPoints: [
              'Belajar matematika dari konkret ke abstrak.',
              'Pengenalan bentuk huruf dan geometri melalui sensori taktil.'
            ]
          },
          {
            letter: 'F',
            title: 'Loose Parts untuk Perkembangan Bahasa & Sosial-Emosional',
            content: `Ketika anak membuat karya dari Loose Parts, mereka dengan antusias menceritakan narasi di balik karyanya ("Ini kapal selam penyelamat lumba-lumba"). Dalam kerja kelompok, mereka belajar bernegosiasi membagi bahan, melatih kesabaran antre, dan menghargai karya teman.`,
            keyPoints: [
              'Memperkaya kosakata deskriptif (tekstur kasar/halus, berat/ringan, panjang/pendek).',
              'Mengembangkan kemampuan regulasi diri dan kerja sama.'
            ]
          },
          {
            letter: 'G',
            title: 'Contoh APE Sederhana yang Dapat Dibuat Guru',
            content: `Contoh kreasi: "Papan Geometri & Labirin Bola Kelereng dari Tutup Kardus Sepatu". Cukup gunakan tutup kardus sepatu bekas, tempelkan potongan sedotan sebagai dinding labirin, dan gunakan kelereng atau bola kertas. Anak memiringkan kotak untuk melatih keseimbangan motorik dan konsentrasi.`,
            caseStudy: {
              title: 'Studi Kasus: Dari Sampah Dapur Menjadi Laboratorium Warna',
              scenario: 'Di PAUD Bintang Kecil, Bu Guru Maya mengumpulkan botol plastik air mineral bekas, minyak goreng sisa, pewarna makanan alami dari kunyit dan bunga telang. Anak-anak diajak membuat Sensory Bottle bertema gelombang samudra.',
              analysis: 'Media ini tidak hanya menenangkan emosi anak yang sedang cemas, namun juga menjadi media eksperimen sains mengenalkan sifat cairan yang tidak menyatu (air dan minyak) dengan biaya hampir Rp 0!'
            }
          }
        ]
      },
      videoMedia: {
        title: 'Video Panduan: 10 Ide Kreasi APE Loose Parts Murah & Aman',
        description: 'Tutorial langkah demi langkah mengolah tutup botol, kardus bekas, dan bahan alam menjadi media belajar interaktif berstandar aman untuk kelas PAUD.',
        duration: '08:15 Menit',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1596464716127-f2a829822391?w=600&auto=format&fit=crop&q=80'
      },
      reflectionPrompt: 'Amatilah lingkungan sekolah atau rumah Anda: Bahan bekas apa saja yang sering dibuang padahal sangat potensial dan aman jika diubah menjadi media stimulasi sensori motorik anak?',
      quiz: {
        title: 'Kuis Evaluasi Modul 2: Pemanfaatan & Keselamatan Loose Parts',
        description: 'Jawablah 10 pertanyaan berikut untuk menguji pemahaman Anda mengenai klasifikasi bahan, aspek perkembangan, dan standar keselamatan Loose Parts.',
        passingScore: 70,
        questions: [
          {
            id: 'Q2-01',
            question: 'Apa karakteristik utama dari media pembelajaran Loose Parts yang membedakannya dari mainan pabrikan konvensional?',
            options: [
              { key: 'A', text: 'Harganya selalu mahal dan harus diimpor dari luar negeri.' },
              { key: 'B', text: 'Bersifat open-ended (terbuka), dapat dipindahkan, digabungkan, dan diubah bentuknya tanpa aturan tunggal.' },
              { key: 'C', text: 'Hanya bisa dimainkan dengan baterai dan layar sentuh.' },
              { key: 'D', text: 'Hanya boleh digunakan untuk anak jenjang Sekolah Dasar.' }
            ],
            correctAnswer: 'B',
            explanation: 'Sifat open-ended adalah kunci Loose Parts yang memungkinkan anak bereksplorasi tanpa batasan imajinasi.'
          },
          {
            id: 'Q2-02',
            question: 'Pasangkan bahan dengan aspek perkembangan: Kegiatan meronce tutup botol bekas yang dilubangi tengahnya paling dominan menstimulasi aspek...',
            options: [
              { key: 'A', text: 'Motorik kasar (berlari dan melompat)' },
              { key: 'B', text: 'Motorik halus dan koordinasi mata-tangan' },
              { key: 'C', text: 'Hanya aspek musik dan tarik suara' },
              { key: 'D', text: 'Kebugaran jasmani kardiovaskular' }
            ],
            correctAnswer: 'B',
            explanation: 'Meronce melatih koordinasi mata-tangan dan kekuatan otot-otot jari tangan (motorik halus).'
          },
          {
            id: 'Q2-03',
            question: 'Pasangkan bahan dengan aspek perkembangan: Menyusun aneka kardus bekas menjadi menara tinggi yang seimbang paling dominan melatih...',
            options: [
              { key: 'A', text: 'Kognitif (pemecahan masalah, keseimbangan, konsep spasial) dan kreativitas' },
              { key: 'B', text: 'Hanya kemampuan membaca abjad' },
              { key: 'C', text: 'Pengucapan kosakata bahasa asing' },
              { key: 'D', text: 'Menghafal nama-nama pahlawan' }
            ],
            correctAnswer: 'A',
            explanation: 'Konstruksi balok/kardus melatih penalaran spasial, keseimbangan gravitasi, dan pemecahan masalah (kognitif).'
          },
          {
            id: 'Q2-04',
            question: 'Manakah syarat keselamatan yang PALING KRUSIAL saat guru menyiapkan bahan daur ulang untuk anak usia PAUD?',
            options: [
              { key: 'A', text: 'Bahan harus berwarna mencolok seperti neon.' },
              { key: 'B', text: 'Bahan harus bersih, tidak tajam, tidak beracun, tidak berisiko tersedak, dan diawasi penggunaannya.' },
              { key: 'C', text: 'Bahan harus baru dibeli dari supermarket.' },
              { key: 'D', text: 'Bahan harus berbahan dasar besi berat.' }
            ],
            correctAnswer: 'B',
            explanation: 'Kebersihan, ketiadaan sudut tajam/racun, dan pencegahan bahaya tersedak adalah standar keselamatan mutlak.'
          },
          {
            id: 'Q2-05',
            question: 'Bagaimana cara mencegah bahaya tersedak (choking hazard) pada anak usia di bawah 3 tahun saat bermain bahan alam?',
            options: [
              { key: 'A', text: 'Memberikan biji-bijian yang sangat kecil dalam jumlah ratusan.' },
              { key: 'B', text: 'Menghindari benda berukuran diameter lebih kecil dari 3 cm atau memasukkannya ke dalam botol sensori tertutup rapat.' },
              { key: 'C', text: 'Membiarkan anak bermain sendirian di ruang tertutup.' },
              { key: 'D', text: 'Menyuruh anak menelan benda tersebut jika tidak sengaja masuk mulut.' }
            ],
            correctAnswer: 'B',
            explanation: 'Benda berukuran di bawah 3 cm berisiko tinggi menyumbat jalan napas balita, gunakan botol sensori tersegel.'
          },
          {
            id: 'Q2-06',
            question: 'Pasangkan bahan: Menggunakan aneka daun kering dengan variasi bentuk untuk membuat pola berselang-seling (daun mangga - daun jambu - daun mangga) menstimulasi...',
            options: [
              { key: 'A', text: 'Kemampuan Pra-Matematika (Pola dan Seriasi Kognitif)' },
              { key: 'B', text: 'Kemampuan berenang' },
              { key: 'C', text: 'Kecepatan mengetik komputer' },
              { key: 'D', text: 'Kekuatan melompat tali' }
            ],
            correctAnswer: 'A',
            explanation: 'Membuat pola berulang (seriasi) adalah fondasi berpikir matematis dan logika urutan.'
          },
          {
            id: 'Q2-07',
            question: 'Manakah contoh pemanfaatan Loose Parts yang menstimulasi aspek BAHASA dan LITERASI awal?',
            options: [
              { key: 'A', text: 'Menyusun kerikil dan ranting membentuk pola huruf nama panggilan anak, lalu menceritakan artinya.' },
              { key: 'B', text: 'Menendang botol plastik di lapangan sepak bola.' },
              { key: 'C', text: 'Duduk diam melihat televisi.' },
              { key: 'D', text: 'Menumpuk piring plastik tanpa berbicara.' }
            ],
            correctAnswer: 'A',
            explanation: 'Membentuk huruf dengan sensori taktil dan menarasikan maknanya memperkuat literasi awal dan bahasa ekspresif.'
          },
          {
            id: 'Q2-08',
            question: 'Apa keuntungan nilai ekologis bagi anak ketika sekolah PAUD rutin memanfaatkan Loose Parts dari bahan daur ulang?',
            options: [
              { key: 'A', text: 'Menumbuhkan kepedulian lingkungan dan kebiasaan 3R (Reduce, Reuse, Recycle) sejak usia dini.' },
              { key: 'B', text: 'Membuat sekolah menjadi tempat penimbunan sampah kotor.' },
              { key: 'C', text: 'Menghilangkan anggaran belanja sekolah secara total tanpa pengawasan.' },
              { key: 'D', text: 'Membuat anak tidak mau menggunakan pensil dan kertas lagi.' }
            ],
            correctAnswer: 'A',
            explanation: 'Loose parts menanamkan pola pikir menghargai sumber daya alam dan kesadaran pelestarian lingkungan.'
          },
          {
            id: 'Q2-09',
            question: 'Studi Kasus: Guru ingin membuat media sensori taktil untuk mengenalkan aneka tekstur. Bahan manakah yang paling aman dan variatif?',
            options: [
              { key: 'A', text: 'Kaca pecah, kawat berduri, dan seng tajam.' },
              { key: 'B', text: 'Kain perca sutra halus, karung goni kasar, spon cuci piring lembut, dan kardus bergelombang bersih.' },
              { key: 'C', text: 'Cairan pembersih lantai yang berbusa.' },
              { key: 'D', text: 'Paku payung dan jarum pentul.' }
            ],
            correctAnswer: 'B',
            explanation: 'Kain sutra, karung goni, spon, dan kardus gelombang memberikan kekayaan tekstur yang sangat aman bagi kulit anak.'
          },
          {
            id: 'Q2-10',
            question: 'Saat anak bermain membuat "kue" dari pasir dan hiasan cangkang kerang, peran guru untuk menstimulasi SOSIAL EMOSIONAL adalah...',
            options: [
              { key: 'A', text: 'Menolak saat anak menawari kue buatannya.' },
              { key: 'B', text: 'Menerima dengan antusias, bermain peran sebagai pembeli, dan mengajak anak berbagi kue dengan temannya.' },
              { key: 'C', text: 'Menyuruh anak membuang pasirnya karena kotor.' },
              { key: 'D', text: 'Memberikan nilai angka di dahi anak.' }
            ],
            correctAnswer: 'B',
            explanation: 'Bermain peran pura-pura (pretend play) memupuk empati, giliran bicara, dan keterampilan sosial anak.'
          }
        ]
      },
      assignment: {
        id: 'TASK-PAUD-02',
        title: 'Membuat APE dari Bahan Daur Ulang',
        description: 'Buatlah satu buah Alat Permainan Edukatif (APE) orisinal menggunakan bahan daur ulang / bahan lepasan (Loose Parts) yang aman dan bermanfaat.',
        instructions: [
          'Kumpulkan bahan-bahan bekas/alam yang bersih dan aman di sekitar Anda (misal: kardus, tutup botol, ranting, kain perca, dsb).',
          'Rancang dan rakit media APE tersebut menjadi alat permainan yang menarik bagi anak PAUD.',
          'Ambil foto dokumentasi yang memuat: (1) Foto bahan mentah yang disiapkan, (2) Foto proses perakitan, (3) Foto produk akhir APE yang sudah jadi, (4) Foto/kolase cara memainkan.',
          'Tuliskan deskripsi ringkas: Nama APE, Alat & Bahan, Cara Memainkan, serta Aspek Perkembangan yang Distimulasi (Motorik/Kognitif/Bahasa/Sosem).',
          'Unggah foto (JPG/PNG) atau rangkum dalam dokumen PDF dokumentasi karya Anda.'
        ],
        acceptedFormats: ['JPG', 'JPEG', 'PNG', 'PDF'],
        maxFileSizeMB: 15,
        isMultiImage: true,
        rubric: [
          { criterion: 'Standar Keamanan Bahan (Safety First)', weight: 25, description: 'Bahan terbukti higienis, tidak ada bagian tajam, tidak beracun, dan aman dimainkan anak.' },
          { criterion: 'Kreativitas & Orisinalitas Rancangan', weight: 20, description: 'Inovasi desain yang menarik, memanfaatkan bahan daur ulang secara cerdas dan fungsional.' },
          { criterion: 'Kesesuaian dengan Karakteristik Usia', weight: 20, description: 'Tingkat kesulitan dan cara memainkan pas untuk target usia anak PAUD (3-6 tahun).' },
          { criterion: 'Ketepatan Aspek Stimulasi Perkembangan', weight: 20, description: 'Media terbukti efektif menstimulasi aspek motorik, kognitif, bahasa, atau sosial emosional.' },
          { criterion: 'Kelengkapan Dokumentasi & Deskripsi', weight: 15, description: 'Foto tahapan jelas, deskripsi cara memainkan terperinci dan mudah dipahami guru lain.' }
        ]
      }
    },

    // ==========================================
    // MODUL 3: TUMBUH KEMBANG & STIMULASI BAHASA
    // ==========================================
    {
      id: 'MOD-PAUD-03',
      number: 3,
      title: 'Deteksi Dini Tumbuh Kembang & Stimulasi Bahasa Anak',
      subtitle: 'Observasi Tumbuh Kembang, Red Flags, Teknik Storytelling Ekspresif & Komunikasi Orang Tua',
      description: 'Mengenali tahapan perkembangan umum, melakukan observasi obyektif, memberikan stimulasi bahasa melalui storytelling, serta berkolaborasi dengan orang tua tanpa melakukan diagnosis medis.',
      duration: '8 JP (E-Learning, Praktik Video Storytelling & Analisis Kasus)',
      objectives: [
        'Mengenali tahapan perkembangan bahasa dan motorik umum anak usia 3-6 tahun.',
        'Mengenali tanda-tanda perkembangan yang memerlukan perhatian khusus (Red Flags).',
        'Melakukan teknik observasi dan pencatatan anekdot perkembangan secara objektif tanpa bias.',
        'Menerapkan teknik stimulasi bahasa efektif di kelas melalui percakapan dua arah.',
        'Menguasai teknik Storytelling (mendongeng) dengan ekspresi, intonasi, dan keterlibatan anak.',
        'Memahami batasan profesi guru (edukasi vs diagnosis medis profesional).',
        'Menyampaikan hasil pengamatan perkembangan kepada orang tua/wali secara bijak, empatis, dan profesional.'
      ],
      readingMaterial: {
        sectionTitle: 'Materi Komprehensif: Observasi Tumbuh Kembang & Seni Stimulasi Bahasa',
        sections: [
          {
            letter: 'A',
            title: 'Karakteristik Tumbuh Kembang Anak Usia 3-6 Tahun',
            content: `Rentang usia 3-6 tahun adalah masa keemasan (golden age) di mana perkembangan sinaps otak terjadi sangat pesat. Pada fase ini anak mengalami lompatan kemampuan motorik kasar (melompat, menendang, menjaga keseimbangan), motorik halus (memegang krayon, menggunting sederhana), kognitif (menghubungkan sebab-akibat sederhana), serta perkembangan sosio-emosional (mulai bermain asosiatif dan kooperatif).`,
            keyPoints: [
              'Setiap anak memiliki keunikan laju perkembangan (individual differences).',
              'Perkembangan terjadi secara sekuensial dan saling berhubungan satu sama lain.'
            ]
          },
          {
            letter: 'B',
            title: 'Tahapan Perkembangan Bahasa Anak Usia Dini',
            content: `Perkembangan bahasa terbagi menjadi bahasa reseptif (kemampuan memahami apa yang didengar) dan bahasa ekspresif (kemampuan mengungkapkan pikiran dengan kata-kata). Anak usia 3 tahun umumnya sudah mampu berbicara dalam kalimat 3-4 kata. Anak usia 4-5 tahun mampu bercerita pengalaman pendek, mengajukan pertanyaan "mengapa?", dan menggunakan kata ganti dengan benar. Anak usia 5-6 tahun memiliki perbendaharaan lebih dari 2000 kata dan mampu menyusun kalimat kompleks.`,
            keyPoints: [
              'Bahasa Reseptif: Mendengarkan, memahami instruksi bertingkat, menikmati cerita.',
              'Bahasa Ekspresif: Mengucapkan kata dengan artikulasi yang jelas, merangkai kalimat, bercerita.'
            ]
          },
          {
            letter: 'C',
            title: 'Tanda Perkembangan yang Perlu Diperhatikan (Red Flags)',
            content: `Guru perlu peka terhadap tanda-tanda yang memerlukan perhatian khusus (Red Flags), seperti: (1) Usia 3 tahun belum mampu berbicara dalam kalimat 2 kata atau kontak mata sangat minim, (2) Usia 4 tahun bicaranya sangat tidak jelas dan tidak dapat dimengerti orang luar keluarga, (3) Kehilangan kemampuan bahasa yang sebelumnya sudah dikuasai (regression), (4) Tidak merespon saat namanya dipanggil, atau (5) Sangat kesulitan berinteraksi dengan teman sebaya.`,
            keyPoints: [
              'Red flags adalah rambu peringatan awal untuk observasi lebih mendalam, BUKAN vonis kelainan.',
              'Pentingnya pencatatan frekuensi dan konteks munculnya tanda tersebut.'
            ]
          },
          {
            letter: 'D',
            title: 'PENTING: Batasan Peran Guru (Edukasi vs Diagnosis Medis)',
            content: `PERINGATAN ETIKA PENTING: Guru PAUD BUKAN dokter anak, psikolog klinis, atau psikiater. Guru TIDAK BOLEH memberikan diagnosis medis atau memberi label kepada anak (misalnya mengatakan: "Anak Ibu mengalami autisme/ADHD/speech delay berat"). Peran guru adalah: (1) Melakukan observasi objektif dan mencatat data faktual, (2) Berkomunikasi dengan kepala sekolah/tim pengembang lembaga, (3) Mengajak orang tua berdiskusi dengan santun dan berbasis data, (4) Menyarankan orang tua untuk berkonsultasi kepada tenaga profesional (dokter tumbuh kembang anak / psikolog anak) jika diperlukan.`,
            practicalTips: [
              'Gunakan catatan faktual: "Ananda Budi saat diajak bicara memalingkan wajah 4 dari 5 kali percakapan", bukan kalimat vonis: "Budi tidak punya kontak mata karena autis".',
              'Jaga kerahasiaan data tumbuh kembang anak dari orang tua murid lainnya.'
            ]
          },
          {
            letter: 'E',
            title: 'Pentingnya Observasi & Catatan Anekdot',
            content: `Catatan anekdot adalah catatan singkat mengenai peristiwa khusus atau perilaku bermakna yang ditunjukkan anak. Catatan harus memuat: Waktu, Tempat, Peristiwa Faktual (tanpa opini subjektif guru), dan Analisis Capaian Perkembangan.`,
            practicalTips: [
              'Tuliskan fakta apa yang dilihat dan didengar anak melakukan/mengucapkan.',
              'Hindari kata sifat berlabel ("nakal", "malas", "hiperaktif").'
            ]
          },
          {
            letter: 'F',
            title: 'Strategi Stimulasi Bahasa Kaya Percakapan di Kelas',
            content: `Ciptakan lingkungan kaya literasi (Print-Rich Environment) dan jalin percakapan dua arah (serve-and-return interaction). Saat anak mengucapkan satu kata ("Mobil!"), guru memperluasnya ("Betul, itu mobil pemadam kebakaran warna merah yang sedang melaju cepat!").`,
            keyPoints: [
              'Serve and Return: Sambut ocehan anak dengan respon verbal dan tatapan hangat.',
              'Perluasan Kalimat (Expansion & Extension): Menambah kosakata baru pada kata yang diucapkan anak.'
            ]
          },
          {
            letter: 'G',
            title: 'Seni Storytelling (Mendongeng) untuk Stimulasi Bahasa',
            content: `Storytelling adalah metode paling ampuh merangsang imajinasi dan kosakata anak. Kunci storytelling yang memukau: (1) Variasi intonasi dan warna suara karakter (suara kakek, suara beruang, suara kelinci kecil), (2) Ekspresi wajah yang hidup (terkejut, gembira, cemas), (3) Kontak mata yang menyapu seluruh anak, (4) Penggunaan jeda dramatis (pause) untuk memancing rasa penasaran, dan (5) Mengajak anak berpartisipasi aktif menirukan suara atau menebak kelanjutan cerita.`,
            practicalTips: [
              'Pilih buku bergambar dengan ilustrasi memikat dan kalimat berima.',
              'Tunjukkan gambar sejajar pandangan anak sambil membalik halaman perlahan.',
              'Ajak anak menirukan bunyi: "Kira-kira bagaimana suara angin berhembus kencang di hutan? Wuuushh..."'
            ]
          },
          {
            letter: 'H',
            title: 'Kapan & Bagaimana Guru Berdiskusi dengan Orang Tua/Wali',
            content: `Komunikasi dengan orang tua harus dibangun dengan fondasi kemitraan positif, bukan pemanggilan seperti "terdakwa". Awali pertemuan dengan menyampaikan kelebihan dan hal-hal positif anak terlebih dahulu (metode sandwich), kemudian paparkan data observasi tanpa menghakimi, dengarkan perspektif kebiasaan anak di rumah, dan susun kesepakatan tindak lanjut bersama.`,
            caseStudy: {
              title: 'Studi Kasus: Komunikasi Empatis Guru dengan Orang Tua Bimo',
              scenario: 'Bimo (4 tahun) belum merangkai kalimat dan sering menarik tangan guru untuk meminta minum. Bu Guru Sari mencatat observasi selama 2 minggu. Bu Sari tidak mengatakan "Bimo speech delay", melainkan mengundang Ibu Bimo minum teh bersama: "Ibu, Bimo anak yang sangat manis dan mandiri saat memakai sepatu. Di kelas, kami sedang melatih Bimo agar nyaman menyuarakan keinginannya dengan kata-kata. Bagaimana kebiasaan komunikasi Bimo di rumah bersama Ayah dan Ibu?"',
              analysis: 'Pendekatan ini membuat orang tua merasa didukung dan dihargai, sehingga dengan sukarela menyepakati program stimulasi bersama di rumah dan bersedia berkonsultasi ke klinik tumbuh kembang tanpa merasa tersinggung.'
            }
          }
        ]
      },
      videoMedia: {
        title: 'Video Praktik: Teknik Storytelling Interaktif Guru PAUD Berkarakter',
        description: 'Contoh nyata membawakan cerita buku bergambar dengan variasi intonasi vokal, ekspresi wajah, gestur tubuh, dan pelibatan audiens anak secara aktif.',
        duration: '07:30 Menit',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80'
      },
      reflectionPrompt: 'Ketika mendongeng atau membacakan buku di kelas, apakah Anda sudah menggunakan variasi suara dan ekspresi yang menghidupkan karakter, atau masih membaca secara monoton seperti membaca koran?',
      quiz: {
        title: 'Kuis Evaluasi Modul 3: Tumbuh Kembang & Stimulasi Bahasa',
        description: 'Jawablah 10 pertanyaan studi kasus berikut untuk menguji ketepatan observasi, stimulasi bahasa, dan etika profesional guru PAUD.',
        passingScore: 70,
        questions: [
          {
            id: 'Q3-01',
            question: 'Seorang anak berusia 4 tahun menunjukkan kemampuan bahasa yang berbeda dari teman sebayanya dan belum merangkai 3 kata. Apa langkah awal yang PALING TEPAT dilakukan guru?',
            options: [
              { key: 'A', text: 'Langsung memvonis anak mengalami keterbelakangan mental di depan seluruh kelas.' },
              { key: 'B', text: 'Menghukum anak dan menyuruhnya berdiri di depan pintu sampai mau bicara.' },
              { key: 'C', text: 'Melakukan observasi terstruktur, mencatat data faktual, dan mendiskusikannya dengan kepala sekolah serta orang tua.' },
              { key: 'D', text: 'Mengabaikan kondisi tersebut karena pasti akan sembuh sendiri tanpa stimulasi.' }
            ],
            correctAnswer: 'C',
            explanation: 'Observasi objektif dan pencatatan faktual adalah langkah awal profesional guru sebelum berkomunikasi dengan orang tua.'
          },
          {
            id: 'Q3-02',
            question: 'Apakah guru PAUD diperbolehkan memberikan diagnosis medis resmi (seperti vonis Autisme/ADHD) kepada orang tua murid?',
            options: [
              { key: 'A', text: 'Boleh, karena guru sudah berpengalaman mengajar anak setiap hari.' },
              { key: 'B', text: 'TIDAK BOLEH. Diagnosis medis hanya wewenang dokter spesialis anak atau psikolog profesional; peran guru adalah menyajikan data observasi perilaku.' },
              { key: 'C', text: 'Boleh asalkan guru sudah membaca artikel di internet.' },
              { key: 'D', text: 'Boleh jika disetujui oleh ketua komite sekolah.' }
            ],
            correctAnswer: 'B',
            explanation: 'Guru memiliki batasan kompetensi edukatif dan dilarang menegakkan diagnosis klinis medis.'
          },
          {
            id: 'Q3-03',
            question: 'Manakah contoh catatan observasi anekdot yang bersifat OBJEKTIF dan FAKTUAL (Bebas dari opini subjektif)?',
            options: [
              { key: 'A', text: '"Doni anak pemalas dan sangat nakal saat bermain balok."' },
              { key: 'B', text: '"Pukul 09.15, Doni menyusun 5 balok menjadi menara, saat roboh Doni berteriak dan melempar 1 balok ke karpet lalu menangis selama 2 menit."' },
              { key: 'C', text: '"Doni sepertinya memiliki trauma masa kecil yang berat."' },
              { key: 'D', text: '"Doni tidak punya bakat di bidang arsitektur balok."' }
            ],
            correctAnswer: 'B',
            explanation: 'Catatan objektif mendeskripsikan waktu, aksi nyata, durasi, dan fakta yang terukur tanpa label emosional guru.'
          },
          {
            id: 'Q3-04',
            question: 'Teknik interaksi di mana guru menyambut ocehan/pertanyaan anak dengan respon tatapan hangat dan perluasan kalimat disebut...',
            options: [
              { key: 'A', text: 'Serve and Return' },
              { key: 'B', text: 'Drilling Vocab' },
              { key: 'C', text: 'Silent Reading' },
              { key: 'D', text: 'One-Way Instruction' }
            ],
            correctAnswer: 'A',
            explanation: 'Serve and Return adalah pola interaksi timbal balik yang sangat krusial membangun sirkuit otak bahasa anak.'
          },
          {
            id: 'Q3-05',
            question: 'Saat membacakan buku cerita bergambar (Read Aloud), apa tujuan guru mengubah-ubah nada suara untuk karakter yang berbeda?',
            options: [
              { key: 'A', text: 'Agar anak merasa ketakutan dan tidak berani bergerak.' },
              { key: 'B', text: 'Menghidupkan imajinasi anak, mempertahankan atensi fokus, dan memperjelas peran tokoh dalam cerita.' },
              { key: 'C', text: 'Membuat tenggorokan guru cepat lelah.' },
              { key: 'D', text: 'Sebagai formalitas syarat penilaian lomba guru berprestasi.' }
            ],
            correctAnswer: 'B',
            explanation: 'Modulasi suara menghidupkan narasi, memikat atensi, dan membantu anak memahami kepribadian karakter.'
          },
          {
            id: 'Q3-06',
            question: 'Manakah tanda (Red Flag) perkembangan bahasa anak usia 4 tahun yang perlu segera ditindaklanjuti observasinya?',
            options: [
              { key: 'A', text: 'Anak sering bertanya "Mengapa matahari terbenam?" berulang kali.' },
              { key: 'B', text: 'Anak berbicara sangat tidak jelas sehingga keluarga inti pun kesulitan memahami 75% kata-katanya, dan jarang melakukan kontak mata.' },
              { key: 'C', text: 'Anak menolak makan sayur bayam saat makan siang bersama.' },
              { key: 'D', text: 'Anak lebih suka menggambar warna biru daripada merah.' }
            ],
            correctAnswer: 'B',
            explanation: 'Artikulasi yang sangat tidak dapat dimengerti keluarga pada usia 4 tahun disertai minim kontak mata adalah tanda red flag penting.'
          },
          {
            id: 'Q3-07',
            question: 'Bagaimana cara terbaik mengajak anak berpartisipasi aktif di tengah sesi Storytelling?',
            options: [
              { key: 'A', text: 'Menyuruh anak diam mematung dan melipat tangan di atas meja sampai cerita selesai.' },
              { key: 'B', text: 'Mengajukan pertanyaan prediksi: "Wah, serigala sudah sampai di depan pintu! Kira-kira apa yang akan dilakukan anak kambing ya?"' },
              { key: 'C', text: 'Meminta anak menghafal halaman buku dari awal sampai akhir.' },
              { key: 'D', text: 'Membacakan cerita dengan kecepatan sangat tinggi agar cepat selesai.' }
            ],
            correctAnswer: 'B',
            explanation: 'Pertanyaan prediksi memicu keterlibatan kognitif dan bahasa anak untuk menebak kelanjutan cerita.'
          },
          {
            id: 'Q3-08',
            question: 'Metode "Sandwich" dalam menyampaikan hasil pengamatan perkembangan kepada orang tua murid dilakukan dengan cara...',
            options: [
              { key: 'A', text: 'Langsung membeberkan semua kekurangan anak di depan orang tua lain.' },
              { key: 'B', text: 'Menyampaikan kelebihan/potensi anak di awal, lalu membahas area yang butuh stimulasi khusus, dan ditutup dengan solusi serta harapan positif.' },
              { key: 'C', text: 'Menolak bertemu orang tua dan hanya mengirim surat peringatan.' },
              { key: 'D', text: 'Meminta orang tua menandatangani surat pengunduran diri siswa.' }
            ],
            correctAnswer: 'B',
            explanation: 'Metode sandwich (Positif - Area Pengembangan - Solusi Positif) menciptakan diskusi yang kondusif dan tanpa prasangka.'
          },
          {
            id: 'Q3-09',
            question: 'Anak mengucapkan: "Ikan... air!". Bagaimana guru melakukan teknik "Expansion" (perluasan kalimat) yang tepat?',
            options: [
              { key: 'A', text: '"Salah! Yang benar adalah kalimat lengkap subjek predikat objek!"' },
              { key: 'B', text: '"Iya betul sayang, ikan mas yang cantik itu sedang berenang lincah di dalam air kolam!"' },
              { key: 'C', text: 'Diam saja dan tidak menanggapi ucapan anak.' },
              { key: 'D', text: '"Jangan bicara ikan, sekarang waktunya makan nasi!"' }
            ],
            correctAnswer: 'B',
            explanation: 'Teknik expansion memvalidasi kata anak sambil menambahkan kata sifat dan kata kerja untuk memperkaya kosakata.'
          },
          {
            id: 'Q3-10',
            question: 'Jika setelah observasi 1 bulan anak tetap menunjukkan tanda keterlambatan perkembangan yang signifikan, apa langkah etis guru?',
            options: [
              { key: 'A', text: 'Mengeluarkan anak secara sepihak dari sekolah.' },
              { key: 'B', text: 'Menyampaikan catatan observasi secara santun kepada orang tua dan merekomendasikan rujukan ke dokter anak/psikolog tumbuh kembang.' },
              { key: 'C', text: 'Memberikan obat penenang kepada anak saat di sekolah.' },
              { key: 'D', text: 'Menyebarkan foto anak ke grup media sosial umum.' }
            ],
            correctAnswer: 'B',
            explanation: 'Rujukan santun dan terstruktur ke tenaga profesional yang berwenang adalah langkah etis terbaik bagi masa depan anak.'
          }
        ]
      },
      assignment: {
        id: 'TASK-PAUD-03',
        title: 'Praktik Storytelling untuk Stimulasi Bahasa',
        description: 'Rekamlah sebuah video praktik membawakan cerita / mendongeng (Storytelling) singkat berdurasi 1-2 menit yang memperagakan intonasi, ekspresi, kejelasan artikulasi, dan pelibatan anak.',
        instructions: [
          'Pilih satu buku cerita anak atau gunakan media boneka tangan / properti sederhana.',
          'Rekam video diri Anda sedang membawakan cerita dengan durasi 1 hingga 2 menit.',
          'Tunjukkan: (1) Variasi intonasi suara karakter yang jelas, (2) Ekspresi wajah yang hidup, (3) Artikulasi bahasa Indonesia yang komunikatif, (4) Upaya mengajak anak berinteraksi/menebak.',
          'Format video yang didukung: MP4, MOV, WEBM (Ukuran maksimal 30 MB).',
          'Anda juga dapat menyertakan tautan video YouTube/Google Drive pada kolom catatan jika ukuran video besar.'
        ],
        acceptedFormats: ['MP4', 'MOV', 'WEBM'],
        maxFileSizeMB: 30,
        isVideo: true,
        rubric: [
          { criterion: 'Modulasi & Variasi Intonasi Suara', weight: 20, description: 'Nada suara hidup, variatif sesuai karakter tokoh, dan tidak monoton.' },
          { criterion: 'Ekspresi Wajah & Bahasa Tubuh (Gestur)', weight: 20, description: 'Mimik wajah ekspresif, kontak mata hangat, dan gestur mendukung jalan cerita.' },
          { criterion: 'Kejelasan Artikulasi & Diksi Bahasa', weight: 20, description: 'Pengucapan kata jelas, tempo bicara pas (tidak terlalu cepat/lambat), mudah dicerna anak.' },
          { criterion: 'Teknik Interaksi & Pelibatan Pendengar', weight: 20, description: 'Menyisipkan pertanyaan pemantik, ajakan menirukan bunyi, atau interaksi aktif.' },
          { criterion: 'Kesesuaian Muatan Pesan Cerita dengan Usia Anak', weight: 20, description: 'Tema cerita ramah anak, sarat nilai budi pekerti, dan aman dari unsur kekerasan.' }
        ]
      }
    },

    // ==========================================
    // MODUL 4: DISIPLIN POSITIF
    // ==========================================
    {
      id: 'MOD-PAUD-04',
      number: 4,
      title: 'Pendekatan Disiplin Positif: Tanpa Marah dan Hukuman',
      subtitle: 'Regulasi Emosi Guru & Anak, Validasi Perasaan, Konsekuensi Logis, Penanganan Tantrum & Bahasa Positif',
      description: 'Membantu guru mengelola perilaku anak dengan pendekatan yang menghargai emosi, memahami kebutuhan yang belum terpenuhi, menetapkan batasan yang jelas tanpa kekerasan verbal maupun fisik.',
      duration: '8 JP (E-Learning, Studi Kasus Skenario & Jurnal Refleksi Diri)',
      objectives: [
        'Memahami proses perkembangan regulasi emosi anak usia dini dan cara kerja otak anak.',
        'Mengenali akar penyebab perilaku menantang (unmet needs) di balik tantrum atau agresi.',
        'Membedakan secara tegas antara hukuman yang melukai psikologis dan konsekuensi logis yang mendidik.',
        'Menguasai teknik validasi perasaan anak sebelum mengajarkan solusi (Connect before Correct).',
        'Menghadapi situasi anak tantrum di kelas dengan kepala dingin dan teknik de-eskalasi emosi.',
        'Menerapkan kalimat afirmasi dan instruksi bahasa positif di lingkungan kelas.',
        'Membangun iklim kelas yang aman secara psikologis, konsisten, dan penuh welas asih.'
      ],
      readingMaterial: {
        sectionTitle: 'Materi Komprehensif: Seni Menerapkan Disiplin Positif di Satuan PAUD',
        sections: [
          {
            letter: 'A',
            title: 'Memahami Regulasi Emosi & Otak Anak Usia Dini',
            content: `Otak anak usia dini sedang dalam proses pematangan. Bagian otak emosi (Amigdala / Otak Bawah) berkembang jauh lebih dahulu daripada bagian otak penalaran dan logika (Prefrontal Cortex / Otak Atas). Ketika anak merasa kewalahan oleh emosi besar (marah, takut, lelah, lapar), otak logikanya "terputus". Memarahi atau menceramahi anak yang sedang histeris tidak akan efektif karena otak atasnya belum dapat memproses logika. Guru perlu menenangkan otak bawahnya terlebih dahulu (Calm the Amygdala).`,
            keyPoints: [
              'Anak belum memiliki kemampuan regulasi emosi matang seperti orang dewasa.',
              'Tantrum bukanlah perilaku nakal yang disengaja, melainkan sinyal luapan emosi berlebih.'
            ]
          },
          {
            letter: 'B',
            title: 'Mengapa Anak Mengalami Tantrum & Perilaku Menantang?',
            content: `Setiap perilaku anak selalu didorong oleh kebutuhan (Behavior is Communication). Saat anak merebut mainan, melempar barang, atau berteriak di lantai, biasanya ada kebutuhan yang belum terpenuhi: (1) Lelah fisik / kurang tidur, (2) Lapar / haus, (3) Merasa tidak didengar atau diabaikan, (4) Over-stimulasi lingkungan (terlalu bising/ramai), atau (5) Frustrasi belum mampu mengungkapkan isi pikiran dengan kosakata yang tepat.`,
            keyPoints: [
              'Lihat apa yang ada di balik perilaku (Iceberg Phenomenon).',
              'Fokus mencari akar masalah bukan hanya membungkam gejalanya.'
            ]
          },
          {
            letter: 'C',
            title: 'Perbedaan: Hukuman vs Konsekuensi Logis',
            content: `Sangat penting membedakan hukuman dengan konsekuensi logis:`,
            keyPoints: [
              'HUKUMAN: Didasari kemarahan dan kekuasaan guru, tidak berhubungan logis dengan kesalahan ("Kamu menumpahkan air, berdiri di pojok kelas 15 menit!"), memicu rasa malu, dendam, takut, dan merusak harga diri anak.',
              'KONSEKUENSI LOGIS: Didasari edukasi dan empati, berhubungan langsung dengan tindakan ("Airnya tumpah ya sayang. Yuk kita ambil lap bersama-sama untuk mengeringkan mejanya agar teman lain tidak terpeleset."), mengajarkan tanggung jawab dan pemecahan masalah nyata.'
            ]
          },
          {
            letter: 'D',
            title: 'Prinsip "Connect Before Correct" & Validasi Perasaan',
            content: `Sebelum mengoreksi perilaku salah, sambungkan koneksi hati terlebih dahulu (Connect Before Correct). Validasi emosi anak bukan berarti membenarkan perilakunya yang merusak, melainkan mengakui bahwa emosinya wajar dirasakan.`,
            practicalTips: [
              'Rumus Validasi: "Ibu tahu kamu sedang marah/kecewa karena mainanmu dipinjam... (Validasi Emosi), TAPI memukul teman itu berbahaya dan tidak boleh (Batasan Tegas). Yuk tarik napas panjang bersama Ibu."',
              'Duduk sejajar, gunakan suara lembut namun tegas, hindari nada menyindir atau meninggi.'
            ]
          },
          {
            letter: 'E',
            title: 'Komunikasi Positif: Katakan Apa yang HARUS Dilakukan',
            content: `Otak anak sulit memproses kata "JANGAN" atau "TIDAK". Jika kita berteriak "JANGAN LARI!", otak anak pertama kali memvisualisasikan aksi LARI. Gantilah dengan instruksi positif yang spesifik memberitahu apa yang harus dilakukan.`,
            practicalTips: [
              'Ganti "JANGAN LARI!" menjadi "Yuk kita jalan pelan-pelan di dalam kelas ya."',
              'Ganti "JANGAN BERISIK!" menjadi "Yuk gunakan suara bisik-bisik seperti kupu-kupu."',
              'Ganti "JANGAN BEREBUT!" menjadi "Kira-kira siapa yang mau main duluan sambil kita hitung bergantian?"',
              'Ganti "JANGAN CORET DINDING!" menjadi "Krayon ini untuk menggambar di atas kertas besar ini ya."'
            ]
          },
          {
            letter: 'F',
            title: 'Strategi Menghadapi Anak yang Merebut Mainan Teman',
            content: `Saat terjadi perebutan mainan, jangan langsung menyalahkan salah satu anak. Langkah 4 tahap: (1) Amankan situasi dan tahan mainan dengan tenang ("Ibu pegang dulu mainannya"), (2) Validasi kedua belah pihak ("Rian ingin main truk ini, dan Dika juga sedang asyik memainkannya"), (3) Ajak anak mencari solusi bersama ("Bagaimana agar kalian berdua bisa sama-sama senang?"), (4) Buat kesepakatan visual (misal memakai timer pasir atau hitungan bersama).`,
            keyPoints: [
              'Mendidik keterampilan negosiasi dan resolusi konflik sosial anak.'
            ]
          },
          {
            letter: 'G',
            title: 'Strategi Langkah Demi Langkah Menghadapi Tantrum di Kelas',
            content: `Saat anak tantrum hebat: (1) Stay Calm: Tarik napas panjang, ingatkan diri sendiri bahwa ini bukan kegagalan Anda, (2) Amankan lingkungan: Jauhkan benda tajam atau berbahaya dari jangkauan anak, (3) Beri Ruang & Kehadiran: Duduk dekat anak, jangan menceramahi saat ia menangis kencang ("Ibu ada di sini menemanimu sampai kamu merasa lebih tenang"), (4) Tawarkan pelukan hangat jika anak mengizinkan, (5) Setelah anak tenang: Berikan minum air putih, lalu ajak bicara singkat mengenai perasaannya dan diskusikan solusinya.`,
            keyPoints: [
              'Jangan pernah mempermalukan anak di depan teman-temannya.',
              'Gunakan sudut tenang (Peace Corner / Cozy Corner) yang nyaman dengan bantal dan buku, bukan sudut hukuman.'
            ]
          },
          {
            letter: 'H',
            title: 'Daftar Frasa Bahasa Guru: Yang Dianjurkan vs Yang Dihindari',
            content: `Perhatikan kekuatan kata-kata guru dalam membentuk konsep diri anak:`,
            keyPoints: [
              'HINDARI: "Dasar cengeng!", "Masa begitu saja nangis?", "Tuh kan Ibu bilang apa, kamu sih gak dengerin!", "Ibu tinggal pulang ya kalau kamu nakal!".',
              'ANJURKAN: "Ibu tahu ini terasa sulit untukmu...", "Ibu percaya kamu bisa mencobanya sekali lagi.", "Terima kasih sudah mau sabar menunggu giliran.", "Ibu bangga melihat usahamu merapikan balok ini."'
            ],
            caseStudy: {
              title: 'Studi Kasus: Dari Ruang Hukuman Menjadi Sudut Nyaman',
              scenario: 'Di TK Tunas Bangsa, anak yang memukul teman biasanya dihukum berdiri di samping papan tulis (Time Out Hukuman). Anak tersebut sering mengulang perilakunya dan semakin agresif. Guru kemudian mengubah pojok tersebut menjadi "Sudut Bintang Nyaman" yang dilengkapi bantal empuk, botol sensori glitter, dan buku emosi.',
              analysis: 'Saat anak mulai gelisah, guru mendampingi anak ke Sudut Bintang untuk meregulasi emosi. Dalam 1 bulan, insiden memukul berkurang 80% karena anak belajar mengenali emosi marahnya dan tahu cara menenangkan diri secara sehat.'
            }
          }
        ]
      },
      videoMedia: {
        title: 'Video Simulasi: Teknik De-Eskalasi Tantrum & Validasi Perasaan Anak',
        description: 'Simulasi nyata bagaimana guru menanggapi anak yang berteriak di lantai menggunakan kehadiran tenang, validasi emosi, dan penerapan konsekuensi logis.',
        duration: '09:00 Menit',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&auto=format&fit=crop&q=80'
      },
      reflectionPrompt: 'Ingatlah momen terakhir saat Anda merasa ingin marah pada anak didik di kelas: Apa pemicunya? Bagaimana respon Anda saat itu? Frasa kalimat positif apa yang bisa Anda gunakan jika situasi serupa terjadi lagi esok hari?',
      quiz: {
        title: 'Kuis Evaluasi Modul 4: Pendekatan Disiplin Positif',
        description: 'Jawablah 10 pertanyaan skenario berikut untuk menguji pemahaman Anda mengenai penanganan emosi, konsekuensi logis, dan komunikasi positif.',
        passingScore: 70,
        questions: [
          {
            id: 'Q4-01',
            question: 'Seorang anak merebut mainan mobil-mobilan dari temannya sampai temannya menangis. Respon guru yang PALING SESUAI dengan prinsip disiplin positif adalah...',
            options: [
              { key: 'A', text: 'Memukul tangan anak yang merebut dan mencapnya sebagai anak nakal di depan kelas.' },
              { key: 'B', text: 'Mendekat dengan tenang, memegang mainan secara netral, memvalidasi perasaan kedua anak, dan memfasilitasi kesepakatan bergantian main.' },
              { key: 'C', text: 'Menyita mainan tersebut dan membuangnya ke tempat sampah agar tidak ada yang bisa main.' },
              { key: 'D', text: 'Menyuruh teman yang menangis untuk membalas merebut kembali.' }
            ],
            correctAnswer: 'B',
            explanation: 'Menenangkan situasi, memvalidasi emosi kedua belah pihak, dan melatih kesepakatan bergantian adalah inti disiplin positif.'
          },
          {
            id: 'Q4-02',
            question: 'Apa perbedaan mendasar antara "Hukuman" dan "Konsekuensi Logis"?',
            options: [
              { key: 'A', text: 'Hukuman berhubungan langsung dengan tindakan anak, sedangkan konsekuensi logis didasari kemarahan guru.' },
              { key: 'B', text: 'Hukuman bertujuan membuat jera lewat rasa takut/malu, sedangkan konsekuensi logis berhubungan nyata dengan tindakan dan melatih tanggung jawab.' },
              { key: 'C', text: 'Hukuman selalu berupa hadiah uang, sedangkan konsekuensi berupa pujian.' },
              { key: 'D', text: 'Tidak ada perbedaan sama sekali antara keduanya.' }
            ],
            correctAnswer: 'B',
            explanation: 'Hukuman memicu rasa malu/takut, sedangkan konsekuensi logis mengajarkan sebab-akibat dan perbaikan nyata.'
          },
          {
            id: 'Q4-03',
            question: 'Anak tidak sengaja menumpahkan segelas susu di atas meja gambar. Penerapan KONSEKUENSI LOGIS yang mendidik adalah...',
            options: [
              { key: 'A', text: 'Menyuruh anak berdiri satu kaki di depan kelas selama 20 menit.' },
              { key: 'B', text: 'Mengajak anak mengambil kain lap dan bersama-sama membersihkan meja sampai kering.' },
              { key: 'C', text: 'Melarang anak minum susu seumur hidup di sekolah.' },
              { key: 'D', text: 'Memarahi anak di depan orang tuanya saat jam penjemputan.' }
            ],
            correctAnswer: 'B',
            explanation: 'Membersihkan tumpahan susu adalah konsekuensi logis langsung yang mengajarkan tanggung jawab tanpa rasa dipermalukan.'
          },
          {
            id: 'Q4-04',
            question: 'Mengapa menceramahi atau memarahi anak panjang lebar saat anak sedang mengalami TANTRUM hebat di lantai TIDAK EFEKTIF?',
            options: [
              { key: 'A', text: 'Karena anak sengaja pura-pura tuli.' },
              { key: 'B', text: 'Karena saat tantrum, otak bawah emosi (Amigdala) sedang membanjiri diri anak sehingga otak atas logika (Prefrontal Cortex) belum bisa memproses ceramah.' },
              { key: 'C', text: 'Karena suara guru terlalu merdu didengar anak.' },
              { key: 'D', text: 'Karena anak PAUD tidak paham bahasa Indonesia.' }
            ],
            correctAnswer: 'B',
            explanation: 'Saat tantrum emosi anak sedang memuncak (otak bawah aktif); anak membutuhkan kehadiran tenang untuk regulasi emosi terlebih dahulu.'
          },
          {
            id: 'Q4-05',
            question: 'Manakah contoh kalimat "Validasi Perasaan" yang tepat saat anak menangis karena tidak ingin ditinggal ibunya di gerbang sekolah?',
            options: [
              { key: 'A', text: '"Masa sudah besar masih cengeng, lihat tuh temanmu tidak ada yang nangis!"' },
              { key: 'B', text: '"Ibu guru mengerti kamu merasa sedih berpisah dengan Mama. Mama pasti kembali menjemput nanti siang. Yuk pegang tangan Ibu guru."' },
              { key: 'C', text: '"Kalau kamu menangis terus, nanti Mama tidak mau jemput lagi lho!"' },
              { key: 'D', text: '"Diam! Jangan bikin malu sekolah!"' }
            ],
            correctAnswer: 'B',
            explanation: 'Mengakui rasa sedih anak dengan hangat memberikan rasa aman emosional yang mempercepat adaptasi.'
          },
          {
            id: 'Q4-06',
            question: 'Bagaimana cara mengubah kalimat larangan "JANGAN LARI-LARI DI KORIDOR!" menjadi kalimat instruksi POSITIF yang efektif?',
            options: [
              { key: 'A', text: '"Awas ya kalau lari lagi nanti Ibu kurung!"' },
              { key: 'B', text: '"Yuk kita jalan kaki pelan-pelan di koridor ya sayang."' },
              { key: 'C', text: '"Kenapa kamu selalu lari seperti kuda liar?"' },
              { key: 'D', text: '"Siapa yang lari tidak dapat bintang!"' }
            ],
            correctAnswer: 'B',
            explanation: 'Memberitahu secara spesifik aksi yang diharapkan (jalan pelan) lebih mudah diproses otak anak daripada kata larangan.'
          },
          {
            id: 'Q4-07',
            question: 'Apa fungsi utama dari "Pojok Tenang" (Cozy Corner / Peace Corner) di dalam ruang kelas PAUD?',
            options: [
              { key: 'A', text: 'Sebagai tempat pengasingan dan hukuman agar anak merasa malu.' },
              { key: 'B', text: 'Sebagai ruang aman dan nyaman bagi anak untuk meregulasi emosi secara mandiri saat merasa kewalahan/lelah.' },
              { key: 'C', text: 'Sebagai gudang menyimpan barang-barang rusak.' },
              { key: 'D', text: 'Sebagai tempat tidur siang bagi guru saat jam mengajar.' }
            ],
            correctAnswer: 'B',
            explanation: 'Pojok tenang adalah sarana regulasi emosi yang positif dan aman, bukan ruang hukuman (time-out).'
          },
          {
            id: 'Q4-08',
            question: 'Manakah prinsip "Connect Before Correct" yang benar ketika menghadapi anak yang mencoret meja?',
            options: [
              { key: 'A', text: 'Langsung memukul krayon anak lalu menyuruh anak keluar kelas.' },
              { key: 'B', text: 'Mendekat dengan ramah, merangkul atau menyapa lembut, lalu menjelaskan batasan bahwa krayon digunakan untuk menggambar di kertas.' },
              { key: 'C', text: 'Mengunggah video coretan anak ke grup komite sekolah.' },
              { key: 'D', text: 'Mencoret baju anak agar anak merasakan hal yang sama.' }
            ],
            correctAnswer: 'B',
            explanation: 'Koneksi emosional membuka penerimaan anak terhadap bimbingan dan batasan aturan yang diajarkan.'
          },
          {
            id: 'Q4-09',
            question: 'Frasa manakah yang SEBAIKNYA DIHINDARI oleh guru karena dapat merusak harga diri dan konsep diri anak?',
            options: [
              { key: 'A', text: '"Terima kasih sudah mencoba dengan sungguh-sungguh."' },
              { key: 'B', text: '"Kamu memang selalu bikin masalah dan susah diatur!"' },
              { key: 'C', text: '"Ibu percaya kamu bisa merapikan mainan ini."' },
              { key: 'D', text: '"Bagaimana perasaanmu setelah bermain tadi?"' }
            ],
            correctAnswer: 'B',
            explanation: 'Labeling negatif permanen ("selalu bikin masalah") merusak kepercayaan diri dan self-worth anak.'
          },
          {
            id: 'Q4-10',
            question: 'Apa langkah pertama yang harus dilakukan oleh GURU saat menghadapi anak yang sedang histeris di kelas?',
            options: [
              { key: 'A', text: 'Menjaga ketenangan diri sendiri terlebih dahulu (Self-Regulation Guru) agar tidak terpancing emosi.' },
              { key: 'B', text: 'Ikut berteriak lebih kencang agar suara anak kalah keras.' },
              { key: 'C', text: 'Memanggil satpam sekolah untuk mengikat anak.' },
              { key: 'D', text: 'Meninggalkan kelas dan membiarkan anak-anak lainnya ketakutan.' }
            ],
            correctAnswer: 'A',
            explanation: 'Regulasi emosi guru adalah fondasi utama de-eskalasi; anak yang sedang kacau membutuhkan ketenangan guru, bukan kemarahan balasan.'
          }
        ]
      },
      assignment: {
        id: 'TASK-PAUD-04',
        title: 'Jurnal Refleksi Disiplin Positif',
        description: 'Tuliskan jurnal refleksi pengalaman pribadi (sekitar 250-400 kata) mengenai penanganan perilaku anak/tantrum di kelas dan rencana perubahan pendekatan Anda ke depan.',
        instructions: [
          'Ceritakan 1 pengalaman nyata saat Anda menghadapi anak tantrum, merebut mainan, atau menunjukkan perilaku menantang di sekolah/rumah.',
          'Bagaimana respon tindakan dan perkataan yang Anda lakukan saat itu?',
          'Analisis apa yang sudah baik dari respon tersebut, dan apa hal yang perlu diperbaiki.',
          'Berdasarkan materi Modul 4, bagaimana rencana pendekatan baru yang akan Anda terapkan jika situasi serupa terulang kembali (frasa kalimat positif, konsekuensi logis, dan validasi emosi)?',
          'Anda dapat menulis langsung pada kotak editor teks yang disediakan di website, atau mengunggah dokumen PDF/DOC/DOCX.'
        ],
        acceptedFormats: ['PDF', 'DOC', 'DOCX'],
        maxFileSizeMB: 10,
        hasRichTextEditor: true,
        rubric: [
          { criterion: 'Kedalaman Refleksi & Kejujuran Diri', weight: 30, description: 'Mampu merefleksikan pengalaman secara jujur, mendalam, dan berbasis kesadaran diri.' },
          { criterion: 'Pemahaman Prinsip Disiplin Positif', weight: 30, description: 'Menunjukkan penguasaan konsep validasi emosi, regulasi diri, dan konsekuensi logis.' },
          { criterion: 'Analisis Perilaku & Kebutuhan Anak', weight: 20, description: 'Mampu menganalisis akar penyebab perilaku (unmet needs) bukan hanya menyalahkan anak.' },
          { criterion: 'Konkretitas Rencana Perubahan Sikap', weight: 20, description: 'Menyusun kalimat positif dan strategi tindakan nyata yang siap dipraktikkan di kelas.' }
        ]
      }
    }
  ]
};
