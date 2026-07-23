'use client'

import { ClipboardList, Download, Printer } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-brand-400" />
            Court Reports
          </h1>
          <p className="text-text-secondary mt-1">Generate and manage legally compliant case reports.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary px-3 py-2 flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print
          </button>
          <button className="btn-primary px-3 py-2 flex items-center gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-bg-elevated border border-border-default rounded-xl p-8 shadow-card flex flex-col items-center justify-center text-center min-h-[400px]">
        <ClipboardList className="w-16 h-16 text-border-subtle mb-4" />
        <h2 className="text-xl font-bold text-text-primary mb-2">No Reports Generated</h2>
        <p className="text-text-secondary max-w-md">Select a case from the FIR Database or Case Timeline to generate a formatted court report.</p>
      </div>
    </div>
  )
}
