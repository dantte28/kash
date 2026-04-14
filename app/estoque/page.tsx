'use client'

import { useEffect, useState, useCallback } from 'react'
import Topbar from '../../components/Topbar'
import StockBadge from '../../components/StockBadge'
import Toast from '../../components/Toast'
import { getProdutos, saveProdutos, saveEntradaEstoque, getEntradasEstoque } from '../../lib/storage'
import { formatCurrency, generateId, formatDateTime } from '../../lib/utils'
import type { Produto, EntradaEstoque } from '../../lib/types'

type Modal =
  | { type: 'entrada'; produto: Produto }
  | { type: 'ajuste'; produto: Produto }
  | null

export default function EstoquePage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [entradas, setEntradas] = useState<EntradaEstoque[]>([])
  const [modal, setModal] = useState<Modal>(null)
  const [qtdInput, setQtdInput] = useState('')
  const [obsInput, setObsInput] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(() => {
    setProdutos(getProdutos())
    setEntradas(getEntradasEstoque())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const openModal = (type: 'entrada' | 'ajuste', produto: Produto) => {
    setModal({ type, produto })
    setQtdInput('')
    setObsInput('')
  }

  const closeModal = () => setModal(null)

  const handleConfirm = () => {
    if (!modal) return
    const qty = parseInt(qtdInput, 10)
    if (isNaN(qty) || qty < (modal.type === 'ajuste' ? 0 : 1)) return

    const prods = getProdutos()
    const idx = prods.findIndex((p) => p.id === modal.produto.id)
    if (idx === -1) return

    const delta = modal.type === 'entrada' ? qty : qty - prods[idx].estoque
    prods[idx] = { ...prods[idx], estoque: modal.type === 'entrada' ? prods[idx].estoque + qty : qty }
    saveProdutos(prods)

    const entrada: EntradaEstoque = {
      id: generateId(),
      data: new Date().toISOString(),
      produtoId: modal.produto.id,
      nomeProduto: modal.produto.nome,
      quantidade: Math.abs(delta),
      tipo: modal.type === 'ajuste' ? 'ajuste' : 'entrada',
      observacao: obsInput.trim() || undefined,
    }
    saveEntradaEstoque(entrada)

    setToast({
      message: modal.type === 'entrada' ? `+${qty} unidades registradas!` : `Estoque ajustado para ${qty}`,
      type: 'success',
    })
    closeModal()
    load()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Estoque" />

      <div className="p-4 md:p-6 pb-20 md:pb-6">
        <div className="space-y-3 mb-8">
          {produtos.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-xl p-4 flex items-center gap-4"
              style={{ border: '0.5px solid #E8EDF2' }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[13px] font-medium text-gray-800">{p.nome}</span>
                  <StockBadge estoque={p.estoque} />
                </div>
                <span className="text-[12px] text-gray-400 mt-0.5 block">{formatCurrency(p.preco)} por unidade</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openModal('entrada', p)}
                  className="py-2 px-3 rounded-lg text-[12px] font-medium transition-all min-h-[44px]"
                  style={{ border: '0.5px solid #0F6E56', color: '#0F6E56', backgroundColor: '#EDFAF4' }}
                >
                  + Entrada
                </button>
                <button
                  onClick={() => openModal('ajuste', p)}
                  className="py-2 px-3 rounded-lg text-[12px] font-medium transition-all min-h-[44px]"
                  style={{ border: '0.5px solid #E8EDF2', color: '#64748B' }}
                >
                  Ajuste
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Histórico */}
        <h2 className="text-[13px] font-medium text-gray-600 mb-3">Histórico de movimentações</h2>
        <div
          className="bg-white rounded-xl hidden md:block"
          style={{ border: '0.5px solid #E8EDF2' }}
        >
          {entradas.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <p className="text-[13px] text-gray-400">Nenhuma movimentação registrada</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '0.5px solid #E8EDF2' }}>
                  {['Data', 'Produto', 'Tipo', 'Quantidade', 'Observação'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 text-[11px] font-medium text-gray-400 uppercase tracking-wide"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...entradas]
                  .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                  .map((e) => (
                    <tr key={e.id} style={{ borderBottom: '0.5px solid #F1F5F9' }}>
                      <td className="px-5 py-3 text-[12px] text-gray-500 whitespace-nowrap">
                        {formatDateTime(e.data)}
                      </td>
                      <td className="px-5 py-3 text-[12px] text-gray-700">{e.nomeProduto}</td>
                      <td className="px-5 py-3">
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                          style={
                            e.tipo === 'entrada'
                              ? { backgroundColor: '#E1F5EE', color: '#085041' }
                              : { backgroundColor: '#F1F5F9', color: '#64748B' }
                          }
                        >
                          {e.tipo === 'entrada' ? 'Entrada' : 'Ajuste'}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-gray-700">+{e.quantidade}</td>
                      <td className="px-5 py-3 text-[12px] text-gray-400">{e.observacao || '—'}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile list */}
        <div className="md:hidden space-y-2">
          {entradas.length === 0 ? (
            <p className="text-[13px] text-gray-400 text-center py-8">Nenhuma movimentação</p>
          ) : (
            [...entradas]
              .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
              .map((e) => (
                <div
                  key={e.id}
                  className="bg-white rounded-xl p-3"
                  style={{ border: '0.5px solid #E8EDF2' }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-medium text-gray-700">{e.nomeProduto}</span>
                    <span
                      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                      style={
                        e.tipo === 'entrada'
                          ? { backgroundColor: '#E1F5EE', color: '#085041' }
                          : { backgroundColor: '#F1F5F9', color: '#64748B' }
                      }
                    >
                      +{e.quantidade} · {e.tipo === 'entrada' ? 'Entrada' : 'Ajuste'}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{formatDateTime(e.data)}</p>
                  {e.observacao && <p className="text-[11px] text-gray-400">{e.observacao}</p>}
                </div>
              ))
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={closeModal} />
          <div
            className="relative w-full max-w-sm bg-white rounded-t-2xl md:rounded-2xl p-6 z-10"
            style={{ border: '0.5px solid #E8EDF2' }}
          >
            <h3 className="text-[15px] font-medium text-gray-800 mb-1">
              {modal.type === 'entrada' ? 'Registrar entrada' : 'Ajuste manual'}
            </h3>
            <p className="text-[12px] text-gray-400 mb-4">
              {modal.produto.nome} · Estoque atual: {modal.produto.estoque}
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[12px] font-medium text-gray-500 block mb-1">
                  {modal.type === 'entrada' ? 'Quantidade a adicionar' : 'Novo valor de estoque'}
                </label>
                <input
                  type="number"
                  min={modal.type === 'ajuste' ? 0 : 1}
                  value={qtdInput}
                  onChange={(e) => setQtdInput(e.target.value)}
                  placeholder={modal.type === 'entrada' ? 'Ex: 10' : `Ex: ${modal.produto.estoque}`}
                  className="w-full py-2.5 px-3 rounded-lg text-[13px] outline-none min-h-[44px]"
                  style={{ border: '0.5px solid #CBD5E1' }}
                  autoFocus
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-gray-500 block mb-1">
                  Observação (opcional)
                </label>
                <input
                  type="text"
                  value={obsInput}
                  onChange={(e) => setObsInput(e.target.value)}
                  placeholder="Ex: Entrega do fornecedor"
                  className="w-full py-2.5 px-3 rounded-lg text-[13px] outline-none min-h-[44px]"
                  style={{ border: '0.5px solid #CBD5E1' }}
                />
              </div>
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                style={{ border: '0.5px solid #E8EDF2', color: '#64748B' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                disabled={!qtdInput || parseInt(qtdInput, 10) < (modal.type === 'ajuste' ? 0 : 1)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white"
                style={{
                  backgroundColor:
                    qtdInput && parseInt(qtdInput, 10) >= (modal.type === 'ajuste' ? 0 : 1)
                      ? '#0F6E56'
                      : '#CBD5E1',
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  )
}
