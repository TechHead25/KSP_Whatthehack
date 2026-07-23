// ============================================================
// NETRA AI — RoleBadge Component
// Visual indicator for officer roles per config
// ============================================================

import { ROLE_META } from '@netra/config'
import type { Role } from '@netra/types'
import { cn } from '@/lib/utils/cn'
import { ShieldAlert } from 'lucide-react'

interface RoleBadgeProps {
  role: Role
  size?: 'sm' | 'default' | 'lg'
  className?: string
}

export function RoleBadge({ role, size = 'default', className }: RoleBadgeProps) {
  const meta = ROLE_META[role]
  
  if (!meta) return null

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 tracking-wider',
    default: 'text-xs px-2 py-0.5 tracking-widest',
    lg: 'text-sm px-3 py-1 tracking-widest',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold uppercase border rounded-md whitespace-nowrap',
        meta.badgeClass,
        sizeClasses[size],
        className
      )}
      title={meta.description}
    >
      {meta.mfaRequired && role === 'SUPER_ADMIN' && (
        <ShieldAlert className="w-3 h-3" strokeWidth={2.5} />
      )}
      {meta.label}
    </span>
  )
}
