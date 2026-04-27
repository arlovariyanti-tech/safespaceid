import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { Phone, MessageCircle, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/_app/emergency")({
  component: Emergency,
});

const personal = [
  { name: "Ibu", role: "Orang Tua", phone: "+62 812-3456-7890", color: "bg-rose-100 text-rose-700" },
  { name: "Bu Sari", role: "Guru BK", phone: "+62 813-2222-1111", color: "bg-sky-100 text-sky-700" },
  { name: "Pak Adi", role: "Wali Kelas", phone: "+62 821-9999-8888", color: "bg-emerald-100 text-emerald-700" },
  { name: "Kak Lina", role: "Mentor", phone: "+62 856-7777-1234", color: "bg-violet-100 text-violet-700" },
];

const hotlines = [
  { name: "Kemen PPPA - SAPA 129", phone: "129" },
  { name: "Into The Light Indonesia", phone: "119 ext 8" },
  { name: "Halo Kemenkes", phone: "1500-567" },
];

function Emergency() {
  return (
    <div>
      <PageHeader title="Emergency Contact" subtitle="Hubungi siapapun saat kamu butuh." />
      <div className="p-5 space-y-5">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100 border border-rose-200/60">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 text-rose-700" />
            <h3 className="font-bold">Butuh bantuan segera?</h3>
          </div>
          <p className="text-xs text-foreground/70 mb-3">Tekan tombol di bawah untuk panggilan darurat ke kontak utama.</p>
          <button className="w-full h-12 rounded-xl bg-rose-600 text-white font-semibold flex items-center justify-center gap-2">
            <Phone className="h-4 w-4" /> Panggil Sekarang
          </button>
        </div>

        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Kontak Pribadi</h2>
          <div className="space-y-2">
            {personal.map((p) => (
              <div key={p.name} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border/60">
                <div className={`h-11 w-11 rounded-xl ${p.color} flex items-center justify-center font-bold`}>
                  {p.name[0]}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.role} · {p.phone}</p>
                </div>
                <button className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="h-9 w-9 rounded-full bg-sky-500 text-white flex items-center justify-center">
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Hotline Bantuan</h2>
          <div className="space-y-2">
            {hotlines.map((h) => (
              <div key={h.name} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border/60">
                <div>
                  <p className="font-semibold text-sm">{h.name}</p>
                  <p className="text-xs text-muted-foreground">{h.phone}</p>
                </div>
                <button className="px-4 h-9 rounded-full bg-foreground text-background text-xs font-semibold">Hubungi</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
