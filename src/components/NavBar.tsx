import { NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav className="w-full bg-stone-900 text-white flex gap-4 px-6 py-3">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          isActive ? 'font-bold border-b-2 border-white pb-1' : 'opacity-60 hover:opacity-100'
        }
      >
        Galerie
      </NavLink>
      <NavLink
        to="/jobs"
        className={({ isActive }) =>
          isActive ? 'font-bold border-b-2 border-white pb-1' : 'opacity-60 hover:opacity-100'
        }
      >
        Impressions
      </NavLink>
    </nav>
  )
}