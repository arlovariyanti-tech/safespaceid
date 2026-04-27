import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Lock, Plus, Smile, Frown, Meh, Heart, Angry } from "lucide-react";

export const Route = createFileRoute("/_app/diary")({
  component: Diary,
});

const moods = [
  { icon: Smile, label: "Senang", color: "bg-emerald-100 text-emerald-700" },
  { icon: Heart, label: "Bersyukur", color: "bg-pink-100 text-pink-700" },
  { icon: Meh, label: "Biasa", color: "bg-slate-100 text-slate-700" },
  { icon: Frown, label: "Sedih", color: "bg-blue-100 text-blue-700" },
  { icon: Angry, label: "Marah", color: "bg-rose-100 text-rose-700" },
];

const entries = [
  { date: "Hari ini", mood: "Sedih", text: "Hari ini agak berat. Tapi setidaknya aku punya tempat untuk menulis…" },
  { date: "Kemarin", mood: "Biasa", text: "Aku coba bicara ke teman dekat. Lega rasanya." },
  { date: "2 hari lalu", mood: "Senang", text: "Ada teman baru yang baik banget di kelas!" },
];

function Diary() {
  const [writing, setWriting] = useState(false);
  const [mood, setMood] = useState<string | null>(null);

  if (writing) {
    return (
      <div>
        <PageHeader title="Tulis Diary" subtitle="Curahkan apapun yang kamu rasakan." />
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Bagaimana perasaanmu?</p>
            <div className="flex gap-2">
              {moods.map((m) => (
                <button
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border ${
                    mood === m.label ? "border-primary bg-primary/5" : "border-border"
                  }`}
                >
                  <div className={`h-9 w-9 rounded-full ${m.color} flex items-center justify-center`}>
                    <m.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <textarea
            placeholder="Ceritakan harimu... Tulisan ini hanya untukmu."
            rows={10}
            className="w-full p-4 rounded-2xl border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex gap-2">
            <Button variant="outlineHero" size="lg" className="flex-1" onClick={() => setWriting(false)}>Batal</Button>
            <Button variant="hero" size="lg" className="flex-1" onClick={() => setWriting(false)}>Simpan</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Safe Diary" subtitle="Privat, aman, hanya untukmu." />
      <div className="p-5 space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 border border-violet-200/60 flex items-center gap-3">
          <Lock className="h-5 w-5 text-violet-700" />
          <p className="text-xs text-foreground/80">Semua tulisanmu terenkripsi & tidak dibagikan ke siapapun.</p>
        </div>

        <Button variant="hero" size="xl" className="w-full" onClick={() => setWriting(true)}>
          <Plus className="h-5 w-5" /> Tulis Hari Ini
        </Button>

        <div className="space-y-3 pt-2">
          {entries.map((e, i) => (
            <div key={i} className="p-4 rounded-2xl bg-card border border-border/60">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-semibold text-muted-foreground">{e.date}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/50 font-medium">{e.mood}</span>
              </div>
              <p className="text-sm text-foreground/80 leading-relaxed">{e.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
