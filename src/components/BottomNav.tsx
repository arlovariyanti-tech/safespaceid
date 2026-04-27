import { Link, useLocation } from "@tanstack/react-router";
import { Home, BookOpen, AlertTriangle, Users, User } from "lucide-react";

const items = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/edukasi", label: "Edukasi", icon: BookOpen },
  { to: "/report", label: "Report", icon: AlertTriangle, primary: true },
  { to: "/community", label: "Community", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/60 px-2 pt-2 pb-3">
      <div className="flex justify-around items-end">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          if (it.primary) {
            return (
              <Link
                key={it.to}
                to={it.to}
                className="flex flex-col items-center -mt-7"
              >
                <div className="h-14 w-14 rounded-2xl bg-[image:var(--gradient-primary)] flex items-center justify-center shadow-[var(--shadow-glow)]">
                  <Icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <span className="text-[10px] mt-1 font-semibold text-primary">
                  {it.label}
                </span>
              </Link>
            );
          }
          return (
            <Link
              key={it.to}
              to={it.to}
              className="flex flex-col items-center gap-1 px-3 py-1.5"
            >
              <Icon
                className={`h-5 w-5 transition ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`text-[10px] font-medium ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {it.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
