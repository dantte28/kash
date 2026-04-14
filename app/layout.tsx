import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Sidebar from '../components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kash — Gestão de vendas',
  description: 'App de gestão de vendas, estoque e fluxo de caixa para queijaria',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="flex min-h-screen">
          <Sidebar />
          {/* On mobile: no left margin (sidebar is bottom nav). On md+: margin matches sidebar width */}
          <main className="flex-1 min-h-screen overflow-x-hidden w-full md:ml-[var(--sidebar-width,210px)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
