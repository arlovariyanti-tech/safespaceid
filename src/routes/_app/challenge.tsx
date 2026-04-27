import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { Target, Check, Flame } from "lucide-react";

export const Route = createFileRoute("/_app/challenge")({
  component: Challenge,
});

const challenges = [
  { title: "7 Hari Tanpa Menghina", days: 7, current: 3, color: "from-emerald-100 to-teal-100", active: true },
  { title: "30 Hari Jadi Teman Baik", days: 30, current: 12, color: "from-sky-100 to-blue-100", active: true },
  { title: "Speak Kindly Challenge", days: 14, current: 0, color: "from-violet-100 to-indigo-100", active: false },
  { title: "Daily Compliment Challenge", days: 21, current: 0, color: "from-amber-100 to-orange-100", active: false },
];

function Challenge() {
  return (
    <div>
      <PageHeader title="Positive Challenge" subtitle="Bangun kebiasaan baik, hari demi hari." />
      <div className="p-5 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          <Stat icon={Flame} label="Streak" value="3 hari" color="bg-orange-100 text-orange-700" />
          <Stat icon={Check} label="Selesai" value="2 challenge" color="bg-emerald-100 text-emerald-700" />
        </div>

        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Sedang Berjalan</h2>
          <div className="space-y-3">
            {challenges.filter((c) => c.active).map((c) => {
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
            {challenges.filter((c) => !c.active).map((c) => (
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
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: typeof Target; label: string; value: string; color: string }) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border/60">
      <div className={`h-10 w-10 rounded-xl ${color} flex items-center justify-center mb-2`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}
