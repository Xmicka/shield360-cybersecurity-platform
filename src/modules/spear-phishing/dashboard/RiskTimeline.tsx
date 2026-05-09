import React, { useEffect, useState } from 'react'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import { fetchRiskHistory, type RiskHistoryEntry } from '../api/client'

interface RiskTimelineProps {
    userId: string
    days?: number
}

const RiskTimeline: React.FC<RiskTimelineProps> = ({ userId, days = 30 }) => {
    const [data, setData] = useState<RiskHistoryEntry[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const timeout = setTimeout(() => {
            if (mounted) setLoading(false)
        }, 5000)

        setLoading(true)
        fetchRiskHistory(userId, days)
            .then((history) => {
                if (mounted) {
                    // Format the dates for display
                    const formattedData = history.map((entry) => ({
                        ...entry,
                        displayDate: new Date(entry.timestamp).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                        }),
                        scorePercentage: parseFloat((entry.risk_score * 100).toFixed(1))
                    }))
                    setData(formattedData)
                    setLoading(false)
                }
            })
            .catch(err => {
                console.error('Risk history fetch error:', err)
                if (mounted) setLoading(false)
            })
            .finally(() => {
                clearTimeout(timeout)
            })

        return () => {
            mounted = false
            clearTimeout(timeout)
        }
    }, [userId, days])

    if (loading) {
        return (
            <div className="h-64 flex items-center justify-center">
                <div className="animate-pulse text-[var(--color-brand-lavender-dark)]">Loading risk history...</div>
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="h-64 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
                <svg className="w-12 h-12 mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p>No historical risk data available</p>
                <p className="text-xs mt-1">Run the anomaly pipeline to generate scores.</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center">
                <svg className="w-4 h-4 mr-2 text-[var(--color-brand-lavender-dark)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Risk Score Timeline ({days} Days)
            </h3>

            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                        <XAxis
                            dataKey="displayDate"
                            stroke="#8A8A8A"
                            fontSize={12}
                            tickMargin={10}
                            minTickGap={20}
                        />
                        <YAxis
                            stroke="#8A8A8A"
                            fontSize={12}
                            domain={[0, 100]}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#FAFAF5',
                                border: '1px solid rgba(0,0,0,0.08)',
                                borderRadius: '0.5rem',
                                color: '#1A1A2E'
                            }}
                            formatter={(value: any) => [`${value}%`, 'Risk Score']}
                            labelStyle={{ color: '#4A4A4A', marginBottom: '0.25rem' }}
                        />
                        <Line
                            type="monotone"
                            dataKey="scorePercentage"
                            stroke="#9B82CC"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#FAFAF5', stroke: '#9B82CC', strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: '#9B82CC', stroke: '#fff', strokeWidth: 2 }}
                            animationDuration={1500}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default RiskTimeline
