import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, ArrowRight } from "lucide-react";
import { MobileFrame } from "@/components/MobileFrame";

export const Route = createFileRoute("/")({
  component: Splash,
});

function Splash() {
  return (
    <MobileFrame>
      <div
        className="min-h-screen flex flex-col items-center justify-between py-16 px-8 text-center"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div />
        <div className="space-y-6 animate-in fade-in duration-700">
          <div className="mx-auto h-24 w-24 rounded-3xl bg-[image:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Shield className="h-12 w-12 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              NO MORE <span className="bg-clip-text text-transparent bg-[image:var(--gradient-primary)]">BULLY</span>
            </h1>
            <p className="mt-3 text-base text-muted-foreground italic">
              Bullying Bukan Candaan,
              <br />Luka Itu Nyata.
            </p>
          </div>
        </div>
        <Link
          to="/onboarding"
          className="w-full inline-flex items-center justify-center gap-2 h-14 rounded-full bg-[image:var(--gradient-primary)] text-primary-foreground font-semibold shadow-[var(--shadow-glow)] hover:scale-[1.02] transition"
        >
          Mulai <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </MobileFrame>
  );
}
