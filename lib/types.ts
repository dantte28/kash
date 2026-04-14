export type Produto = {
  id: string
  nome: string
  preco: number
  estoque: number
}

export type FormaPagamento = 'pix' | 'dinheiro' | 'debito' | 'credito' | 'fiado'

export type ItemVenda = {
  produtoId: string
  nomeProduto: string
  quantidade: number
  precoUnitario: number
  subtotal: number
}

export type Venda = {
  id: string
  data: string // ISO string
  itens: ItemVenda[]
  total: number
  formaPagamento: FormaPagamento
  nomeCliente?: string // obrigatório se fiado
}

export type EntradaEstoque = {
  id: string
  data: string
  produtoId: string
  nomeProduto: string
  quantidade: number
  tipo: 'entrada' | 'ajuste'
  observacao?: string
}

export type FechamentoCaixa = {
  id: string
  data: string // YYYY-MM-DD
  totalVendas: number
  totalTransacoes: number
  totalPecas: number
  porFormaPagamento: Record<FormaPagamento, number>
  porProduto: Array<{ nome: string; quantidade: number; total: number }>
  fechadoEm: string // ISO string
}
