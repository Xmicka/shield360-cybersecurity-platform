import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, AlertTriangle, Users, Activity, GraduationCap, Info, CheckCircle2, PauseCircle } from 'lucide-react'
import { fetchDashboardData, type DashboardData } from '../api/client'

interface MetricCardProps {
  label: string
  value: string | number
  change?: string
  accent?: string
  icon?: React.ReactNode
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, change, accent = 'var(--color-brand-blue)', icon }) => {
  return (
    <motion.div
      className="glass-card"
      style={{ padding: 24, position: 'relative', overflow: 'hidden' }}
      whileHover={{ translateY: -2 }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accent, opacity: 0.55, borderRadius: '20px 20px 0 0' }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)' }}>{label}</p>
        {icon && (
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: `${accent}15`, border: `1px solid ${accent}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: accent,
          }}>
            {icon}
          </div>
        )}
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.025em', lineHeight: 1.1 }}>
        {value}
      </div>
      {change && (
        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8 }}>
          {change}
        </p>
      )}
    </motion.div>
  )
}

const SecurityPostureOverview: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000)
    fetchDashboardData()
      .then(d => { setData(d); setLoading(false) })
      .catch(err => { console.error('Dashboard data fetch error:', err); setLoading(false) })
      .finally(() => clearTimeout(timeout))
    return () => clearTimeout(timeout)
  }, [])

  const posture = data?.posture
  const riskLevel = posture?.overall_risk_level || 'Unknown'

  const metrics = [
    {
      label: 'Security Score',
      value: loading ? '…' : (posture?.security_score ?? 'N/A'),
      accent: 'var(--color-brand-blue)',
      change: posture?.security_score ? 'Out of 100' : '',
      icon: <Shield size={16} strokeWidth={1.5} />,
    },
    {
      label: 'Overall Risk Level',
      value: loading ? '…' : riskLevel,
      accent: 'var(--color-status-warn)',
      change: posture ? `Avg: ${(posture.avg_risk_score * 100).toFixed(0)}%` : '',
      icon: <AlertTriangle size={16} strokeWidth={1.5} />,
    },
    {
      label: 'Users Monitored',
      value: loading ? '…' : posture?.total_users ?? 0,
      accent: 'var(--color-accent-lavender)',
      change: posture?.total_events_collected ? `${posture.total_events_collected} events collected` : 'No events yet',
      icon: <Users size={16} strokeWidth={1.5} />,
    },
    {
      label: 'Events Collected',
      value: loading ? '…' : posture?.total_events_collected ?? 0,
      accent: 'var(--color-status-ok)',
      change: posture?.last_pipeline_run ? `Last run: ${new Date(posture.last_pipeline_run).toLocaleTimeString()}` : 'Pipeline not run',
      icon: <Activity size={16} strokeWidth={1.5} />,
    },
    {
      label: 'Training Pending',
      value: loading ? '…' : posture?.training_pending ?? 0,
      accent: 'var(--color-accent-coral)',
      change: posture?.training_pending ? `${posture.training_pending} user(s) need training` : 'All clear',
      icon: <GraduationCap size={16} strokeWidth={1.5} />,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <motion.div
        initial={{ opacity: 0, x: -16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      >
        <h2 style={{ fontSize: 26, fontWeight: 700, color: 'var(--color-text-primary)', letterSpacing: '-0.025em', marginBottom: 4 }}>
          Security Posture Overview
        </h2>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          Real-time organizational security metrics from live behavioral data
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m, i) => (
          <MetricCard key={i} {...m} />
        ))}
      </div>

      <motion.div
        className="glass-card"
        style={{
          padding: 18,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 14,
          background: 'rgba(107,163,190,0.06)',
          border: '1px solid rgba(107,163,190,0.20)',
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: 'rgba(107,163,190,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--color-brand-blue)',
        }}>
          <Info size={16} strokeWidth={1.5} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.65, paddingTop: 4 }}>
          {data && data.posture.total_users > 0 ? (
            <>
              <span style={{ fontWeight: 700, color: 'var(--color-brand-blue)' }}>Live Data:</span> Metrics are derived from{' '}
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{data.posture.total_events_collected}</span> behavioral events across{' '}
              <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{data.posture.total_users}</span> monitored users.
              {data.scheduler_status?.running ? (
                <span style={{ marginLeft: 8, color: 'var(--color-status-ok)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, verticalAlign: 'middle' }}>
                  <CheckCircle2 size={13} strokeWidth={2} /> Auto-pipeline active
                </span>
              ) : (
                <span style={{ marginLeft: 8, color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, verticalAlign: 'middle' }}>
                  <PauseCircle size={13} strokeWidth={1.5} /> Auto-pipeline stopped
                </span>
              )}
            </>
          ) : (
            <>
              <span style={{ fontWeight: 700, color: 'var(--color-brand-blue)' }}>Getting Started:</span> Deploy the behavioral collector to internal pages and run the pipeline to see real data here.
            </>
          )}
        </div>
      </motion.div>

      {data?.state_distribution && Object.values(data.state_distribution).some(v => v > 0) && (
        <motion.div
          className="glass-card"
          style={{ padding: 20 }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--color-text-muted)', marginBottom: 12 }}>
            User Training States
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { key: 'CLEAN', label: 'Clean', color: '#9b9b9b' },
              { key: 'PHISH_SENT', label: 'Phish Sent', color: '#6ba3be' },
              { key: 'PHISH_CLICKED', label: 'Clicked', color: '#c97070' },
              { key: 'MICRO_TRAINING_REQUIRED', label: 'Micro Training', color: '#E8917A' },
              { key: 'MICRO_TRAINING_COMPLETED', label: 'Micro Done', color: '#d4a56a' },
              { key: 'MANDATORY_TRAINING_REQUIRED', label: 'Mandatory', color: '#D4A853' },
              { key: 'COMPLIANT', label: 'Compliant', color: '#7dba9c' },
            ].filter(s => (data.state_distribution?.[s.key] ?? 0) > 0).map(s => (
              <div key={s.key} style={{
                background: `${s.color}14`,
                border: `1px solid ${s.color}30`,
                borderRadius: 12,
                padding: '10px 14px',
                textAlign: 'center',
                minWidth: 84,
              }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: s.color, lineHeight: 1.1 }}>
                  {data.state_distribution?.[s.key] ?? 0}
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default SecurityPostureOverview
