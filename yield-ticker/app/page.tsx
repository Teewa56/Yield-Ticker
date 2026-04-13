'use client'

import { APYTable } from '@/components/terminal/APYTable'
import { LiveFeed } from '@/components/terminal/LiveFeed'
import { TopBar } from '@/components/terminal/TopBar'
import { WhalePanel } from '@/components/terminal/WhalePanel'
import { RotationMap } from '@/components/terminal/RotationMap'
import { VaultDrawer } from '@/components/terminal/VaultDrawer'
import { useLiveFeed } from '@/hooks/useLiveFeed'
import { useVaults } from '@/hooks/useVaults'

export default function Home() {
  useLiveFeed()
  useVaults()

  return (
    <main className="relative min-h-screen bg-[#020608] text-white">
      <div className="mx-auto flex min-h-screen max-w-[1680px] flex-col">
        <TopBar />

        <div className="flex-1 overflow-hidden p-4">
          <div className="grid h-full gap-4 lg:grid-cols-[25%_50%_25%]">
            <section className="flex min-h-[calc(100vh-84px)] flex-col overflow-hidden rounded-[2rem] border border-cyan-900/30 bg-slate-950/80 shadow-[0_0_60px_-24px_rgba(14,116,144,0.45)]">
              <LiveFeed />
            </section>

            <section className="flex min-h-[calc(100vh-84px)] flex-col overflow-hidden rounded-[2rem] border border-cyan-900/30 bg-slate-950/80 shadow-[0_0_60px_-24px_rgba(14,116,144,0.45)]">
              <APYTable />
            </section>

            <section className="grid min-h-[calc(100vh-84px)] grid-rows-[1fr_1fr] gap-4">
              <div className="overflow-hidden rounded-[2rem] border border-cyan-900/30 bg-slate-950/80 shadow-[0_0_60px_-24px_rgba(14,116,144,0.45)]">
                <WhalePanel />
              </div>
              <div className="overflow-hidden rounded-[2rem] border border-cyan-900/30 bg-slate-950/80 shadow-[0_0_60px_-24px_rgba(14,116,144,0.45)]">
                <RotationMap />
              </div>
            </section>
          </div>
        </div>
      </div>

      <VaultDrawer />
    </main>
  )
}
