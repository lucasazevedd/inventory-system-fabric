import { useEffect, useMemo, useState } from "react"
import { supabase } from "../lib/supabaseClient"

type MovementRow = {
  id: string
  created_at: string
  tipo: "entrada" | "saida" | "ajuste"
  product_name: string
  product_sku: string
  quantidade: number
  motivo: string | null
  referencia: string | null
  client_name: string | null
  client_cnpj: string | null
  client_address: string | null
}

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short"
})

export default function MovementsHistory(){
  const [rows, setRows] = useState<MovementRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(()=>{
    load()
  },[])

  async function load(){
    setLoading(true)
    setError(null)
    const { data, error } = await supabase
      .from("movement_receipts")
      .select("*")
      .order("created_at", { ascending:false })
      .limit(300)

    if(error){
      setError(error.message)
    }else{
      setRows((data ?? []) as MovementRow[])
    }
    setLoading(false)
  }

  const filtered = useMemo(()=>{
    const term = search.trim().toLowerCase()
    if(!term) return rows
    return rows.filter(row =>
      `${row.product_name} ${row.product_sku} ${row.client_name ?? ""} ${row.client_cnpj ?? ""}`
        .toLowerCase()
        .includes(term)
    )
  },[rows, search])

  return (
    <div className="card" style={{ maxWidth:"100%" }}>
      <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center", justifyContent:"space-between" }}>
          <h3 style={{ margin:0 }}>Histórico de movimentações</h3>
          <button className="btn secondary" type="button" onClick={load} disabled={loading}>
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
        <input
          className="input"
          placeholder="Buscar por produto ou cliente..."
          value={search}
          onChange={e=>setSearch(e.target.value)}
        />
      </div>

      {error && (
        <div style={{ color:"var(--danger)", marginTop:12 }}>
          Falha ao carregar: {error}
        </div>
      )}

      <div style={{ marginTop:16, overflowX:"auto" }}>
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Produto</th>
              <th>Qtd</th>
              <th>Tipo</th>
              <th>Cliente</th>
              <th>Referência</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(row => (
              <tr key={row.id}>
                <td style={{ whiteSpace:"nowrap" }}>{dateFormatter.format(new Date(row.created_at))}</td>
                <td>
                  <strong>{row.product_name}</strong>
                  <div style={{ fontSize:12, color:"var(--muted)" }}>{row.product_sku}</div>
                </td>
                <td>{row.quantidade}</td>
                <td style={{ textTransform:"capitalize" }}>{row.tipo}</td>
                <td>
                  {row.client_name ? (
                    <>
                      <div>{row.client_name}</div>
                      <small style={{ color:"var(--muted)" }}>{row.client_cnpj}</small>
                    </>
                  ) : (
                    <span style={{ color:"var(--muted)" }}>—</span>
                  )}
                </td>
                <td>
                  {row.referencia || row.motivo || <span style={{ color:"var(--muted)" }}>—</span>}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign:"center", color:"var(--muted)" }}>
                  Nenhuma movimentação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
