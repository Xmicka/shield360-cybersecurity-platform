import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface PipelineStage {
  id: string
  label: string
  description: string
  icon: string
  color: string
  details: string[]
}

const PipelineStageCard: React.FC<{
  stage: PipelineStage
  index: number
  isLast: boolean
  hoveredStage: string | null
  onHover: (id: string | null) => void
}> = ({ stage, index, isLast, hoveredStage, onHover }) => {
  const isHovered = hoveredStage === stage.id

  return (
    <div className="flex items-stretch gap-0">
      {/* Stage Card */}
      <motion.div
        className="relative flex-1 min-w-0"
        onMouseEnter={() => onHover(stage.id)}
        onMouseLeave={() => onHover(null)}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
      >
        <motion.div
          className={`h-full p-5 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm group ${
            isHovered
              ? `border-${stage.color}-400 bg-${stage.color}-900/30 shadow-lg`
              : `border-${stage.color}-600/30 bg-${stage.color}-900/10 hover:border-${stage.color}-500/60`
          }`}
          style={{
            borderColor: isHovered ? stage.color : `${stage.color}4D`,
            backgroundColor: isHovered
              ? `${stage.color}1A`
              : `${stage.color}0D`,
          }}
          whileHover={{ scale: 1.05, y: -5 }}
        >
          {/* Animated background glow */}
          <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{
              background: `radial-gradient(circle, ${stage.color}15 0%, transparent 70%)`,
            }}
            animate={{
              opacity: isHovered ? 0.5 : 0,
            }}
          />

          {/* Content */}
          <div className="relative z-10 space-y-2 h-full flex flex-col">
            {/* Icon and Label */}
            <div className="space-y-2">
              <motion.div
                className="text-3xl"
                animate={{ scale: isHovered ? 1.2 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {stage.icon}
              </motion.div>
              <h3 style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stage.label}</h3>
              <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{stage.description}</p>
            </div>

            {/* Expandable Details */}
            <motion.div
              className="mt-auto pt-3 space-y-1"
              style={{ borderTop: '1px solid var(--color-border)' }}
              initial={{ opacity: 0, maxHeight: 0 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                maxHeight: isHovered ? 200 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {stage.details.map((detail, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-2"
                  style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: isHovered ? 1 : 0, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <span className="mt-0.5">→</span>
                  <span>{detail}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Animated border pulse */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              style={{ borderColor: stage.color }}
              animate={{
                boxShadow: [
                  `0 0 0 0 ${stage.color}33`,
                  `0 0 0 8px ${stage.color}00`,
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.div>
      </motion.div>

      {/* Arrow Connector */}
      {!isLast && (
        <motion.div
          className="flex items-center justify-center px-3"
          animate={{
            scale: hoveredStage === stage.id || hoveredStage === `stage-${index + 1}` ? 1.2 : 1,
          }}
        >
          <motion.svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="text-gray-400 group-hover:text-cyan-400 transition-colors"
            animate={{
              x: hoveredStage ? 3 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </motion.svg>
        </motion.div>
      )}
    </div>
  )
}

const AdaptivePhishingPipeline: React.FC = () => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null)

  const stages: PipelineStage[] = [
    {
      id: 'behavior-observed',
      label: 'Behavior Observed',
      description: 'System monitors user activity and interactions',
      icon: '👁️',
      color: '#3b82f6',
      details: [
        'Real-time activity tracking',
        'Anomaly detection active',
        'Pattern recognition enabled',
      ],
    },
    {
      id: 'risk-assessed',
      label: 'Risk Assessed',
      description: 'ML model evaluates behavior risk score',
      icon: '📊',
      color: '#8b5cf6',
      details: [
        'Multi-factor risk analysis',
        'Behavioral scoring applied',
        'Predictive modeling engaged',
      ],
    },
    {
      id: 'phishing-generated',
      label: 'Phishing Generated',
      description: 'Personalized phishing simulation crafted',
      icon: '🎯',
      color: '#ec4899',
      details: [
        'Threat profile matched',
        'Content personalized',
        'Delivery optimized',
      ],
    },
    {
      id: 'user-interaction',
      label: 'User Interaction',
      description: 'Employee receives and responds to phishing',
      icon: '⚡',
      color: '#f59e0b',
      details: [
        'Email delivered',
        'Response captured',
        'Outcome recorded',
      ],
    },
    {
      id: 'training-triggered',
      label: 'Training Triggered',
      description: 'Adaptive training deployed based on outcome',
      icon: '🎓',
      color: '#10b981',
      details: [
        'Immediate micro-training',
        'Personalized content sent',
        'Progress tracked',
      ],
    },
  ]

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, color: "var(--color-text-primary)", letterSpacing: "-0.025em" }}>
          Adaptive Spear Phishing Pipeline
        </h2>
        <p style={{ fontSize: 15, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
          End-to-end workflow demonstrating how the system adapts to individual behavioral patterns
        </p>
      </motion.div>

      {/* Pipeline Horizontal Flow */}
      <motion.div
        className="overflow-x-auto pb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex gap-0 min-w-max md:min-w-0 md:gap-0">
          {stages.map((stage, idx) => (
            <PipelineStageCard
              key={stage.id}
              stage={stage}
              index={idx}
              isLast={idx === stages.length - 1}
              hoveredStage={hoveredStage}
              onHover={setHoveredStage}
            />
          ))}
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {[
          {
            title: 'Behavioral Detection',
            description: 'The system continuously monitors user interactions to establish baseline behavior patterns.',
          },
          {
            title: 'Risk Calculation',
            description: 'Advanced algorithms score risk based on deviations from normal behavior and threat indicators.',
          },
          {
            title: 'Personalized Response',
            description: 'Training and simulations are customized to the specific vulnerabilities identified for each user.',
          },
        ].map((item, idx) => (
          <motion.div
            key={idx}
            className="glass-card transition-colors"
            style={{ padding: 16 }}
          >
            <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--color-brand-blue)' }}>●</span> {item.title}
            </h4>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', lineHeight: 1.55 }}>{item.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Key Metrics */}
      <motion.div
        className="glass-card"
        style={{ padding: 24 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false }}
        transition={{ delay: 0.5 }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Avg Detection Time', value: '2.4s' },
            { label: 'Model Accuracy', value: '94.2%' },
            { label: 'Training Completion', value: '87%' },
            { label: 'Behavioral Improvement', value: '+18%' },
          ].map((metric, idx) => (
            <div key={idx} className="text-center">
              <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-text-primary)' }}>{metric.value}</div>
              <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>{metric.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default AdaptivePhishingPipeline
