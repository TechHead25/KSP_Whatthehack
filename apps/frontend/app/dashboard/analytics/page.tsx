'use client'

import { BarChart3, TrendingUp, TrendingDown, Activity } from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-400" />
            Risk Analytics
          </h1>
          <p className="text-text-secondary mt-1">City-wide crime statistics and trend analysis.</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Incidents (This Month)', val: '1,284', trend: '+4%', up: false },
          { label: 'Cases Solved', val: '842', trend: '+12%', up: true },
          { label: 'High Risk Zones', val: '14', trend: '-2', up: true },
          { label: 'Avg Response Time', val: '8m 42s', trend: '-1m', up: true },
        ].map((kpi, i) => (
          <div key={i} className="bg-bg-elevated border border-border-default rounded-xl p-5 shadow-card">
            <h3 className="text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">{kpi.label}</h3>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-text-primary">{kpi.val}</span>
              <div className={`flex items-center text-xs font-medium ${kpi.up ? 'text-green-400' : 'text-red-400'}`}>
                {kpi.up ? <TrendingDown className="w-3.5 h-3.5 mr-1" /> : <TrendingUp className="w-3.5 h-3.5 mr-1" />}
                {kpi.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-bg-elevated border border-border-default rounded-xl p-5 shadow-card h-80 flex flex-col">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2"><Activity className="w-4 h-4 text-brand-400" /> Incident Trends (Last 6 Months)</h3>
          <div className="flex-1 border-b border-l border-border-subtle relative flex items-end justify-between px-4 pb-0 pt-8">
             {/* Mock Chart Bars */}
             {[40, 60, 45, 80, 55, 75].map((h, i) => (
               <div key={i} className="w-8 bg-brand-500/20 hover:bg-brand-500/40 border border-brand-500/30 rounded-t-sm transition-colors cursor-pointer group relative" style={{ height: `${h}%` }}>
                 <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-bg-surface text-xs px-2 py-1 rounded border border-border-default transition-opacity pointer-events-none">
                   {h * 12}
                 </div>
               </div>
             ))}
          </div>
          <div className="flex justify-between px-4 mt-2 text-[10px] text-text-tertiary uppercase tracking-wider">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
          </div>
        </div>

        <div className="bg-bg-elevated border border-border-default rounded-xl p-5 shadow-card h-80 flex items-center justify-center text-center">
           <div>
             <BarChart3 className="w-12 h-12 text-border-subtle mx-auto mb-3" />
             <p className="text-text-secondary text-sm">Detailed charts require data connection.</p>
           </div>
        </div>
      </div>
    </div>
  )
}
