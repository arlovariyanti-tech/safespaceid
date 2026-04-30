import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/_app/profile/privacy")({
  component: Privacy,
});

function Privacy() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowAnon, setAllowAnon] = useState(true);
  const [allowComments, setAllowComments] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("is_private, allow_anonymous, allow_comments").eq("id", user.id).maybeSingle();
      if (data) {
        setIsPrivate((data as any).is_private ?? false);
        setAllowAnon((data as any).allow_anonymous ?? true);
        setAllowComments((data as any).allow_comments ?? true);
      }
      setLoading(false);
    })();
  }, [user]);

  const update = async (patch: { is_private?: boolean; allow_anonymous?: boolean; allow_comments?: boolean }) => {
    if (!user) return;
    const { error } = await supabase.from("profiles").update(patch).eq("id", user.id);
    if (error) toast.error(error.message);
    else toast.success("Pengaturan disimpan");
  };

  return (
    <div>
      <PageHeader title="Privasi & Keamanan" back={<Link to="/profile" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>} />
      <div className="p-5 space-y-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-900 leading-relaxed">
            Data kamu aman dan tidak dibagikan tanpa izin. Kami tidak menjual atau membagikan informasimu ke pihak ketiga.
          </p>
        </div>

        {loading ? <div className="p-10 text-center text-sm text-muted-foreground">Memuat…</div> : (
          <div className="rounded-2xl bg-card border border-border/60 divide-y divide-border/60">
            <Toggle label="Akun Privat" desc="Hanya kamu yang bisa lihat profilmu." value={isPrivate}
              onChange={(v) => { setIsPrivate(v); update({ is_private: v }); }} />
            <Toggle label="Izinkan posting anonim" desc="Tetap bisa posting tanpa nama di komunitas." value={allowAnon}
              onChange={(v) => { setAllowAnon(v); update({ allow_anonymous: v }); }} />
            <Toggle label="Izinkan komentar" desc="Orang lain bisa berkomentar di postingmu." value={allowComments}
              onChange={(v) => { setAllowComments(v); update({ allow_comments: v }); }} />
          </div>
        )}

        <div className="p-4 rounded-2xl bg-card border border-border/60">
          <p className="text-sm font-semibold mb-1">Blokir Pengguna</p>
          <p className="text-xs text-muted-foreground">Fitur blokir akan tersedia di update berikutnya.</p>
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: { label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="w-full flex items-center justify-between gap-4 p-4 text-left">
      <div className="flex-1">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
      </div>
      <div className={`relative h-6 w-11 rounded-full transition ${value ? "bg-primary" : "bg-muted"}`}>
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${value ? "left-[22px]" : "left-0.5"}`} />
      </div>
    </button>
  );
}
