import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate, useParams } from "react-router-dom"

export default function ProductForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [form, setForm] = useState({ sku:"", nome:"", categoria:"", unidade:"un", ativo:true })

  useEffect(() => {
    if (!isEdit) return
    supabase.from("products").select("*").eq("id", id).single().then(({ data }) => {
      if (data) setForm({
        sku: data.sku, nome: data.nome, categoria: data.categoria ?? "", unidade: data.unidade, ativo: data.ativo
      })
    })
  }, [id, isEdit])

  function set<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (isEdit) {
      const { error } = await supabase.from("products").update(form).eq("id", id)
      if (error) return alert(error.message)
    } else {
      const { error } = await supabase.from("products").insert(form)
      if (error) return alert(error.message)
    }
    nav("/")
  }

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <h3 style={{ marginTop:0 }}>{isEdit ? "Editar produto" : "Novo produto"}</h3>
      <form onSubmit={save} style={{ display:"grid", gap:12 }}>
        <input className="input" placeholder="SKU" value={form.sku} onChange={e=>set("sku", e.target.value)} required />
        <input className="input" placeholder="Nome" value={form.nome} onChange={e=>set("nome", e.target.value)} required />
        <input className="input" placeholder="Categoria" value={form.categoria} onChange={e=>set("categoria", e.target.value)} />
        <select className="select" value={form.unidade} onChange={e=>set("unidade", e.target.value)}>
          <option value="un">Unidade</option><option value="cx">Caixa</option><option value="kg">Kg</option><option value="lt">Litro</option>
        </select>
        <label style={{ display:"flex", gap:8, alignItems:"center" }}>
          <input type="checkbox" checked={form.ativo} onChange={e=>set("ativo", e.target.checked)} /> Ativo
        </label>
        <div style={{ display:"flex", gap:8 }}>
          <button className="btn" type="submit">Salvar</button>
          <button className="btn secondary" type="button" onClick={()=>history.back()}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}