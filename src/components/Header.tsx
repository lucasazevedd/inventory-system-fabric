import { supabase } from "../lib/supabaseClient"
import { Link, useNavigate, useLocation } from "react-router-dom"

export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate("/login", { replace: true })
  }

  return (
    <header className="container" style={{ display: "flex", gap: 12, alignItems: "center", paddingTop: 16 }}>
      <Link
        to="/produtos"
        style={{
          fontFamily: "var(--font-title)",
          fontSize: 20,
          fontWeight: 700,
          color: "var(--text-color)",
          textDecoration: "none"
        }}
      >
        Inventory PWA
      </Link>

      <nav style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
        <Link
          to="/produtos/novo"
          className={`btn ${pathname.startsWith("/produtos") ? "" : "secondary"}`}
        >
          Novo Produtos
        </Link>

        <Link
          to="/movimentar"
          className={`btn ${pathname.startsWith("/movimentar") ? "" : "secondary"}`}
        >
          Movimentar
        </Link>

        <button onClick={handleLogout} className="btn secondary">
          Sair
        </button>
      </nav>
    </header>
  )
}