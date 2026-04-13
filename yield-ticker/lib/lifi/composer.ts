import type { Vault } from '@/types/vault'

export interface ComposerParams {
  vault: Vault
  fromToken: string
  fromChainId: number
  amount: string
  userAddress: string
}

export function buildComposerUrl(params: ComposerParams): string {
  const base = 'https://jumper.exchange'
  const query = new URLSearchParams({
    fromChain: String(params.fromChainId),
    fromToken: params.fromToken,
    toChain: String(params.vault.chainId),
    toToken: params.vault.tokenAddress,
    vaultAddress: params.vault.contractAddress,
    amount: params.amount,
  })
  return `${base}/earn?${query.toString()}`
}

export function formatDepositAmount(amount: string, decimals: number): bigint {
  const [whole, fraction = ''] = amount.split('.')
  const paddedFraction = fraction.padEnd(decimals, '0').slice(0, decimals)
  return BigInt(whole + paddedFraction)
}

export function estimateGas(fromChainId: number, toChainId: number): number {
  // Cross-chain: ~$3-8, same chain: ~$0.50-2
  if (fromChainId !== toChainId) return 5
  if ([1].includes(fromChainId)) return 2
  return 0.5
}