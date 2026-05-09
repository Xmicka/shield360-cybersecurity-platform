export default function RiskSummary({score}:{score:number}){
  const label = score >= 0.66 ? 'High' : score >= 0.4 ? 'Medium' : 'Low'
  const color = score >= 0.66 ? 'text-[var(--color-brand-coral)]' : score >= 0.4 ? 'text-amber-600' : 'text-[var(--color-brand-sage-deep)]'
  return (
    <div className="card p-3">
      <div className="text-sm text-[var(--color-text-secondary)]">Organization risk</div>
      <div className={`text-2xl font-semibold ${color}`}>{label}: {score.toFixed(2)}</div>
    </div>
  )
}
