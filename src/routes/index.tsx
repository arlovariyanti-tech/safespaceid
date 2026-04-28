import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Shield } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  const { session, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      if (session) nav({ to: "/home" });
      else {
        const seen = typeof window !== "undefined" && localStorage.getItem("nmb_onboarded");
        nav({ to: seen ? "/login" : "/onboarding" });
      }
    }, 1200);
    return () => clearTimeout(t);
  }, [loading, session, nav]);

  return (
    <MobileFrame>
      <div
        className="min-h-screen flex flex-col items-center justify-center py-16 px-8 text-center"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="space-y-6 animate-in fade-in duration-700">
          <div className="mx-auto h-24 w-24 rounded-3xl bg-[image:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Shield className="h-12 w-12 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              NO MORE <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">BULLY</span>
            </h1>
            <p className="mt-3 text-base text-muted-foreground italic">
              Stop Bullying. Start Healing.
            </p>
          </div>
          <div className="pt-4">
            <div className="h-1 w-24 mx-auto bg-primary/20 rounded-full overflow-hidden">
              <div className="h-full w-1/2 bg-primary animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
