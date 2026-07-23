'use client'
import { BrainCircuit, Play, Database, ShieldAlert, Activity, Crosshair, Radar } from 'lucide-react'
import { toast } from 'sonner'

export default function PredictionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
              <BrainCircuit className="w-5 h-5 text-brand-400" />
            </div>
            Prediction Engine
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1 tracking-wide">AI-driven crime forecasting and risk assessment telemetry.</p>
        </div>
        <button
          onClick={() => toast.success("Initializing AI telemetry model... please wait.")}
          className="bg-brand-600 hover:bg-brand-500 text-white border border-brand-400/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(59,130,246,0.4)] flex items-center gap-2 transition-all">
          <Play className="w-4 h-4" /> Run New Prediction
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Model Status Card */}
        <div className="bg-bg-base/80 backdrop-blur-xl border border-border-strong rounded-2xl p-6 shadow-glass relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <Database className="w-32 h-32 text-brand-500" />
          </div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4" /> Active Models
            </h3>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
          </div>

          <div className="space-y-6 relative z-10">
            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-white tracking-wide">Theft Predictor v2</span>
                <span className="text-emerald-400 font-mono text-sm font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">94.2% ACC</span>
              </div>
              <div className="h-1.5 bg-bg-surface rounded-full overflow-hidden border border-border-strong">
                <div className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 w-[94.2%] shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-white tracking-wide">Assault Forecaster</span>
                <span className="text-amber-400 font-mono text-sm font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">82.7% ACC</span>
              </div>
              <div className="h-1.5 bg-bg-surface rounded-full overflow-hidden border border-border-strong">
                <div className="h-full bg-gradient-to-r from-amber-600 to-amber-400 w-[82.7%] shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold text-white tracking-wide">Riot Detection Net</span>
                <span className="text-purple-400 font-mono text-sm font-bold bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">89.1% ACC</span>
              </div>
              <div className="h-1.5 bg-bg-surface rounded-full overflow-hidden border border-border-strong">
                <div className="h-full bg-gradient-to-r from-purple-600 to-purple-400 w-[89.1%] shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
              </div>
            </div>
          </div>
        </div>

        {/* Latest Prediction */}
        <div className="md:col-span-2 bg-gradient-to-br from-red-900/20 to-bg-base/90 border border-red-500/30 rounded-2xl p-6 shadow-2xl flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] pointer-events-none">
            <Radar className="w-64 h-64 text-red-500 animate-[spin_10s_linear_infinite]" />
          </div>

          <div className="flex items-start gap-5 relative z-10">
            <div className="w-14 h-14 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <Crosshair className="w-7 h-7 text-red-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-widest rounded animate-pulse">Critical Alert</span>
                <span className="text-xs font-mono text-text-tertiary">ID: PRD-2026-991A</span>
              </div>
              <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Vehicle Theft Cluster: Koramangala</h2>
              <p className="text-text-secondary leading-relaxed mb-6 font-medium">
                Based on recent FIR data, weather patterns, and historical trends, there is an <strong className="text-red-400 font-bold bg-red-500/10 px-1 rounded">89% probability</strong> of vehicle theft incidents in <span className="text-white">Koramangala 4th Block</span> between 02:00 AM and 04:00 AM tonight. Suspect profile matches known syndicate "Alpha-9".
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => toast.success("Generating detailed PDF report...")}
                  className="bg-bg-surface hover:bg-bg-elevated border border-border-strong text-white px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all">
                  View Detail Report
                </button>
                <button
                  onClick={() => toast.success("Patrol unit dispatched to Koramangala 4th Block.")}
                  className="bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/50 px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(239,68,68,0.2)] flex items-center gap-2 transition-all">
                  <ShieldAlert className="w-4 h-4" /> Deploy Patrol Unit
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
