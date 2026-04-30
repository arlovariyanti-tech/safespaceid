import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Moon, Sun, Mail, Trash2, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/_app/profile/settings")({
  component: Settings,
});

function applyTheme(dark: boolean) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", dark);
  localStorage.setItem("nmb_theme", dark ? "dark" : "light");
}

function Settings() {
  const nav = useNavigate();
  const { user, signOut } = useAuth();
  const [dark, setDark] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("nmb_theme") === "dark";
    setDark(saved);
  }, []);

  const toggleDark = () => {
    const v = !dark;
    setDark(v);
    applyTheme(v);
    toast.success(v ? "Mode gelap aktif 🌙" : "Mode terang aktif ☀️");
  };

  const changeEmail = async () => {
    if (!newEmail.includes("@")) return toast.error("Email tidak valid");
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Cek email barumu untuk konfirmasi.");
    setNewEmail("");
  };

  const resetData = () => {
    if (!confirm("Reset semua data lokal aplikasi? (preferensi tema, dll). Data di akun tidak terhapus.")) return;
    Object.keys(localStorage).filter(k => k.startsWith("nmb_")).forEach(k => localStorage.removeItem(k));
    applyTheme(false);
    setDark(false);
    toast.success("Data lokal direset");
  };

  const deleteAccount = async () => {
    if (!confirm("Yakin ingin menghapus akun? Tindakan ini tidak bisa dibatalkan.")) return;
    if (!user) return;
    setBusy(true);
    // Delete user data
    await supabase.from("diary_entries").delete().eq("user_id", user.id);
    await supabase.from("community_posts").delete().eq("user_id", user.id);
    await supabase.from("community_comments").delete().eq("user_id", user.id);
    await supabase.from("community_supports").delete().eq("user_id", user.id);
    await supabase.from("challenge_progress").delete().eq("user_id", user.id);
    await supabase.from("profiles").delete().eq("id", user.id);
    await signOut();
    setBusy(false);
    toast.success("Data akun dihapus. Sampai jumpa 💙");
    nav({ to: "/login" });
  };

  return (
    <div>
      <PageHeader title="Pengaturan Akun" left={<Link to="/profile" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>} />
      <div className="p-5 space-y-4">
        <Section title="Tampilan">
          <button onClick={toggleDark} className="w-full flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {dark ? <Moon className="h-5 w-5 text-muted-foreground" /> : <Sun className="h-5 w-5 text-muted-foreground" />}
              <div className="text-left">
                <p className="text-sm font-semibold">Mode Gelap</p>
                <p className="text-[11px] text-muted-foreground">Lebih nyaman di mata saat malam</p>
              </div>
            </div>
            <div className={`relative h-6 w-11 rounded-full transition ${dark ? "bg-primary" : "bg-muted"}`}>
              <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${dark ? "left-[22px]" : "left-0.5"}`} />
            </div>
          </button>
        </Section>

        <Section title="Akun">
          <Link to="/profile/edit" className="w-full flex items-center justify-between p-4 border-b border-border/60">
            <span className="text-sm font-semibold">Edit Nama & Profil</span>
            <span className="text-xs text-muted-foreground">→</span>
          </Link>
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm font-semibold">Ganti Email</p>
            </div>
            <p className="text-[11px] text-muted-foreground">Saat ini: {user?.email}</p>
            <div className="flex gap-2 mt-1">
              <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email-baru@contoh.com"
                type="email"
                className="flex-1 h-10 px-3 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <button onClick={changeEmail} disabled={busy || !newEmail}
                className="px-4 h-10 rounded-xl bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50">Ubah</button>
            </div>
          </div>
        </Section>

        <Section title="Lainnya">
          <button onClick={resetData} className="w-full flex items-center gap-3 p-4 border-b border-border/60 text-left">
            <RotateCcw className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-semibold">Reset Data Aplikasi</p>
              <p className="text-[11px] text-muted-foreground">Hapus preferensi lokal</p>
            </div>
          </button>
          <button onClick={deleteAccount} disabled={busy} className="w-full flex items-center gap-3 p-4 text-left text-rose-600">
            <Trash2 className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold">Hapus Akun</p>
              <p className="text-[11px] text-rose-600/70">Tindakan permanen</p>
            </div>
          </button>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 px-1">{title}</p>
      <div className="rounded-2xl bg-card border border-border/60 overflow-hidden">{children}</div>
    </div>
  );
}
