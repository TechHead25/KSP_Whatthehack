'use client'

import { useState } from 'react'
import { Search, Image as ImageIcon, File, Video, Filter, Grid, List, MoreVertical, ShieldCheck, Upload } from 'lucide-react'
import { toast } from 'sonner'


// Mock Evidence Data
const MOCK_EVIDENCE = [
  { id: 'EVD-2026-001', type: 'image', name: 'Crime_Scene_Photo_01.jpg', size: '2.4 MB', date: '2026-07-20', caseId: 'FIR-2026-001', tag: 'Verified', url: 'https://picsum.photos/400/300?random=1' },
  { id: 'EVD-2026-002', type: 'video', name: 'CCTV_Footage_Metro.mp4', size: '45.2 MB', date: '2026-07-18', caseId: 'FIR-2026-003', tag: 'Under Review', url: 'https://www.w3schools.com/html/mov_bbb.mp4' },
  { id: 'EVD-2026-003', type: 'document', name: 'Forensic_Report_A.pdf', size: '1.1 MB', date: '2026-07-16', caseId: 'FIR-2026-004', tag: 'Verified' },
  { id: 'EVD-2026-004', type: 'image', name: 'Suspect_Vehicle_Plate.png', size: '3.8 MB', date: '2026-07-15', caseId: 'FIR-2026-004', tag: 'Pending', url: 'https://picsum.photos/400/300?random=2' },
  { id: 'EVD-2026-005', type: 'document', name: 'Witness_Statement_02.docx', size: '0.5 MB', date: '2026-07-13', caseId: 'FIR-2026-005', tag: 'Verified' },
]

export default function EvidencePage() {
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  const filtered = MOCK_EVIDENCE.filter(ev => 
    ev.name.toLowerCase().includes(search.toLowerCase()) || 
    ev.caseId.toLowerCase().includes(search.toLowerCase())
  )

  const getIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="w-8 h-8 text-blue-400" />
      case 'video': return <Video className="w-8 h-8 text-purple-400" />
      case 'document': return <File className="w-8 h-8 text-emerald-400" />
      default: return <File className="w-8 h-8 text-gray-400" />
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Search className="w-6 h-6 text-brand-400" />
            Evidence Explorer
          </h1>
          <p className="text-text-secondary mt-1">Secure repository for digital evidence, reports, and media.</p>
        </div>
        <button 
          onClick={() => toast.success("Upload modal opened.")}
          className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-glow-sm">
          <Upload className="w-4 h-4" /> Upload Evidence
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-bg-elevated p-3 border border-border-default rounded-xl shadow-card">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search evidence by name, case ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button className="btn-secondary px-3 py-2 flex items-center gap-2 flex-1 md:flex-none justify-center">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <div className="flex items-center border border-border-subtle rounded-lg bg-bg-surface overflow-hidden">
            <button 
              onClick={() => setView('grid')}
              className={`p-2 transition-colors ${view === 'grid' ? 'bg-brand-500/20 text-brand-400' : 'text-text-tertiary hover:text-text-primary hover:bg-bg-overlay'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-2 transition-colors ${view === 'list' ? 'bg-brand-500/20 text-brand-400' : 'text-text-tertiary hover:text-text-primary hover:bg-bg-overlay'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(ev => (
            <div key={ev.id} className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden hover:border-brand-500/50 transition-all shadow-card group cursor-pointer flex flex-col">
              <div className="h-40 bg-bg-surface/50 flex items-center justify-center border-b border-border-subtle relative group-hover:bg-bg-surface transition-colors overflow-hidden">
                {ev.type === 'image' && ev.url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={ev.url} alt={ev.name} className="w-full h-full object-cover" />
                ) : ev.type === 'video' && ev.url ? (
                  <video src={ev.url} className="w-full h-full object-cover" controls={false} muted loop onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => e.currentTarget.pause()} />
                ) : (
                  getIcon(ev.type)
                )}
                {ev.tag === 'Verified' && (
                  <div className="absolute top-2 right-2 text-green-400 bg-green-500/10 rounded-full p-1 border border-green-500/20 shadow-sm backdrop-blur-sm" title="Chain of Custody Verified">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <div className="p-3 flex flex-col flex-1">
                <h3 className="text-body-sm font-medium text-text-primary truncate" title={ev.name}>{ev.name}</h3>
                <p className="text-xs text-text-tertiary mt-0.5">{ev.size} • {ev.date}</p>
                <div className="mt-auto pt-3 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-brand-400 bg-brand-500/10 px-1.5 py-0.5 rounded border border-brand-500/20">{ev.caseId}</span>
                  <button className="text-text-tertiary hover:text-text-primary transition-colors"><MoreVertical className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden shadow-card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-surface border-b border-border-subtle">
                <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Date Added</th>
                <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider">Linked Case</th>
                <th className="px-6 py-3 text-xs font-semibold text-text-tertiary uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {filtered.map(ev => (
                <tr key={ev.id} className="hover:bg-bg-overlay/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-bg-surface flex items-center justify-center border border-border-subtle flex-shrink-0">
                        {ev.type === 'image' && <ImageIcon className="w-4 h-4 text-blue-400" />}
                        {ev.type === 'video' && <Video className="w-4 h-4 text-purple-400" />}
                        {ev.type === 'document' && <File className="w-4 h-4 text-emerald-400" />}
                      </div>
                      <span className="text-sm font-medium text-text-primary">{ev.name}</span>
                      {ev.tag === 'Verified' && <span title="Verified"><ShieldCheck className="w-3.5 h-3.5 text-green-400 ml-1" /></span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary capitalize">{ev.type}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">{ev.size}</td>
                  <td className="px-6 py-4 text-sm text-text-secondary whitespace-nowrap">{ev.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2 py-1 rounded border border-brand-500/20">{ev.caseId}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => toast.success("Options menu opened.")}
                      className="p-1.5 text-text-tertiary hover:text-text-primary rounded-md transition-colors hover:bg-bg-overlay">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {filtered.length === 0 && (
        <div className="py-12 text-center text-text-tertiary bg-bg-elevated border border-border-default rounded-xl border-dashed">
          <Search className="w-8 h-8 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No evidence found matching &quot;{search}&quot;</p>
        </div>
      )}
    </div>
  )
}
