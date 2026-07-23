'use client'

import { useAuthStore } from '@/lib/stores/authStore'
import { motion } from 'framer-motion'
import { Shield, Mail, BadgeCheck, MapPin, Building2, UserCircle2, Key, Star } from 'lucide-react'
import { ROLE_META } from '@netra/config'

export default function ProfilePage() {
  const officer = useAuthStore((s) => s.officer)

  if (!officer) return null

  const roleMeta = ROLE_META[officer.role]

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-12">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <UserCircle2 className="w-6 h-6 text-brand-400" />
            My Profile
          </h1>
          <p className="text-text-secondary mt-1">Manage your officer identity and credentials.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        
        {/* Main Identity Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 md:col-span-2 bg-bg-surface border border-border-default rounded-2xl p-8 shadow-card overflow-hidden relative"
        >
          {/* Background effect */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <Shield className="w-64 h-64 text-brand-500" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-brand-600/30 to-bg-base border border-brand-500/30 flex items-center justify-center flex-shrink-0 shadow-glow-sm">
              <span className="text-5xl font-bold text-brand-300">{officer.name.charAt(0)}</span>
            </div>

            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-3xl font-black text-white tracking-tight">{officer.name}</h2>
                <p className="text-lg text-brand-400 font-medium tracking-wide mt-1">{officer.rank}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="w-5 h-5 text-text-tertiary" />
                  <div>
                    <p className="text-xs text-text-tertiary uppercase tracking-wider font-bold">Badge Number</p>
                    <p className="text-text-primary font-mono">{officer.badge_number}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-text-tertiary" />
                  <div>
                    <p className="text-xs text-text-tertiary uppercase tracking-wider font-bold">Email Address</p>
                    <p className="text-text-primary">{officer.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status / Role Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 bg-bg-surface border border-border-default rounded-2xl p-8 shadow-card flex flex-col justify-between"
        >
          <div>
            <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-6">Access Level</h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-2">Primary Role</p>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-lg border ${roleMeta?.badgeClass || 'bg-brand-500/15 text-brand-300 border-brand-500/30'} gap-2`}>
                  <Star className="w-4 h-4" />
                  <span className="font-bold text-sm tracking-wide">{roleMeta?.label || officer.role}</span>
                </div>
              </div>

              <div>
                <p className="text-xs text-text-tertiary uppercase tracking-wider font-bold mb-2">Account Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                  <span className="text-sm font-medium text-emerald-400">Active & Verified</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border-subtle">
             <button className="w-full py-2.5 bg-bg-elevated hover:bg-border-subtle border border-border-strong rounded-xl text-sm font-bold text-white transition-colors flex items-center justify-center gap-2">
               <Key className="w-4 h-4" /> Change Password
             </button>
          </div>
        </motion.div>

        {/* Jurisdiction Details */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 md:col-span-3 bg-bg-surface border border-border-default rounded-2xl p-8 shadow-card"
        >
          <h3 className="text-sm font-bold text-text-secondary uppercase tracking-widest mb-6">Jurisdiction & Posting</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-bg-base border border-border-strong">
              <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <Building2 className="w-6 h-6 text-brand-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Assigned Station</p>
                <p className="text-text-primary font-medium mt-1">{officer.station.name}</p>
                <p className="text-xs text-text-secondary mt-1">{officer.station.code}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-bg-base border border-border-strong">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <MapPin className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">District</p>
                <p className="text-text-primary font-medium mt-1">{officer.district.name}</p>
                <p className="text-xs text-text-secondary mt-1">{officer.district.code}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-xl bg-bg-base border border-border-strong">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-text-tertiary uppercase tracking-wider">Jurisdiction Scope</p>
                <p className="text-text-primary font-medium mt-1">{officer.jurisdiction_scope}</p>
                <p className="text-xs text-text-secondary mt-1">Data access boundary</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
