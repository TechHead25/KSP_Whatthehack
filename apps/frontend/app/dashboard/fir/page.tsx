'use client'

import { useState, useMemo } from 'react'
import { FileText, Search, Filter, Download, Plus, MoreHorizontal, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchFIRs, type FIR } from '@/lib/api/firApi'
import { RegisterFIRModal } from './RegisterFIRModal'
import { format } from 'date-fns'

export default function FIRPage() {
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: firs = [], isLoading, refetch } = useQuery({
    queryKey: ['firs'],
    queryFn: () => fetchFIRs(),
  })

  const filtered = useMemo(() => {
    if (!search) return firs;
    const lowerSearch = search.toLowerCase();
    return firs.filter((fir: FIR) => 
      fir.description?.toLowerCase().includes(lowerSearch) || 
      fir.id?.toLowerCase().includes(lowerSearch) ||
      fir.fir_number?.toLowerCase().includes(lowerSearch)
    )
  }, [firs, search]);

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
          <button className="btn-secondary px-3 py-2 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
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
            placeholder="Search by FIR ID, Title, or Suspect..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary focus:ring-2 focus:ring-brand-500 outline-none transition-shadow"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="btn-secondary px-3 py-2 flex items-center gap-2 w-full md:w-auto justify-center">
            <Filter className="w-4 h-4" /> Advanced Filters
          </button>
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
                    {format(new Date(fir.date_filed), 'yyyy-MM-dd')}
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
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className="p-1.5 text-text-tertiary hover:text-white rounded transition-colors hover:bg-bg-surface border border-transparent hover:border-border-strong">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
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
        
        {/* Pagination Dummy */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-border-strong bg-bg-base/50">
          <p className="text-[10px] font-bold tracking-wider uppercase text-text-tertiary">Showing {Math.min(1, filtered.length)} to {filtered.length} of {filtered.length} entries</p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 text-xs font-bold border border-border-strong rounded text-text-tertiary hover:bg-bg-surface hover:text-white transition-colors">Prev</button>
            <button className="px-3 py-1.5 text-xs border border-brand-500/50 bg-brand-500/20 rounded text-brand-400 font-bold shadow-glow-sm">1</button>
            <button className="px-3 py-1.5 text-xs font-bold border border-border-strong rounded text-text-tertiary hover:bg-bg-surface hover:text-white transition-colors">Next</button>
          </div>
        </div>
      </div>

      <RegisterFIRModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => refetch()}
      />
    </div>
  )
}
