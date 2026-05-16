import type mongoose from 'mongoose';

/** Public JSON shape aligned with frontend `Restaurant` (list adds `distanceInKm`). */
export type RestaurantResponse = {
  id: string;
  name: string;
  cuisine?: string;
  rating?: number;
  distanceInKm?: number;
  imageUrl?: string;
  tagline?: string;
  deliveryMinutes?: number;
  priceLevel?: 1 | 2 | 3 | 4;
  foodItems: Array<{
    id: string;
    name: string;
    unitPrice: number;
    description?: string;
    imageUrl?: string;
    category?: string;
    avg_rating: number;
  }>;
  tags: string[];
};

type FoodItemDocLike = {
  id: string;
  name: string;
  unitPrice: number;
  description?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  avg_rating: number;
};

export type RestaurantDocLike = {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  cuisine?: string | null;
  rating?: number | null;
  imageUrl?: string | null;
  tagline?: string | null;
  deliveryMinutes?: number | null;
  priceLevel?: number | null;
  tags?: string[];
  foodItems?: FoodItemDocLike[];
};

function optionalString(value: string | null | undefined): string | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  return value;
}

function optionalNumber(value: number | null | undefined): number | undefined {
  if (value === undefined || value === null || Number.isNaN(value)) {
    return undefined;
  }
  return value;
}

function serializeFoodItems(
  items: FoodItemDocLike[] | undefined,
): RestaurantResponse['foodItems'] {
  return (items ?? []).map((it): RestaurantResponse['foodItems'][number] => {
    const row: RestaurantResponse['foodItems'][number] = {
      id: it.id,
      name: it.name,
      unitPrice: it.unitPrice,
      avg_rating: it.avg_rating,
    };
    const description = optionalString(it.description);
    if (description !== undefined) row.description = description;
    const imageUrl = optionalString(it.imageUrl);
    if (imageUrl !== undefined) row.imageUrl = imageUrl;
    const category = optionalString(it.category);
    if (category !== undefined) row.category = category;
    return row;
  });
}

export function restaurantDocToJSON(
  doc: RestaurantDocLike,
  options?: { distanceMeters?: number },
): RestaurantResponse {
  const id =
    typeof doc._id === 'string' ? doc._id : doc._id.toString();
  const price = optionalNumber(doc.priceLevel ?? undefined);
  const priced =
    price !== undefined && price >= 1 && price <= 4
      ? (price as RestaurantResponse['priceLevel'])
      : undefined;

  const cuisine = optionalString(doc.cuisine);
  const rating = optionalNumber(doc.rating ?? undefined);
  const imageUrl = optionalString(doc.imageUrl);
  const tagline = optionalString(doc.tagline);
  const deliveryMinutes = optionalNumber(doc.deliveryMinutes ?? undefined);

  const result: RestaurantResponse = {
    id,
    name: doc.name,
    ...(cuisine !== undefined ? { cuisine } : {}),
    ...(rating !== undefined ? { rating } : {}),
    ...(imageUrl !== undefined ? { imageUrl } : {}),
    ...(tagline !== undefined ? { tagline } : {}),
    ...(deliveryMinutes !== undefined ? { deliveryMinutes } : {}),
    ...(priced !== undefined ? { priceLevel: priced } : {}),
    foodItems: serializeFoodItems(doc.foodItems),
    tags: doc.tags ?? [],
  };

  if (options?.distanceMeters !== undefined) {
    result.distanceInKm = options.distanceMeters / 1000;
  }

  return result;
}
