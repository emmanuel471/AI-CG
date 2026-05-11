import { Link, useNavigate, useLocation } from "react-router-dom";
import { Sparkles, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";
import { persistor, selectAuthState, selectUser } from "@/store/store";
import { LOGIN_FAILURE } from "@/store/authActionTypes";

interface NavItem {
  to: string;
  label: string;
}

const publicNav: NavItem[] = [];

const privateNav: NavItem[] = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/recommendations", label: "Careers" },
  { to: "/skills-gap", label: "Skills" },
  { to: "/profile", label: "Profile" },
];

export function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const auth = useSelector(selectAuthState);
  const user = useSelector(selectUser);

  const isAuthenticated = !!auth.accessToken;

  const pathname = location.pathname;
  const items = isAuthenticated ? privateNav : publicNav;

  const logout = async () => {
    dispatch({ type: LOGIN_FAILURE });
    await persistor.purge();
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/40 border-b border-glass-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">


        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-gradient-primary p-2 rounded-xl">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
          </div>

          <span className="font-semibold tracking-tight text-lg">
            AI-<span className="text-gradient-primary">Career Guidance</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {items.map((item) => {
            const active = pathname === item.to;

            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm transition-all",
                  active
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden sm:block text-sm text-muted-foreground mr-2">
                {user?.firstName}
              </span>

              <Button
                variant="ghost"
                size="sm"
                leftIcon={<LogOut className="h-4 w-4" />}
                onClick={logout}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate("/register")}>
                Get started
              </Button>
            </>
          )}
        </div>

      </div>
    </header>
  );
}