import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App.tsx'
import {
  AUTH_TOKEN_KEY,
  fetchMe,
  logout,
  rehydrateToken,
} from './features/auth/authSlice.ts'
import { mockRestaurants } from './features/restaurants/mockRestaurants.ts'
import { setRestaurants } from './features/restaurants/restaurantsSlice.ts'
import type { Restaurant } from './features/restaurants/types.ts'
import { fetchRestaurantsList } from './lib/api.ts'
import { getUserLatLngOrFallback } from './lib/geolocation.ts'
import { store } from './store/store.ts'

async function loadInitialRestaurants(): Promise<Restaurant[]> {
  const { lat, lng } = await getUserLatLngOrFallback()

  try {
    const data = await fetchRestaurantsList({
      lat,
      lng,
      radiusKm: 50,
      limit: 50,
    })
    if (data.items.length > 0) {
      return data.items
    }
    console.warn(
      '[restaurants] API returned no items. Is the DB seeded? Run: cd backend && pnpm seed',
    )
  } catch (e) {
    console.warn(
      '[restaurants] Could not reach API (using mock data). Start backend and set VITE_API_URL if needed.',
      e,
    )
  }
  return mockRestaurants
}

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

async function startApp(): Promise<void> {
  const restaurants = await loadInitialRestaurants()
  store.dispatch(setRestaurants(restaurants))

  const storedToken = readStoredToken()
  if (storedToken) {
    store.dispatch(rehydrateToken(storedToken))
    void store
      .dispatch(fetchMe())
      .unwrap()
      .catch(() => {
        store.dispatch(logout())
      })
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    </StrictMode>,
  )
}

void startApp()
