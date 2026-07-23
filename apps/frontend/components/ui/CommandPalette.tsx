'use client'
// ============================================================
// NETRA AI — CommandPalette Component
// Global search and navigation via cmdk
// ============================================================

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Command } from 'cmdk'
import { Search, BrainCircuit, FileText, Users, Map } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const runCommand = (command: () => void) => {
    onOpenChange(false)
    command()
  }

  // Prevent background scrolling when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity" />
        <Dialog.Content className="fixed left-[50%] top-[20%] z-50 w-full max-w-2xl translate-x-[-50%] p-4 focus:outline-none">
          <Command
            className="w-full overflow-hidden rounded-xl bg-bg-elevated/95 backdrop-blur-md border border-border-default shadow-2xl flex flex-col"
            shouldFilter={true}
          >
            {/* Search Input */}
            <div className="flex items-center border-b border-border-subtle px-4">
              <Search className="w-5 h-5 text-text-tertiary mr-3" strokeWidth={1.5} />
              <Command.Input
                placeholder="Search cases, suspects, or ask AI..."
                className="flex h-14 w-full bg-transparent outline-none placeholder:text-text-tertiary text-text-primary text-body-lg"
                value={query}
                onValueChange={setQuery}
              />
            </div>

            {/* Results List */}
            <Command.List className="max-h-[300px] overflow-y-auto p-2 scroll-smooth">
              <Command.Empty className="py-6 text-center text-body-sm text-text-tertiary">
                No results found.
              </Command.Empty>

              <Command.Group heading="Intelligence Tools" className="text-body-xs font-semibold text-text-tertiary px-2 py-1.5 uppercase tracking-wider">
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/dashboard/predictions'))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm text-text-secondary aria-selected:bg-brand-500/10 aria-selected:text-brand-400 cursor-pointer"
                >
                  <BrainCircuit className="w-4 h-4" /> Ask Prediction Engine
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/dashboard/heatmap'))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm text-text-secondary aria-selected:bg-brand-500/10 aria-selected:text-brand-400 cursor-pointer"
                >
                  <Map className="w-4 h-4" /> View Crime Heatmap
                </Command.Item>
              </Command.Group>

              <Command.Separator className="h-px bg-border-subtle my-1" />

              <Command.Group heading="Quick Navigation" className="text-body-xs font-semibold text-text-tertiary px-2 py-1.5 uppercase tracking-wider">
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/dashboard/fir'))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm text-text-secondary aria-selected:bg-bg-overlay aria-selected:text-text-primary cursor-pointer"
                >
                  <FileText className="w-4 h-4" /> Search FIRs
                </Command.Item>
                <Command.Item
                  onSelect={() => runCommand(() => router.push('/dashboard/digital-twin'))}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-body-sm text-text-secondary aria-selected:bg-bg-overlay aria-selected:text-text-primary cursor-pointer"
                >
                  <Users className="w-4 h-4" /> Search Suspects
                </Command.Item>
              </Command.Group>
            </Command.List>
            
            {/* Footer */}
            <div className="flex items-center justify-between px-4 py-2 border-t border-border-subtle bg-bg-surface/50 text-[10px] text-text-tertiary uppercase tracking-wider">
              <span>Use <kbd className="font-mono bg-bg-overlay px-1.5 py-0.5 rounded border border-border-default">↑</kbd> <kbd className="font-mono bg-bg-overlay px-1.5 py-0.5 rounded border border-border-default">↓</kbd> to navigate</span>
              <span><kbd className="font-mono bg-bg-overlay px-1.5 py-0.5 rounded border border-border-default">Enter</kbd> to select</span>
            </div>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
