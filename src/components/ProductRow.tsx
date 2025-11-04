import { Link } from "react-router-dom"
import type { ProductWithSaldo } from "../types/domain"

export default function ProductRow({ p, canEdit }: { p: ProductWithSaldo, canEdit: boolean }) {
  return (
    <tr>
      <td><strong>{p.nome}</strong><div style={{ color:"var(--muted)", fontSize:12 }}>{p.sku}</div></td>
      <td>{p.categoria ?? "-"}</td>
      <td><span className="badge">Saldo: {p.saldo} {p.unidade}</span></td>
      <td>{p.ativo ? "Ativo" : "Inativo"}</td>
      <td style={{ textAlign: "right" }}>
        {canEdit && <Link to={`/produtos/${p.id}/editar`} className="btn secondary">Editar</Link>}
      </td>
    </tr>
  )
}