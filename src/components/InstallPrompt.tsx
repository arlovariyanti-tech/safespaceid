import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Download, X, Share } from "lucide-react";

export function InstallPrompt() {
  const { visible, install, dismiss, isIOS, canPrompt } = useInstallPrompt();
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-4 pb-6 sm:p-6 pointer-events-none">
      <div className="max-w-[440px] mx-auto pointer-events-auto rounded-3xl bg-card border border-border shadow-2xl p-4 flex items-start gap-3 animate-in slide-in-from-bottom-8">
        <div className="h-12 w-12 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center text-primary-foreground shrink-0">
          <Download className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm">Tambahkan ke layar utama?</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            {isIOS && !canPrompt
              ? <>Ketuk <Share className="inline h-3 w-3" /> lalu pilih <b>"Add to Home Screen"</b>.</>
              : "Akses No More Bully langsung dari home screen kamu."}
          </p>
          <div className="flex gap-2 mt-3">
            {(!isIOS || canPrompt) && (
              <button onClick={install} className="px-4 h-9 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                Tambahkan
              </button>
            )}
            <button onClick={dismiss} className="px-4 h-9 rounded-full border border-border text-xs font-medium">
              Nanti
            </button>
          </div>
        </div>
        <button onClick={dismiss} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
