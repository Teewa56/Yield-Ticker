'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Activity, Database, ShieldCheck, Settings } from 'lucide-react'

const navItems = [
  { label: 'Overview', icon: Activity },
  { label: 'Vaults', icon: Database },
  { label: 'Whale Watch', icon: ShieldCheck },
  { label: 'Settings', icon: Settings },
]

export function SideBar() {
  return (
    <aside className="flex h-full min-h-screen w-[280px] flex-col gap-6 rounded-[2rem] border border-cyan-900/40 bg-slate-950/80 p-6 shadow-[0_0_40px_-16px_rgba(14,116,144,0.35)]">
      <div className="space-y-2">
        <div className="text-sm font-semibold uppercase tracking-[0.32em] text-cyan-300">Yield Ticker</div>
        <p className="text-sm text-zinc-400">Live DeFi terminal with chain flow, whale alerts, and vault market data.</p>
      </div>

      <nav className="flex flex-col gap-3">
        {navItems.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm text-zinc-300 transition hover:bg-cyan-900/20 hover:text-cyan-100"
          >
            <Icon className="h-4 w-4 text-cyan-300" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto">
        <ConnectButton showBalance={false} chainStatus="icon" />
      </div>
    </aside>
  )
}
