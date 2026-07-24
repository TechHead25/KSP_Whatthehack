'use client'

import { useState } from 'react'
import { Cpu, Download, GitBranch, Network, UserPlus, X, ZoomIn, ZoomOut, RotateCcw, ExternalLink, Code, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface NetworkNode {
  id: string
  label: string
  name: string
  type: 'SUSPECT' | 'FIR' | 'GANG' | 'LOCATION' | 'VEHICLE'
  risk: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  details: string
  connections: string[]
  cx: number
  cy: number
  color: string
}

const NETWORK_NODES: NetworkNode[] = [
  { id: 'SUS-901', label: 'Raju Naik', name: 'Raju Naik (Billa)', type: 'SUSPECT', risk: 'CRITICAL', details: 'Kingpin of Alpha-9 syndicate. 14 pending warrants.', connections: ['FIR-2026-00456', 'GANG-ALPHA', 'KA-01-AB-1234'], cx: 200, cy: 150, color: '#ef4444' },
  { id: 'SUS-902', label: 'Kiran Kumar', name: 'Kiran Kumar (KK)', type: 'SUSPECT', risk: 'HIGH', details: 'Vehicle snatching lieutenant. Active in Koramangala.', connections: ['SUS-901', 'FIR-2026-00456', 'LOC-KOR'], cx: 150, cy: 240, color: '#f97316' },
  { id: 'FIR-2026-00456', label: 'FIR 0456', name: 'FIR/2026/0456 (Armed Theft)', type: 'FIR', risk: 'CRITICAL', details: 'Armed robbery at Koramangala jewelers.', connections: ['SUS-901', 'SUS-902'], cx: 300, cy: 90, color: '#3b82f6' },
  { id: 'GANG-ALPHA', label: 'Alpha-9', name: 'Alpha-9 Crime Syndicate', type: 'GANG', risk: 'CRITICAL', details: 'Inter-state organized gang operating in South India.', connections: ['SUS-901', 'SUS-903'], cx: 100, cy: 80, color: '#a855f7' },
  { id: 'SUS-903', label: 'Syed Ali', name: 'Syed Ali (Bhaijan)', type: 'SUSPECT', risk: 'MEDIUM', details: 'Financial fraud & hawala coordinator.', connections: ['GANG-ALPHA'], cx: 250, cy: 250, color: '#f59e0b' },
  { id: 'KA-01-AB-1234', label: 'KA-01-AB-1234', name: 'Black Scorpio SUV', type: 'VEHICLE', risk: 'HIGH', details: 'Getaway vehicle identified in 3 FIRs.', connections: ['SUS-901'], cx: 350, cy: 180, color: '#06b6d4' },
]

export default function CriminalNetworkPage() {
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(NETWORK_NODES[0])
  const [zoom, setZoom] = useState(1)
  const [filterType, setFilterType] = useState('ALL')
  const [isCypherOpen, setIsCypherOpen] = useState(false)
  const [cypherQuery, setCypherQuery] = useState('MATCH (s:Suspect)-[r:MEMBER_OF]->(g:Gang) WHERE s.risk = "CRITICAL" RETURN s, r, g LIMIT 25;')
  const router = useRouter()

  const handleExportGraph = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(NETWORK_NODES, null, 2))
    const dlAnchorElem = document.createElement('a')
    dlAnchorElem.setAttribute("href", dataStr)
    dlAnchorElem.setAttribute("download", `NETRA_Network_Topology_${Date.now()}.json`)
    dlAnchorElem.click()
    toast.success('Exported Criminal Network Graph topology to JSON')
  }

  const handleExecuteCypher = () => {
    toast.success('Executed Cypher Query! Graph database updated.')
    setIsCypherOpen(false)
  }

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <GitBranch className="w-5 h-5 text-purple-400" />
            </div>
            Criminal Network Analysis (Neo4j Engine)
          </h1>
          <p className="text-sm font-medium text-text-secondary mt-1 tracking-wide">Visualize and uncover hidden connections between suspects and incidents.</p>
        </div>

        <div className="flex items-center gap-3">
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-bg-surface border border-border-strong text-white text-xs font-bold uppercase tracking-wider rounded-lg px-3 py-2 outline-none"
          >
            <option value="ALL">All Entity Types</option>
            <option value="SUSPECT">Suspects Only</option>
            <option value="FIR">FIRs Only</option>
            <option value="GANG">Gangs Only</option>
          </select>

          <button 
            onClick={() => setIsCypherOpen(true)}
            className="bg-bg-surface hover:bg-bg-elevated border border-border-strong text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all"
          >
            <Code className="w-4 h-4 text-purple-400" /> Run Cypher Query
          </button>
          <button 
            onClick={handleExportGraph}
            className="bg-purple-600 hover:bg-purple-500 text-white border border-purple-400/50 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(168,85,247,0.4)] flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export Graph
          </button>
        </div>
      </div>

      {/* Main Canvas + Side Panel */}
      <div className="flex-1 bg-bg-base/80 backdrop-blur-xl border border-border-default rounded-2xl shadow-2xl overflow-hidden flex relative">
        {/* Zoom Controls */}
        <div className="absolute top-6 left-6 z-20 flex flex-col gap-2 bg-bg-surface/80 backdrop-blur-md border border-border-strong p-2 rounded-xl shadow-glass">
          <button onClick={() => setZoom(z => Math.min(z + 0.3, 2))} className="p-2 text-text-secondary hover:text-white hover:bg-bg-elevated rounded-lg transition-colors border border-transparent hover:border-border-strong">
            <ZoomIn className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(z => Math.max(z - 0.3, 0.6))} className="p-2 text-text-secondary hover:text-white hover:bg-bg-elevated rounded-lg transition-colors border border-transparent hover:border-border-strong">
            <ZoomOut className="w-4 h-4" />
          </button>
          <button onClick={() => setZoom(1)} className="p-2 text-text-secondary hover:text-white hover:bg-bg-elevated rounded-lg transition-colors border border-transparent hover:border-border-strong">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Graph SVG Area */}
        <div className="flex-1 bg-[#050A14] relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

          {/* Interactive Graph SVG */}
          <div className="w-full h-full flex items-center justify-center transition-transform duration-300" style={{ transform: `scale(${zoom})` }}>
            <svg className="w-full h-full max-w-4xl cursor-grab" viewBox="0 0 400 300">
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Edge Connections */}
              <g strokeWidth="1.5" opacity="0.6">
                <line x1="200" y1="150" x2="100" y2="80" stroke="#a855f7" strokeDasharray="4 2" />
                <line x1="200" y1="150" x2="300" y2="90" stroke="#3b82f6" />
                <line x1="200" y1="150" x2="150" y2="240" stroke="#ef4444" strokeWidth="2.5" />
                <line x1="200" y1="150" x2="350" y2="180" stroke="#06b6d4" />
                <line x1="100" y1="80" x2="250" y2="250" stroke="#a855f7" />
              </g>

              {/* Interactive Nodes */}
              <g filter="url(#glow)">
                {NETWORK_NODES.filter(n => filterType === 'ALL' || n.type === filterType).map((node) => {
                  const isSelected = selectedNode?.id === node.id
                  return (
                    <g 
                      key={node.id} 
                      onClick={() => setSelectedNode(node)}
                      className="cursor-pointer group"
                    >
                      <circle 
                        cx={node.cx} 
                        cy={node.cy} 
                        r={isSelected ? 16 : 12} 
                        fill={node.color} 
                        stroke={isSelected ? '#ffffff' : node.color} 
                        strokeWidth={isSelected ? 3 : 1.5} 
                        className="transition-all hover:scale-125"
                      />
                      <text 
                        x={node.cx} 
                        y={node.cy + 22} 
                        fill="#ffffff" 
                        fontSize="7" 
                        fontWeight="bold" 
                        textAnchor="middle"
                      >
                        {node.label}
                      </text>
                    </g>
                  )
                })}
              </g>
            </svg>
          </div>
        </div>

        {/* Node Inspector Side Panel */}
        <div className="w-80 bg-bg-surface/90 backdrop-blur-md border-l border-border-strong flex flex-col z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
          <div className="p-5 border-b border-border-strong bg-bg-elevated/50">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400" /> Node Inspector
            </h3>
            <p className="text-xs text-text-secondary mt-1 font-medium">Real-time Neo4j Entity Attributes</p>
          </div>

          {selectedNode ? (
            <div className="p-5 flex-1 flex flex-col gap-4 overflow-y-auto">
              <div className="p-4 rounded-xl bg-bg-base border border-border-subtle">
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                  selectedNode.risk === 'CRITICAL' ? 'bg-red-500/10 text-red-400 border-red-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {selectedNode.type} · {selectedNode.risk}
                </span>
                <h2 className="text-lg font-black text-white mt-2 mb-1">{selectedNode.name}</h2>
                <p className="text-xs font-mono text-purple-400">{selectedNode.id}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">Entity Description</h4>
                <p className="text-xs text-text-secondary leading-relaxed bg-bg-base p-3 rounded-lg border border-border-subtle">
                  {selectedNode.details}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">Connected Entities ({selectedNode.connections.length})</h4>
                <div className="space-y-1.5">
                  {selectedNode.connections.map((connId, i) => (
                    <div key={i} className="p-2 rounded bg-bg-base border border-border-subtle text-xs text-brand-400 font-mono flex items-center gap-2">
                      <Network className="w-3 h-3 text-purple-400" /> {connId}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-border-subtle space-y-2">
                <button 
                  onClick={() => router.push('/dashboard/digital-twin')}
                  className="w-full btn-primary py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> Open Digital Twin
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <UserPlus className="w-8 h-8 text-text-tertiary mb-2" />
              <p className="text-xs text-text-tertiary">Select a node in the graph to inspect properties.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cypher Query Modal */}
      {isCypherOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-bg-surface border border-border-strong rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl relative">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-bg-elevated/80">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Code className="w-5 h-5 text-purple-400" /> Neo4j Cypher Console
              </h3>
              <button onClick={() => setIsCypherOpen(false)} className="text-text-tertiary hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-tertiary mb-2">Cypher Query String</label>
                <textarea 
                  rows={4}
                  value={cypherQuery}
                  onChange={(e) => setCypherQuery(e.target.value)}
                  className="w-full bg-bg-base border border-border-strong rounded-xl p-3 font-mono text-xs text-purple-300 focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setIsCypherOpen(false)} className="btn-secondary px-4 py-2 text-xs font-bold">Cancel</button>
                <button onClick={handleExecuteCypher} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Run Query
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
