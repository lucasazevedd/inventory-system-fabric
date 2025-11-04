import { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const nav = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) { alert(error.message); return }
    setSent(true)
    setTimeout(() => nav("/"), 6000) // após abrir o link recebido
  }

  return (
    <div className="container" style={{ maxWidth: 420, marginTop: 80 }}>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>Entrar</h2>
        <p style={{ color:"var(--muted)" }}>Enviaremos um link mágico para seu e-mail.</p>
        <form onSubmit={handleSubmit}>
          <input className="input" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} />
          <div style={{ display:"flex", gap:8, marginTop:12 }}>
            <button className="btn" type="submit">Receber link</button>
          </div>
        </form>
        {sent && <p className="badge" style={{ marginTop:12 }}>Verifique sua caixa de entrada.</p>}
      </div>
    </div>
  )
}