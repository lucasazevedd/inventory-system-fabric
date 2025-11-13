import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Login(){
  const nav = useNavigate()
  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)

  useEffect(()=>{
    supabase.auth.getSession().then(({data})=>{
      if(data.session) nav("/produtos",{replace:true})
    })
  },[nav])

  async function onSubmit(e:React.FormEvent){
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if(error) return alert(error.message)
    if(data.session) nav("/produtos",{replace:true})
  }

  return (
    <div style={{
      minHeight: "100svh",
      display:"grid",
      placeItems:"center",
      padding:"24px"
    }}>
      <div className="card" style={{ width:"100%", maxWidth:420 }}>
        <h2 style={{marginTop:0, textAlign:"center"}}>Entrar</h2>
        <form onSubmit={onSubmit} style={{display:"grid", gap:12}}>
          <input className="input" type="email" placeholder="seu@email.com"
                 value={email} onChange={e=>setEmail(e.target.value)} required/>
          <input className="input" type="password" placeholder="Senha"
                 value={password} onChange={e=>setPassword(e.target.value)} required/>
          <button className="btn" disabled={loading}>{loading?"Entrando...":"Entrar"}</button>
        </form>
      </div>
    </div>
  )
}