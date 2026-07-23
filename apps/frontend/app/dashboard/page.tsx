'use client'

import { motion } from 'framer-motion'
import {
  Shield, Map, Radio, AlertTriangle, Network,
  Activity, Clock
} from 'lucide-react'
import { useAuthStore } from '@/lib/stores/authStore'
import { useOfficerDashboard, useAnalyticsDashboard, useAlertHistory } from '@/lib/hooks/useDashboard'
import { KPICard } from '@/components/dashboard/KPICard'
import { AlertsFeed } from '@/components/dashboard/AlertsFeed'
import { RecentActivity } from '@/components/dashboard/RecentActivity'
import { CrimeAnalyticsChart } from '@/components/dashboard/CrimeAnalyticsChart'
import { ThreatMatrix } from '@/components/dashboard/ThreatMatrix'
import { AIInsightsPanel } from '@/components/dashboard/AIInsightsPanel'
import { WidgetErrorBoundary } from '@/components/ui/WidgetErrorBoundary'

// ── Fallback data ──
const FALLBACK_CRIME_TYPES = [
  { type: 'Theft', count: 450, percentage: 36 },
  { type: 'Assault', count: 280, percentage: 22 },
  { type: 'Cybercrime', count: 140, percentage: 11 },
  { type: 'Narcotics', count: 80, percentage: 7 },
]

const FALLBACK_THREAT_ZONES = [
  { zone: 'Shivajinagar', riskScore: 87, crimeCount: 42, trend: 'UP' as const },
  { zone: 'MG Road', riskScore: 74, crimeCount: 31, trend: 'UP' as const },
  { zone: 'Whitefield', riskScore: 52, crimeCount: 18, trend: 'STABLE' as const },
  { zone: 'Electronic City', riskScore: 38, crimeCount: 12, trend: 'DOWN' as const },
]

const FALLBACK_INSIGHTS = [
  {
    id: '1',
    title: 'Anomalous burglary cluster in Whitefield',
    summary: 'Three burglaries in 48 hours within a 500m radius. Same MO — forced rear entry during 2-4 AM. Likely single actor.',
    confidence: 84,
    source: 'FIR-2026-00456',
    type: 'ANOMALY' as const,
  },
  {
    id: '2',
    title: 'Predicted hotspot emergence in Electronic City',
    summary: 'ML model forecasts 72% probability of increased chain-snatching incidents in the next 7 days based on payday cycle.',
    confidence: 72,
    source: 'Prediction Engine',
    type: 'PREDICTION' as const,
  },
]

export default function CommandCenter() {
  const officer = useAuthStore((s) => s.officer)
  const { data: dashboard, isLoading: dashLoading } = useOfficerDashboard()
  const { data: analytics } = useAnalyticsDashboard()
  const { data: alertHistory } = useAlertHistory()

  const kpiData = {
    activeFirs: dashboard?.widgets?.overview?.total_active_firs ?? analytics?.active_firs?.count ?? 0,
    firsTrend: analytics?.active_firs?.trend ?? 0,
    firsTrendDir: (dashboard?.widgets?.overview?.predicted_crime_trend ?? analytics?.active_firs?.trend_direction ?? 'STABLE') as 'UP' | 'DOWN' | 'STABLE',
    closedMonth: analytics?.closed_this_month?.count ?? 0,
    closedTrend: analytics?.closed_this_month?.trend ?? 0,
    highRisk: dashboard?.widgets?.overview?.high_risk_suspects ?? analytics?.high_risk_suspects?.count ?? 0,
    highRiskTrend: analytics?.high_risk_suspects?.trend ?? 0,
    patrolCoverage: dashboard?.widgets?.overview?.patrol_coverage_percent ?? 0,
  }

  interface AlertItemInput {
    message?: string
    severity?: string
    alert_type?: string
    created_at?: string
    time?: string
    payload?: {
      message?: string
      severity?: string
    }
  }

  const alertItems = (dashboard?.widgets?.alerts?.recent_alerts ?? alertHistory ?? []).map(
    (a: AlertItemInput, i: number) => ({
      id: String(i),
      message: String(a.message ?? a.payload?.message ?? 'Alert'),
      severity: String(a.severity ?? a.payload?.severity ?? 'MEDIUM'),
      type: String(a.alert_type ?? 'ALERT'),
      time: String(a.created_at ?? a.time ?? 'Just now'),
    })
  )

  const activities = dashboard?.widgets?.recent_activity ?? []
  const crimeByType = analytics?.crime_by_type ?? FALLBACK_CRIME_TYPES

  const now = new Date()
  const timeString = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  const dateString = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-10">
      {/* ── Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-12 h-12 rounded-xl bg-bg-surface border border-brand-500/30 flex items-center justify-center shadow-glow-sm">
            <Shield className="w-6 h-6 text-brand-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">Enterprise Command Center</h1>
            <p className="text-sm font-mono text-text-tertiary">{dateString} · {timeString} IST</p>
          </div>
        </div>

        {officer && (
          <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-bg-elevated border border-border-default z-10">
            <div className="flex flex-col text-right">
              <span className="text-sm font-semibold text-text-primary">{officer.rank} {officer.name}</span>
              <span className="text-xs font-mono text-text-tertiary uppercase">{officer.station.code}</span>
            </div>
            <div className="w-px h-8 bg-border-strong" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]" />
              <span className="text-xs font-mono text-green-400 font-medium tracking-wide">SYSTEM LIVE</span>
            </div>
          </div>
        )}
      </motion.div>

      {/* ── Top: KPI Cards ── */}
      <WidgetErrorBoundary fallbackTitle="KPI Metrics Unavailable">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Active FIRs" value={kpiData.activeFirs} trend={Math.abs(kpiData.firsTrend)} trendDirection={kpiData.firsTrendDir} icon={Activity} accentColor="brand" delay={0.1} />
          <KPICard label="Closed This Month" value={kpiData.closedMonth} trend={Math.abs(kpiData.closedTrend)} trendDirection={kpiData.closedTrend < 0 ? 'DOWN' : 'UP'} icon={Shield} accentColor="cyan" delay={0.15} />
          <KPICard label="High-Risk Suspects" value={kpiData.highRisk} trend={Math.abs(kpiData.highRiskTrend)} trendDirection={kpiData.highRiskTrend > 0 ? 'UP' : 'DOWN'} icon={AlertTriangle} accentColor="red" delay={0.2} />
          <KPICard label="Patrol Coverage" value={kpiData.patrolCoverage} icon={Map} accentColor="orange" suffix="%" delay={0.25} />
        </div>
      </WidgetErrorBoundary>

      {/* ── 2-Column Main Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5/12) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <WidgetErrorBoundary fallbackTitle="Live FIR Feed Unavailable">
             <RecentActivity activities={activities} isLoading={dashLoading} />
          </WidgetErrorBoundary>
          
          <WidgetErrorBoundary fallbackTitle="AI Insights Unavailable">
            <AIInsightsPanel insights={FALLBACK_INSIGHTS} isLoading={dashLoading} />
          </WidgetErrorBoundary>
        </div>

        {/* Right Column (7/12) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <WidgetErrorBoundary fallbackTitle="Threat Matrix Unavailable">
                <ThreatMatrix zones={FALLBACK_THREAT_ZONES} isLoading={dashLoading} />
             </WidgetErrorBoundary>
             <WidgetErrorBoundary fallbackTitle="Alerts Feed Unavailable">
                <AlertsFeed alerts={alertItems} unreadCount={0} isLoading={dashLoading} />
             </WidgetErrorBoundary>
          </div>

          {/* Interactive Heatmap Placeholder */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 h-80 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-4 z-10">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Map className="w-5 h-5 text-brand-400" /> Jurisdiction Heatmap
              </h2>
            </div>
            <div className="flex-1 rounded-lg border border-border-strong bg-bg-base relative overflow-hidden flex items-center justify-center z-10">
               <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
               <motion.div className="absolute w-32 h-32 rounded-full border border-brand-500/20" animate={{ scale: [1, 2.5], opacity: [0.5, 0] }} transition={{ duration: 2, repeat: Infinity }} />
               <div className="flex flex-col items-center gap-2">
                 <Radio className="w-8 h-8 text-brand-400 animate-pulse" />
                 <span className="font-mono text-sm text-text-secondary">Rendering Real-time Grid...</span>
               </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* ── Bottom Wide Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WidgetErrorBoundary fallbackTitle="Crime Analytics Unavailable">
          <div className="lg:col-span-1">
            <CrimeAnalyticsChart data={crimeByType} isLoading={dashLoading} />
          </div>
        </WidgetErrorBoundary>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6 lg:col-span-2 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4 z-10 relative">
            <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
              <Network className="w-5 h-5 text-purple-400" /> Criminal Network Preview
            </h2>
            <button className="text-xs font-mono text-brand-400 hover:text-brand-300 border border-border-default hover:border-brand-500/50 bg-bg-surface px-3 py-1.5 rounded transition-all">
              Launch Full Explorer
            </button>
          </div>
          <div className="h-64 rounded-lg border border-border-strong bg-bg-base relative overflow-hidden flex items-center justify-center">
             <Network className="w-16 h-16 text-purple-500/20" strokeWidth={1} />
             <div className="absolute inset-0 bg-gradient-to-t from-bg-surface to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>
      
      {/* Footer Meta */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Clock className="w-3.5 h-3.5 text-text-tertiary" />
        <span className="text-xs text-text-tertiary font-mono">Last synced: {timeString}</span>
      </div>
    </div>
  )
}
