'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getProdutos } from '../lib/storage'

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    href: '/nova-venda',
    label: 'Nova venda',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 5.5V12.5M5.5 9H12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/historico',
    label: 'Histórico',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M3 1.5H15C15.828 1.5 16.5 2.172 16.5 3V15C16.5 15.828 15.828 16.5 15 16.5H3C2.172 16.5 1.5 15.828 1.5 15V3C1.5 2.172 2.172 1.5 3 1.5Z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path d="M5 6.5H13M5 9.5H13M5 12.5H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/estoque',
    label: 'Estoque',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M2 6L9 2L16 6V12L9 16L2 12V6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9 9V16M2 6L9 9L16 6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    stockAlert: true,
  },
  {
    href: '/fluxo',
    label: 'Fluxo de caixa',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M1.5 12.5L6 8L9.5 11.5L14.5 5.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M11.5 5.5H14.5V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/fechamento',
    label: 'Fechamento',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1.5" y="3.5" width="15" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M1.5 7.5H16.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M5.5 11H8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [hasStockAlert, setHasStockAlert] = useState(false)
  const today = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

  useEffect(() => {
    const produtos = getProdutos()
    setHasStockAlert(produtos.some((p) => p.estoque <= 3))
  }, [pathname])

  const isActive = (href: string) => pathname === href || (href !== '/dashboard' && pathname.startsWith(href))

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col h-screen fixed top-0 left-0 z-40"
        style={{
          width: 'var(--sidebar-width, 210px)',
          backgroundColor: '#fff',
          borderRight: '0.5px solid #E8EDF2',
        }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: '#E8EDF2', borderWidth: '0.5px' }}>
          <div className="text-[16px] font-semibold" style={{ color: '#0F6E56' }}>
            Kash
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">Gestão de vendas</div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-2 mb-2">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400">Menu</span>
          </div>
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all relative"
                style={
                  active
                    ? { backgroundColor: '#EDFAF4', color: '#0F6E56' }
                    : { color: '#64748B' }
                }
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
                {item.stockAlert && hasStockAlert && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t" style={{ borderColor: '#E8EDF2', borderWidth: '0.5px' }}>
          <span className="text-[11px] text-gray-400">{today}</span>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around"
        style={{
          height: 56,
          backgroundColor: '#fff',
          borderTop: '0.5px solid #E8EDF2',
        }}
      >
        {navItems.slice(0, 5).map((item) => {
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-1 px-3 py-2 relative"
              style={{ color: active ? '#0F6E56' : '#94A3B8' }}
            >
              <span>{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
              {item.stockAlert && hasStockAlert && (
                <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-red-500" />
              )}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
