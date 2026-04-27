import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, Award, Star, Share2, RotateCcw, CheckCircle2, XCircle, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_app/quiz")({
  component: Quiz,
});

type Question =
  | { id: number; type: "mcq"; q: string; options: string[]; answer: number; explain: string }
  | { id: number; type: "tf"; q: string; answer: boolean; explain: string };

const bank: Question[] = [
  { id: 1, type: "mcq", q: "Bullying adalah...", options: ["Candaan biasa", "Tindakan menyakiti secara sengaja dan berulang", "Hukuman sekolah", "Cara mencari perhatian"], answer: 1, explain: "Bullying adalah tindakan menyakiti yang dilakukan secara sengaja dan berulang." },
  { id: 2, type: "mcq", q: "Menghina fisik seseorang termasuk bullying jenis...", options: ["Fisik", "Sosial", "Verbal", "Akademik"], answer: 2, explain: "Menghina melalui kata-kata termasuk bullying verbal." },
  { id: 3, type: "mcq", q: "Mengucilkan teman dari pergaulan termasuk bullying jenis...", options: ["Sosial", "Fisik", "Verbal", "Organisasi"], answer: 0, explain: "Mengucilkan adalah bentuk bullying sosial." },
  { id: 4, type: "mcq", q: "Cyberbullying terjadi melalui...", options: ["Lapangan", "Media sosial", "Kantin", "Perpustakaan"], answer: 1, explain: "Cyberbullying terjadi melalui media digital dan media sosial." },
  { id: 5, type: "mcq", q: "Jika melihat teman dibully, tindakan terbaik adalah...", options: ["Ikut tertawa", "Diam saja", "Memberi dukungan dan melapor", "Menyalahkan korban"], answer: 2, explain: "Sebagai saksi, dukung korban dan laporkan ke pihak berwenang." },
  { id: 6, type: "mcq", q: "Salah satu dampak bullying adalah...", options: ["Lebih percaya diri", "Trauma emosional", "Lebih populer", "Semakin bahagia"], answer: 1, explain: "Bullying meninggalkan luka emosional yang dalam." },
  { id: 7, type: "tf", q: "Body shaming termasuk bullying verbal.", answer: true, explain: "Benar. Body shaming adalah bentuk bullying verbal." },
  { id: 8, type: "tf", q: "Meminta bantuan saat dibully adalah tanda kelemahan.", answer: false, explain: "Salah. Meminta bantuan adalah tanda keberanian." },
  { id: 9, type: "tf", q: "Menyebarkan gosip termasuk bullying sosial.", answer: true, explain: "Benar. Gosip merusak hubungan sosial korban." },
  { id: 10, type: "mcq", q: "Jika temanmu terlihat sedih karena diejek, sebaiknya kamu...", options: ["Pura-pura tidak tahu", "Ikut menjauh agar aman", "Dekati & tanyakan kabarnya dengan empati", "Sebarkan ke teman lain"], answer: 2, explain: "Empati & kehadiran adalah dukungan terbaik." },
  { id: 11, type: "mcq", q: "Pelaku bullying biasanya merasa...", options: ["Lebih lemah", "Lebih dominan/berkuasa", "Sama saja", "Tidak tahu"], answer: 1, explain: "Bullying melibatkan ketimpangan kekuatan." },
  { id: 12, type: "tf", q: "Diam saat melihat bullying sama saja mendukung pelaku.", answer: true, explain: "Benar. Diam memberi ruang bagi bullying terus terjadi." },
  { id: 13, type: "mcq", q: "Salah satu cara mencegah bullying adalah...", options: ["Membalas dengan kekerasan", "Menghargai perbedaan", "Diam selamanya", "Menjauhi semua orang"], answer: 1, explain: "Menghargai perbedaan menciptakan lingkungan yang aman." },
  { id: 14, type: "tf", q: "Korban bullying selalu mudah dikenali.", answer: false, explain: "Salah. Banyak korban menyembunyikan perasaan mereka." },
  { id: 15, type: "mcq", q: "Saat dibully online, bukti seperti screenshot sebaiknya...", options: ["Dihapus", "Disimpan sebagai bukti", "Disebarkan kembali", "Diabaikan"], answer: 1, explain: "Simpan bukti untuk pelaporan." },
  { id: 16, type: "mcq", q: "Empati adalah...", options: ["Mengacuhkan orang lain", "Memahami perasaan orang lain", "Membandingkan diri", "Mengkritik orang lain"], answer: 1, explain: "Empati adalah kemampuan memahami perasaan orang lain." },
  { id: 17, type: "tf", q: "Memanggil teman dengan nama buruk adalah candaan biasa.", answer: false, explain: "Salah. Itu bullying verbal jika menyakiti." },
  { id: 18, type: "mcq", q: "Tanda lingkungan pertemanan toxic adalah...", options: ["Saling mendukung", "Sering merendahkan", "Menghargai batasan", "Jujur & terbuka"], answer: 1, explain: "Lingkungan toxic sering merendahkan anggotanya." },
  { id: 19, type: "tf", q: "Korban bullying berhak meminta bantuan profesional.", answer: true, explain: "Benar. Konselor & psikolog dapat membantu." },
  { id: 20, type: "mcq", q: "Sikap terbaik saat ada teman baru yang sendirian...", options: ["Membiarkan", "Mengejek", "Mengajak bicara & berteman", "Menjauhi"], answer: 2, explain: "Inklusi sosial mencegah bullying." },
  { id: 21, type: "mcq", q: "Yang BUKAN bentuk cyberbullying adalah...", options: ["Komentar jahat", "DM ancaman", "Like postingan teman", "Menyebar foto memalukan"], answer: 2, explain: "Like positif bukan bullying." },
  { id: 22, type: "tf", q: "Pelaku bullying juga butuh pendampingan untuk berubah.", answer: true, explain: "Benar. Pelaku sering butuh edukasi & pendampingan." },
  { id: 23, type: "mcq", q: "Jika kamu pernah ikut mengejek, sebaiknya...", options: ["Lanjut saja", "Akui & minta maaf", "Menyangkal", "Salahkan korban"], answer: 1, explain: "Mengakui & minta maaf adalah langkah berubah." },
  { id: 24, type: "mcq", q: "Ciri pertemanan sehat adalah...", options: ["Saling menjatuhkan", "Saling menghargai & jujur", "Memaksa ikut tren", "Membandingkan terus"], answer: 1, explain: "Pertemanan sehat dibangun atas saling menghargai." },
  { id: 25, type: "tf", q: "Trauma bullying bisa bertahan hingga dewasa.", answer: true, explain: "Benar. Luka emosional bullying bisa berdampak panjang." },
  { id: 26, type: "mcq", q: "Self-talk positif berguna untuk...", options: ["Menyalahkan diri", "Membangun percaya diri", "Mengkritik orang lain", "Menjauhi teman"], answer: 1, explain: "Self-talk positif memperkuat mental." },
  { id: 27, type: "mcq", q: "Sebagai saksi (bystander), kamu bisa...", options: ["Diam", "Bantu korban & lapor", "Rekam untuk konten", "Ikut tertawa"], answer: 1, explain: "Bystander aktif menyelamatkan korban." },
  { id: 28, type: "tf", q: "Bullying hanya terjadi di sekolah.", answer: false, explain: "Salah. Bullying bisa terjadi di mana saja." },
  { id: 29, type: "mcq", q: "Hal kecil yang bisa membuat seseorang bertahan...", options: ["Cemoohan", "Pujian tulus", "Sindiran", "Diabaikan"], answer: 1, explain: "Kebaikan kecil bisa menyelamatkan." },
  { id: 30, type: "tf", q: "Bercerita ke orang terpercaya bisa meringankan beban.", answer: true, explain: "Benar. Bercerita adalah bentuk healing." },
  { id: 31, type: "mcq", q: "Reaksi terbaik saat dibully...", options: ["Membalas fisik", "Tetap tenang & laporkan", "Menyalahkan diri", "Menyendiri selamanya"], answer: 1, explain: "Tenang & lapor adalah strategi aman." },
  { id: 32, type: "mcq", q: "Stop bullying dimulai dari...", options: ["Orang lain", "Diri sendiri", "Pemerintah saja", "Sekolah saja"], answer: 1, explain: "Perubahan dimulai dari diri sendiri." },
  { id: 33, type: "tf", q: "Kita harus menghargai perbedaan suku, agama, & fisik.", answer: true, explain: "Benar. Menghargai perbedaan = anti bullying." },
  { id: 34, type: "mcq", q: "Saat cemas berat, sebaiknya...", options: ["Memendam sendiri", "Cerita ke konselor/orang terpercaya", "Marah ke orang lain", "Diam saja"], answer: 1, explain: "Cari dukungan profesional/orang terpercaya." },
  { id: 35, type: "mcq", q: "Pendengar yang baik adalah...", options: ["Memotong pembicaraan", "Hadir & tidak menghakimi", "Memberi nasihat keras", "Membandingkan cerita"], answer: 1, explain: "Hadir tanpa menghakimi adalah dukungan terbesar." },
  { id: 36, type: "tf", q: "Membandingkan diri terus-menerus bisa merusak percaya diri.", answer: true, explain: "Benar. Setiap orang punya jalannya sendiri." },
  { id: 37, type: "mcq", q: "Yang TERMASUK bullying sosial adalah...", options: ["Memuji teman", "Mengucilkan teman", "Membantu PR", "Mengajak main"], answer: 1, explain: "Mengucilkan = bullying sosial." },
  { id: 38, type: "mcq", q: "Kapan candaan jadi bullying?", options: ["Tidak pernah", "Saat membuat orang terluka & berulang", "Saat lucu", "Saat banyak orang"], answer: 1, explain: "Jika menyakiti & berulang, itu bukan candaan lagi." },
  { id: 39, type: "tf", q: "Setiap orang berhak merasa aman di sekolah.", answer: true, explain: "Benar. Itu adalah hak dasar." },
  { id: 40, type: "mcq", q: "Salah satu Self Care saat down adalah...", options: ["Memendam emosi", "Menulis di safe diary", "Marah-marah", "Menyalahkan diri"], answer: 1, explain: "Menulis perasaan membantu meredakan emosi." },
  { id: 41, type: "mcq", q: "Berkata 'tidak' pada bullying adalah...", options: ["Sok jago", "Tindakan berani & benar", "Sia-sia", "Mencari masalah"], answer: 1, explain: "Berkata tidak adalah keberanian." },
  { id: 42, type: "tf", q: "Bullying bisa menyebabkan gangguan kecemasan & depresi.", answer: true, explain: "Benar. Dampaknya nyata pada kesehatan mental." },
  { id: 43, type: "mcq", q: "Ketika teman cerita, hal terbaik adalah...", options: ["Menyela", "Mendengarkan dengan empati", "Tertawa", "Menyebar ceritanya"], answer: 1, explain: "Mendengar dengan empati = support." },
  { id: 44, type: "mcq", q: "Konselor / BK berfungsi untuk...", options: ["Menghukum", "Membantu mendengarkan & mencari solusi", "Menyebar rahasia", "Menyalahkan murid"], answer: 1, explain: "BK adalah ruang aman bantuan." },
  { id: 45, type: "tf", q: "Komentar jahat di medsos bisa berdampak nyata pada kesehatan mental.", answer: true, explain: "Benar. Komentar online berdampak nyata." },
  { id: 46, type: "mcq", q: "Menjadi support system artinya...", options: ["Diam saat butuh", "Hadir & menguatkan", "Menjauh saat susah", "Membandingkan masalah"], answer: 1, explain: "Hadir & menguatkan = support system." },
  { id: 47, type: "mcq", q: "Yang BUKAN tanda korban bullying...", options: ["Pendiam tiba-tiba", "Takut sekolah", "Lebih percaya diri & ceria selalu", "Menarik diri"], answer: 2, explain: "Korban biasanya menarik diri, bukan ceria." },
  { id: 48, type: "tf", q: "Memberi pujian tulus bisa membuat hari seseorang lebih baik.", answer: true, explain: "Benar. Kebaikan kecil berdampak besar." },
  { id: 49, type: "mcq", q: "Lingkungan pertemanan sehat membuatmu...", options: ["Kecil & takut", "Tumbuh & nyaman jadi diri sendiri", "Tertekan", "Menjauh dari keluarga"], answer: 1, explain: "Pertemanan sehat membantumu tumbuh." },
  { id: 50, type: "tf", q: "Empati bisa dilatih melalui kebiasaan kecil setiap hari.", answer: true, explain: "Benar. Empati adalah keterampilan yang bisa dilatih." },
];

// Deterministic daily seed: take 5 questions per day based on day-of-year
function getDailyQuestions(): Question[] {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const day = Math.floor((now.getTime() - start.getTime()) / 86400000);
  const start_idx = (day * 5) % bank.length;
  const arr: Question[] = [];
  for (let i = 0; i < 5; i++) arr.push(bank[(start_idx + i * 7) % bank.length]);
  return arr;
}

function Quiz() {
  const questions = useMemo(getDailyQuestions, []);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | boolean | null)[]>(Array(5).fill(null));
  const [done, setDone] = useState(false);
  const [showExplain, setShowExplain] = useState(false);

  const correctCount = answers.reduce<number>((acc, a, i) => {
    const q = questions[i];
    if (a === null) return acc;
    if (q.type === "mcq" && a === q.answer) return acc + 1;
    if (q.type === "tf" && a === q.answer) return acc + 1;
    return acc;
  }, 0);
  const score = Math.round((correctCount / questions.length) * 100);

  const badge =
    score >= 90 ? { name: "Empathy Hero", color: "from-amber-200 to-orange-300" }
    : score >= 70 ? { name: "Kindness Starter", color: "from-emerald-200 to-teal-300" }
    : score >= 50 ? { name: "Brave Learner", color: "from-sky-200 to-blue-300" }
    : { name: "Keep Going", color: "from-violet-200 to-indigo-300" };

  if (done && !showExplain) {
    return (
      <div>
        <PageHeader title="Hasil Kuis Harian" back={
          <Link to="/edukasi" className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>
        }/>
        <div className="p-5 space-y-5">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-100 via-teal-100 to-sky-100 text-center space-y-3">
            <div className="text-5xl">🎉</div>
            <h2 className="text-xl font-bold">Hebat! Kamu sudah menyelesaikan Kuis Hari Ini</h2>
            <div className="text-4xl font-black">{score}<span className="text-lg">/100</span></div>
            <p className="text-xs text-foreground/70">Skor: {correctCount}/{questions.length} benar</p>
          </div>

          <div className={`p-5 rounded-2xl bg-gradient-to-br ${badge.color} flex items-center gap-4`}>
            <div className="h-14 w-14 rounded-2xl bg-white/80 flex items-center justify-center">
              <Award className="h-7 w-7 text-foreground" />
            </div>
            <div>
              <p className="text-xs font-semibold opacity-70">BADGE BARU</p>
              <p className="font-bold text-lg">🏅 {badge.name}</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/60">
            <Sparkles className="h-5 w-5 text-primary mb-2" />
            <p className="text-sm font-semibold leading-snug">"Menjadi orang baik dimulai dari memahami perasaan orang lain."</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outlineHero" size="lg" onClick={() => setShowExplain(true)}>Lihat Pembahasan</Button>
            <Button variant="soft" size="lg"><Share2 className="h-4 w-4" /> Bagikan</Button>
          </div>
          <Link to="/home" className="block">
            <Button variant="hero" size="xl" className="w-full">Lanjut Besok 🌅</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (done && showExplain) {
    return (
      <div>
        <PageHeader title="Pembahasan" back={
          <button onClick={() => setShowExplain(false)} className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></button>
        }/>
        <div className="p-5 space-y-3">
          {questions.map((q, i) => {
            const ua = answers[i];
            const correct = q.type === "mcq" ? ua === q.answer : ua === q.answer;
            return (
              <div key={q.id} className={`p-4 rounded-2xl border ${correct ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                <div className="flex items-start gap-2 mb-2">
                  {correct ? <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" /> : <XCircle className="h-5 w-5 text-rose-600 shrink-0" />}
                  <p className="text-sm font-semibold">{i + 1}. {q.q}</p>
                </div>
                <p className="text-xs text-foreground/70 ml-7">
                  {q.type === "mcq"
                    ? <>Jawaban benar: <b>{q.options[q.answer]}</b></>
                    : <>Jawaban benar: <b>{q.answer ? "Benar" : "Salah"}</b></>}
                </p>
                <p className="text-xs text-foreground/80 ml-7 mt-1">{q.explain}</p>
              </div>
            );
          })}
          <Button variant="hero" size="xl" className="w-full" onClick={() => { setDone(false); setShowExplain(false); setStep(0); setAnswers(Array(5).fill(null)); }}>
            <RotateCcw className="h-4 w-4" /> Tutup Pembahasan
          </Button>
        </div>
      </div>
    );
  }

  const q = questions[step];
  const userAnswer = answers[step];
  const canNext = userAnswer !== null;

  return (
    <div>
      <PageHeader title="Kuis Harian" subtitle="Uji pemahamanmu tentang bullying setiap hari." back={
        <Link to="/edukasi" className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>
      }/>
      <div className="p-5 space-y-5">
        <div className="grid grid-cols-3 gap-2 text-center">
          <Stat icon={<Flame className="h-4 w-4" />} label="Streak" value="5 hari" />
          <Stat icon={<Award className="h-4 w-4" />} label="Badge" value="3" />
          <Stat icon={<Star className="h-4 w-4" />} label="Skor avg" value="82" />
        </div>

        <div>
          <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
            <span>Soal {step + 1} dari {questions.length}</span>
            <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-[image:var(--gradient-primary)] rounded-full transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-card border border-border/60">
          <p className="text-[11px] uppercase font-bold tracking-wider text-primary mb-2">{q.type === "mcq" ? "Pilihan Ganda" : "Benar / Salah"}</p>
          <p className="font-bold text-base leading-snug mb-4">{q.q}</p>

          <div className="space-y-2">
            {q.type === "mcq" && q.options.map((opt, i) => {
              const sel = userAnswer === i;
              return (
                <button
                  key={i}
                  onClick={() => { const next = [...answers]; next[step] = i; setAnswers(next); }}
                  className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition ${sel ? "border-primary bg-primary/10" : "border-border bg-background"}`}
                >
                  <span className="inline-block w-6 font-bold text-primary">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </button>
              );
            })}
            {q.type === "tf" && [true, false].map((v) => {
              const sel = userAnswer === v;
              return (
                <button
                  key={String(v)}
                  onClick={() => { const next = [...answers]; next[step] = v; setAnswers(next); }}
                  className={`w-full text-left p-3 rounded-xl border text-sm font-semibold transition ${sel ? "border-primary bg-primary/10" : "border-border bg-background"}`}
                >
                  {v ? "✓ Benar" : "✗ Salah"}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          variant="hero" size="xl" className="w-full" disabled={!canNext}
          onClick={() => { if (step === questions.length - 1) setDone(true); else setStep(step + 1); }}
        >
          {step === questions.length - 1 ? "Selesai & Lihat Hasil" : "Lanjut →"}
        </Button>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="p-3 rounded-2xl bg-card border border-border/60">
      <div className="flex items-center justify-center gap-1 text-primary mb-1">{icon}</div>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold">{value}</p>
    </div>
  );
}
