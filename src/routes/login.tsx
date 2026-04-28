import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shield, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { MobileFrame } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const nav = useNavigate();
  const { signIn, session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && session) nav({ to: "/home" });
  }, [loading, session, nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await signIn(email.trim(), password);
    setBusy(false);
    if (error) {
      toast.error("Gagal masuk", { description: error });
      return;
    }
    if (remember) localStorage.setItem("nmb_onboarded", "1");
    toast.success("Selamat datang kembali 💙");
    nav({ to: "/home" });
  };

  return (
    <MobileFrame>
      <div className="min-h-screen flex flex-col p-7">
        <div className="pt-6 space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-soft)] mb-3">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Selamat datang kembali 👋</h1>
          <p className="text-muted-foreground text-sm">Masuk untuk lanjut menemukan ruang amanmu.</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={submit}>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 h-12 rounded-xl" placeholder="kamu@email.com" type="email"
                value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 h-12 rounded-xl" placeholder="••••••••" type="password"
                value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-primary" />
            <span>Ingat saya — tetap masuk saat buka aplikasi</span>
          </label>
          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={busy}>
            {busy ? "Memproses..." : "Masuk"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-auto pt-8">
          Belum punya akun? <Link to="/register" className="text-primary font-semibold">Daftar</Link>
        </p>
      </div>
    </MobileFrame>
  );
}
