import { NavLink } from "react-router-dom";
import { Settings } from "lucide-react";

export default function NavBar() {
  return (
    <nav className="w-full bg-stone-900 text-white flex items-center gap-4 px-6 py-3">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive
            ? "font-bold border-b-2 border-white pb-1"
            : "opacity-60 hover:opacity-100"
        }
      >
        Galerie
      </NavLink>
      <NavLink
        to="/jobs"
        className={({ isActive }) =>
          isActive
            ? "font-bold border-b-2 border-white pb-1"
            : "opacity-60 hover:opacity-100"
        }
      >
        Impressions
      </NavLink>

      <NavLink
        to="/parameters"
        className={({ isActive }) =>
          `ml-auto transition-opacity ${isActive ? "opacity-100" : "opacity-60 hover:opacity-100"}`
        }
        aria-label="Paramètres"
      >
        <Settings size={18} />
      </NavLink>
    </nav>
  );
}
