import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { NotebookPen, Target, Settings, LogOut, ChevronRight, Award, PhoneCall, Bell, Lock } from "lucide-react";

export const Route = createFileRoute("/_app/profile")({
  component: Profile,
});

const stats = [
  { label: "Diary", value: "12", icon: NotebookPen },
  { label: "Challenge", value: "2", icon: Target },
  { label: "Badge", value: "5", icon: Award },
];

const menus = [
  { to: "/emergency", label: "Emergency Contact", icon: PhoneCall },
  { label: "Notifikasi", icon: Bell },
  { label: "Privasi & Keamanan", icon: Lock },
  { label: "Pengaturan Akun", icon: Settings },
] as const;

function Profile() {
  const nav = useNavigate();
  return (
    <div>
      <PageHeader title="Profile" />
      <div className="p-5 space-y-5">
        <div className="flex flex-col items-center text-center pt-2">
          <div className="h-24 w-24 rounded-3xl bg-[image:var(--gradient-primary)] flex items-center justify-center text-3xl font-black text-primary-foreground shadow-[var(--shadow-glow)]">
            S
          </div>
          <h2 className="text-xl font-bold mt-3">Sahabat Baik</h2>
          <p className="text-sm text-muted-foreground">sahabat@email.com</p>
          <button className="mt-3 px-4 h-8 rounded-full border border-border text-xs font-medium">Edit Profil</button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map((s) => (
            <div key={s.label} className="p-4 rounded-2xl bg-card border border-border/60 text-center">
              <s.icon className="h-5 w-5 mx-auto text-primary mb-1" />
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200/60">
          <p className="text-xs text-foreground/70 mb-1">Progress Challenge</p>
          <p className="font-bold mb-2">7 Hari Tanpa Menghina</p>
          <div className="h-2 bg-white/70 rounded-full overflow-hidden">
            <div className="h-full w-[42%] bg-emerald-500 rounded-full" />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">Hari 3 dari 7</p>
        </div>

        <div className="rounded-2xl bg-card border border-border/60 overflow-hidden">
          {menus.map((m, i) => {
            const inner = (
              <>
                <div className="flex items-center gap-3">
                  <m.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{m.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </>
            );
            const cls = `w-full flex items-center justify-between px-4 h-14 ${i !== menus.length - 1 ? "border-b border-border/60" : ""}`;
            return "to" in m && m.to ? (
              <Link key={m.label} to={m.to} className={cls}>{inner}</Link>
            ) : (
              <button key={m.label} className={cls}>{inner}</button>
            );
          })}
        </div>

        <button
          onClick={() => nav({ to: "/login" })}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-rose-50 text-rose-600 font-semibold text-sm border border-rose-200"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>

        <p className="text-center text-[10px] text-muted-foreground pt-2">No More Bully · v1.0</p>
      </div>
    </div>
  );
}
