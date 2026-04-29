import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { CheckCircle2, RotateCcw, Heart, NotebookPen, Phone, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_app/self-check")({
  component: SelfCheck,
});

type Cat = "victim" | "perpetrator" | "environment" | "support";

const questions: { q: string; cat: Cat }[] = [
  { q: "Apakah kamu sering merasa diejek atau dihina di sekolah?", cat: "victim" },
  { q: "Apakah kamu pernah dijauhi atau diabaikan oleh teman-teman?", cat: "victim" },
  { q: "Apakah kamu menerima pesan tidak menyenangkan di media sosial?", cat: "victim" },
  { q: "Apakah kamu merasa takut atau cemas datang ke sekolah?", cat: "victim" },
  { q: "Apakah kamu pernah dipermalukan di depan banyak orang?", cat: "victim" },
  { q: "Apakah kamu sering merasa tidak percaya diri karena ucapan orang lain?", cat: "victim" },
  { q: "Apakah ada seseorang yang sengaja membuatmu merasa kecil atau tidak berharga?", cat: "victim" },
  { q: "Apakah kamu pernah memilih diam karena takut jika melapor keadaan akan semakin buruk?", cat: "support" },
  { q: "Apakah kamu merasa sendirian saat menghadapi masalah ini?", cat: "support" },
  { q: "Apakah kamu pernah ikut mengejek orang lain agar diterima dalam pergaulan?", cat: "perpetrator" },
  { q: "Apakah kamu pernah menyebarkan gosip atau mempermalukan seseorang?", cat: "perpetrator" },
  { q: "Apakah kamu merasa sulit membedakan candaan dan bullying?", cat: "perpetrator" },
  { q: "Apakah kamu pernah melihat bullying tetapi memilih diam?", cat: "environment" },
  { q: "Apakah kamu merasa lingkungan pertemananmu tidak sehat?", cat: "environment" },
  { q: "Apakah kamu ingin memiliki tempat aman untuk bercerita?", cat: "support" },
];

function SelfCheck() {
  const [answers, setAnswers] = useState<(boolean | null)[]>(Array(questions.length).fill(null));
  const [done, setDone] = useState(false);

  const counts = { victim: 0, perpetrator: 0, environment: 0, support: 0 };
  answers.forEach((a, i) => { if (a) counts[questions[i].cat]++; });
  const score = answers.filter(Boolean).length;

  const profile =
    counts.victim >= 4
      ? {
          label: "Tanda Korban Bullying Terdeteksi",
          tone: "from-rose-100 to-pink-100",
          text: "Kami menemukan beberapa tanda bahwa kamu mungkin sedang mengalami bullying sosial dan verbal. Kamu tidak sendirian, dan kamu berhak mendapatkan bantuan.",
        }
      : counts.perpetrator >= 2
      ? {
          label: "Refleksi: Tanpa Sadar Pernah Menjadi Pelaku",
          tone: "from-amber-100 to-orange-100",
          text: "Ada kemungkinan kamu tanpa sadar pernah menjadi bagian dari bullying. Ini adalah kesempatan untuk berubah dan menjadi pribadi yang lebih peduli.",
        }
      : counts.environment >= 1 || counts.support >= 2
      ? {
          label: "Lingkungan Perlu Diperhatikan",
          tone: "from-violet-100 to-indigo-100",
          text: "Kamu berada di lingkungan yang cukup sehat, tetapi tetap penting menjaga batasan sosial dan menjadi support system bagi orang lain.",
        }
      : {
          label: "Lingkungan Sehat",
          tone: "from-emerald-100 to-teal-100",
          text: "Lingkunganmu terlihat sehat. Tetap jaga pertemananmu, dan jadilah teman yang baik untuk orang di sekitarmu.",
        };

  const tips = [
    "Ceritakan pada orang tua, guru, atau orang terpercaya",
    "Jangan menyalahkan diri sendiri",
    "Simpan bukti jika bullying terjadi secara online",
    "Hindari lingkungan yang toxic",
    "Bangun pertemanan yang sehat",
    "Berani berkata tidak pada perlakuan yang merendahkan",
    "Jadilah support system bagi teman yang membutuhkan",
  ];

  if (done) {
    return (
      <div>
        <PageHeader title="Hasil Self Check" />
        <div className="p-5 space-y-5">
          <div className={`p-6 rounded-3xl bg-gradient-to-br ${profile.tone} space-y-3`}>
            <CheckCircle2 className="h-10 w-10 text-foreground/70" />
            <h2 className="text-xl font-bold leading-tight">{profile.label}</h2>
            <p className="text-sm text-foreground/80 leading-relaxed">{profile.text}</p>
            <p className="text-xs font-semibold pt-1">Skor terdeteksi: {score}/{questions.length}</p>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <Stat label="Korban" value={counts.victim} max={7} color="bg-rose-100 text-rose-700" />
            <Stat label="Pelaku" value={counts.perpetrator} max={3} color="bg-amber-100 text-amber-700" />
            <Stat label="Lingk." value={counts.environment} max={2} color="bg-violet-100 text-violet-700" />
            <Stat label="Dukungan" value={counts.support} max={3} color="bg-emerald-100 text-emerald-700" />
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Saran Untuk Kamu</h3>
            <ul className="space-y-2">
              {tips.map((t) => (
                <li key={t} className="flex gap-2 p-3 rounded-xl bg-card border border-border/60 text-sm">
                  <Heart className="h-4 w-4 text-primary fill-primary/20 shrink-0 mt-0.5" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-3">Aksi Cepat</h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionLink to="/community" icon={Heart} label="Cari Dukungan" color="bg-rose-100 text-rose-700" />
              <ActionLink to="/emergency" icon={Phone} label="Konsultasi Admin" color="bg-sky-100 text-sky-700" />
              <ActionLink to="/motivation" icon={BookOpen} label="Baca Solusi" color="bg-amber-100 text-amber-700" />
              <ActionLink to="/diary" icon={NotebookPen} label="Mulai Safe Diary" color="bg-violet-100 text-violet-700" />
            </div>
          </div>

          <Button variant="outlineHero" size="lg" className="w-full" onClick={() => { setDone(false); setAnswers(Array(questions.length).fill(null)); }}>
            <RotateCcw className="h-4 w-4" /> Ulangi Tes
          </Button>
        </div>
      </div>
    );
  }

  const answeredCount = answers.filter((a) => a !== null).length;

  return (
    <div>
      <PageHeader title="Self Check" subtitle="Jawab jujur. Hanya kamu yang melihat hasilnya." />
      <div className="p-5 space-y-4">
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{answeredCount}/{questions.length}</span>
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-[image:var(--gradient-primary)] transition-all" style={{ width: `${(answeredCount / questions.length) * 100}%` }} />
          </div>
        </div>

        {questions.map((q, i) => (
          <div key={i} className="p-4 rounded-2xl bg-card border border-border/60">
            <p className="text-sm font-medium mb-3"><span className="text-primary font-bold">{i + 1}.</span> {q.q}</p>
            <div className="flex gap-2">
              {[true, false].map((v) => (
                <button
                  key={String(v)}
                  onClick={() => { const next = [...answers]; next[i] = v; setAnswers(next); }}
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
        <Button variant="hero" size="xl" className="w-full" disabled={answers.some((a) => a === null)} onClick={() => setDone(true)}>
          Lihat Hasil
        </Button>
      </div>
    </div>
  );
}

function Stat({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className={`p-3 rounded-xl ${color} text-center`}>
      <p className="text-lg font-bold">{value}<span className="text-xs opacity-70">/{max}</span></p>
      <p className="text-[10px] font-medium">{label}</p>
    </div>
  );
}

function ActionLink({ to, icon: Icon, label, color }: { to: string; icon: typeof Heart; label: string; color: string }) {
  return (
    <Link to={to as "/community"} className="flex items-center gap-2 p-3 rounded-xl bg-card border border-border/60">
      <div className={`h-9 w-9 rounded-lg ${color} flex items-center justify-center shrink-0`}>
        <Icon className="h-4 w-4" />
      </div>
      <span className="text-xs font-semibold leading-tight">{label}</span>
    </Link>
  );
}
