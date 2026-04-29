import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Sparkles, Heart, BookOpen, Play, Pause, ChevronRight, AlertCircle, Wind, Phone, NotebookPen } from "lucide-react";

export const Route = createFileRoute("/_app/motivation")({
  component: Motivation,
});

const dailyMotivations = [
  "Hari ini mungkin berat, tapi kamu tetap berhasil melewatinya.",
  "Kamu tidak harus selalu kuat. Istirahat juga bagian dari bertahan.",
  "Lukamu tidak mendefinisikan dirimu. Kamu lebih dari itu.",
  "Hari ini kamu sudah cukup. Sungguh.",
  "Suaramu penting. Beranilah, sedikit demi sedikit.",
  "Kamu berharga, apapun kata mereka.",
  "Setiap napas yang kamu ambil hari ini adalah keberanian.",
];

const socialPrayers = [
  "Semoga hari ini kamu dipertemukan dengan orang-orang yang lembut hatinya.",
  "Semoga luka yang tidak bisa kamu jelaskan perlahan menemukan sembuhnya.",
  "Semoga setiap kata baik yang kamu beri kembali padamu berkali lipat.",
  "Semoga rumah & sekolahmu menjadi tempat yang aman & menenangkan.",
];

const stories = [
  { title: "Dari Korban Jadi Konselor Muda", author: "Aisyah, 17", excerpt: "Dulu aku takut ke sekolah. Sekarang aku bantu adik kelas yang merasa sama..." },
  { title: "Aku Berhenti Menjadi Pelaku", author: "Reza, 16", excerpt: "Aku menyadari candaanku menyakiti orang lain. Hari itu aku memilih berubah..." },
  { title: "Komunitas yang Menyelamatkan", author: "Nisa, 15", excerpt: "Aku pikir aku sendirian, sampai aku menemukan komunitas ini..." },
];

const audios = [
  { title: "Afirmasi Pagi", duration: "3:12", color: "from-amber-100 to-orange-100" },
  { title: "Calming Words sebelum Tidur", duration: "5:40", color: "from-indigo-100 to-violet-100" },
  { title: "Saat Sedang Sedih", duration: "4:08", color: "from-blue-100 to-sky-100" },
  { title: "Self Healing Pendek", duration: "2:55", color: "from-emerald-100 to-teal-100" },
];

function Motivation() {
  const today = new Date().getDate();
  const motivation = dailyMotivations[today % dailyMotivations.length];
  const prayer = socialPrayers[today % socialPrayers.length];

  const [favs, setFavs] = useState<number[]>([]);
  const [playing, setPlaying] = useState<string | null>(null);
  const [emergency, setEmergency] = useState(false);

  if (emergency) return <EmergencyComfort onClose={() => setEmergency(false)} />;

  return (
    <div>
      <PageHeader title="Motivation Room" subtitle="Tempat hatimu kembali kuat." />
      <div className="p-5 space-y-6">
        {/* Emergency button */}
        <button
          onClick={() => setEmergency(true)}
          className="w-full p-4 rounded-2xl bg-gradient-to-br from-rose-100 to-pink-200 border border-rose-200/60 flex items-center gap-3 text-left"
        >
          <div className="h-11 w-11 rounded-xl bg-white/80 flex items-center justify-center shrink-0">
            <AlertCircle className="h-5 w-5 text-rose-600" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm">Aku sedang tidak baik-baik saja</p>
            <p className="text-[11px] text-foreground/70">Kami di sini untukmu, sekarang juga.</p>
          </div>
          <ChevronRight className="h-5 w-5 text-rose-600" />
        </button>

        {/* Daily motivation */}
        <div className="p-6 rounded-3xl bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-glow)] relative">
          <Sparkles className="h-6 w-6 mb-3" />
          <p className="text-lg font-bold leading-snug">"{motivation}"</p>
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs opacity-80">— Motivasi Hari Ini</p>
            <button
              onClick={() => setFavs(favs.includes(-1) ? favs.filter((x) => x !== -1) : [...favs, -1])}
              className="text-xs flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full"
            >
              <Heart className={`h-3 w-3 ${favs.includes(-1) ? "fill-white" : ""}`} /> Simpan
            </button>
          </div>
        </div>

        {/* Social Prayer */}
        <section className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 border border-violet-200/60">
          <p className="text-[11px] font-bold uppercase tracking-wider text-violet-700 mb-2">🙏 Social Prayer</p>
          <p className="text-base font-semibold leading-snug">"{prayer}"</p>
          <button className="mt-3 px-4 h-9 rounded-full bg-foreground text-background text-xs font-semibold">Kirim Doa untuk Teman</button>
        </section>

        {/* Audio motivation */}
        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">🎧 Audio Healing</h2>
          <div className="grid grid-cols-2 gap-3">
            {audios.map((a) => {
              const isPlaying = playing === a.title;
              return (
                <button
                  key={a.title}
                  onClick={() => setPlaying(isPlaying ? null : a.title)}
                  className={`text-left p-4 rounded-2xl bg-gradient-to-br ${a.color} border border-white/60`}
                >
                  <div className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center mb-3">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-foreground" />}
                  </div>
                  <p className="text-sm font-bold leading-tight">{a.title}</p>
                  <p className="text-[11px] text-foreground/60 mt-1">{a.duration}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Healing Stories */}
        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">💛 Healing Stories</h2>
          <div className="space-y-3">
            {stories.map((s, i) => (
              <button key={i} className="w-full text-left p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/40">
                <BookOpen className="h-5 w-5 text-amber-700 mb-2" />
                <p className="font-bold text-sm">{s.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{s.author}</p>
                <p className="text-xs text-foreground/70 mt-2 leading-relaxed">{s.excerpt}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Affirmations with favorites */}
        <section>
          <h2 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Afirmasi Positif</h2>
          <div className="space-y-2">
            {dailyMotivations.slice(0, 4).map((a, i) => {
              const liked = favs.includes(i);
              return (
                <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border/60">
                  <Heart className="h-4 w-4 text-primary fill-primary mt-0.5 shrink-0" />
                  <p className="text-sm font-medium flex-1">{a}</p>
                  <button onClick={() => setFavs(liked ? favs.filter((x) => x !== i) : [...favs, i])} aria-label="favorite">
                    <Heart className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Mini breathing */}
        <BreathingMini />

        {/* Weekly reflection */}
        <section className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 border border-emerald-200/60">
          <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1">Refleksi Mingguan</p>
          <p className="text-sm font-semibold leading-snug">
            "Minggu ini kamu tetap bertahan meski banyak hal terasa berat. Itu bukan hal kecil."
          </p>
        </section>
      </div>
    </div>
  );
}

function BreathingMini() {
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const seq: ("in" | "hold" | "out")[] = ["in", "hold", "out"];
    let i = 0;
    const t = setInterval(() => { i = (i + 1) % 3; setPhase(seq[i]); }, 4000);
    return () => clearInterval(t);
  }, [running]);

  const label = phase === "in" ? "Tarik napas perlahan" : phase === "hold" ? "Tahan sebentar" : "Lepaskan perlahan";
  const scale = phase === "in" ? "scale-110" : phase === "out" ? "scale-90" : "scale-100";

  return (
    <section className="p-5 rounded-3xl bg-gradient-to-br from-sky-100 to-blue-200 border border-sky-200/60 text-center">
      <Wind className="h-5 w-5 text-sky-700 mx-auto mb-2" />
      <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700 mb-3">Mini Breathing</p>
      <div className={`mx-auto h-28 w-28 rounded-full bg-white/70 flex items-center justify-center transition-transform duration-[4000ms] ${scale}`}>
        <p className="text-xs font-semibold text-sky-900 px-3 text-center leading-tight">{label}</p>
      </div>
      <button
        onClick={() => setRunning(!running)}
        className="mt-4 px-5 h-9 rounded-full bg-foreground text-background text-xs font-semibold"
      >
        {running ? "Berhenti" : "Mulai Bernapas"}
      </button>
    </section>
  );
}

function EmergencyComfort({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <PageHeader title="Kami di Sini" subtitle="Tarik napas. Kamu tidak sendirian." />
      <div className="p-5 space-y-5">
        <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-100 via-pink-100 to-orange-100 space-y-3">
          <div className="text-4xl">🤍</div>
          <p className="font-bold text-lg leading-snug">"Kamu tidak harus selalu baik-baik saja. Tidak apa-apa untuk merasa berat hari ini."</p>
          <p className="text-sm text-foreground/80">Semoga setiap detik berikutnya membawamu sedikit lebih ringan.</p>
        </div>

        <BreathingMini />

        <div className="grid grid-cols-1 gap-2">
          <Link to="/emergency" className="p-4 rounded-2xl bg-card border border-border/60 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center"><Phone className="h-5 w-5 text-rose-700" /></div>
            <div className="flex-1"><p className="font-bold text-sm">Konsultasi Admin</p><p className="text-[11px] text-muted-foreground">Cerita ke admin via Instagram</p></div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link to="/diary" className="p-4 rounded-2xl bg-card border border-border/60 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-violet-100 flex items-center justify-center"><NotebookPen className="h-5 w-5 text-violet-700" /></div>
            <div className="flex-1"><p className="font-bold text-sm">Tulis di Safe Diary</p><p className="text-[11px] text-muted-foreground">Curahkan apa yang kamu rasa</p></div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          <Link to="/community" className="p-4 rounded-2xl bg-card border border-border/60 flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-sky-100 flex items-center justify-center"><Heart className="h-5 w-5 text-sky-700" /></div>
            <div className="flex-1"><p className="font-bold text-sm">Cari Dukungan</p><p className="text-[11px] text-muted-foreground">Komunitas yang memahami</p></div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </div>

        <button onClick={onClose} className="w-full h-12 rounded-2xl bg-foreground text-background text-sm font-semibold">Aku Sudah Lebih Tenang</button>
      </div>
    </div>
  );
}
