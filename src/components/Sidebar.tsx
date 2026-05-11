import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Compass, Target, User as UserIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SidebarItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const items: SidebarItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/recommendations", label: "Recommendations", icon: <Compass className="h-4 w-4" /> },
  { to: "/skills-gap", label: "Skills Gap", icon: <Target className="h-4 w-4" /> },
  { to: "/profile", label: "Profile", icon: <UserIcon className="h-4 w-4" /> },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="glass rounded-2xl p-3 sticky top-24">
        <p className="px-3 pb-2 text-xs uppercase tracking-wider text-muted-foreground">
          Workspace
        </p>
        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all",
                  active
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}