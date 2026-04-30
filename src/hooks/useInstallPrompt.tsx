import { useEffect, useState } from "react";

type BIPEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

const DISMISS_KEY = "nmb_install_dismissed_until";

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-ignore
      window.navigator.standalone === true;
    if (standalone) { setInstalled(true); return; }

    const ua = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(ua);
    setIsIOS(ios);

    const dismissedUntil = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() < dismissedUntil) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", () => { setInstalled(true); setVisible(false); });

    if (ios) {
      // iOS doesn't support BIP — show manual instructions after delay
      const t = setTimeout(() => setVisible(true), 2000);
      return () => { clearTimeout(t); window.removeEventListener("beforeinstallprompt", onBIP); };
    }
    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const install = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
      setVisible(false);
    }
  };

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 1000 * 60 * 60 * 24 * 7));
    setVisible(false);
  };

  return { visible: visible && !installed, install, dismiss, isIOS, canPrompt: !!deferred };
}
