import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { navItems } from "../constants/navItems"

export default function BottomBar(){
  const { pathname } = useLocation()
  const nav = useNavigate()

  async function logout(){
    await supabase.auth.signOut()
    nav("/login", { replace:true })
  }

  return (
    <div className="bottom-bar mobile-only">
      <div className="nav-actions nav-actions--compact bottom-safe container">
        {navItems.map(item => {
          const isActive = item.path ? pathname.startsWith(item.path) : false
          const className = `btn ${item.action ? "secondary" : isActive ? "" : "secondary"}`

          if (item.action === "logout") {
            return (
              <button
                key={item.key}
                type="button"
                className={className}
                onClick={logout}
                aria-label={item.ariaLabel}
                title={item.ariaLabel}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
              </button>
            )
          }

          return (
            <Link
              key={item.key}
              className={className}
              to={item.path ?? "/"}
              aria-label={item.ariaLabel}
              title={item.ariaLabel}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
