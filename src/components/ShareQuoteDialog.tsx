import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Instagram, MessageCircle, Copy, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

const APP_LINK = typeof window !== "undefined" ? window.location.origin : "https://antibully.lovable.app";

export function ShareQuoteDialog({ open, onOpenChange, quote }: { open: boolean; onOpenChange: (v: boolean) => void; quote: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { if (open) generate(); }, [open, quote]);

  const generate = async () => {
    setBusy(true);
    const c = canvasRef.current ?? document.createElement("canvas");
    canvasRef.current = c;
    c.width = 1080; c.height = 1920;
    const ctx = c.getContext("2d")!;
    // soft pastel gradient
    const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
    grad.addColorStop(0, "#fce7f3");
    grad.addColorStop(0.5, "#e0e7ff");
    grad.addColorStop(1, "#cffafe");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);
    // soft circles
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath(); ctx.arc(900, 300, 220, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(150, 1700, 280, 0, Math.PI*2); ctx.fill();
    // quote mark
    ctx.fillStyle = "rgba(99,102,241,0.25)";
    ctx.font = "bold 280px serif";
    ctx.fillText("\u201C", 120, 700);
    // quote text wrap
    ctx.fillStyle = "#1e1b4b";
    ctx.font = "600 64px -apple-system, system-ui, sans-serif";
    ctx.textAlign = "center";
    wrapText(ctx, quote, 540, 900, 880, 86);
    // logo / brand
    ctx.fillStyle = "#6366f1";
    ctx.font = "bold 36px -apple-system, system-ui, sans-serif";
    ctx.fillText("SafeSpace", 540, 1780);
    ctx.fillStyle = "#64748b";
    ctx.font = "400 28px -apple-system, system-ui, sans-serif";
    ctx.fillText("antibully.lovable.app", 540, 1830);

    const url = c.toDataURL("image/png");
    setImgUrl(url);
    setBusy(false);
  };

  const download = () => {
    if (!imgUrl) return;
    const a = document.createElement("a");
    a.href = imgUrl; a.download = "no-more-bully-quote.png"; a.click();
    toast.success("Quote tersimpan ke galeri");
  };

  const shareNative = async (platform: "ig" | "wa") => {
    const text = `"${quote}"\n\nDari SafeSpace: ${APP_LINK}`;
    if (platform === "wa") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      return;
    }
    // Instagram: try native share with image, fallback to download + open IG
    if (imgUrl && navigator.canShare) {
      try {
        const blob = await (await fetch(imgUrl)).blob();
        const file = new File([blob], "quote.png", { type: "image/png" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], text });
          return;
        }
      } catch { /* fallback */ }
    }
    download();
    setTimeout(() => window.open("instagram://story-camera", "_blank"), 400);
    toast("Buka Instagram → Story → pilih gambar yang baru disimpan ✨");
  };

  const copy = async () => {
    await navigator.clipboard.writeText(`"${quote}"\n\nDari SafeSpace: ${APP_LINK}`);
    toast.success("Teks disalin");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-3xl">
        <DialogHeader><DialogTitle>Bagikan Motivasi</DialogTitle></DialogHeader>
        <div className="rounded-2xl overflow-hidden border border-border aspect-[9/16] bg-gradient-to-br from-pink-100 via-indigo-100 to-cyan-100 flex items-center justify-center">
          {busy || !imgUrl
            ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            : <img src={imgUrl} alt="quote preview" className="w-full h-full object-cover" />}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <ShareBtn icon={Instagram} label="Story Instagram" onClick={() => shareNative("ig")} cls="bg-gradient-to-br from-fuchsia-500 to-orange-400 text-white" />
          <ShareBtn icon={MessageCircle} label="WhatsApp" onClick={() => shareNative("wa")} cls="bg-emerald-500 text-white" />
          <ShareBtn icon={Copy} label="Salin Teks" onClick={copy} cls="bg-card border border-border" />
          <ShareBtn icon={Download} label="Download" onClick={download} cls="bg-card border border-border" />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShareBtn({ icon: Icon, label, onClick, cls }: any) {
  return (
    <button onClick={onClick} className={`h-12 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 active:scale-95 transition ${cls}`}>
      <Icon className="h-4 w-4" /> {label}
    </button>
  );
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lh: number) {
  const words = text.split(" ");
  let line = ""; let yy = y;
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line, x, yy);
      line = w; yy += lh;
    } else line = test;
  }
  if (line) ctx.fillText(line, x, yy);
}
