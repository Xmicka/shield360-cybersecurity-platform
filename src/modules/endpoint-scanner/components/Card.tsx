import clsx from 'clsx'
import type { ReactNode } from 'react'

type Props = {
  title?: string
  subtitle?: string
  right?: ReactNode
  children: ReactNode
  className?: string
  noPadding?: boolean
}

/**
 * Reskinned Card — uses the project's `.glass-card` surface so it sits naturally
 * on top of the cream background instead of looking like a dark cutout.
 */
export function Card({ title, subtitle, right, children, className, noPadding }: Props) {
  return (
    <div className={clsx('glass-card overflow-hidden', className)}>
      {(title || subtitle || right) && (
        <div
          className="flex items-start justify-between gap-4 px-6 py-4"
          style={{ borderBottom: '1px solid var(--color-border)' }}
        >
          <div>
            {title && (
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{title}</h3>
            )}
            {subtitle && (
              <p style={{ marginTop: 2, fontSize: 12, color: 'var(--color-text-muted)' }}>{subtitle}</p>
            )}
          </div>
          {right}
        </div>
      )}
      <div className={noPadding ? '' : 'px-6 py-5'}>{children}</div>
    </div>
  )
}
