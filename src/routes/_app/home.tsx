import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, AlertTriangle, BookOpen, NotebookPen, Sparkles, Target, PhoneCall, ClipboardCheck, Heart, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_app/home")({
  component: Home,
});

const quickFeatures = [
  { to: "/edukasi", icon: BookOpen, label: "Edukasi", color: "bg-sky-100 text-sky-700" },
  { to: "/self-check", icon: ClipboardCheck, label: "Self Check", color: "bg-emerald-100 text-emerald-700" },
  { to: "/diary", icon: NotebookPen, label: "Diary", color: "bg-violet-100 text-violet-700" },
  { to: "/motivation", icon: Sparkles, label: "Motivasi", color: "bg-amber-100 text-amber-700" },
  { to: "/challenge", icon: Target, label: "Challenge", color: "bg-lime-100 text-lime-700" },
  { to: "/emergency", icon: PhoneCall, label: "SOS", color: "bg-rose-100 text-rose-700" },
] as const;

function Home() {
  return (
    <div className="pb-6">
      <div className="px-5 pt-7 pb-8 bg-[image:var(--gradient-hero)] rounded-b-[2rem]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">Halo,</p>
            <h1 className="text-2xl font-bold">Sahabat 👋</h1>
          </div>
          <button className="h-10 w-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center border border-border/50">
            <Bell className="h-5 w-5" />
          </button>
        </div>

        {/* Daily motivation */}
        <div className="mt-6 p-5 rounded-2xl bg-background/80 backdrop-blur border border-white/60 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-2">
            <Heart className="h-3.5 w-3.5 fill-primary" /> MOTIVASI HARI INI
          </div>
          <p className="font-semibold leading-snug">
            "Kebaikan kecilmu hari ini bisa jadi alasan seseorang bertahan."
          </p>
        </div>
      </div>

      {/* Quick report CTA */}
      <div className="px-5 -mt-4">
        <Link
          to="/report"
          className="flex items-center justify-between p-4 rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Laporkan Bullying</p>
              <p className="text-xs opacity-90">Aman, cepat & rahasia</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

      {/* Features grid */}
      <section className="px-5 mt-7">
        <h2 className="font-bold mb-3">Fitur Untukmu</h2>
        <div className="grid grid-cols-3 gap-3">
          {quickFeatures.map((f) => (
            <Link
              key={f.label}
              to={f.to}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-card border border-border/60 hover:shadow-[var(--shadow-soft)] transition"
            >
              <div className={`h-12 w-12 rounded-xl ${f.color} flex items-center justify-center`}>
                <f.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium">{f.label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Active challenge */}
      <section className="px-5 mt-7">
        <h2 className="font-bold mb-3">Challenge Aktif</h2>
        <Link to="/challenge" className="block p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200/60">
          <div className="flex items-center gap-3 mb-3">
            <Target className="h-6 w-6 text-emerald-700" />
            <div>
              <p className="font-bold">7 Hari Tanpa Menghina</p>
              <p className="text-xs text-muted-foreground">Hari 3 dari 7</p>
            </div>
          </div>
          <div className="h-2 bg-white/70 rounded-full overflow-hidden">
            <div className="h-full w-[42%] bg-emerald-500 rounded-full" />
          </div>
        </Link>
      </section>

      {/* Community preview */}
      <section className="px-5 mt-7">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold">Dari Komunitas</h2>
          <Link to="/community" className="text-xs text-primary font-medium">Lihat semua</Link>
        </div>
        <div className="p-4 rounded-2xl bg-card border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-secondary" />
            <div>
              <p className="text-sm font-semibold">Anonim</p>
              <p className="text-[10px] text-muted-foreground">2 jam yang lalu</p>
            </div>
          </div>
          <p className="text-sm text-foreground/80">"Akhirnya berani cerita ke guru BK. Kalian semua keren, jangan menyerah 💙"</p>
        </div>
      </section>
    </div>
  );
}
