import type { ProductFlat } from "../types/domain"

type Props = {
  p: ProductFlat
  expanded: boolean
  onToggle: () => void
  canEdit?: boolean
  onEdit?: (product: ProductFlat) => void
  onDelete?: (product: ProductFlat) => void
}

export default function ProductRow({
  p, expanded, onToggle, canEdit = false, onEdit, onDelete
}: Props){
  return (
    <>
      <tr onClick={onToggle} style={{ cursor:"pointer", background: expanded? "#151923" : "transparent" }}>
        <td><strong>{p.nome}</strong></td>
        <td style={{ whiteSpace:"nowrap" }}>{p.cod}</td>
        <td><span className="badge">{p.qtd} {p.unidade}</span></td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={3}>
            <div className="card" style={{ marginTop:8 }}>
              <div style={{ display:"grid", gap:8, gridTemplateColumns: "1fr 1fr" }}>
                <div><small className="muted">referência</small><div>{p.ref ?? "-"}</div></div>
                <div><small className="muted">categoria</small><div>{p.cat ?? "-"}</div></div>
                <div><small className="muted">unidade</small><div>{p.unidade}</div></div>
                <div><small className="muted">status</small><div>{p.ativo ? "Ativo" : "Inativo"}</div></div>
              </div>
              {canEdit && (
                <div style={{ display:"flex", gap:8, marginTop:12, flexWrap:"wrap" }}>
                  <button
                    type="button"
                    className="btn secondary"
                    onClick={()=> onEdit?.(p)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn danger"
                    onClick={()=> onDelete?.(p)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
