import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Shield, User, Mail, Lock } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const nav = useNavigate();
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

        <form
          className="mt-8 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            nav({ to: "/home" });
          }}
        >
          <Field icon={User} label="Nama" placeholder="Nama lengkap" />
          <Field icon={Mail} label="Email" placeholder="kamu@email.com" type="email" />
          <Field icon={Lock} label="Password" placeholder="••••••••" type="password" />

          <Button type="submit" variant="hero" size="xl" className="w-full mt-2">Daftar</Button>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-4 px-6">
          Dengan mendaftar kamu menyetujui Syarat & Kebijakan Privasi kami.
        </p>

        <p className="text-center text-sm text-muted-foreground mt-auto pt-8">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-primary font-semibold">Masuk</Link>
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
