'use client'

import { useState, useMemo } from 'react'
import { FileText, Search, Filter, Download, Plus, MoreHorizontal, Loader2, Eye, ShieldAlert, FileCheck, X, Calendar, MapPin, Tag } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchFIRs, type FIR } from '@/lib/api/firApi'
import { RegisterFIRModal } from './RegisterFIRModal'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export default function FIRPage() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedFIR, setSelectedFIR] = useState<FIR | null>(null)
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const router = useRouter()

  const { data: firs = [], isLoading, refetch } = useQuery({
    queryKey: ['firs'],
    queryFn: () => fetchFIRs(),
  })

  const filtered = useMemo(() => {
    return firs.filter((fir: FIR) => {
      const matchesSearch = !search || 
        fir.description?.toLowerCase().includes(search.toLowerCase()) || 
        fir.id?.toLowerCase().includes(search.toLowerCase()) ||
        fir.fir_number?.toLowerCase().includes(search.toLowerCase()) ||
        fir.crime_type?.toLowerCase().includes(search.toLowerCase())
      
      const matchesStatus = statusFilter === 'ALL' || fir.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [firs, search, statusFilter]);

  const handleExportCSV = () => {
    if (!filtered.length) {
      toast.error('No FIRs available to export')
      return
    }
    const headers = 'FIR_ID,Date,Crime_Type,Status,Priority,Location,Description\n'
    const rows = filtered.map(f => `"${f.fir_number}","${f.date_filed}","${f.crime_type}","${f.status}","${f.priority}","${f.location_text || ''}","${(f.description || '').replace(/"/g, '""')}"`).join('\n')
    const blob = new Blob([headers + rows], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `NETRA_FIR_Export_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`
    a.click()
    toast.success(`Exported ${filtered.length} FIR records to CSV`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <FileText className="w-6 h-6 text-brand-400" />
            FIR Database
          </h1>
          <p className="text-text-secondary mt-1">Search, view, and manage First Information Reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="btn-secondary px-3 py-2 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-primary px-3 py-2 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Register FIR
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-bg-elevated border border-border-default rounded-xl p-4 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search by FIR ID, Type, Description..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-secondary">
            <Filter className="w-3.5 h-3.5" />
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-text-primary outline-none cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="OPEN">Open</option>
              <option value="INVESTIGATING">Investigating</option>
              <option value="CHARGE_SHEETED">Charge Sheeted</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-bg-surface/50 backdrop-blur-xl border border-border-default rounded-xl overflow-hidden shadow-2xl min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-base/80 border-b border-border-strong text-[10px] font-bold tracking-[0.1em] uppercase text-text-tertiary">
                <th className="px-6 py-4">FIR ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-tertiary">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-brand-500" />
                    <p className="text-xs font-medium tracking-wide">Loading intelligence data...</p>
                  </td>
                </tr>
              ) : filtered.map((fir: FIR) => (
                <tr key={fir.id} className="hover:bg-bg-elevated/40 transition-colors group">
                  <td className="px-6 py-4 text-xs font-mono font-bold text-brand-400 whitespace-nowrap group-hover:text-brand-300 transition-colors">{fir.fir_number}</td>
                  <td className="px-6 py-4 text-xs font-medium text-text-secondary whitespace-nowrap">
                    {fir.date_filed ? format(new Date(fir.date_filed), 'yyyy-MM-dd') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-white tracking-wide">{fir.crime_type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded border ${
                      fir.status === 'OPEN' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]' :
                      fir.status === 'INVESTIGATING' ? 'bg-brand-500/10 text-brand-400 border-brand-500/30 shadow-[0_0_10px_rgba(59,130,246,0.1)]' :
                      fir.status === 'CHARGE_SHEETED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.1)]' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                    }`}>
                      {fir.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded border inline-flex items-center gap-1.5 ${
                      fir.priority === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' :
                      fir.priority === 'HIGH' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                      fir.priority === 'NORMAL' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
                      'bg-gray-500/10 text-gray-400 border-gray-500/30'
                    }`}>
                      {fir.priority === 'CRITICAL' && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />}
                      {fir.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-text-secondary max-w-[200px] truncate">
                    {fir.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right relative">
                    <button 
                      onClick={() => setActiveMenuId(activeMenuId === fir.id ? null : fir.id)}
                      className="p-1.5 text-text-tertiary hover:text-white rounded transition-colors hover:bg-bg-surface border border-transparent hover:border-border-strong"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                    {activeMenuId === fir.id && (
                      <div className="absolute right-6 top-12 z-30 bg-bg-surface border border-border-strong rounded-xl shadow-2xl p-1.5 w-44 text-left flex flex-col gap-1 backdrop-blur-xl">
                        <button 
                          onClick={() => { setSelectedFIR(fir); setActiveMenuId(null); }}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-primary hover:bg-brand-500/10 hover:text-brand-400 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Case Details
                        </button>
                        <button 
                          onClick={() => { router.push('/dashboard/timeline'); setActiveMenuId(null); }}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-primary hover:bg-brand-500/10 hover:text-brand-400 rounded-lg transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" /> View Case Timeline
                        </button>
                        <button 
                          onClick={() => { router.push('/dashboard/reports'); setActiveMenuId(null); }}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-text-primary hover:bg-purple-500/10 hover:text-purple-400 rounded-lg transition-colors"
                        >
                          <FileCheck className="w-3.5 h-3.5" /> Generate Court Report
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-text-tertiary">
                    <FileText className="w-8 h-8 mx-auto mb-3 opacity-20" />
                    <p className="text-xs font-medium tracking-wide">No FIRs found matching &quot;{search}&quot;</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border-strong bg-bg-base/50">
          <p className="text-[10px] font-bold tracking-wider uppercase text-text-tertiary">Showing {filtered.length ? 1 : 0} to {filtered.length} of {filtered.length} entries</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs border border-brand-500/50 bg-brand-500/20 rounded text-brand-400 font-bold shadow-glow-sm">1</button>
          </div>
        </div>
      </div>

      {/* FIR Detail Modal */}
      {selectedFIR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-bg-surface border border-border-strong rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-bg-elevated/50">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">{selectedFIR.fir_number}</h3>
                  <p className="text-xs text-text-secondary">{selectedFIR.crime_type} Case</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedFIR(null)}
                className="p-1.5 text-text-tertiary hover:text-white rounded-lg hover:bg-bg-base transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-bg-base/60 p-4 rounded-xl border border-border-subtle">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary flex items-center gap-1"><Tag className="w-3 h-3" /> Status</span>
                  <span className="text-xs font-bold text-brand-400 block mt-1">{selectedFIR.status}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Priority</span>
                  <span className="text-xs font-bold text-amber-400 block mt-1">{selectedFIR.priority}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary flex items-center gap-1"><Calendar className="w-3 h-3" /> Date Filed</span>
                  <span className="text-xs font-bold text-white block mt-1">{selectedFIR.date_filed ? format(new Date(selectedFIR.date_filed), 'yyyy-MM-dd') : 'N/A'}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary flex items-center gap-1"><MapPin className="w-3 h-3" /> Location</span>
                  <span className="text-xs font-bold text-white block mt-1 truncate">{selectedFIR.location_text || 'Bengaluru'}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase font-bold tracking-wider text-text-tertiary mb-2">Description & Incident Details</h4>
                <div className="p-4 rounded-xl bg-bg-base border border-border-subtle text-sm text-text-primary leading-relaxed">
                  {selectedFIR.description || 'No description provided.'}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => { router.push('/dashboard/timeline'); setSelectedFIR(null); }}
                  className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
                >
                  <FileText className="w-4 h-4" /> View Full Case Timeline
                </button>
                <button 
                  onClick={() => { router.push('/dashboard/reports'); setSelectedFIR(null); }}
                  className="flex-1 btn-secondary py-2.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
                >
                  <FileCheck className="w-4 h-4" /> Court Report Generator
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <RegisterFIRModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => refetch()}
      />
    </div>
  )
}
