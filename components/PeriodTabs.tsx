'use client'

type Periodo = 'dia' | 'semana' | 'mes'

type Props = {
  value: Periodo
  onChange: (p: Periodo) => void
}

const tabs: { key: Periodo; label: string }[] = [
  { key: 'dia', label: 'Dia' },
  { key: 'semana', label: 'Semana' },
  { key: 'mes', label: 'Mês' },
]

export default function PeriodTabs({ value, onChange }: Props) {
  return (
    <div
      className="flex gap-0.5 rounded-lg p-0.5"
      style={{ backgroundColor: '#F1F5F9', border: '0.5px solid #E2E8F0' }}
    >
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="px-3 py-1 rounded-md text-[13px] font-medium transition-all"
          style={
            value === t.key
              ? { backgroundColor: '#fff', color: '#0F6E56', border: '0.5px solid #E2E8F0' }
              : { color: '#64748B', border: '0.5px solid transparent' }
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
