/* ============================================================
   PORTOFOLIO — script.js
   Rasya Arfian Akbar — Web & Mobile Developer
   ============================================================ */

'use strict';

// ============================================================
// SUPABASE CLIENT & CONFIGURATION
// ============================================================
const SUPABASE_URL = 'https://dhmabndpzrzacjrtoank.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobWFibmRwenJ6YWNqcnRvYW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNDAxMjksImV4cCI6MjEwNjkxNjEyOX0.FCHEbO5LuAkPkIZZ4kkRIxmCkT40nhHm0shNYm4UcTA';

let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

// URL default CV di Supabase Storage
const DEFAULT_CV_URL = 'https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/CV-Rasya-Arfian-Akbar.pdf';
let currentCvUrl = DEFAULT_CV_URL;
let currentCvViewMode = 'pdf';
let cvCacheVersion = Date.now();

function getCvFreshUrl(url) {
  const base = url || currentCvUrl || DEFAULT_CV_URL;
  const sep = base.includes('?') ? '&' : '?';
  return `${base}${sep}t=${cvCacheVersion}`;
}

// ============================================================
// DATA PROYEK DENGAN METODE STAR (Problem - Solution - Impact)
// ============================================================
const MAX_PROJECT_IMAGES = 3;
const PROJECT_IMAGES_BUCKET = 'project-images';
function buildProjectImages(folder, options = {}) {
  const base = `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/projects/${folder}/`;
  const ext = options.ext || 'png';
  const teamExt = options.teamExt || (folder === 'karaoke-poprock' ? 'jpg' : ext);
  if (options.teamOnly) {
    return [
      {
        src: base + `tim.${teamExt}`,
        caption: options.caption || 'Dokumentasi tim pengerjaan proyek',
        team: true
      }
    ];
  }
  if (options.noTeam) {
    return [
      { src: base + `1.${ext}`, caption: options.caption1 || 'Tampilan utama proyek' },
      { src: base + `2.${ext}`, caption: options.caption2 || 'Fitur & antarmuka proyek' },
    ];
  }
  return [
    { src: base + `1.${ext}`, caption: options.caption1 || 'Tampilan utama proyek' },
    { src: base + `2.${ext}`, caption: options.caption2 || 'Fitur & antarmuka proyek' },
    { src: base + `tim.${teamExt}`, caption: options.captionTeam || 'Dokumentasi tim pengerjaan proyek', team: true },
  ];
}

const fallbackProjects = [
  {
    title: 'Chatbot Adenomyosis dan Endometriosis - BRIN',
    images: buildProjectImages('chatbot-brin'),
    category: 'mobile',
    icon: 'fa-robot',
    gradient: 'linear-gradient(135deg,#047857,#10b981)',
    tags: ['React Native', 'JavaScript', 'Python', 'Django', 'Supabase', 'Qdrant', 'Figma'],
    description: 'Aplikasi chatbot untuk konsultasi dan edukasi seputar penyakit kewanitaan (adenomyosis dan endometriosis) yang dikembangkan bersama Badan Riset dan Inovasi Nasional (BRIN). Dibangun menggunakan Python dan JavaScript dengan alur percakapan dan materi edukasi terstruktur agar mudah dipahami pengguna.',
    challenge: 'Kebutuhan media edukasi dan konsultasi medis kewanitaan yang sensitif, terpercaya, dan memerlukan akurasi informasi ilmiah berbasis data rujukan.',
    solution: 'Membangun antarmuka mobile responsif dengan React Native serta mengintegrasikan Qdrant Vector DB & Supabase untuk pencarian semantik cerdas dengan backend Python Django.',
    impact: 'Menyajikan alur konsultasi interaktif yang edukatif, aman, ramah pengguna, dan saat ini dalam tahap persiapan deployment uji coba BRIN.',
    features: [
      'Project Member | Front-End Developer & System Analyst (Juni 2026 - Sekarang)',
      'Integrasi Basis Data Vektor Qdrant & Supabase untuk pencarian materi cerdas',
      'Pengembangan antarmuka mobile responsif menggunakan React Native',
      'Penyusunan materi edukasi seputar penyakit adenomyosis dan endometriosis',
      'Backend layanan pemrosesan konsultasi berbasis Python & Django',
      'Prototype dan alur user experience dirancang melalui Figma',
      'Tahap finalisasi dan persiapan deployment'
    ],
    github: '#',
    live: '#',
    figma: '#',
    is_featured: true,
  },
  {
    title: 'Migrasi Sistem Informasi Akademik Berbasis Web - Politeknik Astra',
    images: buildProjectImages('migrasi-sia'),
    category: 'web',
    icon: 'fa-graduation-cap',
    gradient: 'linear-gradient(135deg,#0f172a,#2563eb)',
    tags: ['Next.js', 'ASP.NET 8.0', 'JavaScript', 'C#', 'SQL Server', 'GitLab', 'Figma'],
    description: 'Melakukan migrasi dan mengembangkan ulang website Sistem Informasi Akademik (SIA) versi legacy menjadi arsitektur modern menggunakan Next.js dan framework backend ASP.NET 8.0, mencakup pembaruan dan perbaikan struktur kode serta database.',
    challenge: 'Website SIA versi lama memiliki performa lambat, struktur kode monolitik yang sulit di-maintain, dan antarmuka usang bagi civitas akademika.',
    solution: 'Migrasi total frontend ke Next.js dengan SSR dan arsitektur backend performa tinggi ASP.NET 8.0 (C#) serta restrukturisasi relasi basis data SQL Server.',
    impact: 'Pemuatan halaman akademik menjadi jauh lebih responsif.',
    features: [
      'Project Member | Full-stack Developer (September 2025 - Mei 2026)',
      'Migrasi frontend SIA dari teknologi lama ke framework modern Next.js',
      'Pembangunan web service performa tinggi dengan ASP.NET 8.0 dan C#',
      'Pembaruan struktur database dan optimasi relasi data di SQL Server',
      'Redesain tampilan antarmuka akademik yang user-friendly via Figma'
    ],
    github: '#',
    live: '#',
    figma: '#',
    is_featured: true,
  },
  {
    title: 'Booking Motor - Politeknik Astra',
    images: buildProjectImages('booking-motor', { teamOnly: true }),
    is_confidential: true,
    confidential_note: 'Tampilan antarmuka sistem dan struktur kode dilindungi kerahasiaan kredensial perusahaan (PT Astra Honda Motor). Oleh karena itu, dokumentasi visual yang ditampilkan khusus foto tim pengembang.',
    category: 'web',
    icon: 'fa-motorcycle',
    gradient: 'linear-gradient(135deg,#b91c1c,#ef4444)',
    tags: ['Java', 'Oracle SQL Developer', 'NetBeans', 'Postman', 'SonarQube'],
    description: 'Mengembangkan fungsi sistem Booking motor untuk proyek migrasi PT Astra Honda Motor (AHM) dengan fokus pada backend, ketepatan transaksi database, dan kualitas kode.',
    challenge: 'Migrasi data dan fungsionalitas booking sepeda motor yang memerlukan validasi transaksi data ketat.',
    solution: 'Pengembangan RESTful API berbasis Java dengan pemodelan skema Oracle SQL Developer.',
    impact: 'API pemesanan servis berhasil terintegrasi dengan standar kode bersih dan keamanan terverifikasi SonarQube.',
    features: [
      'Project Member | Back-End Developer & Front-End Developer (Juli 2026 - Agustus 2026)',
      'Pengembangan modul backend Booking motor untuk kebutuhan migrasi sistem AHM',
      'Pengujian API endpoint dan validasi request otomatis dengan Postman',
      'Pemeriksaan kualitas kode dan standar compliance menggunakan SonarQube'
    ],
    github: '#',
    live: '#',
    is_featured: false,
  },
  {
    title: 'Manajemen Asset - Politeknik Astra',
    images: buildProjectImages('manajemen-asset'),
    category: 'web',
    icon: 'fa-boxes-stacked',
    gradient: 'linear-gradient(135deg,#1e3a5f,#3b82f6)',
    tags: ['PHP', 'MySQL', 'Figma', 'Draw.io'],
    description: 'Membangun website sistem inventaris dan manajemen aset kampus menggunakan PHP dan database MySQL. Dilengkapi fitur maintenance berkala serta pelaporan barang yang ingin dimaintenance.',
    challenge: 'Pendataan barang inventaris dan riwayat servis aset kampus yang sebelumnya dicatat secara manual dan rawan kehilangan data.',
    solution: 'Membangun platform inventaris berbasis PHP & MySQL dengan modul pelaporan maintenance berkala, pelacakan status, dan visualisasi proses bisnis via Draw.io.',
    impact: 'UPT Infromatika dapat memantau status fisik ribuan aset dan merespons pengajuan perbaikan barang secara cepat dan terdata.',
    features: [
      'Project Member | Full-stack Developer, UI/UX Designer & System Analyst (Oktober 2025 - Februari 2026)',
      'Fitur pencatatan dan monitoring status inventaris barang secara berkala',
      'Modul pelaporan barang rusak dan jadwal pemeliharaan (maintenance)',
      'Perancangan alur proses bisnis dan diagram sistem menggunakan Draw.io',
      'Desain mockup antarmuka pengguna interaktif menggunakan Figma'
    ],
    github: '#',
    live: '#',
    figma: '#',
    is_featured: false,
  },
  {
    title: 'Aplikasi Dekstop Karaoke Poprock - Politeknik Astra',
    images: buildProjectImages('karaoke-poprock', { teamExt: 'jpg' }),
    category: 'desktop',
    icon: 'fa-microphone-lines',
    gradient: 'linear-gradient(135deg,#6d28d9,#8b5cf6)',
    tags: ['Java', 'JavaFX', 'C#', 'SQL Server'],
    description: 'Membangun dua aplikasi desktop pengelolaan karaoke menggunakan Java dan C# yang terintegrasi dengan SQL Server. Aplikasi mencakup modul manajemen operasional (paket, staf, ruangan, jam, dan menu) serta modul transaksi kasir.',
    challenge: 'Kebutuhan integrasi dua aplikasi berbeda (JavaFX dan C#) agar dapat sinkron secara real-time ke satu basis data tanpa konflik transaksi kasir.',
    solution: 'Perancangan arsitektur database terpusat di SQL Server dengan isolasi transaksi ACID untuk reservasi jam ruangan, pesanan menu, dan kasir POS.',
    impact: 'Operasional karaoke berjalan teratur, waktu tunggu reservasi terpangkas, dan laporan rekapitulasi omset otomatis tercatat.',
    features: [
      'Project Member | Fullstack Developer, UI/UX Designer & System Analyst (Mei 2025 - Juli 2026)',
      'Modul manajemen staf, jadwal ketersediaan ruangan karaoke, dan reservasi jam',
      'Modul kasir dan transaksi penjualan ruangan, paket promo, dan menu makanan',
      'Integrasi dua aplikasi berbeda (Java & C#) ke satu basis data SQL Server',
      'Penyusunan laporan penjualan dan riwayat transaksi kasir'
    ],
    github: '#',
    live: '#',
    is_featured: false,
  },
  {
    title: 'Aplikasi Dekstop Booking Hotel - Politeknik Astra',
    images: buildProjectImages('booking-hotel', { noTeam: true }),
    category: 'desktop',
    icon: 'fa-hotel',
    gradient: 'linear-gradient(135deg,#0369a1,#0ea5e9)',
    tags: ['C', 'Draw.io', 'Data Structures'],
    description: 'Membangun Aplikasi Booking Hotel berbasis bahasa C yang meliputi fungsi manajemen data kamar, customer, paket member, karyawan, jenis kamar, dan tipe pembayaran serta transaksi booking kamar, pendaftaran member, dan pembayaran denda.',
    challenge: 'Mengelola manajemen kamar, pendaftaran member, dan perhitungan denda menginap menggunakan bahasa tingkat menengah C tanpa bantuan database engine.',
    solution: 'Implementasi struktur data dinamis (struct, linked list, file handling) yang efisien, dilengkapi pemodelan alur kerja sistem via Draw.io.',
    impact: 'Program berjalan sangat ringan, waktu pemrosesan transaksi secepat kilat, dan penggunaan memori RAM sangat optimal.',
    features: [
      'Project Member | Fullstack Developer, UI/UX Designer & System Analyst (Desember 2024 - Februari 2025)',
      'Struktur data efisien untuk manajemen kamar, customer, paket member, dan staf',
      'Sistem transaksi pemesanan kamar dan perhitungan biaya sewa',
      'Modul pendaftaran keanggotaan (member) dan kalkulasi denda keterlambatan',
      'Dokumentasi alur sistem data flow terstruktur menggunakan Draw.io'
    ],
    github: '#',
    live: '#',
    is_featured: false,
  },
];

let currentProjects = [...fallbackProjects];
let activeCategoryFilter = 'all';
let currentSearchQuery = '';

// ============================================================
// DATA SERTIFIKASI & PELATIHAN INTERAKTIF
// ============================================================
const CERTIFICATES_BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/certificates/`;

const certificationsData = [
  {
    title: 'Artificial Intelligence',
    slug: 'artificial-intelligence',
    pdfUrl: `${CERTIFICATES_BASE_URL}artificial-intelligence.pdf`,
    year: '2026',
    date: '16 Oktober 2026',
    issuer: 'Lembaga Kursus Bisa AI Academy',
    category: 'Kecerdasan Buatan & Machine Learning',
    description: 'Pemahaman konsep dasar Artificial Intelligence (AI) dan Machine Learning: pemrosesan data, pengenalan pola, otomasi cerdas, algoritma pembelajaran mesin, serta penerapan kecerdasan buatan untuk pemecahan masalah.',
    credentialId: '2026/506/69181',
    icon: 'fa-solid fa-brain'
  },
  {
    title: 'Basic Figma: Pembuatan UI Aplikasi Mobile',
    slug: 'basic-figma',
    pdfUrl: `${CERTIFICATES_BASE_URL}basic-figma.pdf`,
    year: '2026',
    issuer: 'Lembaga Kursus Bisa AI Academy',
    category: 'UI/UX Design, Auto-Layout & Interactive Prototyping',
    description: 'Pelatihan intensif perancangan antarmuka pengguna mobile menggunakan Figma: auto-layout, interactive components, wireframing, color palette & typography hierarchy, design system, dan prototipe animasi micro-interaction.',
    credentialId: '2026/537/69181',
    icon: 'fa-brands fa-figma'
  },
  {
    title: 'Dasar – dasar Node JS',
    slug: 'dasar-nodejs',
    pdfUrl: `${CERTIFICATES_BASE_URL}dasar-nodejs.pdf`,
    year: '2026',
    date: '17 Oktober 2026',
    issuer: 'Lembaga Kursus Bisa AI Academy',
    category: 'Backend & JavaScript Runtime Environment',
    level: 'Pemula',
    progress: 'Selesai (Kelas Gratis)',
    description: 'Pemahaman mendalam mengenai arsitektur event-driven dan asynchronous I/O pada Node.js, Express.js middleware, modular architecture, manajemen dependency NPM, serta pembuatan RESTful API terstruktur.',
    credentialId: '2026/412/69181',
    icon: 'fa-brands fa-node-js'
  },
  {
    title: 'Basic Excel',
    slug: 'basic-excel',
    pdfUrl: `${CERTIFICATES_BASE_URL}basic-excel.pdf`,
    year: '2026',
    date: '17 Oktober 2026',
    issuer: 'Lembaga Kursus Bisa AI Academy',
    category: 'Pengolahan & Analisis Data',
    level: 'Pemula',
    progress: 'Selesai (Pelatihan Asinkronus)',
    description: 'Penguasaan formula dan fungsi esensial Microsoft Excel, manipulasi tabel data, conditional formatting, fungsi statistik dasar (SUM, AVERAGE, COUNT, IF), data cleaning, serta penyusunan lembar kerja analisis kuantitatif.',
    credentialId: '2026/294/69181',
    icon: 'fa-solid fa-file-excel'
  },
  {
    title: 'MikroTik Certified Network Associate (MTCNA)',
    slug: 'mtcna-mikrotik',
    pdfUrl: `${CERTIFICATES_BASE_URL}mtcna-mikrotik.pdf`,
    year: '2026',
    date: '31 Januari 2026',
    issuer: 'Mikrotikls SIA (Riga, Latvia)',
    verifyUrl: 'https://mikrotik.com/certificates',
    category: 'Jaringan Komputer, Routing, NAT & Firewall',
    description: 'Sertifikasi keahlian internasional resmi dari Mikrotikls SIA (Riga, Latvia). Memvalidasi kompetensi dalam administrasi RouterOS MikroTik: konfigurasi routing dinamis/statis, DHCP server/client, firewall filter rules, NAT, queue bandwidth management, bridge, dan maintenance jaringan.',
    credentialId: '2601NA2655',
    icon: 'fa-solid fa-network-wired'
  },
  {
    title: 'Dasar - Dasar Python',
    slug: 'dasar-python',
    pdfUrl: `${CERTIFICATES_BASE_URL}dasar-python.pdf`,
    year: '2026',
    date: '05 Agustus 2026',
    issuer: 'Lembaga Kursus Bisa AI Academy',
    category: 'Algoritma & Pemrograman Python',
    level: 'Pemula',
    progress: 'Selesai (Pelatihan Asinkronus)',
    description: 'Fondasi pemrograman Python oleh Bisa AI Academy: sintaksis dasar, tipe data, variabel, kontrol alur (if-else), perulangan (for, while), fungsi kustom, manipulasi string, struktur data list & dictionary, serta logika algoritma.',
    credentialId: '2026/249/69181',
    icon: 'fa-brands fa-python'
  },
  {
    title: 'Python Fundamental',
    slug: 'python-fundamental',
    pdfUrl: `${CERTIFICATES_BASE_URL}python-fundamental.pdf`,
    year: '2025',
    date: '04 Agustus 2025',
    issuer: 'Aguna Course (Ahmad Rosid Komarudin - CEO)',
    verifyUrl: 'https://agunacourse.com/cek-sertifikat',
    category: 'Pemrograman Python & Logika Algoritma Dasar',
    description: 'Kursus pemantapan fondasi bahasa pemrograman Python oleh Aguna Course: pengenalan sintaksis, variabel, kontrol percabangan, loop iteration, fungsi modular, dan pemecahan masalah algoritma dasar.',
    credentialId: 'AC-315-33886729-97',
    icon: 'fa-brands fa-python'
  },
  {
    title: 'Linux Fundamental',
    slug: 'linux-fundamental',
    pdfUrl: `${CERTIFICATES_BASE_URL}linux-fundamental.pdf`,
    year: '2025',
    date: '04 Agustus 2025',
    issuer: 'Aguna Course (Ahmad Rosid Komarudin - CEO)',
    verifyUrl: 'https://agunacourse.com/cek-sertifikat',
    category: 'Sistem Operasi Linux, Terminal CLI & Server Administration',
    description: 'Kursus fondasi sistem operasi Linux oleh Aguna Course: navigasi direktori CLI (Command Line Interface), manajemen file dan hak akses (chmod, chown), pengelolaan proses latar belakang, manajemen pengguna dan grup, package management, serta dasar shell command.',
    credentialId: 'AC-050-75298727-98',
    icon: 'fa-brands fa-linux'
  },
  {
    title: 'Virtual Machine Fundamental',
    slug: 'virtual-machine',
    pdfUrl: `${CERTIFICATES_BASE_URL}virtual-machine.pdf`,
    year: '2025',
    date: '05 Mei 2025',
    issuer: 'Aguna Course (Ahmad Rosid Komarudin - CEO)',
    verifyUrl: 'https://agunacourse.com/cek-sertifikat',
    category: 'Sistem Operasi, Virtualisasi & Hypervisor',
    description: 'Kursus fundamental perancangan dan manajemen mesin virtual (Virtual Machine) oleh Aguna Course: konsep arsitektur hypervisor Type-1 dan Type-2, alokasi resource hardware (CPU, RAM, virtual disk), konfigurasi adapter jaringan virtual (Bridged, NAT, Host-Only), serta isolasi sistem operasi.',
    credentialId: 'AC-446-15449133-19',
    icon: 'fa-solid fa-server'
  },
  {
    title: 'Simulasi Jaringan dengan PNETLab',
    slug: 'simulasi-jaringan-pnetlab',
    pdfUrl: `${CERTIFICATES_BASE_URL}simulasi-jaringan-pnetlab.pdf`,
    year: '2025',
    date: '04 Agustus 2025',
    issuer: 'Aguna Course (Ahmad Rosid Komarudin - CEO)',
    verifyUrl: 'https://agunacourse.com/cek-sertifikat',
    category: 'Simulasi Topologi Jaringan & Emulasi Router/Switch',
    description: 'Kursus simulasi topologi jaringan komputer menggunakan platform PNETLab oleh Aguna Course: instalasi dan konfigurasi image router dan switch, perancangan arsitektur jaringan virtual, konfigurasi VLAN dan routing, serta analisis lalu lintas paket data.',
    credentialId: 'AC-205-42646055-11',
    icon: 'fa-solid fa-diagram-project'
  }
];

// ============================================================
// THEME SWITCHER (LIGHT & DARK MODE)
// ============================================================
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

function applyTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark-theme');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  } else {
    document.body.classList.remove('dark-theme');
    if (themeIcon) {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }
}

try {
  const savedTheme = localStorage.getItem('rasya-portfolio-theme');
  if (savedTheme) applyTheme(savedTheme);
} catch (e) { }

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.body.classList.contains('dark-theme');
    const nextTheme = isDark ? 'light' : 'dark';
    applyTheme(nextTheme);
    try { localStorage.setItem('rasya-portfolio-theme', nextTheme); } catch (e) { }
    showToast(nextTheme === 'dark' ? 'Mode Gelap diaktifkan' : 'Mode Terang diaktifkan');
  });
}

// ============================================================
// INTERACTIVE SPOTLIGHT & 3D TILT EFFECT
// ============================================================
function initInteractiveCards() {
  document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4;
        const rotateY = ((x - centerX) / centerX) * 4;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}

// ============================================================
// 1-CLICK COPY TEXT & TOAST NOTIFICATION
// ============================================================
function copyText(text, label) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`${label || 'Teks'} berhasil disalin ke clipboard! 📋`);
    }).catch(() => {
      showToast(`${label || 'Teks'}: ${text}`);
    });
  } else {
    showToast(`${label || 'Teks'}: ${text}`);
  }
}

function showToast(message) {
  const toast = document.getElementById('toast-notification');
  const toastMsg = document.getElementById('toast-message');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3200);
  }
}

// ============================================================
// GALERI GAMBAR PROYEK (maks. 3, 1 di antaranya foto tim)
// ============================================================
function getProjectImages(p) {
  let list = [];
  if (Array.isArray(p.images)) {
    list = p.images;
  } else if (typeof p.images === 'string' && p.images.trim()) {
    list = p.images.split(',');
  }
  list = list
    .map(i => (typeof i === 'string' ? { src: i.trim() } : { ...i }))
    .filter(i => i && typeof i.src === 'string' && i.src.trim() !== '');

  if (list.length === 0 && typeof p.image_url === 'string' && p.image_url.trim() !== '') {
    list = [{ src: p.image_url.trim() }];
  }

  const isHotel = (p.title || '').toLowerCase().includes('booking hotel');
  if (isHotel) {
    // Proyek booking hotel TIDAK ada foto tim (permintaan user)
    return list.filter(i => !i.team && !i.src.includes('tim.') && !i.src.includes('team.'));
  }

  // Tandai otomatis properti team: true jika berkas adalah tim/team
  list.forEach(item => {
    if (typeof item.src === 'string' && (item.src.includes('/tim.') || item.src.includes('/team.') || item.src.includes('tim.png') || item.src.includes('tim.jpg'))) {
      item.team = true;
      if (!item.caption) item.caption = 'Dokumentasi tim pengerjaan proyek';
    }
  });

  const isConfidential = p.is_confidential || (p.title || '').toLowerCase().includes('booking motor');
  if (isConfidential) {
    const teamImg = list.find(i => i.team);
    if (teamImg) {
      return [{
        ...teamImg,
        team: true,
        caption: teamImg.caption || 'Dokumentasi tim pengerjaan proyek'
      }];
    }
    const base = `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/projects/booking-motor/`;
    return [{
      src: base + 'tim.png',
      caption: 'Dokumentasi tim pengerjaan proyek',
      team: true
    }];
  }

  if (list.length > MAX_PROJECT_IMAGES) {
    const team = list.find(i => i.team);
    const others = list.filter(i => i !== team);
    list = team
      ? [...others.slice(0, MAX_PROJECT_IMAGES - 1), team]
      : others.slice(0, MAX_PROJECT_IMAGES);
  }
  return list;
}

function projectPlaceholderHtml(p, cls) {
  return `<div class="${cls}" style="background:${p.gradient || 'linear-gradient(135deg,#1e3a5f,#2563eb)'}">
      <i class="fa-solid ${p.icon || 'fa-code'}"></i>
    </div>`;
}

const SUPPORTED_IMG_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'PNG', 'JPG'];

function tryNextImageExtension(img, onCompleteFailure) {
  if (!img) return;
  const currentSrc = img.src || '';
  const match = currentSrc.match(/\.(png|jpg|jpeg|webp|PNG|JPG)(\?.*)?$/i);
  if (!match) {
    if (typeof onCompleteFailure === 'function') onCompleteFailure();
    return;
  }
  const currentExt = match[1];
  let tried = (img.dataset.triedExts || currentExt).split(',').map(s => s.trim().toLowerCase());
  if (!tried.includes(currentExt.toLowerCase())) {
    tried.push(currentExt.toLowerCase());
  }

  const nextExt = SUPPORTED_IMG_EXTS.find(ext => !tried.includes(ext.toLowerCase()));
  if (nextExt) {
    tried.push(nextExt.toLowerCase());
    img.dataset.triedExts = tried.join(',');
    const newSrc = currentSrc.replace(/\.(png|jpg|jpeg|webp|PNG|JPG)(\?.*)?$/i, '.' + nextExt + (match[2] || ''));
    img.src = newSrc;

    const gallery = img.closest('.modal-gallery');
    const idx = img.dataset.idx;
    if (gallery && idx !== undefined) {
      const counterpart = gallery.querySelector(`img[data-idx="${idx}"]:not([src="${newSrc}"])`);
      if (counterpart) {
        counterpart.dataset.triedExts = tried.join(',');
        counterpart.src = newSrc;
      }
    }
  } else {
    if (typeof onCompleteFailure === 'function') onCompleteFailure();
  }
}

window.projectCardImgFallback = function (img) {
  tryNextImageExtension(img, () => {
    img.onerror = null;
    const wrap = img.closest('.project-img-wrap');
    const holder = document.createElement('div');
    holder.className = 'project-img-placeholder';
    holder.style.background = img.dataset.gradient || 'linear-gradient(135deg,#1e3a5f,#2563eb)';
    holder.innerHTML = `<i class="fa-solid ${img.dataset.icon || 'fa-code'}"></i>`;
    img.replaceWith(holder);
    const badge = wrap && wrap.querySelector('.project-photo-count');
    if (badge) badge.remove();
  });
};

window.modalGalleryImgFallback = function (img) {
  tryNextImageExtension(img, () => {
    img.onerror = null;
    const gallery = img.closest('.modal-gallery');
    const idx = img.dataset.idx;
    if (!gallery) return;
    gallery.querySelectorAll(`[data-idx="${idx}"]`).forEach(el => el.remove());
    const remaining = gallery.querySelectorAll('.gallery-thumb');
    if (remaining.length === 0) {
      gallery.replaceWith(Object.assign(document.createElement('div'), {
        className: 'modal-img-placeholder',
        innerHTML: `<i class="fa-solid ${gallery.dataset.icon || 'fa-code'}"></i>`
      }));
      const ph = document.querySelector('#modal-content .modal-img-wrap > .modal-img-placeholder');
      if (ph) ph.style.background = gallery.dataset.gradient || 'linear-gradient(135deg,#1e3a5f,#2563eb)';
      return;
    }
    const stage = gallery.querySelector('.gallery-main');
    if (stage && !stage.querySelector('.gallery-slide.active')) {
      selectGalleryImage(remaining[0]);
    }
    if (remaining.length === 1) {
      const strip = gallery.querySelector('.gallery-thumbs');
      if (strip) strip.style.display = 'none';
    }
  });
};

window.selectGalleryImage = function selectGalleryImage(thumb) {
  const gallery = thumb.closest('.modal-gallery');
  if (!gallery) return;
  const idx = thumb.dataset.idx;
  gallery.querySelectorAll('.gallery-slide').forEach(s => s.classList.toggle('active', s.dataset.idx === idx));
  gallery.querySelectorAll('.gallery-thumb').forEach(t => t.classList.toggle('active', t === thumb));
};

window.navigateGallerySlide = function (btn, dir) {
  const gallery = btn.closest('.modal-gallery');
  if (!gallery) return;
  const thumbs = Array.from(gallery.querySelectorAll('.gallery-thumb'));
  if (thumbs.length <= 1) return;
  const currentIdx = thumbs.findIndex(t => t.classList.contains('active'));
  let nextIdx = (currentIdx + dir + thumbs.length) % thumbs.length;
  selectGalleryImage(thumbs[nextIdx]);
};

window.switchToTeamSlide = function () {
  const gallery = document.querySelector('.modal-gallery');
  if (!gallery) return;
  const teamThumb = gallery.querySelector('.gallery-thumb.thumb-is-team');
  if (teamThumb) {
    selectGalleryImage(teamThumb);
    gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

function buildModalGallery(p) {
  const imgs = getProjectImages(p);
  if (imgs.length === 0) return projectPlaceholderHtml(p, 'modal-img-placeholder');

  const isMobileProj = (p.category === 'mobile') || (p.title || '').toLowerCase().includes('chatbot');

  const slides = imgs.map((img, i) => {
    const isMobileSlide = isMobileProj && !img.team;
    return `
    <figure class="gallery-slide ${i === 0 ? 'active' : ''} ${isMobileSlide ? 'slide-mobile-screen' : ''} ${img.team ? 'slide-team' : ''}" data-idx="${i}">
      ${isMobileSlide ? `
        <div class="mobile-phone-frame">
          <img src="${img.src}" alt="${(img.caption || p.title).replace(/"/g, '&quot;')}" data-idx="${i}" onerror="modalGalleryImgFallback(this)" />
        </div>
      ` : `
        <img src="${img.src}" alt="${(img.caption || p.title).replace(/"/g, '&quot;')}" data-idx="${i}" onerror="modalGalleryImgFallback(this)" />
      `}
      <figcaption>
        ${img.team ? '<span class="gallery-team-badge"><i class="fa-solid fa-people-group"></i> Foto Tim</span>' : (isMobileSlide ? '<span class="gallery-mobile-badge"><i class="fa-solid fa-mobile-screen-button"></i> Mobile</span>' : '')}
        ${img.caption || ''}
      </figcaption>
    </figure>`;
  }).join('');

  const thumbs = imgs.map((img, i) => {
    const isMobileThumb = isMobileProj && !img.team;
    return `
    <button type="button" class="gallery-thumb ${i === 0 ? 'active' : ''} ${img.team ? 'thumb-is-team' : ''} ${isMobileThumb ? 'thumb-is-mobile' : ''}" data-idx="${i}" onclick="selectGalleryImage(this)" aria-label="${img.team ? 'Foto tim' : 'Gambar ' + (i + 1)}">
      <img src="${img.src}" alt="" data-idx="${i}" onerror="modalGalleryImgFallback(this)" />
      ${img.team ? '<span class="thumb-team-icon"><i class="fa-solid fa-people-group"></i></span>' : ''}
      <span class="thumb-label-text">${img.team ? 'Foto Tim' : (isMobileThumb ? `Layar ${i + 1}` : `Foto ${i + 1}`)}</span>
    </button>`;
  }).join('');

  const navBtns = imgs.length > 1 ? `
    <button type="button" class="gallery-nav-btn prev" onclick="navigateGallerySlide(this, -1)" aria-label="Gambar Sebelumnya"><i class="fa-solid fa-chevron-left"></i></button>
    <button type="button" class="gallery-nav-btn next" onclick="navigateGallerySlide(this, 1)" aria-label="Gambar Berikutnya"><i class="fa-solid fa-chevron-right"></i></button>
  ` : '';

  return `
    <div class="modal-gallery ${isMobileProj ? 'is-mobile-gallery' : ''}" data-icon="${p.icon || 'fa-code'}" data-gradient="${p.gradient || ''}">
      <div class="gallery-main">
        ${slides}
        ${navBtns}
      </div>
      <div class="gallery-thumbs" ${imgs.length === 1 ? 'style="display:none"' : ''}>${thumbs}</div>
    </div>`;
}

// ============================================================
// RENDER KARTU PROYEK SECARA DINAMIS
// ============================================================
function filterMatchesProject(p) {
  const catMatch = activeCategoryFilter === 'all' || (p.category || 'web') === activeCategoryFilter;
  if (!catMatch) return false;
  if (!currentSearchQuery) return true;

  const q = currentSearchQuery.toLowerCase();
  const titleMatch = (p.title || '').toLowerCase().includes(q);
  const descMatch = (p.description || p.desc || '').toLowerCase().includes(q);
  const rawTags = Array.isArray(p.tags) ? p.tags.join(' ') : (p.tags || '');
  const tagMatch = rawTags.toLowerCase().includes(q);
  return titleMatch || descMatch || tagMatch;
}

function renderProjects(projects) {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;

  grid.innerHTML = projects.map((p, index) => {
    const projectImgs = getProjectImages(p);
    const cover = projectImgs.find(i => !i.team) || projectImgs[0];
    const isConfidential = p.is_confidential || (p.title || '').toLowerCase().includes('booking motor');
    const isMobile = (p.category === 'mobile') || (p.title || '').toLowerCase().includes('chatbot');
    const hasTeamPhoto = projectImgs.some(i => i.team);

    let imageHtml = '';
    if (cover) {
      if (isMobile) {
        imageHtml = `
          <div class="mobile-card-backdrop" style="background-image:url('${cover.src}')"></div>
          <div class="mobile-phone-mock">
            <img src="${cover.src}" alt="${p.title}" class="project-card-img mobile-screen-img" loading="lazy" data-icon="${p.icon || 'fa-code'}" data-gradient="${p.gradient || ''}" onerror="projectCardImgFallback(this)" />
          </div>
          <span class="project-mobile-badge"><i class="fa-solid fa-mobile-screen-button"></i> Mobile</span>
          ${hasTeamPhoto ? `<span class="project-has-team-badge" title="Tersedia foto dokumentasi tim"><i class="fa-solid fa-people-group"></i> +Foto Tim</span>` : ''}
          ${projectImgs.length > 1 ? `<span class="project-photo-count"><i class="fa-solid fa-images"></i> ${projectImgs.length}</span>` : ''}
        `;
      } else {
        imageHtml = `
          <img src="${cover.src}" alt="${p.title}" class="project-card-img" loading="lazy" data-icon="${p.icon || 'fa-code'}" data-gradient="${p.gradient || ''}" onerror="projectCardImgFallback(this)" />
          ${isConfidential ? `<span class="project-confidential-badge" title="Tampilan sistem dilindungi kredensial rahasia internal"><i class="fa-solid fa-shield-halved"></i> Kredensial</span>` : ''}
          ${hasTeamPhoto && !isConfidential ? `<span class="project-has-team-badge" title="Tersedia foto dokumentasi tim"><i class="fa-solid fa-people-group"></i> +Foto Tim</span>` : ''}
          ${projectImgs.length > 1 ? `<span class="project-photo-count"><i class="fa-solid fa-images"></i> ${projectImgs.length}</span>` : ''}
          ${(projectImgs.length === 1 && cover && cover.team) ? `<span class="project-photo-count team-only"><i class="fa-solid fa-people-group"></i> Foto Tim</span>` : ''}
        `;
      }
    } else {
      imageHtml = projectPlaceholderHtml(p, 'project-img-placeholder');
    }

    const rawTags = Array.isArray(p.tags)
      ? p.tags
      : (typeof p.tags === 'string' && p.tags.trim() ? p.tags.split(',') : []);

    const tagsHtml = rawTags
      .map(t => `<span class="project-tag">${t.trim()}</span>`)
      .slice(0, 4)
      .join('');

    const githubLink = p.github_url || p.github;
    const liveLink = p.live_url || p.live;
    const figmaLink = p.figma_url || p.figma;

    const linksHtml = [];
    if (githubLink && githubLink !== '#') {
      linksHtml.push(`<a href="${githubLink}" class="project-link" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>`);
    }
    if (figmaLink && figmaLink !== '#') {
      linksHtml.push(`<a href="${figmaLink}" class="project-link" target="_blank" rel="noopener"><i class="fa-brands fa-figma"></i> Figma</a>`);
    }
    if (liveLink && liveLink !== '#') {
      linksHtml.push(`<a href="${liveLink}" class="project-link" target="_blank" rel="noopener"><i class="fa-solid fa-globe"></i> Live Demo</a>`);
    }
    if (linksHtml.length === 0) {
      linksHtml.push(`<button class="project-link" style="background:none;border:none;cursor:pointer;padding:0;font-family:inherit;color:inherit;font-size:inherit;" onclick="openModal(${index})"><i class="fa-solid fa-circle-info"></i> Detail &amp; Dokumentasi</button>`);
    }

    const isHidden = !filterMatchesProject(p);

    return `
      <div class="project-card spotlight-card tilt-card ${p.is_featured ? 'featured' : ''} ${isHidden ? 'hidden' : ''} reveal visible" data-category="${p.category || 'web'}" data-index="${index}">
        ${p.is_featured ? '<div class="featured-badge">Featured</div>' : ''}
        <div class="project-img-wrap ${isMobile ? 'is-mobile-wrap' : ''}" onclick="openModal(${index})">
          ${imageHtml}
          <div class="project-overlay">
            <button class="btn-detail" onclick="openModal(${index})" id="btn-detail-${index}">Lihat Detail <i class="fa-solid fa-arrow-up-right-from-square"></i></button>
          </div>
        </div>
        <div class="project-info">
          <div class="project-tags">
            ${tagsHtml}
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-desc">${p.description || p.desc || ''}</p>
          <div class="project-footer">
            ${linksHtml.join('')}
          </div>
        </div>
      </div>
    `;
  }).join('');

  initInteractiveCards();
}

// Mengambil data proyek dari Supabase
async function loadProjectsFromSupabase() {
  if (!supabaseClient) return;

  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) return;

    if (data && data.length > 0) {
      currentProjects = data.map((remoteProj, idx) => {
        const localMatch = fallbackProjects.find(
          lp => (lp.title || '').toLowerCase().trim() === (remoteProj.title || '').toLowerCase().trim()
        ) || fallbackProjects[idx] || {};

        const isConfidential = localMatch.is_confidential || remoteProj.is_confidential || (remoteProj.title || '').toLowerCase().includes('booking motor');
        const isHotel = (remoteProj.title || localMatch.title || '').toLowerCase().includes('booking hotel');

        let resolvedImages = (remoteProj.images && remoteProj.images.length) ? remoteProj.images : localMatch.images;

        // Tandai bendera team: true jika berkas adalah tim/team
        if (Array.isArray(resolvedImages)) {
          resolvedImages = resolvedImages.map(img => {
            const isTeam = img.team || (typeof img.src === 'string' && (img.src.includes('/tim.') || img.src.includes('/team.') || img.src.includes('tim.png') || img.src.includes('tim.jpg')));
            return isTeam ? { ...img, team: true } : img;
          });
        }

        if (isHotel) {
          // Booking hotel TIDAK ada foto tim (permintaan user)
          if (Array.isArray(resolvedImages)) {
            resolvedImages = resolvedImages.filter(img => !img.team && !img.src.includes('tim.') && !img.src.includes('team.'));
          }
        } else if (!isConfidential) {
          // Jika data proyek remote belum menyertakan foto tim, namun localMatch memilikinya, sisipkan foto tim
          const hasTeamInResolved = Array.isArray(resolvedImages) && resolvedImages.some(img => img.team);
          if (!hasTeamInResolved && localMatch.images) {
            const localTeamImg = localMatch.images.find(img => img.team);
            if (localTeamImg) {
              resolvedImages = [...(resolvedImages || []), localTeamImg];
            }
          }
        }

        if (isConfidential) {
          const teamImg = Array.isArray(resolvedImages) ? resolvedImages.find(i => i.team || (typeof i.src === 'string' && (i.src.includes('tim.jpg') || i.src.includes('tim.png') || i.src.includes('tim.')))) : null;
          resolvedImages = teamImg ? [teamImg] : localMatch.images;
        }

        return {
          ...localMatch,
          ...remoteProj,
          is_confidential: isConfidential,
          confidential_note: localMatch.confidential_note || remoteProj.confidential_note,
          challenge: remoteProj.challenge || localMatch.challenge,
          solution: remoteProj.solution || localMatch.solution,
          impact: remoteProj.impact || localMatch.impact,
          icon: remoteProj.icon || localMatch.icon,
          gradient: remoteProj.gradient || localMatch.gradient,
          images: resolvedImages
        };
      });
      renderProjects(currentProjects);

      const heroStatNumber = document.querySelector('.hero-stats .stat-item:first-child .stat-number');
      if (heroStatNumber) {
        heroStatNumber.dataset.target = data.length;
        heroStatNumber.textContent = data.length + '+';
      }
    }
  } catch (err) { }
}

function setupSupabaseRealtime() {
  if (!supabaseClient) return;
  try {
    supabaseClient
      .channel('projects-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        loadProjectsFromSupabase();
      })
      .subscribe();
  } catch (err) { }
}

// ============================================================
// CV VIEWER & SUPABASE CV INTEGRATION
// ============================================================
const cvModalOverlay = document.getElementById('cv-modal-overlay');
const cvModalClose = document.getElementById('cv-modal-close');
const cvIframeContainer = document.getElementById('cv-iframe-container');
const cvOpenTabBtn = document.getElementById('cv-open-tab');
const cvModalDownloadBtn = document.getElementById('cv-modal-download');
const cvRefreshBtn = document.getElementById('cv-refresh-btn');
const cvSourceBadge = document.getElementById('cv-source-badge');

function updateCvLinks(url) {
  currentCvUrl = url || DEFAULT_CV_URL;
  const freshUrl = getCvFreshUrl(currentCvUrl);
  if (cvOpenTabBtn) cvOpenTabBtn.href = freshUrl;
  if (cvModalDownloadBtn) {
    cvModalDownloadBtn.href = currentCvUrl;
    cvModalDownloadBtn.setAttribute('download', 'CV-Rasya-Arfian-Akbar.pdf');
  }

  document.querySelectorAll('.btn-download-cv').forEach(btn => {
    btn.href = currentCvUrl;
    btn.setAttribute('download', 'CV-Rasya-Arfian-Akbar.pdf');
  });
}

function renderCvFallback() {
  if (!cvIframeContainer) return;
  cvIframeContainer.innerHTML = `
    <div class="cv-fallback-view">

      <div class="cv-doc-header">
        <h2 class="cv-doc-name">Rasya Arfian Akbar</h2>
        <div class="cv-doc-role">Web &amp; Mobile Developer · D3 Manajemen Informatika Politeknik Astra</div>
        <div class="cv-doc-contacts">
          <span><i class="fa-solid fa-envelope"></i> rasyaarfiana@gmail.com</span>
          <span><i class="fa-solid fa-graduation-cap"></i> 0320240064@polytechnic.astra.ac.id</span>
          <span><i class="fa-solid fa-phone"></i> +62 812-8997-9099</span>
          <span><i class="fa-solid fa-location-dot"></i> Bogor, Indonesia</span>
          <span><i class="fa-brands fa-linkedin"></i> <a href="https://www.linkedin.com/in/rasya-arfian-akbar-577b12404" target="_blank" rel="noopener" style="color:inherit; text-decoration:underline;">linkedin.com/in/rasya-arfian-akbar-577b12404</a></span>
          <span><i class="fa-brands fa-instagram"></i> @rasyaarfian</span>
        </div>
      </div>

      <div class="cv-doc-section">
        <h3 class="cv-doc-section-title"><i class="fa-solid fa-user"></i> Ringkasan Profesional</h3>
        <p class="cv-doc-item-desc">
          Mahasiswa Manajemen Informatika di Politeknik Astra memiliki pengalaman terkait membangun sebuah aplikasi mobile, web developer, merancang tampilan UI/UX, analisis kebutuhan sistem pada pengembangan aplikasi dan mengelola sistem database. Mahir menggunakan React Native, React.js, Next.js, C, Java, Java Spring Boot, dan Laravel. Memiliki kemampuan bekerja secara individu maupun dalam tim, mendukung komunikasi antar tim yang baik dan menganalisis setiap tugas dengan cermat. Memiliki pengalaman aktif dalam organisasi dan kepanitiaan.
        </p>
      </div>

      <div class="cv-doc-section">
        <h3 class="cv-doc-section-title"><i class="fa-solid fa-graduation-cap"></i> Pendidikan</h3>
        <div class="cv-doc-item">
          <div class="cv-doc-item-title">
            <span>Politeknik Astra — Cikarang, Indonesia</span>
            <span>Agustus 2024 — Sekarang</span>
          </div>
          <div class="cv-doc-item-sub">D3 Manajemen Informatika · GPA / IPK: 3.31 / 4.00</div>
        </div>
        <div class="cv-doc-item">
          <div class="cv-doc-item-title">
            <span>SMA Plus PGRI Cibinong — Bogor, Indonesia</span>
            <span>Juli 2021 — Juni 2024</span>
          </div>
          <div class="cv-doc-item-sub">Ilmu Pengetahuan Alam (IPA)</div>
        </div>
      </div>

      <div class="cv-doc-section">
        <h3 class="cv-doc-section-title"><i class="fa-solid fa-diagram-project"></i> Proyek Utama</h3>
        
        <div class="cv-doc-item">
          <div class="cv-doc-item-title">
            <span>Chatbot Adenomyosis dan Endometriosis — BRIN</span>
            <span>Juni 2026 — Sekarang</span>
          </div>
          <div class="cv-doc-item-sub">Project Member | Front-End Developer &amp; System Analyst</div>
          <p class="cv-doc-item-desc">Aplikasi chatbot konsultasi dan edukasi seputar penyakit kewanitaan bersama Badan Riset dan Inovasi Nasional (BRIN) menggunakan Python dan JavaScript.</p>
          <div class="cv-doc-tags">
            <span class="cv-doc-tag">React Native</span>
            <span class="cv-doc-tag">Django</span>
            <span class="cv-doc-tag">Supabase</span>
            <span class="cv-doc-tag">Qdrant</span>
            <span class="cv-doc-tag">Figma</span>
          </div>
        </div>

        <div class="cv-doc-item">
          <div class="cv-doc-item-title">
            <span>Booking Motor — Politeknik Astra</span>
            <span>Juli 2026 — Agustus 2026</span>
          </div>
          <div class="cv-doc-item-sub">Project Member | Back-End Developer &amp; Front-End Developer</div>
          <p class="cv-doc-item-desc">Mengembangkan fungsi Booking motor untuk proyek migrasi PT Astra Honda Motor (AHM).</p>
          <div class="cv-doc-tags">
            <span class="cv-doc-tag">Java</span>
            <span class="cv-doc-tag">Oracle SQL Developer</span>
            <span class="cv-doc-tag">Postman</span>
            <span class="cv-doc-tag">SonarQube</span>
          </div>
        </div>

        <div class="cv-doc-item">
          <div class="cv-doc-item-title">
            <span>Manajemen Asset — Politeknik Astra</span>
            <span>Oktober 2025 — Februari 2026</span>
          </div>
          <div class="cv-doc-item-sub">Project Member | Full-stack Developer, UI/UX Designer &amp; System Analyst</div>
          <p class="cv-doc-item-desc">Membangun website inventaris PHP &amp; MySQL dengan fitur pelaporan maintenance barang.</p>
          <div class="cv-doc-tags">
            <span class="cv-doc-tag">PHP</span>
            <span class="cv-doc-tag">MySQL</span>
            <span class="cv-doc-tag">Figma</span>
            <span class="cv-doc-tag">Draw.io</span>
          </div>
        </div>

        <div class="cv-doc-item">
          <div class="cv-doc-item-title">
            <span>Migrasi Sistem Informasi Akademik Web — Politeknik Astra</span>
            <span>September 2025 — Mei 2026</span>
          </div>
          <div class="cv-doc-item-sub">Project Member | Full-stack Developer</div>
          <p class="cv-doc-item-desc">Migrasi dan refactoring website SIA ke Next.js dan backend ASP.NET 8.0 dengan database SQL Server.</p>
          <div class="cv-doc-tags">
            <span class="cv-doc-tag">Next.js</span>
            <span class="cv-doc-tag">ASP.NET 8.0</span>
            <span class="cv-doc-tag">C#</span>
            <span class="cv-doc-tag">SQL Server</span>
          </div>
        </div>

        <div class="cv-doc-item">
          <div class="cv-doc-item-title">
            <span>Aplikasi Dekstop Karaoke Poprock — Politeknik Astra</span>
            <span>Mei 2025 — Juli 2026</span>
          </div>
          <div class="cv-doc-item-sub">Project Member | Fullstack Developer, UI/UX &amp; System Analyst</div>
          <p class="cv-doc-item-desc">Dua aplikasi desktop operasional staf dan kasir terintegrasi SQL Server.</p>
          <div class="cv-doc-tags">
            <span class="cv-doc-tag">Java</span>
            <span class="cv-doc-tag">JavaFX</span>
            <span class="cv-doc-tag">C#</span>
            <span class="cv-doc-tag">SQL Server</span>
          </div>
        </div>

        <div class="cv-doc-item">
          <div class="cv-doc-item-title">
            <span>Aplikasi Dekstop Booking Hotel — Politeknik Astra</span>
            <span>Desember 2024 — Februari 2025</span>
          </div>
          <div class="cv-doc-item-sub">Project Member | Fullstack Developer, UI/UX &amp; System Analyst</div>
          <p class="cv-doc-item-desc">Aplikasi desktop booking hotel berbasis bahasa C dengan modul transaksi kamar dan member.</p>
          <div class="cv-doc-tags">
            <span class="cv-doc-tag">Bahasa C</span>
            <span class="cv-doc-tag">Draw.io</span>
          </div>
        </div>
      </div>

      <div class="cv-doc-section">
        <h3 class="cv-doc-section-title"><i class="fa-solid fa-certificate"></i> Sertifikasi &amp; Pelatihan</h3>
        <p class="cv-doc-item-desc">
          • <strong>MikroTik Certified Network Associate (MTCNA)</strong> — Mikrotikls SIA (Riga, Latvia), 2026 (No: 2601NA2655)<br>
          • <strong>Artificial Intelligence</strong> — Lembaga Kursus Bisa AI Academy, 2026 (No: 2026/506/69181)<br>
          • <strong>Dasar – dasar Node JS</strong> — LPK &amp; LKP Bisa AI Academy, 2026 (No: 2026/412/69181)<br>
          • <strong>Basic Excel</strong> — Lembaga Kursus Bisa AI Academy, 2026 (No: 2026/294/69181)<br>
          • <strong>Dasar - Dasar Python</strong> — Lembaga Kursus Bisa AI Academy, 2026 (No: 2026/249/69181)<br>
          • <strong>Python Fundamental</strong> — Aguna Course, 2025 (No: AC-315-33886729-97)<br>
          • <strong>Linux Fundamental</strong> — Aguna Course, 2025 (No: AC-050-75298727-98)<br>
          • <strong>Virtual Machine Fundamental</strong> — Aguna Course, 2025 (No: AC-446-15449133-19)<br>
          • <strong>Simulasi Jaringan dengan PNETLab</strong> — Aguna Course, 2025 (No: AC-205-42646055-11)<br>
          • <strong>Basic Figma: Pembuatan UI Aplikasi Mobile</strong>, 2026
        </p>
      </div>

      <div class="cv-doc-section">
        <h3 class="cv-doc-section-title"><i class="fa-solid fa-users"></i> Organisasi &amp; Kepanitiaan</h3>
        <p class="cv-doc-item-desc">
          • <strong>HIMAMI Politeknik Astra (2026 - 2027)</strong> — Ketua Departemen Divisi Publikasi, Humas dan Dokumentasi<br>
          • <strong>Seminar Forum Ilmiah 2026 (Mei 2026)</strong> — Koordinator Divisi Publikasi, Humas dan Dokumentasi<br>
          • <strong>HIMAMI Politeknik Astra (2025 - 2026)</strong> — Anggota Divisi Publikasi, Humas dan Dokumentasi<br>
          • <strong>Hello Project 2025 &amp; IDENTITAS 2025</strong> — Koordinator Publikasi, Desain dan Dokumentasi<br>
          • <strong>SPARTCO 2025</strong> — Anggota Panitia Publikasi, Desain dan Dokumentasi<br>
          • <strong>UI/UX Training (2025)</strong> — Anggota Panitia Publikasi, Desain dan Dokumentasi
        </p>
      </div>
    </div>
  `;
}

function switchCvView(mode) {
  currentCvViewMode = mode;
  const btnPdf = document.getElementById('btn-toggle-pdf');
  const btnInteractive = document.getElementById('btn-toggle-interactive');

  if (btnPdf && btnInteractive) {
    btnPdf.classList.toggle('active', mode === 'pdf');
    btnInteractive.classList.toggle('active', mode === 'interactive');
  }

  if (!cvIframeContainer) return;

  if (mode === 'pdf') {
    const previewUrl = getCvFreshUrl(currentCvUrl);
    cvIframeContainer.innerHTML = `
      <object 
        data="${previewUrl}" 
        type="application/pdf" 
        style="width: 100%; height: 100%; border: none;">
        <iframe 
          src="https://docs.google.com/viewer?url=${encodeURIComponent(previewUrl)}&embedded=true" 
          title="CV Rasya Arfian Akbar" 
          style="width: 100%; height: 100%; border: none;">
        </iframe>
      </object>
    `;
  } else {
    renderCvFallback();
  }
}

function openCvModal(preferredMode) {
  if (!cvModalOverlay) return;
  cvModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Selalu perbarui token cache setiap kali modal dibuka agar browser merender PDF paling baru dari Supabase
  cvCacheVersion = Date.now();
  updateCvLinks(currentCvUrl);
  const initialMode = preferredMode || currentCvViewMode || 'pdf';
  switchCvView(initialMode);
}

function refreshCvDocument() {
  cvCacheVersion = Date.now();
  updateCvLinks(currentCvUrl);
  if (currentCvViewMode === 'pdf') {
    switchCvView('pdf');
  }
  if (cvSourceBadge) {
    cvSourceBadge.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin"></i> Memuat versi terbaru...';
    setTimeout(() => {
      cvSourceBadge.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Terhubung &amp; Tersinkronisasi Supabase';
    }, 700);
  }
  showToast('Dokumen CV terbaru berhasil dimuat ulang!');
}

if (cvRefreshBtn) {
  cvRefreshBtn.addEventListener('click', refreshCvDocument);
}

function closeCvModal() {
  if (!cvModalOverlay) return;
  cvModalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (cvModalClose) cvModalClose.addEventListener('click', closeCvModal);
if (cvModalOverlay) {
  cvModalOverlay.addEventListener('click', (e) => {
    if (e.target === cvModalOverlay) closeCvModal();
  });
}

async function loadCvConfigFromSupabase() {
  if (!supabaseClient) {
    updateCvLinks(DEFAULT_CV_URL);
    return;
  }
  try {
    const { data, error } = await supabaseClient
      .from('cv_settings')
      .select('cv_url, title, last_updated')
      .order('id', { ascending: false })
      .limit(1);

    if (error) {
      updateCvLinks(DEFAULT_CV_URL);
      return;
    }

    if (data && data.length > 0 && data[0].cv_url) {
      cvCacheVersion = data[0].last_updated ? new Date(data[0].last_updated).getTime() : Date.now();
      updateCvLinks(data[0].cv_url);
      if (cvSourceBadge) {
        cvSourceBadge.innerHTML = '<i class="fa-solid fa-cloud-arrow-down"></i> Terhubung &amp; Tersinkronisasi Supabase';
      }
    } else {
      updateCvLinks(DEFAULT_CV_URL);
    }
  } catch (err) {
    updateCvLinks(DEFAULT_CV_URL);
  }
}

function setupCvRealtime() {
  if (!supabaseClient) return;
  try {
    supabaseClient
      .channel('cv-settings-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cv_settings' }, (payload) => {
        if (payload.new && payload.new.cv_url) {
          cvCacheVersion = Date.now();
          updateCvLinks(payload.new.cv_url);
          if (cvModalOverlay && cvModalOverlay.classList.contains('active')) {
            openCvModal();
          }
        }
      })
      .subscribe();
  } catch (err) { }
}

function setupCvTriggers() {
  document.querySelectorAll('.btn-preview-cv').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCvModal();
    });
  });

  const btnNavCv = document.getElementById('btn-nav-cv');
  if (btnNavCv) btnNavCv.addEventListener('click', (e) => { e.preventDefault(); openCvModal(); });

  const btnHeroCv = document.getElementById('btn-hero-cv');
  if (btnHeroCv) btnHeroCv.addEventListener('click', (e) => { e.preventDefault(); openCvModal(); });

  const btnViewCv = document.getElementById('btn-view-cv');
  if (btnViewCv) btnViewCv.addEventListener('click', (e) => { e.preventDefault(); openCvModal(); });
}

// ============================================================
// CERTIFICATE MODAL
// ============================================================
const certModalOverlay = document.getElementById('cert-modal-overlay');
const certModalContent = document.getElementById('cert-modal-content');
const certModalClose = document.getElementById('cert-modal-close');

async function loadCertDocumentPreview(containerId, c) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const aliases = [c.slug];
  if (c.slug === 'basic-excel') aliases.push('basis-excel');
  if (c.slug === 'dasar-python') aliases.push('dasar-dasar-python');
  if (c.slug === 'simulasi-jaringan-pnetlab') aliases.push('network-simulation', 'pnetlab');
  if (c.slug === 'linux-fundamental') aliases.push('linux');

  const candidates = [];
  aliases.forEach(slug => {
    candidates.push(
      { url: `certificates/${slug}.pdf`, type: 'pdf', label: 'Folder Lokal (certificates/)' },
      { url: `certificates/${slug}.png`, type: 'image', label: 'Folder Lokal (certificates/)' },
      { url: `certificates/${slug}.jpg`, type: 'image', label: 'Folder Lokal (certificates/)' },
      { url: `certificates/${slug}.jpeg`, type: 'image', label: 'Folder Lokal (certificates/)' },
      { url: `${CERTIFICATES_BASE_URL}${slug}.pdf`, type: 'pdf', label: 'Supabase Storage' },
      { url: `${CERTIFICATES_BASE_URL}${slug}.png`, type: 'image', label: 'Supabase Storage' },
      { url: `${CERTIFICATES_BASE_URL}${slug}.jpg`, type: 'image', label: 'Supabase Storage' }
    );
  });

  let found = null;
  for (const cand of candidates) {
    try {
      const res = await fetch(cand.url, { method: 'HEAD' });
      if (res.ok) {
        found = cand;
        break;
      }
    } catch (e) { }
  }

  if (found) {
    if (found.type === 'pdf') {
      container.innerHTML = `
        <div style="padding: 10px 16px; background: var(--bg-secondary); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; font-size: 0.82rem;">
          <span style="font-weight: 700; color: var(--text-heading); display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-file-lines" style="color: var(--blue-600); font-size: 1rem;"></i> ${c.title}
          </span>
        </div>
        
        <div class="cert-pdf-container" style="position: relative; height: 440px; background: #0f172a;">
          <object data="${found.url}" type="application/pdf" style="width: 100%; height: 100%; border: none;">
            <iframe 
              src="https://docs.google.com/viewer?url=${encodeURIComponent(found.url)}&embedded=true" 
              class="cert-pdf-iframe" 
              title="Sertifikat ${c.title}"
              style="width: 100%; height: 100%; border: none;">
            </iframe>
          </object>
        </div>

        <div class="cert-doc-toolbar">
          <div class="cert-doc-meta">
            <i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 1.1rem; flex-shrink: 0;"></i>
            <span>Penerbit Resmi: <strong>${c.issuer}</strong></span>
          </div>
          <div class="cert-doc-actions">
            <a href="${found.url}" target="_blank" rel="noopener" class="btn-outline-blue btn-sm">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Tab Baru
            </a>
            <a href="${found.url}" download="${c.slug}.pdf" target="_blank" rel="noopener" class="btn-primary btn-sm">
              <i class="fa-solid fa-download"></i> Unduh Sertifikat
            </a>
          </div>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div style="padding: 10px 16px; background: var(--bg-secondary); border-bottom: 1px solid var(--border-subtle); display: flex; align-items: center; font-size: 0.82rem;">
          <span style="font-weight: 700; color: var(--text-heading); display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-image" style="color: #3b82f6; font-size: 1rem;"></i> ${c.title}
          </span>
        </div>
        
        <div style="position: relative; background: #060b16; display: flex; align-items: center; justify-content: center; padding: 18px; min-height: 360px;">
          <img src="${found.url}" alt="${c.title}" style="border-radius: 6px; max-height: 460px; width: auto; max-width: 100%;">
        </div>

        <div class="cert-doc-toolbar">
          <div class="cert-doc-meta">
            <i class="fa-solid fa-circle-check" style="color: #10b981; font-size: 1.1rem;"></i>
            <span>Penerbit Resmi: <strong>${c.issuer}</strong></span>
          </div>
          <div class="cert-doc-actions">
            <a href="${found.url}" target="_blank" rel="noopener" class="btn-outline-blue btn-sm">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Lihat Ukuran Penuh
            </a>
            <a href="${found.url}" download target="_blank" rel="noopener" class="btn-primary btn-sm">
              <i class="fa-solid fa-download"></i> Unduh Gambar
            </a>
          </div>
        </div>
      `;
    }
  } else {
    container.innerHTML = `
      <div class="cert-doc-empty-state">
        <div class="cert-doc-empty-icon">
          <i class="fa-solid fa-file-lines"></i>
        </div>
        <h3 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-heading);">Dokumen Sertifikat Siap Dihubungkan</h3>
        <p style="font-size: 0.86rem; color: var(--text-muted); max-width: 440px;">
          Dokumen sertifikat resmi siap ditampilkan di sini begitu berkas diunggah ke sistem penyimpanan.
        </p>
        <div style="display: flex; gap: 10px; margin-top: 6px;">
          <button type="button" class="btn-primary btn-sm" onclick="switchCertTab('detail')">
            <i class="fa-solid fa-list-check"></i> Rincian &amp; Silabus Pelatihan
          </button>
        </div>
      </div>
    `;
  }
}

function getCertIconClass(iconStr) {
  if (!iconStr) return 'fa-solid fa-award';
  if (iconStr.startsWith('fa-solid ') || iconStr.startsWith('fa-brands ') || iconStr.startsWith('fa-regular ')) {
    return iconStr;
  }
  const brandIcons = ['fa-figma', 'fa-node-js', 'fa-python', 'fa-linux', 'fa-github', 'fa-react', 'fa-vuejs', 'fa-js', 'fa-html5', 'fa-css3-alt'];
  if (brandIcons.includes(iconStr)) {
    return `fa-brands ${iconStr}`;
  }
  return `fa-solid ${iconStr}`;
}

function openCertModal(index) {
  const c = certificationsData[index];
  if (!c || !certModalContent || !certModalOverlay) return;

  const extraBadgesHtml = (c.level || c.modules || c.points || c.rating || c.progress) ? `
    <div style="display:flex; flex-wrap:wrap; gap:8px; margin: 14px 0 18px;">
      ${c.level ? `<span class="modal-tag"><i class="fa-solid fa-layer-group"></i> Level: ${c.level}</span>` : ''}
      ${c.modules ? `<span class="modal-tag"><i class="fa-solid fa-book-open"></i> ${c.modules}</span>` : ''}
      ${c.points ? `<span class="modal-tag"><i class="fa-solid fa-coins"></i> ${c.points}</span>` : ''}
      ${c.rating ? `<span class="modal-tag"><i class="fa-solid fa-star"></i> ${c.rating}</span>` : ''}
      ${c.progress ? `<span class="modal-tag"><i class="fa-solid fa-circle-check"></i> ${c.progress}</span>` : ''}
    </div>
  ` : '';

  const formattedDescription = (c.description || '')
    .split('\n\n')
    .map(p => {
      const trimmed = p.trim();
      if (trimmed.startsWith('Poin Pembahasan') || trimmed.includes('•')) {
        const lines = trimmed.split('\n');
        const header = lines[0].includes('•') ? '' : `<p style="font-weight:700; color:var(--text-heading); margin:12px 0 6px;">${lines[0]}</p>`;
        const items = lines.filter(l => l.includes('•')).map(l => `<li style="margin-bottom:6px;">${l.replace(/^•\s*/, '')}</li>`).join('');
        return header + (items ? `<ul style="margin:0 0 10px 18px; padding:0; color:var(--text-body); line-height:1.65;">${items}</ul>` : '');
      }
      return `<p style="margin-bottom:12px; line-height:1.7;">${trimmed}</p>`;
    })
    .join('');

  certModalContent.innerHTML = `
    <div class="cert-modal-header">
      <div class="cert-modal-icon">
        <i class="${getCertIconClass(c.icon)}"></i>
      </div>
      <div style="flex: 1; min-width: 0;">
        <span class="cert-badge-status"><i class="fa-solid fa-circle-check"></i> Kredensial Terverifikasi</span>
        <h2 class="cert-modal-title" style="font-family: var(--font-heading); font-size: 1.35rem; color: var(--text-heading); margin: 6px 0 2px;">${c.title}</h2>
        <span style="font-size: 0.84rem; color: var(--text-muted); font-weight: 600;">${c.date ? `Tanggal: ${c.date} · ` : `Tahun: ${c.year} · `}${c.issuer}</span>
      </div>
    </div>

    <div class="cert-tabs" style="margin-bottom: 18px;">
      <button type="button" class="cert-tab-btn active" id="cert-tab-btn-doc" onclick="switchCertTab('doc')">
        <i class="fa-solid fa-file-lines"></i> Dokumen Sertifikat
      </button>
      <button type="button" class="cert-tab-btn" id="cert-tab-btn-detail" onclick="switchCertTab('detail')">
        <i class="fa-solid fa-list-check"></i> Rincian &amp; Silabus
      </button>
    </div>

    <div class="cert-tab-panel" id="cert-panel-doc">
      <div class="cert-doc-container" id="cert-doc-container-box">
        <div style="padding: 40px; text-align: center; color: var(--text-muted);">
          <i class="fa-solid fa-circle-notch fa-spin" style="font-size: 1.5rem; margin-bottom: 8px;"></i>
          <p style="font-size: 0.85rem; margin: 0;">Memeriksa ketersediaan dokumen sertifikat...</p>
        </div>
      </div>
    </div>

    <div class="cert-tab-panel" id="cert-panel-detail" style="display:none;">
      ${extraBadgesHtml}

      <div style="background: var(--bg-secondary); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 20px; margin-bottom: 20px;">
        <h4 style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--text-heading); margin-bottom: 6px;">Bidang Kompetensi</h4>
        <p style="font-size: 0.9rem; color: var(--blue-600); font-weight: 600; margin-bottom: 16px;">${c.category}</p>
        
        <h4 style="font-size: 0.8rem; font-weight: 800; text-transform: uppercase; color: var(--text-heading); margin-bottom: 6px;">Deskripsi &amp; Capaian Pelatihan</h4>
        <div style="font-size: 0.9rem; color: var(--text-body); line-height: 1.7; margin: 0;">${formattedDescription}</div>
      </div>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-top: 4px;">
      <span style="font-size: 0.82rem; color: var(--text-muted);"><i class="fa-solid fa-barcode"></i> ID / No. Sertifikat: <strong>${c.credentialId}</strong>${c.verifyUrl ? ` · <a href="${c.verifyUrl}" target="_blank" rel="noopener" style="color:var(--blue-600); text-decoration:underline; font-weight:600;"><i class="fa-solid fa-arrow-up-right-from-square"></i> Cek Verifikasi</a>` : ''}</span>
      <button class="btn-primary btn-sm" onclick="closeCertModal()">
        <i class="fa-solid fa-check"></i> Tutup
      </button>
    </div>
  `;

  certModalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  loadCertDocumentPreview('cert-doc-container-box', c);
}

window.switchCertTab = function switchCertTab(tab) {
  const btnDoc = document.getElementById('cert-tab-btn-doc');
  const btnDetail = document.getElementById('cert-tab-btn-detail');
  const panelDoc = document.getElementById('cert-panel-doc');
  const panelDetail = document.getElementById('cert-panel-detail');

  if (tab === 'doc') {
    if (btnDoc) btnDoc.classList.add('active');
    if (btnDetail) btnDetail.classList.remove('active');
    if (panelDoc) panelDoc.style.display = 'block';
    if (panelDetail) panelDetail.style.display = 'none';
  } else {
    if (btnDoc) btnDoc.classList.remove('active');
    if (btnDetail) btnDetail.classList.add('active');
    if (panelDoc) panelDoc.style.display = 'none';
    if (panelDetail) panelDetail.style.display = 'block';
  }
};

function closeCertModal() {
  if (!certModalOverlay) return;
  certModalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
if (certModalOverlay) {
  certModalOverlay.addEventListener('click', (e) => {
    if (e.target === certModalOverlay) closeCertModal();
  });
}

// ============================================================
// COMMAND PALETTE (Ctrl + K)
// ============================================================
const cmdModalOverlay = document.getElementById('cmd-modal-overlay');
const cmdTrigger = document.getElementById('cmd-trigger');
const cmdClose = document.getElementById('cmd-close');
const cmdInput = document.getElementById('cmd-input');
const cmdList = document.getElementById('cmd-list');

const quickCommands = [
  { title: 'Lihat Dokumen CV (PDF & Interaktif)', icon: 'fa-file-pdf', tag: 'Dokumen', action: () => openCvModal() },
  { title: 'Salin Email Utama (rasyaarfiana@gmail.com)', icon: 'fa-envelope', tag: 'Kontak', action: () => copyText('rasyaarfiana@gmail.com', 'Email Utama') },
  { title: 'Hubungi via WhatsApp (+62 812-8997-9099)', icon: 'fa-brands fa-whatsapp', tag: 'Pesan', action: () => window.open('https://wa.me/6281289979099', '_blank') },
  { title: 'Ubah Tema (Terang / Gelap)', icon: 'fa-circle-half-stroke', tag: 'Tampilan', action: () => themeToggleBtn && themeToggleBtn.click() },
  { title: 'Lompat ke Proyek Unggulan', icon: 'fa-diagram-project', tag: 'Navigasi', action: () => location.href = '#projects' },
  { title: 'Lompat ke Keahlian & Teknologi', icon: 'fa-laptop-code', tag: 'Navigasi', action: () => location.href = '#skills' },
  { title: 'Lompat ke Sertifikasi & Pelatihan', icon: 'fa-certificate', tag: 'Navigasi', action: () => location.href = '#certifications' },
  { title: 'Lompat ke Timeline Perjalanan', icon: 'fa-timeline', tag: 'Navigasi', action: () => location.href = '#timeline' },
];

function renderCommandList(query = '') {
  if (!cmdList) return;
  const q = query.toLowerCase().trim();

  const projectCommands = currentProjects.map((p, idx) => ({
    title: `Proyek: ${p.title}`,
    icon: p.icon || 'fa-code',
    tag: 'Studi Kasus',
    action: () => openModal(idx)
  }));

  const allCommands = [...quickCommands, ...projectCommands].filter(item =>
    item.title.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q)
  );

  cmdList.innerHTML = allCommands.map((item, idx) => `
    <button type="button" class="cmd-item" data-cmd-idx="${idx}">
      <div class="cmd-item-left">
        <i class="fa-solid ${item.icon}"></i>
        <span>${item.title}</span>
      </div>
      <span class="cmd-item-tag">${item.tag}</span>
    </button>
  `).join('');

  cmdList.querySelectorAll('.cmd-item').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      closeCmdModal();
      allCommands[idx].action();
    });
  });
}

function openCmdModal() {
  if (!cmdModalOverlay) return;
  cmdModalOverlay.classList.add('active');
  if (cmdInput) {
    cmdInput.value = '';
    setTimeout(() => cmdInput.focus(), 50);
  }
  renderCommandList('');
}

function closeCmdModal() {
  if (!cmdModalOverlay) return;
  cmdModalOverlay.classList.remove('active');
}

if (cmdTrigger) cmdTrigger.addEventListener('click', openCmdModal);
if (cmdClose) cmdClose.addEventListener('click', closeCmdModal);
if (cmdModalOverlay) {
  cmdModalOverlay.addEventListener('click', (e) => {
    if (e.target === cmdModalOverlay) closeCmdModal();
  });
}
if (cmdInput) {
  cmdInput.addEventListener('input', (e) => renderCommandList(e.target.value));
}

// ============================================================
// NAVBAR & SCROLL PROGRESS BAR
// ============================================================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const scrollProgressBar = document.getElementById('scroll-progress');

if (navbar && hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navbar.classList.toggle('mobile-open');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navbar.classList.remove('mobile-open');
      navLinks.classList.remove('open');
    });
  });
}

const sections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

function handleScroll() {
  const scrollTop = window.scrollY;
  if (navbar) navbar.classList.toggle('scrolled', scrollTop > 50);

  if (scrollProgressBar) {
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = `${pct}%`;
  }

  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 130;
    if (scrollTop >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', handleScroll);

// ============================================================
// INTERACTIVE PARTICLE CANVAS (Mouse-Reactive Constellation)
// ============================================================
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  const mouse = { x: null, y: null, radius: 130 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(65, Math.floor((canvas.width * canvas.height) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.6,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.45 + 0.15,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
        if (dist < 125) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(96, 165, 250, ${0.12 * (1 - dist / 125)})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      if (mouse.x !== null && mouse.y !== null) {
        const distMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (distMouse < mouse.radius) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.22 * (1 - distMouse / mouse.radius)})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(147, 197, 253, ${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });

    requestAnimationFrame(drawParticles);
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });

  resizeCanvas();
  createParticles();
  drawParticles();
})();

// ============================================================
// TYPED TEXT EFFECT
// ============================================================
(function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const texts = [
    'Web & Mobile Developer',
    'D3 Manajemen Informatika - Politeknik Astra',
    'React Native & Full Stack Developer',
    'UI/UX Designer & System Analyst',
    'Database & Backend Enthusiast'
  ];

  let textIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = texts[textIdx];

    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let speed = isDeleting ? 40 : 70;

    if (!isDeleting && charIdx === current.length) {
      speed = 2200;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      textIdx = (textIdx + 1) % texts.length;
      speed = 350;
    }

    setTimeout(type, speed);
  }

  type();
})();

// ============================================================
// COUNTER & SKILL BAR ANIMATION
// ============================================================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');
  counters.forEach(counter => {
    const isDecimal = counter.dataset.decimal === 'true';
    const rawTarget = counter.dataset.target;

    if (isDecimal) {
      const target = parseFloat(rawTarget);
      let current = 0;
      const duration = 1600;
      const step = target / (duration / 16);

      const update = () => {
        current += step;
        if (current < target) {
          counter.textContent = current.toFixed(2);
          requestAnimationFrame(update);
        } else {
          counter.textContent = target.toFixed(2);
        }
      };
      update();
    } else {
      const target = parseInt(rawTarget, 10);
      let current = 0;
      const duration = 1600;
      const step = Math.max(1, target / (duration / 16));

      const update = () => {
        current += step;
        if (current < target) {
          counter.textContent = Math.floor(current);
          requestAnimationFrame(update);
        } else {
          counter.textContent = target + '+';
        }
      };
      update();
    }
  });
}

function animateSkillBars() {
  document.querySelectorAll('.skill-bar-fill').forEach(bar => {
    bar.style.width = bar.dataset.width + '%';
  });
}

// ============================================================
// SCROLL REVEAL
// ============================================================
const revealElements = document.querySelectorAll(
  '.skill-category-card, .project-card, .timeline-card, .contact-card, .about-grid, .tech-pill, .cert-card, .skills-extra-card'
);

revealElements.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseFloat(el.dataset.delay || 0) * 1000;
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

revealElements.forEach((el, i) => {
  el.dataset.delay = (i % 4) * 0.08;
  observer.observe(el);
});

const heroSection = document.getElementById('home');
const skillsSection = document.getElementById('skills');
let countersAnimated = false;
let skillsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersAnimated) {
      countersAnimated = true;
      animateCounters();
    }
  });
}, { threshold: 0.4 });

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !skillsAnimated) {
      skillsAnimated = true;
      animateSkillBars();
    }
  });
}, { threshold: 0.2 });

if (heroSection) statsObserver.observe(heroSection);
if (skillsSection) skillsObserver.observe(skillsSection);

// ============================================================
// PROJECT FILTER & LIVE SEARCH
// ============================================================
const filterBtns = document.querySelectorAll('.filter-btn');
const projectSearchInput = document.getElementById('project-search-input');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeCategoryFilter = btn.dataset.filter;
    renderProjects(currentProjects);
  });
});

if (projectSearchInput) {
  projectSearchInput.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.trim();
    renderProjects(currentProjects);
  });
}

// ============================================================
// TIMELINE TABS
// ============================================================
const tabBtns = document.querySelectorAll('.tab-btn');
const timelineContents = document.querySelectorAll('.timeline-content');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.dataset.tab;
    timelineContents.forEach(content => content.classList.remove('active'));

    let target = 'education-timeline';
    if (tab === 'education') target = 'education-timeline';
    else if (tab === 'organization') target = 'organization-timeline';
    else if (tab === 'projects-timeline') target = 'projects-timeline-content';

    const targetEl = document.getElementById(target);
    if (targetEl) targetEl.classList.add('active');
  });
});

// ============================================================
// PROJECT MODAL DENGAN METODE STAR CASE STUDY
// ============================================================
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalClose = document.getElementById('modal-close');

function openModal(index) {
  const p = currentProjects[index];
  if (!p || !modalContent || !modalOverlay) return;

  const rawFeatures = Array.isArray(p.features)
    ? p.features
    : (typeof p.features === 'string' && p.features.trim() ? p.features.split(',') : []);

  const featuresHtml = rawFeatures.length > 0
    ? `
      <div class="modal-features">
        <h4>Fitur &amp; Spesifikasi Proyek</h4>
        <ul>${rawFeatures.map(f => `<li>${f.trim()}</li>`).join('')}</ul>
      </div>
    `
    : '';

  const githubLink = p.github_url || p.github;
  const liveLink = p.live_url || p.live;
  const figmaLink = p.figma_url || p.figma;

  const linksHtml = [
    (githubLink && githubLink !== '#') ? `<a href="${githubLink}" class="btn-primary" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> GitHub</a>` : '',
    (figmaLink && figmaLink !== '#') ? `<a href="${figmaLink}" class="btn-primary" target="_blank" rel="noopener"><i class="fa-brands fa-figma"></i> Figma</a>` : '',
    (liveLink && liveLink !== '#') ? `<a href="${liveLink}" class="btn-outline-blue" target="_blank" rel="noopener"><i class="fa-solid fa-globe"></i> Live Demo</a>` : '',
  ].filter(Boolean).join('');

  const imageHtml = buildModalGallery(p);

  const rawTags = Array.isArray(p.tags)
    ? p.tags
    : (typeof p.tags === 'string' && p.tags.trim() ? p.tags.split(',') : []);
  const tagsHtml = rawTags.map(t => `<span class="modal-tag">${t.trim()}</span>`).join('');

  const starHtml = (p.challenge || p.solution || p.impact) ? `
    <div style="margin: 22px 0;">
      <h4 style="font-size: 0.82rem; font-weight: 800; text-transform: uppercase; color: var(--blue-600); letter-spacing: 0.08em; margin-bottom: 10px;">
        <i class="fa-solid fa-bullseye"></i> Studi Kasus &amp; Analisis Rekayasa
      </h4>
      <div class="star-method-grid">
        <div class="star-card challenge">
          <div class="star-card-title"><i class="fa-solid fa-triangle-exclamation"></i> Tantangan</div>
          <p>${p.challenge || 'Menyesuaikan kebutuhan fungsionalitas dan arsitektur sistem.'}</p>
        </div>
        <div class="star-card solution">
          <div class="star-card-title"><i class="fa-solid fa-lightbulb"></i> Solusi Teknis</div>
          <p>${p.solution || 'Penerapan arsitektur teknologi modern dan query teroptimasi.'}</p>
        </div>
        <div class="star-card impact">
          <div class="star-card-title"><i class="fa-solid fa-chart-line"></i> Dampak / Hasil</div>
          <p>${p.impact || 'Pencapaian performa sistem yang stabil dan teruji.'}</p>
        </div>
      </div>
    </div>
  ` : '';

  const isConfidential = p.is_confidential || (p.title || '').toLowerCase().includes('booking motor');
  const confidentialBannerHtml = isConfidential ? `
    <div class="modal-confidential-banner">
      <div class="modal-confidential-icon"><i class="fa-solid fa-shield-halved"></i></div>
      <div class="modal-confidential-body">
        <strong>Proyek Bersifat Kredensial</strong>
        <p>${p.confidential_note || 'Tampilan antarmuka sistem dan struktur kode dilindungi kerahasiaan kredensial perusahaan. Oleh karena itu, dokumentasi visual yang ditampilkan khusus foto tim pengembang.'}</p>
      </div>
    </div>
  ` : '';

  modalContent.innerHTML = `
    <div class="modal-img-wrap">
      ${imageHtml}
    </div>
    <div class="modal-tags">
      ${tagsHtml}
    </div>
    <h2 class="modal-title">${p.title}</h2>
    ${confidentialBannerHtml}
    <p class="modal-desc">${p.description || p.desc || ''}</p>
    ${starHtml}
    ${featuresHtml}
    ${linksHtml ? `<div class="modal-actions">${linksHtml}</div>` : ''}
  `;

  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

// Keyboard Shortcuts (Ctrl+K, Escape, Left/Right Gallery Navigation)
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    openCmdModal();
    return;
  }

  if (e.key === 'Escape') {
    closeModal();
    closeCvModal();
    closeCertModal();
    closeCmdModal();
  }

  if (modalOverlay && modalOverlay.classList.contains('active')) {
    const thumbs = Array.from(modalOverlay.querySelectorAll('.gallery-thumb'));
    if (thumbs.length > 1 && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) {
      const activeIdx = thumbs.findIndex(t => t.classList.contains('active'));
      const nextIdx = e.key === 'ArrowRight'
        ? (activeIdx + 1) % thumbs.length
        : (activeIdx - 1 + thumbs.length) % thumbs.length;
      selectGalleryImage(thumbs[nextIdx]);
    }
  }
});

// ============================================================
// SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const targetY = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  });
});

// ============================================================
// EXPOSE GLOBAL FUNCTIONS TO WINDOW
// ============================================================
window.openModal = openModal;
window.closeModal = closeModal;
window.openCvModal = openCvModal;
window.closeCvModal = closeCvModal;
window.switchCvView = switchCvView;
window.openCertModal = openCertModal;
window.closeCertModal = closeCertModal;
window.copyText = copyText;

// ============================================================
// INITIALIZATION
// ============================================================
renderProjects(currentProjects);
initInteractiveCards();
loadProjectsFromSupabase();
setupSupabaseRealtime();

setupCvTriggers();
loadCvConfigFromSupabase();
setupCvRealtime();