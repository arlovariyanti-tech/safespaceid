import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Target, Check, Flame, Award, Users, ArrowLeft, Lock, Sparkles, Trophy, RotateCcw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/challenge")({
  component: Challenge,
});

type Level = {
  id: string;
  level: number;
  title: string;
  category: string;
  color: string;
  badge: string;
  tujuan: string;
  missions: string[]; // 7 daily missions
};

const LEVELS: Level[] = [
  {
    id: "lvl1-teman-baik",
    level: 1,
    title: "7 Hari Jadi Teman Baik",
    category: "Friendship",
    color: "from-emerald-100 to-teal-100",
    badge: "Good Friend",
    tujuan: "Membangun kebiasaan menjadi teman yang lebih suportif dan peduli.",
    missions: [
      "Sapa 1 teman dengan ramah hari ini",
      "Dengarkan cerita teman tanpa memotong",
      "Hindari berkata kasar sepanjang hari",
      "Bantu teman tanpa diminta",
      "Beri 1 pujian tulus kepada seseorang",
      "Ajak bicara teman yang sering sendirian",
      "Lakukan 2 kebaikan kecil hari ini",
    ],
  },
  {
    id: "lvl2-kindness",
    level: 2,
    title: "7 Hari Kindness",
    category: "Kindness",
    color: "from-amber-100 to-orange-100",
    badge: "Kind Speaker",
    tujuan: "Melatih diri berbicara dan bertindak dengan lebih lembut.",
    missions: [
      "Sehari tanpa satu pun kata kasar",
      "Ucapkan terima kasih 3 kali hari ini",
      "Ganti satu sindiran menjadi pujian",
      "Kirim pesan baik ke orang tua / guru",
      "Puji seseorang yang tidak kamu kenal dekat",
      "Sampaikan satu permintaan maaf yang tertunda",
      "Bagikan satu kebaikan ke media sosialmu",
    ],
  },
  {
    id: "lvl3-anti-bully",
    level: 3,
    title: "7 Hari Anti Bullying",
    category: "Anti-Bullying",
    color: "from-rose-100 to-pink-100",
    badge: "Anti Bully Agent",
    tujuan: "Berani berdiri melawan bullying di sekitarmu.",
    missions: [
      "Tidak ikut membicarakan keburukan siapa pun",
      "Alihkan topik saat gosip dimulai",
      "Katakan hal baik tentang orang yang digosipkan",
      "Keluar dari grup chat yang sering merundung",
      "Jangan menyebarkan ulang rumor apa pun",
      "Tegur 1 candaan yang merendahkan orang lain",
      "Ajak 1 teman ikut challenge anti-bullying",
    ],
  },
  {
    id: "lvl4-empathy",
    level: 4,
    title: "7 Hari Empathy",
    category: "Empathy",
    color: "from-violet-100 to-indigo-100",
    badge: "Empathy Hero",
    tujuan: "Melatih empati dengan benar-benar hadir untuk orang lain.",
    missions: [
      "Dengarkan seseorang 5 menit tanpa menyela",
      "Tanyakan 'apa yang kamu rasakan?' pada teman",
      "Matikan HP saat orang lain bicara",
      "Tanya kabar teman lama hari ini",
      "Dengarkan adik/kakak tanpa menggurui",
      "Tanya & dengarkan cerita orang tua",
      "Tulis 1 hal baru yang kamu pelajari dari orang lain",
    ],
  },
];

const SEASON2_MISSIONS = [
  "Bantu teman yang sedang dijauhi",
  "Jadi penengah saat ada konflik kecil",
  "Ajak 1 orang baru ikut challenge ini",
  "Tulis surat dukungan untuk korban bullying",
  "Buat 1 konten positif anti-bullying",
  "Mulai obrolan tulus dengan orang yang jarang bicara",
  "Refleksikan perubahan dirimu selama 4 level",
];

type Progress = {
  id?: string;
  challenge_id: string;
  current_day: number;
  total_days: number;
  last_checked_date: string | null;
  completed: boolean;
};

const today = () => new Date().toISOString().slice(0, 10);
const yesterday = () => {
  const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10);
};

function Challenge() {
  const { user } = useAuth();
  const [progresses, setProgresses] = useState<Record<string, Progress>>({});
  const [selected, setSelected] = useState<Level | null>(null);
  const [loading, setLoading] = useState(false);
  const [reflectOpen, setReflectOpen] = useState(false);
  const [reflectGood, setReflectGood] = useState("");
  const [reflectHard, setReflectHard] = useState("");
  const [pendingLevel, setPendingLevel] = useState<Level | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [schoolCode, setSchoolCode] = useState<string | null>(null);

  const load = async () => {
    if (!user) return;
    const [{ data }, { data: prof }] = await Promise.all([
      supabase.from("challenge_progress").select("*").eq("user_id", user.id),
      supabase.from("profiles").select("school_code").eq("id", user.id).maybeSingle(),
    ]);
    const map: Record<string, Progress> = {};
    (data ?? []).forEach((p: any) => { map[p.challenge_id] = p; });
    setProgresses(map);
    setSchoolCode((prof as any)?.school_code ?? null);
  };

  useEffect(() => { load(); }, [user]);

  // Streak meta is stored as challenge_id="streak"
  const streak = progresses["streak"]?.current_day ?? 0;
  const streakDate = progresses["streak"]?.last_checked_date ?? null;
  const liveStreak = streakDate === today() || streakDate === yesterday() ? streak : 0;

  const totalActions = useMemo(
    () => Object.entries(progresses)
      .filter(([k]) => k.startsWith("lvl") || k.startsWith("s2"))
      .reduce((sum, [, p]) => sum + (p.current_day || 0), 0),
    [progresses],
  );

  const earnedBadges = LEVELS.filter((l) => progresses[l.id]?.completed).map((l) => l.badge);
  const allDone = LEVELS.every((l) => progresses[l.id]?.completed);
  const season2 = progresses["s2-loop"];

  const isUnlocked = (l: Level) => l.level === 1 || !!progresses[LEVELS[l.level - 2].id]?.completed;

  const updateStreak = async () => {
    if (!user) return;
    const meta = progresses["streak"];
    const t = today();
    if (meta?.last_checked_date === t) return; // already counted today
    const newCount = meta?.last_checked_date === yesterday() ? meta.current_day + 1 : 1;
    if (meta) {
      await supabase.from("challenge_progress").update({
        current_day: newCount, last_checked_date: t,
      }).eq("id", meta.id!);
    } else {
      await supabase.from("challenge_progress").insert({
        user_id: user.id, challenge_id: "streak", current_day: 1, total_days: 365, last_checked_date: t,
      });
    }
  };

  const startLevel = async (l: Level) => {
    if (!user) return;
    if (!isUnlocked(l)) { toast.info("Selesaikan level sebelumnya dulu 🔒"); return; }
    if (!progresses[l.id]) {
      await supabase.from("challenge_progress").insert({
        user_id: user.id, challenge_id: l.id, current_day: 0, total_days: 7,
      });
      await load();
      toast.success(`Level ${l.level} dimulai! ✨`);
    }
    setSelected(l);
  };

  const openReflection = (l: Level) => {
    const p = progresses[l.id];
    if (!p) return;
    if (p.last_checked_date === today()) { toast.info("Hari ini sudah ditandai ✓"); return; }
    setPendingLevel(l);
    setReflectGood(""); setReflectHard("");
    setReflectOpen(true);
  };

  const submitDay = async () => {
    if (!user || !pendingLevel) return;
    const l = pendingLevel;
    const p = progresses[l.id];
    if (!p) return;
    setLoading(true);
    try {
      const newDay = p.current_day + 1;
      const completed = newDay >= 7;
      await supabase.from("challenge_progress").update({
        current_day: newDay, last_checked_date: today(), completed,
      }).eq("id", p.id!);

      // Save reflection
      if (reflectGood.trim() || reflectHard.trim()) {
        await supabase.from("diary_entries").insert({
          user_id: user.id,
          title: `Refleksi · ${l.title} · Hari ${newDay}`,
          content: `🌱 Hal baik hari ini:\n${reflectGood || "-"}\n\n💭 Yang paling sulit:\n${reflectHard || "-"}`,
          mood: "reflective",
        });
      }

      await updateStreak();

      // School contribution (best effort, ignore duplicates)
      if (schoolCode) {
        await supabase.from("school_check_ins").insert({
          user_id: user.id, school_code: schoolCode, check_date: today(), challenge_day: newDay,
        });
      }

      await load();
      setReflectOpen(false);
      setPendingLevel(null);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 1800);
      toast.success(completed ? `🏅 Badge "${l.badge}" diperoleh!` : `Hari ${newDay}/7 selesai ✓`);
    } catch (e: any) {
      toast.error("Gagal menyimpan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const startSeason2 = async () => {
    if (!user) return;
    if (!season2) {
      await supabase.from("challenge_progress").insert({
        user_id: user.id, challenge_id: "s2-loop", current_day: 0, total_days: 7,
      });
      await load();
    }
    toast.success("Season 2 dimulai! 🔥");
  };

  // ====== DETAIL VIEW ======
  if (selected) {
    const p = progresses[selected.id];
    const cur = p?.current_day ?? 0;
    const pct = (cur / 7) * 100;
    const todayMission = selected.missions[Math.min(cur, 6)];
    const canCheck = p && p.last_checked_date !== today() && !p.completed;

    return (
      <div className="relative">
        {showConfetti && <Confetti />}
        <PageHeader
          title={`Level ${selected.level}`}
          back={
            <button onClick={() => setSelected(null)} className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
              <ArrowLeft className="h-4 w-4" />
            </button>
          }
        />
        <div className="p-5 space-y-5 pb-32">
          <div className={`p-5 rounded-3xl bg-gradient-to-br ${selected.color} border border-white/60`}>
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-1">{selected.category} · Level {selected.level}</p>
            <h2 className="text-lg font-extrabold leading-tight mb-1">{selected.title}</h2>
            <p className="text-xs opacity-80 mb-4">{selected.tujuan}</p>
            <div className="h-2.5 bg-white/70 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-foreground rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span>Hari {p?.completed ? 7 : Math.min(cur + 1, 7)} / 7</span>
              <span className="flex items-center gap-1"><Flame className="h-3.5 w-3.5 text-orange-600" /> {liveStreak} hari streak</span>
            </div>
          </div>

          {!p?.completed && (
            <div className="p-5 rounded-3xl bg-card border-2 border-primary/30 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2">⭐ Misi Hari Ini · Hari {cur + 1}</p>
              <p className="text-base font-bold leading-snug mb-4">"{todayMission}"</p>
              {canCheck ? (
                <Button variant="hero" size="xl" className="w-full" onClick={() => openReflection(selected)}>
                  ☑ Selesai Hari Ini
                </Button>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-sm text-emerald-900 font-semibold">
                  ✓ Hari ini sudah ditandai. Sampai besok ya!
                </div>
              )}
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground">Roadmap 7 Hari</h3>
            {selected.missions.map((s, i) => {
              const completed = i < cur;
              const isCurrent = i === cur && !p?.completed;
              return (
                <div key={i} className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  completed ? "bg-emerald-50 border-emerald-200" :
                  isCurrent ? "bg-card border-primary/40 ring-2 ring-primary/20" :
                  "bg-muted/30 border-border opacity-60"
                }`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    completed ? "bg-emerald-500 text-white" : isCurrent ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {completed ? <Check className="h-4 w-4" /> : isCurrent ? i + 1 : <Lock className="h-3 w-3" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] text-muted-foreground">Hari {i + 1}</p>
                    <p className="text-sm font-medium">{s}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {p?.completed && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-200 text-center space-y-2 border border-amber-300/60">
              <Award className="h-12 w-12 mx-auto text-amber-700" />
              <p className="font-extrabold text-lg">🏅 Badge "{selected.badge}"</p>
              <p className="text-xs text-foreground/70">Kamu menyelesaikan {selected.title}!</p>
              {selected.level < 4 && (
                <Button variant="hero" className="mt-3" onClick={() => {
                  const next = LEVELS[selected.level];
                  setSelected(null);
                  setTimeout(() => startLevel(next), 200);
                }}>
                  Lanjut Level {selected.level + 1} →
                </Button>
              )}
            </div>
          )}
        </div>

        <ReflectionDialog
          open={reflectOpen}
          onOpenChange={setReflectOpen}
          good={reflectGood} setGood={setReflectGood}
          hard={reflectHard} setHard={setReflectHard}
          loading={loading}
          onSubmit={submitDay}
        />
      </div>
    );
  }

  // ====== HOME / LIST VIEW ======
  return (
    <div className="relative">
      {showConfetti && <Confetti />}
      <PageHeader title="Positive Challenge" subtitle="Naik level, bangun kebiasaan baik." />
      <div className="p-5 space-y-6 pb-24">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={Flame} label="Streak" value={`${liveStreak}`} sub="hari" color="bg-orange-100 text-orange-700" />
          <Stat icon={Sparkles} label="Aksi Baik" value={`${totalActions}`} sub="total" color="bg-emerald-100 text-emerald-700" />
          <Stat icon={Trophy} label="Badge" value={`${earnedBadges.length}`} sub={`/ ${LEVELS.length}`} color="bg-amber-100 text-amber-700" />
        </div>

        {/* Level path */}
        <section>
          <h2 className="font-bold mb-3 text-xs uppercase tracking-wider text-muted-foreground">Perjalanan Level</h2>
          <div className="space-y-3">
            {LEVELS.map((l) => {
              const p = progresses[l.id];
              const unlocked = isUnlocked(l);
              const pct = p ? (p.current_day / 7) * 100 : 0;
              return (
                <button
                  key={l.id}
                  onClick={() => unlocked ? startLevel(l) : toast.info("🔒 Selesaikan level sebelumnya dulu")}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${
                    unlocked
                      ? `bg-gradient-to-br ${l.color} border-white/60 active:scale-[0.98]`
                      : "bg-muted/40 border-border opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 ${
                      p?.completed ? "bg-amber-500 text-white" :
                      unlocked ? "bg-white/80 text-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {p?.completed ? <Award className="h-5 w-5" /> : unlocked ? l.level : <Lock className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Level {l.level} · {l.category}</p>
                      <p className="font-bold leading-tight">{l.title}</p>
                      <p className="text-[11px] text-foreground/70 mt-0.5">
                        {p?.completed ? `🏅 ${l.badge} diraih` :
                          p ? `Hari ${Math.min(p.current_day + 1, 7)}/7` :
                          unlocked ? "▶ Mulai sekarang" : "🔒 Terkunci"}
                      </p>
                      {p && (
                        <div className="h-1.5 bg-white/70 rounded-full overflow-hidden mt-2">
                          <div className="h-full bg-foreground/70 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Season 2 */}
        {allDone && (
          <section className="p-5 rounded-3xl bg-gradient-to-br from-fuchsia-100 via-violet-100 to-indigo-200 border border-violet-200/60">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw className="h-4 w-4 text-violet-700" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-violet-800">Season 2 · Lanjutkan Perjalanan</p>
            </div>
            <p className="font-bold leading-snug mb-3">
              Kamu sudah menyelesaikan semua level! Saatnya tantangan yang lebih bermakna.
            </p>
            <ul className="text-xs space-y-1 mb-3 text-foreground/80">
              {SEASON2_MISSIONS.slice(0, 3).map((m, i) => <li key={i}>• {m}</li>)}
            </ul>
            {season2 && (
              <p className="text-[11px] mb-2 font-semibold text-violet-800">
                Progress: Hari {Math.min((season2.current_day || 0) + 1, 7)}/7
              </p>
            )}
            <Button variant="hero" size="lg" className="w-full" onClick={startSeason2}>
              {season2 ? "Lanjutkan Season 2 →" : "🚀 Buka Season 2"}
            </Button>
          </section>
        )}

        {/* Badges showcase */}
        {earnedBadges.length > 0 && (
          <section>
            <h2 className="font-bold mb-3 text-xs uppercase tracking-wider text-muted-foreground">Badge Kamu</h2>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((b) => (
                <span key={b} className="inline-flex items-center gap-1 px-3 h-8 rounded-full bg-gradient-to-r from-amber-100 to-orange-200 border border-amber-300/60 text-xs font-bold text-amber-900">
                  <Award className="h-3.5 w-3.5" /> {b}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Community */}
        <section className="p-5 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-200 border border-indigo-200/60">
          <Users className="h-5 w-5 text-indigo-700 mb-2" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1">Community</p>
          <p className="font-bold text-sm leading-snug mb-3">
            Bagikan progress kamu & ajak teman ikut perjalanan ini.
          </p>
          <Link to="/community" className="inline-block w-full text-center h-10 leading-10 rounded-xl bg-foreground text-background text-sm font-semibold">
            Bagikan ke Community
          </Link>
        </section>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub?: string; color: string }) {
  return (
    <div className="p-3 rounded-2xl bg-card border border-border/60">
      <div className={`h-9 w-9 rounded-xl ${color} flex items-center justify-center mb-2`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="font-bold text-sm">
        {value} {sub && <span className="text-[10px] font-medium text-muted-foreground">{sub}</span>}
      </p>
    </div>
  );
}

function ReflectionDialog({
  open, onOpenChange, good, setGood, hard, setHard, loading, onSubmit,
}: {
  open: boolean; onOpenChange: (v: boolean) => void;
  good: string; setGood: (v: string) => void;
  hard: string; setHard: (v: string) => void;
  loading: boolean; onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Refleksi Hari Ini ✨</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold mb-1 block">🌱 Apa hal baik yang kamu lakukan hari ini?</label>
            <Textarea value={good} onChange={(e) => setGood(e.target.value)} placeholder="Contoh: Mendengar cerita teman selama istirahat..." rows={3} />
          </div>
          <div>
            <label className="text-xs font-semibold mb-1 block">💭 Apa yang paling sulit hari ini?</label>
            <Textarea value={hard} onChange={(e) => setHard(e.target.value)} placeholder="Contoh: Menahan diri tidak ikut komentar kasar..." rows={3} />
          </div>
          <p className="text-[10px] text-muted-foreground">Refleksi otomatis tersimpan ke Diary kamu 💙</p>
          <Button variant="hero" size="lg" className="w-full" disabled={loading} onClick={onSubmit}>
            {loading ? "Menyimpan..." : "Simpan & Selesai ✓"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Confetti() {
  const pieces = Array.from({ length: 30 });
  const colors = ["#f59e0b", "#10b981", "#6366f1", "#ec4899", "#06b6d4"];
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const dur = 1.2 + Math.random() * 0.8;
        const color = colors[i % colors.length];
        return (
          <span
            key={i}
            className="absolute top-0 block w-2 h-3 rounded-sm"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animation: `confetti-fall ${dur}s ${delay}s ease-in forwards`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
      <style>{`
        @keyframes confetti-fall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
