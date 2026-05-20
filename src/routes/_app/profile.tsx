import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { NotebookPen, Target, Settings, LogOut, ChevronRight, Award, MessageCircleHeart, Lock, ShieldCheck, Bookmark, ShieldAlert, Inbox } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/profile")({
  component: Profile,
});

type ProfileRow = { display_name: string | null; avatar_url: string | null; bio: string | null; username: string | null; school_code: string | null };

const menus = [
  { to: "/saved", label: "Tersimpan", icon: Bookmark },
  { to: "/report", label: "Lapor Anonim ke BK", icon: ShieldAlert },
  { to: "/emergency", label: "Konsultasi Aman", icon: MessageCircleHeart },
  { to: "/profile/privacy", label: "Privasi & Keamanan", icon: Lock },
  { to: "/profile/settings", label: "Pengaturan Akun", icon: Settings },
] as const;

function Profile() {
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [counts, setCounts] = useState({ diary: 0, day: 0, total: 7 });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { count: diaryCount }, { data: ch }, { data: roleRow }] = await Promise.all([
        supabase.from("profiles").select("display_name, avatar_url, bio, username, school_code").eq("id", user.id).maybeSingle(),
        supabase.from("diary_entries").select("*", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("challenge_progress").select("current_day, total_days").eq("user_id", user.id).limit(1).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle(),
      ]);
      setProfile(p as any);
      setCounts({ diary: diaryCount ?? 0, day: ch?.current_day ?? 0, total: ch?.total_days ?? 7 });
      setIsAdmin(!!roleRow);
      if ((p as any)?.school_code) {
        const { data: s } = await supabase.from("schools").select("display_name").eq("code", (p as any).school_code).maybeSingle();
        setSchoolName((s as any)?.display_name ?? null);
      }
    })();
  }, [user]);

  const name = profile?.display_name || (user?.user_metadata?.display_name as string) || user?.email?.split("@")[0] || "Sahabat";
  const initial = name[0]?.toUpperCase() ?? "S";
  const pct = counts.total ? Math.round((counts.day / counts.total) * 100) : 0;

  return (
    <div>
      <PageHeader title="Profile" />
      <div className="p-5 space-y-5">
        <div className="flex flex-col items-center text-center pt-2">
          <div className="h-24 w-24 rounded-3xl overflow-hidden bg-[image:var(--gradient-primary)] flex items-center justify-center text-3xl font-black text-primary-foreground shadow-[var(--shadow-glow)]">
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
              : initial}
          </div>
          <h2 className="text-xl font-bold mt-3">{name}</h2>
          {profile?.username && <p className="text-xs text-muted-foreground">@{profile.username}</p>}
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {schoolName && (
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 h-7 rounded-full bg-indigo-50 text-indigo-700 text-[11px] font-semibold border border-indigo-100">
              🎓 {schoolName}
            </div>
          )}
          {profile?.bio && <p className="text-xs text-foreground/70 mt-2 max-w-xs">{profile.bio}</p>}
          <Link to="/profile/edit" className="mt-3 px-4 h-8 rounded-full border border-border text-xs font-medium inline-flex items-center hover:bg-muted transition">
            Edit Profil
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Stat icon={NotebookPen} value={counts.diary} label="Diary" />
          <Stat icon={Target} value={counts.day} label="Challenge" />
          <Stat icon={Award} value={Math.floor(counts.diary / 5)} label="Badge" />
        </div>

        {counts.day > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200/60">
            <p className="text-xs text-foreground/70 mb-1">Progress Challenge</p>
            <p className="font-bold mb-2">7 Hari Tanpa Menghina</p>
            <div className="h-2 bg-white/70 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">Hari {counts.day} dari {counts.total}</p>
          </div>
        )}

        <div className="rounded-2xl bg-card border border-border/60 overflow-hidden">
          {menus.map((m, i) => (
            <Link key={m.label} to={m.to}
              className={`w-full flex items-center justify-between px-4 h-14 ${i !== menus.length - 1 ? "border-b border-border/60" : ""}`}>
              <div className="flex items-center gap-3">
                <m.icon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{m.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {isAdmin && (
          <Link to="/admin" className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-indigo-50 text-indigo-700 font-semibold text-sm border border-indigo-200">
            <ShieldCheck className="h-4 w-4" /> Panel Admin
          </Link>
        )}

        <button
          onClick={async () => { await signOut(); toast.success("Sampai jumpa lagi 💙"); nav({ to: "/login" }); }}
          className="w-full flex items-center justify-center gap-2 h-12 rounded-2xl bg-rose-50 text-rose-600 font-semibold text-sm border border-rose-200"
        >
          <LogOut className="h-4 w-4" /> Keluar
        </button>

        <p className="text-center text-[10px] text-muted-foreground pt-2">SafeSpace · v1.0</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: any; value: number; label: string }) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border/60 text-center">
      <Icon className="h-5 w-5 mx-auto text-primary mb-1" />
      <p className="text-xl font-bold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
