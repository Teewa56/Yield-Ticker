'use client'
import { useMemo } from 'react'
import { useTerminalStore } from '@/store/terminalStore'
import { useSettingsStore } from '@/store/settingsStore'
import { filterWhaleEvents } from '@/lib/signals/whaleFilter'

export function useWhaleEvents(limit = 50) {
  const feedEvents = useTerminalStore(s => s.feedEvents)
  const whaleThreshold = useSettingsStore(s => s.whaleThreshold)

  return useMemo(() => {
    return filterWhaleEvents(feedEvents, whaleThreshold).slice(0, limit)
  }, [feedEvents, whaleThreshold, limit])
}