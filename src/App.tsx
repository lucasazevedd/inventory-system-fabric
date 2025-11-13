import { useEffect } from "react"
import { supabase } from "./lib/supabaseClient"
import { Outlet, useNavigate } from "react-router-dom"
import Header from "./components/Header"
import BottomBar from "./components/BottomBar"

export default function App(){
  const nav = useNavigate()
  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      if(!data.session) nav("/login",{replace:true})
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, sess)=>{
      if(!sess) nav("/login",{replace:true})
    })
    return ()=> sub?.subscription?.unsubscribe()
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