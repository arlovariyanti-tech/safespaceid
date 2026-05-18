import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Users, Flame, Star, CalendarDays, Share2, ShieldCheck, Plus, LogOut, Copy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/school")({
  component: SchoolPage,
});

type School = { code: string; display_name: string; daily_target: number; city?: string | null };
type Stats = { total: number; doneToday: number; day: number };

function todayStr() { return new Date().toISOString().slice(0, 10); }

function SchoolPage() {
  const { user } = useAuth();
  const [school, setSchool] = useState<School | null>(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"choose" | "join" | "register">("choose");
  const [stats, setStats] = useState<Stats>({ total: 0, doneToday: 0, day: 1 });
  const [checkedToday, setCheckedToday] = useState(false);

  // register form
  const [rName, setRName] = useState("");
  const [rCity, setRCity] = useState("");
  const [rSubmitter, setRSubmitter] = useState("");
  const [rContact, setRContact] = useState("");

  const load = async () => {
    if (!user) return;
    const { data: profile } = await supabase
      .from("profiles").select("school_code, school_joined_at").eq("id", user.id).maybeSingle();
    if (!profile?.school_code) { setSchool(null); return; }
    const { data: s } = await supabase
      .from("schools").select("code, display_name, daily_target, city").eq("code", profile.school_code).maybeSingle();
    if (!s) { setSchool(null); return; }
    setSchool(s as School);

    const [{ count: total }, { count: doneToday }, { data: myCheck }] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("school_code", profile.school_code),
      supabase.from("school_check_ins").select("*", { count: "exact", head: true })
        .eq("school_code", profile.school_code).eq("check_date", todayStr()),
      supabase.from("school_check_ins").select("*").eq("user_id", user.id).eq("check_date", todayStr()).maybeSingle(),
    ]);

    const joinedDate = profile.school_joined_at ? new Date(profile.school_joined_at) : new Date();
    const day = Math.min(7, Math.max(1, Math.floor((Date.now() - joinedDate.getTime()) / 86400000) + 1));

    setStats({ total: total ?? 0, doneToday: doneToday ?? 0, day });
    setCheckedToday(!!myCheck);
  };

  useEffect(() => { load(); }, [user]);

  const join = async () => {
    if (!user) return;
    if (!code.trim()) { toast.error("Masukkan kode sekolah"); return; }
    setLoading(true);
    const { data, error } = await supabase.rpc("join_school", { _code: code.trim() });
    setLoading(false);
    if (error) { toast.error(error.message || "Kode tidak ditemukan"); return; }
    toast.success(`Berhasil gabung komunitas ${data}!`);
    setCode("");
    load();
  };

  const submitSchool = async () => {
    if (!user) return;
    if (!rName.trim() || !rCity.trim()) { toast.error("Nama sekolah & kota wajib diisi"); return; }
    setLoading(true);
    const { error } = await supabase.rpc("submit_school", {
      _name: rName.trim(),
      _city: rCity.trim(),
      _submitter_name: rSubmitter.trim() || undefined,
      _contact: rContact.trim() || undefined,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Pengajuan terkirim! Tunggu verifikasi admin ya.");
    setRName(""); setRCity(""); setRSubmitter(""); setRContact("");
    setMode("choose");
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
    toast.success("Check-in tersimpan! +10 poin untuk komunitasmu 🎉");
    load();
  };

  const share = async () => {
    if (!school) return;
    const text = `Aku bagian dari komunitas ${school.display_name} 🎓 #SafeSpace`;
    await supabase.from("community_posts").insert({
      user_id: user!.id, content: text, category: "Komunitas", is_anonymous: false,
    });
    toast.success("Dibagikan ke feed komunitas!");
  };

  const leaveSchool = async () => {
    if (!user) return;
    if (!confirm("Keluar dari komunitas sekolah ini?")) return;
    await supabase.from("profiles").update({ school_code: null, school_joined_at: null }).eq("id", user.id);
    toast.success("Kamu sudah keluar dari komunitas");
    setSchool(null);
    setMode("choose");
  };

  // ===== Member view =====
  if (school) {
    const pct = school.daily_target > 0 ? Math.min(100, (stats.doneToday / school.daily_target) * 100) : 0;
    return (
      <div>
        <PageHeader title="Komunitas Sekolahmu" subtitle={school.code} />
        <div className="p-5 space-y-5">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-200 border border-white/60">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-800 mb-1">
              <GraduationCap className="h-4 w-4" /> Kamu bagian dari komunitas
            </div>
            <h2 className="text-xl font-bold leading-tight">{school.display_name} 🎓</h2>
            {school.city && <p className="text-xs text-foreground/70 mt-0.5">{school.city}</p>}
            <button
              onClick={() => { navigator.clipboard.writeText(school.code); toast.success("Kode disalin"); }}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/70 text-xs font-mono font-bold"
            >
              <Copy className="h-3 w-3" /> {school.code}
            </button>
          </div>

          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">Aktivitas Komunitas</h3>
            <div className="grid grid-cols-3 gap-3">
              <Stat icon={Users} label="Anggota" value={stats.total} color="bg-sky-100 text-sky-700" />
              <Stat icon={Flame} label="Aktif Hari Ini" value={stats.doneToday} color="bg-orange-100 text-orange-700" />
              <Stat icon={Star} label="Poin Hari Ini" value={stats.doneToday * 10} color="bg-amber-100 text-amber-700" />
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
              {stats.doneToday} dari {school.daily_target} anggota beraktivitas hari ini
            </p>
          </section>

          {checkedToday ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-sm font-semibold text-emerald-800">
              ✓ Aktivitasmu hari ini sudah tercatat
            </div>
          ) : (
            <Button variant="hero" size="xl" className="w-full" onClick={checkInToday}>
              ☑ Catat Aktivitas Hari Ini (+10 poin)
            </Button>
          )}

          <button onClick={share} className="w-full h-12 rounded-2xl border border-border bg-card flex items-center justify-center gap-2 text-sm font-semibold">
            <Share2 className="h-4 w-4" /> Bagikan ke Feed Komunitas
          </button>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
              Diary & data pribadi tetap privat — sekolah hanya melihat statistik agregat tanpa identitas.
            </p>
          </div>

          <button onClick={leaveSchool} className="w-full text-xs text-muted-foreground py-2 inline-flex items-center justify-center gap-1">
            <LogOut className="h-3 w-3" /> Keluar dari komunitas
          </button>
        </div>
      </div>
    );
  }

  // ===== Register form =====
  if (mode === "register") {
    return (
      <div>
        <PageHeader title="Tambahkan Sekolahmu" subtitle="Ajukan sekolahmu ke SafeSpace" />
        <div className="p-5 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-200/60 text-sm text-foreground/80">
            Pengajuan akan diverifikasi tim SafeSpace. Setelah disetujui, kode resmi akan otomatis dibuat oleh sistem.
          </div>
          <Field label="Nama Sekolah *" value={rName} onChange={setRName} placeholder="cth: SMA Negeri 1 Jakarta" />
          <Field label="Kota / Daerah *" value={rCity} onChange={setRCity} placeholder="cth: Jakarta Selatan" />
          <Field label="Nama Pengaju (opsional)" value={rSubmitter} onChange={setRSubmitter} placeholder="Namamu" />
          <Field label="Kontak (opsional)" value={rContact} onChange={setRContact} placeholder="Email / IG / WA" />
          <Button variant="hero" size="xl" className="w-full" onClick={submitSchool} disabled={loading}>
            {loading ? "Mengirim..." : "Kirim Pengajuan"}
          </Button>
          <button onClick={() => setMode("choose")} className="w-full text-sm text-muted-foreground py-2">Kembali</button>
        </div>
      </div>
    );
  }

  // ===== Join form =====
  if (mode === "join") {
    return (
      <div>
        <PageHeader title="Gabung Komunitas Sekolah" subtitle="Masukkan kode resmi sekolahmu" />
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Kode Sekolah</label>
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
              placeholder="cth: NMB-1023"
              className="mt-1 h-12 text-base font-mono tracking-wider text-center"
              maxLength={32}
            />
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Kode hanya bisa dibuat oleh sistem setelah sekolah disetujui admin. Belum punya kode?{" "}
              <button onClick={() => setMode("register")} className="text-primary font-semibold underline">Ajukan sekolahmu</button>
            </p>
          </div>
          <Button variant="hero" size="xl" className="w-full" onClick={join} disabled={loading}>
            {loading ? "Memproses..." : "Gabung Komunitas"}
          </Button>
          <button onClick={() => setMode("choose")} className="w-full text-sm text-muted-foreground py-2">Kembali</button>
        </div>
      </div>
    );
  }

  // ===== Choose =====
  return (
    <div>
      <PageHeader title="Komunitas Sekolah" subtitle="Bergabung dengan gerakan bersama" />
      <div className="p-5 space-y-4">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-white/60 text-center">
          <GraduationCap className="h-12 w-12 mx-auto text-indigo-700 mb-2" />
          <h2 className="text-xl font-bold mb-1">Pilih Cara Mainmu</h2>
          <p className="text-sm text-foreground/70">SafeSpace adalah platform independen. Sekolah hadir sebagai komunitas pengguna.</p>
        </div>

        <button
          onClick={() => setMode("join")}
          className="w-full p-5 rounded-2xl bg-card border-2 border-primary/20 hover:border-primary text-left transition"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Gabung Komunitas Sekolah</p>
              <p className="text-xs text-muted-foreground">Punya kode dari sekolahmu? Masuk di sini.</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setMode("register")}
          className="w-full p-5 rounded-2xl bg-card border border-border text-left hover:border-primary/40 transition"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Plus className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Tambahkan Sekolahmu</p>
              <p className="text-xs text-muted-foreground">Ajukan sekolahmu untuk dibuatkan kode resmi.</p>
            </div>
          </div>
        </button>

        <Link
          to="/home"
          className="block w-full p-5 rounded-2xl bg-muted/50 border border-border text-left hover:bg-muted transition"
        >
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-slate-200 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-slate-700" />
            </div>
            <div className="flex-1">
              <p className="font-bold">Gunakan Secara Pribadi</p>
              <p className="text-xs text-muted-foreground">Tetap pakai semua fitur tanpa bergabung sekolah.</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1 h-12" maxLength={120} />
    </div>
  );
}

function Stat({ icon: Icon, label, value, color }: { icon: any; label: string; value: number; color: string }) {
  return (
    <div className="p-3 rounded-2xl bg-card border border-border/60">
      <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center mb-2`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-[10px] text-muted-foreground leading-tight">{label}</p>
      <p className="font-bold text-base">{value}</p>
    </div>
  );
}
