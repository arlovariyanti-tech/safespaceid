import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Check, X, ShieldAlert, Copy } from "lucide-react";

export const Route = createFileRoute("/_app/admin")({
  component: AdminPage,
});

type SchoolRow = {
  code: string;
  display_name: string;
  city: string | null;
  submitter_name: string | null;
  submitter_contact: string | null;
  status: string;
  created_at: string;
};

function AdminPage() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [pending, setPending] = useState<SchoolRow[]>([]);
  const [approved, setApproved] = useState<SchoolRow[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data: roles } = await supabase
      .from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    const admin = !!roles;
    setIsAdmin(admin);
    if (!admin) return;

    const { data } = await supabase
      .from("schools").select("code, display_name, city, submitter_name, submitter_contact, status, created_at")
      .order("created_at", { ascending: false });
    setPending((data ?? []).filter((s) => s.status === "pending") as SchoolRow[]);
    setApproved((data ?? []).filter((s) => s.status === "approved") as SchoolRow[]);
  };

  useEffect(() => { load(); }, [user]);

  const approve = async (code: string) => {
    setLoading(true);
    const { data, error } = await supabase.rpc("approve_school", { _pending_code: code });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Disetujui! Kode: ${data}`);
    load();
  };

  const reject = async (code: string) => {
    if (!confirm("Tolak pengajuan ini?")) return;
    setLoading(true);
    const { error } = await supabase.rpc("reject_school", { _pending_code: code });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Pengajuan ditolak");
    load();
  };

  if (isAdmin === null) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Memeriksa akses...</div>;
  }

  if (!isAdmin) {
    return (
      <div>
        <PageHeader title="Admin" subtitle="Khusus pemilik aplikasi" />
        <div className="p-8 text-center">
          <ShieldAlert className="h-12 w-12 mx-auto text-rose-500 mb-3" />
          <p className="font-semibold">Akses ditolak</p>
          <p className="text-sm text-muted-foreground mt-1">Halaman ini hanya untuk admin SafeSpace.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Panel Admin" subtitle="Kelola pengajuan sekolah" />
      <div className="p-5 space-y-6">
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Menunggu Persetujuan ({pending.length})
          </h3>
          {pending.length === 0 && (
            <div className="p-4 rounded-2xl bg-muted/40 text-sm text-muted-foreground text-center">
              Tidak ada pengajuan baru
            </div>
          )}
          <div className="space-y-3">
            {pending.map((s) => (
              <div key={s.code} className="p-4 rounded-2xl bg-card border border-amber-200/60 bg-gradient-to-br from-amber-50/40 to-card">
                <p className="font-bold">{s.display_name}</p>
                <p className="text-xs text-muted-foreground">{s.city || "—"}</p>
                <div className="mt-2 text-xs space-y-0.5">
                  {s.submitter_name && <p>Pengaju: <span className="font-semibold">{s.submitter_name}</span></p>}
                  {s.submitter_contact && <p>Kontak: <span className="font-mono">{s.submitter_contact}</span></p>}
                </div>
                <div className="flex gap-2 mt-3">
                  <Button size="sm" onClick={() => approve(s.code)} disabled={loading} className="flex-1">
                    <Check className="h-4 w-4 mr-1" /> Setujui
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => reject(s.code)} disabled={loading} className="flex-1">
                    <X className="h-4 w-4 mr-1" /> Tolak
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Sekolah Aktif ({approved.length})
          </h3>
          <div className="space-y-2">
            {approved.map((s) => (
              <div key={s.code} className="p-3 rounded-xl bg-card border border-border/60 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{s.display_name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.city || "—"}</p>
                </div>
                <button
                  onClick={() => { navigator.clipboard.writeText(s.code); toast.success("Kode disalin"); }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs font-mono font-bold"
                >
                  <Copy className="h-3 w-3" /> {s.code}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
