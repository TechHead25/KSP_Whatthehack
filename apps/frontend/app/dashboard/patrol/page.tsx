'use client'

import { Navigation, MapPin, Clock, Users, Shield } from 'lucide-react'

const PATROLS = [
  { id: 'P-01', area: 'Indiranagar 100ft Road', time: '22:00 - 02:00', unit: 'Hoysala 12', risk: 'High' },
  { id: 'P-02', area: 'Koramangala 4th Block', time: '01:00 - 05:00', unit: 'Cheetah 4', risk: 'Critical' },
  { id: 'P-03', area: 'MG Road Junction', time: '20:00 - 00:00', unit: 'Traffic Unit B', risk: 'Medium' },
]

export default function PatrolPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Navigation className="w-6 h-6 text-brand-400" />
            Patrol Recommendations
          </h1>
          <p className="text-text-secondary mt-1">AI-optimized patrol routes based on crime prediction data.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-elevated border border-border-default rounded-xl shadow-card p-1">
          <div className="w-full h-[500px] bg-[#111] rounded-lg border border-border-subtle relative overflow-hidden flex items-center justify-center">
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#333 2px, transparent 2px)', backgroundSize: '50px 50px' }} />
             <div className="text-center text-text-tertiary">
               <Navigation className="w-12 h-12 mx-auto mb-3 opacity-20" />
               <p>Interactive Route Map (Simulated)</p>
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="font-bold text-text-primary flex items-center gap-2 px-1">
            <Shield className="w-4 h-4 text-brand-400" /> Suggested Deployments
          </h3>
          {PATROLS.map(p => (
            <div key={p.id} className="bg-bg-elevated border border-border-default p-4 rounded-xl shadow-card hover:border-brand-500/40 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-text-primary text-sm flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> {p.area}
                </h4>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border ${
                  p.risk === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  p.risk === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                  'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>{p.risk}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-secondary mt-3">
                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {p.time}</div>
                <div className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {p.unit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
