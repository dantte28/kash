'use client'

import { useState } from 'react'

export type TutorialProps = {
  onClose: () => void
}

type Step = {
  badge: string
  title: string
  description: string
  tip?: string
  illustration: React.ReactNode
}

// ── Ilustrações SVG minimalistas por tela ──────────────────────────

function IlluDashboard() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      {/* topbar */}
      <rect x="0" y="0" width="220" height="22" rx="6" fill="#0F6E56" opacity="0.15" />
      <rect x="8" y="7" width="50" height="8" rx="2" fill="#0F6E56" opacity="0.5" />
      <rect x="160" y="5" width="52" height="12" rx="6" fill="#0F6E56" opacity="0.7" />
      {/* 4 metric cards */}
      {[0,1,2,3].map(i => (
        <g key={i}>
          <rect x={8 + i * 52} y="30" width="46" height="34" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
          <rect x={14 + i * 52} y="37" width="24" height="4" rx="2" fill="#CBD5E1" />
          <rect x={14 + i * 52} y="46" width="32" height="7" rx="2" fill="#0F6E56" opacity={0.3 + i * 0.15} />
        </g>
      ))}
      {/* bar chart */}
      <rect x="8" y="72" width="130" height="60" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
      <rect x="16" y="78" width="60" height="6" rx="2" fill="#CBD5E1" />
      {[0,1,2,3,4].map((b, i) => {
        const h = [30, 18, 38, 22, 28][i]
        return <rect key={b} x={18 + i * 22} y={122 - h} width="16" height={h} rx="3" fill="#0F6E56" opacity={0.4 + i * 0.1} />
      })}
      {/* stock card */}
      <rect x="146" y="72" width="66" height="60" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
      <rect x="152" y="78" width="40" height="5" rx="2" fill="#CBD5E1" />
      {[0,1,2,3].map(r => (
        <g key={r}>
          <rect x="152" y={88 + r * 10} width="28" height="5" rx="2" fill="#F1F5F9" />
          <rect x="184" y={89 + r * 10} width="20" height="4" rx="2" fill={r === 2 ? '#FCEBEB' : '#E1F5EE'} />
        </g>
      ))}
    </svg>
  )
}

function IlluNovaVenda() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      {/* topbar */}
      <rect x="0" y="0" width="220" height="22" rx="6" fill="#0F6E56" opacity="0.15" />
      <rect x="8" y="7" width="60" height="8" rx="2" fill="#0F6E56" opacity="0.5" />
      {/* product grid */}
      {[0,1,2,3,4].map(i => {
        const col = i % 3
        const row = Math.floor(i / 3)
        const selected = i === 1
        return (
          <g key={i}>
            <rect x={8 + col * 68} y={30 + row * 52} width="62" height="46" rx="6"
              fill={selected ? '#EDFAF4' : 'white'}
              stroke={selected ? '#0F6E56' : '#E8EDF2'}
              strokeWidth={selected ? 1.5 : 0.5} />
            <rect x={14 + col * 68} y={38 + row * 52} width="36" height="5" rx="2" fill={selected ? '#0F6E56' : '#CBD5E1'} opacity="0.7" />
            <rect x={14 + col * 68} y={46 + row * 52} width="24" height="4" rx="2" fill="#F1F5F9" />
            {/* +/- controls */}
            <rect x={14 + col * 68} y={56 + row * 52} width="10" height="10" rx="3" fill="#F8FAFC" stroke="#E8EDF2" strokeWidth="0.5" />
            <rect x={44 + col * 68} y={56 + row * 52} width="10" height="10" rx="3" fill="#F8FAFC" stroke="#E8EDF2" strokeWidth="0.5" />
            {selected && <rect x={27 + col * 68} y={59 + row * 52} width="6" height="4" rx="1" fill="#0F6E56" />}
          </g>
        )
      })}
      {/* summary panel */}
      <rect x="146" y="28" width="66" height="104" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
      <rect x="152" y="36" width="40" height="5" rx="2" fill="#CBD5E1" />
      <rect x="152" y="47" width="54" height="16" rx="4" fill="#EDFAF4" stroke="#0F6E56" strokeWidth="0.5" />
      <rect x="156" y="52" width="30" height="5" rx="2" fill="#0F6E56" opacity="0.6" />
      {/* confirm btn */}
      <rect x="152" y="108" width="54" height="16" rx="5" fill="#0F6E56" />
      <rect x="162" y="113" width="34" height="5" rx="2" fill="white" opacity="0.8" />
    </svg>
  )
}

function IlluEstoque() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      <rect x="0" y="0" width="220" height="22" rx="6" fill="#0F6E56" opacity="0.15" />
      <rect x="8" y="7" width="40" height="8" rx="2" fill="#0F6E56" opacity="0.5" />
      {[0,1,2,3,4].map(i => (
        <g key={i}>
          <rect x="8" y={30 + i * 22} width="204" height="18" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
          <rect x="14" y={36 + i * 22} width="60" height="5" rx="2" fill="#CBD5E1" />
          <rect x={i === 2 ? 142 : 148} y={37 + i * 22}
            width={i === 2 ? 30 : 24} height="6" rx="3"
            fill={i === 4 ? '#FCEBEB' : i === 2 ? '#FAEEDA' : '#E1F5EE'} />
          <rect x="182" y={35 + i * 22} width="24" height="8" rx="4" fill="#EDFAF4" stroke="#0F6E56" strokeWidth="0.5" />
        </g>
      ))}
    </svg>
  )
}

function IlluHistorico() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      <rect x="0" y="0" width="220" height="22" rx="6" fill="#0F6E56" opacity="0.15" />
      <rect x="8" y="7" width="50" height="8" rx="2" fill="#0F6E56" opacity="0.5" />
      {/* filter bar */}
      <rect x="8" y="28" width="204" height="22" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
      <rect x="14" y="35" width="40" height="8" rx="4" fill="#F1F5F9" />
      <rect x="62" y="35" width="40" height="8" rx="4" fill="#F1F5F9" />
      <rect x="110" y="35" width="40" height="8" rx="4" fill="#F1F5F9" />
      {/* table rows */}
      <rect x="8" y="56" width="204" height="10" rx="0" fill="#F8FAFC" />
      {[0,1,2,3,4,5].map(r => (
        <g key={r}>
          <rect x="8" y={68 + r * 13} width="204" height="12" rx="0" fill={r % 2 === 0 ? 'white' : '#FAFAFA'} />
          <rect x="14" y={71 + r * 13} width="30" height="5" rx="2" fill="#CBD5E1" />
          <rect x="60" y={71 + r * 13} width="60" height="5" rx="2" fill="#E2E8F0" />
          <rect x="148" y={71 + r * 13} width="24" height="5" rx="3" fill={r === 2 ? '#FAEEDA' : '#F1F5F9'} />
          <rect x="182" y={71 + r * 13} width="24" height="5" rx="2" fill="#0F6E56" opacity="0.2" />
        </g>
      ))}
    </svg>
  )
}

function IlluFluxo() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      <rect x="0" y="0" width="220" height="22" rx="6" fill="#0F6E56" opacity="0.15" />
      <rect x="8" y="7" width="50" height="8" rx="2" fill="#0F6E56" opacity="0.5" />
      {/* 3 metric cards */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={8 + i * 70} y="28" width="64" height="28" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
          <rect x={14 + i * 70} y="34" width="32" height="4" rx="2" fill="#CBD5E1" />
          <rect x={14 + i * 70} y="42" width="44" height="7" rx="2" fill="#0F6E56" opacity={0.25 + i * 0.1} />
        </g>
      ))}
      {/* bar chart */}
      <rect x="8" y="62" width="204" height="70" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
      <rect x="14" y="68" width="50" height="5" rx="2" fill="#CBD5E1" />
      {Array.from({ length: 14 }, (_, i) => {
        const h = [12, 24, 8, 32, 18, 40, 14, 28, 20, 36, 10, 30, 16, 22][i] || 15
        return <rect key={i} x={16 + i * 14} y={124 - h} width="10" height={h} rx="2" fill="#0F6E56" opacity="0.7" />
      })}
    </svg>
  )
}

function IlluFechamento() {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140" fill="none">
      <rect x="0" y="0" width="220" height="22" rx="6" fill="#0F6E56" opacity="0.15" />
      <rect x="8" y="7" width="60" height="8" rx="2" fill="#0F6E56" opacity="0.5" />
      <rect x="160" y="5" width="52" height="12" rx="6" fill="#0F6E56" opacity="0.7" />
      {/* 3 metric cards */}
      {[0,1,2].map(i => (
        <g key={i}>
          <rect x={8 + i * 70} y="28" width="64" height="28" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
          <rect x={14 + i * 70} y="34" width="28" height="4" rx="2" fill="#CBD5E1" />
          <rect x={14 + i * 70} y="42" width="38" height="8" rx="2" fill="#0F6E56" opacity={0.3 + i * 0.15} />
        </g>
      ))}
      {/* two cards side by side */}
      <rect x="8" y="62" width="100" height="70" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
      <rect x="14" y="68" width="50" height="5" rx="2" fill="#CBD5E1" />
      {[0,1,2,3].map(r => (
        <g key={r}>
          <rect x="14" y={78 + r * 12} width="50" height="5" rx="2" fill="#F1F5F9" />
          <rect x="72" y={78 + r * 12} width="28" height="5" rx="2" fill="#E1F5EE" />
        </g>
      ))}
      <rect x="114" y="62" width="98" height="70" rx="6" fill="white" stroke="#E8EDF2" strokeWidth="0.5" />
      <rect x="120" y="68" width="50" height="5" rx="2" fill="#CBD5E1" />
      {['pix','din','deb','cre','fia'].map((f, r) => (
        <g key={f}>
          <circle cx="124" cy={80 + r * 11} r="3" fill={['#0F6E56','#1A9070','#2563EB','#7C3AED','#D97706'][r]} />
          <rect x="130" y={77 + r * 11} width="28" height="5" rx="2" fill="#F1F5F9" />
          <rect x="174" y={77 + r * 11} width="30" height="5" rx="2" fill="#E2E8F0" />
        </g>
      ))}
    </svg>
  )
}

// ── Steps ──────────────────────────────────────────────────────────

const STEPS: Step[] = [
  {
    badge: '👋',
    title: 'Bem-vindo ao Kash!',
    description: 'Seu app de gestão de vendas para queijaria. Rápido, simples e funciona direto no celular — sem precisar de conta ou internet para usar.',
    tip: 'Seus dados ficam salvos aqui mesmo, no seu dispositivo.',
    illustration: (
      <div className="flex flex-col items-center justify-center gap-2 py-2">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl font-bold text-white" style={{ backgroundColor: '#0F6E56' }}>
          K
        </div>
        <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-1">Kash — Gestão de vendas</span>
      </div>
    ),
  },
  {
    badge: '📊',
    title: 'Dashboard',
    description: 'Acompanhe faturamento, transações e peças vendidas por dia, semana ou mês. O alerta de estoque crítico aparece aqui quando um produto está acabando.',
    tip: 'Troque o período com os botões Dia / Semana / Mês.',
    illustration: <IlluDashboard />,
  },
  {
    badge: '🛒',
    title: 'Nova venda',
    description: 'Selecione os produtos tocando nos cards, ajuste a quantidade com + e −, escolha a forma de pagamento e confirme. Rápido como no caixa.',
    tip: 'Se for fiado, o campo de nome do cliente aparece automaticamente.',
    illustration: <IlluNovaVenda />,
  },
  {
    badge: '📋',
    title: 'Histórico',
    description: 'Veja todas as vendas com filtros de data e forma de pagamento. No rodapé aparece o total de vendas, peças e valor do período filtrado.',
    illustration: <IlluHistorico />,
  },
  {
    badge: '📦',
    title: 'Estoque',
    description: 'Registre entradas de produtos após cada produção. Use "Ajuste" para corrigir o inventário manualmente. O badge muda de cor conforme o nível.',
    tip: 'Verde = ok · Amarelo = atenção (≤4) · Vermelho = zerado.',
    illustration: <IlluEstoque />,
  },
  {
    badge: '📈',
    title: 'Fluxo de caixa',
    description: 'Navegue mês a mês e veja o faturamento diário em barras. Cada barra representa um dia — passe o dedo para ver o valor.',
    illustration: <IlluFluxo />,
  },
  {
    badge: '🔒',
    title: 'Fechamento de caixa',
    description: 'No fim do dia, feche o caixa para registrar o resumo: total por produto e por forma de pagamento. O valor "em caixa" já exclui o fiado.',
    tip: 'O fechamento é protegido — não pode fechar duas vezes no mesmo dia.',
    illustration: <IlluFechamento />,
  },
]

// ── Componente principal ───────────────────────────────────────────

export default function Tutorial({ onClose }: TutorialProps) {
  const [step, setStep] = useState(0)
  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  const next = () => {
    if (isLast) onClose()
    else setStep((s) => s + 1)
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(15,110,86,0.18)', backdropFilter: 'blur(2px)' }}>
      <div
        className="bg-white rounded-2xl w-full max-w-sm flex flex-col overflow-hidden"
        style={{ border: '0.5px solid #E8EDF2', maxHeight: '92vh' }}
      >
        {/* Header colorido */}
        <div className="px-5 pt-5 pb-4" style={{ backgroundColor: '#0F6E56' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-white/70 uppercase tracking-widest">
              Passo {step + 1} de {STEPS.length}
            </span>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white text-[20px] leading-none"
            >
              ×
            </button>
          </div>
          {/* Barra de progresso */}
          <div className="h-1 rounded-full bg-white/20 overflow-hidden">
            <div
              className="h-full rounded-full bg-white transition-all duration-300"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto px-5 pt-5 pb-2">
          {/* Ilustração */}
          <div
            className="rounded-xl flex items-center justify-center mb-4 overflow-hidden"
            style={{ backgroundColor: '#F8FAFC', border: '0.5px solid #E8EDF2', minHeight: 140 }}
          >
            {current.illustration}
          </div>

          {/* Badge + título */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xl">{current.badge}</span>
            <h2 className="text-[17px] font-semibold text-gray-900">{current.title}</h2>
          </div>

          {/* Descrição */}
          <p className="text-[13px] text-gray-500 leading-relaxed mb-3">
            {current.description}
          </p>

          {/* Tip */}
          {current.tip && (
            <div
              className="flex items-start gap-2 rounded-lg px-3 py-2 text-[12px]"
              style={{ backgroundColor: '#EDFAF4', color: '#085041', border: '0.5px solid #0F6E56' }}
            >
              <span>💡</span>
              <span>{current.tip}</span>
            </div>
          )}
        </div>

        {/* Dots + botões */}
        <div className="px-5 py-4">
          {/* Dots */}
          <div className="flex justify-center gap-1.5 mb-4">
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className="rounded-full transition-all"
                style={{
                  width: i === step ? 20 : 6,
                  height: 6,
                  backgroundColor: i === step ? '#0F6E56' : '#E2E8F0',
                }}
              />
            ))}
          </div>

          {/* Botões */}
          <div className="flex gap-2">
            {!isLast && (
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl text-[13px] font-medium"
                style={{ border: '0.5px solid #E8EDF2', color: '#94A3B8' }}
              >
                Pular
              </button>
            )}
            <button
              onClick={next}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-medium text-white transition-all"
              style={{ backgroundColor: '#0F6E56' }}
            >
              {isLast ? 'Começar a usar →' : 'Próximo →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
