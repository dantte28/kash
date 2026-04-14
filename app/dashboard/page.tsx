'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Topbar from '../../components/Topbar'
import PeriodTabs from '../../components/PeriodTabs'
import MetricCard from '../../components/MetricCard'
import AlertBanner from '../../components/AlertBanner'
import StockBadge from '../../components/StockBadge'
import { getProdutos, getVendasPorPeriodo } from '../../lib/storage'
import {
  formatCurrency,
  getPeriodoInicio,
  getPeriodoFim,
  getPeriodoAnteriorInicio,
  getPeriodoAnteriorFim,
  formatDateTime,
  formatRelativeTime,
} from '../../lib/utils'
import type { Produto, Venda } from '../../lib/types'

type Periodo = 'dia' | 'semana' | 'mes'

const VERDE_TONS = ['#0F6E56', '#1A9070', '#2BAF88', '#6DD4B4', '#E1F5EE']

export default function DashboardPage() {
  const [periodo, setPeriodo] = useState<Periodo>('dia')
  const [vendas, setVendas] = useState<Venda[]>([])
  const [vendasAnt, setVendasAnt] = useState<Venda[]>([])
  const [produtos, setProdutos] = useState<Produto[]>([])

  useEffect(() => {
    const prods = getProdutos()
    setProdutos(prods)
    const inicio = getPeriodoInicio(periodo)
    const fim = getPeriodoFim(periodo)
    const antInicio = getPeriodoAnteriorInicio(periodo)
    const antFim = getPeriodoAnteriorFim(periodo)
    setVendas(getVendasPorPeriodo(inicio, fim))
    setVendasAnt(getVendasPorPeriodo(antInicio, antFim))
  }, [periodo])

  // Métricas
  const faturamento = vendas.reduce((s, v) => s + v.total, 0)
  const faturamentoAnt = vendasAnt.reduce((s, v) => s + v.total, 0)
  const percFaturamento =
    faturamentoAnt > 0 ? ((faturamento - faturamentoAnt) / faturamentoAnt) * 100 : null

  const transacoes = vendas.length
  const ticketMedio = transacoes > 0 ? faturamento / transacoes : 0

  const pecas = vendas.reduce((s, v) => s + v.itens.reduce((si, i) => si + i.quantidade, 0), 0)
  const mediaPecas = transacoes > 0 ? pecas / transacoes : 0

  const vendasFiado = vendas.filter((v) => v.formaPagamento === 'fiado')
  const totalFiado = vendasFiado.reduce((s, v) => s + v.total, 0)
  const clientesFiado = new Set(vendasFiado.map((v) => v.nomeCliente).filter(Boolean)).size

  // Alerta estoque
  const produtosCriticos = produtos.filter((p) => p.estoque <= 3).map((p) => p.nome)

  // Vendas por produto
  const mapaProduto: Record<string, { nome: string; total: number; qtd: number }> = {}
  for (const v of vendas) {
    for (const item of v.itens) {
      if (!mapaProduto[item.produtoId]) {
        mapaProduto[item.produtoId] = { nome: item.nomeProduto, total: 0, qtd: 0 }
      }
      mapaProduto[item.produtoId].total += item.subtotal
      mapaProduto[item.produtoId].qtd += item.quantidade
    }
  }
  const vendasPorProduto = Object.values(mapaProduto).sort((a, b) => b.total - a.total)
  const maxTotal = vendasPorProduto[0]?.total || 1

  // Últimas/maiores vendas
  const vendasDisplay =
    periodo === 'dia'
      ? [...vendas].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).slice(0, 3)
      : [...vendas].sort((a, b) => b.total - a.total).slice(0, 3)

  const formaPagamentoLabel: Record<string, string> = {
    pix: 'Pix',
    dinheiro: 'Dinheiro',
    debito: 'Débito',
    credito: 'Crédito',
    fiado: 'Fiado',
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Dashboard" showNewSale>
        <PeriodTabs value={periodo} onChange={setPeriodo} />
      </Topbar>

      <div className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
        <AlertBanner produtos={produtosCriticos} />

        {/* Métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <MetricCard
            label="Faturamento"
            value={formatCurrency(faturamento)}
            sub={
              percFaturamento !== null
                ? `${percFaturamento >= 0 ? '+' : ''}${percFaturamento.toFixed(0)}% vs período ant.`
                : 'Sem dados anteriores'
            }
            subPositive={percFaturamento !== null && percFaturamento >= 0}
            subNegative={percFaturamento !== null && percFaturamento < 0}
          />
          <MetricCard
            label="Transações"
            value={String(transacoes)}
            sub={`Ticket médio ${formatCurrency(ticketMedio)}`}
          />
          <MetricCard
            label="Peças vendidas"
            value={String(pecas)}
            sub={`Média ${mediaPecas.toFixed(1)} por venda`}
          />
          <MetricCard
            label="Fiado pendente"
            value={formatCurrency(totalFiado)}
            sub={`${clientesFiado} cliente${clientesFiado !== 1 ? 's' : ''}`}
            subNegative={totalFiado > 0}
          />
        </div>

        {/* Cards secundários */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Vendas por produto */}
          <div
            className="lg:col-span-1 bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #E8EDF2' }}
          >
            <h2 className="text-[13px] font-medium text-gray-700 mb-4">Vendas por produto</h2>
            {vendasPorProduto.length === 0 ? (
              <EmptyState text="Nenhuma venda no período" />
            ) : (
              <div className="space-y-3">
                {vendasPorProduto.slice(0, 5).map((p, i) => (
                  <div key={p.nome}>
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="text-gray-700 font-medium">{p.nome}</span>
                      <span className="text-gray-500">{formatCurrency(p.total)}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(p.total / maxTotal) * 100}%`,
                          backgroundColor: VERDE_TONS[i] || VERDE_TONS[4],
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Estoque atual */}
          <div
            className="bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #E8EDF2' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-[13px] font-medium text-gray-700">Estoque atual</h2>
              <Link href="/estoque" className="text-[12px]" style={{ color: '#0F6E56' }}>
                ajustar →
              </Link>
            </div>
            <div className="space-y-2.5">
              {produtos.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <span className="text-[13px] text-gray-700">{p.nome}</span>
                  <StockBadge estoque={p.estoque} />
                </div>
              ))}
            </div>
          </div>

          {/* Últimas vendas */}
          <div
            className="bg-white rounded-xl p-5"
            style={{ border: '0.5px solid #E8EDF2' }}
          >
            <h2 className="text-[13px] font-medium text-gray-700 mb-4">
              {periodo === 'dia' ? 'Últimas vendas' : 'Maiores vendas do período'}
            </h2>
            {vendasDisplay.length === 0 ? (
              <EmptyState text="Nenhuma venda no período" />
            ) : (
              <div className="space-y-3">
                {vendasDisplay.map((v) => (
                  <div key={v.id} className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[12px] text-gray-500 truncate">
                        {v.itens.map((i) => `${i.quantidade}× ${i.nomeProduto}`).join(', ')}
                      </div>
                      <div className="text-[11px] text-gray-400 mt-0.5">
                        {periodo === 'dia'
                          ? formatRelativeTime(v.data)
                          : formatDateTime(v.data)}
                        {' · '}
                        {formaPagamentoLabel[v.formaPagamento]}
                        {v.nomeCliente && ` · ${v.nomeCliente}`}
                      </div>
                    </div>
                    <span className="text-[13px] font-medium text-gray-900 shrink-0">
                      {formatCurrency(v.total)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-gray-200 mb-2">
        <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10 16h12M16 10v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <p className="text-[12px] text-gray-400">{text}</p>
    </div>
  )
}
