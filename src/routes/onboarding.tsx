import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, NotebookPen, AlertTriangle, Users, Sparkles } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const slides = [
  { icon: BookOpen, title: "Edukasi Bullying", desc: "Pahami jenis, penyebab & dampak bullying lewat materi singkat dan interaktif.", color: "from-sky-100 to-blue-50" },
  { icon: NotebookPen, title: "Safe Diary", desc: "Tulis perasaanmu dengan aman dan privat. Lega tanpa takut dihakimi.", color: "from-violet-100 to-indigo-50" },
  { icon: AlertTriangle, title: "Report Bullying", desc: "Laporkan kasus secara aman ke pihak terpercaya: BK, wali kelas, atau mentor.", color: "from-rose-100 to-pink-50" },
  { icon: Users, title: "Community Support", desc: "Bergabung dengan teman-teman yang saling mendukung tanpa menghakimi.", color: "from-emerald-100 to-teal-50" },
  { icon: Sparkles, title: "Motivation Room", desc: "Afirmasi positif & cerita inspiratif untuk menguatkanmu setiap hari.", color: "from-amber-100 to-yellow-50" },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const s = slides[i];
  const Icon = s.icon;
  const last = i === slides.length - 1;
  return (
    <MobileFrame>
      <div className="min-h-screen flex flex-col p-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
          <Link to="/login" className="text-sm text-muted-foreground">Lewati</Link>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8">
          <div className={`h-48 w-48 rounded-[3rem] bg-gradient-to-br ${s.color} flex items-center justify-center shadow-[var(--shadow-soft)]`}>
            <Icon className="h-20 w-20 text-primary" />
          </div>
          <div className="space-y-3 px-2">
            <h2 className="text-3xl font-bold">{s.title}</h2>
            <p className="text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        </div>
        <Button
          variant="hero"
          size="xl"
          onClick={() => (last ? nav({ to: "/login" }) : setI(i + 1))}
          className="w-full"
        >
          {last ? "Mulai Sekarang" : "Lanjut"}
        </Button>
      </div>
    </MobileFrame>
  );
}
