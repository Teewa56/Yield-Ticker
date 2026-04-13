export interface Vault {
  id: string
  name: string
  protocol: string
  chain: Chain
  chainId: number
  token: string
  tokenAddress: string
  apy: number
  apyBase: number
  apyReward?: number
  tvl: number
  tvlUsd: number
  contractAddress: string
  logoUri?: string
  protocolLogoUri?: string
  audited: boolean
  auditUrl?: string
  launchDate?: string
  category: VaultCategory
  riskLevel: RiskLevel
  apyHistory: APYSnapshot[]
  momentum: MomentumData
}

export type VaultCategory = 'lending' | 'lp' | 'staking' | 'yield-aggregator' | 'rwa'
export type RiskLevel = 'low' | 'medium' | 'high'

export interface APYSnapshot {
  timestamp: number
  apy: number
}

export interface MomentumData {
  delta1h: number
  delta6h: number
  delta24h: number
  trend: 'up' | 'down' | 'stable'
}

export interface VaultEvent {
  id: string
  type: 'deposit' | 'withdrawal'
  vault: Vault
  amount: number
  amountUsd: number
  txHash: string
  wallet: string
  timestamp: number
  isWhale: boolean
  blockNumber: number
}

export interface WhaleAlert {
  event: VaultEvent
  alertedAt: number
}

export interface VaultFilter {
  chains: number[]
  protocols: string[]
  tokens: string[]
  minApy: number
  maxApy: number
  minTvl: number
  riskLevels: RiskLevel[]
  searchQuery: string
}

export type SortKey = 'apy' | 'tvl' | 'momentum' | 'name' | 'chain'
export type SortDirection = 'asc' | 'desc'

export interface VaultSort {
  key: SortKey
  direction: SortDirection
}
