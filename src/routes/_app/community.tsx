import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { Heart, MessageCircle, Plus } from "lucide-react";

export const Route = createFileRoute("/_app/community")({
  component: Community,
});

const posts = [
  {
    user: "Anonim 🌸",
    time: "10 menit lalu",
    tag: "Cerita",
    content: "Hari ini akhirnya berani lapor ke BK soal yang aku alami selama ini. Doain ya teman-teman 💙",
    likes: 124,
    comments: 32,
  },
  {
    user: "Sahabat Senyum",
    time: "1 jam lalu",
    tag: "Dukungan",
    content: "Buat kalian yang lagi berat hari ini, ingat: perasaanmu valid. Boleh nangis, boleh istirahat, lalu bangkit lagi pelan-pelan ya.",
    likes: 256,
    comments: 41,
  },
  {
    user: "Rey",
    time: "3 jam lalu",
    tag: "Pertanyaan",
    content: "Gimana cara mulai cerita ke orang tua tanpa bikin mereka khawatir berlebihan?",
    likes: 88,
    comments: 27,
  },
];

const tags = ["Semua", "Cerita", "Dukungan", "Pertanyaan", "Tips"];

function Community() {
  return (
    <div>
      <PageHeader title="Community" subtitle="Saling dukung tanpa menghakimi." />
      <div className="p-5 space-y-4">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {tags.map((t, i) => (
            <button
              key={t}
              className={`shrink-0 px-4 h-8 rounded-full text-xs font-medium border ${
                i === 0 ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {posts.map((p, i) => (
          <article key={i} className="p-4 rounded-2xl bg-card border border-border/60 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-[image:var(--gradient-primary)]" />
              <div className="flex-1">
                <p className="text-sm font-semibold">{p.user}</p>
                <p className="text-[10px] text-muted-foreground">{p.time}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">{p.tag}</span>
            </div>
            <p className="text-sm leading-relaxed">{p.content}</p>
            <div className="flex items-center gap-5 pt-1 text-xs text-muted-foreground">
              <button className="flex items-center gap-1.5 hover:text-primary"><Heart className="h-4 w-4" /> {p.likes}</button>
              <button className="flex items-center gap-1.5 hover:text-primary"><MessageCircle className="h-4 w-4" /> {p.comments}</button>
            </div>
          </article>
        ))}
      </div>

      <button className="fixed bottom-24 left-1/2 -translate-x-1/2 ml-[140px] h-14 w-14 rounded-full bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)] flex items-center justify-center z-30">
        <Plus className="h-6 w-6 text-primary-foreground" />
      </button>
    </div>
  );
}
