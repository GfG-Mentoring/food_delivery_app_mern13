/** Diet label for menu filtering (plan union). */
export type FoodItemCategory = 'veg' | 'non-veg' | 'contains-egg'

export type FoodItem = {
  id: string
  name: string
  /** Price per unit in major currency (e.g. 12.99). */
  unitPrice: number
  description?: string
  imageUrl?: string
  category?: FoodItemCategory
  /** Average rating out of 5. */
  avg_rating: number
}

export type Restaurant = {
  id: string
  name: string
  cuisine?: string
  rating?: number
  /** Distance from the user in kilometres. */
  distanceInKm?: number
  imageUrl?: string
  /** Short line under the name on detail / cards. */
  tagline?: string
  /** Typical delivery ETA for display. */
  deliveryMinutes?: number
  /** 1–4 scale for "$" display. */
  priceLevel?: 1 | 2 | 3 | 4
  foodItems: FoodItem[]
  /** Broad food categories this restaurant is known for (plan: top ~5). */
  tags: string[]
}