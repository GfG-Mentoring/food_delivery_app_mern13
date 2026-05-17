import type { Restaurant } from '../features/restaurants/types.ts'

const rawBase =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.PROD ? '/_/backend' : 'http://localhost:3000')
const API_BASE = rawBase.replace(/\/$/, '')

export class ApiError extends Error {
  readonly status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export type AuthUser = {
  id: string
  email: string
  name: string
  createdAt?: string
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<T> {
  const { token, headers: initHeaders, ...rest } = options
  const headers = new Headers(initHeaders)
  const method = (rest.method ?? 'GET').toUpperCase()
  if (method !== 'GET' && method !== 'HEAD') {
    headers.set('Content-Type', 'application/json')
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  const rel = path.startsWith('/') ? path : `/${path}`
  const res = await fetch(`${API_BASE}${rel}`, { ...rest, headers })

  if (!res.ok) {
    let message = res.statusText || 'Request failed'
    try {
      const body = (await res.json()) as { error?: string }
      if (typeof body.error === 'string' && body.error.length > 0) {
        message = body.error
      }
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, message)
  }

  if (res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}

export async function register(body: {
  name: string
  email: string
  password: string
}): Promise<{ token: string; user: AuthUser }> {
  return apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function login(body: {
  email: string
  password: string
}): Promise<{ token: string; user: AuthUser }> {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function getMe(token: string): Promise<{ user: AuthUser }> {
  return apiFetch('/auth/me', { method: 'GET', token })
}

export type RestaurantsListResponse = {
  items: Restaurant[]
  page: number
  limit: number
  totalCount: number
}

/** Requires backend `GET /restaurants` with geo params (Bangalore-friendly defaults for dev). */
export async function fetchRestaurantsList(params: {
  lat: number
  lng: number
  radiusKm?: number
  page?: number
  limit?: number
}): Promise<RestaurantsListResponse> {
  const search = new URLSearchParams()
  search.set('lat', String(params.lat))
  search.set('lng', String(params.lng))
  if (params.radiusKm !== undefined) {
    search.set('radiusKm', String(params.radiusKm))
  }
  if (params.page !== undefined) {
    search.set('page', String(params.page))
  }
  if (params.limit !== undefined) {
    search.set('limit', String(params.limit))
  }
  return apiFetch<RestaurantsListResponse>(
    `/restaurants?${search.toString()}`,
  )
}

export async function fetchRestaurantById(id: string): Promise<Restaurant> {
  return apiFetch<Restaurant>(`/restaurants/${encodeURIComponent(id)}`)
}
