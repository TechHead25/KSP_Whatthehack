'use client'

import { useState } from 'react'
import { GitCommitHorizontal, FileText, Calendar, User, Search } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchFIRs, type FIR } from '@/lib/api/firApi'
import { format } from 'date-fns'

interface TimelineEvent {
  id: string
  title: string
  date: string
  time: string
  category: 'REGISTRATION' | 'EVIDENCE' | 'SUSPECT' | 'PATROL' | 'CHARGE_SHEET'
  description: string
  actor: string
}

export default function TimelinePage() {
  const { data: firs = [], isLoading } = useQuery({
    queryKey: ['firs'],
    queryFn: () => fetchFIRs(),
  })

  const [selectedFirId, setSelectedFirId] = useState<string>('')
  const [search, setSearch] = useState('')

  const activeFIR = firs.find((f: FIR) => f.id === selectedFirId || f.fir_number === selectedFirId) || firs[0]

  // Generate realistic milestones for the selected FIR
  const timelineEvents: TimelineEvent[] = activeFIR ? [
    {
      id: 'evt-1',
      title: 'Incident Occurred',
      date: activeFIR.date_incident ? format(new Date(activeFIR.date_incident), 'yyyy-MM-dd') : '2026-07-20',
      time: '02:30 AM',
      category: 'REGISTRATION',
      description: `Reported incident at ${activeFIR.location_text || 'Bengaluru'}. ${activeFIR.description || 'Crime reported by station officer.'}`,
      actor: 'Victim Statement',
    },
    {
      id: 'evt-2',
      title: `FIR Registered: ${activeFIR.fir_number}`,
      date: activeFIR.date_filed ? format(new Date(activeFIR.date_filed), 'yyyy-MM-dd') : '2026-07-20',
      time: '04:15 AM',
      category: 'REGISTRATION',
      description: `Formal FIR registered under Sections 379/420 IPC. Investigating Officer assigned.`,
      actor: 'Station House Officer',
    },
    {
      id: 'evt-3',
      title: 'Forensic Evidence Collected',
      date: activeFIR.date_filed ? format(new Date(activeFIR.date_filed), 'yyyy-MM-dd') : '2026-07-21',
      time: '11:00 AM',
      category: 'EVIDENCE',
      description: 'CCTV footage retrieved from nearby surveillance cameras. Fingerprint dust samples sent to forensic lab.',
      actor: 'Forensic Analyst Team',
    },
    {
      id: 'evt-4',
      title: 'Suspect Linked via AI Graph',
      date: activeFIR.date_filed ? format(new Date(activeFIR.date_filed), 'yyyy-MM-dd') : '2026-07-22',
      time: '03:45 PM',
      category: 'SUSPECT',
      description: 'NETRA AI Criminal Graph identified matching MO with suspect Raju Naik (SUS-901).',
      actor: 'NETRA AI Intelligence Engine',
    },
    {
      id: 'evt-5',
      title: `Current Status: ${activeFIR.status}`,
      date: 'Today',
      time: 'Just now',
      category: activeFIR.status === 'CHARGE_SHEETED' ? 'CHARGE_SHEET' : 'PATROL',
      description: `Case priority level set to ${activeFIR.priority}. Investigation in active progress.`,
      actor: 'Investigating Officer',
    },
  ] : []

  const filteredFirs = firs.filter((f: FIR) => 
    !search || f.fir_number.toLowerCase().includes(search.toLowerCase()) || f.crime_type.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <GitCommitHorizontal className="w-6 h-6 text-brand-400" />
            Case Investigation Timeline
          </h1>
          <p className="text-text-secondary mt-1">Chronological milestone tracker and evidence chain of custody.</p>
        </div>
      </div>

      {/* Main Split Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: FIR Case Selector (4 cols) */}
        <div className="lg:col-span-4 bg-bg-surface/50 backdrop-blur-xl border border-border-default rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-text-tertiary flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-400" /> Select Case FIR ({filteredFirs.length})
          </h3>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input 
              type="text"
              placeholder="Filter FIRs by Number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-bg-base border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-xs text-text-primary focus:ring-2 focus:ring-brand-500 outline-none"
            />
          </div>

          <div className="space-y-2 overflow-y-auto max-h-[550px] pr-1">
            {isLoading ? (
              <div className="py-8 text-center text-xs text-text-tertiary">Loading FIR cases...</div>
            ) : filteredFirs.map((f: FIR) => {
              const isSelected = activeFIR?.id === f.id
              return (
                <div 
                  key={f.id}
                  onClick={() => setSelectedFirId(f.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-brand-500/10 border-brand-500/50 shadow-glow-sm' 
                      : 'bg-bg-base/60 border-border-subtle hover:border-brand-500/30 hover:bg-bg-elevated/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-mono text-xs font-bold text-brand-400">{f.fir_number}</span>
                    <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded border ${
                      f.status === 'OPEN' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                      f.status === 'INVESTIGATING' ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>{f.status}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">{f.crime_type}</h4>
                  <p className="text-[11px] text-text-secondary truncate">{f.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Side: Timeline Display (8 cols) */}
        <div className="lg:col-span-8 bg-bg-surface/50 backdrop-blur-xl border border-border-default rounded-2xl p-6 shadow-2xl flex flex-col gap-6">
          {activeFIR ? (
            <>
              {/* FIR Case Summary Card */}
              <div className="bg-bg-base/80 p-5 rounded-xl border border-border-strong flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border bg-brand-500/10 text-brand-400 border-brand-500/30">
                      {activeFIR.crime_type}
                    </span>
                    <span className="text-xs font-mono text-text-tertiary">Filed: {activeFIR.date_filed ? format(new Date(activeFIR.date_filed), 'yyyy-MM-dd') : 'N/A'}</span>
                  </div>
                  <h2 className="text-xl font-black text-white tracking-tight">{activeFIR.fir_number} Case File</h2>
                  <p className="text-xs text-text-secondary mt-1">{activeFIR.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded border bg-amber-500/10 text-amber-400 border-amber-500/30">
                    Priority: {activeFIR.priority}
                  </span>
                </div>
              </div>

              {/* Chronological Timeline Stream */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-brand-500 before:via-purple-500 before:to-emerald-500">
                {timelineEvents.map((event) => (
                  <div key={event.id} className="relative flex items-start gap-4 group">
                    {/* Node Dot */}
                    <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-bg-base border-2 border-brand-500 flex items-center justify-center shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                    </div>

                    {/* Content Box */}
                    <div className="flex-1 bg-bg-base/60 border border-border-subtle p-4 rounded-xl hover:border-brand-500/40 transition-colors">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1 mb-2">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          {event.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] font-mono text-text-tertiary">
                          <Calendar className="w-3 h-3 text-brand-400" /> {event.date} at {event.time}
                        </div>
                      </div>

                      <p className="text-xs text-text-secondary leading-relaxed mb-3">{event.description}</p>

                      <div className="flex items-center justify-between text-[11px] font-medium text-text-tertiary pt-2 border-t border-border-subtle/50">
                        <span className="flex items-center gap-1"><User className="w-3 h-3 text-purple-400" /> {event.actor}</span>
                        <span className="px-2 py-0.5 rounded bg-bg-surface text-brand-400 font-bold uppercase tracking-wider text-[9px] border border-border-subtle">
                          {event.category}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="py-16 text-center text-text-tertiary">
              <GitCommitHorizontal className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">Select an FIR from the list to view its investigation timeline.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
