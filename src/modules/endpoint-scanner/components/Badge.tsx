import clsx from 'clsx'
import type { CSSProperties } from 'react'

type Props = {
  label: string
  tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md'
}

/**
 * Soft pastel badge — matches the host site's wisprflow aesthetic.
 * Tinted background at low alpha + colored text + matching border.
 */
export function Badge({ label, tone = 'neutral', size = 'sm' }: Props) {
  const className = clsx(
    'inline-flex items-center font-semibold',
    size === 'sm' && 'rounded-md px-2 py-0.5 text-[11px] leading-5',
    size === 'md' && 'rounded-lg px-2.5 py-1 text-xs',
  )

  const styles: Record<string, CSSProperties> = {
    neutral: {
      background: 'rgba(0,0,0,0.04)',
      color: 'var(--color-text-secondary)',
      border: '1px solid var(--color-border)',
    },
    success: {
      background: 'rgba(125,186,156,0.14)',
      color: '#5b9a7c',
      border: '1px solid rgba(125,186,156,0.32)',
    },
    warning: {
      background: 'rgba(212,165,106,0.16)',
      color: '#a87f3f',
      border: '1px solid rgba(212,165,106,0.34)',
    },
    danger: {
      background: 'rgba(201,112,112,0.12)',
      color: '#a85555',
      border: '1px solid rgba(201,112,112,0.32)',
    },
    info: {
      background: 'rgba(184,169,201,0.18)',
      color: '#7a6a96',
      border: '1px solid rgba(184,169,201,0.36)',
    },
  }

  return <span className={className} style={styles[tone]}>{label}</span>
}
