import type { Produto, Venda, EntradaEstoque, FechamentoCaixa, FormaPagamento } from './types'

const KEYS = {
  PRODUTOS: 'kash:produtos',
  VENDAS: 'kash:vendas',
  FECHAMENTOS: 'kash:fechamentos',
  ENTRADAS_ESTOQUE: 'kash:entradas_estoque',
}

export const PRODUTOS_DEFAULT: Produto[] = [
  { id: 'queijo-cozido', nome: 'Queijo cozido', preco: 40, estoque: 0 },
  { id: 'queijo-comum', nome: 'Queijo comum', preco: 35, estoque: 0 },
  { id: 'trancinha', nome: 'Trancinha', preco: 20, estoque: 0 },
  { id: 'requeijao', nome: 'Requeijão', preco: 35, estoque: 0 },
  { id: 'doce-de-leite', nome: 'Doce de leite', preco: 15, estoque: 0 },
]

function safeRead<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function safeWrite(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // quota exceeded or other error
  }
}

// ─── Produtos ──────────────────────────────────────────────────────────────

export function getProdutos(): Produto[] {
  const stored = safeRead<Produto[] | null>(KEYS.PRODUTOS, null)
  if (!stored) {
    safeWrite(KEYS.PRODUTOS, PRODUTOS_DEFAULT)
    return PRODUTOS_DEFAULT
  }
  return stored
}

export function saveProdutos(produtos: Produto[]): void {
  safeWrite(KEYS.PRODUTOS, produtos)
}

export function updateEstoque(produtoId: string, delta: number): void {
  const produtos = getProdutos()
  const idx = produtos.findIndex((p) => p.id === produtoId)
  if (idx === -1) return
  produtos[idx] = {
    ...produtos[idx],
    estoque: Math.max(0, produtos[idx].estoque + delta),
  }
  saveProdutos(produtos)
}

// ─── Vendas ─────────────────────────────────────────────────────────────────

export function getVendas(): Venda[] {
  return safeRead<Venda[]>(KEYS.VENDAS, [])
}

export function saveVenda(venda: Venda): void {
  const vendas = getVendas()
  vendas.push(venda)
  safeWrite(KEYS.VENDAS, vendas)
}

export function getVendasPorPeriodo(inicio: Date, fim: Date): Venda[] {
  return getVendas().filter((v) => {
    const d = new Date(v.data)
    return d >= inicio && d <= fim
  })
}

// ─── Fechamentos ────────────────────────────────────────────────────────────

export function getFechamentos(): FechamentoCaixa[] {
  return safeRead<FechamentoCaixa[]>(KEYS.FECHAMENTOS, [])
}

export function saveFechamento(f: FechamentoCaixa): void {
  const fechamentos = getFechamentos()
  // remove existing for same date if any
  const filtered = fechamentos.filter((x) => x.data !== f.data)
  filtered.push(f)
  safeWrite(KEYS.FECHAMENTOS, filtered)
}

export function getFechamentoPorData(data: string): FechamentoCaixa | null {
  return getFechamentos().find((f) => f.data === data) ?? null
}

// ─── Entradas de estoque ────────────────────────────────────────────────────

export function getEntradasEstoque(): EntradaEstoque[] {
  return safeRead<EntradaEstoque[]>(KEYS.ENTRADAS_ESTOQUE, [])
}

export function saveEntradaEstoque(e: EntradaEstoque): void {
  const entradas = getEntradasEstoque()
  entradas.push(e)
  safeWrite(KEYS.ENTRADAS_ESTOQUE, entradas)
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function buildFechamento(data: string): Omit<FechamentoCaixa, 'id' | 'fechadoEm'> {
  const inicio = new Date(data + 'T00:00:00')
  const fim = new Date(data + 'T23:59:59')
  const vendas = getVendasPorPeriodo(inicio, fim)

  const totalVendas = vendas.reduce((s, v) => s + v.total, 0)
  const totalTransacoes = vendas.length
  const totalPecas = vendas.reduce((s, v) => s + v.itens.reduce((si, i) => si + i.quantidade, 0), 0)

  const porFormaPagamento: Record<FormaPagamento, number> = {
    pix: 0,
    dinheiro: 0,
    debito: 0,
    credito: 0,
    fiado: 0,
  }
  for (const v of vendas) {
    porFormaPagamento[v.formaPagamento] += v.total
  }

  const mapaProducto: Record<string, { nome: string; quantidade: number; total: number }> = {}
  for (const v of vendas) {
    for (const item of v.itens) {
      if (!mapaProducto[item.produtoId]) {
        mapaProducto[item.produtoId] = { nome: item.nomeProduto, quantidade: 0, total: 0 }
      }
      mapaProducto[item.produtoId].quantidade += item.quantidade
      mapaProducto[item.produtoId].total += item.subtotal
    }
  }

  return {
    data,
    totalVendas,
    totalTransacoes,
    totalPecas,
    porFormaPagamento,
    porProduto: Object.values(mapaProducto),
  }
}
