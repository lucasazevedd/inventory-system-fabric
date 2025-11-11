import { Link } from "react-router-dom"
import type { ProductFlat } from "../types/domain"

export default function ProductRow({ p, canEdit }: { p: ProductFlat; canEdit: boolean }) {
  return (
    <tr>
      <td>
        <strong>{p.nome}</strong>
      </td>
      <td>{p.cod}</td>
      <td>{p.ref ?? "-"}</td>
      <td>{p.cat ?? "-"}</td>
      <td>
        <span className="badge">{p.qtd} {p.unidade}</span>
      </td>
      <td style={{ textAlign: "right" }}>
        {canEdit && <Link to={`/produtos/${p.id}/editar`} className="btn secondary">Editar</Link>}
      </td>
    </tr>
  )
}