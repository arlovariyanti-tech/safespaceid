import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MobileFrame } from "@/components/MobileFrame";
import { BottomNav } from "@/components/BottomNav";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
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
