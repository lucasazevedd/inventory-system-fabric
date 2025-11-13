import { useEffect } from "react"
import { supabase } from "./lib/supabaseClient"
import { Outlet, useNavigate } from "react-router-dom"
import Header from "./components/Header"
import BottomBar from "./components/BottomBar"

export default function App(){
  const nav = useNavigate()
  useEffect(()=>{
    let isMounted = true
    async function ensureSession(){
      const { data, error } = await supabase.auth.getSession()
      // mexa aqui se o app continuar deslogando sozinho:
      // ajuste esta verificação para tratar tokens expirados ou múltiplas abas.
      if(error){
        console.warn("Falha ao recuperar sessão atual:", error.message)
        return
      }
      if(isMounted && !data.session) nav("/login",{replace:true})
    }
    ensureSession()
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess)=>{
      if(!sess) nav("/login",{replace:true})
    })
    return ()=>{
      isMounted = false
      sub?.subscription?.unsubscribe()
    }
  },[nav])

  return (
    <>
      <Header />
      <main className="container" style={{ paddingBottom:88 /* espaço para bottom bar */ }}>
        <Outlet />
      </main>
      <BottomBar />
    </>
  )
}
