import type { PayloadAction } from '@reduxjs/toolkit'
import {
  createEntityAdapter,
  createSlice,
  type EntityState,
} from '@reduxjs/toolkit'
import type { FoodItem, Restaurant } from './types'

export type RestaurantsStatus = 'idle' | 'loading' | 'succeeded' | 'failed'

export type RestaurantsSliceState = EntityState<Restaurant, string> & {
  status: RestaurantsStatus
  error: string | null
}

/** Narrow root shape selectors accept (avoids importing the store module). */
export type RestaurantsFeatureRoot = {
  restaurants: RestaurantsSliceState
}

const restaurantsAdapter = createEntityAdapter<Restaurant>()

const initialState: RestaurantsSliceState = restaurantsAdapter.getInitialState({
  status: 'idle',
  error: null,
})

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState,
  reducers: {
    upsertOne: restaurantsAdapter.upsertOne,
    removeOne: restaurantsAdapter.removeOne,
    setRestaurants(state, action: PayloadAction<Restaurant[]>) {
      restaurantsAdapter.setAll(state, action.payload)
    },
  },
})

export const selectRestaurantsState = (
  root: RestaurantsFeatureRoot,
): RestaurantsSliceState => root.restaurants

const selectors = restaurantsAdapter.getSelectors(selectRestaurantsState)

export const {
  selectIds: selectRestaurantIds,
  selectEntities: selectRestaurantEntities,
  selectAll: selectAllRestaurants,
  selectTotal: selectRestaurantTotal,
  selectById: selectRestaurantById,
} = selectors

export const selectFoodItemsByRestaurantId = (
  root: RestaurantsFeatureRoot,
  restaurantId: string,
): FoodItem[] => {
  const entity = selectors.selectById(root, restaurantId)
  return entity?.foodItems ?? []
}

export const restaurants = restaurantsSlice.reducer

export const { upsertOne, removeOne, setRestaurants } = restaurantsSlice.actions
