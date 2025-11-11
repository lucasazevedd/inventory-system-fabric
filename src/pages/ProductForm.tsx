import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate, useParams } from "react-router-dom"

type Form = {
  cod: string
  nome: string
  ref: string
  categoria: string
  unidade: string
  ativo: boolean
}

export default function ProductForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [form, setForm] = useState<Form>({ cod:"", nome:"", ref:"", categoria:"", unidade:"un", ativo:true })

  useEffect(() => {
    if (!isEdit) return
    supabase.from("products").select("*").eq("id", id).single().then(({ data, error }) => {
      if (error) { console.error(error); return }
      if (data) setForm({
        cod: data.cod ?? "",
        nome: data.nome ?? "",
        ref: data.ref ?? "",
        categoria: data.categoria ?? "",
        unidade: data.unidade ?? "un",
        ativo: data.ativo ?? true
      })
    })
  }, [id, isEdit])

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm(prev => ({ ...prev, [k]: v }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    const payload = {
      cod: form.cod.trim(),
      nome: form.nome.trim(),
      ref: form.ref.trim() || null,
      categoria: form.categoria.trim() || null,
      unidade: form.unidade,
      ativo: form.ativo
    }

    if (isEdit) {
      const { error } = await supabase.from("products").update(payload).eq("id", id)
      if (error) return alert(error.message)
    } else {
      const { error } = await supabase.from("products").insert(payload)
      if (error) return alert(error.message)
    }
    nav("/")
  }

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <h3 style={{ marginTop: 0 }}>{isEdit ? "Editar produto" : "Novo produto"}</h3>
      <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
        <input className="input" placeholder="cod (único)" value={form.cod}
               onChange={e => set("cod", e.target.value)} required />
        <input className="input" placeholder="nome" value={form.nome}
               onChange={e => set("nome", e.target.value)} required />
        <input className="input" placeholder="ref (fornecedor / catálogo)" value={form.ref}
               onChange={e => set("ref", e.target.value)} />
        <input className="input" placeholder="cat (categoria)" value={form.categoria}
               onChange={e => set("categoria", e.target.value)} />
        <select className="select" value={form.unidade} onChange={e => set("unidade", e.target.value)}>
          <option value="un">un</option>
          <option value="cx">cx</option>
          <option value="kg">kg</option>
          <option value="lt">lt</option>
        </select>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input type="checkbox" checked={form.ativo} onChange={e => set("ativo", e.target.checked)} /> Ativo
        </label>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" type="submit">Salvar</button>
          <button className="btn secondary" type="button" onClick={() => history.back()}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}