export default function MetricCard({ title, value, sub }: { title: string; value: string | number; sub?: string }){
  return (
    <div className="card p-4 w-full">
      <div className="text-xs text-[var(--color-text-muted)]">{title}</div>
      <div className="text-2xl font-semibold mt-1 text-[var(--color-text-primary)]">{value}</div>
      {sub && <div className="text-xs text-[var(--color-text-muted)] mt-1">{sub}</div>}
    </div>
  )
}
