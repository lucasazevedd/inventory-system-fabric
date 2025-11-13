import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useAuthRole } from "../hooks/useAuthRole"
import type { ProductFlat } from "../types/domain"
import ProductRow from "../components/ProductRow"
import { Link, useNavigate } from "react-router-dom"

export default function ProductsList(){
  const { role } = useAuthRole()
  const nav = useNavigate()
  const [q, setQ] = useState("")
  const [rows, setRows] = useState<ProductFlat[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const canEdit = role === "admin"

  async function load(){
    const { data, error } = await supabase.from("products_flat").select("*").order("nome")
    if(error) { console.error(error); return }
    setRows((data ?? []) as ProductFlat[])
  }
  useEffect(()=>{ load() }, [])

  async function handleDelete(product: ProductFlat){
    const confirmed = confirm(`Excluir o produto "${product.nome}"?`)
    if(!confirmed) return
    const { error } = await supabase.from("products").delete().eq("id", product.id)
    if(error){
      alert(error.message)
      return
    }
    if(expandedId === product.id) setExpandedId(null)
    load()
  }

  const filtered = useMemo(
    ()=> rows.filter(r => (`${r.nome} ${r.cod} ${r.ref??""} ${r.cat??""}`)
      .toLowerCase().includes(q.toLowerCase())),
    [rows,q]
  )

  return (
    <div className="card" style={{ maxWidth:"100%" }}>
      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
        <input className="input" placeholder="Buscar por nome, cod, ref ou cat…" value={q}
               onChange={e=>setQ(e.target.value)} />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>nome</th>
            <th>código</th>
            <th>quantidade</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => (
            <ProductRow
              key={p.id}
              p={p}
              expanded={expandedId === p.id}
              onToggle={()=> setExpandedId(expandedId === p.id ? null : p.id)}
              canEdit={canEdit}
              onEdit={product => nav(`/produtos/${product.id}/editar`)}
              onDelete={handleDelete}
            />
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan={3} style={{ color:"var(--muted)" }}>Sem resultados.</td></tr>
          )}
        </tbody>
      </table>

      {/* Atalho admin (desktop); no mobile o botão está na bottom bar → Movimentar / Produtos */}
      {canEdit && <div className="desktop-only" style={{marginTop:12}}>
        <Link to="/movimentar" className="btn secondary">Movimentar estoque</Link>
      </div>}
    </div>
  )
}
