import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { Sparkles, Heart, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_app/motivation")({
  component: Motivation,
});

const affirmations = [
  "Kamu berharga, apapun kata mereka.",
  "Lukamu tidak mendefinisikan dirimu.",
  "Hari ini kamu sudah cukup. Sungguh.",
  "Suaramu penting. Beranilah.",
];

const stories = [
  { title: "Dari Korban Jadi Konselor Muda", author: "Aisyah, 17" },
  { title: "Aku Berhenti Menjadi Pelaku", author: "Reza, 16" },
  { title: "Komunitas yang Menyelamatkan", author: "Nisa, 15" },
];

function Motivation() {
  return (
    <div>
      <PageHeader title="Motivation Room" subtitle="Tempat hatimu kembali kuat." />
      <div className="p-5 space-y-7">
        <div className="p-6 rounded-3xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]">
          <Sparkles className="h-6 w-6 mb-3" />
          <p className="text-xl font-bold leading-snug">"Kamu lebih kuat dari yang kamu kira, lebih berani dari yang kamu rasa, dan lebih dicintai dari yang kamu tahu."</p>
          <p className="text-xs opacity-80 mt-3">— Affirmation of the day</p>
        </div>

        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Afirmasi Positif</h2>
          <div className="space-y-2">
            {affirmations.map((a, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/60">
                <Heart className="h-4 w-4 text-primary fill-primary mt-0.5 shrink-0" />
                <p className="text-sm font-medium">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Cerita Inspiratif</h2>
          <div className="space-y-3">
            {stories.map((s, i) => (
              <button key={i} className="w-full text-left p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/40">
                <BookOpen className="h-5 w-5 text-amber-700 mb-2" />
                <p className="font-bold text-sm">{s.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.author}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 border border-violet-200/60">
          <h3 className="font-bold mb-1">Social Prayer 🙏</h3>
          <p className="text-sm text-foreground/70 mb-3">Kirim doa & harapan baik untuk teman-teman yang sedang berjuang.</p>
          <button className="px-5 h-10 rounded-full bg-foreground text-background text-sm font-semibold">Kirim Doa</button>
        </section>
      </div>
    </div>
  );
}
