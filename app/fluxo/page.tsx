'use client'

import { useEffect, useState } from 'react'
import Topbar from '../../components/Topbar'
import MetricCard from '../../components/MetricCard'
import { getVendasPorPeriodo } from '../../lib/storage'
import { formatCurrency } from '../../lib/utils'
import type { Venda } from '../../lib/types'

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function groupByDay(vendas: Venda[], year: number, month: number): Record<number, Venda[]> {
  const map: Record<number, Venda[]> = {}
  for (let d = 1; d <= getDaysInMonth(year, month); d++) {
    map[d] = []
  }
  for (const v of vendas) {
    const d = new Date(v.data)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      map[day] = [...(map[day] || []), v]
    }
  }
  return map
}

export default function FluxoPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [vendas, setVendas] = useState<Venda[]>([])

  useEffect(() => {
    const inicio = new Date(year, month, 1)
    const fim = new Date(year, month + 1, 0, 23, 59, 59)
    setVendas(getVendasPorPeriodo(inicio, fim))
  }, [year, month])

  const navPrev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  const navNext = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const totalEntradas = vendas.reduce((s, v) => s + v.total, 0)
  const totalFiado = vendas.filter(v => v.formaPagamento === 'fiado').reduce((s, v) => s + v.total, 0)
  const ticketMedio = vendas.length > 0 ? totalEntradas / vendas.length : 0

  const byDay = groupByDay(vendas, year, month)
  const days = Object.keys(byDay).map(Number).sort((a, b) => a - b)
  const dailyTotals = days.map(d => byDay[d].reduce((s, v) => s + v.total, 0))
  const maxDay = Math.max(...dailyTotals, 1)

  const monthName = new Date(year, month, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const FORMA_LABEL: Record<string, string> = {
    pix: 'Pix', dinheiro: 'Dinheiro', debito: 'Débito', credito: 'Crédito', fiado: 'Fiado'
  }

  // Group vendas by day for table
  const vendasPorDia: Array<{ dia: number; vendas: Venda[]; subtotal: number }> = days
    .filter(d => byDay[d].length > 0)
    .map(d => ({
      dia: d,
      vendas: [...byDay[d]].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()),
      subtotal: byDay[d].reduce((s, v) => s + v.total, 0),
    }))
    .reverse()

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Fluxo de caixa" />

      <div className="p-4 md:p-6 pb-20 md:pb-6">
        {/* Period nav */}
        <div className="flex items-center gap-3 mb-5">
          <button
            onClick={navPrev}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ border: '0.5px solid #E8EDF2', color: '#64748B' }}
          >
            ←
          </button>
          <span className="text-[13px] font-medium text-gray-700 capitalize min-w-[140px] text-center">
            {monthName}
          </span>
          <button
            onClick={navNext}
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ border: '0.5px solid #E8EDF2', color: '#64748B' }}
          >
            →
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          <MetricCard label="Total de entradas" value={formatCurrency(totalEntradas)} />
          <MetricCard
            label="Fiado pendente"
            value={formatCurrency(totalFiado)}
            subNegative={totalFiado > 0}
          />
          <MetricCard label="Ticket médio" value={formatCurrency(ticketMedio)} />
        </div>

        {/* Bar chart */}
        <div
          className="bg-white rounded-xl p-5 mb-5"
          style={{ border: '0.5px solid #E8EDF2' }}
        >
          <h2 className="text-[13px] font-medium text-gray-700 mb-4">Faturamento por dia</h2>
          {vendas.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <p className="text-[12px] text-gray-400">Nenhuma venda neste mês</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <svg
                width={Math.max(days.length * 28, 300)}
                height={140}
                viewBox={`0 0 ${Math.max(days.length * 28, 300)} 140`}
                className="min-w-full"
              >
                {days.map((d, i) => {
                  const total = dailyTotals[i]
                  const barHeight = total > 0 ? Math.max(4, (total / maxDay) * 100) : 0
                  const x = i * 28 + 4
                  const y = 110 - barHeight
                  return (
                    <g key={d}>
                      {total > 0 ? (
                        <rect x={x} y={y} width={20} height={barHeight} rx="3" fill="#0F6E56" opacity="0.85">
                          <title>{`Dia ${d}: ${formatCurrency(total)}`}</title>
                        </rect>
                      ) : (
                        <rect x={x} y={106} width={20} height={4} rx="2" fill="#E2E8F0" />
                      )}
                      <text x={x + 10} y={128} textAnchor="middle" fontSize="9" fill="#94A3B8">
                        {d}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Table by day */}
        {vendasPorDia.length > 0 && (
          <div
            className="bg-white rounded-xl"
            style={{ border: '0.5px solid #E8EDF2' }}
          >
            <h2 className="text-[13px] font-medium text-gray-700 px-5 pt-4 pb-3">Movimentações</h2>
            {vendasPorDia.map(({ dia, vendas: vs, subtotal }) => (
              <div key={dia} style={{ borderTop: '0.5px solid #F1F5F9' }}>
                {/* Day header */}
                <div
                  className="flex justify-between items-center px-5 py-2.5"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                    {new Date(year, month, dia).toLocaleDateString('pt-BR', {
                      weekday: 'short', day: '2-digit', month: '2-digit',
                    })}
                  </span>
                  <span className="text-[12px] font-medium text-gray-700">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {vs.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center justify-between px-5 py-3 gap-4"
                    style={{ borderTop: '0.5px solid #F8FAFC' }}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-gray-700 truncate">
                        {v.itens.map(i => `${i.quantidade}× ${i.nomeProduto}`).join(', ')}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(v.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        {' · '}
                        {FORMA_LABEL[v.formaPagamento]}
                        {v.nomeCliente && ` · ${v.nomeCliente}`}
                      </p>
                    </div>
                    <span className="text-[13px] font-medium text-gray-900 shrink-0">
                      {formatCurrency(v.total)}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
