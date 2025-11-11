import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useAuthRole } from "../hooks/useAuthRole"
import { useRealtime } from "../hooks/useRealtime"
import ProductRow from "../components/ProductRow"
import type { ProductFlat } from "../types/domain"
import { Link } from "react-router-dom"

export default function ProductsList() {
  const { role } = useAuthRole()
  const [q, setQ] = useState("")
  const [rows, setRows] = useState<ProductFlat[]>([])
  const canEdit = role === "admin"

  async function load() {
    const { data, error } = await supabase
      .from("products_flat")
      .select("*")
      .order("nome", { ascending: true })

    if (error) { console.error(error); return }
    setRows((data ?? []) as ProductFlat[])
  }

  useEffect(() => { load() }, [])
  useRealtime(() => load())

  const filtered = useMemo(
    () => rows.filter(r =>
      (`${r.nome} ${r.cod} ${r.ref ?? ""} ${r.cat ?? ""}`).toLowerCase().includes(q.toLowerCase())
    ),
    [rows, q]
  )

  return (
    <div className="card">
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <input className="input" placeholder="Buscar por nome, cod, ref ou cat…" value={q}
               onChange={e => setQ(e.target.value)} />
        {canEdit && <Link to="/produtos/novo" className="btn">+ Produto</Link>}
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>nome</th>
            <th>código</th>
            <th>referência</th>
            <th>categoria</th>
            <th>quantidade</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(p => <ProductRow key={p.id} p={p} canEdit={canEdit} />)}
          {filtered.length === 0 && (
            <tr><td colSpan={6} style={{ color: "var(--muted)" }}>Sem resultados.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}