'use client'

import { useEffect, useState } from 'react'
import Topbar from '../../components/Topbar'
import { getVendas } from '../../lib/storage'
import { formatCurrency, formatDateTime } from '../../lib/utils'
import type { Venda, FormaPagamento } from '../../lib/types'

const FORMAS_OPTIONS: { value: FormaPagamento | 'todas'; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'pix', label: 'Pix' },
  { value: 'dinheiro', label: 'Dinheiro' },
  { value: 'debito', label: 'Débito' },
  { value: 'credito', label: 'Crédito' },
  { value: 'fiado', label: 'Fiado' },
]

const FORMA_LABEL: Record<FormaPagamento, string> = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  debito: 'Débito',
  credito: 'Crédito',
  fiado: 'Fiado',
}

function defaultDataInicio(): string {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString().split('T')[0]
}

function defaultDataFim(): string {
  return new Date().toISOString().split('T')[0]
}

export default function HistoricoPage() {
  const [vendas, setVendas] = useState<Venda[]>([])
  const [dataInicio, setDataInicio] = useState(defaultDataInicio)
  const [dataFim, setDataFim] = useState(defaultDataFim)
  const [filtroForma, setFiltroForma] = useState<FormaPagamento | 'todas'>('todas')

  useEffect(() => {
    setVendas(getVendas())
  }, [])

  const vendasFiltradas = vendas.filter((v) => {
    const d = new Date(v.data)
    const inicio = new Date(dataInicio + 'T00:00:00')
    const fim = new Date(dataFim + 'T23:59:59')
    if (d < inicio || d > fim) return false
    if (filtroForma !== 'todas' && v.formaPagamento !== filtroForma) return false
    return true
  })

  const totalFiltrado = vendasFiltradas.reduce((s, v) => s + v.total, 0)
  const totalPecas = vendasFiltradas.reduce(
    (s, v) => s + v.itens.reduce((si, i) => si + i.quantidade, 0),
    0
  )

  const limparFiltros = () => {
    setDataInicio(defaultDataInicio())
    setDataFim(defaultDataFim())
    setFiltroForma('todas')
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Histórico de vendas" />

      <div className="p-4 md:p-6 pb-20 md:pb-6">
        {/* Filtros */}
        <div
          className="bg-white rounded-xl p-4 mb-4 flex flex-wrap gap-3 items-end"
          style={{ border: '0.5px solid #E8EDF2' }}
        >
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-gray-400 uppercase">Data início</label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="py-2 px-3 rounded-lg text-[13px] outline-none min-h-[44px]"
              style={{ border: '0.5px solid #CBD5E1' }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-gray-400 uppercase">Data fim</label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="py-2 px-3 rounded-lg text-[13px] outline-none min-h-[44px]"
              style={{ border: '0.5px solid #CBD5E1' }}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-gray-400 uppercase">Pagamento</label>
            <select
              value={filtroForma}
              onChange={(e) => setFiltroForma(e.target.value as FormaPagamento | 'todas')}
              className="py-2 px-3 rounded-lg text-[13px] outline-none min-h-[44px] bg-white"
              style={{ border: '0.5px solid #CBD5E1' }}
            >
              {FORMAS_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={limparFiltros}
            className="py-2 px-4 rounded-lg text-[13px] font-medium min-h-[44px]"
            style={{ border: '0.5px solid #E8EDF2', color: '#64748B' }}
          >
            Limpar
          </button>
        </div>

        {/* Desktop table */}
        <div
          className="bg-white rounded-xl hidden md:block"
          style={{ border: '0.5px solid #E8EDF2' }}
        >
          {vendasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-gray-200 mb-3">
                <rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 16h16M12 22h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-[13px] text-gray-400">Nenhuma venda encontrada</p>
              <p className="text-[12px] text-gray-300 mt-1">Tente ajustar os filtros</p>
            </div>
          ) : (
            <>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '0.5px solid #E8EDF2' }}>
                    <th className="text-left px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                      Data/hora
                    </th>
                    <th className="text-left px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                      Produtos
                    </th>
                    <th className="text-left px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                      Pagamento
                    </th>
                    <th className="text-right px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {vendasFiltradas
                    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                    .map((v) => (
                      <tr key={v.id} style={{ borderBottom: '0.5px solid #F1F5F9' }}>
                        <td className="px-5 py-3 text-[12px] text-gray-500 whitespace-nowrap">
                          {formatDateTime(v.data)}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-gray-700">
                          {v.itens.map((i) => `${i.quantidade}× ${i.nomeProduto}`).join(', ')}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                            style={
                              v.formaPagamento === 'fiado'
                                ? { backgroundColor: '#FAEEDA', color: '#633806' }
                                : { backgroundColor: '#F1F5F9', color: '#64748B' }
                            }
                          >
                            {FORMA_LABEL[v.formaPagamento]}
                            {v.nomeCliente && ` · ${v.nomeCliente}`}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-right text-[13px] font-medium text-gray-900">
                          {formatCurrency(v.total)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {/* Footer totals */}
              <div
                className="px-5 py-3 flex gap-4 text-[12px] text-gray-500"
                style={{ borderTop: '0.5px solid #E8EDF2' }}
              >
                <span>{vendasFiltradas.length} vendas</span>
                <span>{totalPecas} peças</span>
                <span className="font-medium text-gray-900">{formatCurrency(totalFiltrado)}</span>
              </div>
            </>
          )}
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {vendasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-gray-200 mb-3">
                <rect x="4" y="4" width="32" height="32" rx="6" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 16h16M12 22h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <p className="text-[13px] text-gray-400">Nenhuma venda encontrada</p>
            </div>
          ) : (
            <>
              {vendasFiltradas
                .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                .map((v) => (
                  <div
                    key={v.id}
                    className="bg-white rounded-xl p-4"
                    style={{ border: '0.5px solid #E8EDF2' }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-[12px] text-gray-500">{formatDateTime(v.data)}</span>
                      <span className="text-[14px] font-medium">{formatCurrency(v.total)}</span>
                    </div>
                    <p className="text-[13px] text-gray-700">
                      {v.itens.map((i) => `${i.quantidade}× ${i.nomeProduto}`).join(', ')}
                    </p>
                    <div className="mt-1.5 flex gap-2">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={
                          v.formaPagamento === 'fiado'
                            ? { backgroundColor: '#FAEEDA', color: '#633806' }
                            : { backgroundColor: '#F1F5F9', color: '#64748B' }
                        }
                      >
                        {FORMA_LABEL[v.formaPagamento]}
                      </span>
                      {v.nomeCliente && (
                        <span className="text-[11px] text-gray-400">{v.nomeCliente}</span>
                      )}
                    </div>
                  </div>
                ))}
              <div className="text-[12px] text-gray-500 text-center py-2">
                {vendasFiltradas.length} vendas · {totalPecas} peças · {formatCurrency(totalFiltrado)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
