# Upgrade Sistem School Community SafeSpace

Fitur besar — saya pecah ke 3 batch supaya aman, mudah di-review, dan tidak boros credit.

---

## BATCH A — Database & Sistem Kelas (Fondasi)

### Tabel baru
- **`classes`** — `id`, `school_code`, `name` (1A, XI IPA 1, dst), `code` (auto-generated unik, format `<NAMA>-<4CHAR>`), `created_by` (walas user_id), `created_at`
- **`class_members`** — `id`, `class_id`, `user_id`, `role` (`student` / `homeroom`), `joined_at`, UNIQUE(class_id, user_id), 1 user hanya bisa di 1 kelas per sekolah
- **`class_posts`** — postingan khusus ruang kelas (`class_id`, `user_id`, `content`, `is_anonymous`, `mood`, `created_at`)
- **`class_supports`** — support counter per post kelas
- **`class_challenges`** — challenge yang dibuat walas (`class_id`, `title`, `description`, `total_days`, `created_at`)
- **`homeroom_codes`** — kode verifikasi walas per sekolah (admin generate), `school_code`, `code`, `used_by`, `used_at`

### RPC functions
- `create_class(_name)` → khusus walas terverifikasi, return kode kelas
- `join_class(_code)` → siswa join kelas via kode (validate user's school = class school)
- `verify_homeroom(_code)` → tukar homeroom_code dengan role `homeroom` di user_roles atau flag di class_members
- `reset_class_code(_class_id)` → walas regenerate kode kelas

### RLS
- `class_posts`: SELECT/INSERT hanya member kelas
- `class_members`: SELECT member kelas yg sama atau walas
- `homeroom_codes`: hanya admin SELECT, walas INSERT-validate via RPC

### Fix challenge_progress
- Tambah constraint: `current_day` hanya bisa naik max +1 per hari, dan hanya jika `last_checked_date < today`
- Update RPC `check_in_challenge` server-side biar progress nyata (bukan client-side)

---

## BATCH B — UI Flow Join Sekolah & Kelas

### Halaman baru
- **`/school/join`** — wizard 3 step:
  1. Input kode sekolah (validate ke DB)
  2. Pilih role: 👨‍🎓 Siswa / 👩‍🏫 Wali Kelas (card aesthetic)
  3a. Siswa → input kode kelas → masuk ruang kelas
  3b. Walas → input kode verifikasi walas → buat kelas baru (nama kelas) → dapat kode kelas
- **`/class`** — ruang kelas: feed post kelas, support counter, challenge mingguan, mood kelas anonim, jumlah siswa aktif
- **`/class/manage`** — dashboard walas: stats siswa aktif, progress challenge, buat challenge, reset kode, approve siswa

### Update existing
- `school.tsx` — entry point gabung sekolah → redirect ke `/school/join`
- `profile.tsx` — tampilkan kelas user (badge "XI IPA 1 · SMAN 6 Mandau")
- `home.tsx` — quick access ke ruang kelas

---

## BATCH C — Challenge Progress Nyata + Leaderboard

### Challenge upgrade
- `challenge.tsx` — progress bar nyata berbasis `current_day/total_days`
- Streak harian (consecutive check-ins)
- Badge: 7-day, 30-day, 100-day
- Tombol "Check-in Hari Ini" disabled jika sudah check-in hari itu

### Leaderboard
- **`/leaderboard`** — tab Ranking Kelas (dalam sekolah) & Ranking Sekolah (global)
- Skoring: challenge selesai (10pt) + support dikirim (1pt) + post positif (2pt)
- View aggregat (server-side compute via RPC)

---

## Teknis
- Semua tabel pakai RLS ketat (school_code + class_id scoping)
- Auto-generate kode kelas: `<NAMA_CLEAN>-<4_CHAR_RANDOM>` (mis. `XIIPA1-A92K`)
- Walas verification: admin generate batch `homeroom_codes` via panel admin
- Design: rounded-3xl card, pastel gradient, smooth framer-motion transitions, Google Classroom + Discord + wellness vibe
- Mobile-first, tetap konsisten dengan SafeSpace tokens

---

## Pertanyaan sebelum mulai

1. **Mulai dari Batch A dulu** (DB + RPC), lalu B, lalu C? Atau langsung semua (lebih boros credit, risk lebih tinggi)?
2. **Homeroom code**: siapa yang generate? (a) Admin SafeSpace generate manual per sekolah, atau (b) admin sekolah pertama yang submit jadi otomatis dapat 5 kode walas?
3. **1 user = 1 kelas**: konfirmasi user tidak bisa pindah kelas sembarangan (harus minta walas reset / leave dulu)?
4. **Leaderboard**: tampilkan nama display_name atau anonim (hanya inisial) untuk privacy?
