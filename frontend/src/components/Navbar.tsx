import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Code2,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  User,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { useAuthContext } from "@/context/authContext";
import { clearAuthSession } from "@/lib/authSession";
import axios from "axios";

interface NavItem {
  label: string;
  to: string;
}

export default function Navbar() {
  const { authUser, isAuthLoading, setAuthUser } = useAuthContext();
  const navigate = useNavigate();
  const role = isAuthLoading ? undefined : authUser?.role;

  const logoutHandler = async () => {
    try {
      if (role === "user") {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/auth/logout`,
          {},
          {
            withCredentials: true,
          }
        );
      }

      clearAuthSession();
      setAuthUser(null);
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (error) {
      clearAuthSession();
      setAuthUser(null);
      toast.error("Session cleared locally. Please sign in again if needed.");
      navigate("/signin");
    }
  };

  const navItems: NavItem[] = !role
    ? [
        { label: "Home", to: "/" },
        { label: "Problems", to: "/problems" },
        { label: "Admin Portal", to: "/admin" },
      ]
    : role === "admin"
    ? [
        { label: "Dashboard", to: "/admin/problems" },
        { label: "Manage Problems", to: "/admin/problems" },
        { label: "Add Problem", to: "/admin/problem/add" },
      ]
    : role === "superadmin"
    ? [{ label: "Add Admin", to: "/superadmin/addAdmin" }]
    : [{ label: "Problems", to: "/problems" }];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-accent text-foreground"
        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
    }`;

  const logo = (
    <Link to="/" className="flex items-center gap-2 text-foreground">
      <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Code2 className="h-5 w-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight">CloudIDE</span>
    </Link>
  );

  const authActions = (mobile = false) =>
    !role ? (
      <div className={mobile ? "grid gap-2" : "flex items-center gap-2"}>
        <Link to="/signin">
          <Button variant="ghost" className={mobile ? "w-full justify-start" : ""}>
            <User className="mr-2 h-4 w-4" />
            Sign In
          </Button>
        </Link>
        <Link to="/signup">
          <Button className={mobile ? "w-full justify-start" : ""}>
            <UserPlus className="mr-2 h-4 w-4" />
            Sign Up
          </Button>
        </Link>
      </div>
    ) : (
      <Button
        variant="ghost"
        className={mobile ? "w-full justify-start" : ""}
        onClick={logoutHandler}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    );

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          {logo}
          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={`${item.label}-${item.to}`}
                to={item.to}
                className={linkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="hidden md:block">{authActions()}</div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                {role === "admin" || role === "superadmin" ? (
                  <Shield className="h-5 w-5" />
                ) : (
                  <LayoutDashboard className="h-5 w-5" />
                )}
                Navigation
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 grid gap-6">
              <div className="grid gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={`${item.label}-${item.to}-mobile`}
                    to={item.to}
                    className={linkClass}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
              {authActions(true)}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
