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

export type ProductFlat = {
  id: string
  nome: string
  cod: string
  ref: string | null
  cat: string | null
  qtd: number
  unidade: string
  ativo: boolean
  updated_at: string
}