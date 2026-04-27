import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_app/report")({
  component: Report,
});

const categories = ["Verbal", "Fisik", "Sosial", "Cyberbullying", "Lainnya"];
const targets = ["Guru BK", "Wali Kelas", "Mentor", "Konselor", "Pihak Sekolah"];

function Report() {
  const [cat, setCat] = useState<string | null>(null);
  const [target, setTarget] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div>
        <PageHeader title="Laporan Terkirim" />
        <div className="p-5 flex flex-col items-center text-center pt-12 space-y-5">
          <div className="h-24 w-24 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Terima kasih sudah berani bersuara 💙</h2>
            <p className="text-sm text-muted-foreground">Laporanmu sudah diteruskan ke {target}. Kamu akan dihubungi dalam 1x24 jam.</p>
          </div>
          <Button variant="hero" size="xl" className="w-full mt-4" onClick={() => setDone(false)}>Selesai</Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Report Center" subtitle="Aman, rahasia & ditangani serius." />
      <div className="p-5 space-y-5">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-100 border border-sky-200/60 flex items-center gap-3">
          <ShieldCheck className="h-5 w-5 text-sky-700" />
          <p className="text-xs text-foreground/80">Identitasmu dilindungi. Hanya pihak yang kamu pilih yang bisa melihat.</p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (cat && target) setDone(true);
          }}
        >
          <div>
            <label className="text-sm font-semibold mb-2 block">Jenis Bullying</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`px-4 h-9 rounded-full text-xs font-medium border transition ${
                    cat === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Lokasi Kejadian</label>
            <Input className="h-12 rounded-xl" placeholder="Contoh: Kelas, kantin, online…" />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Deskripsi</label>
            <textarea
              rows={5}
              className="w-full p-4 rounded-2xl border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Ceritakan apa yang terjadi…"
            />
          </div>

          <div>
            <label className="text-sm font-semibold mb-2 block">Tujuan Laporan</label>
            <div className="space-y-2">
              {targets.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTarget(t)}
                  className={`w-full text-left px-4 h-12 rounded-xl border text-sm font-medium transition ${
                    target === t ? "bg-primary/5 border-primary text-primary" : "border-border"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={!cat || !target}>
            Kirim Laporan
          </Button>
        </form>
      </div>
    </div>
  );
}
