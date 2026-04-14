'use client'

import { useState } from 'react'
import Topbar from '../../components/Topbar'
import Tutorial from '../../components/Tutorial'

const SECTIONS = [
  {
    badge: '📊',
    title: 'Dashboard',
    href: '/dashboard',
    items: [
      'Veja o faturamento do dia, semana ou mês com os botões no topo',
      'Os 4 cards mostram: faturamento, transações, peças e fiado pendente',
      'O gráfico de barras exibe as vendas por produto do período',
      'O alerta amarelo aparece quando algum produto tem 3 ou menos unidades',
    ],
  },
  {
    badge: '🛒',
    title: 'Nova venda',
    href: '/nova-venda',
    items: [
      'Toque em um produto para selecioná-lo e use + e − para a quantidade',
      'Cards desabilitados (transparentes) = sem estoque disponível',
      'Escolha a forma de pagamento: Pix, Dinheiro, Débito, Crédito ou Fiado',
      'Se escolher Fiado, preencha o nome do cliente antes de confirmar',
      'Após confirmar, o formulário reseta para registrar a próxima venda',
    ],
  },
  {
    badge: '📋',
    title: 'Histórico',
    href: '/historico',
    items: [
      'Filtre por data inicial e final (padrão: últimos 7 dias)',
      'Filtre também por forma de pagamento',
      'No rodapé aparece o total de vendas, peças e valor do período',
      'No celular as vendas aparecem como cards; no computador como tabela',
    ],
  },
  {
    badge: '📦',
    title: 'Estoque',
    href: '/estoque',
    items: [
      'Use "Entrada" depois de cada produção para adicionar unidades',
      'Use "Ajuste" para corrigir o inventário com um valor absoluto',
      'O badge muda de cor: verde (≥5), amarelo (1–4), vermelho (0)',
      'O histórico de movimentações fica registrado abaixo dos produtos',
    ],
  },
  {
    badge: '📈',
    title: 'Fluxo de caixa',
    href: '/fluxo',
    items: [
      'Navegue entre meses com as setas ← →',
      'As barras mostram o faturamento de cada dia do mês',
      'Passe o cursor (ou toque) sobre uma barra para ver o valor do dia',
      'Abaixo do gráfico as vendas ficam agrupadas por dia com subtotal',
    ],
  },
  {
    badge: '🔒',
    title: 'Fechamento de caixa',
    href: '/fechamento',
    items: [
      'Acesse todos os dias no fim do expediente',
      'Veja o total do dia, transações e peças vendidas',
      'A tabela "Por produto" mostra quantidade e valor de cada item',
      '"Em caixa" já desconta o fiado — é o que você tem em mãos',
      'Clique em "Fechar caixa" para registrar o snapshot do dia',
      'Depois de fechar, a tela vira somente leitura até o dia seguinte',
    ],
  },
]

export default function TutorialPage() {
  const [showModal, setShowModal] = useState(false)

  const resetOnboarding = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kash:onboarding_done')
    }
    setShowModal(true)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Topbar title="Tutorial" />

      <div className="p-4 md:p-6 pb-20 md:pb-6 max-w-2xl">
        {/* CTA */}
        <div
          className="rounded-xl p-5 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ backgroundColor: '#EDFAF4', border: '0.5px solid #0F6E56' }}
        >
          <div>
            <p className="text-[14px] font-semibold" style={{ color: '#085041' }}>
              Ver tutorial passo a passo
            </p>
            <p className="text-[12px] mt-0.5" style={{ color: '#085041', opacity: 0.7 }}>
              O mesmo guia exibido no primeiro acesso, com ilustrações de cada tela.
            </p>
          </div>
          <button
            onClick={resetOnboarding}
            className="shrink-0 px-4 py-2.5 rounded-xl text-[13px] font-medium text-white whitespace-nowrap"
            style={{ backgroundColor: '#0F6E56' }}
          >
            Abrir tutorial →
          </button>
        </div>

        {/* Seções */}
        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <div
              key={s.href}
              className="bg-white rounded-xl p-5"
              style={{ border: '0.5px solid #E8EDF2' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{s.badge}</span>
                <h2 className="text-[14px] font-semibold text-gray-800">{s.title}</h2>
              </div>
              <ul className="space-y-1.5">
                {s.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-gray-500">
                    <span
                      className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold text-white"
                      style={{ backgroundColor: '#0F6E56', opacity: 0.7 }}
                    >
                      {i + 1}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Dica final */}
        <div
          className="rounded-xl p-4 mt-4 text-[12px]"
          style={{ backgroundColor: '#FFF8EC', border: '0.5px solid #FAC775', color: '#633806' }}
        >
          <strong>Seus dados são seus.</strong> Tudo que você registrar fica salvo apenas neste dispositivo. Cada pessoa que instalar o app tem seus próprios dados separados.
        </div>
      </div>

      {showModal && (
        <Tutorial
          onClose={() => {
            localStorage.setItem('kash:onboarding_done', '1')
            setShowModal(false)
          }}
        />
      )}
    </div>
  )
}
