import { Briefcase, Home, FileText, User, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const links = [
  { label: "Home", icon: Home, to: "/" },
  { label: "Jobs", icon: Briefcase, to: "/jobs" },
  { label: "Applications", icon: FileText, to: "/applications" },
  { label: "Profile", icon: User, to: "/profile" },
];

const linkClass = ({ isActive }) =>
  `relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
    isActive
      ? "text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-sm"
      : "text-slate-600 hover:text-purple-700 hover:bg-purple-50"
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/80">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group" onClick={close}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md transition-transform group-hover:scale-105">
              J
            </div>
            <span className="text-lg font-bold text-slate-800">
              Job<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Portal</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <li key={l.label}>
                <NavLink to={l.to} className={linkClass} end={l.to === "/"}>
                  <l.icon className="w-4 h-4" />
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className="text-sm text-slate-600 mr-1 max-w-[10rem] truncate" title={user.email}>
                  Hi, {user.fullName.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:text-purple-700 hover:bg-purple-50 transition-all"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 animate-fade-in">
            <ul className="flex flex-col gap-1">
              {links.map((l) => (
                <li key={l.label}>
                  <NavLink
                    to={l.to}
                    onClick={close}
                    className={linkClass}
                    end={l.to === "/"}
                  >
                    <l.icon className="w-4 h-4" />
                    {l.label}
                  </NavLink>
                </li>
              ))}
              {user ? (
                <li>
                  <button
                    onClick={() => {
                      close();
                      handleLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 mt-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout ({user.fullName.split(" ")[0]})
                  </button>
                </li>
              ) : (
                <li className="flex gap-2 mt-2">
                  <Link
                    to="/login"
                    onClick={close}
                    className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-purple-700 bg-purple-50 border border-purple-100"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    onClick={close}
                    className="flex-1 text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Sign up
                  </Link>
                </li>
              )}
            </ul>
          </div>
        )}
      </nav>
    </header>
  );
}
