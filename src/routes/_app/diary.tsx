import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Lock, Plus, Star, Calendar, Sparkles, Trash2, Pencil, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/diary")({
  component: Diary,
});

const moods = [
  { key: "senang", emoji: "😊", label: "Senang" },
  { key: "sedih", emoji: "😔", label: "Sedih" },
  { key: "cemas", emoji: "😰", label: "Cemas" },
  { key: "marah", emoji: "😡", label: "Marah" },
  { key: "lelah", emoji: "😴", label: "Lelah" },
  { key: "tenang", emoji: "😌", label: "Tenang" },
];

const prompts = [
  "Apa yang paling membuatmu lelah hari ini?",
  "Apa hal kecil yang membuatmu bersyukur hari ini?",
  "Apa yang ingin kamu lepaskan hari ini?",
  "Apa yang ingin kamu katakan pada dirimu sendiri hari ini?",
];

type Entry = {
  id: string;
  content: string;
  mood: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
};

const DRAFT_KEY = "nmb_diary_draft";

function friendlyDate(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const diffDays = Math.floor((today.setHours(0, 0, 0, 0) - new Date(iso).setHours(0, 0, 0, 0)) / 86400000);
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function Diary() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  const [writing, setWriting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"all" | "fav">("all");
  const [q, setQ] = useState("");

  const todayPrompt = prompts[new Date().getDate() % prompts.length];

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("diary_entries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) toast.error("Gagal memuat diary");
      else setEntries((data as Entry[]) ?? []);
      setLoading(false);
    })();
  }, [user]);

  // Draft autosave
  useEffect(() => {
    if (writing) {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft && !editingId) {
        try {
          const d = JSON.parse(draft);
          if (d.text) {
            setText(d.text);
            setMood(d.mood);
          }
        } catch { /* noop */ }
      }
    }
  }, [writing, editingId]);

  useEffect(() => {
    if (writing && !editingId) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify({ text, mood }));
    }
  }, [text, mood, writing, editingId]);

  const openWrite = (entry?: Entry) => {
    if (entry) {
      setEditingId(entry.id);
      setText(entry.content);
      setMood(entry.mood);
    } else {
      setEditingId(null);
    }
    setWriting(true);
  };

  const save = async () => {
    if (!text.trim() || !mood || !user) return;
    if (editingId) {
      const { error } = await supabase
        .from("diary_entries")
        .update({ content: text.trim(), mood, updated_at: new Date().toISOString() })
        .eq("id", editingId);
      if (error) return toast.error("Gagal menyimpan");
      toast.success("Diary diperbarui");
    } else {
      const { error } = await supabase
        .from("diary_entries")
        .insert({ user_id: user.id, content: text.trim(), mood });
      if (error) return toast.error("Gagal menyimpan");
      toast.success("Tersimpan aman 🤍");
    }
    localStorage.removeItem(DRAFT_KEY);
    setWriting(false); setEditingId(null); setText(""); setMood(null);
    const { data } = await supabase.from("diary_entries").select("*").order("created_at", { ascending: false });
    setEntries((data as Entry[]) ?? []);
  };

  const remove = async (id: string) => {
    if (!confirm("Hapus catatan ini?")) return;
    const { error } = await supabase.from("diary_entries").delete().eq("id", id);
    if (error) return toast.error("Gagal menghapus");
    setEntries(entries.filter(e => e.id !== id));
    toast.success("Dihapus");
  };

  const toggleFav = async (e: Entry) => {
    const { error } = await supabase
      .from("diary_entries")
      .update({ is_favorite: !e.is_favorite })
      .eq("id", e.id);
    if (error) return;
    setEntries(entries.map(x => x.id === e.id ? { ...x, is_favorite: !x.is_favorite } : x));
  };


  if (writing) {
    return (
      <div>
        <PageHeader
          title={editingId ? "Edit Catatan" : "Tulis Hari Ini"}
          subtitle={new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
        />
        <div className="p-5 space-y-4">
          <div>
            <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Mood</p>
            <div className="grid grid-cols-3 gap-2">
              {moods.map((m) => (
                <button key={m.key} onClick={() => setMood(m.key)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl border ${mood === m.key ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[11px] font-medium">{m.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60">
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">✨ Prompt</p>
            <p className="text-sm font-semibold leading-snug">{todayPrompt}</p>
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder="Tulis bebas apapun yang kamu rasakan…" rows={10}
            className="w-full p-4 rounded-2xl border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="flex gap-2">
            <Button variant="outlineHero" size="lg" className="flex-1"
              onClick={() => { setWriting(false); setEditingId(null); setText(""); setMood(null); }}>
              Batal
            </Button>
            <Button variant="hero" size="lg" className="flex-1" disabled={!mood || !text.trim()} onClick={save}>
              Simpan
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const filtered = entries
    .filter(e => tab === "fav" ? e.is_favorite : true)
    .filter(e => q ? e.content.toLowerCase().includes(q.toLowerCase()) || e.mood?.includes(q.toLowerCase()) : true);

  const draft = localStorage.getItem(DRAFT_KEY);

  return (
    <div>
      <PageHeader title="Safe Diary" subtitle="Privat, aman, hanya untukmu." />
      <div className="p-5 space-y-4">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-violet-50 to-indigo-100 border border-violet-200/60 flex items-center gap-3">
          <Lock className="h-5 w-5 text-violet-700 shrink-0" />
          <p className="text-xs text-foreground/80">Tulisanmu tersimpan aman & hanya kamu yang bisa membacanya.</p>
        </div>

        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 border border-amber-200/60">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-amber-700" />
            <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Prompt Hari Ini</p>
          </div>
          <p className="text-sm font-semibold leading-snug">{todayPrompt}</p>
        </div>

        {draft && (
          <div className="p-3 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between gap-2">
            <p className="text-xs text-sky-900">Draft terakhir ditemukan. Lanjutkan menulis?</p>
            <div className="flex gap-1">
              <button onClick={() => { localStorage.removeItem(DRAFT_KEY); setText(""); setMood(null); }}
                className="h-7 w-7 rounded-full bg-white flex items-center justify-center"><X className="h-3 w-3" /></button>
              <button onClick={() => openWrite()} className="px-3 h-7 rounded-full bg-sky-600 text-white text-xs font-semibold">Lanjut</button>
            </div>
          </div>
        )}

        <Button variant="hero" size="xl" className="w-full" onClick={() => openWrite()}>
          <Plus className="h-5 w-5" /> Tulis Hari Ini
        </Button>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Cari catatan atau mood..."
            className="w-full pl-10 h-10 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
        </div>

        <div className="flex gap-2">
          <button onClick={() => setTab("all")}
            className={`flex-1 h-9 rounded-xl text-xs font-semibold ${tab === "all" ? "bg-foreground text-background" : "bg-card border border-border"}`}>
            Semua ({entries.length})
          </button>
          <button onClick={() => setTab("fav")}
            className={`flex-1 h-9 rounded-xl text-xs font-semibold ${tab === "fav" ? "bg-foreground text-background" : "bg-card border border-border"}`}>
            ★ Favorit ({entries.filter(e => e.is_favorite).length})
          </button>
        </div>

        <div className="space-y-3">
          {loading && <p className="text-center text-xs text-muted-foreground py-6">Memuat...</p>}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-10 space-y-2">
              <Calendar className="h-10 w-10 mx-auto text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">Belum ada catatan. Mulai menulis hari ini 💙</p>
            </div>
          )}
          {filtered.map((e) => {
            const m = moods.find(mm => mm.key === e.mood);
            return (
              <div key={e.id} className="p-4 rounded-2xl bg-card border border-border/60">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    {m && <span className="text-base">{m.emoji}</span>}
                    <p className="text-xs font-semibold text-muted-foreground">{friendlyDate(e.created_at)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => toggleFav(e)} className="p-1.5">
                      <Star className={`h-4 w-4 ${e.is_favorite ? "fill-amber-400 text-amber-500" : "text-muted-foreground"}`} />
                    </button>
                    <button onClick={() => openWrite(e)} className="p-1.5"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                    <button onClick={() => remove(e.id)} className="p-1.5"><Trash2 className="h-3.5 w-3.5 text-rose-500" /></button>
                  </div>
                </div>
                <p className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap">{e.content}</p>
              </div>
            );
          })}
        </div>

        <div className="p-4 rounded-2xl bg-violet-50 border border-violet-200/60 flex items-center gap-3">
          <Lock className="h-4 w-4 text-violet-700 shrink-0" />
          <p className="text-[11px] text-violet-900">🔒 Semua tulisanmu tetap privat dan hanya untukmu.</p>
        </div>
        <Link to="/emergency" className="block text-center text-xs font-semibold py-3 rounded-xl bg-card border border-border">
          💬 Butuh teman bicara? Konsultasi via Instagram
        </Link>
      </div>
    </div>
  );
}
