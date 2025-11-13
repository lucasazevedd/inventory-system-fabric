import { useEffect, useMemo, useRef, useState, useId } from "react"
import { supabase } from "../lib/supabaseClient"
import { useNavigate } from "react-router-dom"
import { generateMovementReceipt } from "../utils/receipt"

type Option = { id: string; nome: string; sku: string }
type MovementItem = { product: Option; quantity: number }

export default function MovementForm() {
  const nav = useNavigate()
  const [products, setProducts] = useState<Option[]>([])
  const [productId, setProductId] = useState("")
  const [productQuery, setProductQuery] = useState("")
  const [pendingQuantity, setPendingQuantity] = useState<number>(1)
  const [items, setItems] = useState<MovementItem[]>([])
  const productInputId = useId()
  const pickerRef = useRef<HTMLDivElement>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [tipo, setTipo] = useState<"entrada"|"saida"|"ajuste">("entrada")
  const [motivo, setMotivo] = useState("")
  const [referencia, setReferencia] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientCnpj, setClientCnpj] = useState("")
  const [clientAddress, setClientAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    supabase.from("products_flat").select("id, nome, cod, ativo").eq("ativo", true).order("nome", { ascending: true })
      .then(({ data }) => setProducts((data ?? []).map(p => ({
        id: p.id,
        nome: p.nome,
        sku: (p as { cod?: string | null }).cod ?? "-"
      }))))
  }, [])

  useEffect(() => {
    function onClickOutside(event: MouseEvent){
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setPickerOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const requiresClient = tipo === "saida"
  const selectedProduct = useMemo(() => products.find(p => p.id === productId), [products, productId])

  const filteredProducts = useMemo(() => {
    const term = productQuery.trim().toLowerCase()
    if (!term) return products.slice(0, 5)
    return products
      .filter(p => `${p.nome} ${p.sku}`.toLowerCase().includes(term))
      .slice(0, 8)
  }, [products, productQuery])

  function formatProductLabel(product?: Option){
    if (!product) return ""
    return `${product.nome} (${product.sku})`
  }

  function handleProductInput(value: string){
    setProductQuery(value)
    if (productId) setProductId("")
    setPickerOpen(true)
  }

  function selectProduct(product: Option){
    setProductId(product.id)
    setProductQuery(formatProductLabel(product))
    setPickerOpen(false)
    setPendingQuantity(1)
  }

  function clearProduct(){
    setProductId("")
    setProductQuery("")
    setPickerOpen(false)
    setPendingQuantity(1)
  }

  function addItem(){
    if (!selectedProduct) return
    if (pendingQuantity <= 0) {
      alert("Informe uma quantidade válida para adicionar o item.")
      return
    }
    setItems(prev => {
      const exists = prev.find(it => it.product.id === selectedProduct.id)
      if (exists) {
        return prev.map(it => it.product.id === selectedProduct.id
          ? { ...it, quantity: it.quantity + pendingQuantity }
          : it)
      }
      return [...prev, { product: selectedProduct, quantity: pendingQuantity }]
    })
    clearProduct()
  }

  function updateItemQuantity(productIdToUpdate: string, value: number){
    const safeValue = Number.isFinite(value) ? value : 0
    setItems(prev => prev.map(item =>
      item.product.id === productIdToUpdate
        ? { ...item, quantity: Math.max(safeValue, 0) }
        : item
    ))
  }

  function removeItem(productIdToRemove: string){
    setItems(prev => prev.filter(item => item.product.id !== productIdToRemove))
  }

  const clientIsValid = !requiresClient || (!!clientName && !!clientCnpj && !!clientAddress)
  const canSubmit = items.length > 0 && clientIsValid && !isSubmitting

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (items.length === 0) {
      alert("Adicione pelo menos um item à movimentação.")
      return
    }
    if (!clientIsValid) {
      alert("Preencha os dados do cliente para movimentações de saída.")
      return
    }
    setIsSubmitting(true)
    const clientPayload = requiresClient ? {
      name: clientName,
      cnpj: clientCnpj,
      address: clientAddress
    } : undefined
    for (const item of items) {
      const { error } = await supabase.rpc("launch_movement", {
        p_product_id: item.product.id,
        p_tipo: tipo,
        p_quantidade: item.quantity,
        p_motivo: motivo || null,
        p_referencia: referencia || null
      })
      if (error) {
        alert(error.message) // saldo negativo cai aqui
        setIsSubmitting(false)
        return
      }
    }

    generateMovementReceipt({
      client: clientPayload,
      movement: {
        tipo,
        motivo: motivo || undefined,
        referencia: referencia || undefined,
        itens: items.map(item => ({
          nome: item.product.nome,
          sku: item.product.sku,
          quantidade: item.quantity
        }))
      }
    })

    const rows = items.map(item => ({
      product_id: item.product.id,
      product_name: item.product.nome,
      product_sku: item.product.sku,
      tipo,
      quantidade: item.quantity,
      motivo: motivo || null,
      referencia: referencia || null,
      client_name: clientPayload?.name ?? null,
      client_cnpj: clientPayload?.cnpj ?? null,
      client_address: clientPayload?.address ?? null
    }))
    if (rows.length > 0) {
      const { error: persistError } = await supabase.from("movement_receipts").insert(rows)
      if (persistError) {
        console.warn("Não foi possível salvar o recibo da movimentação:", persistError.message)
      }
    }

    setIsSubmitting(false)
    nav("/")
  }

  return (
    <div className="card" style={{ maxWidth: "100%" }}>
      <h3 style={{ marginTop:0 }}>Movimentar estoque</h3>
      <form onSubmit={submit} style={{ display:"grid", gap:12 }}>
        <div className="product-picker" ref={pickerRef}>
          <label htmlFor={productInputId} className="btn-label">Produto</label>
          <div className="product-picker__input">
            <input
              id={productInputId}
              className="input"
              type="text"
              placeholder="Buscar por nome ou código"
              value={productQuery}
              onFocus={()=>setPickerOpen(true)}
              onChange={e=>handleProductInput(e.target.value)}
              autoComplete="off"
            />
            {productQuery && (
              <button type="button" className="product-picker__clear" onClick={clearProduct} aria-label="Limpar seleção">×</button>
            )}
          </div>
          {pickerOpen && (
            <div className="product-picker__results" role="listbox">
              {filteredProducts.length > 0 ? filteredProducts.map(p => (
                <button
                  type="button"
                  key={p.id}
                  className={`product-picker__option ${p.id === productId ? "is-selected" : ""}`}
                  onClick={()=>selectProduct(p)}
                >
                  <strong>{p.nome}</strong>
                  <span>{p.sku}</span>
                </button>
              )) : (
                <div className="product-picker__empty">Nenhum produto encontrado.</div>
              )}
            </div>
          )}
          {selectedProduct && (
            <small style={{ color:"var(--muted)" }}>
              Selecionado: {formatProductLabel(selectedProduct)}
            </small>
          )}

          {selectedProduct && (
            <div className="product-picker__actions">
              <input
                className="input"
                type="number"
                min="0.0001"
                step="0.0001"
                value={pendingQuantity}
                onChange={e=>setPendingQuantity(Number(e.target.value))}
              />
              <button type="button" className="btn" onClick={addItem}>
                Adicionar item
              </button>
            </div>
          )}
        </div>

        <div className="movement-items">
          <h4 style={{ margin:0 }}>Itens da movimentação</h4>
          {items.length === 0 && (
            <p style={{ color:"var(--muted)", margin:0 }}>Nenhum item adicionado ainda.</p>
          )}
          {items.map(item => (
            <div key={item.product.id} className="movement-items__row">
              <div className="movement-items__info">
                <strong>{item.product.nome}</strong>
                <span>{item.product.sku}</span>
              </div>
              <div className="movement-items__controls">
                <input
                  className="input"
                  type="number"
                  min="0.0001"
                  step="0.0001"
                  value={item.quantity}
                  onChange={e=>updateItemQuantity(item.product.id, Number(e.target.value))}
                />
                <button type="button" className="btn secondary" onClick={()=>removeItem(item.product.id)}>
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        <select className="select" value={tipo} onChange={e=>setTipo(e.target.value as any)}>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="ajuste">Ajuste (+/-)</option>
        </select>

        <input className="input" placeholder="Motivo (opcional)" value={motivo} onChange={e=>setMotivo(e.target.value)} />
        <input className="input" placeholder="Referência (opcional)" value={referencia} onChange={e=>setReferencia(e.target.value)} />

        {requiresClient && (
          <div style={{ display:"grid", gap:8 }}>
            <h4 style={{ margin: "8px 0 0" }}>Dados do cliente</h4>
            <input className="input" placeholder="Nome do cliente" value={clientName} onChange={e=>setClientName(e.target.value)} required={requiresClient} />
            <input className="input" placeholder="CNPJ do cliente" value={clientCnpj} onChange={e=>setClientCnpj(e.target.value)} required={requiresClient} />
            <input className="input" placeholder="Endereço do cliente" value={clientAddress} onChange={e=>setClientAddress(e.target.value)} required={requiresClient} />
          </div>
        )}

        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <button className="btn" type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Lançando..." : "Lançar"}
          </button>
          <button className="btn secondary" type="button" onClick={()=>history.back()} disabled={isSubmitting}>Cancelar</button>
        </div>
      </form>
    </div>
  )
}
