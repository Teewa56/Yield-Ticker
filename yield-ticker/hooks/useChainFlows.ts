'use client'
import { useMemo } from 'react'
import { useTerminalStore } from '@/store/terminalStore'
import { aggregateChainFlows } from '@/lib/signals/chainAggregator'

export function useChainFlows(windowHours = 24) {
  const feedEvents = useTerminalStore(s => s.feedEvents)

  return useMemo(() => {
    return aggregateChainFlows(feedEvents, windowHours * 3600 * 1000)
  }, [feedEvents, windowHours])
}