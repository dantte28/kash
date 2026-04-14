'use client'

import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning'

type Props = {
  message: string
  type: ToastType
  onClose: () => void
}

const styles: Record<ToastType, { bg: string; border: string; color: string }> = {
  success: { bg: '#EDFAF4', border: '#0F6E56', color: '#085041' },
  error: { bg: '#FCEBEB', border: '#DC2626', color: '#791F1F' },
  warning: { bg: '#FFF8EC', border: '#FAC775', color: '#633806' },
}

export default function Toast({ message, type, onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000)
    return () => clearTimeout(t)
  }, [onClose])

  const s = styles[type]

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-sm md:bottom-6 md:right-6 bottom-20 right-0 left-0 mx-4"
      style={{
        backgroundColor: s.bg,
        border: `0.5px solid ${s.border}`,
        color: s.color,
      }}
    >
      {type === 'success' && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke={s.border} strokeWidth="1.5" />
          <path d="M5 8L7 10L11 6" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {type === 'error' && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="7" stroke={s.border} strokeWidth="1.5" />
          <path d="M6 6L10 10M10 6L6 10" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {type === 'warning' && (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 2L14.5 13H1.5L8 2Z" stroke={s.border} strokeWidth="1.5" strokeLinejoin="round" />
          <path d="M8 6V9" stroke={s.color} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="11" r="0.75" fill={s.color} />
        </svg>
      )}
      {message}
    </div>
  )
}
