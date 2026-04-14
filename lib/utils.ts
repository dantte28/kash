export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function getPeriodoInicio(periodo: 'dia' | 'semana' | 'mes'): Date {
  const now = new Date()
  if (periodo === 'dia') {
    const d = new Date(now)
    d.setHours(0, 0, 0, 0)
    return d
  }
  if (periodo === 'semana') {
    const d = new Date(now)
    const day = d.getDay()
    d.setDate(d.getDate() - day)
    d.setHours(0, 0, 0, 0)
    return d
  }
  // mes
  const d = new Date(now.getFullYear(), now.getMonth(), 1)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getPeriodoFim(periodo: 'dia' | 'semana' | 'mes'): Date {
  const now = new Date()
  if (periodo === 'dia') {
    const d = new Date(now)
    d.setHours(23, 59, 59, 999)
    return d
  }
  if (periodo === 'semana') {
    const d = new Date(now)
    const day = d.getDay()
    d.setDate(d.getDate() + (6 - day))
    d.setHours(23, 59, 59, 999)
    return d
  }
  // mes
  const d = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  d.setHours(23, 59, 59, 999)
  return d
}

export function getPeriodoAnteriorInicio(periodo: 'dia' | 'semana' | 'mes'): Date {
  const inicio = getPeriodoInicio(periodo)
  if (periodo === 'dia') {
    const d = new Date(inicio)
    d.setDate(d.getDate() - 1)
    return d
  }
  if (periodo === 'semana') {
    const d = new Date(inicio)
    d.setDate(d.getDate() - 7)
    return d
  }
  const d = new Date(inicio)
  d.setMonth(d.getMonth() - 1)
  return d
}

export function getPeriodoAnteriorFim(periodo: 'dia' | 'semana' | 'mes'): Date {
  const inicio = getPeriodoInicio(periodo)
  const d = new Date(inicio)
  d.setMilliseconds(d.getMilliseconds() - 1)
  return d
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso)
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${date} · ${time}`
}

export function formatRelativeTime(iso: string): string {
  const now = new Date()
  const d = new Date(iso)
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `há ${diffMin} min`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `há ${diffH}h`
  const diffD = Math.floor(diffH / 24)
  return `há ${diffD}d`
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}
