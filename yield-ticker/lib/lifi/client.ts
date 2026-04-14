import type {
  LiFiVaultsListResponse,
  LiFiEventsResponse,
  LiFiVaultResponse,
  LiFiComposerQuote,
} from './types'
import { handleFetchError, logError } from '@/lib/errors/handlers'
import { NetworkError } from '@/lib/errors/types'

const API_URL = process.env.NEXT_PUBLIC_LIFI_API_URL!
const API_KEY = process.env.NEXT_PUBLIC_LIFI_API_KEY!

async function fetchLiFi<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  try {
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
      await handleFetchError(res)
    }

    const data = await res.json()
    return data as T
  } catch (error) {
    logError(error, { endpoint })
    throw error
  }
}

export async function getVaults(params?: {
  chainId?: number
  token?: string
  protocol?: string
  page?: number
  limit?: number
}): Promise<LiFiVaultsListResponse> {
  

  return fetchLiFi<LiFiVaultsListResponse>('/v1/earn/vaults', params as Record<string, string | number | boolean>)
}

export async function getVaultById(id: string): Promise<LiFiVaultResponse> {
  

  return fetchLiFi<LiFiVaultResponse>(`/v1/earn/vaults/${id}`)
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