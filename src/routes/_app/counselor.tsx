import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { ShieldAlert, ArrowLeft, Inbox, CheckCheck, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/counselor")({
  component: CounselorDashboard,
});

type Report = {
  id: string; school_code: string; category: string; severity: string;
  message: string; status: string; counselor_notes: string | null;
  created_at: string;
};

const STATUS_OPTS = [
  { id: "new", label: "Baru", icon: Inbox, color: "bg-rose-100 text-rose-700" },
  { id: "in_review", label: "Diproses", icon: Clock, color: "bg-amber-100 text-amber-700" },
  { id: "resolved", label: "Selesai", icon: CheckCheck, color: "bg-emerald-100 text-emerald-700" },
];

function CounselorDashboard() {
  const { user } = useAuth();
  const [canAccess, setCanAccess] = useState<boolean | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [filter, setFilter] = useState("new");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user) return;
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
    const ok = (roles ?? []).some((r: any) => r.role === "counselor" || r.role === "admin");
    setCanAccess(ok);
    if (!ok) return setLoading(false);
    const { data } = await supabase.from("anonymous_reports" as any).select("*").order("created_at", { ascending: false });
    setReports((data as any) ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [user]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("anonymous_reports" as any).update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Status diperbarui");
    setReports(rs => rs.map(r => r.id === id ? { ...r, status } : r));
  };

  if (canAccess === null || loading) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Memuat…</div>;
  }
  if (!canAccess) {
    return (
      <div>
        <PageHeader title="Dashboard BK" back={<Link to="/profile" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>} />
        <div className="p-8 text-center">
          <ShieldAlert className="h-12 w-12 mx-auto text-rose-500 mb-3" />
          <p className="font-semibold">Akses ditolak</p>
          <p className="text-sm text-muted-foreground mt-1">Hanya untuk Guru BK / Konselor sekolah.</p>
        </div>
      </div>
    );
  }

  const filtered = reports.filter(r => filter === "all" || r.status === filter);
  const counts = {
    new: reports.filter(r => r.status === "new").length,
    in_review: reports.filter(r => r.status === "in_review").length,
    resolved: reports.filter(r => r.status === "resolved").length,
  };

  return (
    <div className="pb-24 animate-fade-in">
      <PageHeader
        title="Dashboard BK"
        subtitle="Laporan anonim dari siswa"
        back={<Link to="/profile" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>}
      />
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-2">
          {STATUS_OPTS.map((s) => (
            <button key={s.id} onClick={() => setFilter(s.id)}
              className={`p-3 rounded-2xl border text-center transition ${filter === s.id ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
              <s.icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
              <p className="text-lg font-black">{counts[s.id as keyof typeof counts]}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">Tidak ada laporan di kategori ini.</div>
        )}

        {filtered.map((r) => (
          <article key={r.id} className="p-4 rounded-2xl bg-card border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  r.severity === "high" ? "bg-rose-100 text-rose-700" :
                  r.severity === "medium" ? "bg-amber-100 text-amber-700" :
                  "bg-emerald-100 text-emerald-700"
                }`}>{r.severity}</span>
                <span className="text-[10px] font-semibold text-muted-foreground">{r.category}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">{new Date(r.created_at).toLocaleString("id-ID")}</p>
            </div>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{r.message}</p>
            <div className="flex gap-2 pt-1">
              {STATUS_OPTS.map(s => (
                <button key={s.id} onClick={() => updateStatus(r.id, s.id)}
                  className={`flex-1 h-8 rounded-lg text-[11px] font-semibold transition ${
                    r.status === s.id ? s.color : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
