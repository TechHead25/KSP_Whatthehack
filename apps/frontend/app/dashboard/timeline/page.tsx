'use client'

import { GitCommitHorizontal } from 'lucide-react'

export default function TimelinePage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <GitCommitHorizontal className="w-6 h-6 text-brand-400" />
            Case Timeline
          </h1>
          <p className="text-text-secondary mt-1">Chronological view of incidents and investigation steps.</p>
        </div>
      </div>

      <div className="bg-bg-elevated border border-border-default rounded-xl p-8 shadow-card flex flex-col items-center justify-center text-center min-h-[400px]">
        <GitCommitHorizontal className="w-16 h-16 text-border-subtle mb-4" />
        <h2 className="text-xl font-bold text-text-primary mb-2">Select a Case</h2>
        <p className="text-text-secondary max-w-md">Please select an active FIR from the database to view its detailed timeline.</p>
      </div>
    </div>
  )
}
