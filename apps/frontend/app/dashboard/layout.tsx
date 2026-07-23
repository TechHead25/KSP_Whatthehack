import { AppShell } from '@/components/layout/AppShell'

import { SessionTimeoutModal } from '@/components/auth/SessionTimeoutModal'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>

      <SessionTimeoutModal />
      {children}
    </AppShell>
  )
}
