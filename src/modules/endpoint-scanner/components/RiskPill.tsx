import { Badge } from './Badge'

export function riskTone(tier?: string | null): 'neutral' | 'success' | 'warning' | 'danger' {
  const t = (tier || '').toUpperCase()
  if (t === 'LOW') return 'success'
  if (t === 'MODERATE') return 'warning'
  if (t === 'HIGH' || t === 'SEVERE' || t === 'CRITICAL') return 'danger'
  return 'neutral'
}

export function riskColor(tier?: string | null): string {
  // Returns inline style color value (used for tabular score numbers).
  const t = (tier || '').toUpperCase()
  if (t === 'LOW') return '#5b9a7c'
  if (t === 'MODERATE') return '#a87f3f'
  if (t === 'HIGH' || t === 'SEVERE' || t === 'CRITICAL') return '#a85555'
  return 'var(--color-text-muted)'
}

export function RiskPill({ tier, size }: { tier?: string | null; size?: 'sm' | 'md' }) {
  if (!tier) return <Badge label="—" tone="neutral" size={size} />
  return <Badge label={tier.toUpperCase()} tone={riskTone(tier)} size={size} />
}
