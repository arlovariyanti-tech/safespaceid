import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowDown, Brain, Sparkles, Quote, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_app/edukasi")({
  component: Edukasi,
});

type Materi = {
  slug: string;
  no: number;
  emoji: string;
  color: string;
  title: string;
  intro: string;
  body: { heading?: string; text: string }[];
  pesan: string;
};

const MATERI: Materi[] = [
  {
    slug: "m1",
    no: 1,
    emoji: "💭",
    color: "bg-sky-50 border-sky-100",
    title: "Apa itu Bullying?",
    intro:
      "Bullying adalah tindakan menyakiti, merendahkan, mengintimidasi, atau mempermalukan seseorang secara sengaja dan berulang.",
    body: [
      {
        text: "Bullying bisa terjadi di sekolah, lingkungan pertemanan, rumah, tempat bermain, bahkan di media sosial.",
      },
      {
        text: "Bullying bukan sekadar candaan jika membuat seseorang merasa takut, sedih, malu, kehilangan rasa percaya diri, atau merasa tidak aman.",
      },
      {
        text: "Biasanya bullying terjadi karena ada ketimpangan kekuatan, di mana pelaku merasa lebih kuat, lebih dominan, atau lebih berkuasa dibanding korban. Karena itu, korban sering merasa sulit melawan dan memilih diam.",
      },
      {
        heading: "Contoh sederhana",
        text: "Jika seseorang terus-menerus diejek karena penampilan, bentuk tubuh, cara bicara, atau latar belakangnya, itu bukan candaan biasa — itu bullying.",
      },
    ],
    pesan: "Jika candaan membuat seseorang terluka, itu bukan lagi candaan.",
  },
  {
    slug: "m2",
    no: 2,
    emoji: "🔍",
    color: "bg-emerald-50 border-emerald-100",
    title: "Jenis-jenis Bullying",
    intro: "Bullying memiliki beberapa bentuk utama yang perlu kita kenali:",
    body: [
      {
        heading: "Bullying Verbal",
        text: "Menghina, mengejek, memanggil dengan nama buruk, body shaming, atau mempermalukan lewat kata-kata.",
      },
      {
        heading: "Bullying Fisik",
        text: "Memukul, menendang, mendorong, menjambak, merusak barang, atau bentuk kekerasan fisik lainnya.",
      },
      {
        heading: "Bullying Sosial",
        text: "Mengucilkan seseorang dari pergaulan, menyebarkan gosip, mempermalukan di depan umum, atau memanipulasi hubungan sosial.",
      },
      {
        heading: "Cyberbullying",
        text: "Menghina lewat media sosial, komentar jahat, pesan ancaman, atau penyebaran foto/video yang mempermalukan korban.",
      },
    ],
    pesan: "Bullying tidak selalu terlihat, tetapi dampaknya selalu terasa.",
  },
  {
    slug: "m3",
    no: 3,
    emoji: "💔",
    color: "bg-violet-50 border-violet-100",
    title: "Penyebab & Dampak",
    intro: "Bullying bisa terjadi karena banyak faktor:",
    body: [
      {
        heading: "Penyebab Umum",
        text: "• Kurangnya empati\n• Lingkungan keluarga yang keras\n• Ingin terlihat kuat\n• Pengaruh pergaulan buruk\n• Rasa iri\n• Ingin diterima kelompok\n• Pernah menjadi korban sebelumnya",
      },
      {
        heading: "Dampak bagi Korban",
        text: "• Kehilangan rasa percaya diri\n• Takut bersosialisasi\n• Prestasi menurun\n• Cemas berlebihan\n• Merasa sendirian\n• Trauma emosional\n• Sulit percaya pada orang lain",
      },
      {
        text: "Bullying bisa meninggalkan luka yang tidak terlihat tetapi bertahan lama.",
      },
    ],
    pesan: "Satu ejekan bisa meninggalkan luka yang bertahan bertahun-tahun.",
  },
  {
    slug: "m4",
    no: 4,
    emoji: "🫂",
    color: "bg-amber-50 border-amber-100",
    title: "Tanda Korban Bullying",
    intro: "Beberapa tanda seseorang mungkin sedang mengalami bullying:",
    body: [
      {
        text: "• Tiba-tiba menjadi pendiam\n• Sering terlihat sedih\n• Takut pergi ke sekolah\n• Prestasi menurun\n• Menarik diri dari pergaulan\n• Kehilangan semangat\n• Mudah cemas\n• Tidak percaya diri\n• Menghindari orang tertentu",
      },
      {
        text: "Kadang korban tidak langsung bercerita. Karena itu, penting untuk lebih peka terhadap perubahan perilaku orang di sekitar kita.",
      },
    ],
    pesan: "Kadang, orang yang paling butuh bantuan adalah mereka yang paling diam.",
  },
  {
    slug: "m5",
    no: 5,
    emoji: "🛡️",
    color: "bg-rose-50 border-rose-100",
    title: "Cara Menghadapi Bullying",
    intro: "Jika kamu mengalami bullying, kamu bisa melakukan langkah-langkah ini:",
    body: [
      {
        text: "• Jangan menyalahkan diri sendiri\n• Tetap tenang\n• Jangan membalas dengan kekerasan\n• Simpan bukti jika bullying online\n• Ceritakan kepada orang terpercaya\n• Hindari situasi berbahaya\n• Laporkan kepada pihak sekolah atau orang dewasa",
      },
      {
        text: "Meminta bantuan bukan tanda kelemahan, tetapi bentuk keberanian.",
      },
    ],
    pesan: "Kamu tidak harus menghadapi semuanya sendirian.",
  },
  {
    slug: "m6",
    no: 6,
    emoji: "🌱",
    color: "bg-cyan-50 border-cyan-100",
    title: "Cara Mencegah Bullying",
    intro: "Bullying bisa dicegah dengan membangun lingkungan sehat:",
    body: [
      {
        text: "• Menghargai perbedaan\n• Tidak ikut mengejek\n• Tidak menertawakan orang lain\n• Berani berkata tidak pada bullying\n• Memilih pertemanan positif\n• Membangun rasa percaya diri\n• Menjadi teman yang suportif\n• Melapor jika melihat bullying",
      },
      {
        text: "Perubahan dimulai dari kebiasaan kecil seperti memilih untuk bersikap baik.",
      },
    ],
    pesan: "Stop bullying dimulai dari diri sendiri.",
  },
];

function Edukasi() {
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [readCount, setReadCount] = useState(0);
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = Number((entry.target as HTMLElement).dataset.idx);
          if (entry.isIntersecting) {
            setActiveIdx(idx);
            setReadCount((prev) => Math.max(prev, idx + 1));
          }
        });
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: 0 },
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToIdx = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const nextIdx = Math.min(activeIdx + 1, MATERI.length - 1);
  const progressPct = Math.round((readCount / MATERI.length) * 100);

  return (
    <div className="pb-28">
      <PageHeader title="Edukasi" subtitle="Pahami bullying agar bisa melawannya." />

      {/* Progress bar */}
      <div className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border/50 px-5 py-3">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="flex items-center gap-1 font-semibold text-foreground/70">
            <BookOpen className="h-3 w-3" /> Progress Membaca
          </span>
          <span className="font-bold text-primary">
            {readCount} / {MATERI.length} materi
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Mini TOC */}
      <div className="px-5 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {MATERI.map((m, i) => (
            <button
              key={m.slug}
              onClick={() => scrollToIdx(i)}
              className={`shrink-0 flex items-center gap-1.5 px-3 h-8 rounded-full text-[11px] font-semibold border transition ${
                activeIdx === i
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground/70 border-border hover:bg-muted"
              }`}
            >
              <span>{m.emoji}</span>
              <span>Materi {m.no}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hero intro */}
      <div className="px-5 pt-3 pb-2">
        <div className="rounded-3xl p-5 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10">
          <p className="text-[11px] font-bold uppercase tracking-wider text-primary mb-1">
            Mini E-Book
          </p>
          <h2 className="text-xl font-bold leading-tight mb-1.5">
            6 Materi untuk Memahami Bullying
          </h2>
          <p className="text-xs text-foreground/70 leading-relaxed">
            Scroll ke bawah untuk membaca semua materi. Tidak perlu klik apa pun — semua sudah terbuka di sini.
          </p>
        </div>
      </div>

      {/* Materi Sections */}
      <div className="px-5 pt-4 space-y-10">
        {MATERI.map((m, i) => (
          <section
            key={m.slug}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            data-idx={i}
            id={`materi-${m.no}`}
            className="scroll-mt-24"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`h-12 w-12 rounded-2xl ${m.color} border flex items-center justify-center text-2xl shrink-0`}
              >
                {m.emoji}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Materi {m.no} dari 6
                </p>
                <h3 className="text-xl font-bold leading-tight">{m.title}</h3>
              </div>
            </div>

            {/* Intro paragraph */}
            <p className="text-[15px] leading-relaxed text-foreground/85 mb-4 first-letter:text-2xl first-letter:font-bold first-letter:mr-0.5">
              {m.intro}
            </p>

            {/* Body */}
            <div className="space-y-4">
              {m.body.map((b, bi) => (
                <div key={bi}>
                  {b.heading && (
                    <h4 className="font-semibold text-sm text-foreground mb-1.5 flex items-center gap-1.5">
                      <span className="h-1 w-4 rounded-full bg-primary inline-block" />
                      {b.heading}
                    </h4>
                  )}
                  <p className="text-sm leading-relaxed text-foreground/75 whitespace-pre-line">
                    {b.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Pesan utama */}
            <div className="mt-5 rounded-2xl p-4 bg-foreground text-background relative overflow-hidden">
              <Quote className="absolute -top-2 -right-2 h-16 w-16 opacity-10" />
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">
                Pesan Utama
              </p>
              <p className="text-base font-semibold leading-snug italic">
                “{m.pesan}”
              </p>
            </div>

            {/* Inline next button */}
            {i < MATERI.length - 1 && (
              <button
                onClick={() => scrollToIdx(i + 1)}
                className="w-full mt-4 flex items-center justify-between px-4 h-12 rounded-2xl bg-muted hover:bg-muted/70 transition text-left"
              >
                <span className="text-xs">
                  <span className="text-muted-foreground">Lanjut ke </span>
                  <span className="font-semibold">Materi {i + 2}: {MATERI[i + 1].title}</span>
                </span>
                <ArrowDown className="h-4 w-4 shrink-0" />
              </button>
            )}
          </section>
        ))}

        {/* Closing CTA — Quiz */}
        <Link
          to="/quiz"
          className="block p-5 rounded-3xl bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 border border-amber-200/60"
        >
          <div className="h-11 w-11 rounded-2xl bg-foreground text-background flex items-center justify-center mb-3">
            <Brain className="h-5 w-5" />
          </div>
          <h3 className="font-bold text-lg">Sudah selesai membaca?</h3>
          <p className="text-xs text-foreground/70 mb-3">
            Uji pemahamanmu lewat Kuis Harian — 5 pertanyaan singkat untuk menguatkan ingatanmu.
          </p>
          <span className="inline-flex items-center gap-1 px-4 h-9 rounded-full bg-foreground text-background text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Mulai Kuis
          </span>
        </Link>
      </div>

      {/* Floating quick actions */}
      <div className="fixed bottom-24 right-4 z-30 flex flex-col gap-2">
        {activeIdx < MATERI.length - 1 && (
          <button
            onClick={() => scrollToIdx(nextIdx)}
            className="h-11 px-4 rounded-full bg-foreground text-background shadow-lg flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowDown className="h-4 w-4" /> Materi {nextIdx + 1}
          </button>
        )}
        <button
          onClick={scrollTop}
          className="h-11 w-11 rounded-full bg-background border border-border shadow-lg flex items-center justify-center"
          aria-label="Ke atas"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
