import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Heart, Sparkles } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/onboarding")({
  component: Onboarding,
});

const slides = [
  {
    icon: BookOpen,
    title: "Pahami Bullying",
    desc: "Belajar mengenali, mencegah, dan menghadapi bullying lewat materi yang mudah dimengerti.",
    color: "from-sky-100 to-blue-100",
  },
  {
    icon: Heart,
    title: "Ruang Aman untukmu",
    desc: "Tempat bercerita, healing, dan mendapat dukungan emosional tanpa dihakimi.",
    color: "from-violet-100 to-indigo-100",
  },
  {
    icon: Sparkles,
    title: "Bangun Kebiasaan Positif",
    desc: "Challenge harian, komunitas suportif, dan lingkungan sosial yang lebih sehat.",
    color: "from-amber-100 to-orange-100",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const s = slides[i];
  const Icon = s.icon;
  const last = i === slides.length - 1;

  const finish = () => {
    localStorage.setItem("nmb_onboarded", "1");
    nav({ to: "/login" });
  };

  return (
    <MobileFrame>
      <div className="min-h-screen flex flex-col p-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-1.5">
            {slides.map((_, idx) => (
              <div key={idx} className={`h-1.5 rounded-full transition-all ${idx === i ? "w-8 bg-primary" : "w-1.5 bg-border"}`} />
            ))}
          </div>
          <button onClick={finish} className="text-sm text-muted-foreground">Lewati</button>
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
          onClick={() => (last ? finish() : setI(i + 1))}
          className="w-full"
        >
          {last ? "Mulai Sekarang" : "Lanjut"}
        </Button>
      </div>
    </MobileFrame>
  );
}
