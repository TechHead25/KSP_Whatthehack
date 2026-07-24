'use client'

import { useState } from 'react'
import { BrainCircuit, Play, ShieldAlert, Activity, Crosshair, Radar, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface PredictionResult {
  id: string
  title: string
  crimeType: string
  location: string
  probability: number
  timeWindow: string
  suspectProfile: string
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  dateGenerated: string
}

const INITIAL_PREDICTIONS: PredictionResult[] = [
  {
    id: 'PRD-2026-991A',
    title: 'Vehicle Theft Cluster: Koramangala',
    crimeType: 'Vehicle Theft',
    location: 'Koramangala 4th Block',
    probability: 89,
    timeWindow: '02:00 AM - 04:00 AM tonight',
    suspectProfile: 'Known syndicate "Alpha-9"',
    riskLevel: 'CRITICAL',
    dateGenerated: 'Just now',
  },
  {
    id: 'PRD-2026-882B',
    title: 'Cyber Fraud Spike: Indiranagar',
    crimeType: 'Cyber Crime',
    location: 'Indiranagar 100ft Road',
    probability: 76,
    timeWindow: '10:00 AM - 02:00 PM tomorrow',
    suspectProfile: 'Phishing Ring "Node-44"',
    riskLevel: 'HIGH',
    dateGenerated: '10 mins ago',
  },
]

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<PredictionResult[]>(INITIAL_PREDICTIONS)
  const [isRunning, setIsRunning] = useState(false)
  const [selectedType, setSelectedType] = useState('THEFT')
  const [selectedRegion, setSelectedRegion] = useState('Bengaluru Central')
  const router = useRouter()

  const handleRunPrediction = () => {
    setIsRunning(true)
    toast.info(`Initializing ${selectedType} AI telemetry model for ${selectedRegion}...`)

    setTimeout(() => {
      setIsRunning(false)
      const newPred: PredictionResult = {
        id: `PRD-${Date.now().toString().slice(-4)}`,
        title: `${selectedType} Hotspot: ${selectedRegion}`,
        crimeType: selectedType,
        location: `${selectedRegion} Sector 2`,
        probability: Math.floor(Math.random() * 20) + 80,
        timeWindow: '22:00 PM - 03:00 AM next 48h',
        suspectProfile: 'Recidivist Cluster #104',
        riskLevel: Math.random() > 0.4 ? 'CRITICAL' : 'HIGH',
        dateGenerated: 'Just now',
      }
      setPredictions(prev => [newPred, ...prev])
      toast.success(`AI Forecast Complete! Identified ${newPred.probability}% probability crime hotspot.`)
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <BrainCircuit className="w-5 h-5 text-brand-400" />
            </div>
            AI Prediction Engine
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1 tracking-wide">Real-time XGBoost + Prophet temporal crime forecasting telemetry.</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={selectedType} 
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-bg-surface border border-border-strong text-white text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2 outline-none"
          >
            <option value="THEFT">Vehicle Theft</option>
            <option value="ASSAULT">Assault</option>
            <option value="CYBER">Cyber Crime</option>
            <option value="NARCOTICS">Narcotics</option>
          </select>

          <select 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="bg-bg-surface border border-border-strong text-white text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2 outline-none"
          >
            <option value="Bengaluru Central">Bengaluru Central</option>
            <option value="Bengaluru South">Bengaluru South</option>
            <option value="Bengaluru East">Bengaluru East</option>
            <option value="Bengaluru North">Bengaluru North</option>
          </select>

          <button
            onClick={handleRunPrediction}
            disabled={isRunning}
            className="bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white border border-brand-400/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-2 transition-all flex-shrink-0"
          >
            {isRunning ? (
              <><Loader2 className="w-4 h-4 animate-spin text-white" /> Computing Model...</>
            ) : (
              <><Play className="w-4 h-4" /> Run New Prediction</>
            )}
          </button>
        </div>
      </div>

      {/* Models Status & Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Model Status Card */}
        <div className="bg-bg-base/80 backdrop-blur-xl border border-border-strong rounded-2xl p-6 shadow-glass relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand-400" /> Telemetry Accuracy
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          </div>

          <div className="space-y-5 relative z-10">
            <div>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-bold text-white tracking-wide">Spatial KDE Hotspot Model</span>
                <span className="text-emerald-400 font-mono text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">94.2% ACC</span>
              </div>
              <div className="h-1.5 bg-bg-surface rounded-full overflow-hidden border border-border-strong">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[94.2%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-bold text-white tracking-wide">Prophet Crime Forecaster</span>
                <span className="text-amber-400 font-mono text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">87.5% ACC</span>
              </div>
              <div className="h-1.5 bg-bg-surface rounded-full overflow-hidden border border-border-strong">
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-[87.5%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-1.5">
                <span className="text-xs font-bold text-white tracking-wide">Isolation Forest Anomaly</span>
                <span className="text-purple-400 font-mono text-xs font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">89.1% ACC</span>
              </div>
              <div className="h-1.5 bg-bg-surface rounded-full overflow-hidden border border-border-strong">
                <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 w-[89.1%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Results Feed */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-2">
            <Radar className="w-4 h-4 text-red-400" /> Active AI Forecasts ({predictions.length})
          </h3>

          <div className="space-y-4">
            {predictions.map((p) => (
              <div 
                key={p.id} 
                className={`bg-gradient-to-br ${p.riskLevel === 'CRITICAL' ? 'from-red-950/30 via-bg-base to-bg-surface/80 border-red-500/40' : 'from-amber-950/30 via-bg-base to-bg-surface/80 border-amber-500/40'} border rounded-2xl p-6 shadow-2xl relative overflow-hidden transition-all`}
              >
                <div className="flex items-start gap-5 relative z-10">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${p.riskLevel === 'CRITICAL' ? 'bg-red-500/20 border-red-500/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-amber-500/20 border-amber-500/40 text-amber-400'}`}>
                    <Crosshair className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest rounded border ${p.riskLevel === 'CRITICAL' ? 'bg-red-500/20 border-red-500/40 text-red-400 animate-pulse' : 'bg-amber-500/20 border-amber-500/40 text-amber-400'}`}>
                          {p.riskLevel} ALERT
                        </span>
                        <span className="text-xs font-mono text-text-tertiary">{p.id}</span>
                      </div>
                      <span className="text-[10px] font-mono text-text-tertiary">{p.dateGenerated}</span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 tracking-tight">{p.title}</h2>
                    <p className="text-xs text-text-secondary leading-relaxed mb-4">
                      High probability incident forecast (<strong className="text-red-400 font-bold">{p.probability}% probability</strong>) expected in <span className="text-white font-medium">{p.location}</span> during <span className="text-amber-300 font-medium">{p.timeWindow}</span>. Linked to {p.suspectProfile}.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => router.push('/dashboard/patrol')}
                        className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                      >
                        <ShieldAlert className="w-4 h-4" /> Deploy Patrol Unit
                      </button>
                      <button
                        onClick={() => router.push('/dashboard/heatmap')}
                        className="bg-bg-surface hover:bg-bg-elevated border border-border-strong text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
                      >
                        View Crime Map <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
