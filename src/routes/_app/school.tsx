import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Users, Flame, Star, CalendarDays, Target, Share2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/school")({
  component: SchoolPage,
});

type School = { code: string; display_name: string; daily_target: number };
type Stats = { total: number; activeToday: number; doneToday: number; day: number };

function todayStr() { return new Date().toISOString().slice(0, 10); }

function SchoolPage() {
  const { user } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({ total: 0, activeToday: 0, doneToday: 0, day: 1 });
  const [checkedToday, setCheckedToday] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles").select("school_code, school_joined_at").eq("id", user.id).maybeSingle();
    if (!profile?.school_code) { setSchool(null); return; }
    const { data: s } = await supabase
      .from("schools").select("*").eq("code", profile.school_code).maybeSingle();
    setSchool(s as School);

    const [{ count: total }, { count: doneToday }, { data: myCheck }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("school_code", profile.school_code),
      supabase.from("school_check_ins").select("*", { count: "exact", head: true })
        .eq("school_code", profile.school_code).eq("check_date", todayStr()),
      supabase.from("school_check_ins").select("*").eq("user_id", user.id).eq("check_date", todayStr()).maybeSingle(),
    ]);

    // active today = users who checked in any of the last 1 day (same as doneToday for simplicity)
    const joinedDate = profile.school_joined_at ? new Date(profile.school_joined_at) : new Date();
    const day = Math.min(7, Math.max(1, Math.floor((Date.now() - joinedDate.getTime()) / 86400000) + 1));

    setStats({ total: total ?? 0, activeToday: doneToday ?? 0, doneToday: doneToday ?? 0, day });
    setCheckedToday(!!myCheck);
  };

  useEffect(() => { load(); }, [user]);

  const join = async () => {
    if (!user) return;
    if (!code.trim()) { toast.error("Isi kode sekolahmu dulu"); return; }
    setLoading(true);
    const { data, error } = await supabase.rpc("join_school", {
      _code: code.trim(), _display_name: name.trim() || null,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Berhasil gabung ke ${data}!`);
    setCode(""); setName("");
    load();
  };

  const checkInToday = async () => {
    if (!user || !school) return;
    const { error } = await supabase.from("school_check_ins").insert({
      user_id: user.id, school_code: school.code, check_date: todayStr(), challenge_day: stats.day,
    });
    if (error) {
      if (error.code === "23505") toast.info("Kamu sudah check-in hari ini ✓");
      else toast.error(error.message);
      return;
    }
    toast.success("Check-in tersimpan! 🎉");
    load();
  };

  const share = async () => {
    if (!school) return;
    const text = `Aku dari ${school.display_name} berhasil menyelesaikan Hari ke-${stats.day} 🎉 #NoMoreBully`;
    await supabase.from("community_posts").insert({
      user_id: user!.id, content: text, category: "Challenge", is_anonymous: false,
    });
    toast.success("Dibagikan ke komunitas!");
  };

  if (!school) {
    return (
      <div>
        <PageHeader title="Kode Sekolah" subtitle="Gabung program bersama sekolahmu" />
        <div className="p-5 space-y-5">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-white/60 text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-indigo-700 mb-2" />
            <h2 className="text-xl font-bold mb-1">Masukkan Kode Sekolah Kamu</h2>
            <p className="text-sm text-foreground/70">Gunakan kode dari sekolahmu untuk ikut program bersama.</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Kode Sekolah</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                placeholder="cth: SMAN6MANDAU"
                className="mt-1 h-12 text-base font-mono tracking-wider"
                maxLength={32}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Nama Sekolah (opsional, untuk kode baru)</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="cth: SMAN 6 Mandau"
                className="mt-1 h-12"
                maxLength={80}
              />
            </div>
            <Button variant="hero" size="xl" className="w-full" onClick={join} disabled={loading}>
              {loading ? "Memproses..." : "Gabung Sekolah"}
            </Button>
            <Link to="/home" className="block text-center text-sm text-muted-foreground py-2">Lewati untuk sekarang</Link>
          </div>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
              Data sekolah hanya digunakan untuk statistik program dan tidak menampilkan identitas pribadi.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const pct = school.daily_target > 0 ? Math.min(100, (stats.doneToday / school.daily_target) * 100) : 0;
  const targetReached = stats.doneToday >= school.daily_target;

  return (
    <div>
      <PageHeader title="Sekolahku" subtitle={school.code} />
      <div className="p-5 space-y-5">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-200 border border-white/60">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-800 mb-1">
            <GraduationCap className="h-4 w-4" /> Program Sekolah Aktif
          </div>
          <h2 className="text-xl font-bold leading-tight">{school.display_name} 🎓</h2>
          <p className="text-xs text-foreground/70 mt-1">Hari ke-{stats.day} dari 7</p>
        </div>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Progress Sekolah Kamu</h3>
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={Users} label="Total Peserta" value={stats.total} color="bg-sky-100 text-sky-700" />
            <Stat icon={Flame} label="Aktif Hari Ini" value={stats.activeToday} color="bg-orange-100 text-orange-700" />
            <Stat icon={Star} label="Selesai Hari Ini" value={stats.doneToday} color="bg-amber-100 text-amber-700" />
            <Stat icon={CalendarDays} label="Hari Challenge" value={stats.day} color="bg-emerald-100 text-emerald-700" />
          </div>
        </section>

        <section className="p-5 rounded-2xl bg-card border border-border/60 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold">Progress Hari Ini</p>
            <span className="text-xs font-semibold text-muted-foreground">{Math.round(pct)}%</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-xs text-foreground/70">
            {stats.doneToday} dari {school.daily_target} siswa menyelesaikan challenge hari ini
          </p>
          {targetReached && (
            <div className="mt-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-center text-sm font-semibold text-emerald-800">
              🎉 Sekolahmu berhasil mencapai target hari ini!
            </div>
          )}
        </section>

        <section className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60">
          <div className="flex items-center gap-2 mb-1 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Target className="h-4 w-4" /> Target Harian Sekolah
          </div>
          <p className="text-sm font-semibold">{school.daily_target} siswa per hari</p>
        </section>

        {checkedToday ? (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-sm font-semibold text-emerald-800">
            ✓ Kamu sudah check-in hari ini. Sampai besok ya!
          </div>
        ) : (
          <Button variant="hero" size="xl" className="w-full" onClick={checkInToday}>
            ☑ Tandai Selesai Hari Ini
          </Button>
        )}

        <button onClick={share} className="w-full h-12 rounded-2xl border border-border bg-card flex items-center justify-center gap-2 text-sm font-semibold">
          <Share2 className="h-4 w-4" /> Bagikan Progress ke Komunitas
        </button>

        <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-foreground/70">
            Data sekolah hanya digunakan untuk statistik program dan tidak menampilkan identitas pribadi.
          </p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border/60">
      <div className={`h-9 w-9 rounded-xl ${color} flex items-center justify-center mb-2`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="font-bold text-lg">{value}</p>
    </div>
  );
}
