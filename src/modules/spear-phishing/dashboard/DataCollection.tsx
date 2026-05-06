import React, { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    fetchCollectorStats,
    fetchEvents,
    triggerPipelineRun,
    type CollectorStats,
    type CollectorEvent,
    type PipelineRunResult,
} from '../api/client'

// ── Utility ──────────────────────────────────────────────────────

function timeAgo(isoString: string | null): string {
    if (!isoString) return 'Never'
    const diff = Date.now() - new Date(isoString).getTime()
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return `${Math.floor(diff / 86400000)}d ago`
}

function statusColor(status: string): string {
    if (status === 'completed') return '#22c55e'
    if (status === 'running') return '#eab308'
    if (status === 'failed') return '#ef4444'
    return '#6b7280'
}

// ── Metric Card ──────────────────────────────────────────────────

const MetricCard: React.FC<{
    label: string
    value: string | number
    icon: string
    accent?: string
}> = ({ label, value, icon, accent = '#00d9ff' }) => (
    <motion.div
        className="relative overflow-hidden"
        style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 14 }}
        whileHover={{ scale: 1.02, translateY: -2 }}
        transition={{ duration: 0.2 }}
    >
        <div className="p-5">
            <div className="text-2xl mb-2">{icon}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                {value}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 4 }}>{label}</div>
        </div>
        <div
            className="absolute bottom-0 left-0 right-0"
            style={{ height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }}
        />
    </motion.div>
)

// ── Event Type Badge ─────────────────────────────────────────────

const EventTypeBadge: React.FC<{ type: string; count: number }> = ({ type, count }) => {
    const colors: Record<string, string> = {
        page_view: '#3b82f6',
        click: '#22c55e',
        typing_cadence: '#eab308',
        navigation: '#8b5cf6',
        session_start: '#06b6d4',
        session_end: '#6b7280',
        focus_heartbeat: '#14b8a6',
        focus_lost: '#f97316',
        focus_gained: '#10b981',
        copy_event: '#ef4444',
        paste_event: '#f43f5e',
    }
    const color = colors[type] || '#6b7280'

    return (
        <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
        >
            <span>{type.replace(/_/g, ' ')}</span>
            <span
                className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                style={{ background: `${color}30` }}
            >
                {count}
            </span>
        </div>
    )
}

// ── Live Event Row ───────────────────────────────────────────────

const EventRow: React.FC<{ event: CollectorEvent; index: number }> = ({ event, index }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.03 }}
        className="flex items-center gap-4 transition-colors"
        style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)' }}
        onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.025)')}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
        <div className="w-2 h-2 rounded-full animate-pulse flex-shrink-0" style={{ background: 'var(--color-brand-blue)' }} />
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
                <span style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', color: 'var(--color-brand-blue)' }}>{event.event_type}</span>
                <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>{event.page_url || '-'}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                <span style={{ color: 'var(--color-text-secondary)' }}>{event.user_id}</span>
                <span className="mx-1">·</span>
                <span>{timeAgo(event.timestamp)}</span>
            </div>
        </div>
    </motion.div>
)

// ── Integration Snippet ──────────────────────────────────────────

const IntegrationSnippet: React.FC<{ show: boolean; onClose: () => void }> = ({ show, onClose }) => {
    const snippet = `<!-- Behavioral Data Collector -->
<script src="http://localhost:8000/api/collector/script.js"
        data-endpoint="http://localhost:8000/api/collect"
        data-user-id="EMPLOYEE_ID"
        data-api-key="YOUR_API_KEY">
</script>`

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                >
                    <div className="glass-card mt-4" style={{ padding: 20 }}>
                        <div className="flex items-center justify-between mb-3">
                            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>📋 Integration Snippet</h4>
                            <button
                                onClick={onClose}
                                style={{ fontSize: 12, color: 'var(--color-text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            >
                                Close
                            </button>
                        </div>
                        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 12, lineHeight: 1.6 }}>
                            Add this script tag to internal pages to start collecting behavioral data.
                            Replace <code style={{ color: 'var(--color-brand-blue)' }}>EMPLOYEE_ID</code> with the user's identifier
                            and <code style={{ color: 'var(--color-brand-blue)' }}>YOUR_API_KEY</code> with your configured key.
                        </p>
                        <pre
                            style={{ fontSize: 12, fontFamily: 'ui-monospace, monospace', padding: 16, borderRadius: 12, overflowX: 'auto', background: 'rgba(26,26,46,0.92)', color: '#a5f3fc' }}
                        >
                            {snippet}
                        </pre>
                        <button
                            onClick={() => navigator.clipboard.writeText(snippet)}
                            style={{ marginTop: 12, fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 100, background: 'rgba(184,161,230,0.14)', color: 'var(--color-brand-lavender-dark)', border: '1px solid rgba(184,161,230,0.3)', cursor: 'pointer' }}
                        >
                            📋 Copy to clipboard
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ── Main Component ───────────────────────────────────────────────

const DataCollection: React.FC = () => {
    const [stats, setStats] = useState<CollectorStats | null>(null)
    const [events, setEvents] = useState<CollectorEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [pipelineResult, setPipelineResult] = useState<PipelineRunResult | null>(null)
    const [runningPipeline, setRunningPipeline] = useState(false)
    const [showSnippet, setShowSnippet] = useState(false)
    const [showEvents, setShowEvents] = useState(false)
    const [autoRefresh, setAutoRefresh] = useState(true)

    const loadData = useCallback(async () => {
        const timeout = setTimeout(() => {
            setLoading(false)
        }, 5000)

        try {
            const [statsData, eventsData] = await Promise.all([
                fetchCollectorStats(),
                fetchEvents({ limit: 30 }),
            ])
            setStats(statsData)
            setEvents(eventsData.data)
            setLoading(false)
        } catch (err) {
            console.error('Data collection fetch error:', err)
            setLoading(false)
        } finally {
            clearTimeout(timeout)
        }
    }, [])

    useEffect(() => {
        loadData()
    }, [loadData])

    // Auto-refresh every 15 seconds
    useEffect(() => {
        if (!autoRefresh) return
        const interval = setInterval(loadData, 15000)
        return () => clearInterval(interval)
    }, [autoRefresh, loadData])

    const handlePipelineRun = async () => {
        setRunningPipeline(true)
        setPipelineResult(null)
        const result = await triggerPipelineRun()
        setPipelineResult(result)
        setRunningPipeline(false)
        // Refresh data after pipeline run
        loadData()
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
            </div>
        )
    }

    const hasData = (stats?.total_events ?? 0) > 0

    return (
        <div>
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22 }}>📡</span> Live Data Collection
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                        Real-time behavioral event ingestion for adaptive risk analysis
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAutoRefresh(!autoRefresh)}
                        style={{
                            fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 100,
                            background: autoRefresh ? 'rgba(143,191,150,0.14)' : 'rgba(0,0,0,0.04)',
                            border: `1px solid ${autoRefresh ? 'rgba(143,191,150,0.3)' : 'var(--color-border)'}`,
                            color: autoRefresh ? '#5b9a7c' : 'var(--color-text-muted)',
                            transition: 'all 0.2s ease', cursor: 'pointer',
                        }}
                    >
                        {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
                    </button>
                    <button
                        onClick={() => setShowSnippet(!showSnippet)}
                        style={{
                            fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 100,
                            background: 'rgba(184,161,230,0.14)',
                            border: '1px solid rgba(184,161,230,0.3)',
                            color: 'var(--color-brand-lavender-dark)',
                            transition: 'all 0.2s ease', cursor: 'pointer',
                        }}
                    >
                        {'</>'} Integration Guide
                    </button>
                </div>
            </div>

            {/* Integration snippet */}
            <IntegrationSnippet show={showSnippet} onClose={() => setShowSnippet(false)} />

            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <MetricCard
                    icon="📊"
                    label="Total Events"
                    value={stats?.total_events?.toLocaleString() ?? '0'}
                    accent="#00d9ff"
                />
                <MetricCard
                    icon="👥"
                    label="Unique Users"
                    value={stats?.unique_users ?? 0}
                    accent="#8b5cf6"
                />
                <MetricCard
                    icon="🔄"
                    label="Sessions"
                    value={stats?.unique_sessions ?? 0}
                    accent="#22c55e"
                />
                <MetricCard
                    icon="⏱"
                    label="Last Event"
                    value={timeAgo(stats?.last_event_at ?? null)}
                    accent={hasData ? '#22c55e' : '#6b7280'}
                />
            </div>

            {/* Event Type Breakdown */}
            {hasData && stats?.event_types && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card mt-6"
                    style={{ padding: 20 }}
                >
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 12 }}>Event Types</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(stats.event_types).map(([type, count]) => (
                            <EventTypeBadge key={type} type={type} count={count} />
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Pipeline Control */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="glass-card mt-6"
                style={{ padding: 20 }}
            >
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)' }}>🔬 Anomaly Detection Pipeline</h3>
                        <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 4 }}>
                            Process collected behavioral data through Isolation Forest to compute risk scores
                        </p>
                    </div>
                    <button
                        onClick={handlePipelineRun}
                        disabled={runningPipeline || !hasData}
                        className="btn-primary"
                        style={{
                            fontSize: 13, padding: '10px 20px',
                            opacity: (runningPipeline || !hasData) ? 0.55 : 1,
                            cursor: runningPipeline ? 'wait' : !hasData ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {runningPipeline ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin">⚙️</span> Running...
                            </span>
                        ) : (
                            '▶ Run Pipeline'
                        )}
                    </button>
                </div>

                {/* Pipeline result */}
                <AnimatePresence>
                    {pipelineResult && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 rounded-lg p-4 border"
                            style={{
                                background:
                                    pipelineResult.status === 'completed'
                                        ? 'rgba(34, 197, 94, 0.1)'
                                        : 'rgba(239, 68, 68, 0.1)',
                                borderColor:
                                    pipelineResult.status === 'completed'
                                        ? 'rgba(34, 197, 94, 0.2)'
                                        : 'rgba(239, 68, 68, 0.2)',
                            }}
                        >
                            <div style={{
                                fontSize: 13, fontWeight: 600,
                                color: pipelineResult.status === 'completed' ? '#5b9a7c' : '#a85555'
                            }}>
                                {pipelineResult.status === 'completed' ? '✅ Pipeline completed' : `❌ ${pipelineResult.message || 'Pipeline failed'}`}
                            </div>
                            {pipelineResult.status === 'completed' && (
                                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 8, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                    <div>Events processed: <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{pipelineResult.events_processed}</span></div>
                                    <div>Users analyzed: <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{pipelineResult.users_analyzed}</span></div>
                                    <div>High-risk users: <span style={{ color: '#a85555', fontWeight: 600 }}>{pipelineResult.high_risk_users}</span></div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Recent pipeline runs */}
                {stats?.recent_pipeline_runs && stats.recent_pipeline_runs.length > 0 && (
                    <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                        <h4 style={{ fontSize: 11, fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Recent Runs</h4>
                        <div className="space-y-2">
                            {stats.recent_pipeline_runs.slice(0, 3).map((run) => (
                                <div
                                    key={run.id}
                                    className="flex items-center justify-between"
                                    style={{ fontSize: 12, padding: '8px 12px', borderRadius: 10, background: 'rgba(0,0,0,0.025)' }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ background: statusColor(run.status) }}
                                        />
                                        <span style={{ color: 'var(--color-text-secondary)' }}>{run.status}</span>
                                    </div>
                                    <div style={{ color: 'var(--color-text-muted)' }}>
                                        {run.user_count} users · {run.event_count} events ·{' '}
                                        {timeAgo(run.started_at)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Live Event Feed */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="glass-card mt-6 overflow-hidden"
                style={{ padding: 0 }}
            >
                <button
                    onClick={() => setShowEvents(!showEvents)}
                    className="w-full flex items-center justify-between transition-colors"
                    style={{ padding: 20, background: 'transparent', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0,0,0,0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <span>📋</span> Live Event Feed
                        <span style={{ fontSize: 12, fontWeight: 400, color: 'var(--color-text-muted)' }}>
                            ({events.length} recent events)
                        </span>
                    </h3>
                    <motion.span
                        animate={{ rotate: showEvents ? 180 : 0 }}
                        style={{ color: 'var(--color-text-muted)' }}
                    >
                        ▼
                    </motion.span>
                </button>

                <AnimatePresence>
                    {showEvents && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                        >
                            <div style={{ borderTop: '1px solid var(--color-border)', maxHeight: 400, overflowY: 'auto' }}>
                                {events.length > 0 ? (
                                    events.map((evt, i) => <EventRow key={evt.id} event={evt} index={i} />)
                                ) : (
                                    <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-muted)', fontSize: 13 }}>
                                        <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
                                        No events collected yet. Embed the collector script to start gathering data.
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Empty state guide */}
            {!hasData && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card mt-6"
                    style={{ padding: 24, textAlign: 'center' }}
                >
                    <div style={{ fontSize: 28, marginBottom: 12 }}>🚀</div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8 }}>Get Started with Data Collection</h3>
                    <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', maxWidth: 480, margin: '0 auto 16px', lineHeight: 1.6 }}>
                        Embed the lightweight collector script in your internal pages to start tracking
                        behavioral patterns. No PII is captured, only navigation patterns, click behavior,
                        and session timings.
                    </p>
                    <button
                        onClick={() => setShowSnippet(true)}
                        className="btn-primary"
                        style={{ fontSize: 13, padding: '10px 20px' }}
                    >
                        View Integration Guide
                    </button>
                </motion.div>
            )}
        </div>
    )
}

export default DataCollection
