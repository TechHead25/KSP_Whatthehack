'use client'
import { useState, useEffect } from 'react'
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride'
import { useAuthStore } from '@/lib/stores/authStore'

export function DemoTour() {
  const [run, setRun] = useState(false)
  const officer = useAuthStore((s) => s.officer)

  // Start the tour automatically if the user is a Demo user
  useEffect(() => {
    if (officer?.badge_number?.includes('DEMO') || officer?.badge_number?.includes('-KA-') || officer?.badge_number?.includes('-BLR-')) {
      const hasSeenTour = localStorage.getItem('netra_tour_seen')
      if (!hasSeenTour) {
        setRun(true)
      }
    }
    
    // Add custom event listener to trigger tour manually
    const handleTriggerTour = () => setRun(true)
    window.addEventListener('trigger-demo-tour', handleTriggerTour)
    return () => window.removeEventListener('trigger-demo-tour', handleTriggerTour)
  }, [officer])

  const steps: Step[] = [
    {
      target: '#tour-command-palette',
      content: 'This is the Global Command Palette. Press Ctrl+K to search across FIRs, suspects, evidence, and vehicles instantly.',
      disableBeacon: true,
    },
    {
      target: '#tour-kpi-metrics',
      content: 'Real-time Key Performance Indicators. These aggregate live metrics across your jurisdiction.',
    },
    {
      target: '#tour-alerts-feed',
      content: 'The Early Warning System Alerts Feed. Real-time notifications for crime spikes and high-risk anomalies.',
    },
    {
      target: '#tour-recent-activity',
      content: 'Timeline of recent investigations and officer activities.',
    },
    {
      target: '#tour-crime-analytics',
      content: 'Multi-dimensional Crime Analytics charting crime distributions across the state.',
    },
    {
      target: '#tour-threat-matrix',
      content: 'The Threat Matrix uses AI to assess geographic risk scores and predict hotspot escalations.',
    },
    {
      target: '#tour-ai-insights',
      content: 'Automated AI Insights Panel. The system actively deduces patterns, connects profiles, and generates actionable intelligence.',
    },
  ]

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false)
      localStorage.setItem('netra_tour_seen', 'true')
    }
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      scrollToFirstStep
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: '#0ea5e9',
          backgroundColor: '#1e293b',
          textColor: '#f8fafc',
          arrowColor: '#1e293b',
        },
        tooltipContainer: {
          textAlign: 'left',
          fontSize: '14px',
          padding: '16px',
        },
        buttonNext: {
          backgroundColor: '#0ea5e9',
          borderRadius: '4px',
        },
        buttonBack: {
          color: '#94a3b8',
        },
        buttonSkip: {
          color: '#94a3b8',
        }
      }}
    />
  )
}
