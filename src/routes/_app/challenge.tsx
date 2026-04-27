import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Target, Check, Flame, Award, Share2, Users, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/challenge")({
  component: Challenge,
});

const dailyChallenges = [
  { text: "Hari ini jangan mengejek siapa pun", category: "Anti-Bullying" },
  { text: "Berikan satu pujian tulus kepada teman", category: "Kindness" },
  { text: "Dengarkan seseorang tanpa memotong pembicaraan", category: "Empathy" },
  { text: "Jangan ikut menyebarkan gosip", category: "Anti-Bullying" },
  { text: "Ajak teman yang sering sendirian untuk berbicara", category: "Friendship" },
  { text: "Tulis satu hal baik tentang dirimu hari ini", category: "Self Love" },
  { text: "Ucapkan terima kasih kepada seseorang", category: "Kindness" },
  { text: "Berani berkata tidak pada tindakan bullying", category: "Confidence" },
  { text: "Jangan membandingkan diri dengan orang lain hari ini", category: "Self Love" },
  { text: "Jadilah pendengar yang baik", category: "Empathy" },
];

const categoryColors: Record<string, string> = {
  Kindness: "bg-amber-100 text-amber-800",
  "Anti-Bullying": "bg-rose-100 text-rose-800",
  "Self Love": "bg-pink-100 text-pink-800",
  Friendship: "bg-sky-100 text-sky-800",
  Empathy: "bg-violet-100 text-violet-800",
  Confidence: "bg-emerald-100 text-emerald-800",
};

const weekly = [
  { title: "7 Hari Tanpa Menghina", days: 7, current: 3, color: "from-emerald-100 to-teal-100" },
  { title: "30 Hari Jadi Teman Baik", days: 30, current: 12, color: "from-sky-100 to-blue-100" },
  { title: "7 Hari Pendengar yang Baik", days: 7, current: 0, color: "from-violet-100 to-indigo-100" },
  { title: "Speak Kindly Challenge", days: 14, current: 0, color: "from-amber-100 to-orange-100" },
  { title: "Stop Gossip Challenge", days: 7, current: 0, color: "from-rose-100 to-pink-100" },
];

const badges = [
  { name: "Kindness Starter", earned: true },
  { name: "Empathy Hero", earned: true },
  { name: "Brave Listener", earned: false },
  { name: "Positive Friend", earned: false },
  { name: "Safe Space Supporter", earned: false },
  { name: "Anti-Bully Warrior", earned: false },
];

function Challenge() {
  const day = new Date().getDate();
  const todayChallenge = useMemo(() => dailyChallenges[day % dailyChallenges.length], [day]);
  const [doneToday, setDoneToday] = useState(false);
  const [reflection, setReflection] = useState<string | null>(null);

  return (
    <div>
      <PageHeader title="Positive Challenge" subtitle="Perubahan besar dimulai dari kebiasaan kecil." />
      <div className="p-5 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <Stat icon={Flame} label="Streak" value="7 hari" color="bg-orange-100 text-orange-700" />
          <Stat icon={Check} label="Minggu Ini" value="5/7" color="bg-emerald-100 text-emerald-700" />
          <Stat icon={Award} label="Badge" value="2" color="bg-amber-100 text-amber-700" />
        </div>

        {/* Daily Challenge */}
        <section className="p-5 rounded-3xl bg-gradient-to-br from-amber-100 via-orange-100 to-rose-100 border border-amber-200/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">⭐ Daily Challenge</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryColors[todayChallenge.category]}`}>
              {todayChallenge.category}
            </span>
          </div>
          <p className="text-lg font-bold leading-snug mb-4">"{todayChallenge.text}"</p>

          {!doneToday ? (
            <button
              onClick={() => setDoneToday(true)}
              className="w-full h-12 rounded-2xl bg-foreground text-background text-sm font-semibold"
            >
              Tandai Selesai ✓
            </button>
          ) : !reflection ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold text-center">Bagaimana perasaanmu setelah challenge ini?</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { e: "😊", t: "Lebih Baik" },
                  { e: "😌", t: "Lebih Tenang" },
                  { e: "🤍", t: "Lebih Peduli" },
                  { e: "💭", t: "Masih Belajar" },
                ].map((r) => (
                  <button
                    key={r.t}
                    onClick={() => setReflection(r.t)}
                    className="p-3 rounded-xl bg-white/70 text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">{r.e}</span> {r.t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white/80 text-center space-y-2">
              <Sparkles className="h-5 w-5 mx-auto text-amber-700" />
              <p className="text-sm font-bold">"Kebaikan kecil hari ini bisa menjadi alasan seseorang merasa lebih kuat."</p>
              <p className="text-[11px] text-foreground/70">Refleksi tersimpan: <b>{reflection}</b></p>
              <button className="mt-2 inline-flex items-center gap-1 px-4 h-9 rounded-full bg-foreground text-background text-xs font-semibold">
                <Share2 className="h-3 w-3" /> Bagikan Progress
              </button>
            </div>
          )}
        </section>

        {/* Categories */}
        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Kategori Challenge</h2>
          <div className="flex flex-wrap gap-2">
            {Object.keys(categoryColors).map((c) => (
              <span key={c} className={`text-xs font-semibold px-3 py-1.5 rounded-full ${categoryColors[c]}`}>{c}</span>
            ))}
          </div>
        </section>

        {/* Weekly missions */}
        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Weekly Mission</h2>
          <div className="space-y-3">
            {weekly.filter((c) => c.current > 0).map((c) => {
              const pct = (c.current / c.days) * 100;
              return (
                <div key={c.title} className={`p-4 rounded-2xl bg-gradient-to-br ${c.color} border border-white/60`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold">{c.title}</p>
                      <p className="text-xs text-foreground/60">Hari {c.current} dari {c.days}</p>
                    </div>
                    <Target className="h-5 w-5 text-foreground/70" />
                  </div>
                  <div className="h-2 bg-white/70 rounded-full overflow-hidden mb-3">
                    <div className="h-full bg-foreground/70 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <button className="w-full h-10 rounded-xl bg-foreground text-background text-sm font-semibold">
                    Tandai Hari Ini ✓
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Bisa Kamu Coba</h2>
          <div className="space-y-3">
            {weekly.filter((c) => c.current === 0).map((c) => (
              <div key={c.title} className={`p-4 rounded-2xl bg-gradient-to-br ${c.color} border border-white/60 flex items-center justify-between`}>
                <div>
                  <p className="font-bold text-sm">{c.title}</p>
                  <p className="text-xs text-foreground/60">{c.days} hari</p>
                </div>
                <button className="px-4 h-9 rounded-full bg-background text-foreground text-xs font-semibold">Mulai</button>
              </div>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">🏅 Badge Reward</h2>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((b) => (
              <div key={b.name} className={`p-3 rounded-2xl text-center ${b.earned ? "bg-gradient-to-br from-amber-100 to-orange-200" : "bg-muted/50 opacity-60"}`}>
                <div className={`h-12 w-12 mx-auto rounded-full flex items-center justify-center mb-2 ${b.earned ? "bg-white/80" : "bg-background"}`}>
                  <Award className={`h-6 w-6 ${b.earned ? "text-amber-700" : "text-muted-foreground"}`} />
                </div>
                <p className="text-[10px] font-bold leading-tight">{b.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Community challenge */}
        <section className="p-5 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-200 border border-indigo-200/60">
          <Users className="h-5 w-5 text-indigo-700 mb-2" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1">Community Challenge</p>
          <p className="font-bold text-base leading-snug mb-3">
            Minggu ini, mari 100 pengguna menyelesaikan tantangan Speak Kindly bersama.
          </p>
          <div className="h-2 bg-white/70 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-indigo-600 rounded-full" style={{ width: "67%" }} />
          </div>
          <p className="text-xs text-foreground/70 mb-3">67 dari 100 pengguna sudah ikut bergerak 💛</p>
          <button className="w-full h-10 rounded-xl bg-foreground text-background text-sm font-semibold">Ikut Sekarang</button>
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
