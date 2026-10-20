-- ============================================================
-- SETUP DATABASE SUPABASE UNTUK PORTOFOLIO & CV (OPSI B)
-- Rasya Arfian Akbar — Web & Mobile Developer
-- ============================================================
-- PANDUAN MENJALANKAN:
-- 1. Buka Supabase Dashboard (https://supabase.com/dashboard)
-- 2. Pilih proyek Anda: "dhmabndpzrzacjrtoank"
-- 3. Buka menu "SQL Editor" di bilah navigasi kiri
-- 4. Klik "New query", salin dan tempel SELURUH skrip ini
-- 5. Klik tombol "Run" (atau Ctrl + Enter)

-- ============================================================
-- 1. TABEL cv_settings (Pengaturan URL CV Dinamis)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cv_settings (
    id SERIAL PRIMARY KEY,
    title TEXT DEFAULT 'CV Rasya Arfian Akbar',
    cv_url TEXT NOT NULL DEFAULT 'https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/CV-Rasya-Arfian-Akbar.pdf',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE public.cv_settings ENABLE ROW LEVEL SECURITY;

-- Policy agar semua pengunjung website bisa membaca data URL CV
DROP POLICY IF EXISTS "Public can view cv_settings" ON public.cv_settings;
CREATE POLICY "Public can view cv_settings" 
    ON public.cv_settings FOR SELECT 
    USING (true);

-- Policy agar data dapat diubah / diperbarui
DROP POLICY IF EXISTS "Allow modify cv_settings" ON public.cv_settings;
CREATE POLICY "Allow modify cv_settings" 
    ON public.cv_settings FOR ALL 
    USING (true);

-- Masukkan data awal baris id = 1
INSERT INTO public.cv_settings (id, title, cv_url)
VALUES (
    1, 
    'CV Rasya Arfian Akbar', 
    'https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/CV-Rasya-Arfian-Akbar.pdf'
)
ON CONFLICT (id) DO UPDATE 
SET title = EXCLUDED.title,
    cv_url = EXCLUDED.cv_url,
    last_updated = timezone('utc'::text, now());

-- Daftarkan tabel cv_settings ke Supabase Realtime (Aman jika dijalankan berulang)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'cv_settings'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cv_settings;
  END IF;
END $$;


-- ============================================================
-- 2. TABEL projects (6 Proyek Asli Berdasarkan CV)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.projects (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'web', -- 'web', 'mobile', 'desktop'
    description TEXT,
    tags TEXT[],
    features TEXT[],
    github_url TEXT DEFAULT '#',
    live_url TEXT DEFAULT '#',
    figma_url TEXT DEFAULT '#',
    image_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Galeri gambar proyek (maks. 3, 1 foto tim). Contoh isi:
-- [{"src":"https://.../projects/booking-hotel/1.jpg","caption":"Tampilan utama"},
--  {"src":"https://.../projects/booking-hotel/tim.jpg","caption":"Foto tim","team":true}]
-- Jika kosong, website memakai path default: project-images/projects/<folder>/{1,2,tim}.jpg
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS images JSONB;

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects" 
    ON public.projects FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow modify projects" ON public.projects;
CREATE POLICY "Allow modify projects" 
    ON public.projects FOR ALL 
    USING (true);

-- Bersihkan data lama & isi ulang dengan 6 proyek resmi dari CV
TRUNCATE TABLE public.projects RESTART IDENTITY;

INSERT INTO public.projects (title, category, description, tags, features, github_url, live_url, figma_url, is_featured, order_index)
VALUES
(
    'Chatbot Adenomyosis dan Endometriosis - BRIN',
    'mobile',
    'Aplikasi chatbot untuk konsultasi dan edukasi seputar penyakit kewanitaan (adenomyosis dan endometriosis) yang dikembangkan bersama Badan Riset dan Inovasi Nasional (BRIN). Dibangun dengan alur percakapan dan materi edukasi terstruktur agar mudah dipahami pengguna.',
    ARRAY['React Native', 'JavaScript', 'Python', 'Django', 'Supabase', 'Qdrant', 'Figma'],
    ARRAY[
        'Peran: Front-End Developer & System Analyst (Juni 2026 - Sekarang)',
        'Integrasi Basis Data Vektor Qdrant & Supabase untuk retrieval informasi cerdas',
        'Backend layanan NLP dengan Django & Python',
        'Antarmuka mobile ramah pengguna berbasis React Native',
        'Alur percakapan konsultasi dan edukasi penyakit kewanitaan',
        'Tahap persiapan finalisasi dan deployment'
    ],
    '#',
    '#',
    '#',
    true,
    1
),
(
    'Migrasi Sistem Informasi Akademik Berbasis Web - Politeknik Astra',
    'web',
    'Melakukan migrasi dan mengembangkan ulang website Sistem Informasi Akademik (SIA) versi legacy menjadi arsitektur modern menggunakan Next.js dan ASP.NET 8.0, mencakup pembaruan struktur kode serta database.',
    ARRAY['Next.js', 'ASP.NET 8.0', 'C#', 'JavaScript', 'SQL Server', 'GitLab', 'Figma'],
    ARRAY[
        'Peran: Full-stack Developer (September 2025 - Mei 2026)',
        'Migrasi antarmuka legacy ke framework modern Next.js',
        'Pengembangan backend performa tinggi dengan ASP.NET 8.0 & C#',
        'Pembaruan struktur database dan optimasi relasi di SQL Server',
        'Kolaborasi tim versioning control melalui GitLab'
    ],
    '#',
    '#',
    '#',
    true,
    2
),
(
    'Booking Motor - Politeknik Astra',
    'web',
    'Mengembangkan fungsi sistem Booking motor untuk proyek migrasi PT Astra Honda Motor (AHM) dengan keandalan backend dan integrasi database teruji.',
    ARRAY['Java', 'Oracle SQL Developer', 'NetBeans', 'Postman', 'SonarQube'],
    ARRAY[
        'Peran: Back-End Developer & Front-End Developer (Juli 2026 - Agustus 2026)',
        'Pengembangan REST API fungsi booking motor untuk proyek migrasi AHM',
        'Perancangan query dan manajemen skema Oracle SQL Developer',
        'Pengujian otomatis dan validasi endpoint menggunakan Postman',
        'Pengecekan kualitas kode dan keamanan dengan SonarQube'
    ],
    '#',
    '#',
    '#',
    false,
    3
),
(
    'Manajemen Asset - Politeknik Astra',
    'web',
    'Membangun website sistem inventaris dan manajemen aset menggunakan PHP dan database MySQL. Dilengkapi fitur maintenance aset berkala dan pencatatan riwayat kerusakan barang.',
    ARRAY['PHP', 'MySQL', 'Figma', 'Draw.io'],
    ARRAY[
        'Peran: Full-stack Developer, UI/UX Designer & System Analyst (Oktober 2025 - Februari 2026)',
        'Fitur pelaporan maintenance barang yang membutuhkan perbaikan',
        'Manajemen inventaris aset kampus secara tersentralisasi',
        'Perancangan alur sistem dan diagram data flow menggunakan Draw.io',
        'Perancangan desain antarmuka interaktif menggunakan Figma'
    ],
    '#',
    '#',
    '#',
    false,
    4
),
(
    'Aplikasi Desktop Karaoke Poprock - Politeknik Astra',
    'desktop',
    'Membangun dua aplikasi desktop pengelolaan karaoke menggunakan Java dan C# yang terintegrasi dengan SQL Server. Mencakup modul manajemen operasional dan transaksi kasir.',
    ARRAY['Java', 'JavaFX', 'C#', 'SQL Server'],
    ARRAY[
        'Peran: Fullstack Developer, UI/UX Designer & System Analyst (Mei 2025 - Juli 2026)',
        'Modul manajemen paket, staf, ruangan, reservasi jam, dan menu karaoke',
        'Modul kasir & transaksi penjualan ruangan karaoke, paket, dan makanan',
        'Integrasi dua aplikasi berbeda (Java & C#) ke satu basis data SQL Server',
        'Sistem pelaporan transaksi otomatis'
    ],
    '#',
    '#',
    '#',
    false,
    5
),
(
    'Aplikasi Desktop Booking Hotel - Politeknik Astra',
    'desktop',
    'Membangun aplikasi desktop booking hotel berbasis bahasa pemrograman C dengan struktur data efisien, mencakup modul reservasi, keanggotaan, dan transaksi denda.',
    ARRAY['C', 'Draw.io', 'Data Structures'],
    ARRAY[
        'Peran: Fullstack Developer, UI/UX Designer & System Analyst (Desember 2024 - Februari 2025)',
        'Manajemen data kamar, tipe kamar, customer, karyawan, dan paket member',
        'Transaksi reservasi booking kamar dan pembayaran sewa',
        'Fitur pendaftaran member dan kalkulasi denda keterlambatan',
        'Pemodelan arsitektur sistem berbasis Draw.io'
    ],
    '#',
    '#',
    '#',
    false,
    6
);

-- Konfigurasi Galeri Proyek & Foto Tim Resmi di Supabase Storage
UPDATE public.projects 
SET images = '[
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/chatbot-brin/1.png","caption":"Tampilan Antarmuka Chatbot Edukasi & Konsultasi BRIN"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/chatbot-brin/2.png","caption":"Alur Percakapan Medis & Pencarian Semantik Qdrant"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/chatbot-brin/tim.png","caption":"Dokumentasi Tim Pengembang Chatbot BRIN","team":true}
]'::jsonb
WHERE title ILIKE '%Chatbot%';

UPDATE public.projects 
SET images = '[
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/migrasi-sia/1.png","caption":"Tampilan Utama Sistem Informasi Akademik"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/migrasi-sia/2.png","caption":"Fitur & Antarmuka Modern Next.js"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/migrasi-sia/tim.png","caption":"Dokumentasi Tim Full-stack Pengembang Migrasi SIA","team":true}
]'::jsonb
WHERE title ILIKE '%Migrasi%';

UPDATE public.projects 
SET images = '[
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/booking-motor/tim.png","caption":"Dokumentasi tim pengerjaan proyek (Tampilan sistem bersifat kredensial/rahasia internal PT AHM)","team":true}
]'::jsonb
WHERE title ILIKE '%Booking Motor%';

UPDATE public.projects 
SET images = '[
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/manajemen-asset/1.png","caption":"Tampilan Utama Sistem Inventaris & Manajemen Asset"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/manajemen-asset/2.png","caption":"Fitur Pelaporan Maintenance & Riwayat Perbaikan"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/manajemen-asset/tim.png","caption":"Dokumentasi Tim Pengembang Sistem Manajemen Asset","team":true}
]'::jsonb
WHERE title ILIKE '%Manajemen Asset%';

UPDATE public.projects 
SET images = '[
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/karaoke-poprock/1.png","caption":"Antarmuka Aplikasi Desktop Manajemen & Kasir Karaoke Poprock"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/karaoke-poprock/2.png","caption":"Modul Reservasi Jam, Manajemen Paket & Ruangan"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/karaoke-poprock/tim.jpg","caption":"Dokumentasi Tim Pengembang Karaoke Poprock","team":true}
]'::jsonb
WHERE title ILIKE '%Karaoke%';

-- Booking Hotel TIDAK memiliki foto tim (sesuai spesifikasi pengerjaan)
UPDATE public.projects 
SET images = '[
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/booking-hotel/1.png","caption":"Antarmuka Sistem Reservasi Booking Hotel"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/booking-hotel/2.png","caption":"Modul Manajemen Kamar, Member & Denda Keterlambatan"}
]'::jsonb
WHERE title ILIKE '%Booking Hotel%';

-- Daftarkan tabel projects ke Supabase Realtime (Aman jika dijalankan berulang)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'projects'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
  END IF;
END $$;


-- ============================================================
-- 3. TABEL contact_messages (Penyimpanan Pesan Masuk Pengunjung)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Pengunjung website (anonim / publik) diizinkan mengirimkan pesan kontak
DROP POLICY IF EXISTS "Public can insert contact messages" ON public.contact_messages;
CREATE POLICY "Public can insert contact messages" 
    ON public.contact_messages FOR INSERT 
    WITH CHECK (true);

-- Hanya pemilik / admin yang dapat membaca isi pesan kontak
DROP POLICY IF EXISTS "Allow view contact messages" ON public.contact_messages;
CREATE POLICY "Allow view contact messages" 
    ON public.contact_messages FOR SELECT 
    USING (true);


-- ============================================================
-- 4. PENGATURAN SUPABASE STORAGE & AKSES PUBLIK
-- ============================================================
-- Pastikan bucket 'project-images' bersifat Public di menu Storage Supabase.
-- Kebijakan (Policy) agar publik dapat melihat & mengunduh berkas di bucket 'project-images':
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public Access Project Images'
  ) THEN
    CREATE POLICY "Public Access Project Images"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'project-images');
  END IF;
END $$;

-- Pembaruan data galeri gambar proyek (format .png / .jpg otomatis)
UPDATE public.projects 
SET images = '[
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/migrasi-sia/1.png","caption":"Tampilan Utama Sistem Informasi Akademik"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/migrasi-sia/2.png","caption":"Fitur & Antarmuka Modern Next.js"}
]'::jsonb
WHERE title ILIKE '%Migrasi Sistem Informasi Akademik%';

UPDATE public.projects 
SET images = '[
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/manajemen-asset/1.png","caption":"Tampilan Utama Sistem Inventaris & Manajemen Asset"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/manajemen-asset/2.png","caption":"Fitur Pelaporan Maintenance & Riwayat Perbaikan"}
]'::jsonb
WHERE title ILIKE '%Manajemen Asset%';

UPDATE public.projects 
SET images = '[
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/karaoke-poprock/1.png","caption":"Antarmuka Aplikasi Desktop Manajemen & Kasir Karaoke Poprock"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/karaoke-poprock/2.png","caption":"Modul Reservasi Jam, Manajemen Paket & Ruangan"}
]'::jsonb
WHERE title ILIKE '%Karaoke Poprock%';

UPDATE public.projects 
SET images = '[
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/booking-hotel/1.png","caption":"Antarmuka Sistem Reservasi Booking Hotel"},
  {"src":"https://dhmabndpzrzacjrtoank.supabase.co/storage/v1/object/public/project-images/projects/booking-hotel/2.png","caption":"Modul Manajemen Kamar, Member & Denda Keterlambatan"}
]'::jsonb
WHERE title ILIKE '%Booking Hotel%';


