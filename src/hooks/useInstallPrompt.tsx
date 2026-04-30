import { useEffect, useState, useCallback } from "react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "nmb_install_dismissed_until";

export type DeviceKind = "android" | "ios" | "desktop";

export function useInstallPrompt() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [device, setDevice] = useState<DeviceKind>("desktop");
  const [installed, setInstalled] = useState(false);
  const [showManual, setShowManual] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already installed / running standalone
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // @ts-ignore iOS Safari
      window.navigator.standalone === true;
    if (standalone) {
      setInstalled(true);
      return;
    }

    // Device detection
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua) || (/macintosh/.test(ua) && "ontouchend" in document);
    const isAndroid = /android/.test(ua);
    const kind: DeviceKind = isIOS ? "ios" : isAndroid ? "android" : "desktop";
    setDevice(kind);

    // Respect dismiss cooldown
    const dismissedUntil = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (Date.now() < dismissedUntil) return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setVisible(true);
    };
    const onInstalled = () => {
      setInstalled(true);
      setVisible(false);
      setShowManual(false);
      localStorage.setItem(DISMISS_KEY, String(Date.now() + 1000 * 60 * 60 * 24 * 365));
    };

    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);

    // Show prompt for iOS (no BIP) and as fallback for Android (e.g. Firefox/Samsung,
    // or Chrome that doesn't fire BIP yet) after a small delay.
    let t: ReturnType<typeof setTimeout> | undefined;
    if (kind !== "desktop") {
      t = setTimeout(() => setVisible(true), 1800);
    }

    return () => {
      if (t) clearTimeout(t);
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (deferred) {
      try {
        await deferred.prompt();
        const choice = await deferred.userChoice;
        setDeferred(null);
        setVisible(false);
        if (choice.outcome === "dismissed") {
          localStorage.setItem(DISMISS_KEY, String(Date.now() + 1000 * 60 * 60 * 24 * 3));
        }
      } catch {
        setShowManual(true);
      }
    } else {
      // No native prompt available — show manual guide
      setShowManual(true);
    }
  }, [deferred]);

  const dismiss = useCallback(() => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + 1000 * 60 * 60 * 24 * 7));
    setVisible(false);
    setShowManual(false);
  }, []);

  const closeManual = useCallback(() => setShowManual(false), []);

  return {
    visible: visible && !installed,
    install,
    dismiss,
    device,
    isIOS: device === "ios",
    isAndroid: device === "android",
    isDesktop: device === "desktop",
    canPrompt: !!deferred,
    showManual,
    closeManual,
  };
}
