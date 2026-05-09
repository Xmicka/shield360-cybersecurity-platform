import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MicroTrainingModalProps {
  isOpen: boolean
  onClose: () => void
  employeeName: string
  incidentType: string
}

const MicroTrainingModal: React.FC<MicroTrainingModalProps> = ({
  isOpen,
  onClose,
  employeeName,
  incidentType,
}) => {
  const [step, setStep] = useState<'intro' | 'training' | 'complete'>('intro')
  const [isAnswered, setIsAnswered] = useState(false)

  const handleStartTraining = () => {
    setStep('training')
    setIsAnswered(false)
  }

  const handleAnswer = () => {
    setIsAnswered(true)
    setTimeout(() => {
      setStep('complete')
    }, 1000)
  }

  const handleClose = () => {
    setStep('intro')
    setIsAnswered(false)
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[rgba(40,32,60,0.32)] backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="micro-training-title"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-2xl"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Main card */}
            <div className="relative rounded-2xl p-8 lg:p-12 space-y-8 bg-[var(--color-bg-card)] border border-[var(--color-border)] shadow-2xl">
              {/* Close button */}
              <motion.button
                onClick={handleClose}
                aria-label="Close"
                className="absolute top-6 right-6 p-2 hover:bg-black/5 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-6 h-6 text-[var(--color-text-muted)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </motion.button>

              <AnimatePresence mode="wait">
                {step === 'intro' && (
                  <motion.div
                    key="intro"
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="space-y-2">
                      <div className="text-5xl">⚠️</div>
                      <h2 id="micro-training-title" className="text-3xl font-black text-[var(--color-text-primary)]">
                        Micro-Training Required
                      </h2>
                      <p className="text-[var(--color-text-secondary)]">
                        Hi <span className="text-[var(--color-brand-lavender-dark)] font-semibold">{employeeName}</span>, a security incident was detected. Let's review best practices.
                      </p>
                    </div>

                    <div className="space-y-3 p-4 bg-[rgba(224,122,95,0.10)] border border-[var(--color-border)] rounded-lg">
                      <p className="text-sm font-semibold text-[var(--color-brand-coral)]">
                        Incident Type: {incidentType}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        This micro-training takes 2 minutes and is required before continuing.
                      </p>
                    </div>

                    <motion.button
                      onClick={handleStartTraining}
                      className="btn-primary w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Start Training
                    </motion.button>

                    <p className="text-xs text-[var(--color-text-muted)] text-center">
                      After this, you'll receive a full training module
                    </p>
                  </motion.div>
                )}

                {step === 'training' && (
                  <motion.div
                    key="training"
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="space-y-4">
                      <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                        {incidentType === 'Clicked Malicious Link'
                          ? 'Identifying Suspicious Links'
                          : 'Recognizing Phishing Emails'}
                      </h3>

                      <div className="space-y-4 p-4 bg-[rgba(155,130,204,0.10)] border border-[var(--color-border)] rounded-lg">
                        {incidentType === 'Clicked Malicious Link' ? (
                          <>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              <span className="text-[var(--color-brand-lavender-dark)] font-semibold">✓</span> Always hover over links before clicking to see the actual URL
                            </p>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              <span className="text-[var(--color-brand-lavender-dark)] font-semibold">✓</span> Be suspicious of urgent calls-to-action or unusual requests
                            </p>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              <span className="text-[var(--color-brand-lavender-dark)] font-semibold">✓</span> When in doubt, navigate directly to the official website
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              <span className="text-[var(--color-brand-lavender-dark)] font-semibold">✓</span> Check sender email address carefully - slight misspellings are common
                            </p>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              <span className="text-[var(--color-brand-lavender-dark)] font-semibold">✓</span> Legitimate companies won't ask for passwords via email
                            </p>
                            <p className="text-sm text-[var(--color-text-secondary)]">
                              <span className="text-[var(--color-brand-lavender-dark)] font-semibold">✓</span> Report suspicious emails to your security team immediately
                            </p>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-[var(--color-text-secondary)]">
                        Question: What should you do if you're unsure about an email?
                      </p>
                      <div className="space-y-2">
                        <motion.button
                          onClick={handleAnswer}
                          disabled={isAnswered}
                          className="w-full text-left p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-brand-lavender-dark)] hover:bg-[rgba(155,130,204,0.08)] transition-colors disabled:opacity-50 text-[var(--color-text-primary)]"
                          whileHover={{ x: 5 }}
                        >
                          Report it to the security team
                        </motion.button>
                        <motion.button
                          onClick={() => handleAnswer()}
                          disabled={isAnswered}
                          className="w-full text-left p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-brand-coral)] hover:bg-[rgba(224,122,95,0.08)] transition-colors disabled:opacity-50 text-[var(--color-text-primary)]"
                          whileHover={{ x: 5 }}
                        >
                          Delete it immediately
                        </motion.button>
                      </div>
                    </div>

                    {isAnswered && (
                      <motion.div
                        className="p-4 rounded-lg bg-[rgba(143,191,150,0.12)] border border-[var(--color-border)] text-[var(--color-brand-sage-deep)] text-sm"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        ✓ Correct! Always report suspicious emails first.
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {step === 'complete' && (
                  <motion.div
                    key="complete"
                    className="space-y-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <div className="text-center space-y-2">
                      <motion.div
                        className="text-6xl mx-auto w-16 h-16 flex items-center justify-center text-[var(--color-brand-sage-deep)]"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6 }}
                      >
                        ✓
                      </motion.div>
                      <h3 className="text-2xl font-black text-[var(--color-text-primary)]">
                        Training Complete!
                      </h3>
                      <p className="text-[var(--color-text-secondary)]">
                        Great job! You've completed the micro-training.
                      </p>
                    </div>

                    <div className="space-y-4 p-4 bg-[rgba(155,130,204,0.10)] border border-[var(--color-border)] rounded-lg">
                      <p className="text-sm font-semibold text-[var(--color-text-secondary)]">Next Step:</p>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        You'll receive an email with a full 15-minute training course to deepen your security awareness. Please complete it within 48 hours.
                      </p>
                      <a
                        href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-brand-lavender-dark)] hover:text-[var(--color-brand-lavender)] text-sm font-semibold"
                      >
                        → Click here for full training
                      </a>
                    </div>

                    <motion.button
                      onClick={handleClose}
                      className="btn-primary w-full"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Close
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MicroTrainingModal
