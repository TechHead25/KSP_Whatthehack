'use client'

import { useState } from 'react'
import { Users, Search, Filter, ShieldAlert, FileText, ChevronRight } from 'lucide-react'

// Mock Suspects Data
const MOCK_SUSPECTS = [
  { id: 'SUS-901', name: 'Raju Naik', alias: 'Billa', risk: 'Critical', lastSeen: 'Indiranagar Metro', status: 'Wanted' },
  { id: 'SUS-902', name: 'Kiran Kumar', alias: 'KK', risk: 'High', lastSeen: 'Koramangala 4th Block', status: 'Under Surveillance' },
  { id: 'SUS-903', name: 'Syed Ali', alias: 'None', risk: 'Medium', lastSeen: 'Shivajinagar', status: 'Bailed' },
  { id: 'SUS-904', name: 'David Raj', alias: 'Dave', risk: 'Low', lastSeen: 'Whitefield', status: 'Cleared' },
]

export default function DigitalTwinPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_SUSPECTS.filter(sus => 
    sus.name.toLowerCase().includes(search.toLowerCase()) || 
    sus.id.toLowerCase().includes(search.toLowerCase()) ||
    sus.alias.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-400" />
            Digital Twin Profiles
          </h1>
          <p className="text-text-secondary mt-1">AI-generated comprehensive profiles and behavioral tracking of suspects.</p>
        </div>
      </div>

      <div className="bg-bg-elevated border border-border-default rounded-xl p-4 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search by Name, Alias, ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
          <button className="btn-secondary px-3 py-2 flex items-center gap-2 w-full md:w-auto justify-center">
            <Filter className="w-4 h-4" /> Attributes Filter
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(sus => (
          <div key={sus.id} className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden shadow-card hover:border-brand-500/50 transition-colors flex flex-col">
            <div className="p-4 flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-bg-surface border border-border-subtle flex items-center justify-center flex-shrink-0 text-2xl font-bold text-text-tertiary">
                {sus.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-body-lg font-bold text-text-primary truncate">{sus.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                    sus.risk === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    sus.risk === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    sus.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                    'bg-green-500/10 text-green-400 border-green-500/20'
                  }`}>
                    {sus.risk} Risk
                  </span>
                </div>
                <p className="text-body-sm text-text-secondary mt-0.5">Alias: {sus.alias}</p>
                <p className="text-body-xs font-mono text-brand-400 mt-1 opacity-80">{sus.id}</p>
              </div>
            </div>
            <div className="px-4 py-3 bg-bg-surface/50 border-y border-border-subtle flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 text-text-secondary">
                <ShieldAlert className="w-3.5 h-3.5 opacity-70" /> {sus.status}
              </div>
              <div className="text-text-tertiary">
                Last Seen: <span className="text-text-secondary">{sus.lastSeen}</span>
              </div>
            </div>
            <div className="p-4 flex gap-2 mt-auto">
                <button className="flex-1 bg-bg-surface border border-border-subtle hover:border-brand-500/40 hover:bg-brand-500/5 text-text-primary text-xs py-1.5 rounded transition-colors flex items-center justify-center gap-1.5 w-full">
                  <FileText className="w-3.5 h-3.5" /> Dossier
                </button>
                <button className="flex-1 bg-brand-600 hover:bg-brand-500 text-white text-xs py-1.5 rounded transition-colors flex items-center justify-center gap-1.5 font-medium shadow-[0_0_10px_rgba(37,99,235,0.2)] w-full">
                  <ChevronRight className="w-3.5 h-3.5" /> View Twin
                </button>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="py-12 text-center text-text-tertiary bg-bg-elevated border border-border-default rounded-xl border-dashed">
          <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No profiles found matching "{search}"</p>
        </div>
      )}
    </div>
  )
}
