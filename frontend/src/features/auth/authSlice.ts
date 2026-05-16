import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'

import {
  ApiError,
  type AuthUser,
  getMe,
  login as loginRequest,
  register as registerRequest,
} from '../../lib/api.ts'

export const AUTH_TOKEN_KEY = 'feastlane_auth_token'

export type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type AuthState = {
  token: string | null
  user: AuthUser | null
  status: AuthStatus
  error: string | null
}

export type AuthFeatureRoot = {
  auth: AuthState
}

function writeTokenToStorage(token: string | null): void {
  try {
    if (token === null) {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    } else {
      localStorage.setItem(AUTH_TOKEN_KEY, token)
    }
  } catch {
    /* ignore quota / private mode */
  }
}

const initialState: AuthState = {
  token: null,
  user: null,
  status: 'idle',
  error: null,
}

export const registerUser = createAsyncThunk<
  { token: string; user: AuthUser },
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/register', async (arg, { rejectWithValue }) => {
  try {
    return await registerRequest(arg)
  } catch (e) {
    if (e instanceof ApiError) {
      return rejectWithValue(e.message)
    }
    throw e
  }
})

export const login = createAsyncThunk<
  { token: string; user: AuthUser },
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async (arg, { rejectWithValue }) => {
  try {
    return await loginRequest(arg)
  } catch (e) {
    if (e instanceof ApiError) {
      return rejectWithValue(e.message)
    }
    throw e
  }
})

export const fetchMe = createAsyncThunk<
  { user: AuthUser },
  void,
  { state: AuthFeatureRoot; rejectValue: string }
>('auth/fetchMe', async (_arg, { getState, rejectWithValue }) => {
  const token = getState().auth.token
  if (token === null) {
    return rejectWithValue('no-token')
  }
  try {
    return await getMe(token)
  } catch (e) {
    if (e instanceof ApiError) {
      return rejectWithValue(e.message)
    }
    throw e
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    rehydrateToken(state, action: PayloadAction<string | null>) {
      state.token = action.payload
    },
    logout(state) {
      state.token = null
      state.user = null
      state.status = 'idle'
      state.error = null
      writeTokenToStorage(null)
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        writeTokenToStorage(action.payload.token)
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload ??
          action.error.message ??
          'Could not create account'
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.token = action.payload.token
        state.user = action.payload.user
        writeTokenToStorage(action.payload.token)
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload ?? action.error.message ?? 'Could not sign in'
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload.user
      })
  },
})

export const auth = authSlice.reducer
export const { rehydrateToken, logout, clearAuthError } = authSlice.actions

export const selectAuthState = (root: AuthFeatureRoot): AuthState => root.auth
export const selectAuthUser = (root: AuthFeatureRoot): AuthUser | null =>
  root.auth.user
export const selectAuthToken = (root: AuthFeatureRoot): string | null =>
  root.auth.token
export const selectAuthError = (root: AuthFeatureRoot): string | null =>
  root.auth.error
export const selectAuthRequestStatus = (root: AuthFeatureRoot): AuthStatus =>
  root.auth.status
