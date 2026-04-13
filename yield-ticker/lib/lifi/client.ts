import type {
  LiFiVaultsListResponse,
  LiFiEventsResponse,
  LiFiVaultResponse,
  LiFiComposerQuote,
} from './types'
const API_URL = process.env.NEXT_PUBLIC_LIFI_API_URL || 'https://li.quest/v1'
const API_KEY = process.env.NEXT_PUBLIC_LIFI_API_KEY || ''

async function fetchLiFi<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)))
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Content-Type': 'application/json',
      ...(API_KEY && { 'x-lifi-api-key': API_KEY }),
    },
    next: { revalidate: 30 },
  })

  if (!res.ok) {
    throw new Error(`LI.FI API error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

export async function getVaults(params?: {
  chainId?: number
  token?: string
  protocol?: string
  page?: number
  pageSize?: number
}): Promise<LiFiVaultsListResponse> {
  

  return fetchLiFi<LiFiVaultsListResponse>('/earn/vaults', params as Record<string, string | number | boolean>)
}

export async function getVaultById(id: string): Promise<LiFiVaultResponse> {
  

  return fetchLiFi<LiFiVaultResponse>(`/earn/vaults/${id}`)
}

export async function getVaultEvents(params?: {
  vaultId?: string
  chainId?: number
  type?: 'deposit' | 'withdrawal'
  limit?: number
  since?: number
}): Promise<LiFiEventsResponse> {
  

  return fetchLiFi<LiFiEventsResponse>('/earn/events', params as Record<string, string | number | boolean>)
}

export async function getComposerQuote(params: {
  fromToken: string
  fromChainId: number
  toVaultId: string
  fromAmount: string
  fromAddress: string
}): Promise<LiFiComposerQuote> {
  return fetchLiFi<LiFiComposerQuote>('/earn/quote', params as Record<string, string | number | boolean>)
}