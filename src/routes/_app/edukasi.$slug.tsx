import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Quote, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/_app/edukasi/$slug")({
  component: EdukasiDetail,
});

type Section = { heading?: string; text?: string; bullets?: string[] };

const materials: Record<
  string,
  { title: string; emoji: string; color: string; sections: Section[]; quote: string; next?: { slug: string; title: string } }
> = {
  "apa-itu-bullying": {
    title: "Apa itu Bullying?",
    emoji: "💭",
    color: "from-sky-100 to-blue-100",
    sections: [
      {
        text: "Bullying adalah tindakan menyakiti, merendahkan, mengintimidasi, atau mempermalukan seseorang secara sengaja dan berulang. Bullying bisa terjadi di sekolah, lingkungan pertemanan, rumah, maupun media sosial.",
      },
      {
        text: "Bullying bukan sekadar candaan jika membuat seseorang merasa takut, sedih, malu, atau kehilangan rasa percaya diri.",
      },
      {
        heading: "Ketimpangan Kekuatan",
        text: "Bullying biasanya melibatkan ketimpangan kekuatan, di mana pelaku merasa lebih kuat, lebih berkuasa, atau lebih dominan dibanding korban. Karena itu, korban sering merasa sulit melawan.",
      },
    ],
    quote: "Jika candaan membuat seseorang terluka, itu bukan lagi candaan.",
    next: { slug: "jenis-bullying", title: "Jenis-jenis Bullying" },
  },
  "jenis-bullying": {
    title: "Jenis-jenis Bullying",
    emoji: "🔍",
    color: "from-emerald-100 to-teal-100",
    sections: [
      { text: "Bullying memiliki beberapa bentuk utama yang penting untuk dikenali:" },
      {
        heading: "Bullying Verbal",
        text: "Menghina, mengejek, memanggil dengan nama buruk, body shaming, mempermalukan lewat kata-kata.",
      },
      {
        heading: "Bullying Fisik",
        text: "Memukul, menendang, mendorong, merusak barang, atau kekerasan fisik lainnya.",
      },
      {
        heading: "Bullying Sosial",
        text: "Mengucilkan dari pergaulan, menyebarkan gosip, mempermalukan di depan umum, memanipulasi hubungan sosial.",
      },
      {
        heading: "Cyberbullying",
        text: "Menghina melalui media sosial, komentar jahat, pesan ancaman, penyebaran foto atau video yang mempermalukan korban.",
      },
    ],
    quote: "Bullying tidak selalu terlihat, tetapi dampaknya selalu terasa.",
    next: { slug: "penyebab-dampak", title: "Penyebab & Dampak" },
  },
  "penyebab-dampak": {
    title: "Penyebab & Dampak",
    emoji: "💔",
    color: "from-violet-100 to-indigo-100",
    sections: [
      {
        heading: "Mengapa Bullying Terjadi?",
        text: "Bullying terjadi karena berbagai faktor seperti kurangnya empati, lingkungan keluarga yang keras, keinginan terlihat kuat, pengaruh pergaulan buruk, rasa iri, atau pernah menjadi korban sebelumnya.",
      },
      {
        heading: "Dampak Bagi Korban",
        bullets: [
          "Kehilangan rasa percaya diri",
          "Takut bersosialisasi",
          "Prestasi menurun",
          "Cemas berlebihan",
          "Merasa sendirian",
          "Trauma emosional",
          "Sulit percaya pada orang lain",
        ],
      },
      { text: "Bullying bisa meninggalkan luka yang tidak terlihat tetapi bertahan lama." },
    ],
    quote: "Satu ejekan bisa meninggalkan luka yang bertahan bertahun-tahun.",
    next: { slug: "tanda-korban", title: "Tanda Korban Bullying" },
  },
  "tanda-korban": {
    title: "Tanda Korban Bullying",
    emoji: "🫂",
    color: "from-amber-100 to-orange-100",
    sections: [
      { text: "Beberapa tanda seseorang mungkin sedang mengalami bullying:" },
      {
        bullets: [
          "Tiba-tiba menjadi pendiam",
          "Sering terlihat sedih atau menangis",
          "Takut pergi ke sekolah",
          "Prestasi menurun",
          "Menarik diri dari pergaulan",
          "Kehilangan semangat",
          "Mudah cemas atau takut",
          "Tidak percaya diri",
          "Menghindari orang tertentu",
        ],
      },
      {
        text: "Kadang korban tidak langsung bercerita. Karena itu, penting untuk lebih peka terhadap perubahan perilaku orang di sekitarmu.",
      },
    ],
    quote: "Kadang, orang yang paling butuh bantuan adalah mereka yang paling diam.",
    next: { slug: "cara-menghadapi", title: "Cara Menghadapi" },
  },
  "cara-menghadapi": {
    title: "Cara Menghadapi",
    emoji: "🛡️",
    color: "from-rose-100 to-pink-100",
    sections: [
      { text: "Jika kamu mengalami bullying, lakukan langkah berikut:" },
      {
        bullets: [
          "Jangan menyalahkan diri sendiri",
          "Tetap tenang dan jangan membalas dengan kekerasan",
          "Simpan bukti jika bullying terjadi secara online",
          "Ceritakan kepada orang tua, guru, atau orang terpercaya",
          "Hindari situasi berbahaya jika memungkinkan",
          "Laporkan kepada pihak sekolah atau orang dewasa yang bisa membantu",
        ],
      },
      { text: "Meminta bantuan bukan tanda kelemahan, tetapi bentuk keberanian." },
    ],
    quote: "Kamu tidak harus menghadapi semuanya sendirian.",
    next: { slug: "cara-mencegah", title: "Cara Mencegah" },
  },
  "cara-mencegah": {
    title: "Cara Mencegah",
    emoji: "🌱",
    color: "from-cyan-100 to-sky-100",
    sections: [
      { text: "Bullying bisa dicegah dengan membangun lingkungan yang sehat:" },
      {
        bullets: [
          "Menghargai perbedaan",
          "Tidak ikut mengejek atau menertawakan orang lain",
          "Berani berkata tidak pada tindakan bullying",
          "Memilih pertemanan yang positif",
          "Membangun rasa percaya diri",
          "Menjadi teman yang suportif",
          "Melapor jika melihat bullying terjadi",
        ],
      },
      { text: "Perubahan dimulai dari kebiasaan kecil seperti memilih untuk bersikap baik." },
    ],
    quote: "Stop bullying dimulai dari diri sendiri.",
  },
};

function EdukasiDetail() {
  const { slug } = Route.useParams();
  const data = materials[slug];

  if (!data) {
    return (
      <div className="p-5">
        <PageHeader
          title="Tidak Ditemukan"
          back={
            <Link to="/edukasi" className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Materi"
        back={
          <Link to="/edukasi" className="h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        }
      />
      <div className="p-5 space-y-5">
        <div className={`p-6 rounded-3xl bg-gradient-to-br ${data.color} border border-white/60`}>
          <div className="text-4xl mb-2">{data.emoji}</div>
          <h1 className="text-2xl font-bold leading-tight">{data.title}</h1>
        </div>

        <article className="space-y-5">
          {data.sections.map((s, i) => (
            <div key={i} className="space-y-2">
              {s.heading && <h2 className="font-bold text-base">{s.heading}</h2>}
              {s.text && <p className="text-sm leading-relaxed text-foreground/80">{s.text}</p>}
              {s.bullets && (
                <ul className="space-y-2 pl-1">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex gap-2 text-sm leading-relaxed text-foreground/80">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </article>

        <div className="p-5 rounded-2xl bg-foreground text-background">
          <Quote className="h-5 w-5 mb-2 opacity-70" />
          <p className="text-base font-semibold leading-snug">"{data.quote}"</p>
        </div>

        {data.next && (
          <Link to="/edukasi/$slug" params={{ slug: data.next.slug }}>
            <Button variant="hero" size="xl" className="w-full">
              Lanjut: {data.next.title} <ChevronRight className="h-5 w-5" />
            </Button>
          </Link>
        )}
        {!data.next && (
          <Link to="/quiz">
            <Button variant="hero" size="xl" className="w-full">
              Uji Pemahamanmu di Kuis Harian
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
