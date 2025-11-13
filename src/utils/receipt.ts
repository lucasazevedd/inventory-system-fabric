import jsPDF from "jspdf"

const DISTRIBUTOR = {
  name: "ADJ DISTRIBUIDORA",
  cnpj: "48.557.302/0001-91",
  phone: "+55 98 98424-3092"
}

const formatQty = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 4
})

type MovementItem = {
  nome: string
  sku: string
  quantidade: number
}

type MovementInfo = {
  itens: MovementItem[]
  tipo: "entrada" | "saida" | "ajuste"
  motivo?: string
  referencia?: string
}

type ClientInfo = {
  name: string
  cnpj: string
  address: string
}

export function generateMovementReceipt(params: { client?: ClientInfo; movement: MovementInfo }) {
  const doc = new jsPDF()
  const now = new Date()
  const formattedDate = now.toLocaleString("pt-BR")
  const client = params.client ?? { name: "-", cnpj: "-", address: "-" }

  doc.setFontSize(16)
  doc.text("Recibo de Movimentação de Estoque", 14, 20)

  doc.setFontSize(12)
  doc.text(DISTRIBUTOR.name, 14, 32)
  doc.text(`CNPJ: ${DISTRIBUTOR.cnpj}`, 14, 38)
  doc.text(`Telefone: ${DISTRIBUTOR.phone}`, 14, 44)

  doc.text(`Data: ${formattedDate}`, 14, 54)
  doc.text(`Tipo: ${params.movement.tipo}`, 14, 60)
  doc.text(`Referência: ${params.movement.referencia ?? "-"}`, 14, 66)
  doc.text(`Motivo: ${params.movement.motivo ?? "-"}`, 14, 72)

  doc.text("Cliente", 120, 32)
  doc.text(client.name, 120, 38)
  doc.text(`CNPJ: ${client.cnpj}`, 120, 44)
  doc.text(`Endereço: ${client.address}`, 120, 50)

  const tableStart = 86
  doc.setFontSize(12)
  doc.text("Produto", 14, tableStart)
  doc.text("Código", 90, tableStart)
  doc.text("Quantidade", 170, tableStart, { align: "right" })

  doc.setLineWidth(0.2)
  doc.line(14, tableStart + 2, 196, tableStart + 2)

  let currentY = tableStart + 10
  params.movement.itens.forEach(item => {
    doc.text(item.nome, 14, currentY)
    doc.text(item.sku, 90, currentY)
    doc.text(formatQty.format(item.quantidade), 170, currentY, { align: "right" })
    currentY += 8
  })

  doc.setFontSize(10)
  const signatureY = currentY + 12
  doc.text("Assinatura:", 14, signatureY)
  doc.line(33, signatureY, 120, signatureY)

  const filename = `recibo-${now.getTime()}.pdf`
  const blobUrl = doc.output("bloburl")
  const opened = window.open(blobUrl, "_blank")
  if (!opened) {
    doc.save(filename)
  }
}
