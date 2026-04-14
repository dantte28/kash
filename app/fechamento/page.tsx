'use client'

import { useEffect, useState } from 'react'
import Topbar from '../../components/Topbar'
import Toast from '../../components/Toast'
import { getFechamentoPorData, saveFechamento, buildFechamento } from '../../lib/storage'
import { formatCurrency, generateId, formatDateTime } from '../../lib/utils'
import type { FechamentoCaixa, FormaPagamento } from '../../lib/types'

const FORMAS: FormaPagamento[] = ['pix', 'dinheiro', 'debito', 'credito', 'fiado']
const FORMA_LABEL: Record<FormaPagamento, string> = {
  pix: 'Pix',
  dinheiro: 'Dinheiro',
  debito: 'Débito',
  credito: 'Crédito',
  fiado: 'Fiado',
}
const FORMA_COLOR: Record<FormaPagamento, string> = {
  pix: '#0F6E56',
  dinheiro: '#1A9070',
  debito: '#2563EB',
  credito: '#7C3AED',
  fiado: '#D97706',
}

export default function FechamentoPage() {
  // Usa data local (não UTC) para evitar troca de dia em fusos negativos (ex: UTC-3)
  const d = new Date()
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  const [fechamento, setFechamento] = useState<FechamentoCaixa | null>(null)
  const [preview, setPreview] = useState<ReturnType<typeof buildFechamento> | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' } | null>(null)

  useEffect(() => {
    const f = getFechamentoPorData(today)
    if (f) {
      setFechamento(f)
    } else {
      setPreview(buildFechamento(today))
    }
  }, [today])

  const data = fechamento || preview
  const isClosed = !!fechamento

  const handleFechar = () => {
    if (!preview) return
    const f: FechamentoCaixa = {
      ...preview,
      id: generateId(),
      fechadoEm: new Date().toISOString(),
    }
    saveFechamento(f)
    setFechamento(f)
    setPreview(null)
    setShowModal(false)
    setToast({ message: 'Caixa fechado com sucesso!', type: 'success' })
  }

  if (!data) {
    return (
      <div className="flex flex-col min-h-screen">
        <Topbar title="Fechamento de caixa" />
        <div className="flex flex-col items-center justify-center flex-1 text-center py-16">
          <p className="text-[13px] text-gray-400">Nenhuma venda registrada hoje</p>
        </div>
      </div>
    )
  }

  const emCaixa = data.totalVendas - data.porFormaPagamento.fiado

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Fechamento de caixa">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="py-2 px-3 rounded-lg text-[12px] font-medium"
            style={{ border: '0.5px solid #E8EDF2', color: '#64748B' }}
          >
            Exportar PDF
          </button>
          {!isClosed && (
            <button
              onClick={() => setShowModal(true)}
              className="py-2 px-3 rounded-lg text-[12px] font-medium text-white"
              style={{ backgroundColor: '#0F6E56' }}
            >
              Fechar caixa
            </button>
          )}
        </div>
      </Topbar>

      <div className="p-4 md:p-6 pb-20 md:pb-6">
        {isClosed && (
          <div
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-[12px] mb-4"
            style={{ backgroundColor: '#EDFAF4', border: '0.5px solid #0F6E56', color: '#085041' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <circle cx="7" cy="7" r="6" stroke="#0F6E56" strokeWidth="1.5" />
              <path d="M4 7L6 9L10 5" stroke="#085041" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Caixa fechado em {formatDateTime(fechamento!.fechadoEm)}
          </div>
        )}

        {/* Métricas */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #E8EDF2' }}>
            <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Total do dia</div>
            <div className="text-[20px] font-medium text-gray-900">{formatCurrency(data.totalVendas)}</div>
          </div>
          <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #E8EDF2' }}>
            <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Transações</div>
            <div className="text-[20px] font-medium text-gray-900">{data.totalTransacoes}</div>
          </div>
          <div className="bg-white rounded-xl p-4" style={{ border: '0.5px solid #E8EDF2' }}>
            <div className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-1">Peças</div>
            <div className="text-[20px] font-medium text-gray-900">{data.totalPecas}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Peças por produto */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #E8EDF2' }}>
            <h2 className="text-[13px] font-medium text-gray-700 mb-3">Peças por produto</h2>
            {data.porProduto.length === 0 ? (
              <p className="text-[12px] text-gray-400 text-center py-4">Nenhuma venda hoje</p>
            ) : (
              <>
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '0.5px solid #E8EDF2' }}>
                      {['Produto', 'Qtd', 'Total'].map(h => (
                        <th key={h} className="text-left py-2 text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.porProduto
                      .sort((a, b) => b.total - a.total)
                      .map((p) => (
                        <tr key={p.nome} style={{ borderBottom: '0.5px solid #F8FAFC' }}>
                          <td className="py-2.5 text-[12px] text-gray-700">{p.nome}</td>
                          <td className="py-2.5 text-[12px] text-gray-700">{p.quantidade}</td>
                          <td className="py-2.5 text-[12px] font-medium text-gray-900">{formatCurrency(p.total)}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
                <div
                  className="flex justify-between pt-2 border-t text-[12px] font-medium"
                  style={{ borderColor: '#E8EDF2' }}
                >
                  <span className="text-gray-500">Total</span>
                  <span>{formatCurrency(data.totalVendas)}</span>
                </div>
              </>
            )}
          </div>

          {/* Por forma de pagamento */}
          <div className="bg-white rounded-xl p-5" style={{ border: '0.5px solid #E8EDF2' }}>
            <h2 className="text-[13px] font-medium text-gray-700 mb-3">Por forma de pagamento</h2>
            <div className="space-y-2.5">
              {FORMAS.map((f) => {
                const val = data.porFormaPagamento[f]
                if (val === 0) return null
                return (
                  <div key={f} className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: FORMA_COLOR[f] }}
                    />
                    <span className="flex-1 text-[13px] text-gray-700">{FORMA_LABEL[f]}</span>
                    <span className="text-[12px] text-gray-500 font-medium">
                      {formatCurrency(val)}
                    </span>
                  </div>
                )
              })}
            </div>
            <div
              className="mt-3 pt-3 border-t"
              style={{ borderColor: '#E8EDF2', borderWidth: '0.5px' }}
            >
              <div className="flex justify-between text-[12px]">
                <span className="text-gray-500">Em caixa (excluindo fiado)</span>
                <span className="font-medium text-gray-900">{formatCurrency(emCaixa)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20" onClick={() => setShowModal(false)} />
          <div
            className="relative w-full max-w-sm bg-white rounded-2xl p-6 z-10 mx-4"
            style={{ border: '0.5px solid #E8EDF2' }}
          >
            <h3 className="text-[15px] font-medium text-gray-800 mb-2">Fechar caixa?</h3>
            <p className="text-[13px] text-gray-500 mb-5">
              Isso registra o fechamento do dia com o resumo atual das vendas.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                style={{ border: '0.5px solid #E8EDF2', color: '#64748B' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleFechar}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white"
                style={{ backgroundColor: '#0F6E56' }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type="success" onClose={() => setToast(null)} />
      )}
    </div>
  )
}
