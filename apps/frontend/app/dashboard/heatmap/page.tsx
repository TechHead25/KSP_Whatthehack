'use client';
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Map, Filter, ZoomIn, ZoomOut, Maximize2, RefreshCw, Crosshair } from 'lucide-react'

import { Tooltip } from '@/components/ui/Tooltip'

// Mock heatmap data for demo purposes
const HEATMAP_REGIONS = [
  { id: 1, name: 'Indiranagar', risk: 'High', incidents: 42, color: 'bg-red-500/80', coordinates: 'top-[30%] left-[40%]' },
  { id: 2, name: 'Koramangala', risk: 'Critical', incidents: 89, color: 'bg-red-600/90', coordinates: 'top-[60%] left-[50%]' },
  { id: 3, name: 'Whitefield', risk: 'Medium', incidents: 24, color: 'bg-amber-500/80', coordinates: 'top-[40%] left-[70%]' },
  { id: 4, name: 'Jayanagar', risk: 'Low', incidents: 12, color: 'bg-green-500/80', coordinates: 'top-[70%] left-[30%]' },
  { id: 5, name: 'Malleswaram', risk: 'Medium', incidents: 28, color: 'bg-amber-500/80', coordinates: 'top-[20%] left-[20%]' },
]

export default function HeatmapPage() {
  const [zoom, setZoom] = useState(1)
  const [filter, setFilter] = useState('All')

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] gap-6">
      {/* Header & Controls */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(249,115,22,0.2)]">
              <Map className="w-5 h-5 text-orange-400" />
            </div>
            Crime Heatmap
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1 tracking-wide">Live predictive mapping of crime hotspots across Bengaluru.</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-bg-surface border border-border-strong text-white text-xs font-bold uppercase tracking-wider rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-orange-500/50 appearance-none shadow-inner"
          >
            <option value="All">All Categories</option>
            <option value="Theft">Vehicle Theft</option>
            <option value="Assault">Assault</option>
            <option value="Cyber">Cyber Crime</option>
          </select>
          <Tooltip content="Advanced filtering locked">
            <button className="bg-bg-surface hover:bg-bg-elevated border border-border-strong text-text-tertiary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 opacity-60 cursor-not-allowed">
              <Filter className="w-4 h-4" /> Filters
            </button>
          </Tooltip>
          <Tooltip content="Live sync is currently active">
            <button className="bg-orange-600 hover:bg-orange-500 text-white border border-orange-400/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(249,115,22,0.4)] flex items-center gap-2 transition-all">
              <RefreshCw className="w-4 h-4 animate-spin" /> Live Sync
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative bg-bg-base/80 backdrop-blur-xl border border-border-default rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Toolbar */}
        <div className="absolute top-6 right-6 z-10 flex flex-col gap-2 bg-bg-surface/80 backdrop-blur-md border border-border-strong p-2 rounded-xl shadow-glass">
          <button onClick={() => setZoom(z => Math.min(z + 0.5, 3))} className="p-2 text-text-secondary hover:text-white hover:bg-bg-elevated rounded-lg transition-colors border border-transparent hover:border-border-strong">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.5, 0.5))} className="p-2 text-text-secondary hover:text-white hover:bg-bg-elevated rounded-lg transition-colors border border-transparent hover:border-border-strong">
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-full h-px bg-border-strong my-1" />
          <button onClick={() => setZoom(1)} className="p-2 text-text-secondary hover:text-white hover:bg-bg-elevated rounded-lg transition-colors border border-transparent hover:border-border-strong">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 z-10 bg-bg-surface/80 backdrop-blur-md border border-border-strong p-5 rounded-xl shadow-glass text-xs">
          <h4 className="font-bold text-white mb-3 uppercase tracking-widest flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-brand-400" /> Risk Level
          </h4>
          <div className="space-y-3 font-medium text-text-secondary">
            <div className="flex items-center gap-3"><span className="w-4 h-4 rounded shadow-[0_0_10px_rgba(220,38,38,0.8)] bg-red-600/90 border border-red-400/50" /> Critical (&gt;80)</div>
            <div className="flex items-center gap-3"><span className="w-4 h-4 rounded shadow-[0_0_10px_rgba(239,68,68,0.5)] bg-red-500/80 border border-red-400/30" /> High (40-80)</div>
            <div className="flex items-center gap-3"><span className="w-4 h-4 rounded shadow-[0_0_10px_rgba(245,158,11,0.5)] bg-amber-500/80 border border-amber-400/30" /> Medium (20-40)</div>
            <div className="flex items-center gap-3"><span className="w-4 h-4 rounded shadow-[0_0_10px_rgba(34,197,94,0.5)] bg-green-500/80 border border-green-400/30" /> Low (&lt;20)</div>
          </div>
        </div>

        {/* The Map (Simulated) */}
        <div className="flex-1 w-full h-full relative overflow-hidden bg-[#050A14] flex items-center justify-center">
          {/* Simulated Map Background Grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-600/5 rounded-full blur-[100px] pointer-events-none" />

          <motion.div
            className="relative w-full h-full max-w-4xl max-h-[800px]"
            animate={{ scale: zoom }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
          >
            {/* Base abstract map lines */}
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M10,10 Q50,90 90,10 T90,90" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M0,50 Q50,0 100,50 T0,90" fill="none" stroke="currentColor" strokeWidth="0.5" />
              <path d="M20,0 L20,100 M80,0 L80,100 M0,20 L100,20 M0,80 L100,80" stroke="currentColor" strokeWidth="0.1" opacity="0.5" />
            </svg>

            {/* Heatmap points */}
            {HEATMAP_REGIONS.map((region) => (
              <motion.div
                key={region.id}
                className={`absolute ${region.coordinates} group cursor-pointer`}
                whileHover={{ scale: 1.1, zIndex: 10 }}
              >
                {/* Core Hotspot */}
                <div className={`w-10 h-10 rounded-full ${region.color} blur-[3px] animate-pulse relative z-0 flex items-center justify-center border border-white/20`}>
                  <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                </div>

                {/* Radar effect */}
                <div className={`absolute inset-0 rounded-full ${region.color} opacity-40 animate-ping`} />

                {/* Tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity bg-bg-surface/90 backdrop-blur-md border border-border-strong p-4 rounded-xl shadow-glass z-20 w-56 pointer-events-none">
                  <h3 className="text-sm font-black text-white mb-2 uppercase tracking-wide">{region.name}</h3>
                  <div className="flex justify-between items-center text-xs mb-1 font-medium">
                    <span className="text-text-secondary">Risk Level</span>
                    <span className={
                      region.risk === 'Critical' || region.risk === 'High' ? 'text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20' :
                        region.risk === 'Medium' ? 'text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20' : 'text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20'
                    }>{region.risk}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-medium">
                    <span className="text-text-secondary">Incidents</span>
                    <span className="text-white font-mono">{region.incidents}</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border-strong text-[10px] font-bold text-brand-400 uppercase tracking-widest text-center flex items-center justify-center gap-1">
                    <Crosshair className="w-3 h-3" /> Click for intelligence
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
