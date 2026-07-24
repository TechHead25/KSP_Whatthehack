'use client'

import { useState } from 'react'
import { Navigation, MapPin, Clock, Users, Shield, Send, CheckCircle2, Radio, Layers, Plus, UserCheck, X } from 'lucide-react'
import { toast } from 'sonner'
import { useSyncStore, type PatrolDispatchItem } from '@/lib/stores/syncStore'
import { useAuthStore } from '@/lib/stores/authStore'

const REGISTERED_OFFICERS = [
  { badgeNumber: 'INSP-BLR-0001', name: 'Inspector Rajesh Kumar', rank: 'Inspector' },
  { badgeNumber: 'DYSP-BLR-0001', name: 'DySP Priya Nair', rank: 'DySP' },
  { badgeNumber: 'COMM-KA-0001', name: 'Commissioner Demo', rank: 'Commissioner' },
  { badgeNumber: 'KA-1002', name: 'Constable Viraj', rank: 'Constable' },
]

export default function PatrolPage() {
  const currentOfficer = useAuthStore(s => s.officer)
  const dispatches = useSyncStore(s => s.dispatches)
  const dispatchPatrol = useSyncStore(s => s.dispatchPatrol)
  const updatePatrolStatus = useSyncStore(s => s.updatePatrolStatus)

  const [selectedDispatch, setSelectedDispatch] = useState<PatrolDispatchItem>(dispatches[0] || {
    id: 'DSP-01',
    unit: 'Hoysala 12',
    area: 'Indiranagar 100ft Road',
    officerBadge: 'INSP-BLR-0001',
    officerName: 'Inspector Rajesh Kumar',
    dispatchedBy: 'Commissioner Demo',
    shiftTime: '22:00 - 02:00',
    risk: 'High',
    status: 'DISPATCHED',
    lat: 12.9784,
    lng: 77.6408,
    waypoints: ['Indiranagar Metro', '100ft Road Junction', 'CMH Road'],
    timestamp: new Date().toISOString()
  })

  const [mapLayer, setMapLayer] = useState<'STREET' | 'SATELLITE'>('STREET')
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false)

  // Dispatch Form State
  const [targetUnit, setTargetUnit] = useState('Hoysala 12')
  const [targetArea, setTargetArea] = useState('Koramangala 4th Block')
  const [assignedBadge, setAssignedBadge] = useState('INSP-BLR-0001')
  const [shiftTime, setShiftTime] = useState('22:00 - 02:00')
  const [riskLevel, setRiskLevel] = useState<'Critical' | 'High' | 'Medium' | 'Low'>('High')

  // Filter duty for current logged in officer (or show top active dispatch)
  const myAssignedDuties = dispatches.filter(d => 
    !currentOfficer || d.officerBadge.toLowerCase() === currentOfficer.badge_number.toLowerCase() || d.officerName.toLowerCase().includes(currentOfficer.name?.toLowerCase() || '')
  )

  const handleCreateDispatch = (e: React.FormEvent) => {
    e.preventDefault()
    const officerObj = REGISTERED_OFFICERS.find(o => o.badgeNumber === assignedBadge) || REGISTERED_OFFICERS[0]

    dispatchPatrol({
      unit: targetUnit,
      area: targetArea,
      officerBadge: officerObj.badgeNumber,
      officerName: officerObj.name,
      dispatchedBy: currentOfficer?.name || 'Inspector Demo',
      shiftTime,
      risk: riskLevel,
      status: 'DISPATCHED',
      lat: targetArea.includes('Koramangala') ? 12.9352 : targetArea.includes('Indiranagar') ? 12.9784 : 12.9857,
      lng: targetArea.includes('Koramangala') ? 77.6245 : targetArea.includes('Indiranagar') ? 77.6408 : 77.6057,
      waypoints: [targetArea, 'Main Junction', 'Patrol Checkpoint']
    })

    toast.success(`Dispatched ${targetUnit} (${officerObj.name}) to ${targetArea}! Real-time alert broadcasted.`)
    setIsDispatchModalOpen(false)
  }

  const handleStatusChange = (id: string, newStatus: PatrolDispatchItem['status']) => {
    updatePatrolStatus(id, newStatus)
    toast.success(`Patrol status updated to ${newStatus}. Broadcasted to all command sessions.`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Navigation className="w-6 h-6 text-brand-400" />
            Patrol Dispatch & Real-Time Shift Operations
          </h1>
          <p className="text-text-secondary mt-1">Real-time cross-session patrol deployment and officer shift tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsDispatchModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all"
          >
            <Plus className="w-4 h-4" /> Assign Officer to Patrol
          </button>
          <button 
            onClick={() => setMapLayer(l => l === 'STREET' ? 'SATELLITE' : 'STREET')}
            className="btn-secondary px-3 py-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <Layers className="w-4 h-4 text-brand-400" /> Mode: {mapLayer}
          </button>
        </div>
      </div>

      {/* Officer Patrol Duty Deck (Visible for Duty Officers) */}
      <div className="bg-gradient-to-r from-brand-950/40 via-bg-surface to-bg-elevated border border-brand-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white uppercase tracking-wide">
                Patrol Officer Active Duty Deck
              </h2>
              <p className="text-xs text-text-secondary">
                Logged Officer: <strong className="text-brand-300">{currentOfficer?.name || 'Inspector Rajesh Kumar'}</strong> ({currentOfficer?.badge_number || 'INSP-BLR-0001'})
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Realtime Sync Active
          </span>
        </div>

        {/* Assigned Shift Card */}
        {myAssignedDuties.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-bg-base/80 p-5 rounded-xl border border-border-subtle">
            <div className="lg:col-span-2 space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded border bg-purple-500/20 text-purple-300 border-purple-500/40">
                  Unit: {myAssignedDuties[0].unit}
                </span>
                <span className="text-xs font-bold text-amber-400 uppercase">{myAssignedDuties[0].risk} Risk Zone</span>
                <span className="text-xs text-text-tertiary font-mono">Dispatched by: {myAssignedDuties[0].dispatchedBy}</span>
              </div>
              <h3 className="text-lg font-black text-white">{myAssignedDuties[0].area}</h3>
              <p className="text-xs text-text-secondary font-medium">
                Shift Window: <span className="text-white font-mono">{myAssignedDuties[0].shiftTime}</span> · Status: <strong className="text-brand-400">{myAssignedDuties[0].status}</strong>
              </p>
            </div>

            {/* Interactive Status Actions */}
            <div className="flex flex-col justify-center gap-2 border-t lg:border-t-0 lg:border-l border-border-subtle pt-3 lg:pt-0 lg:pl-4">
              <span className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest">Update Patrol Shift Status</span>
              {myAssignedDuties[0].status === 'DISPATCHED' && (
                <button 
                  onClick={() => handleStatusChange(myAssignedDuties[0].id, 'EN_ROUTE')}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-sm"
                >
                  <Send className="w-3.5 h-3.5" /> 1. Mark En-Route
                </button>
              )}
              {myAssignedDuties[0].status === 'EN_ROUTE' && (
                <button 
                  onClick={() => handleStatusChange(myAssignedDuties[0].id, 'ARRIVED')}
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-sm"
                >
                  <MapPin className="w-3.5 h-3.5" /> 2. Mark Arrived at Spot
                </button>
              )}
              {myAssignedDuties[0].status === 'ARRIVED' && (
                <button 
                  onClick={() => handleStatusChange(myAssignedDuties[0].id, 'COMPLETED')}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> 3. Complete Patrol Shift
                </button>
              )}
              {myAssignedDuties[0].status === 'COMPLETED' && (
                <div className="w-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 py-2 rounded-lg text-xs font-bold text-center uppercase tracking-wider">
                  ✓ Shift Completed & Logged
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-bg-base/60 rounded-xl text-center text-text-tertiary text-xs">
            No active patrol shift currently assigned to your badge. Higher officers can dispatch duties using the button above.
          </div>
        )}
      </div>

      {/* Main Grid: Interactive OpenStreetMap GIS Canvas + Active Deployments Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Interactive Map View (8 cols) */}
        <div className="lg:col-span-8 bg-bg-surface/50 backdrop-blur-xl border border-border-default rounded-2xl shadow-2xl overflow-hidden p-1 flex flex-col min-h-[550px] relative">
          <div className="w-full flex-1 rounded-xl border border-border-subtle overflow-hidden relative bg-[#0a0f1d]">
            <iframe 
              title="Bengaluru GIS Patrol Route Map"
              width="100%" 
              height="100%" 
              className="w-full h-full border-0 min-h-[520px] opacity-90 contrast-125 saturate-150 filter invert-[0.9] hue-rotate-180"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=77.5500%2C12.9000%2C77.7200%2C13.0100&layer=mapnik&marker=${selectedDispatch.lat}%2C${selectedDispatch.lng}`}
            />

            {/* Floating Live Telemetry Overlay */}
            <div className="absolute top-6 left-6 z-20 bg-bg-surface/90 backdrop-blur-xl border border-border-strong p-4 rounded-xl shadow-glass w-80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-brand-400 animate-pulse" /> GIS Patrol Telemetry
                </span>
                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded border ${
                  selectedDispatch.status === 'ARRIVED' || selectedDispatch.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-brand-500/20 text-brand-400 border-brand-500/40'
                }`}>
                  {selectedDispatch.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{selectedDispatch.area}</h3>

              <div className="space-y-1.5 text-xs text-text-secondary font-medium">
                <div className="flex justify-between border-b border-border-subtle/50 pb-1">
                  <span>Assigned Unit:</span>
                  <span className="text-white font-bold">{selectedDispatch.unit}</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle/50 pb-1">
                  <span>Officer Assigned:</span>
                  <span className="text-purple-300 font-bold">{selectedDispatch.officerName}</span>
                </div>
                <div className="flex justify-between border-b border-border-subtle/50 pb-1">
                  <span>Shift Window:</span>
                  <span className="text-white font-mono">{selectedDispatch.shiftTime}</span>
                </div>
                <div className="flex justify-between pt-0.5">
                  <span>GPS Coordinates:</span>
                  <span className="text-brand-300 font-mono">{selectedDispatch.lat.toFixed(4)}, {selectedDispatch.lng.toFixed(4)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Active Deployments Feed (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <h3 className="font-bold text-text-primary text-sm flex items-center gap-2 px-1">
            <Shield className="w-4 h-4 text-brand-400" /> Active System Dispatches ({dispatches.length})
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[550px] pr-1">
            {dispatches.map(p => {
              const isSelected = selectedDispatch.id === p.id
              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedDispatch(p)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-brand-500/10 border-brand-500/50 shadow-glow-sm' 
                      : 'bg-bg-elevated/60 border-border-default hover:border-brand-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-white text-sm flex items-start gap-1.5">
                      <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> {p.area}
                    </h4>
                    <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded border ${
                      p.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      p.risk === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>{p.status}</span>
                  </div>

                  <p className="text-xs text-purple-300 font-medium mb-2">Officer: {p.officerName} ({p.officerBadge})</p>

                  <div className="flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-border-subtle/50">
                    <div className="flex items-center gap-1 font-mono"><Clock className="w-3.5 h-3.5 text-text-tertiary" /> {p.shiftTime}</div>
                    <div className="flex items-center gap-1 font-semibold text-white"><Users className="w-3.5 h-3.5 text-brand-400" /> {p.unit}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modal: Inspector / Admin Officer Dispatch */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-bg-surface border border-border-strong rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-bg-elevated/80">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Navigation className="w-5 h-5 text-purple-400" /> Dispatch Patrol to Officer
              </h3>
              <button onClick={() => setIsDispatchModalOpen(false)} className="text-text-tertiary hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDispatch} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Select Patrol Unit</label>
                <select 
                  value={targetUnit} 
                  onChange={(e) => setTargetUnit(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="Hoysala 12">Hoysala 12</option>
                  <option value="Cheetah 4">Cheetah 4</option>
                  <option value="Hoysala 08">Hoysala 08</option>
                  <option value="Traffic Unit B">Traffic Unit B</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Assign Officer</label>
                <select 
                  value={assignedBadge} 
                  onChange={(e) => setAssignedBadge(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  {REGISTERED_OFFICERS.map(o => (
                    <option key={o.badgeNumber} value={o.badgeNumber}>
                      {o.name} ({o.badgeNumber}) - {o.rank}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Target Patrol Sector / Area</label>
                <select 
                  value={targetArea} 
                  onChange={(e) => setTargetArea(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="Koramangala 4th Block">Koramangala 4th Block</option>
                  <option value="Indiranagar 100ft Road">Indiranagar 100ft Road</option>
                  <option value="Shivajinagar Bus Stand">Shivajinagar Bus Stand</option>
                  <option value="MG Road Junction">MG Road Junction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Shift Time Window</label>
                <input 
                  type="text"
                  value={shiftTime}
                  onChange={(e) => setShiftTime(e.target.value)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-1">Risk Assessment</label>
                <select 
                  value={riskLevel} 
                  onChange={(e) => setRiskLevel(e.target.value as any)}
                  className="w-full bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-white outline-none"
                >
                  <option value="Critical">Critical Risk</option>
                  <option value="High">High Risk</option>
                  <option value="Medium">Medium Risk</option>
                  <option value="Low">Low Risk</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
                <button type="button" onClick={() => setIsDispatchModalOpen(false)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                  <Send className="w-4 h-4" /> Broadcast Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
