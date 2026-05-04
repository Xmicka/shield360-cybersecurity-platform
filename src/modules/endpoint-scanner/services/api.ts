import type { EndpointListItem, EndpointResults, EndpointDetail, ApplicationCves } from '../types'

const rawBase = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000'
const baseUrl = String(rawBase).replace(/\/+$/, '')

/** True if the configured base looks like localhost (i.e. nothing wired up). */
export const isLocalBackend = /^https?:\/\/(localhost|127\.0\.0\.1)/i.test(baseUrl)

/**
 * One fetch attempt with an abortable timeout. Distinguishes between:
 *   - network failure (CORS / DNS / connection refused / timeout) → throws "network"
 *   - HTTP error (4xx/5xx) → throws "http" with status + body
 *   - bad JSON → throws "parse"
 */
async function fetchOnce<T>(path: string, init: RequestInit, timeoutMs: number): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  let res: Response
  try {
    res = await fetch(`${baseUrl}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(init.headers || {}),
      },
    })
  } catch (e: any) {
    clearTimeout(timer)
    // AbortError, TypeError ("Failed to fetch" — usually CORS or DNS), NetworkError
    const reason = e?.name === 'AbortError' ? 'timeout' : 'network'
    const friendly =
      reason === 'timeout'
        ? `The endpoint backend at ${baseUrl} did not respond within ${Math.round(timeoutMs / 1000)}s. If it is on Render's free tier it may still be cold-starting — try again in 30s.`
        : `Could not reach the endpoint backend at ${baseUrl}. This is usually one of: (a) the backend is sleeping or down, (b) the URL is wrong, or (c) CORS is not allowing this origin.`
    const err = new Error(friendly)
    ;(err as any).reason = reason
    throw err
  }
  clearTimeout(timer)

  if (!res.ok) {
    let bodyText = ''
    try {
      bodyText = await res.text()
    } catch { /* ignore */ }
    let detail: string = bodyText
    try {
      const parsed = JSON.parse(bodyText)
      if (parsed && typeof parsed === 'object') {
        detail = parsed.detail?.message || parsed.detail || parsed.message || bodyText
        if (typeof detail !== 'string') detail = JSON.stringify(detail)
      }
    } catch { /* not JSON, keep text */ }
    const err = new Error(`Backend returned HTTP ${res.status}: ${detail || res.statusText || 'unknown error'}`)
    ;(err as any).reason = 'http'
    ;(err as any).status = res.status
    throw err
  }

  try {
    return (await res.json()) as T
  } catch (e: any) {
    const err = new Error(`Backend response was not valid JSON: ${e?.message || 'parse error'}`)
    ;(err as any).reason = 'parse'
    throw err
  }
}

/**
 * Wrapper with cold-start retry. First attempt: 12s. If that fails with a
 * network/timeout error, wake-up retry: 45s. HTTP errors are surfaced
 * immediately (no retry — the backend is up but the request itself failed).
 */
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    return await fetchOnce<T>(path, init || {}, 12000)
  } catch (e: any) {
    if (e?.reason === 'http' || e?.reason === 'parse') throw e
    // network/timeout → assume Render cold start, retry once with longer wait
    return await fetchOnce<T>(path, init || {}, 45000)
  }
}

export const api = {
  listEndpoints: (limit = 200) => request<EndpointListItem[]>(`/endpoints?limit=${limit}`),
  getEndpoint: (endpointId: string) => request<EndpointDetail>(`/endpoints/${encodeURIComponent(endpointId)}`),
  getResults: (endpointId: string) => request<EndpointResults>(`/endpoints/${encodeURIComponent(endpointId)}/results`),
  startScan: (endpointId: string) => request<{ endpoint_id: string; scan_status: string }>(`/endpoints/${encodeURIComponent(endpointId)}/scan`, { method: 'POST' }),
  cancelScan: (endpointId: string) => request<{ endpoint_id: string; cancelled: boolean; message: string }>(`/endpoints/${encodeURIComponent(endpointId)}/cancel`, { method: 'POST' }),
  getApplicationCves: (endpointId: string, productName: string) =>
    request<ApplicationCves>(`/endpoints/${encodeURIComponent(endpointId)}/cves/${encodeURIComponent(productName)}`),
}

export const apiBaseUrl = baseUrl
