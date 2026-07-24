'use client'

import { apiClient as api } from '@/lib/api/client'
import { usePermissions } from '@/lib/hooks/usePermissions'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, ActivityIcon, AlertCircle, Database, ShieldCheck, Users, Plus, Building2, UserPlus, X, CheckCircle2 } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

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

interface OfficerRecord {
  badgeNumber: string
  name: string
  email: string
  rank: string
  station: string
  role: string
}

interface StationRecord {
  code: string
  name: string
  district: string
  status: string
  lat: number
  lng: number
}

const INITIAL_OFFICERS: OfficerRecord[] = [
  { badgeNumber: 'COMM-KA-0001', name: 'Commissioner Demo', email: 'comm@ksp.gov.in', rank: 'Commissioner', station: 'KSP HQ', role: 'SUPER_ADMIN' },
  { badgeNumber: 'INSP-BLR-0001', name: 'Inspector Rajesh Kumar', email: 'insp@ksp.gov.in', rank: 'Inspector', station: 'Shivajinagar PS', role: 'INVESTIGATION_OFFICER' },
  { badgeNumber: 'DYSP-BLR-0001', name: 'DySP Priya Nair', email: 'dysp@ksp.gov.in', rank: 'DySP', station: 'Bengaluru Central', role: 'DISTRICT_ADMIN' },
  { badgeNumber: 'ANAL-KA-0001', name: 'Kavitha Reddy', email: 'analyst@ksp.gov.in', rank: 'Analyst', station: 'KSP HQ', role: 'ANALYST' },
]

const INITIAL_STATIONS: StationRecord[] = [
  { code: 'PS-001', name: 'Shivajinagar PS', district: 'Bengaluru Central', status: 'OPEN', lat: 12.9857, lng: 77.6057 },
  { code: 'PS-002', name: 'Koramangala PS', district: 'Bengaluru South', status: 'OPEN', lat: 12.9352, lng: 77.6245 },
  { code: 'PS-003', name: 'Indiranagar PS', district: 'Bengaluru East', status: 'OPEN', lat: 12.9784, lng: 77.6408 },
  { code: 'PS-004', name: 'Whitefield PS', district: 'Bengaluru East', status: 'OPEN', lat: 12.9866, lng: 77.7381 },
]

export default function SuperAdminPortal() {
  const { isRole } = usePermissions()
  const isSuperAdmin = isRole('SUPER_ADMIN')

  const [activeTab, setActiveTab] = useState<'telemetry' | 'officers' | 'stations' | 'sessions' | 'audit'>('telemetry')
  const [telemetry, setTelemetry] = useState<TelemetryOverview | null>(null)
  const [sessions, setSessions] = useState<SessionSummary[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [officers, setOfficers] = useState<OfficerRecord[]>(INITIAL_OFFICERS)
  const [stations, setStations] = useState<StationRecord[]>(INITIAL_STATIONS)
  const [loading, setLoading] = useState(true)

  // Modals
  const [isAddOfficerOpen, setIsAddOfficerOpen] = useState(false)
  const [isAddStationOpen, setIsAddStationOpen] = useState(false)

  // Officer Form
  const [newBadge, setNewBadge] = useState('')
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRank, setNewRank] = useState('Inspector')
  const [newStation, setNewStation] = useState('Shivajinagar PS')

  // Station Form
  const [newStationCode, setNewStationCode] = useState('')
  const [newStationName, setNewStationName] = useState('')
  const [newDistrict, setNewDistrict] = useState('Bengaluru Central')

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

  const handleAddOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newBadge || !newName || !newEmail) {
      toast.error('Please fill in all officer credentials')
      return
    }

    const created: OfficerRecord = {
      badgeNumber: newBadge.toUpperCase(),
      name: newName,
      email: newEmail,
      rank: newRank,
      station: newStation,
      role: newRank === 'Commissioner' ? 'SUPER_ADMIN' : 'INVESTIGATION_OFFICER'
    }

    setOfficers(prev => [created, ...prev])
    toast.success(`Officer ${newName} (${created.badgeNumber}) added to system!`)
    setIsAddOfficerOpen(false)
    setNewBadge('')
    setNewName('')
    setNewEmail('')
  }

  const handleAddStationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newStationCode || !newStationName) {
      toast.error('Please fill in station code and name')
      return
    }

    const created: StationRecord = {
      code: newStationCode.toUpperCase(),
      name: newStationName,
      district: newDistrict,
      status: 'OPEN',
      lat: 12.9716,
      lng: 77.5946
    }

    setStations(prev => [created, ...prev])
    toast.success(`Police Station ${newStationName} (${created.code}) created!`)
    setIsAddStationOpen(false)
    setNewStationCode('')
    setNewStationName('')
  }

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
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-purple-400" />
            Enterprise Administration Command Center
          </h1>
          <p className="text-text-secondary mt-2 text-sm max-w-3xl">
            Super Admin command portal for officer credentials, police station management, system telemetry, and security audits.
          </p>
        </div>

        {activeTab === 'officers' && (
          <button 
            onClick={() => setIsAddOfficerOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
          >
            <UserPlus className="w-4 h-4" /> Add New Officer
          </button>
        )}

        {activeTab === 'stations' && (
          <button 
            onClick={() => setIsAddStationOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" /> Add Police Station
          </button>
        )}
      </div>

      <div className="flex border-b border-border-default mb-6 overflow-x-auto hide-scrollbar">
        {[
          { id: 'telemetry', label: 'System Telemetry', icon: Activity },
          { id: 'officers', label: `Officers (${officers.length})`, icon: Users },
          { id: 'stations', label: `Police Stations (${stations.length})`, icon: Building2 },
          { id: 'sessions', label: 'Active Sessions', icon: ShieldCheck },
          { id: 'audit', label: 'Global Audit Logs', icon: Database },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'telemetry' | 'officers' | 'stations' | 'sessions' | 'audit')}
            className={`flex items-center gap-2 px-6 py-4 font-bold text-sm whitespace-nowrap transition-colors relative ${activeTab === tab.id ? 'text-purple-400' : 'text-text-secondary hover:text-white'}`}
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
          {loading && activeTab !== 'officers' && activeTab !== 'stations' ? (
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
              {/* Telemetry Tab */}
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
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Recent System Diagnostics</h3>
                    {telemetry.recent_errors.length === 0 ? (
                      <p className="text-sm text-text-tertiary">All services operational cleanly. No recent errors reported.</p>
                    ) : (
                      <div className="space-y-2">
                        {telemetry.recent_errors.map((e, i) => (
                          <div key={i} className="p-3 bg-red-500/5 border border-red-500/20 rounded-lg flex gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <div>
                              <div className="flex gap-2 items-center mb-1">
                                <span className="text-xs font-bold text-red-400">{e.level}</span>
                                <span className="text-xs font-mono text-text-secondary">{e.service}</span>
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

              {/* Officers Tab */}
              {activeTab === 'officers' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-strong text-xs uppercase tracking-wider text-text-tertiary">
                        <th className="pb-3 pr-4 font-bold">Badge No.</th>
                        <th className="pb-3 px-4 font-bold">Full Name</th>
                        <th className="pb-3 px-4 font-bold">Rank / Role</th>
                        <th className="pb-3 px-4 font-bold">Station</th>
                        <th className="pb-3 pl-4 font-bold">Email</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {officers.map(o => (
                        <tr key={o.badgeNumber} className="hover:bg-bg-elevated/50 transition-colors">
                          <td className="py-3 pr-4 font-mono text-xs font-bold text-purple-400">{o.badgeNumber}</td>
                          <td className="py-3 px-4 text-sm font-bold text-white">{o.name}</td>
                          <td className="py-3 px-4 text-xs font-semibold text-text-secondary">{o.rank} ({o.role})</td>
                          <td className="py-3 px-4 text-xs text-text-tertiary">{o.station}</td>
                          <td className="py-3 pl-4 font-mono text-xs text-brand-300">{o.email}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Stations Tab */}
              {activeTab === 'stations' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-border-strong text-xs uppercase tracking-wider text-text-tertiary">
                        <th className="pb-3 pr-4 font-bold">Station Code</th>
                        <th className="pb-3 px-4 font-bold">Station Name</th>
                        <th className="pb-3 px-4 font-bold">District</th>
                        <th className="pb-3 px-4 font-bold">Coordinates</th>
                        <th className="pb-3 pl-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {stations.map(s => (
                        <tr key={s.code} className="hover:bg-bg-elevated/50 transition-colors">
                          <td className="py-3 pr-4 font-mono text-xs font-bold text-brand-400">{s.code}</td>
                          <td className="py-3 px-4 text-sm font-bold text-white">{s.name}</td>
                          <td className="py-3 px-4 text-xs text-text-secondary">{s.district}</td>
                          <td className="py-3 px-4 font-mono text-xs text-text-tertiary">{s.lat.toFixed(4)}, {s.lng.toFixed(4)}</td>
                          <td className="py-3 pl-4">
                            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              {s.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Sessions Tab */}
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
                    </tbody>
                  </table>
                </div>
              )}

              {/* Audit Tab */}
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
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal: Add New Officer */}
      {isAddOfficerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-bg-surface border border-border-strong rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-bg-elevated/80">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-purple-400" /> Create Officer User Account
              </h3>
              <button onClick={() => setIsAddOfficerOpen(false)} className="text-text-tertiary hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddOfficerSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Badge Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. INSP-BLR-0099" 
                  value={newBadge}
                  onChange={(e) => setNewBadge(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-purple-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Officer Name" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-purple-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Government Email</label>
                <input 
                  type="email" 
                  placeholder="officer@ksp.gov.in" 
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-purple-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Rank / Designation</label>
                <select 
                  value={newRank} 
                  onChange={(e) => setNewRank(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="Inspector">Inspector</option>
                  <option value="Sub-Inspector">Sub-Inspector</option>
                  <option value="DySP">DySP</option>
                  <option value="Commissioner">Commissioner</option>
                  <option value="Constable">Constable</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Jurisdiction Station</label>
                <select 
                  value={newStation} 
                  onChange={(e) => setNewStation(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  {stations.map(s => <option key={s.code} value={s.name}>{s.name}</option>)}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <button type="button" onClick={() => setIsAddOfficerOpen(false)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Save Officer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Police Station */}
      {isAddStationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-bg-surface border border-border-strong rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-bg-elevated/80">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-400" /> Add Police Station
              </h3>
              <button onClick={() => setIsAddStationOpen(false)} className="text-text-tertiary hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStationSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Station Code</label>
                <input 
                  type="text" 
                  placeholder="e.g. PS-005" 
                  value={newStationCode}
                  onChange={(e) => setNewStationCode(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-purple-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Station Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Malleswaram PS" 
                  value={newStationName}
                  onChange={(e) => setNewStationName(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none focus:ring-2 focus:ring-purple-500" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">District Name</label>
                <select 
                  value={newDistrict} 
                  onChange={(e) => setNewDistrict(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="Bengaluru Central">Bengaluru Central</option>
                  <option value="Bengaluru South">Bengaluru South</option>
                  <option value="Bengaluru East">Bengaluru East</option>
                  <option value="Bengaluru West">Bengaluru West</option>
                  <option value="Bengaluru North">Bengaluru North</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <button type="button" onClick={() => setIsAddStationOpen(false)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Create Station
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
