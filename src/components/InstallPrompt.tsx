import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Download, X, Share, MoreVertical, Plus, Smartphone } from "lucide-react";

export function InstallPrompt() {
  const { visible, install, dismiss, isIOS, isAndroid, isDesktop, canPrompt, showManual, closeManual } =
    useInstallPrompt();

  if (!visible && !showManual) return null;

  // Desktop → don't show floating banner (only manual modal if user explicitly opens)
  if (isDesktop && !showManual) return null;

  return (
    <>
      {visible && !showManual && (
        <div className="fixed inset-x-0 bottom-0 z-[60] p-4 pb-6 sm:p-6 pointer-events-none">
          <div className="max-w-[440px] mx-auto pointer-events-auto rounded-3xl bg-card border border-border shadow-2xl p-4 flex items-start gap-3 animate-in slide-in-from-bottom-8 fade-in duration-500">
            <div className="h-12 w-12 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground shrink-0 overflow-hidden">
              <img src="/icon-512.png" alt="SafeSpace" className="h-12 w-12 object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">Tambahkan ke layar utama 🤍</p>
              <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                Akses SafeSpace lebih cepat, langsung dari home screen kamu — seperti aplikasi nyata.
              </p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={install}
                  className="px-4 h-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold shadow-sm active:scale-95 transition"
                >
                  {canPrompt ? "Tambahkan Sekarang" : "Lihat Cara"}
                </button>
                <button
                  onClick={dismiss}
                  className="px-4 h-9 rounded-full border border-border text-xs font-medium active:scale-95 transition"
                >
                  Nanti
                </button>
              </div>
            </div>
            <button
              onClick={dismiss}
              aria-label="Tutup"
              className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {showManual && (
        <div
          className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeManual}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[440px] rounded-3xl bg-card border border-border shadow-2xl p-6 animate-in slide-in-from-bottom-8 duration-300"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <img src="/icon-512.png" alt="" className="h-12 w-12 rounded-2xl" />
                <div>
                  <h3 className="font-bold text-base leading-tight">Tambahkan ke Home Screen</h3>
                  <p className="text-[11px] text-muted-foreground">SafeSpace</p>
                </div>
              </div>
              <button
                onClick={closeManual}
                aria-label="Tutup"
                className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {isIOS && (
              <ol className="space-y-3 text-sm">
                <Step n={1} icon={<Share className="h-4 w-4" />}>
                  Ketuk tombol <b>Share</b> di toolbar Safari.
                </Step>
                <Step n={2} icon={<Plus className="h-4 w-4" />}>
                  Pilih <b>"Add to Home Screen"</b>.
                </Step>
                <Step n={3} icon={<Smartphone className="h-4 w-4" />}>
                  Ketuk <b>Add</b> — ikon NMB akan muncul di home screen.
                </Step>
              </ol>
            )}

            {isAndroid && (
              <ol className="space-y-3 text-sm">
                <Step n={1} icon={<MoreVertical className="h-4 w-4" />}>
                  Buka menu <b>titik tiga (⋮)</b> di pojok kanan atas Chrome.
                </Step>
                <Step n={2} icon={<Plus className="h-4 w-4" />}>
                  Pilih <b>"Tambahkan ke layar utama"</b> atau <b>"Install app"</b>.
                </Step>
                <Step n={3} icon={<Smartphone className="h-4 w-4" />}>
                  Konfirmasi — ikon NMB siap dipakai seperti aplikasi nyata.
                </Step>
              </ol>
            )}

            {isDesktop && (
              <ol className="space-y-3 text-sm">
                <Step n={1} icon={<Download className="h-4 w-4" />}>
                  Cari ikon <b>Install</b> di address bar browser kamu.
                </Step>
                <Step n={2} icon={<Plus className="h-4 w-4" />}>
                  Klik <b>Install</b> dan konfirmasi pemasangan.
                </Step>
                <Step n={3} icon={<Smartphone className="h-4 w-4" />}>
                  Atau buka di HP untuk pengalaman terbaik.
                </Step>
              </ol>
            )}

            <button
              onClick={closeManual}
              className="mt-5 w-full h-11 rounded-full bg-primary text-primary-foreground text-sm font-semibold active:scale-95 transition"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Step({ n, icon, children }: { n: number; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="h-7 w-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
        {n}
      </span>
      <span className="flex-1 leading-relaxed text-foreground/90 flex items-center gap-2">
        <span className="text-muted-foreground">{icon}</span>
        <span>{children}</span>
      </span>
    </li>
  );
}
