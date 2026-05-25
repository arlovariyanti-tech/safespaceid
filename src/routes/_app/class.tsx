import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import {
  GraduationCap, Users, Copy, KeyRound, UserCheck, School as SchoolIcon,
  ArrowLeft, LogOut, Sparkles, RefreshCw, Plus, Send, Heart, Crown, Shield,
} from "lucide-react";
import { censorProfanity } from "@/lib/profanity";

export const Route = createFileRoute("/_app/class")({
  component: ClassPage,
});

type Klass = { id: string; name: string; code: string; school_code: string; created_by: string };
type Member = { id: string; user_id: string; role: string; profile?: { display_name: string | null; avatar_url: string | null } };
type Post = { id: string; user_id: string; content: string; is_anonymous: boolean; mood: string | null; created_at: string; profile?: { display_name: string | null; avatar_url: string | null }; supports: number; supported: boolean };

const sb = supabase as any;

function ClassPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [klass, setKlass] = useState<Klass | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isHomeroom, setIsHomeroom] = useState(false);
  const [schoolCode, setSchoolCode] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [view, setView] = useState<"feed" | "manage">("feed");

  // wizard state
  const [step, setStep] = useState<"role" | "student" | "verifyWalas" | "createClass">("role");
  const [classCode, setClassCode] = useState("");
  const [walasCode, setWalasCode] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [busy, setBusy] = useState(false);

  // composer
  const [newPost, setNewPost] = useState("");
  const [anon, setAnon] = useState(false);

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const { data: prof } = await sb.from("profiles").select("school_code").eq("id", user.id).maybeSingle();
    const sc = prof?.school_code ?? null;
    setSchoolCode(sc);
    if (sc) {
      const { data: s } = await sb.from("schools").select("display_name").eq("code", sc).maybeSingle();
      setSchoolName(s?.display_name ?? null);
    }
    const { data: cm } = await sb.from("class_members").select("class_id, role").eq("user_id", user.id).maybeSingle();
    if (!cm) { setKlass(null); setLoading(false); return; }
    setIsHomeroom(cm.role === "homeroom");
    const { data: c } = await sb.from("classes").select("id, name, code, school_code, created_by").eq("id", cm.class_id).maybeSingle();
    setKlass(c);
    if (c) await loadFeed(c.id);
    setLoading(false);
  };

  const loadFeed = async (classId: string) => {
    const [{ data: ms }, { data: ps }, { data: sups }] = await Promise.all([
      sb.from("class_members").select("id, user_id, role").eq("class_id", classId),
      sb.from("class_posts").select("id, user_id, content, is_anonymous, mood, created_at").eq("class_id", classId).order("created_at", { ascending: false }).limit(30),
      sb.from("class_supports").select("post_id, user_id"),
    ]);
    const userIds = Array.from(new Set([...(ms ?? []).map((m: any) => m.user_id), ...(ps ?? []).map((p: any) => p.user_id)]));
    const { data: profs } = await sb.from("profiles").select("id, display_name, avatar_url").in("id", userIds.length ? userIds : ["00000000-0000-0000-0000-000000000000"]);
    const pmap = new Map((profs ?? []).map((p: any) => [p.id, p]));
    setMembers((ms ?? []).map((m: any) => ({ ...m, profile: pmap.get(m.user_id) })));
    const supCount: Record<string, number> = {};
    const mySup: Record<string, boolean> = {};
    (sups ?? []).forEach((s: any) => {
      supCount[s.post_id] = (supCount[s.post_id] || 0) + 1;
      if (s.user_id === user?.id) mySup[s.post_id] = true;
    });
    setPosts((ps ?? []).map((p: any) => ({ ...p, profile: pmap.get(p.user_id), supports: supCount[p.id] || 0, supported: !!mySup[p.id] })));
  };

  useEffect(() => { load(); }, [user]);

  // ===== wizard actions =====
  const joinAsStudent = async () => {
    setBusy(true);
    const { error } = await sb.rpc("join_class", { _code: classCode.trim().toUpperCase() });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Berhasil masuk ruang kelas! 🎉");
    setClassCode(""); load();
  };

  const verifyWalas = async () => {
    setBusy(true);
    const { error } = await sb.rpc("verify_homeroom_code", { _code: walasCode.trim().toUpperCase() });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Kode walas terverifikasi ✓");
    setStep("createClass");
  };

  const createClass = async () => {
    if (!newClassName.trim()) { toast.error("Nama kelas wajib diisi"); return; }
    setBusy(true);
    const { data, error } = await sb.rpc("create_class", { _name: newClassName.trim() });
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Ruang kelas dibuat! Kode: ${data}`);
    setNewClassName(""); setWalasCode(""); load();
  };

  // ===== feed actions =====
  const submitPost = async () => {
    if (!klass || !newPost.trim() || !user) return;
    const clean = censorProfanity(newPost.trim());
    const { error } = await sb.from("class_posts").insert({
      class_id: klass.id, user_id: user.id, content: clean, is_anonymous: anon,
    });
    if (error) { toast.error(error.message); return; }
    setNewPost(""); setAnon(false);
    toast.success("Postingan terkirim ✨");
    loadFeed(klass.id);
  };

  const toggleSupport = async (p: Post) => {
    if (!user || !klass) return;
    if (p.supported) {
      await sb.from("class_supports").delete().eq("post_id", p.id).eq("user_id", user.id);
    } else {
      await sb.from("class_supports").insert({ post_id: p.id, user_id: user.id });
    }
    loadFeed(klass.id);
  };

  const resetCode = async () => {
    if (!klass) return;
    if (!confirm("Yakin reset kode kelas? Siswa yang sudah masuk tetap di kelas, tapi kode lama tidak berlaku lagi.")) return;
    const { data, error } = await sb.rpc("reset_class_code", { _class_id: klass.id });
    if (error) { toast.error(error.message); return; }
    toast.success(`Kode baru: ${data}`);
    load();
  };

  const leaveClass = async () => {
    if (!confirm("Keluar dari ruang kelas?")) return;
    if (isHomeroom) {
      toast.error("Wali kelas tidak bisa keluar. Hapus kelas dari panel manage.");
      return;
    }
    const { error } = await sb.rpc("leave_class");
    if (error) { toast.error(error.message); return; }
    toast.success("Keluar kelas berhasil");
    setKlass(null); load();
  };

  // ===== render =====
  if (loading) return <div className="p-8 text-center text-sm text-muted-foreground">Memuat...</div>;

  // Not joined any school
  if (!schoolCode) {
    return (
      <div>
        <PageHeader title="Ruang Kelas" subtitle="Gabung sekolahmu dulu" />
        <div className="p-5">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 text-center space-y-3">
            <SchoolIcon className="h-12 w-12 mx-auto text-indigo-600" />
            <p className="font-bold text-lg">Belum gabung sekolah</p>
            <p className="text-sm text-muted-foreground">Kamu perlu masuk komunitas sekolah dulu sebelum bisa masuk ruang kelas.</p>
            <Link to="/school"><Button variant="hero" size="lg" className="mt-2">Gabung Sekolah →</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  // Wizard mode (no class yet)
  if (!klass) {
    return (
      <div>
        <PageHeader title="Ruang Kelas" subtitle={schoolName ?? schoolCode} />
        <div className="p-5 space-y-4">
          {step === "role" && (
            <>
              <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-100 border border-white/60 text-center">
                <GraduationCap className="h-12 w-12 mx-auto text-indigo-700 mb-2" />
                <h2 className="text-lg font-bold">Pilih Peranmu di Kelas</h2>
                <p className="text-sm text-foreground/70 mt-1">Tentukan cara kamu bergabung ke ruang kelas.</p>
              </div>
              <RoleCard
                icon={UserCheck} title="Masuk sebagai Siswa" desc="Punya kode kelas dari wali kelas? Masuk di sini."
                color="from-sky-50 to-blue-50 text-sky-700"
                onClick={() => setStep("student")}
              />
              <RoleCard
                icon={Crown} title="Masuk sebagai Wali Kelas" desc="Buat & kelola ruang kelas. Perlu kode verifikasi walas."
                color="from-amber-50 to-orange-50 text-amber-700"
                onClick={() => setStep("verifyWalas")}
              />
            </>
          )}

          {step === "student" && (
            <WizardForm
              title="Masukkan Kode Kelas"
              subtitle="Kode diberikan oleh wali kelasmu"
              onBack={() => setStep("role")}
            >
              <Input
                value={classCode}
                onChange={(e) => setClassCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                placeholder="cth: XIIPA1-A92K"
                className="h-14 text-lg font-mono tracking-wider text-center"
                maxLength={32}
              />
              <Button variant="hero" size="xl" className="w-full" onClick={joinAsStudent} disabled={busy || !classCode.trim()}>
                {busy ? "Memproses..." : "Masuk Ruang Kelas"}
              </Button>
            </WizardForm>
          )}

          {step === "verifyWalas" && (
            <WizardForm
              title="Verifikasi Wali Kelas"
              subtitle="Masukkan kode walas dari admin sekolah"
              onBack={() => setStep("role")}
            >
              <Input
                value={walasCode}
                onChange={(e) => setWalasCode(e.target.value.toUpperCase().replace(/\s+/g, ""))}
                placeholder="cth: WK-AB12CD"
                className="h-14 text-lg font-mono tracking-wider text-center"
                maxLength={32}
              />
              <Button variant="hero" size="xl" className="w-full" onClick={verifyWalas} disabled={busy || !walasCode.trim()}>
                {busy ? "Memverifikasi..." : "Verifikasi Kode"}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                Belum punya kode? Minta admin SafeSpace generate untuk sekolahmu.
              </p>
            </WizardForm>
          )}

          {step === "createClass" && (
            <WizardForm
              title="Buat Ruang Kelas"
              subtitle="Beri nama kelasmu — format bebas"
              onBack={() => setStep("verifyWalas")}
            >
              <Input
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="cth: XI IPA 1, 7B, X TKJ 2"
                className="h-14 text-base"
                maxLength={40}
              />
              <Button variant="hero" size="xl" className="w-full" onClick={createClass} disabled={busy}>
                {busy ? "Membuat..." : "Buat Ruang Kelas"}
              </Button>
              <p className="text-[11px] text-muted-foreground text-center">
                Sistem akan otomatis generate kode unik untuk dibagikan ke siswa.
              </p>
            </WizardForm>
          )}
        </div>
      </div>
    );
  }

  // Manage view (homeroom)
  if (view === "manage" && isHomeroom) {
    const students = members.filter(m => m.role === "student");
    return (
      <div>
        <PageHeader
          title="Kelola Kelas"
          subtitle={klass.name}
          back={<button onClick={() => setView("feed")} className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></button>}
        />
        <div className="p-5 space-y-5">
          <div className="p-5 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-800 mb-1">
              <Crown className="h-4 w-4" /> Wali Kelas Dashboard
            </div>
            <h2 className="text-xl font-bold">{klass.name}</h2>
            <p className="text-xs text-foreground/70 mt-0.5">{schoolName}</p>
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => { navigator.clipboard.writeText(klass.code); toast.success("Kode disalin"); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/80 text-xs font-mono font-bold"
              >
                <Copy className="h-3 w-3" /> {klass.code}
              </button>
              <button onClick={resetCode} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/60 text-xs font-semibold">
                <RefreshCw className="h-3 w-3" /> Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Siswa" value={students.length} color="bg-sky-100 text-sky-700" />
            <StatCard label="Posting" value={posts.length} color="bg-violet-100 text-violet-700" />
            <StatCard label="Support" value={posts.reduce((s,p)=>s+p.supports,0)} color="bg-rose-100 text-rose-700" />
          </div>

          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Anggota Kelas</h3>
            <div className="space-y-2">
              {members.map(m => (
                <div key={m.id} className="p-3 rounded-2xl bg-card border border-border/60 flex items-center gap-3">
                  <Avatar p={m.profile} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{m.profile?.display_name || "Anonim"}</p>
                    <p className="text-[11px] text-muted-foreground">{m.role === "homeroom" ? "👑 Wali Kelas" : "Siswa"}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex gap-3">
            <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/70">
              Sebagai walas kamu <b>tidak bisa</b> melihat diary pribadi siswa. Hanya statistik kelas dan postingan publik di ruang kelas.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Feed (member view)
  return (
    <div>
      <PageHeader title={klass.name} subtitle={schoolName ?? schoolCode} />
      <div className="p-5 space-y-4">
        <div className="p-4 rounded-3xl bg-gradient-to-br from-indigo-100 to-violet-200 border border-white/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800">
              <GraduationCap className="h-3.5 w-3.5" /> Ruang Kelas
            </div>
            <p className="font-extrabold text-lg leading-tight mt-0.5">{klass.name}</p>
            <p className="text-[11px] text-foreground/70">{members.length} anggota</p>
          </div>
          {isHomeroom && (
            <button onClick={() => setView("manage")} className="px-3 py-2 rounded-xl bg-white/80 text-xs font-bold inline-flex items-center gap-1">
              <Crown className="h-3.5 w-3.5" /> Kelola
            </button>
          )}
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
          <Textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Bagikan sesuatu ke kelasmu..."
            className="min-h-[70px] resize-none"
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} /> Anonim
            </label>
            <Button size="sm" onClick={submitPost} disabled={!newPost.trim()}>
              <Send className="h-3.5 w-3.5 mr-1" /> Posting
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {posts.length === 0 && (
            <div className="p-6 rounded-2xl bg-muted/30 text-center text-sm text-muted-foreground">
              Belum ada postingan. Jadi yang pertama ✨
            </div>
          )}
          {posts.map(p => (
            <div key={p.id} className="p-4 rounded-2xl bg-card border border-border/60">
              <div className="flex items-center gap-2 mb-2">
                {p.is_anonymous
                  ? <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs">🙈</div>
                  : <Avatar p={p.profile} />}
                <div className="flex-1">
                  <p className="text-xs font-semibold">{p.is_anonymous ? "Anonim" : (p.profile?.display_name || "Sahabat")}</p>
                  <p className="text-[10px] text-muted-foreground">{new Date(p.created_at).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</p>
                </div>
              </div>
              <p className="text-sm whitespace-pre-wrap">{p.content}</p>
              <button
                onClick={() => toggleSupport(p)}
                className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                  p.supported ? "bg-rose-100 text-rose-700" : "bg-muted text-muted-foreground"
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${p.supported ? "fill-rose-500 text-rose-500" : ""}`} /> {p.supports} Support
              </button>
            </div>
          ))}
        </div>

        {!isHomeroom && (
          <button onClick={leaveClass} className="w-full text-xs text-muted-foreground py-2 inline-flex items-center justify-center gap-1">
            <LogOut className="h-3 w-3" /> Keluar dari kelas
          </button>
        )}
      </div>
    </div>
  );
}

function RoleCard({ icon: Icon, title, desc, color, onClick }: any) {
  return (
    <button onClick={onClick} className={`w-full p-5 rounded-2xl bg-gradient-to-br ${color} border border-white/60 text-left active:scale-[0.98] transition`}>
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-white/80 flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-bold">{title}</p>
          <p className="text-xs opacity-80">{desc}</p>
        </div>
      </div>
    </button>
  );
}

function WizardForm({ title, subtitle, children, onBack }: any) {
  return (
    <div className="space-y-4">
      <button onClick={onBack} className="inline-flex items-center gap-1 text-xs text-muted-foreground"><ArrowLeft className="h-3 w-3" /> Kembali</button>
      <div>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-3 rounded-2xl bg-card border border-border/60 text-center">
      <div className={`h-8 w-8 rounded-lg mx-auto mb-1 ${color} flex items-center justify-center`}>
        <Sparkles className="h-4 w-4" />
      </div>
      <p className="text-xl font-extrabold">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Avatar({ p }: { p?: { display_name: string | null; avatar_url: string | null } }) {
  if (p?.avatar_url) return <img src={p.avatar_url} className="h-8 w-8 rounded-full object-cover" />;
  const i = (p?.display_name || "S")[0].toUpperCase();
  return <div className="h-8 w-8 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground text-xs font-bold flex items-center justify-center">{i}</div>;
}
