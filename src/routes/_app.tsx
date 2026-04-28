import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { session, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !session) nav({ to: "/login" });
  }, [loading, session, nav]);

  if (loading) {
    return (
      <MobileFrame>
        <div className="min-h-screen flex items-center justify-center">
          <div className="h-10 w-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
        </div>
      </MobileFrame>
    );
  }

  if (!session) return null;

  return (
    <MobileFrame>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 pb-2">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </MobileFrame>
  );
}
