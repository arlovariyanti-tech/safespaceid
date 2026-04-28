import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Quote, ChevronRight, Lightbulb, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/edukasi/$slug")({
  component: EdukasiDetail,
});

type Section = { heading?: string; text?: string; bullets?: string[] };

const order = [
  "apa-itu-bullying",
  "jenis-bullying",
  "penyebab-dampak",
  "tanda-korban",
  "cara-menghadapi",
  "cara-mencegah",
];

const materials: Record<
  string,
  {
    title: string;
    emoji: string;
    color: string;
    sections: Section[];
    keyMessage: string;
    example: string;
    quote: string;
  }
> = {
  "apa-itu-bullying": {
    title: "Apa itu Bullying?",
    emoji: "💭",
    color: "from-sky-100 to-blue-100",
    sections: [
      {
        text: "Bullying adalah tindakan menyakiti, merendahkan, mengintimidasi, atau mempermalukan seseorang secara sengaja dan berulang. Bullying bisa terjadi di sekolah, lingkungan pertemanan, rumah, bahkan di media sosial.",
      },
      {
        text: "Bullying bukan sekadar candaan jika membuat seseorang merasa takut, sedih, malu, atau kehilangan rasa percaya diri. Ketika satu pihak merasa tidak nyaman dan tidak bisa berkata tidak, itu sudah masuk ke ranah bullying.",
      },
      {
        heading: "Ketimpangan Kekuatan",
        text: "Bullying hampir selalu melibatkan ketimpangan kekuatan — pelaku merasa lebih kuat, lebih populer, atau punya pengaruh lebih besar dibanding korban. Karena itu, korban sering merasa sulit melawan atau bercerita.",
      },
      {
        heading: "Ciri Utama Bullying",
        bullets: [
          "Dilakukan dengan sengaja",
          "Terjadi berulang kali",
          "Ada ketimpangan kekuatan",
          "Membuat korban terluka secara fisik atau emosional",
        ],
      },
    ],
    keyMessage: "Jika candaan membuat seseorang terluka berulang kali, itu bukan candaan — itu bullying.",
    example:
      "Contoh: Ara sering dipanggil dengan nama ejekan soal berat badannya oleh sekelompok teman. Meski awalnya terlihat seperti bercanda, Ara mulai takut pergi ke sekolah. Ini adalah bullying verbal.",
    quote: "Jika candaan membuat seseorang terluka, itu bukan lagi candaan.",
  },
  "jenis-bullying": {
    title: "Jenis-jenis Bullying",
    emoji: "🔍",
    color: "from-emerald-100 to-teal-100",
    sections: [
      { text: "Bullying punya banyak wajah. Memahami jenisnya membuat kita lebih peka dan lebih cepat bertindak." },
      {
        heading: "1. Bullying Verbal",
        text: "Menghina, mengejek, memanggil dengan nama buruk, body shaming, mempermalukan dengan kata-kata. Tidak meninggalkan bekas fisik, tapi bisa melukai harga diri dalam waktu lama.",
      },
      {
        heading: "2. Bullying Fisik",
        text: "Memukul, menendang, mendorong, menjegal, merusak barang milik korban. Bentuk paling terlihat tapi bukan berarti paling menyakitkan.",
      },
      {
        heading: "3. Bullying Sosial",
        text: "Mengucilkan dari pergaulan, menyebarkan gosip, mempermalukan di depan umum, memanipulasi pertemanan agar korban merasa sendirian.",
      },
      {
        heading: "4. Cyberbullying",
        text: "Menghina lewat media sosial, komentar jahat, pesan ancaman, menyebarkan foto/video memalukan. Karena 24 jam online, korban merasa tidak bisa 'kabur'.",
      },
      {
        heading: "5. Bullying Seksual",
        text: "Komentar berbau seksual yang tidak diinginkan, sentuhan tidak pantas, atau menyebarkan rumor seksual tentang korban. Ini serius dan harus segera dilaporkan.",
      },
    ],
    keyMessage: "Bullying tidak hanya fisik. Kata-kata, pengucilan, dan jari yang mengetik di media sosial juga bisa melukai.",
    example:
      "Contoh cyberbullying: Rian dibuatkan akun palsu yang menyebarkan foto memalukan dirinya. Meskipun 'hanya di internet', luka yang dirasakan Rian sangat nyata.",
    quote: "Bullying tidak selalu terlihat, tetapi dampaknya selalu terasa.",
  },
  "penyebab-dampak": {
    title: "Penyebab & Dampak",
    emoji: "💔",
    color: "from-violet-100 to-indigo-100",
    sections: [
      {
        heading: "Kenapa Bullying Bisa Terjadi?",
        bullets: [
          "Kurangnya empati dan edukasi emosional",
          "Pernah jadi korban sebelumnya lalu melampiaskan",
          "Lingkungan keluarga yang keras atau mengabaikan",
          "Ingin terlihat kuat atau dominan di pergaulan",
          "Pengaruh pergaulan yang menormalkan perundungan",
          "Rasa iri atau tidak suka yang tidak dikelola",
        ],
      },
      {
        heading: "Dampak bagi Korban",
        bullets: [
          "Kehilangan rasa percaya diri",
          "Takut bersosialisasi dan ke sekolah",
          "Prestasi akademik menurun",
          "Cemas, depresi, atau trauma",
          "Sulit percaya pada orang lain",
          "Dalam kasus berat: menyakiti diri sendiri",
        ],
      },
      {
        heading: "Dampak bagi Pelaku",
        text: "Pelaku juga rugi. Mereka rentan kehilangan teman sejati, dijauhi, berkembang menjadi orang yang sulit beradaptasi, dan membawa kebiasaan menyakiti ke kehidupan dewasa.",
      },
    ],
    keyMessage: "Bullying merugikan semua pihak — korban, pelaku, dan saksi yang memilih diam.",
    example:
      "Contoh: Dina dulu ceria, aktif di kelas. Setelah berminggu-minggu dikucilkan, Dina berhenti bicara, nilai turun, dan tidak mau lagi masuk sekolah. Luka emosional bisa lebih dalam dari luka fisik.",
    quote: "Satu ejekan bisa meninggalkan luka yang bertahan bertahun-tahun.",
  },
  "tanda-korban": {
    title: "Tanda Korban Bullying",
    emoji: "🫂",
    color: "from-amber-100 to-orange-100",
    sections: [
      { text: "Korban bullying sering tidak berani bercerita. Kita perlu peka terhadap perubahan perilaku orang-orang di sekitar kita." },
      {
        heading: "Tanda Emosional",
        bullets: [
          "Tiba-tiba pendiam dan menarik diri",
          "Mudah menangis atau marah tanpa alasan jelas",
          "Terlihat cemas atau ketakutan",
          "Kehilangan semangat dan minat pada hobinya",
        ],
      },
      {
        heading: "Tanda Fisik",
        bullets: [
          "Memar atau luka yang tidak dijelaskan",
          "Barang-barang hilang atau rusak",
          "Sering sakit kepala atau sakit perut",
          "Pola tidur dan makan berubah",
        ],
      },
      {
        heading: "Tanda Sosial & Akademik",
        bullets: [
          "Enggan pergi ke sekolah",
          "Nilai tiba-tiba menurun",
          "Kehilangan teman dekat tanpa alasan",
          "Menghindari tempat atau orang tertentu",
        ],
      },
    ],
    keyMessage: "Perubahan perilaku kecil bisa jadi sinyal besar. Jangan pernah remehkan perasaan orang terdekatmu.",
    example:
      "Contoh: Adiknya Rafi tiba-tiba tidak mau masuk kelas matematika. Setelah ditanya dengan lembut, Rafi tahu adiknya sering diejek di kelas itu. Karena Rafi peka, adiknya bisa mendapat bantuan tepat waktu.",
    quote: "Kadang, orang yang paling butuh bantuan adalah mereka yang paling diam.",
  },
  "cara-menghadapi": {
    title: "Cara Menghadapi Bullying",
    emoji: "🛡️",
    color: "from-rose-100 to-pink-100",
    sections: [
      { text: "Kalau kamu atau temanmu mengalami bullying, ingat: kamu tidak sendirian dan kamu tidak salah." },
      {
        heading: "Untuk Diri Sendiri",
        bullets: [
          "Jangan menyalahkan diri sendiri — kamu tidak 'pantas' di-bully",
          "Tetap tenang, jangan balas dengan kekerasan",
          "Simpan bukti: screenshot pesan, foto, atau rekaman",
          "Cerita ke orang yang kamu percaya (orang tua, guru, BK, mentor)",
          "Hindari bertemu pelaku sendirian kalau memungkinkan",
          "Laporkan lewat fitur Report di aplikasi ini",
        ],
      },
      {
        heading: "Kalau Melihat Teman Di-bully",
        bullets: [
          "Jangan diam — diam adalah persetujuan",
          "Dukung korban: ajak bicara, duduk di sampingnya",
          "Jangan menertawakan bersama pelaku",
          "Bantu korban melapor kepada orang dewasa",
          "Rekam/simpan bukti jika aman",
        ],
      },
      {
        heading: "Jika Bullying Terjadi Online",
        bullets: [
          "Jangan balas komentar jahat",
          "Blokir dan laporkan akunnya",
          "Screenshot sebagai bukti",
          "Ceritakan ke orang dewasa yang kamu percaya",
        ],
      },
    ],
    keyMessage: "Meminta bantuan bukan tanda kelemahan — itu tanda keberanian.",
    example:
      "Contoh: Luna disindir terus di grup kelas. Dia screenshot semua pesan, cerita ke guru BK, dan guru BK memanggil pihak yang terlibat. Luna sekarang merasa lebih aman dan pelakunya mendapat pembinaan.",
    quote: "Kamu tidak harus menghadapi semuanya sendirian.",
  },
  "cara-mencegah": {
    title: "Cara Mencegah Bullying",
    emoji: "🌱",
    color: "from-cyan-100 to-sky-100",
    sections: [
      { text: "Mencegah bullying bukan tugas satu orang — tapi dari kebiasaan kecil kita semua setiap hari." },
      {
        heading: "Di Diri Sendiri",
        bullets: [
          "Bangun rasa percaya diri yang sehat",
          "Belajar berempati: coba lihat dari sudut pandang orang lain",
          "Jangan ikut tertawa saat teman diejek",
          "Berani berkata 'stop' saat melihat sesuatu yang salah",
        ],
      },
      {
        heading: "Di Pertemanan",
        bullets: [
          "Pilih teman yang menguatkan, bukan merendahkan",
          "Rayakan perbedaan: tampilan, minat, latar belakang",
          "Jadilah pendengar yang baik",
          "Ajak teman yang sering sendirian untuk bergabung",
        ],
      },
      {
        heading: "Di Sekolah & Komunitas",
        bullets: [
          "Dukung program anti-bullying di sekolah",
          "Laporkan kalau melihat perundungan",
          "Ciptakan ruang di mana semua merasa diterima",
          "Bersuara di media sosial — konten baik juga menular",
        ],
      },
    ],
    keyMessage: "Perubahan besar dimulai dari satu orang yang memilih untuk bersikap baik hari ini.",
    example:
      "Contoh: Di kelas Andi, semua sepakat membuat aturan 'No Ejek Day' — satu hari tanpa panggilan ejekan. Kebiasaan itu akhirnya berlanjut setiap hari dan suasana kelas berubah jauh lebih hangat.",
    quote: "Stop bullying dimulai dari diri sendiri.",
  },
};

function EdukasiDetail() {
  const { slug } = Route.useParams();
  const data = materials[slug];
  const idx = order.indexOf(slug);
  const total = order.length;

  if (!data || idx < 0) {
    return (
      <div>
        <PageHeader
          title="Tidak Ditemukan"
          back={
            <Link to="/edukasi" className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          }
        />
        <div className="p-5">
          <Link to="/edukasi">
            <Button variant="hero" size="xl" className="w-full">Kembali ke Edukasi</Button>
          </Link>
        </div>
      </div>
    );
  }

  const prev = idx > 0 ? order[idx - 1] : null;
  const next = idx < total - 1 ? order[idx + 1] : null;
  const nextTitle = next ? materials[next].title : null;
  const progress = ((idx + 1) / total) * 100;

  return (
    <div>
      <PageHeader
        title="Materi Edukasi"
        back={
          <Link to="/edukasi" className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        }
      />
      <div className="p-5 space-y-5">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Materi {idx + 1} dari {total}
            </span>
            <span className="text-[11px] font-semibold text-primary">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-[image:var(--gradient-primary)] rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Header */}
        <div className={`p-6 rounded-3xl bg-gradient-to-br ${data.color} border border-white/60`}>
          <div className="text-5xl mb-2">{data.emoji}</div>
          <h1 className="text-2xl font-bold leading-tight">{data.title}</h1>
        </div>

        {/* Body */}
        <article className="space-y-5">
          {data.sections.map((s, i) => (
            <div key={i} className="space-y-2">
              {s.heading && <h2 className="font-bold text-base">{s.heading}</h2>}
              {s.text && <p className="text-[15px] leading-relaxed text-foreground/85">{s.text}</p>}
              {s.bullets && (
                <ul className="space-y-2 pl-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-[15px] leading-relaxed text-foreground/85">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </article>

        {/* Key message */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-amber-700" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Pesan Utama</p>
          </div>
          <p className="text-sm font-semibold leading-snug">{data.keyMessage}</p>
        </div>

        {/* Example */}
        <div className="p-5 rounded-2xl bg-card border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Contoh Sederhana</p>
          </div>
          <p className="text-sm leading-relaxed text-foreground/85 italic">{data.example}</p>
        </div>

        {/* Quote */}
        <div className="p-5 rounded-2xl bg-foreground text-background">
          <Quote className="h-5 w-5 mb-2 opacity-70" />
          <p className="text-base font-semibold leading-snug">"{data.quote}"</p>
        </div>

        {/* Nav buttons */}
        <div className="flex gap-2 pt-2">
          {prev ? (
            <Link to="/edukasi/$slug" params={{ slug: prev }} className="flex-1">
              <Button variant="outlineHero" size="lg" className="w-full">
                <ArrowLeft className="h-4 w-4" /> Kembali
              </Button>
            </Link>
          ) : (
            <Link to="/edukasi" className="flex-1">
              <Button variant="outlineHero" size="lg" className="w-full">
                <ArrowLeft className="h-4 w-4" /> Daftar Materi
              </Button>
            </Link>
          )}
          {next ? (
            <Link to="/edukasi/$slug" params={{ slug: next }} className="flex-1">
              <Button variant="hero" size="lg" className="w-full">
                Lanjut <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <Link to="/quiz" className="flex-1">
              <Button variant="hero" size="lg" className="w-full">
                Uji Pemahaman <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
        {nextTitle && next && (
          <p className="text-center text-[11px] text-muted-foreground">
            Berikutnya: <span className="font-semibold text-foreground/70">{nextTitle}</span>
          </p>
        )}
      </div>
    </div>
  );
}
