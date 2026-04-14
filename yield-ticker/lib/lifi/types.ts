// Raw API response types from LI.FI Earn API

export interface LiFiVaultResponse {
  id?: string
  slug?: string
  address: string
  name: string
  protocol: {
    name: string
    url?: string
    logoURI?: string
  } | string
  chainId: number
  network?: string
  provider?: string
  syncedAt?: string
  description?: string
  analytics?: {
    apy?: {
      base: number
      total: number
      reward: number
    }
    tvl?: {
      usd: string
    }
    apy1d?: number
    apy7d?: number
    apy30d?: number
    updatedAt?: string
  }
  token?: {
    address: string
    symbol: string
    decimals: number
    logoURI?: string
  }
  tvlUsd?: number
  underlyingTokens?: Array<{
    address: string
    symbol: string
    decimals: number
    logoURI?: string
  }>
  category?: string
  audited?: boolean
  auditUrl?: string
  createdAt?: string
  protocolLogoURI?: string
}

export interface LiFiVaultsListResponse {
  data?: LiFiVaultResponse[]
  vaults?: LiFiVaultResponse[]
  total?: number
  page?: number
  pageSize?: number
}

export interface LiFiEventResponse {
  id: string
  type: 'deposit' | 'withdrawal'
  vaultId: string
  amount: string
  amountUsd: number
  txHash: string
  sender: string
  timestamp: number
  blockNumber: number
  chainId: number
}

export interface LiFiEventsResponse {
  events: LiFiEventResponse[]
  total: number
}

export interface LiFiComposerQuote {
  id: string
  fromToken: string
  toToken: string
  fromAmount: string
  toAmount: string
  vaultAddress: string
  steps: LiFiStep[]
  estimatedGas: string
  executionDuration: number
}

export interface LiFiStep {
  type: string
  action: {
    fromToken: string
    toToken: string
    fromAmount: string
    fromChainId: number
    toChainId: number
  }
  estimate: {
    fromAmount: string
    toAmount: string
    gasCosts: { amountUsd: number }[]
    executionDuration: number
  }
}