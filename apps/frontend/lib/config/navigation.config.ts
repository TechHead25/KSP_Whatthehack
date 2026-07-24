import type { NavGroup } from '@/lib/types'

export const NAV_CONFIG: NavGroup[] = [
  {
    id: 'intelligence',
    label: 'INTELLIGENCE',
    items: [
      {
        id: 'dashboard',
        label: 'Dashboard',
        href: '/dashboard',
        icon: 'LayoutDashboard',
        allowedRoles: [],
      },
      {
        id: 'predictions',
        label: 'Prediction Engine',
        href: '/dashboard/predictions',
        icon: 'BrainCircuit',
        isNew: true,
        requiredPermissions: ['USE_AI_ASSISTANT'],
      },
      {
        id: 'early-warning',
        label: 'Early Warning',
        href: '/dashboard/alerts',
        icon: 'AlertTriangle',
        requiredPermissions: ['MANAGE_ALERTS'],
      },
    ],
  },
  {
    id: 'investigation',
    label: 'INVESTIGATION',
    items: [
      {
        id: 'fir-search',
        label: 'FIR Search',
        href: '/dashboard/fir',
        icon: 'FileText',
        requiredPermissions: ['READ_STATION_FIRS'],
      },
      {
        id: 'digital-twin',
        label: 'Digital Twin',
        href: '/dashboard/digital-twin',
        icon: 'Users',
        requiredPermissions: ['READ_STATION_SUSPECTS'],
      },
      {
        id: 'evidence',
        label: 'Evidence Explorer',
        href: '/dashboard/evidence',
        icon: 'Search',
        requiredPermissions: ['VIEW_EVIDENCE'],
      },
      {
        id: 'timeline',
        label: 'Case Timeline',
        href: '/dashboard/timeline',
        icon: 'GitCommitHorizontal',
        requiredPermissions: ['READ_STATION_FIRS'],
      },
    ],
  },
  {
    id: 'analysis',
    label: 'ANALYSIS',
    items: [
      {
        id: 'criminal-network',
        label: 'Criminal Network',
        href: '/dashboard/criminal-network',
        icon: 'GitBranch',
        requiredPermissions: ['VIEW_CRIMINAL_NETWORK'],
      },
      {
        id: 'heatmap',
        label: 'Crime Heatmap',
        href: '/dashboard/heatmap',
        icon: 'Map',
        requiredPermissions: ['VIEW_HEATMAP'],
      },
      {
        id: 'risk-analytics',
        label: 'Risk Analytics',
        href: '/dashboard/analytics',
        icon: 'BarChart3',
        requiredPermissions: ['VIEW_ANALYTICS'],
      },
    ],
  },
  {
    id: 'operations',
    label: 'OPERATIONS',
    items: [
      {
        id: 'patrol',
        label: 'Patrol Recommendations',
        href: '/dashboard/patrol',
        icon: 'Navigation',
        requiredPermissions: ['MANAGE_PATROL'],
      },
      {
        id: 'reports',
        label: 'Court Reports',
        href: '/dashboard/reports',
        icon: 'ClipboardList',
        requiredPermissions: ['GENERATE_REPORTS'],
      },
    ],
  },
  {
    id: 'administration',
    label: 'ADMINISTRATION',
    items: [
      {
        id: 'admin',
        label: 'Officers',
        href: '/dashboard/admin',
        icon: 'Settings2',
        requiredPermissions: ['MANAGE_OFFICERS'],
        allowedRoles: ['SUPER_ADMIN'],
      },
      {
        id: 'audit',
        label: 'Audit Logs',
        href: '/dashboard/audit',
        icon: 'Shield',
        requiredPermissions: ['VIEW_AUDIT_LOGS'],
        allowedRoles: ['SUPER_ADMIN', 'COMMISSIONER', 'DYSP'],
      },
    ],
  },
]

export const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/predictions': 'Prediction Engine',
  '/dashboard/alerts': 'Early Warning System',
  '/dashboard/fir': 'FIR Search',
  '/dashboard/digital-twin': 'Digital Twin Profiles',
  '/dashboard/evidence': 'Evidence Explorer',
  '/dashboard/timeline': 'Case Timeline',
  '/dashboard/criminal-network': 'Criminal Network',
  '/dashboard/heatmap': 'Crime Heatmap',
  '/dashboard/analytics': 'Risk Analytics',
  '/dashboard/patrol': 'Patrol Recommendations',
  '/dashboard/reports': 'Court Reports',
  '/dashboard/admin': 'Administration',
  '/dashboard/audit': 'Audit Logs',
  '/dashboard/settings': 'Settings',
  '/dashboard/profile': 'My Profile',
  '/dashboard/notifications': 'Notifications',
  '/dashboard/help': 'Help & Support',
  '/forbidden': 'Access Denied',
}
