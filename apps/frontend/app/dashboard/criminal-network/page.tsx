import { Cpu, Download, FileSearch, GitBranch, Network, ShieldAlert, UserPlus } from 'lucide-react'

export default function CriminalNetworkPage() {
  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <GitBranch className="w-5 h-5 text-purple-400" />
            </div>
            Criminal Network Analysis
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1 tracking-wide">Visualize and uncover hidden connections between suspects and incidents via Neo4j.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-bg-surface hover:bg-bg-elevated border border-border-strong text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all">
            <FileSearch className="w-4 h-4 text-text-tertiary" /> Run Cypher Query
          </button>
          <button className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2 transition-all">
            <Download className="w-4 h-4" /> Export Graph
          </button>
        </div>
      </div>

      <div className="flex-1 bg-bg-base/80 backdrop-blur-xl border border-border-default rounded-2xl shadow-2xl overflow-hidden flex relative">
        {/* Graph Area Simulated */}
        <div className="flex-1 bg-[#050A14] relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Mock Graph SVG */}
          <svg className="w-full h-full max-w-4xl opacity-80" viewBox="0 0 400 300">
            <defs>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Edges */}
            <g strokeWidth="1.5" opacity="0.6">
              <line x1="200" y1="150" x2="100" y2="80" stroke="#a855f7" strokeDasharray="4 2" />
              <line x1="200" y1="150" x2="300" y2="80" stroke="#3b82f6" />
              <line x1="200" y1="150" x2="150" y2="250" stroke="#ef4444" strokeWidth="2.5" opacity="0.9" />
              <line x1="200" y1="150" x2="250" y2="250" stroke="#3b82f6" />
              <line x1="150" y1="250" x2="100" y2="200" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="300" y1="80" x2="350" y2="120" stroke="#3b82f6" />
              <line x1="100" y1="80" x2="50" y2="120" stroke="#64748b" opacity="0.4" />
              <line x1="350" y1="120" x2="380" y2="180" stroke="#64748b" opacity="0.4" />
            </g>

            {/* Nodes */}
            <g filter="url(#glow)">
              <circle cx="200" cy="150" r="14" fill="#581c87" stroke="#a855f7" strokeWidth="2" />
              <text x="200" y="146" fill="#fff" fontSize="6" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">SUS-901</text>
              <text x="200" y="154" fill="#a855f7" fontSize="4" textAnchor="middle">CENTRAL</text>

              <circle cx="100" cy="80" r="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="300" cy="80" r="10" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />

              <circle cx="150" cy="250" r="12" fill="#7f1d1d" stroke="#ef4444" strokeWidth="2.5" className="animate-pulse" />
              <text x="150" y="246" fill="#fff" fontSize="5" fontWeight="bold" textAnchor="middle">SUS-902</text>
              <text x="150" y="253" fill="#ef4444" fontSize="4" textAnchor="middle">CRITICAL</text>

              <circle cx="250" cy="250" r="8" fill="#1e3a8a" stroke="#3b82f6" strokeWidth="1.5" />
              <circle cx="100" cy="200" r="6" fill="#0f172a" stroke="#475569" strokeWidth="1" />
              <circle cx="350" cy="120" r="6" fill="#0f172a" stroke="#475569" strokeWidth="1" />
              <circle cx="50" cy="120" r="4" fill="#0f172a" stroke="#475569" strokeWidth="1" />
              <circle cx="380" cy="180" r="5" fill="#0f172a" stroke="#475569" strokeWidth="1" />
            </g>
          </svg>

          {/* Floating UI panel on graph */}
          <div className="absolute top-6 left-6 bg-bg-surface/60 backdrop-blur-xl border border-border-strong p-5 rounded-2xl shadow-glass w-72">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border-subtle">
              <Network className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-widest">Network Topology</h3>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Total Nodes Indexed</div>
                <div className="text-xl font-mono font-bold text-white flex items-center gap-2">
                  1,204 <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">+12 today</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider mb-1">Active Relationships</div>
                <div className="text-xl font-mono font-bold text-brand-400">
                  3,492
                </div>
              </div>

              <div className="pt-3 border-t border-border-subtle">
                <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                  <ShieldAlert className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider flex-1">Critical Clusters</span>
                  <span className="font-mono font-bold text-sm">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-bg-surface/90 backdrop-blur-md border-l border-border-strong flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          <div className="p-5 border-b border-border-strong bg-bg-elevated/50">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-brand-400" /> Node Inspector
            </h3>
            <p className="text-xs text-text-secondary mt-1 font-medium">Select a node to view attributes</p>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center opacity-60">
            <div className="w-16 h-16 rounded-2xl border border-border-strong bg-bg-base flex items-center justify-center mb-4 shadow-inner">
              <UserPlus className="w-6 h-6 text-text-tertiary" />
            </div>
            <p className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-1">No Selection</p>
            <p className="text-xs text-text-tertiary max-w-[200px]">Click on any entity in the graph to inspect its properties and relationships.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
