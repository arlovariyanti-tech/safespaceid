import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { FileText, Brain, ChevronRight, Sparkles, Flame } from "lucide-react";

export const Route = createFileRoute("/_app/edukasi")({
  component: Edukasi,
});

const categories = [
  { slug: "apa-itu-bullying", title: "Apa itu Bullying?", desc: "Pengertian & definisi dasar", color: "bg-sky-100" },
  { slug: "jenis-bullying", title: "Jenis-jenis Bullying", desc: "Verbal, fisik, sosial, cyber", color: "bg-emerald-100" },
  { slug: "penyebab-dampak", title: "Penyebab & Dampak", desc: "Kenapa terjadi & efeknya", color: "bg-violet-100" },
  { slug: "tanda-korban", title: "Tanda Korban Bullying", desc: "Kenali gejala & sinyal", color: "bg-amber-100" },
  { slug: "cara-menghadapi", title: "Cara Menghadapi", desc: "Strategi & langkah aman", color: "bg-rose-100" },
  { slug: "cara-mencegah", title: "Cara Mencegah", desc: "Bangun lingkungan sehat", color: "bg-cyan-100" },
];

function Edukasi() {
  return (
    <div>
      <PageHeader title="Edukasi" subtitle="Pahami bullying agar bisa melawannya." />
      <div className="px-5 py-5 space-y-7">
        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Materi</h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/edukasi/$slug"
                params={{ slug: c.slug }}
                className={`text-left p-4 rounded-2xl ${c.color} hover:scale-[1.02] transition block`}
              >
                <FileText className="h-5 w-5 text-foreground/70 mb-3" />
                <p className="font-semibold text-sm leading-tight">{c.title}</p>
                <p className="text-[11px] text-foreground/60 mt-1">{c.desc}</p>
                <div className="flex items-center text-[11px] font-semibold text-foreground/70 mt-2">
                  Baca <ChevronRight className="h-3 w-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <Link
          to="/quiz"
          className="block p-5 rounded-3xl bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 border border-amber-200/60"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="h-11 w-11 rounded-2xl bg-foreground text-background flex items-center justify-center">
              <Brain className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-orange-700 bg-white/70 px-2 py-1 rounded-full">
              <Flame className="h-3 w-3" /> 5 Hari Streak
            </div>
          </div>
          <h3 className="font-bold text-lg mt-2">Kuis Harian</h3>
          <p className="text-xs text-foreground/70 mb-3">
            Uji pemahamanmu tentang bullying setiap hari dalam 5 pertanyaan interaktif.
          </p>
          <span className="inline-flex items-center gap-1 px-4 h-9 rounded-full bg-foreground text-background text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" /> Mulai Kuis Hari Ini
          </span>
        </Link>
      </div>
    </div>
  );
}
