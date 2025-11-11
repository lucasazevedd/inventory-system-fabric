import { useEffect } from "react"
import { supabase } from "./lib/supabaseClient"
import { useNavigate, Outlet } from "react-router-dom"
import Header from "./components/Header"

export default function App() {
  const navigate = useNavigate()

  useEffect(() => {
    // verificar sessão inicial
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/login", { replace: true })
    })

    // observar mudanças (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) navigate("/login", { replace: true })
    })

    return () => listener.subscription.unsubscribe()
  }, [navigate])

  return (
    <div>
      <Header />
      <main className="container" style={{ paddingTop: 16 }}>
        <Outlet />
      </main>
    </div>
  )
}