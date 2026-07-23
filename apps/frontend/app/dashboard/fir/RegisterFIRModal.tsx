import { useState } from 'react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { X, FileText, Loader2, ShieldAlert } from 'lucide-react'
import { createFIR, FIRCreatePayload } from '@/lib/api/firApi'

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function RegisterFIRModal({ isOpen, onClose, onSuccess }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Basic form state
  const [formData, setFormData] = useState<FIRCreatePayload>({
    fir_number: `FIR/2026/${Math.floor(Math.random() * 9000) + 1000}`,
    station_id: crypto.randomUUID(),
    district_id: crypto.randomUUID(),
    date_filed: new Date().toISOString(),
    date_incident: new Date().toISOString(),
    crime_type: 'THEFT',
    status: 'OPEN',
    priority: 'NORMAL',
    description: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await createFIR(formData)
      onSuccess()
      onClose()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const msg = (err.response?.data as { error?: { message?: string } })?.error?.message
        setError(msg || 'Failed to create FIR')
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to create FIR')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-bg-surface border border-border-strong rounded-2xl shadow-glow-lg overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-elevated">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center border border-brand-500/20">
                <FileText className="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-text-primary">Register New FIR</h2>
                <p className="text-xs text-text-tertiary font-mono">ID: {formData.fir_number}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 text-text-tertiary hover:text-text-primary rounded-lg hover:bg-bg-base transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400">
                <ShieldAlert className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form id="fir-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Crime Type</label>
                  <select
                    className="input-field w-full"
                    value={formData.crime_type}
                    onChange={(e) => setFormData({ ...formData, crime_type: e.target.value })}
                  >
                    <option value="THEFT">Theft</option>
                    <option value="ASSAULT">Assault</option>
                    <option value="MURDER">Murder</option>
                    <option value="CYBER">Cybercrime</option>
                    <option value="FRAUD">Fraud</option>
                    <option value="NARCOTICS">Narcotics</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Priority</label>
                  <select
                    className="input-field w-full"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                    <option value="CRITICAL">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Incident Description</label>
                <textarea
                  required
                  rows={4}
                  className="input-field w-full resize-none"
                  placeholder="Provide detailed description of the incident..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Incident Date</label>
                  <input
                    type="datetime-local"
                    required
                    className="input-field w-full"
                    value={formData.date_incident.substring(0, 16)}
                    onChange={(e) => setFormData({ ...formData, date_incident: new Date(e.target.value).toISOString() })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">Status</label>
                  <select
                    className="input-field w-full"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="OPEN">Open</option>
                    <option value="INVESTIGATING">Investigating</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border-subtle bg-bg-elevated">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-secondary px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="fir-form"
              disabled={loading}
              className="btn-primary px-5 py-2 min-w-[120px]"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Register FIR'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
