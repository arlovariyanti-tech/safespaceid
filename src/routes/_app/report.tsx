import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck, Lock, Loader2 } from "lucide-react";

export const Route = createFileRoute("/_app/report")({
  component: ReportPage,
});

const CATEGORIES = [
  { id: "bullying", label: "Bullying / Perundungan", emoji: "💔" },
  { id: "kekerasan", label: "Kekerasan Fisik", emoji: "🚨" },
  { id: "pelecehan", label: "Pelecehan", emoji: "⚠️" },
  { id: "diskriminasi", label: "Diskriminasi", emoji: "🚷" },
  { id: "lainnya", label: "Lainnya", emoji: "📝" },
];
const SEVERITY = [
  { id: "low", label: "Ringan", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { id: "medium", label: "Sedang", color: "bg-amber-100 text-amber-700 border-amber-200" },
  { id: "high", label: "Mendesak", color: "bg-rose-100 text-rose-700 border-rose-200" },
];

function ReportPage() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [school, setSchool] = useState<string | null>(null);
  const [category, setCategory] = useState("bullying");
  const [severity, setSeverity] = useState("medium");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("school_code").eq("id", user.id).maybeSingle()
      .then(({ data }) => setSchool((data as any)?.school_code ?? null));
  }, [user]);

  const submit = async () => {
    if (!school) return toast.error("Gabung ke sekolah dulu di tab Sekolah");
    if (message.trim().length < 10) return toast.error("Ceritakan lebih detail (min 10 karakter)");
    setSending(true);
    const { error } = await supabase.rpc("submit_anonymous_report", {
      _category: category, _severity: severity, _message: message.trim(),
    });
    setSending(false);
    if (error) return toast.error(error.message);
    toast.success("Laporanmu terkirim secara anonim 🤍");
    nav({ to: "/home" });
  };

  return (
    <div className="pb-32 animate-fade-in">
      <PageHeader
        title="Laporan Aman"
        subtitle="Anonim · Hanya BK sekolahmu yang membaca"
        back={<Link to="/home" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>}
      />
      <div className="p-5 space-y-5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/60">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="h-4 w-4 text-indigo-700" />
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-800">100% Anonim</p>
          </div>
          <p className="text-[11px] text-indigo-900/80 leading-relaxed">
            Identitasmu tidak disimpan. Laporan langsung diteruskan ke Guru BK / Konselor sekolahmu untuk ditindaklanjuti.
          </p>
        </div>

        {!school && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
            ⚠️ Kamu belum bergabung dengan sekolah. <Link to="/school" className="font-bold underline">Gabung sekarang</Link>.
          </div>
        )}

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Kategori</p>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((c) => (
              <button key={c.id} onClick={() => setCategory(c.id)}
                className={`p-3 rounded-2xl border text-left text-xs font-semibold transition ${
                  category === c.id ? "bg-primary/10 border-primary text-primary" : "bg-card border-border text-foreground/70"
                }`}>
                <span className="text-lg block mb-0.5">{c.emoji}</span>{c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Tingkat Urgensi</p>
          <div className="flex gap-2">
            {SEVERITY.map((s) => (
              <button key={s.id} onClick={() => setSeverity(s.id)}
                className={`flex-1 h-10 rounded-xl text-xs font-bold border-2 transition ${
                  severity === s.id ? s.color + " ring-2 ring-offset-1 ring-current/30" : "bg-card border-border text-muted-foreground"
                }`}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Ceritakan apa yang terjadi</p>
          <textarea value={message} onChange={(e) => setMessage(e.target.value.slice(0, 1500))}
            rows={6} placeholder="Tuliskan kejadian, lokasi, waktu, dan siapa yang terlibat. Tetap tenang — kami di sini untukmu."
            className="w-full p-4 rounded-2xl border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <p className="text-[10px] text-muted-foreground text-right mt-1">{message.length}/1500</p>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>Tidak ada nama, email, atau ID yang ikut terkirim. Hanya kode sekolah <b>{school || "—"}</b>.</span>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="max-w-[440px] mx-auto px-5 pb-5 pt-3 bg-gradient-to-t from-background via-background to-transparent pointer-events-auto">
          <Button variant="hero" size="xl" className="w-full shadow-[var(--shadow-glow)]"
            onClick={submit} disabled={sending || !school}>
            {sending ? <><Loader2 className="h-4 w-4 animate-spin" /> Mengirim…</> : "Kirim Laporan Anonim"}
          </Button>
        </div>
      </div>
    </div>
  );
}
