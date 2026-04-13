'use client'

import { X } from 'lucide-react'
import { useSettingsStore } from '@/store/settingsStore'

interface SettingsModalProps {
  open: boolean
  onClose: () => void
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const whaleThreshold = useSettingsStore(s => s.whaleThreshold)
  const pollInterval = useSettingsStore(s => s.pollInterval)
  const soundAlerts = useSettingsStore(s => s.soundAlerts)
  const compactMode = useSettingsStore(s => s.compactMode)
  const showWhaleOnly = useSettingsStore(s => s.showWhaleOnly)
  const setWhaleThreshold = useSettingsStore(s => s.setWhaleThreshold)
  const setPollInterval = useSettingsStore(s => s.setPollInterval)
  const setSoundAlerts = useSettingsStore(s => s.setSoundAlerts)
  const setCompactMode = useSettingsStore(s => s.setCompactMode)
  const setShowWhaleOnly = useSettingsStore(s => s.setShowWhaleOnly)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-2xl rounded-[2rem] border border-cyan-900/40 bg-slate-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-cyan-900/30 pb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Terminal settings</h2>
            <p className="text-sm text-zinc-500">Customize polling, whale thresholds, and display preferences.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-zinc-700/50 p-2 text-zinc-400 transition hover:border-cyan-500/60 hover:text-cyan-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-zinc-300">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">Whale threshold</span>
            <input
              type="number"
              value={whaleThreshold}
              onChange={(event) => setWhaleThreshold(Number(event.target.value))}
              className="w-full rounded-2xl border border-zinc-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
            />
          </label>

          <label className="space-y-2 text-sm text-zinc-300">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-zinc-500">Poll interval (ms)</span>
            <input
              type="number"
              value={pollInterval}
              onChange={(event) => setPollInterval(Number(event.target.value))}
              className="w-full rounded-2xl border border-zinc-800 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-500"
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-slate-900 px-4 py-3 text-sm text-zinc-300">
            <span>Sound alerts</span>
            <input
              type="checkbox"
              checked={soundAlerts}
              onChange={(event) => setSoundAlerts(event.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-slate-900 px-4 py-3 text-sm text-zinc-300">
            <span>Compact mode</span>
            <input
              type="checkbox"
              checked={compactMode}
              onChange={(event) => setCompactMode(event.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between gap-3 rounded-2xl border border-zinc-800 bg-slate-900 px-4 py-3 text-sm text-zinc-300">
            <span>Show whales only</span>
            <input
              type="checkbox"
              checked={showWhaleOnly}
              onChange={(event) => setShowWhaleOnly(event.target.checked)}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
