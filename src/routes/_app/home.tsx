import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, BookOpen, NotebookPen, Sparkles, Target, MessageCircleHeart, ClipboardCheck, Heart, ArrowRight, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/home")({
  component: Home,
});

const quickFeatures = [
  { to: "/edukasi", icon: BookOpen, label: "Edukasi", color: "bg-sky-100 text-sky-700" },
  { to: "/self-check", icon: ClipboardCheck, label: "Self Check", color: "bg-emerald-100 text-emerald-700" },
  { to: "/diary", icon: NotebookPen, label: "Diary", color: "bg-violet-100 text-violet-700" },
  { to: "/motivation", icon: Sparkles, label: "Motivasi", color: "bg-amber-100 text-amber-700" },
  { to: "/challenge", icon: Target, label: "Challenge", color: "bg-lime-100 text-lime-700" },
  { to: "/emergency", icon: MessageCircleHeart, label: "Konsultasi", color: "bg-rose-100 text-rose-700" },
] as const;

function Home() {
  const { user } = useAuth();
  const name = (user?.user_metadata?.display_name as string) || user?.email?.split("@")[0] || "Sahabat";
  const [activeChallenge, setActiveChallenge] = useState<{ title: string; current: number; total: number } | null>(null);
  const [school, setSchool] = useState<{ code: string; display_name: string } | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: ch }, { data: prof }] = await Promise.all([
        supabase
          .from("challenge_progress")
          .select("*")
          .neq("challenge_id", "daily")
          .eq("completed", false)
          .order("updated_at", { ascending: false })
          .limit(1),
        supabase.from("profiles").select("school_code").eq("id", user.id).maybeSingle(),
      ]);
      if (ch && ch[0]) {
        const titles: Record<string, string> = {
          "teman-baik-7": "7 Hari Jadi Teman Baik",
          "speak-kindly-7": "Speak Kindly Challenge",
          "stop-gossip-7": "Stop Gossip Challenge",
          "pendengar-7": "7 Hari Pendengar yang Baik",
        };
        setActiveChallenge({
          title: titles[ch[0].challenge_id] ?? "Challenge Aktif",
          current: ch[0].current_day,
          total: ch[0].total_days,
        });
      } else {
        setActiveChallenge(null);
      }
      if (prof?.school_code) {
        const { data: s } = await supabase.from("schools").select("code, display_name").eq("code", prof.school_code).maybeSingle();
        setSchool(s as any);
      } else {
        setSchool(null);
      }
    })();
  }, [user]);

  const pct = activeChallenge ? (activeChallenge.current / activeChallenge.total) * 100 : 0;

  return (
    <div className="pb-6">
      <div className="px-5 pt-7 pb-8 bg-[image:var(--gradient-hero)] rounded-b-[2rem]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-muted-foreground">Halo,</p>
            <h1 className="text-2xl font-bold">{name} 👋</h1>
          </div>
          <button className="h-10 w-10 rounded-full bg-background/70 backdrop-blur flex items-center justify-center border border-border/50">
            <Bell className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 p-5 rounded-2xl bg-background/80 backdrop-blur border border-white/60 shadow-[var(--shadow-soft)]">
          <div className="flex items-center gap-2 text-xs text-primary font-semibold mb-2">
            <Heart className="h-3.5 w-3.5 fill-primary" /> MOTIVASI HARI INI
          </div>
          <p className="font-semibold leading-snug">
            "Kebaikan kecilmu hari ini bisa jadi alasan seseorang bertahan."
          </p>
        </div>
      </div>

      <div className="px-5 -mt-4">
        <Link
          to="/emergency"
          className="flex items-center justify-between p-4 rounded-2xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)]"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageCircleHeart className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold">Konsultasi Aman</p>
              <p className="text-xs opacity-90">Cerita ke admin via Instagram</p>
            </div>
          </div>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>

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

      <section className="px-5 mt-7">
        <h2 className="font-bold mb-3">Challenge Aktif</h2>
        <Link to="/challenge" className="block p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200/60">
          <div className="flex items-center gap-3 mb-3">
            <Target className="h-6 w-6 text-emerald-700" />
            <div>
              <p className="font-bold">{activeChallenge ? activeChallenge.title : "Belum ada challenge aktif"}</p>
              <p className="text-xs text-muted-foreground">
                {activeChallenge
                  ? `Hari ${Math.min(activeChallenge.current + 1, activeChallenge.total)} dari ${activeChallenge.total}`
                  : "Mulai challenge pertamamu sekarang"}
              </p>
            </div>
          </div>
          <div className="h-2 bg-white/70 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          {!activeChallenge && (
            <p className="mt-3 text-xs font-semibold text-emerald-800">▶ Pilih Challenge</p>
          )}
        </Link>
      </section>

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
