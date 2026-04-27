import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Shield,
  BookOpen,
  ClipboardCheck,
  NotebookPen,
  AlertTriangle,
  Sparkles,
  Users,
  Target,
  PhoneCall,
  Heart,
  ArrowRight,
} from "lucide-react";
import heroImg from "@/assets/hero-bully.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "No More Bully — Bullying Bukan Candaan, Luka Itu Nyata" },
      {
        name: "description",
        content:
          "Platform digital anti-bullying untuk pelajar: edukasi, self check, safe diary, pelaporan aman, motivasi, komunitas, dan dukungan emosional.",
      },
      { property: "og:title", content: "No More Bully" },
      { property: "og:description", content: "Bullying Bukan Candaan, Luka Itu Nyata." },
    ],
  }),
  component: Index,
});

const features = [
  {
    icon: BookOpen,
    title: "Edukasi Bullying",
    desc: "Materi lengkap, video singkat & kuis interaktif tentang bullying.",
    color: "from-sky-100 to-blue-50",
  },
  {
    icon: ClipboardCheck,
    title: "Self Check",
    desc: "Tes singkat untuk memahami posisimu: korban, pelaku, atau lingkungan toxic.",
    color: "from-emerald-100 to-teal-50",
  },
  {
    icon: NotebookPen,
    title: "Safe Diary",
    desc: "Jurnal pribadi yang aman & privat untuk semua perasaanmu.",
    color: "from-violet-100 to-indigo-50",
  },
  {
    icon: AlertTriangle,
    title: "Report Center",
    desc: "Laporkan kasus bullying secara aman ke pihak terpercaya.",
    color: "from-rose-100 to-pink-50",
  },
  {
    icon: Sparkles,
    title: "Motivation Room",
    desc: "Afirmasi positif, cerita inspiratif & social prayer untukmu.",
    color: "from-amber-100 to-yellow-50",
  },
  {
    icon: Users,
    title: "Community Support",
    desc: "Forum sehat untuk berbagi pengalaman tanpa menghakimi.",
    color: "from-cyan-100 to-sky-50",
  },
  {
    icon: Target,
    title: "Positive Challenge",
    desc: "Tantangan kebaikan harian seperti '7 Hari Tanpa Menghina'.",
    color: "from-lime-100 to-green-50",
  },
  {
    icon: PhoneCall,
    title: "Emergency Contact",
    desc: "Akses cepat ke orang terpercaya saat kamu butuh bantuan.",
    color: "from-orange-100 to-red-50",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-soft)]">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">No More Bully</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#fitur" className="hover:text-foreground transition">Fitur</a>
            <a href="#tentang" className="hover:text-foreground transition">Tentang</a>
            <a href="#dukungan" className="hover:text-foreground transition">Dukungan</a>
          </nav>
          <Button variant="hero" size="sm" className="rounded-full">Mulai</Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{ background: "var(--gradient-hero)" }}
        />
        <div className="absolute -top-32 -left-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl -z-10" />
        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-secondary/30 blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background/70 backdrop-blur border border-border/60 text-xs text-muted-foreground">
              <Heart className="h-3.5 w-3.5 text-primary" />
              Ruang aman untuk pelajar & remaja
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.05]">
              NO MORE
              <br />
              <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">
                BULLY
              </span>
            </h1>
            <p className="text-xl md:text-2xl font-medium text-foreground/80">
              Bullying Bukan Candaan, <span className="italic">Luka Itu Nyata.</span>
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-xl leading-relaxed">
              Platform digital yang membantu pelajar memahami bullying, melawan
              perundungan, dan menemukan ruang aman untuk didengar, didukung,
              dan dikuatkan.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button variant="hero" size="xl">
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outlineHero" size="xl">
                Laporkan Bullying
              </Button>
              <Button variant="soft" size="xl">
                Cari Dukungan
              </Button>
            </div>
            <div className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
              <div><span className="text-foreground font-bold text-2xl">10K+</span><br/>Pelajar terlindungi</div>
              <div className="h-10 w-px bg-border" />
              <div><span className="text-foreground font-bold text-2xl">100%</span><br/>Aman & privat</div>
              <div className="h-10 w-px bg-border" />
              <div><span className="text-foreground font-bold text-2xl">24/7</span><br/>Selalu mendengar</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-[image:var(--gradient-primary)] blur-3xl opacity-30 rounded-[3rem]" />
            <img
              src={heroImg}
              alt="Pelajar saling mendukung melawan bullying"
              width={1536}
              height={1280}
              className="relative rounded-[2.5rem] shadow-[var(--shadow-glow)] border border-white/50"
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="fitur" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Fitur Utama</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Semua yang kamu butuhkan untuk merasa aman.
          </h2>
          <p className="text-muted-foreground text-lg">
            Dari edukasi hingga dukungan emosional — semua dalam satu platform yang dirancang untukmu.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className={`group relative p-6 rounded-3xl bg-gradient-to-br ${f.color} border border-white/60 hover:shadow-[var(--shadow-glow)] hover:-translate-y-1 transition-all duration-500`}
            >
              <div className="h-12 w-12 rounded-2xl bg-background/80 backdrop-blur flex items-center justify-center mb-4 shadow-sm">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TENTANG / MISSION */}
      <section id="tentang" className="bg-[image:var(--gradient-soft)] py-24">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <span className="text-sm font-semibold text-primary uppercase tracking-widest">Misi Kami</span>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Membangun generasi yang <span className="italic text-primary">peduli</span>,<br/>
            bukan generasi yang melukai.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Kami percaya setiap pelajar berhak merasa aman, didengar, dan dihargai.
            No More Bully hadir sebagai sahabat digital yang menemanimu di setiap langkah.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 pt-8">
            {[
              { t: "Pahami", d: "Edukasi tentang bullying & dampaknya." },
              { t: "Cegah", d: "Bangun kebiasaan baik & lingkungan sehat." },
              { t: "Lawan", d: "Laporkan & dapatkan dukungan nyata." },
            ].map((s, i) => (
              <div key={s.t} className="p-6 rounded-3xl bg-card border border-border/60 shadow-[var(--shadow-soft)]">
                <div className="text-4xl font-black text-primary/30 mb-2">0{i + 1}</div>
                <h3 className="font-bold text-xl mb-1">{s.t}</h3>
                <p className="text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="dukungan" className="max-w-5xl mx-auto px-6 py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] p-12 md:p-16 text-center bg-[image:var(--gradient-primary)] shadow-[var(--shadow-glow)]">
          <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
          <div className="relative space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground tracking-tight">
              Kamu tidak sendirian.
            </h2>
            <p className="text-primary-foreground/90 text-lg max-w-xl mx-auto">
              Mulai langkah pertamamu hari ini. Suaramu penting, dan kami siap mendengar.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Button size="xl" className="bg-background text-foreground hover:bg-background/90 rounded-full">
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outlineHero" size="xl" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">No More Bully</span>
            <span>© 2026</span>
          </div>
          <p>Made with <Heart className="inline h-3.5 w-3.5 text-primary fill-primary" /> untuk pelajar Indonesia.</p>
        </div>
      </footer>
    </div>
  );
}
