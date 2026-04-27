import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_app/self-check")({
  component: SelfCheck,
});

const questions = [
  "Apakah kamu sering merasa diejek atau dihina di sekolah?",
  "Apakah kamu pernah dijauhi atau diabaikan oleh teman-teman?",
  "Apakah kamu menerima pesan tidak menyenangkan di media sosial?",
  "Apakah kamu merasa takut atau cemas datang ke sekolah?",
  "Apakah kamu pernah ikut menertawakan atau mengejek orang lain?",
  "Apakah kamu merasa tidak punya tempat untuk bercerita?",
];

function SelfCheck() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(questions.length).fill(null));
  const [done, setDone] = useState(false);

  const score = answers.filter(Boolean).length;
  const result =
    score >= 4
      ? { label: "Perlu Dukungan Segera", color: "from-rose-100 to-pink-100", text: "Kamu menunjukkan tanda-tanda kuat sebagai korban bullying atau berada di lingkungan toxic. Segera hubungi BK, orang tua, atau gunakan fitur Report Center." }
      : score >= 2
      ? { label: "Waspada", color: "from-amber-100 to-yellow-100", text: "Ada beberapa sinyal yang perlu diperhatikan. Coba bercerita ke orang terpercaya & gunakan Safe Diary untuk menyalurkan emosi." }
      : { label: "Aman", color: "from-emerald-100 to-teal-100", text: "Lingkunganmu terlihat sehat. Tetap jadi teman yang baik & dukung sekitarmu." };

  if (done) {
    return (
      <div>
        <PageHeader title="Hasil Self Check" />
        <div className="p-5 space-y-5">
          <div className={`p-6 rounded-3xl bg-gradient-to-br ${result.color} text-center space-y-3`}>
            <CheckCircle2 className="h-12 w-12 mx-auto text-foreground/70" />
            <h2 className="text-2xl font-bold">{result.label}</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{result.text}</p>
            <p className="text-xs font-semibold">Skor: {score}/{questions.length}</p>
          </div>
          <Button variant="outlineHero" size="lg" className="w-full" onClick={() => { setDone(false); setAnswers(Array(questions.length).fill(null)); }}>
            <RotateCcw className="h-4 w-4" /> Ulangi Tes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Self Check" subtitle="Jawab jujur. Hanya kamu yang melihat hasilnya." />
      <div className="p-5 space-y-4">
        {questions.map((q, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-border/60">
            <p className="text-sm font-medium mb-3">{i + 1}. {q}</p>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => {
                    const next = [...answers];
                    next[i] = v;
                    setAnswers(next);
                  }}
                  className={`flex-1 h-10 rounded-xl text-sm font-semibold border transition ${
                    answers[i] === v
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border text-muted-foreground"
                  }`}
                >
                  {v ? "Ya" : "Tidak"}
                </button>
              ))}
            </div>
          </div>
        ))}
        <Button
          variant="hero"
          size="xl"
          className="w-full"
          disabled={answers.some((a) => a === null)}
          onClick={() => setDone(true)}
        >
          Lihat Hasil
        </Button>
      </div>
    </div>
  );
}
