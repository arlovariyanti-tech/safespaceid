import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { Play, FileText, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_app/edukasi")({
  component: Edukasi,
});

const categories = [
  { title: "Apa itu Bullying?", desc: "Pengertian & definisi dasar", color: "bg-sky-100" },
  { title: "Jenis-jenis Bullying", desc: "Verbal, fisik, sosial, cyber", color: "bg-emerald-100" },
  { title: "Penyebab & Dampak", desc: "Kenapa terjadi & efeknya", color: "bg-violet-100" },
  { title: "Tanda Korban Bullying", desc: "Kenali gejala & sinyal", color: "bg-amber-100" },
  { title: "Cara Menghadapi", desc: "Strategi & langkah aman", color: "bg-rose-100" },
  { title: "Cara Mencegah", desc: "Bangun lingkungan sehat", color: "bg-cyan-100" },
];

const videos = [
  { title: "Stop Bullying di Sekolah", duration: "3:24" },
  { title: "Speak Up: Cerita Korban", duration: "5:10" },
  { title: "Cyberbullying & Cara Lawan", duration: "4:02" },
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
              <button key={c.title} className={`text-left p-4 rounded-2xl ${c.color} hover:scale-[1.02] transition`}>
                <FileText className="h-5 w-5 text-foreground/70 mb-3" />
                <p className="font-semibold text-sm leading-tight">{c.title}</p>
                <p className="text-[11px] text-foreground/60 mt-1">{c.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Video Edukasi</h2>
          <div className="space-y-3">
            {videos.map((v) => (
              <button key={v.title} className="w-full flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/60">
                <div className="h-14 w-20 rounded-xl bg-[image:var(--gradient-primary)] flex items-center justify-center shrink-0">
                  <Play className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-sm">{v.title}</p>
                  <p className="text-xs text-muted-foreground">{v.duration}</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>

        <section className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60">
          <h3 className="font-bold mb-1">Kuis Interaktif 🧠</h3>
          <p className="text-sm text-foreground/70 mb-3">Uji pemahamanmu tentang bullying dalam 10 pertanyaan singkat.</p>
          <button className="px-5 h-10 rounded-full bg-foreground text-background text-sm font-semibold">Mulai Kuis</button>
        </section>
      </div>
    </div>
  );
}
