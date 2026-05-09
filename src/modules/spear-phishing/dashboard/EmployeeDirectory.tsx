import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchEmployees, sendEmployeeSimulation, sendWarningEmail, addEmployee, updateEmployee, type DashboardUser } from '../api/client'
import LoginBehaviorChart from './LoginBehaviorChart'
import RiskTimeline from './RiskTimeline'

const EmployeeDirectory: React.FC = () => {
    const [employees, setEmployees] = useState<DashboardUser[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEmployee, setSelectedEmployee] = useState<DashboardUser | null>(null)
    const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    // Simulation Modal State
    const [showSimModal, setShowSimModal] = useState(false)
    const [scenario, setScenario] = useState('credential_harvest')
    const [simLoading, setSimLoading] = useState(false)

    // Manage Employee Modals
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    const [editForm, setEditForm] = useState<Partial<DashboardUser>>({})

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value })
    }

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setActionLoading(true)
        try {
            const res = await addEmployee(editForm as any)
            if (res.error) {
                setStatusMessage({ type: 'error', text: res.error })
            } else {
                setStatusMessage({ type: 'success', text: 'Employee added successfully' })
                setShowAddModal(false)
                setEditForm({})
                loadEmployees()
            }
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'Failed to add employee' })
        } finally {
            setActionLoading(false)
        }
    }

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedEmployee) return
        setActionLoading(true)
        try {
            const res = await updateEmployee({ ...editForm, user_id: selectedEmployee.user_id })
            if (res.error) {
                setStatusMessage({ type: 'error', text: res.error })
            } else {
                setStatusMessage({ type: 'success', text: 'Employee updated successfully' })
                setShowEditModal(false)
                loadEmployees()
            }
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'Failed to update employee' })
        } finally {
            setActionLoading(false)
        }
    }

    const handleDisable = async () => {
        if (!selectedEmployee) return
        if (!window.confirm(`Are you sure you want to disable ${selectedEmployee.name}?`)) return
        setActionLoading(true)
        try {
            const res = await updateEmployee({ user_id: selectedEmployee.user_id, is_active: 0 })
            if (res.error) {
                setStatusMessage({ type: 'error', text: res.error })
            } else {
                setStatusMessage({ type: 'success', text: 'Employee disabled' })
                loadEmployees()
            }
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'Failed to disable employee' })
        } finally {
            setActionLoading(false)
        }
    }

    // CSV Import
    const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = async (evt) => {
            const lines = (evt.target?.result as string).split('\n')
            if (lines.length < 2) return
            const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
            let added = 0
            for (let i = 1; i < lines.length; i++) {
                if (!lines[i].trim()) continue
                const vals = lines[i].split(',')
                const data: any = {}
                headers.forEach((h, idx) => { data[h] = vals[idx]?.trim() })
                if (data.name && data.email) {
                    await addEmployee(data)
                    added++
                }
            }
            setStatusMessage({ type: 'success', text: `Imported ${added} employees from CSV` })
            loadEmployees()
        }
        reader.readAsText(file)
    }

    useEffect(() => {
        loadEmployees()
    }, [])

    // Escape closes modals
    useEffect(() => {
        const anyOpen = showSimModal || showAddModal || showEditModal
        if (!anyOpen) return
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showSimModal) setShowSimModal(false)
                if (showAddModal) setShowAddModal(false)
                if (showEditModal) setShowEditModal(false)
            }
        }
        document.addEventListener('keydown', handler)
        return () => document.removeEventListener('keydown', handler)
    }, [showSimModal, showAddModal, showEditModal])

    const loadEmployees = async () => {
        setLoading(true)
        const data = await fetchEmployees()
        setEmployees(data)
        setLoading(false)
    }

    const handleSendSimulation = async () => {
        if (!selectedEmployee) return

        setSimLoading(true)
        setStatusMessage(null)

        try {
            const result = await sendEmployeeSimulation(selectedEmployee.user_id, scenario)
            if (result && result.sent) {
                setStatusMessage({ type: 'success', text: `Phishing simulation sent to ${selectedEmployee.email}` })
                setShowSimModal(false)
            } else {
                setStatusMessage({ type: 'error', text: result?.error || 'Failed to send simulation' })
            }
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'An unexpected error occurred' })
        } finally {
            setSimLoading(false)
        }
    }

    const handleSendWarning = async (e: React.MouseEvent, emp: DashboardUser) => {
        e.stopPropagation()
        if (!window.confirm(`Send an automated security warning email to ${emp.name}?`)) return

        try {
            const res = await sendWarningEmail(emp.user_id, 'Admin triggered review')
            if (res && res.status === 'sent') {
                setStatusMessage({ type: 'success', text: `Warning email sent to ${emp.email}` })
            } else {
                setStatusMessage({ type: 'error', text: res?.error || 'Failed to send warning' })
            }
        } catch (err) {
            setStatusMessage({ type: 'error', text: 'Error sending warning' })
        }
    }

    const filteredEmployees = employees.filter(emp =>
        (emp.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.employee_id || '').toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getRiskColor = (tier?: string) => {
        switch (tier) {
            case 'High': return 'text-[var(--color-brand-coral)] bg-[rgba(224,122,95,0.10)] border-[var(--color-border)]'
            case 'Medium': return 'text-amber-600 bg-[rgba(212,168,83,0.10)] border-[var(--color-border)]'
            case 'Low': return 'text-[var(--color-brand-sage-deep)] bg-[rgba(143,191,150,0.12)] border-[var(--color-border)]'
            default: return 'text-[var(--color-text-muted)] bg-[rgba(0,0,0,0.04)] border-[var(--color-border)]'
        }
    }

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-4 focus:ring-[rgba(155,130,204,0.15)] focus:border-[var(--color-brand-lavender-dark)] transition"

    return (
        <div className="card glass relative overflow-hidden bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-2xl p-6">
            {/* Background glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[rgba(155,130,204,0.08)] rounded-full blur-3xl -z-10" />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight flex items-center">
                        <svg className="w-6 h-6 mr-2 text-[var(--color-brand-lavender-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Employee Directory
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mt-1">Manage personnel, review individual telemetry, and target simulations.</p>
                </div>

                <div className="mt-4 sm:mt-0 relative w-full sm:w-64">
                    <label htmlFor="emp-search" className="sr-only">Search employees</label>
                    <input
                        id="emp-search"
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-[var(--color-border)] rounded-lg py-2 pl-10 pr-4 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-4 focus:ring-[rgba(155,130,204,0.15)] focus:border-[var(--color-brand-lavender-dark)] transition"
                    />
                    <svg className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="flex gap-2">
                    <button onClick={() => { setEditForm({}); setShowAddModal(true) }} className="btn-primary text-sm flex items-center">
                        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Add Employee
                    </button>
                    <label className="btn-ghost text-sm flex items-center cursor-pointer">
                        <svg className="w-4 h-4 mr-1.5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        Import CSV
                        <input type="file" accept=".csv" className="hidden" onChange={handleCsvUpload} />
                    </label>
                </div>
            </div>

            {statusMessage && (
                <div className={`mb-6 p-3 rounded-lg border text-sm flex items-center justify-between ${statusMessage.type === 'success'
                    ? 'bg-[rgba(143,191,150,0.12)] border-[var(--color-border)] text-[var(--color-brand-sage-deep)]'
                    : 'bg-[rgba(224,122,95,0.10)] border-[var(--color-border)] text-[var(--color-brand-coral)]'
                    }`}>
                    <span>{statusMessage.text}</span>
                    <button onClick={() => setStatusMessage(null)} aria-label="Dismiss" className="opacity-70 hover:opacity-100">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
            )}

            {loading ? (
                <div className="py-20 text-center text-[var(--color-text-muted)] animate-pulse">Loading directory data...</div>
            ) : employees.length === 0 ? (
                <div className="py-16 text-center border-2 border-[var(--color-border)] border-dashed rounded-xl">
                    <svg className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <h3 className="text-lg font-medium text-[var(--color-text-secondary)]">No employees registered</h3>
                    <p className="text-[var(--color-text-muted)] text-sm mt-1">Users will appear here once they install the browser extension.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Employee List */}
                    <div className="lg:col-span-1 border border-[var(--color-border)] rounded-xl overflow-hidden flex flex-col h-[600px] bg-[var(--color-bg-cream-light)]">
                        <div className="p-3 border-b border-[var(--color-border)] bg-[rgba(0,0,0,0.04)] font-medium text-xs text-[var(--color-text-muted)] uppercase tracking-wider flex justify-between">
                            <span>Directory ({filteredEmployees.length})</span>
                        </div>

                        <div className="overflow-y-auto flex-1 p-2 space-y-1">
                            {filteredEmployees.map(emp => (
                                <div
                                    key={emp.user_id}
                                    onClick={() => setSelectedEmployee(emp)}
                                    className={`
                    p-3 rounded-lg cursor-pointer transition-all duration-200 border
                    ${selectedEmployee?.user_id === emp.user_id
                                            ? 'bg-[rgba(155,130,204,0.10)] border-[var(--color-brand-lavender-dark)]'
                                            : 'bg-transparent border-transparent hover:bg-black/5 hover:border-[var(--color-border)]'
                                        }
                  `}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-medium text-[var(--color-text-primary)] text-sm">{emp.name || 'Unknown'}</h4>
                                            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{emp.email || 'N/A'}</p>
                                        </div>
                                        {emp.metrics?.anomaly_score > 0.8 && (
                                            <span className="flex h-2 w-2 relative" title="Elevated Anomaly Score">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-brand-coral)] opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-brand-coral)]"></span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="mt-3 flex items-center justify-between">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getRiskColor(emp.tier)}`}>
                                            {emp.tier || 'Pending'} Risk
                                        </span>
                                        <span className="text-[10px] text-[var(--color-text-muted)]">ID: {emp.employee_id || emp.user_id.substring(0, 8)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Employee Detail & Telemetry */}
                    <div className="lg:col-span-2 border border-[var(--color-border)] rounded-xl h-[600px] bg-[var(--color-bg-cream-light)] overflow-y-auto p-6 relative">
                        <AnimatePresence mode="wait">
                            {!selectedEmployee ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="h-full flex flex-col items-center justify-center text-[var(--color-text-muted)]"
                                >
                                    <svg className="w-16 h-16 text-[var(--color-text-muted)] mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                                    </svg>
                                    <p>Select an employee to view detailed behavioral telemetry</p>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="detail"
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.2 }}
                                    className="space-y-6"
                                >
                                    {/* Header Profile */}
                                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[var(--color-border)] pb-6">
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-full bg-[rgba(155,130,204,0.12)] flex items-center justify-center text-xl font-bold text-[var(--color-brand-lavender-dark)] border border-[var(--color-border)]">
                                                    {(selectedEmployee.name || '?').charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">{selectedEmployee.name || 'Unknown'}</h3>
                                                    <p className="text-sm text-[var(--color-text-secondary)]">{selectedEmployee.email || 'N/A'} • ID: {selectedEmployee.employee_id || 'N/A'}</p>
                                                    <div className="flex gap-2 mt-1">
                                                        {(selectedEmployee as any).department && <span className="text-xs bg-[rgba(0,0,0,0.04)] text-[var(--color-text-secondary)] px-2 py-0.5 rounded border border-[var(--color-border)]">{(selectedEmployee as any).department}</span>}
                                                        {((selectedEmployee as any).is_active === 0) && <span className="text-xs bg-[rgba(224,122,95,0.10)] text-[var(--color-brand-coral)] px-2 py-0.5 rounded border border-[var(--color-border)]">Disabled</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 w-full md:w-auto">
                                            <button
                                                onClick={() => handleDisable()}
                                                className="flex-1 md:flex-none btn-ghost text-xs py-2 px-3 flex items-center justify-center hover:text-[var(--color-brand-coral)]"
                                            >
                                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                                                Disable
                                            </button>
                                            <button
                                                onClick={() => { setEditForm({ name: selectedEmployee.name, email: selectedEmployee.email, department: (selectedEmployee as any).department, employee_id: selectedEmployee.employee_id }); setShowEditModal(true) }}
                                                className="flex-1 md:flex-none btn-ghost text-xs py-2 px-3 flex items-center justify-center"
                                            >
                                                <svg className="w-4 h-4 mr-1.5 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Edit
                                            </button>
                                            <button
                                                onClick={(e) => handleSendWarning(e, selectedEmployee)}
                                                className="flex-1 md:flex-none btn-ghost text-xs py-2 px-3 flex items-center justify-center hover:text-amber-600"
                                            >
                                                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                Warn
                                            </button>
                                            <button
                                                onClick={() => setShowSimModal(true)}
                                                className="flex-1 md:flex-none btn-primary text-xs py-2 px-4"
                                            >
                                                <svg className="w-4 h-4 inline-block mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                Target Simulation
                                            </button>
                                        </div>
                                    </div>

                                    {/* Top Stats Row */}
                                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                                        <div className="bg-[var(--color-bg-card)] p-4 rounded-xl border border-[var(--color-border)] text-center">
                                            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Risk Score</div>
                                            <div className={`text-2xl font-bold ${getRiskColor(selectedEmployee.tier).split(' ')[0]}`}>
                                                {(selectedEmployee.risk_score || 0).toFixed(2)}
                                            </div>
                                        </div>

                                        <div className="bg-[var(--color-bg-card)] p-4 rounded-xl border border-[var(--color-border)] text-center">
                                            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Anomaly</div>
                                            <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                                                {((selectedEmployee.metrics?.anomaly_score || 0) * 100).toFixed(0)}%
                                            </div>
                                        </div>

                                        <div className="bg-[var(--color-bg-card)] p-4 rounded-xl border border-[var(--color-border)] text-center">
                                            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Failed Logins</div>
                                            <div className="text-2xl font-bold text-[var(--color-text-primary)]">
                                                {((selectedEmployee.metrics?.failed_login_ratio || 0) * 100).toFixed(0)}%
                                            </div>
                                        </div>

                                        <div className="bg-[rgba(224,122,95,0.08)] p-4 rounded-xl border border-[var(--color-border)] text-center">
                                            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Tab Bursts</div>
                                            <div className="text-2xl font-bold text-[var(--color-brand-coral)]">
                                                {selectedEmployee.metrics?.tab_burst_count || 0}
                                            </div>
                                        </div>

                                        <div className="bg-[rgba(212,168,83,0.10)] p-4 rounded-xl border border-[var(--color-border)] text-center">
                                            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Off-Hours Logins</div>
                                            <div className="text-2xl font-bold text-amber-600">
                                                {selectedEmployee.metrics?.unusual_hours_login || 0}
                                            </div>
                                        </div>

                                        <div className="bg-[var(--color-bg-card)] p-4 rounded-xl border border-[var(--color-border)] text-center">
                                            <div className="text-xs text-[var(--color-text-muted)] uppercase tracking-widest mb-1">Device ID</div>
                                            <div className="text-sm font-mono text-[var(--color-text-secondary)] mt-2 truncate" title={selectedEmployee.device_id}>
                                                {selectedEmployee.device_id || 'Unknown'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Charts Row */}
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                        <div className="bg-[var(--color-bg-card)] p-4 rounded-xl border border-[var(--color-border)]">
                                            <RiskTimeline userId={selectedEmployee.user_id} />
                                        </div>
                                        <div className="bg-[var(--color-bg-card)] p-4 rounded-xl border border-[var(--color-border)]">
                                            <LoginBehaviorChart userId={selectedEmployee.user_id} />
                                        </div>
                                    </div>

                                    {/* ML Insights */}
                                    {selectedEmployee.metrics?.risk_reason && (
                                        <div className="bg-[rgba(155,130,204,0.10)] border border-[var(--color-border)] rounded-xl p-4 mt-6">
                                            <h4 className="text-sm font-semibold text-[var(--color-brand-lavender-dark)] mb-2 flex items-center">
                                                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                Isolation Forest Assessment
                                            </h4>
                                            <p className="text-sm text-[var(--color-text-secondary)]">{selectedEmployee.metrics.risk_reason}</p>
                                        </div>
                                    )}

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Target Simulation Modal */}
            <AnimatePresence>
                {showSimModal && selectedEmployee && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(40,32,60,0.32)] backdrop-blur-md"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="sim-modal-title"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl max-w-md w-full p-6 shadow-2xl"
                        >
                            <h3 id="sim-modal-title" className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Target Simulation</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] mb-6">Dispatch a highly personalized spear-phishing test to <strong className="text-[var(--color-text-primary)]">{selectedEmployee.email || selectedEmployee.user_id}</strong> based on their telemetry profile.</p>

                            <div className="space-y-4 mb-8">
                                <div>
                                    <label htmlFor="sim-scenario" className="block text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-2">Attack Vector / Scenario</label>
                                    <select
                                        id="sim-scenario"
                                        value={scenario}
                                        onChange={e => setScenario(e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="credential_harvest">Credential Harvest (O365/Workspace)</option>
                                        <option value="malware_delivery">Malware Delivery (Invoice PDF)</option>
                                        <option value="urgent_action">Urgent Action (Wire Transfer/Payroll)</option>
                                        <option value="custom">Dynamic (AI selected based on behavior)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5">
                                <button
                                    onClick={() => setShowSimModal(false)}
                                    disabled={simLoading}
                                    className="btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSendSimulation}
                                    disabled={simLoading}
                                    className="btn-primary flex items-center"
                                >
                                    {simLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Dispatching...
                                        </>
                                    ) : 'Deploy Phish'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* General Edit/Add Modal */}
            <AnimatePresence>
                {(showAddModal || showEditModal) && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(40,32,60,0.32)] backdrop-blur-md"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="emp-form-title"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-xl max-w-md w-full p-6 shadow-2xl"
                        >
                            <h3 id="emp-form-title" className="text-xl font-bold text-[var(--color-text-primary)] mb-6">{showAddModal ? 'Add New Employee' : 'Edit Employee'}</h3>

                            <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="emp-name" className="block text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-1">Full Name</label>
                                    <input id="emp-name" required type="text" name="name" value={editForm.name || ''} onChange={handleEditChange} className={inputClass} />
                                </div>
                                <div>
                                    <label htmlFor="emp-email" className="block text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-1">Email Address</label>
                                    <input id="emp-email" required type="email" name="email" value={editForm.email || ''} onChange={handleEditChange} className={inputClass} />
                                </div>
                                <div>
                                    <label htmlFor="emp-dept" className="block text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-1">Department</label>
                                    <input id="emp-dept" type="text" name="department" value={(editForm as any).department || ''} onChange={handleEditChange} className={inputClass} />
                                </div>
                                <div>
                                    <label htmlFor="emp-id" className="block text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-1">Employee ID</label>
                                    <input id="emp-id" type="text" name="employee_id" value={editForm.employee_id || ''} onChange={handleEditChange} className={inputClass} />
                                </div>

                                <div className="flex justify-end gap-3 border-t border-[var(--color-border)] pt-5 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setShowAddModal(false); setShowEditModal(false) }}
                                        disabled={actionLoading}
                                        className="btn-ghost"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="btn-primary"
                                    >
                                        {actionLoading ? 'Saving...' : 'Save Employee'}
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

export default EmployeeDirectory
