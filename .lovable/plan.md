# Plan: Rebrand ke "SafeSpace" + Major Feature Update

Permintaan ini besar sekali (8 area, banyak menyentuh DB + UI). Saya usulkan dipecah jadi **3 batch** supaya bisa direview tiap tahap, tidak menghancurkan fitur yang sudah jalan, dan kredit tidak boros di satu loop.

---

## Batch 1 — Rebranding + Profile (cepat, low risk)

**Rebranding "Anti-Bully" → "SafeSpace"**
- `public/manifest.webmanifest`: name, short_name, description, tagline
- `src/routes/__root.tsx`: title, meta (og/twitter), apple-mobile-web-app-title, application-name
- Semua copy UI yang mention "No More Bully" / "Anti-Bully" → "SafeSpace"
- Tagline baru: *"SafeSpace — Bangun Ruang Aman dan Karakter Positif di Sekolahmu"*
- Login/Register/Onboarding/Home header text update
- Logo text-based (belum ada logo image), jadi cukup ganti teks

**Profile fixes (poin 5–8)**
- Pastikan tombol "Edit Profil" di `profile.tsx` benar-benar terhubung ke `profile.edit.tsx` (route sudah ada dari batch sebelumnya, cek apakah link-nya broken)
- Tampilkan di profil utama: avatar, username, display_name, sekolah (dari `school_code` join `schools.display_name`), badges/points
- Edit form: avatar upload dengan validasi ukuran (<2MB), display_name, username, bio
- Loading state + toast feedback
- Konsisten dengan palet SafeSpace baru

---

## Batch 2 — School Hub Privat + Moderation + Laporan Anonim

**Ruang privat per sekolah**
- Tambah kolom `school_code` di `community_posts` (auto-fill dari profile saat post)
- Update RLS: SELECT `community_posts` hanya jika `school_code` = profile user atau post tanpa school_code (global, opsional)
- UI community: filter otomatis post sekolah sendiri, tab "Sekolahku" vs "Semua"

**Auto-moderation filter**
- Daftar kata terlarang (server-side, di server function)
- Saat insert post/comment, lewat server function `create_post` / `create_comment` yang sanitize/sensor kata kasar (replace dengan ***)
- Reject post yang full kata kasar

**Laporan anonim terenkripsi**
- Tabel baru `anonymous_reports`: id, school_code, category (bullying/safety/mental/lain), message (text), severity, status (new/in_review/resolved), created_at
- Submitter tidak tersimpan (benar-benar anonim, hanya `school_code` dari client saat submit — server validate via auth user's school)
- RLS: INSERT siapa saja yang login & punya school_code; SELECT hanya counselor role di sekolah yang sama
- Tambah role baru `counselor` di enum `app_role`
- Halaman `/report` untuk siswa kirim laporan

---

## Batch 3 — Gamifikasi + Counselor Dashboard

**Daily Mood Check-in**
- Tabel `mood_checkins`: user_id, date (unique per user/day), mood (emoji enum: happy/calm/sad/angry/anxious), note opsional
- Widget di home: 5 emoji, 1x per hari, animasi konfirmasi
- RLS: user own only

**Weekly Kindness Mission**
- Tabel `kindness_missions` (seed mingguan oleh admin) + `mission_completions` (user_id, mission_id, completed_at)
- Halaman `/missions`
- Selesai → tambah ke saldo poin

**Badges & Points System**
- Tabel `user_badges`: user_id, badge_code (kindness_warrior, duta_aman, dll), earned_at
- Logic award: setelah X mission complete / X challenge complete
- Tampil di profile

**Counselor Dashboard `/counselor`**
- Akses hanya role `counselor` (atau `admin`)
- Grafik mood agregat sekolah (line chart 7/30 hari, anonim, pakai `recharts`)
- List anonymous_reports sekolah, filter by status
- Action: mark in_review / resolved (tanpa membalas — benar-benar anonim)

---

## Teknis / Catatan

- Semua migration via `supabase--migration` (RLS strict per sekolah)
- Auto-moderation list: simpan kata di constant TypeScript di server function untuk kemudahan update
- Encrypted di laporan = tanpa link ke user_id di DB (anonymity by design); tidak pakai crypto-encryption beneran karena BK harus bisa baca plaintext
- Recharts sudah tersedia di project
- Design tokens SafeSpace: pertahankan palet calm existing (indigo lembut #a5b4fc), tambah accent mint/sage untuk "safe"

---

## Pertanyaan untuk dikonfirmasi

1. **Mulai dari Batch 1 (rebrand + profile) dulu?** Atau langsung gas semua 3 batch sekaligus (jauh lebih boros kredit & risk regression tinggi)?
2. **Counselor**: role baru terpisah (`counselor`) atau cukup pakai `admin` per-sekolah?
3. **Forum "Sekolahku"**: post lama (tanpa school_code) ditampilkan di mana — global tab, atau di-migrate ke school pembuatnya?

Saya rekomendasikan: **mulai Batch 1**, lalu lanjut Batch 2 & 3 di message berikutnya setelah review.