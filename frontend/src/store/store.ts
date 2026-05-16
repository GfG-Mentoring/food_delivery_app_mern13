import { configureStore } from '@reduxjs/toolkit'

import { auth } from '../features/auth/authSlice'
import { restaurants } from '../features/restaurants/restaurantsSlice'

export const store = configureStore({
  reducer: {
    restaurants,
    auth,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
