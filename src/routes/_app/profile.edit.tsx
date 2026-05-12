import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { PageHeader } from "@/components/MobileFrame";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Camera, Loader2, Trash2 } from "lucide-react";

export const Route = createFileRoute("/_app/profile/edit")({
  component: EditProfile,
});

const BIO_MAX = 120;

function EditProfile() {
  const nav = useNavigate();
  const { user } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [originalUsername, setOriginalUsername] = useState("");
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
        setOriginalUsername((data as any).username ?? "");
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
    if (file.size > 5 * 1024 * 1024) return toast.error("Maksimal ukuran 5MB");
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

  const removePhoto = () => {
    setAvatarUrl(null);
    setPreviewUrl(null);
    toast("Foto akan dihapus saat kamu menyimpan");
  };

  const validate = async () => {
    if (!displayName.trim()) { toast.error("Nama wajib diisi"); return false; }
    if (bio.length > BIO_MAX) { toast.error(`Bio maksimal ${BIO_MAX} karakter`); return false; }
    const u = username.trim();
    if (u && !/^[a-zA-Z0-9_.]{3,20}$/.test(u)) { toast.error("Username 3-20 karakter (huruf/angka/_/.)"); return false; }
    if (u && u.toLowerCase() !== originalUsername.toLowerCase()) {
      const { data } = await supabase.from("profiles").select("id").ilike("username", u).neq("id", user!.id).maybeSingle();
      if (data) { toast.error("Username sudah dipakai"); return false; }
    }
    return true;
  };

  const save = async () => {
    if (!user) return;
    if (!(await validate())) return;
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
  const showAvatar = previewUrl || avatarUrl;

  return (
    <div className="pb-28 animate-fade-in">
      <PageHeader title="Edit Profil" back={<Link to="/profile" className="h-9 w-9 rounded-full bg-muted flex items-center justify-center"><ArrowLeft className="h-4 w-4" /></Link>} />
      {loading ? (
        <div className="p-10 text-center text-sm text-muted-foreground">Memuat…</div>
      ) : (
        <div className="p-5 space-y-6">
          <div className="flex flex-col items-center">
            <button onClick={onPick} className="relative group">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-[image:var(--gradient-primary)] flex items-center justify-center text-4xl font-black text-primary-foreground shadow-[var(--shadow-glow)] ring-4 ring-background">
                {showAvatar
                  ? <img src={previewUrl ?? avatarUrl ?? ""} alt="avatar" className="h-full w-full object-cover" />
                  : initial}
              </div>
              <div className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg ring-4 ring-background">
                <Camera className="h-4 w-4" />
              </div>
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                </div>
              )}
            </button>
            <div className="flex gap-3 mt-3">
              <button onClick={onPick} className="text-xs font-semibold text-primary">Ganti foto</button>
              {showAvatar && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <button onClick={removePhoto} className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                    <Trash2 className="h-3 w-3" /> Hapus foto
                  </button>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
          </div>

          <div className="space-y-3">
            <Field label="Nama" value={displayName} onChange={setDisplayName} placeholder="Nama lengkap" />
            <Field label="Username" value={username} onChange={(v) => setUsername(v.toLowerCase().replace(/\s/g, ""))} placeholder="username_kamu" />
            <Field label="Email" value={user?.email ?? ""} onChange={() => {}} placeholder="" disabled />
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value.slice(0, BIO_MAX))} rows={3} maxLength={BIO_MAX}
                placeholder="Ceritakan sedikit tentangmu…"
                className="mt-1 w-full p-3 rounded-2xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <p className="text-[10px] text-muted-foreground text-right mt-1">{bio.length}/{BIO_MAX}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating save */}
      {!loading && (
        <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
          <div className="max-w-[440px] mx-auto px-5 pb-5 pt-3 bg-gradient-to-t from-background via-background to-transparent pointer-events-auto">
            <Button variant="hero" size="xl" className="w-full shadow-[var(--shadow-glow)]" onClick={save} disabled={saving || uploading}>
              {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Menyimpan…</> : "Simpan Perubahan"}
            </Button>
          </div>
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
