import { Outlet, useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { supabase } from "./lib/supabaseClient"
import Header from "./components/Header"

export default function App() {
  const nav = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) nav("/login")
    })
  }, [nav])

  return (
    <div>
      <Header />
      <main className="container" style={{ paddingTop: 16 }}>
        <Outlet />
      </main>
    </div>
  )
}