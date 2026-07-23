'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface TooltipProps {
  content: string | React.ReactNode
  children: React.ReactElement
  disabled?: boolean
}

export function Tooltip({ content, children, disabled = false }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  if (disabled) return children

  return (
    <div 
      className="relative flex items-center justify-center group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full mb-2 px-3 py-1.5 bg-bg-elevated border border-border-strong text-text-primary text-xs font-medium rounded-lg whitespace-nowrap shadow-xl z-50 animate-in fade-in zoom-in-95 duration-200">
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-border-strong"></div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-4 border-transparent border-t-bg-elevated"></div>
        </div>
      )}
    </div>
  )
}
