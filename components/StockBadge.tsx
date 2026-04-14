'use client'

type Props = {
  estoque: number
}

export default function StockBadge({ estoque }: Props) {
  let bg: string
  let color: string
  let label: string

  if (estoque === 0) {
    bg = '#FCEBEB'
    color = '#791F1F'
    label = 'Sem estoque'
  } else if (estoque <= 4) {
    bg = '#FAEEDA'
    color = '#633806'
    label = `${estoque} un`
  } else {
    bg = '#E1F5EE'
    color = '#085041'
    label = `${estoque} un`
  }

  return (
    <span
      style={{ backgroundColor: bg, color }}
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
    >
      {label}
    </span>
  )
}
