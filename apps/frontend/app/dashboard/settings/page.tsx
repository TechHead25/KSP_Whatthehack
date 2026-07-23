'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Settings2, ShieldCheck, Bell, Monitor, KeyRound, Smartphone, Mail, Eye } from 'lucide-react'

export default function SettingsPage() {
  const [mfaEnabled, setMfaEnabled] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)
  const [darkMode, setDarkMode] = useState(true)

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-brand-400" />
            System Settings
          </h1>
          <p className="text-text-secondary mt-1">Manage your security preferences and application settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        
        {/* Security Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-1 lg:col-span-2 space-y-6"
        >
          {/* MFA Section */}
          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
                <ShieldCheck className="w-5 h-5 text-brand-400" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">Two-Factor Authentication</h2>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl bg-bg-base border border-border-strong mb-4 gap-4">
              <div className="flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-text-tertiary mt-0.5" />
                <div>
                  <p className="font-bold text-text-primary">Authenticator App</p>
                  <p className="text-sm text-text-secondary">Use an app like Google Authenticator or Authy to generate verification codes.</p>
                </div>
              </div>
              <button 
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 focus:ring-offset-bg-base ${mfaEnabled ? 'bg-brand-500' : 'bg-bg-elevated'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${mfaEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

          {/* Password Section */}
          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <KeyRound className="w-5 h-5 text-cyan-400" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">Password Management</h2>
            </div>
            
            <form className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Current Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 bg-bg-base border border-border-strong rounded-xl px-4 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 bg-bg-base border border-border-strong rounded-xl px-4 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Confirm New Password</label>
                <input type="password" placeholder="••••••••" className="w-full h-10 bg-bg-base border border-border-strong rounded-xl px-4 text-white focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all" />
              </div>
              <button type="button" className="h-10 px-6 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-glow-sm transition-all mt-2">
                Update Password
              </button>
            </form>
          </div>
        </motion.div>

        {/* Preferences / Right Column */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 space-y-6"
        >
          {/* Notifications */}
          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Bell className="w-5 h-5 text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm font-medium text-text-primary">Email Alerts</span>
                </div>
                <button 
                  onClick={() => setEmailAlerts(!emailAlerts)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 focus:ring-offset-bg-base ${emailAlerts ? 'bg-emerald-500' : 'bg-bg-elevated'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${emailAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm font-medium text-text-primary">SMS Alerts</span>
                </div>
                <button 
                  onClick={() => setSmsAlerts(!smsAlerts)}
                  className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 focus:ring-offset-bg-base ${smsAlerts ? 'bg-emerald-500' : 'bg-bg-elevated'}`}
                >
                  <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${smsAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-bg-surface border border-border-default rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Monitor className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">Appearance</h2>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-text-tertiary" />
                <span className="text-sm font-medium text-text-primary">Dark Mode</span>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:ring-offset-2 focus:ring-offset-bg-base ${darkMode ? 'bg-purple-500' : 'bg-bg-elevated'}`}
              >
                <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
