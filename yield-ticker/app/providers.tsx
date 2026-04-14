'use client'

import { WagmiProvider } from 'wagmi'
import { mainnet, arbitrum, base, optimism } from 'wagmi/chains'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ErrorBoundary } from '@/components/errors/ErrorBoundary'
import { ErrorNotification } from '@/components/errors/ErrorNotification'
import { classifyError } from '@/lib/errors/types'

const config = getDefaultConfig({
  appName: 'Yield Ticker',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'dummy-project-id',
  chains: [mainnet, arbitrum, base, optimism],
  ssr: true,
})

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
    mutations: {
      retry: 1,
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            {children}
            <ErrorNotification />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ErrorBoundary>
  )
}