'use client'
// ============================================================
// NETRA AI — AI Insights Panel
// Intelligence cards with confidence scores and citations
// Inspired by: OpenAI's response UI / IBM Watson insights
// ============================================================

import { motion } from 'framer-motion'
import { BrainCircuit, Sparkles, ExternalLink, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface AIInsight {
  id: string
  title: string
  summary: string
  confidence: number
  source: string
  type: 'PATTERN' | 'ANOMALY' | 'PREDICTION' | 'RECOMMENDATION'
}

interface AIInsightsPanelProps {
  insights: AIInsight[]
  isLoading?: boolean
}

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
  PATTERN: { label: 'Pattern', color: 'bg-brand-500/15 text-brand-300 border-brand-500/30' },
  ANOMALY: { label: 'Anomaly', color: 'bg-red-500/15 text-red-300 border-red-500/30' },
  PREDICTION: { label: 'Prediction', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  RECOMMENDATION: { label: 'Action', color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
}

function ConfidenceRing({ value }: { value: number }) {
  const radius = 14
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  const color = value >= 80 ? '#22c55e' : value >= 60 ? '#eab308' : '#ef4444'

  return (
    <div className="relative w-10 h-10 flex items-center justify-center flex-shrink-0">
      <svg width="40" height="40" className="transform -rotate-90">
        <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(56,97,170,0.2)" strokeWidth="3" />
        <motion.circle
          cx="20" cy="20" r={radius} fill="none" stroke={color} strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="absolute text-body-xs font-mono font-bold text-text-primary">
        {value}
      </span>
    </div>
  )
}

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export function AIInsightsPanel({ insights, isLoading }: AIInsightsPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card p-5 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center relative">
            <BrainCircuit className="w-4 h-4 text-purple-400" strokeWidth={1.5} />
            <Sparkles className="w-2.5 h-2.5 text-yellow-400 absolute -top-1 -right-1" />
          </div>
          <div>
            <h3 className="text-heading-sm text-text-primary">AI Insights</h3>
            <p className="text-body-xs text-text-tertiary">Powered by Gemini</p>
          </div>
        </div>
      </div>

      {/* Insight cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-2.5 overflow-y-auto flex-1"
      >
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="flex items-start gap-3 p-3.5 rounded-lg bg-bg-elevated/40 shimmer">
               <div className="w-10 h-10 rounded-full bg-bg-surface flex-shrink-0" />
               <div className="flex-1 space-y-2 py-1">
                 <div className="h-4 bg-bg-surface rounded w-3/4" />
                 <div className="h-3 bg-bg-surface rounded w-full" />
                 <div className="h-3 bg-bg-surface rounded w-2/3" />
               </div>
             </div>
          ))
        ) : insights.map((insight) => {
          const typeConfig = TYPE_CONFIG[insight.type] ?? TYPE_CONFIG.PATTERN
          return (
            <motion.div
              key={insight.id}
              variants={item}
              className="p-3.5 rounded-lg bg-bg-surface/60 border border-border-subtle hover:border-border-default transition-all cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <ConfidenceRing value={insight.confidence} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn('px-2 py-0.5 rounded text-body-xs font-semibold border', typeConfig.color)}>
                      {typeConfig.label}
                    </span>
                  </div>
                  <p className="text-body-sm text-text-primary font-medium leading-snug">
                    {insight.title}
                  </p>
                  <p className="text-body-xs text-text-tertiary mt-1 line-clamp-2">
                    {insight.summary}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-body-xs text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3 h-3" />
                    <span>{insight.source}</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
