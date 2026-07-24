'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Map, Filter, ZoomIn, ZoomOut, Maximize2, RefreshCw, Crosshair, ShieldAlert, Layers } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface HotspotPoint {
  id: string
  name: string
  category: 'Theft' | 'Assault' | 'Cyber' | 'Narcotics'
  risk: 'Critical' | 'High' | 'Medium' | 'Low'
  incidents: number
  lat: number
  lng: number
  x: number // percentage for vector canvas
  y: number
}

const CRIME_HOTSPOTS: HotspotPoint[] = [
  { id: 'HS-01', name: 'Indiranagar 100ft Rd', category: 'Theft', risk: 'High', incidents: 42, lat: 12.9784, lng: 77.6408, x: 45, y: 35 },
  { id: 'HS-02', name: 'Koramangala 4th Block', category: 'Theft', risk: 'Critical', incidents: 89, lat: 12.9352, lng: 77.6245, x: 55, y: 62 },
  { id: 'HS-03', name: 'Whitefield ITPB', category: 'Cyber', risk: 'Medium', incidents: 24, lat: 12.9866, lng: 77.7381, x: 75, y: 30 },
  { id: 'HS-04', name: 'Jayanagar 4th Block', category: 'Assault', risk: 'Low', incidents: 12, lat: 12.9250, lng: 77.5938, x: 32, y: 72 },
  { id: 'HS-05', name: 'Shivajinagar Bus Stand', category: 'Narcotics', risk: 'Critical', incidents: 64, lat: 12.9857, lng: 77.6057, x: 38, y: 25 },
  { id: 'HS-06', name: 'Electronic City Phase 1', category: 'Cyber', risk: 'High', incidents: 38, lat: 12.8452, lng: 77.6602, x: 68, y: 82 },
]

export default function HeatmapPage() {
  const [zoom, setZoom] = useState(1)
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [riskFilter, setRiskFilter] = useState('All')
  const [selectedPoint, setSelectedPoint] = useState<HotspotPoint | null>(null)
  const router = useRouter()

  const filteredPoints = useMemo(() => {
    return CRIME_HOTSPOTS.filter(p => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter
      const matchRisk = riskFilter === 'All' || p.risk === riskFilter
      return matchCat && matchRisk
    })
  }, [categoryFilter, riskFilter])

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Map className="w-5 h-5 text-orange-400" />
            </div>
            Bengaluru Crime Spatial Heatmap
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1 tracking-wide">Live spatial crime density & GIS predictive hotspot telemetry.</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Category Filter */}
          <div className="flex items-center gap-2 bg-bg-surface border border-border-strong rounded-lg px-3 py-2 text-xs text-white">
            <Filter className="w-3.5 h-3.5 text-orange-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent font-bold uppercase outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Theft">Vehicle Theft</option>
              <option value="Assault">Assault</option>
              <option value="Cyber">Cyber Crime</option>
              <option value="Narcotics">Narcotics</option>
            </select>
          </div>

          {/* Risk Level Filter */}
          <div className="flex items-center gap-2 bg-bg-surface border border-border-strong rounded-lg px-3 py-2 text-xs text-white">
            <Layers className="w-3.5 h-3.5 text-orange-400" />
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-transparent font-bold uppercase outline-none cursor-pointer"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical</option>
              <option value="High">High Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          <button 
            onClick={() => toast.success('Re-synchronized GIS crime telemetry with server!')}
            className="bg-orange-600 hover:bg-orange-500 text-white border border-orange-400/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(249,115,22,0.4)] flex items-center gap-2 transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Sync GIS Data
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="flex-1 relative bg-bg-base/80 backdrop-blur-xl border border-border-default rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Zoom Controls */}
        <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 bg-bg-surface/80 backdrop-blur-md border border-border-strong p-2 rounded-xl shadow-glass">
          <button onClick={() => setZoom(z => Math.min(z + 0.3, 2.5))} className="p-2 text-text-secondary hover:text-white hover:bg-bg-elevated rounded-lg transition-colors border border-transparent hover:border-border-strong">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.3, 0.7))} className="p-2 text-text-secondary hover:text-white hover:bg-bg-elevated rounded-lg transition-colors border border-transparent hover:border-border-strong">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(1)} className="p-2 text-text-secondary hover:text-white hover:bg-bg-elevated rounded-lg transition-colors border border-transparent hover:border-border-strong">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 z-20 bg-bg-surface/80 backdrop-blur-md border border-border-strong p-4 rounded-xl shadow-glass text-xs">
          <h4 className="font-bold text-white mb-2 uppercase tracking-widest flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-orange-400" /> Hotspot Density ({filteredPoints.length})
          </h4>
          <div className="space-y-1.5 text-[11px] font-medium text-text-secondary">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-red-600 border border-red-400" /> Critical (&gt;60 incidents)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-orange-500 border border-orange-400" /> High (30-60 incidents)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500 border border-amber-400" /> Medium (15-30 incidents)</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-green-500 border border-green-400" /> Low (&lt;15 incidents)</div>
          </div>
        </div>

        {/* Map Vector Canvas */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-[#050A14] flex items-center justify-center">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '36px 36px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-orange-600/10 rounded-full blur-[140px] pointer-events-none" />

          <motion.div
            className="relative w-full h-full max-w-5xl max-h-[800px] transition-transform duration-300"
            style={{ transform: `scale(${zoom})` }}
          >
            {/* GIS Road Lines Overlay */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10,20 Q50,80 90,20" fill="none" stroke="#f97316" strokeWidth="0.5" />
              <path d="M20,90 Q60,10 80,90" fill="none" stroke="#3b82f6" strokeWidth="0.5" />
              <path d="M0,50 L100,50 M50,0 L50,100" stroke="#64748b" strokeWidth="0.2" strokeDasharray="1 1" />
            </svg>

            {/* Dynamic Hotspot Markers */}
            {filteredPoints.map((point) => {
              const isSelected = selectedPoint?.id === point.id
              return (
                <div
                  key={point.id}
                  onClick={() => setSelectedPoint(point)}
                  style={{ top: `${point.y}%`, left: `${point.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                >
                  {/* Outer Ring */}
                  <div className={`w-12 h-12 rounded-full blur-[4px] animate-pulse flex items-center justify-center border ${isSelected ? 'border-white ring-2 ring-orange-400' : 'border-transparent'} ${
                    point.risk === 'Critical' ? 'bg-red-600/90 shadow-[0_0_20px_rgba(239,68,68,0.8)]' :
                    point.risk === 'High' ? 'bg-orange-500/80 shadow-[0_0_15px_rgba(249,115,22,0.6)]' :
                    point.risk === 'Medium' ? 'bg-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-green-500/80'
                  }`}>
                    <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_8px_white]" />
                  </div>

                  {/* Marker Label */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded bg-bg-surface/90 border border-border-strong text-[10px] font-bold text-white whitespace-nowrap shadow-md">
                    {point.name} ({point.incidents})
                  </div>
                </div>
              )
            })}
          </motion.div>
        </div>

        {/* Selected Hotspot Intelligence Drawer */}
        {selectedPoint && (
          <div className="absolute bottom-6 right-6 z-30 bg-bg-surface/95 backdrop-blur-xl border border-border-strong p-5 rounded-2xl shadow-2xl w-80 animate-fade-in">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className={`px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border ${
                  selectedPoint.risk === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/40' : 'bg-orange-500/20 text-orange-400 border-orange-500/40'
                }`}>
                  {selectedPoint.risk} Risk Zone
                </span>
                <h3 className="text-base font-bold text-white mt-1">{selectedPoint.name}</h3>
              </div>
              <button onClick={() => setSelectedPoint(null)} className="text-text-tertiary hover:text-white">✕</button>
            </div>

            <div className="space-y-2 text-xs text-text-secondary mb-4">
              <div className="flex justify-between border-b border-border-subtle/50 py-1">
                <span>Primary Crime Type:</span>
                <span className="text-white font-bold">{selectedPoint.category}</span>
              </div>
              <div className="flex justify-between border-b border-border-subtle/50 py-1">
                <span>Recorded Incidents:</span>
                <span className="text-orange-400 font-mono font-bold">{selectedPoint.incidents} cases</span>
              </div>
              <div className="flex justify-between py-1">
                <span>GPS Coordinates:</span>
                <span className="text-white font-mono">{selectedPoint.lat.toFixed(4)}, {selectedPoint.lng.toFixed(4)}</span>
              </div>
            </div>

            <button 
              onClick={() => router.push('/dashboard/patrol')}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 rounded-lg text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow-sm"
            >
              <ShieldAlert className="w-4 h-4" /> Dispatch Patrol Unit
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
