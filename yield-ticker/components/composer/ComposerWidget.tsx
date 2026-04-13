'use client'
import { useState } from 'react'
import type { Vault } from '@/types/vault'
import { buildComposerUrl } from '@/lib/lifi/composer'
import { formatApy, formatUsd } from '@/lib/utils'

interface ComposerWidgetProps {
  vault: Vault
}

const COMMON_TOKENS = ['USDC', 'USDT', 'DAI', 'ETH', 'WBTC']

export function ComposerWidget({ vault }: ComposerWidgetProps) {
  const [amount, setAmount] = useState('')
  const [fromToken, setFromToken] = useState('USDC')

  const projectedYield = amount
    ? (Number(amount) * (vault.apy / 100)) / 12
    : null

  const handleDeposit = () => {
    const url = buildComposerUrl({
      vault,
      fromToken,
      fromChainId: 1, // default eth mainnet
      amount: amount || '0',
      userAddress: '',
    })
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Token selector */}
      <div>
        <label className="font-mono text-[9px] tracking-widest text-zinc-600 mb-1.5 block">
          FROM TOKEN
        </label>
        <div className="flex gap-1.5 flex-wrap">
          {COMMON_TOKENS.map(token => (
            <button
              key={token}
              onClick={() => setFromToken(token)}
              className={`px-2 py-1 rounded border font-mono text-[10px] transition-colors ${
                fromToken === token
                  ? 'bg-cyan-900/60 border-cyan-600/60 text-cyan-300'
                  : 'bg-terminal-bg border-zinc-800 text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
              }`}
            >
              {token}
            </button>
          ))}
        </div>
      </div>

      {/* Amount input */}
      <div>
        <label className="font-mono text-[9px] tracking-widest text-zinc-600 mb-1.5 block">
          AMOUNT
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-500">$</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-terminal-bg border border-zinc-800 rounded pl-6 pr-3 py-2 font-mono text-sm text-cyan-300 placeholder-zinc-700 focus:outline-none focus:border-cyan-700 transition-colors"
          />
        </div>
      </div>

      {/* Projected yield */}
      {projectedYield !== null && projectedYield > 0 && (
        <div className="rounded border border-green-900/40 bg-green-900/10 px-3 py-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] text-zinc-500">EST. MONTHLY YIELD</span>
            <span className="font-mono text-xs text-green-400 font-bold">
              +{formatUsd(projectedYield, true)}
            </span>
          </div>
          <div className="flex items-center justify-between mt-0.5">
            <span className="font-mono text-[9px] text-zinc-600">APY</span>
            <span className="font-mono text-[10px] text-zinc-400">{formatApy(vault.apy)}</span>
          </div>
        </div>
      )}

      {/* Vault destination info */}
      <div className="rounded border border-zinc-800/60 bg-terminal-bg/60 px-3 py-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-zinc-600">DEPOSITING TO</span>
          <span className="font-mono text-[10px] text-zinc-400 truncate max-w-[180px]">{vault.name}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <span className="font-mono text-[9px] text-zinc-600">POWERED BY</span>
          <span className="font-mono text-[10px] text-cyan-500">LI.FI Composer</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={handleDeposit}
        disabled={!amount || Number(amount) <= 0}
        className="w-full rounded border border-cyan-700/60 bg-cyan-900/30 px-4 py-2.5 font-mono text-xs font-bold tracking-widest text-cyan-300 transition-all hover:bg-cyan-900/60 hover:border-cyan-500/80 hover:text-cyan-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]"
      >
        DEPOSIT VIA LI.FI →
      </button>

      <p className="font-mono text-[9px] text-zinc-700 text-center">
        Single-transaction swap + deposit. No manual bridging.
      </p>
    </div>
  )
}