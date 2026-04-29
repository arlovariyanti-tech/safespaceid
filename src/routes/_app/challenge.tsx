import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Target, Check, Flame, Award, Users, Sparkles, ArrowLeft, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/challenge")({
  component: Challenge,
});

type ChallengeDef = {
  id: string; title: string; days: number; category: string;
  tujuan: string; color: string; steps: string[]; badge: string;
};

const CHALLENGES: ChallengeDef[] = [
  {
    id: "teman-baik-7",
    title: "7 Hari Jadi Teman Baik",
    days: 7, category: "Friendship", color: "from-emerald-100 to-teal-100",
    tujuan: "Membangun kebiasaan menjadi teman yang lebih suportif dan peduli.",
    badge: "Positive Friend",
    steps: [
      "Beri satu pujian tulus kepada teman",
      "Dengarkan teman tanpa memotong pembicaraan",
      "Ajak teman yang sering sendirian berbicara",
      "Tulis pesan dukungan untuk satu orang",
      "Bantu teman tanpa diminta",
      "Tanyakan kabar teman yang lama tidak ditemui",
      "Bagikan momen baik bersama satu teman",
    ],
  },
  {
    id: "speak-kindly-7",
    title: "Speak Kindly Challenge",
    days: 7, category: "Kindness", color: "from-amber-100 to-orange-100",
    tujuan: "Melatih diri berbicara dengan lebih lembut dan penuh kebaikan.",
    badge: "Kindness Starter",
    steps: [
      "Sehari tanpa satu pun kata kasar",
      "Ganti satu sindiran menjadi pujian",
      "Katakan terima kasih 3 kali hari ini",
      "Puji seseorang yang tidak kamu kenal dekat",
      "Jangan ikut menertawakan lelucon merendahkan",
      "Sampaikan satu permintaan maaf yang tertunda",
      "Kirim pesan baik ke orang tua atau guru",
    ],
  },
  {
    id: "stop-gossip-7",
    title: "Stop Gossip Challenge",
    days: 7, category: "Anti-Bullying", color: "from-rose-100 to-pink-100",
    tujuan: "Menjauh dari kebiasaan membicarakan keburukan orang lain.",
    badge: "Anti-Bully Warrior",
    steps: [
      "Tidak ikut membicarakan keburukan siapa pun hari ini",
      "Alihkan topik saat gosip dimulai",
      "Katakan hal baik tentang orang yang sedang digosipkan",
      "Keluar dari grup chat yang sering menjelekkan orang",
      "Jangan menyebarkan ulang rumor apa pun",
      "Minta izin sebelum bercerita tentang orang lain",
      "Ajak satu teman ikut Stop Gossip challenge",
    ],
  },
  {
    id: "pendengar-7",
    title: "7 Hari Pendengar yang Baik",
    days: 7, category: "Empathy", color: "from-violet-100 to-indigo-100",
    tujuan: "Melatih empati dengan benar-benar hadir saat orang lain bicara.",
    badge: "Brave Listener",
    steps: [
      "Dengarkan seseorang selama 5 menit tanpa menyela",
      "Bertanya 'apa yang kamu rasakan?' kepada teman",
      "Matikan HP saat orang lain bicara",
      "Tanyakan kabar teman lama",
      "Dengarkan adik/kakak tanpa menggurui",
      "Tanya dan dengar cerita orang tua hari ini",
      "Tulis hal baru yang kamu pelajari dari orang lain",
    ],
  },
];

const dailyMicros = [
  { text: "Hari ini jangan mengejek siapa pun", category: "Anti-Bullying" },
  { text: "Berikan satu pujian tulus kepada teman", category: "Kindness" },
  { text: "Dengarkan seseorang tanpa memotong pembicaraan", category: "Empathy" },
  { text: "Jangan ikut menyebarkan gosip", category: "Anti-Bullying" },
  { text: "Ajak teman yang sering sendirian untuk berbicara", category: "Friendship" },
  { text: "Tulis satu hal baik tentang dirimu hari ini", category: "Self Love" },
  { text: "Ucapkan terima kasih kepada seseorang", category: "Kindness" },
];

type Progress = { id?: string; challenge_id: string; current_day: number; total_days: number; last_checked_date: string | null; completed: boolean };

function today() { return new Date().toISOString().slice(0, 10); }

function Challenge() {
  const { user } = useAuth();
  const [progresses, setProgresses] = useState<Record<string, Progress>>({});
  const [doneToday, setDoneToday] = useState(false);
  const [selected, setSelected] = useState<ChallengeDef | null>(null);

  const day = new Date().getDate();
  const todayMicro = dailyMicros[day % dailyMicros.length];

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("challenge_progress").select("*");
    const map: Record<string, Progress> = {};
    (data ?? []).forEach((p: any) => { map[p.challenge_id] = p; });
    setProgresses(map);
    setDoneToday(map["daily"]?.last_checked_date === today());
  };

  useEffect(() => { load(); }, [user]);

  const checkDaily = async () => {
    if (!user) return;
    const existing = progresses["daily"];
    if (existing) {
      await supabase.from("challenge_progress").update({
        current_day: existing.current_day + 1, last_checked_date: today(),
      }).eq("id", existing.id!);
    } else {
      await supabase.from("challenge_progress").insert({
        user_id: user.id, challenge_id: "daily", current_day: 1, total_days: 365, last_checked_date: today(),
      });
    }
    toast.success("Challenge hari ini selesai! 🎉");
    load();
  };

  const startChallenge = async (c: ChallengeDef) => {
    if (!user) return;
    if (progresses[c.id]) { setSelected(c); return; }
    await supabase.from("challenge_progress").insert({
      user_id: user.id, challenge_id: c.id, current_day: 0, total_days: c.days,
    });
    toast.success(`Challenge "${c.title}" dimulai!`);
    await load();
    setSelected(c);
  };

  const markDayDone = async (c: ChallengeDef) => {
    if (!user) return;
    const p = progresses[c.id];
    if (!p) return;
    if (p.last_checked_date === today()) { toast.info("Hari ini sudah ditandai ✓"); return; }
    const newDay = p.current_day + 1;
    const completed = newDay >= c.days;
    await supabase.from("challenge_progress").update({
      current_day: newDay, last_checked_date: today(), completed,
    }).eq("id", p.id!);
    toast.success(completed ? `🏅 Badge "${c.badge}" diperoleh!` : `Day ${newDay}/${c.days} selesai ✓`);
    load();
  };

  // Challenge detail view
  if (selected) {
    const p = progresses[selected.id];
    const cur = p?.current_day ?? 0;
    const pct = (cur / selected.days) * 100;
    const canCheck = p && p.last_checked_date !== today() && !p.completed;
    return (
      <div>
        <PageHeader
          title={selected.title}
          back={<button onClick={() => setSelected(null)} className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </button>}
        />
        <div className="p-5 space-y-5">
          <div className={`p-5 rounded-3xl bg-gradient-to-br ${selected.color} border border-white/60`}>
            <p className="text-[11px] font-bold uppercase tracking-wider opacity-70 mb-1">Tujuan</p>
            <p className="text-sm font-semibold leading-snug mb-4">{selected.tujuan}</p>
            <div className="h-2 bg-white/70 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-xs font-semibold">Hari {p?.completed ? selected.days : Math.min(cur + 1, selected.days)} dari {selected.days}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Checklist Harian</h3>
            {selected.steps.map((s, i) => {
              const completed = i < cur;
              const isCurrent = i === cur && !p?.completed;
              const locked = i > cur;
              return (
                <div key={i} className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  completed ? "bg-emerald-50 border-emerald-200" :
                  isCurrent ? "bg-card border-primary/40 ring-2 ring-primary/20" :
                  "bg-muted/30 border-border opacity-60"
                }`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    completed ? "bg-emerald-500 text-white" : isCurrent ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {completed ? <Check className="h-4 w-4" /> : locked ? <Lock className="h-3 w-3" /> : i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground">Hari {i + 1}</p>
                    <p className="text-sm font-medium">{s}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {p?.completed ? (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-200 text-center space-y-2">
              <Award className="h-10 w-10 mx-auto text-amber-700" />
              <p className="font-bold">🏅 Badge "{selected.badge}" diperoleh!</p>
              <p className="text-xs text-foreground/70">Kamu menyelesaikan {selected.title} 🎉</p>
            </div>
          ) : !p ? (
            <Button variant="hero" size="xl" className="w-full" onClick={() => startChallenge(selected)}>
              ▶ Mulai Challenge
            </Button>
          ) : canCheck ? (
            <Button variant="hero" size="xl" className="w-full" onClick={() => markDayDone(selected)}>
              ☑ Tandai Hari {cur + 1} Selesai
            </Button>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-sm text-emerald-900 font-semibold">
              ✓ Hari ini sudah ditandai. Lanjut besok ya!
            </div>
          )}
        </div>
      </div>
    );
  }

  const dailyProgress = progresses["daily"];

  return (
    <div>
      <PageHeader title="Positive Challenge" subtitle="Perubahan besar dimulai dari kebiasaan kecil." />
      <div className="p-5 space-y-6">
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={Flame} label="Streak" value={`${dailyProgress?.current_day ?? 0} hari`} color="bg-orange-100 text-orange-700" />
          <Stat icon={Target} label="Aktif" value={`${Object.keys(progresses).filter(k => k !== "daily" && !progresses[k].completed).length}`} color="bg-emerald-100 text-emerald-700" />
          <Stat icon={Award} label="Badge" value={`${Object.values(progresses).filter(p => p.completed).length}`} color="bg-amber-100 text-amber-700" />
        </div>

        {/* Daily micro */}
        <section className="p-5 rounded-3xl bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 border border-amber-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">⭐ Daily Challenge</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/70">{todayMicro.category}</span>
          </div>
          <p className="text-lg font-bold leading-snug mb-4">"{todayMicro.text}"</p>
          {doneToday ? (
            <div className="p-3 rounded-2xl bg-white/80 text-center text-sm font-semibold text-emerald-700">✓ Selesai hari ini</div>
          ) : (
            <button onClick={checkDaily} className="w-full h-12 rounded-2xl bg-foreground text-background text-sm font-semibold">
              Tandai Selesai ✓
            </button>
          )}
        </section>

        {/* Active + available */}
        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
            {Object.keys(progresses).filter(k => k !== "daily").length > 0 ? "Weekly Mission" : "Bisa Kamu Coba"}
          </h2>
          <div className="space-y-3">
            {CHALLENGES.map((c) => {
              const p = progresses[c.id];
              const pct = p ? (p.current_day / c.days) * 100 : 0;
              return (
                <button key={c.id} onClick={() => setSelected(c)}
                  className={`w-full text-left p-4 rounded-2xl bg-gradient-to-br ${c.color} border border-white/60`}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold">{c.title}</p>
                      <p className="text-xs text-foreground/60">
                        {p ? (p.completed ? `🏅 Selesai` : `Hari ${Math.min(p.current_day + 1, c.days)}/${c.days}`) : `${c.days} hari · ${c.category}`}
                      </p>
                    </div>
                    {p?.completed ? <Award className="h-5 w-5 text-amber-700" /> : <Target className="h-5 w-5 text-foreground/70" />}
                  </div>
                  {p && (
                    <div className="h-2 bg-white/70 rounded-full overflow-hidden">
                      <div className="h-full bg-foreground/70 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  )}
                  {!p && (
                    <span className="inline-block mt-1 text-[11px] font-bold text-foreground/80">▶ Mulai Challenge</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Community */}
        <section className="p-5 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-200 border border-indigo-200/60">
          <Users className="h-5 w-5 text-indigo-700 mb-2" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1">Community Challenge</p>
          <p className="font-bold text-base leading-snug mb-3">
            Minggu ini, mari bersama menyelesaikan Speak Kindly Challenge!
          </p>
          <Link to="/community" className="inline-block w-full text-center h-10 leading-10 rounded-xl bg-foreground text-background text-sm font-semibold">
            Bagikan Progress ke Community
          </Link>
        </section>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: typeof Target; label: string; value: string; color: string }) {
  return (
    <div className="p-3 rounded-2xl bg-card border border-border/60">
      <div className={`h-9 w-9 rounded-xl ${color} flex items-center justify-center mb-2`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="font-bold text-sm">{value}</p>
    </div>
  );
}
