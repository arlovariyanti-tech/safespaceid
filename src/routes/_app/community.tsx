import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Plus, Flag, X, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/community")({
  component: Community,
});

const categories = ["Semua", "Perasaan Hari Ini", "Cerita Bullying", "Positive Challenge", "Motivasi", "Pencapaian Kecil", "Social Prayer", "Dukungan untuk Teman"];
const moodOptions = ["😊", "😔", "😰", "😡", "😌", "🤍"];

type Post = {
  id: string; user_id: string; content: string; category: string;
  mood: string | null; is_anonymous: boolean; created_at: string;
  profile?: { display_name: string | null } | null;
  support_count: number; comment_count: number; user_supported: boolean;
};
type Comment = { id: string; content: string; is_anonymous: boolean; created_at: string; user_id: string; profile?: { display_name: string | null } | null };

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "baru saja";
  if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
  return `${Math.floor(diff / 86400)} hari lalu`;
}

function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  const [showCompose, setShowCompose] = useState(false);
  const [openPost, setOpenPost] = useState<Post | null>(null);

  // compose state
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Perasaan Hari Ini");
  const [mood, setMood] = useState<string | null>(null);
  const [anon, setAnon] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data: postsData } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (!postsData) { setLoading(false); return; }
    const userIds = [...new Set(postsData.map((p: any) => p.user_id))];
    const { data: profs } = await supabase.from("profiles").select("id, display_name").in("id", userIds);
    const { data: supports } = await supabase.from("community_supports").select("post_id, user_id");
    const { data: comments } = await supabase.from("community_comments").select("post_id");

    const profMap = new Map((profs ?? []).map((p: any) => [p.id, p]));
    const supByPost: Record<string, number> = {};
    const userSup: Set<string> = new Set();
    (supports ?? []).forEach((s: any) => {
      supByPost[s.post_id] = (supByPost[s.post_id] || 0) + 1;
      if (user && s.user_id === user.id) userSup.add(s.post_id);
    });
    const commentByPost: Record<string, number> = {};
    (comments ?? []).forEach((c: any) => { commentByPost[c.post_id] = (commentByPost[c.post_id] || 0) + 1; });

    setPosts((postsData as any[]).map((p) => ({
      ...p,
      profile: profMap.get(p.user_id) ?? null,
      support_count: supByPost[p.id] || 0,
      comment_count: commentByPost[p.id] || 0,
      user_supported: userSup.has(p.id),
    })));
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const submit = async () => {
    if (!text.trim() || !user) return;
    const { error } = await supabase.from("community_posts").insert({
      user_id: user.id, content: text.trim(), category, mood, is_anonymous: anon,
    });
    if (error) return toast.error("Gagal memposting");
    toast.success("Ceritamu dibagikan 🤍");
    setText(""); setMood(null); setAnon(false); setCategory("Perasaan Hari Ini");
    setShowCompose(false);
    load();
  };

  const toggleSupport = async (p: Post) => {
    if (!user) return;
    if (p.user_supported) {
      await supabase.from("community_supports").delete().eq("post_id", p.id).eq("user_id", user.id);
    } else {
      await supabase.from("community_supports").insert({ post_id: p.id, user_id: user.id });
    }
    setPosts(posts.map(x => x.id === p.id
      ? { ...x, user_supported: !x.user_supported, support_count: x.support_count + (x.user_supported ? -1 : 1) }
      : x));
  };

  const report = async (postId: string) => {
    if (!user) return;
    if (!confirm("Laporkan postingan ini sebagai tidak aman?")) return;
    await supabase.from("post_reports").insert({ post_id: postId, user_id: user.id, reason: "inappropriate" });
    toast.success("Terima kasih, laporan diterima");
  };

  const filtered = filter === "Semua" ? posts : posts.filter(p => p.category === filter);
  const stats = {
    stories: posts.length,
    supports: posts.reduce((a, p) => a + p.support_count, 0),
    challenges: posts.filter(p => p.category === "Positive Challenge").length,
  };
  const inspirasi = [...posts].sort((a, b) => b.support_count - a.support_count).slice(0, 1)[0];

  return (
    <div>
      <PageHeader title="Community" subtitle="Saling dukung tanpa menghakimi." />
      <div className="p-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <StatCard emoji="🤍" n={stats.stories} label="Cerita" />
          <StatCard emoji="🌱" n={stats.supports} label="Dukungan" />
          <StatCard emoji="✨" n={stats.challenges} label="Challenge" />
        </div>

        {/* Rules */}
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200/60 text-[11px] text-rose-900">
          🌸 <b>Ruang aman:</b> tidak ada bullying, hate speech, atau body shaming — hanya dukungan positif.
        </div>

        <Button variant="hero" size="xl" className="w-full" onClick={() => setShowCompose(true)}>
          <Plus className="h-5 w-5" /> Tulis Ceritamu
        </Button>

        {/* Inspirasi */}
        {inspirasi && inspirasi.support_count > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200/60">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-4 w-4 text-amber-700" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Cerita Inspiratif Hari Ini</p>
            </div>
            <p className="text-sm font-semibold leading-snug">"{inspirasi.content}"</p>
            <p className="text-[10px] text-amber-900/70 mt-2">❤️ {inspirasi.support_count} dukungan</p>
          </div>
        )}

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {categories.map((t) => (
            <button key={t} onClick={() => setFilter(t)}
              className={`shrink-0 px-4 h-8 rounded-full text-xs font-medium border ${
                filter === t ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Feed */}
        {loading && <p className="text-center text-xs text-muted-foreground py-6">Memuat...</p>}
        {!loading && filtered.length === 0 && (
          <p className="text-center text-xs text-muted-foreground py-6">Belum ada cerita. Jadilah yang pertama 💙</p>
        )}
        {filtered.map((p) => (
          <article key={p.id} className="p-4 rounded-2xl bg-card border border-border/60 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground font-bold text-sm">
                {p.is_anonymous ? "🌸" : (p.profile?.display_name?.[0] ?? "?").toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{p.is_anonymous ? "Anonim" : (p.profile?.display_name ?? "Sahabat")}</p>
                <p className="text-[10px] text-muted-foreground">{timeAgo(p.created_at)}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">{p.category}</span>
              {p.mood && <span className="text-base">{p.mood}</span>}
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{p.content}</p>
            <div className="flex items-center gap-4 pt-1 text-xs text-muted-foreground">
              <button onClick={() => toggleSupport(p)} className={`flex items-center gap-1.5 ${p.user_supported ? "text-rose-500" : "hover:text-primary"}`}>
                <Heart className={`h-4 w-4 ${p.user_supported ? "fill-rose-500" : ""}`} /> {p.support_count}
              </button>
              <button onClick={() => setOpenPost(p)} className="flex items-center gap-1.5 hover:text-primary">
                <MessageCircle className="h-4 w-4" /> {p.comment_count}
              </button>
              <button onClick={() => report(p.id)} className="flex items-center gap-1.5 hover:text-rose-500 ml-auto">
                <Flag className="h-3.5 w-3.5" /> Laporkan
              </button>
            </div>
          </article>
        ))}
      </div>

      {showCompose && (
        <ComposeModal
          text={text} setText={setText}
          category={category} setCategory={setCategory}
          mood={mood} setMood={setMood}
          anon={anon} setAnon={setAnon}
          onClose={() => setShowCompose(false)}
          onSubmit={submit}
        />
      )}

      {openPost && (
        <CommentsModal post={openPost} onClose={() => { setOpenPost(null); load(); }} />
      )}
    </div>
  );
}

function StatCard({ emoji, n, label }: { emoji: string; n: number; label: string }) {
  return (
    <div className="p-3 rounded-2xl bg-card border border-border/60 text-center">
      <p className="text-xl">{emoji}</p>
      <p className="text-sm font-bold">{n}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}

function ComposeModal({ text, setText, category, setCategory, mood, setMood, anon, setAnon, onClose, onSubmit }: any) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center p-0 sm:p-4">
      <div className="w-full max-w-[440px] bg-background rounded-t-3xl sm:rounded-3xl p-5 space-y-4 max-h-[92vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-lg">Tulis Ceritamu</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="Apa yang ingin kamu bagikan hari ini?" rows={5}
          className="w-full p-4 rounded-2xl border border-border bg-card text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Kategori</p>
          <div className="flex flex-wrap gap-1.5">
            {categories.filter(c => c !== "Semua").map((c) => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-3 h-8 rounded-full text-[11px] font-medium border ${category === c ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Mood (opsional)</p>
          <div className="flex gap-2">
            {moodOptions.map((m) => (
              <button key={m} onClick={() => setMood(mood === m ? null : m)}
                className={`h-10 w-10 rounded-xl text-xl ${mood === m ? "bg-primary/20 ring-2 ring-primary" : "bg-card border border-border"}`}>
                {m}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="h-4 w-4 accent-primary" />
          <span>Posting sebagai anonim 🌸</span>
        </label>
        <Button variant="hero" size="xl" className="w-full" disabled={!text.trim()} onClick={onSubmit}>
          Posting Sekarang
        </Button>
      </div>
    </div>
  );
}

function CommentsModal({ post, onClose }: { post: Post; onClose: () => void }) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [anon, setAnon] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("community_comments").select("*").eq("post_id", post.id).order("created_at", { ascending: true });
    if (!data) return;
    const ids = [...new Set(data.map((c: any) => c.user_id))];
    const { data: profs } = await supabase.from("profiles").select("id, display_name").in("id", ids);
    const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
    setComments((data as any[]).map(c => ({ ...c, profile: map.get(c.user_id) ?? null })));
  };

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!text.trim() || !user) return;
    await supabase.from("community_comments").insert({
      post_id: post.id, user_id: user.id, content: text.trim(), is_anonymous: anon,
    });
    setText(""); setAnon(false);
    load();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center">
      <div className="w-full max-w-[440px] bg-background rounded-t-3xl p-5 space-y-3 max-h-[85vh] flex flex-col">
        <div className="flex justify-between items-center">
          <h3 className="font-bold">Komentar</h3>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-3 rounded-2xl bg-card border border-border/60">
          <p className="text-xs text-foreground/80">"{post.content}"</p>
        </div>
        <div className="flex-1 overflow-y-auto space-y-2">
          {comments.length === 0 && <p className="text-center text-xs text-muted-foreground py-4">Belum ada komentar. Kirim dukungan pertama 💙</p>}
          {comments.map(c => (
            <div key={c.id} className="p-3 rounded-2xl bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="h-6 w-6 rounded-full bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground text-[10px] font-bold">
                  {c.is_anonymous ? "🌸" : (c.profile?.display_name?.[0] ?? "?").toUpperCase()}
                </div>
                <p className="text-xs font-semibold">{c.is_anonymous ? "Anonim" : c.profile?.display_name ?? "Sahabat"}</p>
                <p className="text-[10px] text-muted-foreground">{timeAgo(c.created_at)}</p>
              </div>
              <p className="text-xs leading-relaxed pl-8">{c.content}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 pt-2 border-t border-border">
          <label className="flex items-center gap-2 text-[11px]">
            <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} className="h-3.5 w-3.5 accent-primary" />
            Komentar sebagai anonim
          </label>
          <div className="flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Kirim semangat..."
              className="flex-1 h-11 px-4 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <Button variant="hero" onClick={submit} disabled={!text.trim()}>Kirim</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
