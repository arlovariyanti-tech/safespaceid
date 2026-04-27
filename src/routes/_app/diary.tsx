import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import {
  Lock, Plus, Smile, Frown, Meh, Heart, Angry, Moon, Wind, Star, Calendar,
  Sparkles, ShieldCheck, Phone,
} from "lucide-react";

export const Route = createFileRoute("/_app/diary")({
  component: Diary,
});

const moods = [
  { key: "senang", emoji: "😊", label: "Senang", icon: Smile, color: "bg-emerald-100 text-emerald-700" },
  { key: "sedih", emoji: "😔", label: "Sedih", icon: Frown, color: "bg-blue-100 text-blue-700" },
  { key: "cemas", emoji: "😰", label: "Cemas", icon: Wind, color: "bg-amber-100 text-amber-700" },
  { key: "marah", emoji: "😡", label: "Marah", icon: Angry, color: "bg-rose-100 text-rose-700" },
  { key: "lelah", emoji: "😴", label: "Lelah", icon: Moon, color: "bg-violet-100 text-violet-700" },
  { key: "tenang", emoji: "😌", label: "Tenang", icon: Heart, color: "bg-sky-100 text-sky-700" },
];

const prompts = [
  "Apa yang paling membuatmu lelah hari ini?",
  "Siapa yang paling membuatmu merasa didengar hari ini?",
  "Apa hal kecil yang membuatmu bersyukur hari ini?",
  "Apa yang ingin kamu lepaskan hari ini?",
  "Apa yang ingin kamu katakan pada dirimu sendiri hari ini?",
  "Apa pencapaian kecil yang patut kamu rayakan hari ini?",
  "Hal apa yang ingin kamu maafkan dari dirimu sendiri?",
];

const responses: Record<string, string> = {
  senang: "Senang bisa membaca harimu! Pelihara perasaan baik ini ya 💛",
  sedih: "Perasaanmu valid. Kamu tidak harus selalu terlihat baik-baik saja.",
  cemas: "Tarik napas perlahan. Kamu aman di sini, dan kamu sudah sangat berani.",
  marah: "Marah itu wajar. Terima kasih sudah menyalurkannya di tempat yang aman.",
  lelah: "Kadang lelah itu wajar. Istirahat juga bagian dari proses.",
  tenang: "Tetap pelihara ketenangan ini. Kamu pantas mendapatkannya.",
};

const initialEntries = [
  { date: "Hari ini", mood: "sedih", text: "Hari ini agak berat. Tapi setidaknya aku punya tempat untuk menulis…", fav: false },
  { date: "Kemarin", mood: "cemas", text: "Aku coba bicara ke teman dekat. Lega rasanya.", fav: true },
  { date: "2 hari lalu", mood: "senang", text: "Ada teman baru yang baik banget di kelas!", fav: false },
  { date: "3 hari lalu", mood: "cemas", text: "Besok ada presentasi, deg-degan banget.", fav: false },
];

function Diary() {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [writing, setWriting] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [saved, setSaved] = useState<{ mood: string } | null>(null);
  const [entries, setEntries] = useState(initialEntries);
  const [tab, setTab] = useState<"all" | "fav">("all");

  const todayPrompt = useMemo(() => {
    const day = new Date().getDate();
    return prompts[day % prompts.length];
  }, []);

  // dominant mood this week
  const dominant = useMemo(() => {
    const counts: Record<string, number> = {};
    entries.forEach((e) => (counts[e.mood] = (counts[e.mood] || 0) + 1));
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "tenang";
  }, [entries]);

  const summary =
    dominant === "cemas" || dominant === "sedih"
      ? "Minggu ini kamu lebih sering merasa cemas atau sedih. Mungkin ini saatnya kamu beristirahat dan mencari dukungan."
      : dominant === "marah"
      ? "Minggu ini kamu sering merasa marah. Coba kenali pemicunya — kamu pantas dapat ruang untuk bernapas."
      : "Minggu ini kamu lebih banyak merasa tenang. Pertahankan lingkungan yang sehat untuk dirimu.";

  const needsHelp = dominant === "sedih" || dominant === "cemas";

  // ------ LOCK SCREEN ------
  if (!unlocked) {
    return (
      <div>
        <PageHeader title="Safe Diary" subtitle="Privat, aman, hanya untukmu." />
        <div className="p-5 space-y-5">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-violet-100 to-indigo-100 text-center space-y-3">
            <div className="h-16 w-16 mx-auto rounded-2xl bg-white/70 flex items-center justify-center">
              <Lock className="h-7 w-7 text-violet-700" />
            </div>
            <h2 className="font-bold text-lg">Buka Diary-mu</h2>
            <p className="text-xs text-foreground/70">Masukkan PIN 4 digit untuk membuka ruang amanmu.</p>
          </div>
          <input
            type="password" inputMode="numeric" maxLength={4} value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
            placeholder="••••"
            className="w-full text-center text-3xl tracking-[0.6em] py-4 rounded-2xl bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <Button variant="hero" size="xl" className="w-full" disabled={pin.length !== 4} onClick={() => setUnlocked(true)}>
            <ShieldCheck className="h-5 w-5" /> Buka Safe Diary
          </Button>
          <p className="text-[11px] text-center text-muted-foreground">PIN demo: ketik 4 angka apa saja</p>
        </div>
      </div>
    );
  }

  // ------ POST-SAVE THANK YOU ------
  if (saved) {
    return (
      <div>
        <PageHeader title="Tersimpan" />
        <div className="p-5 space-y-5">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-100 to-rose-100 text-center space-y-3">
            <div className="text-5xl">🤍</div>
            <h2 className="text-lg font-bold">Terima kasih sudah bercerita hari ini</h2>
            <p className="text-sm text-foreground/80">{responses[saved.mood] ?? "Kamu sudah sangat kuat."}</p>
          </div>
          <Button variant="hero" size="xl" className="w-full" onClick={() => setSaved(null)}>Kembali ke Diary</Button>
        </div>
      </div>
    );
  }

  // ------ WRITING ------
  if (writing) {
    return (
      <div>
        <PageHeader title="Tulis Hari Ini" subtitle={new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })} />
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Mood Hari Ini</p>
            <div className="grid grid-cols-3 gap-2">
              {moods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMood(m.key)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border ${mood === m.key ? "border-primary bg-primary/5" : "border-border bg-card"}`}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[11px] font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60">
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">✨ Daily Prompt</p>
            <p className="text-sm font-semibold leading-snug">{todayPrompt}</p>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Tulis bebas apapun yang kamu rasakan…"
            rows={10}
            className="w-full p-4 rounded-2xl border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <div className="flex gap-2">
            <Button variant="outlineHero" size="lg" className="flex-1" onClick={() => { setWriting(false); setText(""); setMood(null); }}>Batal</Button>
            <Button variant="hero" size="lg" className="flex-1" disabled={!mood || !text.trim()} onClick={() => {
              setEntries([{ date: "Baru saja", mood: mood!, text: text.trim(), fav: false }, ...entries]);
              setSaved({ mood: mood! });
              setWriting(false); setText(""); setMood(null);
            }}>Simpan</Button>
          </div>
        </div>
      </div>
    );
  }

  const visible = tab === "fav" ? entries.filter((e) => e.fav) : entries;

  return (
    <div>
      <PageHeader title="Safe Diary" subtitle="Privat, aman, hanya untukmu." />
      <div className="p-5 space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 border border-violet-200/60 flex items-center gap-3">
          <Lock className="h-5 w-5 text-violet-700 shrink-0" />
          <p className="text-xs text-foreground/80">Semua tulisanmu terenkripsi & tidak dibagikan ke siapapun.</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-amber-700" />
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Prompt Hari Ini</p>
          </div>
          <p className="text-sm font-semibold leading-snug">{todayPrompt}</p>
        </div>

        <Button variant="hero" size="xl" className="w-full" onClick={() => setWriting(true)}>
          <Plus className="h-5 w-5" /> Tulis Hari Ini
        </Button>

        <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Ringkasan Mingguan</p>
          </div>
          <p className="text-sm font-medium leading-snug">{summary}</p>
        </div>

        {needsHelp && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100 border border-rose-200/60 space-y-3">
            <p className="text-sm font-semibold">Kamu terlihat butuh dukungan ekstra. Kami di sini untukmu 💛</p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/community" className="text-center text-xs font-semibold py-2 rounded-xl bg-background border border-border">Cari Dukungan</Link>
              <Link to="/emergency" className="text-center text-xs font-semibold py-2 rounded-xl bg-background border border-border flex items-center justify-center gap-1"><Phone className="h-3 w-3" /> Hubungi Mentor</Link>
              <Link to="/motivation" className="text-center text-xs font-semibold py-2 rounded-xl bg-background border border-border">Baca Motivasi</Link>
              <Link to="/self-check" className="text-center text-xs font-semibold py-2 rounded-xl bg-background border border-border">Mulai Self Check</Link>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <button onClick={() => setTab("all")} className={`flex-1 h-9 rounded-xl text-xs font-semibold ${tab === "all" ? "bg-foreground text-background" : "bg-card border border-border"}`}>Semua</button>
          <button onClick={() => setTab("fav")} className={`flex-1 h-9 rounded-xl text-xs font-semibold ${tab === "fav" ? "bg-foreground text-background" : "bg-card border border-border"}`}>★ Favorite</button>
        </div>

        <div className="space-y-3">
          {visible.length === 0 && <p className="text-center text-xs text-muted-foreground py-6">Belum ada yang ditandai favorit.</p>}
          {visible.map((e, i) => {
            const m = moods.find((mm) => mm.key === e.mood);
            return (
              <div key={i} className="p-4 rounded-2xl bg-card border border-border/60">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {m && <span className="text-base">{m.emoji}</span>}
                    <p className="text-xs font-semibold text-muted-foreground">{e.date}</p>
                  </div>
                  <button
                    onClick={() => setEntries(entries.map((x) => x === e ? { ...x, fav: !x.fav } : x))}
                    aria-label="favorite"
                  >
                    <Star className={`h-4 w-4 ${e.fav ? "fill-amber-400 text-amber-500" : "text-muted-foreground"}`} />
                  </button>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">{e.text}</p>
              </div>
            );
          })}
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-100 border border-indigo-200/60 mt-4">
          <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 mb-1">Refleksi Bulanan</p>
          <p className="text-sm font-semibold leading-snug">
            Bulan ini kamu lebih banyak menulis tentang kecemasan dan pertemanan. Kamu sudah bertahan sejauh ini, dan itu sangat hebat.
          </p>
        </div>
      </div>
    </div>
  );
}
