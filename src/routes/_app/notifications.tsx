import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { ArrowLeft, Bell, Trash2, CheckCheck, Award, Target, MessageCircleHeart, NotebookPen, Sparkles, Heart, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/notifications")({
  component: NotificationsPage,
});

type N = { id: string; type: string; title: string; body: string | null; link: string | null; is_read: boolean; created_at: string };

const ICONS: Record<string, any> = {
  challenge: Target, badge: Award, community: MessageCircleHeart,
  diary: NotebookPen, motivation: Sparkles, healing: Heart, school: GraduationCap, info: Bell,
};

function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<N[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(100);
    setItems((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel("notif-rt").on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, load).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const markAll = async () => {
    await supabase.rpc("mark_all_notifications_read");
    toast.success("Semua notifikasi dibaca");
    load();
  };

  const markOne = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    load();
  };

  const remove = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setItems((p) => p.filter((x) => x.id !== id));
  };

  const unread = items.filter((i) => !i.is_read).length;

  return (
    <div>
      <PageHeader
        title="Notifikasi"
        back={<Link to="/home" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>}
        action={unread > 0 ? <button onClick={markAll} className="text-xs font-semibold text-primary flex items-center gap-1"><CheckCheck className="h-4 w-4" /> Tandai dibaca</button> : null}
      />
      <div className="p-5 space-y-2">
        {loading ? (
          <div className="text-center text-sm text-muted-foreground py-10">Memuat…</div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 animate-fade-in">
            <div className="h-20 w-20 rounded-3xl bg-muted mx-auto flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="font-bold">Belum ada notifikasi</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">Kabar challenge, badge baru, dan pesan komunitas akan muncul di sini.</p>
          </div>
        ) : items.map((n) => {
          const Icon = ICONS[n.type] ?? Bell;
          const card = (
            <div className={`p-4 rounded-2xl border flex items-start gap-3 transition ${n.is_read ? "bg-card border-border/60" : "bg-primary/5 border-primary/20"}`}>
              <div className={`h-10 w-10 rounded-xl shrink-0 flex items-center justify-center ${n.is_read ? "bg-muted" : "bg-primary/15 text-primary"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm truncate">{n.title}</p>
                  {!n.is_read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                </div>
                {n.body && <p className="text-xs text-foreground/70 mt-0.5 leading-relaxed">{n.body}</p>}
                <p className="text-[10px] text-muted-foreground mt-1">{timeAgo(n.created_at)}</p>
              </div>
              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); remove(n.id); }} className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center shrink-0">
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
          );
          return n.link ? (
            <Link key={n.id} to={n.link as any} onClick={() => markOne(n.id)} className="block animate-fade-in">{card}</Link>
          ) : (
            <button key={n.id} onClick={() => markOne(n.id)} className="block w-full text-left animate-fade-in">{card}</button>
          );
        })}
      </div>
    </div>
  );
}

function timeAgo(s: string) {
  const d = (Date.now() - new Date(s).getTime()) / 1000;
  if (d < 60) return "baru saja";
  if (d < 3600) return `${Math.floor(d/60)} menit lalu`;
  if (d < 86400) return `${Math.floor(d/3600)} jam lalu`;
  return `${Math.floor(d/86400)} hari lalu`;
}
