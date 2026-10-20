# Gambar Proyek (Supabase Storage)

Gambar proyek disimpan di **Supabase Storage**, bukan di folder lokal.

- Bucket: `project-images` (bucket yang sama dengan CV, harus **Public**)
- Path: `projects/<folder-proyek>/<file>`

Maksimal **3 gambar** per proyek (format didukung: `.png`, `.jpg`, `.jpeg`, `.webp`):

| File (contoh) | Isi |
|---|---|
| `1.png` atau `1.jpg` | Tampilan utama proyek (menjadi cover kartu) |
| `2.png` atau `2.jpg` | Fitur / antarmuka proyek |
| `tim.png` atau `tim.jpg` | Foto dokumentasi tim (diberi badge "Foto Tim") |

Folder proyek di bucket `project-images`:

- `projects/chatbot-brin/`
- `projects/migrasi-sia/`
- `projects/booking-motor/` *(Proyek Kredensial / NDA AHM: **hanya unggah 1 foto `tim.png` / `tim.jpg`**, tidak perlu `1` atau `2`)*
- `projects/manajemen-asset/`
- `projects/karaoke-poprock/`
- `projects/booking-hotel/`

> **Catatan Kredensial (Booking Motor):**
> Proyek migrasi PT Astra Honda Motor (AHM) bersifat rahasia perusahaan (kredensial / NDA). Tampilan sistem antarmuka tidak dipublikasikan ke portofolio. Website secara otomatis hanya memuat 1 foto tim (`tim.png` atau `tim.jpg`).

Website sekarang dilengkapi **Smart Multi-Extension Fallback**:
Sistem otomatis memeriksa file `.png`, `.jpg`, `.jpeg`, hingga `.webp`. Jika gambar berformat `.png` atau `.jpg` diunggah ke storage, website akan otomatis memuatnya tanpa perlu konfigurasi manual!
