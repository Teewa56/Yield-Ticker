// Raw API response types from LI.FI Earn API

export interface LiFiVaultResponse {
  id: string
  address: string
  name: string
  protocol: string
  chainId: number
  token: {
    address: string
    symbol: string
    decimals: number
    logoURI?: string
  }
  apy: number
  apyBase: number
  apyReward?: number
  tvl: number
  tvlUsd: number
  category?: string
  audited?: boolean
  auditUrl?: string
  createdAt?: string
  protocolLogoURI?: string
}

export interface LiFiVaultsListResponse {
  vaults: LiFiVaultResponse[]
  total: number
  page: number
  pageSize: number
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