export type Role = "admin" | "viewer"

export type Product = {
  id: string
  sku: string
  nome: string
  categoria: string | null
  descricao: string | null
  unidade: string
  ativo: boolean
  created_at: string
  updated_at: string
}

export type ProductWithSaldo = Product & { saldo: number }