import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useAuthRole } from "../hooks/useAuthRole"
import { useRealtime } from "../hooks/useRealtime"
import ProductRow from "../components/ProductRow"
import type { ProductWithSaldo } from "../types/domain"
import { Link } from "react-router-dom"

export default function ProductsList() {
  const { role } = useAuthRole()
  const [q, setQ] = useState("")
  const [rows, setRows] = useState<ProductWithSaldo[]>([])
  const canEdit = role === "admin"

  async function load() {
    const { data, error } = await supabase
      .from("products")
      .select(`
        id, sku, nome, categoria, descricao, unidade, ativo, created_at, updated_at,
        saldo: product_balances!inner(saldo)
      `)
      .order("nome", { ascending: true })

    if (error) { console.error(error); return }
    // data vem com saldo como objeto -> normaliza
    const mapped = (data ?? []).map((d: any) => ({ ...d, saldo: d.saldo?.saldo ?? 0 }))
    setRows(mapped)
  }

  useEffect(() => { load() }, [])
  useRealtime(() => load())

  const filtered = useMemo(() =>
    rows.filter(r => (r.nome + r.sku).toLowerCase().includes(q.toLowerCase()))
  , [rows, q])

  return (
    <div className="card">
      <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:12 }}>
        <input className="input" placeholder="Buscar por nome ou SKU…" value={q} onChange={e=>setQ(e.target.value)} />
        {canEdit && <Link to="/produtos/novo" className="btn">+ Produto</Link>}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Produto</th><th>Categoria</th><th>Estoque</th><th>Status</th><th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => <ProductRow key={p.id} p={p} canEdit={canEdit} />)}
          {filtered.length === 0 && <tr><td colSpan={5} style={{ color:"var(--muted)" }}>Sem resultados.</td></tr>}
        </tbody>
      </table>
    </div>
  )
}