import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { ArrowLeft, Heart, Trash2, Share2, Sparkles, NotebookPen, MessageCircleHeart, Headphones } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ShareQuoteDialog } from "@/components/ShareQuoteDialog";

export const Route = createFileRoute("/_app/saved")({
  component: SavedPage,
});

const TABS = [
  { id: "motivation", label: "Motivasi", icon: Sparkles },
  { id: "audio", label: "Audio", icon: Headphones },
  { id: "diary", label: "Diary", icon: NotebookPen },
  { id: "community", label: "Community", icon: MessageCircleHeart },
] as const;

function SavedPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<typeof TABS[number]["id"]>("motivation");
  const [quotes, setQuotes] = useState<any[]>([]);
  const [diary, setDiary] = useState<any[]>([]);
  const [share, setShare] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (tab === "motivation") {
      supabase.from("saved_motivations").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).then(({ data }) => setQuotes(data ?? []));
    } else if (tab === "diary") {
      supabase.from("diary_entries").select("*").eq("user_id", user.id).eq("is_favorite", true).order("created_at", { ascending: false }).then(({ data }) => setDiary(data ?? []));
    }
  }, [tab, user]);

  const removeQuote = async (id: string) => {
    await supabase.from("saved_motivations").delete().eq("id", id);
    setQuotes((p) => p.filter((q) => q.id !== id));
    toast.success("Dihapus dari favorit");
  };

  return (
    <div>
      <PageHeader title="Tersimpan" subtitle="Koleksi favoritmu"
        back={<Link to="/profile" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>} />

      <div className="px-5 pt-3 sticky top-0 bg-background z-10">
        <div className="flex gap-1 p-1 bg-muted rounded-2xl">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-1 h-9 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1 ${tab === t.id ? "bg-background shadow text-foreground" : "text-muted-foreground"}`}>
              <t.icon className="h-3.5 w-3.5" /> {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-5 space-y-3 animate-fade-in">
        {tab === "motivation" && (
          quotes.length === 0
            ? <Empty icon={Sparkles} text="Belum ada motivasi tersimpan" hint="Tap ❤ pada quote untuk menyimpan" />
            : quotes.map((q) => (
              <div key={q.id} className="p-5 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 border border-violet-200/60">
                <Heart className="h-4 w-4 text-rose-500 fill-rose-500 mb-2" />
                <p className="font-semibold leading-snug">"{q.content}"</p>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-[10px] text-muted-foreground">{q.category ?? "motivasi"} · {new Date(q.created_at).toLocaleDateString("id-ID")}</p>
                  <div className="flex gap-1">
                    <button onClick={() => setShare(q.content)} className="h-8 w-8 rounded-full bg-white/70 flex items-center justify-center"><Share2 className="h-3.5 w-3.5" /></button>
                    <button onClick={() => removeQuote(q.id)} className="h-8 w-8 rounded-full bg-white/70 flex items-center justify-center"><Trash2 className="h-3.5 w-3.5 text-rose-500" /></button>
                  </div>
                </div>
              </div>
            ))
        )}
        {tab === "diary" && (
          diary.length === 0
            ? <Empty icon={NotebookPen} text="Belum ada diary favorit" hint="Tandai entry diary sebagai favorit" />
            : diary.map((d) => (
              <Link key={d.id} to="/diary" className="block p-4 rounded-2xl bg-card border border-border/60">
                <p className="font-semibold text-sm">{d.title ?? "Tanpa judul"}</p>
                <p className="text-xs text-foreground/70 mt-1 line-clamp-2">{d.content}</p>
                <p className="text-[10px] text-muted-foreground mt-2">{new Date(d.created_at).toLocaleDateString("id-ID")}</p>
              </Link>
            ))
        )}
        {tab === "audio" && <Empty icon={Headphones} text="Audio favorit segera hadir" hint="Tap ❤ pada audio di Motivation Room" />}
        {tab === "community" && <Empty icon={MessageCircleHeart} text="Postingan favorit segera hadir" />}
      </div>

      <ShareQuoteDialog open={!!share} onOpenChange={(v) => !v && setShare(null)} quote={share ?? ""} />
    </div>
  );
}

function Empty({ icon: Icon, text, hint }: { icon: any; text: string; hint?: string }) {
  return (
    <div className="text-center py-16">
      <div className="h-20 w-20 rounded-3xl bg-muted mx-auto flex items-center justify-center mb-4">
        <Icon className="h-8 w-8 text-muted-foreground" />
      </div>
      <p className="font-bold">{text}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}
