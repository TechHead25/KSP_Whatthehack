'use client'

import { apiClient as api } from '@/lib/api/client'
import { usePermissions } from '@/lib/hooks/usePermissions'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, ActivityIcon, AlertCircle, Database, ShieldCheck, Users } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface TelemetryMetric {
  metric_name: string
  value: string | number
  status: string
}

interface TelemetryError {
  level: string
  service: string
  timestamp: string
  message: string
}

interface TelemetryOverview {
  database_metrics: TelemetryMetric[]
  recent_errors: TelemetryError[]
}

interface SessionSummary {
  id: string
  officer_id: string
  is_active: boolean
  created_at: string
}

interface AuditLog {
  id: string
  action: string
  officer_id: string | null
  resource: string
  status: string
  created_at: string
}

// Simple mock components for the Datathon since we just need the UI wrapper
// and some real data fetching

export default function SuperAdminPortal() {
  const { isRole } = usePermissions()
  const isSuperAdmin = isRole('SUPER_ADMIN')

  const [activeTab, setActiveTab] = useState<'telemetry' | 'sessions' | 'audit'>('telemetry')
  const [telemetry, setTelemetry] = useState<TelemetryOverview | null>(null)
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (activeTab === 'telemetry') {
        const { data } = await api.get<{ data: TelemetryOverview }>('/admin/monitoring/telemetry')
        setTelemetry(data.data)
      } else if (activeTab === 'sessions') {
        const { data } = await api.get<{ data: SessionSummary[] }>('/admin/sessions')
        setSessions(data.data)
      } else if (activeTab === 'audit') {
        const { data } = await api.get<{ data: AuditLog[] }>('/admin/audit')
        setAuditLogs(data.data)
      }
    } catch {
      // Telemetry error handled silently
    } finally {
      setLoading(false)
    }
  }, [activeTab])

  useEffect(() => {
    if (isSuperAdmin) {
      void fetchData()
    }
  }, [fetchData, isSuperAdmin])

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <ShieldCheck className="w-16 h-16 text-red-500/50 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
        <p className="text-text-secondary max-w-md text-center">
          You do not have the required permissions to access the Super Admin command center.
        </p>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-purple-400" />
          Enterprise Administration
        </h1>
        <p className="text-text-secondary mt-2 text-sm max-w-3xl">
          Super Admin command center for system health, session management, and global audit logging.
        </p>
      </div>

      <div className="flex border-b border-border-default mb-6 overflow-x-auto hide-scrollbar">
        {[
          { id: 'telemetry', label: 'System Telemetry', icon: Activity },
          { id: 'sessions', label: 'Active Sessions', icon: Users },
          { id: 'audit', label: 'Global Audit Logs', icon: Database },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'telemetry' | 'sessions' | 'audit')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors relative ${activeTab === tab.id ? 'text-purple-400' : 'text-text-secondary hover:text-white'
              }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div layoutId="adminTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
            )}
          </button>
        ))}
      </div>

      <div className="bg-bg-surface border border-border-default rounded-xl p-6 shadow-sm min-h-[400px]">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-20 text-center text-text-tertiary flex flex-col items-center">
              <ActivityIcon className="w-8 h-8 animate-spin mb-4 text-purple-500/50" />
              Loading {activeTab}...
            </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {activeTab === 'telemetry' && telemetry && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {telemetry.database_metrics.map((m, i) => (
                    <div key={i} className="p-4 bg-bg-base rounded-lg border border-border-subtle">
                      <p className="text-xs text-text-tertiary mb-1 uppercase tracking-wider">{m.metric_name}</p>
                      <p className="text-xl font-bold text-white">{m.value}</p>
                      <span className="text-[10px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded mt-2 inline-block">
                        {m.status}
                      </span>
                    </div>
                  ))}

                  <div className="col-span-full mt-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Recent Errors</h3>
                    {telemetry.recent_errors.length === 0 ? (
                      <p className="text-sm text-text-tertiary">No recent errors reported.</p>
                    ) : (
                      <div className="space-y-2">
                        {telemetry.recent_errors.map((e, i) => (
                          <div key={i} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <div>
                              <div className="flex gap-2 items-center mb-1">
                                <span className="text-xs font-bold text-red-400">{e.level}</span>
                                <span className="text-xs font-mono text-text-secondary">{e.service}</span>
                                <span className="text-xs text-text-tertiary">{new Date(e.timestamp).toLocaleString()}</span>
                              </div>
                              <p className="text-sm text-white">{e.message}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'sessions' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-strong text-xs uppercase tracking-wider text-text-tertiary">
                        <th className="pb-3 pr-4 font-bold">Session ID</th>
                        <th className="pb-3 px-4 font-bold">Officer ID</th>
                        <th className="pb-3 px-4 font-bold">Status</th>
                        <th className="pb-3 pl-4 font-bold">Created At</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map(s => (
                        <tr key={s.id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                          <td className="py-3 pr-4 font-mono text-xs text-text-secondary">{s.id.split('-')[0]}</td>
                          <td className="py-3 px-4 font-mono text-xs text-text-secondary">{s.officer_id}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${s.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {s.is_active ? 'ACTIVE' : 'EXPIRED'}
                            </span>
                          </td>
                          <td className="py-3 pl-4 text-sm text-text-secondary">{new Date(s.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                      {sessions.length === 0 && (
                        <tr><td colSpan={4} className="py-8 text-center text-text-tertiary text-sm">No active sessions found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'audit' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-strong text-xs uppercase tracking-wider text-text-tertiary">
                        <th className="pb-3 pr-4 font-bold">Action</th>
                        <th className="pb-3 px-4 font-bold">Officer ID</th>
                        <th className="pb-3 px-4 font-bold">Resource</th>
                        <th className="pb-3 px-4 font-bold">Status</th>
                        <th className="pb-3 pl-4 font-bold">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.map(l => (
                        <tr key={l.id} className="border-b border-border-subtle hover:bg-bg-elevated/50 transition-colors">
                          <td className="py-3 pr-4 text-sm font-medium text-white">{l.action}</td>
                          <td className="py-3 px-4 font-mono text-xs text-text-tertiary">{l.officer_id ? l.officer_id.split('-')[0] : 'SYSTEM'}</td>
                          <td className="py-3 px-4 font-mono text-xs text-brand-300">{l.resource}</td>
                          <td className="py-3 px-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${l.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                              {l.status}
                            </span>
                          </td>
                          <td className="py-3 pl-4 text-sm text-text-secondary">{new Date(l.created_at).toLocaleString()}</td>
                        </tr>
                      ))}
                      {auditLogs.length === 0 && (
                        <tr><td colSpan={5} className="py-8 text-center text-text-tertiary text-sm">No audit logs found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
