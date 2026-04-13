'use client'
import { useTerminalStore } from '@/store/terminalStore'
import { formatUsd } from '@/lib/utils'

export function TopBar() {
  const totalTvl = useTerminalStore(s => s.totalTvl)
  const activeChains = useTerminalStore(s => s.activeChains)
  const eventCount = useTerminalStore(s => s.eventCount)
  const vaults = useTerminalStore(s => s.vaults)

  const now = new Date()
  const time = now.toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/New_York' })
  const date = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className="flex h-9 items-center justify-between border-b border-cyan-900/40 bg-terminal-surface/80 px-4 backdrop-blur-sm">
      {/* Left: Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-green-400" />
          <span className="font-mono text-xs font-bold tracking-widest text-cyan-400">YIELD TICKER</span>
        </div>
        <span className="text-zinc-700">│</span>
        <span className="font-mono text-[10px] text-zinc-500 tracking-wider">LIVE DeFi INTELLIGENCE TERMINAL</span>
      </div>

      {/* Center: Stats */}
      <div className="flex items-center gap-5">
        <Stat label="TVL TRACKED" value={formatUsd(totalTvl, true)} />
        <span className="text-zinc-800">│</span>
        <Stat label="VAULTS" value={String(vaults.length)} />
        <span className="text-zinc-800">│</span>
        <Stat label="CHAINS" value={String(activeChains)} />
        <span className="text-zinc-800">│</span>
        <Stat label="EVENTS" value={String(eventCount)} pulse />
      </div>

      {/* Right: Time */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[10px] text-zinc-500">{date}</span>
        <span className="font-mono text-xs text-cyan-500">{time} ET</span>
      </div>
    </div>
  )
}

function Stat({ label, value, pulse }: { label: string; value: string; pulse?: boolean }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className="font-mono text-[9px] tracking-widest text-zinc-600">{label}</span>
      <span className={`font-mono text-xs tabular-nums ${pulse ? 'text-green-400' : 'text-cyan-300'}`}>
        {value}
      </span>
    </div>
  )
}