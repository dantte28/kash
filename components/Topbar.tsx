'use client'

import Link from 'next/link'
import React from 'react'

type Props = {
  title: string
  children?: React.ReactNode
  showNewSale?: boolean
}

export default function Topbar({ title, children, showNewSale = false }: Props) {
  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })

  return (
    <div
      className="flex items-center justify-between px-6 py-4 bg-white border-b"
      style={{ borderColor: '#E8EDF2', borderWidth: '0.5px' }}
    >
      <div>
        <h1 className="text-[15px] font-medium text-gray-900">{title}</h1>
        <p className="text-[12px] text-gray-400 capitalize mt-0.5">{today}</p>
      </div>
      <div className="flex items-center gap-3">
        {children}
        {showNewSale && (
          <Link
            href="/nova-venda"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium text-white transition-all"
            style={{ backgroundColor: '#0F6E56' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1V13M1 7H13" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Nova venda
          </Link>
        )}
      </div>
    </div>
  )
}
