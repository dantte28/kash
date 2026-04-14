'use client'

type Props = {
  produtos: string[]
}

export default function AlertBanner({ produtos }: Props) {
  if (produtos.length === 0) return null

  return (
    <div
      className="flex items-start gap-3 rounded-xl px-4 py-3 text-sm mb-4"
      style={{
        backgroundColor: '#FFF8EC',
        border: '0.5px solid #FAC775',
        color: '#633806',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="mt-0.5 shrink-0">
        <path
          d="M8 1.5L1 13.5H15L8 1.5Z"
          stroke="#FAC775"
          strokeWidth="1.5"
          strokeLinejoin="round"
          fill="#FFF8EC"
        />
        <path d="M8 6.5V9.5" stroke="#633806" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11.5" r="0.75" fill="#633806" />
      </svg>
      <span>
        <strong>Estoque crítico:</strong>{' '}
        {produtos.join(', ')}
      </span>
    </div>
  )
}
