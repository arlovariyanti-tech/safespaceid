import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shield, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { MobileFrame } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const nav = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }
    setBusy(true);
    const { error } = await signUp(email.trim(), password, name.trim());
    setBusy(false);
    if (error) {
      toast.error("Gagal daftar", { description: error });
      return;
    }
    localStorage.setItem("nmb_onboarded", "1");
    toast.success("Akun berhasil dibuat! 🎉");
    nav({ to: "/home" });
  };

  return (
    <MobileFrame>
      <div className="min-h-screen flex flex-col p-7">
        <div className="pt-6 space-y-2">
          <div className="h-14 w-14 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-soft)] mb-3">
            <Shield className="h-7 w-7 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">Buat akun baru ✨</h1>
          <p className="text-muted-foreground text-sm">Bergabung di komunitas yang peduli & saling mendukung.</p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={submit}>
          <Field icon={User} label="Nama" placeholder="Nama lengkap" value={name} onChange={(e) => setName(e.target.value)} />
          <Field icon={Mail} label="Email" placeholder="kamu@email.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Field icon={Lock} label="Password" placeholder="Minimal 6 karakter" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button type="submit" variant="hero" size="xl" className="w-full mt-2" disabled={busy}>
            {busy ? "Memproses..." : "Daftar"}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4 px-6">
          Dengan mendaftar kamu menyetujui Syarat & Kebijakan Privasi kami.
        </p>

        <p className="text-center text-sm text-muted-foreground mt-auto pt-8">
          Sudah punya akun? <Link to="/login" className="text-primary font-semibold">Masuk</Link>
        </p>
      </div>
    </MobileFrame>
  );
}

function Field({ icon: Icon, label, ...rest }: { icon: typeof User; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input className="pl-10 h-12 rounded-xl" required {...rest} />
      </div>
    </div>
  );
}
