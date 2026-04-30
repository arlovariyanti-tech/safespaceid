import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/profile/edit")({
  component: EditProfile,
});

function EditProfile() {
  const nav = useNavigate();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();
      if (data) {
        setDisplayName(data.display_name ?? "");
        setUsername((data as any).username ?? "");
        setBio((data as any).bio ?? "");
        setAvatarUrl(data.avatar_url ?? null);
      }
      setLoading(false);
    })();
  }, [user]);

  const onPick = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Maks 5MB");
    setPreviewUrl(URL.createObjectURL(file));
    setUploading(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${user.id}/avatar-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type });
    if (error) { setUploading(false); return toast.error("Upload gagal: " + error.message); }
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setAvatarUrl(data.publicUrl);
    setUploading(false);
    toast.success("Foto siap disimpan");
  };

  const save = async () => {
    if (!user) return;
    if (!displayName.trim()) return toast.error("Nama wajib diisi");
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      display_name: displayName.trim(),
      username: username.trim() || null,
      bio: bio.trim() || null,
      avatar_url: avatarUrl,
    });
    if (error) { setSaving(false); return toast.error(error.message); }
    await supabase.auth.updateUser({ data: { display_name: displayName.trim(), avatar_url: avatarUrl } });
    setSaving(false);
    toast.success("Profil berhasil diperbarui ✨");
    nav({ to: "/profile" });
  };

  const initial = displayName[0]?.toUpperCase() ?? "S";

  return (
    <div>
      <PageHeader title="Edit Profil" left={<Link to="/profile" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>} />
      {loading ? (
        <div className="p-10 text-center text-sm text-muted-foreground">Memuat…</div>
      ) : (
        <div className="p-5 space-y-6">
          <div className="flex flex-col items-center">
            <button onClick={onPick} className="relative group">
              <div className="h-28 w-28 rounded-3xl overflow-hidden bg-[image:var(--gradient-primary)] flex items-center justify-center text-3xl font-black text-primary-foreground shadow-[var(--shadow-glow)]">
                {previewUrl || avatarUrl
                  ? <img src={previewUrl ?? avatarUrl ?? ""} alt="avatar" className="h-full w-full object-cover" />
                  : initial}
              </div>
              <div className="absolute inset-0 rounded-3xl bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                <Camera className="h-6 w-6 text-white" />
              </div>
              {uploading && (
                <div className="absolute inset-0 rounded-3xl bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </button>
            <button onClick={onPick} className="mt-3 text-xs font-semibold text-primary">Ganti foto profil</button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>

          <div className="space-y-3">
            <Field label="Nama" value={displayName} onChange={setDisplayName} placeholder="Nama lengkap" />
            <Field label="Username" value={username} onChange={setUsername} placeholder="username_kamu" />
            <Field label="Email" value={user?.email ?? ""} onChange={() => {}} placeholder="" disabled />
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} maxLength={160}
                placeholder="Ceritakan sedikit tentangmu…"
                className="mt-1 w-full p-3 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <p className="text-[10px] text-muted-foreground text-right mt-1">{bio.length}/160</p>
            </div>
          </div>

          <Button variant="hero" size="xl" className="w-full" onClick={save} disabled={saving || uploading}>
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan…</> : "Simpan Perubahan"}
          </Button>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, disabled }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; disabled?: boolean }) {
  return (
    <div>
      <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder={placeholder}
        className="mt-1 w-full h-12 px-4 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-60" />
    </div>
  );
}
