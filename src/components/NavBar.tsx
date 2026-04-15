import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";

export default function NavBar() {
  const className = ({ isActive }: { isActive: boolean }) =>
    isActive ? "font-bold" : "opacity-60 hover:opacity-100";

  return (
    <nav className="w-full flex items-center gap-4 px-6 py-3 border-b border-t-muted">
      <NavLink to="/" end className={className}>
        Galerie
      </NavLink>
      <NavLink to="/jobs" className={className}>
        Impressions
      </NavLink>

      <NavLink
        to="/parameters"
        className={({ isActive }) =>
          `ml-auto transition-opacity ${className({ isActive })}`
        }
        aria-label="Paramètres"
      >
        <Settings size={18} />
      </NavLink>
    </nav>
  );
}
