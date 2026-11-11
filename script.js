/* ==========================================================================
   RASYA ARFIAN AKBAR — script.js
   Features:
   1. 1% -> 100% Smooth Preloader with Status Steps & Curtain Reveal
   2. 60fps Interactive Hanging Lanyard Physics (Spring + Pendulum + Drag/Pull)
   3. Dynamic SVG Strap with Curved TextPath & 3D Card Tilt/Flip
   4. Typing Role Rotator, Scroll Reveal, Live Project Filter/Search & Tabs
   ========================================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initNavbarAndScroll();
  initRoleRotator();
  initProjectFilterAndSearch();
  initCertShowcaseCarousel();
  initTimelineTabs();
  initPdfModal();
  initSkillTabs();
  initScrollReveal();
  initCopyButtons();
});

/* ==========================================================================
   1. PRELOADER: 1% TO 100% ANIMATION
   ========================================================================== */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const numEl = document.getElementById('preloader-num');
  const barEl = document.getElementById('preloader-bar');
  const statusEl = document.getElementById('preloader-status-text');

  if (!preloader || !numEl || !barEl) {
    initLanyardPhysics(true);
    return;
  }

  document.body.classList.add('is-loading');

  const statusMessages = [
    { threshold: 1, text: 'MEMUAT PROFIL & ARSITEKTUR UI...' },
    { threshold: 28, text: 'MENYIAPKAN 06 STUDI KASUS PROYEK...' },
    { threshold: 58, text: 'MEMVERIFIKASI 10 SERTIFIKASI & KOMPETENSI...' },
    { threshold: 84, text: 'MENGAKTIFKAN FISIKA LANYARD INTERAKTIF...' },
    { threshold: 100, text: 'SIAP DITAMPILKAN — 100%' }
  ];

  let currentVal = 1;
  const duration = 2100; // 2.1 seconds total smooth count from 1% to 100%
  const startTime = performance.now();

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(now) {
    const elapsed = now - startTime;
    const rawProgress = Math.min(elapsed / duration, 1);
    const easedProgress = easeInOutCubic(rawProgress);

    currentVal = Math.max(1, Math.min(100, Math.round(1 + easedProgress * 99)));

    numEl.textContent = String(currentVal);
    barEl.style.width = `${currentVal}%`;

    if (statusEl) {
      for (let i = statusMessages.length - 1; i >= 0; i--) {
        if (currentVal >= statusMessages[i].threshold) {
          statusEl.textContent = statusMessages[i].text;
          break;
        }
      }
    }

    if (rawProgress < 1) {
      requestAnimationFrame(step);
    } else {
      numEl.textContent = '100';
      barEl.style.width = '100%';
      setTimeout(() => {
        preloader.classList.add('preloader-done');
        document.body.classList.remove('is-loading');
        // Trigger Lanyard drop & Hero counters right as curtain lifts
        initLanyardPhysics(true);
        animateHeroCounters();
      }, 220);
    }
  }

  requestAnimationFrame(step);
}

/* ==========================================================================
   2. INTERACTIVE HANGING LANYARD PHYSICS ENGINE (SPRING + PENDULUM)
   ========================================================================== */
function initLanyardPhysics(dropFromTop = false) {
  const stage = document.getElementById('lanyard-stage');
  const cardWrapper = document.getElementById('lanyard-card-wrapper');
  const pathBack = document.getElementById('lanyard-path-back');
  const pathMain = document.getElementById('lanyard-path-main');
  const pathStitch = document.getElementById('lanyard-path-stitch');
  const btnFlip = document.getElementById('btn-lanyard-flip');

  if (!stage || !cardWrapper || !pathMain) return;

  const CARD_W = 292;
  const REST_ROPE_LEN = 135; // Resting distance from top mount to card clasp

  // Physics state
  let stageRect = stage.getBoundingClientRect();
  let anchorX = stageRect.width / 2;
  let anchorY = 12; // Inside SVG coordinate space

  // Position of the clasp (top-center of the card)
  let posX = anchorX + (dropFromTop ? 42 : 0);
  let posY = dropFromTop ? -90 : anchorY + REST_ROPE_LEN;

  // Velocity
  let velX = dropFromTop ? -6 : 0;
  let velY = dropFromTop ? 14 : 0;

  // Card rotation & angular velocity
  let angleZ = dropFromTop ? 14 : 0;
  let angularVelZ = 0;
  let tiltX = 0;
  let tiltY = 0;

  // Middle control point of the strap for realistic ribbon curve
  let midX = anchorX;
  let midY = (anchorY + posY) / 2;
  let midVelX = 0;
  let midVelY = 0;

  // Dragging state
  let isDragging = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let pointerStartX = 0;
  let pointerStartY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;

  // Constants for realistic spring-pendulum feel
  const GRAVITY = 1.15;
  const SPRING_K = 0.085;
  const DAMPING = 0.91;
  const ANGULAR_DAMPING = 0.88;

  function updateStageMetrics() {
    stageRect = stage.getBoundingClientRect();
    anchorX = stageRect.width / 2;
    if (!isDragging && Math.abs(velX) < 0.1 && Math.abs(velY) < 0.1) {
      posX = anchorX;
    }
  }

  window.addEventListener('resize', updateStageMetrics);

  // Pointer Events (Mouse + Touch)
  cardWrapper.addEventListener('pointerdown', (e) => {
    // Ignore if clicking a link inside card
    if (e.target.closest('a')) return;

    isDragging = true;
    cardWrapper.classList.add('is-dragging');
    cardWrapper.setPointerCapture(e.pointerId);

    stageRect = stage.getBoundingClientRect();
    const clientX = e.clientX - stageRect.left;
    const clientY = e.clientY - stageRect.top + 45; // Offset for SVG top=-45px

    dragOffsetX = clientX - posX;
    dragOffsetY = clientY - posY;
    pointerStartX = e.clientX;
    pointerStartY = e.clientY;
    lastPointerX = clientX;
    lastPointerY = clientY;

    velX = 0;
    velY = 0;
  });

  window.addEventListener('pointermove', (e) => {
    if (!isDragging) return;

    stageRect = stage.getBoundingClientRect();
    const clientX = e.clientX - stageRect.left;
    const clientY = e.clientY - stageRect.top + 45;

    const rawTargetX = clientX - dragOffsetX;
    const rawTargetY = clientY - dragOffsetY;

    // Elastic resistance when pulling far from anchor
    const dx = rawTargetX - anchorX;
    const dy = Math.max(30, rawTargetY - anchorY);
    const dist = Math.hypot(dx, dy);
    const maxStretch = 290;

    let constrainedDist = dist;
    if (dist > REST_ROPE_LEN) {
      const extra = dist - REST_ROPE_LEN;
      constrainedDist = REST_ROPE_LEN + extra * 0.58;
      if (constrainedDist > maxStretch) constrainedDist = maxStretch;
    }

    const scale = dist > 0 ? constrainedDist / dist : 1;
    posX = anchorX + dx * scale;
    posY = anchorY + dy * scale;

    // Track pointer velocity for release throw
    velX = (clientX - lastPointerX) * 0.45;
    velY = (clientY - lastPointerY) * 0.45;
    lastPointerX = clientX;
    lastPointerY = clientY;

    // Dynamic 3D tilt while pulling
    const pullAngle = Math.atan2(posX - anchorX, posY - anchorY) * (180 / Math.PI);
    angleZ = -pullAngle * 0.55 + velX * 0.4;
    tiltY = Math.max(-22, Math.min(22, (posX - anchorX) * 0.12));
    tiltX = Math.max(-18, Math.min(18, (posY - (anchorY + REST_ROPE_LEN)) * -0.08));
  });

  function endDrag(e) {
    if (!isDragging) return;
    isDragging = false;
    cardWrapper.classList.remove('is-dragging');
    try {
      if (e && e.pointerId !== undefined) {
        cardWrapper.releasePointerCapture(e.pointerId);
      }
    } catch (_) { }
  }

  window.addEventListener('pointerup', endDrag);
  window.addEventListener('pointercancel', endDrag);

  // Flip ID Card Button
  if (btnFlip) {
    btnFlip.addEventListener('click', () => {
      cardWrapper.classList.toggle('is-flipped');
      // Give a small physical impulse when flipping
      velY -= 4.5;
      velX += (Math.random() > 0.5 ? 1 : -1) * 3.5;
      angularVelZ += 5;
    });
  }

  // Subtle sway impulse on window scroll
  let lastScrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    if (isDragging) return;
    const delta = window.scrollY - lastScrollY;
    lastScrollY = window.scrollY;
    if (Math.abs(delta) > 2 && window.scrollY < 700) {
      velY += Math.max(-3.5, Math.min(3.5, delta * 0.08));
      velX += Math.sin(window.scrollY * 0.03) * 0.45;
    }
  }, { passive: true });

  // 60fps Physics Simulation Loop
  function tick(time) {
    if (!isDragging) {
      // Vector from anchor to card clasp
      const dx = posX - anchorX;
      const dy = posY - anchorY;
      const dist = Math.hypot(dx, dy) || 1;

      // 1. Gravity force downwards
      velY += GRAVITY;

      // 2. Spring tension along the strap (Hooke's Law)
      const stretch = dist - REST_ROPE_LEN;
      const forceMag = stretch * SPRING_K;
      const fx = -(dx / dist) * forceMag;
      const fy = -(dy / dist) * forceMag;

      velX += fx;
      velY += fy;

      // 3. Horizontal restoring force (pendulum centering + subtle idle breeze)
      const idleBreeze = Math.sin(time * 0.0018) * 0.045;
      velX += -dx * 0.012 + idleBreeze;

      // Apply velocity damping
      velX *= DAMPING;
      velY *= DAMPING;

      posX += velX;
      posY += velY;

      // Prevent card from going above the ceiling mount
      if (posY < anchorY + 45) {
        posY = anchorY + 45;
        velY *= -0.4;
      }

      // 4. Angular pendulum dynamics for card rotation
      const targetAngle = -Math.atan2(dx, dy) * (180 / Math.PI) * 0.45 - velX * 0.85;
      const angleDiff = targetAngle - angleZ;
      angularVelZ += angleDiff * 0.14;
      angularVelZ *= ANGULAR_DAMPING;
      angleZ += angularVelZ;

      // Smoothly relax 3D tilt back to neutral
      tiltX += (0 - tiltX) * 0.12;
      tiltY += (dx * 0.06 - tiltY) * 0.12;
    }

    // Compute middle control point of the SVG strap for a realistic ribbon curve
    const targetMidX = (anchorX + posX) * 0.5 + velX * 1.8;
    const slackSag = Math.max(0, REST_ROPE_LEN - Math.hypot(posX - anchorX, posY - anchorY)) * 0.35;
    const targetMidY = (anchorY + posY) * 0.5 + slackSag;

    midVelX = (midVelX + (targetMidX - midX) * 0.25) * 0.72;
    midVelY = (midVelY + (targetMidY - midY) * 0.25) * 0.72;
    midX += midVelX;
    midY += midVelY;

    // Update SVG Strap Paths (Quadratic Bezier from ceiling mount to clasp)
    const dStr = `M ${anchorX.toFixed(1)} ${anchorY.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${posX.toFixed(1)} ${(posY + 6).toFixed(1)}`;
    pathMain.setAttribute('d', dStr);
    if (pathBack) pathBack.setAttribute('d', dStr);
    if (pathStitch) pathStitch.setAttribute('d', dStr);

    // Position & 3D Transform the ID Card Wrapper
    const cardLeft = posX - CARD_W / 2;
    const cardTop = posY - 12; // Align clasp with SVG strap end
    cardWrapper.style.transform = `translate3d(${cardLeft.toFixed(1)}px, ${cardTop.toFixed(1)}px, 0) rotateZ(${angleZ.toFixed(2)}deg) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* ==========================================================================
   3. HERO METRIC COUNTERS
   ========================================================================== */
function animateHeroCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  counters.forEach((el) => {
    const target = parseFloat(el.dataset.counter);
    const isDecimal = el.dataset.decimal === 'true';
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    const start = performance.now();

    function updateCounter(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;

      if (isDecimal) {
        el.textContent = val.toFixed(2) + suffix;
      } else {
        const num = Math.round(val);
        el.textContent = (num < 10 ? `0${num}` : String(num)) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }

    requestAnimationFrame(updateCounter);
  });
}

/* ==========================================================================
   4. TYPING ROLE ROTATOR
   ========================================================================== */
function initRoleRotator() {
  const el = document.getElementById('typed-role-text');
  if (!el) return;

  const roles = [
    'Web & Mobile Developer',
    'System Analyst',
    'UI/UX Designer (Figma)',
    'Database & Backend Engineer'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function typeStep() {
    const currentRole = roles[roleIdx];
    if (!isDeleting) {
      charIdx++;
      el.textContent = currentRole.slice(0, charIdx);
      if (charIdx === currentRole.length) {
        isDeleting = true;
        setTimeout(typeStep, 1900);
        return;
      }
      setTimeout(typeStep, 65);
    } else {
      charIdx--;
      el.textContent = currentRole.slice(0, charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeStep, 320);
        return;
      }
      setTimeout(typeStep, 35);
    }
  }

  typeStep();
}

/* ==========================================================================
   5. NAVBAR & SCROLL PROGRESS
   ========================================================================== */
function initNavbarAndScroll() {
  const navbar = document.getElementById('arch-navbar');
  const scrollBar = document.getElementById('scroll-progress-fill');
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinksWrap = document.getElementById('arch-nav-links');
  const navLinks = document.querySelectorAll('.arch-nav-link');

  // Mobile Menu Toggle
  if (mobileBtn && navLinksWrap) {
    mobileBtn.addEventListener('click', () => {
      navLinksWrap.classList.toggle('nav-open');
    });
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navLinksWrap.classList.remove('nav-open');
      });
    });
  }

  // Scroll Progress & Active Section Spy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollBar) scrollBar.style.width = `${pct}%`;
    if (navbar) navbar.classList.toggle('scrolled', scrollTop > 30);

    let currentSec = '';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 160;
      if (scrollTop >= top) {
        currentSec = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${currentSec}`);
    });
  }, { passive: true });
}

/* ==========================================================================
   6. PROJECTS: DATA-DRIVEN RENDER + SUPABASE SYNC + FILTER + FULL DETAIL PAGE
   ========================================================================== */
const SUPABASE_URL = 'https://dhmabndpzrzacjrtoank.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRobWFibmRwenJ6YWNqcnRvYW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzNDAxMjksImV4cCI6MjEwNjkxNjEyOX0.FCHEbO5LuAkPkIZZ4kkRIxmCkT40nhHm0shNYm4UcTA';
const PROJECT_IMAGES_BUCKET = 'project-images';
const PROJ_IMG_BASE = `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/projects/`;
const DEFAULT_CV_URL = `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/CV-Rasya-Arfian-Akbar.pdf`;

let supabaseClient = null;
if (window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (err) {
    supabaseClient = null;
  }
}

let currentCvUrl = DEFAULT_CV_URL;
let cvCacheVersion = Date.now();

function escHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function projImg(folder, file, caption, team) {
  return { src: `${PROJ_IMG_BASE}${folder}/${file}`, caption: caption || '', team: Boolean(team) };
}

/* ---------- Data cadangan (dipakai bila Supabase kosong / offline) ---------- */
const PROJECT_FALLBACK = [
  {
    match: 'chatbot',
    title: 'Chatbot Adenomyosis dan Endometriosis — BRIN',
    role: 'Full-stack Developer, UI/UX Designer & System Analyst',
    org: 'Mitra: Badan Riset dan Inovasi Nasional (BRIN)',
    period: 'Juni 2026 — Sekarang',
    badge: 'MOBILE & AI',
    category: 'mobile',
    winBrand: 'BRIN AI MOBILE',
    summary: 'Aplikasi chatbot mobile untuk konsultasi dan edukasi seputar penyakit kewanitaan (adenomyosis & endometriosis) bersama Badan Riset dan Inovasi Nasional (BRIN), dilengkapi pencarian semantik berbasis basis data vektor.',
    description: 'Aplikasi chatbot mobile yang memanfaatkan kecerdasan buatan (AI) dan basis data vektor untuk layanan konsultasi serta edukasi kesehatan kewanitaan seputar penyakit adenomyosis dan endometriosis bersama Badan Riset dan Inovasi Nasional (BRIN), lengkap dengan pencarian semantik materi medis, antarmuka responsif rasio 9:16, dan perancangan alur pengguna melalui Figma.',
    challenge: 'Kebutuhan media edukasi medis kewanitaan yang sensitif, terpercaya, dan memerlukan akurasi informasi ilmiah berbasis rujukan riset.',
    solution: 'Antarmuka mobile React Native yang dipadukan dengan Qdrant Vector DB & Supabase di atas backend Python Django.',
    impact: 'Menyajikan alur konsultasi interaktif yang edukatif, aman, ramah pengguna, dan siap menuju tahap deployment uji coba BRIN.',
    tags: ['React Native', 'Python', 'Django', 'Qdrant Vector DB', 'Supabase', 'Figma', 'VSCode'],
    features: [
      'Integrasi Basis Data Vektor Qdrant & Supabase untuk pencarian materi medis secara semantik dan akurat.',
      'Pengembangan antarmuka aplikasi mobile responsif (rasio 9:16) menggunakan React Native.',
      'Penyusunan materi edukasi ilmiah seputar penyakit adenomyosis dan endometriosis bersama peneliti BRIN.',
      'Perancangan prototype interaktif dan alur pengalaman pengguna (UI/UX) melalui Figma.'
    ],
    images: [
      projImg('chatbot-brin', '1.png', 'Antarmuka Konsultasi Chatbot'),
      projImg('chatbot-brin', '2.png', 'Edukasi & Rujukan Medis'),
      projImg('chatbot-brin', 'tim.png', 'Dokumentasi Foto Tim Proyek Chatbot BRIN', true)
    ]
  },
  {
    match: 'migrasi',
    title: 'Migrasi Sistem Informasi Akademik Berbasis Web — Politeknik Astra',
    role: 'Full-Stack Developer',
    org: 'Politeknik Astra',
    period: 'September 2025 — Mei 2026',
    badge: 'WEB ENTERPRISE',
    category: 'web',
    winBrand: 'SIA POLITEKNIK ASTRA',
    summary: 'Migrasi dan pengembangan ulang website Sistem Informasi Akademik (SIA) versi legacy menjadi arsitektur modern menggunakan Next.js dan backend ASP.NET 8.0 (C#) serta optimasi database SQL Server.',
    description: 'Website Sistem Informasi Akademik (SIA) hasil migrasi dan pengembangan ulang dari sistem legacy menuju arsitektur web modern menggunakan Next.js dan backend ASP.NET 8.0 (C#), lengkap dengan pembaruan struktur relasi database SQL Server, kolaborasi repositori GitLab, serta redesain antarmuka akademik melalui Figma.',
    challenge: 'Website SIA versi lama memiliki performa lambat, struktur kode monolitik, dan antarmuka yang perlu dimodernisasi.',
    solution: 'Migrasi penuh frontend ke Next.js (SSR) dan arsitektur backend ASP.NET 8.0 disertai restrukturisasi relasi SQL Server.',
    impact: 'Pemuatan halaman akademik menjadi jauh lebih responsif dan mudah dipelihara oleh tim pengembang.',
    tags: ['Next.js', 'ASP.NET 8.0', 'C#', 'JavaScript', 'SQL Server', 'GitLab', 'Figma'],
    features: [
      'Migrasi penuh frontend SIA dari teknologi legacy menuju arsitektur modern berbasis Next.js.',
      'Pembangunan web service backend berkinerja tinggi menggunakan ASP.NET 8.0 dan bahasa C#.',
      'Restrukturisasi skema database dan optimasi query relasional pada Microsoft SQL Server.',
      'Redesain pengalaman pengguna (UI/UX) modul akademik melalui Figma serta version control GitLab.'
    ],
    images: [
      projImg('migrasi-sia', '1.png', 'Halaman Utama Sistem Informasi Akademik'),
      projImg('migrasi-sia', '2.png', 'Modul Akademik & Pengelolaan Data'),
      projImg('migrasi-sia', 'tim.png', 'Dokumentasi Foto Tim Proyek Migrasi SIA', true)
    ]
  },
  {
    match: 'booking motor',
    title: 'Booking Motor — Proyek Migrasi AHM',
    role: 'Back-End & Front-End Developer',
    org: 'Proyek Migrasi PT Astra Honda Motor (AHM)',
    period: 'Juli 2026 — Agustus 2026',
    badge: 'WEB & BACKEND API',
    category: 'web',
    winBrand: 'AHM ENTERPRISE MIGRATION',
    confidential: true,
    summary: 'Mengembangkan fungsi sistem Booking Motor untuk proyek migrasi PT Astra Honda Motor (AHM) dengan fokus pada keandalan backend Java, ketepatan transaksi database Oracle SQL, dan kualitas kode SonarQube.',
    description: 'Pengembangan fungsi sistem pemesanan dan transaksi Booking Motor dalam proyek migrasi enterprise PT Astra Honda Motor (AHM), mencakup pembangunan RESTful API berbasis Java, pemodelan skema serta validasi transaksi database di Oracle SQL Developer, pengujian otomatis via Postman, dan pemeriksaan standar kualitas kode menggunakan SonarQube.',
    challenge: 'Migrasi data dan fungsionalitas booking sepeda motor yang memerlukan validasi transaksi ketat sesuai standar industri.',
    solution: 'Pengembangan RESTful API berbasis Java dengan pemodelan skema Oracle SQL Developer & uji Postman.',
    impact: 'API pemesanan berhasil terintegrasi dengan standar kode bersih dan keamanan terverifikasi SonarQube.',
    tags: ['Java', 'Oracle SQL Developer', 'Postman', 'SonarQube', 'NetBeans'],
    features: [
      'Pengembangan modul backend Booking Motor untuk kebutuhan migrasi sistem enterprise PT AHM.',
      'Pemodelan query dan validasi transaksi database menggunakan Oracle SQL Developer.',
      'Pengujian endpoint RESTful API dan skenario payload secara menyeluruh dengan Postman.',
      'Audit kualitas, keamanan, dan standar kepatuhan kode menggunakan SonarQube (tampilan sistem dilindungi kredensial perusahaan).'
    ],
    images: [
      projImg('booking-motor', 'tim.png', 'Dokumentasi Tim Pengembang Proyek Booking Motor AHM', true)
    ]
  },
  {
    match: 'manajemen asset',
    title: 'Manajemen Asset — Politeknik Astra',
    role: 'Full-Stack Developer, UI/UX Designer & System Analyst',
    org: 'Politeknik Astra',
    period: 'Oktober 2025 — Februari 2026',
    badge: 'WEB APPLICATION',
    category: 'web',
    winBrand: 'ASSET MANAGEMENT SYSTEM',
    summary: 'Membangun website sistem inventaris dan manajemen aset kampus menggunakan PHP dan database MySQL, dilengkapi fitur penjadwalan maintenance berkala serta pelaporan kerusakan barang.',
    description: 'Website sistem inventaris dan manajemen aset fasilitas kampus menggunakan PHP dan database MySQL untuk memantau kondisi ribuan barang secara berkala, lengkap dengan modul penjadwalan pemeliharaan (maintenance), pelaporan kerusakan barang, perancangan alur sistem di Draw.io, serta desain antarmuka melalui Figma.',
    challenge: 'Pendataan barang inventaris dan riwayat servis aset kampus sebelumnya dicatat manual dan rawan selisih data.',
    solution: 'Platform inventaris berbasis PHP & MySQL dengan modul pelaporan maintenance dan alur sistem Draw.io.',
    impact: 'UPT Informatika dapat memantau status ribuan aset dan merespons pengajuan perbaikan dengan cepat.',
    tags: ['PHP', 'MySQL', 'HTML', 'CSS', 'Figma', 'Draw.io'],
    features: [
      'Pencatatan dan pemantauan status inventaris barang kampus secara terpusat dan berkala.',
      'Modul penjadwalan pemeliharaan (maintenance) rutin serta pelaporan barang rusak secara real-time.',
      'Perancangan diagram alur proses bisnis menggunakan Draw.io serta prototipe UI/UX di Figma.'
    ],
    images: [
      projImg('manajemen-asset', '1.png', 'Dashboard Inventaris & Manajemen Aset'),
      projImg('manajemen-asset', '2.png', 'Modul Pelaporan & Jadwal Maintenance'),
      projImg('manajemen-asset', 'tim.png', 'Dokumentasi Foto Tim Proyek Manajemen Asset', true)
    ]
  },
  {
    match: 'karaoke',
    title: 'Aplikasi Desktop Karaoke Poprock — Politeknik Astra',
    role: 'Full-Stack Developer, UI/UX Designer & System Analyst',
    org: 'Politeknik Astra',
    period: 'Mei 2025 — Juli 2026',
    badge: 'DESKTOP POS & OPS',
    category: 'desktop',
    winBrand: 'POPROCK POS & OPS',
    summary: 'Membangun dua aplikasi desktop pengelolaan karaoke menggunakan Java (JavaFX) dan C# yang terintegrasi dengan satu basis data SQL Server, mencakup modul operasional ruangan/staf dan modul transaksi kasir.',
    description: 'Sistem pengelolaan operasional tempat hiburan karaoke berbasis dua aplikasi desktop terintegrasi yang dibangun menggunakan Java (JavaFX) dan C# di atas satu database SQL Server terpusat, mencakup modul manajemen staf, ketersediaan dan reservasi jam ruangan, pemesanan menu makanan/minuman, hingga transaksi kasir (POS).',
    challenge: 'Sinkronisasi real-time dua aplikasi berbeda (JavaFX & C#) ke satu database tanpa konflik transaksi kasir.',
    solution: 'Arsitektur database terpusat di SQL Server untuk reservasi jam ruangan, pesanan menu, dan kasir POS.',
    impact: 'Operasional karaoke berjalan teratur dan laporan rekapitulasi omset tercatat otomatis.',
    tags: ['Java', 'JavaFX', 'C#', 'SQL Server', 'Figma'],
    features: [
      'Modul manajemen staf, pemantauan ketersediaan ruangan karaoke, dan reservasi durasi sewa.',
      'Modul kasir (Point of Sale) untuk transaksi sewa ruangan, paket promo, serta pesanan makanan dan minuman.',
      'Integrasi sinkron dua aplikasi desktop berbeda (JavaFX & C#) ke dalam satu basis data SQL Server.'
    ],
    images: [
      projImg('karaoke-poprock', '1.png', 'Modul Operasional & Reservasi Ruangan'),
      projImg('karaoke-poprock', '2.png', 'Modul Transaksi Kasir (POS)'),
      projImg('karaoke-poprock', 'tim.jpg', 'Dokumentasi Foto Tim Proyek Karaoke Poprock', true)
    ]
  },
  {
    match: 'booking hotel',
    title: 'Aplikasi Desktop Booking Hotel — Politeknik Astra',
    role: 'Full-Stack Developer & System Analyst',
    org: 'Politeknik Astra',
    period: 'Desember 2024 — Februari 2025',
    badge: 'NATIVE C SYSTEM',
    category: 'desktop',
    winBrand: 'HOTEL BOOKING C SYSTEM',
    summary: 'Membangun aplikasi Booking Hotel berbasis bahasa C yang mengelola kamar, customer, paket member, karyawan, transaksi booking kamar, hingga perhitungan denda keterlambatan.',
    description: 'Aplikasi desktop manajemen perhotelan berbasis bahasa pemrograman C yang dirancang dengan struktur data efisien untuk mengelola ketersediaan kamar, registrasi pelanggan, paket member, data staf, transaksi pemesanan kamar, hingga perhitungan otomatis diskon member dan denda keterlambatan.',
    challenge: 'Mengelola manajemen kamar, member, dan denda menginap menggunakan bahasa C tanpa database engine eksternal.',
    solution: 'Implementasi struktur data dinamis (struct & file handling) disertai pemodelan alur kerja via Draw.io.',
    impact: 'Program berjalan sangat ringan, waktu pemrosesan transaksi cepat, dan penggunaan RAM sangat optimal.',
    tags: ['Bahasa C', 'Data Structures', 'Draw.io'],
    features: [
      'Implementasi struktur data dinamis (struct & file handling) untuk manajemen kamar, pelanggan, member, dan staf.',
      'Kalkulasi transaksi menginap otomatis mencakup potongan diskon member dan denda keterlambatan check-out.',
      'Pemodelan alur kerja sistem secara terstruktur menggunakan Draw.io.'
    ],
    noTeam: true,
    images: [
      projImg('booking-hotel', '1.png', 'Menu Utama & Manajemen Kamar Hotel'),
      projImg('booking-hotel', '2.png', 'Transaksi Reservasi & Kalkulasi Member')
    ]
  }
];

let currentProjects = PROJECT_FALLBACK.map((p) => buildProjectModel({}, p));
let activeProjCat = 'all';
let projSearchQuery = '';

/* ---------- Ikon & warna teknologi ---------- */
const TECH_META = [
  [/javafx/i, 'fa-solid fa-desktop', '#2563eb'],
  [/javascript|^js$/i, 'fa-brands fa-js', '#eab308'],
  [/java\b/i, 'fa-brands fa-java', '#ef4444'],
  [/react/i, 'fa-brands fa-react', '#0ea5e9'],
  [/next/i, 'fa-brands fa-react', '#2563eb'],
  [/python/i, 'fa-brands fa-python', '#3b82f6'],
  [/django/i, 'fa-solid fa-leaf', '#10b981'],
  [/qdrant|vector/i, 'fa-solid fa-cubes', '#8b5cf6'],
  [/supabase/i, 'fa-solid fa-bolt', '#10b981'],
  [/figma/i, 'fa-brands fa-figma', '#f43f5e'],
  [/vscode|visual studio/i, 'fa-solid fa-laptop-code', '#0284c7'],
  [/asp|\.net/i, 'fa-solid fa-server', '#6366f1'],
  [/^c#$|csharp/i, 'fa-solid fa-code', '#8b5cf6'],
  [/oracle/i, 'fa-solid fa-database', '#dc2626'],
  [/sql|postgres/i, 'fa-solid fa-database', '#0284c7'],
  [/gitlab/i, 'fa-brands fa-gitlab', '#f97316'],
  [/github/i, 'fa-brands fa-github', '#0f172a'],
  [/git/i, 'fa-brands fa-git-alt', '#f97316'],
  [/postman/i, 'fa-solid fa-paper-plane', '#f97316'],
  [/sonar/i, 'fa-solid fa-shield-halved', '#0ea5e9'],
  [/netbeans/i, 'fa-solid fa-cube', '#2563eb'],
  [/php|laravel/i, 'fa-brands fa-php', '#6366f1'],
  [/html/i, 'fa-brands fa-html5', '#f97316'],
  [/css/i, 'fa-brands fa-css3-alt', '#2563eb'],
  [/draw/i, 'fa-solid fa-diagram-project', '#f59e0b'],
  [/data struct/i, 'fa-solid fa-sitemap', '#0ea5e9'],
  [/^c$|bahasa c/i, 'fa-solid fa-terminal', '#2563eb']
];

function techMeta(name) {
  const hit = TECH_META.find((row) => row[0].test(String(name).trim()));
  return hit ? { icon: hit[1], color: hit[2] } : { icon: 'fa-solid fa-code', color: '#2563eb' };
}

/* ---------- Normalisasi & penggabungan data Supabase + cadangan ---------- */
function normalizeTags(raw) {
  if (Array.isArray(raw)) return raw.map((t) => String(t).trim()).filter(Boolean);
  if (typeof raw === 'string' && raw.trim()) return raw.split(',').map((t) => t.trim()).filter(Boolean);
  return [];
}

function normalizeImages(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => (typeof item === 'string' ? { src: item } : item))
    .filter((item) => item && typeof item.src === 'string' && item.src)
    .map((item) => {
      const src = item.src;
      const isTeam = Boolean(item.team) || /\/(tim|team)\./i.test(src);
      return { src, caption: item.caption || '', team: isTeam };
    });
}

function parseFeatureHeader(features) {
  const list = Array.isArray(features) ? features.slice() : [];
  let role = '';
  let period = '';
  if (list.length && /^project member\s*\|/i.test(list[0])) {
    const m = list[0].match(/^project member\s*\|\s*(.+?)\s*\((.+)\)\s*$/i);
    if (m) {
      role = m[1];
      period = m[2];
    }
    list.shift();
  }
  return { role, period, list };
}

function categoryBadge(cat) {
  if (cat === 'mobile') return 'MOBILE & AI';
  if (cat === 'desktop') return 'DESKTOP SYSTEM';
  return 'WEB APPLICATION';
}

function buildProjectModel(remote, local) {
  const r = remote || {};
  const l = local || {};
  const header = parseFeatureHeader(r.features);
  const category = r.category || l.category || 'web';
  const confidential = Boolean(l.confidential || r.is_confidential || /booking motor/i.test(r.title || l.title || ''));
  const isHotel = Boolean(l.noTeam || /booking hotel/i.test(r.title || l.title || ''));

  let images = normalizeImages(r.images);
  const localImages = normalizeImages(l.images);
  if (!images.length) images = localImages;
  const localTeam = localImages.find((i) => i.team);

  if (confidential) {
    const team = images.find((i) => i.team) || localTeam;
    images = team ? [team] : images;
  } else if (isHotel) {
    images = images.filter((i) => !i.team);
  } else if (!images.some((i) => i.team) && localTeam) {
    images = [...images, localTeam];
  }

  // maksimal 2 gambar program + 1 foto tim
  const photos = images.filter((i) => !i.team).slice(0, 2);
  const team = images.find((i) => i.team);
  images = team ? [...photos, team] : photos;

  const tags = normalizeTags(r.tags);
  const features = header.list.length ? header.list : (l.features || []);

  return {
    title: r.title || l.title || 'Proyek',
    role: header.role || l.role || 'Project Member',
    org: l.org || 'Politeknik Astra',
    period: header.period || l.period || '',
    badge: l.badge || categoryBadge(category),
    category,
    winBrand: l.winBrand || (r.title || 'PROJECT PREVIEW').toUpperCase().slice(0, 28),
    confidential,
    summary: r.description || l.summary || l.description || '',
    description: r.description || l.description || l.summary || '',
    challenge: r.challenge || l.challenge || '',
    solution: r.solution || l.solution || '',
    impact: r.impact || l.impact || '',
    tags: tags.length ? tags : (l.tags || []),
    features,
    images
  };
}

function findLocalProject(remote, idx) {
  const title = String(remote.title || '').toLowerCase();
  const hit = PROJECT_FALLBACK.find((p) => title.includes(p.match));
  if (hit) return hit;
  return {};
}

/* ---------- Dokumentasi (maks. 2 program + 1 foto tim) ---------- */
function buildProjectDocs(proj) {
  const total = proj.images.length;
  let programNo = 0;
  return proj.images.map((img, i) => {
    const mobile916 = proj.category === 'mobile' && !img.team;
    if (!img.team) programNo += 1;
    const labelBase = img.team ? 'Dokumentasi Foto Tim' : `Tampilan Program ${programNo}`;
    return {
      btnText: img.team
        ? (proj.confidential ? 'Dokumentasi Foto Tim (Sistem Dilindungi Kredensial PT AHM)' : '3. Foto Tim')
        : `${programNo}. Program ${programNo}`,
      label: `${total > 1 ? `${i + 1}/${total} · ` : ''}${labelBase}${mobile916 ? ' ' : ''}`,
      caption: img.caption || labelBase,
      src: img.src,
      mobile916,
      team: img.team
    };
  });
}

function docIcon(doc) {
  if (doc.mobile916) return 'fa-solid fa-mobile-screen-button';
  if (doc.team) return 'fa-solid fa-users';
  return 'fa-solid fa-desktop';
}

/* ---------- Render kartu proyek ---------- */
function renderProjectCards(projects, instant) {
  const list = document.querySelector('.projects-monograph-list');
  if (!list) return;

  list.innerHTML = projects.map((p, idx) => {
    const docs = buildProjectDocs(p);
    const first = docs[0] || { src: '', label: '', mobile916: false, team: false };
    const revealCls = instant ? 'reveal-up is-visible' : 'reveal-up';
    const serial = String(idx + 1).padStart(2, '0');
    const tags = p.tags.slice(0, 7).map((t) => `<span class="stack-tag">${escHtml(t)}</span>`).join('');
    const switcher = docs.map((d, i) => `
      <button type="button" class="case-doc-btn ${i === 0 ? 'active' : ''}"
        data-src="${escHtml(d.src)}" data-label="${escHtml(d.label)}" data-mobile="${d.mobile916}">
        <i class="${docIcon(d)}"></i> ${escHtml(d.btnText)}
      </button>`).join('');

    const badgeOrRibbon = p.confidential
      ? '<span class="confidential-ribbon"><i class="fa-solid fa-lock"></i> Dokumentasi Tim (Kredensial AHM)</span>'
      : `<span class="case-doc-counter-badge"><i class="${docIcon(first)}"></i> ${escHtml(first.label)}</span>`;

    const summary = p.summary.length > 260 ? `${p.summary.slice(0, 257)}...` : p.summary;

    return `
      <article class="project-case-item ${revealCls}" data-cat="${escHtml(p.category)}" data-project-idx="${idx}">
        <div class="case-top-strip">
          <div class="case-serial">
            <span>PROYEK // ${serial}</span>
            <span class="case-serial-badge">${escHtml(p.badge)}</span>
            <span>${escHtml(p.org.toUpperCase())}</span>
          </div>
          <span>${escHtml(p.period.toUpperCase())}</span>
        </div>

        <div class="case-main-grid">
          <div class="case-visual-col">
            <div class="case-img-frame ${first.mobile916 ? 'is-mobile-916' : ''}">
              ${badgeOrRibbon}
              <div class="mobile-916-device">
                <div class="mobile-916-notch"></div>
                <img class="case-main-preview-img" src="${escHtml(first.src)}" alt="${escHtml(p.title)}" />
              </div>
            </div>
            <div class="case-doc-switcher" aria-label="Pilih Dokumentasi Proyek">${switcher}</div>
            <div class="case-tech-stack">${tags}</div>
          </div>

          <div class="case-content-col">
            <div>
              <div class="case-role-kicker">${escHtml(p.role)}</div>
              <h3 class="case-title">${escHtml(p.title)}</h3>
              <p class="case-summary">${escHtml(summary)}</p>
            </div>
            <div class="star-matrix">
              <div class="star-cell"><span class="star-label">01 / Tantangan</span><p class="star-text">${escHtml(p.challenge)}</p></div>
              <div class="star-cell"><span class="star-label">02 / Solusi</span><p class="star-text">${escHtml(p.solution)}</p></div>
              <div class="star-cell"><span class="star-label">03 / Dampak</span><p class="star-text">${escHtml(p.impact)}</p></div>
            </div>
          </div>
        </div>

        <button type="button" class="case-open-detail-bar" data-open-project="${idx}">
          <span><i class="fa-solid fa-expand"></i> Rincian Fitur &amp; Halaman Detail Proyek Penuh</span>
          <span>Klik untuk Buka Detail <i class="fa-solid fa-arrow-right"></i></span>
        </button>
      </article>`;
  }).join('');

  updateProjectCounts(projects);
  applyProjectFilter();
}

function updateProjectCounts(projects) {
  const pad = (n) => String(n).padStart(2, '0');
  const count = (cat) => (cat === 'all' ? projects.length : projects.filter((p) => p.category === cat).length);
  const labels = { all: 'Semua', web: 'Web App', mobile: 'Mobile & AI', desktop: 'Desktop System' };

  document.querySelectorAll('.proj-filter-btn').forEach((btn) => {
    const key = btn.dataset.filter || 'all';
    if (labels[key]) btn.textContent = `${labels[key]} (${pad(count(key))})`;
  });

  document.querySelectorAll('.ledger-val').forEach((cell) => {
    const small = cell.querySelector('small');
    const num = cell.querySelector('[data-counter]');
    if (small && num && /proyek/i.test(small.textContent)) {
      num.dataset.counter = String(projects.length);
      num.textContent = pad(projects.length);
    }
  });
}

function applyProjectFilter() {
  document.querySelectorAll('.project-case-item').forEach((item) => {
    const cat = item.dataset.cat || '';
    const text = item.textContent.toLowerCase();
    const matchCat = activeProjCat === 'all' || cat === activeProjCat;
    const matchSearch = !projSearchQuery || text.includes(projSearchQuery);
    item.classList.toggle('is-hidden', !(matchCat && matchSearch));
  });
}

/* ---------- Halaman detail proyek (penuh) ---------- */
function setDetailActiveDoc(docs, docIdx) {
  const doc = docs[docIdx];
  if (!doc) return;
  const frame = document.getElementById('fd-showcase-frame');
  const img = document.getElementById('fd-preview-img');
  const badge = document.getElementById('fd-counter-badge');
  const switcher = document.getElementById('fd-doc-switcher');
  const grid = document.getElementById('fd-gallery-grid');

  if (img) {
    img.dataset.extTried = '';
    img.style.visibility = '';
    img.src = doc.src;
    img.alt = doc.caption;
  }
  if (frame) frame.classList.toggle('is-mobile-916', Boolean(doc.mobile916));
  if (badge) badge.innerHTML = `<i class="${docIcon(doc)}"></i> ${escHtml(doc.label)}`;
  if (switcher) switcher.querySelectorAll('.case-doc-btn').forEach((b, i) => b.classList.toggle('active', i === docIdx));
  if (grid) grid.querySelectorAll('.drawer-doc-card').forEach((c, i) => c.classList.toggle('active', i === docIdx));
}

function openProjectDetailPage(idx) {
  const proj = currentProjects[idx];
  const page = document.getElementById('project-detail-page');
  if (!proj || !page) return;

  const docs = buildProjectDocs(proj);
  const setText = (id, value) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  };

  setText('fd-bc-current', proj.title);
  setText('fd-period', proj.period);
  setText('fd-role', `${proj.role} · ${proj.org}`);
  setText('fd-title', proj.title);
  setText('fd-desc', proj.description);

  const brand = document.getElementById('fd-win-brand');
  if (brand) brand.innerHTML = `<i class="fa-solid fa-bars"></i> ${escHtml(proj.winBrand)}`;

  const techBox = document.getElementById('fd-tech-badges');
  if (techBox) {
    techBox.innerHTML = proj.tags.map((t) => {
      const m = techMeta(t);
      return `<span class="proj-tech-badge"><i class="${m.icon}" style="color: ${m.color};"></i> ${escHtml(t)}</span>`;
    }).join('');
  }

  const featBox = document.getElementById('fd-features-list');
  if (featBox) {
    featBox.innerHTML = proj.features
      .map((f) => `<li><i class="fa-solid fa-circle-check"></i> <span>${escHtml(f)}</span></li>`)
      .join('');
  }

  const switcher = document.getElementById('fd-doc-switcher');
  if (switcher) {
    switcher.innerHTML = docs.map((d, i) => `
      <button type="button" class="case-doc-btn ${i === 0 ? 'active' : ''}" data-doc-idx="${i}">
        <i class="${docIcon(d)}"></i> ${escHtml(d.btnText)}
      </button>`).join('');
    switcher.querySelectorAll('.case-doc-btn').forEach((btn) => {
      btn.addEventListener('click', () => setDetailActiveDoc(docs, parseInt(btn.dataset.docIdx, 10)));
    });
  }

  const grid = document.getElementById('fd-gallery-grid');
  if (grid) {
    grid.classList.remove('is-two-docs', 'is-single-doc');
    if (docs.length === 2) grid.classList.add('is-two-docs');
    if (docs.length === 1) grid.classList.add('is-single-doc');
    grid.innerHTML = docs.map((d, i) => `
      <figure class="drawer-doc-card ${d.mobile916 ? 'is-916-card' : (d.team ? 'is-team-card' : '')} ${i === 0 ? 'active' : ''}" data-doc-idx="${i}">
        <div class="drawer-doc-img-wrap"><img src="${escHtml(d.src)}" alt="${escHtml(d.caption)}" /></div>
        <figcaption><i class="${docIcon(d)}"></i> ${escHtml(d.caption)}</figcaption>
      </figure>`).join('');
    grid.querySelectorAll('.drawer-doc-card').forEach((card) => {
      card.addEventListener('click', () => {
        setDetailActiveDoc(docs, parseInt(card.dataset.docIdx, 10));
        const frame = document.getElementById('fd-showcase-frame');
        if (frame) frame.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  setDetailActiveDoc(docs, 0);
  page.classList.add('is-open');
  page.setAttribute('aria-hidden', 'false');
  page.scrollTop = 0;
  document.body.style.overflow = 'hidden';
}

function closeProjectDetailPage() {
  const page = document.getElementById('project-detail-page');
  if (!page) return;
  page.classList.remove('is-open');
  page.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ---------- Fallback ekstensi gambar (png -> jpg -> jpeg -> webp) ---------- */
function initImageExtensionFallback() {
  const exts = ['png', 'jpg', 'jpeg', 'webp', 'PNG', 'JPG'];
  document.addEventListener('error', (e) => {
    const img = e.target;
    if (!(img instanceof HTMLImageElement)) return;
    if (!img.closest('.projects-monograph-list, #project-detail-page')) return;

    const tried = (img.dataset.extTried || '').split(',').filter(Boolean);
    const match = img.src.match(/\.(png|jpg|jpeg|webp)(\?.*)?$/i);
    if (!match) {
      img.style.visibility = 'hidden';
      return;
    }
    if (!tried.includes(match[1])) tried.push(match[1]);
    const next = exts.find((x) => !tried.includes(x));
    if (!next) {
      img.style.visibility = 'hidden';
      return;
    }
    tried.push(next);
    img.dataset.extTried = tried.join(',');
    img.src = img.src.replace(/\.(png|jpg|jpeg|webp)(\?.*)?$/i, `.${next}$2`);
  }, true);
}

/* ---------- Supabase: proyek, profil, CV (+ realtime) ---------- */
async function loadProjectsFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('projects')
      .select('*')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (error || !data || !data.length) return;

    currentProjects = data.map((row, idx) => buildProjectModel(row, findLocalProject(row, idx)));
    renderProjectCards(currentProjects, true);
  } catch (err) { /* tetap memakai data cadangan */ }
}

const PROFILE_CANDIDATES = [
  `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/Profile.jpg`,
  `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/Profile.PNG`,
  `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/Profile.JPG`,
  `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/profile.png`,
  `${SUPABASE_URL}/storage/v1/object/public/${PROJECT_IMAGES_BUCKET}/profile.jpg`,
  'images/profile.jpg'
];

window.handleProfileImgFallback = function handleProfileImgFallback(img) {
  if (!img) return;
  let idx = parseInt(img.dataset.fallbackIdx || '-1', 10);
  const currentBase = (img.src || '').split('?')[0];
  while (idx + 1 < PROFILE_CANDIDATES.length) {
    idx += 1;
    const nextUrl = PROFILE_CANDIDATES[idx];
    if (nextUrl.split('?')[0] !== currentBase) {
      img.dataset.fallbackIdx = String(idx);
      img.src = nextUrl.startsWith('http') ? `${nextUrl}?t=${Date.now()}` : nextUrl;
      return;
    }
  }
  img.onerror = null;
};

function applyProfileUrl(url, version) {
  if (!url) return;
  const clean = url.trim().split('?')[0];
  document.querySelectorAll('img[data-profile-img]').forEach((img) => {
    img.dataset.fallbackIdx = '-1';
    img.src = clean.startsWith('http') ? `${clean}?t=${version || Date.now()}` : clean;
  });
}

async function loadProfileConfigFromSupabase() {
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('profile_settings')
      .select('hero_image_url, about_image_url, image_url, updated_at')
      .order('id', { ascending: false })
      .limit(1);

    if (!error && data && data.length) {
      const row = data[0];
      const url = row.hero_image_url || row.image_url || row.about_image_url;
      const version = row.updated_at ? new Date(row.updated_at).getTime() : Date.now();
      applyProfileUrl(url, version);
    }
  } catch (err) { /* abaikan */ }
}

function updateCvLinks(url) {
  currentCvUrl = url || DEFAULT_CV_URL;
  const cleanUrl = currentCvUrl.split('?')[0];
  document.querySelectorAll('.js-cv-link').forEach((a) => {
    a.href = `${cleanUrl}?v=${cvCacheVersion}`;
  });
}

function getCvFreshUrl() {
  const cleanUrl = (currentCvUrl || DEFAULT_CV_URL).split('?')[0];
  // Selalu sertakan timestamp detik ini agar browser iframe selalu mengambil PDF versi terbaru dari Supabase
  return `${cleanUrl}?v=${Date.now()}`;
}

async function loadCvConfigFromSupabase() {
  updateCvLinks(DEFAULT_CV_URL);
  if (!supabaseClient) return;
  try {
    const { data, error } = await supabaseClient
      .from('cv_settings')
      .select('cv_url, title, last_updated')
      .order('id', { ascending: false })
      .limit(1);

    if (!error && data && data.length && data[0].cv_url) {
      cvCacheVersion = data[0].last_updated ? new Date(data[0].last_updated).getTime() : Date.now();
      updateCvLinks(data[0].cv_url);
    }
  } catch (err) { /* tetap memakai CV bawaan */ }
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

    supabaseClient
      .channel('profile-settings-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profile_settings' }, (payload) => {
        const row = payload.new;
        if (row) applyProfileUrl(row.hero_image_url || row.image_url || row.about_image_url, Date.now());
      })
      .subscribe();

    supabaseClient
      .channel('cv-settings-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cv_settings' }, (payload) => {
        if (payload.new && payload.new.cv_url) {
          cvCacheVersion = Date.now();
          updateCvLinks(payload.new.cv_url);
        }
      })
      .subscribe();
  } catch (err) { /* realtime opsional */ }
}

/* ---------- Inisialisasi bagian proyek ---------- */
function initProjectFilterAndSearch() {
  const filterBtns = document.querySelectorAll('.proj-filter-btn');
  const searchInput = document.getElementById('proj-search-input');
  const list = document.querySelector('.projects-monograph-list');

  // 1) Tampilkan data cadangan lebih dulu, lalu timpa dengan data Supabase
  renderProjectCards(currentProjects, false);
  initImageExtensionFallback();

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeProjCat = btn.dataset.filter || 'all';
      applyProjectFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      projSearchQuery = e.target.value.trim().toLowerCase();
      applyProjectFilter();
    });
  }

  // 2) Delegasi klik: pengalih dokumentasi pada kartu & pembuka halaman detail
  if (list) {
    list.addEventListener('click', (e) => {
      const docBtn = e.target.closest('.case-doc-btn');
      const item = e.target.closest('.project-case-item');
      if (!item) return;

      if (docBtn) {
        const frame = item.querySelector('.case-img-frame');
        const previewImg = item.querySelector('.case-main-preview-img');
        const badge = item.querySelector('.case-doc-counter-badge');
        const isMobile916 = docBtn.dataset.mobile === 'true';
        const label = docBtn.dataset.label || '';

        item.querySelectorAll('.case-doc-btn').forEach((b) => b.classList.remove('active'));
        docBtn.classList.add('active');

        if (previewImg && docBtn.dataset.src) {
          previewImg.dataset.extTried = '';
          previewImg.style.visibility = '';
          previewImg.src = docBtn.dataset.src;
        }
        if (frame) frame.classList.toggle('is-mobile-916', isMobile916);
        if (badge && label) {
          const isTeam = /tim/i.test(label);
          const icon = isMobile916 ? 'fa-solid fa-mobile-screen-button' : (isTeam ? 'fa-solid fa-users' : 'fa-solid fa-desktop');
          badge.innerHTML = `<i class="${icon}"></i> ${escHtml(label)}`;
        }
        return;
      }

      const idx = parseInt(item.dataset.projectIdx, 10);
      if (!Number.isNaN(idx)) openProjectDetailPage(idx);
    });
  }

  const closeBtn = document.getElementById('btn-close-project-detail');
  const bcRoot = document.getElementById('fd-bc-root');
  if (closeBtn) closeBtn.addEventListener('click', closeProjectDetailPage);
  if (bcRoot) bcRoot.addEventListener('click', closeProjectDetailPage);
  window.addEventListener('keydown', (e) => {
    const page = document.getElementById('project-detail-page');
    if (e.key === 'Escape' && page && page.classList.contains('is-open')) closeProjectDetailPage();
  });

  // 3) Sinkronisasi Supabase
  loadProjectsFromSupabase();
  loadProfileConfigFromSupabase();
  loadCvConfigFromSupabase();
  setupSupabaseRealtime();
}


/* ==========================================================================
   7. TIMELINE TABS
   ========================================================================== */
function initSkillTabs() {
  const tabBtns = document.querySelectorAll('.skill-tab-btn');
  const panels = document.querySelectorAll('.skill-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.skillTarget;
      tabBtns.forEach((b) => b.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ==========================================================================
   PDF POPUP MODAL (TANPA TAB BARU)
   ========================================================================== */
function openPdfModal(url, name) {
  const modal = document.getElementById('pdf-modal');
  const frame = document.getElementById('pdf-modal-frame');
  const nameEl = document.getElementById('pdf-modal-name');
  const dl = document.getElementById('pdf-modal-download');
  if (!modal || !frame) return;

  // Pastikan URL selalu memiliki cache-buster dinamis agar browser PDF viewer (PDFium)
  // tidak menampilkan dokumen lama dari cache browser lokal
  const cleanUrl = url.split('#')[0];
  const sep = cleanUrl.includes('?') ? '&' : '?';
  const freshUrl = `${cleanUrl}${sep}_t=${Date.now()}`;

  frame.src = 'about:blank';
  setTimeout(() => {
    frame.src = freshUrl;
  }, 20);

  if (nameEl) nameEl.textContent = name || 'Dokumen PDF';
  if (dl) {
    dl.href = freshUrl;
    const downloadFileName = (name || 'Dokumen')
      .replace(/[^a-zA-Z0-9_\-\.]/g, '_')
      .replace(/_{2,}/g, '_');
    dl.setAttribute('download', downloadFileName.endsWith('.pdf') ? downloadFileName : `${downloadFileName}.pdf`);
  }
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePdfModal() {
  const modal = document.getElementById('pdf-modal');
  const frame = document.getElementById('pdf-modal-frame');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  if (frame) frame.src = 'about:blank';
  document.body.style.overflow = '';
}

function initPdfModal() {
  // Semua link PDF (kecuali tombol yang memang untuk unduh langsung) dibuka sebagai popup
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href*=".pdf"], a.js-cv-link');
    if (link && !link.hasAttribute('download') && !link.closest('#pdf-modal')) {
      e.preventDefault();
      const isCv = link.classList.contains('js-cv-link');
      const label = isCv ? 'CV - Rasya Arfian Akbar' : (link.textContent.replace(/\s+/g, ' ').trim() || 'Dokumen PDF');
      openPdfModal(isCv ? getCvFreshUrl() : link.href, label);
      return;
    }
    if (e.target.closest('[data-pdf-close]')) {
      closePdfModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePdfModal();
  });
}

function initTimelineTabs() {
  const tabBtns = document.querySelectorAll('.tl-switcher-bar:not(.skill-switcher-bar) .tl-tab-btn');
  const panels = document.querySelectorAll('.tl-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.target;
      tabBtns.forEach((b) => b.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = document.getElementById(targetId);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ==========================================================================
   8. SCROLL REVEAL OBSERVER
   ========================================================================== */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-up');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   9. CLIPBOARD COPY & TOAST NOTIFICATION
   ========================================================================== */
function initCopyButtons() {
  const copyBtns = document.querySelectorAll('[data-copy]');
  const toast = document.getElementById('toast-box');
  const toastText = document.getElementById('toast-text');
  let toastTimer = null;

  copyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const val = btn.dataset.copy;
      const label = btn.dataset.label || 'Teks';
      if (!val) return;

      navigator.clipboard.writeText(val).then(() => {
        if (toast && toastText) {
          toastText.textContent = `${label} berhasil disalin: ${val}`;
          toast.classList.add('show');
          clearTimeout(toastTimer);
          toastTimer = setTimeout(() => {
            toast.classList.remove('show');
          }, 2600);
        }
      });
    });
  });
}

/* ==========================================================================
   10. 3-CARD COVERFLOW CERTIFICATE SHOWCASE CAROUSEL (EXACT REFERENCE DESIGN)
   ========================================================================== */
function initCertShowcaseCarousel() {
  const stage = document.getElementById('cert-carousel-stage');
  const dotsWrap = document.getElementById('cert-pagination-dots');
  if (!stage || !dotsWrap) return;

  const CERTS_BASE = 'https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/certificates/';

  const certificates = [
    {
      issuerHeader: 'BISA AI ACADEMY',
      title: 'Artificial Intelligence',
      year: '2026',
      date: '16 Oktober 2026',
      credentialId: '2026/506/69181',
      icon: 'fa-solid fa-brain',
      pdfUrl: `${CERTS_BASE}artificial-intelligence.pdf`
    },
    {
      issuerHeader: 'MIKROTIKLS SIA (LATVIA)',
      title: 'MikroTik Certified Network Associate (MTCNA)',
      year: '2026',
      date: '31 Januari 2026',
      credentialId: '2601NA2655',
      icon: 'fa-solid fa-network-wired',
      pdfUrl: `${CERTS_BASE}mtcna-mikrotik.pdf`
    },
    {
      issuerHeader: 'BISA AI ACADEMY',
      title: 'Basic Figma: Pembuatan UI Aplikasi Mobile',
      year: '2026',
      date: 'Oktober 2026',
      credentialId: '2026/537/69181',
      icon: 'fa-brands fa-figma',
      pdfUrl: `${CERTS_BASE}basic-figma.pdf`
    },
    {
      issuerHeader: 'BISA AI ACADEMY',
      title: 'Dasar - Dasar Node JS',
      year: '2026',
      date: '17 Oktober 2026',
      credentialId: '2026/412/69181',
      icon: 'fa-brands fa-node-js',
      pdfUrl: `${CERTS_BASE}dasar-nodejs.pdf`
    },
    {
      issuerHeader: 'BISA AI ACADEMY',
      title: 'Dasar - Dasar Python',
      year: '2026',
      date: '05 Agustus 2026',
      credentialId: '2026/249/69181',
      icon: 'fa-brands fa-python',
      pdfUrl: `${CERTS_BASE}dasar-python.pdf`
    },
    {
      issuerHeader: 'BISA AI ACADEMY',
      title: 'Basic Excel',
      year: '2026',
      date: '17 Oktober 2026',
      credentialId: '2026/294/69181',
      icon: 'fa-solid fa-file-excel',
      pdfUrl: `${CERTS_BASE}basic-excel.pdf`
    },
    {
      issuerHeader: 'AGUNA COURSE',
      title: 'Python Fundamental',
      year: '2025',
      date: '04 Agustus 2025',
      credentialId: 'AC-315-33886729-97',
      icon: 'fa-brands fa-python',
      pdfUrl: `${CERTS_BASE}python-fundamental.pdf`
    },
    {
      issuerHeader: 'AGUNA COURSE',
      title: 'Linux Fundamental',
      year: '2025',
      date: '04 Agustus 2025',
      credentialId: 'AC-050-75298727-98',
      icon: 'fa-brands fa-linux',
      pdfUrl: `${CERTS_BASE}linux-fundamental.pdf`
    },
    {
      issuerHeader: 'AGUNA COURSE',
      title: 'Virtual Machine Fundamental',
      year: '2025',
      date: '05 Mei 2025',
      credentialId: 'AC-446-15449133-19',
      icon: 'fa-solid fa-server',
      pdfUrl: `${CERTS_BASE}virtual-machine-fundamental.pdf`
    },
    {
      issuerHeader: 'AGUNA COURSE',
      title: 'Simulasi Jaringan dengan PNETLab',
      year: '2025',
      date: '04 Agustus 2025',
      credentialId: 'AC-205-42646055-11',
      icon: 'fa-solid fa-diagram-project',
      pdfUrl: `${CERTS_BASE}pnetlab-network.pdf`
    }
  ];

  const total = certificates.length;
  let activeIndex = 1; // Start with index 1 in the center so left (0) and right (2) are immediately visible

  // Render Cards inside Stage
  stage.innerHTML = certificates.map((c, idx) => `
    <article class="cert-showcase-card" data-cert-idx="${idx}" aria-label="${c.title}">
      <div class="cert-card-top">
        <span class="cert-card-issuer">${c.issuerHeader}</span>
        <span class="cert-card-open-hint"><i class="fa-solid fa-arrow-up-right-from-square"></i> Buka PDF</span>
      </div>

      <div class="cert-preview-mat">
        <div class="cert-paper-doc">
          <div class="cert-paper-ribbon">
            <div class="cert-paper-seal">
              <i class="${c.icon}"></i>
            </div>
          </div>

          <div class="cert-paper-head">
            <div class="cert-paper-org">
              <i class="fa-solid fa-award"></i> ${c.issuerHeader}
            </div>
            <div class="cert-paper-type">CERTIFICATE OF COMPLETION</div>
          </div>

          <div class="cert-paper-body">
            <div class="cert-paper-recipient">Rasya Arfian Akbar</div>
            <div class="cert-paper-course">${c.title}</div>
          </div>

          <div class="cert-paper-foot">
            <div>
              <div>${c.date}</div>
              <div>ID: ${c.credentialId}</div>
            </div>
            <div class="cert-paper-qr" aria-hidden="true">
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="cert-card-bottom">
        <h3 class="cert-card-title">${c.title}</h3>
        <span class="cert-card-year">${c.year}</span>
      </div>
    </article>
  `).join('');

  // Render Pagination Pill-Dots
  dotsWrap.innerHTML = certificates.map((c, idx) => `
    <button type="button" class="cert-dot-btn" data-dot-idx="${idx}" aria-label="Pilih sertifikat ${c.title}"></button>
  `).join('');

  const cardEls = Array.from(stage.querySelectorAll('.cert-showcase-card'));
  const dotEls = Array.from(dotsWrap.querySelectorAll('.cert-dot-btn'));

  function updateCarousel() {
    const prevIdx = (activeIndex - 1 + total) % total;
    const nextIdx = (activeIndex + 1) % total;

    cardEls.forEach((card, idx) => {
      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-far-left', 'is-far-right');

      if (idx === activeIndex) {
        card.classList.add('is-active');
      } else if (idx === prevIdx) {
        card.classList.add('is-prev');
      } else if (idx === nextIdx) {
        card.classList.add('is-next');
      } else {
        // Determine shortest direction around circular ring
        const diff = (idx - activeIndex + total) % total;
        if (diff > total / 2) {
          card.classList.add('is-far-left');
        } else {
          card.classList.add('is-far-right');
        }
      }
    });

    dotEls.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  // Click handler on cards: side cards slide to center; center card opens PDF
  cardEls.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (idx === activeIndex) {
        openPdfModal(certificates[idx].pdfUrl, certificates[idx].title);
      } else {
        activeIndex = idx;
        updateCarousel();
      }
    });
  });

  // Click handler on pagination dots
  dotEls.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      activeIndex = idx;
      updateCarousel();
    });
  });

  // Pointer drag / swipe support on stage
  let dragStartX = null;
  stage.addEventListener('pointerdown', (e) => {
    dragStartX = e.clientX;
  });

  stage.addEventListener('pointerup', (e) => {
    if (dragStartX === null) return;
    const deltaX = e.clientX - dragStartX;
    dragStartX = null;

    if (Math.abs(deltaX) > 48) {
      if (deltaX < 0) {
        activeIndex = (activeIndex + 1) % total;
      } else {
        activeIndex = (activeIndex - 1 + total) % total;
      }
      updateCarousel();
    }
  });

  updateCarousel();
}


