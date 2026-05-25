import { Link, useLocation } from "@tanstack/react-router";
import { Home, NotebookPen, Users, GraduationCap, User } from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: typeof Home;
};

const items: NavItem[] = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/diary", label: "Diary", icon: NotebookPen },
  { to: "/class", label: "Kelas", icon: GraduationCap },
  { to: "/community", label: "Komunitas", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
];


export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-xl border-t border-border/60 px-2 pt-2 pb-3">
      <div className="flex justify-around items-end">
        {items.map((it) => {
          const active = pathname === it.to;
          const Icon = it.icon;
          return (
            <Link
              key={it.to}
              to={it.to as "/home"}
              className="flex flex-col items-center gap-1 px-4 py-1.5"
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
