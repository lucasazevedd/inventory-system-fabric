import { supabase } from "../lib/supabaseClient"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuthRole } from "../hooks/useAuthRole"

export default function Header() {
  const { role } = useAuthRole()
  const nav = useNavigate()
  const { pathname } = useLocation()

  async function logout() {
    await supabase.auth.signOut()
    nav("/login")
  }

  return (
    <header className="container" style={{ display:"flex", gap:12, alignItems:"center", paddingTop:16 }}>
      <Link to="/" style={{ fontFamily: "var(--font-title)", fontSize: 20, fontWeight: 700 }}>
        Inventory PWA
      </Link>

      <nav style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <Link to="/" className="badge" aria-current={pathname === "/" ? "page" : undefined}>Produtos</Link>
        {role === "admin" && <Link to="/movimentar" className="badge">Movimentar</Link>}
        <button className="btn secondary" onClick={logout}>Sair</button>
      </nav>
    </header>
  )
}