import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { type Campaign, fetchCampaigns, createCampaign, fetchEmailScenarios } from '../api/client'

const CampaignManager: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [scenarios, setScenarios] = useState<string[]>([])

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        target_tier: 'High',
        scenario: 'credential_harvest',
        scheduled_for: ''
    })
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        if (!showCreateModal) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setShowCreateModal(false)
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [showCreateModal])

    const loadData = async () => {
        const timeout = setTimeout(() => {
            setLoading(false)
        }, 5000)

        try {
            setLoading(true)
            const [campaignList, scenarioData] = await Promise.all([
                fetchCampaigns(),
                fetchEmailScenarios()
            ])
            setCampaigns(campaignList)
            if (scenarioData) {
                // Flatten scenarios object values into a single array
                const allScenarios = Object.values(scenarioData).flat()
                setScenarios(allScenarios)
            }
            setLoading(false)
        } catch (err) {
            console.error('Campaign data fetch error:', err)
            setLoading(false)
        } finally {
            clearTimeout(timeout)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        const res = await createCampaign(formData)
        if (res.status === 'created') {
            setShowCreateModal(false)
            setFormData({ name: '', target_tier: 'High', scenario: 'credential_harvest', scheduled_for: '' })
            loadData()
        }
        setSubmitting(false)
    }

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-4 focus:ring-[rgba(155,130,204,0.15)] focus:border-[var(--color-brand-lavender-dark)] transition"

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-[var(--color-text-primary)]">Phishing Campaigns</h2>
                    <p className="text-[var(--color-text-secondary)]">Automated and manual simulation management</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="btn-primary flex items-center"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    New Campaign
                </button>
            </div>

            <div className="bg-[var(--color-bg-card)] rounded-xl border border-[var(--color-border)] overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[rgba(0,0,0,0.04)] border-b border-[var(--color-border)]">
                        <tr>
                            <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Campaign Name</th>
                            <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Target</th>
                            <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Scenario</th>
                            <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-6 py-4 h-16 bg-[rgba(0,0,0,0.04)]"></td>
                                </tr>
                            ))
                        ) : campaigns.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-[var(--color-text-muted)] italic">
                                    No active campaigns found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            campaigns.map((c) => (
                                <tr key={c.id} className="hover:bg-[rgba(0,0,0,0.04)] transition-colors">
                                    <td className="px-6 py-4 font-medium text-[var(--color-text-primary)]">{c.name}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold border ${c.target_tier === 'High' ? 'bg-[rgba(224,122,95,0.10)] text-[var(--color-brand-coral)] border-[var(--color-border)]' :
                                            c.target_tier === 'Medium' ? 'bg-[rgba(212,168,83,0.10)] text-amber-600 border-[var(--color-border)]' :
                                                'bg-[rgba(143,191,150,0.12)] text-[var(--color-brand-sage-deep)] border-[var(--color-border)]'
                                            }`}>
                                            {c.target_tier} Risk
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-[var(--color-text-secondary)] capitalize">{c.scenario.replace(/_/g, ' ')}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className={`w-2 h-2 rounded-full mr-2 ${c.status === 'active' ? 'bg-[var(--color-brand-sage)] animate-pulse' : 'bg-[var(--color-text-muted)]'}`} />
                                            <span className="text-[var(--color-text-secondary)] capitalize">{c.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--color-text-muted)]">
                                        {new Date(c.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Automation Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[var(--color-bg-card)] p-6 rounded-xl border border-[var(--color-border)]">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-[var(--color-brand-lavender-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        Autonomous Phishing Pipeline
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">The system automatically targets high-risk users based on their behavioral baseline deviations. No manual campaign needed for critical coverage.</p>
                    <div className="bg-[var(--color-bg-cream-light)] p-4 rounded-lg border border-[var(--color-border)]">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-[var(--color-text-muted)] uppercase font-semibold">Risk Threshold</span>
                            <span className="text-[var(--color-brand-lavender-dark)] font-mono">0.60</span>
                        </div>
                        <div className="w-full bg-[rgba(0,0,0,0.06)] h-1.5 rounded-full overflow-hidden">
                            <div className="bg-[var(--color-brand-lavender-dark)] h-full w-[60%]" />
                        </div>
                    </div>
                </div>

                <div className="bg-[var(--color-bg-card)] p-6 rounded-xl border border-[var(--color-border)]">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-2 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-[var(--color-brand-sage)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        Automatic Retraining
                    </h3>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4">Simulation click detection is wired directly into the micro-training enforcement engine. Compliance is tracked per campaign.</p>
                    <div className="flex gap-4">
                        <div className="text-center">
                            <div className="text-lg font-bold text-[var(--color-text-primary)]">100%</div>
                            <div className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">Enforcement</div>
                        </div>
                        <div className="text-center border-l border-[var(--color-border)] pl-4">
                            <div className="text-lg font-bold text-[var(--color-text-primary)]">Auto</div>
                            <div className="text-[10px] text-[var(--color-text-muted)] uppercase font-semibold">Correction</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(40,32,60,0.32)] backdrop-blur-md"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="campaign-modal-title"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl max-w-lg w-full p-8 shadow-2xl"
                        >
                            <h3 id="campaign-modal-title" className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">New Phishing Campaign</h3>
                            <p className="text-[var(--color-text-secondary)] text-sm mb-6">Define a targeted simulation group and attack vector.</p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="campaign-name" className="block text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-1">Campaign Name</label>
                                    <input
                                        id="campaign-name"
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Q1 Security Awareness Test"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="campaign-tier" className="block text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-1">Target Tier</label>
                                        <select
                                            id="campaign-tier"
                                            value={formData.target_tier}
                                            onChange={e => setFormData({ ...formData, target_tier: e.target.value })}
                                            className={inputClass}
                                        >
                                            <option>High</option>
                                            <option>Medium</option>
                                            <option>Low</option>
                                            <option value="All">All Employees</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="campaign-scenario" className="block text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-1">Attack Scenario</label>
                                        <select
                                            id="campaign-scenario"
                                            value={formData.scenario}
                                            onChange={e => setFormData({ ...formData, scenario: e.target.value })}
                                            className={inputClass}
                                        >
                                            {scenarios.map(s => (
                                                <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="campaign-schedule" className="block text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-1">Schedule (Optional)</label>
                                    <input
                                        id="campaign-schedule"
                                        type="datetime-local"
                                        value={formData.scheduled_for}
                                        onChange={e => setFormData({ ...formData, scheduled_for: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="flex gap-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="btn-ghost flex-1"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="btn-primary flex-1 disabled:opacity-50"
                                    >
                                        {submitting ? 'Creating...' : 'Start Campaign'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default CampaignManager
