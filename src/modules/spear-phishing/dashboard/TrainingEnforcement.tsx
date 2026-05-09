import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fetchDashboardData, completeTraining, triggerTraining, type TrainingEntry, type TrainingStats } from '../api/client'

const TrainingEnforcement: React.FC = () => {
  const [trainingData, setTrainingData] = useState<TrainingEntry[]>([])
  const [trainingStats, setTrainingStats] = useState<TrainingStats | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const loadData = () => {
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000)

    fetchDashboardData()
      .then(data => {
        if (data) {
          setTrainingData(data.training)
          setTrainingStats(data.training_stats || null)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Training data fetch error:', err)
        setLoading(false)
      })
      .finally(() => {
        clearTimeout(timeout)
      })
  }

  useEffect(() => { loadData() }, [])

  const handleCompleteTraining = async (userId: string) => {
    setActionLoading(userId)
    const result = await completeTraining(userId)
    if (result?.status === 'completed') {
      setMessage({ text: `Training completed for ${userId}`, type: 'success' })
      loadData()
    } else {
      setMessage({ text: 'Failed to complete training', type: 'error' })
    }
    setActionLoading(null)
  }

  const handleTriggerTraining = async (userId: string) => {
    setActionLoading(userId)
    const result = await triggerTraining(userId)
    if (result?.status === 'training_assigned') {
      setMessage({ text: `Training assigned to ${userId}`, type: 'success' })
      loadData()
    } else {
      setMessage({ text: 'Failed to assign training', type: 'error' })
    }
    setActionLoading(null)
  }

  const stats = {
    totalPending: trainingData.filter(u => u.is_pending || u.has_pending_training).length,
    microAssigned: trainingData.filter(u => u.training_action === 'MICRO').length,
    mandatoryAssigned: trainingData.filter(u => u.training_action === 'MANDATORY').length,
    totalCompleted: trainingStats?.completed ?? 0,
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'MANDATORY': return 'text-[var(--color-brand-coral)] bg-[rgba(224,122,95,0.12)] border-[var(--color-border)]'
      case 'MICRO': return 'text-amber-600 bg-[rgba(212,168,83,0.12)] border-[var(--color-border)]'
      default: return 'text-[var(--color-brand-sage-deep)] bg-[rgba(143,191,150,0.12)] border-[var(--color-border)]'
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'MANDATORY': return 'Mandatory Training'
      case 'MICRO': return 'Micro-Training'
      default: return 'No Training Needed'
    }
  }

  return (
    <div className="space-y-8">
      <motion.div className="space-y-2" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: false }} transition={{ duration: 0.5 }}>
        <h2 className="text-4xl font-bold text-[var(--color-text-primary)]">
          Training Enforcement
        </h2>
        <p className="text-[var(--color-text-secondary)] text-lg">Automated training assignments based on risk scores and phishing outcomes</p>
      </motion.div>

      {message && (
        <div className={`px-4 py-2 rounded-lg text-sm font-medium border ${message.type === 'success' ? 'bg-[rgba(143,191,150,0.12)] text-[var(--color-brand-sage-deep)] border-[var(--color-border)]'
            : 'bg-[rgba(224,122,95,0.12)] text-[var(--color-brand-coral)] border-[var(--color-border)]'
          }`}>
          {message.text}
        </div>
      )}

      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {[
          { label: 'Total Pending', value: loading ? '...' : stats.totalPending, icon: '⚠️', color: 'text-amber-600' },
          { label: 'Micro-Training', value: loading ? '...' : stats.microAssigned, icon: '📝', color: 'text-[var(--color-brand-lavender-dark)]' },
          { label: 'Mandatory', value: loading ? '...' : stats.mandatoryAssigned, icon: '🔴', color: 'text-[var(--color-brand-coral)]' },
          { label: 'Completed', value: loading ? '...' : stats.totalCompleted, icon: '✅', color: 'text-[var(--color-brand-sage-deep)]' },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="p-4 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)] hover:border-[var(--color-brand-lavender-dark)] transition-colors"
            whileHover={{ translateY: -4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide">{stat.label}</p>
                <p className={`text-2xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="text-3xl opacity-60">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Training Completion Rate Bar */}
      {trainingStats && trainingStats.total_sessions > 0 && (
        <motion.div
          className="p-4 rounded-lg bg-[var(--color-bg-card)] border border-[var(--color-border)]"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }}
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[var(--color-text-secondary)] font-medium">Training Completion Rate</span>
            <span className="text-sm font-bold text-[var(--color-brand-lavender-dark)]">{(trainingStats.completion_rate * 100).toFixed(0)}%</span>
          </div>
          <div className="h-3 rounded-full bg-[rgba(0,0,0,0.04)] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(to right, #B8A1E6, #9B82CC)' }}
              initial={{ width: 0 }}
              animate={{ width: `${trainingStats.completion_rate * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-[var(--color-text-muted)]">{trainingStats.completed} completed</span>
            <span className="text-xs text-[var(--color-text-muted)]">{trainingStats.pending} pending</span>
          </div>
        </motion.div>
      )}

      <motion.div className="space-y-3">
        {loading ? (
          <div className="text-center text-[var(--color-text-muted)] py-8">Loading training data...</div>
        ) : trainingData.length === 0 ? (
          <div className="text-center text-[var(--color-text-muted)] py-8">
            <div className="text-3xl mb-2">📭</div>
            No training data available. Run the pipeline to generate training assignments.
          </div>
        ) : (
          trainingData.map((user, idx) => {
            const isExpanded = expandedId === user.user_id
            return (
              <motion.div
                key={user.user_id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }} transition={{ delay: idx * 0.08, duration: 0.4 }}
              >
                <motion.div
                  className={`p-4 rounded-lg border transition-all backdrop-blur-sm group cursor-pointer ${isExpanded
                    ? 'bg-[rgba(155,130,204,0.10)] border-[var(--color-brand-lavender-dark)]'
                    : 'bg-[var(--color-bg-card)] border-[var(--color-border)] hover:border-[var(--color-brand-lavender-dark)]'
                    }`}
                  onClick={() => setExpandedId(isExpanded ? null : user.user_id)}
                  whileHover={{ translateX: 4 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <motion.div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: 'linear-gradient(to bottom right, #B8A1E6, #9B82CC)' }}
                        animate={{ scale: isExpanded ? 1.1 : 1 }}
                      >
                        {user.user_id.substring(0, 2).toUpperCase()}
                      </motion.div>
                      <div>
                        <p className="font-semibold text-[var(--color-text-primary)]">{user.user_id}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {getActionLabel(user.training_action)}
                          {user.completed_sessions !== undefined && ` • ${user.completed_sessions} completed`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getActionColor(user.training_action)}`}>
                        {user.training_action}
                      </span>

                      {(user.is_pending || user.has_pending_training) && (
                        <motion.div
                          className="px-3 py-1 rounded-lg bg-[rgba(212,168,83,0.15)] border border-[var(--color-border)] text-amber-600 text-xs font-semibold"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          Pending
                        </motion.div>
                      )}

                      {/* Action buttons */}
                      {user.has_pending_training && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleCompleteTraining(user.user_id) }}
                          disabled={actionLoading === user.user_id}
                          className="px-3 py-1 rounded-lg bg-[var(--color-brand-sage)] hover:bg-[var(--color-brand-sage-deep)] text-white text-xs font-medium transition-all disabled:opacity-50"
                        >
                          {actionLoading === user.user_id ? '⏳' : '✅ Complete'}
                        </button>
                      )}
                      {!user.has_pending_training && user.training_action !== 'NONE' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleTriggerTraining(user.user_id) }}
                          disabled={actionLoading === user.user_id}
                          className="px-3 py-1 rounded-lg bg-[var(--color-brand-lavender-dark)] hover:bg-[var(--color-brand-lavender)] text-white text-xs font-medium transition-all disabled:opacity-50"
                        >
                          {actionLoading === user.user_id ? '⏳' : '📝 Assign'}
                        </button>
                      )}

                      <motion.svg
                        width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-lavender-dark)] transition-colors"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                      >
                        <path d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, maxHeight: 0 }}
                    animate={{ opacity: isExpanded ? 1 : 0, maxHeight: isExpanded ? 300 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-[var(--color-border)] space-y-3">
                      {/* Training sessions */}
                      {user.sessions && user.sessions.length > 0 ? (
                        <div className="space-y-2">
                          <p className="text-sm text-[var(--color-text-secondary)] font-medium">Training Sessions:</p>
                          {user.sessions.map((s: any, sIdx: number) => (
                            <div key={sIdx} className="flex items-center justify-between p-2 rounded bg-[rgba(0,0,0,0.04)]">
                              <div>
                                <span className="text-xs text-[var(--color-text-secondary)]">{s.training_type} training</span>
                                {s.trigger_email_id && (
                                  <span className="text-xs text-[var(--color-text-muted)] ml-2">triggered by email</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded ${s.status === 'completed' ? 'bg-[rgba(143,191,150,0.15)] text-[var(--color-brand-sage-deep)]' :
                                    s.status === 'in_progress' ? 'bg-[rgba(155,130,204,0.10)] text-[var(--color-brand-lavender-dark)]' :
                                      'bg-[rgba(212,168,83,0.12)] text-amber-600'
                                  }`}>
                                  {s.status}
                                </span>
                                <span className="text-xs text-[var(--color-text-muted)]">
                                  {new Date(s.assigned_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-[var(--color-text-muted)]">
                          {user.is_pending || user.has_pending_training
                            ? 'Training assigned, awaiting completion'
                            : user.training_action === 'NONE'
                              ? 'No training required at this time'
                              : 'Training recommended based on risk level'}
                        </p>
                      )}

                      {/* Summary */}
                      {user.completed_sessions !== undefined && user.completed_sessions > 0 && (
                        <p className="text-xs text-[var(--color-brand-sage-deep)]">
                          ✅ {user.completed_sessions} training session(s) completed
                        </p>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>
            )
          })
        )}
      </motion.div>

      <motion.div
        className="p-4 rounded-lg bg-[rgba(155,130,204,0.10)] border border-[var(--color-border)]"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: false }}
        transition={{ delay: 0.5 }}
      >
        <div className="space-y-2">
          <p className="text-sm font-semibold text-[var(--color-brand-lavender-dark)]">💡 Training Logic:</p>
          <ul className="text-sm text-[var(--color-text-secondary)] space-y-1 ml-4">
            <li>• Users who <strong className="text-[var(--color-brand-coral)]">click phishing links</strong> automatically get micro-training assigned</li>
            <li>• No new phishing emails are sent until pending training is completed</li>
            {stats.mandatoryAssigned > 0 && (
              <li>• {stats.mandatoryAssigned} user(s) require mandatory security training (risk ≥ 0.6)</li>
            )}
            {stats.totalCompleted > 0 && (
              <li>• {stats.totalCompleted} training session(s) have been completed so far</li>
            )}
          </ul>
        </div>
      </motion.div>
    </div>
  )
}

export default TrainingEnforcement
