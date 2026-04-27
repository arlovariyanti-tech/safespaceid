import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shield, Mail, Lock } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const nav = useNavigate();
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

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            nav({ to: "/home" });
          }}
        >
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 h-12 rounded-xl" placeholder="kamu@email.com" type="email" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 h-12 rounded-xl" placeholder="••••••••" type="password" required />
            </div>
          </div>
          <div className="text-right">
            <a className="text-xs text-primary font-medium">Lupa password?</a>
          </div>
          <Button type="submit" variant="hero" size="xl" className="w-full">Masuk</Button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">atau</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <Button variant="outlineHero" size="xl" className="w-full">
          Lanjutkan dengan Google
        </Button>

        <p className="text-center text-sm text-muted-foreground mt-auto pt-8">
          Belum punya akun?{" "}
          <Link to="/register" className="text-primary font-semibold">Daftar</Link>
        </p>
      </div>
    </MobileFrame>
  );
}
