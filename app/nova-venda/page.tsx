'use client'

import { useEffect, useState, useCallback } from 'react'
import Topbar from '../../components/Topbar'
import Toast from '../../components/Toast'
import { getProdutos, saveVenda, updateEstoque } from '../../lib/storage'
import { formatCurrency, generateId } from '../../lib/utils'
import type { Produto, FormaPagamento, ItemVenda, Venda } from '../../lib/types'

type Qtd = Record<string, number>

const FORMAS: { key: FormaPagamento; label: string }[] = [
  { key: 'pix', label: 'Pix' },
  { key: 'dinheiro', label: 'Dinheiro' },
  { key: 'debito', label: 'Débito' },
  { key: 'credito', label: 'Crédito' },
  { key: 'fiado', label: 'Fiado' },
]

export default function NovaVendaPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [qtds, setQtds] = useState<Qtd>({})
  const [forma, setForma] = useState<FormaPagamento | null>(null)
  const [nomeCliente, setNomeCliente] = useState('')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(() => {
    setProdutos(getProdutos())
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const setQtd = (id: string, delta: number) => {
    const produto = produtos.find((p) => p.id === id)
    if (!produto) return
    setQtds((prev) => {
      const cur = prev[id] || 0
      const next = Math.max(0, Math.min(produto.estoque, cur + delta))
      return { ...prev, [id]: next }
    })
  }

  const itens: ItemVenda[] = Object.entries(qtds)
    .filter(([, q]) => q > 0)
    .map(([produtoId, quantidade]) => {
      const p = produtos.find((x) => x.id === produtoId)!
      return {
        produtoId,
        nomeProduto: p.nome,
        quantidade,
        precoUnitario: p.preco,
        subtotal: p.preco * quantidade,
      }
    })

  const total = itens.reduce((s, i) => s + i.subtotal, 0)

  const canSubmit =
    itens.length > 0 && forma !== null && (forma !== 'fiado' || nomeCliente.trim().length > 0)

  const handleSubmit = () => {
    if (!canSubmit || !forma) return

    const venda: Venda = {
      id: generateId(),
      data: new Date().toISOString(),
      itens,
      total,
      formaPagamento: forma,
      nomeCliente: forma === 'fiado' ? nomeCliente.trim() : undefined,
    }

    saveVenda(venda)
    for (const item of itens) {
      updateEstoque(item.produtoId, -item.quantidade)
    }

    setToast({ message: 'Venda registrada!', type: 'success' })
    setQtds({})
    setForma(null)
    setNomeCliente('')
    load()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Nova venda" />

      <div className="flex-1 flex flex-col lg:flex-row gap-0 overflow-hidden">
        {/* Produtos */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto pb-[420px] md:pb-[300px] lg:pb-6">
          <h2 className="text-[13px] font-medium text-gray-500 mb-3">Selecionar produtos</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {produtos.map((p) => {
              const qtd = qtds[p.id] || 0
              const disabled = p.estoque === 0
              const selected = qtd > 0

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-xl p-4 transition-all"
                  style={{
                    border: selected ? '1.5px solid #0F6E56' : '0.5px solid #E8EDF2',
                    backgroundColor: selected ? '#EDFAF4' : '#fff',
                    opacity: disabled ? 0.4 : 1,
                    pointerEvents: disabled ? 'none' : 'auto',
                  }}
                >
                  <div className="flex flex-col gap-2">
                    <div>
                      <div className="text-[13px] font-medium text-gray-800">{p.nome}</div>
                      <div className="text-[12px] text-gray-500 mt-0.5">{formatCurrency(p.preco)}</div>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      {p.estoque === 0 ? 'Sem estoque' : `${p.estoque} disponíveis`}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => setQtd(p.id, -1)}
                        disabled={qtd === 0}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] font-medium transition-all"
                        style={{
                          border: '0.5px solid #E8EDF2',
                          backgroundColor: qtd === 0 ? '#F8FAFC' : '#fff',
                          color: qtd === 0 ? '#CBD5E1' : '#0F172A',
                        }}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-[14px] font-medium">{qtd}</span>
                      <button
                        onClick={() => setQtd(p.id, +1)}
                        disabled={qtd >= p.estoque}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-[16px] font-medium transition-all"
                        style={{
                          border: '0.5px solid #E8EDF2',
                          backgroundColor: qtd >= p.estoque ? '#F8FAFC' : '#fff',
                          color: qtd >= p.estoque ? '#CBD5E1' : '#0F172A',
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Resumo
            Mobile  (<768px):  fixed acima do bottom nav (bottom-14 = 56px)
            Tablet  (768-1023): fixed no fundo, com offset da sidebar (52px)
            Desktop (≥1024px): painel estático lateral
        */}
        <div
          className="lg:w-80 xl:w-96 bg-white border-t lg:border-t-0 lg:border-l flex flex-col
            fixed bottom-14 left-0 right-0 z-30
            md:bottom-0 md:left-[52px]
            lg:static lg:bottom-auto lg:left-auto lg:z-auto
            max-h-[60vh] lg:max-h-none overflow-y-auto"
          style={{ borderColor: '#E8EDF2', borderWidth: '0.5px' }}
        >
          <div className="p-5 flex-1 overflow-y-auto">
            <h2 className="text-[13px] font-medium text-gray-700 mb-4">Resumo da venda</h2>

            {itens.length === 0 ? (
              <p className="text-[12px] text-gray-400 text-center py-4">Nenhum produto selecionado</p>
            ) : (
              <div className="space-y-2 mb-4">
                {itens.map((item) => (
                  <div key={item.produtoId} className="flex justify-between text-[13px]">
                    <span className="text-gray-600">
                      {item.quantidade}× {item.nomeProduto}
                    </span>
                    <span className="font-medium">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
                <div
                  className="flex justify-between text-[15px] font-medium pt-2 border-t"
                  style={{ borderColor: '#E8EDF2', borderWidth: '0.5px' }}
                >
                  <span>Total</span>
                  <span style={{ color: '#0F6E56' }}>{formatCurrency(total)}</span>
                </div>
              </div>
            )}

            {/* Forma de pagamento */}
            <div className="mb-4">
              <p className="text-[12px] font-medium text-gray-500 mb-2">Forma de pagamento</p>
              <div className="grid grid-cols-2 gap-2">
                {FORMAS.slice(0, 4).map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setForma(f.key)}
                    className="py-2.5 px-3 rounded-lg text-[13px] font-medium transition-all"
                    style={
                      forma === f.key
                        ? { border: '1.5px solid #0F6E56', backgroundColor: '#EDFAF4', color: '#085041' }
                        : { border: '0.5px solid #E8EDF2', backgroundColor: '#fff', color: '#64748B' }
                    }
                  >
                    {f.label}
                  </button>
                ))}
                <button
                  onClick={() => setForma('fiado')}
                  className="col-span-2 py-2.5 px-3 rounded-lg text-[13px] font-medium transition-all"
                  style={
                    forma === 'fiado'
                      ? { border: '1.5px solid #0F6E56', backgroundColor: '#EDFAF4', color: '#085041' }
                      : { border: '0.5px solid #E8EDF2', backgroundColor: '#fff', color: '#64748B' }
                  }
                >
                  Fiado
                </button>
              </div>
            </div>

            {/* Nome do cliente (fiado) */}
            {forma === 'fiado' && (
              <div className="mb-4">
                <label className="text-[12px] font-medium text-gray-500 block mb-1">
                  Nome do cliente <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={nomeCliente}
                  onChange={(e) => setNomeCliente(e.target.value)}
                  placeholder="Digite o nome"
                  className="w-full py-2.5 px-3 rounded-lg text-[13px] outline-none"
                  style={{ border: '0.5px solid #CBD5E1', backgroundColor: '#fff' }}
                />
              </div>
            )}
          </div>

          <div className="p-5 border-t" style={{ borderColor: '#E8EDF2', borderWidth: '0.5px' }}>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="w-full py-3 rounded-xl text-[14px] font-medium text-white transition-all"
              style={{
                backgroundColor: canSubmit ? '#0F6E56' : '#CBD5E1',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
              }}
            >
              Confirmar venda{total > 0 ? ` — ${formatCurrency(total)}` : ''}
            </button>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}
