'use client'

import { useState, useMemo } from 'react'
import { Shield, Search, Filter, Download, CheckCircle2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface AuditLogEntry {
  id: string
  timestamp: string
  officerBadge: string
  officerName: string
  action: 'LOGIN' | 'FIR_CREATE' | 'DOSSIER_VIEW' | 'REPORT_GENERATE' | 'PATROL_DISPATCH' | 'SYSTEM_CONFIG'
  resourceId: string
  ipAddress: string
  status: 'SUCCESS' | 'DENIED' | 'FLAGGED'
}

const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  { id: 'AUD-9901', timestamp: '2026-07-24 22:14:30', officerBadge: 'INSP-BLR-0001', officerName: 'Inspector Rajesh Kumar', action: 'LOGIN', resourceId: 'AUTH_SESSION', ipAddress: '127.0.0.1', status: 'SUCCESS' },
  { id: 'AUD-9902', timestamp: '2026-07-24 22:15:10', officerBadge: 'COMM-KA-0001', officerName: 'Commissioner Venkatesh Rao', action: 'DOSSIER_VIEW', resourceId: 'SUS-901 (Raju Naik)', ipAddress: '127.0.0.1', status: 'SUCCESS' },
  { id: 'AUD-9903', timestamp: '2026-07-24 22:16:05', officerBadge: 'INSP-BLR-0001', officerName: 'Inspector Rajesh Kumar', action: 'FIR_CREATE', resourceId: 'FIR/2026/0501', ipAddress: '127.0.0.1', status: 'SUCCESS' },
  { id: 'AUD-9904', timestamp: '2026-07-24 22:17:22', officerBadge: 'DYSP-BLR-0001', officerName: 'DySP Priya Nair', action: 'PATROL_DISPATCH', resourceId: 'UNIT-HOYSALA-12', ipAddress: '127.0.0.1', status: 'SUCCESS' },
  { id: 'AUD-9905', timestamp: '2026-07-24 22:18:40', officerBadge: 'ANAL-KA-0001', officerName: 'Analyst Kavitha Reddy', action: 'REPORT_GENERATE', resourceId: 'REP-COURT-2026', ipAddress: '127.0.0.1', status: 'SUCCESS' },
  { id: 'AUD-9906', timestamp: '2026-07-24 22:19:15', officerBadge: 'KA-1002', officerName: 'Constable Viraj', action: 'SYSTEM_CONFIG', resourceId: 'SETTINGS_GLOBAL', ipAddress: '192.168.1.45', status: 'DENIED' },
]

export default function AuditPage() {
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('ALL')
  const logs = MOCK_AUDIT_LOGS

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = !search || 
        log.officerBadge.toLowerCase().includes(search.toLowerCase()) ||
        log.officerName.toLowerCase().includes(search.toLowerCase()) ||
        log.resourceId.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase())
      
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter
      return matchesSearch && matchesAction
    })
  }, [logs, search, actionFilter])

  const handleExportAuditCSV = () => {
    const headers = 'Audit_ID,Timestamp,Officer_Badge,Officer_Name,Action,Resource_ID,IP_Address,Status\n'
    const rows = filteredLogs.map(l => `"${l.id}","${l.timestamp}","${l.officerBadge}","${l.officerName}","${l.action}","${l.resourceId}","${l.ipAddress}","${l.status}"`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `NETRA_Audit_Trail_${Date.now()}.csv`
    a.click()
    toast.success(`Exported ${filteredLogs.length} audit log entries to CSV`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Shield className="w-6 h-6 text-brand-400" />
            Immutable Audit Trail & System Telemetry
          </h1>
          <p className="text-text-secondary mt-1">Cryptographically signed access logs and officer action audit history.</p>
        </div>
        <button onClick={handleExportAuditCSV} className="btn-secondary px-3 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
          <Download className="w-4 h-4 text-brand-400" /> Export Audit CSV
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-bg-elevated border border-border-default rounded-xl p-4 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search by Officer Badge, Name, or Action..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-secondary">
          <Filter className="w-3.5 h-3.5" />
          <select 
            value={actionFilter} 
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-transparent text-text-primary outline-none cursor-pointer uppercase font-bold"
          >
            <option value="ALL">All Action Types</option>
            <option value="LOGIN">Authentication / Login</option>
            <option value="FIR_CREATE">FIR Creation</option>
            <option value="DOSSIER_VIEW">Dossier Inspection</option>
            <option value="REPORT_GENERATE">Report Generation</option>
            <option value="PATROL_DISPATCH">Patrol Dispatch</option>
          </select>
        </div>
      </div>

      {/* Audit Log Data Table */}
      <div className="bg-bg-surface/50 backdrop-blur-xl border border-border-default rounded-xl overflow-hidden shadow-2xl min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-base/80 border-b border-border-strong text-[10px] font-bold tracking-[0.1em] uppercase text-text-tertiary">
                <th className="px-6 py-4">Audit ID</th>
                <th className="px-6 py-4">Timestamp (IST)</th>
                <th className="px-6 py-4">Officer Officer</th>
                <th className="px-6 py-4">Action Performed</th>
                <th className="px-6 py-4">Target Resource</th>
                <th className="px-6 py-4">IP Address</th>
                <th className="px-6 py-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-bg-elevated/40 transition-colors">
                  <td className="px-6 py-4 text-xs font-mono font-bold text-brand-400 whitespace-nowrap">{log.id}</td>
                  <td className="px-6 py-4 text-xs font-mono text-text-secondary whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{log.officerName}</span>
                      <span className="text-[10px] font-mono text-text-tertiary">{log.officerBadge}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded border bg-brand-500/10 text-brand-400 border-brand-500/30">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-text-secondary">{log.resourceId}</td>
                  <td className="px-6 py-4 text-xs font-mono text-text-tertiary">{log.ipAddress}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded border inline-flex items-center gap-1 ${
                      log.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                      log.status === 'DENIED' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    }`}>
                      {log.status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3" />}
                      {log.status === 'DENIED' && <AlertTriangle className="w-3 h-3" />}
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-tertiary">
                    <Shield className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p className="text-xs font-medium tracking-wide">No audit logs matching search criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
