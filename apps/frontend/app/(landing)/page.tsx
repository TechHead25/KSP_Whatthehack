'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Shield, BrainCircuit, Activity, Network, Zap,
  Globe2, Map, ChevronRight, PlayCircle, Database,
  ArrowRight, CheckCircle2, Server, Search, Sparkles, FileText, PieChart
} from 'lucide-react'
import LandingBackground from '@/components/landing/LandingBackground'

// --- Animated Counter Component ---
function AnimatedCounter({ value, label }: { value: number, label: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000
    const increment = value / (duration / 16)
    
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [value])

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-bg-elevated/40 backdrop-blur-md rounded-2xl border border-border-subtle hover:border-brand-500/30 transition-all duration-300 shadow-glass">
      <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300 mb-2 font-mono tracking-tight">
        {count.toLocaleString()}+
      </div>
      <div className="text-sm md:text-xs text-text-secondary uppercase tracking-[0.2em] font-bold text-center">
        {label}
      </div>
    </div>
  )
}

const FEATURES = [
  {
    title: 'AI Investigation Assistant',
    description: 'Multi-turn conversational intelligence powered by Gemini, contextualized with millions of historical FIR records.',
    icon: BrainCircuit,
    color: 'text-brand-400',
    bg: 'bg-brand-500/10',
    border: 'border-brand-500/20'
  },
  {
    title: 'Criminal Network Intelligence',
    description: 'Discover hidden associations and syndicate hierarchies using Neo4j-powered force-directed graph algorithms.',
    icon: Network,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  {
    title: 'Digital Twin',
    description: 'Comprehensive, auto-generated suspect profiles synthesizing criminal history, aliases, and behavioral patterns.',
    icon: Globe2,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20'
  },
  {
    title: 'Predictive Policing',
    description: 'Forecast crime incidents before they occur with XGBoost-driven spatial risk scoring and temporal modeling.',
    icon: Activity,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  {
    title: 'Geo Intelligence',
    description: 'Interactive high-resolution heatmaps tracking real-time incident densities and predictive hotspot polygons.',
    icon: Map,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  {
    title: 'Evidence Analysis',
    description: 'Secure, immutable repository for digital forensics, CCTV footage, and verified chain-of-custody tracking.',
    icon: Search,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20'
  },
  {
    title: 'Enterprise Reporting',
    description: 'Automated, court-ready PDF generation standardizing intelligence briefings and prosecution documents.',
    icon: FileText,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/20'
  },
  {
    title: 'Risk Analytics',
    description: 'Executive dashboards tracking city-wide KPIs, clearance rates, and unit performance metrics in real time.',
    icon: PieChart,
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  }
]

export default function LandingPage() {
  const { scrollY } = useScroll()
  const navBackground = useTransform(scrollY, [0, 100], ['rgba(5, 10, 20, 0)', 'rgba(5, 10, 20, 0.8)'])
  const navBorder = useTransform(scrollY, [0, 100], ['rgba(56, 97, 170, 0)', 'rgba(56, 97, 170, 0.2)'])
  const navBlur = useTransform(scrollY, [0, 100], ['blur(0px)', 'blur(12px)'])
  
  return (
    <div className="min-h-screen bg-bg-base overflow-hidden selection:bg-brand-500/30 font-sans text-text-primary">
      
      {/* ── Navigation ── */}
      <motion.nav 
        style={{ 
          backgroundColor: navBackground, 
          borderBottomColor: navBorder,
          backdropFilter: navBlur,
          WebkitBackdropFilter: navBlur
        }}
        className="fixed top-0 inset-x-0 z-50 border-b transition-all duration-200"
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600/30 to-bg-base border border-brand-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(37,99,235,0.2)] group-hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] transition-all duration-300">
              <Zap className="w-5 h-5 text-brand-400" />
            </div>
            <span className="font-black text-xl tracking-tight text-white">NETRA <span className="text-brand-400">AI</span></span>
          </div>
          
          <div className="hidden lg:flex items-center gap-8 text-sm font-semibold text-text-secondary tracking-wide">
            <a href="#features" className="hover:text-white transition-colors py-2">Platform Overview</a>
            <a href="#architecture" className="hover:text-white transition-colors py-2">Architecture</a>
            <a href="#technology" className="hover:text-white transition-colors py-2">Technology Stack</a>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="bg-white text-bg-base font-bold py-2.5 px-6 text-sm rounded-lg shadow-glow-sm hover:shadow-glow-md hover:bg-gray-100 transition-all flex items-center gap-2">
              Get Started <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-32">
        <LandingBackground />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold uppercase tracking-widest mb-10 shadow-glass"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Karnataka State Police • Official Deployment</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-[100px] font-black tracking-tighter text-white mb-6 leading-[0.9]"
          >
            NETRA <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-400 via-cyan-300 to-blue-600">AI</span>
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-2xl md:text-3xl font-light text-text-secondary mb-8 tracking-wide max-w-4xl"
          >
            AI Powered Crime Intelligence Platform
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="text-lg md:text-xl text-text-tertiary max-w-2xl mx-auto mb-14 font-medium leading-relaxed"
          >
            Supporting Karnataka State Police through Artificial Intelligence, Graph Intelligence, Predictive Policing and Real-Time Crime Analytics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto"
          >
            <Link href="/login" className="w-full">
              <button className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold h-14 px-8 text-lg rounded-xl shadow-glow-lg transition-all flex items-center justify-center gap-2 border border-brand-400/50">
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <button className="w-full h-14 px-8 text-lg font-bold rounded-xl border border-border-default hover:border-white text-white bg-bg-surface/30 backdrop-blur-md transition-all flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5" /> Watch Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── Animated Stats ── */}
      <section className="relative z-20 border-y border-border-subtle bg-bg-surface/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <AnimatedCounter value={125043} label="FIRs Processed" />
            <AnimatedCounter value={4250} label="Crime Predictions" />
            <AnimatedCounter value={892} label="Criminal Networks" />
            <AnimatedCounter value={3400} label="Officers Assisted" />
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-32 relative bg-bg-base">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <div className="text-brand-400 font-bold tracking-[0.2em] uppercase text-xs mb-4">Core Features</div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Platform Overview</h2>
            <p className="mt-6 text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
              A comprehensive arsenal of enterprise-grade AI tools designed to dismantle criminal networks and optimize police operations.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-bg-surface/40 backdrop-blur-md p-8 rounded-2xl border border-border-subtle hover:border-border-default hover:bg-bg-elevated/60 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${feat.bg} border ${feat.border} group-hover:scale-110 group-hover:shadow-glow-sm transition-all duration-300`}>
                  <feat.icon className={`w-6 h-6 ${feat.color}`} strokeWidth={2} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 tracking-wide">{feat.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed font-medium">{feat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Section ── */}
      <section id="architecture" className="py-32 relative overflow-hidden bg-bg-surface border-y border-border-subtle">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-900/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="text-brand-400 font-bold tracking-[0.2em] uppercase text-xs mb-4">Architecture Timeline</div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Enterprise Scale Intelligence</h2>
              <p className="text-lg text-text-secondary mb-10 leading-relaxed font-medium">
                A decoupled, event-driven microservices architecture built for scale, security, and sub-millisecond intelligence retrieval.
              </p>
              
              <div className="space-y-4">
                {[
                  { title: 'Data Ingestion Layer', desc: 'Secure APIs consuming live FIRs and patrol data.' },
                  { title: 'Intelligence Engine', desc: 'Parallel processing via Gemini LLM and XGBoost models.' },
                  { title: 'Graph Computation', desc: 'Neo4j Aura resolving complex non-obvious relationships.' },
                  { title: 'Command Center UI', desc: 'Next.js 14 App Router rendering real-time dashboards.' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 rounded-xl bg-bg-base/50 border border-border-subtle hover:border-brand-500/30 transition-all">
                    <div className="w-6 h-6 rounded-full bg-brand-500/20 flex items-center justify-center flex-shrink-0 mt-0.5 border border-brand-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white tracking-wide">{item.title}</h4>
                      <p className="text-sm text-text-secondary mt-1 font-medium">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="bg-bg-base/80 backdrop-blur-xl p-10 rounded-3xl border border-border-default shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 via-transparent to-cyan-500/5 group-hover:opacity-100 opacity-50 transition-opacity duration-500" />
                
                {/* Simulated Architecture Flow */}
                <div className="relative flex flex-col gap-6 font-mono">
                  {/* Layer 1 */}
                  <div className="p-5 bg-bg-surface border border-border-strong rounded-xl flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    <Database className="w-6 h-6 text-blue-400" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white tracking-wider">POSTGRESQL DATA STORE</div>
                      <div className="text-xs text-text-tertiary mt-1">10M+ Records Indexed</div>
                    </div>
                  </div>
                  
                  {/* Connectors */}
                  <div className="flex justify-center -my-3 relative z-10"><ArrowRight className="w-5 h-5 text-text-tertiary rotate-90" /></div>

                  {/* Layer 2 */}
                  <div className="flex gap-4">
                     <div className="flex-1 p-5 bg-bg-surface border border-brand-500/30 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                       <div className="absolute top-0 inset-x-0 h-1 bg-brand-500" />
                       <Sparkles className="w-6 h-6 text-brand-400 mb-3" />
                       <div className="text-sm font-bold text-brand-300 tracking-wider">GEMINI LLM</div>
                       <div className="text-[10px] text-text-tertiary mt-1">NLP & RAG</div>
                     </div>
                     <div className="flex-1 p-5 bg-bg-surface border border-purple-500/30 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
                       <div className="absolute top-0 inset-x-0 h-1 bg-purple-500" />
                       <Network className="w-6 h-6 text-purple-400 mb-3" />
                       <div className="text-sm font-bold text-purple-300 tracking-wider">NEO4J GRAPH</div>
                       <div className="text-[10px] text-text-tertiary mt-1">Cypher Engine</div>
                     </div>
                  </div>

                  {/* Connectors */}
                  <div className="flex justify-center -my-3 relative z-10"><ArrowRight className="w-5 h-5 text-text-tertiary rotate-90" /></div>

                  {/* Layer 3 */}
                  <div className="p-5 bg-brand-900/40 border border-brand-500/50 rounded-xl flex items-center gap-4 relative overflow-hidden shadow-glow-sm">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-400" />
                    <Server className="w-6 h-6 text-white" />
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white tracking-wider">FASTAPI GATEWAY</div>
                      <div className="text-xs text-blue-200 mt-1">Distributed & Async</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Technology Section ── */}
      <section id="technology" className="py-24 bg-bg-base border-b border-border-subtle">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-xs font-bold text-text-tertiary uppercase tracking-[0.2em] mb-12">Technology Stack</h3>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-80 hover:opacity-100 transition-opacity duration-300">
            
            {/* Google Gemini Badge */}
            <div className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="w-12 h-12 bg-bg-surface rounded-xl flex items-center justify-center border border-border-strong shadow-md">
                <Sparkles className="w-6 h-6 text-blue-400" />
              </div>
              <div className="text-left">
                <div className="font-black text-xl text-white tracking-tight leading-none">Google Gemini</div>
                <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider mt-1">AI Engine</div>
              </div>
            </div>

            {/* Neo4j Badge */}
            <div className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="w-12 h-12 bg-bg-surface rounded-xl flex items-center justify-center border border-border-strong shadow-md">
                <Network className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-left">
                <div className="font-black text-xl text-white tracking-tight leading-none">Neo4j</div>
                <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider mt-1">Graph DB</div>
              </div>
            </div>

            {/* FastAPI Badge */}
            <div className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="w-12 h-12 bg-bg-surface rounded-xl flex items-center justify-center border border-border-strong shadow-md">
                <Server className="w-6 h-6 text-teal-500" />
              </div>
              <div className="text-left">
                <div className="font-black text-xl text-white tracking-tight leading-none">FastAPI</div>
                <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider mt-1">Backend</div>
              </div>
            </div>

            {/* Next.js Badge */}
            <div className="flex items-center gap-4 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                <div className="font-black text-black text-2xl leading-none">N</div>
              </div>
              <div className="text-left">
                <div className="font-black text-xl text-white tracking-tight leading-none">Next.js</div>
                <div className="text-xs font-bold text-text-tertiary uppercase tracking-wider mt-1">Frontend</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Professional Footer ── */}
      <footer className="pt-20 pb-10 bg-bg-base border-t border-border-subtle">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-bg-surface border border-border-strong flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-xl text-white tracking-tight">NETRA <span className="text-text-secondary">AI</span></span>
              </div>
              <p className="text-text-secondary max-w-sm mb-8 leading-relaxed font-medium">
                The enterprise-grade crime intelligence platform, purpose-built for the Karnataka State Police.
              </p>
              <Link href="/login" className="bg-bg-surface hover:bg-bg-elevated border border-border-default text-white px-6 py-2.5 rounded-lg text-sm font-bold inline-flex items-center gap-2 transition-colors">
                Access Platform <ChevronRight className="w-4 h-4 text-text-tertiary" />
              </Link>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs text-text-secondary">Platform</h4>
              <ul className="space-y-4 text-sm text-text-secondary font-medium">
                <li><a href="#" className="hover:text-white transition-colors">Intelligence Assistant</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Graph Networks</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Predictive Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Digital Twin</a></li>
                <li><a href="/documentation" className="hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-xs text-text-secondary">Organization</h4>
              <ul className="space-y-4 text-sm text-text-secondary font-medium">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Overview</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Compliance</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Command</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-xs text-text-tertiary font-medium tracking-wide">
              © {new Date().getFullYear()} NETRA AI Systems. Official KSP Deployment. All rights reserved.
            </div>
            <div className="flex gap-6 text-xs text-text-tertiary font-medium">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
