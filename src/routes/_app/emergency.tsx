import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { Instagram, Heart, MessageCircleHeart, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/emergency")({
  component: KonsultasiAman,
});

const IG_HANDLE = "selaaspeaks";
const IG_URL = `https://instagram.com/${IG_HANDLE}`;

const topics = [
  { emoji: "💔", text: "Pengalaman bullying" },
  { emoji: "🏫", text: "Rasa takut ke sekolah" },
  { emoji: "🤝", text: "Masalah pertemanan" },
  { emoji: "📱", text: "Cyberbullying" },
  { emoji: "🪞", text: "Kehilangan percaya diri" },
  { emoji: "🌀", text: "Overthinking" },
  { emoji: "🌧️", text: "Merasa sendirian" },
  { emoji: "👂", text: "Butuh tempat untuk didengar" },
];

function KonsultasiAman() {
  return (
    <div>
      <PageHeader title="Konsultasi Aman" subtitle="Tempat aman untuk bercerita dan didengar." />
      <div className="p-5 space-y-5">
        {/* Hero card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-violet-100 via-pink-100 to-rose-100 border border-white/60">
          <div className="h-12 w-12 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center mb-3">
            <MessageCircleHeart className="h-6 w-6 text-rose-600" />
          </div>
          <h2 className="text-xl font-bold leading-snug mb-2">Butuh teman untuk bercerita?</h2>
          <p className="text-sm leading-relaxed text-foreground/75">
            Kalau kamu sedang lelah, bingung, atau ingin berbagi cerita tentang bullying, perasaan, atau masalah yang kamu alami,
            kamu tidak harus menghadapinya sendiri.
          </p>
          <p className="text-sm leading-relaxed text-foreground/75 mt-3">
            Kamu bisa menghubungi admin <span className="font-semibold">SafeSpace</span> melalui Instagram untuk konsultasi ringan,
            berbagi cerita, dan mendapatkan dukungan.
          </p>
        </div>

        {/* IG handle highlight */}
        <div className="p-5 rounded-3xl bg-card border border-border/60 text-center">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Instagram Konsultasi</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="h-5 w-5 text-pink-600" />
            <p className="text-2xl font-black tracking-tight">@{IG_HANDLE}</p>
          </div>
          <a
            href={IG_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/30 active:scale-[0.98] transition"
          >
            <Instagram className="h-5 w-5" />
            Hubungi via Instagram
          </a>
        </div>

        {/* Safe message */}
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-sm text-emerald-900 leading-snug">
            Semua cerita akan diterima dengan <span className="font-semibold">empati, tanpa menghakimi.</span>
          </p>
        </div>

        {/* Topics */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground">Yang Bisa Kamu Konsultasikan</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {topics.map((t) => (
              <div key={t.text} className="p-3 rounded-2xl bg-card border border-border/60 flex items-center gap-2">
                <span className="text-xl">{t.emoji}</span>
                <p className="text-xs font-medium leading-snug">{t.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Closing note */}
        <div className="p-5 rounded-3xl bg-foreground text-background text-center">
          <Heart className="h-5 w-5 mx-auto mb-2 fill-rose-400 text-rose-400" />
          <p className="text-sm font-semibold leading-snug">
            Kamu berharga. Cerita kamu penting.
          </p>
          <p className="text-xs opacity-70 mt-1">Kami siap mendengarkan kapan pun kamu siap.</p>
        </div>
      </div>
    </div>
  );
}
