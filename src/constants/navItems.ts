export type NavItem = {
  key: "home" | "novo" | "movimentar" | "historico" | "sair"
  path?: string
  icon: string
  label: string
  ariaLabel: string
  variant?: "primary" | "danger" | "ghost"
  action?: "logout"
}

export const navItems: NavItem[] = [
  {
    key: "home",
    path: "/",
    icon: "home",
    label: "Home",
    ariaLabel: "Página inicial",
    variant: "ghost"
  },
  {
    key: "novo",
    path: "/produtos/novo",
    icon: "add_circle",
    label: "Produto",
    ariaLabel: "Novo produto",
    variant: "primary"
  },
  {
    key: "movimentar",
    path: "/movimentar",
    icon: "sync_alt",
    label: "Movimentar",
    ariaLabel: "Movimentar estoque",
    variant: "ghost"
  },
  {
    key: "historico",
    path: "/movimentacoes",
    icon: "history",
    label: "Histórico",
    ariaLabel: "Histórico de movimentações",
    variant: "ghost"
  },
  {
    key: "sair",
    icon: "logout",
    label: "Sair",
    ariaLabel: "Sair",
    variant: "danger",
    action: "logout"
  }
]
