'use client'

import { useState } from 'react'
import { Users, Search, Filter, ShieldAlert, FileText, ChevronRight, X, AlertTriangle, Fingerprint, MapPin, Tag, Download, Activity, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface SuspectRecord {
  id: string
  name: string
  alias: string
  risk: 'Critical' | 'High' | 'Medium' | 'Low'
  riskScore: number
  lastSeen: string
  status: string
  gender: string
  dob: string
  aadhar: string
  pan: string
  crimeCount: number
  primaryCrime: string
  associates: string[]
  heatFactors: string[]
}

const SUSPECT_DATA: SuspectRecord[] = [
  { 
    id: 'SUS-901', 
    name: 'Raju Naik', 
    alias: 'Billa', 
    risk: 'Critical', 
    riskScore: 92, 
    lastSeen: 'Indiranagar Metro', 
    status: 'Wanted',
    gender: 'Male',
    dob: '1988-05-14',
    aadhar: '**** **** 4812',
    pan: 'ABCDE1234F',
    crimeCount: 14,
    primaryCrime: 'Armed Robbery & Syndicate Theft',
    associates: ['Kiran Kumar (KK)', 'Syed Ali', 'David Raj'],
    heatFactors: ['Active arrest warrant', 'Frequent night mobility in Koramangala', 'Linked to Alpha-9 gang']
  },
  { 
    id: 'SUS-902', 
    name: 'Kiran Kumar', 
    alias: 'KK', 
    risk: 'High', 
    riskScore: 78, 
    lastSeen: 'Koramangala 4th Block', 
    status: 'Under Surveillance',
    gender: 'Male',
    dob: '1992-11-20',
    aadhar: '**** **** 9021',
    pan: 'FGHIJ5678K',
    crimeCount: 8,
    primaryCrime: 'Vehicle Theft',
    associates: ['Raju Naik'],
    heatFactors: ['Vehicle snatching cluster involvement', 'High spatial density in South District']
  },
  { 
    id: 'SUS-903', 
    name: 'Syed Ali', 
    alias: 'Bhaijan', 
    risk: 'Medium', 
    riskScore: 54, 
    lastSeen: 'Shivajinagar', 
    status: 'Bailed',
    gender: 'Male',
    dob: '1995-02-08',
    aadhar: '**** **** 3310',
    pan: 'KLMNO9012P',
    crimeCount: 4,
    primaryCrime: 'Cyber Financial Fraud',
    associates: ['Raju Naik', 'David Raj'],
    heatFactors: ['Phishing website host', 'Out-of-state bank account transfers']
  },
  { 
    id: 'SUS-904', 
    name: 'David Raj', 
    alias: 'Dave', 
    risk: 'Low', 
    riskScore: 22, 
    lastSeen: 'Whitefield', 
    status: 'Cleared',
    gender: 'Male',
    dob: '1997-08-30',
    aadhar: '**** **** 1192',
    pan: 'QRSTU3456V',
    crimeCount: 1,
    primaryCrime: 'Minor Disturbance',
    associates: [],
    heatFactors: ['Low recidivism threat']
  },
]

export default function DigitalTwinPage() {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState('ALL')
  const [selectedSuspect, setSelectedSuspect] = useState<SuspectRecord | null>(null)
  const router = useRouter()

  const filtered = SUSPECT_DATA.filter(sus => {
    const matchesSearch = sus.name.toLowerCase().includes(search.toLowerCase()) || 
      sus.id.toLowerCase().includes(search.toLowerCase()) ||
      sus.alias.toLowerCase().includes(search.toLowerCase())
    
    const matchesRisk = riskFilter === 'ALL' || sus.risk.toUpperCase() === riskFilter
    return matchesSearch && matchesRisk
  })

  const handleDownloadDossier = (sus: SuspectRecord) => {
    const content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>OFFICIAL INTELLIGENCE DOSSIER - ${sus.name} (${sus.id})</title>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
    .header { border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 25px; text-align: center; }
    .title { font-size: 24px; font-weight: bold; color: #1e3a8a; text-transform: uppercase; margin: 0; }
    .subtitle { font-size: 12px; font-weight: bold; color: #555; letter-spacing: 2px; text-transform: uppercase; margin-top: 5px; }
    .badge { display: inline-block; padding: 4px 10px; background: #fee2e2; color: #991b1b; border: 1px solid #f87171; border-radius: 4px; font-weight: bold; font-size: 12px; margin-top: 10px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
    .box { background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; }
    .box-title { font-size: 12px; font-weight: bold; color: #475569; text-transform: uppercase; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
    .row { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 6px; }
    .label { color: #64748b; font-weight: 500; }
    .value { font-weight: bold; color: #0f172a; }
    .factors { list-style-type: square; padding-left: 20px; font-size: 13px; color: #334155; }
    .footer { border-top: 1px solid #cbd5e1; margin-top: 40px; padding-top: 15px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
  </style>
</head>
<body>
  <div class="header">
    <h1 class="title">Karnataka State Police — Digital Twin Dossier</h1>
    <div class="subtitle">AI Crime Intelligence & Recidivism Telemetry</div>
    <div class="badge">${sus.risk.toUpperCase()} RISK PROFILE (${sus.riskScore}/100)</div>
  </div>

  <div class="grid">
    <div class="box">
      <div class="box-title">Subject Identity</div>
      <div class="row"><span class="label">Full Name:</span><span class="value">${sus.name}</span></div>
      <div class="row"><span class="label">Alias / Moniker:</span><span class="value">${sus.alias}</span></div>
      <div class="row"><span class="label">Suspect ID:</span><span class="value">${sus.id}</span></div>
      <div class="row"><span class="label">Gender / DOB:</span><span class="value">${sus.gender} (${sus.dob})</span></div>
      <div class="row"><span class="label">Status:</span><span class="value">${sus.status}</span></div>
    </div>
    <div class="box">
      <div class="box-title">Government & National ID</div>
      <div class="row"><span class="label">Aadhaar Card:</span><span class="value">${sus.aadhar}</span></div>
      <div class="row"><span class="label">PAN Account:</span><span class="value">${sus.pan}</span></div>
      <div class="row"><span class="label">Primary Crime:</span><span class="value">${sus.primaryCrime}</span></div>
      <div class="row"><span class="label">Prior FIR Count:</span><span class="value">${sus.crimeCount} Cases</span></div>
      <div class="row"><span class="label">Last Known Location:</span><span class="value">${sus.lastSeen}</span></div>
    </div>
  </div>

  <div class="box" style="margin-bottom: 25px;">
    <div class="box-title">Key Recidivism & Risk Factors (AI Telemetry)</div>
    <ul class="factors">
      ${sus.heatFactors.map(f => `<li>${f}</li>`).join('')}
    </ul>
  </div>

  <div class="box">
    <div class="box-title">Known Gang Affiliations & Criminal Associates</div>
    <div class="row"><span class="label">Associates:</span><span class="value">${sus.associates.join(', ') || 'None Recorded'}</span></div>
  </div>

  <div class="footer">
    <div>Generated by NETRA AI Intelligence Platform</div>
    <div>Verification Hash: SHA256-NETRA-${Date.now()}</div>
  </div>
</body>
</html>
    `
    const blob = new Blob([content], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `NETRA_Digital_Twin_Dossier_${sus.id}.html`
    a.click()
    toast.success(`Downloaded Digital Twin Intelligence Dossier for ${sus.name} (${sus.id})`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-400" />
            Digital Twin Offender Engine
          </h1>
          <p className="text-text-secondary mt-1">AI-generated 360° intelligence dossiers and criminal risk telemetry.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-bg-elevated border border-border-default rounded-xl p-4 shadow-card flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search by Name, Alias, or Suspect ID..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-bg-surface border border-border-subtle rounded-lg pl-9 pr-4 py-2 text-sm text-text-primary focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 bg-bg-surface border border-border-subtle rounded-lg px-3 py-1.5 text-xs text-text-secondary">
          <Filter className="w-3.5 h-3.5" />
          <select 
            value={riskFilter} 
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-transparent text-text-primary outline-none cursor-pointer uppercase font-bold"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk</option>
          </select>
        </div>
      </div>

      {/* Suspect Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(sus => (
          <div key={sus.id} className="bg-bg-elevated border border-border-default rounded-xl overflow-hidden shadow-card hover:border-brand-500/50 transition-all flex flex-col group">
            <div className="p-5 flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-900/40 to-bg-surface border border-brand-500/30 flex items-center justify-center flex-shrink-0 text-2xl font-black text-brand-400 shadow-inner">
                {sus.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h3 className="text-base font-bold text-white truncate group-hover:text-brand-300 transition-colors">{sus.name}</h3>
                  <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${
                    sus.risk === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]' :
                    sus.risk === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' :
                    sus.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-green-500/10 text-green-400 border-green-500/30'
                  }`}>
                    {sus.risk} ({sus.riskScore}%)
                  </span>
                </div>
                <p className="text-xs text-text-secondary mt-1 font-medium">Alias: <span className="text-white font-semibold">{sus.alias}</span></p>
                <p className="text-xs font-mono font-bold text-brand-400 mt-1">{sus.id}</p>
              </div>
            </div>

            <div className="px-5 py-3 bg-bg-surface/50 border-y border-border-subtle flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 text-text-secondary font-medium">
                <ShieldAlert className="w-3.5 h-3.5 text-brand-400" /> {sus.status}
              </div>
              <div className="text-text-tertiary text-[11px]">
                Last Seen: <span className="text-white font-medium">{sus.lastSeen}</span>
              </div>
            </div>

            <div className="p-4 flex gap-2 mt-auto">
              <button 
                onClick={() => handleDownloadDossier(sus)}
                className="flex-1 bg-bg-surface border border-border-subtle hover:border-brand-500/40 hover:bg-brand-500/10 text-text-primary text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 font-bold"
              >
                <Download className="w-3.5 h-3.5" /> PDF Dossier
              </button>
              <button 
                onClick={() => setSelectedSuspect(sus)}
                className="flex-1 bg-brand-600 hover:bg-brand-500 text-white text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 font-bold shadow-[0_0_12px_rgba(37,99,235,0.3)]"
              >
                <ChevronRight className="w-4 h-4" /> View Twin
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filtered.length === 0 && (
        <div className="py-12 text-center text-text-tertiary bg-bg-elevated border border-border-default rounded-xl border-dashed">
          <Users className="w-8 h-8 mx-auto mb-3 opacity-20" />
          <p className="text-sm">No suspect digital twin profiles found matching &quot;{search}&quot;</p>
        </div>
      )}

      {/* Digital Twin Detail Modal */}
      {selectedSuspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
          <div className="bg-bg-surface border border-border-strong rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-border-subtle bg-bg-elevated/80">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center text-brand-400 font-black text-xl">
                  {selectedSuspect.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold text-white text-lg flex items-center gap-2">
                    {selectedSuspect.name} 
                    <span className="text-xs font-mono font-normal text-text-tertiary">({selectedSuspect.id})</span>
                  </h2>
                  <p className="text-xs text-text-secondary font-medium">Alias: {selectedSuspect.alias} · Status: {selectedSuspect.status}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedSuspect(null)}
                className="p-2 text-text-tertiary hover:text-white rounded-lg hover:bg-bg-base transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Telemetry Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-bg-base/80 p-4 rounded-xl border border-border-subtle">
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary flex items-center gap-1"><Activity className="w-3 h-3 text-brand-400" /> AI Risk Score</span>
                  <span className="text-lg font-black text-red-400 block mt-1">{selectedSuspect.riskScore}/100</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary flex items-center gap-1"><FileText className="w-3 h-3 text-amber-400" /> Prior FIRs</span>
                  <span className="text-lg font-black text-white block mt-1">{selectedSuspect.crimeCount} Incidents</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary flex items-center gap-1"><Tag className="w-3 h-3 text-purple-400" /> Primary Crime</span>
                  <span className="text-xs font-bold text-purple-300 block mt-1.5 truncate">{selectedSuspect.primaryCrime}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-text-tertiary flex items-center gap-1"><MapPin className="w-3 h-3 text-emerald-400" /> Last Known</span>
                  <span className="text-xs font-bold text-white block mt-1.5 truncate">{selectedSuspect.lastSeen}</span>
                </div>
              </div>

              {/* Identity & Biometric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-bg-base border border-border-subtle space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-brand-400 flex items-center gap-1.5 mb-3">
                    <Fingerprint className="w-4 h-4" /> Identity & Government ID
                  </h4>
                  <div className="flex justify-between text-xs py-1 border-b border-border-subtle/50">
                    <span className="text-text-secondary">Gender / DOB:</span>
                    <span className="text-white font-medium">{selectedSuspect.gender} ({selectedSuspect.dob})</span>
                  </div>
                  <div className="flex justify-between text-xs py-1 border-b border-border-subtle/50">
                    <span className="text-text-secondary">Aadhaar Card:</span>
                    <span className="text-white font-mono">{selectedSuspect.aadhar}</span>
                  </div>
                  <div className="flex justify-between text-xs py-1">
                    <span className="text-text-secondary">PAN Number:</span>
                    <span className="text-white font-mono">{selectedSuspect.pan}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-bg-base border border-border-subtle space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 mb-3">
                    <Users className="w-4 h-4" /> Known Criminal Associates
                  </h4>
                  {selectedSuspect.associates.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedSuspect.associates.map((assoc, idx) => (
                        <span key={idx} className="px-2.5 py-1 text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-md">
                          {assoc}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-text-tertiary">No known gang associates recorded.</p>
                  )}
                </div>
              </div>

              {/* AI Risk Analysis Factors */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-text-tertiary mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400" /> Key Recidivism & Risk Factors (SHAP Analysis)
                </h4>
                <div className="space-y-2">
                  {selectedSuspect.heatFactors.map((factor, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-bg-base border border-border-subtle text-xs text-text-primary">
                      <span className="w-2 h-2 rounded-full bg-red-400 flex-shrink-0 animate-pulse" />
                      <span className="font-medium">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 border-t border-border-subtle bg-bg-elevated/50 flex gap-3">
              <button 
                onClick={() => router.push('/dashboard/criminal-network')}
                className="flex-1 btn-secondary py-2.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
              >
                <ExternalLink className="w-4 h-4" /> View Network Graph
              </button>
              <button 
                onClick={() => handleDownloadDossier(selectedSuspect)}
                className="flex-1 btn-primary py-2.5 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
              >
                <Download className="w-4 h-4" /> Download Official Intelligence Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
