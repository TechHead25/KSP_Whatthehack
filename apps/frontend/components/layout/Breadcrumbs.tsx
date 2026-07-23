'use client'
// ============================================================
// NETRA AI — Breadcrumbs
// Auto-generated from pathname + ROUTE_TITLES config
// ============================================================

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'
import { ROUTE_TITLES } from '@netra/config'
import type { BreadcrumbSegment } from '@netra/types'
import { cn } from '@/lib/utils/cn'

function buildBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  const segments: BreadcrumbSegment[] = [{ label: 'Home', href: '/' }]

  if (pathname === '/') return segments

  const parts = pathname.split('/').filter(Boolean)
  let currentPath = ''

  for (const part of parts) {
    currentPath += `/${part}`
    const title = ROUTE_TITLES[currentPath]
    segments.push({
      label: title ?? part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
      href: currentPath,
    })
  }

  return segments
}

interface BreadcrumbsProps {
  overrides?: BreadcrumbSegment[]
  className?: string
}

export function Breadcrumbs({ overrides, className }: BreadcrumbsProps) {
  const pathname = usePathname()
  const crumbs = overrides ?? buildBreadcrumbs(pathname)

  if (crumbs.length <= 1) return null

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1 text-body-sm', className)}
    >
      <ol className="flex items-center gap-1">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1

          return (
            <li key={crumb.href ?? index} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight
                  className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0"
                  aria-hidden
                />
              )}

              {isLast ? (
                <span
                  className="text-text-primary font-medium"
                  aria-current="page"
                >
                  {index === 0 && (
                    <Home className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-text-tertiary" />
                  )}
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href ?? '#'}
                  className="text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {index === 0 && (
                    <Home className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                  )}
                  {index > 0 && crumb.label}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
