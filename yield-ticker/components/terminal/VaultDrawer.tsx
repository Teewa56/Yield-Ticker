'use client'
import { useTerminalStore } from '@/store/terminalStore'
import { formatUsd, formatApy } from '@/lib/utils'
import { ChainIcon } from '@/components/ui/ChainIcon'
import { ProtocolIcon } from '@/components/ui/ProtocolIcon'
import { MomentumBars } from '@/components/ui/MomentumIndicator'
import { Badge } from '@/components/ui/Badge'
import { ComposerWidget } from '@/components/composer/ComposerWidget'
import { cn } from '@/lib/utils'
import {
  LineChart, Line, ResponsiveContainer, Tooltip, YAxis,
} from 'recharts'

export function VaultDrawer() {
  const vault = useTerminalStore(s => s.selectedVault)
  const drawerOpen = useTerminalStore(s => s.drawerOpen)
  const setDrawerOpen = useTerminalStore(s => s.setDrawerOpen)

  if (!drawerOpen || !vault) return null

  const chartData = vault.apyHistory.map(s => ({
    t: s.timestamp,
    apy: Number(s.apy.toFixed(2)),
  }))

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={() => setDrawerOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Drawer */}
      <div
        className="relative w-[420px] h-full bg-terminal-surface border-l border-cyan-900/40 flex flex-col overflow-y-auto animate-slide-in-right"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-cyan-900/30 px-4 py-3">
          <div className="flex items-start gap-3">
            <ProtocolIcon protocol={vault.protocol} logoUri={vault.protocolLogoUri} size="md" />
            <div>
              <h2 className="font-mono text-sm text-cyan-300">{vault.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-[10px] text-zinc-500">{vault.protocol}</span>
                <span className="text-zinc-700">·</span>
                <ChainIcon chainId={vault.chainId} size="xs" showName />
              </div>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="font-mono text-xs text-zinc-600 hover:text-zinc-300 transition-colors p-1"
          >
            ✕
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-px bg-cyan-900/20 border-b border-cyan-900/30">
          <StatBox label="CURRENT APY" value={formatApy(vault.apy)} highlight />
          <StatBox label="TVL" value={formatUsd(vault.tvlUsd, true)} />
          <StatBox label="TOKEN" value={vault.token} />
        </div>

        {/* Momentum */}
        <div className="border-b border-cyan-900/30 px-4 py-3">
          <p className="font-mono text-[9px] tracking-widest text-zinc-600 mb-2">APY MOMENTUM</p>
          <MomentumBars momentum={vault.momentum} />
        </div>

        {/* APY Chart */}
        <div className="border-b border-cyan-900/30 px-4 py-3">
          <p className="font-mono text-[9px] tracking-widest text-zinc-600 mb-3">7-DAY APY HISTORY</p>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <YAxis domain={['auto', 'auto']} hide />
                <Tooltip
                  contentStyle={{
                    background: '#040d10',
                    border: '1px solid rgba(6,182,212,0.3)',
                    borderRadius: 4,
                    fontSize: 10,
                    fontFamily: 'monospace',
                    color: '#22d3ee',
                  }}
                  formatter={(v: number) => [`${v.toFixed(2)}%`, 'APY']}
                  labelFormatter={() => ''}
                />
                <Line
                  type="monotone"
                  dataKey="apy"
                  stroke="#22d3ee"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 3, fill: '#22d3ee' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk / Meta */}
        <div className="border-b border-cyan-900/30 px-4 py-3 flex flex-wrap gap-2">
          <Badge variant={vault.riskLevel === 'low' ? 'success' : vault.riskLevel === 'medium' ? 'warning' : 'danger'}>
            {vault.riskLevel} risk
          </Badge>
          <Badge variant={vault.audited ? 'success' : 'muted'}>
            {vault.audited ? 'audited' : 'unaudited'}
          </Badge>
          <Badge variant="muted">{vault.category}</Badge>
        </div>

        {/* Composer */}
        <div className="flex-1 px-4 py-4">
          <p className="font-mono text-[9px] tracking-widest text-zinc-600 mb-3">ONE-CLICK DEPOSIT</p>
          <ComposerWidget vault={vault} />
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5 bg-terminal-surface px-3 py-2">
      <span className="font-mono text-[9px] tracking-widest text-zinc-600">{label}</span>
      <span className={cn(
        'font-mono text-sm font-bold tabular-nums',
        highlight ? 'text-green-400' : 'text-cyan-300'
      )}>
        {value}
      </span>
    </div>
  )
}