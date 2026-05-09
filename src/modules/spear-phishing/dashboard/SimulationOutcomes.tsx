import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchDashboardData, sendPhishingEmail, sendAutoEmails, type DashboardUser, type EmailLogEntry, type EmailStats } from '../api/client'

const SimulationOutcomes: React.FC = () => {
  const [users, setUsers] = useState<DashboardUser[]>([])
  const [emailLog, setEmailLog] = useState<EmailLogEntry[]>([])
  const [emailStats, setEmailStats] = useState<EmailStats | null>(null)
  const [filterTier, setFilterTier] = useState<'all' | 'High' | 'Medium' | 'Low'>('all')
  const [activeTab, setActiveTab] = useState<'users' | 'emails'>('users')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState<string | null>(null)
  const [autoSending, setAutoSending] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null)

  const loadData = () => {
    fetchDashboardData().then(data => {
      if (data) {
        setUsers(data.users)
        setEmailLog(data.email_log || [])
        setEmailStats(data.email_stats || null)
      }
      setLoading(false)
    })
  }

  useEffect(() => { loadData() }, [])

  const filteredUsers = filterTier === 'all' ? users : users.filter(u => u.tier === filterTier)

  const handleSendEmail = async (userId: string) => {
    setSending(userId)
    setMessage(null)
    const result = await sendPhishingEmail(userId)
    if (result && !result.error) {
      setMessage({ text: `Email sent to ${userId} (${result.mode} mode)`, type: 'success' })
      loadData()
    } else {
      setMessage({ text: result?.error || 'Failed to send email', type: 'error' })
    }
    setSending(null)
  }

  const handleAutoSend = async () => {
    setAutoSending(true)
    setMessage(null)
    const result = await sendAutoEmails()
    if (result) {
      setMessage({
        text: `Auto-send complete: ${result.emails_sent} email(s) sent, ${result.skipped.length} skipped`,
        type: result.emails_sent > 0 ? 'success' : 'info',
      })
      loadData()
    } else {
      setMessage({ text: 'Auto-send failed', type: 'error' })
    }
    setAutoSending(false)
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'High': return { bg: 'bg-[rgba(224,122,95,0.10)]', border: 'border-[var(--color-border)]', text: 'text-[var(--color-brand-coral)]', badge: 'bg-[var(--color-brand-coral)]' }
      case 'Medium': return { bg: 'bg-[rgba(212,168,83,0.10)]', border: 'border-[var(--color-border)]', text: 'text-amber-600', badge: 'bg-amber-500' }
      case 'Low': return { bg: 'bg-[rgba(143,191,150,0.10)]', border: 'border-[var(--color-border)]', text: 'text-[var(--color-brand-sage-deep)]', badge: 'bg-[var(--color-brand-sage)]' }
      default: return { bg: 'bg-[rgba(0,0,0,0.04)]', border: 'border-[var(--color-border)]', text: 'text-[var(--color-text-secondary)]', badge: 'bg-[var(--color-text-muted)]' }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clicked': return 'text-[var(--color-brand-coral)] bg-[rgba(224,122,95,0.12)]'
      case 'opened': return 'text-amber-600 bg-[rgba(212,168,83,0.12)]'
      case 'reported': return 'text-[var(--color-brand-sage-deep)] bg-[rgba(143,191,150,0.15)]'
      default: return 'text-[var(--color-brand-lavender-dark)] bg-[rgba(155,130,204,0.10)]'
    }
  }

  const stats = {
    high: users.filter(u => u.tier === 'High').length,
    medium: users.filter(u => u.tier === 'Medium').length,
    low: users.filter(u => u.tier === 'Low').length,
  }

  return (
    <div className="space-y-8">
      <motion.div className="space-y-2" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.5 }}>
        <h2 className="text-4xl font-bold text-[var(--color-text-primary)]">
          Simulation Outcomes
        </h2>
        <p className="text-[var(--color-text-secondary)] text-lg">Email campaigns, user risk profiles, and phishing outcomes</p>
      </motion.div>

      {/* Email Stats Banner */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.1, duration: 0.5 }}
      >
        {[
          { label: 'Emails Sent', value: emailStats?.total_sent ?? 0, color: 'text-[var(--color-brand-lavender-dark)]', icon: '📧' },
          { label: 'Opened', value: emailStats?.total_opened ?? 0, color: 'text-amber-600', icon: '📬' },
          { label: 'Clicked', value: emailStats?.total_clicked ?? 0, color: 'text-[var(--color-brand-coral)]', icon: '🖱️' },
          { label: 'Reported', value: emailStats?.total_reported ?? 0, color: 'text-[var(--color-brand-sage-deep)]', icon: '🛡️' },
          { label: 'Click Rate', value: `${((emailStats?.click_rate ?? 0) * 100).toFixed(0)}%`, color: 'text-[var(--color-brand-lavender-dark)]', icon: '📊' },
        ].map((stat, idx) => (
          <motion.div key={idx} className="p-4 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] text-center" whileHover={{ translateY: -4 }}>
            <div className="text-2xl opacity-60 mb-1">{stat.icon}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{loading ? '...' : stat.value}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Auto-Send Button */}
      <motion.div className="flex items-center gap-4 flex-wrap" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }}>
        <button
          onClick={handleAutoSend}
          disabled={autoSending}
          className="btn-primary disabled:opacity-50"
        >
          {autoSending ? '⏳ Sending...' : '🚀 Auto-Send to High-Risk Users'}
        </button>
        {message && (
          <div className={`px-4 py-2 rounded-lg text-sm font-medium border ${message.type === 'success' ? 'bg-[rgba(143,191,150,0.12)] text-[var(--color-brand-sage-deep)] border-[var(--color-border)]' :
              message.type === 'error' ? 'bg-[rgba(224,122,95,0.12)] text-[var(--color-brand-coral)] border-[var(--color-border)]' :
                'bg-[rgba(155,130,204,0.10)] text-[var(--color-brand-lavender-dark)] border-[var(--color-border)]'
            }`}>
            {message.text}
          </div>
        )}
      </motion.div>

      {/* Tab Toggle */}
      <div className="flex gap-2">
        {(['users', 'emails'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${activeTab === tab
              ? 'bg-[var(--color-brand-lavender-dark)] text-white shadow-md'
              : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-brand-lavender-dark)]'
              }`}
          >
            {tab === 'users' ? '👤 User Profiles' : `📧 Email Log (${emailLog.length})`}
          </button>
        ))}
      </div>

      {/* Users Tab */}
      {activeTab === 'users' && (
        <>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'High', 'Medium', 'Low'] as const).map(tier => (
              <motion.button
                key={tier} onClick={() => setFilterTier(tier)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${filterTier === tier
                  ? 'bg-[var(--color-brand-lavender-dark)] text-white shadow-md'
                  : 'bg-[var(--color-bg-card)] text-[var(--color-text-secondary)] border border-[var(--color-border)] hover:border-[var(--color-brand-lavender-dark)]'
                  }`}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                {tier === 'all' ? `All (${users.length})` : `${tier} (${stats[tier.toLowerCase() as keyof typeof stats]})`}
              </motion.button>
            ))}
          </div>

          <motion.div className="space-y-3">
            {loading ? (
              <div className="text-center text-[var(--color-text-muted)] py-8">Loading...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center text-[var(--color-text-muted)] py-8">
                <div className="text-3xl mb-2">📭</div>
                No user data available. Run the pipeline after collecting behavioral events.
              </div>
            ) : (
              filteredUsers.map((user, idx) => {
                const colors = getTierColor(user.tier)
                return (
                  <motion.div
                    key={user.user_id}
                    className={`group p-4 rounded-lg border transition-all backdrop-blur-sm hover:shadow-lg ${colors.bg} ${colors.border}`}
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false }} transition={{ delay: idx * 0.05, duration: 0.4 }}
                    whileHover={{ translateX: 8 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, #B8A1E6, #9B82CC)' }}>
                            {user.user_id.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--color-text-primary)]">{user.user_id}</p>
                            <p className="text-xs text-[var(--color-text-muted)]">{user.login_count} login events</p>
                          </div>
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <div className="flex items-center gap-2">
                          <motion.div className={`w-3 h-3 rounded-full ${colors.badge}`} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                          <span className={`capitalize font-semibold text-sm ${colors.text}`}>{user.tier}</span>
                        </div>
                      </div>
                      <div className="md:col-span-1">
                        <span className="text-xs text-[var(--color-text-muted)] line-clamp-2">{user.risk_reason || 'Analyzed'}</span>
                      </div>
                      <div className="md:col-span-1 text-right">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${user.risk_score >= 0.6 ? 'bg-[var(--color-brand-coral)]' : user.risk_score >= 0.3 ? 'bg-amber-500' : 'bg-[var(--color-brand-sage)]'
                          } text-white text-sm font-semibold`}>
                          {(user.risk_score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="md:col-span-1 text-right">
                        <p className="text-xs text-[var(--color-text-muted)]">Failed: {(user.failed_login_ratio * 100).toFixed(0)}%</p>
                      </div>
                      <div className="md:col-span-1 text-right">
                        <button
                          onClick={() => handleSendEmail(user.user_id)}
                          disabled={sending === user.user_id}
                          className="px-3 py-1.5 rounded-lg bg-[var(--color-brand-lavender-dark)] hover:bg-[var(--color-brand-lavender)] text-white text-xs font-medium transition-all disabled:opacity-50"
                        >
                          {sending === user.user_id ? '⏳' : '📧 Send'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </motion.div>
        </>
      )}

      {/* Email Log Tab */}
      {activeTab === 'emails' && (
        <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {emailLog.length === 0 ? (
            <div className="text-center text-[var(--color-text-muted)] py-8">
              <div className="text-3xl mb-2">📭</div>
              No emails sent yet. Use the "Send" button or "Auto-Send" to start.
            </div>
          ) : (
            emailLog.map((email, idx) => (
              <motion.div
                key={email.email_id}
                className="p-4 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-brand-lavender-dark)] transition-all"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center">
                  <div className="md:col-span-2">
                    <p className="font-medium text-[var(--color-text-primary)] text-sm">{email.subject}</p>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1">To: {email.user_id} • {email.scenario.replace('_', ' ')}</p>
                  </div>
                  <div className="md:col-span-1">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getStatusColor(email.status)}`}>
                      {email.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="md:col-span-1">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${email.risk_score >= 0.6 ? 'bg-[rgba(224,122,95,0.12)] text-[var(--color-brand-coral)]' :
                        email.risk_score >= 0.3 ? 'bg-[rgba(212,168,83,0.12)] text-amber-600' :
                          'bg-[rgba(143,191,150,0.12)] text-[var(--color-brand-sage-deep)]'
                      }`}>
                      Risk: {(email.risk_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="md:col-span-1">
                    <span className="text-xs text-[var(--color-text-muted)]">{email.sent_via}</span>
                  </div>
                  <div className="md:col-span-1 text-right">
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {new Date(email.sent_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                {email.interactions && email.interactions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                    <div className="flex gap-2 flex-wrap">
                      {email.interactions.map((i, iIdx) => (
                        <span key={iIdx} className={`text-xs px-2 py-1 rounded ${i.interaction === 'click' ? 'bg-[rgba(224,122,95,0.12)] text-[var(--color-brand-coral)]' :
                            i.interaction === 'open' ? 'bg-[rgba(212,168,83,0.12)] text-amber-600' :
                              'bg-[rgba(143,191,150,0.12)] text-[var(--color-brand-sage-deep)]'
                          }`}>
                          {i.interaction} @ {new Date(i.timestamp).toLocaleTimeString()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      )}

      <motion.div
        className="p-4 rounded-lg bg-[rgba(155,130,204,0.10)] border border-[var(--color-border)]"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }} transition={{ delay: 0.5 }}
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          <span className="font-semibold text-[var(--color-text-primary)]">📊 Live Data:</span>{' '}
          {emailStats && emailStats.total_sent > 0
            ? `${emailStats.total_sent} emails sent. Click rate: ${(emailStats.click_rate * 100).toFixed(0)}%. ${emailStats.total_reported} reported correctly.`
            : users.length > 0
              ? `${stats.high} high-risk user(s) ready for phishing simulation. Click "Auto-Send" to begin.`
              : 'Awaiting pipeline execution to generate risk profiles.'}
        </p>
      </motion.div>
    </div>
  )
}

export default SimulationOutcomes
