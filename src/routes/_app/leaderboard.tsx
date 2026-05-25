import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Trophy, Medal, Users, GraduationCap } from "lucide-react";

export const Route = createFileRoute("/_app/leaderboard")({
  component: LeaderboardPage,
});

const sb = supabase as any;

type ClassRow = { user_id: string; name: string; avatar: string | null; score: number };
type SchoolRow = { code: string; name: string; members: number; checkins: number; score: number };

function LeaderboardPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<"class" | "school">("class");
  const [classRows, setClassRows] = useState<ClassRow[]>([]);
  const [schoolRows, setSchoolRows] = useState<SchoolRow[]>([]);
  const [className, setClassName] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      // Class leaderboard
      const { data: cm } = await sb.from("class_members").select("class_id").eq("user_id", user.id).maybeSingle();
      if (cm?.class_id) {
        const { data: c } = await sb.from("classes").select("name").eq("id", cm.class_id).maybeSingle();
        setClassName(c?.name ?? null);
        const { data: members } = await sb.from("class_members").select("user_id").eq("class_id", cm.class_id);
        const ids = (members ?? []).map((m: any) => m.user_id);
        if (ids.length) {
          const [{ data: profs }, { data: ps }, { data: sup }] = await Promise.all([
            sb.from("profiles").select("id, display_name, avatar_url").in("id", ids),
            sb.from("class_posts").select("user_id").eq("class_id", cm.class_id),
            sb.from("class_supports").select("user_id, post_id"),
          ]);
          const postCount: Record<string, number> = {};
          (ps ?? []).forEach((p: any) => { postCount[p.user_id] = (postCount[p.user_id] || 0) + 1; });
          const supCount: Record<string, number> = {};
          (sup ?? []).forEach((s: any) => { supCount[s.user_id] = (supCount[s.user_id] || 0) + 1; });
          const rows: ClassRow[] = (profs ?? []).map((p: any) => ({
            user_id: p.id,
            name: p.display_name || "Sahabat",
            avatar: p.avatar_url,
            score: (postCount[p.id] || 0) * 2 + (supCount[p.id] || 0),
          })).sort((a: ClassRow, b: ClassRow) => b.score - a.score);
          setClassRows(rows);
        }
      }

      // School leaderboard
      const [{ data: schools }, { data: profs }, { data: checks }] = await Promise.all([
        sb.from("schools").select("code, display_name").eq("status", "approved"),
        sb.from("profiles").select("school_code"),
        sb.from("school_check_ins").select("school_code"),
      ]);
      const memCount: Record<string, number> = {};
      (profs ?? []).forEach((p: any) => { if (p.school_code) memCount[p.school_code] = (memCount[p.school_code] || 0) + 1; });
      const chkCount: Record<string, number> = {};
      (checks ?? []).forEach((c: any) => { chkCount[c.school_code] = (chkCount[c.school_code] || 0) + 1; });
      const srows: SchoolRow[] = (schools ?? []).map((s: any) => ({
        code: s.code, name: s.display_name,
        members: memCount[s.code] || 0,
        checkins: chkCount[s.code] || 0,
        score: (memCount[s.code] || 0) * 2 + (chkCount[s.code] || 0) * 3,
      })).sort((a: SchoolRow, b: SchoolRow) => b.score - a.score).slice(0, 20);
      setSchoolRows(srows);
    })();
  }, [user]);

  return (
    <div>
      <PageHeader title="Leaderboard" subtitle="Ranking aktivitas positif" />
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-muted">
          <button onClick={() => setTab("class")} className={`py-2 rounded-xl text-sm font-semibold ${tab === "class" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            <Users className="h-4 w-4 inline mr-1" /> Kelas
          </button>
          <button onClick={() => setTab("school")} className={`py-2 rounded-xl text-sm font-semibold ${tab === "school" ? "bg-card shadow-sm" : "text-muted-foreground"}`}>
            <GraduationCap className="h-4 w-4 inline mr-1" /> Sekolah
          </button>
        </div>

        {tab === "class" && (
          <div className="space-y-2">
            {!className && (
              <div className="p-6 rounded-2xl bg-muted/40 text-center text-sm text-muted-foreground">
                Gabung ruang kelas dulu untuk lihat ranking
              </div>
            )}
            {className && (
              <p className="text-xs text-muted-foreground px-1">Kelas: <b className="text-foreground">{className}</b></p>
            )}
            {classRows.map((r, i) => (
              <RankRow key={r.user_id} rank={i + 1} title={r.name} subtitle={`${r.score} poin`} avatarUrl={r.avatar} isMe={r.user_id === user?.id} />
            ))}
          </div>
        )}

        {tab === "school" && (
          <div className="space-y-2">
            {schoolRows.length === 0 && (
              <div className="p-6 rounded-2xl bg-muted/40 text-center text-sm text-muted-foreground">Belum ada data</div>
            )}
            {schoolRows.map((r, i) => (
              <RankRow key={r.code} rank={i + 1} title={r.name} subtitle={`${r.members} anggota · ${r.checkins} aktivitas · ${r.score} poin`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RankRow({ rank, title, subtitle, avatarUrl, isMe }: { rank: number; title: string; subtitle: string; avatarUrl?: string | null; isMe?: boolean }) {
  const medal = rank === 1 ? "bg-amber-100 text-amber-700" : rank === 2 ? "bg-slate-200 text-slate-700" : rank === 3 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground";
  return (
    <div className={`p-3 rounded-2xl border flex items-center gap-3 ${isMe ? "bg-primary/5 border-primary/30" : "bg-card border-border/60"}`}>
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${medal}`}>
        {rank <= 3 ? <Medal className="h-4 w-4" /> : rank}
      </div>
      {avatarUrl !== undefined && (
        avatarUrl
          ? <img src={avatarUrl} className="h-9 w-9 rounded-full object-cover" />
          : <div className="h-9 w-9 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground text-xs font-bold flex items-center justify-center">{title[0]?.toUpperCase()}</div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate">{title} {isMe && <span className="text-[10px] text-primary font-bold">(kamu)</span>}</p>
        <p className="text-[11px] text-muted-foreground">{subtitle}</p>
      </div>
      {rank === 1 && <Trophy className="h-4 w-4 text-amber-600" />}
    </div>
  );
}
