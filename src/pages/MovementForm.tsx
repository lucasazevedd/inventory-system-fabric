import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"

type Option = { id: string; label: string }

export default function MovementForm() {
  const nav = useNavigate()
  const [products, setProducts] = useState<Option[]>([])
  const [productId, setProductId] = useState("")
  const [tipo, setTipo] = useState<"entrada"|"saida"|"ajuste">("entrada")
  const [quantidade, setQuantidade] = useState<number>(1)
  const [motivo, setMotivo] = useState("")
  const [referencia, setReferencia] = useState("")

  useEffect(() => {
    supabase.from("products").select("id, nome, sku, ativo").eq("ativo", true).order("nome", { ascending: true })
      .then(({ data }) => setProducts((data ?? []).map(p => ({ id: p.id, label: `${p.nome} (${p.sku})` }))))
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.rpc("launch_movement", {
      p_product_id: productId,
      p_tipo: tipo,
      p_quantidade: quantidade,
      p_motivo: motivo || null,
      p_referencia: referencia || null
    })
    if (error) return alert(error.message) // saldo negativo cai aqui
    nav("/")
  }

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <h3 style={{ marginTop:0 }}>Movimentar estoque</h3>
      <form onSubmit={submit} style={{ display:"grid", gap:12 }}>
        <select className="select" value={productId} onChange={e=>setProductId(e.target.value)} required>
          <option value="">Selecione um produto…</option>
          {products.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
        </select>

        <select className="select" value={tipo} onChange={e=>setTipo(e.target.value as any)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="ajuste">Ajuste (+/-)</option>
        </select>

        <input className="input" type="number" min="0.0001" step="0.0001"
               placeholder="Quantidade" value={quantidade}
               onChange={e=>setQuantidade(Number(e.target.value))} required />

        <input className="input" placeholder="Motivo (opcional)" value={motivo} onChange={e=>setMotivo(e.target.value)} />
        <input className="input" placeholder="Referência (opcional)" value={referencia} onChange={e=>setReferencia(e.target.value)} />

        <div style={{ display:"flex", gap:8 }}>
          <button className="btn" type="submit">Lançar</button>
          <button className="btn secondary" type="button" onClick={()=>history.back()}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}