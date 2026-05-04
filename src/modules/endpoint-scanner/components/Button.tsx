import clsx from 'clsx'
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md'
  icon?: ReactNode
}

/**
 * Reskinned Button — maps to wisprflow palette via inline styles so it matches
 * the rest of the site (cream background, soft sage/lavender/dusty-rose accents).
 */
export function Button({ className, variant = 'secondary', size = 'md', icon, children, style, ...props }: Props) {
  const base =
    'inline-flex items-center justify-center gap-1.5 font-medium transition-all duration-150 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed'

  const sizes =
    size === 'sm'
      ? 'rounded-lg px-3 py-1.5 text-xs'
      : 'rounded-xl px-4 py-2 text-sm'

  const variantStyle: CSSProperties =
    variant === 'primary'
      ? {
          background: 'var(--color-cyan-400)',
          color: 'var(--color-text-inverse)',
          fontWeight: 600,
        }
      : variant === 'danger'
        ? {
            background: 'var(--color-status-error)',
            color: '#ffffff',
            fontWeight: 600,
          }
        : variant === 'ghost'
          ? {
              background: 'transparent',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border)',
            }
          : {
              // secondary
              background: 'var(--color-bg-card)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border)',
            }

  return (
    <button
      className={clsx(base, sizes, className)}
      style={{ ...variantStyle, ...style }}
      {...props}
    >
      {icon}
      {children}
    </button>
  )
}
