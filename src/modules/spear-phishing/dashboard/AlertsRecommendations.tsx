import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchDashboardData, type DashboardAlert, type DashboardRecommendation } from '../api/client'

const AlertsRecommendations: React.FC = () => {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())
  const [alerts, setAlerts] = useState<DashboardAlert[]>([])
  const [recommendations, setRecommendations] = useState<DashboardRecommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [riskStats, setRiskStats] = useState({ high: 0, medium: 0, low: 0 })

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000)

    fetchDashboardData()
      .then(data => {
        if (data) {
          setAlerts(data.alerts)
          setRecommendations(data.recommendations)
          setRiskStats(data.risk_distribution)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Alerts data fetch error:', err)
        setLoading(false)
      })
      .finally(() => {
        clearTimeout(timeout)
      })

    return () => clearTimeout(timeout)
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { bg: 'bg-[rgba(224,122,95,0.12)]', border: 'border-[var(--color-border)]', icon: '🔴', badge: 'bg-[var(--color-brand-coral)]' }
      case 'high':
        return { bg: 'bg-[rgba(224,122,95,0.10)]', border: 'border-[var(--color-border)]', icon: '🟠', badge: 'bg-[var(--color-brand-peach)]' }
      case 'medium':
        return { bg: 'bg-[rgba(212,168,83,0.12)]', border: 'border-[var(--color-border)]', icon: '🟡', badge: 'bg-amber-500' }
      case 'low':
        return { bg: 'bg-[rgba(107,163,190,0.12)]', border: 'border-[var(--color-border)]', icon: '🔵', badge: 'bg-[var(--color-brand-blue)]' }
      default:
        return { bg: 'bg-[rgba(0,0,0,0.04)]', border: 'border-[var(--color-border)]', icon: '⚪', badge: 'bg-[var(--color-text-muted)]' }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-[var(--color-brand-coral)] bg-[rgba(224,122,95,0.10)] border-[var(--color-border)]'
      case 'high':
        return 'text-[var(--color-brand-peach)] bg-[rgba(232,145,122,0.10)] border-[var(--color-border)]'
      case 'medium':
        return 'text-amber-600 bg-[rgba(212,168,83,0.10)] border-[var(--color-border)]'
      default:
        return 'text-[var(--color-text-secondary)] bg-[rgba(0,0,0,0.04)] border-[var(--color-border)]'
    }
  }

  const totalUsers = riskStats.high + riskStats.medium + riskStats.low
  const safePercent = totalUsers > 0 ? Math.round((riskStats.low / totalUsers) * 100) : 0

  return (
    <div className="space-y-12">
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-[var(--color-text-primary)]">
          Alerts & Recommendations
        </h2>
        <p className="text-[var(--color-text-secondary)] text-lg">Auto-generated from real pipeline analysis results</p>
      </motion.div>

      {/* Alerts */}
      <div className="space-y-6">
        <motion.h3
          className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
        >
          <span className="text-amber-500">⚠️</span> Active Alerts
        </motion.h3>

        <div className="space-y-3">
          {loading ? (
            <div className="text-center text-[var(--color-text-muted)] py-4">Loading alerts...</div>
          ) : alerts.length === 0 ? (
            <motion.div className="p-4 rounded-lg bg-[rgba(143,191,150,0.12)] border border-[var(--color-border)] text-[var(--color-brand-sage-deep)] text-center">
              <p className="font-semibold">✓ No active alerts, all clear</p>
            </motion.div>
          ) : (
            alerts.map((alert, idx) => {
              const alertKey = `${alert.severity}-${idx}`
              if (dismissedAlerts.has(alertKey)) return null
              const colors = getSeverityColor(alert.severity)
              return (
                <motion.div
                  key={alertKey}
                  className={`p-4 rounded-lg border transition-all backdrop-blur-sm group ${colors.bg} ${colors.border}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: idx * 0.08, duration: 0.4 }}
                  whileHover={{ translateX: 8 }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <motion.div
                          className="text-2xl mt-0.5 flex-shrink-0"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {colors.icon}
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[var(--color-text-primary)] text-lg">{alert.title}</h4>
                          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{alert.description}</p>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => setDismissedAlerts(prev => new Set([...prev, alertKey]))}
                        className="text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors flex-shrink-0"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Dismiss alert"
                      >
                        ✕
                      </motion.button>
                    </div>

                    {alert.action && (
                      <motion.button
                        className={`w-full px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${alert.severity === 'high'
                            ? 'bg-[rgba(232,145,122,0.20)] text-[var(--color-brand-peach)] hover:bg-[rgba(232,145,122,0.28)]'
                            : alert.severity === 'medium'
                              ? 'bg-[rgba(212,168,83,0.20)] text-amber-700 hover:bg-[rgba(212,168,83,0.28)]'
                              : 'bg-[rgba(155,130,204,0.15)] text-[var(--color-brand-lavender-dark)] hover:bg-[rgba(155,130,204,0.22)]'
                          }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        → {alert.action}
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}

          {alerts.filter((_, idx) => !dismissedAlerts.has(`${alerts[idx].severity}-${idx}`)).length === 0 && alerts.length > 0 && (
            <motion.div className="p-4 rounded-lg bg-[rgba(143,191,150,0.12)] border border-[var(--color-border)] text-[var(--color-brand-sage-deep)] text-center">
              <p className="font-semibold">✓ All alerts dismissed</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div className="space-y-6">
        <motion.h3
          className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
        >
          <span className="text-[var(--color-brand-lavender-dark)]">💡</span> Recommendations
        </motion.h3>

        {loading ? (
          <div className="text-center text-[var(--color-text-muted)] py-4">Loading recommendations...</div>
        ) : recommendations.length === 0 ? (
          <div className="text-center text-[var(--color-text-muted)] py-4">No recommendations at this time.</div>
        ) : (
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <motion.div
                key={idx}
                className={`p-4 rounded-lg border transition-all backdrop-blur-sm group hover:shadow-lg ${getPriorityColor(rec.priority)}`}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                whileHover={{ translateX: 8 }}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold capitalize ${getPriorityColor(rec.priority)}`}>
                          {rec.priority}
                        </span>
                      </div>
                      <h4 className="font-semibold text-[var(--color-text-primary)] text-base">{rec.title}</h4>
                    </div>
                    <motion.div
                      className="text-2xl flex-shrink-0"
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      🎯
                    </motion.div>
                  </div>

                  <p className="text-sm text-[var(--color-text-secondary)]">{rec.description}</p>

                  <div className="pt-2 border-t border-[var(--color-border)]">
                    <p className="text-xs text-[var(--color-text-muted)]">
                      <span className="font-semibold text-[var(--color-brand-lavender-dark)]">Expected Impact:</span> {rec.impact}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <motion.div
        className="p-6 rounded-xl bg-[rgba(155,130,204,0.10)] border border-[var(--color-border)]"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.5 }}
      >
        <div className="space-y-3">
          <p className="text-lg font-semibold text-[var(--color-text-primary)]">📈 Overall Assessment</p>
          <p className="text-[var(--color-text-secondary)]">
            {totalUsers > 0 ? (
              <>
                Your organization has <span className="text-[var(--color-text-primary)] font-semibold">{totalUsers}</span> monitored users.{' '}
                <span className="text-[var(--color-brand-lavender-dark)] font-semibold">{safePercent}%</span> show normal behavior patterns.
                {riskStats.high > 0 && (
                  <> Focus on the <span className="text-[var(--color-brand-coral)] font-semibold">{riskStats.high}</span> high-risk user(s) requiring immediate attention.</>
                )}
              </>
            ) : (
              <>No user data available yet. Deploy the collector and run the pipeline to get an assessment.</>
            )}
          </p>
          {totalUsers > 0 && (
            <div className="pt-2 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-brand-sage-deep)]">{riskStats.low}</div>
                <p className="text-xs text-[var(--color-text-muted)]">Safe Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600">{riskStats.medium}</div>
                <p className="text-xs text-[var(--color-text-muted)]">Watchlist</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--color-brand-coral)]">{riskStats.high}</div>
                <p className="text-xs text-[var(--color-text-muted)]">High Risk</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default AlertsRecommendations
