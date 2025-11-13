import { Link, useLocation, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabaseClient"
import { navItems } from "../constants/navItems"

export default function Header(){
  const { pathname } = useLocation()
  const nav = useNavigate()
  const showBackButton = pathname !== "/"

  function buildNavClass(variant: "primary"|"danger"|"ghost"|undefined, isActive: boolean){
    const classes = ["btn", "nav-btn"]
    if (variant === "primary") classes.push("nav-btn--primary")
    if (variant === "danger") classes.push("nav-btn--danger")
    if (variant === "ghost") classes.push("nav-btn--ghost")
    if (isActive) classes.push("nav-btn--active")
    return classes.join(" ")
  }

  async function logout(){
    await supabase.auth.signOut()
    nav("/login", { replace: true })
  }

  return (
    <header className="container top-safe desktop-header desktop-only" style={{ paddingBottom: 8 }}>
      <div style={{ textAlign: "center" }}>
        <Link to="/" style={{ color: "var(--text)", textDecoration: "none" }}>
          <div className="brand-badge">Estoque ADJ Distribuidora</div>
        </Link>
      </div>
      <nav className="nav-actions nav-actions--wide">
        {showBackButton && (
          <button
            type="button"
            className="btn nav-btn nav-btn--ghost"
            onClick={()=> nav("/")}
          >
            <span className="material-symbols-outlined" aria-hidden>arrow_back</span>
            <span className="btn-label">Voltar</span>
          </button>
        )}
        {navItems.map(item => {
          const isActive = item.path ? pathname === item.path || pathname.startsWith(`${item.path}/`) : false
          const className = buildNavClass(item.variant, isActive)

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
                <span className="material-symbols-outlined" aria-hidden>{item.icon}</span>
                <span className="btn-label">{item.label}</span>
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
              <span className="material-symbols-outlined" aria-hidden>{item.icon}</span>
              <span className="btn-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
