export function formatBRL(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

export function formatDate(isoDate) {
  if (!isoDate) return '—'
  return new Date(isoDate + 'T00:00:00').toLocaleDateString('pt-BR')
}

export function formatPercent(value) {
  if (value == null || Number.isNaN(value)) return '—'
  return `${Math.round(value)}%`
}
