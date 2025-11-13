export type NavItem = {
  key: "novo" | "movimentar" | "sair"
  path?: string
  icon: string
  label: string
  ariaLabel: string
  action?: "logout"
}

export const navItems: NavItem[] = [
  {
    key: "novo",
    path: "/produtos/novo",
    icon: "add_circle",
    label: "Produto",
    ariaLabel: "Novo produto"
  },
  {
    key: "movimentar",
    path: "/movimentar",
    icon: "sync_alt",
    label: "Movimentar",
    ariaLabel: "Movimentar estoque"
  },
  {
    key: "sair",
    icon: "logout",
    label: "Sair",
    ariaLabel: "Sair",
    action: "logout"
  }
]
